// light themes
import L_Atom from "./themes/light/atom";
import L_Github from "./themes/light/github";
import L_Material from "./themes/light/material";
// dark themes
import D_Atom from "./themes/dark/atom";
import D_Darcula from "./themes/dark/darcula";
import D_Github from "./themes/dark/github";
import D_Material from "./themes/dark/material";
import D_MonokaiPro from "./themes/dark/monokai-pro";
import D_OneDarkPro from "./themes/dark/one-dark-pro";
var Themes;
(function (Themes) {
    /**
     * Register theme into monaco-editor.
     * @param name  theme name you want to name.
     * @param theme theme data object.
     * @param editor monaco editor object
     */
    Themes.register = (name, theme, editor) => editor.defineTheme(name, theme);
    /**
     * Global theme references.
     */
    Themes.themes = {
        light: {
            "atom": { name: "Atom One Light", ...L_Atom },
            "github": { name: "GitHub Light", ...L_Github },
            "material": { name: "Material Theme Light", ...L_Material },
        },
        dark: {
            "atom": { name: "Atom One Dark", ...D_Atom },
            "darcula": { name: "Darcula", ...D_Darcula },
            "github": { name: "GitHub Light", ...D_Github },
            "material": { name: "Material Theme Dark", ...D_Material },
            "monokai-pro": { name: "Monokai Pro", ...D_MonokaiPro },
            "one-dark-pro": { name: "One Dark Pro", ...D_OneDarkPro },
        },
    };
})(Themes || (Themes = {}));
export default Themes;
