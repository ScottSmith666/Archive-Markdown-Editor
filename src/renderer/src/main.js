import "./assets/main.css";
import { createApp } from "vue";
import store from "./store";
import router from "./router";
import App from "./App.vue";
import { createPinia } from "pinia";

createApp(App).use(store).use(router).use(createPinia()).mount("#app");
