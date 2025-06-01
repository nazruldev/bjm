// helpers/createWithRelations.ts

import { db } from '@config/drizzle';
import type { Table } from 'drizzle-orm';
import { eq, and } from 'drizzle-orm';

interface OneToOneRelation<T> {
  table: Table;
  data: Partial<T>;
  foreignKey: keyof T;
}

interface OneToManyRelation<T> {
  table: Table;
  data: Partial<T>[];
  foreignKey: keyof T;
}

interface ManyToManyRelation {
  pivotTable: Table;
  foreignKey: string;
  relatedKey: string;
  relatedIds: number[];
  existingRelatedIds?: number[];
  mode: 'attach' | 'detach' | 'sync';
}

interface CreateWithRelationsOptions<T> {
  parentTable: Table;
  parentData: Partial<T>;
  oneToOne?: OneToOneRelation<any>[];
  oneToMany?: OneToManyRelation<any>[];
  manyToMany?: ManyToManyRelation[];
}

export async function createWithRelations<T>(options: CreateWithRelationsOptions<T>) {
  const { parentTable, parentData, oneToOne, oneToMany, manyToMany } = options;
  const [parent] = await db.insert(parentTable).values(parentData).returning();

  if (oneToOne) {
    for (const rel of oneToOne) {
      await db.insert(rel.table).values({
        ...rel.data,
        [rel.foreignKey]: parent.id,
      });
    }
  }

  if (oneToMany) {
    for (const rel of oneToMany) {
      const dataWithFk = rel.data.map((item) => ({
        ...item,
        [rel.foreignKey]: parent.id,
      }));
      await db.insert(rel.table).values(dataWithFk);
    }
  }

  if (manyToMany) {
    for (const rel of manyToMany) {
      const { pivotTable, foreignKey, relatedKey, relatedIds, existingRelatedIds, mode } = rel as any;

      if (mode === 'attach') {
        await db.insert(pivotTable).values(
          relatedIds.map((id:any) => ({
            [foreignKey]: parent.id,
            [relatedKey]: id,
          })) as any[]
        );
      }

      if (mode === 'detach') {
        for (const id of relatedIds) {
          await db.delete(pivotTable).where(
            and(
              eq(pivotTable[foreignKey], parent.id),
              eq(pivotTable[relatedKey], id)
            )
          );
        }
      }

      if (mode === 'sync' && existingRelatedIds) {
        const toDetach = existingRelatedIds.filter((id:any) => !relatedIds.includes(id));
        const toAttach = relatedIds.filter((id:any) => !existingRelatedIds.includes(id));

        for (const id of toDetach) {
          await db.delete(pivotTable).where(
            and(
              eq(pivotTable[foreignKey], parent.id),
              eq(pivotTable[relatedKey], id)
            )
          );
        }

        await db.insert(pivotTable).values(
          toAttach.map((id:any) => ({
            [foreignKey]: parent.id,
            [relatedKey]: id,
          })) as any[]
        );
      }
    }
  }

  return parent;
}
