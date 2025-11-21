"use strict";
// src/config.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Konfigurasi Default jika file .naminglintrc.json tidak ada atau tidak lengkap
const DEFAULT_RULES = {
    fileCase: 'kebab-case',
    folderCase: 'PascalCase',
    caseSensitiveCheck: true,
};
const DEFAULT_CONFIG = {
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
        '.env*', // Meng-cover .env, .env.local, dll
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
        '.naminglintrc.json'
    ],
};
/**
 * Memuat konfigurasi dari file .naminglintrc.json.
 * Akan menggabungkan nilai default dengan nilai dari file.
 */
function loadConfig(directory) {
    const configPath = path.join(directory, '.naminglintrc.json');
    let userConfig = {};
    try {
        const fileContent = fs.readFileSync(configPath, 'utf-8');
        try {
            userConfig = JSON.parse(fileContent);
            if (typeof userConfig !== 'object' || userConfig === null) {
                userConfig = {};
            }
        }
        catch (jsonError) {
            console.error(`Error: Gagal mem-parsing .naminglintrc.json. File rusak. Menggunakan config default.`, jsonError);
            return DEFAULT_CONFIG;
        }
    }
    catch (error) {
        // File tidak ditemukan, biarkan userConfig = {}
    }
    // Gabungkan (Merge) aturan default dengan aturan pengguna secara aman
    const finalRules = {
        ...DEFAULT_RULES,
        ...(typeof userConfig.rules === 'object' && userConfig.rules !== null
            ? userConfig.rules
            : {}),
    };
    // Gabungkan (Merge) pola 'ignore' secara aman
    const finalIgnore = [
        ...DEFAULT_CONFIG.ignore,
        ...(Array.isArray(userConfig.ignore) ? userConfig.ignore : []),
    ];
    const finalConfig = {
        rules: finalRules,
        ignore: finalIgnore,
    };
    return finalConfig;
}
