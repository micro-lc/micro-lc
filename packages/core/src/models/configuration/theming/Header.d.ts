import { FromSchema } from "json-schema-to-ts";
export declare const headerSchema: {
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
export declare type Header = FromSchema<typeof headerSchema>;
