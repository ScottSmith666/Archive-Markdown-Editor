import {defineStore} from "pinia";

export const useMainMenuManStore = defineStore("main-menu-man", {
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
    actions: {
        // 以下是更改App菜单栏相关方法
        // 关闭所有菜单栏下拉
        mainManuAllHide() {
            this.fileMenuStyleStatus = false;
            this.editMenuStyleStatus = false;
            this.viewMenuStyleStatus = false;
            this.toolMenuStyleStatus = false;
            this.helpMenuStyleStatus = false;
        },
        mainManuClick(id) {
            // 先初始化菜单栏下拉
            this.mainManuAllHide();
            // 然后对点击的菜单栏应用显示（true：显示）
            switch (id) {
                case "file":
                    this.fileMenuStyleStatus = true;
                    break;
                case "edit":
                    this.editMenuStyleStatus = true;
                    break;
                case "view":
                    this.viewMenuStyleStatus = true;
                    break;
                case "tool":
                    this.toolMenuStyleStatus = true;
                    break;
                case "help":
                    this.helpMenuStyleStatus = true;
                    break;
            }
        },
    },
});
