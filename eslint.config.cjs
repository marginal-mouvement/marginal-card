// @ts-check
/* global __dirname */

const eslint = require("@eslint/js");
const typescriptEslint = require("typescript-eslint");
const eslintConfigPrettier = require("eslint-config-prettier");
const { fixupPluginRules } = require("@eslint/compat");
const eslintPluginImport = require("eslint-plugin-import");
const globals = require("globals");
const typescriptEslintParser = require("@typescript-eslint/parser");
const reactHooks = require("eslint-plugin-react-hooks");
const reactRefresh = require("eslint-plugin-react-refresh");

module.exports = [
  eslint.configs.recommended,
  eslintConfigPrettier,
  { ignores: ["dist"] },
  {
    plugins: {
      ts: typescriptEslint.plugin,
      imports: fixupPluginRules(eslintPluginImport),
    },
    ignores: ["node_modules"],
    rules: {
      "no-unused-vars": "off",
      "no-array-constructor": "error",
      "prefer-template": "error",
      "no-unused-expressions": "off",
      "no-redeclare": "off", // we use "ts/no-redeclare"

      "imports/no-duplicates": "error",
      "imports/order": [
        "warn",
        {
          groups: ["external", "builtin", ["sibling"]],
          "newlines-between": "always",
        },
      ],

      "ts/no-redeclare": "error",
      "ts/ban-ts-comment": "error",
      "ts/consistent-type-imports": "error",
      "ts/consistent-type-exports": "error",
      "ts/no-require-imports": "error",
      "ts/no-empty-object-type": "error",
      "ts/no-duplicate-enum-values": "error",
      "ts/no-explicit-any": "off",
      "ts/no-extra-non-null-assertion": "error",
      "ts/no-misused-new": "error",
      "ts/no-namespace": "error",
      "ts/no-non-null-asserted-optional-chain": "error",
      "ts/no-this-alias": "error",
      "ts/no-unnecessary-type-constraint": "error",
      "ts/no-unsafe-declaration-merging": "error",
      "ts/no-unsafe-function-type": "error",
      "ts/no-unused-expressions": "error",
      "ts/no-unused-vars": "error",
      "ts/no-wrapper-object-types": "error",
      "ts/prefer-as-const": "error",
      "ts/prefer-namespace-keyword": "error",
      "ts/triple-slash-reference": "error",
    },
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
      parser: typescriptEslintParser,
      parserOptions: {
        project: "./tsconfig.base.json",
        tsconfigRootDir: __dirname,
      },
      sourceType: "module",
    },
  },
  {
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": [
        "error",
        { additionalHooks: "(useEffectRealtime)" },
      ],
    },
    files: ["**/*frontend/**/*.ts", "**/*.tsx"],
  },
];
