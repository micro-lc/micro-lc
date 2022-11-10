---
title: 🖼 mlc-layout
description: Top bar/sidebar navigation layout
sidebar_label: 🖼 mlc-layout
sidebar_position: 10
---

Web component providing a classic navigation top bar/sidebar layout for <micro-lc></micro-lc> applications.

```mdx-code-block
<></>
<example-frame
  base="../../frames/components/mlc-layout"
  height="550px"
  showSource={false}
  src={"/"}
  title="mlc-layout"
></example-frame>
```

## Usage

:::caution
This component is intended to be used inside <micro-lc></micro-lc>, since it makes use of <micro-lc></micro-lc>
[API](../../api/micro-lc-api).

You **can** use it standalone, but you will have to manually provide a matching API with the property `microlcApi`.
:::

The component can be sourced from
[jsDelivr CDN](https://cdn.jsdelivr.net/npm/@micro-lc/layout@latest/dist/mlc-layout.js).

To use the component in <micro-lc></micro-lc>, declare it as part of the application [layout](../../docs/guides/layout.md)
with its [properties and attributes](#properties-and-attributes). An unnamed `<slot>` is already set in the component so
that content will be [automatically mounted](../../docs/guides/layout.md#slotting) in the right position.

```yaml title=micro-lc.config.yaml
layout: 
  sources: https://cdn.jsdelivr.net/npm/@micro-lc/layout@latest/dist/mlc-layout.js
  content: 
    tag: mlc-layout
    properties: # See properties & attributes table below
    attributes: # See properties & attributes table below
    booleanAttributes: # See properties & attributes table below
    content: # See slots table below
```

### Minified version

The component is also shipped in a minified version, that does not bundle peer dependencies. Using this version will
save bundle size, but requires [import maps](../../docs/guides/reuse-third-party-libraries.md#import-maps) for the needed
dependencies, which are:
- `react` compatible with version `18.2.0`
- `react-dom` compatible with version `18.2.0`

```yaml title=micro-lc.config.yaml
layout:
  sources:
    importmap:
      imports:
        react: https://esm.sh/react@18.2.0
        react-dom: https://esm.sh/react-dom@18.2.0
      scopes:
        https://esm.sh/react-dom@next:
          /client: https://esm.sh/react-dom@18.2.0/client
    uris:
      - https://cdn.jsdelivr.net/npm/@micro-lc/layout@latest/dist/mlc-layout.min.js
  content:
    tag: mlc-layout
    # ...
```

## Showcase

### Top bar menu

```mdx-code-block
<></>
<example-frame
  base="../../frames/components/mlc-layout/showcase-top-bar"
  height="550px"
  sourceTabs={[
    { filePath: "/index.html" },
    { filePath: "/config.yaml", isDefault: true },
  ]}
  src="/"
  title="Top bar menu"
></example-frame>
```

### Overlay sidebar

```mdx-code-block
<></>
<example-frame
  base="../../frames/components/mlc-layout/showcase-overlay-sidebar"
  height="550px"
  sourceTabs={[
    { filePath: "/index.html" },
    { filePath: "/config.yaml", isDefault: true },
  ]}
  src="/"
  title="Overlay sidebar"
></example-frame>
```

### Fixed sidebar

```mdx-code-block
<></>
<example-frame
  base="../../frames/components/mlc-layout/showcase-fixed-sidebar"
  height="550px"
  sourceTabs={[
    { filePath: "/index.html" },
    { filePath: "/config.yaml", isDefault: true },
  ]}
  src="/"
  title="Fixed sidebar"
></example-frame>
```

### User menu

```mdx-code-block
<></>
<example-frame
  base="../../frames/components/mlc-layout/showcase-user-menu"
  height="550px"
  sourceTabs={[
    { filePath: "/index.html" },
    { filePath: "/config.yaml", isDefault: true },
    { filePath: "/userinfo.json" },
  ]}
  src="/"
  title="User menu"
></example-frame>
```

### Help menu

```mdx-code-block
<></>
<example-frame
  base="../../frames/components/mlc-layout/showcase-help-menu"
  height="550px"
  sourceTabs={[
    { filePath: "/index.html" },
    { filePath: "/config.yaml", isDefault: true },
  ]}
  src="/"
  title="Help menu"
></example-frame>
```

### Top bar slot

```mdx-code-block
<></>
<example-frame
  base="../../frames/components/mlc-layout/showcase-top-bar-slot"
  height="550px"
  sourceTabs={[
    { filePath: "/index.html" },
    { filePath: "/config.yaml", isDefault: true },
  ]}
  src="/"
  title="Top bar slot"
></example-frame>
```

## Properties & attributes {#properties-and-attributes}

|  Property   | Attribute |                             Type                              |     Default      | Description                              |
|:-----------:|:---------:|:-------------------------------------------------------------:|:----------------:|------------------------------------------|
|   `mode`    |  `mode`   | <code>fixedSideBar &#124; overlaySideBar &#124; topBar</code> | `overlaySideBar` | How the layout will be structured        |
| `menuItems` |     -     |        <code><a href="#menuitem">MenuItem[]</a></code>        |   **Required**   | Menu configuration                       |
|   `logo`    |     -     |             <code><a href="#logo">Logo</a></code>             |                  | Customization of the logo object         |
| `helpMenu`  |     -     |         <code><a href="#helpmenu">HelpMenu</a></code>         |        -         | Configuration of the help menu           |
| `userMenu`  |     -     |         <code><a href="#usermenu">UserMenu</a></code>         |        -         | Configuration of the user menu           |
|   `head`    |     -     |             <code><a href="#head">Head</a></code>             |        -         | Configuration for the HTML document head |

<h3 id="menuitem"><code>MenuItem</code></h3>

<code>
type MenuItem = <a href="#hrefmenuitem">HrefMenuItem</a> | <a href="#applicationmenuitem">ApplicationMenuItem</a> | <a href="#categorymenuitem">CategoryMenuItem</a> | <a href="#groupmenuitem">GroupMenuItem</a>
</code>

#### `HrefMenuItem`

Link to specific url.

| Property |                                 Type                                  |                             Default                              | Description                                                                                             |
|:--------:|:---------------------------------------------------------------------:|:----------------------------------------------------------------:|---------------------------------------------------------------------------------------------------------|
|  `href`  |                          <code>string</code>                          |                           **Required**                           | Link's destination                                                                                      |
|  `icon`  |                 <code><a href="#icon">Icon</a></code>                 | [Ant Design](https://ant.design/components/icon/) `LinkOutlined` | Icon icon of the menu item                                                                              |
|   `id`   |                          <code>string</code>                          |                           **Required**                           | Unique identifier of the menu item                                                                      |
| `label`  | <code>string &#124; <a href="#localizedtext">LocalizedText</a></code> |                        Value of `id` prop                        | Menu label                                                                                              |
| `target` |      <code>_blank &#124; _self &#124; _parent &#124; _top</code>      |                             `_self`                              | HTML anchor [target attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target) |
|  `type`  |                                `href`                                 |                           **Required**                           | Type of the item: hyperlink to another page                                                             |

#### `ApplicationMenuItem`

This type of menu items triggers the navigation to a specific <micro-lc></micro-lc> application, identified by the `id` prop.

| Property |                                 Type                                  |                                  Default                                   | Description                                                                                                                            |
|:--------:|:---------------------------------------------------------------------:|:--------------------------------------------------------------------------:|----------------------------------------------------------------------------------------------------------------------------------------|
|  `icon`  |                 <code><a href="#icon">Icon</a></code>                 | [Ant Design](https://ant.design/components/icon/) `DeploymentUnitOutlined` | Icon icon of the menu item                                                                                                             |
|   `id`   |                          <code>string</code>                          |                                **Required**                                | Unique identifier of the menu item. It **must** match the id of the <micro-lc></micro-lc> application the menu item should navigate to |
| `label`  | <code>string &#124; <a href="#localizedtext">LocalizedText</a></code> |                             Value of `id` prop                             | Menu label                                                                                                                             |
|  `type`  |                             `application`                             |                                **Required**                                | Type of the item: <micro-lc></micro-lc> application                                                                                    |

#### `CategoryMenuItem`

This type of menu items is a container of other items. You can stack virtually any number of categories.

|  Property  |                                 Type                                  |                                Default                                | Description                          |
|:----------:|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|--------------------------------------|
| `children` |             <code><a href="#menuitem">MenuItem</a></code>             |                                  []                                   | Content of the category              |
|   `icon`   |                 <code><a href="#icon">Icon</a></code>                 | [Ant Design](https://ant.design/components/icon/) `ContainerOutlined` | Icon icon of the menu item           |
|    `id`    |                          <code>string</code>                          |                             **Required**                              | Unique identifier of the menu item.  |
|  `label`   | <code>string &#124; <a href="#localizedtext">LocalizedText</a></code> |                          Value of `id` prop                           | Menu label                           |
|   `type`   |                              `category`                               |                             **Required**                              | Type of the item: container of items |

#### `GroupMenuItem`

:::caution
Groups **cannot** be used at first level when mode is `topBar`.
:::

This type of menu items is a grouping of other items.

|  Property  |                                 Type                                  |                                Default                                | Description                         |
|:----------:|:---------------------------------------------------------------------:|:---------------------------------------------------------------------:|-------------------------------------|
| `children` |             <code><a href="#menuitem">MenuItem</a></code>             |                                  []                                   | Content of the group                |
|    `id`    |                          <code>string</code>                          |                             **Required**                              | Unique identifier of the menu item. |
|  `label`   | <code>string &#124; <a href="#localizedtext">LocalizedText</a></code> |                          Value of `id` prop                           | Menu label                          |
|   `type`   |                                `group`                                |                             **Required**                              | Type of the item: group of items    |

#### `Icon`

Definition of a dynamically loaded icon.

|  Property  |                                                          Type                                                          |   Default    | Description                                      |
|:----------:|:----------------------------------------------------------------------------------------------------------------------:|:------------:|--------------------------------------------------|
| `library`  | <code>@ant-design/icons-svg &#124; @fortawesome/free-regular-svg-icons &#124; @fortawesome/free-solid-svg-icons</code> | **Required** | Library from witch the icon is pulled            |
| `selector` |                                                  <code>string</code>                                                   | **Required** | Name of the icon according to the chosen library |

#### `LocalizedText`

Definition of a translatable text through a map linking [rfc5646 language codes](https://datatracker.ietf.org/doc/html/rfc5646)
to localized strings.

```typescript
type LocalizedText = Record<string, string>
```

<h3 id="logo"><code>Logo</code></h3>

The logo will be rendered in the left corner of the top bar, regardless of the `mode`.

You can specify where to navigate when the logo is clicked. If it is an external link, it will open in a new tab. If
no value is provided, the logo will not be clickable.

|   Property    |        Type         |   Default    | Description                                          |
|:-------------:|:-------------------:|:------------:|------------------------------------------------------|
|   `altText`   | <code>string</code> |    `Logo`    | Alternative text to display if the logo is not found |
| `onClickHref` | <code>string</code> |      -       | Link to navigate to when the logo is clicked         |
|     `url`     | <code>string</code> | **Required** | URL to the logo image                                |

<h3 id="helpmenu"><code>HelpMenu</code></h3>

The help menu will be rendered in the right portion of the top bar, regardless of the `mode`.

You can specify where to navigate when the button is clicked. The link will always be opened in a new tab.

|  Property  |        Type         |   Default    | Description                                         |
|:----------:|:-------------------:|:------------:|-----------------------------------------------------|
| `helpHref` | <code>string</code> | **Required** | Link to navigate to when the help button is clicked |

<h3 id="usermenu"><code>UserMenu</code></h3>

The user menu will be rendered in the right corner of the top bar, displaying name and avatar of the user. If `logout`
property is provided, a menu from which the user can log out will also be rendered.

User data are retrieved with a GET call to `userInfoUrl`. Among these information, the menu utilizes `name` (required,
otherwise the menu will not be rendered) and `avatar`. If `userInfoUrl` returns those properties with different name,
`userPropertiesMapping` can be used to adapt the keys of the response to the ones used by the menu.

For example, the following response

```json
{
  "fullName": "John Doe",
  "image": "https://avatar.com"
}
```

has to be accompanied by the following `userPropertiesMapping` property

```json
{
  "fullName": "name",
  "image": "avatar"
}
```

|        Property         |                                  Type                                   |   Default    | Description                                                                                                |
|:-----------------------:|:-----------------------------------------------------------------------:|:------------:|------------------------------------------------------------------------------------------------------------|
|        `logout`         |        <code><a href="#usermenulogout">UserMenuLogout</a></code>        |      -       | Configuration needed to perform user logout                                                                |
|      `userInfoUrl`      |                           <code>string</code>                           | **Required** | URL called in GET to retrieve user data                                                                    |
| `userPropertiesMapping` | <code><a href="#userpropertiesmapping">UserPropertiesMapping</a></code> |      -       | Mapping between the properties returned from the user info URL call and the ones expected by the component |

#### `UserMenuLogout`

Configurations regarding how the user should be logged out.

If the `url` property is specified, a call with `method` to `url` will be performed. If the call is successful, a
redirection will be performed to `redirectUrl` (if present). The properties are independent: if `url` is not given, but 
`redirectUrl` is, the redirection will still be performed.

:::tip
We advise to use `POST` as method, since using `GET` will make browsers pre-fetch pages they should not.
:::

|   Property    |             Type             | Default | Description                                                                |
|:-------------:|:----------------------------:|:-------:|----------------------------------------------------------------------------|
|   `method`    | <code>GET &#124; POST</code> | `POST`  | Method used to perform the call to the URL specified in the `url` property |
| `redirectUrl` |     <code>string</code>      |    -    | URL to be redirected to after the logout                                   |
|     `url`     |     <code>string</code>      |    -    | URL called to log out the user                                             |

#### `UserPropertiesMapping`

```typescript
type UserPropertiesMapping = Record<string, 'name' | 'avatar' | string>
```

<h3 id="head"><code>Head</code></h3>

Information used by <micro-lc></micro-lc> to manipulate the head of the document.

|   Property   |        Type         | Default | Description         |
|:------------:|:-------------------:|:-------:|---------------------|
| `favIconUrl` | <code>string</code> |    -    | Url of the fav icon |
|   `title`    | <code>string</code> |    -    | Title of the tab    |

## Slots

|   Name    | Description                                        |
|:---------:|----------------------------------------------------|
| `top-bar` | Content is placed on the right side of the top bar |

## CSS custom properties

This component is based on [Ant Design](https://ant.design/) and makes use of its
[dynamic theme](https://ant.design/docs/react/customize-theme-variable) functionality to expose a set of CSS variables
for style customization. 

Follows the list of CSS variables used by Ant Design dynamic theme. The exact usage of each variable is hidden in Ant
Design components implementations and some of them may not be used by `mlc-layout`.

:::tip
We recommend using [mlc-antd-theme-manager](./mlc-antd-theme-manager.md) component to customize the layout theme in an
easier and more organic way.
:::

| Name                                              |
|:--------------------------------------------------|
| `--micro-lc-primary-1`                            |
| `--micro-lc-primary-2`                            |
| `--micro-lc-primary-3`                            |
| `--micro-lc-primary-4`                            |
| `--micro-lc-primary-5`                            |
| `--micro-lc-primary-6`                            |
| `--micro-lc-primary-7`                            |
| `--micro-lc-primary-8`                            |
| `--micro-lc-primary-9`                            |
| `--micro-lc-primary-10`                           |
| `--micro-lc-primary-color`                        |
| `--micro-lc-primary-color-active`                 |
| `--micro-lc-primary-color-active-deprecated-d-02` |
| `--micro-lc-primary-color-active-deprecated-f-30` |
| `--micro-lc-primary-color-deprecated-bg`          |
| `--micro-lc-primary-color-deprecated-border`      |
| `--micro-lc-primary-color-deprecated-f-12`        |
| `--micro-lc-primary-color-deprecated-l-20`        |
| `--micro-lc-primary-color-deprecated-l-35`        |
| `--micro-lc-primary-color-deprecated-t-20`        |
| `--micro-lc-primary-color-deprecated-t-50`        |
| `--micro-lc-primary-color-disabled`               |
| `--micro-lc-primary-color-hover`                  |
| `--micro-lc-primary-color-outline`                |
| `--micro-lc-success-color`                        |
| `--micro-lc-success-color-active`                 |
| `--micro-lc-success-color-deprecated-bg`          |
| `--micro-lc-success-color-deprecated-border`      |
| `--micro-lc-success-color-disabled`               |
| `--micro-lc-success-color-hover`                  |
| `--micro-lc-success-color-outline`                |
| `--micro-lc-info-color`                           |
| `--micro-lc-info-color-active`                    |
| `--micro-lc-info-color-deprecated-bg`             |
| `--micro-lc-info-color-deprecated-border`         |
| `--micro-lc-info-color-disabled`                  |
| `--micro-lc-info-color-hover`                     |
| `--micro-lc-info-color-outline`                   |
| `--micro-lc-warning-color`                        |
| `--micro-lc-warning-color-active`                 |
| `--micro-lc-warning-color-deprecated-bg`          |
| `--micro-lc-warning-color-deprecated-border`      |
| `--micro-lc-warning-color-disabled`               |
| `--micro-lc-warning-color-hover`                  |
| `--micro-lc-warning-color-outline`                |
| `--micro-lc-error-color`                          |
| `--micro-lc-error-color-active`                   |
| `--micro-lc-error-color-deprecated-bg`            |
| `--micro-lc-error-color-deprecated-border`        |
| `--micro-lc-error-color-disabled`                 |
| `--micro-lc-error-color-hover`                    |
| `--micro-lc-error-color-outline`                  |
| `--micro-lc-font-family`                          |

## micro-lc API

### Reactive state object

The component [inserts](../../api/micro-lc-api/reactive-communication.md#set) the following values in the reactive state
of <micro-lc></micro-lc> API.

|  Key   |           Type            | Description                                                  |
|:------:|:-------------------------:|--------------------------------------------------------------|
| `user` | `Record<string, unknown>` | User data retrieved with call to [`userInfoUrl`](#usermenu). |
