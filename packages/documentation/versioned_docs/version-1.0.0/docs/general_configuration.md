---
id: general_configuration
title: General configuration
sidebar_label: General configuration
---

`micro-lc` provides an API that can be used by your plugins to retrieve its dynamic configuration expressed in `JSON` format.

All these configurations must be stored in the same path, defined by the `PLUGINS_CONFIGURATIONS_PATH` environment variable.

To retrieve the configuration, you can perform a GET request to `/api/v1/microlc/configuration/:configurationName`, where `configurationName`
is the name of the `JSON` file that is stored in the path `${PLUGINS_CONFIGURATIONS_PATH}/${configurationName}.json`.

:::info
For example, if you:
- set `PLUGINS_CONFIGURATIONS_PATH` as `/microlc-be`;
- create a file in `/microlc-be/backoffice.json`.

You can then retrieve its content with the GET request `/api/v1/microlc/configuration/backoffice`.
:::

## Configuration structure

The general configuration endpoint supports two kinds of configuration structure:
- [referenced](#referenced-configuration): the configuration is a referenced template that is populated by the API at runtime;
- plain: the configuration is returned **as-is**. It can have any structure.

### Referenced configuration
A referenced configuration has two root properties:
- `$ref`: contains the object with the references to replace.  
  Its structure is: `<key referenced in the content>:<object to place in the content>`;
- `content`: the configuration content that must be replaced and returned.

#### Example

An example of referenced configuration can be the following:

```json {3-58,123,150}
{
  "$ref": {
    "dataSchema": {
      "type": "object",
      "properties": {
        "_id": {
          "type": "string",
          "visualizationOptions": {
            "label": "ID"
          }
        },
        "creatorId": {
          "type": "string",
          "visualizationOptions": {
            "label": "Creator ID"
          }
        },
        "createdAt": {
          "type": "string",
          "format": "date",
          "visualizationOptions": {
            "label": "Created At",
            "dateOutputFormat": "MM/DD/YYYY HH:mm:ss"
          }
        },
        "updaterId": {
          "type": "string",
          "visualizationOptions": {
            "label": "Updater ID"
          }
        },
        "updatedAt": {
          "type": "string",
          "format": "date",
          "visualizationOptions": {
            "label": "Updated At",
            "dateOutputFormat": "MM/DD/YYYY HH:mm:ss"
          }
        },
        "__STATE__": {
          "type": "string",
          "visualizationOptions": {
            "label": "State",
            "iconMap": {
              "Published": {
                "shape": "roundedSquare",
                "color": "#52C41A"
              },
              "Draft": {
                "shape": "roundedSquare",
                "color": "#CDCDCE"
              }
            }
          }
        }
      },
      "required": []
    }
  },
  "content": {
    "type": "row",
    "content": [
      {
        "type": "column",
        "style": "justify-content: space-between;",
        "content": [
          {
            "type": "column",
            "style": "margin: 24px 0 24px 56px;",
            "content": [
              {
                "type": "element",
                "tag": "bk-search-bar",
                "style": "margin-right: 25px;",
                "config": {
                  "placeholder": "Search..."
                }
              },
              {
                "type": "element",
                "tag": "bk-refresh-button",
                "style": "margin-left: 25px; display: flex; align-items: center;"
              }
            ]
          },
          {
            "type": "element",
            "tag": "bk-add-new-button",
            "style": "margin: 24px 56px 24px 0;"
          }
        ]
      },
      {
        "type": "element",
        "tag": "bk-tabs",
        "style": "margin-left:0;",
        "config": {
          "allTabQuery": "",
          "archivedTabQuery": "__STATE__:DRAFT",
          "customTabs": [
            {
              "id": "custom-tab",
              "query": "__STATE__:PUBLIC",
              "title": "Public"
            }
          ]
        }
      },
      {
        "type": "row",
        "style": "justify-content: space-between; height: 77vh",
        "content": [
          {
            "type": "row",
            "style": "background-color: #c2c2c2; padding: 10px; height: 100%",
            "content": [
              {
                "type": "element",
                "tag": "bk-table",
                "url": "/back-kit/bk-web-components.esm.js",
                "config": {
                  "dataSchema": {
                    "$ref": "dataSchema"
                  }
                }
              }
            ]
          },
          {
            "type": "column",
            "content": [
              {
                "type": "element",
                "tag": "bk-footer"
              },
              {
                "type": "element",
                "tag": "bk-pagination"
              }
            ],
            "style": "justify-content: space-between; padding: 16px 16px 0;"
          }
        ]
      },
      {
        "type": "element",
        "tag": "crud-client",
        "config": {
          "basePath": "/v2/test",
          "$ref": "dataSchema"
        }
      }
    ]
  }
}
```

After processing, the resulting configuration will be:

```json {51-105,124-178}
{
	"type": "row",
	"content": [{
		"type": "column",
		"style": "justify-content: space-between;",
		"content": [{
			"type": "column",
			"style": "margin: 24px 0 24px 56px;",
			"content": [{
				"type": "element",
				"tag": "bk-search-bar",
				"style": "margin-right: 25px;",
				"config": {
					"placeholder": "Search..."
				}
			}, {
				"type": "element",
				"tag": "bk-refresh-button",
				"style": "margin-left: 25px; display: flex; align-items: center;"
			}]
		}, {
			"type": "element",
			"tag": "bk-add-new-button",
			"style": "margin: 24px 56px 24px 0;"
		}]
	}, {
		"type": "element",
		"tag": "bk-tabs",
		"style": "margin-left:0;",
		"config": {
			"allTabQuery": "",
			"archivedTabQuery": "__STATE__:DRAFT",
			"customTabs": [{
				"id": "custom-tab",
				"query": "__STATE__:PUBLIC",
				"title": "Public"
			}]
		}
	}, {
		"type": "row",
		"style": "justify-content: space-between; height: 77vh",
		"content": [{
			"type": "row",
			"style": "background-color: #c2c2c2; padding: 10px; height: 100%",
			"content": [{
				"type": "element",
				"tag": "bk-table",
				"url": "/back-kit/bk-web-components.esm.js",
				"config": {
					"dataSchema": {
						"type": "object",
						"properties": {
							"_id": {
								"type": "string",
								"visualizationOptions": {
									"label": "ID"
								}
							},
							"creatorId": {
								"type": "string",
								"visualizationOptions": {
									"label": "Creator ID"
								}
							},
							"createdAt": {
								"type": "string",
								"format": "date",
								"visualizationOptions": {
									"label": "Created At",
									"dateOutputFormat": "MM/DD/YYYY HH:mm:ss"
								}
							},
							"updaterId": {
								"type": "string",
								"visualizationOptions": {
									"label": "Updater ID"
								}
							},
							"updatedAt": {
								"type": "string",
								"format": "date",
								"visualizationOptions": {
									"label": "Updated At",
									"dateOutputFormat": "MM/DD/YYYY HH:mm:ss"
								}
							},
							"__STATE__": {
								"type": "string",
								"visualizationOptions": {
									"label": "State",
									"iconMap": {
										"Published": {
											"shape": "roundedSquare",
											"color": "#52C41A"
										},
										"Draft": {
											"shape": "roundedSquare",
											"color": "#CDCDCE"
										}
									}
								}
							}
						},
						"required": []
					}
				}
			}]
		}, {
			"type": "column",
			"content": [{
				"type": "element",
				"tag": "bk-footer"
			}, {
				"type": "element",
				"tag": "bk-pagination"
			}],
			"style": "justify-content: space-between; padding: 16px 16px 0;"
		}]
	}, {
		"type": "element",
		"tag": "crud-client",
		"config": {
			"basePath": "/v2/test",
			"type": "object",
			"properties": {
				"_id": {
					"type": "string",
					"visualizationOptions": {
						"label": "ID"
					}
				},
				"creatorId": {
					"type": "string",
					"visualizationOptions": {
						"label": "Creator ID"
					}
				},
				"createdAt": {
					"type": "string",
					"format": "date",
					"visualizationOptions": {
						"label": "Created At",
						"dateOutputFormat": "MM/DD/YYYY HH:mm:ss"
					}
				},
				"updaterId": {
					"type": "string",
					"visualizationOptions": {
						"label": "Updater ID"
					}
				},
				"updatedAt": {
					"type": "string",
					"format": "date",
					"visualizationOptions": {
						"label": "Updated At",
						"dateOutputFormat": "MM/DD/YYYY HH:mm:ss"
					}
				},
				"__STATE__": {
					"type": "string",
					"visualizationOptions": {
						"label": "State",
						"iconMap": {
							"Published": {
								"shape": "roundedSquare",
								"color": "#52C41A"
							},
							"Draft": {
								"shape": "roundedSquare",
								"color": "#CDCDCE"
							}
						}
					}
				}
			},
			"required": []
		}
	}]
}
```

### ACL

Both configuration structures support ACL using the [`aclExpression`](core_configuration.md#aclexpression) property previously discussed.

For example, given this plain configuration:

```json
{
  "acl": {
    "nested": {
      "aclExpression": "groups.admin && groups.ceo",
      "object": {}
    }
  }
}
```

If the `aclExpression` doesn't evaluate `true`, the result will be:

```json
{
  "acl": {}
}
```

From version `0.9.0` user's permissions on their own or can be used alongside the user's groups, both the following configurations are valid:

```json
{
	"groupsAndPermissionsAcl": {
    "nested": {
      "aclExpression": "groups.admin && permissions.companies.view",
      "object": {}
    }
  },
  "permissionsAcl": {
    "nested": {
      "aclExpression": "permissions.companies.view && permissions.companies.create",
      "object": {}
    }
  },
}
```
