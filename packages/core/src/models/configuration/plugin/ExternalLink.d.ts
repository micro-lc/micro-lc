import { FromSchema } from "json-schema-to-ts";
export declare const externalLinkSchema: {
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
export declare type ExternalLink = FromSchema<typeof externalLinkSchema>;
