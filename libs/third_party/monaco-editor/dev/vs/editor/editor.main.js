define("vs/editor/editor.main", ["exports", "../json.worker-BZNFCtUy", "../css.worker-pxsaEmh2", "../html.worker-e5FEhuNy", "../ts.worker-CNus01y8", "require", "vs/nls.messages-loader!", "../index-DW7fQdGP", "../monaco.contribution-bkjksHYY", "../editor-DJILDtaA", "../monaco.contribution-Cf4oJ-Nv", "../monaco.contribution-Dh4QvDgJ", "../monaco.contribution-BMUSc6RH"], (function(exports, json_worker, css_worker, html_worker, ts_worker, require, nls_messagesLoader_, index, src_deprecated_language_css_monaco_contribution_ts, editor, src_deprecated_language_html_monaco_contribution_ts, src_deprecated_language_typescript_monaco_contribution_ts, src_deprecated_language_json_monaco_contribution_ts) {
  "use strict";
  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
    if (e) {
      for (const k in e) {
        if (k !== "default") {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }
  const require__namespace = /* @__PURE__ */ _interopNamespaceDefault(require);
  const __worker_url_4__ = "" + new URL(require.toUrl("../assets/editor.worker-BGDtezWU.js"), document.baseURI).href;
  if (typeof globalThis.require !== "undefined" && typeof globalThis.require.config === "function") {
    globalThis.require.config({
      ignoreDuplicateModules: [
        "vscode-languageserver-types",
        "vscode-languageserver-types/main",
        "vscode-languageserver-textdocument",
        "vscode-languageserver-textdocument/main",
        "vscode-nls",
        "vscode-nls/vscode-nls",
        "jsonc-parser",
        "jsonc-parser/main",
        "vscode-uri",
        "vscode-uri/index",
        "vs/basic-languages/typescript/typescript"
      ]
    });
  }
  self.MonacoEnvironment = {
    getWorker: function(_moduleId, label) {
      if (label === "json") {
        return new Worker(
          getWorkerBootstrapUrl(
            /// @ts-ignore
            json_worker.__worker_url_0__
          )
        );
      }
      if (label === "css" || label === "scss" || label === "less") {
        return new Worker(
          getWorkerBootstrapUrl(
            /// @ts-ignore
            css_worker.__worker_url_0__
          )
        );
      }
      if (label === "html" || label === "handlebars" || label === "razor") {
        return new Worker(
          getWorkerBootstrapUrl(
            /// @ts-ignore
            html_worker.__worker_url_0__
          )
        );
      }
      if (label === "typescript" || label === "javascript") {
        return new Worker(
          getWorkerBootstrapUrl(
            /// @ts-ignore
            ts_worker.__worker_url_0__
          )
        );
      }
      return new Worker(
        /// @ts-ignore
        getWorkerBootstrapUrl(__worker_url_4__)
      );
    }
  };
  function getWorkerBootstrapUrl(workerScriptUrl) {
    if (typeof workerScriptUrl !== "string") {
      workerScriptUrl = workerScriptUrl.toString();
    }
    const blob = new Blob(
      [
        [
          `const ttPolicy = globalThis.trustedTypes?.createPolicy('defaultWorkerFactory', { createScriptURL: value => value });`,
          `globalThis.workerttPolicy = ttPolicy;`,
          `importScripts(ttPolicy?.createScriptURL(${JSON.stringify(
            workerScriptUrl
          )}) ?? ${JSON.stringify(workerScriptUrl)});`,
          `globalThis.postMessage({ type: 'vscode-worker-ready' });`
        ].join("")
      ],
      { type: "application/javascript" }
    );
    return URL.createObjectURL(blob);
  }
  globalThis.monaco = index.monaco;
  const lang = editor.languages;
  lang.css = src_deprecated_language_css_monaco_contribution_ts.register;
  lang.html = src_deprecated_language_html_monaco_contribution_ts.register;
  lang.typescript = src_deprecated_language_typescript_monaco_contribution_ts.register;
  lang.json = src_deprecated_language_json_monaco_contribution_ts.register;
  const styleSheetUrl = require__namespace.toUrl("vs/editor/editor.main.css");
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = styleSheetUrl;
  document.head.appendChild(link);
  exports.lsp = index.index;
  exports.css = src_deprecated_language_css_monaco_contribution_ts.register;
  exports.CancellationTokenSource = editor.CancellationTokenSource;
  exports.Emitter = editor.Emitter;
  exports.KeyCode = editor.KeyCode;
  exports.KeyMod = editor.KeyMod;
  exports.MarkerSeverity = editor.MarkerSeverity;
  exports.MarkerTag = editor.MarkerTag;
  exports.Position = editor.Position;
  exports.Range = editor.Range;
  exports.Selection = editor.Selection;
  exports.SelectionDirection = editor.SelectionDirection;
  exports.Token = editor.Token;
  exports.Uri = editor.Uri;
  exports.editor = editor.editor;
  exports.languages = editor.languages;
  exports.html = src_deprecated_language_html_monaco_contribution_ts.register;
  exports.typescript = src_deprecated_language_typescript_monaco_contribution_ts.register;
  exports.json = src_deprecated_language_json_monaco_contribution_ts.register;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
}));
