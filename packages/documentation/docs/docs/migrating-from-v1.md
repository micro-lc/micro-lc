---
title: Migrating from V1
description: Migrate from version 1 to version 2 of micro-lc
sidebar_label: Migrating from V1
sidebar_position: 60
---

```mdx-code-block
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
```

This doc guides you through migrating an existing <micro-lc></micro-lc> 1 application to <micro-lc></micro-lc> 2. We try
to make this as easy as possible, and provide a migration CLI.

## Main differences

<<micro-lc></micro-lc> 1 was a React application built as a **vertical micro-frontend orchestrator** (i.e., each 
micro-frontend corresponded to a specific route), which leverages another React application (the 
[element composer](https://github.com/micro-lc/micro-lc-element-composer)) to implement **horizontal micro-frontend 
orchestration** (i.e., page composition). Moreover, <micro-lc></micro-lc> 1 enforced a pre-defined and ever-present
top-bar/sidebar navigation layout.

<micro-lc></micro-lc> 2, rebuilt from the ground up, is a [web component](../api/micro-lc-web-component.md) that
includes both [vertical](./guides/routing.md) and [horizontal](./concepts/composition.md) with a much lower footprint
in terms of bundle size and loading speed. Moreover, <micro-lc></micro-lc> 2 leaves complete flexibility when it comes
to building [layouts](./guides/layout.md), and implements some really useful features like
[internal communication](./concepts/communication.md) and [dependencies sharing](./guides/reuse-third-party-libraries.md).

## Migration process

To obtain a fully functional <micro-lc></micro-lc> 2 application, you firstly need to update <micro-lc></micro-lc>
[Docker image](https://hub.docker.com/r/microlc/micro-lc) version. Remember that the container can now
[be tuned](./getting-started.md#deploy-docker-container) to cover some specific need.

Once the image has been updated, you need to adapt the configuration files to the new structure. Keep in mind that a
[CLI](#automated-migration) is provided to automate this migration, and that you can consult the new configuration
[JSON schema](https://raw.githubusercontent.com/micro-lc/micro-lc/v2/main/packages/interfaces/schemas/v2/config.schema.json)
for reference.

:::tip
We provide a [backend service](../add-ons/backend/servo.md) to serve configurations with ACL and references resolution
utilities.
:::

<micro-lc></micro-lc> 1 needed two configuration files to define its registered micro-frontend, theming options, and
layout preferences. In addition to them, it needed a configuration file for each plugin implementing the element
composer for dynamic page composition.

#### `authentication.json`

This file contained instructions on how to retrieve current user information and handle logout operations. This file
is not needed in <micro-lc></micro-lc> 1 as its content can be moved in 
[`userMenu`](../add-ons/components/mlc-layout.md#usermenu) key of default layout configuration.

#### `configuration.json`

This file contained the core configuration of the application, namely its plugins, theming, and addons. Its content can
be transferred in <micro-lc></micro-lc> 2 [configuration file](../api/micro-lc-web-component.md#configuration). The main
differences can be roughly outlined as:

- <micro-lc></micro-lc> 1 plugins became [application](../api/micro-lc-web-component.md#applications) definitions and
– possibly – layout [menu items](../add-ons/components/mlc-layout.md#menuitem).
- <micro-lc></micro-lc> 1 internal plugins became [application](../api/micro-lc-web-component.md#applications) 
definitions, but do not appear on the layout.
- initial loading animation must be [added](../add-ons/components/mlc-loading-animation.md) on your `index.html` file.
- <micro-lc></micro-lc> 1 right menu can be inserted in default layout [slot](../add-ons/components/mlc-layout.md#slots). 
- <micro-lc></micro-lc> 1 theming configurations are spread in default layout 
[properties](../add-ons/components/mlc-layout.md#properties-and-attributes).

#### Element composer configurations

While you can still use the element composer registering it as a [parcel](./guides/applications/parcels.md) (in which
case configuration files stays the same), <micro-lc></micro-lc> 2 offers 
[composition functionalities](./concepts/composition.md) out of the box.

To use them, just register the applications as [compose](./guides/applications/compose.md) and tweak the configuration
files accordingly. The main differences can be roughly outlined as:

- custom elements sources are put together in `sources` properties.
- <micro-lc></micro-lc> 1 `busDiscriminator` property is converted into a named 
[`eventBus`](./guides/applications/compose.md#eventbus).
- <micro-lc></micro-lc> 1 rows and columns are converted into `<div>` with appropriate styling.
- `$ref` property becomes `definitions` to align to JSON schema standard notation, and references in content changes from
  ```json
  {
    "$ref": {
      "referencesString": "bar"
    },
    "foo": {
      "$ref": "referencesString"
    }
  }
  ```
  to
  ```json
  {
    "definitions": {
      "referencesString": "bar"
    },
    "foo": {
      "$ref": "#/definitions/referencesString"
    }
  }
  ```

## Automated migration

The migration CLI can be used to automatically translate an application configurations from <micro-lc></micro-lc> 1 to 
<micro-lc></micro-lc> 2.

```mdx-code-block
<Tabs groupId="pkg-manager">
<TabItem value="npm" label="npm" default>
```
```shell
npx @micro-lc/servo <args>
```
```mdx-code-block
</TabItem>
<TabItem value="yarn" label="yarn 2+">
```
```shell
yarn dlx @micro-lc/servo <args>
```
```mdx-code-block
</TabItem>
</Tabs>
```

The CLI operates in two modes, [config](#config-mode) to translate old `authentication.json` and `configuration.json`
files to the new configuration file, and [compose](#compose-mode) to translate old element composer configuration
files to new [compose applications](./guides/applications/compose.md) configurations.

The mode can be specified with flag `-m (--mode)` which can have value `config` (default) or `compose`.

### Config Mode

To invoke the CLI in this mode, it has to receive **exactly two args**, namely the absolute or relative path to
`authentication.json` file **followed** by the absolute or relative path to `configuration.json` file.

```mdx-code-block
<Tabs groupId="pkg-manager">
<TabItem value="npm" label="npm" default>
```
```shell
npx @micro-lc/servo --mode config <path_to_authentication.json_file> <configuration.json_file>
```
```mdx-code-block
</TabItem>
<TabItem value="yarn" label="yarn 2+">
```
```shell
yarn dlx @micro-lc/servo --mode config <path_to_authentication.json_file> <configuration.json_file>
```
```mdx-code-block
</TabItem>
</Tabs>
```

Available options are the following.

#### `dir (-d)`

```mdx-code-block
<div style={{paddingLeft: '1em'}}>
```
* Type: `string`

Absolute or relative path of the output directory. The output file will be called `config.json`. If the specified
directory does not exist, **it will be created**.

If no output dir is specified, the resulting file **will be printed in standard output**.
```mdx-code-block
</div>
```

#### `elementComposerUrlRegex (-e)`

```mdx-code-block
<div style={{paddingLeft: '1em'}}>
```
* Type: `RegExp`

This option can be used to identify <micro-lc></micro-lc> 1 plugins the uses the element composer and have to be
converted in <micro-lc></micro-lc> 2 compose applications.

The regex specified with this option will be run against the `pluginUrl` of each plugin with integration mode `qiankun`.
So, for example, if you have a plugin lke this:

```json5
{
  "id": "my-element-composer-plugin",
  "integrationMode": "qiankun",
  "pluginRoute": "/foo",
  // highlight-next-line
  "pluginUrl": "/element-composer/"
}
```

and you want it to be transformed in a `compose` application, the cli invocation would be

```mdx-code-block
<Tabs groupId="pkg-manager">
<TabItem value="npm" label="npm" default>
```
```shell
npx @micro-lc/servo --m config -e "/element-composer/" <path_to_authentication.json_file> <configuration.json_file>
```
```mdx-code-block
</TabItem>
<TabItem value="yarn" label="yarn 2+">
```
```shell
yarn dlx @micro-lc/servo --m config -e "/element-composer/" <path_to_authentication.json_file> <configuration.json_file>
```
```mdx-code-block
</TabItem>
</Tabs>
```
```mdx-code-block
</div>
```

For compatibility reasons, the config URL of `compose` applications is set to 
`/api/v1/microlc/configuration/${oldPlugin.props.configurationName}.json`. After the conversion, remember to change it
accordingly to your specific setup. 

### Compose Mode

The CLI invoked in this mode can receive as many arguments as you want, each of them being a relative or absolute path
(**glob syntax can be used**) resolving to one or more files to be converted.

```mdx-code-block
<Tabs groupId="pkg-manager">
<TabItem value="npm" label="npm" default>
```
```shell
npx @micro-lc/servo --mode compose <paths_to_files...>
```
```mdx-code-block
</TabItem>
<TabItem value="yarn" label="yarn 2+">
```
```shell
yarn dlx @micro-lc/servo --mode compose <paths_to_files...>
```
```mdx-code-block
</TabItem>
</Tabs>
```

Available options are the following.

#### `dir (-d)`

```mdx-code-block
<div style={{paddingLeft: '1em'}}>
```
* Type: `string`

Absolute or relative path of the output directory. The output files will be called as the respective input. If the
specified directory does not exist, **it will be created**.

If no output dir is specified, the resulting files **will be printed in standard output**.
```mdx-code-block
</div>
```
