import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";




/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{ts,tsx}"]},
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        sourceType: "module",
        project: ["./tsconfig.json"]
      },
    }
  },
  {ignores: ['.next/**', '**.config.js', '**/scratch/**']},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime']
];
// parser: "@typescript-eslint/parser",
//   parserOptions: {
//     ecmaFeatures: {
//       jsx: true,
//     },
//     ecmaVersion: 2020,
//     sourceType: "module",
//     project: ["./tsconfig.json"],
//   },
