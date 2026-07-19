export const harmonyPerms = {
    state: () => {},
    mutations: {},
    actions: {
        async getHarmonyPerms({rootState, commit}) {
            await window.permissionsPreload.getPermissions();
        }
    }
};
