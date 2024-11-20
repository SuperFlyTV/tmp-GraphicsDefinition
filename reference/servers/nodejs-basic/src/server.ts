import Koa from 'koa'
import Router from "@koa/router"
import bodyParser from 'koa-bodyparser'
import { setupServerApi } from './serverApi';
import { setupRendererApi } from './rendererApi';
import { KoaWsFilter } from '@zimtsui/koa-ws-filter';
import { GraphicsStore } from './managers/GraphicsStore';
import { RendererManager } from './managers/RendererManager';

export async function initializeServer() {

    const app = new Koa()
    // const app = websockify(new Koa())

    app.on('error', (err: unknown) => {
        console.error(err)
    })
    app.use(bodyParser())
    const httpRouter = new Router()
    const wsRouter = new Router()
    const filter = new KoaWsFilter ();

    // Initialize internal business logic
    const graphicsStore = new GraphicsStore()
    const rendererManager = new RendererManager()

    // Setup APIs:
    setupServerApi(httpRouter, graphicsStore, rendererManager) // HTTP API (ServerAPI)
    setupRendererApi(wsRouter, rendererManager) // WebSocket API (RendererAPI)



    httpRouter.get('/', async (ctx) => {
        ctx.body = `<!DOCTYPE html>
<html><body>
    <h1>NodeJS-based Graphics Server</h1>
    <ul>
        <li><a href="/serverApi/v1/graphics/list">List Graphics</a></li>
        <li><a href="/serverApi/v1/renderers/list">List Renderers</a></li>
    </ul>
    <div>
    <form action="/serverApi/v1/graphics/graphic" method="post" enctype="multipart/form-data">
        Upload Graphic: <br />
        <input type="file" id="graphic" name="graphic" accept=".zip" />
        <input type="submit" />
    </form>
    </div>
</body>
</html>`

    })

    // app.ws.use(async(ctx, next) => {
    //     console.log('ws request', ctx.method, ctx.url)
    //     await next()
    // })

    // ;(app.ws as any).use(router.routes()).use(router.allowedMethods())

    filter.http(httpRouter.routes());
    filter.ws(wsRouter.routes());


    // app.use(router.routes()).use(router.allowedMethods())

    app.use(filter.protocols());

    const PORT = 8080

    app.listen(PORT)
    console.log(`Server running on port ${PORT}`)
}
