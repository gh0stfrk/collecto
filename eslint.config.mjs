import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Extend next/core-web-vitals and next/typescript
const eslintConfig = [
  {
    ignores: ["node_modules/", ".next/", "out/"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
    },
    env: {
      browser: true,
      node: true,
      es6: true,
    },
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
