module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true
    },
    extends: ['plugin:react/recommended', 'standard-with-typescript'],
    overrides: [],
    parserOptions: {
      ecmaVersion: 'latest',
      project: ['./tsconfig.json'],
      tsconfigRootDir: __dirname,
      sourceType: 'module'
    },
    plugins: ['react'],
    rules: {}
  }
  