CREATE TYPE "public"."jenis" AS ENUM('pelanggan', 'pemasok', 'penjemur', 'pengupas', 'karyawan');--> statement-breakpoint
CREATE TYPE "public"."jenis_hutang" AS ENUM('hutang', 'piutang');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'accepted', 'rejected', 'owed', 'paid');--> statement-breakpoint
CREATE TYPE "public"."metode_pembayaran" AS ENUM('TRANSFER', 'TUNAI');--> statement-breakpoint
CREATE TABLE "entitas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(255) NOT NULL,
	"nik" varchar(255),
	"jenis" "jenis" NOT NULL,
	"telepon" varchar(20),
	"alamat" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "hutang" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"faktur" varchar NOT NULL,
	"entitas_id" uuid,
	"jenis_hutang" "jenis_hutang" DEFAULT 'piutang',
	"jumlah_hutang" numeric(15, 2) NOT NULL,
	"sisa_hutang" numeric(15, 2) NOT NULL,
	"status" "status" DEFAULT 'pending',
	"tanggal_hutang" timestamp NOT NULL,
	"deskripsi" text DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "hutang_faktur_unique" UNIQUE("faktur")
);
--> statement-breakpoint
CREATE TABLE "pembayaran" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaksi_id" uuid,
	"jumlah" numeric(15, 2) NOT NULL,
	"biaya_tambahan" json DEFAULT '[]'::json NOT NULL,
	"tanggal_pembayaran" timestamp NOT NULL,
	"metode_pembayaran" "metode_pembayaran" NOT NULL,
	"nomor_rekening_transfer" varchar(50) DEFAULT '',
	"nama_pengirim_transfer" varchar(100) DEFAULT '',
	"nama_penerima_transfer" varchar(100) DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "transaksi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transactable_type" varchar(50) NOT NULL,
	"transactable_faktur" uuid NOT NULL,
	"tanggal_transaksi" timestamp NOT NULL,
	"jumlah" numeric(15, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "hutang" ADD CONSTRAINT "hutang_entitas_id_entitas_id_fk" FOREIGN KEY ("entitas_id") REFERENCES "public"."entitas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pembayaran" ADD CONSTRAINT "pembayaran_transaksi_id_transaksi_id_fk" FOREIGN KEY ("transaksi_id") REFERENCES "public"."transaksi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "transaksi_faktur_idx" ON "hutang" USING btree ("faktur");--> statement-breakpoint
CREATE INDEX "idx_hutang_jenis_hutang" ON "hutang" USING btree ("jenis_hutang");--> statement-breakpoint
CREATE INDEX "idx_hutang_status" ON "hutang" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_hutang_tanggal" ON "hutang" USING btree ("tanggal_hutang");