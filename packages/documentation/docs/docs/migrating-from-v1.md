---
title: Migrating from V1
description: Migrate from version 1 to version 2 of micro-lc
sidebar_label: Migrating from V1
sidebar_position: 60
---

```mdx-code-block
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
import CodeBlock from '@theme-original/CodeBlock'
```

:::caution
This section is work in progress.
:::

<micro-lc></micro-lc> version 2 relaxes some choices made during version 1 development. Primarly, 
the layout/content separation of concerns imposes a strong reframing of the main configuration file but,
fear not, a **CLI comes to the rescue**.

## v1 API

In your production enviroment you might have a web-server or a generic service to provide configuration.
Moreover version 1 strictly depended on a [config manager microservice](https://github.com/micro-lc/micro-lc/tree/main/packages/be-config)
and also enforced a default `api` to be called to retrieve `configuration.json`, `authentication.json` and composer plugin configuraitions.

Such api was:

- `configuration` -> `/api/v1/microlc/configuration`
- `authentication` -> `/api/v1/microlc/authentication`
- any field `configurationName` as `props` key of any plugin -> `/api/v1/microlc/configuration/<configurationName>`

### Authentication

The authentication API does not make sense anymore since configure a user interface can be done wherever you'd like:
the default layout plugin [`mlc-layout`](../add-ons/components/mlc-layout.md) gets you covered and provides backward
compatibility by tuning the [user menu](../add-ons/components/mlc-layout#user-menu)

### Configuration

[Version 1](https://unpkg.com/@micro-lc/interfaces@latest/schemas/v1/config.schema.json) and
[Version 2](https://unpkg.com/@micro-lc/interfaces@latest/schemas/v2/config.schema.json) configurations are checked against their own JSON schemas and roughly
the differences can be outlined as:

- plugins/internal plugins -> [applications](./guides/applications) (definitions) and possibly [layout](../add-ons/components/mlc-layout#menuitem) configuration (menu links)
- initial loading animation must be [added](http://localhost:3000/micro-lc/add-ons/components/mlc-loading-animation) on your `index.html` file
- rightMenu -> [slotted area](../add-ons/components/mlc-layout.md#slots) on top of the default layout
- theming -> layout configurations

## CLI

To provide a smooth transation all v1 config files can be updated via a `CLI` provided within the library [`@micro-lc/servo`](https://github.com/micro-lc/servo) as
a standalone binary with the following syntax:

```mdx-code-block
<Tabs>
<TabItem value="0" label="npm" default>
```
```shell
npx @micro-lc/servo <args>
```
```mdx-code-block
</TabItem>
<TabItem value="1" label="yarn 2+">
```
```shell
yarn dlx @micro-lc/servo <args>
```
```mdx-code-block
</TabItem>
</Tabs>
```

The `@micro-lc/servo` cli provides to modes

- `config` -> _(default mode)_ with flag `-m config`
- `compose` -> with flag `-m compose`

### Config Mode

The config mode translates `authentication` and `configuration` files to the new v2 config by
invoking

```shell
npx @micro-lc/servo authentication.json configuration.json
```

where `authentication.json` and `configuration.json` are the paths to
your v1 configuration files

:::caution
In Config Mode the order is **strict**:
authentication file must come first, then the configuration file
:::

In version 1 the composition plugin was located outside of `micro-lc`, hence v1 plugins
with `integrationMode` `qiankun` that used the [`element-composer`](https://github.com/micro-lc/micro-lc-element-composer)
must be remapped to `integrationMode` `compose` in version 2 configuration.

Usually version 1 `element-composer` was invoked by specifying, on each plugin,
the url where the plugin was located

```json5
{
  "pluginUrl": "/element-composer/"
}
```

that's the only way the CLI can identify composable plugins. There's a flag on the key, 
in `compose` mode to explicitly pass the `pluginUrl` to track. For instance:

```shell
npx @micro-lc/servo -e '/element-composer/' authentication.json configuration.json
```

### Compose Mode

The CLI provides a conversion tool by invoking:

```shell
npx @micro-lc/servo <config files>
```
