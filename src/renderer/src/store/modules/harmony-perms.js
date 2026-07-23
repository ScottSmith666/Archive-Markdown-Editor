export const harmonyPerms = {
    state: () => {
        return {
            isHarmonyOS: true,
        };
    },
    mutations: {},
    actions: {
        async getHarmonyPerms({rootState, commit}) {
            await window.permissionsPreload.getPermissions();
        },
        async setIsHarmonyOS({rootState, commit}) {
            let osType = await window.permissionsPreload.getOS();
            rootState.hmos.isHarmonyOS = (osType === "openharmony");
        }
    }
};
