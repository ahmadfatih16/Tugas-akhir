#!/usr/bin/env node
"use strict";
// src/cli.ts
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
const commander_1 = require("commander");
const config_1 = require("./config");
const scanner_1 = require("./scanner");
const linter_1 = require("./linter");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const packageJson = require(path.join(__dirname, '../package.json'));
commander_1.program
    .version(packageJson.version)
    .description("Naming Convention Linter: Pengecek standar penamaan file/folder.")
    .argument('[directory]', 'Direktori yang ingin di-lint', '.')
    .option('-f, --fix', 'Perbaiki (rename) file yang melanggar aturan secara otomatis')
    .action(async (dirArg) => {
    const options = commander_1.program.opts();
    const workDir = path.resolve(process.cwd(), dirArg);
    console.log(`Memindai direktori: ${workDir}\n`);
    const config = (0, config_1.loadConfig)(workDir);
    const files = (0, scanner_1.scanFiles)(workDir, config.ignore);
    const errors = (0, linter_1.lint)(files, config);
    if (errors.length > 0) {
        console.error('❌ Ditemukan pelanggaran standar penamaan:');
        errors.forEach(err => {
            console.error(`\n  [${err.type}]`.padEnd(18) + `${err.filePath}`);
            console.error(`  ${''.padEnd(18)} -> ${err.message}`);
            if (err.suggestedFix) {
                console.error(`  ${''.padEnd(18)}    Saran: ${err.suggestedFix}`);
                if (options.fix && err.type === 'case-rule') {
                    try {
                        const oldPath = path.join(workDir, err.filePath);
                        const newPath = path.join(path.dirname(oldPath), err.suggestedFix);
                        fs.renameSync(oldPath, newPath);
                        console.log(`  ${''.padEnd(18)}    RENAMED: ${err.filePath} -> ${err.suggestedFix}`);
                    }
                    catch (renameError) {
                        // --- INI BAGIAN YANG DIPERBAIKI ---
                        // Kita perlu memeriksa tipe 'renameError' sebelum mengakses .message
                        let errorMessage = 'Terjadi error tidak dikenal saat rename';
                        if (renameError instanceof Error) {
                            // Sekarang TypeScript tahu 'renameError' adalah Error
                            errorMessage = renameError.message;
                        }
                        else if (typeof renameError === 'string') {
                            errorMessage = renameError;
                        }
                        console.error(`  ${''.padEnd(18)}    GAGAL RENAME: ${errorMessage}`);
                        // ------------------------------------
                    }
                }
            }
        });
        if (options.fix) {
            console.log('\nOperasi rename selesai.');
        }
        console.error(`\n\nTotal ${errors.length} pelanggaran ditemukan.`);
        process.exit(1);
    }
    else {
        console.log('✅ Semua file sudah sesuai standar penamaan. Kerja bagus!');
        process.exit(0);
    }
});
commander_1.program.parse(process.argv);
