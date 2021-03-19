import { FromSchema } from "json-schema-to-ts";
export declare const themingSchema: {
    readonly type: "object";
    readonly properties: {
        readonly header: {
            readonly type: "object";
            readonly properties: {
                readonly pageTitle: {
                    readonly type: "string";
                };
                readonly favicon: {
                    readonly type: "string";
                };
            };
        };
        readonly logo: {
            readonly type: "string";
            readonly description: "Url del logo";
        };
        readonly variables: {
            readonly type: "object";
        };
    };
    readonly required: readonly ["logo", "variables"];
    readonly additionalProperties: false;
};
export declare type Theming = FromSchema<typeof themingSchema>;
