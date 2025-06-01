import * as fs from 'fs';
import * as path from 'path';
import { db } from '@config/drizzle';

// Fungsi migrasi per file .sql biasa
async function runSqlFile(filePath: string) {
  const sql = fs.readFileSync(filePath, 'utf-8');
  await db.execute(sql);
}

async function migrateAll() {
  const migrationsDir = path.resolve('./src/migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
  
  console.log('🚀 Memulai migrasi per file...');

  for (const file of files) {
    try {
      console.log(`🔄 Migrasi ${file} mulai...`);
      await runSqlFile(path.join(migrationsDir, file));
      console.log(`✅ Migrasi ${file} berhasil!`);
    } catch (err) {
      console.error(`❌ Migrasi ${file} gagal:`, err);
      process.exit(1);
    }
  }

  console.log('🎉 Semua migrasi selesai!');
}

// Fungsi drop semua tabel (migrate:fresh)
async function dropAllTables() {
  await db.execute(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `);
  console.log('🗑️ Semua tabel berhasil di-drop.');
}

async function migrateFresh() {
  try {
    console.log('🚀 Memulai migrate:fresh...');
    await dropAllTables();
    await migrateAll();
    console.log('🎉 Migrasi fresh selesai!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migrasi fresh gagal:', error);
    process.exit(1);
  }
}

async function main() {
  const mode = process.argv[2]; // ambil argumen pertama setelah 'node script.js'

  if (mode === 'fresh') {
    await migrateFresh();
  } else {
    await migrateAll();
    process.exit(0);
  }
}

main();
