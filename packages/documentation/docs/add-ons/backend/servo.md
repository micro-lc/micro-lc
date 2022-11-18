---
title: 🛠 Servo
description: Configurations service station
sidebar_label: 🛠 Servo
sidebar_position: 10
---

```mdx-code-block
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
```

**Servo** is a backend middleware responsible for serving <micro-lc></micro-lc> configuration files, applying
some useful [parsing logic](#configurations-parsing) before returning their content. This logic is also distributed
through an [SDK](#sdk) to ease the process of building custom configurations serves.

## Usage

Servo is available as a Docker image on [Dockerhub](https://hub.docker.com/r/microlc/servo).

### Environment variables

Servo it built using Mia-Platform's [custom-plugin-lib](https://github.com/mia-platform/custom-plugin-lib), hence it
needs the environment variables outlined in the 
[library documentation](https://github.com/mia-platform/custom-plugin-lib#environment-variables-configuration).

On top of those, Servo accepts the following environment variables:

|            Name            |   Type   | Required | Description                                                                                 |
|:--------------------------:|:--------:|:--------:|---------------------------------------------------------------------------------------------|
| `RESOURCES_DIRECTORY_PATH` | `string` |    ✔     | Absolute path of the [directory](#serve-from-file-system) containing resources to be served |

### Serving from file system

Configuration files are loaded from file system. In particular, Servo searches in the directory specified with the
`RESOURCES_DIRECTORY_PATH` [environment variable](#environment-variables) for JSON (`.json`) and YAML (`.yaml` or `.yml`)
files (even in subdirectories) and exposes a route for each of them.

:::caution
Since routes are created at service startup, adding or removing files will **not change the exposes routes** until the
service is restarted.

However, since Servo reloads a file each time its corresponding route is called, any change to the content of a file 
**will be immediately reflected** without need of restarting the service.
:::

For example, given a directory with the following structure:

```text
├── config.json
├── orders-config.yaml
└── user-pages
    ├── customers-config.yml
    └── admin-config.json
```

Servo will expose the following routes:

```text
GET - /config.json
GET - /orders-config.yaml
GET - /user-pages/customers-config.yml
GET - /user-pages/admin-config.json
```

JSON files will be returned with `Content-Type` header set to `application/json`, while YAML files will have
`Content-Type` header set to `text/yaml`.

## Configurations parsing

Before returning a request file, Servo applies some parsing logics to its content.

### ACL application

Servo allows you to implement **access control limit** on served files, removing sections of configurations based on
certain properties of the caller. Namely, Servo considers caller's **groups** and **permissions**.

Caller's **groups** are extracted from request headers, particularly from the header the key of which is specified through
`GROUPS_HEADER_KEY` [environment variable](#environment-variables). The value of the header should be a comma-separated
list of groups (e.g., `"admin,user"`).

Caller's **permissions** are extracted from request headers too. Servo takes the header the key of which is specified
through `USER_PROPERTIES_HEADER_KEY` [environment variable](#environment-variables) and expects a stringified JSON
object containing a comma-separated list of permissions under the key `permissions` (e.g.,
`"{\"permissions\":"api.users.get,api.users.post"}"`).

ACL expressions can be specified anywhere in configuration using the special key `aclExpression` having as value a
**stringified boolean expression** based on caller's groups and permissions (e.g., 
`groups.admin || permissions.api.users.get`).

:::tip
You can use any combination of groups, permissions and JavaScript operators in you ACL expressions.

For example, the following expressions are all valid:
* `groups.admin && permissions.api.users.get`
* `!groups.developer`
* `permissions.api.users.get || permissions.api.users.post`
* `(groups.admin && !permissions.api.users.post) || permissions.api.users.count.get`
* `(groups.admin === true && permissions.api.users.post === true)`
:::

Servo evaluates each ACL expression against caller's properties and, if the expression results in a `falsy value`, it
removes from the configuration the **whole object** which the expression is a property of. It then proceeds to remove
any `aclExpression` key left over to not leak server-side logic into the client.

#### Example

Let's consider the following configuration file served under `GET - /servo/config.json`.

```json
{
  "content": {
    "tag": "div",
    "properties": {
      // highlight-next-line
      "aclExpression": "groups.admin",
      "adminName": "John Doe"
    },
    "content": [
      {
        // highlight-next-line
        "aclExpression": "groups.superadmin || permissions.api.users.get",
        "tag": "button"
      }
    ]
  }
}
```

The response of the following request

```shell
curl 'https://*********/servo/config.json' \
  -H 'user-groups: user' \
  -H 'user-properties: { "permissions": "api.users.get" }'
```

will be

```json
{
  "content": {
    "tag": "div",
    "content": [
      {
        "tag": "button"
      }
    ]
  }
}
```

### References resolution

In order to avoid writing repeating values multiple times in your configurations, Servo supports references resolutions
following [JSON schema specification](https://json-schema.org/understanding-json-schema/structuring.html#ref). In
particular, if you need to repeat the same value in various places of your configuration, you can **define it once** in
the dedicated top-level key `definitions`, and then **references it** wherever you like using the keyword `$ref` (e.g.,
`{ "dataSchema": { "$ref": "#/definitions/dataSchema" }}`).

Servo will resolve references in files and will remove the key `definitions` (if any) before serving them. Keep in mind
that Servo **will throw** if some references cannot be resolved.

#### Example

Let's consider the following configuration file served under `GET - /servo/config.json`.

```json
{
  "definitions": {
    "clientKey": "some-client-key"
  },
  "content": {
    "tag": "div",
    "properties": {
      "clientKey": {
        // highlight-next-line
        "$ref": "#/definitions/clientKey"
      }
    },
    "content": [
      {
        "tag": "button",
        "properties": {
          "clientKey": {
            // highlight-next-line
            "$ref": "#/definitions/clientKey"
          }
        }
      }
    ]
  }
}
```

The response of the following request

```shell
curl 'https://*********/servo/config.json'
```

will be

```json
{
  "definitions": {
    "clientKey": "some-client-key"
  },
  "content": {
    "tag": "div",
    "properties": {
      // highlight-next-line
      "clientKey": "some-client-key"
    },
    "content": [
      {
        "tag": "button",
        "properties": {
          // highlight-next-line
          "clientKey": "some-client-key"
        }
      }
    ]
  }
}
```

## SDK

The logic under [ACL application](#acl-application) and [references resolution](#references-resolution) is conveniently
shipped in a standalone SDK to ease the implementation of alternative backend solutions.

### Usage

You can install the SDK from NPM

```mdx-code-block
<Tabs groupId="pkg-manager">
<TabItem value="npm" label="npm" default>
```
```shell
npm install @micro-lc/servo/sdk
```
```mdx-code-block
</TabItem>
<TabItem value="yarn" label="yarn">
```
```shell
yarn add @micro-lc/servo/sdk
```
```mdx-code-block
</TabItem>
</Tabs>
```

and import it in your files

```mdx-code-block
<Tabs groupId="module">
<TabItem value="common-js" label="CommonJS" default>
```
```javascript
const servoSdk = require('@micro-lc/servo/sdk')
```
```mdx-code-block
</TabItem>
<TabItem value="modules" label="ECMAScript modules">
```
```javascript
import * as servoSdk from '@micro-lc/servo/sdk'
```
```mdx-code-block
</TabItem>
</Tabs>
```

### Methods

#### `evaluateAcl(json, userGroups, userPermissions)`

```javascript
const result = resolveReferences(json, userGroups, userPermissions)
```

This method [evaluates](#acl-application) `aclExpression` keys in input JSON. It does not modify the input object.

**Parameters**

* `json: string | number | boolean | object | unknown[] | null`
  <br/>
  Input JSON with ACL rules to be evaluated.
* `userGroups: string[]`
  <br/>
  List of caller's groups.
* `userPermissions: string[]`
  <br/>
  List of caller's permissions.

**Return value**

* `Promise<string | number | boolean | object | unknown[] | null>`
  <br/>
  JSON with ACL rules evaluated.

#### `resolveReferences(json)`

```javascript
const result = await resolveReferences(json)
```

This method [resolves](#references-resolution) the references in a JSON object. It does not modify the input object.

The method **throws** if a reference cannot be found.

**Parameters**

* `json: string | number | boolean | object | unknown[] | null`
<br/>
Input JSON with references to be resolved.

**Return value**

* `Promise<string | number | boolean | object | unknown[] | null>`
<br/>
JSON with references resolved.
