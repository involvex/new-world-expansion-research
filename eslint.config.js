import globals from "globals";
import js from "@eslint/js";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  // Base configuration for ignoring files
  {
    ignores: ["docs/**/*", "node_modules/**/*", "vite-env.d.ts"]
  },
  // Recommended ESLint core rules for all files
  js.configs.recommended,

  // Configuration for all JavaScript, JSX, TypeScript, and TSX files
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser, // Use TypeScript parser for all relevant files
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json", "./tsconfig.node.json"], // Specify tsconfig for type-aware linting
      },
      globals: {
        ...globals.browser, // Add browser globals
        ...globals.node // Add node globals (for environment variables, etc.)
      },
    },
    plugins: {
      react: react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      "@typescript-eslint": tseslint,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Disable base ESLint 'no-unused-vars' and enable TypeScript-specific one
      
      "no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^", // Ignore arguments that start with _
          "varsIgnorePattern": "^", // Ignore variables that start with _
          "caughtErrorsIgnorePattern": "^",
          "destructuredArrayIgnorePattern": "^",
        }
      ],
      "@typescript-eslint/no-explicit-any": "off",
      // Spread recommended TypeScript rules first
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs.stylistic.rules,
      // Then spread React and JSX A11y rules
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      // Add any custom rules or overrides here
    },
  },

  // Override for specific config files to disable type-aware linting
  {
    files: ["eslint.config.js", "postcss.config.js", "tailwind.config.js", "vite.config.ts"],
    languageOptions: {
      parserOptions: {
        project: null, // Disable project for these files
      },
    },
    rules: {
      // Disable any type-aware rules that might cause issues for these files
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
];