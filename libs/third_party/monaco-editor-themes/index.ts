import { editor } from "../monaco-editor/esm/vs/editor/editor.api";

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

namespace Themes {
  export type Theme = editor.IStandaloneThemeData & {
    name: string;
  };

  /**
   * Register theme into monaco-editor.
   * @param name  theme name you want to name.
   * @param theme theme data object.
   * @param editor
   */
  export const register = (name: string, theme: editor.IStandaloneThemeData, editor: any) => editor.defineTheme(name, theme);

  /**
   * Global theme references.
   */
  export const themes = {
    light: {
      "atom": { name: "Atom One Light", ...L_Atom } as Theme,
      "github": { name: "GitHub Light", ...L_Github } as Theme,
      "material": { name: "Material Theme Light", ...L_Material } as Theme,
    },
    dark: {
      "atom": { name: "Atom One Dark", ...D_Atom } as Theme,
      "darcula": { name: "Darcula", ...D_Darcula } as Theme,
      "github": { name: "GitHub Light", ...D_Github } as Theme,
      "material": { name: "Material Theme Dark", ...D_Material } as Theme,
      "monokai-pro": { name: "Monokai Pro", ...D_MonokaiPro } as Theme,
      "one-dark-pro": { name: "One Dark Pro", ...D_OneDarkPro } as Theme,
    },
  };
}

export default Themes;
