
// eslint.config.mjs
import tsparser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";

export default defineConfig([
  {
    ignores: ["main.js", "dist/**", "node_modules/**", "package-lock.json"],
  },
  ...obsidianmd.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: { project: "./tsconfig.json" },
    },
    rules: {
      "obsidianmd/sample-names": "off",
    },
  },
  {
    files: ["version-bump.mjs"],
    languageOptions: {
      globals: {
        console: "readonly",
      },
    },
  },
  {
    files: ["package.json"],
    rules: {
      "depend/ban-dependencies": "off",
    },
  },
]);
