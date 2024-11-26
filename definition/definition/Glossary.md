# Glossary


| Term | Definition |
| --- | --- |
| Editor | A HTML Templates Editor. An application/service where a user can create and edit Graphics. |
| Server | A web server. A service that is responsible for storing Graphics and communicating with the other Agents. |
| Renderer | “A web page”. A web application that instantiates GraphicInstances. |
| RenderTarget | “A place where a Graphic can be instantiated”. Exposed and handled by the Renderer. Exactly what this is is vendor-specific. |
| Controller | An application/service where a user can control play out. |
| Graphic | “The artifact from the Editor”. A Graphic is identified by an id and a version, and is immutable (expect when version = 0). |
| GraphicInstance | “The instance of a graphic” |
| Vendor | A 3rd party, the ones using this definition to build stuff. |
