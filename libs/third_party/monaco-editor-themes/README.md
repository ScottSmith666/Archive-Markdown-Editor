# Installation

```
npm install monaco-editor-themes
```

# Usage

```typescript
import * as monaco from "monaco-editor";
import Themes from "monaco-editor-themes";

// register themes into editor
Themes.register("light-theme-name-or-whatever", Themes.themes.light.github);
Themes.register("dark-theme-name-or-whatever", Themes.themes.dark.darcula);

const dom = undefined; // DOM element mounted by editor
const mode = "light"; // variables that can be toggled
// create editor with theme defined
monaco.editor.create(dom, {
  data: "foo",
  language: "javascript",
  theme: mode === "light" ? "light-theme-name-or-whatever" : "dark-theme-name-or-whatever",
});
```

# Themes

## Light

| Name     | Repository                                                                 | About                                                       |
| -------- | -------------------------------------------------------------------------- | ----------------------------------------------------------- |
| atom     | [vscode-theme-onelight](https://github.com/akamud/vscode-theme-onelight)   | VSCode Theme based on Atom's One Light theme.               |
| github   | [github-vscode-theme](https://github.com/primer/github-vscode-theme)       | GitHub's VS Code themes.                                    |
| material | [vsc-material-theme](https://github.com/material-theme/vsc-material-theme) | Material Theme, the most epic theme for Visual Studio Code. |

## Dark

| Name         | Repository                                                                 | About                                                                                         |
| ------------ | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| atom         | [vscode-theme-onedark](https://github.com/akamud/vscode-theme-onedark)     | VSCode Theme based on Atom's One Dark theme.                                                  |
| darcula      | [vscode-theme-darcula](https://github.com/rokoroku/vscode-theme-darcula)   | A theme for Visual Studio Code based on Darcula theme from Jetbrains IDEs.                    |
| github       | [github-vscode-theme](https://github.com/primer/github-vscode-theme)       | GitHub's VS Code themes.                                                                      |
| material     | [vsc-material-theme](https://github.com/material-theme/vsc-material-theme) | Material Theme, the most epic theme for Visual Studio Code.                                   |
| monokai-pro  | [monokai-pro-vscode](https://github.com/monokai/monokai-pro-vscode)        | A color scheme, customized user interface theme and complete icon set for Visual Studio Code. |
| one-dark-pro | [OneDark-Pro](https://github.com/Binaryify/OneDark-Pro)                    | Atom's iconic One Dark theme for Visual Studio Code.                                          |

# Contributing

1. Clone code.

```bash
git clone git@github.com:dongchengjie/monaco-editor-themes.git
```

2. Install dependencies.

```bash
npm install
```

3. Place your vscode theme files under the vscode directory. You can export your current theme file by pressing Ctrl + Shift + P and executing the `generateColorTheme` command.

4. Execute the build script, and the output will be located in the `themes` directory.

```bash
npm run build
```

# License

[MIT](LICENSE)
