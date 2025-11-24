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
    // 1. FOLDER SISTEM & BUILD
    'node_modules/**',
    'dist/**',
    'build/**',
    'out/**',
    'coverage/**',
    '.git/**',
    '.vscode/**',
    '.idea/**',
    '.next/**',
    '.nuxt/**',
    'venv/**',
    
    // 2. FILE DOKUMENTASI STANDAR
    'README.md',
    'LICENSE',
    'LICENSE.md',
    'CHANGELOG.md',
    'CONTRIBUTING.md',
    'Dockerfile',
    'Makefile',

    // 3. CONFIG & LOCKFILES
    'package.json',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'bun.lockb',
    'composer.json',
    'composer.lock',
    
    // 4. DOTFILES & CONFIG TOOLS
    '.gitignore',
    '.gitattributes',
    '.env*',            // Meng-cover .env, .env.local, dll
    '.editorconfig',
    '.npmrc',
    
    // 5. CONFIG JS/TS (Wildcard agar cover .js, .ts, .json)
    'tsconfig.json',
    'jsconfig.json',
    'jest.config.*',
    'vite.config.*',
    'webpack.config.*',
    'rollup.config.*',
    'babel.config.*',
    'next.config.*',
    'tailwind.config.*',
    'postcss.config.*',
    '.eslintrc*',
    'eslint.config.*',
    '.prettierrc*',
    
    // 6. KONFIGURASI LINTER KITA SENDIRI
    '.naminglintrc.json',

    // 7. KHUSUS VSCODE EXTENSION (Generator 'yo code') <--- TAMBAHAN BARU
    '.vscodeignore',
    'vsc-extension-quickstart.md',
    '**/*.d.ts',

    // 8. FILE FILE TESTING
    '.vscode-test.*',
    '**/*.test.ts',   
    '**/*.test.js',
    '**/test/**',       
    '**/suite/**'
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