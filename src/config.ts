// src/config.ts

import * as fs from 'fs';
import * as path from 'path';
import { LinterConfig, LinterRules } from './types';

// Konfigurasi Default jika file .naminglintrc.json tidak ada atau tidak lengkap
const DEFAULT_RULES: LinterRules = {
  fileCase: 'kebab-case',
  folderCase: 'PascalCase',
  caseSensitiveCheck: true,
};

const DEFAULT_CONFIG: LinterConfig = {
  rules: DEFAULT_RULES,
  ignore: [
    'node_modules/**', 
    'dist/**', 
    '.git/**',
    '.vscode/**',
    'test-bed/**', // Kita tambahkan folder tes kita

    // Abaikan file-file konfigurasi di root
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'jest.config.js', // <-- FILE BARU YANG DI-IGNORE
    '.gitignore',
    '.naminglintrc.json'
  ],
};

/**
 * Memuat konfigurasi dari file .naminglintrc.json.
 * Akan menggabungkan nilai default dengan nilai dari file.
 */
export function loadConfig(directory: string): LinterConfig {
  const configPath = path.join(directory, '.naminglintrc.json');
  let userConfig: any = {};

  try {
    const fileContent = fs.readFileSync(configPath, 'utf-8');
    try {
      userConfig = JSON.parse(fileContent);
      if (typeof userConfig !== 'object' || userConfig === null) {
        userConfig = {};
      }
    } catch (jsonError) {
      console.error(
        `Error: Gagal mem-parsing .naminglintrc.json. File rusak. Menggunakan config default.`,
        jsonError
      );
      return DEFAULT_CONFIG;
    }
  } catch (error) {
    // File tidak ditemukan, biarkan userConfig = {}
  }

  // Gabungkan (Merge) aturan default dengan aturan pengguna secara aman
  const finalRules: LinterRules = {
    ...DEFAULT_RULES,
    ...(typeof userConfig.rules === 'object' && userConfig.rules !== null
      ? userConfig.rules
      : {}),
  };

  // Gabungkan (Merge) pola 'ignore' secara aman
  const finalIgnore: string[] = [
    ...DEFAULT_CONFIG.ignore,
    ...(Array.isArray(userConfig.ignore) ? userConfig.ignore : []),
  ];

  const finalConfig: LinterConfig = {
    rules: finalRules,
    ignore: finalIgnore,
  };

  return finalConfig;
}