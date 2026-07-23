import { editor } from "../monaco-editor/esm/vs/editor/editor.api";
declare namespace Themes {
    type Theme = editor.IStandaloneThemeData & {
        name: string;
    };
    /**
     * Register theme into monaco-editor.
     * @param name  theme name you want to name.
     * @param theme theme data object.
     */
    const register: (name: string, theme: editor.IStandaloneThemeData, editor: any) => void;
    /**
     * Global theme references.
     */
    const themes: {
        light: {
            atom: Theme;
            github: Theme;
            material: Theme;
        };
        dark: {
            atom: Theme;
            darcula: Theme;
            github: Theme;
            material: Theme;
            "monokai-pro": Theme;
            "one-dark-pro": Theme;
        };
    };
}
export default Themes;
