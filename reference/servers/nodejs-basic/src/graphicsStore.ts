import fs from "fs"
import mime from 'mime-types'
import path from "path"
import {
    ServerAPI,
    GraphicInfo,
    GraphicManifest
} from "html-graphics-definition"
import { CTX, literal } from "./lib"
import decompress from "decompress"

class GraphicsStoreSingleton {

    private FILE_PATH = path.resolve('./localGraphicsStorage')

    constructor () {
        // Ensure the directory exists
        fs.mkdirSync(this.FILE_PATH, { recursive: true })
    }

    async listGraphics(ctx: CTX): Promise<void> {

        const folderList = (await fs.promises.readdir(this.FILE_PATH))

        const graphics: GraphicInfo[] = []
        for (const folder of folderList) {
            const {id, version} = this.fromFileName(folder)

            const manifest = JSON.parse(await fs.promises.readFile(path.join(this.FILE_PATH, folder, 'manifest.json'), 'utf8')) as GraphicManifest & GraphicInfo

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
        ctx.body = literal<ServerAPI.GetGraphicsListReturnValue>({ graphics })
    }
    async getGraphicManifest(ctx: CTX): Promise<void> {
        const id = ctx.params.id
        const version = ctx.params.version

        const manifestPath = path.join(this.FILE_PATH, this.toFileName(id, version), 'manifest.json')

        if (await this.fileExists(manifestPath)) {


            const graphicManifest = JSON.parse(await fs.promises.readFile(manifestPath, 'utf8')) as GraphicManifest & GraphicInfo

            if (graphicManifest) {
                ctx.status = 200
                ctx.body = literal<ServerAPI.GetGraphicManifestReturnValue>({ graphicManifest })
                return
            }
        }
        // else:
        ctx.status = 404
        ctx.body = literal<ServerAPI.ErrorReturnValue>({ code: 404, message: `Graphic ${ctx.params.id}-${ctx.params.version} not found` })
        return
    }
    async getGraphicResource(ctx: CTX): Promise<void> {

        const id: string = ctx.params.id
        const version: string = ctx.params.version
        const localPath: string = ctx.params.localPath


        const filePath = path.join(this.FILE_PATH, this.toFileName(id, version), localPath)

        const info = await this.getFileInfo(filePath)

        if (!info.found) {
            ctx.status = 404
            ctx.body = literal<ServerAPI.ErrorReturnValue>({code: 404, message: 'File not found'})
            return
        }

        ctx.type = info.mimeType
        ctx.length = info.length
        ctx.lastModified = info.lastModified

        const readStream = fs.createReadStream(filePath)
        ctx.body = readStream as any

        // ServerAPI.GetGraphicManifestReturnValue | undefined
    }
    async uploadGraphic(ctx: CTX): Promise<void> {
        const id = ctx.params.id
        const version = ctx.params.version

        console.log('uploadGraphic')

        // ctx.status = 501
        // ctx.body = literal<ServerAPI.ErrorReturnValue>({code: 501, message: 'Not implemented yet'})

        // Expect a zipped file that contains the Graphic
        const file =  ctx.request.file
        // console.log('file', ctx.request.file)
        // console.log('files', ctx.request.files)
        // console.log('body', ctx.request.body)

        console.log('Uploaded file',file.originalname, file.size)

        if (file.mimetype !== 'application/x-zip-compressed') {
            ctx.status = 400
            ctx.body = literal<ServerAPI.ErrorReturnValue>({code: 400, message: 'Expected a zip file'})
            return
        }

        const tempZipPath = file.path

        const files = await decompress(tempZipPath, 'tmpGraphic')
        console.log('files', files)

        const manifest = files.find(f => f.path.endsWith('manifest.json'))
        if (!manifest) throw new Error('No manifest.json found in zip file')

        const manifestData = JSON.parse(manifest.data.toString('utf8')) as GraphicManifest & GraphicInfo

        const fileName = path.join(this.FILE_PATH, this.toFileName(manifestData.id, `${manifestData.version}`))




        // Store the files in a folder named after the id and version
        // for (const file of files) {

        //     const filePath =

        // }
        // console.log('request', ctx.request)
        // const fileExtension = mime.extension(type)

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

export const GraphicsStore = new GraphicsStoreSingleton()
