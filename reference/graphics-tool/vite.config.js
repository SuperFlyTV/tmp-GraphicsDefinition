import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { buildSync } from "esbuild"

// import react from '@vitejs/plugin-react'

export default defineConfig({
    root: path.resolve(__dirname, 'src'),
    // resolve: {
    //     alias: {
    //       '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    //     }
    //   },
    server: {
        port: 8083
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

    plugins: [
        // ...
        react(),
        {
          apply: "build",
          enforce: "post",
          transformIndexHtml() {
            buildSync({
              minify: true,
              bundle: true,
              entryPoints: [join(process.cwd(), "service-worker.js")],
              outfile: join(process.cwd(), "dist", "service-worker.js"),
            });
          },
        },
      ],
})
