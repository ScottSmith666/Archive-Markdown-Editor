import {app, BrowserWindow, ipcMain} from "electron";
import icon from "../../../resources/icon.png";
import path from "path";
import fs from "fs";
import {SqliteMan} from "../sqlite-man";
import {APP_SHELL_PROTOCOL} from "../media-protocol";
import {openExternalSafe} from "../external-url";

const packedRoot = path.join(process.resourcesPath, 'app.asar')

export const mainWindow = (sqlite3, dbPath) => {
    const sqliteMan = new SqliteMan(sqlite3, dbPath);
    let windowProps = sqliteMan.getLastExitWhAndPos()[0];
    const main = new BrowserWindow({
        width: windowProps.w,
        height: windowProps.h,
        x: windowProps.x,
        y: windowProps.y,
        minWidth: 800,
        minHeight: 660,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === "linux" ? {icon} : {}),
        webPreferences: {
            preload: (!app.isPackaged)
                // 开发环境
                ? path.join(__dirname, `..${path.sep}..${path.sep}out${path.sep}preload${path.sep}index.js`)
                // 生产环境
                : ( process.platform === "openharmony"
                    ? path.join(__dirname, `..${path.sep}..${path.sep}out${path.sep}preload${path.sep}index.js`)
                    : path.join(packedRoot, `out${path.sep}preload${path.sep}index.js`)
                ),
            // 渲染进程启用操作系统级沙箱：preload 只使用 contextBridge 与 ipcRenderer，无需 Node 能力
            sandbox: true,
            contextIsolation: true,
            // 同源策略保持默认开启（webSecurity: true）
            // 本地多媒体改由 src/main/media-protocol.js 注册的 mdz-media-protocol 协议受控代理，
            // 不再需要关闭同源策略；allowRunningInsecureContent 属于已废弃选项，直接移除
        },
    });

    // main.webContents.openDevTools({mode: "right"});

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

    // 返回窗口的宽高和坐标
    ipcMain.handle('get-window-wh-and-pos', (event) => {
        let wh = main.getSize();
        let xy = main.getPosition();
        return wh.concat(xy);  // w, h, x, y
    });

    // 关闭应用前设置窗口的宽高和坐标
    ipcMain.on('set-window-wh-and-pos', (event, whXyArray) => {
        sqliteMan.setLastExitWhAndPos(whXyArray);
    });

    main.webContents.setWindowOpenHandler((details) => {
        // 应用自身不需要开新窗口：一律 deny，链接只在通过协议白名单校验后交给系统默认程序
        openExternalSafe(details.url);
        return {action: "deny"};
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the custom-scheme shell for production.
    // 不能用 loadFile：file:// 源的 origin 是 opaque 的，开启同源策略后
    // Web Worker（Monaco / 导出 worker）与动态 import() 会被直接拒绝
    if (!app.isPackaged && process.env["ELECTRON_RENDERER_URL"]) {
        main.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
        // 渲染产物目录的定位逻辑收敛在 media-protocol.js 的 resolveRendererRoot() 里，
        // 这里只需要把首页交给自定义协议处理器返回
        main.loadURL(`${APP_SHELL_PROTOCOL}://bundle/index.html`);
    }
    return main;
};
