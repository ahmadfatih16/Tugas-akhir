export type CaseType = 'kebab-case' | 'PascalCase' | 'camelCase' | 'snake_case';
export interface LinterRules {
    fileCase: CaseType;
    folderCase: CaseType;
    caseSensitiveCheck: boolean;
}
export interface LinterConfig {
    rules: LinterRules;
    ignore: string[];
}
