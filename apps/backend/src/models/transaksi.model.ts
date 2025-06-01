import { index } from "drizzle-orm/gel-core";
import { pgTable, uuid, timestamp, varchar, decimal } from "drizzle-orm/pg-core";

export const transaksi = pgTable("transaksi", {
  id: uuid("id").primaryKey().defaultRandom(),
  transactable_type: varchar("transactable_type", { length: 50 }).notNull(),
  transactable_faktur: varchar("transactable_faktur").notNull(),
  tanggal_transaksi: timestamp("tanggal_transaksi", { mode: "date" }).notNull(),
  jumlah: decimal("jumlah", { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
}, (table: any) => [
  index("transaksi_transactable_idx").on(table.transactable_type, table.transactable_faktur),
 
]);



