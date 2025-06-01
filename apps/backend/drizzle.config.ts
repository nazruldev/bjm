import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: "./src/migrations", // <- lokasi output migration
    schema: "./src/models/*.model.ts",
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
