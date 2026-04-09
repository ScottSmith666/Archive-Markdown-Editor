import {BrowserWindow, ipcMain, shell} from "electron";
import icon from "../../../resources/icon.png";
import {join} from "path";
import path from "path";
import {is} from "@electron-toolkit/utils";
import fs from "fs";

const packedRoot = path.join(process.resourcesPath, 'app.asar')

export const mainWindow = () => {
    const main = new BrowserWindow({
        width: 1600,
        height: 1000,
        minWidth: 800,
        minHeight: 660,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === "linux" ? {icon} : {}),
        webPreferences: {
            preload: is.dev
                // 开发环境
                ? join(__dirname, `..${path.sep}..${path.sep}out${path.sep}preload${path.sep}index.js`)
                // 生产环境
                : join(packedRoot, `out${path.sep}preload${path.sep}index.js`),
            sandbox: false,
            contextIsolation: true,
            // 允许从 file:// 协议加载本地资源
            webSecurity: false,
            // 允许跨域
            allowRunningInsecureContent: true
        },
    });

    main.on("ready-to-show", () => {
        main.show();
    });

    main.on("close", (event) => {
        event.preventDefault();  // 拦截自动关闭
        main.webContents.send('ask-for-close');
    });

    // 接收前端确认关闭AME的flag
    ipcMain.on('confirm-close', (event, canClose, mdzPaths) => {
        if (canClose) {
            // 检查并清理所有曾打开过的残余mdz文件
            for (let i = 0; i < mdzPaths.length; i++) {
                if (fs.existsSync(mdzPaths[i])) {
                    fs.rmSync(mdzPaths[i], { recursive: true, force: true });
                }
            }
            main.destroy();
        }
    });

    // 前端按钮直接发送尝试退出信号
    ipcMain.on('try-close', (event) => {
        main.close();
    });

    main.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return {action: "deny"};
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
        main.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
        main.loadFile(is.dev
            // 开发环境
            ? join(__dirname, `..${path.sep}..${path.sep}out${path.sep}renderer${path.sep}index.html`)
            // 生产环境
            : join(packedRoot, `out${path.sep}renderer${path.sep}index.html`));
    }
};
