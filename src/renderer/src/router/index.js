import {createMemoryHistory, createRouter} from "vue-router";
import DefaultPage from "../components/main/DefaultPage.vue";
import WelcomePage from "../components/welcome/WelcomePage.vue";
import WorkspacePage from "../components/workspace/WorkspacePage.vue";
import Settings from "../components/main/Settings.vue";
import Doc from "../components/document/Doc.vue";

const routes = [
    {path: "/", redirect: "/default"},
    {path: "/default", component: DefaultPage},
    {path: "/welcome", component: WelcomePage},
    {path: "/workspace", component: WorkspacePage},
    {path: "/settings", component: Settings},
    {path: "/document", component: Doc},
];

export default createRouter({
    history: createMemoryHistory(),
    routes,
});
