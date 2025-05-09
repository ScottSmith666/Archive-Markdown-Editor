const fs = require('fs');
const { app } = require("electron");
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require("node:path");
const process = require('node:process');


const packageJsonPath = path.join(__dirname, 'package.json');
// 读取并解析package.json文件
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
// 获取包名
const appName = packageJson.name;
const RELEASE_MAC_ARM64_APP_DIR = path.join(__dirname, `./out/${appName}-${process.platform}-${process.arch}/${appName}.app`);

module.exports = {
  packagerConfig: {
    asar: true,
    overwrite: true,
    ignore: [
        "assets/dmg_bg",
        ".git",
        ".vscode",
        ".idea",
        "node_modules/.bin",
        "src",
        ".gitignore",
        "packagr-lock.json",
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platform: ["darwin"],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
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
