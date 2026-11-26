# 2026-11-22T13:50:01+08:00

## 本次修改概述

- 文件：`src/renderer/src/store/file-man.js`
- 层级：renderer 层（未触碰 preload / main 层）
- 原始总行数：1078
- 修改后总行数：1075
- 修改目标：把 `file-man.js` 由 Vuex 风格模块改为 Pinia store（`defineStore` + `actions`），并把原先对 `common.js` 中「带 state / rootState 参数」的辅助函数的调用，改为「store 引用 store 的变量 / 方法」。
- 逐处对应关系：`commit('hdLoading', rootState)` → `ameLifecycleManStore.hideLoading()`；`commit('tgModel', ...)` / `commit('hdSaveForm', ...)` → `ameLifecycleManStore.toggleModal(...)`；`commit('actModel', ...)` → `ameLifecycleManStore.autoTips(...)`；`commit('changeFileStoreData', v)` → `this.changeFileStoreData(v)`；`rootState.tab.*` → `tabManStore.*`；`rootState.i18n.langPackage[rootState.settings.lang]` → `i18nStore.langPackage[settingsManStore.lang]`；`rootState.file.saveAsError` → `this.saveAsError`。

本次共 75 处改动点：

## 改动点 1

**原始行数：无（本次为新增内容）**

**修改后行数：1**
```js
// 仅保留与 store 状态无关的纯工具函数，状态相关的一律改为引用对应的 store
```

## 改动点 2

**原始行数：2-4**
```js
    actModel,
    tgModel,
    afterChosenFile,
```

**修改后行数：无（本次为删除内容）**

## 改动点 3

**原始行数：7**
```js
    hdLoading,
```

**修改后行数：无（本次为删除内容）**

## 改动点 4

**原始行数：9-11**
```js
    verifySaveForm,
    hdSaveForm,
    getNow, isOpened, addTabPage
```

**修改后行数：6**
```js
    getNow
```

## 改动点 5

**原始行数：无（本次为新增内容）**

**修改后行数：15-99**
```js
// 密码弹出框
const showPasswordPrompt = (t, message, isWrongPassword) => {
    return new Promise((resolve) => {
        const modal = document.getElementById('pwd-modal');
        const form = document.getElementById('pwd-form');
        const input = document.getElementById('pwd-input');
        const title = document.getElementById('pwd-title');
        const msg = document.getElementById('pwd-msg');

        title.innerText = t;
        // 如果密码错误，则字体呈现红色
        if (isWrongPassword) {
            title.style.color = "red";
        }
        msg.innerText = message;
        input.value = ''; // 清空上次输入
        modal.style.display = 'block'; // 显示遮罩
        form.style.display = 'block'; // 显示窗体
        input.focus();

        // 绑定确定按钮
        document.getElementById('pwd-ok').onclick = () => {
            modal.style.display = 'none';
            form.style.display = 'none';
            title.style.color = "#42b983";
            resolve(input.value); // 返回输入的密码
        };

        // 绑定回车键事件
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                modal.style.display = 'none';
                form.style.display = 'none';
                title.style.color = "#42b983";
                resolve(input.value); // 返回输入的密码
            }
        });

        // 绑定取消按钮
        document.getElementById('pwd-cancel').onclick = () => {
            modal.style.display = 'none';
            form.style.display = 'none';
            title.style.color = "#42b983";
            resolve(null); // 返回 null 代表取消
        };
    });
};

// 保存表单验证，提示文案改为从 i18n store 取
const verifySaveForm = (formArray, i18nStore, settingsManStore) => {
    // 用户提供的文件信息，则包含：data = [单纯文件名, 扩展名, 保存路径, 密码, 再次输入密码]
    const fileForbiddenChars = [">", "<", ":", "'", "|", "*", "?"];

    if (formArray[0] === '') {
        return {
            "success": false,
            message: i18nStore.langPackage[settingsManStore.lang].dialog.saveForm.fileNameRequired
        };
    }

    for (let i = 0; i < fileForbiddenChars.length; i++) {
        if (formArray[0].includes(fileForbiddenChars[i])) {
            return {
                "success": false,
                message: i18nStore.langPackage[settingsManStore.lang].dialog.saveForm.forbiddenChars
            };
        }
    }

    if (formArray[2] === '') {
        return {
            "success": false,
            message: i18nStore.langPackage[settingsManStore.lang].dialog.saveForm.savePathRequired
        };
    }

    if (formArray[3] !== formArray[4]) {
        return {
            "success": false,
            message: i18nStore.langPackage[settingsManStore.lang].dialog.saveForm.twicePasswordNotSame
        };
    }
    return {"success": true};
};

```

## 改动点 6

**原始行数：55**
```js
        afterChosenFile(rootState, result, isHistoryMethod = false) {
```

**修改后行数：135-136**
```js
        // 用户选中文件之后的处理（打开文件 / 历史记录打开）
        afterChosenFile(result, isHistoryMethod = false) {
```

## 改动点 7

**原始行数：251-257**
```js
        openFileFromHistoryMethod(state, object) {
            let rootState = object.rootState;
            let result = object.result;
            afterChosenFile(rootState, result, true);
        },
        changeFileStoreData(state, value) {
            state.isListenFileChange = value;
```

**修改后行数：332-334**
```js
        // 在历史记录中打开文件时，走同一条处理链路
        openFileFromHistoryMethod(result) {
            this.afterChosenFile(result, true);
```

## 改动点 8

**原始行数：260-270**
```js
        hdLoading(state, rootState) {
            hdLoading(rootState);
        },
        hdSaveForm(state, rootState) {
            hdSaveForm(rootState);
        },
        tgModel(state, object) {
            tgModel(object.rootState, object.object);
        },
        actModel(state, object) {
            actModel(object.rootState, object.object);
```

**修改后行数：337-338**
```js
        changeFileStoreData(value) {
            this.isListenFileChange = value;
```

## 改动点 9

**原始行数：274-275**
```js
        activateOpenFileDialogAction({commit, rootState}) {
            commit('activateOpenFileDialogMethod', rootState);
```

**修改后行数：342-343**
```js
        activateOpenFileDialogAction() {
            this.activateOpenFileDialogMethod();
```

## 改动点 10

**原始行数：278-283**
```js
        openFileFromHistoryAction({commit, rootState}, result) {
            let object = {
                'rootState': rootState,
                'result': result  // result: {'filePath': '...', 'fileName': '...'}
            };
            commit('openFileFromHistoryMethod', object);
```

**修改后行数：346-347**
```js
        openFileFromHistoryAction(result) {
            this.openFileFromHistoryMethod(result);
```

## 改动点 11

**原始行数：286**
```js
        async directSaveAction({commit, rootState}, data = []) {
```

**修改后行数：350**
```js
        async directSaveAction(data = []) {
```

## 改动点 12

**原始行数：无（本次为新增内容）**

**修改后行数：355-359**
```js
            const ameLifecycleManStore = useAmeLifecycleManStore();
            const i18nStore = useI18nStore();
            const settingsManStore = useSettingsManStore();
            const tabManStore = useTabManStore();

```

## 改动点 13

**原始行数：292**
```js
            let currentPageInfo = rootState.tab.tabList.get(rootState.tab.currentOpenedPageId);
```

**修改后行数：361**
```js
            let currentPageInfo = tabManStore.tabList.get(tabManStore.currentOpenedPageId);
```

## 改动点 14

**原始行数：301-304**
```js
                commit('tgModel', {
                    rootState: rootState,
                    object: {kind: "none"}
                });
```

**修改后行数：370**
```js
                ameLifecycleManStore.toggleModal({wantToOpen: true, kind: "none"});
```

## 改动点 15

**原始行数：306-311**
```js
                commit("actModel", {
                    rootState: rootState,
                    object: {
                        'kind': 'loading',
                        'content': rootState.i18n.langPackage[rootState.settings.lang].dialog.loading.save,
                    }
```

**修改后行数：372-375**
```js
                ameLifecycleManStore.autoTips({
                    'wantToOpen': true,
                    'kind': 'loading',
                    'content': i18nStore.langPackage[settingsManStore.lang].dialog.loading.save,
```

## 改动点 16

**原始行数：338**
```js
                            commit('changeFileStoreData', false);
```

**修改后行数：402**
```js
                            this.changeFileStoreData(false);
```

## 改动点 17

**原始行数：382-383**
```js
                                            commit('hdLoading', rootState);
                                            commit('changeFileStoreData', true);
```

**修改后行数：446-447**
```js
                                            ameLifecycleManStore.hideLoading();
                                            this.changeFileStoreData(true);
```

## 改动点 18

**原始行数：388-389**
```js
                                            commit('hdLoading', rootState);
                                            commit('changeFileStoreData', true);
```

**修改后行数：452-453**
```js
                                            ameLifecycleManStore.hideLoading();
                                            this.changeFileStoreData(true);
```

## 改动点 19

**原始行数：398-410**
```js
                                commit('hdLoading', rootState);
                                commit('tgModel', {
                                    rootState: rootState,
                                    object: {kind: "none"}
                                });
                                commit("actModel", {
                                    rootState: rootState,
                                    object: {
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': rootState.i18n.langPackage[rootState.settings.lang].dialog.activeTip.saveFailed,
                                        'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                    }
```

**修改后行数：462-468**
```js
                                ameLifecycleManStore.hideLoading();
                                ameLifecycleManStore.autoTips({
                                    'wantToOpen': true,
                                    'kind': 'tip',
                                    'tipLevel': 'fail',
                                    'content': i18nStore.langPackage[settingsManStore.lang].dialog.activeTip.saveFailed,
                                    'showTimeSecond': ameLifecycleManStore.tipDisplayTime
```

## 改动点 20

**原始行数：412**
```js
                                commit('changeFileStoreData', true);
```

**修改后行数：470**
```js
                                this.changeFileStoreData(true);
```

## 改动点 21

**原始行数：419-420**
```js
                            commit('hdLoading', rootState);
                            commit('changeFileStoreData', true);
```

**修改后行数：477-478**
```js
                            ameLifecycleManStore.hideLoading();
                            this.changeFileStoreData(true);
```

## 改动点 22

**原始行数：427**
```js
                        commit('hdLoading', rootState);
```

**修改后行数：485**
```js
                        ameLifecycleManStore.hideLoading();
```

## 改动点 23

**原始行数：453**
```js
                                    commit('hdLoading', rootState);
```

**修改后行数：511**
```js
                                    ameLifecycleManStore.hideLoading();
```

## 改动点 24

**原始行数：456**
```js
                                    commit('hdLoading', rootState);
```

**修改后行数：514**
```js
                                    ameLifecycleManStore.hideLoading();
```

## 改动点 25

**原始行数：463**
```js
                                commit('hdLoading', rootState);
```

**修改后行数：521**
```js
                                ameLifecycleManStore.hideLoading();
```

## 改动点 26

**原始行数：468**
```js
                            commit('hdLoading', rootState);
```

**修改后行数：526**
```js
                            ameLifecycleManStore.hideLoading();
```

## 改动点 27

**原始行数：473**
```js
                        commit('hdLoading', rootState);
```

**修改后行数：531**
```js
                        ameLifecycleManStore.hideLoading();
```

## 改动点 28

**原始行数：478-483**
```js
                commit("actModel", {
                    rootState: rootState,
                    object: {
                        'kind': 'loading',
                        'content': rootState.i18n.langPackage[rootState.settings.lang].dialog.loading.save,
                    }
```

**修改后行数：536-539**
```js
                ameLifecycleManStore.autoTips({
                    'wantToOpen': true,
                    'kind': 'loading',
                    'content': i18nStore.langPackage[settingsManStore.lang].dialog.loading.save,
```

## 改动点 29

**原始行数：487**
```js
                let verifyResult = verifySaveForm(planSaveFileInfo, rootState);
```

**修改后行数：543**
```js
                let verifyResult = verifySaveForm(planSaveFileInfo, i18nStore, settingsManStore);
```

## 改动点 30

**原始行数：490-495**
```js
                    commit('hdLoading', rootState);
                    commit('tgModel', {
                        rootState: rootState,
                        object: {kind: "none"}
                    });
                    rootState.file.saveAsError = verifyResult.message;
```

**修改后行数：546-549**
```js
                    ameLifecycleManStore.hideLoading();
                    // 表单不关闭，保留模态背景以便显示错误信息
                    ameLifecycleManStore.toggleModal({wantToOpen: true, kind: "none"});
                    this.saveAsError = verifyResult.message;
```

## 改动点 31

**原始行数：499-504**
```js
                // 隐藏保存表单
                commit('hdSaveForm', rootState);
                commit('tgModel', {
                    rootState: rootState,
                    object: {kind: "none"}
                });
```

**修改后行数：553-555**
```js
                // 隐藏“另存为”表单，但保留加载提示所需的模态背景
                ameLifecycleManStore.toggleModal({wantToOpen: false, kind: 'save-as'});
                ameLifecycleManStore.toggleModal({wantToOpen: true, kind: 'none'});
```

## 改动点 32

**原始行数：540**
```js
                                    `pageid=${rootState.tab.currentOpenedPageId}&` +
```

**修改后行数：591**
```js
                                    `pageid=${tabManStore.currentOpenedPageId}&` +
```

## 改动点 33

**原始行数：543**
```js
                                currentPageInfo.set("pageid", rootState.tab.currentOpenedPageId);
```

**修改后行数：594**
```js
                                currentPageInfo.set("pageid", tabManStore.currentOpenedPageId);
```

## 改动点 34

**原始行数：553**
```js
                                        commit('hdLoading', rootState);
```

**修改后行数：604**
```js
                                        ameLifecycleManStore.hideLoading();
```

## 改动点 35

**原始行数：556**
```js
                                        commit('hdLoading', rootState);
```

**修改后行数：607**
```js
                                        ameLifecycleManStore.hideLoading();
```

## 改动点 36

**原始行数：563**
```js
                                    commit('hdLoading', rootState);
```

**修改后行数：614**
```js
                                    ameLifecycleManStore.hideLoading();
```

## 改动点 37

**原始行数：568**
```js
                                commit('hdLoading', rootState);
```

**修改后行数：619**
```js
                                ameLifecycleManStore.hideLoading();
```

## 改动点 38

**原始行数：573-574**
```js
                            commit('hdLoading', rootState);
                            console.error(err);
```

**修改后行数：624-625**
```js
                            ameLifecycleManStore.hideLoading();
                            console.error(e);
```

## 改动点 39

**原始行数：588**
```js
                                commit('changeFileStoreData', false);
```

**修改后行数：639**
```js
                                this.changeFileStoreData(false);
```

## 改动点 40

**原始行数：645**
```js
                                                `pageid=${rootState.tab.currentOpenedPageId}&` +
```

**修改后行数：696**
```js
                                                `pageid=${tabManStore.currentOpenedPageId}&` +
```

## 改动点 41

**原始行数：648**
```js
                                            currentPageInfo.set("pageid", rootState.tab.currentOpenedPageId);
```

**修改后行数：699**
```js
                                            currentPageInfo.set("pageid", tabManStore.currentOpenedPageId);
```

## 改动点 42

**原始行数：659-660**
```js
                                                commit('hdLoading', rootState);
                                                commit('changeFileStoreData', true);
```

**修改后行数：710-711**
```js
                                                ameLifecycleManStore.hideLoading();
                                                this.changeFileStoreData(true);
```

## 改动点 43

**原始行数：665-666**
```js
                                                commit('hdLoading', rootState);
                                                commit('changeFileStoreData', true);
```

**修改后行数：716-717**
```js
                                                ameLifecycleManStore.hideLoading();
                                                this.changeFileStoreData(true);
```

## 改动点 44

**原始行数：675-687**
```js
                                    commit('hdLoading', rootState);
                                    commit('tgModel', {
                                        rootState: rootState,
                                        object: {kind: "none"}
                                    });
                                    commit("actModel", {
                                        rootState: rootState,
                                        object: {
                                            'kind': 'tip',
                                            'tipLevel': 'fail',
                                            'content': rootState.i18n.langPackage[rootState.settings.lang].dialog.activeTip.saveFailed,
                                            'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                        }
```

**修改后行数：726-732**
```js
                                    ameLifecycleManStore.hideLoading();
                                    ameLifecycleManStore.autoTips({
                                        'wantToOpen': true,
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': i18nStore.langPackage[settingsManStore.lang].dialog.activeTip.saveFailed,
                                        'showTimeSecond': ameLifecycleManStore.tipDisplayTime
```

## 改动点 45

**原始行数：689**
```js
                                    commit('changeFileStoreData', true);
```

**修改后行数：734**
```js
                                    this.changeFileStoreData(true);
```

## 改动点 46

**原始行数：696-708**
```js
                                commit('hdLoading', rootState);
                                commit('tgModel', {
                                    rootState: rootState,
                                    object: {kind: "none"}
                                });
                                commit("actModel", {
                                    rootState: rootState,
                                    object: {
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': result.message,
                                        'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                    }
```

**修改后行数：741-747**
```js
                                ameLifecycleManStore.hideLoading();
                                ameLifecycleManStore.autoTips({
                                    'wantToOpen': true,
                                    'kind': 'tip',
                                    'tipLevel': 'fail',
                                    'content': result.message,
                                    'showTimeSecond': ameLifecycleManStore.tipDisplayTime
```

## 改动点 47

**原始行数：710**
```js
                                commit('changeFileStoreData', true);
```

**修改后行数：749**
```js
                                this.changeFileStoreData(true);
```

## 改动点 48

**原始行数：717-729**
```js
                            commit('hdLoading', rootState);
                            commit('tgModel', {
                                rootState: rootState,
                                object: {kind: "none"}
                            });
                            commit("actModel", {
                                rootState: rootState,
                                object: {
                                    'kind': 'tip',
                                    'tipLevel': 'fail',
                                    'content': e,
                                    'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                }
```

**修改后行数：756-762**
```js
                            ameLifecycleManStore.hideLoading();
                            ameLifecycleManStore.autoTips({
                                'wantToOpen': true,
                                'kind': 'tip',
                                'tipLevel': 'fail',
                                'content': e,
                                'showTimeSecond': ameLifecycleManStore.tipDisplayTime
```

## 改动点 49

**原始行数：748**
```js
                                commit('changeFileStoreData', false);
```

**修改后行数：781**
```js
                                this.changeFileStoreData(false);
```

## 改动点 50

**原始行数：787**
```js
                                        `pageid=${rootState.tab.currentOpenedPageId}&` +
```

**修改后行数：820**
```js
                                        `pageid=${tabManStore.currentOpenedPageId}&` +
```

## 改动点 51

**原始行数：790**
```js
                                    currentPageInfo.set("pageid", rootState.tab.currentOpenedPageId);
```

**修改后行数：823**
```js
                                    currentPageInfo.set("pageid", tabManStore.currentOpenedPageId);
```

## 改动点 52

**原始行数：801-802**
```js
                                        commit('hdLoading', rootState);
                                        commit('changeFileStoreData', true);
```

**修改后行数：834-835**
```js
                                        ameLifecycleManStore.hideLoading();
                                        this.changeFileStoreData(true);
```

## 改动点 53

**原始行数：807-808**
```js
                                        commit('hdLoading', rootState);
                                        commit('changeFileStoreData', true);
```

**修改后行数：840-841**
```js
                                        ameLifecycleManStore.hideLoading();
                                        this.changeFileStoreData(true);
```

## 改动点 54

**原始行数：815-827**
```js
                                    commit('hdLoading', rootState);
                                    commit('tgModel', {
                                        rootState: rootState,
                                        object: {kind: "none"}
                                    });
                                    commit("actModel", {
                                        rootState: rootState,
                                        object: {
                                            'kind': 'tip',
                                            'tipLevel': 'fail',
                                            'content': '保存失败！',
                                            'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                        }
```

**修改后行数：848-854**
```js
                                    ameLifecycleManStore.hideLoading();
                                    ameLifecycleManStore.autoTips({
                                        'wantToOpen': true,
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': '保存失败！',
                                        'showTimeSecond': ameLifecycleManStore.tipDisplayTime
```

## 改动点 55

**原始行数：829**
```js
                                    commit('changeFileStoreData', true);
```

**修改后行数：856**
```js
                                    this.changeFileStoreData(true);
```

## 改动点 56

**原始行数：836-848**
```js
                                commit('hdLoading', rootState);
                                commit('tgModel', {
                                    rootState: rootState,
                                    object: {kind: "none"}
                                });
                                commit("actModel", {
                                    rootState: rootState,
                                    object: {
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': result.message,
                                        'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                    }
```

**修改后行数：863-869**
```js
                                ameLifecycleManStore.hideLoading();
                                ameLifecycleManStore.autoTips({
                                    'wantToOpen': true,
                                    'kind': 'tip',
                                    'tipLevel': 'fail',
                                    'content': result.message,
                                    'showTimeSecond': ameLifecycleManStore.tipDisplayTime
```

## 改动点 57

**原始行数：850**
```js
                                commit('changeFileStoreData', true);
```

**修改后行数：871**
```js
                                this.changeFileStoreData(true);
```

## 改动点 58

**原始行数：857-869**
```js
                            commit('hdLoading', rootState);
                            commit('tgModel', {
                                rootState: rootState,
                                object: {kind: "none"}
                            });
                            commit("actModel", {
                                rootState: rootState,
                                object: {
                                    'kind': 'tip',
                                    'tipLevel': 'fail',
                                    'content': e,
                                    'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                }
```

**修改后行数：878-884**
```js
                            ameLifecycleManStore.hideLoading();
                            ameLifecycleManStore.autoTips({
                                'wantToOpen': true,
                                'kind': 'tip',
                                'tipLevel': 'fail',
                                'content': e,
                                'showTimeSecond': ameLifecycleManStore.tipDisplayTime
```

## 改动点 59

**原始行数：885**
```js
                                commit('changeFileStoreData', false);
```

**修改后行数：900**
```js
                                this.changeFileStoreData(false);
```

## 改动点 60

**原始行数：930**
```js
                                                `pageid=${rootState.tab.currentOpenedPageId}&` +
```

**修改后行数：945**
```js
                                                `pageid=${tabManStore.currentOpenedPageId}&` +
```

## 改动点 61

**原始行数：933**
```js
                                            currentPageInfo.set("pageid", rootState.tab.currentOpenedPageId);
```

**修改后行数：948**
```js
                                            currentPageInfo.set("pageid", tabManStore.currentOpenedPageId);
```

## 改动点 62

**原始行数：944-945**
```js
                                                commit('hdLoading', rootState);
                                                commit('changeFileStoreData', true);
```

**修改后行数：959-960**
```js
                                                ameLifecycleManStore.hideLoading();
                                                this.changeFileStoreData(true);
```

## 改动点 63

**原始行数：950-951**
```js
                                                commit('hdLoading', rootState);
                                                commit('changeFileStoreData', true);
```

**修改后行数：965-966**
```js
                                                ameLifecycleManStore.hideLoading();
                                                this.changeFileStoreData(true);
```

## 改动点 64

**原始行数：960-972**
```js
                                    commit('hdLoading', rootState);
                                    commit('tgModel', {
                                        rootState: rootState,
                                        object: {kind: "none"}
                                    });
                                    commit("actModel", {
                                        rootState: rootState,
                                        object: {
                                            'kind': 'tip',
                                            'tipLevel': 'fail',
                                            'content': '保存失败！',
                                            'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                        }
```

**修改后行数：975-981**
```js
                                    ameLifecycleManStore.hideLoading();
                                    ameLifecycleManStore.autoTips({
                                        'wantToOpen': true,
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': '保存失败！',
                                        'showTimeSecond': ameLifecycleManStore.tipDisplayTime
```

## 改动点 65

**原始行数：974**
```js
                                    commit('changeFileStoreData', true);
```

**修改后行数：983**
```js
                                    this.changeFileStoreData(true);
```

## 改动点 66

**原始行数：981-993**
```js
                                commit('hdLoading', rootState);
                                commit('tgModel', {
                                    rootState: rootState,
                                    object: {kind: "none"}
                                });
                                commit("actModel", {
                                    rootState: rootState,
                                    object: {
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': result.message,
                                        'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                    }
```

**修改后行数：990-996**
```js
                                ameLifecycleManStore.hideLoading();
                                ameLifecycleManStore.autoTips({
                                    'wantToOpen': true,
                                    'kind': 'tip',
                                    'tipLevel': 'fail',
                                    'content': result.message,
                                    'showTimeSecond': ameLifecycleManStore.tipDisplayTime
```

## 改动点 67

**原始行数：995**
```js
                                commit('changeFileStoreData', true);
```

**修改后行数：998**
```js
                                this.changeFileStoreData(true);
```

## 改动点 68

**原始行数：1002-1014**
```js
                            commit('hdLoading', rootState);
                            commit('tgModel', {
                                rootState: rootState,
                                object: {kind: "none"}
                            });
                            commit("actModel", {
                                rootState: rootState,
                                object: {
                                    'kind': 'tip',
                                    'tipLevel': 'fail',
                                    'content': e,
                                    'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                }
```

**修改后行数：1005-1011**
```js
                            ameLifecycleManStore.hideLoading();
                            ameLifecycleManStore.autoTips({
                                'wantToOpen': true,
                                'kind': 'tip',
                                'tipLevel': 'fail',
                                'content': e,
                                'showTimeSecond': ameLifecycleManStore.tipDisplayTime
```

## 改动点 69

**原始行数：1037**
```js
                                    `pageid=${rootState.tab.currentOpenedPageId}&` +
```

**修改后行数：1034**
```js
                                    `pageid=${tabManStore.currentOpenedPageId}&` +
```

## 改动点 70

**原始行数：1040**
```js
                                currentPageInfo.set("pageid", rootState.tab.currentOpenedPageId);
```

**修改后行数：1037**
```js
                                currentPageInfo.set("pageid", tabManStore.currentOpenedPageId);
```

## 改动点 71

**原始行数：1050**
```js
                                        commit('hdLoading', rootState);
```

**修改后行数：1047**
```js
                                        ameLifecycleManStore.hideLoading();
```

## 改动点 72

**原始行数：1053**
```js
                                        commit('hdLoading', rootState);
```

**修改后行数：1050**
```js
                                        ameLifecycleManStore.hideLoading();
```

## 改动点 73

**原始行数：1060**
```js
                                    commit('hdLoading', rootState);
```

**修改后行数：1057**
```js
                                    ameLifecycleManStore.hideLoading();
```

## 改动点 74

**原始行数：1065**
```js
                                commit('hdLoading', rootState);
```

**修改后行数：1062**
```js
                                ameLifecycleManStore.hideLoading();
```

## 改动点 75

**原始行数：1070**
```js
                            commit('hdLoading', rootState);
```

**修改后行数：1067**
```js
                            ameLifecycleManStore.hideLoading();
```

