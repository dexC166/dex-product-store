/**
 * @fileoverview ESLint Configuration - Code Quality and Style Enforcement
 *
 * This file configures ESLint for the DEX Product Store React application,
 * defining code quality rules, React-specific linting, and style enforcement
 * that ensures consistent, maintainable, and error-free code across the
 * entire frontend codebase.
 *
 * ESLint Architecture:
 * - ESLint: JavaScript/JSX linter for code quality and style enforcement
 * - Flat Config: Modern ESLint configuration format (ESLint 9+)
 * - React Plugins: Specialized linting rules for React applications
 * - Modern JavaScript: ES2020+ support with latest ECMAScript features
 * - JSX Support: Full JSX syntax support for React components
 *
 * Linting Strategy:
 * - Code Quality: Catches common JavaScript errors and anti-patterns
 * - React Best Practices: Enforces React-specific coding standards
 * - Hooks Rules: Ensures proper React Hooks usage and dependencies
 * - JSX Runtime: Supports modern JSX transform (no React import needed)
 * - Hot Reload: Optimized for Vite's Hot Module Replacement
 *
 * Development Integration:
 * - npm run lint: Runs ESLint on all JavaScript/JSX files
 * - IDE Integration: Real-time linting in VS Code and other editors
 * - Pre-commit Hooks: Can be integrated with Git hooks for quality gates
 * - CI/CD Integration: Automated linting in build pipelines
 *
 * Why ESLint: ESLint is essential for maintaining code quality and
 * consistency in React applications. It catches bugs early, enforces
 * coding standards, and helps teams write maintainable code. The
 * React-specific rules ensure proper component patterns and hooks usage.
 *
 * @author Dayle Cortes
 * @version 1.0.0
 * @see {@link ./package.json} ESLint dependencies and scripts
 * @see {@link https://eslint.org/} ESLint Documentation
 * @see {@link https://eslint.org/docs/latest/use/configure/configuration-files} ESLint Configuration
 * @see {@link https://github.com/jsx-eslint/eslint-plugin-react} React ESLint Plugin
 */

/**
 * ESLint JavaScript recommended rules for base code quality.
 *
 * This import provides ESLint's recommended JavaScript rules that catch
 * common programming errors and enforce best practices. These rules
 * form the foundation of the linting configuration.
 *
 * Recommended Rules Include:
 * - Syntax errors and common mistakes
 * - Unused variables and unreachable code
 * - Missing return statements and undefined variables
 * - Best practices for variable declarations and comparisons
 * - Security-related anti-patterns
 *
 * Why @eslint/js: This package provides the core ESLint rules without
 * requiring additional configuration. It's the standard starting point
 * for any JavaScript project and ensures basic code quality.
 *
 * @see {@link https://eslint.org/docs/latest/rules/} ESLint Rules Reference
 */
import js from '@eslint/js';

/**
 * Global variables definitions for different environments.
 *
 * This import provides predefined global variables for different
 * JavaScript environments (browser, node, etc.). It tells ESLint
 * which global variables are available in the current environment.
 *
 * Browser Globals Include:
 * - window, document, console, localStorage, etc.
 * - DOM APIs and browser-specific objects
 * - Event handlers and browser events
 * - Web APIs like fetch, Promise, etc.
 *
 * Why globals: ESLint needs to know which global variables are
 * available to avoid false positives about undefined variables.
 * Browser globals are essential for React applications that run
 * in the browser environment.
 *
 * @see {@link https://github.com/sindresorhus/globals} Globals Package
 */
import globals from 'globals';

/**
 * ESLint plugin for React-specific linting rules.
 *
 * This plugin provides specialized linting rules for React applications,
 * including component patterns, JSX syntax, and React best practices.
 * It's essential for maintaining high-quality React code.
 *
 * React Plugin Rules Include:
 * - JSX syntax validation and best practices
 * - Component naming conventions and structure
 * - Props validation and prop-types usage
 * - React lifecycle method patterns
 * - JSX runtime support for modern React
 *
 * Why react plugin: React has specific patterns and conventions that
 * regular JavaScript linters don't understand. This plugin ensures
 * proper React component structure and JSX usage.
 *
 * @see {@link https://github.com/jsx-eslint/eslint-plugin-react} React ESLint Plugin
 */
import react from 'eslint-plugin-react';

/**
 * ESLint plugin for React Hooks linting rules.
 *
 * This plugin provides specialized rules for React Hooks, ensuring
 * proper usage patterns and catching common hooks-related bugs.
 * It's crucial for modern React applications using hooks.
 *
 * React Hooks Rules Include:
 * - Rules of Hooks enforcement (only call hooks at top level)
 * - Hook dependency array validation
 * - Custom hooks naming conventions
 * - Hook usage patterns and best practices
 *
 * Why react-hooks plugin: Hooks have specific rules that must be
 * followed for React to work correctly. This plugin catches violations
 * of the Rules of Hooks and ensures proper dependency management.
 *
 * @see {@link https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks} React Hooks ESLint Plugin
 */
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * ESLint plugin for React Refresh (Hot Module Replacement) optimization.
 *
 * This plugin provides rules specifically for React Refresh, ensuring
 * that components are properly structured for hot module replacement
 * during development. It optimizes the development experience.
 *
 * React Refresh Rules Include:
 * - Component export patterns for HMR
 * - Constant export allowances
 * - Hot reload optimization patterns
 *
 * Why react-refresh plugin: React Refresh requires specific component
 * patterns to work correctly. This plugin ensures components are
 * structured properly for hot module replacement.
 *
 * @see {@link https://github.com/ArnaudBarre/eslint-plugin-react-refresh} React Refresh ESLint Plugin
 */
import reactRefresh from 'eslint-plugin-react-refresh';

/**
 * ESLint flat configuration array for the DEX Product Store application.
 *
 * This configuration defines how ESLint should lint the React application,
 * specifying which files to check, what rules to apply, and how to
 * handle different JavaScript/JSX patterns.
 *
 * Configuration Structure:
 * - ignores: Files and directories to exclude from linting
 * - files: File patterns to include in linting
 * - languageOptions: JavaScript/JSX parsing configuration
 * - settings: Plugin-specific settings (React version)
 * - plugins: ESLint plugins for React-specific rules
 * - rules: Linting rules and their configurations
 *
 * Why flat config: ESLint 9+ uses the flat config format which is
 * more modern, performant, and easier to understand than the legacy
 * .eslintrc format. It provides better TypeScript support and
 * clearer configuration structure.
 *
 * @type {Array} ESLint configuration array
 */
export default [
  // Files and directories to ignore during linting
  // This configuration tells ESLint to skip certain files and directories
  // that shouldn't be linted, such as build outputs, dependencies, and
  // generated files.
  { ignores: ['dist'] },

  // Main ESLint configuration for JavaScript and JSX files
  // This configuration applies to all JavaScript and JSX files in the
  // project, providing comprehensive linting rules for React development.
  {
    // File patterns to include in ESLint linting
    // This pattern tells ESLint to lint all JavaScript and JSX files
    // in the project, including all subdirectories.
    files: ['**/*.{js,jsx}'],

    // Language options for JavaScript/JSX parsing
    // This configuration tells ESLint how to parse JavaScript and JSX
    // code, including ECMAScript version, global variables, and
    // parser-specific options.
    languageOptions: {
      // ECMAScript version for JavaScript parsing (ES2020)
      // This specifies the ECMAScript version that ESLint should use
      // when parsing JavaScript code. ES2020 includes modern features
      // like optional chaining, nullish coalescing, and dynamic imports.
      ecmaVersion: 2020,

      // Global variables available in the browser environment
      // This tells ESLint which global variables are available in
      // the browser environment, preventing false positives about
      // undefined variables like window, document, console, etc.
      globals: globals.browser,

      // Parser options for enhanced JavaScript/JSX parsing
      // This configuration provides additional parsing options for
      // ESLint, including ECMAScript version, JSX support, and
      // module system configuration.
      parserOptions: {
        // Use the latest ECMAScript features for parsing
        ecmaVersion: 'latest',
        // Enable JSX parsing for React components
        ecmaFeatures: { jsx: true },
        // Use ES modules syntax for import/export statements
        sourceType: 'module',
      },
    },

    // Plugin-specific settings for React configuration
    // This configuration provides settings for ESLint plugins,
    // specifically the React plugin, to ensure proper React-specific
    // linting behavior.
    settings: { react: { version: '18.3' } },

    // ESLint plugins for React-specific linting rules
    // This configuration registers ESLint plugins that provide
    // specialized linting rules for React applications, including
    // component patterns, hooks usage, and JSX syntax.
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    // ESLint rules configuration for code quality and style enforcement
    // This configuration defines which linting rules to apply and
    // how they should be configured. It includes base JavaScript rules,
    // React-specific rules, and custom overrides for the project.
    rules: {
      // JavaScript recommended rules for base code quality
      ...js.configs.recommended.rules,

      // React recommended rules for component best practices
      ...react.configs.recommended.rules,

      // React JSX runtime rules for modern JSX transform
      ...react.configs['jsx-runtime'].rules,

      // React Hooks recommended rules for proper hooks usage
      ...reactHooks.configs.recommended.rules,

      // Disable react/jsx-no-target-blank rule
      // This rule warns about links with target="_blank" that don't
      // have rel="noopener noreferrer". We disable it because:
      // - Modern browsers handle this automatically
      // - It's often not applicable in controlled environments
      // - It can be overly restrictive for internal applications
      'react/jsx-no-target-blank': 'off',

      // React Refresh rule for HMR optimization
      // This rule ensures that components are properly structured
      // for React Refresh (Hot Module Replacement). It warns when
      // files export non-component values that could break HMR.
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Disable react/prop-types rule
      // This rule enforces prop-types validation for React components.
      // We disable it because:
      // - We're using TypeScript for type checking instead
      // - PropTypes are redundant when using TypeScript
      // - It reduces boilerplate and maintenance overhead
      // - Modern React development favors TypeScript over PropTypes
      'react/prop-types': 'off',
    },
  },
];
