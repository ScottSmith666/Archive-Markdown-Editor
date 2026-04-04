define("vs/jsonMode-CuuzYUFO", ["exports", "./json.worker-BZNFCtUy", "./workers-D6EJ5-C2", "./lspLanguageFeatures-CdOYx_ok", "./main-Du7ctCk0", "./editor-DJILDtaA"], (function(exports, json_worker, workers, lspLanguageFeatures, main, editor) {
  "use strict";
  const STOP_WHEN_IDLE_FOR = 2 * 60 * 1e3;
  class WorkerManager {
    constructor(defaults) {
      this._defaults = defaults;
      this._worker = null;
      this._client = null;
      this._idleCheckInterval = window.setInterval(() => this._checkIfIdle(), 30 * 1e3);
      this._lastUsedTime = 0;
      this._configChangeListener = this._defaults.onDidChange(() => this._stopWorker());
    }
    _stopWorker() {
      if (this._worker) {
        this._worker.dispose();
        this._worker = null;
      }
      this._client = null;
    }
    dispose() {
      clearInterval(this._idleCheckInterval);
      this._configChangeListener.dispose();
      this._stopWorker();
    }
    _checkIfIdle() {
      if (!this._worker) {
        return;
      }
      let timePassedSinceLastUsed = Date.now() - this._lastUsedTime;
      if (timePassedSinceLastUsed > STOP_WHEN_IDLE_FOR) {
        this._stopWorker();
      }
    }
    _getClient() {
      this._lastUsedTime = Date.now();
      if (!this._client) {
        this._worker = workers.createWebWorker({
          // module that exports the create() method and returns a `JSONWorker` instance
          moduleId: "vs/language/json/jsonWorker",
          createWorker: () => new Worker(json_worker.__worker_url_0__, { type: "module" }),
          label: this._defaults.languageId,
          // passed in to the create() method
          createData: {
            languageSettings: this._defaults.diagnosticsOptions,
            languageId: this._defaults.languageId,
            enableSchemaRequest: this._defaults.diagnosticsOptions.enableSchemaRequest
          }
        });
        this._client = this._worker.getProxy();
      }
      return this._client;
    }
    getLanguageServiceWorker(...resources) {
      let _client;
      return this._getClient().then((client) => {
        _client = client;
      }).then((_) => {
        if (this._worker) {
          return this._worker.withSyncedResources(resources);
        }
      }).then((_) => _client);
    }
  }
  function createTokenizationSupport(supportComments) {
    return {
      getInitialState: () => new JSONState(null, null, false, null),
      tokenize: (line, state) => tokenize(supportComments, line, state)
    };
  }
  const TOKEN_DELIM_OBJECT = "delimiter.bracket.json";
  const TOKEN_DELIM_ARRAY = "delimiter.array.json";
  const TOKEN_DELIM_COLON = "delimiter.colon.json";
  const TOKEN_DELIM_COMMA = "delimiter.comma.json";
  const TOKEN_VALUE_BOOLEAN = "keyword.json";
  const TOKEN_VALUE_NULL = "keyword.json";
  const TOKEN_VALUE_STRING = "string.value.json";
  const TOKEN_VALUE_NUMBER = "number.json";
  const TOKEN_PROPERTY_NAME = "string.key.json";
  const TOKEN_COMMENT_BLOCK = "comment.block.json";
  const TOKEN_COMMENT_LINE = "comment.line.json";
  class ParentsStack {
    constructor(parent, type) {
      this.parent = parent;
      this.type = type;
    }
    static pop(parents) {
      if (parents) {
        return parents.parent;
      }
      return null;
    }
    static push(parents, type) {
      return new ParentsStack(parents, type);
    }
    static equals(a, b) {
      if (!a && !b) {
        return true;
      }
      if (!a || !b) {
        return false;
      }
      while (a && b) {
        if (a === b) {
          return true;
        }
        if (a.type !== b.type) {
          return false;
        }
        a = a.parent;
        b = b.parent;
      }
      return true;
    }
  }
  class JSONState {
    constructor(state, scanError, lastWasColon, parents) {
      this._state = state;
      this.scanError = scanError;
      this.lastWasColon = lastWasColon;
      this.parents = parents;
    }
    clone() {
      return new JSONState(this._state, this.scanError, this.lastWasColon, this.parents);
    }
    equals(other) {
      if (other === this) {
        return true;
      }
      if (!other || !(other instanceof JSONState)) {
        return false;
      }
      return this.scanError === other.scanError && this.lastWasColon === other.lastWasColon && ParentsStack.equals(this.parents, other.parents);
    }
    getStateData() {
      return this._state;
    }
    setStateData(state) {
      this._state = state;
    }
  }
  function tokenize(comments, line, state, offsetDelta = 0) {
    let numberOfInsertedCharacters = 0;
    let adjustOffset = false;
    switch (state.scanError) {
      case 2:
        line = '"' + line;
        numberOfInsertedCharacters = 1;
        break;
      case 1:
        line = "/*" + line;
        numberOfInsertedCharacters = 2;
        break;
    }
    const scanner = main.createScanner(line);
    let lastWasColon = state.lastWasColon;
    let parents = state.parents;
    const ret = {
      tokens: [],
      endState: state.clone()
    };
    while (true) {
      let offset = offsetDelta + scanner.getPosition();
      let type = "";
      const kind = scanner.scan();
      if (kind === 17) {
        break;
      }
      if (offset === offsetDelta + scanner.getPosition()) {
        throw new Error(
          "Scanner did not advance, next 3 characters are: " + line.substr(scanner.getPosition(), 3)
        );
      }
      if (adjustOffset) {
        offset -= numberOfInsertedCharacters;
      }
      adjustOffset = numberOfInsertedCharacters > 0;
      switch (kind) {
        case 1:
          parents = ParentsStack.push(
            parents,
            0
            /* Object */
          );
          type = TOKEN_DELIM_OBJECT;
          lastWasColon = false;
          break;
        case 2:
          parents = ParentsStack.pop(parents);
          type = TOKEN_DELIM_OBJECT;
          lastWasColon = false;
          break;
        case 3:
          parents = ParentsStack.push(
            parents,
            1
            /* Array */
          );
          type = TOKEN_DELIM_ARRAY;
          lastWasColon = false;
          break;
        case 4:
          parents = ParentsStack.pop(parents);
          type = TOKEN_DELIM_ARRAY;
          lastWasColon = false;
          break;
        case 6:
          type = TOKEN_DELIM_COLON;
          lastWasColon = true;
          break;
        case 5:
          type = TOKEN_DELIM_COMMA;
          lastWasColon = false;
          break;
        case 8:
        case 9:
          type = TOKEN_VALUE_BOOLEAN;
          lastWasColon = false;
          break;
        case 7:
          type = TOKEN_VALUE_NULL;
          lastWasColon = false;
          break;
        case 10:
          const currentParent = parents ? parents.type : 0;
          const inArray = currentParent === 1;
          type = lastWasColon || inArray ? TOKEN_VALUE_STRING : TOKEN_PROPERTY_NAME;
          lastWasColon = false;
          break;
        case 11:
          type = TOKEN_VALUE_NUMBER;
          lastWasColon = false;
          break;
      }
      {
        switch (kind) {
          case 12:
            type = TOKEN_COMMENT_LINE;
            break;
          case 13:
            type = TOKEN_COMMENT_BLOCK;
            break;
        }
      }
      ret.endState = new JSONState(
        state.getStateData(),
        scanner.getTokenError(),
        lastWasColon,
        parents
      );
      ret.tokens.push({
        startIndex: offset,
        scopes: type
      });
    }
    return ret;
  }
  let worker;
  function getWorker() {
    return new Promise((resolve, reject) => {
      if (!worker) {
        return reject("JSON not registered!");
      }
      resolve(worker);
    });
  }
  class JSONDiagnosticsAdapter extends lspLanguageFeatures.DiagnosticsAdapter {
    constructor(languageId, worker2, defaults) {
      super(languageId, worker2, defaults.onDidChange);
      this._disposables.push(
        editor.editor.onWillDisposeModel((model) => {
          this._resetSchema(model.uri);
        })
      );
      this._disposables.push(
        editor.editor.onDidChangeModelLanguage((event) => {
          this._resetSchema(event.model.uri);
        })
      );
    }
    _resetSchema(resource) {
      this._worker().then((worker2) => {
        worker2.resetSchema(resource.toString());
      });
    }
  }
  function setupMode(defaults) {
    const disposables = [];
    const providers = [];
    const client = new WorkerManager(defaults);
    disposables.push(client);
    worker = (...uris) => {
      return client.getLanguageServiceWorker(...uris);
    };
    function registerProviders() {
      const { languageId, modeConfiguration: modeConfiguration2 } = defaults;
      disposeAll(providers);
      if (modeConfiguration2.documentFormattingEdits) {
        providers.push(
          editor.languages.registerDocumentFormattingEditProvider(
            languageId,
            new lspLanguageFeatures.DocumentFormattingEditProvider(worker)
          )
        );
      }
      if (modeConfiguration2.documentRangeFormattingEdits) {
        providers.push(
          editor.languages.registerDocumentRangeFormattingEditProvider(
            languageId,
            new lspLanguageFeatures.DocumentRangeFormattingEditProvider(worker)
          )
        );
      }
      if (modeConfiguration2.completionItems) {
        providers.push(
          editor.languages.registerCompletionItemProvider(
            languageId,
            new lspLanguageFeatures.CompletionAdapter(worker, [" ", ":", '"'])
          )
        );
      }
      if (modeConfiguration2.hovers) {
        providers.push(
          editor.languages.registerHoverProvider(languageId, new lspLanguageFeatures.HoverAdapter(worker))
        );
      }
      if (modeConfiguration2.documentSymbols) {
        providers.push(
          editor.languages.registerDocumentSymbolProvider(
            languageId,
            new lspLanguageFeatures.DocumentSymbolAdapter(worker)
          )
        );
      }
      if (modeConfiguration2.tokens) {
        providers.push(editor.languages.setTokensProvider(languageId, createTokenizationSupport(true)));
      }
      if (modeConfiguration2.colors) {
        providers.push(
          editor.languages.registerColorProvider(
            languageId,
            new lspLanguageFeatures.DocumentColorAdapter(worker)
          )
        );
      }
      if (modeConfiguration2.foldingRanges) {
        providers.push(
          editor.languages.registerFoldingRangeProvider(
            languageId,
            new lspLanguageFeatures.FoldingRangeAdapter(worker)
          )
        );
      }
      if (modeConfiguration2.diagnostics) {
        providers.push(new JSONDiagnosticsAdapter(languageId, worker, defaults));
      }
      if (modeConfiguration2.selectionRanges) {
        providers.push(
          editor.languages.registerSelectionRangeProvider(
            languageId,
            new lspLanguageFeatures.SelectionRangeAdapter(worker)
          )
        );
      }
    }
    registerProviders();
    disposables.push(editor.languages.setLanguageConfiguration(defaults.languageId, richEditConfiguration));
    let modeConfiguration = defaults.modeConfiguration;
    defaults.onDidChange((newDefaults) => {
      if (newDefaults.modeConfiguration !== modeConfiguration) {
        modeConfiguration = newDefaults.modeConfiguration;
        registerProviders();
      }
    });
    disposables.push(asDisposable(providers));
    return asDisposable(disposables);
  }
  function asDisposable(disposables) {
    return { dispose: () => disposeAll(disposables) };
  }
  function disposeAll(disposables) {
    while (disposables.length) {
      disposables.pop().dispose();
    }
  }
  const richEditConfiguration = {
    wordPattern: /(-?\d*\.\d\w*)|([^\[\{\]\}\:\"\,\s]+)/g,
    comments: {
      lineComment: "//",
      blockComment: ["/*", "*/"]
    },
    brackets: [
      ["{", "}"],
      ["[", "]"]
    ],
    autoClosingPairs: [
      { open: "{", close: "}", notIn: ["string"] },
      { open: "[", close: "]", notIn: ["string"] },
      { open: '"', close: '"', notIn: ["string"] }
    ]
  };
  exports.CompletionAdapter = lspLanguageFeatures.CompletionAdapter;
  exports.DefinitionAdapter = lspLanguageFeatures.DefinitionAdapter;
  exports.DiagnosticsAdapter = lspLanguageFeatures.DiagnosticsAdapter;
  exports.DocumentColorAdapter = lspLanguageFeatures.DocumentColorAdapter;
  exports.DocumentFormattingEditProvider = lspLanguageFeatures.DocumentFormattingEditProvider;
  exports.DocumentHighlightAdapter = lspLanguageFeatures.DocumentHighlightAdapter;
  exports.DocumentLinkAdapter = lspLanguageFeatures.DocumentLinkAdapter;
  exports.DocumentRangeFormattingEditProvider = lspLanguageFeatures.DocumentRangeFormattingEditProvider;
  exports.DocumentSymbolAdapter = lspLanguageFeatures.DocumentSymbolAdapter;
  exports.FoldingRangeAdapter = lspLanguageFeatures.FoldingRangeAdapter;
  exports.HoverAdapter = lspLanguageFeatures.HoverAdapter;
  exports.ReferenceAdapter = lspLanguageFeatures.ReferenceAdapter;
  exports.RenameAdapter = lspLanguageFeatures.RenameAdapter;
  exports.SelectionRangeAdapter = lspLanguageFeatures.SelectionRangeAdapter;
  exports.fromPosition = lspLanguageFeatures.fromPosition;
  exports.fromRange = lspLanguageFeatures.fromRange;
  exports.toRange = lspLanguageFeatures.toRange;
  exports.toTextEdit = lspLanguageFeatures.toTextEdit;
  exports.WorkerManager = WorkerManager;
  exports.getWorker = getWorker;
  exports.setupMode = setupMode;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
}));
