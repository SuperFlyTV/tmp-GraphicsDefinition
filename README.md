# Temporary HTML Graphics Definition

This is a _Work-in-progress_ repo, intended to be a temporary place to collaborate on and store documents, definitions and reference implementations
for the HTML Graphics API project.

**[Work in progress notes](WIP-notes.md)**

## Repo organization:

### Definitions

#### Definition Source

Definitions in text format and JSON Schema. [Link](/definition/definition/README.md)

The Definitions contain the actual definitions as well as motivations for various design decisions.

#### Derived definitions

This folder contains helper projects for various languages and formats, that are derived from the source definitions.

- Definitions in Typescript format. [LINK](/definition/derived/typescript/README.md)

### Tools

#### Graphics DevTool

[Link to the Graphics DevTool](https://superflytv.github.io/tmp-GraphicsDefinition/tools/graphics-devtool/dist/index.html)

A tool for Graphics developers, to view and test Graphics.

### Reference Implementations

#### Graphics

- A minimal example of the most basic Graphic. [LINK](/reference/graphics/minimal/README.md)
- _(More to come)_

#### Servers

- A basic Node.js server. [LINK](/reference/servers/nodejs-basic/README.md)
- _(More to come)_

#### Renderers

- A basic Browser-based renderer that renders Graphics on Layers. [LINK](/reference/renderers/browser-based-layered/README.md)
- _(More to come)_

## For developers

To install and run all the reference implementations locally:

1. Install Node.js
2. `cd to/this/directory`
3. `node scripts\run-everything.js`

This will install all dependencies and run all the reference implementations,
for development purposes.
