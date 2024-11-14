import Koa from 'koa'
import Router from 'koa-router'
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

    app.use(router.routes()).use(router.allowedMethods())

    const PORT = 8080

    app.listen(PORT)
    console.log(`Server running on port ${PORT}`)
}
