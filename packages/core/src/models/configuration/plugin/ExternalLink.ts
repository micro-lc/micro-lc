import {FromSchema} from "json-schema-to-ts";

export const externalLinkSchema = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      description: 'Url of the external application'
    },
    sameWindow: {
      type: 'boolean',
      description: 'States if the link should be opened in a new window'
    }
  },
  required: ['url', 'sameWindow'],
  additionalProperties: false
} as const;

export type ExternalLink = FromSchema<typeof externalLinkSchema>
