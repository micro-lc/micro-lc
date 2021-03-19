import { headerSchema } from "./Header";
export var themingSchema = {
    type: "object",
    properties: {
        header: headerSchema,
        logo: {
            type: "string",
            description: "Url del logo"
        },
        variables: {
            type: "object"
        }
    },
    required: ['logo', 'variables'],
    additionalProperties: false
};
//# sourceMappingURL=Theming.js.map