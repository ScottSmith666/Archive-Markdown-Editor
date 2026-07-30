<script setup>
import {onMounted} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();

onMounted(() => {
    let paramsObj = route.query;
    let exportType = paramsObj.exporttype;
    let originFileContent = paramsObj.origincontent;
    const exportWorker = new Worker("../../../../worker/exporter.js", {type: "module"});
    // 启动Worker执行任务
    exportWorker.postMessage([exportType, originFileContent]);

    // 监听并接收worker结果
    exportWorker.addEventListener("message", (e) => {
        // 获得渲染完成的HTML字符串
        const htmlContent = e.data;

    });
});
</script>

<template>

</template>

<style scoped>

</style>
