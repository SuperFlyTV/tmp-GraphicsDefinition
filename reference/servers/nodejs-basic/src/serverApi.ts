
import Router from "@koa/router"
import { GraphicsStore } from "./managers/GraphicsStore"
import { CTX, literal } from "./lib/lib"
import { ServerAPI } from "html-graphics-definition"
import multer from '@koa/multer'
import { RendererManager } from "./managers/RendererManager"
const upload = multer({
    storage: multer.diskStorage({
        // destination: './localGraphicsStorage',
    })
})

// type EnpointsWithContext<T extends Record<string, () => any>> = {
//     [K in keyof T]: (ctx: CTX, ...args: Parameters<T[K]>) => ReturnType<T[K]>
// }

export function setupServerApi(router: Router, graphicsStore: GraphicsStore, rendererManager: RendererManager) {


    // const api: ServerAPI.AllEndpoints = {
    //     'GET /serverApi/v1/graphics/list': (body: ServerAPI.GetGraphicsListBody) => PromiseLike<ServerAPI.GetGraphicsListReturnValue>
    //     'GET /serverApi/v1/graphics/graphic/:id/:version/manifest': (body: ServerAPI.GetGraphicManifestBody) => PromiseLike<ServerAPI.GetGraphicManifestReturnValue>
    //     'DELETE /serverApi/v1/graphics/graphic/:id/:version': (body: ServerAPI.EmptyPayload) => PromiseLike<ServerAPI.any | ErrorReturnValue>
    //     'GET /serverApi/v1/graphics/graphic/:id/:version/resource/:localPath': (body: ServerAPI.EmptyPayload) => PromiseLike<ServerAPI.any | ErrorReturnValue>
    //     'POST /serverApi/v1/graphics/graphic': (body: ServerAPI.any) => PromiseLike<ServerAPI.any | ErrorReturnValue>
    //     'GET /serverApi/v1/renderers/list': (body: ServerAPI.GetRenderersListBody) => PromiseLike<ServerAPI.GetRenderersListReturnValue>
    //     'GET /serverApi/v1/renderers/renderer/:id/manifest': (body: ServerAPI.GetRendererManifestBody) => PromiseLike<ServerAPI.GetRendererManifestReturnValue>
    //     'GET /serverApi/v1/renderers/renderer/:id/graphicInstances': (body: ServerAPI.GetRendererGraphicInstancesBody) => PromiseLike<ServerAPI.GetRendererGraphicInstancesReturnValue>
    //     'GET /serverApi/v1/renderers/renderer/:id/status': (body: ServerAPI.GetRendererStatusBody) => PromiseLike<ServerAPI.GetRendererStatusReturnValue>
    //     'GET /serverApi/v1/renderers/renderer/:id/target/:target/status': (body: ServerAPI.GetRendererTargetStatusBody) => PromiseLike<ServerAPI.GetRendererTargetStatusReturnValue>
    //     'PUT /serverApi/v1/renderers/renderer/:id/target/:target/load': (body: ServerAPI.PutRendererTargetLoadBody) => PromiseLike<ServerAPI.PutRendererTargetLoadReturnValue>
    //     'PUT /serverApi/v1/renderers/renderer/:id/clear': (body: ServerAPI.PutRendererTargetClearBody) => PromiseLike<ServerAPI.PutRendererTargetClearReturnValue>
    //     'PUT /serverApi/v1/renderers/renderer/:id/target/:target/invoke': (body: ServerAPI.PutRendererTargetInvokeBody) => PromiseLike<ServerAPI.PutRendererTargetInvokeReturnValue>
    // }

    // ----- Graphics related endpoints ------------------------------
    router.get(`/serverApi/v1/graphics/list`, handleError(async (ctx) => graphicsStore.listGraphics(ctx)))
    router.get(`/serverApi/v1/graphics/graphic/:id/:version/manifest`, handleError(async (ctx) => graphicsStore.getGraphicManifest(ctx)))
    router.get(`/serverApi/v1/graphics/graphic/:id/:version/resource/:localPath`, handleError(async (ctx) => graphicsStore.getGraphicResource(ctx)))
    // router.delete(`/serverApi/v1/graphics/graphic/:id/:version`, handleError(async (ctx) => graphicsStore.deleteGraphic(ctx)))
    router.post(`/serverApi/v1/graphics/graphic`,
        upload.single('graphic'),
        handleError(async (ctx) => graphicsStore.uploadGraphic(ctx))
    )

    // ----- Renderer related endpoints --------------------------------


    router.get('/serverApi/v1/renderers/list', handleError(async (ctx) => rendererManager.listRenderers(ctx)))
    router.get('/serverApi/v1/renderers/renderer/:id/manifest',
        handleError(async (ctx) => rendererManager.getRendererManifest(ctx.params.id))
    )
    // router.get('/serverApi/v1/renderers/renderer/:id/graphicInstances', handleError(async (ctx) => ))
    // router.get('/serverApi/v1/renderers/renderer/:id/status', handleError(async (ctx) => ))
    // router.get('/serverApi/v1/renderers/renderer/:id/target/:target/status', handleError(async (ctx) => ))
    // router.put('/renderers/renderer/:id/target/:target/load', handleError(async (ctx) => ))
    // router.put('/serverApi/v1/renderers/renderer/:id/clear', handleError(async (ctx) => ))
    // router.put('/serverApi/v1/renderers/renderer/:id/target/:target/invoke', handleError(async (ctx) => ))

}



function handleError(fcn: (ctx: CTX) => Promise<void>) {
    return async (ctx: CTX) => {

        try {
            await fcn(ctx)
        } catch (err) {
            // Handle internal errors:
            ctx.status = 500
            ctx.body = literal<ServerAPI.ErrorReturnValue>({ code: 500, message: `Internal Error: ${err}`})

            if (err && typeof err === 'object' && err instanceof Error && err.stack) {
                // Note: This is a security risk, as it exposes the stack trace to the client (don't do this in production)
                ctx.body.data = { stack: err.stack }
            }
        }
    }
}
