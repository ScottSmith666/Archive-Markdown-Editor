import {resolve} from "path";
import {defineConfig} from "electron-vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    main: {
        build: {
            bytecode: false,
        }
    },
    preload: {
        build: {
            bytecode: false,
        }
    },
    renderer: {
        build: {
            minify: 'esbuild',
            esbuildOptions: {
                minify: true,
                drop: ['console', 'debugger'], // 移除 console.log 和 debugger
            },
        },
        resolve: {
            alias: {
                "@renderer": resolve("src/renderer/src"),
            },
        },
        plugins: [vue()],
    },
});
