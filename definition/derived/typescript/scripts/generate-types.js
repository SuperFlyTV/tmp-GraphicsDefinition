const { compile, compileFromFile } = require('json-schema-to-typescript')
const path = require('path')
const fs = require('fs')

async function main() {

    const outputPath = path.resolve('../src/generated')
    const schemaPath = path.resolve('../../definition/json-schema')

    // Compile JSON schemas to TypeScript types:
    const inputPath = path.join(schemaPath, 'graphics-manifest/schema.json')
    const ts = await compileFromFile(inputPath)
    console.log('ts', ts)
    //   .then(ts => fs.promises.writeFileSync('foo.d.ts', ts))
}

main().catch(console.error)
