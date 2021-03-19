import { FromSchema } from "json-schema-to-ts";
export declare const pluginSchema: {
    readonly type: "object";
    readonly properties: {
        readonly id: {
            readonly type: "string";
            readonly description: "Unique identifier of the plugin";
        };
        readonly allowedGroups: {
            readonly type: "array";
            readonly items: {
                readonly type: "string";
            };
            readonly description: "List of groups that can access the plugin";
        };
        readonly label: {
            readonly type: "string";
            readonly description: "Label visualized in the side menu";
        };
        readonly icon: {
            readonly type: "string";
            readonly description: "Icon visualized in the side menu";
        };
        readonly order: {
            readonly type: "integer";
            readonly description: "Position of the plugin in the side menu";
        };
        readonly integrationMode: {
            readonly type: "string";
            readonly enum: readonly ["href", "qiankun", "iframe"];
            readonly description: "Way in which the plugin is integrated.";
        };
        readonly pluginRoute: {
            readonly type: "string";
            readonly description: "Path on which the plugin will be rendered";
        };
        readonly pluginUrl: {
            readonly type: "string";
            readonly description: "Entry of the plugin";
        };
        readonly props: {
            readonly type: "object";
            readonly description: "Data passed to the plugin";
        };
        readonly externalLink: {
            readonly type: "object";
            readonly properties: {
                readonly url: {
                    readonly type: "string";
                    readonly description: "Url of the external application";
                };
                readonly sameWindow: {
                    readonly type: "boolean";
                    readonly description: "States if the link should be opened in a new window";
                };
            };
            readonly required: readonly ["url", "sameWindow"];
            readonly additionalProperties: false;
        };
    };
    readonly required: readonly ["id", "label", "pluginRoute", "integrationMode"];
    readonly additionalProperties: false;
};
export declare type Plugin = FromSchema<typeof pluginSchema>;
