"use strict";

const path = require("node:path");
const { app, BrowserWindow } = require("electron");
const LanguageLocale = require(path.join(__dirname, '../libs/languages'));
const SqliteMan = require(path.join(__dirname, '../libs/sqliteman'));
const Windows = require(path.join(__dirname, '../multi-windows/windows'));
const LittleWindows = require(path.join(__dirname, '../multi-windows/littlewindows'));

// 加载设置文件内容
const settingsConfigManager = new SqliteMan.SettingsConfigManager();

let appLangOrder = Number(settingsConfigManager.getSettings("lang_index"));
let appLangObj = new LanguageLocale();
let appLang = appLangObj.operationsInstructions;
let littleWindows = new LittleWindows();

function GlobalMenu(mainWindow, aboutWindow, settingsWindow) {
    const isMac = process.platform === 'darwin';

    let windowsSettingsInFileList = () => {
        let subMenu = [
            {
                label: appLang().menu.settings[appLangOrder],
                accelerator: 'command+,',
                click: () => {
                    settingsWindow = littleWindows.settingsPage(mainWindow, settingsWindow);
                }
            },
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
        ];

        if (isMac) subMenu.shift();  // 去掉menu列表中处于第一位的“设置”单元
        return subMenu;
    }

    this.menu = [
        ...(isMac ? [{  // 如果是Mac，则显示苹果标志右边的那个特殊菜单栏
                label: app.name,
                submenu: [
                    {
                        label: appLang().menu.about[appLangOrder],
                        click: () => {
                            aboutWindow = littleWindows.aboutPage(mainWindow, aboutWindow);
                        }
                    },
                    {
                        label: appLang().menu.settings[appLangOrder],
                        accelerator: 'command+,',
                        click: () => {
                            settingsWindow = littleWindows.settingsPage(mainWindow, settingsWindow);
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
                        let newFileWindow = new Windows();
                        newFileWindow.mainWindow(mainWindow);
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
            submenu: windowsSettingsInFileList(),
        },
        {
            label: appLang().menu.view[appLangOrder],
            submenu: [
                {
                    label: appLang().menu.theme[appLangOrder],
                    submenu: [
                        {
                            label: appLang().menu.lightMode[appLangOrder],
                            click: () => {},
                        },
                        {
                            label: appLang().menu.darkMode[appLangOrder],
                            click: () => {},
                        },
                    ],
                },
                {
                    label: appLang().menu.mode[appLangOrder],
                    submenu: [
                        {
                            label: appLang().menu.viewMode[appLangOrder],
                            click: () => {},
                        },
                        {
                            label: appLang().menu.editMode[appLangOrder],
                            click: () => {},
                        },
                        {
                            label: appLang().menu.mixMode[appLangOrder],
                            click: () => {},
                        },
                    ],
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
            ]
        }]),
        {
            label: appLang().menu.donate[appLangOrder],
            submenu: [
                {
                    label: appLang().menu.donateToSS[appLangOrder],
                    click: () => {},
                },
            ],
        },
    ];

    this.menuSimple = [
        ...(isMac ? [{  // 如果是Mac，则显示苹果标志右边的那个特殊菜单栏
                label: app.name,
                submenu: [
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
    ];
}

module.exports = GlobalMenu;
