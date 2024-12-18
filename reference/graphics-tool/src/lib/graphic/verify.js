export function verifyGraphicManifest(manifest) {
    // TMP!
    // This should use the json schema to verify the manifest


    if (!manifest.id) return 'Manifest is missing the "id" property'
    if (!manifest.version) return 'Manifest is missing the "version" property'
    if (!manifest.name) return 'Manifest is missing the "name" property'
    if (!manifest.actions) return 'Manifest is missing the "actions" property'
    if (!manifest.rendering) return 'Manifest is missing the "rendering" property'


    if (typeof manifest.id !== 'string') return 'Manifest "id" property must be a string'
    if (typeof manifest.version !== 'number') return 'Manifest "version" property must be a number'
    if (typeof manifest.name !== 'string') return 'Manifest "name" property must be a string'
    if (typeof manifest.actions !== 'object') return 'Manifest "actions" property must be an object'
    if (typeof manifest.rendering.supportsRealTime !== 'boolean') return 'Manifest "rendering.supportsRealTime" property must be a boolean'
    if (typeof manifest.rendering.supportsNonRealTime !== 'boolean') return 'Manifest "rendering.supportsNonRealTime" property must be a boolean'

    if (manifest.description && typeof manifest.description !== 'string') return 'Manifest "description" property must be a string'
    if (manifest.author && typeof manifest.author !== 'object') return 'Manifest "author" property must be an object'

    if (manifest.author) {
        if (typeof manifest.author.name !== 'string') return 'Manifest "author.name" property must be a string'
        if (manifest.author.email && typeof manifest.author.email !== 'string') return 'Manifest "author.email" property must be a string'
        if (manifest.author.url && typeof manifest.author.url !== 'string') return 'Manifest "author.url" property must be a string'
    }

    for (const [key, action] of Object.entries(manifest.actions)) {


        if (typeof action !== 'object') return `Manifest "actions.${key}" property must be an object`
        if (!action.label) return `Manifest "actions.${key}" is missing the "label" property`
        if (!action.schema) return `Manifest "actions.${key}" is missing the "schema" property`

        if (typeof action.label !== 'string') return `Manifest "actions.${key}.label" property must be a string`
        if (action.description && typeof action.description !== 'string') return `Manifest "actions.${key}.description" property must be a string`
    }

    return null
}
