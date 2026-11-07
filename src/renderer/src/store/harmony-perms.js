import {defineStore} from "pinia";

export const useHarmonyOSPermsStore = defineStore("harmony-os-perms", {
    state: () => {
        return {
            isHarmonyOS: true,
        };
    },
    actions: {
        async getHarmonyPerms() {
            await window.permissionsPreload.getPermissions();
        },
        async setIsHarmonyOS() {
            let osType = await window.permissionsPreload.getOS();
            this.isHarmonyOS = (osType === "openharmony");
        }
    }
});
