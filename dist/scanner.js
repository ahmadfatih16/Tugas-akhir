"use strict";
// src/scanner.ts
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
 * Memindai file dan folder secara rekursif.
 * @param directory Direktori utama proyek
 * @param ignorePatterns Array pola glob untuk diabaikan (dari config)
 * @returns Array berisi path file dan folder relatif
 */
function scanFiles(directory, ignorePatterns) {
    const options = {
        cwd: directory,
        ignore: ignorePatterns,
        dot: true, // Memasukkan file/folder yang diawali titik (misal: .github)
        absolute: true,
    };
    // Memindai semua file DAN folder ('**')
    const allPaths = (0, glob_1.sync)('**', options);
    // Mengubah path absolut kembali menjadi path relatif
    const relativePaths = allPaths.map(p => path.relative(directory, p));
    return relativePaths;
}
