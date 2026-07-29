import {app, Menu} from "electron";

const isMac = process.platform === 'darwin';
export const menu = () => {
    return Menu.setApplicationMenu(
        Menu.buildFromTemplate([
            ...(isMac ? [{
                    label: app.name,
                }] : []
            ),
        ])
    );
}

export const trayMenu = () => {
    return Menu.buildFromTemplate([
        {
            role: 'quit'
        }
    ]);
};
