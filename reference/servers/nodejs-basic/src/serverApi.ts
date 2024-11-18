
import Router from "@koa/router"
import { GraphicsStore } from "./graphicsStore"
import { CTX, literal } from "./lib"
import { ServerAPI } from "html-graphics-definition"
import multer from '@koa/multer'
const upload = multer({
    storage: multer.diskStorage({
        // destination: './localGraphicsStorage',
    })
})

export function setupServerApi(router: Router) {
    setupServerApiGraphics(router)
}
export function setupServerApiGraphics(router: Router) {

    router.get(`/graphics/list`, handleError(async (ctx) => GraphicsStore.listGraphics(ctx)))
    router.get('/graphics/graphic/:id/:version/manifest', handleError(async (ctx) => GraphicsStore.getGraphicManifest(ctx)))
    router.get(`/graphics/graphic/:id/:version/resource/:localPath`, handleError(async (ctx) => GraphicsStore.getGraphicResource(ctx)))
    // router.delete('/graphics/graphic/:id/:version', handleError(async (ctx) => GraphicsStore.deleteGraphic(ctx)))
    router.post(`/graphics/graphic`,
        upload.single('graphic'),
        handleError(async (ctx) => GraphicsStore.uploadGraphic(ctx))
    )
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
