import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../models'
import 'dotenv/config'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const primaryDb = drizzle(pool, { schema })

export const getAllTenants = async () => {
//   return await primaryDb.select().from(schema.tenants)
}
