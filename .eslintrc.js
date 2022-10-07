/* eslint-disable sort-keys-fix/sort-keys-fix */
const path = require('path')

const restrictedGlobals = require('confusing-browser-globals')
const moduleConfig = require('eslint-plugin-n/lib/configs/recommended-module')
const scriptConfig = require('eslint-plugin-n/lib/configs/recommended-script')
const getPackageJson = require('eslint-plugin-n/lib/util/get-package-json')

const packageJson = getPackageJson()
const isModule = (packageJson && packageJson.type) === 'module'

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

const customScriptConfig = {
  ...scriptConfig,
  rules: {
    'n/no-unpublished-require': 'off',
  },
}

const jsConfigs = [
  { ...(isModule ? customModuleConfig : customScriptConfig), files: ['*.js'] },
  { ...scriptConfig, files: ['*.cjs', '.*.cjs'] },
  { ...customModuleConfig, files: ['*.mjs', '.*.mjs'] },
]

const tsConfigs = {
  extends: [
    'plugin:n/recommended-module',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
  ],

  files: ['*.ts', '*.tsx'],

  parser: '@typescript-eslint/parser',

  parserOptions: {
    project: [
      path.resolve(__dirname, './packages/orchestrator/tsconfig.json'),
      path.resolve(__dirname, './packages/iconic/tsconfig.json'),
      path.resolve(__dirname, './packages/interfaces/tsconfig.json'),
      path.resolve(__dirname, './packages/layout/tsconfig.json'),
      path.resolve(__dirname, './packages/documentation/tsconfig.json'),
    ],
  },

  plugins: ['@typescript-eslint', 'typescript-sort-keys'],

  rules: {
    // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
    'default-case': 'off',
    // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
    'no-dupe-class-members': 'off',
    // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
    'no-undef': 'off',
    'no-duplicate-imports': 'off',
    'no-shadow': 'off',
    'sort-imports': 'off',
    'no-use-before-define': 'off',

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
    '@typescript-eslint/non-nullable-type-assertion-style': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { typedefs: false }],

    'typescript-sort-keys/interface': 'error',
    'typescript-sort-keys/string-enum': 'error',

    'n/no-missing-import': 'off',
    'n/no-unpublished-import': 'off',
  },
}

const reactConfigs = {
  env: {
    browser: true,
  },

  files: ['*.jsx', '*.tsx'],

  plugins: ['react', 'jsx-a11y', 'react-hooks'],

  rules: {
    // http://eslint.org/docs/rules/
    'jsx-quotes': ['error', 'prefer-single'],

    // https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/forbid-foreign-prop-types': ['error', { allowInPropTypes: true }],
    'react/jsx-no-comment-textnodes': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-pascal-case': ['error', { allowAllCaps: true, ignore: [] }],
    'react/no-danger-with-children': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-is-mounted': 'error',
    'react/no-typos': 'error',
    'react/require-render-return': 'error',
    'react/style-prop-object': 'error',
    'react/jsx-no-bind': ['error', { allowArrowFunctions: true, allowBind: false, ignoreRefs: true }],
    'react/no-did-update-set-state': 'error',
    'react/no-unknown-property': 'error',
    'react/no-unused-prop-types': 'error',
    'react/prop-types': 'error',
    'react/react-in-jsx-scope': 'error',
    'react/jsx-sort-props': 'error',

    // https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': ['error', { aspects: ['noHref', 'invalidHref'] }],
    'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-role': ['error', { ignoreNonDOM: true }],
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/iframe-has-title': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/no-access-key': 'error',
    'jsx-a11y/no-distracting-elements': 'error',
    'jsx-a11y/no-redundant-roles': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    'jsx-a11y/scope': 'error',

    // https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
  },

  settings: {
    react: {
      version: 'detect',
    },
  },
}

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
    'max-statements': 'off',
    'no-unused-expressions': 'off',
  },
}

// NOTE: When adding rules here, you need to make sure they are compatible with `typescript-eslint`
module.exports = {
  env: {
    es2022: true,
    mocha: true,
    node: true,
  },

  overrides: [...jsConfigs, tsConfigs, jsonConfigs, testFilesConfigs, reactConfigs],

  parserOptions: { ecmaVersion: 12 },

  plugins: ['import', 'sort-keys-fix', 'mocha'],

  reportUnusedDisableDirectives: true,

  root: true,

  rules: {
    // http://eslint.org/docs/rules/
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
    'constructor-super': 'error',
    curly: 'error',
    'default-case': ['error', { commentPattern: '^skip\\sdefault' }],
    'dot-location': ['error', 'property'],
    'eol-last': 'error',
    eqeqeq: ['error', 'smart'],
    'for-direction': 'error',
    'func-call-spacing': 'off',
    'func-name-matching': 'error',
    'func-names': ['error', 'as-needed'],
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'generator-star-spacing': 'error',
    'getter-return': 'error',
    'global-require': 'error',
    'guard-for-in': 'error',
    'handle-callback-err': 'error',
    'id-blacklist': ['error', 'e', 'er', 'cb'],
    'id-length': ['error', { exceptions: ['_', 'i', 'j', 'x', 'y', 'z'], min: 2, properties: 'never' }],
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
    'new-parens': 'error',
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 3 }],
    'no-array-constructor': 'error',
    'no-async-promise-executor': 'error',
    'no-await-in-loop': 'error',
    'no-caller': 'error',
    'no-case-declarations': 'error',
    'no-class-assign': 'error',
    'no-compare-neg-zero': 'error',
    'no-cond-assign': ['error', 'except-parens'],
    'no-confusing-arrow': ['error', { allowParens: true }],
    'no-console': 'off',
    'no-const-assign': 'error',
    'no-constant-condition': 'error',
    'no-control-regex': 'error',
    'no-debugger': 'error',
    'no-delete-var': 'error',
    'no-dupe-args': 'error',
    'no-dupe-class-members': 'error',
    'no-dupe-else-if': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-duplicate-imports': 'error',
    'no-else-return': 'error',
    'no-empty': 'error',
    'no-empty-character-class': 'error',
    'no-empty-function': 'error',
    'no-empty-pattern': 'error',
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-ex-assign': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-boolean-cast': 'error',
    'no-extra-label': 'error',
    'no-extra-parens': ['error', 'functions'],
    'no-extra-semi': 'error',
    'no-fallthrough': 'error',
    'no-floating-decimal': 'error',
    'no-func-assign': 'error',
    'no-global-assign': 'error',
    'no-implicit-coercion': 'error',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-import-assign': 'error',
    'no-inner-declarations': 'error',
    'no-invalid-regexp': 'error',
    'no-irregular-whitespace': 'error',
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-labels': ['error', { allowLoop: true, allowSwitch: false }],
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-loss-of-precision': 'error',
    'no-misleading-character-class': 'error',
    'no-mixed-operators': [
      'error',
      {
        allowSamePrecedence: false,
        groups: [
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof'],
        ],
      },
    ],
    'no-mixed-spaces-and-tabs': 'error',
    'no-multi-assign': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-multiple-empty-lines': 'error',
    'no-nested-ternary': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-require': 'error',
    'no-new-symbol': 'error',
    'no-new-wrappers': 'error',
    'no-nonoctal-decimal-escape': 'error',
    'no-obj-calls': 'error',
    'no-octal': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': 'error',
    'no-path-concat': 'error',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-proto': 'error',
    'no-prototype-builtins': 'error',
    'no-redeclare': ['error', { builtinGlobals: false }],
    'no-regex-spaces': 'error',
    'no-restricted-globals': ['error'].concat(restrictedGlobals),
    'no-restricted-properties': [
      'error',
      { message: 'Please use import() instead', object: 'require', property: 'ensure' },
      { message: 'Please use import() instead', object: 'System', property: 'import' },
    ],
    'no-restricted-syntax': ['error', 'WithStatement'],
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-script-url': 'error',
    'no-self-assign': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-setter-return': 'error',
    'no-shadow': ['error', { allow: ['fastify', 'next'], builtinGlobals: true }],
    'no-shadow-restricted-names': 'error',
    'no-sparse-arrays': 'error',
    'no-sync': 'error',
    'no-tabs': 'error',
    'no-template-curly-in-string': 'error',
    'no-this-before-super': 'error',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef': 'error',
    'no-undef-init': 'error',
    'no-unexpected-multiline': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unneeded-ternary': 'error',
    'no-unreachable': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': 'error',
    'no-unsafe-optional-chaining': 'error',
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTaggedTemplates: true, allowTernary: true }],
    'no-unused-labels': 'error',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_(?:[0-9]+)?',
        destructuredArrayIgnorePattern: '^_(?:[0-9]+)?',
        ignoreRestSiblings: true,
      },
    ],
    'no-use-before-define': ['error', { functions: false }],
    'no-useless-backreference': 'error',
    'no-useless-call': 'error',
    'no-useless-catch': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-escape': 'error',
    'no-useless-rename': ['error', { ignoreDestructuring: false, ignoreExport: false, ignoreImport: false }],
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-void': 'error',
    'no-whitespace-before-property': 'error',
    'no-with': 'error',
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
    'prefer-object-spread': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'quote-props': ['error', 'as-needed'],
    quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
    'require-atomic-updates': 'error',
    'require-yield': 'error',
    'rest-spread-spacing': ['error', 'never'],
    semi: ['error', 'never'],
    'semi-spacing': 'error',
    'sort-imports': 'off',
    'space-before-blocks': 'error',
    'space-before-function-paren': ['error', { anonymous: 'always', named: 'never' }],
    'space-in-parens': 'error',
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': 'error',
    strict: ['error', 'never'],
    'symbol-description': 'error',
    'template-curly-spacing': 'error',
    'template-tag-spacing': 'error',
    'unicode-bom': ['error', 'never'],
    'use-isnan': 'error',
    'valid-jsdoc': 'error',
    'valid-typeof': ['error', { requireStringLiterals: true }],
    'vars-on-top': 'error',
    'wrap-iife': 'error',
    'yield-star-spacing': 'error',

    // https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
    'import/default': 'error',
    'import/export': 'error',
    'import/namespace': 'error',
    'import/no-duplicates': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'import/order': [
      'error',
      {
        alphabetize: { caseInsensitive: true, order: 'asc' },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],

    // https://github.com/eslint-community/eslint-plugin-n/tree/master/docs/rules
    'n/callback-return': ['error', ['callback', 'cb', 'next', 'done']],

    // https://github.com/leo-buneev/eslint-plugin-sort-keys-fix
    'sort-keys-fix/sort-keys-fix': ['error', 'asc'],
  },

  settings: {
    'import/ignore': ['ora'],
  },
}
