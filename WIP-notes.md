# Work in progress notes

_This is a document where we can scribble down notes while working on this definition._

---

- We should split the manifest into { info, manifest }

- Should we aim for frame accuracy?
  Discussion: Probably not. HTML rendering is best-effort. ref: https://spxgc.tawk.help/article/help-config-renderer#bottom

  - Batch commands, to guarantee that they will be executed on the same frame in multiple Graphics \* Will it be enough to be able to batch "invokeAction" commands, or do we need to consider other commands?
    Discussion: Probably not.

## Uploading Graphic File

- Can it be a zipped file?
- Can file size be a problem?
- Should the upload url contain :id/:version? (Since it can be read from the file itself)

## Graphic

- Do we need to provide a base url to the GraphicInstance on load? So that it knows from where to load resources.
- Should the Graphic WebComponent be added to the DOM before or after calling the load() method?

- A Question about positioning:
  Should we render Graphics in full frame or in a container?

  Conclusion: Graphics should be rendered in full frame, ie they take up the entire screen.
  If a Renderer wants to handle transition logic and advanced composition, it can do so by communicating with the Graphics using vendor specific methods.

blog post: Need to communicate between difference Graphics? - use LocalStorage!

- How to handle non-realtime graphics?

- Thumbnails?

- Graphic Capabilities, Renderer properties
  dimensions, GPU acceleration

- Graphics in hierarchy? paths?

export graphic - mainly used BY the Graphic itself in renderer

RenderTarget - intentionally vague

Renderer Status - vendor specific?

Scope:
GraphicsInstance - OK.

    Should it be webComponent?
        We'd need to explain it well, and provide examples.

    multi-threading in iFrames.
    performance and stability


    Davy:
        Should we have the Renderer as a MUST
        question of scope: Will vendors implement separate Renderers?

standard methods:
_ play: "animate in"
_ update: "update state"
_ continue?
_ step x? \* stop: "animate out"

    * infer state-based data?

Notes from 2015-01-15:

- For non-realtime: in & out animation durations
  AE: "Protected Regions" for in & outs
  The durations are 99% fixed and wont change.

  it should be okay to add this to the manifest

- AE uses "xxxLocalized" in their schema
- content credentials (for AI created content)?
- Style changes mid-show
- Redundancy

Extensible graphic
Standard graphic

manifest:
{
actions: {
update: { // should be called before play
label: 'Update',
schema: {
data
}

            returns: {
                stepCount: number
                currentStep: number
            }
        },
        play: {
            label: 'Play',
            animationDuration: number
            schema: null
        },
        stop: {
            label: 'Play',
            animationDuration: number
            schema: null // or obj
        },

        step: { // play is essentially a step to 1
            label: 'Step',
            animationDuration: number
            schema: {
                type: 'object',
                properties: {
                    // jump to step
                    // advance x steps forward/backward
                    //     (no animation)
                    // play next step (with animation)

                    absoluteStep?: number
                    deltaStep?: number
                    animate: boolean
                }
            }
        },
        return {
            currentStep: number // is 0 if step resulted in animate out
        }


    }
    properties {
        isStandardTemplate: true
        stepCount: number
    }

}

step() // continues
step(param) // step to that step

continue(nextStep) // animates out, if its on the last step

play==in
stop==out

Tuomos slides:
fire-and-forget
update+in
stepCount=0
in-and-out in -- hold -- out
update+in+out
update+step(1)+step(0)
stepCount=1
multi-step-template
update+in+next+next+next+out
update+in+next+out
stepCount=2+

---

use import.meta.url instead of loadParams.baseUrl

the resources folder is an unexpected limitation. might make it HARD to use in some build systems.

using "main": "graphic.mjs", // optional, defaults to "graphic.mjs"

2025-02-05

- Name: "OGraf"

Divide Work

- Question about Scope
  Graphics API definition
  Draft in March
  1.0 for IBC
  Server API definition
  Draft for IBC

prefix: "v\_" for vendor specific methods

non realtime rendering:

- defaultDuration
- be able to defined markers (actions)
- stretch behavior

we'll aim for realtime in the 1.0 version, then add non-realtime in the next version

standard vs extended graphic
remove the default/

## TODO 2025-03-05

- Explicit play/stop/update/step functions

  - playAction
  - stopAction
  - updateAction
  - stepAction
  - rename invokeAction to customAction

- Only have

  - `playAction({delta, goto, skipAnimation})`: can be explained as: you play any chosen step (absolute or relative), with or without animation
  - `stopAction(skipAnimation)`: can be explained as: you stop the Graphic rendering, with or without animation

- move `supportsRealTime`, `supportsNonRealTime`, `extensibleGraphic` to top level in manifest

- return type of play (step number)

- Be able to define a schema in manifest for customActions
  play() : { code: number; message?: string, result: any, currentStep: number }
  stop() : { code: number; message?: string, result: any }

  also for all customActions and other methods

- Error handling

  - try do do best effort (example: step to 9000, then go to end)
  -

- Version:
  change to string
  change to optional

  Remove notion of graphic being idempotent
  We think of the version field as "short description field" / metadata

  SHOULD be alphabetically sortable

- Remove the "Extensible graphic"
  everything is a "standard graphic", can CAN have custom actions

question:

- Should we rename everything "graphic" to ograf? (including graphic.mjs -> ograf.mjs?)
