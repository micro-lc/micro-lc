const path = require('path')

const moduleConfig = require('eslint-plugin-n/lib/configs/recommended-module')
const scriptConfig = require('eslint-plugin-n/lib/configs/recommended-script')
const getPackageJson = require('eslint-plugin-n/lib/util/get-package-json')

const packageJson = getPackageJson()
const isModule = (packageJson && packageJson.type) === 'module'

/** @type {import("eslint/lib/shared/types").OverrideConfigData} */
const customModuleConfig = {
  ...moduleConfig,
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'n/no-missing-import': 'off',
    'n/no-unpublished-import': 'off',
  },
}

/** @type {import("eslint/lib/shared/types").OverrideConfigData} */
const customScriptConfig = {
  ...scriptConfig,
  rules: {
    'n/no-unpublished-require': 'off',
  },
}

/** @type {import("eslint/lib/shared/types").OverrideConfigData} */
const jsConfigs = [
  { ...(isModule ? customModuleConfig : customScriptConfig), files: ['*.js'] },
  { ...scriptConfig, files: ['*.cjs', '.*.cjs'] },
  { ...customModuleConfig, files: ['*.mjs', '.*.mjs'] },
]

/** @type {import("eslint/lib/shared/types").OverrideConfigData} */
const tsConfigs = {
  extends: [
    'plugin:n/recommended-module',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
  ],
  files: ['*.ts', '*.tsx', '*.mts', '*.cts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      path.resolve(__dirname, './packages/orchestrator/tsconfig.json'),
      path.resolve(__dirname, './packages/iconic/tsconfig.json'),
      path.resolve(__dirname, './packages/interfaces/tsconfig.json'),
    ],
  },
  plugins: ['@typescript-eslint', 'typescript-sort-keys'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/member-delimiter-style': [
      2,
      {
        multiline: { delimiter: 'none', requireLast: false },
        multilineDetection: 'brackets',
        singleline: { delimiter: 'semi', requireLast: false },
      },
    ],
    '@typescript-eslint/no-invalid-void-type': 'off',
    '@typescript-eslint/no-shadow': ['error', { hoist: 'functions' }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_(?:[0-9]+)?',
        destructuredArrayIgnorePattern: '^_(?:[0-9]+)?',
        ignoreRestSiblings: true,
      },
    ],
    'n/no-missing-import': 'off',
    'n/no-unpublished-import': 'off',
    'no-duplicate-imports': 'off',
    'no-shadow': 'off',
    'sort-imports': 'off',
    'typescript-sort-keys/interface': 'error',
    'typescript-sort-keys/string-enum': 'error',
  },
}

/** @type {import("eslint/lib/shared/types").OverrideConfigData} */
const jsonConfigs = {
  files: ['*.schema.json'],
  parser: 'jsonc-eslint-parser',
  plugins: ['jsonc'],
  rules: {
    'jsonc/sort-keys': [
      'error',
      {
        order: [
          '$id',
          '$schema',
          '$ref',
          '$comment',
          'title',
          'description',
          'definitions',
          'type',
          'default',
          'readOnly',
          'writeOnly',
          'examples',
          'multipleOf',
          'maximum',
          'exclusiveMaximum',
          'minimum',
          'exclusiveMinimum',
          'maxLength',
          'minLength',
          'pattern',
          'additionalItems',
          'items',
          'maxItems',
          'minItems',
          'uniqueItems',
          'contains',
          'maxProperties',
          'minProperties',
          'properties',
          'additionalProperties',
          'patternProperties',
          'required',
          'dependencies',
          'propertyNames',
          'const',
          'enum',
          'format',
          'contentMediaType',
          'contentEncoding',
          'if',
          'then',
          'else',
          'allOf',
          'anyOf',
          'oneOf',
          'not',
        ],
        pathPattern: '.*',
      },
    ],
  },
}

const testFilesConfigs = {
  files: ['*.test.*'],
  rules: {
    'max-nested-callbacks': 'off',
    'no-unused-expressions': 'off',
  },
}

/** @type {import("eslint/lib/shared/types").ConfigData} */
module.exports = {
  env: {
    es2022: true,
    mocha: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  overrides: [...jsConfigs, tsConfigs, jsonConfigs, testFilesConfigs],
  parserOptions: { ecmaVersion: 12 },
  plugins: ['import', 'sort-keys-fix', 'mocha'],
  reportUnusedDisableDirectives: true,
  root: true,
  rules: {
    'array-bracket-spacing': ['error', 'never'],
    'array-callback-return': 'error',
    'arrow-spacing': 'error',
    'block-scoped-var': 'error',
    'block-spacing': ['error', 'always'],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    camelcase: ['error', { ignoreDestructuring: true, properties: 'never' }],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
        imports: 'always-multiline',
        objects: 'always-multiline',
      },
    ],
    'comma-spacing': 'error',
    'comma-style': 'error',
    'computed-property-spacing': ['error', 'never'],
    curly: 'error',
    'default-case': ['error', { commentPattern: '^skip\\sdefault' }],
    'eol-last': 'error',
    eqeqeq: ['error', 'smart'],
    'func-call-spacing': 'off',
    'func-name-matching': 'error',
    'func-names': ['error', 'as-needed'],
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'generator-star-spacing': 'error',
    'global-require': 'error',
    'guard-for-in': 'error',
    'handle-callback-err': 'error',
    'id-blacklist': ['error', 'e', 'er', 'cb'],
    'id-length': ['error', { exceptions: ['_', 'i', 'j', 'x', 'y', 'z'], min: 2, properties: 'never' }],
    'import/default': 'error',
    'import/export': 'error',
    'import/namespace': 'error',
    'import/no-duplicates': 'warn',
    'import/no-named-as-default': 'warn',
    'import/no-named-as-default-member': 'warn',
    'import/order': [
      'error',
      {
        alphabetize: { caseInsensitive: true, order: 'asc' },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
    indent: ['error', 2],
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    'line-comment-position': 'error',
    'linebreak-style': ['error', 'unix'],
    'lines-around-comment': 'off',
    'max-depth': ['error', 4],
    'max-lines': [
      'error',
      {
        max: 500,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'max-nested-callbacks': ['error', 4],
    'max-statements': ['error', 25, { ignoreTopLevelFunctions: true }],
    'max-statements-per-line': ['error', { max: 2 }],
    'n/callback-return': ['error', ['callback', 'cb', 'next', 'done']],
    'new-parens': 'error',
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 3 }],
    'no-await-in-loop': 'error',
    'no-caller': 'error',
    'no-confusing-arrow': ['error', { allowParens: true }],
    'no-console': 'off',
    'no-duplicate-imports': 'error',
    'no-else-return': 'error',
    'no-empty-function': 'error',
    'no-eq-null': 'warn',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-extra-parens': ['error', 'functions'],
    'no-floating-decimal': 'error',
    'no-implicit-coercion': 'error',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-iterator': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-mixed-operators': 'error',
    'no-multi-assign': 'error',
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': 'error',
    'no-nested-ternary': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-require': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': 'error',
    'no-path-concat': 'error',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-proto': 'error',
    'no-redeclare': ['error', { builtinGlobals: false }],
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow': ['error', { allow: ['fastify', 'next'], builtinGlobals: true }],
    'no-sync': 'warn',
    'no-tabs': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef-init': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unneeded-ternary': 'error',
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_(?:[0-9]+)?',
        destructuredArrayIgnorePattern: '^_(?:[0-9]+)?',
        ignoreRestSiblings: true,
      },
    ],
    'no-use-before-define': ['error', { functions: false }],
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-void': 'error',
    'no-whitespace-before-property': 'error',
    'nonblock-statement-body-position': 'error',
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
    'object-shorthand': 'error',
    'one-var-declaration-per-line': 'error',
    'operator-assignment': 'error',
    'operator-linebreak': ['error', 'before'],
    'padded-blocks': ['error', 'never'],
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    'prefer-const': 'error',
    'prefer-destructuring': ['error', {
      AssignmentExpression: {
        array: false,
        object: false,
      },
      VariableDeclarator: {
        array: true,
        object: true,
      },
    }, {
      enforceForRenamedProperties: false,
    }],
    'prefer-object-spread': 'warn',
    'prefer-promise-reject-errors': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'quote-props': ['error', 'as-needed'],
    quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
    'require-atomic-updates': 'error',
    'rest-spread-spacing': 'error',
    semi: ['error', 'never'],
    'semi-spacing': 'error',
    'sort-imports': 0,
    'sort-keys-fix/sort-keys-fix': ['error', 'asc'],
    'space-before-blocks': 'error',
    'space-before-function-paren': ['error', { anonymous: 'always', named: 'never' }],
    'space-in-parens': 'error',
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': 'error',
    'symbol-description': 'error',
    'template-curly-spacing': 'error',
    'template-tag-spacing': 'error',
    'valid-jsdoc': 'error',
    'valid-typeof': ['error', { requireStringLiterals: true }],
    'vars-on-top': 'error',
    'wrap-iife': 'error',
    'yield-star-spacing': 'error',
  },
  settings: {
    'import/ignore': ['ora'],
  },
}