const {app, BrowserWindow, dialog, shell} = require("electron");
const LanguageLocale = require('./libs/languages');
const GlobalVar = require('./libs/globalvar');
const ConfirmDialog = require('./dialogs');

const SqliteMan = require('./libs/sqliteman');
const path = require("node:path");


// 加载配置文件中的Language Index对象
const languageConfigManagerObject = new SqliteMan.LanguageConfigManager();

let gVar = new GlobalVar();
let appLangOrder = Number(languageConfigManagerObject.loadLangConfig());
let appLangObj = new LanguageLocale();
let langList = appLangObj.languageObject;
let appLang = appLangObj.operationsInstructions;

function GlobalMenu(mainWindow, aboutWindow) {
    const isMac = process.platform === 'darwin';

    let aboutPage = () => {
        if (!aboutWindow) {  // 判断“关于”窗口是否已打开，防止重复打开同一个窗口
            aboutWindow = new BrowserWindow({  // 创建“关于”窗口对象
                backgroundColor: '#ffffff',
                width: 630,
                height: 620,
                frame: false,  // 无边框
                resizable: false,  // 不可调节大小
                parent: mainWindow,
                show: false,
                webPreferences: {
                    preload: path.join(__dirname, 'preload/preload-about.js'),
                }
            });
            aboutWindow.loadFile("ui/about.html");
            aboutWindow.on('ready-to-show', function () {
                aboutWindow.show();  // 初始化后再显示
            });
            aboutWindow.setAlwaysOnTop(true, 'screen-saver');
            if (gVar.DEBUG) aboutWindow.webContents.openDevTools();  // 打开开发者工具
            aboutWindow.on('closed', () => {
                // 当窗口被关闭时，将 aboutWin 设置为 null
                aboutWindow = null;
            });
        } else {
            aboutWindow.show();
        }
    }

    this.menu = [
        ...(isMac ? [{  // 如果是Mac，则显示苹果标志右边的那个特殊菜单栏
                label: app.name,
                submenu: [
                    {
                        label: appLang().menu.about[appLangOrder],
                        click: () => {
                            aboutPage();
                        }
                    },
                    {
                        label: appLang().menu.settings[appLangOrder],
                        accelerator: 'command+,',
                        click: () => {
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        label: appLang().menu.quit[appLangOrder],
                        accelerator: "command+q",
                        click: () => {
                            app.quit();
                        }
                    }
                ]
            }] : []
        ),
        {
            label: appLang().menu.file[appLangOrder],
            submenu: [
                {
                    label: appLang().menu.new[appLangOrder],
                    accelerator: isMac ? 'command+n' : 'ctrl+n', //绑定快捷键
                    click: () => {
                        console.log('打开文件');
                    }
                },
                {
                    label: appLang().menu.open[appLangOrder],
                    accelerator: isMac ? 'command+o' : 'ctrl+o',
                    click: () => {
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: appLang().menu.save[appLangOrder],
                    accelerator: isMac ? 'command+s' : 'ctrl+s', //绑定快捷键
                    click: () => {
                        console.log('保存文件');
                    }
                },
                {
                    label: appLang().menu.saveAs[appLangOrder],
                    accelerator: isMac ? 'command+shift+s' : 'ctrl+shift+s',
                    click: () => {
                    }
                },
                {
                    label: appLang().menu.export[appLangOrder],
                    accelerator: isMac ? 'command+e' : 'ctrl+e',
                    submenu: [
                        {
                            label: 'Markdown...',
                            click: () => {}
                        },
                        {
                            label: 'PDF...',
                            click: () => {}
                        },
                        {
                            label: "HTML...",
                            click: () => {}
                        }
                    ]
                }
            ]
        },
        {
            label: appLang().menu.edit[appLangOrder],
            submenu: [
                {
                    label: appLang().menu.import[appLangOrder],
                    accelerator: isMac ? 'command+i' : 'ctrl+i',
                    click: () => {
                        console.log('打开文件');
                    }
                },
                {
                    type: 'separator',
                },
                {
                    label: appLang().menu.undo[appLangOrder],
                    accelerator: isMac ? 'command+z' : 'ctrl+z',
                    click: () => {
                        return mainWindow.webContents.send('undo');
                    }
                },
                {
                    label: appLang().menu.redo[appLangOrder],
                    accelerator: isMac ? 'command+shift+z' : 'ctrl+y',
                    click: () => {
                        return mainWindow.webContents.send('redo');
                    }
                },
                {
                    type: 'separator',
                },
                {
                    label: appLang().menu.selectAll[appLangOrder],
                    accelerator: isMac ? 'command+a' : 'ctrl+a',
                    click: () => {
                        return mainWindow.webContents.send('select-all');
                    }
                },
                {
                    label: appLang().menu.cut[appLangOrder],
                    accelerator: isMac ? 'command+x' : 'ctrl+x',
                    click: () => {
                        return mainWindow.webContents.send('copy', false);
                    }
                },
                {
                    label: appLang().menu.copy[appLangOrder],
                    accelerator: isMac ? 'command+c' : 'ctrl+c',
                    click: () => {
                        return mainWindow.webContents.send('copy', true);
                    }
                },
                {
                    label: appLang().menu.paste[appLangOrder],
                    accelerator: isMac ? 'command+v' : 'ctrl+v',
                    click: () => {
                        return mainWindow.webContents.send('paste');
                    }
                },
                {
                    type: 'separator',
                },
                {
                    label: appLang().menu.language[appLangOrder],
                    submenu: [
                        {
                            label: langList[0].description,
                            click: () => {
                                let chosenLang = 0;
                                let dialogTxtPackage = appLang(langList[chosenLang].description).menu;
                                let dialogNoNeedTxt =
                                    dialogTxtPackage.LangNoNeedSwitchDialog;
                                let dialogTxt =
                                    dialogTxtPackage.LangSwitchConfirmDialog;
                                if (chosenLang === appLangOrder)
                                    new ConfirmDialog(
                                        mainWindow,
                                        "warning",
                                        dialogNoNeedTxt[appLangOrder].buttons,
                                        0,
                                        dialogNoNeedTxt[appLangOrder].title,
                                        dialogNoNeedTxt[appLangOrder].description,
                                        0
                                    );
                                else {
                                    languageConfigManagerObject.setLangConfig(chosenLang);
                                    let warningConfirmDialogChosen =
                                        new ConfirmDialog(
                                            mainWindow,
                                            "warning",
                                            dialogTxt[appLangOrder].buttons,
                                            1,
                                            dialogTxt[appLangOrder].title,
                                            dialogTxt[appLangOrder].description,
                                            0
                                        );
                                    if (warningConfirmDialogChosen.confirm) {
                                        console.log("选择了" + langList[chosenLang].description);
                                        // 重启应用
                                        app.relaunch();
                                        app.quit();
                                    } else {  // 确定
                                        console.log("取消");
                                    }
                                }
                            }
                        },
                        {
                            label: langList[1].description,
                            click: () => {
                                let chosenLang = 1;
                                let dialogTxtPackage = appLang(langList[chosenLang].description).menu;
                                let dialogNoNeedTxt =
                                    dialogTxtPackage.LangNoNeedSwitchDialog;
                                let dialogTxt =
                                    dialogTxtPackage.LangSwitchConfirmDialog;

                                if (chosenLang === appLangOrder)
                                    new ConfirmDialog(
                                        mainWindow,
                                        "warning",
                                        dialogNoNeedTxt[appLangOrder].buttons,
                                        0,
                                        dialogNoNeedTxt[appLangOrder].title,
                                        dialogNoNeedTxt[appLangOrder].description,
                                        0
                                    );
                                else {
                                    languageConfigManagerObject.setLangConfig(chosenLang);
                                    let warningConfirmDialogChosen =
                                        new ConfirmDialog(
                                            mainWindow,
                                            "warning",
                                            dialogTxt[appLangOrder].buttons,
                                            1,
                                            dialogTxt[appLangOrder].title,
                                            dialogTxt[appLangOrder].description,
                                            0
                                        );
                                    if (warningConfirmDialogChosen.confirm) {
                                        console.log("选择了" + langList[chosenLang].description);
                                        // 重启应用
                                        app.relaunch();
                                        app.quit();
                                    } else {  // 确定
                                        console.log("取消");
                                    }
                                }
                            }
                        },
                        {
                            label: langList[2].description,
                            click: () => {
                                let chosenLang = 2;
                                let dialogTxtPackage = appLang(langList[chosenLang].description).menu;
                                let dialogNoNeedTxt =
                                    dialogTxtPackage.LangNoNeedSwitchDialog;
                                let dialogTxt =
                                    dialogTxtPackage.LangSwitchConfirmDialog;

                                if (chosenLang === appLangOrder)
                                    new ConfirmDialog(
                                        mainWindow,
                                        "warning",
                                        dialogNoNeedTxt[appLangOrder].buttons,
                                        0,
                                        dialogNoNeedTxt[appLangOrder].title,
                                        dialogNoNeedTxt[appLangOrder].description,
                                        0
                                    );
                                else {
                                    languageConfigManagerObject.setLangConfig(chosenLang);
                                    let warningConfirmDialogChosen =
                                        new ConfirmDialog(
                                            mainWindow,
                                            "warning",
                                            dialogTxt[appLangOrder].buttons,
                                            1,
                                            dialogTxt[appLangOrder].title,
                                            dialogTxt[appLangOrder].description,
                                            0
                                        );
                                    if (warningConfirmDialogChosen.confirm) {
                                        console.log("选择了" + langList[chosenLang].description);
                                        // 重启应用
                                        app.relaunch();
                                        app.quit();
                                    } else {  // 确定
                                        console.log("取消");
                                    }
                                }
                            }
                        }
                    ]
                },
            ],
        },
        {
            label: appLang().menu.theme[appLangOrder],
            submenu: [
                {
                    label: appLang().menu.lightMode[appLangOrder],
                    click: () => {}
                },
                {
                    label: appLang().menu.darkMode[appLangOrder],
                    click: () => {}
                },
            ],
        },

        ...(isMac ? [{
            label: appLang().menu.help[appLangOrder],
            submenu: [
                {
                    label: appLang().menu.moreInfo[appLangOrder],
                    click: async () => {
                        const { shell } = require('electron');
                        await shell.openExternal("url");
                    }
                },
                {
                    label: appLang().menu.donate[appLangOrder],
                    click: () => {
                    }
                }
            ]
        }] : [{
            label: appLang().menu.help[appLangOrder],
            submenu: [
                {
                    label: appLang().menu.about[appLangOrder],
                    click: () => {
                        aboutPage();
                    }
                },
                {
                    label: appLang().menu.moreInfo[appLangOrder],
                    click: async () => {
                        const { shell } = require('electron');
                        await shell.openExternal("url");
                    }
                },
                {
                    label: appLang().menu.donate[appLangOrder],
                    click: () => {
                    }
                }
            ]
        }]),
    ];
}

module.exports = GlobalMenu;
