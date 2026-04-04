define("vs/index-CXwHBsfm", ["exports"], (function(exports) {
  "use strict";
  function t(...args) {
    const firstArg = args[0];
    let key;
    let message;
    let formatArgs;
    if (typeof firstArg === "string") {
      key = firstArg;
      message = firstArg;
      args.splice(0, 1);
      formatArgs = !args || typeof args[0] !== "object" ? args : args[0];
    } else if (firstArg instanceof Array) {
      const replacements = args.slice(1);
      if (firstArg.length !== replacements.length + 1) {
        throw new Error("expected a string as the first argument to l10n.t");
      }
      let str = firstArg[0];
      for (let i = 1; i < firstArg.length; i++) {
        str += `{${i - 1}}` + firstArg[i];
      }
      return t(str, ...replacements);
    } else {
      message = firstArg.message;
      key = message;
      if (firstArg.comment && firstArg.comment.length > 0) {
        key += `/${Array.isArray(firstArg.comment) ? firstArg.comment.join("") : firstArg.comment}`;
      }
      formatArgs = firstArg.args ?? {};
    }
    {
      return format(message, formatArgs);
    }
  }
  var _format2Regexp = /{([^}]+)}/g;
  function format(template, values) {
    if (Object.keys(values).length === 0) {
      return template;
    }
    return template.replace(_format2Regexp, (match, group) => values[group] ?? match);
  }
  class FullTextDocument {
    constructor(uri, languageId, version, content) {
      this._uri = uri;
      this._languageId = languageId;
      this._version = version;
      this._content = content;
      this._lineOffsets = void 0;
    }
    get uri() {
      return this._uri;
    }
    get languageId() {
      return this._languageId;
    }
    get version() {
      return this._version;
    }
    getText(range) {
      if (range) {
        const start = this.offsetAt(range.start);
        const end = this.offsetAt(range.end);
        return this._content.substring(start, end);
      }
      return this._content;
    }
    update(changes, version) {
      for (let change of changes) {
        if (FullTextDocument.isIncremental(change)) {
          const range = getWellformedRange(change.range);
          const startOffset = this.offsetAt(range.start);
          const endOffset = this.offsetAt(range.end);
          this._content = this._content.substring(0, startOffset) + change.text + this._content.substring(endOffset, this._content.length);
          const startLine = Math.max(range.start.line, 0);
          const endLine = Math.max(range.end.line, 0);
          let lineOffsets = this._lineOffsets;
          const addedLineOffsets = computeLineOffsets(change.text, false, startOffset);
          if (endLine - startLine === addedLineOffsets.length) {
            for (let i = 0, len = addedLineOffsets.length; i < len; i++) {
              lineOffsets[i + startLine + 1] = addedLineOffsets[i];
            }
          } else {
            if (addedLineOffsets.length < 1e4) {
              lineOffsets.splice(startLine + 1, endLine - startLine, ...addedLineOffsets);
            } else {
              this._lineOffsets = lineOffsets = lineOffsets.slice(0, startLine + 1).concat(addedLineOffsets, lineOffsets.slice(endLine + 1));
            }
          }
          const diff = change.text.length - (endOffset - startOffset);
          if (diff !== 0) {
            for (let i = startLine + 1 + addedLineOffsets.length, len = lineOffsets.length; i < len; i++) {
              lineOffsets[i] = lineOffsets[i] + diff;
            }
          }
        } else if (FullTextDocument.isFull(change)) {
          this._content = change.text;
          this._lineOffsets = void 0;
        } else {
          throw new Error("Unknown change event received");
        }
      }
      this._version = version;
    }
    getLineOffsets() {
      if (this._lineOffsets === void 0) {
        this._lineOffsets = computeLineOffsets(this._content, true);
      }
      return this._lineOffsets;
    }
    positionAt(offset) {
      offset = Math.max(Math.min(offset, this._content.length), 0);
      let lineOffsets = this.getLineOffsets();
      let low = 0, high = lineOffsets.length;
      if (high === 0) {
        return { line: 0, character: offset };
      }
      while (low < high) {
        let mid = Math.floor((low + high) / 2);
        if (lineOffsets[mid] > offset) {
          high = mid;
        } else {
          low = mid + 1;
        }
      }
      let line = low - 1;
      return { line, character: offset - lineOffsets[line] };
    }
    offsetAt(position) {
      let lineOffsets = this.getLineOffsets();
      if (position.line >= lineOffsets.length) {
        return this._content.length;
      } else if (position.line < 0) {
        return 0;
      }
      let lineOffset = lineOffsets[position.line];
      let nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
      return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
    }
    get lineCount() {
      return this.getLineOffsets().length;
    }
    static isIncremental(event) {
      let candidate = event;
      return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range !== void 0 && (candidate.rangeLength === void 0 || typeof candidate.rangeLength === "number");
    }
    static isFull(event) {
      let candidate = event;
      return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range === void 0 && candidate.rangeLength === void 0;
    }
  }
  exports.TextDocument = void 0;
  (function(TextDocument) {
    function create(uri, languageId, version, content) {
      return new FullTextDocument(uri, languageId, version, content);
    }
    TextDocument.create = create;
    function update(document, changes, version) {
      if (document instanceof FullTextDocument) {
        document.update(changes, version);
        return document;
      } else {
        throw new Error("TextDocument.update: document must be created by TextDocument.create");
      }
    }
    TextDocument.update = update;
    function applyEdits(document, edits) {
      let text = document.getText();
      let sortedEdits = mergeSort(edits.map(getWellformedEdit), (a, b) => {
        let diff = a.range.start.line - b.range.start.line;
        if (diff === 0) {
          return a.range.start.character - b.range.start.character;
        }
        return diff;
      });
      let lastModifiedOffset = 0;
      const spans = [];
      for (const e of sortedEdits) {
        let startOffset = document.offsetAt(e.range.start);
        if (startOffset < lastModifiedOffset) {
          throw new Error("Overlapping edit");
        } else if (startOffset > lastModifiedOffset) {
          spans.push(text.substring(lastModifiedOffset, startOffset));
        }
        if (e.newText.length) {
          spans.push(e.newText);
        }
        lastModifiedOffset = document.offsetAt(e.range.end);
      }
      spans.push(text.substr(lastModifiedOffset));
      return spans.join("");
    }
    TextDocument.applyEdits = applyEdits;
  })(exports.TextDocument || (exports.TextDocument = {}));
  function mergeSort(data, compare) {
    if (data.length <= 1) {
      return data;
    }
    const p = data.length / 2 | 0;
    const left = data.slice(0, p);
    const right = data.slice(p);
    mergeSort(left, compare);
    mergeSort(right, compare);
    let leftIdx = 0;
    let rightIdx = 0;
    let i = 0;
    while (leftIdx < left.length && rightIdx < right.length) {
      let ret = compare(left[leftIdx], right[rightIdx]);
      if (ret <= 0) {
        data[i++] = left[leftIdx++];
      } else {
        data[i++] = right[rightIdx++];
      }
    }
    while (leftIdx < left.length) {
      data[i++] = left[leftIdx++];
    }
    while (rightIdx < right.length) {
      data[i++] = right[rightIdx++];
    }
    return data;
  }
  function computeLineOffsets(text, isAtLineStart, textOffset = 0) {
    const result = isAtLineStart ? [textOffset] : [];
    for (let i = 0; i < text.length; i++) {
      let ch = text.charCodeAt(i);
      if (ch === 13 || ch === 10) {
        if (ch === 13 && i + 1 < text.length && text.charCodeAt(i + 1) === 10) {
          i++;
        }
        result.push(textOffset + i + 1);
      }
    }
    return result;
  }
  function getWellformedRange(range) {
    const start = range.start;
    const end = range.end;
    if (start.line > end.line || start.line === end.line && start.character > end.character) {
      return { start: end, end: start };
    }
    return range;
  }
  function getWellformedEdit(textEdit) {
    const range = getWellformedRange(textEdit.range);
    if (range !== textEdit.range) {
      return { newText: textEdit.newText, range };
    }
    return textEdit;
  }
  var LIB;
  (() => {
    var t2 = { 470: (t3) => {
      function e2(t4) {
        if ("string" != typeof t4) throw new TypeError("Path must be a string. Received " + JSON.stringify(t4));
      }
      function r2(t4, e3) {
        for (var r3, n3 = "", i = 0, o = -1, s = 0, h = 0; h <= t4.length; ++h) {
          if (h < t4.length) r3 = t4.charCodeAt(h);
          else {
            if (47 === r3) break;
            r3 = 47;
          }
          if (47 === r3) {
            if (o === h - 1 || 1 === s) ;
            else if (o !== h - 1 && 2 === s) {
              if (n3.length < 2 || 2 !== i || 46 !== n3.charCodeAt(n3.length - 1) || 46 !== n3.charCodeAt(n3.length - 2)) {
                if (n3.length > 2) {
                  var a = n3.lastIndexOf("/");
                  if (a !== n3.length - 1) {
                    -1 === a ? (n3 = "", i = 0) : i = (n3 = n3.slice(0, a)).length - 1 - n3.lastIndexOf("/"), o = h, s = 0;
                    continue;
                  }
                } else if (2 === n3.length || 1 === n3.length) {
                  n3 = "", i = 0, o = h, s = 0;
                  continue;
                }
              }
              e3 && (n3.length > 0 ? n3 += "/.." : n3 = "..", i = 2);
            } else n3.length > 0 ? n3 += "/" + t4.slice(o + 1, h) : n3 = t4.slice(o + 1, h), i = h - o - 1;
            o = h, s = 0;
          } else 46 === r3 && -1 !== s ? ++s : s = -1;
        }
        return n3;
      }
      var n2 = { resolve: function() {
        for (var t4, n3 = "", i = false, o = arguments.length - 1; o >= -1 && !i; o--) {
          var s;
          o >= 0 ? s = arguments[o] : (void 0 === t4 && (t4 = process.cwd()), s = t4), e2(s), 0 !== s.length && (n3 = s + "/" + n3, i = 47 === s.charCodeAt(0));
        }
        return n3 = r2(n3, !i), i ? n3.length > 0 ? "/" + n3 : "/" : n3.length > 0 ? n3 : ".";
      }, normalize: function(t4) {
        if (e2(t4), 0 === t4.length) return ".";
        var n3 = 47 === t4.charCodeAt(0), i = 47 === t4.charCodeAt(t4.length - 1);
        return 0 !== (t4 = r2(t4, !n3)).length || n3 || (t4 = "."), t4.length > 0 && i && (t4 += "/"), n3 ? "/" + t4 : t4;
      }, isAbsolute: function(t4) {
        return e2(t4), t4.length > 0 && 47 === t4.charCodeAt(0);
      }, join: function() {
        if (0 === arguments.length) return ".";
        for (var t4, r3 = 0; r3 < arguments.length; ++r3) {
          var i = arguments[r3];
          e2(i), i.length > 0 && (void 0 === t4 ? t4 = i : t4 += "/" + i);
        }
        return void 0 === t4 ? "." : n2.normalize(t4);
      }, relative: function(t4, r3) {
        if (e2(t4), e2(r3), t4 === r3) return "";
        if ((t4 = n2.resolve(t4)) === (r3 = n2.resolve(r3))) return "";
        for (var i = 1; i < t4.length && 47 === t4.charCodeAt(i); ++i) ;
        for (var o = t4.length, s = o - i, h = 1; h < r3.length && 47 === r3.charCodeAt(h); ++h) ;
        for (var a = r3.length - h, c = s < a ? s : a, f = -1, u = 0; u <= c; ++u) {
          if (u === c) {
            if (a > c) {
              if (47 === r3.charCodeAt(h + u)) return r3.slice(h + u + 1);
              if (0 === u) return r3.slice(h + u);
            } else s > c && (47 === t4.charCodeAt(i + u) ? f = u : 0 === u && (f = 0));
            break;
          }
          var l = t4.charCodeAt(i + u);
          if (l !== r3.charCodeAt(h + u)) break;
          47 === l && (f = u);
        }
        var g = "";
        for (u = i + f + 1; u <= o; ++u) u !== o && 47 !== t4.charCodeAt(u) || (0 === g.length ? g += ".." : g += "/..");
        return g.length > 0 ? g + r3.slice(h + f) : (h += f, 47 === r3.charCodeAt(h) && ++h, r3.slice(h));
      }, _makeLong: function(t4) {
        return t4;
      }, dirname: function(t4) {
        if (e2(t4), 0 === t4.length) return ".";
        for (var r3 = t4.charCodeAt(0), n3 = 47 === r3, i = -1, o = true, s = t4.length - 1; s >= 1; --s) if (47 === (r3 = t4.charCodeAt(s))) {
          if (!o) {
            i = s;
            break;
          }
        } else o = false;
        return -1 === i ? n3 ? "/" : "." : n3 && 1 === i ? "//" : t4.slice(0, i);
      }, basename: function(t4, r3) {
        if (void 0 !== r3 && "string" != typeof r3) throw new TypeError('"ext" argument must be a string');
        e2(t4);
        var n3, i = 0, o = -1, s = true;
        if (void 0 !== r3 && r3.length > 0 && r3.length <= t4.length) {
          if (r3.length === t4.length && r3 === t4) return "";
          var h = r3.length - 1, a = -1;
          for (n3 = t4.length - 1; n3 >= 0; --n3) {
            var c = t4.charCodeAt(n3);
            if (47 === c) {
              if (!s) {
                i = n3 + 1;
                break;
              }
            } else -1 === a && (s = false, a = n3 + 1), h >= 0 && (c === r3.charCodeAt(h) ? -1 == --h && (o = n3) : (h = -1, o = a));
          }
          return i === o ? o = a : -1 === o && (o = t4.length), t4.slice(i, o);
        }
        for (n3 = t4.length - 1; n3 >= 0; --n3) if (47 === t4.charCodeAt(n3)) {
          if (!s) {
            i = n3 + 1;
            break;
          }
        } else -1 === o && (s = false, o = n3 + 1);
        return -1 === o ? "" : t4.slice(i, o);
      }, extname: function(t4) {
        e2(t4);
        for (var r3 = -1, n3 = 0, i = -1, o = true, s = 0, h = t4.length - 1; h >= 0; --h) {
          var a = t4.charCodeAt(h);
          if (47 !== a) -1 === i && (o = false, i = h + 1), 46 === a ? -1 === r3 ? r3 = h : 1 !== s && (s = 1) : -1 !== r3 && (s = -1);
          else if (!o) {
            n3 = h + 1;
            break;
          }
        }
        return -1 === r3 || -1 === i || 0 === s || 1 === s && r3 === i - 1 && r3 === n3 + 1 ? "" : t4.slice(r3, i);
      }, format: function(t4) {
        if (null === t4 || "object" != typeof t4) throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof t4);
        return (function(t5, e3) {
          var r3 = e3.dir || e3.root, n3 = e3.base || (e3.name || "") + (e3.ext || "");
          return r3 ? r3 === e3.root ? r3 + n3 : r3 + "/" + n3 : n3;
        })(0, t4);
      }, parse: function(t4) {
        e2(t4);
        var r3 = { root: "", dir: "", base: "", ext: "", name: "" };
        if (0 === t4.length) return r3;
        var n3, i = t4.charCodeAt(0), o = 47 === i;
        o ? (r3.root = "/", n3 = 1) : n3 = 0;
        for (var s = -1, h = 0, a = -1, c = true, f = t4.length - 1, u = 0; f >= n3; --f) if (47 !== (i = t4.charCodeAt(f))) -1 === a && (c = false, a = f + 1), 46 === i ? -1 === s ? s = f : 1 !== u && (u = 1) : -1 !== s && (u = -1);
        else if (!c) {
          h = f + 1;
          break;
        }
        return -1 === s || -1 === a || 0 === u || 1 === u && s === a - 1 && s === h + 1 ? -1 !== a && (r3.base = r3.name = 0 === h && o ? t4.slice(1, a) : t4.slice(h, a)) : (0 === h && o ? (r3.name = t4.slice(1, s), r3.base = t4.slice(1, a)) : (r3.name = t4.slice(h, s), r3.base = t4.slice(h, a)), r3.ext = t4.slice(s, a)), h > 0 ? r3.dir = t4.slice(0, h - 1) : o && (r3.dir = "/"), r3;
      }, sep: "/", delimiter: ":", win32: null, posix: null };
      n2.posix = n2, t3.exports = n2;
    } }, e = {};
    function r(n2) {
      var i = e[n2];
      if (void 0 !== i) return i.exports;
      var o = e[n2] = { exports: {} };
      return t2[n2](o, o.exports, r), o.exports;
    }
    r.d = (t3, e2) => {
      for (var n2 in e2) r.o(e2, n2) && !r.o(t3, n2) && Object.defineProperty(t3, n2, { enumerable: true, get: e2[n2] });
    }, r.o = (t3, e2) => Object.prototype.hasOwnProperty.call(t3, e2), r.r = (t3) => {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t3, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t3, "__esModule", { value: true });
    };
    var n = {};
    (() => {
      let t3;
      if (r.r(n), r.d(n, { URI: () => f, Utils: () => P }), "object" == typeof process) t3 = "win32" === process.platform;
      else if ("object" == typeof navigator) {
        let e3 = navigator.userAgent;
        t3 = e3.indexOf("Windows") >= 0;
      }
      const e2 = /^\w[\w\d+.-]*$/, i = /^\//, o = /^\/\//;
      function s(t4, r2) {
        if (!t4.scheme && r2) throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${t4.authority}", path: "${t4.path}", query: "${t4.query}", fragment: "${t4.fragment}"}`);
        if (t4.scheme && !e2.test(t4.scheme)) throw new Error("[UriError]: Scheme contains illegal characters.");
        if (t4.path) {
          if (t4.authority) {
            if (!i.test(t4.path)) throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
          } else if (o.test(t4.path)) throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
        }
      }
      const h = "", a = "/", c = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
      class f {
        static isUri(t4) {
          return t4 instanceof f || !!t4 && "string" == typeof t4.authority && "string" == typeof t4.fragment && "string" == typeof t4.path && "string" == typeof t4.query && "string" == typeof t4.scheme && "string" == typeof t4.fsPath && "function" == typeof t4.with && "function" == typeof t4.toString;
        }
        scheme;
        authority;
        path;
        query;
        fragment;
        constructor(t4, e3, r2, n2, i2, o2 = false) {
          "object" == typeof t4 ? (this.scheme = t4.scheme || h, this.authority = t4.authority || h, this.path = t4.path || h, this.query = t4.query || h, this.fragment = t4.fragment || h) : (this.scheme = /* @__PURE__ */ (function(t5, e4) {
            return t5 || e4 ? t5 : "file";
          })(t4, o2), this.authority = e3 || h, this.path = (function(t5, e4) {
            switch (t5) {
              case "https":
              case "http":
              case "file":
                e4 ? e4[0] !== a && (e4 = a + e4) : e4 = a;
            }
            return e4;
          })(this.scheme, r2 || h), this.query = n2 || h, this.fragment = i2 || h, s(this, o2));
        }
        get fsPath() {
          return m(this);
        }
        with(t4) {
          if (!t4) return this;
          let { scheme: e3, authority: r2, path: n2, query: i2, fragment: o2 } = t4;
          return void 0 === e3 ? e3 = this.scheme : null === e3 && (e3 = h), void 0 === r2 ? r2 = this.authority : null === r2 && (r2 = h), void 0 === n2 ? n2 = this.path : null === n2 && (n2 = h), void 0 === i2 ? i2 = this.query : null === i2 && (i2 = h), void 0 === o2 ? o2 = this.fragment : null === o2 && (o2 = h), e3 === this.scheme && r2 === this.authority && n2 === this.path && i2 === this.query && o2 === this.fragment ? this : new l(e3, r2, n2, i2, o2);
        }
        static parse(t4, e3 = false) {
          const r2 = c.exec(t4);
          return r2 ? new l(r2[2] || h, C(r2[4] || h), C(r2[5] || h), C(r2[7] || h), C(r2[9] || h), e3) : new l(h, h, h, h, h);
        }
        static file(e3) {
          let r2 = h;
          if (t3 && (e3 = e3.replace(/\\/g, a)), e3[0] === a && e3[1] === a) {
            const t4 = e3.indexOf(a, 2);
            -1 === t4 ? (r2 = e3.substring(2), e3 = a) : (r2 = e3.substring(2, t4), e3 = e3.substring(t4) || a);
          }
          return new l("file", r2, e3, h, h);
        }
        static from(t4) {
          const e3 = new l(t4.scheme, t4.authority, t4.path, t4.query, t4.fragment);
          return s(e3, true), e3;
        }
        toString(t4 = false) {
          return y(this, t4);
        }
        toJSON() {
          return this;
        }
        static revive(t4) {
          if (t4) {
            if (t4 instanceof f) return t4;
            {
              const e3 = new l(t4);
              return e3._formatted = t4.external, e3._fsPath = t4._sep === u ? t4.fsPath : null, e3;
            }
          }
          return t4;
        }
      }
      const u = t3 ? 1 : void 0;
      class l extends f {
        _formatted = null;
        _fsPath = null;
        get fsPath() {
          return this._fsPath || (this._fsPath = m(this)), this._fsPath;
        }
        toString(t4 = false) {
          return t4 ? y(this, true) : (this._formatted || (this._formatted = y(this, false)), this._formatted);
        }
        toJSON() {
          const t4 = { $mid: 1 };
          return this._fsPath && (t4.fsPath = this._fsPath, t4._sep = u), this._formatted && (t4.external = this._formatted), this.path && (t4.path = this.path), this.scheme && (t4.scheme = this.scheme), this.authority && (t4.authority = this.authority), this.query && (t4.query = this.query), this.fragment && (t4.fragment = this.fragment), t4;
        }
      }
      const g = { 58: "%3A", 47: "%2F", 63: "%3F", 35: "%23", 91: "%5B", 93: "%5D", 64: "%40", 33: "%21", 36: "%24", 38: "%26", 39: "%27", 40: "%28", 41: "%29", 42: "%2A", 43: "%2B", 44: "%2C", 59: "%3B", 61: "%3D", 32: "%20" };
      function d(t4, e3, r2) {
        let n2, i2 = -1;
        for (let o2 = 0; o2 < t4.length; o2++) {
          const s2 = t4.charCodeAt(o2);
          if (s2 >= 97 && s2 <= 122 || s2 >= 65 && s2 <= 90 || s2 >= 48 && s2 <= 57 || 45 === s2 || 46 === s2 || 95 === s2 || 126 === s2 || e3 && 47 === s2 || r2 && 91 === s2 || r2 && 93 === s2 || r2 && 58 === s2) -1 !== i2 && (n2 += encodeURIComponent(t4.substring(i2, o2)), i2 = -1), void 0 !== n2 && (n2 += t4.charAt(o2));
          else {
            void 0 === n2 && (n2 = t4.substr(0, o2));
            const e4 = g[s2];
            void 0 !== e4 ? (-1 !== i2 && (n2 += encodeURIComponent(t4.substring(i2, o2)), i2 = -1), n2 += e4) : -1 === i2 && (i2 = o2);
          }
        }
        return -1 !== i2 && (n2 += encodeURIComponent(t4.substring(i2))), void 0 !== n2 ? n2 : t4;
      }
      function p(t4) {
        let e3;
        for (let r2 = 0; r2 < t4.length; r2++) {
          const n2 = t4.charCodeAt(r2);
          35 === n2 || 63 === n2 ? (void 0 === e3 && (e3 = t4.substr(0, r2)), e3 += g[n2]) : void 0 !== e3 && (e3 += t4[r2]);
        }
        return void 0 !== e3 ? e3 : t4;
      }
      function m(e3, r2) {
        let n2;
        return n2 = e3.authority && e3.path.length > 1 && "file" === e3.scheme ? `//${e3.authority}${e3.path}` : 47 === e3.path.charCodeAt(0) && (e3.path.charCodeAt(1) >= 65 && e3.path.charCodeAt(1) <= 90 || e3.path.charCodeAt(1) >= 97 && e3.path.charCodeAt(1) <= 122) && 58 === e3.path.charCodeAt(2) ? e3.path[1].toLowerCase() + e3.path.substr(2) : e3.path, t3 && (n2 = n2.replace(/\//g, "\\")), n2;
      }
      function y(t4, e3) {
        const r2 = e3 ? p : d;
        let n2 = "", { scheme: i2, authority: o2, path: s2, query: h2, fragment: c2 } = t4;
        if (i2 && (n2 += i2, n2 += ":"), (o2 || "file" === i2) && (n2 += a, n2 += a), o2) {
          let t5 = o2.indexOf("@");
          if (-1 !== t5) {
            const e4 = o2.substr(0, t5);
            o2 = o2.substr(t5 + 1), t5 = e4.lastIndexOf(":"), -1 === t5 ? n2 += r2(e4, false, false) : (n2 += r2(e4.substr(0, t5), false, false), n2 += ":", n2 += r2(e4.substr(t5 + 1), false, true)), n2 += "@";
          }
          o2 = o2.toLowerCase(), t5 = o2.lastIndexOf(":"), -1 === t5 ? n2 += r2(o2, false, true) : (n2 += r2(o2.substr(0, t5), false, true), n2 += o2.substr(t5));
        }
        if (s2) {
          if (s2.length >= 3 && 47 === s2.charCodeAt(0) && 58 === s2.charCodeAt(2)) {
            const t5 = s2.charCodeAt(1);
            t5 >= 65 && t5 <= 90 && (s2 = `/${String.fromCharCode(t5 + 32)}:${s2.substr(3)}`);
          } else if (s2.length >= 2 && 58 === s2.charCodeAt(1)) {
            const t5 = s2.charCodeAt(0);
            t5 >= 65 && t5 <= 90 && (s2 = `${String.fromCharCode(t5 + 32)}:${s2.substr(2)}`);
          }
          n2 += r2(s2, true, false);
        }
        return h2 && (n2 += "?", n2 += r2(h2, false, false)), c2 && (n2 += "#", n2 += e3 ? c2 : d(c2, false, false)), n2;
      }
      function v(t4) {
        try {
          return decodeURIComponent(t4);
        } catch {
          return t4.length > 3 ? t4.substr(0, 3) + v(t4.substr(3)) : t4;
        }
      }
      const b = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
      function C(t4) {
        return t4.match(b) ? t4.replace(b, ((t5) => v(t5))) : t4;
      }
      var A = r(470);
      const w = A.posix || A, x = "/";
      var P;
      !(function(t4) {
        t4.joinPath = function(t5, ...e3) {
          return t5.with({ path: w.join(t5.path, ...e3) });
        }, t4.resolvePath = function(t5, ...e3) {
          let r2 = t5.path, n2 = false;
          r2[0] !== x && (r2 = x + r2, n2 = true);
          let i2 = w.resolve(r2, ...e3);
          return n2 && i2[0] === x && !t5.authority && (i2 = i2.substring(1)), t5.with({ path: i2 });
        }, t4.dirname = function(t5) {
          if (0 === t5.path.length || t5.path === x) return t5;
          let e3 = w.dirname(t5.path);
          return 1 === e3.length && 46 === e3.charCodeAt(0) && (e3 = ""), t5.with({ path: e3 });
        }, t4.basename = function(t5) {
          return w.basename(t5.path);
        }, t4.extname = function(t5) {
          return w.extname(t5.path);
        };
      })(P || (P = {}));
    })(), LIB = n;
  })();
  const { URI, Utils } = LIB;
  exports.URI = URI;
  exports.Utils = Utils;
  exports.t = t;
}));
