# Graphics API

The Graphics API is a javascript interface between the Renderer and the Graphics (a [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)).

**TO BE WRITTEN. CURRENTLY A WORK IN PROGRESS CAN BE FOUND IN [../derived/typescript](../derived/typescript/README.md)**

Graphics are rendered in full-frame, ie they take up the entire screen.


It is recommended that Graphics SHOULD be designed to be responsive, ie support multiple resolutions and aspect ratios.


## Definition of a Graphic

A Graphic consists of the following files:

* **manifest.json** - A JSON file containing metadata about the Graphic. See XYZ for more information.
* **graphic.mjs** - A javascript file containing the Graphic class. See XYZ for more information.
* **resources** - (optional) A folder containing any resources used by the Graphic, such as images, videos, fonts, etc. The resources folder MAY contain sub folders.

A Graphic MUST include the **manifest.json** and the **graphic.mjs** files (using these exact file names).
A Graphic MAY include a **resources** folder, it can be omitted if the Graphic does not use any resources.
A Graphic MAY include additional files in the root folder (for example, entrypoints used by other graphics systems). These files will NOT be served by the **Server** and should not be used nor referenced from the graphic.mjs file.

See the reference implementations for examples of how to implement a Graphic.
