/**
 * Memindai file dan folder secara rekursif.
 * @param directory Direktori utama proyek
 * @param ignorePatterns Array pola glob untuk diabaikan (dari config)
 * @returns Array berisi path file dan folder relatif
 */
export declare function scanFiles(directory: string, ignorePatterns: string[]): string[];
