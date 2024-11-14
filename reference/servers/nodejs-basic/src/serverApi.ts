
import * as HTMLGraphicsDefinition from "html-graphics-definition"

import Router from "koa-router"
import { GraphicsStore } from "./graphicsStore"

export function setupServerApi(router: Router) {
    setupServerApiGraphics(router)
}
export function setupServerApiGraphics(router: Router) {
    router.get(HTMLGraphicsDefinition.ServerAPI.ServerApiPaths.GetListGraphics(), async (ctx) => {
        ctx.body = await GraphicsStore.listGraphics()
    })
    router.get(HTMLGraphicsDefinition.ServerAPI.ServerApiPaths.GetGraphicManifest(':id', ':version'), async (ctx) => {
        const manifest = await GraphicsStore.getGraphicManifest(ctx.params.id, ctx.params.version)
        if (manifest) {
            ctx.body = manifest
        } else {
            ctx.status = 404
            ctx.body = `Graphic ${ctx.params.id}-${ctx.params.version} not found`
        }
    })
    router.get(HTMLGraphicsDefinition.ServerAPI.ServerApiPaths.GetGraphicResource(':id', ':version', ':localPath'), async (ctx) => {
        await GraphicsStore.getGraphicResource(ctx, ctx.params.id, ctx.params.version, ctx.params.localPath)
    })
    router.put(HTMLGraphicsDefinition.ServerAPI.ServerApiPaths.PutGraphicUpload(':id', ':version'), async (ctx) => {

        // await GraphicsStore.uploadGraphic(ctx, ctx.params.id, ctx.params.version)
        ctx.status = 501
        ctx.body = 'Not implemented yet'
    })
}
