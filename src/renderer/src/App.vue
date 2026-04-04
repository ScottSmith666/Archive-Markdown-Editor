<script setup>
import router from "./router";
import {onMounted, ref} from "vue";
import TabMan from "./components/main/TabMan.vue";
import MenuBar from "./components/main/MenuBar.vue";
import { useStore } from 'vuex';

const store = useStore();

// data

// created

// mounted
onMounted(() => {
    // 如没有激活的标签页，就打开默认页面
    if (store.state.tabList.size === 0) {
        router.push("/");
    } else {
        // 打开应用时监测标签页哪个被激活了就开启哪个页面
        for (let [key, value] of store.state.tabList) {
            if (value.get('focus')) {
                store.commit('setSwitchedPage', value.monacoEditorModel);
                router.push(value.get('path'));
                return 0;
            }
        }
    }
});

// methods
</script>

<template>
    <!--模态框-->
    <!--设置页面-->

    <!--关于页面-->

    <!--普通提示-->

    <!--加载提示-->

    <!--查找与替换-->

    <!--mdz转化工具-->

    <!--mdz媒体管理工具-->

    <div class="main-page">
        <!--菜单栏-->
        <MenuBar />
        <div class="work-page" @mouseenter="store.commit('mainManuAllHide')">
            <!--标签管理器-->
            <TabMan />
            <!--变换区，切换成默认页面、新标签页、新建文件或打开的文件内容-->
            <router-view></router-view>
        </div>
    </div>
</template>
<style scoped>
@import "./assets/main.css";
</style>
