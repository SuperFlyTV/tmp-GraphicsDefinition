# HTML Graphics Definition

_This folder will contain the definitions in the form of text and JSON Schemas._





# Introduction & Overview

## Overview


The **Graphics Definition** is a specification to allow for interchangeable Graphics, Rendering Systems or Controllers in a broadcast environment.

_For certain definitions, see the [Glossary](/definition/definition/Glossary.md)_.

There are three main components in the **Graphics Definition**:

### The Editor
"A HTML template editor"
* A client or system where an end-user can create and edit **Graphics**.
* Uploads compiled **Graphics** to the **Server**

### The Controller
"A user-facing interface"
* Discovers available **Graphics** using the **Server**
* Displays an interface to a user using information about the **Graphics**
* Sends playout commands to **Renderers** (via the **Server**)


### Server
"A web-server"
* Stores and exposes **Graphics**
* Exposes an API for discovering **Graphics**
* Exposes an API for controlling **Renderers**

### Renderer
"A Web page"
* Acts on playout commands from the Server
* Fetches **Graphics** from the Server and renders them in a DOM
* Is a "Web page"
* Holds the state of the Graphics

_Note: Some vendors may choose to bundle a Renderer / Server into a single system._


### Intention and Scope

The **Graphics Definition** is created using the following principles:

* The **Graphics**, **Server**/**Renderer** and **Controllers** should be interchangeable.
* The Definition should _not_ define the internals of the **Graphics**, **Renderers** or **Controllers** - that's up to the vendors.
* The Definition should define the _interfaces_ between the **Graphics**, **Renderers** and **Controllers**.
* The Definition should allow for vendors to extend the defined APIs to provide vendor-specific functionality while still being compatible with the Definition.
* The Definition strives to be forwards and backwards compatible.




### API Definitions

The **Graphics Definition** consists of the following parts:

* Server API ([LINK](/definition/definition/ServerAPI.md))
* Renderer API ([LINK](/definition/definition/RendererAPI.md))
* Graphics API ([LINK](/definition/definition/GraphicsAPI.md))






## To Vendors

Looking to implement a Graphic, a Server/Renderers or a Controller?
Here are a few tips and tricks useful for you!

* Looking to extend the API? To ensure that you're compatible with future versions of the Graphic Definition, **always prefix your methods, properties or endpoints** with "_VENDORNAME" (ie beginning with underscore, then your vendor name).
* Look at the reference implementations for inspiration.
* Use the tools (TBD) to verify that your

