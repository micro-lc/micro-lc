export var externalLinkSchema = {
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
};
//# sourceMappingURL=ExternalLink.js.map