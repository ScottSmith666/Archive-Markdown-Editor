define("vs/lspLanguageFeatures-CdOYx_ok", ["exports", "./main-CLp3wP3p", "./editor-DJILDtaA"], (function(exports, main, editor) {
  "use strict";
  class DiagnosticsAdapter {
    constructor(_languageId, _worker, configChangeEvent) {
      this._languageId = _languageId;
      this._worker = _worker;
      this._disposables = [];
      this._listener = /* @__PURE__ */ Object.create(null);
      const onModelAdd = (model) => {
        let modeId = model.getLanguageId();
        if (modeId !== this._languageId) {
          return;
        }
        let handle;
        this._listener[model.uri.toString()] = model.onDidChangeContent(() => {
          window.clearTimeout(handle);
          handle = window.setTimeout(() => this._doValidate(model.uri, modeId), 500);
        });
        this._doValidate(model.uri, modeId);
      };
      const onModelRemoved = (model) => {
        editor.editor.setModelMarkers(model, this._languageId, []);
        let uriStr = model.uri.toString();
        let listener = this._listener[uriStr];
        if (listener) {
          listener.dispose();
          delete this._listener[uriStr];
        }
      };
      this._disposables.push(editor.editor.onDidCreateModel(onModelAdd));
      this._disposables.push(editor.editor.onWillDisposeModel(onModelRemoved));
      this._disposables.push(
        editor.editor.onDidChangeModelLanguage((event) => {
          onModelRemoved(event.model);
          onModelAdd(event.model);
        })
      );
      this._disposables.push(
        configChangeEvent((_) => {
          editor.editor.getModels().forEach((model) => {
            if (model.getLanguageId() === this._languageId) {
              onModelRemoved(model);
              onModelAdd(model);
            }
          });
        })
      );
      this._disposables.push({
        dispose: () => {
          editor.editor.getModels().forEach(onModelRemoved);
          for (let key in this._listener) {
            this._listener[key].dispose();
          }
        }
      });
      editor.editor.getModels().forEach(onModelAdd);
    }
    dispose() {
      this._disposables.forEach((d) => d && d.dispose());
      this._disposables.length = 0;
    }
    _doValidate(resource, languageId) {
      this._worker(resource).then((worker) => {
        return worker.doValidation(resource.toString());
      }).then((diagnostics) => {
        const markers = diagnostics.map((d) => toDiagnostics(resource, d));
        let model = editor.editor.getModel(resource);
        if (model && model.getLanguageId() === languageId) {
          editor.editor.setModelMarkers(model, languageId, markers);
        }
      }).then(void 0, (err) => {
        console.error(err);
      });
    }
  }
  function toSeverity(lsSeverity) {
    switch (lsSeverity) {
      case main.DiagnosticSeverity.Error:
        return editor.MarkerSeverity.Error;
      case main.DiagnosticSeverity.Warning:
        return editor.MarkerSeverity.Warning;
      case main.DiagnosticSeverity.Information:
        return editor.MarkerSeverity.Info;
      case main.DiagnosticSeverity.Hint:
        return editor.MarkerSeverity.Hint;
      default:
        return editor.MarkerSeverity.Info;
    }
  }
  function toDiagnostics(resource, diag) {
    let code = typeof diag.code === "number" ? String(diag.code) : diag.code;
    return {
      severity: toSeverity(diag.severity),
      startLineNumber: diag.range.start.line + 1,
      startColumn: diag.range.start.character + 1,
      endLineNumber: diag.range.end.line + 1,
      endColumn: diag.range.end.character + 1,
      message: diag.message,
      code,
      source: diag.source
    };
  }
  class CompletionAdapter {
    constructor(_worker, _triggerCharacters) {
      this._worker = _worker;
      this._triggerCharacters = _triggerCharacters;
    }
    get triggerCharacters() {
      return this._triggerCharacters;
    }
    provideCompletionItems(model, position, context, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => {
        return worker.doComplete(resource.toString(), fromPosition(position));
      }).then((info) => {
        if (!info) {
          return;
        }
        const wordInfo = model.getWordUntilPosition(position);
        const wordRange = new editor.Range(
          position.lineNumber,
          wordInfo.startColumn,
          position.lineNumber,
          wordInfo.endColumn
        );
        const items = info.items.map((entry) => {
          const item = {
            label: entry.label,
            insertText: entry.insertText || entry.label,
            sortText: entry.sortText,
            filterText: entry.filterText,
            documentation: entry.documentation,
            detail: entry.detail,
            command: toCommand(entry.command),
            range: wordRange,
            kind: toCompletionItemKind(entry.kind)
          };
          if (entry.textEdit) {
            if (isInsertReplaceEdit(entry.textEdit)) {
              item.range = {
                insert: toRange(entry.textEdit.insert),
                replace: toRange(entry.textEdit.replace)
              };
            } else {
              item.range = toRange(entry.textEdit.range);
            }
            item.insertText = entry.textEdit.newText;
          }
          if (entry.additionalTextEdits) {
            item.additionalTextEdits = entry.additionalTextEdits.map(toTextEdit);
          }
          if (entry.insertTextFormat === main.InsertTextFormat.Snippet) {
            item.insertTextRules = editor.languages.CompletionItemInsertTextRule.InsertAsSnippet;
          }
          return item;
        });
        return {
          isIncomplete: info.isIncomplete,
          suggestions: items
        };
      });
    }
  }
  function fromPosition(position) {
    if (!position) {
      return void 0;
    }
    return { character: position.column - 1, line: position.lineNumber - 1 };
  }
  function fromRange(range) {
    if (!range) {
      return void 0;
    }
    return {
      start: {
        line: range.startLineNumber - 1,
        character: range.startColumn - 1
      },
      end: { line: range.endLineNumber - 1, character: range.endColumn - 1 }
    };
  }
  function toRange(range) {
    if (!range) {
      return void 0;
    }
    return new editor.Range(
      range.start.line + 1,
      range.start.character + 1,
      range.end.line + 1,
      range.end.character + 1
    );
  }
  function isInsertReplaceEdit(edit) {
    return typeof edit.insert !== "undefined" && typeof edit.replace !== "undefined";
  }
  function toCompletionItemKind(kind) {
    const mItemKind = editor.languages.CompletionItemKind;
    switch (kind) {
      case main.CompletionItemKind.Text:
        return mItemKind.Text;
      case main.CompletionItemKind.Method:
        return mItemKind.Method;
      case main.CompletionItemKind.Function:
        return mItemKind.Function;
      case main.CompletionItemKind.Constructor:
        return mItemKind.Constructor;
      case main.CompletionItemKind.Field:
        return mItemKind.Field;
      case main.CompletionItemKind.Variable:
        return mItemKind.Variable;
      case main.CompletionItemKind.Class:
        return mItemKind.Class;
      case main.CompletionItemKind.Interface:
        return mItemKind.Interface;
      case main.CompletionItemKind.Module:
        return mItemKind.Module;
      case main.CompletionItemKind.Property:
        return mItemKind.Property;
      case main.CompletionItemKind.Unit:
        return mItemKind.Unit;
      case main.CompletionItemKind.Value:
        return mItemKind.Value;
      case main.CompletionItemKind.Enum:
        return mItemKind.Enum;
      case main.CompletionItemKind.Keyword:
        return mItemKind.Keyword;
      case main.CompletionItemKind.Snippet:
        return mItemKind.Snippet;
      case main.CompletionItemKind.Color:
        return mItemKind.Color;
      case main.CompletionItemKind.File:
        return mItemKind.File;
      case main.CompletionItemKind.Reference:
        return mItemKind.Reference;
    }
    return mItemKind.Property;
  }
  function toTextEdit(textEdit) {
    if (!textEdit) {
      return void 0;
    }
    return {
      range: toRange(textEdit.range),
      text: textEdit.newText
    };
  }
  function toCommand(c) {
    return c && c.command === "editor.action.triggerSuggest" ? { id: c.command, title: c.title, arguments: c.arguments } : void 0;
  }
  class HoverAdapter {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideHover(model, position, token) {
      let resource = model.uri;
      return this._worker(resource).then((worker) => {
        return worker.doHover(resource.toString(), fromPosition(position));
      }).then((info) => {
        if (!info) {
          return;
        }
        return {
          range: toRange(info.range),
          contents: toMarkedStringArray(info.contents)
        };
      });
    }
  }
  function isMarkupContent(thing) {
    return thing && typeof thing === "object" && typeof thing.kind === "string";
  }
  function toMarkdownString(entry) {
    if (typeof entry === "string") {
      return {
        value: entry
      };
    }
    if (isMarkupContent(entry)) {
      if (entry.kind === "plaintext") {
        return {
          value: entry.value.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&")
        };
      }
      return {
        value: entry.value
      };
    }
    return { value: "```" + entry.language + "\n" + entry.value + "\n```\n" };
  }
  function toMarkedStringArray(contents) {
    if (!contents) {
      return void 0;
    }
    if (Array.isArray(contents)) {
      return contents.map(toMarkdownString);
    }
    return [toMarkdownString(contents)];
  }
  class DocumentHighlightAdapter {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideDocumentHighlights(model, position, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => worker.findDocumentHighlights(resource.toString(), fromPosition(position))).then((entries) => {
        if (!entries) {
          return;
        }
        return entries.map((entry) => {
          return {
            range: toRange(entry.range),
            kind: toDocumentHighlightKind(entry.kind)
          };
        });
      });
    }
  }
  function toDocumentHighlightKind(kind) {
    switch (kind) {
      case main.DocumentHighlightKind.Read:
        return editor.languages.DocumentHighlightKind.Read;
      case main.DocumentHighlightKind.Write:
        return editor.languages.DocumentHighlightKind.Write;
      case main.DocumentHighlightKind.Text:
        return editor.languages.DocumentHighlightKind.Text;
    }
    return editor.languages.DocumentHighlightKind.Text;
  }
  class DefinitionAdapter {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideDefinition(model, position, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => {
        return worker.findDefinition(resource.toString(), fromPosition(position));
      }).then((definition) => {
        if (!definition) {
          return;
        }
        return [toLocation(definition)];
      });
    }
  }
  function toLocation(location) {
    return {
      uri: editor.Uri.parse(location.uri),
      range: toRange(location.range)
    };
  }
  class ReferenceAdapter {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideReferences(model, position, context, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => {
        return worker.findReferences(resource.toString(), fromPosition(position));
      }).then((entries) => {
        if (!entries) {
          return;
        }
        return entries.map(toLocation);
      });
    }
  }
  class RenameAdapter {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideRenameEdits(model, position, newName, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => {
        return worker.doRename(resource.toString(), fromPosition(position), newName);
      }).then((edit) => {
        return toWorkspaceEdit(edit);
      });
    }
  }
  function toWorkspaceEdit(edit) {
    if (!edit || !edit.changes) {
      return void 0;
    }
    let resourceEdits = [];
    for (let uri in edit.changes) {
      const _uri = editor.Uri.parse(uri);
      for (let e of edit.changes[uri]) {
        resourceEdits.push({
          resource: _uri,
          versionId: void 0,
          textEdit: {
            range: toRange(e.range),
            text: e.newText
          }
        });
      }
    }
    return {
      edits: resourceEdits
    };
  }
  class DocumentSymbolAdapter {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideDocumentSymbols(model, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => worker.findDocumentSymbols(resource.toString())).then((items) => {
        if (!items) {
          return;
        }
        return items.map((item) => {
          if (isDocumentSymbol(item)) {
            return toDocumentSymbol(item);
          }
          return {
            name: item.name,
            detail: "",
            containerName: item.containerName,
            kind: toSymbolKind(item.kind),
            range: toRange(item.location.range),
            selectionRange: toRange(item.location.range),
            tags: []
          };
        });
      });
    }
  }
  function isDocumentSymbol(symbol) {
    return "children" in symbol;
  }
  function toDocumentSymbol(symbol) {
    return {
      name: symbol.name,
      detail: symbol.detail ?? "",
      kind: toSymbolKind(symbol.kind),
      range: toRange(symbol.range),
      selectionRange: toRange(symbol.selectionRange),
      tags: symbol.tags ?? [],
      children: (symbol.children ?? []).map((item) => toDocumentSymbol(item))
    };
  }
  function toSymbolKind(kind) {
    let mKind = editor.languages.SymbolKind;
    switch (kind) {
      case main.SymbolKind.File:
        return mKind.File;
      case main.SymbolKind.Module:
        return mKind.Module;
      case main.SymbolKind.Namespace:
        return mKind.Namespace;
      case main.SymbolKind.Package:
        return mKind.Package;
      case main.SymbolKind.Class:
        return mKind.Class;
      case main.SymbolKind.Method:
        return mKind.Method;
      case main.SymbolKind.Property:
        return mKind.Property;
      case main.SymbolKind.Field:
        return mKind.Field;
      case main.SymbolKind.Constructor:
        return mKind.Constructor;
      case main.SymbolKind.Enum:
        return mKind.Enum;
      case main.SymbolKind.Interface:
        return mKind.Interface;
      case main.SymbolKind.Function:
        return mKind.Function;
      case main.SymbolKind.Variable:
        return mKind.Variable;
      case main.SymbolKind.Constant:
        return mKind.Constant;
      case main.SymbolKind.String:
        return mKind.String;
      case main.SymbolKind.Number:
        return mKind.Number;
      case main.SymbolKind.Boolean:
        return mKind.Boolean;
      case main.SymbolKind.Array:
        return mKind.Array;
    }
    return mKind.Function;
  }
  class DocumentLinkAdapter {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideLinks(model, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => worker.findDocumentLinks(resource.toString())).then((items) => {
        if (!items) {
          return;
        }
        return {
          links: items.map((item) => ({
            range: toRange(item.range),
            url: item.target
          }))
        };
      });
    }
  }
  class DocumentFormattingEditProvider {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideDocumentFormattingEdits(model, options, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => {
        return worker.format(resource.toString(), null, fromFormattingOptions(options)).then((edits) => {
          if (!edits || edits.length === 0) {
            return;
          }
          return edits.map(toTextEdit);
        });
      });
    }
  }
  class DocumentRangeFormattingEditProvider {
    constructor(_worker) {
      this._worker = _worker;
      this.canFormatMultipleRanges = false;
    }
    provideDocumentRangeFormattingEdits(model, range, options, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => {
        return worker.format(resource.toString(), fromRange(range), fromFormattingOptions(options)).then((edits) => {
          if (!edits || edits.length === 0) {
            return;
          }
          return edits.map(toTextEdit);
        });
      });
    }
  }
  function fromFormattingOptions(options) {
    return {
      tabSize: options.tabSize,
      insertSpaces: options.insertSpaces
    };
  }
  class DocumentColorAdapter {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideDocumentColors(model, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => worker.findDocumentColors(resource.toString())).then((infos) => {
        if (!infos) {
          return;
        }
        return infos.map((item) => ({
          color: item.color,
          range: toRange(item.range)
        }));
      });
    }
    provideColorPresentations(model, info, token) {
      const resource = model.uri;
      return this._worker(resource).then(
        (worker) => worker.getColorPresentations(resource.toString(), info.color, fromRange(info.range))
      ).then((presentations) => {
        if (!presentations) {
          return;
        }
        return presentations.map((presentation) => {
          let item = {
            label: presentation.label
          };
          if (presentation.textEdit) {
            item.textEdit = toTextEdit(presentation.textEdit);
          }
          if (presentation.additionalTextEdits) {
            item.additionalTextEdits = presentation.additionalTextEdits.map(toTextEdit);
          }
          return item;
        });
      });
    }
  }
  class FoldingRangeAdapter {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideFoldingRanges(model, context, token) {
      const resource = model.uri;
      return this._worker(resource).then((worker) => worker.getFoldingRanges(resource.toString(), context)).then((ranges) => {
        if (!ranges) {
          return;
        }
        return ranges.map((range) => {
          const result = {
            start: range.startLine + 1,
            end: range.endLine + 1
          };
          if (typeof range.kind !== "undefined") {
            result.kind = toFoldingRangeKind(range.kind);
          }
          return result;
        });
      });
    }
  }
  function toFoldingRangeKind(kind) {
    switch (kind) {
      case main.FoldingRangeKind.Comment:
        return editor.languages.FoldingRangeKind.Comment;
      case main.FoldingRangeKind.Imports:
        return editor.languages.FoldingRangeKind.Imports;
      case main.FoldingRangeKind.Region:
        return editor.languages.FoldingRangeKind.Region;
    }
    return void 0;
  }
  class SelectionRangeAdapter {
    constructor(_worker) {
      this._worker = _worker;
    }
    provideSelectionRanges(model, positions, token) {
      const resource = model.uri;
      return this._worker(resource).then(
        (worker) => worker.getSelectionRanges(
          resource.toString(),
          positions.map(fromPosition)
        )
      ).then((selectionRanges) => {
        if (!selectionRanges) {
          return;
        }
        return selectionRanges.map((selectionRange) => {
          const result = [];
          while (selectionRange) {
            result.push({ range: toRange(selectionRange.range) });
            selectionRange = selectionRange.parent;
          }
          return result;
        });
      });
    }
  }
  exports.CompletionAdapter = CompletionAdapter;
  exports.DefinitionAdapter = DefinitionAdapter;
  exports.DiagnosticsAdapter = DiagnosticsAdapter;
  exports.DocumentColorAdapter = DocumentColorAdapter;
  exports.DocumentFormattingEditProvider = DocumentFormattingEditProvider;
  exports.DocumentHighlightAdapter = DocumentHighlightAdapter;
  exports.DocumentLinkAdapter = DocumentLinkAdapter;
  exports.DocumentRangeFormattingEditProvider = DocumentRangeFormattingEditProvider;
  exports.DocumentSymbolAdapter = DocumentSymbolAdapter;
  exports.FoldingRangeAdapter = FoldingRangeAdapter;
  exports.HoverAdapter = HoverAdapter;
  exports.ReferenceAdapter = ReferenceAdapter;
  exports.RenameAdapter = RenameAdapter;
  exports.SelectionRangeAdapter = SelectionRangeAdapter;
  exports.fromPosition = fromPosition;
  exports.fromRange = fromRange;
  exports.toRange = toRange;
  exports.toTextEdit = toTextEdit;
}));
