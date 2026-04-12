<script setup>
import {onBeforeRouteLeave} from "vue-router";

onBeforeRouteLeave((to, from) => {
    console.log("修改设置");
});
</script>

<template>
<h1>设置</h1>
</template>

<style scoped>

</style>
