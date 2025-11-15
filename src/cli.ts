#!/usr/bin/env node

// src/cli.ts

import { program } from 'commander';
import { loadConfig } from './config';
import { scanFiles } from './scanner';
import { lint } from './linter'; // Linter kita sekarang lebih pintar
import * as path from 'path';

const packageJson = require(path.join(__dirname, '../package.json'));

program
  .version(packageJson.version)
  .description("Naming Convention Linter: Pengecek standar penamaan file/folder.")
  .argument('[directory]', 'Direktori yang ingin di-lint', '.')
  .action((dirArg) => {
    
    const workDir = path.resolve(process.cwd(), dirArg);
    console.log(`Memindai direktori: ${workDir}\n`);

    const config = loadConfig(workDir);
    const files = scanFiles(workDir, config.ignore);
    const errors = lint(files, config);

    if (errors.length > 0) {
      console.error('❌ Ditemukan pelanggaran standar penamaan:');
      
      errors.forEach(err => {
        // --- INI BAGIAN YANG DIPERBARUI ---
        console.error(`\n  [${err.type}]`.padEnd(18) + `${err.filePath}`);
        console.error(`  ${''.padEnd(18)} -> ${err.message}`);
        
        // Tampilkan saran perbaikan HANYA jika ada
        if (err.suggestedFix) {
          console.error(`  ${''.padEnd(18)}    Saran: ${err.suggestedFix}`);
        }
        // ---------------------------------
      });

      console.error(`\n\nTotal ${errors.length} pelanggaran ditemukan.`);
      process.exit(1);
      
    } else {
      console.log('✅ Semua file sudah sesuai standar penamaan. Kerja bagus!');
      process.exit(0);
    }
  });

program.parse(process.argv);