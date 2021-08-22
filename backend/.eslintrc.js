module.exports = {
  extends: ['eslint:recommended'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    babelOptions: {
      configFile: 'backend/.babelrc.js',
    },
  },
  env: {
    node: true,
  },
}
