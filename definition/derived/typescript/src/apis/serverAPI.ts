import {
    GraphicInfo,
    GraphicInvokeActionTarget,
    GraphicManifest
} from "../definitions/graphic"
import {
    RendererInfo,
    RendererManifest,
    GraphicInstance,
    RendererStatus,
    RenderTargetStatus,
    RendererLoadGraphicPayload,
    RendererClearGraphicPayload,
    GraphicInstanceOnTarget
} from "../definitions/renderer"
import { ActionInvokePayload, EmptyPayload } from "../definitions/types"
import { VendorSpecific } from "../definitions/vendor"

/*
 * ================================================================================================
 *
 * The Server API is a HTTP REST API, exposed by the Server.
 *
 * The Server MUST serve the API on the path "/serverApi/v1"
 * The Server SHOULD serve the API on the port 80 / 443 (but other ports are allowed)
 *
 * ================================================================================================
*/


export interface Endpoints {

    /** A list of available graphics */
    listGraphics: {
        method: 'GET',
        path:  '/serverApi/v1/graphics/list',
        params: {},
        body: EmptyPayload,
        returnValue: {
            graphics: GraphicInfo[]
            [vendorSpecific: VendorSpecific]: unknown
        } | ErrorReturnValue,
    }

    /** Delete a Graphic */
    deleteGraphic: {
        method: 'DELETE',
        path:  '/serverApi/v1/graphics/graphic/:graphicId/:graphicVersion',
        params: { graphicId: string, graphicVersion: string },
        body: {
            /**
             * Whether to force deletion
             * If force is false, it is recommended that the server keeps the Graphic for a while, but unlist it.
             * This is to ensure that any currently-on-air Graphics are not affected.
             */
            force?: boolean
        },
        returnValue: EmptyPayload | ErrorReturnValue,
    }
    /** Returns info of a Graphic (manifest etc) */
    getGraphicManifest: {
        method: 'GET',
        path:  '/serverApi/v1/graphics/graphic/:graphicId/:graphicVersion/manifest',
        params: { graphicId: string, graphicVersion: string },
        body: EmptyPayload,
        returnValue: {
            graphicManifest: (GraphicInfo & GraphicManifest) | undefined
            [vendorSpecific: VendorSpecific]: unknown
        } | ErrorReturnValue,
    }
    /**
     * Returns the javascript file for a Graphic (ie the graphic.mjs file of a graphic)
     */
    getGraphicModule: {
        method: 'GET',
        path:  '/serverApi/v1/graphics/graphic/:graphicId/:graphicVersion/graphic',
        params: { graphicId: string, graphicVersion: string },
        body: EmptyPayload,
        returnValue: {
            // The contents of the graphic.mjs file
        } | ErrorReturnValue,
    }
    /**
     * Returns any of the resources from the /resources folder of a Graphic
     */
    getGraphicResource: {
        method: 'GET',
        path:  '/serverApi/v1/graphics/graphic/:graphicId/:graphicVersion/resources/:localPath',
        params: { graphicId: string, graphicVersion: string, localPath: string },
        body: EmptyPayload,
        returnValue: {
            // The contents of the requested resource file
        } | ErrorReturnValue,
    }
    /**
     * Upload a Graphic.
     * The Graphic is uploaded as a zip file in multi-part mode.
     */
    uploadGraphic: {
        method: 'POST',
        path:  '/serverApi/v1/graphics/graphic',
        params: {},
        body: EmptyPayload,
        returnValue: EmptyPayload | ErrorReturnValue,
    }



    /**
     * Return a list of Renderers
     */
    listRenderers: {
        method: 'GET',
        path:  '/serverApi/v1/renderers/list',
        params: {},
        body: EmptyPayload,
        returnValue: {
            renderers: RendererInfo[]
            [vendorSpecific: VendorSpecific]: unknown
        } | ErrorReturnValue,
    }
    /**
     * Returns the manifest for a Renderer
     */
    getRendererManifest: {
        method: 'GET',
        path:  '/serverApi/v1/renderers/renderer/:rendererId/manifest',
        params: { rendererId: string },
        body: EmptyPayload,
        returnValue: {
            rendererManifest: RendererInfo & RendererManifest
            [vendorSpecific: VendorSpecific]: unknown
        } | ErrorReturnValue,
    }
    // /**
    //  * Returns a list of GraphicInstances on a RenderTarget
    //  */
    // listRenderTargetGraphicInstances: {
    //     method: 'GET',
    //     path:  '/serverApi/v1/renderers/renderer/:rendererId/graphicInstances',
    //     params: { rendererId: string },
    //     body: EmptyPayload,
    //     returnValue: {
    //         graphicInstances: GraphicInstance[]
    //         [vendorSpecific: VendorSpecific]: unknown
    //     } | ErrorReturnValue,
    // }
    /**
     * Returns the status of a Renderer
     */
    getRendererStatus: {
        method: 'GET',
        path:  '/serverApi/v1/renderers/renderer/:rendererId/status',
        params: { rendererId: string },
        body: EmptyPayload,
        returnValue: {
            status: RendererStatus
            [vendorSpecific: VendorSpecific]: unknown
        } | ErrorReturnValue,
    }
    /**
     * Returns the status of a RenderTarget
     */
    getRenderTargetStatus: {
        method: 'GET',
        path:  '/serverApi/v1/renderers/renderer/:rendererId/target/:renderTargetId/status',
        params: { rendererId: string, renderTargetId: string },
        body: EmptyPayload,
        returnValue: {
            renderTargetStatus: RenderTargetStatus
            [vendorSpecific: VendorSpecific]: unknown
        } | ErrorReturnValue,
    }
    /**
     * Invoke an action on the Renderer
     * Available actions are defined in the Renderer's manifest.
     * Returns the result of the action, or 404 if the acton is not found.
     */
    invokeRendererAction: {
        method: 'POST',
        path:  '/serverApi/v1/renderers/renderer/:rendererId/invoke',
        params: { rendererId: string },
        body: { action: ActionInvokePayload},
        returnValue: {
            /** Value returned by the action */
            value: unknown
            [vendorSpecific: VendorSpecific]: unknown
        } | ErrorReturnValue,
    }
    /**
     * Instructs a Renderer to load a Graphic onto a RenderTarget
     */
    loadGraphic: {
        method: 'PUT',
        path:  '/serverApi/v1/renderers/renderer/:rendererId/target/:renderTargetId/load',
        params: { rendererId: string, renderTargetId: string },
        body: RendererLoadGraphicPayload,
        returnValue: {
            /**
             * A reference to the loaded GraphicInstance.
             */
            graphicInstanceId: string
            [vendorSpecific: VendorSpecific]: unknown
        } | ErrorReturnValue,
    }
    /**
     * Instructs a Renderer to clear Graphics (using filters in payload)
     */
    clearGraphic: {
        method: 'POST',
        path:  '/serverApi/v1/renderers/renderer/:rendererId/clear',
        params: { rendererId: string },
        body: RendererClearGraphicPayload,
        returnValue: {
            /** A list of the clearedGraphicsInstances */
            graphicInstance: GraphicInstanceOnTarget[]
            [vendorSpecific: VendorSpecific]: unknown
        } | ErrorReturnValue,
    }
     /**
     * Invoke an action on a GraphicInstance
     * Available actions are defined in the Graphic's manifest.
     * Returns the result of the action, or 404 if the acton is not found.
     */
    invokeGraphicAction: {
        method: 'POST',
        path:  '/serverApi/v1/renderers/renderer/:rendererId/target/:renderTargetId/invoke',
        params: { rendererId: string, renderTargetId: string },
        body: {
            target: GraphicInvokeActionTarget
            action: ActionInvokePayload
            [vendorSpecific: VendorSpecific]: unknown
        }
        returnValue: {
            /** Value returned by the action */
            value: unknown
            [vendorSpecific: VendorSpecific]: unknown
        } | ErrorReturnValue,
    }


}


// Helper types:
export type AnyPath = Endpoints[keyof Endpoints]['path']
export type AnyBody = Endpoints[keyof Endpoints]['body']
export type AnyReturnValue = Endpoints[keyof Endpoints]['returnValue']


/**
 * If there was an error when invoking a method, the body will be a JSON containing this structure.
 * @see https://www.jsonrpc.org/specification#error_object
 */
export interface ErrorReturnValue {
    code: number
    message: string
    data?: any
    [vendorSpecific: VendorSpecific]: unknown
}
