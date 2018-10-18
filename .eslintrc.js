module.exports = {
  extends: ["react-app"],
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    sourceType: "module"
  },
  rules: {
    eqeqeq: 2,
    "import/first": 0,
    "no-console": 0,
    "no-unused-vars": 1,
    "no-var": 2,
    "object-shorthand": 2,
    "prefer-const": 1,
    "jsx-a11y/href-no-hash": 0,
    "jsx-a11y/alt-text": 0
  }
};
