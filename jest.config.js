// jest.config.js

module.exports = {
  // Memberi tahu Jest untuk menggunakan 'penerjemah' ts-jest
  preset: 'ts-jest',
  // Memberi tahu Jest bahwa kita sedang menguji lingkungan Node.js
  testEnvironment: 'node',
  // Memberi tahu Jest di mana file tes kita berada
  testMatch: ['**/tests/**/*.test.ts'],
};