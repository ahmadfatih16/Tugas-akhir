import { LinterConfig } from './types';
/**
 * Memuat konfigurasi dari file .naminglintrc.json.
 * Akan menggabungkan nilai default dengan nilai dari file.
 */
export declare function loadConfig(directory: string): LinterConfig;
