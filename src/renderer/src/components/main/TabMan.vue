<script setup>
import {watch, ref, onMounted} from "vue";
import {useStore} from 'vuex';

const store = useStore();

// data
const showScroller = ref(false);

// mounted
onMounted(() => {
});

const leftSlide = () => {
    if (showScroller) {
        let tabsContainer = document.getElementById('tabs-container');
        tabsContainer.scrollTo({
            left: tabsContainer.scrollLeft - 100,
            behavior: 'smooth',
        });
    }
};

const rightSlide = () => {
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
            setTimeout(() => {
                tabs.lastChild.scrollIntoView({
                    block: 'center',
                    inline: 'start',
                    behavior: 'smooth',
                    container: 'nearest',
                });
            }, 100);
        } else {
            showScroller.value = false;
        }
    }
)
</script>

<template>
    <div class="tab-man-main fonts" v-if="store.state.tabList.size > 0" id="tabs-container"
         @dblclick="store.commit('addTabPage', {'pageType': 'file', 'pageTitle': '无标题文档', 'isExistFile': false})">
        <div v-if="showScroller" class="tab-scroller-sticky" @dblclick.stop="() => null">
            <div class="tab-scroller">
                <div style="width: 10px;"></div>
                <div class="scroll-left-right" @click="leftSlide">◀</div>
                <div class="scroll-left-right" @click="rightSlide">▶</div>
                <div style="width: 10px;"></div>
            </div>
        </div>
        <div class="block"></div>
        {{ Array.from(store.state.tabList.keys()) }}
        <TransitionGroup id="tabs" name="list" tag="div" style="display: flex; flex-direction: row;">
            <template v-for="[pageId, tabObject] in store.state.tabList" :key="pageId">
                <div
                     class="tab" :class="tabObject.get('focus') ? 'tab-activated' : ''"
                     @click="store.commit('switchToCurrentTab', {'pageId': pageId})"
                     @dblclick.stop="() => null">
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
                    <div class="tab-icon" v-else-if="tabObject.get('type') === 'settings'">
                        <svg t="1775365018449" class="icon tab-icon" viewBox="0 0 1024 1024" version="1.1"
                             xmlns="http://www.w3.org/2000/svg" p-id="11404" width="200" height="200">
                            <path
                                d="M793.6 430.08h-56.32c-10.24 0-15.36-5.12-20.48-10.24s-5.12-20.48 5.12-25.6l40.96-40.96c5.12-5.12 10.24-15.36 10.24-20.48 0-10.24-5.12-15.36-10.24-20.48l-51.2-51.2c-10.24-10.24-35.84-10.24-46.08 0l-40.96 40.96c-10.24 5.12-15.36 5.12-20.48 5.12s-10.24-5.12-15.36-5.12c-5.12-5.12-5.12-10.24-5.12-15.36v-61.44c0-20.48-15.36-30.72-30.72-30.72h-71.68c-20.48 0-30.72 15.36-30.72 30.72v56.32c0 15.36-10.24 20.48-20.48 20.48-5.12 0-10.24 0-15.36-5.12l-46.08-40.96c-10.24-10.24-35.84-10.24-46.08 0l-51.2 51.2c-5.12 5.12-10.24 15.36-10.24 20.48 0 10.24 5.12 15.36 10.24 20.48l40.96 40.96c5.12 5.12 10.24 15.36 5.12 25.6s-10.24 10.24-20.48 10.24h-56.32c-20.48 0-30.72 15.36-30.72 30.72v71.68c0 20.48 15.36 30.72 30.72 30.72h56.32c10.24 0 15.36 5.12 20.48 10.24 5.12 10.24 5.12 20.48-5.12 25.6l-40.96 40.96c-5.12 5.12-10.24 15.36-10.24 20.48 0 10.24 5.12 15.36 10.24 20.48l51.2 51.2c10.24 10.24 35.84 10.24 46.08 0l40.96-40.96c5.12-5.12 10.24-5.12 15.36-5.12 10.24 0 20.48 10.24 20.48 20.48V768c0 20.48 15.36 30.72 30.72 30.72h71.68c20.48 0 30.72-15.36 30.72-30.72v-51.2c0-15.36 10.24-20.48 20.48-20.48 5.12 0 10.24 0 15.36 5.12l40.96 40.96c10.24 10.24 35.84 10.24 46.08 0l51.2-51.2c5.12-5.12 10.24-15.36 10.24-20.48 0-10.24-5.12-15.36-10.24-20.48l-35.84-40.96c-5.12-5.12-10.24-15.36-5.12-25.6s10.24-10.24 20.48-10.24h56.32c20.48 0 30.72-15.36 30.72-30.72v-71.68c5.12-25.6-10.24-40.96-25.6-40.96z m-199.68 71.68c0 40.96-35.84 81.92-81.92 81.92-40.96 0-81.92-35.84-81.92-81.92 0-40.96 35.84-81.92 81.92-81.92 46.08 0 81.92 35.84 81.92 81.92z"
                                p-id="11405" data-spm-anchor-id="a313x.search_index.0.i9.75d53a81ELi9GL"
                                class="selected" fill="#42b883"></path>
                        </svg>
                    </div>
                    <div class="tab-icon" v-else-if="tabObject.get('type') === 'document'">
                        <svg t="1775363435516" class="icon tab-icon" viewBox="0 0 1024 1024" version="1.1"
                             xmlns="http://www.w3.org/2000/svg" p-id="5001" width="200" height="200">
                            <path
                                d="M962.95518 513.627057c0 248.00542-201.052039 449.057459-449.061552 449.057459-248.0177 0-449.068715-201.052039-449.068715-449.057459 0-248.010537 201.052039-449.061552 449.068715-449.061552C761.904165 64.565505 962.95518 265.617543 962.95518 513.627057z"
                                fill="#42b883" p-id="5002" data-spm-anchor-id="a313x.search_index.0.i2.75d53a81ELi9GL"
                                class="selected"></path>
                            <path
                                d="M555.095006 347.482039l1.006933 0c39.806611-0.128937 68.321038-34.106796 68.321038-70.016657 0-13.854543-3.983731-27.362184-12.694113-37.607526-8.676613-10.279111-22.168905-16.842597-39.192627-16.773012-44.967144 0.181125-68.303642 38.489616-68.378343 67.527976C504.394277 324.32155 523.890306 347.482039 555.095006 347.482039L555.095006 347.482039zM624.641965 692.793646l-17.767666-38.978756-5.085832 4.620227c-21.516036 19.803022-54.775534 42.59819-59.771315 43.213197-0.23536-0.722454-0.557702-2.291183-0.541329-4.673439 0-4.235464 0.901533-10.926864 3.123131-20.091594l46.837748-190.613292c4.094248-17.768689 6.294356-45.166689 6.294356-58.277288 0-12.028964-1.804089-22.039969-6.327102-29.722952-4.440126-7.810896-12.662391-12.643971-22.132066-12.483312-33.116235 0.416486-105.313557 44.930305-165.373445 100.483552l-3.26537 3.028986 16.627702 45.11757 5.665023-4.239558c16.033162-12.456706 48.500621-36.226063 55.894008-38.896892-0.073678 3.714602-1.208525 10.93198-3.281743 21.174252l-42.693358 183.909613c-4.834098 20.182668-6.959505 48.115857-6.959505 61.050448 0 16.917298 3.695159 28.748764 10.819416 36.521798 7.107885 7.719822 16.917298 10.228969 26.370601 10.228969l0.178055 0c27.922956-0.36225 101.328803-39.138392 160.828942-104.123452l3.065825-3.409656L624.641965 692.793646 624.641965 692.793646zM624.641965 692.793646"
                                fill="#FFFFFF" p-id="5003"></path>
                        </svg>
                    </div>
                    <!--label-->
                    <!--需要采取措施防止显示名称过长的文件名-->
                    <div>{{
                            tabObject.get('label').length <= 20 ? tabObject.get('label') : tabObject.get('label').slice(0, 10) + '...' + tabObject.get('label').slice(-10)
                        }}
                    </div>
                    <!--关闭按钮，未hover in时，已保存是叉，未保存是圆；已hover in时，已保存和未保存都是叉-->
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
