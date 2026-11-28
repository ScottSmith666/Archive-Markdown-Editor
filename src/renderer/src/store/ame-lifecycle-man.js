import { defineStore } from 'pinia';

export const useAmeLifecycleManStore
    = defineStore('ame-lifecycle-man', {
    state: () => {
        return {
            showModal: false,
            showTip: false,
            showDonate: false,
            showLoading: false,
            showSaveAs: false,
            showExport: false,
            showExportPdf: false,
            showPreview: false,
            appVersion: '',
            tLevel: 'info',  // 普通弹出提示框的等级，分为success、info和fail
            tipContent: '',  // 普通弹出提示框的内容
            loadingContent: '',  // 加载弹出提示框的内容
            tipDisplayTime: 2,  // 普通弹出提示框的显示时间，单位是秒
        };
    },

    actions: {
        toggleModal(object) {
            // object: {wantToOpen: true or false, kind: "..."}
            this.showModal = object.wantToOpen;
            if (object.kind === 'donate') {  // kind是提示框的类型，none则是仅弹出背景模态框
                this.showDonate = object.wantToOpen;
            } else if (object.kind === 'save-as') {
                this.showSaveAs = object.wantToOpen;
            } else if (object.kind === 'export') {
                this.showExport = object.wantToOpen;
            } else if (object.kind === 'export-pdf') {
                // 导出PDF的参数框（纸张、方向、页边距……）
                this.showExportPdf = object.wantToOpen;
            } else if (object.kind === 'preview') {
                this.showPreview = object.wantToOpen;
            }
        },
        autoTips(object) {
            // object: {wantToOpen: true or false, kind: "...", tipLevel: "...", content: "..."}
            this.showModal = object.wantToOpen;
            if (object.kind === 'loading') {  // kind是提示框的类型，分为loading和tip，none则是仅弹出背景模态框
                this.loadingContent = object.content;
                this.showLoading = object.wantToOpen;
            } else if (object.kind === 'tip') {
                this.tipContent = object.content;
                this.tLevel = object.tipLevel;
                this.showTip = object.wantToOpen;
                setTimeout(() => {
                    this.showTip = false;
                    this.showModal = false;
                }, this.tipDisplayTime * 1000);
            }
        },
        hideLoading() {
            this.showLoading = false;
            this.showModal = false;
        },
        quitApp() {
            window.confirmPreload.tryClose();
        },
        async getAppVersion() {
            this.appVersion = await window.appVersionPreload.getAppVersion();
        },
    },
});
