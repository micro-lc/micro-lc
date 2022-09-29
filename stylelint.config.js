module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-rational-order',
  ],

  overrides: [
    {
      customSyntax: 'postcss-less',
      files: ['*.less', '**/*.less'],
    },
  ],

  plugins: ['stylelint-declaration-block-no-ignored-properties'],

  rules: {
    'comment-empty-line-before': null,
    'declaration-empty-line-before': null,
    'function-name-case': 'lower',
    'no-descending-specificity': null,
    'no-invalid-double-slash-comments': null,
    'no-invalid-position-at-import-rule': null,
  },
}
