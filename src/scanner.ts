// src/scanner.ts

import { sync } from 'glob';
import * as path from 'path';

/**
 * Memindai file dan folder secara rekursif.
 * @param directory Direktori utama proyek
 * @param ignorePatterns Array pola glob untuk diabaikan (dari config)
 * @returns Array berisi path file dan folder relatif
 */
export function scanFiles(directory: string, ignorePatterns: string[]): string[] {
  const options = {
    cwd: directory,
    ignore: ignorePatterns,
    dot: true, // Memasukkan file/folder yang diawali titik (misal: .github)
    absolute: true,
  };

  // Memindai semua file DAN folder ('**')
  const allPaths = sync('**', options);

  // Mengubah path absolut kembali menjadi path relatif
  const relativePaths = allPaths.map(p => path.relative(directory, p));

  return relativePaths;
}