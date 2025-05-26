"use strict";

const { app } = require("electron");


function GlobalMenu() {
    const isMac = process.platform === 'darwin';

    this.menuSimple = [
        ...(isMac ? [{  // 如果是Mac，则显示苹果标志右边的那个特殊菜单栏
                label: app.name,
                submenu: [
                    {
                        label: 'Quit',
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
