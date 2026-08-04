<script setup>
import {useStore} from "vuex";

const store = useStore();

const props = defineProps({
    exportType: {
        type: String,
        default: () => {
            return "HTML";
        }
    },
    isExporting: {
        type: Boolean,
        default: () => {
            return false;
        }
    },
});

const emit = defineEmits(['terminate-export']);
</script>

<template>
<div class="footer-container">
    <div class="footer-version fonts">
        {{ store.state.i18n.langPackage[store.state.settings.lang].footerBar.version }}{{ store.state.lifecycle.appVersion }}
    </div>
    <div v-if="props.isExporting" class="footer-export-loading fonts" @dblclick="emit('terminate-export')">
        <div>
            <svg style="width: 12px; height: 12px;" width="100" height="100" viewBox="0 0 100 100"
                 xmlns="http://w3.org">
                <!-- 外层容器控制整体匀速旋转 -->
                <g>
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        dur="2s"
                        repeatCount="indefinite"
                    />

                    <!-- 内部圆环控制长度伸缩 -->
                    <circle
                        cx="50" cy="50" r="40"
                        stroke="#ffffff" stroke-width="8"
                        stroke-linecap="round"
                        fill="none"
                        stroke-dasharray="1, 251"
                        stroke-dashoffset="0"
                    >
                        <!-- 核心优化：让 stroke-dasharray 在 1 到 200 之间循环，产生拉伸感 -->
                        <animate
                            attributeName="stroke-dasharray"
                            values="1, 251; 150, 251; 1, 251"
                            keyTimes="0; 0.5; 1"
                            dur="1.5s"
                            repeatCount="indefinite"
                        />
                        <!-- 配合位移，消除“断点” -->
                        <animate
                            attributeName="stroke-dashoffset"
                            values="0; -100; -251"
                            keyTimes="0; 0.5; 1"
                            dur="1.5s"
                            repeatCount="indefinite"
                        />
                    </circle>
                </g>
            </svg>
        </div>
        <div style="width: 5px;"></div>
        <div>{{ store.state.i18n.langPackage[store.state.settings.lang].footerBar.exporting }}{{ props.exportType }}...{{ store.state.i18n.langPackage[store.state.settings.lang].footerBar.description }}</div>
    </div>
    <div class="footer-export-loading fonts" v-else></div>
</div>
</template>

<style scoped>
.footer-container {
    padding: 5px;
    width: 100%;
    height: 15px;
    background-color: var(--main-color);
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.footer-export-loading {
    width: 200px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.footer-export-loading div, .footer-version {
    font-weight: bold;
    color: white;
    font-size: 0.8rem;
}
</style>
