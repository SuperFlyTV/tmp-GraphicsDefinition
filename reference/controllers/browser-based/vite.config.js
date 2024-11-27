import path from 'path'
import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

export default defineConfig({
    root: path.resolve(__dirname, 'src'),
    // resolve: {
    //     alias: {
    //       '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    //     }
    //   },
    server: {
        port: 8082
    },
    build: {
        rollupOptions: {
            output: {
                assetFileNames: '[name][extname]',
                chunkFileNames: '[name].js',
                entryFileNames: '[name].js',
            },
        },
        assetsDir: '',
    },
    base: '',
})
