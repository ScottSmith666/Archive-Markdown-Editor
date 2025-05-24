"use strict";

const {FusesPlugin} = require('@electron-forge/plugin-fuses');
const {FuseV1Options, FuseVersion} = require('@electron/fuses');
const path = require("node:path");


module.exports = {
    packagerConfig: {
        asar: true,
        overwrite: true,
        download: {
            mirror: `file://${path.join(__dirname, './electron-cache/')}`,
            cache: path.join(__dirname, './electron-cache/'),
            force: false,
        },
        electronZipDir: path.join(__dirname, './electron-cache/electron/36.1.0/'),
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
            "package-lock.json",
            "node_modules/electron",
            "libs/third_party/monaco/CHANGELOG.md",
            "libs/third_party/monaco/dev",
            "libs/third_party/monaco/esm",
            "libs/third_party/monaco/LICENSE",
            "libs/third_party/monaco/min-maps",
            "libs/third_party/monaco/monaco.d.ts",
            "libs/third_party/monaco/package.json",
            "libs/third_party/monaco/README.md",
            "libs/third_party/monaco/ThirdPartyNotices.txt",
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
