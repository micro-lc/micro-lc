import {FromSchema} from "json-schema-to-ts";

export const headerSchema = {
  type: "object",
  properties: {
    pageTitle: {
      type: "string"
    },
    favicon: {
      type: "string"
    }
  }
} as const;

export type Header = FromSchema<typeof headerSchema>
