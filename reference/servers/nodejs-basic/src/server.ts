import Koa from 'koa'
import Router from "@koa/router"
import bodyParser from 'koa-bodyparser'
import { setupServerApi } from './serverApi';

export async function initializeServer() {

    const app = new Koa();

    app.on('error', (err) => {
        console.error(err)
    })
    app.use(bodyParser())
    const router = new Router()

    setupServerApi(router)

    router.get('/', async (ctx) => {
        ctx.body = `<html><body>
    <h1>NodeJS-based Graphics Server</h1>
    <ul>
        <li><a href="/graphics/list">List Graphics</a></li>
        <li><a href="/renderers/list">List Renderers</a></li>
    </ul>
    <div>
    <form action="/graphics/graphic" method="post" enctype="multipart/form-data">
        Upload Graphic: <br />
        <input type="file" id="graphic" name="graphic" accept=".zip" />
        <input type="submit" />
    </form>
    </div>
</body>
</html>`

    })

    app.use(router.routes()).use(router.allowedMethods())

    const PORT = 8080

    app.listen(PORT)
    console.log(`Server running on port ${PORT}`)
}
