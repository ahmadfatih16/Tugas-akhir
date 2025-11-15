// src/linter.ts

import * as path from 'path';
import { LinterConfig } from './types';
import { validateCase } from './validators';

// Tipe untuk output error kita
export interface LintError {
  filePath: string; // Path relatif dari file/folder yang error
  message: string;
  type: 'case-rule' | 'case-conflict';
}

/**
 * Fungsi utama linter.
 * Menganalisis daftar path file berdasarkan aturan konfigurasi.
 */
export function lint(filePaths: string[], config: LinterConfig): LintError[] {
  const errors: LintError[] = [];
  const lowerCasePaths = new Set<string>();

  for (const filePath of filePaths) {
    // 1. Deteksi Konflik Case-Sensitivity
    const lowerPath = filePath.toLowerCase();

    if (lowerCasePaths.has(lowerPath)) {
      errors.push({
        filePath: filePath,
        message: `Konflik case-sensitivity terdeteksi. Path serupa (beda case) sudah ada.`,
        type: 'case-conflict',
      });
    } else {
      lowerCasePaths.add(lowerPath);
    }

    // 2. Validasi Aturan Penamaan (fileCase / folderCase)
    const baseName = path.basename(filePath);
    const isFile = path.extname(baseName) !== '';
    
    // Ambil nama tanpa ekstensi dan tanpa tanda '.' di depan (misal .gitignore)
    const parsedPath = path.parse(baseName);
    const nameWithoutExt = parsedPath.name;
    
    const rule = isFile ? config.rules.fileCase : config.rules.folderCase;

    if (!validateCase(nameWithoutExt, rule)) {
      errors.push({
        filePath: filePath,
        message: `Nama "${baseName}" tidak sesuai aturan "${rule}".`,
        type: 'case-rule',
      });
    }
  }

  return errors;
}