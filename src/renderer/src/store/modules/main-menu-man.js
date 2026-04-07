import {mainManuAllHide} from "./common.js";

export const mainMenuMan = {
    state: () => {
        return {
            // AME菜单栏相关变量
            fileMenuStyleStatus: false,
            editMenuStyleStatus: false,
            viewMenuStyleStatus: false,
            toolMenuStyleStatus: false,
            helpMenuStyleStatus: false,
        };
    },
    mutations: {
        // 以下是更改App菜单栏相关方法
        // 关闭所有菜单栏下拉
        mainManuAllHide(state) {
            mainManuAllHide(state);
        },
        mainManuClick(state, id) {
            // 先初始化菜单栏下拉
            mainManuAllHide(state);
            // 然后对点击的菜单栏应用显示（true：显示）
            switch (id) {
                case "file":
                    state.fileMenuStyleStatus = true;
                    break;
                case "edit":
                    state.editMenuStyleStatus = true;
                    break;
                case "view":
                    state.viewMenuStyleStatus = true;
                    break;
                case "tool":
                    state.toolMenuStyleStatus = true;
                    break;
                case "help":
                    state.helpMenuStyleStatus = true;
                    break;
            }
        },
    },
    actions: {

    },
}
