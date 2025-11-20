import { CaseType } from './types';
export declare function toKebabCase(text: string): string;
export declare function toSnakeCase(text: string): string;
export declare function toPascalCase(text: string): string;
export declare function toCamelCase(text: string): string;
/**
 * Fungsi utama yang akan digunakan oleh Linter.
 * Mengonversi string ke 'CaseType' yang diminta.
 */
export declare function convertCase(text: string, rule: CaseType): string;
