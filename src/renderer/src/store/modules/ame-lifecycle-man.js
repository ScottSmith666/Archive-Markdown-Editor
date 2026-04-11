export const ameLifecycleMan = {
    state: () => {
        return {
            showModal: false,
            showTip: false,
            showDonate: false,
            showLoading: false,
            showSaveAs: false,
            showMdzMediaMan: false,

            tLevel: 'info',  // 普通弹出提示框的等级，分为success、info和fail
            tipContent: '',  // 普通弹出提示框的内容
            loadingContent: '',  // 加载弹出提示框的内容
            tipDisplayTime: 1.2,  // 普通弹出提示框的显示时间，单位是秒
        };
    },
    mutations: {
        toggleModal(state, object) {
            // object: {kind: "..."}
            state.showModal = !state.showModal;
            if (object.kind === 'donate') {  // kind是提示框的类型，none则是仅弹出背景模态框
                state.showDonate = !state.showDonate;
            } else if (object.kind === 'save-as') {
                state.showSaveAs = !state.showSaveAs;
            }
        },
        autoTips(state, object) {
            // object: {kind: "...", tipLevel: "...", content: "..."}
            state.showModal = !state.showModal;
            if (object.kind === 'loading') {  // kind是提示框的类型，分为loading和tip，none则是仅弹出背景模态框
                state.loadingContent = object.content;
                state.showLoading = !state.showLoading;
            } else if (object.kind === 'tip') {
                state.tipContent = object.content;
                state.tLevel = object.tipLevel;
                state.showTip = !state.showTip;
                setTimeout(() => {
                    state.showTip = !state.showTip;
                    state.showModal = !state.showModal;
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
}
