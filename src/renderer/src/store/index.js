import {createStore} from "vuex";
import {ameLifecycleMan} from "./modules/ame-lifecycle-man";
import {fileMan} from "./modules/file-man";
import {mainMenuMan} from "./modules/main-menu-man";
import {settingsMan} from "./modules/settings-man";
import {tMan} from "./modules/tab-man";

export default createStore({
    modules: {
        'lifecycle': ameLifecycleMan,
        'file': fileMan,
        'menu': mainMenuMan,
        'settings': settingsMan,
        'tab': tMan,
    }
});
