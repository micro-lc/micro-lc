import { themingSchema } from "./theming/Theming";
import { pluginSchema } from "./plugin/Plugin";
export var configurationSchema = {
    type: "object",
    properties: {
        theming: themingSchema,
        plugins: {
            type: "array",
            items: pluginSchema
        }
    }
};
//# sourceMappingURL=Configuration.js.map