import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Byggresultatet är genererat och ska inte lintas som källkod.
  globalIgnores(['dist']),
  {
    // Dela rekommenderade JavaScript-, React Hooks- och Vite-regler mellan appfilerna.
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Backendfiler körs i Node, medan frontendfilerna ovan får webbläsarglobals.
    files: [
      'server.js',
      'controllers/authController.js',
      'middleware/**/*.js',
      'models/**/*.js',
      'routes/**/*.js',
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
])
