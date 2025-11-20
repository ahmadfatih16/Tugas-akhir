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
        'node_modules/**',
        'dist/**',
        '.git/**',
        '.vscode/**',
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
