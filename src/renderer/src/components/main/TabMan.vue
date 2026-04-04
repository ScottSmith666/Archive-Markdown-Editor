<script setup>
import {watch, ref, onMounted} from "vue";
import {useStore} from 'vuex';

const store = useStore();

// data
const showScroller = ref(false);

// mounted
onMounted(() => {
});

// methods
const leftSlite = () => {
    if (showScroller) {
        let tabsContainer = document.getElementById('tabs-container');
        tabsContainer.scrollTo({
            left: tabsContainer.scrollLeft - 100,
            behavior: 'smooth',
        });
    }
};

const rightSlite = () => {
    if (showScroller) {
        let tabsContainer = document.getElementById('tabs-container');
        tabsContainer.scrollTo({
            left: tabsContainer.scrollLeft + 100,
            behavior: 'smooth',
        });
    }
};

// watch
watch(
    () => store.state.currentOpenedTabNumber,
    (newVal, oldVal) => {
        let tabs = document.getElementById('tabs');
        let tabsTotalLength = tabs ? tabs.clientWidth : 0;
        if (tabsTotalLength >= document.documentElement.clientWidth * 0.99) {
            showScroller.value = true;
        } else {
            showScroller.value = false;
        }
    }
)
</script>

<template>
    <div class="tab-man-main fonts" v-if="store.state.tabList.size > 0" id="tabs-container">
        <div v-if="showScroller" class="tab-scroller-sticky">
            <div class="tab-scroller">
                <div style="width: 10px;"></div>
                <div class="scroll-left-right" @click="leftSlite">◀</div>
                <div class="scroll-left-right" @click="rightSlite">▶</div>
                <div style="width: 10px;"></div>
            </div>
        </div>
        <div class="block"></div>
        <TransitionGroup id="tabs" name="list" tag="div" style="display: flex; flex-direction: row;">
            <template v-for="[pageId, tabObject] in store.state.tabList" :key="pageId">
                <div class="tab" :class="tabObject.get('focus') ? 'tab-activated' : ''"
                     @click="store.commit('switchToCurrentTab', {'pageId': pageId})">
                    <!--图标-->
                    <div class="tab-icon" v-if="tabObject.get('type') === 'welcome'">
                        <svg t="1773895753581" class="tab-icon" viewBox="0 0 1024 1024" version="1.1"
                             xmlns="http://www.w3.org/2000/svg" p-id="5148" width="200" height="200">
                            <path
                                d="M722.798 468.798c-3.6-10.8-13.198-18.6-24.598-20.398l-109.802-17.6-51.2-99.602c-5.398-10.198-14.4-16.198-25.198-16.798h-1.802c-11.396 0-21.6 5.998-26.998 16.798L432 430.8l-109.802 17.6c-11.4 1.798-20.998 9.598-24.598 20.398-3.002 10.8 0 22.8 7.8 31.202l79.798 79.398-19.2 109.802c-1.798 10.8 3.002 22.2 12 28.798 9.602 7.2 21.6 7.8 31.802 2.402l100.398-51.602 1.802 1.202 98.6 50.402c10.202 5.398 22.2 4.798 31.802-2.402 8.998-6.6 13.798-18 12-28.798l-19.2-109.802 79.796-79.4c8.402-8.402 10.804-20.402 7.8-31.202z"
                                fill="#FEA832" p-id="5149"></path>
                            <path
                                d="M542 150v74.4c0 16.202-13.198 30-30 30s-30-13.798-30-30V150c0-16.802 13.198-30 30-30s30 13.198 30 30zM542 770.198V888.4c0 16.202-13.198 30-30 30s-30-13.798-30-30v-118.202c0-16.198 13.198-30 30-30s30 13.802 30 30zM542 30c0 16.798-13.198 30-30 30s-30-13.202-30-30c0-16.802 13.198-30 30-30s30 13.198 30 30zM542 994c0 16.798-13.198 30-30 30s-30-13.202-30-30c0-16.802 13.198-30 30-30s30 13.198 30 30zM211.26 542H150c-16.582 0-30-13.418-30-30s13.418-30 30-30h61.26c16.582 0 30 13.418 30 30s-13.418 30-30 30z"
                                fill="#CCEFFF" p-id="5150"></path>
                            <path
                                d="M888.238 542h-79.072c-16.582 0-30-13.418-30-30s13.418-30 30-30h79.072c16.582 0 30 13.418 30 30s-13.418 30-30 30z"
                                fill="#ACE3FC" p-id="5151"></path>
                            <path d="M30 512m-30 0a30 30 0 1 0 60 0 30 30 0 1 0-60 0Z" fill="#CCEFFF"
                                  p-id="5152"></path>
                            <path d="M994 512m-30 0a30 30 0 1 0 60 0 30 30 0 1 0-60 0Z" fill="#ACE3FC"
                                  p-id="5153"></path>
                            <path
                                d="M174.228 849.772c-11.718-11.718-11.718-30.704 0-42.422l89.296-89.296c11.718-11.718 30.704-11.718 42.422 0s11.718 30.704 0 42.422l-89.296 89.296c-11.718 11.718-30.702 11.718-42.422 0z"
                                fill="#CCEFFF" p-id="5154"></path>
                            <path
                                d="M662.506 361.494c-11.718-11.718-11.718-30.704 0-42.422l154.922-154.922c11.718-11.718 30.704-11.718 42.422 0s11.718 30.704 0 42.422l-154.922 154.922c-11.72 11.72-30.704 11.72-42.422 0zM747.35 789.772l-31.846-31.846c-11.718-11.718-11.718-30.704 0-42.422s30.704-11.718 42.422 0l31.846 31.846c11.718 11.718 11.718 30.704 0 42.422-11.72 11.718-30.704 11.718-42.422 0z"
                                fill="#ACE3FC" p-id="5155"></path>
                            <path
                                d="M319.072 361.494l-94.922-94.922c-11.718-11.718-11.718-30.704 0-42.422s30.704-11.718 42.422 0l94.922 94.922c11.718 11.718 11.718 30.704 0 42.422-11.718 11.72-30.702 11.72-42.422 0z"
                                fill="#CCEFFF" p-id="5156"></path>
                            <path d="M150 634m-30 0a30 30 0 1 0 60 0 30 30 0 1 0-60 0Z" fill="#CCEFFF"
                                  p-id="5157"></path>
                            <path d="M874 390m-30 0a30 30 0 1 0 60 0 30 30 0 1 0-60 0Z" fill="#ACE3FC"
                                  p-id="5158"></path>
                            <path d="M390 150m-30 0a30 30 0 1 0 60 0 30 30 0 1 0-60 0Z" fill="#CCEFFF"
                                  p-id="5159"></path>
                            <path d="M634 874m-30 0a30 30 0 1 0 60 0 30 30 0 1 0-60 0Z" fill="#ACE3FC"
                                  p-id="5160"></path>
                            <path d="M874 634m-30 0a30 30 0 1 0 60 0 30 30 0 1 0-60 0Z" fill="#ACE3FC"
                                  p-id="5161"></path>
                            <path d="M150 390m-30 0a30 30 0 1 0 60 0 30 30 0 1 0-60 0Z" fill="#CCEFFF"
                                  p-id="5162"></path>
                            <path d="M634 150m-30 0a30 30 0 1 0 60 0 30 30 0 1 0-60 0Z" fill="#ACE3FC"
                                  p-id="5163"></path>
                            <path d="M390 874m-30 0a30 30 0 1 0 60 0 30 30 0 1 0-60 0Z" fill="#CCEFFF"
                                  p-id="5164"></path>
                            <path
                                d="M240 150c0 16.798-13.198 30-30 30H180v30c0 16.798-13.198 30-30 30s-30-13.202-30-30V180H90c-16.802 0-30-13.202-30-30 0-16.802 13.198-30 30-30h30V90c0-16.802 13.198-30 30-30s30 13.198 30 30v30h30c16.802 0 30 13.198 30 30z"
                                fill="#CCEFFF" p-id="5165"></path>
                            <path
                                d="M1024 90c0 16.798-13.198 30-30 30h-30v30c0 16.798-13.198 30-30 30s-30-13.202-30-30V120h-30c-16.802 0-30-13.202-30-30 0-16.802 13.198-30 30-30h30V30c0-16.802 13.198-30 30-30s30 13.198 30 30v30h30c16.802 0 30 13.198 30 30zM964 874c0 16.798-13.198 30-30 30h-30v30c0 16.798-13.198 30-30 30s-30-13.202-30-30v-30h-30c-16.802 0-30-13.202-30-30 0-16.802 13.198-30 30-30h30v-30c0-16.802 13.198-30 30-30s30 13.198 30 30v30h30c16.802 0 30 13.198 30 30z"
                                fill="#ACE3FC" p-id="5166"></path>
                            <path
                                d="M180 934c0 16.798-13.198 30-30 30H120v30c0 16.798-13.198 30-30 30s-30-13.202-30-30v-30H30c-16.802 0-30-13.202-30-30 0-16.802 13.198-30 30-30h30v-30c0-16.802 13.198-30 30-30s30 13.198 30 30v30h30c16.802 0 30 13.198 30 30z"
                                fill="#CCEFFF" p-id="5167"></path>
                            <path
                                d="M714.998 500L635.2 579.398l19.2 109.802c1.798 10.8-3.002 22.2-12 28.798-9.602 7.2-21.6 7.8-31.802 2.402L512 669.998V314.4c10.8 0.6 19.802 6.6 25.198 16.798l51.2 99.602 109.802 17.6c11.4 1.798 20.998 9.598 24.598 20.398 3.004 10.8 0.602 22.8-7.8 31.202z"
                                fill="#FE9923" p-id="5168"></path>
                        </svg>
                    </div>
                    <div class="tab-icon" v-else-if="tabObject.get('type') === 'file'">
                        <svg t="1773895788520" class="tab-icon" viewBox="0 0 1280 1024" version="1.1"
                             xmlns="http://www.w3.org/2000/svg" p-id="6152" width="200" height="200">
                            <path
                                d="M1187.6 118.2H92.4C41.4 118.2 0 159.6 0 210.4v603c0 51 41.4 92.4 92.4 92.4h1095.4c51 0 92.4-41.4 92.2-92.2V210.4c0-50.8-41.4-92.2-92.4-92.2zM677 721.2H554v-240l-123 153.8-123-153.8v240H184.6V302.8h123l123 153.8 123-153.8h123v418.4z m270.6 6.2L763 512H886V302.8h123V512H1132z"
                                p-id="6153" data-spm-anchor-id="a313x.search_index.0.i4.4f083a81bqSi2d" class="selected"
                                fill="#42b883"></path>
                        </svg>
                    </div>
                    <!--label-->
                    <!--需要采取措施防止显示名称过长的文件名-->
                    <div>{{
                            tabObject.get('label').length <= 20 ? tabObject.get('label') : tabObject.get('label').slice(0, 10) + '...' + tabObject.get('label').slice(-10)
                        }}
                    </div>
                    <!--关闭按钮，未hoverIn时，已保存是叉，未保存是圆；已hoverIn时，已保存和未保存都是叉-->
                    <div class="close-tab"
                         @mouseenter="store.commit('changePropsOfTab', {'pageId': pageId, 'propName': 'hovered', 'propValue': true})"
                         @mouseleave="store.commit('changePropsOfTab', {'pageId': pageId, 'propName': 'hovered', 'propValue': false})"
                         @click.stop="store.commit('closeTabPage', {'pageId': pageId, 'model': tabObject.get('monacoEditorModel')})">
                        <!--@click.stop使得子元素点击不会触发父元素的方法-->
                        <div>{{ tabObject.get('saved') || tabObject.get('hovered') ? '×' : '●' }}</div>
                    </div>
                </div>
            </template>
        </TransitionGroup>
    </div>
</template>
<style scoped>
@import './styles/tab-man.css';

/* 列表切换 */
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
    position: absolute;
}

/* 元素切换 */
/* 下面我们会解释这些 class 是做什么的 */
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
