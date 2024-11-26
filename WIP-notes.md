# Work in progress notes

_This is a document where we can scribble down notes while working on this definition._

---


* We should split the manifest into { info, manifest }

* Should we aim for frame accuracy?
  Discussion: Probably not. HTML rendering is best-effort. ref: https://spxgc.tawk.help/article/help-config-renderer#bottom


    * Batch commands, to guarantee that they will be executed on the same frame in multiple Graphics
        * Will it be enough to be able to batch "invoke" commands, or do we need to consider other commands?
    Discussion: Probably not.


## Uploading Graphic File


* Can it be a zipped file?
* Can file size be a problem?
* Should the upload url contain :id/:version? (Since it can be read from the file itself)


## Graphic

* Do we need to provide a base url to the GraphicInstance on load? So that it knows from where to load resources.
* Should the Graphic WebComponent be added to the DOM before or after calling the load() method?


* A Question about positioning:
    Should we render Graphics in full frame or in a container?

    Conclusion: Graphics should be rendered in full frame, ie they take up the entire screen.
    If a Renderer wants to handle transition logic and advanced composition, it can do so by communicating with the Graphics using vendor specific methods.

blog post: Need to communicate between difference Graphics? - use LocalStorage!

* How to handle non-realtime graphics?

* Thumbnails?

* Graphic Capabilities, Renderer properties
    dimensions, GPU acceleration

* Graphics in hierarchy? paths?
