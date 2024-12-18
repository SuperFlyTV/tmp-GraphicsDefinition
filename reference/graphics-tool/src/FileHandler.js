import { verifyGraphicManifest } from './lib/graphic/verify'
class FileHandler {
    // initialized = false
    constructor() {

    }
    async init() {
        console.log('file handler init')

        // const dirHandleName = window.localStorage.getItem('dirHandleName')
        // console.log('dirHandleName', dirHandleName)

        // let dirHandle
        // if (dirHandleName) {
        //     // dirHandle = await window

        //     dirHandle = await window.FileSystemDirectoryHandle.getDirectoryHandle(dirHandleName)
        // } else {
        // }

        const dirHandle = await window.showDirectoryPicker({
            id: "graphics-tool",
            mode: "read",

        })
        this.dirHandle = dirHandle
        // console.log('dirHandle.name', dirHandle.name)
        // window.localStorage.setItem('dirHandleName', dirHandle.name)
        console.log('dirHandle', dirHandle)


        // this.initialized = true


        // console.log('dirHandle', dirHandle)

        // List all files in the directory:

        const listAllFilesInDirectory = async (files, path, dirHandle) => {

            for await (const [key, handle] of dirHandle.entries()) {
                // console.log(key, handle)

                const subPath = path + '/' + handle.name

                if (handle.kind === 'directory') {
                    await listAllFilesInDirectory(files, subPath, handle)
                } else {

                    files[subPath] = {
                        dirHandle,
                        handle
                    }
                    // .push(subPath)

                    // const file = await handle.getFile()
                    // console.log('file', file)

                    // const arrayBuffer = await file.arrayBuffer()
                    // console.log('arrayBuffer', arrayBuffer)
                }
            }
            return files

        }

        const files = await listAllFilesInDirectory({}, '', dirHandle)
        this.files = files
        console.log('fileNames', files)

        // List all graphics in the directory:

        const graphics = []
        for (const [key, file] of Object.entries(files)) {

            if (file.handle.name === 'manifest.json') {
                const graphic = {
                    path: key.slice(0, -'manifest.json'.length),
                    error: null
                }
                graphics.push(graphic)

                // Check if the manifest is correct
                const manifestStr = await (await file.handle.getFile()).text()
                let manifest
                try {
                    manifest = JSON.parse(manifestStr)
                } catch (e) {
                    graphic.error = 'Error parsing manifest.json: ' + e
                    continue
                }
                graphic.error = verifyGraphicManifest(manifest)



            }

        }
        console.log('graphics', graphics)

        return graphics


    }
    async readFile(path) {

        console.log('readFile', path)

        const f = this.files[path]
        if (!f) {
            throw new Error(`File not found: "${path}"`)
        }

        const file = await f.handle.getFile()

        return {
            size: file.size,
            name: file.name,
            type: file.type,
            arrayBuffer: await file.arrayBuffer()
        }
    }
}

export const fileHandler = new FileHandler()


