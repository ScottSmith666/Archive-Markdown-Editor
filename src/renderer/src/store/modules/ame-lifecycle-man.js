export const ameLifecycleMan = {
    state: () => {
        return {
            showModal: false,
            showTip: false,
            showDonate: false,
            showLoading: false,
            showSaveAs: false,
            showExport: false,
            showPreview: false,
            appVersion: '',

            tLevel: 'info',  // 普通弹出提示框的等级，分为success、info和fail
            tipContent: '',  // 普通弹出提示框的内容
            loadingContent: '',  // 加载弹出提示框的内容
            tipDisplayTime: 2,  // 普通弹出提示框的显示时间，单位是秒
        };
    },
    mutations: {
        toggleModal(state, object) {
            // object: {wantToOpen: true or false, kind: "..."}
            state.showModal = object.wantToOpen;
            if (object.kind === 'donate') {  // kind是提示框的类型，none则是仅弹出背景模态框
                state.showDonate = object.wantToOpen;
            } else if (object.kind === 'save-as') {
                state.showSaveAs = object.wantToOpen;
            } else if (object.kind === 'export') {
                state.showExport = object.wantToOpen;
            } else if (object.kind === 'preview') {
                state.showPreview = object.wantToOpen;
            }
        },
        autoTips(state, object) {
            // object: {wantToOpen: true or false, kind: "...", tipLevel: "...", content: "..."}
            state.showModal = object.wantToOpen;
            if (object.kind === 'loading') {  // kind是提示框的类型，分为loading和tip，none则是仅弹出背景模态框
                state.loadingContent = object.content;
                state.showLoading = object.wantToOpen;
            } else if (object.kind === 'tip') {
                state.tipContent = object.content;
                state.tLevel = object.tipLevel;
                state.showTip = object.wantToOpen;
                setTimeout(() => {
                    state.showTip = false;
                    state.showModal = false;
                }, state.tipDisplayTime * 1000);
            }
        },
        hideLoading(state) {
            state.showLoading = !state.showLoading;
            state.showModal = !state.showModal;
        },
        quitApp(state) {
            window.confirmPreload.tryClose();
        },
    },
    actions: {
        async getAppVersion({commit, rootState}) {
            rootState.lifecycle.appVersion = await window.appVersionPreload.getAppVersion();
        },
    }
}
