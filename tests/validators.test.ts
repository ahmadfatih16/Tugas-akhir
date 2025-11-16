// tests/validators.test.ts

import { validateCase } from '../src/validators';

// Grup tes untuk Validator
describe('Modul Validator (Regex Ketat)', () => {

  // Tes untuk PascalCase
  describe('PascalCase', () => {
    test('Harus lolos: Halaman, HalamanUtama, App', () => {
      expect(validateCase('Halaman', 'PascalCase')).toBe(true);
      expect(validateCase('HalamanUtama', 'PascalCase')).toBe(true);
      expect(validateCase('App', 'PascalCase')).toBe(true);
    });
    test('Harus gagal: halaman, halaman-utama, halaman_utama', () => {
      expect(validateCase('halaman', 'PascalCase')).toBe(false);
      expect(validateCase('halaman-utama', 'PascalCase')).toBe(false);
      expect(validateCase('halaman_utama', 'PascalCase')).toBe(false);
    });
  });

  // Tes untuk kebab-case
  describe('kebab-case', () => {
    test('Harus lolos: halaman, halaman-utama, app', () => {
      expect(validateCase('halaman', 'kebab-case')).toBe(true);
      expect(validateCase('halaman-utama', 'kebab-case')).toBe(true);
      expect(validateCase('app', 'kebab-case')).toBe(true);
    });
    test('Harus gagal: Halaman, halamanUtama, halaman_utama', () => {
      expect(validateCase('Halaman', 'kebab-case')).toBe(false);
      expect(validateCase('halamanUtama', 'kebab-case')).toBe(false);
      expect(validateCase('halaman_utama', 'kebab-case')).toBe(false);
    });
  });

  // (Anda bisa menambahkan tes untuk camelCase dan snake_case dengan pola yang sama)
});