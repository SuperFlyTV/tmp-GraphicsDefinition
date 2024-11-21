import {
    RendererAPI,
    RendererInfo,
    RendererManifest,
    RendererStatus,
    ServerAPI,
    VendorExtend
} from "html-graphics-definition"
import { JSONRPCServerAndClient } from "json-rpc-2.0"
import { CTX, literal } from "../lib/lib"
import { EmptyPayload } from "html-graphics-definition/dist/definitions/types"

export class RendererManager {




    private rendererInstances: Set<RendererInstance> = new Set()
    private registeredRenderers: Map<string, RendererInstance> = new Map()



    public addRenderer(jsonRpcConnection: JSONRPCServerAndClient<void, void>): RendererInstance {
        // const id = RendererInstance.ID()
        const rendererInstance = new RendererInstance(this, jsonRpcConnection)
        this.rendererInstances.add(rendererInstance)

        return rendererInstance
    }
    public closeRenderer(rendererInstance: RendererInstance) {
        this.rendererInstances.delete(rendererInstance)
        if (rendererInstance.info) this.registeredRenderers.delete(rendererInstance.info.id)

    }
    public registerRenderer(rendererInstance: RendererInstance, id: string) {
        this.registeredRenderers.set(id, rendererInstance)
    }

    /** A ServerAPI Method */
    async listRenderers(ctx: CTX): Promise<void> {

        const renderers: RendererInfo[] = []
        for (const rendererInstance of this.rendererInstances) {
            if (rendererInstance.info) renderers.push(rendererInstance.info)
        }
        ctx.body = literal<ServerAPI.Endpoints['listRenderers']['returnValue']>({ renderers })
    }
    /** A ServerAPI Method */
    async getRendererManifest(ctx: CTX): Promise<void> {
        const params = ctx.params as ServerAPI.Endpoints['getRendererManifest']['params']

        const rendererInstance = this.registeredRenderers.get(params.rendererId)
        if (!rendererInstance) {
            ctx.status = 404
            ctx.body = literal<ServerAPI.ErrorReturnValue>({
                code: 404,
                message: `Renderer ${params.rendererId} not found`
            })
            return
        }
        // Just forward the request to the Renderer:
        const result = await rendererInstance.api.getManifest({})
        ctx.status = 200
        ctx.body =  literal<ServerAPI.Endpoints['getRendererManifest']['returnValue']>( result )
    }
    async getRendererStatus(ctx: CTX): Promise<void> {
        const params = ctx.params as ServerAPI.Endpoints['getRendererStatus']['params']

        const rendererInstance = this.registeredRenderers.get(params.rendererId)
        if (!rendererInstance) {
            ctx.status = 404
            ctx.body = literal<ServerAPI.ErrorReturnValue>({ code: 404, message: `Renderer ${params.rendererId} not found` })
            return
        }

        const status: RendererStatus = {
            // TBD
        }
        ctx.status = 200
        ctx.body =  literal<ServerAPI.Endpoints['getRendererStatus']['returnValue']>({ status })
    }
    async getRenderTargetStatus(ctx: CTX): Promise<void> {
        const params = ctx.params as ServerAPI.Endpoints['getRenderTargetStatus']['params']

        const rendererInstance = this.registeredRenderers.get(params.rendererId)
        if (!rendererInstance) {
            ctx.status = 404
            ctx.body = literal<ServerAPI.ErrorReturnValue>({ code: 404, message: `Renderer ${params.rendererId} not found` })
            return
        }
        // Just forward the request to the Renderer:
        const result = await rendererInstance.api.getTargetStatus({ renderTargetId: params.renderTargetId })

        ctx.status = 200
        ctx.body =  literal<ServerAPI.Endpoints['getRenderTargetStatus']['returnValue']>( result )
    }
    async invokeRendererAction(ctx: CTX): Promise<void> {
        const params = ctx.params as ServerAPI.Endpoints['invokeRendererAction']['params']
        const reqBody = ctx.request.body as ServerAPI.Endpoints['invokeRendererAction']['body']

        const rendererInstance = this.registeredRenderers.get(params.rendererId)
        if (!rendererInstance) {
            ctx.status = 404
            ctx.body = literal<ServerAPI.ErrorReturnValue>({ code: 404, message: `Renderer ${params.rendererId} not found` })
            return
        }
        // Just forward the request to the Renderer:
        const result = await rendererInstance.api.invokeRendererAction(reqBody)

        ctx.status = 200
        ctx.body =  literal<ServerAPI.Endpoints['invokeRendererAction']['returnValue']>(result)
    }
    async loadGraphic(ctx: CTX): Promise<void> {
        const params = ctx.params as ServerAPI.Endpoints['loadGraphic']['params']
        const reqBody = ctx.request.body as ServerAPI.Endpoints['loadGraphic']['body']

        console.log('ctx', ctx)
        if (!reqBody.graphic) throw new Error('No body.graphic provided')

        const rendererInstance = this.registeredRenderers.get(params.rendererId)
        if (!rendererInstance) {
            ctx.status = 404
            ctx.body = literal<ServerAPI.ErrorReturnValue>({ code: 404, message: `Renderer ${params.rendererId} not found` })
            return
        }
        // Just forward the request to the Renderer:
        const result = await rendererInstance.api.loadGraphic({
            renderTargetId: params.renderTargetId,
            ...reqBody
        })

        ctx.status = 200
        ctx.body =  literal<ServerAPI.Endpoints['loadGraphic']['returnValue']>( result )
    }
    async clearGraphic(ctx: CTX): Promise<void> {
        console.log('clearGraphic', ctx)
        const params = ctx.params as ServerAPI.Endpoints['clearGraphic']['params']
        const reqBody = ctx.request.body as ServerAPI.Endpoints['clearGraphic']['body']

        const rendererInstance = this.registeredRenderers.get(params.rendererId)
        if (!rendererInstance) {
            ctx.status = 404
            ctx.body = literal<ServerAPI.ErrorReturnValue>({ code: 404, message: `Renderer ${params.rendererId} not found` })
            return
        }
        // Just forward the request to the Renderer:
        const result = await rendererInstance.api.clearGraphic(reqBody)

        ctx.status = 200
        ctx.body =  literal<ServerAPI.Endpoints['clearGraphic']['returnValue']>( result )
    }
    async invokeGraphicAction(ctx: CTX): Promise<void> {
        const params = ctx.params as ServerAPI.Endpoints['invokeGraphicAction']['params']
        const reqBody = ctx.request.body as ServerAPI.Endpoints['invokeGraphicAction']['body']

        const rendererInstance = this.registeredRenderers.get(params.rendererId)
        if (!rendererInstance) {
            ctx.status = 404
            ctx.body = literal<ServerAPI.ErrorReturnValue>({ code: 404, message: `Renderer ${params.rendererId} not found` })
            return
        }
        // Just forward the request to the Renderer:
        const result = await rendererInstance.api.invokeGraphicAction({
            renderTargetId: params.renderTargetId,
            ...reqBody
        })

        ctx.status = 200
        ctx.body =  literal<ServerAPI.Endpoints['invokeGraphicAction']['returnValue']>( result )
    }



}


class RendererInstance implements RendererAPI.MethodsOnServer {
    static RandomIndex = 0
    // static ID(): string {
    //     return `renderer-${RendererInstance._ID++}`
    // }

    private isRegistered = false
    public info: RendererInfo | undefined
    private _status: RendererStatus = {}
    private _manifest: (RendererInfo & RendererManifest) | null = null

    /** Methods that can be called on the Renderer */
    public api: RendererAPI.MethodsOnRenderer = {
        getManifest: (payload) => this.jsonRpcConnection.request('getManifest', payload),
        // listGraphicInstances: (payload) => this.jsonRpcConnection.request('listGraphicInstances', payload),
        getStatus: (payload) => this.jsonRpcConnection.request('getStatus', payload),
        getTargetStatus: (payload) => this.jsonRpcConnection.request('getTargetStatus', payload),
        invokeRendererAction: (payload) => this.jsonRpcConnection.request('invokeRendererAction', payload),
        loadGraphic: (payload) => this.jsonRpcConnection.request('loadGraphic', payload),
        clearGraphic: (payload) => this.jsonRpcConnection.request('clearGraphic', payload),
        invokeGraphicAction: (payload) => this.jsonRpcConnection.request('invokeGraphicAction', payload),
    }


    constructor(private manager: RendererManager, private jsonRpcConnection: JSONRPCServerAndClient<void, void>) {

    }

    public register = async (payload: { info: Partial<RendererInfo> }): Promise<{ rendererId: string } & VendorExtend> => {
        // JSONRPC METHOD, called by the Renderer
        this.isRegistered = true

        const id = payload.info.id !== undefined ? `renderer:${payload.info.id}` : `renderer-${RendererInstance.RandomIndex++}`
        this.info = {
            id,
            name: payload.info.name ?? id,
            description: payload.info.description ?? '',
        }
        this.manager.registerRenderer(this, this.info.id)

        console.log(`Renderer "${id}" registered`)

        setTimeout(() => {
            // Ask the renderer for its manifest and initial status
            this.updateManifest().catch(console.error)
            this.updateStatus().catch(console.error)
        }, 10)
        return {
            rendererId: this.info.id
        }
    }

    public unregister = async (): Promise<EmptyPayload> => {
        // JSONRPC METHOD, called by the Renderer
        this.isRegistered = false
        this.manager.closeRenderer(this)
        return {}
    }

    public status = async (payload: { status: RendererStatus}): Promise<EmptyPayload> => {
        // JSONRPC METHOD, called by the Renderer
        if (!this.isRegistered) throw new Error('Renderer is not registered')
        this._status = payload.status
        return {}
    }

    public debug = async (payload: { message: string }): Promise<EmptyPayload> => {
        // JSONRPC METHOD, called by the Renderer
        if (!this.isRegistered) throw new Error('Renderer is not registered')

        console.log('DEBUG Renderer', payload.message)
        return {}
    }

    private async updateManifest() {
        const result = await this.api.getManifest({})
        this._manifest = result.rendererManifest
    }
    private async updateStatus() {
        const result = await this.api.getStatus({})
        this._status = result.rendererStatus
    }



}
