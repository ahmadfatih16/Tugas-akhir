import { LinterConfig } from './types';
export interface LintError {
    filePath: string;
    message: string;
    type: 'case-rule' | 'case-conflict';
    suggestedFix?: string;
}
/**
 * Fungsi utama linter.
 * Menganalisis daftar path file berdasarkan aturan konfigurasi.
 */
export declare function lint(filePaths: string[], config: LinterConfig): LintError[];
