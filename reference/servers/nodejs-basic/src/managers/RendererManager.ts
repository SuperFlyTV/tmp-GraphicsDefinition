import { RendererAPI, RendererInfo, RendererStatus, ServerAPI } from "html-graphics-definition"
import { JSONRPCServerAndClient } from "json-rpc-2.0"
import { CTX, literal } from "../lib/lib"

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
        ctx.body = literal<ServerAPI.GetRenderersListReturnValue>({ renderers })
    }
    /** A ServerAPI Method */
    async getRendererManifest(ctx: CTX): Promise<void> {
        const rendererId = ctx.params.id

        const rendererInstance = this.registeredRenderers.get(rendererId)

        if (!rendererInstance) {
            // ctx.status = 404
            // ctx.body = literal<ServerAPI.ErrorReturnValue>({ code: 404, message: `Renderer ${rendererId} not found` })
            ctx.status = 404
            ctx.body = literal<ServerAPI.GetRendererManifestReturnValue>({ rendererManifest: undefined })
            return
        }

        const rendererManifest = await rendererInstance.api.getManifest({})

        ctx.status = 200
        ctx.body =  literal<ServerAPI.GetRendererManifestReturnValue>({ rendererManifest })
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

    /** Methods that can be called on the Renderer */
    public api: RendererAPI.MethodsOnRenderer = {
        getManifest: (payload) => this.jsonRpcConnection.request('getManifest', payload),
        listGraphicInstances: (payload) => this.jsonRpcConnection.request('listGraphicInstances', payload),
        getStatus: (payload) => this.jsonRpcConnection.request('getStatus', payload),
        getTargetStatus: (payload) => this.jsonRpcConnection.request('getTargetStatus', payload),
        loadGraphic: (payload) => this.jsonRpcConnection.request('loadGraphic', payload),
        clearGraphic: (payload) => this.jsonRpcConnection.request('clearGraphic', payload),
        invokeGraphic: (payload) => this.jsonRpcConnection.request('invokeGraphic', payload),
    }

    constructor(private manager: RendererManager, private jsonRpcConnection: JSONRPCServerAndClient<void, void>) {

    }

    public async register(payload: { info: Partial<RendererInfo> }) {
        // JSONRPC METHOD, called by the Renderer
        this.isRegistered = true

        const id = payload.info.id !== undefined ? `renderer:${payload.info.id}` : `renderer-${RendererInstance.RandomIndex++}`
        this.info = {
            id,
            name: payload.info.name ?? id,
            description: payload.info.description ?? '',
        }
        this.manager.registerRenderer(this, this.info.id)
    }

    public async unregister() {
        // JSONRPC METHOD, called by the Renderer
        this.isRegistered = false
        this.manager.closeRenderer(this)
    }

    public async status(payload: { status: RendererStatus}) {
        // JSONRPC METHOD, called by the Renderer
        if (!this.isRegistered) throw new Error('Renderer is not registered')
        this._status = payload.status
    }

    public async debug(payload: { message: string }) {
        // JSONRPC METHOD, called by the Renderer
        if (!this.isRegistered) throw new Error('Renderer is not registered')

        console.log('DEBUG Renderer', payload.message)
    }

}
