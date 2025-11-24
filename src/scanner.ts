import { sync } from 'glob';
import * as path from 'path';

/**
 * Fungsi pembantu untuk mengecek apakah sebuah path harus di-ignore
 * berdasarkan pola dari config.ts
 */
function isIgnored(filePath: string, ignorePatterns: string[]): boolean {
  // Normalisasi path file ke format '/'
  const normalizedPath = filePath.replace(/\\/g, '/');

  for (const pattern of ignorePatterns) {
    // 1. Handle pola folder (contoh: 'node_modules/**')
    if (pattern.endsWith('/**')) {
      const folderName = pattern.replace('/**', '');
      // Cek apakah path mengandung folder tersebut (di tengah atau di akhir)
      if (normalizedPath.includes(`/${folderName}/`) || normalizedPath.endsWith(`/${folderName}`)) {
        return true;
      }
    }
    
    // 2. Handle pola file eksak (contoh: 'package.json')
    else if (path.basename(normalizedPath) === pattern) {
      return true;
    }

    // 3. Handle pola wildcard ekstensi (contoh: '*.log')
    else if (pattern.startsWith('*.')) {
      const ext = pattern.substring(1); // ambil .log
      if (normalizedPath.endsWith(ext)) {
        return true;
      }
    }
    
    // 4. Handle pola file config spesifik dengan wildcard (contoh: '.env*')
    else if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1); // ambil .env
      if (path.basename(normalizedPath).startsWith(prefix)) {
        return true;
      }
    }
  }

  return false;
}

export function scanFiles(directory: string, ignorePatterns: string[]): string[] {
  // Normalisasi direktori input
  const cleanDirectory = directory.replace(/\\/g, '/');

  const options = {
    cwd: cleanDirectory,
    // Kita tetap kirim ignore ke glob sebagai pertahanan pertama
    ignore: ignorePatterns, 
    dot: true,
    absolute: true,
    nodir: false
  };

  try {
    // 1. Ambil SEMUA file (mungkin glob gagal ignore, jadi kita dapat 9000 file)
    const allPaths = sync('**', options);

    // 2. FILTER MANUAL (JURUS KUNCI)
    // Kita saring ulang hasil glob menggunakan fungsi isIgnored di atas.
    // Ini memaksa daftar dari config.ts untuk dieksekusi.
    const filteredPaths = allPaths.filter(p => !isIgnored(p, ignorePatterns));

    // 3. Kembalikan path relatif
    return filteredPaths.map(p => path.relative(directory, p));

  } catch (e) {
    console.error("Scanner Error:", e);
    return [];
  }
}