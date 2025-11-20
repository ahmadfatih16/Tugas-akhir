"use strict";
// src/converter.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKebabCase = toKebabCase;
exports.toSnakeCase = toSnakeCase;
exports.toPascalCase = toPascalCase;
exports.toCamelCase = toCamelCase;
exports.convertCase = convertCase;
/**
 * Helper 1: Mengkapitalisasi huruf pertama string.
 * 'word' -> 'Word'
 */
function capitalize(word) {
    if (!word)
        return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
}
/**
 * Helper 2: "Otak" dari konverter.
 * Memecah string dari format APAPUN menjadi array kata-kata.
 *
 * Menggunakan Regex "Lookbehind" dan "Lookahead" yang canggih.
 * - 'login-button' -> ['login', 'button']
 * - 'login_button' -> ['login', 'button']
 * - 'LoginButton'  -> ['login', 'button']
 * - 'MyHTTPFile'   -> ['my', 'http', 'file']
 */
function getWords(text) {
    if (!text)
        return [];
    return text
        // 1. Ganti kebab-case/snake_case menjadi spasi
        .replace(/[-_]/g, ' ')
        // 2. Pisahkan kata camelCase (cth: 'aB')
        .replace(/(?<=[a-z])(?=[A-Z])/g, ' ')
        // 3. Pisahkan akronim (cth: 'HTTPFile' -> 'HTTP File')
        .replace(/(?<=[A-Z])(?=[A-Z][a-z])/g, ' ')
        // 4. Bersihkan (huruf kecil, split by spasi, buang spasi kosong)
        .toLowerCase()
        .split(' ')
        .filter(Boolean); // filter(Boolean) menghapus string kosong
}
// --- FUNGSI PUBLIK ---
function toKebabCase(text) {
    return getWords(text).join('-');
}
function toSnakeCase(text) {
    return getWords(text).join('_');
}
function toPascalCase(text) {
    return getWords(text).map(capitalize).join('');
}
function toCamelCase(text) {
    const words = getWords(text);
    if (words.length === 0)
        return '';
    // Kata pertama 'as-is' (lowercase), sisanya di-capitalize
    return words[0] + words.slice(1).map(capitalize).join('');
}
/**
 * Fungsi utama yang akan digunakan oleh Linter.
 * Mengonversi string ke 'CaseType' yang diminta.
 */
function convertCase(text, rule) {
    switch (rule) {
        case 'kebab-case':
            return toKebabCase(text);
        case 'snake_case':
            return toSnakeCase(text);
        case 'PascalCase':
            return toPascalCase(text);
        case 'camelCase':
            return toCamelCase(text);
        default:
            return text; // Jika aturan tidak dikenali, kembalikan teks asli
    }
}
