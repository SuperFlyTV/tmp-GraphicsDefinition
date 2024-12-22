const { spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('fs');

/******************************************************************************
 *
 * This script installs all dependencies and runs all the reference implementations
 * for local development purposes.
 *
 ******************************************************************************/


let basePath = path.resolve('')
if (basePath.endsWith('scripts')) {
    basePath = path.resolve('..')
}

async function main() {

    console.log('==============================')
    console.log('Preparing: Install dependencies...')
    console.log('==============================')
    console.log('')

    // await run({
    //     title:'Installing global http-server',
    //     label: 'Install http-server',
    //     cmd: 'npm install --global http-server',
    //     cwd: ''
    // })

    await Promise.all([
        run({
            title:'Installing dependencies',
            label: 'derived/typescript',
            cmd: 'npm install',
            cwd: 'definition/derived/typescript'
        }),
        run({
            title:'Installing dependencies',
            label: 'controllers/browser-based',
            cmd: 'npm install',
            cwd: 'reference/controllers/browser-based'
        }),
        run({
            title:'Installing dependencies',
            label: 'servers/nodejs-basic',
            cmd: 'npm install',
            cwd: 'reference/servers/nodejs-basic'
        }),
        run({
            title:'Installing dependencies',
            label: 'graphics-tool',
            cmd: 'npm install',
            cwd: 'reference/graphics-tool'
        })
    ])
    console.log('')

    await run({
        title:'Building typescript library',
        label: 'derived/typescript',
        cmd: 'npm run build',
        cwd: 'definition/derived/typescript'
    })

    console.log('')
    console.log('==============================')
    console.log('Preparing: Zip all graphics...')
    console.log('==============================')
    console.log('')

    // Discover all graphics:
    const graphicsPath = 'reference/graphics'
    for (const folder of (await fs.promises.readdir(path.join(basePath, graphicsPath)))) {
        const folderPath = path.join(graphicsPath, folder)



        // First, just check that it has a manifest.json file:

        if (!fs.existsSync(path.join(basePath, folderPath, 'manifest.json'))) {
            console.error(`Skipping ${folderPath}, no manifest.json file found`)
            continue
        }
        const zipName = `${folder}.zip`


        // if there already is a zip file, delete it
        if (fs.existsSync(path.join(basePath, folderPath, zipName))) {
            log(`${folderPath}`, 'Deleting existing zip file')
            await fs.promises.unlink(path.join(basePath, folderPath, zipName))
        }


        // then, zip it

        // is windows
        if (process.platform === 'win32') {

            await run({
                title: `Zipping graphics`,
                label: `${folderPath}`,
                cmd: `powershell.exe`,
                args: [
                    'Compress-Archive',
                    '-Path', '*',
                    '-DestinationPath' , zipName
                ],
                cwd: folderPath
            })
        } else {
            await run({
                title: `Zipping graphics`,
                label: `${folderPath}`,
                cmd: `zip -r ${zipName} *`,
                cwd: folderPath
            })


        }
    }

    console.log('')
    console.log('==============================')
    console.log('Starting up dev servers')
    console.log('==============================')
    console.log('')

    await Promise.all([
         run({
            title:'Starting up development server',
            label: 'controllers/browser-based',
            cmd: 'npm run dev',
            cwd: 'reference/controllers/browser-based'
        }),
        run({
            title:'Starting up development server',
            label: 'servers/nodejs-basic',
            cmd: 'npm run dev',
            cwd: 'reference/servers/nodejs-basic'
        }),
        run({
            title:'Starting up development server',
            label: 'graphics-tool',
            cmd: 'npm run dev',
            cwd: 'reference/graphics-tool'
        })
    ])
}

let runningCount = 0
async function run({title, label, cmd, cwd, args}) {

    runningCount++

    const baseColor = runningColors[runningCount]
    const startTime = Date.now()

    label = `${baseColor}${label}${consoleColors.Reset}`

    if (title) log(label, title)
    await sleep(1)
    if (cwd) log(label, `cd ${cwd}`)
    log(label, `${cmd} ${args ? args.join(' ') : ''}`)

    return new Promise((resolve, reject) => {

        const ls = spawn(cmd, args ?? [], {
            windowsVerbatimArguments: true,
            shell: true,
            cwd: cwd ? path.join(basePath, cwd) : undefined
        })

        ls.stdout.on('data', (data) => log(label, `${data}`))
        ls.stderr.on('data', (data) => log(label, `${data}`))

        ls.on('error', (error) => {
            log(label, `${error} ${error.stack}`)
            reject(new Error(`Process closed with error`))
        })
        ls.on('close', (code) => {
            log(label, `Done in ${ (Date.now()-startTime) / 1000 }s`)
            if (code !== 0) reject(new Error(`[${label}] "${cmd}" closed with exit code ${code}`))
            else resolve()
        })
    })
    .finally(() => {
        runningCount--
    })
}
function log(label, str)  {
    const lines = str.trim().split('\n')
    for (const line of lines) {
        console.log(`[${label}] ${line}`)
    }
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


const consoleColors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    FgGray: "\x1b[90m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
    BgGray: "\x1b[100m",
}
const runningColors = [
    consoleColors.FgGreen,
    consoleColors.FgBlue,
    consoleColors.FgMagenta,
    consoleColors.FgCyan,
    consoleColors.FgYellow,
    consoleColors.FgRed
]

main().catch(console.error)
