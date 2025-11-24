"use strict";
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
exports.scanFiles = scanFiles;
const glob_1 = require("glob");
const path = __importStar(require("path"));
/**
 * Fungsi pembantu untuk mengecek apakah sebuah path harus di-ignore
 * berdasarkan pola dari config.ts
 */
function isIgnored(filePath, ignorePatterns) {
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
function scanFiles(directory, ignorePatterns) {
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
        const allPaths = (0, glob_1.sync)('**', options);
        // 2. FILTER MANUAL (JURUS KUNCI)
        // Kita saring ulang hasil glob menggunakan fungsi isIgnored di atas.
        // Ini memaksa daftar dari config.ts untuk dieksekusi.
        const filteredPaths = allPaths.filter(p => !isIgnored(p, ignorePatterns));
        // 3. Kembalikan path relatif
        return filteredPaths.map(p => path.relative(directory, p));
    }
    catch (e) {
        console.error("Scanner Error:", e);
        return [];
    }
}
