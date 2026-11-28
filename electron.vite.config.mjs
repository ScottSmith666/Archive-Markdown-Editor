import {resolve} from "path";
import {defineConfig} from "electron-vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    main: {
        build: {
            bytecode: true,
        }
    },
    preload: {
        build: {
            // 不能开启字节码：窗口已启用 sandbox: true，沙箱化的 preload 只能 require
            // electron / events / timers / url，而 electron-vite 生成的 bytecode-loader.cjs
            // 需要 node:fs、node:vm、node:module，加载阶段就会抛错，导致所有 preload API 全部失效
            bytecode: false,
        }
    },
    renderer: {
        build: {
            minify: 'oxc',
            rolldownOptions: {
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
        worker: {
            format: "es",
        },
    },
});
