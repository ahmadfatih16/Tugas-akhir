// tests/converter.test.ts

import { 
  toKebabCase, 
  toSnakeCase, 
  toPascalCase, 
  toCamelCase 
} from '../src/converter';

// Grup tes untuk Konverter
describe('Modul Konverter', () => {

  // Tes 1: Konversi DARI PascalCase
  test('Harus mengonversi dari PascalCase', () => {
    const input = 'LoginButton';
    expect(toKebabCase(input)).toBe('login-button');
    expect(toSnakeCase(input)).toBe('login_button');
    expect(toCamelCase(input)).toBe('loginButton');
  });

  // Tes 2: Konversi DARI kebab-case
  test('Harus mengonversi dari kebab-case', () => {
    const input = 'my-super-file';
    expect(toPascalCase(input)).toBe('MySuperFile');
    expect(toSnakeCase(input)).toBe('my_super_file');
    expect(toCamelCase(input)).toBe('mySuperFile');
  });

  // Tes 3: Konversi DARI snake_case
  test('Harus mengonversi dari snake_case', () => {
    const input = 'my_super_file';
    expect(toPascalCase(input)).toBe('MySuperFile');
    expect(toKebabCase(input)).toBe('my-super-file');
    expect(toCamelCase(input)).toBe('mySuperFile');
  });

  // Tes 4: Menangani Akronim (Kasus Sulit)
  test('Harus menangani akronim dengan benar', () => {
    const input = 'MyHTTPFile';
    expect(toKebabCase(input)).toBe('my-http-file');
    expect(toSnakeCase(input)).toBe('my_http_file');
    expect(toCamelCase(input)).toBe('myHttpFile');
  });
});