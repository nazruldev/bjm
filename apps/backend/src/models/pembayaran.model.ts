import { pgTable, uuid, timestamp, varchar, json, decimal, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";
import { transaksi } from "./transaksi.model";
export const metode_pembayaran = pgEnum("metode_pembayaran", [
  "TRANSFER",
  "TUNAI",
])

export const pembayaran = pgTable("pembayaran", {
  id: uuid("id").primaryKey().defaultRandom(),
  transaksi_id: uuid("transaksi_id").references(() => transaksi.id,{ onDelete: 'cascade' }),
  jumlah: decimal("jumlah", { precision: 15, scale: 2 }).notNull(),
  biaya_tambahan: json('biaya_tambahan').notNull().default([]),
  tanggal_pembayaran: timestamp("tanggal_pembayaran", { mode: "date" }).notNull(),
  metode_pembayaran: metode_pembayaran().notNull(),
  nomor_rekening_transfer: varchar("nomor_rekening_transfer", { length: 50 }).default(''),
  nama_pengirim_transfer: varchar("nama_pengirim_transfer", { length: 100 }).default(''),
  nama_penerima_transfer: varchar("nama_penerima_transfer", { length: 100 }).default(''),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
 
});
