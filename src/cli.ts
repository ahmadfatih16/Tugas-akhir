#!/usr/bin/env node

// src/cli.ts
// Baris shebang di atas penting agar file ini bisa dieksekusi

import { program } from 'commander';
import { loadConfig } from './config';
import { scanFiles } from './scanner';
import { lint } from './linter';
import * as path from 'path';

// Ambil info versi dari package.json
const packageJson = require(path.join(__dirname, '../package.json'));

program
  .version(packageJson.version)
  .description("Naming Convention Linter: Pengecek standar penamaan file/folder.")
  .argument('[directory]', 'Direktori yang ingin di-lint', '.')
  .action((dirArg) => {

    const workDir = path.resolve(process.cwd(), dirArg);
    console.log(`Memindai direktori: ${workDir}\n`);

    // 1. Muat Konfigurasi
    const config = loadConfig(workDir);

    // 2. Pindai File
    const files = scanFiles(workDir, config.ignore);

    // 3. Jalankan Linter
    const errors = lint(files, config);

    // 4. Tampilkan Hasil
    if (errors.length > 0) {
      console.error('❌ Ditemukan pelanggaran standar penamaan:');

      errors.forEach(err => {
        console.error(`  [${err.type}]`.padEnd(18) + `${err.filePath}`);
        console.error(`  ${''.padEnd(18)} -> ${err.message}\n`);
      });

      console.error(`\nTotal ${errors.length} pelanggaran ditemukan.`);
      process.exit(1); // Keluar dengan status error

    } else {
      console.log('✅ Semua file sudah sesuai standar penamaan. Kerja bagus!');
      process.exit(0);
    }
  });

program.parse(process.argv);