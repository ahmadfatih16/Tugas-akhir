// src/types.ts

// Tipe Case yang kita dukung
export type CaseType = 'kebab-case' | 'PascalCase' | 'camelCase' | 'snake_case';

// Interface untuk objek "rules" di dalam file config
export interface LinterRules {
  fileCase: CaseType;
  folderCase: CaseType;
  caseSensitiveCheck: boolean;
}

// Interface untuk seluruh file .naminglintrc.json
export interface LinterConfig {
  rules: LinterRules;
  ignore: string[];
}