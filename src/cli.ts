#!/usr/bin/env node

// src/cli.ts

import { program } from 'commander';
import { loadConfig } from './config';
import { scanFiles } from './scanner';
import { lint } from './linter';
import * as path from 'path';
import * as fs from 'fs';

const packageJson = require(path.join(__dirname, '../package.json'));

program
  .version(packageJson.version)
  .description("Naming Convention Linter: Pengecek standar penamaan file/folder.")
  .argument('[directory]', 'Direktori yang ingin di-lint', '.')
  .option('-f, --fix', 'Perbaiki (rename) file yang melanggar aturan secara otomatis')
  .action(async (dirArg) => {
    
    const options = program.opts();
    const workDir = path.resolve(process.cwd(), dirArg);
    console.log(`Memindai direktori: ${workDir}\n`);

    const config = loadConfig(workDir);
    const files = scanFiles(workDir, config.ignore);
    const errors = lint(files, config);

    if (errors.length > 0) {
      console.error('❌ Ditemukan pelanggaran standar penamaan:');
      
      errors.forEach(err => {
        console.error(`\n  [${err.type}]`.padEnd(18) + `${err.filePath}`);
        console.error(`  ${''.padEnd(18)} -> ${err.message}`);
        
        if (err.suggestedFix) {
          console.error(`  ${''.padEnd(18)}    Saran: ${err.suggestedFix}`);

          if (options.fix && err.type === 'case-rule') {
            try {
              const oldPath = path.join(workDir, err.filePath);
              const newPath = path.join(path.dirname(oldPath), err.suggestedFix);
              
              fs.renameSync(oldPath, newPath); 
              console.log(`  ${''.padEnd(18)}    RENAMED: ${err.filePath} -> ${err.suggestedFix}`);
            
            } catch (renameError) {
              // --- INI BAGIAN YANG DIPERBAIKI ---
              // Kita perlu memeriksa tipe 'renameError' sebelum mengakses .message
              let errorMessage = 'Terjadi error tidak dikenal saat rename';
              if (renameError instanceof Error) {
                // Sekarang TypeScript tahu 'renameError' adalah Error
                errorMessage = renameError.message;
              } else if (typeof renameError === 'string') {
                errorMessage = renameError;
              }
              
              console.error(`  ${''.padEnd(18)}    GAGAL RENAME: ${errorMessage}`);
              // ------------------------------------
            }
          }
        }
      });

      if (options.fix) {
        console.log('\nOperasi rename selesai.');
      }
      console.error(`\n\nTotal ${errors.length} pelanggaran ditemukan.`);
      process.exit(1);
      
    } else {
      console.log('✅ Semua file sudah sesuai standar penamaan. Kerja bagus!');
      process.exit(0);
    }
  });

program.parse(process.argv);