import { eq, and, or, sql } from 'drizzle-orm';
import type { Table } from 'drizzle-orm';

interface Pagination {
  page: number;
  perPage: number;
}

interface FindAllOptions<T> {
  select?: (keyof T)[];
  where?: (table: Table) => unknown;
  orderBy?: (table: Table) => unknown;
  pagination?: Pagination;
  softDelete?: {
    deletedAtColumn?: keyof T;
    includeTrashed?: boolean;
  };
  relations?: Record<string, RelationOptions<any>>;
  alias?: string;
}

interface RelationOptions<T> extends FindAllOptions<T> {
  table: Table;
  on: unknown;
  joinType?: 'inner' | 'left' | 'right';
  alias?: string;
}

function generateAlias(base: string, path: string[]) {
  return [base, ...path].join('_');
}

function buildSelectWithAlias<T>(table: Table, alias: string, selectCols?: (keyof T)[]) {
  const columns = selectCols?.length
    ? selectCols
    : (Object.keys(table) as (keyof T)[]);
  return columns.map((col) =>
    sql`${alias}.${sql.identifier(String(col))} as ${sql.identifier(alias + '_' + String(col))}`
  );
}

function mapRowToNested(row: any, rootAlias: string, relations: Record<string, RelationOptions<any>> | undefined, path: string[] = []): any {
  const data: any = {};
  for (const key in row) {
    if (key.startsWith(rootAlias + '_')) {
      const colName = key.replace(rootAlias + '_', '');
      data[colName] = row[key];
    }
  }

  if (!relations) return data;

  for (const [relName, relOpt] of Object.entries(relations)) {
    const relOptAny = relOpt as any;
    const relAlias = relOptAny.alias ?? generateAlias(relOptAny.table.name, [...path, relName]);
    const relKeys = Object.keys(row).filter(k => k.startsWith(relAlias + '_'));

    if (relKeys.length === 0 || row[relAlias + '_id'] == null) {
      data[relName] = null;
      continue;
    }

    data[relName] = mapRowToNested(row, relAlias, relOptAny.relations, [...path, relName]);
  }

  return data;
}

export async function findAll<T>(
  db: any,
  table: Table | any,
  options: FindAllOptions<T> = {},
  path: string[] = []
): Promise<T[]> {
  const {
    select,
    where,
    orderBy,
    pagination,
    softDelete,
    relations,
    alias,
  } = options;

  const tableAlias = alias ?? generateAlias(table.name, path);
  const selects = buildSelectWithAlias<T>(table, tableAlias, select);
  let query = db.select().from(sql`${table} as ${sql.identifier(tableAlias)}`).fields(selects);

  if (relations) {
    for (const [relName, relOpt] of Object.entries(relations)) {
      const relOptAny = relOpt as any;
      const relAlias = relOptAny.alias ?? generateAlias(relOptAny.table.name, [...path, relName]);
      const relSelects = buildSelectWithAlias(relOptAny.table, relAlias, relOptAny.select);
      const joinType = relOptAny.joinType ?? 'left';

      switch (joinType) {
        case 'inner':
          query = query.innerJoin(relOptAny.table.as(relAlias), relOptAny.on);
          break;
        case 'left':
          query = query.leftJoin(relOptAny.table.as(relAlias), relOptAny.on);
          break;
        case 'right':
          query = query.rightJoin(relOptAny.table.as(relAlias), relOptAny.on);
          break;
      }

      query = query.fields(relSelects);

      if (relOptAny.where) {
        query = query.where(relOptAny.where(relOptAny.table.as(relAlias)));
      }

      if (relOptAny.orderBy) {
        query = query.orderBy(relOptAny.orderBy(relOptAny.table.as(relAlias)));
      }
    }
  }

  if (where) {
    query = query.where(where(table.as(tableAlias)));
  }

  if (softDelete && softDelete.deletedAtColumn && !softDelete.includeTrashed) {
    query = query.where(sql`${tableAlias}.${softDelete.deletedAtColumn} IS NULL`);
  }

  if (orderBy) {
    query = query.orderBy(orderBy(table.as(tableAlias)));
  }

  if (pagination) {
    const offset = (pagination.page - 1) * pagination.perPage;
    query = query.limit(pagination.perPage).offset(offset);
  }

  const rows = await query.execute();
  return rows.map((row:any )=> mapRowToNested(row, tableAlias, relations, path));
}
