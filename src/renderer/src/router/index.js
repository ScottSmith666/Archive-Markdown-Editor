import {createMemoryHistory, createRouter} from "vue-router";
import DefaultPage from "../components/main/DefaultPage.vue";
import WelcomePage from "../components/welcome/WelcomePage.vue";
import WorkspacePage from "../components/workspace/WorkspacePage.vue";

const routes = [
    {path: "/", redirect: "/default"},
    {path: "/default", component: DefaultPage},
    {path: "/welcome", component: WelcomePage},
    {path: "/workspace", component: WorkspacePage},
];

export default createRouter({
    history: createMemoryHistory(),
    routes,
});
