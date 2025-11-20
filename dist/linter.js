"use strict";
// src/linter.ts
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
exports.lint = lint;
const path = __importStar(require("path"));
const validators_1 = require("./validators");
const converter_1 = require("./converter"); // <-- 1. IMPOR BARU
/**
 * Fungsi utama linter.
 * Menganalisis daftar path file berdasarkan aturan konfigurasi.
 */
function lint(filePaths, config) {
    const errors = [];
    const lowerCasePaths = new Set();
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
        }
        else {
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
        if (!(0, validators_1.validateCase)(nameWithoutExt, rule)) {
            // --- 3. LOGIKA KONVERSI BARU ---
            // Buat nama baru tanpa ekstensi
            const newNameWithoutExt = (0, converter_1.convertCase)(nameWithoutExt, rule);
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
