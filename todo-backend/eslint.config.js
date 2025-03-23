import js from "@eslint/js";
import parser from "@typescript-eslint/parser";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default tseslint.config({
  ignores: ["dist"],
  languageOptions: {
    parser,
    parserOptions: {
      ecmaVersion: 2020,
    },
  },
  files: ["**/*.{ts,js}"],
  plugins: { prettier: prettierPlugin },
  extends: [js.configs.recommended, ...tseslint.configs.recommended, prettier],
  rules: {
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "auto",
      },
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],
  },
});
