"use strict";
// src/validators.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCase = validateCase;
/*
Logika Regex Paling Ketat dan Saling Eksklusif.

Tujuan utama:
1. camelCase: HANYA boleh [a-z] [A-Z] [0-9]. TIDAK BOLEH [_] atau [-].
2. PascalCase: Sama seperti camelCase, tapi diawali [A-Z].
3. kebab-case: HANYA boleh [a-z] [0-9] [-]. TIDAK BOLEH [A-Z] atau [_].
4. snake_case: HANYA boleh [a-z] [0-9] [_]. TIDAK BOLEH [A-Z] atau [-].
*/
// Lolos: 'file', 'fileName', 'fileName01'
// Gagal: 'File', 'file-name', 'file_name'
const CAMEL_CASE_REGEX = /^[a-z]+([A-Z][a-z0-9]*)*$/;
// Lolos: 'File', 'FileName', 'FileName01', 'F'
// Gagal: 'file', 'File-Name', 'File_Name'
const PASCAL_CASE_REGEX = /^[A-Z][a-z0-9]*([A-Z][a-z0-9]*)*$/;
// Lolos: 'file', 'file-name', 'file-name-01'
// Gagal: 'File', 'fileName', 'file_name'
const KEBAB_CASE_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// Lolos: 'file', 'file_name', 'file_name_01'
// Gagal: 'File', 'fileName', 'file-name'
const SNAKE_CASE_REGEX = /^[a-z0-9]+(_[a-z0-9]+)*$/;
/**
 * Memeriksa apakah sebuah string nama valid berdasarkan aturan case yang diberikan.
 */
function validateCase(name, rule) {
    // Jika nama kosong (misal file .gitignore), anggap valid
    if (name === '')
        return true;
    switch (rule) {
        case 'PascalCase':
            return PASCAL_CASE_REGEX.test(name);
        case 'camelCase':
            return CAMEL_CASE_REGEX.test(name);
        case 'kebab-case':
            return KEBAB_CASE_REGEX.test(name);
        case 'snake_case':
            return SNAKE_CASE_REGEX.test(name);
        default:
            return true; // Aturan tidak dikenali, lewati
    }
}
