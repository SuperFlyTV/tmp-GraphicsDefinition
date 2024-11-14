import fs from "fs"
import mime from 'mime-types'
import { ParameterizedContext } from "koa"
import * as HTMLGraphicsDefinition from "html-graphics-definition"
import path from "path"
import Router from "koa-router"


class GraphicsStoreSingleTon {


    private FILE_PATH = path.resolve('./localGraphicsStorage')


    constructor () {

        // Ensure the directory exists
        fs.mkdirSync(this.FILE_PATH, { recursive: true })
    }

    async listGraphics(): Promise<HTMLGraphicsDefinition.ServerAPI.GetGraphicsListReturnValue> {

        const folderList = (await fs.promises.readdir(this.FILE_PATH))

        const graphics: HTMLGraphicsDefinition.GraphicInfo[] = []
        for (const folder of folderList) {
            const {id, version} = this.fromFileName(folder)

            const manifest = JSON.parse(await fs.promises.readFile(path.join(this.FILE_PATH, folder, 'manifest.json'), 'utf8')) as HTMLGraphicsDefinition.GraphicManifest & HTMLGraphicsDefinition.GraphicInfo

            // Ensure the id and version match:
            if (id !== manifest.id || version !== `${manifest.version}`) {
                console.error(`Folder name ${folder} does not match manifest id ${manifest.id} or version ${manifest.version}`)
                continue
            }

            graphics.push({
                id: manifest.id,
                version: manifest.version,
                name: manifest.name,
                description: manifest.description,
                author: manifest.author
            })
        }
        return {
            graphics
        }
    }
    async getGraphicManifest(id: string, version: string): Promise<HTMLGraphicsDefinition.ServerAPI.GetGraphicManifestReturnValue | undefined> {
        const manifestPath = path.join(this.FILE_PATH, this.toFileName(id, version), 'manifest.json')
        if (!await this.fileExists(manifestPath)) {
            return undefined
        }
        const manifest = JSON.parse(await fs.promises.readFile(manifestPath, 'utf8')) as HTMLGraphicsDefinition.GraphicManifest & HTMLGraphicsDefinition.GraphicInfo
        return {
            graphicManifest: manifest
        }
    }
    async getGraphicResource(
        ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>,
        id: string,
        version: string,
        localPath: string
    ): Promise<HTMLGraphicsDefinition.ServerAPI.GetGraphicManifestReturnValue | undefined> {
        const filePath = path.join(this.FILE_PATH, this.toFileName(id, version), localPath)

        const info = await this.getFileInfo(filePath)

        if (!info.found) {
            ctx.status = 404
            ctx.body = 'File not found'
            return
        }

        ctx.type = info.mimeType
        ctx.length = info.length
        ctx.lastModified = info.lastModified

        const readStream = fs.createReadStream(filePath)
        ctx.body = readStream
    }




    private async  fileExists(filePath: string): Promise<boolean> {
        try {
            await fs.promises.access(filePath)
            return true
        }
        catch {
            return false
        }
    }

    private toFileName(id: string, version: string) {
        return `${id}-${version}`
    }
    private fromFileName(filename: string): {id: string, version: string} {
        const p = filename.split('-')
        if (p.length !== 2) throw new Error(`Invalid filename ${filename}`)
        return {id: p[0], version: p[1]}
    }

    private async  getFileInfo(filePath: string): Promise<{
        found: false} | {
        found: true,
        mimeType: string,
        length: number,
        lastModified: Date
    }> {
        if (!(await this.fileExists(filePath))) {
            return { found: false }
        }
        let mimeType = mime.lookup(filePath)
        if (!mimeType) {
            // Fallback to "unknown binary":
            mimeType = 'application/octet-stream'
        }

        const stat = await fs.promises.stat(filePath)

        return {
            found: true,
            mimeType,
            length: stat.size,
            lastModified: stat.mtime,
        }
    }
}

export const GraphicsStore = new GraphicsStoreSingleTon()
