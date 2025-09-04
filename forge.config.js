"use strict";

const {FusesPlugin} = require('@electron-forge/plugin-fuses');
const {FuseV1Options, FuseVersion} = require('@electron/fuses');
const path = require("node:path");


module.exports = {
    packagerConfig: {
        asar: true,
        // extraResource: [
        //     path.join(__dirname, './libs/rust_libraries')
        // ],
        overwrite: true,
        // download: {
        //     mirror: `file://${path.join(__dirname, './electron-cache/')}`,
        //     cache: path.join(__dirname, './electron-cache/'),
        //     force: false,
        // },
        // electronZipDir: path.join(__dirname, './electron-cache/electron/36.1.0/'),
        ignore: [
            "deploy_app",
            ".git",
            ".vscode",
            ".idea",
            ".gitignore",
            "distribute",
            "README.md",
            "test.md",
            "electron-cache",
            "examples",
            "package-lock.json",
            "node_modules",

            "libs/third_party/mermaid/dist/__mocks__",
            "libs/third_party/mermaid/dist/dagre-wrapper",
            "libs/third_party/mermaid/dist/diagram-api",
            "libs/third_party/mermaid/dist/diagrams",
            "libs/third_party/mermaid/dist/docs",
            "libs/third_party/mermaid/dist/rendering-util",
            "libs/third_party/mermaid/dist/tests",
            "libs/third_party/mermaid/dist/themes",
            "libs/third_party/mermaid/dist/utils",
            "libs/third_party/mermaid/dist/accessibility.d.ts",
            "libs/third_party/mermaid/dist/accessibility.spec.d.ts",
            "libs/third_party/mermaid/dist/assignWithDepth.d.ts",
            "libs/third_party/mermaid/dist/config.d.ts",
            "libs/third_party/mermaid/dist/config.spec.d.ts",
            "libs/third_party/mermaid/dist/config.type.d.ts",
            "libs/third_party/mermaid/dist/defaultConfig.d.ts",
            "libs/third_party/mermaid/dist/Diagram.d.ts",
            "libs/third_party/mermaid/dist/diagram.spec.d.ts",
            "libs/third_party/mermaid/dist/errors.d.ts",
            "libs/third_party/mermaid/dist/interactionDb.d.ts",
            "libs/third_party/mermaid/dist/internals.d.ts",
            "libs/third_party/mermaid/dist/logger.d.ts",
            "libs/third_party/mermaid/dist/mermaid.d.ts",
            "libs/third_party/mermaid/dist/mermaid.spec.d.ts",
            "libs/third_party/mermaid/dist/mermaidAPI.d.ts",
            "libs/third_party/mermaid/dist/mermaidAPI.spec.d.ts",
            "libs/third_party/mermaid/dist/preprocess.d.ts",
            "libs/third_party/mermaid/dist/setupGraphViewbox.d.ts",
            "libs/third_party/mermaid/dist/styles.d.ts",
            "libs/third_party/mermaid/dist/styles.spec.d.ts",
            "libs/third_party/mermaid/dist/types.d.ts",
            "libs/third_party/mermaid/dist/utils.d.ts",
            "libs/third_party/mermaid/dist/utils.spec.d.ts",

            "libs/third_party/monaco/CHANGELOG.md",
            "libs/third_party/monaco/dev",
            "libs/third_party/monaco/esm",
            "libs/third_party/monaco/LICENSE",
            "libs/third_party/monaco/min-maps",
            "libs/third_party/monaco/monaco.d.ts",
            "libs/third_party/monaco/package.json",
            "libs/third_party/monaco/README.md",
            "libs/third_party/monaco/ThirdPartyNotices.txt",

            "libs/xc_mdz",
        ],
        icon: path.join(__dirname, './assets/app_icon/icon'),
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-zip',
            config: {},
        },
        {
            name: '@electron-forge/maker-squirrel',
            config: {},
        },
    ],
    electronRebuildConfig: {
        onlyModules: [],
        force: false,
        offline: true
    },
    plugins: [
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {},
        },
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};
