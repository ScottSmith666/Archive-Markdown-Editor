import {BrowserWindow, shell} from "electron";
import icon from "../../../resources/icon.png";
import {join} from "path";
import path from "path";
import {is} from "@electron-toolkit/utils";

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
