import { faker } from "@faker-js/faker";
import Decimal from "decimal.js";

import { db } from "@config/drizzle";
import { entitas } from "@models/entitas.model";
import { hutang } from "@models/hutang.model";
import { transaksi } from "@models/transaksi.model";
import { pembayaran } from "@models/pembayaran.model";

// 1. Seed Entitas
async function seedEntitas() {
  const jenisList = ["pelanggan", "pemasok", "penjemur", "pengupas", "karyawan"] as const;

  const data = Array.from({ length: 5 }, () => ({
    nama: faker.person.fullName(),
    nik: faker.string.numeric(16),
    jenis: faker.helpers.arrayElement(jenisList),
    telepon: faker.phone.number(),
    alamat: faker.location.streetAddress(),
  }));

  // return semua kolom yang di-insert
  const inserted = await db.insert(entitas).values(data).returning();
  return inserted;
}

// 2. Seed Hutang, Transaksi, dan Pembayaran
async function seedHutangDanTransaksi(entitasList: Awaited<ReturnType<typeof seedEntitas>>) {
  for (const entitasItem of entitasList) {
    const totalHutang = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < totalHutang; i++) {
      const faktur = `HT-${faker.string.alpha(3).toUpperCase()}-${faker.string.numeric(4)}`;
      const jumlah = new Decimal(faker.number.int({ min: 500_000, max: 5_000_000 }));
      const sisa = jumlah.mul(faker.number.float({ min: 0.3, max: 1, fractionDigits: 2 }));

      const [hutangRow] = await db.insert(hutang).values({
        faktur,
        entitas_id: entitasItem.id,
        jenis_hutang: "piutang",
        jumlah_hutang: jumlah.toNumber(),
        sisa_hutang: sisa.toNumber(),
        status: "owed",
        tanggal_hutang: faker.date.recent({ days: 90 }),
        deskripsi: faker.lorem.sentence(),
      }).returning(); // return seluruh kolom

      const [transaksiRow] = await db.insert(transaksi).values({
        transactable_type: "hutang",
        transactable_faktur: hutangRow.faktur,
        tanggal_transaksi: faker.date.recent({ days: 90 }),
        jumlah: jumlah.toNumber(), // number, bukan string
      }).returning();

      // 1–2 pembayaran
      const paymentCount = faker.number.int({ min: 1, max: 2 });
      let totalDibayar = new Decimal(0);

      for (let j = 0; j < paymentCount; j++) {
        const bayar = j === paymentCount - 1
          ? sisa.sub(totalDibayar)
          : sisa.mul(faker.number.float({ min: 0.2, max: 0.5, fractionDigits: 2 }));

        if (bayar.lte(0)) continue;

        totalDibayar = totalDibayar.add(bayar);

        await db.insert(pembayaran).values({
          transaksi_id: transaksiRow.id,
          jumlah: bayar.toNumber(), // number, bukan string
          tanggal_pembayaran: faker.date.recent({ days: 30 }),
          metode_pembayaran: faker.helpers.arrayElement(["TUNAI", "TRANSFER"]),
          biaya_tambahan: JSON.stringify([]),
          nomor_rekening_transfer: faker.finance.accountNumber(),
          nama_pengirim_transfer: faker.person.fullName(),
          nama_penerima_transfer: faker.person.fullName(),
        });
      }
    }
  }
}

// MAIN
async function main() {
  try {
    const entitasList = await seedEntitas();
    await seedHutangDanTransaksi(entitasList);
    console.log("✅ Seeder selesai!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}

main();
