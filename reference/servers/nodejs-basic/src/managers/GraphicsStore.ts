import fs from "fs"
import mime from 'mime-types'
import path from "path"
import {
    ServerAPI,
    GraphicInfo,
    GraphicManifest
} from "html-graphics-definition"
import { CTX, literal } from "../lib/lib"
import decompress from "decompress"

export class GraphicsStore {


    /** File path where to store Graphics */
    private FILE_PATH = path.resolve('./localGraphicsStorage')
    /** How long to wait befor removing Graphics, in ms */
    private REMOVAL_WAIT_TIME = 1000 * 3600 * 24 // 24 hours

    constructor () {
        // Ensure the directory exists
        fs.mkdirSync(this.FILE_PATH, { recursive: true })

        setInterval(() => {
            this.removeExpiredGraphics().catch(console.error)
        }, 1000 * 3600 * 24) // Check every 24 hours
        // Also do a check now:
        this.removeExpiredGraphics().catch(console.error)
    }

    async listGraphics(ctx: CTX): Promise<void> {

        const folderList = (await fs.promises.readdir(this.FILE_PATH))

        const graphics: GraphicInfo[] = []
        for (const folder of folderList) {
            const {id, version} = this.fromFileName(folder)

            // Don't list Graphics that are marked for removal:
            if (await this.isGraphicMarkedForRemoval(id, version)) continue

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
                author: manifest.author,
                draft: manifest.draft,
            })
        }
        ctx.body = literal<ServerAPI.Endpoints['listGraphics']['returnValue']>({ graphics })
    }
    async getGraphicManifest(ctx: CTX): Promise<void> {
        const params = ctx.params as ServerAPI.Endpoints['getGraphicManifest']['params']
        const id = params.graphicId
        const version = params.graphicVersion

        const manifestPath = path.join(this.FILE_PATH, this.toFileName(id, version), 'manifest.json')

        // Don't return manifest if the Graphic is marked for removal:
        if (await this.fileExists(manifestPath) && !(await this.isGraphicMarkedForRemoval(id, version)) ) {

            const graphicManifest = JSON.parse(await fs.promises.readFile(manifestPath, 'utf8')) as GraphicManifest & GraphicInfo

            // TODO
            // graphicManifest.totalSize =
            // graphicManifest.fileCount =

            if (graphicManifest) {
                ctx.status = 200
                if (this.isImmutable(version)) {
                    ctx.header['Cache-Control'] = 'public, max-age=31536000, immutable'
                } else {
                    // Never cache:
                    ctx.header['Cache-Control'] = 'no-store'
                }
                ctx.body = literal<ServerAPI.Endpoints['getGraphicManifest']['returnValue']>({ graphicManifest })
                return
            }
        }
        // else:
        ctx.status = 404
        ctx.body = literal<ServerAPI.ErrorReturnValue>({ code: 404, message: `Graphic ${params.graphicId}-${params.graphicVersion} not found` })
        return
    }
    async getGraphicModule(ctx: CTX): Promise<void> {
        const params = ctx.params as ServerAPI.Endpoints['getGraphicModule']['params']
        const id: string = params.graphicId
        const version: string = params.graphicVersion

        // Don't return graphic if the Graphic is marked for removal:
        if (await this.isGraphicMarkedForRemoval(id, version) ) {
            ctx.status = 404
            ctx.body = literal<ServerAPI.ErrorReturnValue>({code: 404, message: 'File not found'})
            return
        }

        await this.serveFile(ctx, path.join(this.FILE_PATH, this.toFileName(id, version), 'graphic.mjs'), this.isImmutable(version))
    }
    async getGraphicResource(ctx: CTX): Promise<void> {
        const params = ctx.params as ServerAPI.Endpoints['getGraphicResource']['params']
        const id: string = params.graphicId
        const version: string = params.graphicVersion
        const localPath: string = params.localPath

        // Note: We DO serve resources even if the Graphic is marked for removal!
        await this.serveFile(ctx, path.join(this.FILE_PATH, this.toFileName(id, version), 'resources', localPath), this.isImmutable(version))
    }
    async deleteGraphic(ctx: CTX): Promise<void> {
        const params = ctx.params as ServerAPI.Endpoints['deleteGraphic']['params']
        const reqBody = ctx.request.body as ServerAPI.Endpoints['deleteGraphic']['body']

        if (reqBody.force) {
            await this.actuallyDeleteGraphic(params.graphicId, params.graphicVersion)
        } else {
            await this.markGraphicForRemoval(params.graphicId, params.graphicVersion)
        }
    }

    async uploadGraphic(ctx: CTX): Promise<void> {



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

        const decompressPath = path.resolve('tmpGraphic')

        const cleanup = async () => {
            try {
                await fs.promises.rm(decompressPath, { recursive: true })
            } catch (err: any) {
                if (err.code !== 'ENOENT') throw err
            }
        }
        try {
            await cleanup()


            const files = await decompress(tempZipPath, decompressPath)
            console.log('files', files)




            const manifest = files.find(f => f.path.endsWith('manifest.json'))
            if (!manifest) throw new Error('No manifest.json found in zip file')

            const graphicModule = files.find(f => f.path.endsWith('graphic.mjs'))
            if (!graphicModule) throw new Error('No graphic.mjs found in zip file')

            let basePath = ''
            if (graphicModule.path.includes('/graphic.mjs')) { // basepath/graphic.mjs
                basePath = graphicModule.path.slice(0, -'/graphic.mjs'.length)
            }
            console.log('basePath', basePath)

            const manifestData = JSON.parse(manifest.data.toString('utf8')) as GraphicManifest & GraphicInfo

            const id = manifestData.id
            const version = `${manifestData.version}`
            const folderPath = path.join(this.FILE_PATH, this.toFileName(id, `${version}`))

            // Check if the Graphic already exists
            let alreadyExists = false
            if (await this.fileExists(folderPath)) {
                alreadyExists = true

                if (await this.isGraphicMarkedForRemoval(id, version)) {
                    // If a pre-existing graphic is marked for removal, we can overwrite it.
                    await this.actuallyDeleteGraphic(id, version)
                    alreadyExists = false
                } else if (version === '0') {
                    // If the version is 0, it is considered mutable, so we can overwrite it.
                    await this.actuallyDeleteGraphic(id, version)
                    alreadyExists = false
                }
            }
            if (alreadyExists) {
                await cleanup()

                ctx.status = 409 // conflict
                ctx.body = literal<ServerAPI.ErrorReturnValue>({code: 409, message: 'Graphic already exists'})
                return
            }

            // Copy the files to the right folder:
            await fs.promises.mkdir(folderPath, { recursive: true })

            const fileName = path.join(this.FILE_PATH, this.toFileName(manifestData.id, `${manifestData.version}`))



            for (const innerFile of files) {
                if (innerFile.type !== 'directory') continue

                const filePath = innerFile.path.slice(basePath.length) // Remove the base path
                try {
                    await fs.promises.mkdir(path.join(folderPath, filePath), { recursive: true })
                } catch (err) {
                    if (!`${err}`.includes('EEXIST')) throw err // Ignore "already exists" errors
                }

            }
            for (const innerFile of files) {
                if (innerFile.type !== 'file') continue

                const filePath = innerFile.path.slice(basePath.length) // Remove the base path
                await fs.promises.writeFile(path.join(folderPath, filePath), innerFile.data)
            }

            ctx.status = 200
            ctx.body = literal<ServerAPI.Endpoints['uploadGraphic']['returnValue']>({})
        } finally {
            // clean up after ourselves:
            await cleanup()
        }
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
    private isImmutable(version: string) {
        // If the version is 0, the graphic is considered mutable
        // ie, it is a non-production version, in development
        // Otherwise it is considered immutable.
        return `${version}` !== '0'
    }

    private async getFileInfo(filePath: string): Promise<
        {
            found: false
        } |
        {
            found: true,
            mimeType: string,
            length: number,
            lastModified: Date
        }
    > {
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
    private async serveFile(ctx: CTX, fullPath: string, immutable: boolean): Promise<void> {

        const info = await this.getFileInfo(fullPath)

        if (!info.found) {
            ctx.status = 404
            ctx.body = literal<ServerAPI.ErrorReturnValue>({code: 404, message: 'File not found'})
            return
        }

        ctx.type = info.mimeType
        ctx.length = info.length
        ctx.lastModified = info.lastModified

        if (immutable) {
            ctx.header['Cache-Control'] = 'public, max-age=31536000, immutable'
        } else {
            // Never cache:
            ctx.header['Cache-Control'] = 'no-store'
        }

        const readStream = fs.createReadStream(fullPath)
        ctx.body = readStream as any
    }

    private async actuallyDeleteGraphic(id: string, version: string) {
        const folderPath = path.join(this.FILE_PATH, this.toFileName(id, version))

        if (await this.fileExists(folderPath)) {
            await fs.promises.rm(folderPath, { recursive: true })
        }
    }
    private async markGraphicForRemoval(id: string, version: string) {
        // Mark the Graphic for removal, but keep it for a while.
        // The reason for this is to not delete a Graphic that is currently on-air
        // (which might break due to missing resources)

        const folderPath = path.join(this.FILE_PATH, this.toFileName(id, version))

        const removalFilePath = path.join(folderPath, '__markedForRemoval')

        if (await this.fileExists(folderPath)) {
            fs.promises.writeFile(removalFilePath, `${Date.now() + this.REMOVAL_WAIT_TIME}`, 'utf-8' )
        }
    }
    /** Find any graphics that are due to be removed */
    private async removeExpiredGraphics() {

        const folderList = (await fs.promises.readdir(this.FILE_PATH))
        for (const folder of folderList) {
            const {id, version} = this.fromFileName(folder)

            if (!(await this.isGraphicMarkedForRemoval(id, version))) continue

            const removalFilePath = path.join(this.FILE_PATH, folder, '__markedForRemoval')

            const removalTimeStr = await fs.promises.readFile(removalFilePath, 'utf-8')
            const removalTime = parseInt(removalTimeStr)
            if (Number.isNaN(removalTime)) {
                console.error(`Invalid removal time in ${removalFilePath}`)
                continue
            }

            if (Date.now() > removalTime) {
                // Time to remove the Graphic
                await this.actuallyDeleteGraphic(id, version)
            }
        }
    }

    /** Returns true if a graphic exists (and is not marked for removal) */
    private async isGraphicMarkedForRemoval(id: string, version: string): Promise<boolean> {
        const removalFilePath = path.join(this.FILE_PATH, this.toFileName(id, version), '__markedForRemoval')
        return await this.fileExists(removalFilePath)
    }
}


