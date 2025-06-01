// src/models/index.ts
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';

async function loadModels() {
  const modelsPath = path.resolve(__dirname);
  const modelFiles = fs
    .readdirSync(modelsPath)
    .filter(file => file.endsWith('.model.ts'));

  for (const file of modelFiles) {
    const fullPath = path.join(modelsPath, file);
    await import(pathToFileURL(fullPath).href);
  }

  console.log('✅ Semua model berhasil dimuat.');
}

loadModels();
