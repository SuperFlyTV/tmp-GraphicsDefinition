import { verifyGraphicManifest } from './lib/graphic/verify'
import { sleep } from './lib/lib.js'

class FileHandler {
	constructor() {
		this.monitoredHandles = {}
		this.fileChangeListeners = []
		this.files = {}
		this.dirs = {}
	}
	async init() {
		this.triggerMonitor().catch(console.error)

		const dirHandle = await window.showDirectoryPicker({
			id: 'graphics-tool',
			mode: 'read',
		})
		this.dirHandle = dirHandle

		// discover all files in the directory:
		await this.discoverFiles()

		// List all graphics in the directory:
		const graphics = []
		for (const [key, file] of Object.entries(this.files)) {
			if (file.handle.name === 'manifest.json') {
				const graphic = {
					path: key.slice(0, -'manifest.json'.length),
					error: '',
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
				graphic.manifest = manifest

				// Check that there is a graphics.mjs file:
				if (!this.files[key.replace(/\/manifest.json$/, '/graphic.mjs')]) {
					graphic.error += '\n' + 'Missing graphic.mjs file'
				}

				graphic.error = graphic.error.trim()
			}
		}

		return graphics
	}
	async discoverFilesInDirectory(path, dirHandle) {
		for await (const [key, handle] of dirHandle.entries()) {
			const subPath = path + '/' + handle.name

			if (handle.kind === 'directory') {
				this.dirs[subPath] = {
					dirHandle: handle,
				}
				await this.discoverFilesInDirectory(subPath, handle)
			} else {
				this.files[subPath] = {
					dirHandle,
					handle,
				}
			}
		}
	}
	async discoverFiles() {
		this.dirs = {}
		this.files = {}
		await this.discoverFilesInDirectory('', this.dirHandle)
	}

	async readFile(path) {
		const path2 = path.slice(1)
		console.log('readFile', path2)

		// remove any query parameters:
		path = path.replace(/\?.*/, '')

		let f = this.files[path]
		if (!f) {
			const dirPath = path.replace(/\/[^/]+$/, '')
			const dir = this.dirs[dirPath]
			if (dir) {
				// reload files in parent directory:
				await this.discoverFilesInDirectory(dirPath, dir.dirHandle)
			}
			// Try again:
			f = this.files[path]
		}
		if (!f) {
			throw new Error(`File not found: "${path}"`)
		}

		this.monitorFile(path, f.handle)

		const file = await f.handle.getFile()

		return {
			size: file.size,
			name: file.name,
			type: file.type,
			arrayBuffer: await file.arrayBuffer(),
		}
	}

	monitorFile(path, fileHandle) {
		if (this.monitoredHandles[path]) return // ignore

		this.monitoredHandles[path] = {
			handle: fileHandle,
			exists: true,
			checked: false,
		}
	}
	async triggerMonitor() {
		for (const [key, mon] of Object.entries(this.monitoredHandles)) {
			const props = {
				exists: mon.exists,
				size: mon.size,
				lastModified: mon.lastModified,
			}

			try {
				const file = await mon.handle.getFile()
				props.exists = true
				props.size = file.size
				props.lastModified = file.lastModified
			} catch (e) {
				// if (e NotFoundError)
				// console.log('e.name', e.name)
				if (e.name === 'NotFoundError') {
					props.exists = false
				} else {
					throw e
				}
			}
			const changed = mon.exists !== props.exists || mon.size !== props.size || mon.lastModified !== props.lastModified
			const checked = mon.checked
			mon.checked = true
			mon.exists = props.exists
			mon.size = props.size
			mon.lastModified = props.lastModified

			if (checked && changed) {
				// Sleep a bit, to allow for multiple files saves to settle
				await sleep(100)
				console.log(`File ${key} has changed`)
				// First, reset all monitors, so that they'll not retrigger right away:
				for (const mon of Object.values(this.monitoredHandles)) {
					mon.checked = false
				}
				this.fileHasChanged()
				break
			}
		}
		setTimeout(() => {
			this.triggerMonitor().catch(console.error)
		}, 1000)
	}
	fileHasChanged() {
		for (const fileChangeListener of this.fileChangeListeners) {
			fileChangeListener()
		}
	}
	listenToFileChanges(cb) {
		this.fileChangeListeners.push(cb)
		return {
			stop: () => {
				const i = this.fileChangeListeners.findIndex((c) => c === cb)
				if (i === -1) throw new Error('stop: no index found for callback')
				this.fileChangeListeners.splice(i, 1)
			},
		}
	}
}

export const fileHandler = new FileHandler()
