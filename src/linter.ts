// src/linter.ts

import * as path from 'path';
import { LinterConfig } from './types';
import { validateCase } from './validators';
import { convertCase } from './converter'; // <-- 1. IMPOR BARU

// Perbarui interface LintError
export interface LintError {
  filePath: string;
  message: string;
  type: 'case-rule' | 'case-conflict';
  suggestedFix?: string; // <-- 2. PROPERTI BARU (opsional)
}

/**
 * Fungsi utama linter.
 * Menganalisis daftar path file berdasarkan aturan konfigurasi.
 */
export function lint(filePaths: string[], config: LinterConfig): LintError[] {
  const errors: LintError[] = [];
  const lowerCasePaths = new Set<string>();

  for (const filePath of filePaths) {
    // 1. Deteksi Konflik Case-Sensitivity (Tidak berubah)
    const lowerPath = filePath.toLowerCase();

    if (lowerCasePaths.has(lowerPath)) {
      errors.push({
        filePath: filePath,
        message: `Konflik case-sensitivity terdeteksi. Path serupa (beda case) sudah ada.`,
        type: 'case-conflict',
        // Tidak ada 'suggestedFix' untuk error tipe ini
      });
    } else {
      lowerCasePaths.add(lowerPath);
    }

    // 2. Validasi Aturan Penamaan (Kita perbarui bagian ini)
    const baseName = path.basename(filePath);
    const isFile = path.extname(baseName) !== '';
    
    const parsedPath = path.parse(baseName);
    const nameWithoutExt = parsedPath.name;
    const extension = parsedPath.ext; // Kita butuh ekstensi untuk saran perbaikan

    const rule = isFile ? config.rules.fileCase : config.rules.folderCase;

    // Jika validasi GAGAL...
    if (!validateCase(nameWithoutExt, rule)) {
      
      // --- 3. LOGIKA KONVERSI BARU ---
      // Buat nama baru tanpa ekstensi
      const newNameWithoutExt = convertCase(nameWithoutExt, rule);
      // Gabungkan kembali dengan ekstensinya (jika ada)
      const suggestedFix = newNameWithoutExt + extension;
      // ---------------------------------

      errors.push({
        filePath: filePath,
        message: `Nama "${baseName}" tidak sesuai aturan "${rule}".`,
        type: 'case-rule',
        suggestedFix: suggestedFix, // <-- 4. SERTAKAN SARAN PERBAIKAN
      });
    }
  }

  return errors;
}