import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@models/index'; // pastikan ini mengakses semua schema kamu
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
// export const getAllTenants = async () => {
//   const result = await db.select().from(schema.tenants);
//   return result;
// }