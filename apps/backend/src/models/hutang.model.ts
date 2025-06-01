import { pgTable, uuid, varchar, decimal, timestamp, text, pgEnum, uniqueIndex, index } from "drizzle-orm/pg-core";
import { entitas } from "./entitas.model";

export const jenis_hutang_enum = pgEnum("jenis_hutang", [
    "hutang",
    "piutang",
]);

export const status_enum = pgEnum("status", [
    "pending",
    "accepted",
    "rejected",
    "owed",
    "paid",
]);

export const hutang = pgTable("hutang", {

    id: uuid("id").primaryKey().defaultRandom(),
    faktur: varchar('faktur').notNull().unique(),
    entitas_id: uuid("entitas_id").references(() => entitas.id, { onDelete: 'cascade' }),
    jenis_hutang: jenis_hutang_enum().default('piutang'),
    jumlah_hutang: decimal("jumlah_hutang", { precision: 15, scale: 2 }).notNull(),
    sisa_hutang: decimal("sisa_hutang", { precision: 15, scale: 2 }).notNull(),
    status: status_enum().default('pending'),
    tanggal_hutang: timestamp("tanggal_hutang", { mode: "date" }).notNull(),
    deskripsi: text("deskripsi").default(""),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    deletedAt: timestamp("deleted_at"),
}, (table: any) => [
    uniqueIndex("transaksi_faktur_idx").on(table.faktur),
    index("idx_hutang_jenis_hutang").on(table.jenis_hutang),
    index("idx_hutang_status").on(table.status),
    index("idx_hutang_tanggal").on(table.tanggal_hutang),
]);
