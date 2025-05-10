const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require("node:path");


module.exports = {
  packagerConfig: {
    asar: true,
    overwrite: true,
      download: {
          mirror: `file://${ path.join(__dirname, './electron-cache/') }`,
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
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      config: {},
    }
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
