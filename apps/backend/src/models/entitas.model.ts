import { pgTable, serial, varchar, timestamp, pgEnum, uniqueIndex, uuid } from "drizzle-orm/pg-core";
export const jenisEnum = pgEnum("jenis", [
  "pelanggan",
  "pemasok",
  "penjemur",
  "pengupas",
  "karyawan"
])
export const entitas = pgTable("entitas", {
  id: uuid("id").primaryKey().defaultRandom(),
  nama: varchar("nama", { length: 255 }).notNull(),
  nik: varchar("nik", { length: 255 }),
  jenis: jenisEnum().notNull(),
  telepon: varchar("telepon", { length: 20 }), // Nomor HP (boleh null)
  alamat: varchar("alamat", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});