define("vs/editorWorkerHost-DEXzajWn", ["exports"], (function(exports) {
  "use strict";
  function tail(arr) {
    if (arr.length === 0) {
      throw new Error("Invalid tail call");
    }
    return [arr.slice(0, arr.length - 1), arr[arr.length - 1]];
  }
  function equals$2(one, other, itemEquals = (a, b) => a === b) {
    if (one === other) {
      return true;
    }
    if (!one || !other) {
      return false;
    }
    if (one.length !== other.length) {
      return false;
    }
    for (let i = 0, len = one.length; i < len; i++) {
      if (!itemEquals(one[i], other[i])) {
        return false;
      }
    }
    return true;
  }
  function removeFastWithoutKeepingOrder(array, index) {
    const last = array.length - 1;
    if (index < last) {
      array[index] = array[last];
    }
    array.pop();
  }
  function binarySearch(array, key, comparator) {
    return binarySearch2(array.length, (i) => comparator(array[i], key));
  }
  function binarySearch2(length, compareToKey) {
    let low = 0, high = length - 1;
    while (low <= high) {
      const mid = (low + high) / 2 | 0;
      const comp = compareToKey(mid);
      if (comp < 0) {
        low = mid + 1;
      } else if (comp > 0) {
        high = mid - 1;
      } else {
        return mid;
      }
    }
    return -(low + 1);
  }
  function quickSelect(nth, data, compare2) {
    nth = nth | 0;
    if (nth >= data.length) {
      throw new TypeError("invalid index");
    }
    const pivotValue = data[Math.floor(data.length * Math.random())];
    const lower = [];
    const higher = [];
    const pivots = [];
    for (const value of data) {
      const val = compare2(value, pivotValue);
      if (val < 0) {
        lower.push(value);
      } else if (val > 0) {
        higher.push(value);
      } else {
        pivots.push(value);
      }
    }
    if (nth < lower.length) {
      return quickSelect(nth, lower, compare2);
    } else if (nth < lower.length + pivots.length) {
      return pivots[0];
    } else {
      return quickSelect(nth - (lower.length + pivots.length), higher, compare2);
    }
  }
  function groupBy(data, compare2) {
    const result = [];
    let currentGroup = void 0;
    for (const element of data.slice(0).sort(compare2)) {
      if (!currentGroup || compare2(currentGroup[0], element) !== 0) {
        currentGroup = [element];
        result.push(currentGroup);
      } else {
        currentGroup.push(element);
      }
    }
    return result;
  }
  function* groupAdjacentBy(items, shouldBeGrouped) {
    let currentGroup;
    let last;
    for (const item of items) {
      if (last !== void 0 && shouldBeGrouped(last, item)) {
        currentGroup.push(item);
      } else {
        if (currentGroup) {
          yield currentGroup;
        }
        currentGroup = [item];
      }
      last = item;
    }
    if (currentGroup) {
      yield currentGroup;
    }
  }
  function forEachAdjacent(arr, f) {
    for (let i = 0; i <= arr.length; i++) {
      f(i === 0 ? void 0 : arr[i - 1], i === arr.length ? void 0 : arr[i]);
    }
  }
  function forEachWithNeighbors(arr, f) {
    for (let i = 0; i < arr.length; i++) {
      f(i === 0 ? void 0 : arr[i - 1], arr[i], i + 1 === arr.length ? void 0 : arr[i + 1]);
    }
  }
  function coalesce(array) {
    return array.filter((e) => !!e);
  }
  function coalesceInPlace(array) {
    let to = 0;
    for (let i = 0; i < array.length; i++) {
      if (!!array[i]) {
        array[to] = array[i];
        to += 1;
      }
    }
    array.length = to;
  }
  function isFalsyOrEmpty(obj) {
    return !Array.isArray(obj) || obj.length === 0;
  }
  function isNonEmptyArray(obj) {
    return Array.isArray(obj) && obj.length > 0;
  }
  function distinct(array, keyFn = (value) => value) {
    const seen = /* @__PURE__ */ new Set();
    return array.filter((element) => {
      const key = keyFn(element);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
  function range(arg, to) {
    let from = typeof to === "number" ? arg : 0;
    if (typeof to === "number") {
      from = arg;
    } else {
      from = 0;
      to = arg;
    }
    const result = [];
    if (from <= to) {
      for (let i = from; i < to; i++) {
        result.push(i);
      }
    } else {
      for (let i = from; i > to; i--) {
        result.push(i);
      }
    }
    return result;
  }
  function arrayInsert(target, insertIndex, insertArr) {
    const before = target.slice(0, insertIndex);
    const after = target.slice(insertIndex);
    return before.concat(insertArr, after);
  }
  function pushToStart(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
      arr.unshift(value);
    }
  }
  function pushToEnd(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
      arr.push(value);
    }
  }
  function pushMany(arr, items) {
    for (const item of items) {
      arr.push(item);
    }
  }
  function mapFilter(array, fn) {
    const result = [];
    for (const item of array) {
      const mapped = fn(item);
      if (mapped !== void 0) {
        result.push(mapped);
      }
    }
    return result;
  }
  function asArray(x) {
    return Array.isArray(x) ? x : [x];
  }
  function insertInto(array, start, newItems) {
    const startIdx = getActualStartIndex(array, start);
    const originalLength = array.length;
    const newItemsLength = newItems.length;
    array.length = originalLength + newItemsLength;
    for (let i = originalLength - 1; i >= startIdx; i--) {
      array[i + newItemsLength] = array[i];
    }
    for (let i = 0; i < newItemsLength; i++) {
      array[i + startIdx] = newItems[i];
    }
  }
  function splice(array, start, deleteCount, newItems) {
    const index = getActualStartIndex(array, start);
    let result = array.splice(index, deleteCount);
    if (result === void 0) {
      result = [];
    }
    insertInto(array, index, newItems);
    return result;
  }
  function getActualStartIndex(array, start) {
    return start < 0 ? Math.max(start + array.length, 0) : Math.min(start, array.length);
  }
  var CompareResult;
  (function(CompareResult2) {
    function isLessThan(result) {
      return result < 0;
    }
    CompareResult2.isLessThan = isLessThan;
    function isLessThanOrEqual(result) {
      return result <= 0;
    }
    CompareResult2.isLessThanOrEqual = isLessThanOrEqual;
    function isGreaterThan(result) {
      return result > 0;
    }
    CompareResult2.isGreaterThan = isGreaterThan;
    function isNeitherLessOrGreaterThan(result) {
      return result === 0;
    }
    CompareResult2.isNeitherLessOrGreaterThan = isNeitherLessOrGreaterThan;
    CompareResult2.greaterThan = 1;
    CompareResult2.lessThan = -1;
    CompareResult2.neitherLessOrGreaterThan = 0;
  })(CompareResult || (CompareResult = {}));
  function compareBy(selector, comparator) {
    return (a, b) => comparator(selector(a), selector(b));
  }
  function tieBreakComparators(...comparators) {
    return (item1, item2) => {
      for (const comparator of comparators) {
        const result = comparator(item1, item2);
        if (!CompareResult.isNeitherLessOrGreaterThan(result)) {
          return result;
        }
      }
      return CompareResult.neitherLessOrGreaterThan;
    };
  }
  const numberComparator = (a, b) => a - b;
  const booleanComparator = (a, b) => numberComparator(a ? 1 : 0, b ? 1 : 0);
  function reverseOrder(comparator) {
    return (a, b) => -comparator(a, b);
  }
  function compareUndefinedSmallest(comparator) {
    return (a, b) => {
      if (a === void 0) {
        return b === void 0 ? CompareResult.neitherLessOrGreaterThan : CompareResult.lessThan;
      } else if (b === void 0) {
        return CompareResult.greaterThan;
      }
      return comparator(a, b);
    };
  }
  class ArrayQueue {
    /**
     * Constructs a queue that is backed by the given array. Runtime is O(1).
    */
    constructor(items) {
      this.firstIdx = 0;
      this.items = items;
      this.lastIdx = this.items.length - 1;
    }
    get length() {
      return this.lastIdx - this.firstIdx + 1;
    }
    /**
     * Consumes elements from the beginning of the queue as long as the predicate returns true.
     * If no elements were consumed, `null` is returned. Has a runtime of O(result.length).
    */
    takeWhile(predicate) {
      let startIdx = this.firstIdx;
      while (startIdx < this.items.length && predicate(this.items[startIdx])) {
        startIdx++;
      }
      const result = startIdx === this.firstIdx ? null : this.items.slice(this.firstIdx, startIdx);
      this.firstIdx = startIdx;
      return result;
    }
    /**
     * Consumes elements from the end of the queue as long as the predicate returns true.
     * If no elements were consumed, `null` is returned.
     * The result has the same order as the underlying array!
    */
    takeFromEndWhile(predicate) {
      let endIdx = this.lastIdx;
      while (endIdx >= 0 && predicate(this.items[endIdx])) {
        endIdx--;
      }
      const result = endIdx === this.lastIdx ? null : this.items.slice(endIdx + 1, this.lastIdx + 1);
      this.lastIdx = endIdx;
      return result;
    }
    peek() {
      if (this.length === 0) {
        return void 0;
      }
      return this.items[this.firstIdx];
    }
    dequeue() {
      const result = this.items[this.firstIdx];
      this.firstIdx++;
      return result;
    }
    takeCount(count) {
      const result = this.items.slice(this.firstIdx, this.firstIdx + count);
      this.firstIdx += count;
      return result;
    }
  }
  const _CallbackIterable = class _CallbackIterable {
    constructor(iterate) {
      this.iterate = iterate;
    }
    toArray() {
      const result = [];
      this.iterate((item) => {
        result.push(item);
        return true;
      });
      return result;
    }
    filter(predicate) {
      return new _CallbackIterable((cb) => this.iterate((item) => predicate(item) ? cb(item) : true));
    }
    map(mapFn) {
      return new _CallbackIterable((cb) => this.iterate((item) => cb(mapFn(item))));
    }
    findLast(predicate) {
      let result;
      this.iterate((item) => {
        if (predicate(item)) {
          result = item;
        }
        return true;
      });
      return result;
    }
    findLastMaxBy(comparator) {
      let result;
      let first2 = true;
      this.iterate((item) => {
        if (first2 || CompareResult.isGreaterThan(comparator(item, result))) {
          first2 = false;
          result = item;
        }
        return true;
      });
      return result;
    }
  };
  _CallbackIterable.empty = new _CallbackIterable((_callback) => {
  });
  let CallbackIterable = _CallbackIterable;
  class Permutation {
    constructor(_indexMap) {
      this._indexMap = _indexMap;
    }
    /**
     * Returns a permutation that sorts the given array according to the given compare function.
     */
    static createSortPermutation(arr, compareFn) {
      const sortIndices = Array.from(arr.keys()).sort((index1, index2) => compareFn(arr[index1], arr[index2]));
      return new Permutation(sortIndices);
    }
    /**
     * Returns a new array with the elements of the given array re-arranged according to this permutation.
     */
    apply(arr) {
      return arr.map((_, index) => arr[this._indexMap[index]]);
    }
    /**
     * Returns a new permutation that undoes the re-arrangement of this permutation.
    */
    inverse() {
      const inverseIndexMap = this._indexMap.slice();
      for (let i = 0; i < this._indexMap.length; i++) {
        inverseIndexMap[this._indexMap[i]] = i;
      }
      return new Permutation(inverseIndexMap);
    }
  }
  function sum(array) {
    return array.reduce((acc, value) => acc + value, 0);
  }
  class ErrorHandler {
    constructor() {
      this.listeners = [];
      this.unexpectedErrorHandler = function(e) {
        setTimeout(() => {
          if (e.stack) {
            if (ErrorNoTelemetry.isErrorNoTelemetry(e)) {
              throw new ErrorNoTelemetry(e.message + "\n\n" + e.stack);
            }
            throw new Error(e.message + "\n\n" + e.stack);
          }
          throw e;
        }, 0);
      };
    }
    emit(e) {
      this.listeners.forEach((listener) => {
        listener(e);
      });
    }
    onUnexpectedError(e) {
      this.unexpectedErrorHandler(e);
      this.emit(e);
    }
    // For external errors, we don't want the listeners to be called
    onUnexpectedExternalError(e) {
      this.unexpectedErrorHandler(e);
    }
  }
  const errorHandler = new ErrorHandler();
  function onBugIndicatingError(e) {
    errorHandler.onUnexpectedError(e);
    return void 0;
  }
  function onUnexpectedError(e) {
    if (!isCancellationError(e)) {
      errorHandler.onUnexpectedError(e);
    }
    return void 0;
  }
  function onUnexpectedExternalError(e) {
    if (!isCancellationError(e)) {
      errorHandler.onUnexpectedExternalError(e);
    }
    return void 0;
  }
  function transformErrorForSerialization(error) {
    if (error instanceof Error) {
      const { name, message, cause } = error;
      const stack = error.stacktrace || error.stack;
      return {
        $isError: true,
        name,
        message,
        stack,
        noTelemetry: ErrorNoTelemetry.isErrorNoTelemetry(error),
        cause: cause ? transformErrorForSerialization(cause) : void 0,
        code: error.code
      };
    }
    return error;
  }
  const canceledName = "Canceled";
  function isCancellationError(error) {
    if (error instanceof CancellationError) {
      return true;
    }
    return error instanceof Error && error.name === canceledName && error.message === canceledName;
  }
  class CancellationError extends Error {
    constructor() {
      super(canceledName);
      this.name = this.message;
    }
  }
  function canceled() {
    const error = new Error(canceledName);
    error.name = error.message;
    return error;
  }
  function illegalArgument(name) {
    if (name) {
      return new Error(`Illegal argument: ${name}`);
    } else {
      return new Error("Illegal argument");
    }
  }
  function illegalState(name) {
    if (name) {
      return new Error(`Illegal state: ${name}`);
    } else {
      return new Error("Illegal state");
    }
  }
  class NotSupportedError extends Error {
    constructor(message) {
      super("NotSupported");
      if (message) {
        this.message = message;
      }
    }
  }
  class ErrorNoTelemetry extends Error {
    constructor(msg) {
      super(msg);
      this.name = "CodeExpectedError";
    }
    static fromError(err) {
      if (err instanceof ErrorNoTelemetry) {
        return err;
      }
      const result = new ErrorNoTelemetry();
      result.message = err.message;
      result.stack = err.stack;
      return result;
    }
    static isErrorNoTelemetry(err) {
      return err.name === "CodeExpectedError";
    }
  }
  class BugIndicatingError extends Error {
    constructor(message) {
      super(message || "An unexpected bug occurred.");
      Object.setPrototypeOf(this, BugIndicatingError.prototype);
    }
  }
  function ok(value, message) {
    if (!value) {
      throw new Error(message ? `Assertion failed (${message})` : "Assertion Failed");
    }
  }
  function assertNever(value, message = "Unreachable") {
    throw new Error(message);
  }
  function assert(condition, messageOrError = "unexpected state") {
    if (!condition) {
      const errorToThrow = typeof messageOrError === "string" ? new BugIndicatingError(`Assertion Failed: ${messageOrError}`) : messageOrError;
      throw errorToThrow;
    }
  }
  function softAssert(condition, message = "Soft Assertion Failed") {
    if (!condition) {
      onUnexpectedError(new BugIndicatingError(message));
    }
  }
  function assertFn(condition) {
    if (!condition()) {
      debugger;
      condition();
      onUnexpectedError(new BugIndicatingError("Assertion Failed"));
    }
  }
  function checkAdjacentItems(items, predicate) {
    let i = 0;
    while (i < items.length - 1) {
      const a = items[i];
      const b = items[i + 1];
      if (!predicate(a, b)) {
        return false;
      }
      i++;
    }
    return true;
  }
  function isString(str) {
    return typeof str === "string";
  }
  function isArrayOf(value, check) {
    return Array.isArray(value) && value.every(check);
  }
  function isObject(obj) {
    return typeof obj === "object" && obj !== null && !Array.isArray(obj) && !(obj instanceof RegExp) && !(obj instanceof Date);
  }
  function isTypedArray(obj) {
    const TypedArray = Object.getPrototypeOf(Uint8Array);
    return typeof obj === "object" && obj instanceof TypedArray;
  }
  function isNumber(obj) {
    return typeof obj === "number" && !isNaN(obj);
  }
  function isIterable(obj) {
    return !!obj && typeof obj[Symbol.iterator] === "function";
  }
  function isBoolean(obj) {
    return obj === true || obj === false;
  }
  function isUndefined(obj) {
    return typeof obj === "undefined";
  }
  function isDefined(arg) {
    return !isUndefinedOrNull(arg);
  }
  function isUndefinedOrNull(obj) {
    return isUndefined(obj) || obj === null;
  }
  function assertType(condition, type) {
    if (!condition) {
      throw new Error(type ? `Unexpected type, expected '${type}'` : "Unexpected type");
    }
  }
  function assertReturnsDefined(arg) {
    assert(arg !== null && arg !== void 0, "Argument is `undefined` or `null`.");
    return arg;
  }
  function isFunction(obj) {
    return typeof obj === "function";
  }
  function validateConstraints(args, constraints) {
    const len = Math.min(args.length, constraints.length);
    for (let i = 0; i < len; i++) {
      validateConstraint(args[i], constraints[i]);
    }
  }
  function validateConstraint(arg, constraint) {
    if (isString(constraint)) {
      if (typeof arg !== constraint) {
        throw new Error(`argument does not match constraint: typeof ${constraint}`);
      }
    } else if (isFunction(constraint)) {
      try {
        if (arg instanceof constraint) {
          return;
        }
      } catch {
      }
      if (!isUndefinedOrNull(arg) && arg.constructor === constraint) {
        return;
      }
      if (constraint.length === 1 && constraint.call(void 0, arg) === true) {
        return;
      }
      throw new Error(`argument does not match one of these constraints: arg instanceof constraint, arg.constructor === constraint, nor constraint(arg) === true`);
    }
  }
  function upcast(x) {
    return x;
  }
  function deepClone(obj) {
    if (!obj || typeof obj !== "object") {
      return obj;
    }
    if (obj instanceof RegExp) {
      return obj;
    }
    const result = Array.isArray(obj) ? [] : {};
    Object.entries(obj).forEach(([key, value]) => {
      result[key] = value && typeof value === "object" ? deepClone(value) : value;
    });
    return result;
  }
  function deepFreeze(obj) {
    if (!obj || typeof obj !== "object") {
      return obj;
    }
    const stack = [obj];
    while (stack.length > 0) {
      const obj2 = stack.shift();
      Object.freeze(obj2);
      for (const key in obj2) {
        if (_hasOwnProperty.call(obj2, key)) {
          const prop = obj2[key];
          if (typeof prop === "object" && !Object.isFrozen(prop) && !isTypedArray(prop)) {
            stack.push(prop);
          }
        }
      }
    }
    return obj;
  }
  const _hasOwnProperty = Object.prototype.hasOwnProperty;
  function cloneAndChange(obj, changer) {
    return _cloneAndChange(obj, changer, /* @__PURE__ */ new Set());
  }
  function _cloneAndChange(obj, changer, seen) {
    if (isUndefinedOrNull(obj)) {
      return obj;
    }
    const changed = changer(obj);
    if (typeof changed !== "undefined") {
      return changed;
    }
    if (Array.isArray(obj)) {
      const r1 = [];
      for (const e of obj) {
        r1.push(_cloneAndChange(e, changer, seen));
      }
      return r1;
    }
    if (isObject(obj)) {
      if (seen.has(obj)) {
        throw new Error("Cannot clone recursive data-structure");
      }
      seen.add(obj);
      const r2 = {};
      for (const i2 in obj) {
        if (_hasOwnProperty.call(obj, i2)) {
          r2[i2] = _cloneAndChange(obj[i2], changer, seen);
        }
      }
      seen.delete(obj);
      return r2;
    }
    return obj;
  }
  function mixin(destination, source, overwrite = true) {
    if (!isObject(destination)) {
      return source;
    }
    if (isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (key in destination) {
          if (overwrite) {
            if (isObject(destination[key]) && isObject(source[key])) {
              mixin(destination[key], source[key], overwrite);
            } else {
              destination[key] = source[key];
            }
          }
        } else {
          destination[key] = source[key];
        }
      });
    }
    return destination;
  }
  function equals$1(one, other) {
    if (one === other) {
      return true;
    }
    if (one === null || one === void 0 || other === null || other === void 0) {
      return false;
    }
    if (typeof one !== typeof other) {
      return false;
    }
    if (typeof one !== "object") {
      return false;
    }
    if (Array.isArray(one) !== Array.isArray(other)) {
      return false;
    }
    let i;
    let key;
    if (Array.isArray(one)) {
      if (one.length !== other.length) {
        return false;
      }
      for (i = 0; i < one.length; i++) {
        if (!equals$1(one[i], other[i])) {
          return false;
        }
      }
    } else {
      const oneKeys = [];
      for (key in one) {
        oneKeys.push(key);
      }
      oneKeys.sort();
      const otherKeys = [];
      for (key in other) {
        otherKeys.push(key);
      }
      otherKeys.sort();
      if (!equals$1(oneKeys, otherKeys)) {
        return false;
      }
      for (i = 0; i < oneKeys.length; i++) {
        if (!equals$1(one[oneKeys[i]], other[oneKeys[i]])) {
          return false;
        }
      }
    }
    return true;
  }
  function getNLSMessages() {
    return globalThis._VSCODE_NLS_MESSAGES;
  }
  function getNLSLanguage() {
    return globalThis._VSCODE_NLS_LANGUAGE;
  }
  const isPseudo = getNLSLanguage() === "pseudo" || typeof document !== "undefined" && document.location && typeof document.location.hash === "string" && document.location.hash.indexOf("pseudo=true") >= 0;
  function _format$1(message, args) {
    let result;
    if (args.length === 0) {
      result = message;
    } else {
      result = message.replace(/\{(\d+)\}/g, (match, rest) => {
        const index = rest[0];
        const arg = args[index];
        let result2 = match;
        if (typeof arg === "string") {
          result2 = arg;
        } else if (typeof arg === "number" || typeof arg === "boolean" || arg === void 0 || arg === null) {
          result2 = String(arg);
        }
        return result2;
      });
    }
    if (isPseudo) {
      result = "［" + result.replace(/[aouei]/g, "$&$&") + "］";
    }
    return result;
  }
  function localize(data, message, ...args) {
    if (typeof data === "number") {
      return _format$1(lookupMessage(data, message), args);
    }
    return _format$1(message, args);
  }
  function lookupMessage(index, fallback) {
    const message = getNLSMessages()?.[index];
    if (typeof message !== "string") {
      if (typeof fallback === "string") {
        return fallback;
      }
      throw new Error(`!!! NLS MISSING: ${index} !!!`);
    }
    return message;
  }
  function localize2(data, originalMessage, ...args) {
    let message;
    if (typeof data === "number") {
      message = lookupMessage(data, originalMessage);
    } else {
      message = originalMessage;
    }
    const value = _format$1(message, args);
    return {
      value,
      original: originalMessage === message ? value : _format$1(originalMessage, args)
    };
  }
  const LANGUAGE_DEFAULT = "en";
  let _isWindows = false;
  let _isMacintosh = false;
  let _isLinux = false;
  let _isNative = false;
  let _isWeb = false;
  let _isIOS = false;
  let _isMobile = false;
  let _locale = void 0;
  let _language = LANGUAGE_DEFAULT;
  let _platformLocale = LANGUAGE_DEFAULT;
  let _translationsConfigFile = void 0;
  let _userAgent = void 0;
  const $globalThis = globalThis;
  let nodeProcess = void 0;
  if (typeof $globalThis.vscode !== "undefined" && typeof $globalThis.vscode.process !== "undefined") {
    nodeProcess = $globalThis.vscode.process;
  } else if (typeof process !== "undefined" && typeof process?.versions?.node === "string") {
    nodeProcess = process;
  }
  const isElectronProcess = typeof nodeProcess?.versions?.electron === "string";
  const isElectronRenderer = isElectronProcess && nodeProcess?.type === "renderer";
  if (typeof nodeProcess === "object") {
    _isWindows = nodeProcess.platform === "win32";
    _isMacintosh = nodeProcess.platform === "darwin";
    _isLinux = nodeProcess.platform === "linux";
    _isLinux && !!nodeProcess.env["SNAP"] && !!nodeProcess.env["SNAP_REVISION"];
    !!nodeProcess.env["CI"] || !!nodeProcess.env["BUILD_ARTIFACTSTAGINGDIRECTORY"] || !!nodeProcess.env["GITHUB_WORKSPACE"];
    _locale = LANGUAGE_DEFAULT;
    _language = LANGUAGE_DEFAULT;
    const rawNlsConfig = nodeProcess.env["VSCODE_NLS_CONFIG"];
    if (rawNlsConfig) {
      try {
        const nlsConfig = JSON.parse(rawNlsConfig);
        _locale = nlsConfig.userLocale;
        _platformLocale = nlsConfig.osLocale;
        _language = nlsConfig.resolvedLanguage || LANGUAGE_DEFAULT;
        _translationsConfigFile = nlsConfig.languagePack?.translationsConfigFile;
      } catch (e) {
      }
    }
    _isNative = true;
  } else if (typeof navigator === "object" && !isElectronRenderer) {
    _userAgent = navigator.userAgent;
    _isWindows = _userAgent.indexOf("Windows") >= 0;
    _isMacintosh = _userAgent.indexOf("Macintosh") >= 0;
    _isIOS = (_userAgent.indexOf("Macintosh") >= 0 || _userAgent.indexOf("iPad") >= 0 || _userAgent.indexOf("iPhone") >= 0) && !!navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
    _isLinux = _userAgent.indexOf("Linux") >= 0;
    _isMobile = _userAgent?.indexOf("Mobi") >= 0;
    _isWeb = true;
    _language = getNLSLanguage() || LANGUAGE_DEFAULT;
    _locale = navigator.language.toLowerCase();
    _platformLocale = _locale;
  } else {
    console.error("Unable to resolve platform.");
  }
  let _platform = 0;
  if (_isMacintosh) {
    _platform = 1;
  } else if (_isWindows) {
    _platform = 3;
  } else if (_isLinux) {
    _platform = 2;
  }
  const isWindows = _isWindows;
  const isMacintosh = _isMacintosh;
  const isLinux = _isLinux;
  const isNative = _isNative;
  const isWeb = _isWeb;
  const isWebWorker = _isWeb && typeof $globalThis.importScripts === "function";
  const webWorkerOrigin = isWebWorker ? $globalThis.origin : void 0;
  const isIOS = _isIOS;
  const isMobile = _isMobile;
  const platform$1 = _platform;
  const userAgent = _userAgent;
  const language = _language;
  const setTimeout0IsFaster = typeof $globalThis.postMessage === "function" && !$globalThis.importScripts;
  const setTimeout0 = (() => {
    if (setTimeout0IsFaster) {
      const pending = [];
      $globalThis.addEventListener("message", (e) => {
        if (e.data && e.data.vscodeScheduleAsyncWork) {
          for (let i = 0, len = pending.length; i < len; i++) {
            const candidate = pending[i];
            if (candidate.id === e.data.vscodeScheduleAsyncWork) {
              pending.splice(i, 1);
              candidate.callback();
              return;
            }
          }
        }
      });
      let lastId = 0;
      return (callback) => {
        const myId = ++lastId;
        pending.push({
          id: myId,
          callback
        });
        $globalThis.postMessage({ vscodeScheduleAsyncWork: myId }, "*");
      };
    }
    return (callback) => setTimeout(callback);
  })();
  const OS = _isMacintosh || _isIOS ? 2 : _isWindows ? 1 : 3;
  let _isLittleEndian = true;
  let _isLittleEndianComputed = false;
  function isLittleEndian() {
    if (!_isLittleEndianComputed) {
      _isLittleEndianComputed = true;
      const test = new Uint8Array(2);
      test[0] = 1;
      test[1] = 2;
      const view = new Uint16Array(test.buffer);
      _isLittleEndian = view[0] === (2 << 8) + 1;
    }
    return _isLittleEndian;
  }
  const isChrome = !!(userAgent && userAgent.indexOf("Chrome") >= 0);
  const isFirefox = !!(userAgent && userAgent.indexOf("Firefox") >= 0);
  const isSafari = !!(!isChrome && (userAgent && userAgent.indexOf("Safari") >= 0));
  const isEdge = !!(userAgent && userAgent.indexOf("Edg/") >= 0);
  const isAndroid = !!(userAgent && userAgent.indexOf("Android") >= 0);
  function createSingleCallFunction(fn, fnDidRunCallback) {
    const _this = this;
    let didCall = false;
    let result;
    return function() {
      if (didCall) {
        return result;
      }
      didCall = true;
      {
        result = fn.apply(_this, arguments);
      }
      return result;
    };
  }
  exports.Iterable = void 0;
  (function(Iterable) {
    function is(thing) {
      return !!thing && typeof thing === "object" && typeof thing[Symbol.iterator] === "function";
    }
    Iterable.is = is;
    const _empty2 = Object.freeze([]);
    function empty() {
      return _empty2;
    }
    Iterable.empty = empty;
    function* single(element) {
      yield element;
    }
    Iterable.single = single;
    function wrap(iterableOrElement) {
      if (is(iterableOrElement)) {
        return iterableOrElement;
      } else {
        return single(iterableOrElement);
      }
    }
    Iterable.wrap = wrap;
    function from(iterable) {
      return iterable ?? _empty2;
    }
    Iterable.from = from;
    function* reverse(array) {
      for (let i = array.length - 1; i >= 0; i--) {
        yield array[i];
      }
    }
    Iterable.reverse = reverse;
    function isEmpty(iterable) {
      return !iterable || iterable[Symbol.iterator]().next().done === true;
    }
    Iterable.isEmpty = isEmpty;
    function first2(iterable) {
      return iterable[Symbol.iterator]().next().value;
    }
    Iterable.first = first2;
    function some(iterable, predicate) {
      let i = 0;
      for (const element of iterable) {
        if (predicate(element, i++)) {
          return true;
        }
      }
      return false;
    }
    Iterable.some = some;
    function every(iterable, predicate) {
      let i = 0;
      for (const element of iterable) {
        if (!predicate(element, i++)) {
          return false;
        }
      }
      return true;
    }
    Iterable.every = every;
    function find(iterable, predicate) {
      for (const element of iterable) {
        if (predicate(element)) {
          return element;
        }
      }
      return void 0;
    }
    Iterable.find = find;
    function* filter(iterable, predicate) {
      for (const element of iterable) {
        if (predicate(element)) {
          yield element;
        }
      }
    }
    Iterable.filter = filter;
    function* map(iterable, fn) {
      let index = 0;
      for (const element of iterable) {
        yield fn(element, index++);
      }
    }
    Iterable.map = map;
    function* flatMap(iterable, fn) {
      let index = 0;
      for (const element of iterable) {
        yield* fn(element, index++);
      }
    }
    Iterable.flatMap = flatMap;
    function* concat(...iterables) {
      for (const item of iterables) {
        if (isIterable(item)) {
          yield* item;
        } else {
          yield item;
        }
      }
    }
    Iterable.concat = concat;
    function reduce(iterable, reducer, initialValue) {
      let value = initialValue;
      for (const element of iterable) {
        value = reducer(value, element);
      }
      return value;
    }
    Iterable.reduce = reduce;
    function length(iterable) {
      let count = 0;
      for (const _ of iterable) {
        count++;
      }
      return count;
    }
    Iterable.length = length;
    function* slice(arr, from2, to = arr.length) {
      if (from2 < -arr.length) {
        from2 = 0;
      }
      if (from2 < 0) {
        from2 += arr.length;
      }
      if (to < 0) {
        to += arr.length;
      } else if (to > arr.length) {
        to = arr.length;
      }
      for (; from2 < to; from2++) {
        yield arr[from2];
      }
    }
    Iterable.slice = slice;
    function consume(iterable, atMost = Number.POSITIVE_INFINITY) {
      const consumed = [];
      if (atMost === 0) {
        return [consumed, iterable];
      }
      const iterator = iterable[Symbol.iterator]();
      for (let i = 0; i < atMost; i++) {
        const next = iterator.next();
        if (next.done) {
          return [consumed, Iterable.empty()];
        }
        consumed.push(next.value);
      }
      return [consumed, { [Symbol.iterator]() {
        return iterator;
      } }];
    }
    Iterable.consume = consume;
    async function asyncToArray(iterable) {
      const result = [];
      for await (const item of iterable) {
        result.push(item);
      }
      return result;
    }
    Iterable.asyncToArray = asyncToArray;
    async function asyncToArrayFlat(iterable) {
      let result = [];
      for await (const item of iterable) {
        result = result.concat(item);
      }
      return result;
    }
    Iterable.asyncToArrayFlat = asyncToArrayFlat;
  })(exports.Iterable || (exports.Iterable = {}));
  function setParentOfDisposable(child, parent) {
  }
  function markAsSingleton(singleton) {
    return singleton;
  }
  function isDisposable(thing) {
    return typeof thing === "object" && thing !== null && typeof thing.dispose === "function" && thing.dispose.length === 0;
  }
  function dispose(arg) {
    if (exports.Iterable.is(arg)) {
      const errors = [];
      for (const d of arg) {
        if (d) {
          try {
            d.dispose();
          } catch (e) {
            errors.push(e);
          }
        }
      }
      if (errors.length === 1) {
        throw errors[0];
      } else if (errors.length > 1) {
        throw new AggregateError(errors, "Encountered errors while disposing of store");
      }
      return Array.isArray(arg) ? [] : arg;
    } else if (arg) {
      arg.dispose();
      return arg;
    }
  }
  function combinedDisposable(...disposables) {
    const parent = toDisposable(() => dispose(disposables));
    return parent;
  }
  class FunctionDisposable {
    constructor(fn) {
      this._isDisposed = false;
      this._fn = fn;
    }
    dispose() {
      if (this._isDisposed) {
        return;
      }
      if (!this._fn) {
        throw new Error(`Unbound disposable context: Need to use an arrow function to preserve the value of this`);
      }
      this._isDisposed = true;
      this._fn();
    }
  }
  function toDisposable(fn) {
    return new FunctionDisposable(fn);
  }
  const _DisposableStore = class _DisposableStore {
    constructor() {
      this._toDispose = /* @__PURE__ */ new Set();
      this._isDisposed = false;
    }
    /**
     * Dispose of all registered disposables and mark this object as disposed.
     *
     * Any future disposables added to this object will be disposed of on `add`.
     */
    dispose() {
      if (this._isDisposed) {
        return;
      }
      this._isDisposed = true;
      this.clear();
    }
    /**
     * @return `true` if this object has been disposed of.
     */
    get isDisposed() {
      return this._isDisposed;
    }
    /**
     * Dispose of all registered disposables but do not mark this object as disposed.
     */
    clear() {
      if (this._toDispose.size === 0) {
        return;
      }
      try {
        dispose(this._toDispose);
      } finally {
        this._toDispose.clear();
      }
    }
    /**
     * Add a new {@link IDisposable disposable} to the collection.
     */
    add(o) {
      if (!o || o === Disposable.None) {
        return o;
      }
      if (o === this) {
        throw new Error("Cannot register a disposable on itself!");
      }
      if (this._isDisposed) {
        if (!_DisposableStore.DISABLE_DISPOSED_WARNING) {
          console.warn(new Error("Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!").stack);
        }
      } else {
        this._toDispose.add(o);
      }
      return o;
    }
    /**
     * Deletes a disposable from store and disposes of it. This will not throw or warn and proceed to dispose the
     * disposable even when the disposable is not part in the store.
     */
    delete(o) {
      if (!o) {
        return;
      }
      if (o === this) {
        throw new Error("Cannot dispose a disposable on itself!");
      }
      this._toDispose.delete(o);
      o.dispose();
    }
  };
  _DisposableStore.DISABLE_DISPOSED_WARNING = false;
  let DisposableStore = _DisposableStore;
  const _Disposable = class _Disposable {
    constructor() {
      this._store = new DisposableStore();
      setParentOfDisposable(this._store);
    }
    dispose() {
      this._store.dispose();
    }
    /**
     * Adds `o` to the collection of disposables managed by this object.
     */
    _register(o) {
      if (o === this) {
        throw new Error("Cannot register a disposable on itself!");
      }
      return this._store.add(o);
    }
  };
  _Disposable.None = Object.freeze({ dispose() {
  } });
  let Disposable = _Disposable;
  class MutableDisposable {
    constructor() {
      this._isDisposed = false;
    }
    /**
     * Get the currently held disposable value, or `undefined` if this MutableDisposable has been disposed
     */
    get value() {
      return this._isDisposed ? void 0 : this._value;
    }
    /**
     * Set a new disposable value.
     *
     * Behaviour:
     * - If the MutableDisposable has been disposed, the setter is a no-op.
     * - If the new value is strictly equal to the current value, the setter is a no-op.
     * - Otherwise the previous value (if any) is disposed and the new value is stored.
     *
     * Related helpers:
     * - clear() resets the value to `undefined` (and disposes the previous value).
     * - clearAndLeak() returns the old value without disposing it and removes its parent.
     */
    set value(value) {
      if (this._isDisposed || value === this._value) {
        return;
      }
      this._value?.dispose();
      this._value = value;
    }
    /**
     * Resets the stored value and disposed of the previously stored value.
     */
    clear() {
      this.value = void 0;
    }
    dispose() {
      this._isDisposed = true;
      this._value?.dispose();
      this._value = void 0;
    }
  }
  class RefCountedDisposable {
    constructor(_disposable) {
      this._disposable = _disposable;
      this._counter = 1;
    }
    acquire() {
      this._counter++;
      return this;
    }
    release() {
      if (--this._counter === 0) {
        this._disposable.dispose();
      }
      return this;
    }
  }
  class ImmortalReference {
    constructor(object) {
      this.object = object;
    }
    dispose() {
    }
  }
  class DisposableMap {
    constructor(store = /* @__PURE__ */ new Map()) {
      this._isDisposed = false;
      this._store = store;
    }
    /**
     * Disposes of all stored values and mark this object as disposed.
     *
     * Trying to use this object after it has been disposed of is an error.
     */
    dispose() {
      this._isDisposed = true;
      this.clearAndDisposeAll();
    }
    /**
     * Disposes of all stored values and clear the map, but DO NOT mark this object as disposed.
     */
    clearAndDisposeAll() {
      if (!this._store.size) {
        return;
      }
      try {
        dispose(this._store.values());
      } finally {
        this._store.clear();
      }
    }
    get(key) {
      return this._store.get(key);
    }
    set(key, value, skipDisposeOnOverwrite = false) {
      if (this._isDisposed) {
        console.warn(new Error("Trying to add a disposable to a DisposableMap that has already been disposed of. The added object will be leaked!").stack);
      }
      if (!skipDisposeOnOverwrite) {
        this._store.get(key)?.dispose();
      }
      this._store.set(key, value);
    }
    /**
     * Delete the value stored for `key` from this map and also dispose of it.
     */
    deleteAndDispose(key) {
      this._store.get(key)?.dispose();
      this._store.delete(key);
    }
    keys() {
      return this._store.keys();
    }
    values() {
      return this._store.values();
    }
    [Symbol.iterator]() {
      return this._store[Symbol.iterator]();
    }
  }
  const _Node = class _Node {
    constructor(element) {
      this.element = element;
      this.next = _Node.Undefined;
      this.prev = _Node.Undefined;
    }
  };
  _Node.Undefined = new _Node(void 0);
  let Node = _Node;
  class LinkedList {
    constructor() {
      this._first = Node.Undefined;
      this._last = Node.Undefined;
      this._size = 0;
    }
    get size() {
      return this._size;
    }
    isEmpty() {
      return this._first === Node.Undefined;
    }
    clear() {
      let node = this._first;
      while (node !== Node.Undefined) {
        const next = node.next;
        node.prev = Node.Undefined;
        node.next = Node.Undefined;
        node = next;
      }
      this._first = Node.Undefined;
      this._last = Node.Undefined;
      this._size = 0;
    }
    unshift(element) {
      return this._insert(element, false);
    }
    push(element) {
      return this._insert(element, true);
    }
    _insert(element, atTheEnd) {
      const newNode = new Node(element);
      if (this._first === Node.Undefined) {
        this._first = newNode;
        this._last = newNode;
      } else if (atTheEnd) {
        const oldLast = this._last;
        this._last = newNode;
        newNode.prev = oldLast;
        oldLast.next = newNode;
      } else {
        const oldFirst = this._first;
        this._first = newNode;
        newNode.next = oldFirst;
        oldFirst.prev = newNode;
      }
      this._size += 1;
      let didRemove = false;
      return () => {
        if (!didRemove) {
          didRemove = true;
          this._remove(newNode);
        }
      };
    }
    shift() {
      if (this._first === Node.Undefined) {
        return void 0;
      } else {
        const res = this._first.element;
        this._remove(this._first);
        return res;
      }
    }
    pop() {
      if (this._last === Node.Undefined) {
        return void 0;
      } else {
        const res = this._last.element;
        this._remove(this._last);
        return res;
      }
    }
    _remove(node) {
      if (node.prev !== Node.Undefined && node.next !== Node.Undefined) {
        const anchor = node.prev;
        anchor.next = node.next;
        node.next.prev = anchor;
      } else if (node.prev === Node.Undefined && node.next === Node.Undefined) {
        this._first = Node.Undefined;
        this._last = Node.Undefined;
      } else if (node.next === Node.Undefined) {
        this._last = this._last.prev;
        this._last.next = Node.Undefined;
      } else if (node.prev === Node.Undefined) {
        this._first = this._first.next;
        this._first.prev = Node.Undefined;
      }
      this._size -= 1;
    }
    *[Symbol.iterator]() {
      let node = this._first;
      while (node !== Node.Undefined) {
        yield node.element;
        node = node.next;
      }
    }
  }
  const performanceNow = globalThis.performance.now.bind(globalThis.performance);
  class StopWatch {
    static create(highResolution) {
      return new StopWatch(highResolution);
    }
    constructor(highResolution) {
      this._now = highResolution === false ? Date.now : performanceNow;
      this._startTime = this._now();
      this._stopTime = -1;
    }
    stop() {
      this._stopTime = this._now();
    }
    reset() {
      this._startTime = this._now();
      this._stopTime = -1;
    }
    elapsed() {
      if (this._stopTime !== -1) {
        return this._stopTime - this._startTime;
      }
      return this._now() - this._startTime;
    }
  }
  exports.Event = void 0;
  (function(Event) {
    Event.None = () => Disposable.None;
    function defer(event, flushOnListenerRemove, disposable) {
      return debounce(event, () => void 0, 0, void 0, flushOnListenerRemove ?? true, void 0, disposable);
    }
    Event.defer = defer;
    function once(event) {
      return (listener, thisArgs = null, disposables) => {
        let didFire = false;
        let result = void 0;
        result = event((e) => {
          if (didFire) {
            return;
          } else if (result) {
            result.dispose();
          } else {
            didFire = true;
          }
          return listener.call(thisArgs, e);
        }, null, disposables);
        if (didFire) {
          result.dispose();
        }
        return result;
      };
    }
    Event.once = once;
    function onceIf(event, condition) {
      return Event.once(Event.filter(event, condition));
    }
    Event.onceIf = onceIf;
    function map(event, map2, disposable) {
      return snapshot((listener, thisArgs = null, disposables) => event((i) => listener.call(thisArgs, map2(i)), null, disposables), disposable);
    }
    Event.map = map;
    function forEach(event, each, disposable) {
      return snapshot((listener, thisArgs = null, disposables) => event((i) => {
        each(i);
        listener.call(thisArgs, i);
      }, null, disposables), disposable);
    }
    Event.forEach = forEach;
    function filter(event, filter2, disposable) {
      return snapshot((listener, thisArgs = null, disposables) => event((e) => filter2(e) && listener.call(thisArgs, e), null, disposables), disposable);
    }
    Event.filter = filter;
    function signal(event) {
      return event;
    }
    Event.signal = signal;
    function any(...events) {
      return (listener, thisArgs = null, disposables) => {
        const disposable = combinedDisposable(...events.map((event) => event((e) => listener.call(thisArgs, e))));
        return addAndReturnDisposable(disposable, disposables);
      };
    }
    Event.any = any;
    function reduce(event, merge, initial, disposable) {
      let output = initial;
      return map(event, (e) => {
        output = merge(output, e);
        return output;
      }, disposable);
    }
    Event.reduce = reduce;
    function snapshot(event, disposable) {
      let listener;
      const options = {
        onWillAddFirstListener() {
          listener = event(emitter.fire, emitter);
        },
        onDidRemoveLastListener() {
          listener?.dispose();
        }
      };
      const emitter = new Emitter(options);
      disposable?.add(emitter);
      return emitter.event;
    }
    function addAndReturnDisposable(d, store) {
      if (store instanceof Array) {
        store.push(d);
      } else if (store) {
        store.add(d);
      }
      return d;
    }
    function debounce(event, merge, delay = 100, leading = false, flushOnListenerRemove = false, leakWarningThreshold, disposable) {
      let subscription;
      let output = void 0;
      let handle = void 0;
      let numDebouncedCalls = 0;
      let doFire;
      const options = {
        leakWarningThreshold,
        onWillAddFirstListener() {
          subscription = event((cur) => {
            numDebouncedCalls++;
            output = merge(output, cur);
            if (leading && !handle) {
              emitter.fire(output);
              output = void 0;
            }
            doFire = () => {
              const _output = output;
              output = void 0;
              handle = void 0;
              if (!leading || numDebouncedCalls > 1) {
                emitter.fire(_output);
              }
              numDebouncedCalls = 0;
            };
            if (typeof delay === "number") {
              if (handle) {
                clearTimeout(handle);
              }
              handle = setTimeout(doFire, delay);
            } else {
              if (handle === void 0) {
                handle = null;
                queueMicrotask(doFire);
              }
            }
          });
        },
        onWillRemoveListener() {
          if (flushOnListenerRemove && numDebouncedCalls > 0) {
            doFire?.();
          }
        },
        onDidRemoveLastListener() {
          doFire = void 0;
          subscription.dispose();
        }
      };
      const emitter = new Emitter(options);
      disposable?.add(emitter);
      return emitter.event;
    }
    Event.debounce = debounce;
    function accumulate(event, delay = 0, flushOnListenerRemove, disposable) {
      return Event.debounce(event, (last, e) => {
        if (!last) {
          return [e];
        }
        last.push(e);
        return last;
      }, delay, void 0, flushOnListenerRemove ?? true, void 0, disposable);
    }
    Event.accumulate = accumulate;
    function throttle(event, merge, delay = 100, leading = true, trailing = true, leakWarningThreshold, disposable) {
      let subscription;
      let output = void 0;
      let handle = void 0;
      let numThrottledCalls = 0;
      const options = {
        leakWarningThreshold,
        onWillAddFirstListener() {
          subscription = event((cur) => {
            numThrottledCalls++;
            output = merge(output, cur);
            if (handle === void 0) {
              if (leading) {
                emitter.fire(output);
                output = void 0;
                numThrottledCalls = 0;
              }
              if (typeof delay === "number") {
                handle = setTimeout(() => {
                  if (trailing && numThrottledCalls > 0) {
                    emitter.fire(output);
                  }
                  output = void 0;
                  handle = void 0;
                  numThrottledCalls = 0;
                }, delay);
              } else {
                handle = 0;
                queueMicrotask(() => {
                  if (trailing && numThrottledCalls > 0) {
                    emitter.fire(output);
                  }
                  output = void 0;
                  handle = void 0;
                  numThrottledCalls = 0;
                });
              }
            }
          });
        },
        onDidRemoveLastListener() {
          subscription.dispose();
        }
      };
      const emitter = new Emitter(options);
      disposable?.add(emitter);
      return emitter.event;
    }
    Event.throttle = throttle;
    function latch(event, equals2 = (a, b) => a === b, disposable) {
      let firstCall = true;
      let cache;
      return filter(event, (value) => {
        const shouldEmit = firstCall || !equals2(value, cache);
        firstCall = false;
        cache = value;
        return shouldEmit;
      }, disposable);
    }
    Event.latch = latch;
    function split(event, isT, disposable) {
      return [
        Event.filter(event, isT, disposable),
        Event.filter(event, (e) => !isT(e), disposable)
      ];
    }
    Event.split = split;
    function buffer(event, flushAfterTimeout = false, _buffer = [], disposable) {
      let buffer2 = _buffer.slice();
      let listener = event((e) => {
        if (buffer2) {
          buffer2.push(e);
        } else {
          emitter.fire(e);
        }
      });
      if (disposable) {
        disposable.add(listener);
      }
      const flush = () => {
        buffer2?.forEach((e) => emitter.fire(e));
        buffer2 = null;
      };
      const emitter = new Emitter({
        onWillAddFirstListener() {
          if (!listener) {
            listener = event((e) => emitter.fire(e));
            if (disposable) {
              disposable.add(listener);
            }
          }
        },
        onDidAddFirstListener() {
          if (buffer2) {
            if (flushAfterTimeout) {
              setTimeout(flush);
            } else {
              flush();
            }
          }
        },
        onDidRemoveLastListener() {
          if (listener) {
            listener.dispose();
          }
          listener = null;
        }
      });
      if (disposable) {
        disposable.add(emitter);
      }
      return emitter.event;
    }
    Event.buffer = buffer;
    function chain(event, sythensize) {
      const fn = (listener, thisArgs, disposables) => {
        const cs = sythensize(new ChainableSynthesis());
        return event(function(value) {
          const result = cs.evaluate(value);
          if (result !== HaltChainable) {
            listener.call(thisArgs, result);
          }
        }, void 0, disposables);
      };
      return fn;
    }
    Event.chain = chain;
    const HaltChainable = /* @__PURE__ */ Symbol("HaltChainable");
    class ChainableSynthesis {
      constructor() {
        this.steps = [];
      }
      map(fn) {
        this.steps.push(fn);
        return this;
      }
      forEach(fn) {
        this.steps.push((v) => {
          fn(v);
          return v;
        });
        return this;
      }
      filter(fn) {
        this.steps.push((v) => fn(v) ? v : HaltChainable);
        return this;
      }
      reduce(merge, initial) {
        let last = initial;
        this.steps.push((v) => {
          last = merge(last, v);
          return last;
        });
        return this;
      }
      latch(equals2 = (a, b) => a === b) {
        let firstCall = true;
        let cache;
        this.steps.push((value) => {
          const shouldEmit = firstCall || !equals2(value, cache);
          firstCall = false;
          cache = value;
          return shouldEmit ? value : HaltChainable;
        });
        return this;
      }
      evaluate(value) {
        for (const step of this.steps) {
          value = step(value);
          if (value === HaltChainable) {
            break;
          }
        }
        return value;
      }
    }
    function fromNodeEventEmitter(emitter, eventName, map2 = (id) => id) {
      const fn = (...args) => result.fire(map2(...args));
      const onFirstListenerAdd = () => emitter.on(eventName, fn);
      const onLastListenerRemove = () => emitter.removeListener(eventName, fn);
      const result = new Emitter({ onWillAddFirstListener: onFirstListenerAdd, onDidRemoveLastListener: onLastListenerRemove });
      return result.event;
    }
    Event.fromNodeEventEmitter = fromNodeEventEmitter;
    function fromDOMEventEmitter(emitter, eventName, map2 = (id) => id) {
      const fn = (...args) => result.fire(map2(...args));
      const onFirstListenerAdd = () => emitter.addEventListener(eventName, fn);
      const onLastListenerRemove = () => emitter.removeEventListener(eventName, fn);
      const result = new Emitter({ onWillAddFirstListener: onFirstListenerAdd, onDidRemoveLastListener: onLastListenerRemove });
      return result.event;
    }
    Event.fromDOMEventEmitter = fromDOMEventEmitter;
    function toPromise(event, disposables) {
      let cancelRef;
      let listener;
      const promise = new Promise((resolve2) => {
        listener = once(event)(resolve2);
        addToDisposables(listener, disposables);
        cancelRef = () => {
          disposeAndRemove(listener, disposables);
        };
      });
      promise.cancel = cancelRef;
      if (disposables) {
        promise.finally(() => disposeAndRemove(listener, disposables));
      }
      return promise;
    }
    Event.toPromise = toPromise;
    function forward(from, to) {
      return from((e) => to.fire(e));
    }
    Event.forward = forward;
    function runAndSubscribe(event, handler, initial) {
      handler(initial);
      return event((e) => handler(e));
    }
    Event.runAndSubscribe = runAndSubscribe;
    class EmitterObserver {
      constructor(_observable, store) {
        this._observable = _observable;
        this._counter = 0;
        this._hasChanged = false;
        const options = {
          onWillAddFirstListener: () => {
            _observable.addObserver(this);
            this._observable.reportChanges();
          },
          onDidRemoveLastListener: () => {
            _observable.removeObserver(this);
          }
        };
        this.emitter = new Emitter(options);
        if (store) {
          store.add(this.emitter);
        }
      }
      beginUpdate(_observable) {
        this._counter++;
      }
      handlePossibleChange(_observable) {
      }
      handleChange(_observable, _change) {
        this._hasChanged = true;
      }
      endUpdate(_observable) {
        this._counter--;
        if (this._counter === 0) {
          this._observable.reportChanges();
          if (this._hasChanged) {
            this._hasChanged = false;
            this.emitter.fire(this._observable.get());
          }
        }
      }
    }
    function fromObservable(obs, store) {
      const observer = new EmitterObserver(obs, store);
      return observer.emitter.event;
    }
    Event.fromObservable = fromObservable;
    function fromObservableLight(observable) {
      return (listener, thisArgs, disposables) => {
        let count = 0;
        let didChange = false;
        const observer = {
          beginUpdate() {
            count++;
          },
          endUpdate() {
            count--;
            if (count === 0) {
              observable.reportChanges();
              if (didChange) {
                didChange = false;
                listener.call(thisArgs);
              }
            }
          },
          handlePossibleChange() {
          },
          handleChange() {
            didChange = true;
          }
        };
        observable.addObserver(observer);
        observable.reportChanges();
        const disposable = {
          dispose() {
            observable.removeObserver(observer);
          }
        };
        addToDisposables(disposable, disposables);
        return disposable;
      };
    }
    Event.fromObservableLight = fromObservableLight;
  })(exports.Event || (exports.Event = {}));
  const _EventProfiling = class _EventProfiling {
    constructor(name) {
      this.listenerCount = 0;
      this.invocationCount = 0;
      this.elapsedOverall = 0;
      this.durations = [];
      this.name = `${name}_${_EventProfiling._idPool++}`;
      _EventProfiling.all.add(this);
    }
    start(listenerCount) {
      this._stopWatch = new StopWatch();
      this.listenerCount = listenerCount;
    }
    stop() {
      if (this._stopWatch) {
        const elapsed = this._stopWatch.elapsed();
        this.durations.push(elapsed);
        this.elapsedOverall += elapsed;
        this.invocationCount += 1;
        this._stopWatch = void 0;
      }
    }
  };
  _EventProfiling.all = /* @__PURE__ */ new Set();
  _EventProfiling._idPool = 0;
  let EventProfiling = _EventProfiling;
  let _globalLeakWarningThreshold = -1;
  const _LeakageMonitor = class _LeakageMonitor {
    constructor(_errorHandler, threshold, name = (_LeakageMonitor._idPool++).toString(16).padStart(3, "0")) {
      this._errorHandler = _errorHandler;
      this.threshold = threshold;
      this.name = name;
      this._warnCountdown = 0;
    }
    dispose() {
      this._stacks?.clear();
    }
    check(stack, listenerCount) {
      const threshold = this.threshold;
      if (threshold <= 0 || listenerCount < threshold) {
        return void 0;
      }
      if (!this._stacks) {
        this._stacks = /* @__PURE__ */ new Map();
      }
      const count = this._stacks.get(stack.value) || 0;
      this._stacks.set(stack.value, count + 1);
      this._warnCountdown -= 1;
      if (this._warnCountdown <= 0) {
        this._warnCountdown = threshold * 0.5;
        const [topStack, topCount] = this.getMostFrequentStack();
        const message = `[${this.name}] potential listener LEAK detected, having ${listenerCount} listeners already. MOST frequent listener (${topCount}):`;
        console.warn(message);
        console.warn(topStack);
        const error = new ListenerLeakError(message, topStack);
        this._errorHandler(error);
      }
      return () => {
        const count2 = this._stacks.get(stack.value) || 0;
        this._stacks.set(stack.value, count2 - 1);
      };
    }
    getMostFrequentStack() {
      if (!this._stacks) {
        return void 0;
      }
      let topStack;
      let topCount = 0;
      for (const [stack, count] of this._stacks) {
        if (!topStack || topCount < count) {
          topStack = [stack, count];
          topCount = count;
        }
      }
      return topStack;
    }
  };
  _LeakageMonitor._idPool = 1;
  let LeakageMonitor = _LeakageMonitor;
  class Stacktrace {
    static create() {
      const err = new Error();
      return new Stacktrace(err.stack ?? "");
    }
    constructor(value) {
      this.value = value;
    }
    print() {
      console.warn(this.value.split("\n").slice(2).join("\n"));
    }
  }
  class ListenerLeakError extends Error {
    constructor(message, stack) {
      super(message);
      this.name = "ListenerLeakError";
      this.stack = stack;
    }
  }
  class ListenerRefusalError extends Error {
    constructor(message, stack) {
      super(message);
      this.name = "ListenerRefusalError";
      this.stack = stack;
    }
  }
  class UniqueContainer {
    constructor(value) {
      this.value = value;
    }
  }
  const compactionThreshold = 2;
  class Emitter {
    constructor(options) {
      this._size = 0;
      this._options = options;
      this._leakageMon = this._options?.leakWarningThreshold ? new LeakageMonitor(options?.onListenerError ?? onUnexpectedError, this._options?.leakWarningThreshold ?? _globalLeakWarningThreshold) : void 0;
      this._perfMon = this._options?._profName ? new EventProfiling(this._options._profName) : void 0;
      this._deliveryQueue = this._options?.deliveryQueue;
    }
    dispose() {
      if (!this._disposed) {
        this._disposed = true;
        if (this._deliveryQueue?.current === this) {
          this._deliveryQueue.reset();
        }
        if (this._listeners) {
          this._listeners = void 0;
          this._size = 0;
        }
        this._options?.onDidRemoveLastListener?.();
        this._leakageMon?.dispose();
      }
    }
    /**
     * For the public to allow to subscribe
     * to events from this Emitter
     */
    get event() {
      this._event ??= (callback, thisArgs, disposables) => {
        if (this._leakageMon && this._size > this._leakageMon.threshold ** 2) {
          const message = `[${this._leakageMon.name}] REFUSES to accept new listeners because it exceeded its threshold by far (${this._size} vs ${this._leakageMon.threshold})`;
          console.warn(message);
          const tuple = this._leakageMon.getMostFrequentStack() ?? ["UNKNOWN stack", -1];
          const error = new ListenerRefusalError(`${message}. HINT: Stack shows most frequent listener (${tuple[1]}-times)`, tuple[0]);
          const errorHandler2 = this._options?.onListenerError || onUnexpectedError;
          errorHandler2(error);
          return Disposable.None;
        }
        if (this._disposed) {
          return Disposable.None;
        }
        if (thisArgs) {
          callback = callback.bind(thisArgs);
        }
        const contained = new UniqueContainer(callback);
        let removeMonitor;
        if (this._leakageMon && this._size >= Math.ceil(this._leakageMon.threshold * 0.2)) {
          contained.stack = Stacktrace.create();
          removeMonitor = this._leakageMon.check(contained.stack, this._size + 1);
        }
        if (!this._listeners) {
          this._options?.onWillAddFirstListener?.(this);
          this._listeners = contained;
          this._options?.onDidAddFirstListener?.(this);
        } else if (this._listeners instanceof UniqueContainer) {
          this._deliveryQueue ??= new EventDeliveryQueuePrivate();
          this._listeners = [this._listeners, contained];
        } else {
          this._listeners.push(contained);
        }
        this._options?.onDidAddListener?.(this);
        this._size++;
        const result = toDisposable(() => {
          removeMonitor?.();
          this._removeListener(contained);
        });
        addToDisposables(result, disposables);
        return result;
      };
      return this._event;
    }
    _removeListener(listener) {
      this._options?.onWillRemoveListener?.(this);
      if (!this._listeners) {
        return;
      }
      if (this._size === 1) {
        this._listeners = void 0;
        this._options?.onDidRemoveLastListener?.(this);
        this._size = 0;
        return;
      }
      const listeners = this._listeners;
      const index = listeners.indexOf(listener);
      if (index === -1) {
        console.log("disposed?", this._disposed);
        console.log("size?", this._size);
        console.log("arr?", JSON.stringify(this._listeners));
        throw new Error("Attempted to dispose unknown listener");
      }
      this._size--;
      listeners[index] = void 0;
      const adjustDeliveryQueue = this._deliveryQueue.current === this;
      if (this._size * compactionThreshold <= listeners.length) {
        let n = 0;
        for (let i = 0; i < listeners.length; i++) {
          if (listeners[i]) {
            listeners[n++] = listeners[i];
          } else if (adjustDeliveryQueue && n < this._deliveryQueue.end) {
            this._deliveryQueue.end--;
            if (n < this._deliveryQueue.i) {
              this._deliveryQueue.i--;
            }
          }
        }
        listeners.length = n;
      }
    }
    _deliver(listener, value) {
      if (!listener) {
        return;
      }
      const errorHandler2 = this._options?.onListenerError || onUnexpectedError;
      if (!errorHandler2) {
        listener.value(value);
        return;
      }
      try {
        listener.value(value);
      } catch (e) {
        errorHandler2(e);
      }
    }
    /** Delivers items in the queue. Assumes the queue is ready to go. */
    _deliverQueue(dq) {
      const listeners = dq.current._listeners;
      while (dq.i < dq.end) {
        this._deliver(listeners[dq.i++], dq.value);
      }
      dq.reset();
    }
    /**
     * To be kept private to fire an event to
     * subscribers
     */
    fire(event) {
      if (this._deliveryQueue?.current) {
        this._deliverQueue(this._deliveryQueue);
        this._perfMon?.stop();
      }
      this._perfMon?.start(this._size);
      if (!this._listeners) ;
      else if (this._listeners instanceof UniqueContainer) {
        this._deliver(this._listeners, event);
      } else {
        const dq = this._deliveryQueue;
        dq.enqueue(this, event, this._listeners.length);
        this._deliverQueue(dq);
      }
      this._perfMon?.stop();
    }
    hasListeners() {
      return this._size > 0;
    }
  }
  const createEventDeliveryQueue = () => new EventDeliveryQueuePrivate();
  class EventDeliveryQueuePrivate {
    constructor() {
      this.i = -1;
      this.end = 0;
    }
    enqueue(emitter, value, end) {
      this.i = 0;
      this.end = end;
      this.current = emitter;
      this.value = value;
    }
    reset() {
      this.i = this.end;
      this.current = void 0;
      this.value = void 0;
    }
  }
  class PauseableEmitter extends Emitter {
    constructor(options) {
      super(options);
      this._isPaused = 0;
      this._eventQueue = new LinkedList();
      this._mergeFn = options?.merge;
    }
    pause() {
      this._isPaused++;
    }
    resume() {
      if (this._isPaused !== 0 && --this._isPaused === 0) {
        if (this._mergeFn) {
          if (this._eventQueue.size > 0) {
            const events = Array.from(this._eventQueue);
            this._eventQueue.clear();
            super.fire(this._mergeFn(events));
          }
        } else {
          while (!this._isPaused && this._eventQueue.size !== 0) {
            super.fire(this._eventQueue.shift());
          }
        }
      }
    }
    fire(event) {
      if (this._size) {
        if (this._isPaused !== 0) {
          this._eventQueue.push(event);
        } else {
          super.fire(event);
        }
      }
    }
  }
  class DebounceEmitter extends PauseableEmitter {
    constructor(options) {
      super(options);
      this._delay = options.delay ?? 100;
    }
    fire(event) {
      if (!this._handle) {
        this.pause();
        this._handle = setTimeout(() => {
          this._handle = void 0;
          this.resume();
        }, this._delay);
      }
      super.fire(event);
    }
  }
  class MicrotaskEmitter extends Emitter {
    constructor(options) {
      super(options);
      this._queuedEvents = [];
      this._mergeFn = options?.merge;
    }
    fire(event) {
      if (!this.hasListeners()) {
        return;
      }
      this._queuedEvents.push(event);
      if (this._queuedEvents.length === 1) {
        queueMicrotask(() => {
          if (this._mergeFn) {
            super.fire(this._mergeFn(this._queuedEvents));
          } else {
            this._queuedEvents.forEach((e) => super.fire(e));
          }
          this._queuedEvents = [];
        });
      }
    }
  }
  class EventMultiplexer {
    constructor() {
      this.hasListeners = false;
      this.events = [];
      this.emitter = new Emitter({
        onWillAddFirstListener: () => this.onFirstListenerAdd(),
        onDidRemoveLastListener: () => this.onLastListenerRemove()
      });
    }
    get event() {
      return this.emitter.event;
    }
    add(event) {
      const e = { event, listener: null };
      this.events.push(e);
      if (this.hasListeners) {
        this.hook(e);
      }
      const dispose2 = () => {
        if (this.hasListeners) {
          this.unhook(e);
        }
        const idx = this.events.indexOf(e);
        this.events.splice(idx, 1);
      };
      return toDisposable(createSingleCallFunction(dispose2));
    }
    onFirstListenerAdd() {
      this.hasListeners = true;
      this.events.forEach((e) => this.hook(e));
    }
    onLastListenerRemove() {
      this.hasListeners = false;
      this.events.forEach((e) => this.unhook(e));
    }
    hook(e) {
      e.listener = e.event((r) => this.emitter.fire(r));
    }
    unhook(e) {
      e.listener?.dispose();
      e.listener = null;
    }
    dispose() {
      this.emitter.dispose();
      for (const e of this.events) {
        e.listener?.dispose();
      }
      this.events = [];
    }
  }
  class EventBufferer {
    constructor() {
      this.data = [];
    }
    wrapEvent(event, reduce, initial) {
      return (listener, thisArgs, disposables) => {
        return event((i) => {
          const data = this.data[this.data.length - 1];
          if (!reduce) {
            if (data) {
              data.buffers.push(() => listener.call(thisArgs, i));
            } else {
              listener.call(thisArgs, i);
            }
            return;
          }
          const reduceData = data;
          if (!reduceData) {
            listener.call(thisArgs, reduce(initial, i));
            return;
          }
          reduceData.items ??= [];
          reduceData.items.push(i);
          if (reduceData.buffers.length === 0) {
            data.buffers.push(() => {
              reduceData.reducedResult ??= initial ? reduceData.items.reduce(reduce, initial) : reduceData.items.reduce(reduce);
              listener.call(thisArgs, reduceData.reducedResult);
            });
          }
        }, void 0, disposables);
      };
    }
    bufferEvents(fn) {
      const data = { buffers: new Array() };
      this.data.push(data);
      const r = fn();
      this.data.pop();
      data.buffers.forEach((flush) => flush());
      return r;
    }
  }
  class Relay {
    constructor() {
      this.listening = false;
      this.inputEvent = exports.Event.None;
      this.inputEventListener = Disposable.None;
      this.emitter = new Emitter({
        onDidAddFirstListener: () => {
          this.listening = true;
          this.inputEventListener = this.inputEvent(this.emitter.fire, this.emitter);
        },
        onDidRemoveLastListener: () => {
          this.listening = false;
          this.inputEventListener.dispose();
        }
      });
      this.event = this.emitter.event;
    }
    set input(event) {
      this.inputEvent = event;
      if (this.listening) {
        this.inputEventListener.dispose();
        this.inputEventListener = event(this.emitter.fire, this.emitter);
      }
    }
    dispose() {
      this.inputEventListener.dispose();
      this.emitter.dispose();
    }
  }
  function addToDisposables(result, disposables) {
    if (disposables instanceof DisposableStore) {
      disposables.add(result);
    } else if (Array.isArray(disposables)) {
      disposables.push(result);
    }
  }
  function disposeAndRemove(result, disposables) {
    if (disposables instanceof DisposableStore) {
      disposables.delete(result);
    } else if (Array.isArray(disposables)) {
      const index = disposables.indexOf(result);
      if (index !== -1) {
        disposables.splice(index, 1);
      }
    }
    result.dispose();
  }
  const USUAL_WORD_SEPARATORS = "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?";
  function createWordRegExp(allowInWords = "") {
    let source = "(-?\\d*\\.\\d\\w*)|([^";
    for (const sep2 of USUAL_WORD_SEPARATORS) {
      if (allowInWords.indexOf(sep2) >= 0) {
        continue;
      }
      source += "\\" + sep2;
    }
    source += "\\s]+)";
    return new RegExp(source, "g");
  }
  const DEFAULT_WORD_REGEXP = createWordRegExp();
  function ensureValidWordDefinition(wordDefinition) {
    let result = DEFAULT_WORD_REGEXP;
    if (wordDefinition && wordDefinition instanceof RegExp) {
      if (!wordDefinition.global) {
        let flags = "g";
        if (wordDefinition.ignoreCase) {
          flags += "i";
        }
        if (wordDefinition.multiline) {
          flags += "m";
        }
        if (wordDefinition.unicode) {
          flags += "u";
        }
        result = new RegExp(wordDefinition.source, flags);
      } else {
        result = wordDefinition;
      }
    }
    result.lastIndex = 0;
    return result;
  }
  const _defaultConfig = new LinkedList();
  _defaultConfig.unshift({
    maxLen: 1e3,
    windowSize: 15,
    timeBudget: 150
  });
  function getWordAtText(column, wordDefinition, text, textOffset, config) {
    wordDefinition = ensureValidWordDefinition(wordDefinition);
    if (!config) {
      config = exports.Iterable.first(_defaultConfig);
    }
    if (text.length > config.maxLen) {
      let start = column - config.maxLen / 2;
      if (start < 0) {
        start = 0;
      } else {
        textOffset += start;
      }
      text = text.substring(start, column + config.maxLen / 2);
      return getWordAtText(column, wordDefinition, text, textOffset, config);
    }
    const t1 = Date.now();
    const pos = column - 1 - textOffset;
    let prevRegexIndex = -1;
    let match = null;
    for (let i = 1; ; i++) {
      if (Date.now() - t1 >= config.timeBudget) {
        break;
      }
      const regexIndex = pos - config.windowSize * i;
      wordDefinition.lastIndex = Math.max(0, regexIndex);
      const thisMatch = _findRegexMatchEnclosingPosition(wordDefinition, text, pos, prevRegexIndex);
      if (!thisMatch && match) {
        break;
      }
      match = thisMatch;
      if (regexIndex <= 0) {
        break;
      }
      prevRegexIndex = regexIndex;
    }
    if (match) {
      const result = {
        word: match[0],
        startColumn: textOffset + 1 + match.index,
        endColumn: textOffset + 1 + match.index + match[0].length
      };
      wordDefinition.lastIndex = 0;
      return result;
    }
    return null;
  }
  function _findRegexMatchEnclosingPosition(wordDefinition, text, pos, stopPos) {
    let match;
    while (match = wordDefinition.exec(text)) {
      const matchIndex = match.index || 0;
      if (matchIndex <= pos && wordDefinition.lastIndex >= pos) {
        return match;
      } else if (stopPos > 0 && matchIndex > stopPos) {
        return null;
      }
    }
    return null;
  }
  const shortcutEvent = Object.freeze(function(callback, context) {
    const handle = setTimeout(callback.bind(context), 0);
    return { dispose() {
      clearTimeout(handle);
    } };
  });
  exports.CancellationToken = void 0;
  (function(CancellationToken) {
    function isCancellationToken(thing) {
      if (thing === CancellationToken.None || thing === CancellationToken.Cancelled) {
        return true;
      }
      if (thing instanceof MutableToken) {
        return true;
      }
      if (!thing || typeof thing !== "object") {
        return false;
      }
      return typeof thing.isCancellationRequested === "boolean" && typeof thing.onCancellationRequested === "function";
    }
    CancellationToken.isCancellationToken = isCancellationToken;
    CancellationToken.None = Object.freeze({
      isCancellationRequested: false,
      onCancellationRequested: exports.Event.None
    });
    CancellationToken.Cancelled = Object.freeze({
      isCancellationRequested: true,
      onCancellationRequested: shortcutEvent
    });
  })(exports.CancellationToken || (exports.CancellationToken = {}));
  class MutableToken {
    constructor() {
      this._isCancelled = false;
      this._emitter = null;
    }
    cancel() {
      if (!this._isCancelled) {
        this._isCancelled = true;
        if (this._emitter) {
          this._emitter.fire(void 0);
          this.dispose();
        }
      }
    }
    get isCancellationRequested() {
      return this._isCancelled;
    }
    get onCancellationRequested() {
      if (this._isCancelled) {
        return shortcutEvent;
      }
      if (!this._emitter) {
        this._emitter = new Emitter();
      }
      return this._emitter.event;
    }
    dispose() {
      if (this._emitter) {
        this._emitter.dispose();
        this._emitter = null;
      }
    }
  }
  class CancellationTokenSource {
    constructor(parent) {
      this._token = void 0;
      this._parentListener = void 0;
      this._parentListener = parent && parent.onCancellationRequested(this.cancel, this);
    }
    get token() {
      if (!this._token) {
        this._token = new MutableToken();
      }
      return this._token;
    }
    cancel() {
      if (!this._token) {
        this._token = exports.CancellationToken.Cancelled;
      } else if (this._token instanceof MutableToken) {
        this._token.cancel();
      }
    }
    dispose(cancel = false) {
      if (cancel) {
        this.cancel();
      }
      this._parentListener?.dispose();
      if (!this._token) {
        this._token = exports.CancellationToken.None;
      } else if (this._token instanceof MutableToken) {
        this._token.dispose();
      }
    }
  }
  function cancelOnDispose(store) {
    const source = new CancellationTokenSource();
    store.add({ dispose() {
      source.cancel();
    } });
    return source.token;
  }
  class KeyCodeStrMap {
    constructor() {
      this._keyCodeToStr = [];
      this._strToKeyCode = /* @__PURE__ */ Object.create(null);
    }
    define(keyCode, str) {
      this._keyCodeToStr[keyCode] = str;
      this._strToKeyCode[str.toLowerCase()] = keyCode;
    }
    keyCodeToStr(keyCode) {
      return this._keyCodeToStr[keyCode];
    }
    strToKeyCode(str) {
      return this._strToKeyCode[str.toLowerCase()] || 0;
    }
  }
  const uiMap = new KeyCodeStrMap();
  const userSettingsUSMap = new KeyCodeStrMap();
  const userSettingsGeneralMap = new KeyCodeStrMap();
  const EVENT_KEY_CODE_MAP = new Array(230);
  const scanCodeStrToInt = /* @__PURE__ */ Object.create(null);
  const scanCodeLowerCaseStrToInt = /* @__PURE__ */ Object.create(null);
  const IMMUTABLE_CODE_TO_KEY_CODE = [];
  for (let i = 0; i <= 193; i++) {
    IMMUTABLE_CODE_TO_KEY_CODE[i] = -1;
  }
  (function() {
    const empty = "";
    const mappings = [
      // immutable, scanCode, scanCodeStr, keyCode, keyCodeStr, eventKeyCode, vkey, usUserSettingsLabel, generalUserSettingsLabel
      [1, 0, "None", 0, "unknown", 0, "VK_UNKNOWN", empty, empty],
      [1, 1, "Hyper", 0, empty, 0, empty, empty, empty],
      [1, 2, "Super", 0, empty, 0, empty, empty, empty],
      [1, 3, "Fn", 0, empty, 0, empty, empty, empty],
      [1, 4, "FnLock", 0, empty, 0, empty, empty, empty],
      [1, 5, "Suspend", 0, empty, 0, empty, empty, empty],
      [1, 6, "Resume", 0, empty, 0, empty, empty, empty],
      [1, 7, "Turbo", 0, empty, 0, empty, empty, empty],
      [1, 8, "Sleep", 0, empty, 0, "VK_SLEEP", empty, empty],
      [1, 9, "WakeUp", 0, empty, 0, empty, empty, empty],
      [0, 10, "KeyA", 31, "A", 65, "VK_A", empty, empty],
      [0, 11, "KeyB", 32, "B", 66, "VK_B", empty, empty],
      [0, 12, "KeyC", 33, "C", 67, "VK_C", empty, empty],
      [0, 13, "KeyD", 34, "D", 68, "VK_D", empty, empty],
      [0, 14, "KeyE", 35, "E", 69, "VK_E", empty, empty],
      [0, 15, "KeyF", 36, "F", 70, "VK_F", empty, empty],
      [0, 16, "KeyG", 37, "G", 71, "VK_G", empty, empty],
      [0, 17, "KeyH", 38, "H", 72, "VK_H", empty, empty],
      [0, 18, "KeyI", 39, "I", 73, "VK_I", empty, empty],
      [0, 19, "KeyJ", 40, "J", 74, "VK_J", empty, empty],
      [0, 20, "KeyK", 41, "K", 75, "VK_K", empty, empty],
      [0, 21, "KeyL", 42, "L", 76, "VK_L", empty, empty],
      [0, 22, "KeyM", 43, "M", 77, "VK_M", empty, empty],
      [0, 23, "KeyN", 44, "N", 78, "VK_N", empty, empty],
      [0, 24, "KeyO", 45, "O", 79, "VK_O", empty, empty],
      [0, 25, "KeyP", 46, "P", 80, "VK_P", empty, empty],
      [0, 26, "KeyQ", 47, "Q", 81, "VK_Q", empty, empty],
      [0, 27, "KeyR", 48, "R", 82, "VK_R", empty, empty],
      [0, 28, "KeyS", 49, "S", 83, "VK_S", empty, empty],
      [0, 29, "KeyT", 50, "T", 84, "VK_T", empty, empty],
      [0, 30, "KeyU", 51, "U", 85, "VK_U", empty, empty],
      [0, 31, "KeyV", 52, "V", 86, "VK_V", empty, empty],
      [0, 32, "KeyW", 53, "W", 87, "VK_W", empty, empty],
      [0, 33, "KeyX", 54, "X", 88, "VK_X", empty, empty],
      [0, 34, "KeyY", 55, "Y", 89, "VK_Y", empty, empty],
      [0, 35, "KeyZ", 56, "Z", 90, "VK_Z", empty, empty],
      [0, 36, "Digit1", 22, "1", 49, "VK_1", empty, empty],
      [0, 37, "Digit2", 23, "2", 50, "VK_2", empty, empty],
      [0, 38, "Digit3", 24, "3", 51, "VK_3", empty, empty],
      [0, 39, "Digit4", 25, "4", 52, "VK_4", empty, empty],
      [0, 40, "Digit5", 26, "5", 53, "VK_5", empty, empty],
      [0, 41, "Digit6", 27, "6", 54, "VK_6", empty, empty],
      [0, 42, "Digit7", 28, "7", 55, "VK_7", empty, empty],
      [0, 43, "Digit8", 29, "8", 56, "VK_8", empty, empty],
      [0, 44, "Digit9", 30, "9", 57, "VK_9", empty, empty],
      [0, 45, "Digit0", 21, "0", 48, "VK_0", empty, empty],
      [1, 46, "Enter", 3, "Enter", 13, "VK_RETURN", empty, empty],
      [1, 47, "Escape", 9, "Escape", 27, "VK_ESCAPE", empty, empty],
      [1, 48, "Backspace", 1, "Backspace", 8, "VK_BACK", empty, empty],
      [1, 49, "Tab", 2, "Tab", 9, "VK_TAB", empty, empty],
      [1, 50, "Space", 10, "Space", 32, "VK_SPACE", empty, empty],
      [0, 51, "Minus", 88, "-", 189, "VK_OEM_MINUS", "-", "OEM_MINUS"],
      [0, 52, "Equal", 86, "=", 187, "VK_OEM_PLUS", "=", "OEM_PLUS"],
      [0, 53, "BracketLeft", 92, "[", 219, "VK_OEM_4", "[", "OEM_4"],
      [0, 54, "BracketRight", 94, "]", 221, "VK_OEM_6", "]", "OEM_6"],
      [0, 55, "Backslash", 93, "\\", 220, "VK_OEM_5", "\\", "OEM_5"],
      [0, 56, "IntlHash", 0, empty, 0, empty, empty, empty],
      // has been dropped from the w3c spec
      [0, 57, "Semicolon", 85, ";", 186, "VK_OEM_1", ";", "OEM_1"],
      [0, 58, "Quote", 95, "'", 222, "VK_OEM_7", "'", "OEM_7"],
      [0, 59, "Backquote", 91, "`", 192, "VK_OEM_3", "`", "OEM_3"],
      [0, 60, "Comma", 87, ",", 188, "VK_OEM_COMMA", ",", "OEM_COMMA"],
      [0, 61, "Period", 89, ".", 190, "VK_OEM_PERIOD", ".", "OEM_PERIOD"],
      [0, 62, "Slash", 90, "/", 191, "VK_OEM_2", "/", "OEM_2"],
      [1, 63, "CapsLock", 8, "CapsLock", 20, "VK_CAPITAL", empty, empty],
      [1, 64, "F1", 59, "F1", 112, "VK_F1", empty, empty],
      [1, 65, "F2", 60, "F2", 113, "VK_F2", empty, empty],
      [1, 66, "F3", 61, "F3", 114, "VK_F3", empty, empty],
      [1, 67, "F4", 62, "F4", 115, "VK_F4", empty, empty],
      [1, 68, "F5", 63, "F5", 116, "VK_F5", empty, empty],
      [1, 69, "F6", 64, "F6", 117, "VK_F6", empty, empty],
      [1, 70, "F7", 65, "F7", 118, "VK_F7", empty, empty],
      [1, 71, "F8", 66, "F8", 119, "VK_F8", empty, empty],
      [1, 72, "F9", 67, "F9", 120, "VK_F9", empty, empty],
      [1, 73, "F10", 68, "F10", 121, "VK_F10", empty, empty],
      [1, 74, "F11", 69, "F11", 122, "VK_F11", empty, empty],
      [1, 75, "F12", 70, "F12", 123, "VK_F12", empty, empty],
      [1, 76, "PrintScreen", 0, empty, 0, empty, empty, empty],
      [1, 77, "ScrollLock", 84, "ScrollLock", 145, "VK_SCROLL", empty, empty],
      [1, 78, "Pause", 7, "PauseBreak", 19, "VK_PAUSE", empty, empty],
      [1, 79, "Insert", 19, "Insert", 45, "VK_INSERT", empty, empty],
      [1, 80, "Home", 14, "Home", 36, "VK_HOME", empty, empty],
      [1, 81, "PageUp", 11, "PageUp", 33, "VK_PRIOR", empty, empty],
      [1, 82, "Delete", 20, "Delete", 46, "VK_DELETE", empty, empty],
      [1, 83, "End", 13, "End", 35, "VK_END", empty, empty],
      [1, 84, "PageDown", 12, "PageDown", 34, "VK_NEXT", empty, empty],
      [1, 85, "ArrowRight", 17, "RightArrow", 39, "VK_RIGHT", "Right", empty],
      [1, 86, "ArrowLeft", 15, "LeftArrow", 37, "VK_LEFT", "Left", empty],
      [1, 87, "ArrowDown", 18, "DownArrow", 40, "VK_DOWN", "Down", empty],
      [1, 88, "ArrowUp", 16, "UpArrow", 38, "VK_UP", "Up", empty],
      [1, 89, "NumLock", 83, "NumLock", 144, "VK_NUMLOCK", empty, empty],
      [1, 90, "NumpadDivide", 113, "NumPad_Divide", 111, "VK_DIVIDE", empty, empty],
      [1, 91, "NumpadMultiply", 108, "NumPad_Multiply", 106, "VK_MULTIPLY", empty, empty],
      [1, 92, "NumpadSubtract", 111, "NumPad_Subtract", 109, "VK_SUBTRACT", empty, empty],
      [1, 93, "NumpadAdd", 109, "NumPad_Add", 107, "VK_ADD", empty, empty],
      [1, 94, "NumpadEnter", 3, empty, 0, empty, empty, empty],
      [1, 95, "Numpad1", 99, "NumPad1", 97, "VK_NUMPAD1", empty, empty],
      [1, 96, "Numpad2", 100, "NumPad2", 98, "VK_NUMPAD2", empty, empty],
      [1, 97, "Numpad3", 101, "NumPad3", 99, "VK_NUMPAD3", empty, empty],
      [1, 98, "Numpad4", 102, "NumPad4", 100, "VK_NUMPAD4", empty, empty],
      [1, 99, "Numpad5", 103, "NumPad5", 101, "VK_NUMPAD5", empty, empty],
      [1, 100, "Numpad6", 104, "NumPad6", 102, "VK_NUMPAD6", empty, empty],
      [1, 101, "Numpad7", 105, "NumPad7", 103, "VK_NUMPAD7", empty, empty],
      [1, 102, "Numpad8", 106, "NumPad8", 104, "VK_NUMPAD8", empty, empty],
      [1, 103, "Numpad9", 107, "NumPad9", 105, "VK_NUMPAD9", empty, empty],
      [1, 104, "Numpad0", 98, "NumPad0", 96, "VK_NUMPAD0", empty, empty],
      [1, 105, "NumpadDecimal", 112, "NumPad_Decimal", 110, "VK_DECIMAL", empty, empty],
      [0, 106, "IntlBackslash", 97, "OEM_102", 226, "VK_OEM_102", empty, empty],
      [1, 107, "ContextMenu", 58, "ContextMenu", 93, empty, empty, empty],
      [1, 108, "Power", 0, empty, 0, empty, empty, empty],
      [1, 109, "NumpadEqual", 0, empty, 0, empty, empty, empty],
      [1, 110, "F13", 71, "F13", 124, "VK_F13", empty, empty],
      [1, 111, "F14", 72, "F14", 125, "VK_F14", empty, empty],
      [1, 112, "F15", 73, "F15", 126, "VK_F15", empty, empty],
      [1, 113, "F16", 74, "F16", 127, "VK_F16", empty, empty],
      [1, 114, "F17", 75, "F17", 128, "VK_F17", empty, empty],
      [1, 115, "F18", 76, "F18", 129, "VK_F18", empty, empty],
      [1, 116, "F19", 77, "F19", 130, "VK_F19", empty, empty],
      [1, 117, "F20", 78, "F20", 131, "VK_F20", empty, empty],
      [1, 118, "F21", 79, "F21", 132, "VK_F21", empty, empty],
      [1, 119, "F22", 80, "F22", 133, "VK_F22", empty, empty],
      [1, 120, "F23", 81, "F23", 134, "VK_F23", empty, empty],
      [1, 121, "F24", 82, "F24", 135, "VK_F24", empty, empty],
      [1, 122, "Open", 0, empty, 0, empty, empty, empty],
      [1, 123, "Help", 0, empty, 0, empty, empty, empty],
      [1, 124, "Select", 0, empty, 0, empty, empty, empty],
      [1, 125, "Again", 0, empty, 0, empty, empty, empty],
      [1, 126, "Undo", 0, empty, 0, empty, empty, empty],
      [1, 127, "Cut", 0, empty, 0, empty, empty, empty],
      [1, 128, "Copy", 0, empty, 0, empty, empty, empty],
      [1, 129, "Paste", 0, empty, 0, empty, empty, empty],
      [1, 130, "Find", 0, empty, 0, empty, empty, empty],
      [1, 131, "AudioVolumeMute", 117, "AudioVolumeMute", 173, "VK_VOLUME_MUTE", empty, empty],
      [1, 132, "AudioVolumeUp", 118, "AudioVolumeUp", 175, "VK_VOLUME_UP", empty, empty],
      [1, 133, "AudioVolumeDown", 119, "AudioVolumeDown", 174, "VK_VOLUME_DOWN", empty, empty],
      [1, 134, "NumpadComma", 110, "NumPad_Separator", 108, "VK_SEPARATOR", empty, empty],
      [0, 135, "IntlRo", 115, "ABNT_C1", 193, "VK_ABNT_C1", empty, empty],
      [1, 136, "KanaMode", 0, empty, 0, empty, empty, empty],
      [0, 137, "IntlYen", 0, empty, 0, empty, empty, empty],
      [1, 138, "Convert", 0, empty, 0, empty, empty, empty],
      [1, 139, "NonConvert", 0, empty, 0, empty, empty, empty],
      [1, 140, "Lang1", 0, empty, 0, empty, empty, empty],
      [1, 141, "Lang2", 0, empty, 0, empty, empty, empty],
      [1, 142, "Lang3", 0, empty, 0, empty, empty, empty],
      [1, 143, "Lang4", 0, empty, 0, empty, empty, empty],
      [1, 144, "Lang5", 0, empty, 0, empty, empty, empty],
      [1, 145, "Abort", 0, empty, 0, empty, empty, empty],
      [1, 146, "Props", 0, empty, 0, empty, empty, empty],
      [1, 147, "NumpadParenLeft", 0, empty, 0, empty, empty, empty],
      [1, 148, "NumpadParenRight", 0, empty, 0, empty, empty, empty],
      [1, 149, "NumpadBackspace", 0, empty, 0, empty, empty, empty],
      [1, 150, "NumpadMemoryStore", 0, empty, 0, empty, empty, empty],
      [1, 151, "NumpadMemoryRecall", 0, empty, 0, empty, empty, empty],
      [1, 152, "NumpadMemoryClear", 0, empty, 0, empty, empty, empty],
      [1, 153, "NumpadMemoryAdd", 0, empty, 0, empty, empty, empty],
      [1, 154, "NumpadMemorySubtract", 0, empty, 0, empty, empty, empty],
      [1, 155, "NumpadClear", 131, "Clear", 12, "VK_CLEAR", empty, empty],
      [1, 156, "NumpadClearEntry", 0, empty, 0, empty, empty, empty],
      [1, 0, empty, 5, "Ctrl", 17, "VK_CONTROL", empty, empty],
      [1, 0, empty, 4, "Shift", 16, "VK_SHIFT", empty, empty],
      [1, 0, empty, 6, "Alt", 18, "VK_MENU", empty, empty],
      [1, 0, empty, 57, "Meta", 91, "VK_COMMAND", empty, empty],
      [1, 157, "ControlLeft", 5, empty, 0, "VK_LCONTROL", empty, empty],
      [1, 158, "ShiftLeft", 4, empty, 0, "VK_LSHIFT", empty, empty],
      [1, 159, "AltLeft", 6, empty, 0, "VK_LMENU", empty, empty],
      [1, 160, "MetaLeft", 57, empty, 0, "VK_LWIN", empty, empty],
      [1, 161, "ControlRight", 5, empty, 0, "VK_RCONTROL", empty, empty],
      [1, 162, "ShiftRight", 4, empty, 0, "VK_RSHIFT", empty, empty],
      [1, 163, "AltRight", 6, empty, 0, "VK_RMENU", empty, empty],
      [1, 164, "MetaRight", 57, empty, 0, "VK_RWIN", empty, empty],
      [1, 165, "BrightnessUp", 0, empty, 0, empty, empty, empty],
      [1, 166, "BrightnessDown", 0, empty, 0, empty, empty, empty],
      [1, 167, "MediaPlay", 0, empty, 0, empty, empty, empty],
      [1, 168, "MediaRecord", 0, empty, 0, empty, empty, empty],
      [1, 169, "MediaFastForward", 0, empty, 0, empty, empty, empty],
      [1, 170, "MediaRewind", 0, empty, 0, empty, empty, empty],
      [1, 171, "MediaTrackNext", 124, "MediaTrackNext", 176, "VK_MEDIA_NEXT_TRACK", empty, empty],
      [1, 172, "MediaTrackPrevious", 125, "MediaTrackPrevious", 177, "VK_MEDIA_PREV_TRACK", empty, empty],
      [1, 173, "MediaStop", 126, "MediaStop", 178, "VK_MEDIA_STOP", empty, empty],
      [1, 174, "Eject", 0, empty, 0, empty, empty, empty],
      [1, 175, "MediaPlayPause", 127, "MediaPlayPause", 179, "VK_MEDIA_PLAY_PAUSE", empty, empty],
      [1, 176, "MediaSelect", 128, "LaunchMediaPlayer", 181, "VK_MEDIA_LAUNCH_MEDIA_SELECT", empty, empty],
      [1, 177, "LaunchMail", 129, "LaunchMail", 180, "VK_MEDIA_LAUNCH_MAIL", empty, empty],
      [1, 178, "LaunchApp2", 130, "LaunchApp2", 183, "VK_MEDIA_LAUNCH_APP2", empty, empty],
      [1, 179, "LaunchApp1", 0, empty, 0, "VK_MEDIA_LAUNCH_APP1", empty, empty],
      [1, 180, "SelectTask", 0, empty, 0, empty, empty, empty],
      [1, 181, "LaunchScreenSaver", 0, empty, 0, empty, empty, empty],
      [1, 182, "BrowserSearch", 120, "BrowserSearch", 170, "VK_BROWSER_SEARCH", empty, empty],
      [1, 183, "BrowserHome", 121, "BrowserHome", 172, "VK_BROWSER_HOME", empty, empty],
      [1, 184, "BrowserBack", 122, "BrowserBack", 166, "VK_BROWSER_BACK", empty, empty],
      [1, 185, "BrowserForward", 123, "BrowserForward", 167, "VK_BROWSER_FORWARD", empty, empty],
      [1, 186, "BrowserStop", 0, empty, 0, "VK_BROWSER_STOP", empty, empty],
      [1, 187, "BrowserRefresh", 0, empty, 0, "VK_BROWSER_REFRESH", empty, empty],
      [1, 188, "BrowserFavorites", 0, empty, 0, "VK_BROWSER_FAVORITES", empty, empty],
      [1, 189, "ZoomToggle", 0, empty, 0, empty, empty, empty],
      [1, 190, "MailReply", 0, empty, 0, empty, empty, empty],
      [1, 191, "MailForward", 0, empty, 0, empty, empty, empty],
      [1, 192, "MailSend", 0, empty, 0, empty, empty, empty],
      // See https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
      // If an Input Method Editor is processing key input and the event is keydown, return 229.
      [1, 0, empty, 114, "KeyInComposition", 229, empty, empty, empty],
      [1, 0, empty, 116, "ABNT_C2", 194, "VK_ABNT_C2", empty, empty],
      [1, 0, empty, 96, "OEM_8", 223, "VK_OEM_8", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_KANA", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_HANGUL", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_JUNJA", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_FINAL", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_HANJA", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_KANJI", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_CONVERT", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_NONCONVERT", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_ACCEPT", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_MODECHANGE", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_SELECT", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_PRINT", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_EXECUTE", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_SNAPSHOT", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_HELP", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_APPS", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_PROCESSKEY", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_PACKET", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_DBE_SBCSCHAR", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_DBE_DBCSCHAR", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_ATTN", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_CRSEL", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_EXSEL", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_EREOF", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_PLAY", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_ZOOM", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_NONAME", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_PA1", empty, empty],
      [1, 0, empty, 0, empty, 0, "VK_OEM_CLEAR", empty, empty]
    ];
    const seenKeyCode = [];
    const seenScanCode = [];
    for (const mapping of mappings) {
      const [immutable, scanCode, scanCodeStr, keyCode, keyCodeStr, eventKeyCode, vkey, usUserSettingsLabel, generalUserSettingsLabel] = mapping;
      if (!seenScanCode[scanCode]) {
        seenScanCode[scanCode] = true;
        scanCodeStrToInt[scanCodeStr] = scanCode;
        scanCodeLowerCaseStrToInt[scanCodeStr.toLowerCase()] = scanCode;
        if (immutable) {
          IMMUTABLE_CODE_TO_KEY_CODE[scanCode] = keyCode;
        }
      }
      if (!seenKeyCode[keyCode]) {
        seenKeyCode[keyCode] = true;
        if (!keyCodeStr) {
          throw new Error(`String representation missing for key code ${keyCode} around scan code ${scanCodeStr}`);
        }
        uiMap.define(keyCode, keyCodeStr);
        userSettingsUSMap.define(keyCode, usUserSettingsLabel || keyCodeStr);
        userSettingsGeneralMap.define(keyCode, generalUserSettingsLabel || usUserSettingsLabel || keyCodeStr);
      }
      if (eventKeyCode) {
        EVENT_KEY_CODE_MAP[eventKeyCode] = keyCode;
      }
    }
  })();
  exports.KeyCodeUtils = void 0;
  (function(KeyCodeUtils) {
    function toString(keyCode) {
      return uiMap.keyCodeToStr(keyCode);
    }
    KeyCodeUtils.toString = toString;
    function fromString(key) {
      return uiMap.strToKeyCode(key);
    }
    KeyCodeUtils.fromString = fromString;
    function toUserSettingsUS(keyCode) {
      return userSettingsUSMap.keyCodeToStr(keyCode);
    }
    KeyCodeUtils.toUserSettingsUS = toUserSettingsUS;
    function toUserSettingsGeneral(keyCode) {
      return userSettingsGeneralMap.keyCodeToStr(keyCode);
    }
    KeyCodeUtils.toUserSettingsGeneral = toUserSettingsGeneral;
    function fromUserSettings(key) {
      return userSettingsUSMap.strToKeyCode(key) || userSettingsGeneralMap.strToKeyCode(key);
    }
    KeyCodeUtils.fromUserSettings = fromUserSettings;
    function toElectronAccelerator(keyCode) {
      if (keyCode >= 98 && keyCode <= 113) {
        return null;
      }
      switch (keyCode) {
        case 16:
          return "Up";
        case 18:
          return "Down";
        case 15:
          return "Left";
        case 17:
          return "Right";
      }
      return uiMap.keyCodeToStr(keyCode);
    }
    KeyCodeUtils.toElectronAccelerator = toElectronAccelerator;
  })(exports.KeyCodeUtils || (exports.KeyCodeUtils = {}));
  function KeyChord(firstPart, secondPart) {
    const chordPart = (secondPart & 65535) << 16 >>> 0;
    return (firstPart | chordPart) >>> 0;
  }
  function isModifierKey(keyCode) {
    return keyCode === 5 || keyCode === 4 || keyCode === 6 || keyCode === 57;
  }
  let safeProcess;
  const vscodeGlobal = globalThis.vscode;
  if (typeof vscodeGlobal !== "undefined" && typeof vscodeGlobal.process !== "undefined") {
    const sandboxProcess = vscodeGlobal.process;
    safeProcess = {
      get platform() {
        return sandboxProcess.platform;
      },
      get arch() {
        return sandboxProcess.arch;
      },
      get env() {
        return sandboxProcess.env;
      },
      cwd() {
        return sandboxProcess.cwd();
      }
    };
  } else if (typeof process !== "undefined" && typeof process?.versions?.node === "string") {
    safeProcess = {
      get platform() {
        return process.platform;
      },
      get arch() {
        return process.arch;
      },
      get env() {
        return process.env;
      },
      cwd() {
        return process.env["VSCODE_CWD"] || process.cwd();
      }
    };
  } else {
    safeProcess = {
      // Supported
      get platform() {
        return isWindows ? "win32" : isMacintosh ? "darwin" : "linux";
      },
      get arch() {
        return void 0;
      },
      // Unsupported
      get env() {
        return {};
      },
      cwd() {
        return "/";
      }
    };
  }
  const cwd = safeProcess.cwd;
  const env = safeProcess.env;
  const platform = safeProcess.platform;
  const CHAR_UPPERCASE_A = 65;
  const CHAR_LOWERCASE_A = 97;
  const CHAR_UPPERCASE_Z = 90;
  const CHAR_LOWERCASE_Z = 122;
  const CHAR_DOT = 46;
  const CHAR_FORWARD_SLASH = 47;
  const CHAR_BACKWARD_SLASH = 92;
  const CHAR_COLON = 58;
  const CHAR_QUESTION_MARK = 63;
  class ErrorInvalidArgType extends Error {
    constructor(name, expected, actual) {
      let determiner;
      if (typeof expected === "string" && expected.indexOf("not ") === 0) {
        determiner = "must not be";
        expected = expected.replace(/^not /, "");
      } else {
        determiner = "must be";
      }
      const type = name.indexOf(".") !== -1 ? "property" : "argument";
      let msg = `The "${name}" ${type} ${determiner} of type ${expected}`;
      msg += `. Received type ${typeof actual}`;
      super(msg);
      this.code = "ERR_INVALID_ARG_TYPE";
    }
  }
  function validateObject(pathObject, name) {
    if (pathObject === null || typeof pathObject !== "object") {
      throw new ErrorInvalidArgType(name, "Object", pathObject);
    }
  }
  function validateString(value, name) {
    if (typeof value !== "string") {
      throw new ErrorInvalidArgType(name, "string", value);
    }
  }
  const platformIsWin32 = platform === "win32";
  function isPathSeparator(code) {
    return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
  }
  function isPosixPathSeparator(code) {
    return code === CHAR_FORWARD_SLASH;
  }
  function isWindowsDeviceRoot(code) {
    return code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z || code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z;
  }
  function normalizeString(path, allowAboveRoot, separator, isPathSeparator2) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code = 0;
    for (let i = 0; i <= path.length; ++i) {
      if (i < path.length) {
        code = path.charCodeAt(i);
      } else if (isPathSeparator2(code)) {
        break;
      } else {
        code = CHAR_FORWARD_SLASH;
      }
      if (isPathSeparator2(code)) {
        if (lastSlash === i - 1 || dots === 1) ;
        else if (dots === 2) {
          if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
            if (res.length > 2) {
              const lastSlashIndex = res.lastIndexOf(separator);
              if (lastSlashIndex === -1) {
                res = "";
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
              }
              lastSlash = i;
              dots = 0;
              continue;
            } else if (res.length !== 0) {
              res = "";
              lastSegmentLength = 0;
              lastSlash = i;
              dots = 0;
              continue;
            }
          }
          if (allowAboveRoot) {
            res += res.length > 0 ? `${separator}..` : "..";
            lastSegmentLength = 2;
          }
        } else {
          if (res.length > 0) {
            res += `${separator}${path.slice(lastSlash + 1, i)}`;
          } else {
            res = path.slice(lastSlash + 1, i);
          }
          lastSegmentLength = i - lastSlash - 1;
        }
        lastSlash = i;
        dots = 0;
      } else if (code === CHAR_DOT && dots !== -1) {
        ++dots;
      } else {
        dots = -1;
      }
    }
    return res;
  }
  function formatExt(ext) {
    return ext ? `${ext[0] === "." ? "" : "."}${ext}` : "";
  }
  function _format(sep2, pathObject) {
    validateObject(pathObject, "pathObject");
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base || `${pathObject.name || ""}${formatExt(pathObject.ext)}`;
    if (!dir) {
      return base;
    }
    return dir === pathObject.root ? `${dir}${base}` : `${dir}${sep2}${base}`;
  }
  const win32 = {
    // path.resolve([from ...], to)
    resolve(...pathSegments) {
      let resolvedDevice = "";
      let resolvedTail = "";
      let resolvedAbsolute = false;
      for (let i = pathSegments.length - 1; i >= -1; i--) {
        let path;
        if (i >= 0) {
          path = pathSegments[i];
          validateString(path, `paths[${i}]`);
          if (path.length === 0) {
            continue;
          }
        } else if (resolvedDevice.length === 0) {
          path = cwd();
        } else {
          path = env[`=${resolvedDevice}`] || cwd();
          if (path === void 0 || path.slice(0, 2).toLowerCase() !== resolvedDevice.toLowerCase() && path.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
            path = `${resolvedDevice}\\`;
          }
        }
        const len = path.length;
        let rootEnd = 0;
        let device = "";
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        if (len === 1) {
          if (isPathSeparator(code)) {
            rootEnd = 1;
            isAbsolute = true;
          }
        } else if (isPathSeparator(code)) {
          isAbsolute = true;
          if (isPathSeparator(path.charCodeAt(1))) {
            let j = 2;
            let last = j;
            while (j < len && !isPathSeparator(path.charCodeAt(j))) {
              j++;
            }
            if (j < len && j !== last) {
              const firstPart = path.slice(last, j);
              last = j;
              while (j < len && isPathSeparator(path.charCodeAt(j))) {
                j++;
              }
              if (j < len && j !== last) {
                last = j;
                while (j < len && !isPathSeparator(path.charCodeAt(j))) {
                  j++;
                }
                if (j === len || j !== last) {
                  device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                  rootEnd = j;
                }
              }
            }
          } else {
            rootEnd = 1;
          }
        } else if (isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON) {
          device = path.slice(0, 2);
          rootEnd = 2;
          if (len > 2 && isPathSeparator(path.charCodeAt(2))) {
            isAbsolute = true;
            rootEnd = 3;
          }
        }
        if (device.length > 0) {
          if (resolvedDevice.length > 0) {
            if (device.toLowerCase() !== resolvedDevice.toLowerCase()) {
              continue;
            }
          } else {
            resolvedDevice = device;
          }
        }
        if (resolvedAbsolute) {
          if (resolvedDevice.length > 0) {
            break;
          }
        } else {
          resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
          resolvedAbsolute = isAbsolute;
          if (isAbsolute && resolvedDevice.length > 0) {
            break;
          }
        }
      }
      resolvedTail = normalizeString(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator);
      return resolvedAbsolute ? `${resolvedDevice}\\${resolvedTail}` : `${resolvedDevice}${resolvedTail}` || ".";
    },
    normalize(path) {
      validateString(path, "path");
      const len = path.length;
      if (len === 0) {
        return ".";
      }
      let rootEnd = 0;
      let device;
      let isAbsolute = false;
      const code = path.charCodeAt(0);
      if (len === 1) {
        return isPosixPathSeparator(code) ? "\\" : path;
      }
      if (isPathSeparator(code)) {
        isAbsolute = true;
        if (isPathSeparator(path.charCodeAt(1))) {
          let j = 2;
          let last = j;
          while (j < len && !isPathSeparator(path.charCodeAt(j))) {
            j++;
          }
          if (j < len && j !== last) {
            const firstPart = path.slice(last, j);
            last = j;
            while (j < len && isPathSeparator(path.charCodeAt(j))) {
              j++;
            }
            if (j < len && j !== last) {
              last = j;
              while (j < len && !isPathSeparator(path.charCodeAt(j))) {
                j++;
              }
              if (j === len) {
                return `\\\\${firstPart}\\${path.slice(last)}\\`;
              }
              if (j !== last) {
                device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON) {
        device = path.slice(0, 2);
        rootEnd = 2;
        if (len > 2 && isPathSeparator(path.charCodeAt(2))) {
          isAbsolute = true;
          rootEnd = 3;
        }
      }
      let tail2 = rootEnd < len ? normalizeString(path.slice(rootEnd), !isAbsolute, "\\", isPathSeparator) : "";
      if (tail2.length === 0 && !isAbsolute) {
        tail2 = ".";
      }
      if (tail2.length > 0 && isPathSeparator(path.charCodeAt(len - 1))) {
        tail2 += "\\";
      }
      if (!isAbsolute && device === void 0 && path.includes(":")) {
        if (tail2.length >= 2 && isWindowsDeviceRoot(tail2.charCodeAt(0)) && tail2.charCodeAt(1) === CHAR_COLON) {
          return `.\\${tail2}`;
        }
        let index = path.indexOf(":");
        do {
          if (index === len - 1 || isPathSeparator(path.charCodeAt(index + 1))) {
            return `.\\${tail2}`;
          }
        } while ((index = path.indexOf(":", index + 1)) !== -1);
      }
      if (device === void 0) {
        return isAbsolute ? `\\${tail2}` : tail2;
      }
      return isAbsolute ? `${device}\\${tail2}` : `${device}${tail2}`;
    },
    isAbsolute(path) {
      validateString(path, "path");
      const len = path.length;
      if (len === 0) {
        return false;
      }
      const code = path.charCodeAt(0);
      return isPathSeparator(code) || // Possible device root
      len > 2 && isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON && isPathSeparator(path.charCodeAt(2));
    },
    join(...paths) {
      if (paths.length === 0) {
        return ".";
      }
      let joined;
      let firstPart;
      for (let i = 0; i < paths.length; ++i) {
        const arg = paths[i];
        validateString(arg, "path");
        if (arg.length > 0) {
          if (joined === void 0) {
            joined = firstPart = arg;
          } else {
            joined += `\\${arg}`;
          }
        }
      }
      if (joined === void 0) {
        return ".";
      }
      let needsReplace = true;
      let slashCount = 0;
      if (typeof firstPart === "string" && isPathSeparator(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1 && isPathSeparator(firstPart.charCodeAt(1))) {
          ++slashCount;
          if (firstLen > 2) {
            if (isPathSeparator(firstPart.charCodeAt(2))) {
              ++slashCount;
            } else {
              needsReplace = false;
            }
          }
        }
      }
      if (needsReplace) {
        while (slashCount < joined.length && isPathSeparator(joined.charCodeAt(slashCount))) {
          slashCount++;
        }
        if (slashCount >= 2) {
          joined = `\\${joined.slice(slashCount)}`;
        }
      }
      return win32.normalize(joined);
    },
    // It will solve the relative path from `from` to `to`, for instance:
    //  from = 'C:\\orandea\\test\\aaa'
    //  to = 'C:\\orandea\\impl\\bbb'
    // The output of the function should be: '..\\..\\impl\\bbb'
    relative(from, to) {
      validateString(from, "from");
      validateString(to, "to");
      if (from === to) {
        return "";
      }
      const fromOrig = win32.resolve(from);
      const toOrig = win32.resolve(to);
      if (fromOrig === toOrig) {
        return "";
      }
      from = fromOrig.toLowerCase();
      to = toOrig.toLowerCase();
      if (from === to) {
        return "";
      }
      if (fromOrig.length !== from.length || toOrig.length !== to.length) {
        const fromSplit = fromOrig.split("\\");
        const toSplit = toOrig.split("\\");
        if (fromSplit[fromSplit.length - 1] === "") {
          fromSplit.pop();
        }
        if (toSplit[toSplit.length - 1] === "") {
          toSplit.pop();
        }
        const fromLen2 = fromSplit.length;
        const toLen2 = toSplit.length;
        const length2 = fromLen2 < toLen2 ? fromLen2 : toLen2;
        let i2;
        for (i2 = 0; i2 < length2; i2++) {
          if (fromSplit[i2].toLowerCase() !== toSplit[i2].toLowerCase()) {
            break;
          }
        }
        if (i2 === 0) {
          return toOrig;
        } else if (i2 === length2) {
          if (toLen2 > length2) {
            return toSplit.slice(i2).join("\\");
          }
          if (fromLen2 > length2) {
            return "..\\".repeat(fromLen2 - 1 - i2) + "..";
          }
          return "";
        }
        return "..\\".repeat(fromLen2 - i2) + toSplit.slice(i2).join("\\");
      }
      let fromStart = 0;
      while (fromStart < from.length && from.charCodeAt(fromStart) === CHAR_BACKWARD_SLASH) {
        fromStart++;
      }
      let fromEnd = from.length;
      while (fromEnd - 1 > fromStart && from.charCodeAt(fromEnd - 1) === CHAR_BACKWARD_SLASH) {
        fromEnd--;
      }
      const fromLen = fromEnd - fromStart;
      let toStart = 0;
      while (toStart < to.length && to.charCodeAt(toStart) === CHAR_BACKWARD_SLASH) {
        toStart++;
      }
      let toEnd = to.length;
      while (toEnd - 1 > toStart && to.charCodeAt(toEnd - 1) === CHAR_BACKWARD_SLASH) {
        toEnd--;
      }
      const toLen = toEnd - toStart;
      const length = fromLen < toLen ? fromLen : toLen;
      let lastCommonSep = -1;
      let i = 0;
      for (; i < length; i++) {
        const fromCode = from.charCodeAt(fromStart + i);
        if (fromCode !== to.charCodeAt(toStart + i)) {
          break;
        } else if (fromCode === CHAR_BACKWARD_SLASH) {
          lastCommonSep = i;
        }
      }
      if (i !== length) {
        if (lastCommonSep === -1) {
          return toOrig;
        }
      } else {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH) {
            return toOrig.slice(toStart + i + 1);
          }
          if (i === 2) {
            return toOrig.slice(toStart + i);
          }
        }
        if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH) {
            lastCommonSep = i;
          } else if (i === 2) {
            lastCommonSep = 3;
          }
        }
        if (lastCommonSep === -1) {
          lastCommonSep = 0;
        }
      }
      let out = "";
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH) {
          out += out.length === 0 ? ".." : "\\..";
        }
      }
      toStart += lastCommonSep;
      if (out.length > 0) {
        return `${out}${toOrig.slice(toStart, toEnd)}`;
      }
      if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH) {
        ++toStart;
      }
      return toOrig.slice(toStart, toEnd);
    },
    toNamespacedPath(path) {
      if (typeof path !== "string" || path.length === 0) {
        return path;
      }
      const resolvedPath = win32.resolve(path);
      if (resolvedPath.length <= 2) {
        return path;
      }
      if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH) {
        if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH) {
          const code = resolvedPath.charCodeAt(2);
          if (code !== CHAR_QUESTION_MARK && code !== CHAR_DOT) {
            return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
          }
        }
      } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0)) && resolvedPath.charCodeAt(1) === CHAR_COLON && resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
        return `\\\\?\\${resolvedPath}`;
      }
      return resolvedPath;
    },
    dirname(path) {
      validateString(path, "path");
      const len = path.length;
      if (len === 0) {
        return ".";
      }
      let rootEnd = -1;
      let offset = 0;
      const code = path.charCodeAt(0);
      if (len === 1) {
        return isPathSeparator(code) ? path : ".";
      }
      if (isPathSeparator(code)) {
        rootEnd = offset = 1;
        if (isPathSeparator(path.charCodeAt(1))) {
          let j = 2;
          let last = j;
          while (j < len && !isPathSeparator(path.charCodeAt(j))) {
            j++;
          }
          if (j < len && j !== last) {
            last = j;
            while (j < len && isPathSeparator(path.charCodeAt(j))) {
              j++;
            }
            if (j < len && j !== last) {
              last = j;
              while (j < len && !isPathSeparator(path.charCodeAt(j))) {
                j++;
              }
              if (j === len) {
                return path;
              }
              if (j !== last) {
                rootEnd = offset = j + 1;
              }
            }
          }
        }
      } else if (isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON) {
        rootEnd = len > 2 && isPathSeparator(path.charCodeAt(2)) ? 3 : 2;
        offset = rootEnd;
      }
      let end = -1;
      let matchedSlash = true;
      for (let i = len - 1; i >= offset; --i) {
        if (isPathSeparator(path.charCodeAt(i))) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          matchedSlash = false;
        }
      }
      if (end === -1) {
        if (rootEnd === -1) {
          return ".";
        }
        end = rootEnd;
      }
      return path.slice(0, end);
    },
    basename(path, suffix) {
      if (suffix !== void 0) {
        validateString(suffix, "suffix");
      }
      validateString(path, "path");
      let start = 0;
      let end = -1;
      let matchedSlash = true;
      let i;
      if (path.length >= 2 && isWindowsDeviceRoot(path.charCodeAt(0)) && path.charCodeAt(1) === CHAR_COLON) {
        start = 2;
      }
      if (suffix !== void 0 && suffix.length > 0 && suffix.length <= path.length) {
        if (suffix === path) {
          return "";
        }
        let extIdx = suffix.length - 1;
        let firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= start; --i) {
          const code = path.charCodeAt(i);
          if (isPathSeparator(code)) {
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              if (code === suffix.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  end = i;
                }
              } else {
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) {
          end = firstNonSlashEnd;
        } else if (end === -1) {
          end = path.length;
        }
        return path.slice(start, end);
      }
      for (i = path.length - 1; i >= start; --i) {
        if (isPathSeparator(path.charCodeAt(i))) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
      }
      if (end === -1) {
        return "";
      }
      return path.slice(start, end);
    },
    extname(path) {
      validateString(path, "path");
      let start = 0;
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      let preDotState = 0;
      if (path.length >= 2 && path.charCodeAt(1) === CHAR_COLON && isWindowsDeviceRoot(path.charCodeAt(0))) {
        start = startPart = 2;
      }
      for (let i = path.length - 1; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (isPathSeparator(code)) {
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
        if (code === CHAR_DOT) {
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          preDotState = -1;
        }
      }
      if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
      preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
      }
      return path.slice(startDot, end);
    },
    format: _format.bind(null, "\\"),
    parse(path) {
      validateString(path, "path");
      const ret = { root: "", dir: "", base: "", ext: "", name: "" };
      if (path.length === 0) {
        return ret;
      }
      const len = path.length;
      let rootEnd = 0;
      let code = path.charCodeAt(0);
      if (len === 1) {
        if (isPathSeparator(code)) {
          ret.root = ret.dir = path;
          return ret;
        }
        ret.base = ret.name = path;
        return ret;
      }
      if (isPathSeparator(code)) {
        rootEnd = 1;
        if (isPathSeparator(path.charCodeAt(1))) {
          let j = 2;
          let last = j;
          while (j < len && !isPathSeparator(path.charCodeAt(j))) {
            j++;
          }
          if (j < len && j !== last) {
            last = j;
            while (j < len && isPathSeparator(path.charCodeAt(j))) {
              j++;
            }
            if (j < len && j !== last) {
              last = j;
              while (j < len && !isPathSeparator(path.charCodeAt(j))) {
                j++;
              }
              if (j === len) {
                rootEnd = j;
              } else if (j !== last) {
                rootEnd = j + 1;
              }
            }
          }
        }
      } else if (isWindowsDeviceRoot(code) && path.charCodeAt(1) === CHAR_COLON) {
        if (len <= 2) {
          ret.root = ret.dir = path;
          return ret;
        }
        rootEnd = 2;
        if (isPathSeparator(path.charCodeAt(2))) {
          if (len === 3) {
            ret.root = ret.dir = path;
            return ret;
          }
          rootEnd = 3;
        }
      }
      if (rootEnd > 0) {
        ret.root = path.slice(0, rootEnd);
      }
      let startDot = -1;
      let startPart = rootEnd;
      let end = -1;
      let matchedSlash = true;
      let i = path.length - 1;
      let preDotState = 0;
      for (; i >= rootEnd; --i) {
        code = path.charCodeAt(i);
        if (isPathSeparator(code)) {
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
        if (code === CHAR_DOT) {
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          preDotState = -1;
        }
      }
      if (end !== -1) {
        if (startDot === -1 || // We saw a non-dot character immediately before the dot
        preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
          ret.base = ret.name = path.slice(startPart, end);
        } else {
          ret.name = path.slice(startPart, startDot);
          ret.base = path.slice(startPart, end);
          ret.ext = path.slice(startDot, end);
        }
      }
      if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path.slice(0, startPart - 1);
      } else {
        ret.dir = ret.root;
      }
      return ret;
    },
    sep: "\\",
    delimiter: ";",
    win32: null,
    posix: null
  };
  const posixCwd = (() => {
    if (platformIsWin32) {
      const regexp = /\\/g;
      return () => {
        const cwd$1 = cwd().replace(regexp, "/");
        return cwd$1.slice(cwd$1.indexOf("/"));
      };
    }
    return () => cwd();
  })();
  const posix = {
    // path.resolve([from ...], to)
    resolve(...pathSegments) {
      let resolvedPath = "";
      let resolvedAbsolute = false;
      for (let i = pathSegments.length - 1; i >= 0 && !resolvedAbsolute; i--) {
        const path = pathSegments[i];
        validateString(path, `paths[${i}]`);
        if (path.length === 0) {
          continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
      }
      if (!resolvedAbsolute) {
        const cwd2 = posixCwd();
        resolvedPath = `${cwd2}/${resolvedPath}`;
        resolvedAbsolute = cwd2.charCodeAt(0) === CHAR_FORWARD_SLASH;
      }
      resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator);
      if (resolvedAbsolute) {
        return `/${resolvedPath}`;
      }
      return resolvedPath.length > 0 ? resolvedPath : ".";
    },
    normalize(path) {
      validateString(path, "path");
      if (path.length === 0) {
        return ".";
      }
      const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
      const trailingSeparator = path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH;
      path = normalizeString(path, !isAbsolute, "/", isPosixPathSeparator);
      if (path.length === 0) {
        if (isAbsolute) {
          return "/";
        }
        return trailingSeparator ? "./" : ".";
      }
      if (trailingSeparator) {
        path += "/";
      }
      return isAbsolute ? `/${path}` : path;
    },
    isAbsolute(path) {
      validateString(path, "path");
      return path.length > 0 && path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    },
    join(...paths) {
      if (paths.length === 0) {
        return ".";
      }
      const path = [];
      for (let i = 0; i < paths.length; ++i) {
        const arg = paths[i];
        validateString(arg, "path");
        if (arg.length > 0) {
          path.push(arg);
        }
      }
      if (path.length === 0) {
        return ".";
      }
      return posix.normalize(path.join("/"));
    },
    relative(from, to) {
      validateString(from, "from");
      validateString(to, "to");
      if (from === to) {
        return "";
      }
      from = posix.resolve(from);
      to = posix.resolve(to);
      if (from === to) {
        return "";
      }
      const fromStart = 1;
      const fromEnd = from.length;
      const fromLen = fromEnd - fromStart;
      const toStart = 1;
      const toLen = to.length - toStart;
      const length = fromLen < toLen ? fromLen : toLen;
      let lastCommonSep = -1;
      let i = 0;
      for (; i < length; i++) {
        const fromCode = from.charCodeAt(fromStart + i);
        if (fromCode !== to.charCodeAt(toStart + i)) {
          break;
        } else if (fromCode === CHAR_FORWARD_SLASH) {
          lastCommonSep = i;
        }
      }
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH) {
            return to.slice(toStart + i + 1);
          }
          if (i === 0) {
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH) {
            lastCommonSep = i;
          } else if (i === 0) {
            lastCommonSep = 0;
          }
        }
      }
      let out = "";
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (i === fromEnd || from.charCodeAt(i) === CHAR_FORWARD_SLASH) {
          out += out.length === 0 ? ".." : "/..";
        }
      }
      return `${out}${to.slice(toStart + lastCommonSep)}`;
    },
    toNamespacedPath(path) {
      return path;
    },
    dirname(path) {
      validateString(path, "path");
      if (path.length === 0) {
        return ".";
      }
      const hasRoot = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
      let end = -1;
      let matchedSlash = true;
      for (let i = path.length - 1; i >= 1; --i) {
        if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          matchedSlash = false;
        }
      }
      if (end === -1) {
        return hasRoot ? "/" : ".";
      }
      if (hasRoot && end === 1) {
        return "//";
      }
      return path.slice(0, end);
    },
    basename(path, suffix) {
      if (suffix !== void 0) {
        validateString(suffix, "suffix");
      }
      validateString(path, "path");
      let start = 0;
      let end = -1;
      let matchedSlash = true;
      let i;
      if (suffix !== void 0 && suffix.length > 0 && suffix.length <= path.length) {
        if (suffix === path) {
          return "";
        }
        let extIdx = suffix.length - 1;
        let firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= 0; --i) {
          const code = path.charCodeAt(i);
          if (code === CHAR_FORWARD_SLASH) {
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              if (code === suffix.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  end = i;
                }
              } else {
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) {
          end = firstNonSlashEnd;
        } else if (end === -1) {
          end = path.length;
        }
        return path.slice(start, end);
      }
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
      }
      if (end === -1) {
        return "";
      }
      return path.slice(start, end);
    },
    extname(path) {
      validateString(path, "path");
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      let preDotState = 0;
      for (let i = path.length - 1; i >= 0; --i) {
        const char = path[i];
        if (char === "/") {
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
        if (char === ".") {
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          preDotState = -1;
        }
      }
      if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
      preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
      }
      return path.slice(startDot, end);
    },
    format: _format.bind(null, "/"),
    parse(path) {
      validateString(path, "path");
      const ret = { root: "", dir: "", base: "", ext: "", name: "" };
      if (path.length === 0) {
        return ret;
      }
      const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
      let start;
      if (isAbsolute) {
        ret.root = "/";
        start = 1;
      } else {
        start = 0;
      }
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      let i = path.length - 1;
      let preDotState = 0;
      for (; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (code === CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
        if (code === CHAR_DOT) {
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          preDotState = -1;
        }
      }
      if (end !== -1) {
        const start2 = startPart === 0 && isAbsolute ? 1 : startPart;
        if (startDot === -1 || // We saw a non-dot character immediately before the dot
        preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
          ret.base = ret.name = path.slice(start2, end);
        } else {
          ret.name = path.slice(start2, startDot);
          ret.base = path.slice(start2, end);
          ret.ext = path.slice(startDot, end);
        }
      }
      if (startPart > 0) {
        ret.dir = path.slice(0, startPart - 1);
      } else if (isAbsolute) {
        ret.dir = "/";
      }
      return ret;
    },
    sep: "/",
    delimiter: ":",
    win32: null,
    posix: null
  };
  posix.win32 = win32.win32 = win32;
  posix.posix = win32.posix = posix;
  const normalize = platformIsWin32 ? win32.normalize : posix.normalize;
  const join = platformIsWin32 ? win32.join : posix.join;
  const resolve = platformIsWin32 ? win32.resolve : posix.resolve;
  const relative = platformIsWin32 ? win32.relative : posix.relative;
  const dirname = platformIsWin32 ? win32.dirname : posix.dirname;
  const basename = platformIsWin32 ? win32.basename : posix.basename;
  const extname = platformIsWin32 ? win32.extname : posix.extname;
  const sep = platformIsWin32 ? win32.sep : posix.sep;
  const _schemePattern = /^\w[\w\d+.-]*$/;
  const _singleSlashStart = /^\//;
  const _doubleSlashStart = /^\/\//;
  function _validateUri(ret, _strict) {
    if (!ret.scheme && _strict) {
      throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${ret.authority}", path: "${ret.path}", query: "${ret.query}", fragment: "${ret.fragment}"}`);
    }
    if (ret.scheme && !_schemePattern.test(ret.scheme)) {
      throw new Error("[UriError]: Scheme contains illegal characters.");
    }
    if (ret.path) {
      if (ret.authority) {
        if (!_singleSlashStart.test(ret.path)) {
          throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
        }
      } else {
        if (_doubleSlashStart.test(ret.path)) {
          throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
        }
      }
    }
  }
  function _schemeFix(scheme, _strict) {
    if (!scheme && !_strict) {
      return "file";
    }
    return scheme;
  }
  function _referenceResolution(scheme, path) {
    switch (scheme) {
      case "https":
      case "http":
      case "file":
        if (!path) {
          path = _slash;
        } else if (path[0] !== _slash) {
          path = _slash + path;
        }
        break;
    }
    return path;
  }
  const _empty = "";
  const _slash = "/";
  const _regexp = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
  class URI {
    static isUri(thing) {
      if (thing instanceof URI) {
        return true;
      }
      if (!thing || typeof thing !== "object") {
        return false;
      }
      return typeof thing.authority === "string" && typeof thing.fragment === "string" && typeof thing.path === "string" && typeof thing.query === "string" && typeof thing.scheme === "string" && typeof thing.fsPath === "string" && typeof thing.with === "function" && typeof thing.toString === "function";
    }
    /**
     * @internal
     */
    constructor(schemeOrData, authority, path, query, fragment, _strict = false) {
      if (typeof schemeOrData === "object") {
        this.scheme = schemeOrData.scheme || _empty;
        this.authority = schemeOrData.authority || _empty;
        this.path = schemeOrData.path || _empty;
        this.query = schemeOrData.query || _empty;
        this.fragment = schemeOrData.fragment || _empty;
      } else {
        this.scheme = _schemeFix(schemeOrData, _strict);
        this.authority = authority || _empty;
        this.path = _referenceResolution(this.scheme, path || _empty);
        this.query = query || _empty;
        this.fragment = fragment || _empty;
        _validateUri(this, _strict);
      }
    }
    // ---- filesystem path -----------------------
    /**
     * Returns a string representing the corresponding file system path of this URI.
     * Will handle UNC paths, normalizes windows drive letters to lower-case, and uses the
     * platform specific path separator.
     *
     * * Will *not* validate the path for invalid characters and semantics.
     * * Will *not* look at the scheme of this URI.
     * * The result shall *not* be used for display purposes but for accessing a file on disk.
     *
     *
     * The *difference* to `URI#path` is the use of the platform specific separator and the handling
     * of UNC paths. See the below sample of a file-uri with an authority (UNC path).
     *
     * ```ts
        const u = URI.parse('file://server/c$/folder/file.txt')
        u.authority === 'server'
        u.path === '/shares/c$/file.txt'
        u.fsPath === '\\server\c$\folder\file.txt'
    ```
     *
     * Using `URI#path` to read a file (using fs-apis) would not be enough because parts of the path,
     * namely the server name, would be missing. Therefore `URI#fsPath` exists - it's sugar to ease working
     * with URIs that represent files on disk (`file` scheme).
     */
    get fsPath() {
      return uriToFsPath(this, false);
    }
    // ---- modify to new -------------------------
    with(change) {
      if (!change) {
        return this;
      }
      let { scheme, authority, path, query, fragment } = change;
      if (scheme === void 0) {
        scheme = this.scheme;
      } else if (scheme === null) {
        scheme = _empty;
      }
      if (authority === void 0) {
        authority = this.authority;
      } else if (authority === null) {
        authority = _empty;
      }
      if (path === void 0) {
        path = this.path;
      } else if (path === null) {
        path = _empty;
      }
      if (query === void 0) {
        query = this.query;
      } else if (query === null) {
        query = _empty;
      }
      if (fragment === void 0) {
        fragment = this.fragment;
      } else if (fragment === null) {
        fragment = _empty;
      }
      if (scheme === this.scheme && authority === this.authority && path === this.path && query === this.query && fragment === this.fragment) {
        return this;
      }
      return new Uri(scheme, authority, path, query, fragment);
    }
    // ---- parse & validate ------------------------
    /**
     * Creates a new URI from a string, e.g. `http://www.example.com/some/path`,
     * `file:///usr/home`, or `scheme:with/path`.
     *
     * @param value A string which represents an URI (see `URI#toString`).
     */
    static parse(value, _strict = false) {
      const match = _regexp.exec(value);
      if (!match) {
        return new Uri(_empty, _empty, _empty, _empty, _empty);
      }
      return new Uri(match[2] || _empty, percentDecode(match[4] || _empty), percentDecode(match[5] || _empty), percentDecode(match[7] || _empty), percentDecode(match[9] || _empty), _strict);
    }
    /**
     * Creates a new URI from a file system path, e.g. `c:\my\files`,
     * `/usr/home`, or `\\server\share\some\path`.
     *
     * The *difference* between `URI#parse` and `URI#file` is that the latter treats the argument
     * as path, not as stringified-uri. E.g. `URI.file(path)` is **not the same as**
     * `URI.parse('file://' + path)` because the path might contain characters that are
     * interpreted (# and ?). See the following sample:
     * ```ts
    const good = URI.file('/coding/c#/project1');
    good.scheme === 'file';
    good.path === '/coding/c#/project1';
    good.fragment === '';
    const bad = URI.parse('file://' + '/coding/c#/project1');
    bad.scheme === 'file';
    bad.path === '/coding/c'; // path is now broken
    bad.fragment === '/project1';
    ```
     *
     * @param path A file system path (see `URI#fsPath`)
     */
    static file(path) {
      let authority = _empty;
      if (isWindows) {
        path = path.replace(/\\/g, _slash);
      }
      if (path[0] === _slash && path[1] === _slash) {
        const idx = path.indexOf(_slash, 2);
        if (idx === -1) {
          authority = path.substring(2);
          path = _slash;
        } else {
          authority = path.substring(2, idx);
          path = path.substring(idx) || _slash;
        }
      }
      return new Uri("file", authority, path, _empty, _empty);
    }
    /**
     * Creates new URI from uri components.
     *
     * Unless `strict` is `true` the scheme is defaults to be `file`. This function performs
     * validation and should be used for untrusted uri components retrieved from storage,
     * user input, command arguments etc
     */
    static from(components, strict) {
      const result = new Uri(components.scheme, components.authority, components.path, components.query, components.fragment, strict);
      return result;
    }
    /**
     * Join a URI path with path fragments and normalizes the resulting path.
     *
     * @param uri The input URI.
     * @param pathFragment The path fragment to add to the URI path.
     * @returns The resulting URI.
     */
    static joinPath(uri, ...pathFragment) {
      if (!uri.path) {
        throw new Error(`[UriError]: cannot call joinPath on URI without path`);
      }
      let newPath;
      if (isWindows && uri.scheme === "file") {
        newPath = URI.file(win32.join(uriToFsPath(uri, true), ...pathFragment)).path;
      } else {
        newPath = posix.join(uri.path, ...pathFragment);
      }
      return uri.with({ path: newPath });
    }
    // ---- printing/externalize ---------------------------
    /**
     * Creates a string representation for this URI. It's guaranteed that calling
     * `URI.parse` with the result of this function creates an URI which is equal
     * to this URI.
     *
     * * The result shall *not* be used for display purposes but for externalization or transport.
     * * The result will be encoded using the percentage encoding and encoding happens mostly
     * ignore the scheme-specific encoding rules.
     *
     * @param skipEncoding Do not encode the result, default is `false`
     */
    toString(skipEncoding = false) {
      return _asFormatted(this, skipEncoding);
    }
    toJSON() {
      return this;
    }
    static revive(data) {
      if (!data) {
        return data;
      } else if (data instanceof URI) {
        return data;
      } else {
        const result = new Uri(data);
        result._formatted = data.external ?? null;
        result._fsPath = data._sep === _pathSepMarker ? data.fsPath ?? null : null;
        return result;
      }
    }
  }
  const _pathSepMarker = isWindows ? 1 : void 0;
  class Uri extends URI {
    constructor() {
      super(...arguments);
      this._formatted = null;
      this._fsPath = null;
    }
    get fsPath() {
      if (!this._fsPath) {
        this._fsPath = uriToFsPath(this, false);
      }
      return this._fsPath;
    }
    toString(skipEncoding = false) {
      if (!skipEncoding) {
        if (!this._formatted) {
          this._formatted = _asFormatted(this, false);
        }
        return this._formatted;
      } else {
        return _asFormatted(this, true);
      }
    }
    toJSON() {
      const res = {
        $mid: 1
        /* MarshalledId.Uri */
      };
      if (this._fsPath) {
        res.fsPath = this._fsPath;
        res._sep = _pathSepMarker;
      }
      if (this._formatted) {
        res.external = this._formatted;
      }
      if (this.path) {
        res.path = this.path;
      }
      if (this.scheme) {
        res.scheme = this.scheme;
      }
      if (this.authority) {
        res.authority = this.authority;
      }
      if (this.query) {
        res.query = this.query;
      }
      if (this.fragment) {
        res.fragment = this.fragment;
      }
      return res;
    }
  }
  const encodeTable = {
    [
      58
      /* CharCode.Colon */
    ]: "%3A",
    // gen-delims
    [
      47
      /* CharCode.Slash */
    ]: "%2F",
    [
      63
      /* CharCode.QuestionMark */
    ]: "%3F",
    [
      35
      /* CharCode.Hash */
    ]: "%23",
    [
      91
      /* CharCode.OpenSquareBracket */
    ]: "%5B",
    [
      93
      /* CharCode.CloseSquareBracket */
    ]: "%5D",
    [
      64
      /* CharCode.AtSign */
    ]: "%40",
    [
      33
      /* CharCode.ExclamationMark */
    ]: "%21",
    // sub-delims
    [
      36
      /* CharCode.DollarSign */
    ]: "%24",
    [
      38
      /* CharCode.Ampersand */
    ]: "%26",
    [
      39
      /* CharCode.SingleQuote */
    ]: "%27",
    [
      40
      /* CharCode.OpenParen */
    ]: "%28",
    [
      41
      /* CharCode.CloseParen */
    ]: "%29",
    [
      42
      /* CharCode.Asterisk */
    ]: "%2A",
    [
      43
      /* CharCode.Plus */
    ]: "%2B",
    [
      44
      /* CharCode.Comma */
    ]: "%2C",
    [
      59
      /* CharCode.Semicolon */
    ]: "%3B",
    [
      61
      /* CharCode.Equals */
    ]: "%3D",
    [
      32
      /* CharCode.Space */
    ]: "%20"
  };
  function encodeURIComponentFast(uriComponent, isPath, isAuthority) {
    let res = void 0;
    let nativeEncodePos = -1;
    for (let pos = 0; pos < uriComponent.length; pos++) {
      const code = uriComponent.charCodeAt(pos);
      if (code >= 97 && code <= 122 || code >= 65 && code <= 90 || code >= 48 && code <= 57 || code === 45 || code === 46 || code === 95 || code === 126 || isPath && code === 47 || isAuthority && code === 91 || isAuthority && code === 93 || isAuthority && code === 58) {
        if (nativeEncodePos !== -1) {
          res += encodeURIComponent(uriComponent.substring(nativeEncodePos, pos));
          nativeEncodePos = -1;
        }
        if (res !== void 0) {
          res += uriComponent.charAt(pos);
        }
      } else {
        if (res === void 0) {
          res = uriComponent.substr(0, pos);
        }
        const escaped = encodeTable[code];
        if (escaped !== void 0) {
          if (nativeEncodePos !== -1) {
            res += encodeURIComponent(uriComponent.substring(nativeEncodePos, pos));
            nativeEncodePos = -1;
          }
          res += escaped;
        } else if (nativeEncodePos === -1) {
          nativeEncodePos = pos;
        }
      }
    }
    if (nativeEncodePos !== -1) {
      res += encodeURIComponent(uriComponent.substring(nativeEncodePos));
    }
    return res !== void 0 ? res : uriComponent;
  }
  function encodeURIComponentMinimal(path) {
    let res = void 0;
    for (let pos = 0; pos < path.length; pos++) {
      const code = path.charCodeAt(pos);
      if (code === 35 || code === 63) {
        if (res === void 0) {
          res = path.substr(0, pos);
        }
        res += encodeTable[code];
      } else {
        if (res !== void 0) {
          res += path[pos];
        }
      }
    }
    return res !== void 0 ? res : path;
  }
  function uriToFsPath(uri, keepDriveLetterCasing) {
    let value;
    if (uri.authority && uri.path.length > 1 && uri.scheme === "file") {
      value = `//${uri.authority}${uri.path}`;
    } else if (uri.path.charCodeAt(0) === 47 && (uri.path.charCodeAt(1) >= 65 && uri.path.charCodeAt(1) <= 90 || uri.path.charCodeAt(1) >= 97 && uri.path.charCodeAt(1) <= 122) && uri.path.charCodeAt(2) === 58) {
      if (!keepDriveLetterCasing) {
        value = uri.path[1].toLowerCase() + uri.path.substr(2);
      } else {
        value = uri.path.substr(1);
      }
    } else {
      value = uri.path;
    }
    if (isWindows) {
      value = value.replace(/\//g, "\\");
    }
    return value;
  }
  function _asFormatted(uri, skipEncoding) {
    const encoder = !skipEncoding ? encodeURIComponentFast : encodeURIComponentMinimal;
    let res = "";
    let { scheme, authority, path, query, fragment } = uri;
    if (scheme) {
      res += scheme;
      res += ":";
    }
    if (authority || scheme === "file") {
      res += _slash;
      res += _slash;
    }
    if (authority) {
      let idx = authority.indexOf("@");
      if (idx !== -1) {
        const userinfo = authority.substr(0, idx);
        authority = authority.substr(idx + 1);
        idx = userinfo.lastIndexOf(":");
        if (idx === -1) {
          res += encoder(userinfo, false, false);
        } else {
          res += encoder(userinfo.substr(0, idx), false, false);
          res += ":";
          res += encoder(userinfo.substr(idx + 1), false, true);
        }
        res += "@";
      }
      authority = authority.toLowerCase();
      idx = authority.lastIndexOf(":");
      if (idx === -1) {
        res += encoder(authority, false, true);
      } else {
        res += encoder(authority.substr(0, idx), false, true);
        res += authority.substr(idx);
      }
    }
    if (path) {
      if (path.length >= 3 && path.charCodeAt(0) === 47 && path.charCodeAt(2) === 58) {
        const code = path.charCodeAt(1);
        if (code >= 65 && code <= 90) {
          path = `/${String.fromCharCode(code + 32)}:${path.substr(3)}`;
        }
      } else if (path.length >= 2 && path.charCodeAt(1) === 58) {
        const code = path.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          path = `${String.fromCharCode(code + 32)}:${path.substr(2)}`;
        }
      }
      res += encoder(path, true, false);
    }
    if (query) {
      res += "?";
      res += encoder(query, false, false);
    }
    if (fragment) {
      res += "#";
      res += !skipEncoding ? encodeURIComponentFast(fragment, false, false) : fragment;
    }
    return res;
  }
  function decodeURIComponentGraceful(str) {
    try {
      return decodeURIComponent(str);
    } catch {
      if (str.length > 3) {
        return str.substr(0, 3) + decodeURIComponentGraceful(str.substr(3));
      } else {
        return str;
      }
    }
  }
  const _rEncodedAsHex = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
  function percentDecode(str) {
    if (!str.match(_rEncodedAsHex)) {
      return str;
    }
    return str.replace(_rEncodedAsHex, (match) => decodeURIComponentGraceful(match));
  }
  class Position {
    constructor(lineNumber, column) {
      this.lineNumber = lineNumber;
      this.column = column;
    }
    /**
     * Create a new position from this position.
     *
     * @param newLineNumber new line number
     * @param newColumn new column
     */
    with(newLineNumber = this.lineNumber, newColumn = this.column) {
      if (newLineNumber === this.lineNumber && newColumn === this.column) {
        return this;
      } else {
        return new Position(newLineNumber, newColumn);
      }
    }
    /**
     * Derive a new position from this position.
     *
     * @param deltaLineNumber line number delta
     * @param deltaColumn column delta
     */
    delta(deltaLineNumber = 0, deltaColumn = 0) {
      return this.with(Math.max(1, this.lineNumber + deltaLineNumber), Math.max(1, this.column + deltaColumn));
    }
    /**
     * Test if this position equals other position
     */
    equals(other) {
      return Position.equals(this, other);
    }
    /**
     * Test if position `a` equals position `b`
     */
    static equals(a, b) {
      if (!a && !b) {
        return true;
      }
      return !!a && !!b && a.lineNumber === b.lineNumber && a.column === b.column;
    }
    /**
     * Test if this position is before other position.
     * If the two positions are equal, the result will be false.
     */
    isBefore(other) {
      return Position.isBefore(this, other);
    }
    /**
     * Test if position `a` is before position `b`.
     * If the two positions are equal, the result will be false.
     */
    static isBefore(a, b) {
      if (a.lineNumber < b.lineNumber) {
        return true;
      }
      if (b.lineNumber < a.lineNumber) {
        return false;
      }
      return a.column < b.column;
    }
    /**
     * Test if this position is before other position.
     * If the two positions are equal, the result will be true.
     */
    isBeforeOrEqual(other) {
      return Position.isBeforeOrEqual(this, other);
    }
    /**
     * Test if position `a` is before position `b`.
     * If the two positions are equal, the result will be true.
     */
    static isBeforeOrEqual(a, b) {
      if (a.lineNumber < b.lineNumber) {
        return true;
      }
      if (b.lineNumber < a.lineNumber) {
        return false;
      }
      return a.column <= b.column;
    }
    /**
     * A function that compares positions, useful for sorting
     */
    static compare(a, b) {
      const aLineNumber = a.lineNumber | 0;
      const bLineNumber = b.lineNumber | 0;
      if (aLineNumber === bLineNumber) {
        const aColumn = a.column | 0;
        const bColumn = b.column | 0;
        return aColumn - bColumn;
      }
      return aLineNumber - bLineNumber;
    }
    /**
     * Clone this position.
     */
    clone() {
      return new Position(this.lineNumber, this.column);
    }
    /**
     * Convert to a human-readable representation.
     */
    toString() {
      return "(" + this.lineNumber + "," + this.column + ")";
    }
    // ---
    /**
     * Create a `Position` from an `IPosition`.
     */
    static lift(pos) {
      return new Position(pos.lineNumber, pos.column);
    }
    /**
     * Test if `obj` is an `IPosition`.
     */
    static isIPosition(obj) {
      return !!obj && typeof obj.lineNumber === "number" && typeof obj.column === "number";
    }
    toJSON() {
      return {
        lineNumber: this.lineNumber,
        column: this.column
      };
    }
  }
  class Range {
    constructor(startLineNumber, startColumn, endLineNumber, endColumn) {
      if (startLineNumber > endLineNumber || startLineNumber === endLineNumber && startColumn > endColumn) {
        this.startLineNumber = endLineNumber;
        this.startColumn = endColumn;
        this.endLineNumber = startLineNumber;
        this.endColumn = startColumn;
      } else {
        this.startLineNumber = startLineNumber;
        this.startColumn = startColumn;
        this.endLineNumber = endLineNumber;
        this.endColumn = endColumn;
      }
    }
    /**
     * Test if this range is empty.
     */
    isEmpty() {
      return Range.isEmpty(this);
    }
    /**
     * Test if `range` is empty.
     */
    static isEmpty(range2) {
      return range2.startLineNumber === range2.endLineNumber && range2.startColumn === range2.endColumn;
    }
    /**
     * Test if position is in this range. If the position is at the edges, will return true.
     */
    containsPosition(position) {
      return Range.containsPosition(this, position);
    }
    /**
     * Test if `position` is in `range`. If the position is at the edges, will return true.
     */
    static containsPosition(range2, position) {
      if (position.lineNumber < range2.startLineNumber || position.lineNumber > range2.endLineNumber) {
        return false;
      }
      if (position.lineNumber === range2.startLineNumber && position.column < range2.startColumn) {
        return false;
      }
      if (position.lineNumber === range2.endLineNumber && position.column > range2.endColumn) {
        return false;
      }
      return true;
    }
    /**
     * Test if `position` is in `range`. If the position is at the edges, will return false.
     * @internal
     */
    static strictContainsPosition(range2, position) {
      if (position.lineNumber < range2.startLineNumber || position.lineNumber > range2.endLineNumber) {
        return false;
      }
      if (position.lineNumber === range2.startLineNumber && position.column <= range2.startColumn) {
        return false;
      }
      if (position.lineNumber === range2.endLineNumber && position.column >= range2.endColumn) {
        return false;
      }
      return true;
    }
    /**
     * Test if range is in this range. If the range is equal to this range, will return true.
     */
    containsRange(range2) {
      return Range.containsRange(this, range2);
    }
    /**
     * Test if `otherRange` is in `range`. If the ranges are equal, will return true.
     */
    static containsRange(range2, otherRange) {
      if (otherRange.startLineNumber < range2.startLineNumber || otherRange.endLineNumber < range2.startLineNumber) {
        return false;
      }
      if (otherRange.startLineNumber > range2.endLineNumber || otherRange.endLineNumber > range2.endLineNumber) {
        return false;
      }
      if (otherRange.startLineNumber === range2.startLineNumber && otherRange.startColumn < range2.startColumn) {
        return false;
      }
      if (otherRange.endLineNumber === range2.endLineNumber && otherRange.endColumn > range2.endColumn) {
        return false;
      }
      return true;
    }
    /**
     * Test if `range` is strictly in this range. `range` must start after and end before this range for the result to be true.
     */
    strictContainsRange(range2) {
      return Range.strictContainsRange(this, range2);
    }
    /**
     * Test if `otherRange` is strictly in `range` (must start after, and end before). If the ranges are equal, will return false.
     */
    static strictContainsRange(range2, otherRange) {
      if (otherRange.startLineNumber < range2.startLineNumber || otherRange.endLineNumber < range2.startLineNumber) {
        return false;
      }
      if (otherRange.startLineNumber > range2.endLineNumber || otherRange.endLineNumber > range2.endLineNumber) {
        return false;
      }
      if (otherRange.startLineNumber === range2.startLineNumber && otherRange.startColumn <= range2.startColumn) {
        return false;
      }
      if (otherRange.endLineNumber === range2.endLineNumber && otherRange.endColumn >= range2.endColumn) {
        return false;
      }
      return true;
    }
    /**
     * A reunion of the two ranges.
     * The smallest position will be used as the start point, and the largest one as the end point.
     */
    plusRange(range2) {
      return Range.plusRange(this, range2);
    }
    /**
     * A reunion of the two ranges.
     * The smallest position will be used as the start point, and the largest one as the end point.
     */
    static plusRange(a, b) {
      let startLineNumber;
      let startColumn;
      let endLineNumber;
      let endColumn;
      if (b.startLineNumber < a.startLineNumber) {
        startLineNumber = b.startLineNumber;
        startColumn = b.startColumn;
      } else if (b.startLineNumber === a.startLineNumber) {
        startLineNumber = b.startLineNumber;
        startColumn = Math.min(b.startColumn, a.startColumn);
      } else {
        startLineNumber = a.startLineNumber;
        startColumn = a.startColumn;
      }
      if (b.endLineNumber > a.endLineNumber) {
        endLineNumber = b.endLineNumber;
        endColumn = b.endColumn;
      } else if (b.endLineNumber === a.endLineNumber) {
        endLineNumber = b.endLineNumber;
        endColumn = Math.max(b.endColumn, a.endColumn);
      } else {
        endLineNumber = a.endLineNumber;
        endColumn = a.endColumn;
      }
      return new Range(startLineNumber, startColumn, endLineNumber, endColumn);
    }
    /**
     * A intersection of the two ranges.
     */
    intersectRanges(range2) {
      return Range.intersectRanges(this, range2);
    }
    /**
     * A intersection of the two ranges.
     */
    static intersectRanges(a, b) {
      let resultStartLineNumber = a.startLineNumber;
      let resultStartColumn = a.startColumn;
      let resultEndLineNumber = a.endLineNumber;
      let resultEndColumn = a.endColumn;
      const otherStartLineNumber = b.startLineNumber;
      const otherStartColumn = b.startColumn;
      const otherEndLineNumber = b.endLineNumber;
      const otherEndColumn = b.endColumn;
      if (resultStartLineNumber < otherStartLineNumber) {
        resultStartLineNumber = otherStartLineNumber;
        resultStartColumn = otherStartColumn;
      } else if (resultStartLineNumber === otherStartLineNumber) {
        resultStartColumn = Math.max(resultStartColumn, otherStartColumn);
      }
      if (resultEndLineNumber > otherEndLineNumber) {
        resultEndLineNumber = otherEndLineNumber;
        resultEndColumn = otherEndColumn;
      } else if (resultEndLineNumber === otherEndLineNumber) {
        resultEndColumn = Math.min(resultEndColumn, otherEndColumn);
      }
      if (resultStartLineNumber > resultEndLineNumber) {
        return null;
      }
      if (resultStartLineNumber === resultEndLineNumber && resultStartColumn > resultEndColumn) {
        return null;
      }
      return new Range(resultStartLineNumber, resultStartColumn, resultEndLineNumber, resultEndColumn);
    }
    /**
     * Test if this range equals other.
     */
    equalsRange(other) {
      return Range.equalsRange(this, other);
    }
    /**
     * Test if range `a` equals `b`.
     */
    static equalsRange(a, b) {
      if (!a && !b) {
        return true;
      }
      return !!a && !!b && a.startLineNumber === b.startLineNumber && a.startColumn === b.startColumn && a.endLineNumber === b.endLineNumber && a.endColumn === b.endColumn;
    }
    /**
     * Return the end position (which will be after or equal to the start position)
     */
    getEndPosition() {
      return Range.getEndPosition(this);
    }
    /**
     * Return the end position (which will be after or equal to the start position)
     */
    static getEndPosition(range2) {
      return new Position(range2.endLineNumber, range2.endColumn);
    }
    /**
     * Return the start position (which will be before or equal to the end position)
     */
    getStartPosition() {
      return Range.getStartPosition(this);
    }
    /**
     * Return the start position (which will be before or equal to the end position)
     */
    static getStartPosition(range2) {
      return new Position(range2.startLineNumber, range2.startColumn);
    }
    /**
     * Transform to a user presentable string representation.
     */
    toString() {
      return "[" + this.startLineNumber + "," + this.startColumn + " -> " + this.endLineNumber + "," + this.endColumn + "]";
    }
    /**
     * Create a new range using this range's start position, and using endLineNumber and endColumn as the end position.
     */
    setEndPosition(endLineNumber, endColumn) {
      return new Range(this.startLineNumber, this.startColumn, endLineNumber, endColumn);
    }
    /**
     * Create a new range using this range's end position, and using startLineNumber and startColumn as the start position.
     */
    setStartPosition(startLineNumber, startColumn) {
      return new Range(startLineNumber, startColumn, this.endLineNumber, this.endColumn);
    }
    /**
     * Create a new empty range using this range's start position.
     */
    collapseToStart() {
      return Range.collapseToStart(this);
    }
    /**
     * Create a new empty range using this range's start position.
     */
    static collapseToStart(range2) {
      return new Range(range2.startLineNumber, range2.startColumn, range2.startLineNumber, range2.startColumn);
    }
    /**
     * Create a new empty range using this range's end position.
     */
    collapseToEnd() {
      return Range.collapseToEnd(this);
    }
    /**
     * Create a new empty range using this range's end position.
     */
    static collapseToEnd(range2) {
      return new Range(range2.endLineNumber, range2.endColumn, range2.endLineNumber, range2.endColumn);
    }
    /**
     * Moves the range by the given amount of lines.
     */
    delta(lineCount) {
      return new Range(this.startLineNumber + lineCount, this.startColumn, this.endLineNumber + lineCount, this.endColumn);
    }
    /**
     * Test if this range starts and ends on the same line.
     */
    isSingleLine() {
      return this.startLineNumber === this.endLineNumber;
    }
    // ---
    static fromPositions(start, end = start) {
      return new Range(start.lineNumber, start.column, end.lineNumber, end.column);
    }
    static lift(range2) {
      if (!range2) {
        return null;
      }
      return new Range(range2.startLineNumber, range2.startColumn, range2.endLineNumber, range2.endColumn);
    }
    /**
     * Test if `obj` is an `IRange`.
     */
    static isIRange(obj) {
      return !!obj && typeof obj.startLineNumber === "number" && typeof obj.startColumn === "number" && typeof obj.endLineNumber === "number" && typeof obj.endColumn === "number";
    }
    /**
     * Test if the two ranges are touching in any way.
     */
    static areIntersectingOrTouching(a, b) {
      if (a.endLineNumber < b.startLineNumber || a.endLineNumber === b.startLineNumber && a.endColumn < b.startColumn) {
        return false;
      }
      if (b.endLineNumber < a.startLineNumber || b.endLineNumber === a.startLineNumber && b.endColumn < a.startColumn) {
        return false;
      }
      return true;
    }
    /**
     * Test if the two ranges are intersecting. If the ranges are touching it returns true.
     */
    static areIntersecting(a, b) {
      if (a.endLineNumber < b.startLineNumber || a.endLineNumber === b.startLineNumber && a.endColumn <= b.startColumn) {
        return false;
      }
      if (b.endLineNumber < a.startLineNumber || b.endLineNumber === a.startLineNumber && b.endColumn <= a.startColumn) {
        return false;
      }
      return true;
    }
    /**
     * Test if the two ranges are intersecting, but not touching at all.
     */
    static areOnlyIntersecting(a, b) {
      if (a.endLineNumber < b.startLineNumber - 1 || a.endLineNumber === b.startLineNumber && a.endColumn < b.startColumn - 1) {
        return false;
      }
      if (b.endLineNumber < a.startLineNumber - 1 || b.endLineNumber === a.startLineNumber && b.endColumn < a.startColumn - 1) {
        return false;
      }
      return true;
    }
    /**
     * A function that compares ranges, useful for sorting ranges
     * It will first compare ranges on the startPosition and then on the endPosition
     */
    static compareRangesUsingStarts(a, b) {
      if (a && b) {
        const aStartLineNumber = a.startLineNumber | 0;
        const bStartLineNumber = b.startLineNumber | 0;
        if (aStartLineNumber === bStartLineNumber) {
          const aStartColumn = a.startColumn | 0;
          const bStartColumn = b.startColumn | 0;
          if (aStartColumn === bStartColumn) {
            const aEndLineNumber = a.endLineNumber | 0;
            const bEndLineNumber = b.endLineNumber | 0;
            if (aEndLineNumber === bEndLineNumber) {
              const aEndColumn = a.endColumn | 0;
              const bEndColumn = b.endColumn | 0;
              return aEndColumn - bEndColumn;
            }
            return aEndLineNumber - bEndLineNumber;
          }
          return aStartColumn - bStartColumn;
        }
        return aStartLineNumber - bStartLineNumber;
      }
      const aExists = a ? 1 : 0;
      const bExists = b ? 1 : 0;
      return aExists - bExists;
    }
    /**
     * A function that compares ranges, useful for sorting ranges
     * It will first compare ranges on the endPosition and then on the startPosition
     */
    static compareRangesUsingEnds(a, b) {
      if (a.endLineNumber === b.endLineNumber) {
        if (a.endColumn === b.endColumn) {
          if (a.startLineNumber === b.startLineNumber) {
            return a.startColumn - b.startColumn;
          }
          return a.startLineNumber - b.startLineNumber;
        }
        return a.endColumn - b.endColumn;
      }
      return a.endLineNumber - b.endLineNumber;
    }
    /**
     * Test if the range spans multiple lines.
     */
    static spansMultipleLines(range2) {
      return range2.endLineNumber > range2.startLineNumber;
    }
    toJSON() {
      return this;
    }
  }
  class Selection extends Range {
    constructor(selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn) {
      super(selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn);
      this.selectionStartLineNumber = selectionStartLineNumber;
      this.selectionStartColumn = selectionStartColumn;
      this.positionLineNumber = positionLineNumber;
      this.positionColumn = positionColumn;
    }
    /**
     * Transform to a human-readable representation.
     */
    toString() {
      return "[" + this.selectionStartLineNumber + "," + this.selectionStartColumn + " -> " + this.positionLineNumber + "," + this.positionColumn + "]";
    }
    /**
     * Test if equals other selection.
     */
    equalsSelection(other) {
      return Selection.selectionsEqual(this, other);
    }
    /**
     * Test if the two selections are equal.
     */
    static selectionsEqual(a, b) {
      return a.selectionStartLineNumber === b.selectionStartLineNumber && a.selectionStartColumn === b.selectionStartColumn && a.positionLineNumber === b.positionLineNumber && a.positionColumn === b.positionColumn;
    }
    /**
     * Get directions (LTR or RTL).
     */
    getDirection() {
      if (this.selectionStartLineNumber === this.startLineNumber && this.selectionStartColumn === this.startColumn) {
        return 0;
      }
      return 1;
    }
    /**
     * Create a new selection with a different `positionLineNumber` and `positionColumn`.
     */
    setEndPosition(endLineNumber, endColumn) {
      if (this.getDirection() === 0) {
        return new Selection(this.startLineNumber, this.startColumn, endLineNumber, endColumn);
      }
      return new Selection(endLineNumber, endColumn, this.startLineNumber, this.startColumn);
    }
    /**
     * Get the position at `positionLineNumber` and `positionColumn`.
     */
    getPosition() {
      return new Position(this.positionLineNumber, this.positionColumn);
    }
    /**
     * Get the position at the start of the selection.
    */
    getSelectionStart() {
      return new Position(this.selectionStartLineNumber, this.selectionStartColumn);
    }
    /**
     * Create a new selection with a different `selectionStartLineNumber` and `selectionStartColumn`.
     */
    setStartPosition(startLineNumber, startColumn) {
      if (this.getDirection() === 0) {
        return new Selection(startLineNumber, startColumn, this.endLineNumber, this.endColumn);
      }
      return new Selection(this.endLineNumber, this.endColumn, startLineNumber, startColumn);
    }
    // ----
    /**
     * Create a `Selection` from one or two positions
     */
    static fromPositions(start, end = start) {
      return new Selection(start.lineNumber, start.column, end.lineNumber, end.column);
    }
    /**
     * Creates a `Selection` from a range, given a direction.
     */
    static fromRange(range2, direction) {
      if (direction === 0) {
        return new Selection(range2.startLineNumber, range2.startColumn, range2.endLineNumber, range2.endColumn);
      } else {
        return new Selection(range2.endLineNumber, range2.endColumn, range2.startLineNumber, range2.startColumn);
      }
    }
    /**
     * Create a `Selection` from an `ISelection`.
     */
    static liftSelection(sel) {
      return new Selection(sel.selectionStartLineNumber, sel.selectionStartColumn, sel.positionLineNumber, sel.positionColumn);
    }
    /**
     * `a` equals `b`.
     */
    static selectionsArrEqual(a, b) {
      if (a && !b || !a && b) {
        return false;
      }
      if (!a && !b) {
        return true;
      }
      if (a.length !== b.length) {
        return false;
      }
      for (let i = 0, len = a.length; i < len; i++) {
        if (!this.selectionsEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    /**
     * Test if `obj` is an `ISelection`.
     */
    static isISelection(obj) {
      return !!obj && typeof obj.selectionStartLineNumber === "number" && typeof obj.selectionStartColumn === "number" && typeof obj.positionLineNumber === "number" && typeof obj.positionColumn === "number";
    }
    /**
     * Create with a direction.
     */
    static createWithDirection(startLineNumber, startColumn, endLineNumber, endColumn, direction) {
      if (direction === 0) {
        return new Selection(startLineNumber, startColumn, endLineNumber, endColumn);
      }
      return new Selection(endLineNumber, endColumn, startLineNumber, startColumn);
    }
  }
  const _codiconFontCharacters = /* @__PURE__ */ Object.create(null);
  function register(id, fontCharacter) {
    if (isString(fontCharacter)) {
      const val = _codiconFontCharacters[fontCharacter];
      if (val === void 0) {
        throw new Error(`${id} references an unknown codicon: ${fontCharacter}`);
      }
      fontCharacter = val;
    }
    _codiconFontCharacters[id] = fontCharacter;
    return { id };
  }
  function getCodiconFontCharacters() {
    return _codiconFontCharacters;
  }
  const codiconsLibrary = {
    add: register("add", 6e4),
    plus: register("plus", 6e4),
    gistNew: register("gist-new", 6e4),
    repoCreate: register("repo-create", 6e4),
    lightbulb: register("lightbulb", 60001),
    lightBulb: register("light-bulb", 60001),
    repo: register("repo", 60002),
    repoDelete: register("repo-delete", 60002),
    gistFork: register("gist-fork", 60003),
    repoForked: register("repo-forked", 60003),
    gitPullRequest: register("git-pull-request", 60004),
    gitPullRequestAbandoned: register("git-pull-request-abandoned", 60004),
    recordKeys: register("record-keys", 60005),
    keyboard: register("keyboard", 60005),
    tag: register("tag", 60006),
    gitPullRequestLabel: register("git-pull-request-label", 60006),
    tagAdd: register("tag-add", 60006),
    tagRemove: register("tag-remove", 60006),
    person: register("person", 60007),
    personFollow: register("person-follow", 60007),
    personOutline: register("person-outline", 60007),
    personFilled: register("person-filled", 60007),
    sourceControl: register("source-control", 60008),
    mirror: register("mirror", 60009),
    mirrorPublic: register("mirror-public", 60009),
    star: register("star", 60010),
    starAdd: register("star-add", 60010),
    starDelete: register("star-delete", 60010),
    starEmpty: register("star-empty", 60010),
    comment: register("comment", 60011),
    commentAdd: register("comment-add", 60011),
    alert: register("alert", 60012),
    warning: register("warning", 60012),
    search: register("search", 60013),
    searchSave: register("search-save", 60013),
    logOut: register("log-out", 60014),
    signOut: register("sign-out", 60014),
    logIn: register("log-in", 60015),
    signIn: register("sign-in", 60015),
    eye: register("eye", 60016),
    eyeUnwatch: register("eye-unwatch", 60016),
    eyeWatch: register("eye-watch", 60016),
    circleFilled: register("circle-filled", 60017),
    primitiveDot: register("primitive-dot", 60017),
    closeDirty: register("close-dirty", 60017),
    debugBreakpoint: register("debug-breakpoint", 60017),
    debugBreakpointDisabled: register("debug-breakpoint-disabled", 60017),
    debugHint: register("debug-hint", 60017),
    terminalDecorationSuccess: register("terminal-decoration-success", 60017),
    primitiveSquare: register("primitive-square", 60018),
    edit: register("edit", 60019),
    pencil: register("pencil", 60019),
    info: register("info", 60020),
    issueOpened: register("issue-opened", 60020),
    gistPrivate: register("gist-private", 60021),
    gitForkPrivate: register("git-fork-private", 60021),
    lock: register("lock", 60021),
    mirrorPrivate: register("mirror-private", 60021),
    close: register("close", 60022),
    removeClose: register("remove-close", 60022),
    x: register("x", 60022),
    repoSync: register("repo-sync", 60023),
    sync: register("sync", 60023),
    clone: register("clone", 60024),
    desktopDownload: register("desktop-download", 60024),
    beaker: register("beaker", 60025),
    microscope: register("microscope", 60025),
    vm: register("vm", 60026),
    deviceDesktop: register("device-desktop", 60026),
    file: register("file", 60027),
    more: register("more", 60028),
    ellipsis: register("ellipsis", 60028),
    kebabHorizontal: register("kebab-horizontal", 60028),
    mailReply: register("mail-reply", 60029),
    reply: register("reply", 60029),
    organization: register("organization", 60030),
    organizationFilled: register("organization-filled", 60030),
    organizationOutline: register("organization-outline", 60030),
    newFile: register("new-file", 60031),
    fileAdd: register("file-add", 60031),
    newFolder: register("new-folder", 60032),
    fileDirectoryCreate: register("file-directory-create", 60032),
    trash: register("trash", 60033),
    trashcan: register("trashcan", 60033),
    history: register("history", 60034),
    clock: register("clock", 60034),
    folder: register("folder", 60035),
    fileDirectory: register("file-directory", 60035),
    symbolFolder: register("symbol-folder", 60035),
    logoGithub: register("logo-github", 60036),
    markGithub: register("mark-github", 60036),
    github: register("github", 60036),
    terminal: register("terminal", 60037),
    console: register("console", 60037),
    repl: register("repl", 60037),
    zap: register("zap", 60038),
    symbolEvent: register("symbol-event", 60038),
    error: register("error", 60039),
    stop: register("stop", 60039),
    variable: register("variable", 60040),
    symbolVariable: register("symbol-variable", 60040),
    array: register("array", 60042),
    symbolArray: register("symbol-array", 60042),
    symbolModule: register("symbol-module", 60043),
    symbolPackage: register("symbol-package", 60043),
    symbolNamespace: register("symbol-namespace", 60043),
    symbolObject: register("symbol-object", 60043),
    symbolMethod: register("symbol-method", 60044),
    symbolFunction: register("symbol-function", 60044),
    symbolConstructor: register("symbol-constructor", 60044),
    symbolBoolean: register("symbol-boolean", 60047),
    symbolNull: register("symbol-null", 60047),
    symbolNumeric: register("symbol-numeric", 60048),
    symbolNumber: register("symbol-number", 60048),
    symbolStructure: register("symbol-structure", 60049),
    symbolStruct: register("symbol-struct", 60049),
    symbolParameter: register("symbol-parameter", 60050),
    symbolTypeParameter: register("symbol-type-parameter", 60050),
    symbolKey: register("symbol-key", 60051),
    symbolText: register("symbol-text", 60051),
    symbolReference: register("symbol-reference", 60052),
    goToFile: register("go-to-file", 60052),
    symbolEnum: register("symbol-enum", 60053),
    symbolValue: register("symbol-value", 60053),
    symbolRuler: register("symbol-ruler", 60054),
    symbolUnit: register("symbol-unit", 60054),
    activateBreakpoints: register("activate-breakpoints", 60055),
    archive: register("archive", 60056),
    arrowBoth: register("arrow-both", 60057),
    arrowDown: register("arrow-down", 60058),
    arrowLeft: register("arrow-left", 60059),
    arrowRight: register("arrow-right", 60060),
    arrowSmallDown: register("arrow-small-down", 60061),
    arrowSmallLeft: register("arrow-small-left", 60062),
    arrowSmallRight: register("arrow-small-right", 60063),
    arrowSmallUp: register("arrow-small-up", 60064),
    arrowUp: register("arrow-up", 60065),
    bell: register("bell", 60066),
    bold: register("bold", 60067),
    book: register("book", 60068),
    bookmark: register("bookmark", 60069),
    debugBreakpointConditionalUnverified: register("debug-breakpoint-conditional-unverified", 60070),
    debugBreakpointConditional: register("debug-breakpoint-conditional", 60071),
    debugBreakpointConditionalDisabled: register("debug-breakpoint-conditional-disabled", 60071),
    debugBreakpointDataUnverified: register("debug-breakpoint-data-unverified", 60072),
    debugBreakpointData: register("debug-breakpoint-data", 60073),
    debugBreakpointDataDisabled: register("debug-breakpoint-data-disabled", 60073),
    debugBreakpointLogUnverified: register("debug-breakpoint-log-unverified", 60074),
    debugBreakpointLog: register("debug-breakpoint-log", 60075),
    debugBreakpointLogDisabled: register("debug-breakpoint-log-disabled", 60075),
    briefcase: register("briefcase", 60076),
    broadcast: register("broadcast", 60077),
    browser: register("browser", 60078),
    bug: register("bug", 60079),
    calendar: register("calendar", 60080),
    caseSensitive: register("case-sensitive", 60081),
    check: register("check", 60082),
    checklist: register("checklist", 60083),
    chevronDown: register("chevron-down", 60084),
    chevronLeft: register("chevron-left", 60085),
    chevronRight: register("chevron-right", 60086),
    chevronUp: register("chevron-up", 60087),
    chromeClose: register("chrome-close", 60088),
    chromeMaximize: register("chrome-maximize", 60089),
    chromeMinimize: register("chrome-minimize", 60090),
    chromeRestore: register("chrome-restore", 60091),
    circleOutline: register("circle-outline", 60092),
    circle: register("circle", 60092),
    debugBreakpointUnverified: register("debug-breakpoint-unverified", 60092),
    terminalDecorationIncomplete: register("terminal-decoration-incomplete", 60092),
    circleSlash: register("circle-slash", 60093),
    circuitBoard: register("circuit-board", 60094),
    clearAll: register("clear-all", 60095),
    clippy: register("clippy", 60096),
    closeAll: register("close-all", 60097),
    cloudDownload: register("cloud-download", 60098),
    cloudUpload: register("cloud-upload", 60099),
    code: register("code", 60100),
    collapseAll: register("collapse-all", 60101),
    colorMode: register("color-mode", 60102),
    commentDiscussion: register("comment-discussion", 60103),
    creditCard: register("credit-card", 60105),
    dash: register("dash", 60108),
    dashboard: register("dashboard", 60109),
    database: register("database", 60110),
    debugContinue: register("debug-continue", 60111),
    debugDisconnect: register("debug-disconnect", 60112),
    debugPause: register("debug-pause", 60113),
    debugRestart: register("debug-restart", 60114),
    debugStart: register("debug-start", 60115),
    debugStepInto: register("debug-step-into", 60116),
    debugStepOut: register("debug-step-out", 60117),
    debugStepOver: register("debug-step-over", 60118),
    debugStop: register("debug-stop", 60119),
    debug: register("debug", 60120),
    deviceCameraVideo: register("device-camera-video", 60121),
    deviceCamera: register("device-camera", 60122),
    deviceMobile: register("device-mobile", 60123),
    diffAdded: register("diff-added", 60124),
    diffIgnored: register("diff-ignored", 60125),
    diffModified: register("diff-modified", 60126),
    diffRemoved: register("diff-removed", 60127),
    diffRenamed: register("diff-renamed", 60128),
    diff: register("diff", 60129),
    diffSidebyside: register("diff-sidebyside", 60129),
    discard: register("discard", 60130),
    editorLayout: register("editor-layout", 60131),
    emptyWindow: register("empty-window", 60132),
    exclude: register("exclude", 60133),
    extensions: register("extensions", 60134),
    eyeClosed: register("eye-closed", 60135),
    fileBinary: register("file-binary", 60136),
    fileCode: register("file-code", 60137),
    fileMedia: register("file-media", 60138),
    filePdf: register("file-pdf", 60139),
    fileSubmodule: register("file-submodule", 60140),
    fileSymlinkDirectory: register("file-symlink-directory", 60141),
    fileSymlinkFile: register("file-symlink-file", 60142),
    fileZip: register("file-zip", 60143),
    files: register("files", 60144),
    filter: register("filter", 60145),
    flame: register("flame", 60146),
    foldDown: register("fold-down", 60147),
    foldUp: register("fold-up", 60148),
    fold: register("fold", 60149),
    folderActive: register("folder-active", 60150),
    folderOpened: register("folder-opened", 60151),
    gear: register("gear", 60152),
    gift: register("gift", 60153),
    gistSecret: register("gist-secret", 60154),
    gist: register("gist", 60155),
    gitCommit: register("git-commit", 60156),
    gitCompare: register("git-compare", 60157),
    compareChanges: register("compare-changes", 60157),
    gitMerge: register("git-merge", 60158),
    githubAction: register("github-action", 60159),
    githubAlt: register("github-alt", 60160),
    globe: register("globe", 60161),
    grabber: register("grabber", 60162),
    graph: register("graph", 60163),
    gripper: register("gripper", 60164),
    heart: register("heart", 60165),
    home: register("home", 60166),
    horizontalRule: register("horizontal-rule", 60167),
    hubot: register("hubot", 60168),
    inbox: register("inbox", 60169),
    issueReopened: register("issue-reopened", 60171),
    issues: register("issues", 60172),
    italic: register("italic", 60173),
    jersey: register("jersey", 60174),
    json: register("json", 60175),
    bracket: register("bracket", 60175),
    kebabVertical: register("kebab-vertical", 60176),
    key: register("key", 60177),
    law: register("law", 60178),
    lightbulbAutofix: register("lightbulb-autofix", 60179),
    linkExternal: register("link-external", 60180),
    link: register("link", 60181),
    listOrdered: register("list-ordered", 60182),
    listUnordered: register("list-unordered", 60183),
    liveShare: register("live-share", 60184),
    loading: register("loading", 60185),
    location: register("location", 60186),
    mailRead: register("mail-read", 60187),
    mail: register("mail", 60188),
    markdown: register("markdown", 60189),
    megaphone: register("megaphone", 60190),
    mention: register("mention", 60191),
    milestone: register("milestone", 60192),
    gitPullRequestMilestone: register("git-pull-request-milestone", 60192),
    mortarBoard: register("mortar-board", 60193),
    move: register("move", 60194),
    multipleWindows: register("multiple-windows", 60195),
    mute: register("mute", 60196),
    noNewline: register("no-newline", 60197),
    note: register("note", 60198),
    octoface: register("octoface", 60199),
    openPreview: register("open-preview", 60200),
    package: register("package", 60201),
    paintcan: register("paintcan", 60202),
    pin: register("pin", 60203),
    play: register("play", 60204),
    run: register("run", 60204),
    plug: register("plug", 60205),
    preserveCase: register("preserve-case", 60206),
    preview: register("preview", 60207),
    project: register("project", 60208),
    pulse: register("pulse", 60209),
    question: register("question", 60210),
    quote: register("quote", 60211),
    radioTower: register("radio-tower", 60212),
    reactions: register("reactions", 60213),
    references: register("references", 60214),
    refresh: register("refresh", 60215),
    regex: register("regex", 60216),
    remoteExplorer: register("remote-explorer", 60217),
    remote: register("remote", 60218),
    remove: register("remove", 60219),
    replaceAll: register("replace-all", 60220),
    replace: register("replace", 60221),
    repoClone: register("repo-clone", 60222),
    repoForcePush: register("repo-force-push", 60223),
    repoPull: register("repo-pull", 60224),
    repoPush: register("repo-push", 60225),
    report: register("report", 60226),
    requestChanges: register("request-changes", 60227),
    rocket: register("rocket", 60228),
    rootFolderOpened: register("root-folder-opened", 60229),
    rootFolder: register("root-folder", 60230),
    rss: register("rss", 60231),
    ruby: register("ruby", 60232),
    saveAll: register("save-all", 60233),
    saveAs: register("save-as", 60234),
    save: register("save", 60235),
    screenFull: register("screen-full", 60236),
    screenNormal: register("screen-normal", 60237),
    searchStop: register("search-stop", 60238),
    server: register("server", 60240),
    settingsGear: register("settings-gear", 60241),
    settings: register("settings", 60242),
    shield: register("shield", 60243),
    smiley: register("smiley", 60244),
    sortPrecedence: register("sort-precedence", 60245),
    splitHorizontal: register("split-horizontal", 60246),
    splitVertical: register("split-vertical", 60247),
    squirrel: register("squirrel", 60248),
    starFull: register("star-full", 60249),
    starHalf: register("star-half", 60250),
    symbolClass: register("symbol-class", 60251),
    symbolColor: register("symbol-color", 60252),
    symbolConstant: register("symbol-constant", 60253),
    symbolEnumMember: register("symbol-enum-member", 60254),
    symbolField: register("symbol-field", 60255),
    symbolFile: register("symbol-file", 60256),
    symbolInterface: register("symbol-interface", 60257),
    symbolKeyword: register("symbol-keyword", 60258),
    symbolMisc: register("symbol-misc", 60259),
    symbolOperator: register("symbol-operator", 60260),
    symbolProperty: register("symbol-property", 60261),
    wrench: register("wrench", 60261),
    wrenchSubaction: register("wrench-subaction", 60261),
    symbolSnippet: register("symbol-snippet", 60262),
    tasklist: register("tasklist", 60263),
    telescope: register("telescope", 60264),
    textSize: register("text-size", 60265),
    threeBars: register("three-bars", 60266),
    thumbsdown: register("thumbsdown", 60267),
    thumbsup: register("thumbsup", 60268),
    tools: register("tools", 60269),
    triangleDown: register("triangle-down", 60270),
    triangleLeft: register("triangle-left", 60271),
    triangleRight: register("triangle-right", 60272),
    triangleUp: register("triangle-up", 60273),
    twitter: register("twitter", 60274),
    unfold: register("unfold", 60275),
    unlock: register("unlock", 60276),
    unmute: register("unmute", 60277),
    unverified: register("unverified", 60278),
    verified: register("verified", 60279),
    versions: register("versions", 60280),
    vmActive: register("vm-active", 60281),
    vmOutline: register("vm-outline", 60282),
    vmRunning: register("vm-running", 60283),
    watch: register("watch", 60284),
    whitespace: register("whitespace", 60285),
    wholeWord: register("whole-word", 60286),
    window: register("window", 60287),
    wordWrap: register("word-wrap", 60288),
    zoomIn: register("zoom-in", 60289),
    zoomOut: register("zoom-out", 60290),
    listFilter: register("list-filter", 60291),
    listFlat: register("list-flat", 60292),
    listSelection: register("list-selection", 60293),
    selection: register("selection", 60293),
    listTree: register("list-tree", 60294),
    debugBreakpointFunctionUnverified: register("debug-breakpoint-function-unverified", 60295),
    debugBreakpointFunction: register("debug-breakpoint-function", 60296),
    debugBreakpointFunctionDisabled: register("debug-breakpoint-function-disabled", 60296),
    debugStackframeActive: register("debug-stackframe-active", 60297),
    circleSmallFilled: register("circle-small-filled", 60298),
    debugStackframeDot: register("debug-stackframe-dot", 60298),
    terminalDecorationMark: register("terminal-decoration-mark", 60298),
    debugStackframe: register("debug-stackframe", 60299),
    debugStackframeFocused: register("debug-stackframe-focused", 60299),
    debugBreakpointUnsupported: register("debug-breakpoint-unsupported", 60300),
    symbolString: register("symbol-string", 60301),
    debugReverseContinue: register("debug-reverse-continue", 60302),
    debugStepBack: register("debug-step-back", 60303),
    debugRestartFrame: register("debug-restart-frame", 60304),
    debugAlt: register("debug-alt", 60305),
    callIncoming: register("call-incoming", 60306),
    callOutgoing: register("call-outgoing", 60307),
    menu: register("menu", 60308),
    expandAll: register("expand-all", 60309),
    feedback: register("feedback", 60310),
    gitPullRequestReviewer: register("git-pull-request-reviewer", 60310),
    groupByRefType: register("group-by-ref-type", 60311),
    ungroupByRefType: register("ungroup-by-ref-type", 60312),
    account: register("account", 60313),
    gitPullRequestAssignee: register("git-pull-request-assignee", 60313),
    bellDot: register("bell-dot", 60314),
    debugConsole: register("debug-console", 60315),
    library: register("library", 60316),
    output: register("output", 60317),
    runAll: register("run-all", 60318),
    syncIgnored: register("sync-ignored", 60319),
    pinned: register("pinned", 60320),
    githubInverted: register("github-inverted", 60321),
    serverProcess: register("server-process", 60322),
    serverEnvironment: register("server-environment", 60323),
    pass: register("pass", 60324),
    issueClosed: register("issue-closed", 60324),
    stopCircle: register("stop-circle", 60325),
    playCircle: register("play-circle", 60326),
    record: register("record", 60327),
    debugAltSmall: register("debug-alt-small", 60328),
    vmConnect: register("vm-connect", 60329),
    cloud: register("cloud", 60330),
    merge: register("merge", 60331),
    export: register("export", 60332),
    graphLeft: register("graph-left", 60333),
    magnet: register("magnet", 60334),
    notebook: register("notebook", 60335),
    redo: register("redo", 60336),
    checkAll: register("check-all", 60337),
    pinnedDirty: register("pinned-dirty", 60338),
    passFilled: register("pass-filled", 60339),
    circleLargeFilled: register("circle-large-filled", 60340),
    circleLarge: register("circle-large", 60341),
    circleLargeOutline: register("circle-large-outline", 60341),
    combine: register("combine", 60342),
    gather: register("gather", 60342),
    table: register("table", 60343),
    variableGroup: register("variable-group", 60344),
    typeHierarchy: register("type-hierarchy", 60345),
    typeHierarchySub: register("type-hierarchy-sub", 60346),
    typeHierarchySuper: register("type-hierarchy-super", 60347),
    gitPullRequestCreate: register("git-pull-request-create", 60348),
    runAbove: register("run-above", 60349),
    runBelow: register("run-below", 60350),
    notebookTemplate: register("notebook-template", 60351),
    debugRerun: register("debug-rerun", 60352),
    workspaceTrusted: register("workspace-trusted", 60353),
    workspaceUntrusted: register("workspace-untrusted", 60354),
    workspaceUnknown: register("workspace-unknown", 60355),
    terminalCmd: register("terminal-cmd", 60356),
    terminalDebian: register("terminal-debian", 60357),
    terminalLinux: register("terminal-linux", 60358),
    terminalPowershell: register("terminal-powershell", 60359),
    terminalTmux: register("terminal-tmux", 60360),
    terminalUbuntu: register("terminal-ubuntu", 60361),
    terminalBash: register("terminal-bash", 60362),
    arrowSwap: register("arrow-swap", 60363),
    copy: register("copy", 60364),
    personAdd: register("person-add", 60365),
    filterFilled: register("filter-filled", 60366),
    wand: register("wand", 60367),
    debugLineByLine: register("debug-line-by-line", 60368),
    inspect: register("inspect", 60369),
    layers: register("layers", 60370),
    layersDot: register("layers-dot", 60371),
    layersActive: register("layers-active", 60372),
    compass: register("compass", 60373),
    compassDot: register("compass-dot", 60374),
    compassActive: register("compass-active", 60375),
    azure: register("azure", 60376),
    issueDraft: register("issue-draft", 60377),
    gitPullRequestClosed: register("git-pull-request-closed", 60378),
    gitPullRequestDraft: register("git-pull-request-draft", 60379),
    debugAll: register("debug-all", 60380),
    debugCoverage: register("debug-coverage", 60381),
    runErrors: register("run-errors", 60382),
    folderLibrary: register("folder-library", 60383),
    debugContinueSmall: register("debug-continue-small", 60384),
    beakerStop: register("beaker-stop", 60385),
    graphLine: register("graph-line", 60386),
    graphScatter: register("graph-scatter", 60387),
    pieChart: register("pie-chart", 60388),
    bracketDot: register("bracket-dot", 60389),
    bracketError: register("bracket-error", 60390),
    lockSmall: register("lock-small", 60391),
    azureDevops: register("azure-devops", 60392),
    verifiedFilled: register("verified-filled", 60393),
    newline: register("newline", 60394),
    layout: register("layout", 60395),
    layoutActivitybarLeft: register("layout-activitybar-left", 60396),
    layoutActivitybarRight: register("layout-activitybar-right", 60397),
    layoutPanelLeft: register("layout-panel-left", 60398),
    layoutPanelCenter: register("layout-panel-center", 60399),
    layoutPanelJustify: register("layout-panel-justify", 60400),
    layoutPanelRight: register("layout-panel-right", 60401),
    layoutPanel: register("layout-panel", 60402),
    layoutSidebarLeft: register("layout-sidebar-left", 60403),
    layoutSidebarRight: register("layout-sidebar-right", 60404),
    layoutStatusbar: register("layout-statusbar", 60405),
    layoutMenubar: register("layout-menubar", 60406),
    layoutCentered: register("layout-centered", 60407),
    target: register("target", 60408),
    indent: register("indent", 60409),
    recordSmall: register("record-small", 60410),
    errorSmall: register("error-small", 60411),
    terminalDecorationError: register("terminal-decoration-error", 60411),
    arrowCircleDown: register("arrow-circle-down", 60412),
    arrowCircleLeft: register("arrow-circle-left", 60413),
    arrowCircleRight: register("arrow-circle-right", 60414),
    arrowCircleUp: register("arrow-circle-up", 60415),
    layoutSidebarRightOff: register("layout-sidebar-right-off", 60416),
    layoutPanelOff: register("layout-panel-off", 60417),
    layoutSidebarLeftOff: register("layout-sidebar-left-off", 60418),
    blank: register("blank", 60419),
    heartFilled: register("heart-filled", 60420),
    map: register("map", 60421),
    mapHorizontal: register("map-horizontal", 60421),
    foldHorizontal: register("fold-horizontal", 60421),
    mapFilled: register("map-filled", 60422),
    mapHorizontalFilled: register("map-horizontal-filled", 60422),
    foldHorizontalFilled: register("fold-horizontal-filled", 60422),
    circleSmall: register("circle-small", 60423),
    bellSlash: register("bell-slash", 60424),
    bellSlashDot: register("bell-slash-dot", 60425),
    commentUnresolved: register("comment-unresolved", 60426),
    gitPullRequestGoToChanges: register("git-pull-request-go-to-changes", 60427),
    gitPullRequestNewChanges: register("git-pull-request-new-changes", 60428),
    searchFuzzy: register("search-fuzzy", 60429),
    commentDraft: register("comment-draft", 60430),
    send: register("send", 60431),
    sparkle: register("sparkle", 60432),
    insert: register("insert", 60433),
    mic: register("mic", 60434),
    thumbsdownFilled: register("thumbsdown-filled", 60435),
    thumbsupFilled: register("thumbsup-filled", 60436),
    coffee: register("coffee", 60437),
    snake: register("snake", 60438),
    game: register("game", 60439),
    vr: register("vr", 60440),
    chip: register("chip", 60441),
    piano: register("piano", 60442),
    music: register("music", 60443),
    micFilled: register("mic-filled", 60444),
    repoFetch: register("repo-fetch", 60445),
    copilot: register("copilot", 60446),
    lightbulbSparkle: register("lightbulb-sparkle", 60447),
    robot: register("robot", 60448),
    sparkleFilled: register("sparkle-filled", 60449),
    diffSingle: register("diff-single", 60450),
    diffMultiple: register("diff-multiple", 60451),
    surroundWith: register("surround-with", 60452),
    share: register("share", 60453),
    gitStash: register("git-stash", 60454),
    gitStashApply: register("git-stash-apply", 60455),
    gitStashPop: register("git-stash-pop", 60456),
    vscode: register("vscode", 60457),
    vscodeInsiders: register("vscode-insiders", 60458),
    codeOss: register("code-oss", 60459),
    runCoverage: register("run-coverage", 60460),
    runAllCoverage: register("run-all-coverage", 60461),
    coverage: register("coverage", 60462),
    githubProject: register("github-project", 60463),
    mapVertical: register("map-vertical", 60464),
    foldVertical: register("fold-vertical", 60464),
    mapVerticalFilled: register("map-vertical-filled", 60465),
    foldVerticalFilled: register("fold-vertical-filled", 60465),
    goToSearch: register("go-to-search", 60466),
    percentage: register("percentage", 60467),
    sortPercentage: register("sort-percentage", 60467),
    attach: register("attach", 60468),
    goToEditingSession: register("go-to-editing-session", 60469),
    editSession: register("edit-session", 60470),
    codeReview: register("code-review", 60471),
    copilotWarning: register("copilot-warning", 60472),
    python: register("python", 60473),
    copilotLarge: register("copilot-large", 60474),
    copilotWarningLarge: register("copilot-warning-large", 60475),
    keyboardTab: register("keyboard-tab", 60476),
    copilotBlocked: register("copilot-blocked", 60477),
    copilotNotConnected: register("copilot-not-connected", 60478),
    flag: register("flag", 60479),
    lightbulbEmpty: register("lightbulb-empty", 60480),
    symbolMethodArrow: register("symbol-method-arrow", 60481),
    copilotUnavailable: register("copilot-unavailable", 60482),
    repoPinned: register("repo-pinned", 60483),
    keyboardTabAbove: register("keyboard-tab-above", 60484),
    keyboardTabBelow: register("keyboard-tab-below", 60485),
    gitPullRequestDone: register("git-pull-request-done", 60486),
    mcp: register("mcp", 60487),
    extensionsLarge: register("extensions-large", 60488),
    layoutPanelDock: register("layout-panel-dock", 60489),
    layoutSidebarLeftDock: register("layout-sidebar-left-dock", 60490),
    layoutSidebarRightDock: register("layout-sidebar-right-dock", 60491),
    copilotInProgress: register("copilot-in-progress", 60492),
    copilotError: register("copilot-error", 60493),
    copilotSuccess: register("copilot-success", 60494),
    chatSparkle: register("chat-sparkle", 60495),
    searchSparkle: register("search-sparkle", 60496),
    editSparkle: register("edit-sparkle", 60497),
    copilotSnooze: register("copilot-snooze", 60498),
    sendToRemoteAgent: register("send-to-remote-agent", 60499),
    commentDiscussionSparkle: register("comment-discussion-sparkle", 60500),
    chatSparkleWarning: register("chat-sparkle-warning", 60501),
    chatSparkleError: register("chat-sparkle-error", 60502),
    collection: register("collection", 60503),
    newCollection: register("new-collection", 60504),
    thinking: register("thinking", 60505),
    build: register("build", 60506),
    commentDiscussionQuote: register("comment-discussion-quote", 60507),
    cursor: register("cursor", 60508),
    eraser: register("eraser", 60509),
    fileText: register("file-text", 60510),
    quotes: register("quotes", 60512),
    rename: register("rename", 60513),
    runWithDeps: register("run-with-deps", 60514),
    debugConnected: register("debug-connected", 60515),
    strikethrough: register("strikethrough", 60516),
    openInProduct: register("open-in-product", 60517),
    indexZero: register("index-zero", 60518),
    agent: register("agent", 60519),
    editCode: register("edit-code", 60520),
    repoSelected: register("repo-selected", 60521),
    skip: register("skip", 60522),
    mergeInto: register("merge-into", 60523),
    gitBranchChanges: register("git-branch-changes", 60524),
    gitBranchStagedChanges: register("git-branch-staged-changes", 60525),
    gitBranchConflicts: register("git-branch-conflicts", 60526),
    gitBranch: register("git-branch", 60527),
    gitBranchCreate: register("git-branch-create", 60527),
    gitBranchDelete: register("git-branch-delete", 60527),
    searchLarge: register("search-large", 60528),
    terminalGitBash: register("terminal-git-bash", 60529),
    windowActive: register("window-active", 60530),
    forward: register("forward", 60531),
    download: register("download", 60532),
    clockface: register("clockface", 60533),
    unarchive: register("unarchive", 60534),
    sessionInProgress: register("session-in-progress", 60535),
    collectionSmall: register("collection-small", 60536),
    vmSmall: register("vm-small", 60537),
    cloudSmall: register("cloud-small", 60538),
    addSmall: register("add-small", 60539),
    removeSmall: register("remove-small", 60540),
    worktreeSmall: register("worktree-small", 60541),
    worktree: register("worktree", 60542),
    screenCut: register("screen-cut", 60543),
    ask: register("ask", 60544),
    openai: register("openai", 60545),
    claude: register("claude", 60546)
  };
  const codiconsDerived = {
    dialogError: register("dialog-error", "error"),
    dialogWarning: register("dialog-warning", "warning"),
    dialogInfo: register("dialog-info", "info"),
    dialogClose: register("dialog-close", "close"),
    treeItemExpanded: register("tree-item-expanded", "chevron-down"),
    // collapsed is done with rotation
    treeFilterOnTypeOn: register("tree-filter-on-type-on", "list-filter"),
    treeFilterOnTypeOff: register("tree-filter-on-type-off", "list-selection"),
    treeFilterClear: register("tree-filter-clear", "close"),
    treeItemLoading: register("tree-item-loading", "loading"),
    menuSelection: register("menu-selection", "check"),
    menuSubmenu: register("menu-submenu", "chevron-right"),
    menuBarMore: register("menubar-more", "more"),
    scrollbarButtonLeft: register("scrollbar-button-left", "triangle-left"),
    scrollbarButtonRight: register("scrollbar-button-right", "triangle-right"),
    scrollbarButtonUp: register("scrollbar-button-up", "triangle-up"),
    scrollbarButtonDown: register("scrollbar-button-down", "triangle-down"),
    toolBarMore: register("toolbar-more", "more"),
    quickInputBack: register("quick-input-back", "arrow-left"),
    dropDownButton: register("drop-down-button", 60084),
    symbolCustomColor: register("symbol-customcolor", 60252),
    exportIcon: register("export", 60332),
    workspaceUnspecified: register("workspace-unspecified", 60355),
    newLine: register("newline", 60394),
    thumbsDownFilled: register("thumbsdown-filled", 60435),
    thumbsUpFilled: register("thumbsup-filled", 60436),
    gitFetch: register("git-fetch", 60445),
    lightbulbSparkleAutofix: register("lightbulb-sparkle-autofix", 60447),
    debugBreakpointPending: register("debug-breakpoint-pending", 60377)
  };
  const Codicon = {
    ...codiconsLibrary,
    ...codiconsDerived
  };
  let TokenizationRegistry$1 = class TokenizationRegistry {
    constructor() {
      this._tokenizationSupports = /* @__PURE__ */ new Map();
      this._factories = /* @__PURE__ */ new Map();
      this._onDidChange = new Emitter();
      this.onDidChange = this._onDidChange.event;
      this._colorMap = null;
    }
    handleChange(languageIds) {
      this._onDidChange.fire({
        changedLanguages: languageIds,
        changedColorMap: false
      });
    }
    register(languageId, support) {
      this._tokenizationSupports.set(languageId, support);
      this.handleChange([languageId]);
      return toDisposable(() => {
        if (this._tokenizationSupports.get(languageId) !== support) {
          return;
        }
        this._tokenizationSupports.delete(languageId);
        this.handleChange([languageId]);
      });
    }
    get(languageId) {
      return this._tokenizationSupports.get(languageId) || null;
    }
    registerFactory(languageId, factory) {
      this._factories.get(languageId)?.dispose();
      const myData = new TokenizationSupportFactoryData(this, languageId, factory);
      this._factories.set(languageId, myData);
      return toDisposable(() => {
        const v = this._factories.get(languageId);
        if (!v || v !== myData) {
          return;
        }
        this._factories.delete(languageId);
        v.dispose();
      });
    }
    async getOrCreate(languageId) {
      const tokenizationSupport = this.get(languageId);
      if (tokenizationSupport) {
        return tokenizationSupport;
      }
      const factory = this._factories.get(languageId);
      if (!factory || factory.isResolved) {
        return null;
      }
      await factory.resolve();
      return this.get(languageId);
    }
    isResolved(languageId) {
      const tokenizationSupport = this.get(languageId);
      if (tokenizationSupport) {
        return true;
      }
      const factory = this._factories.get(languageId);
      if (!factory || factory.isResolved) {
        return true;
      }
      return false;
    }
    setColorMap(colorMap) {
      this._colorMap = colorMap;
      this._onDidChange.fire({
        changedLanguages: Array.from(this._tokenizationSupports.keys()),
        changedColorMap: true
      });
    }
    getColorMap() {
      return this._colorMap;
    }
    getDefaultBackground() {
      if (this._colorMap && this._colorMap.length > 2) {
        return this._colorMap[
          2
          /* ColorId.DefaultBackground */
        ];
      }
      return null;
    }
  };
  class TokenizationSupportFactoryData extends Disposable {
    get isResolved() {
      return this._isResolved;
    }
    constructor(_registry, _languageId, _factory) {
      super();
      this._registry = _registry;
      this._languageId = _languageId;
      this._factory = _factory;
      this._isDisposed = false;
      this._resolvePromise = null;
      this._isResolved = false;
    }
    dispose() {
      this._isDisposed = true;
      super.dispose();
    }
    async resolve() {
      if (!this._resolvePromise) {
        this._resolvePromise = this._create();
      }
      return this._resolvePromise;
    }
    async _create() {
      const value = await this._factory.tokenizationSupport;
      this._isResolved = true;
      if (value && !this._isDisposed) {
        this._register(this._registry.register(this._languageId, value));
      }
    }
  }
  class Token {
    constructor(offset, type, language2) {
      this.offset = offset;
      this.type = type;
      this.language = language2;
      this._tokenBrand = void 0;
    }
    toString() {
      return "(" + this.offset + ", " + this.type + ")";
    }
  }
  class TokenizationResult {
    constructor(tokens, endState) {
      this.tokens = tokens;
      this.endState = endState;
      this._tokenizationResultBrand = void 0;
    }
  }
  class EncodedTokenizationResult {
    constructor(tokens, fontInfo, endState) {
      this.tokens = tokens;
      this.fontInfo = fontInfo;
      this.endState = endState;
      this._encodedTokenizationResultBrand = void 0;
    }
  }
  exports.HoverVerbosityAction = void 0;
  (function(HoverVerbosityAction) {
    HoverVerbosityAction[HoverVerbosityAction["Increase"] = 0] = "Increase";
    HoverVerbosityAction[HoverVerbosityAction["Decrease"] = 1] = "Decrease";
  })(exports.HoverVerbosityAction || (exports.HoverVerbosityAction = {}));
  exports.CompletionItemKinds = void 0;
  (function(CompletionItemKinds) {
    const byKind = /* @__PURE__ */ new Map();
    byKind.set(0, Codicon.symbolMethod);
    byKind.set(1, Codicon.symbolFunction);
    byKind.set(2, Codicon.symbolConstructor);
    byKind.set(3, Codicon.symbolField);
    byKind.set(4, Codicon.symbolVariable);
    byKind.set(5, Codicon.symbolClass);
    byKind.set(6, Codicon.symbolStruct);
    byKind.set(7, Codicon.symbolInterface);
    byKind.set(8, Codicon.symbolModule);
    byKind.set(9, Codicon.symbolProperty);
    byKind.set(10, Codicon.symbolEvent);
    byKind.set(11, Codicon.symbolOperator);
    byKind.set(12, Codicon.symbolUnit);
    byKind.set(13, Codicon.symbolValue);
    byKind.set(15, Codicon.symbolEnum);
    byKind.set(14, Codicon.symbolConstant);
    byKind.set(15, Codicon.symbolEnum);
    byKind.set(16, Codicon.symbolEnumMember);
    byKind.set(17, Codicon.symbolKeyword);
    byKind.set(28, Codicon.symbolSnippet);
    byKind.set(18, Codicon.symbolText);
    byKind.set(19, Codicon.symbolColor);
    byKind.set(20, Codicon.symbolFile);
    byKind.set(21, Codicon.symbolReference);
    byKind.set(22, Codicon.symbolCustomColor);
    byKind.set(23, Codicon.symbolFolder);
    byKind.set(24, Codicon.symbolTypeParameter);
    byKind.set(25, Codicon.account);
    byKind.set(26, Codicon.issues);
    byKind.set(27, Codicon.tools);
    function toIcon(kind) {
      let codicon = byKind.get(kind);
      if (!codicon) {
        console.info("No codicon found for CompletionItemKind " + kind);
        codicon = Codicon.symbolProperty;
      }
      return codicon;
    }
    CompletionItemKinds.toIcon = toIcon;
    function toLabel(kind) {
      switch (kind) {
        case 0:
          return localize(738, "Method");
        case 1:
          return localize(739, "Function");
        case 2:
          return localize(740, "Constructor");
        case 3:
          return localize(741, "Field");
        case 4:
          return localize(742, "Variable");
        case 5:
          return localize(743, "Class");
        case 6:
          return localize(744, "Struct");
        case 7:
          return localize(745, "Interface");
        case 8:
          return localize(746, "Module");
        case 9:
          return localize(747, "Property");
        case 10:
          return localize(748, "Event");
        case 11:
          return localize(749, "Operator");
        case 12:
          return localize(750, "Unit");
        case 13:
          return localize(751, "Value");
        case 14:
          return localize(752, "Constant");
        case 15:
          return localize(753, "Enum");
        case 16:
          return localize(754, "Enum Member");
        case 17:
          return localize(755, "Keyword");
        case 18:
          return localize(756, "Text");
        case 19:
          return localize(757, "Color");
        case 20:
          return localize(758, "File");
        case 21:
          return localize(759, "Reference");
        case 22:
          return localize(760, "Custom Color");
        case 23:
          return localize(761, "Folder");
        case 24:
          return localize(762, "Type Parameter");
        case 25:
          return localize(763, "User");
        case 26:
          return localize(764, "Issue");
        case 27:
          return localize(765, "Tool");
        case 28:
          return localize(766, "Snippet");
        default:
          return "";
      }
    }
    CompletionItemKinds.toLabel = toLabel;
    const data = /* @__PURE__ */ new Map();
    data.set(
      "method",
      0
      /* CompletionItemKind.Method */
    );
    data.set(
      "function",
      1
      /* CompletionItemKind.Function */
    );
    data.set(
      "constructor",
      2
      /* CompletionItemKind.Constructor */
    );
    data.set(
      "field",
      3
      /* CompletionItemKind.Field */
    );
    data.set(
      "variable",
      4
      /* CompletionItemKind.Variable */
    );
    data.set(
      "class",
      5
      /* CompletionItemKind.Class */
    );
    data.set(
      "struct",
      6
      /* CompletionItemKind.Struct */
    );
    data.set(
      "interface",
      7
      /* CompletionItemKind.Interface */
    );
    data.set(
      "module",
      8
      /* CompletionItemKind.Module */
    );
    data.set(
      "property",
      9
      /* CompletionItemKind.Property */
    );
    data.set(
      "event",
      10
      /* CompletionItemKind.Event */
    );
    data.set(
      "operator",
      11
      /* CompletionItemKind.Operator */
    );
    data.set(
      "unit",
      12
      /* CompletionItemKind.Unit */
    );
    data.set(
      "value",
      13
      /* CompletionItemKind.Value */
    );
    data.set(
      "constant",
      14
      /* CompletionItemKind.Constant */
    );
    data.set(
      "enum",
      15
      /* CompletionItemKind.Enum */
    );
    data.set(
      "enum-member",
      16
      /* CompletionItemKind.EnumMember */
    );
    data.set(
      "enumMember",
      16
      /* CompletionItemKind.EnumMember */
    );
    data.set(
      "keyword",
      17
      /* CompletionItemKind.Keyword */
    );
    data.set(
      "snippet",
      28
      /* CompletionItemKind.Snippet */
    );
    data.set(
      "text",
      18
      /* CompletionItemKind.Text */
    );
    data.set(
      "color",
      19
      /* CompletionItemKind.Color */
    );
    data.set(
      "file",
      20
      /* CompletionItemKind.File */
    );
    data.set(
      "reference",
      21
      /* CompletionItemKind.Reference */
    );
    data.set(
      "customcolor",
      22
      /* CompletionItemKind.Customcolor */
    );
    data.set(
      "folder",
      23
      /* CompletionItemKind.Folder */
    );
    data.set(
      "type-parameter",
      24
      /* CompletionItemKind.TypeParameter */
    );
    data.set(
      "typeParameter",
      24
      /* CompletionItemKind.TypeParameter */
    );
    data.set(
      "account",
      25
      /* CompletionItemKind.User */
    );
    data.set(
      "issue",
      26
      /* CompletionItemKind.Issue */
    );
    data.set(
      "tool",
      27
      /* CompletionItemKind.Tool */
    );
    function fromString(value, strict) {
      let res = data.get(value);
      if (typeof res === "undefined" && !strict) {
        res = 9;
      }
      return res;
    }
    CompletionItemKinds.fromString = fromString;
  })(exports.CompletionItemKinds || (exports.CompletionItemKinds = {}));
  exports.InlineCompletionTriggerKind = void 0;
  (function(InlineCompletionTriggerKind) {
    InlineCompletionTriggerKind[InlineCompletionTriggerKind["Automatic"] = 0] = "Automatic";
    InlineCompletionTriggerKind[InlineCompletionTriggerKind["Explicit"] = 1] = "Explicit";
  })(exports.InlineCompletionTriggerKind || (exports.InlineCompletionTriggerKind = {}));
  class SelectedSuggestionInfo {
    constructor(range2, text, completionKind, isSnippetText) {
      this.range = range2;
      this.text = text;
      this.completionKind = completionKind;
      this.isSnippetText = isSnippetText;
    }
    equals(other) {
      return Range.lift(this.range).equalsRange(other.range) && this.text === other.text && this.completionKind === other.completionKind && this.isSnippetText === other.isSnippetText;
    }
  }
  exports.InlineCompletionHintStyle = void 0;
  (function(InlineCompletionHintStyle) {
    InlineCompletionHintStyle[InlineCompletionHintStyle["Code"] = 1] = "Code";
    InlineCompletionHintStyle[InlineCompletionHintStyle["Label"] = 2] = "Label";
  })(exports.InlineCompletionHintStyle || (exports.InlineCompletionHintStyle = {}));
  class ProviderId {
    static fromExtensionId(extensionId) {
      return new ProviderId(extensionId, void 0, void 0);
    }
    constructor(extensionId, extensionVersion, providerId) {
      this.extensionId = extensionId;
      this.extensionVersion = extensionVersion;
      this.providerId = providerId;
    }
    toString() {
      let result = "";
      if (this.extensionId) {
        result += this.extensionId;
      }
      if (this.extensionVersion) {
        result += `@${this.extensionVersion}`;
      }
      if (this.providerId) {
        result += `:${this.providerId}`;
      }
      if (result.length === 0) {
        result = "unknown";
      }
      return result;
    }
    toStringWithoutVersion() {
      let result = "";
      if (this.extensionId) {
        result += this.extensionId;
      }
      if (this.providerId) {
        result += `:${this.providerId}`;
      }
      return result;
    }
  }
  exports.InlineCompletionEndOfLifeReasonKind = void 0;
  (function(InlineCompletionEndOfLifeReasonKind) {
    InlineCompletionEndOfLifeReasonKind[InlineCompletionEndOfLifeReasonKind["Accepted"] = 0] = "Accepted";
    InlineCompletionEndOfLifeReasonKind[InlineCompletionEndOfLifeReasonKind["Rejected"] = 1] = "Rejected";
    InlineCompletionEndOfLifeReasonKind[InlineCompletionEndOfLifeReasonKind["Ignored"] = 2] = "Ignored";
  })(exports.InlineCompletionEndOfLifeReasonKind || (exports.InlineCompletionEndOfLifeReasonKind = {}));
  exports.DocumentPasteTriggerKind = void 0;
  (function(DocumentPasteTriggerKind) {
    DocumentPasteTriggerKind[DocumentPasteTriggerKind["Automatic"] = 0] = "Automatic";
    DocumentPasteTriggerKind[DocumentPasteTriggerKind["PasteAs"] = 1] = "PasteAs";
  })(exports.DocumentPasteTriggerKind || (exports.DocumentPasteTriggerKind = {}));
  exports.SignatureHelpTriggerKind = void 0;
  (function(SignatureHelpTriggerKind) {
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["Invoke"] = 1] = "Invoke";
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["TriggerCharacter"] = 2] = "TriggerCharacter";
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["ContentChange"] = 3] = "ContentChange";
  })(exports.SignatureHelpTriggerKind || (exports.SignatureHelpTriggerKind = {}));
  exports.DocumentHighlightKind = void 0;
  (function(DocumentHighlightKind) {
    DocumentHighlightKind[DocumentHighlightKind["Text"] = 0] = "Text";
    DocumentHighlightKind[DocumentHighlightKind["Read"] = 1] = "Read";
    DocumentHighlightKind[DocumentHighlightKind["Write"] = 2] = "Write";
  })(exports.DocumentHighlightKind || (exports.DocumentHighlightKind = {}));
  function isLocationLink(thing) {
    return !!thing && URI.isUri(thing.uri) && Range.isIRange(thing.range) && (Range.isIRange(thing.originSelectionRange) || Range.isIRange(thing.targetSelectionRange));
  }
  const symbolKindNames = {
    [
      17
      /* SymbolKind.Array */
    ]: localize(767, "array"),
    [
      16
      /* SymbolKind.Boolean */
    ]: localize(768, "boolean"),
    [
      4
      /* SymbolKind.Class */
    ]: localize(769, "class"),
    [
      13
      /* SymbolKind.Constant */
    ]: localize(770, "constant"),
    [
      8
      /* SymbolKind.Constructor */
    ]: localize(771, "constructor"),
    [
      9
      /* SymbolKind.Enum */
    ]: localize(772, "enumeration"),
    [
      21
      /* SymbolKind.EnumMember */
    ]: localize(773, "enumeration member"),
    [
      23
      /* SymbolKind.Event */
    ]: localize(774, "event"),
    [
      7
      /* SymbolKind.Field */
    ]: localize(775, "field"),
    [
      0
      /* SymbolKind.File */
    ]: localize(776, "file"),
    [
      11
      /* SymbolKind.Function */
    ]: localize(777, "function"),
    [
      10
      /* SymbolKind.Interface */
    ]: localize(778, "interface"),
    [
      19
      /* SymbolKind.Key */
    ]: localize(779, "key"),
    [
      5
      /* SymbolKind.Method */
    ]: localize(780, "method"),
    [
      1
      /* SymbolKind.Module */
    ]: localize(781, "module"),
    [
      2
      /* SymbolKind.Namespace */
    ]: localize(782, "namespace"),
    [
      20
      /* SymbolKind.Null */
    ]: localize(783, "null"),
    [
      15
      /* SymbolKind.Number */
    ]: localize(784, "number"),
    [
      18
      /* SymbolKind.Object */
    ]: localize(785, "object"),
    [
      24
      /* SymbolKind.Operator */
    ]: localize(786, "operator"),
    [
      3
      /* SymbolKind.Package */
    ]: localize(787, "package"),
    [
      6
      /* SymbolKind.Property */
    ]: localize(788, "property"),
    [
      14
      /* SymbolKind.String */
    ]: localize(789, "string"),
    [
      22
      /* SymbolKind.Struct */
    ]: localize(790, "struct"),
    [
      25
      /* SymbolKind.TypeParameter */
    ]: localize(791, "type parameter"),
    [
      12
      /* SymbolKind.Variable */
    ]: localize(792, "variable")
  };
  function getAriaLabelForSymbol(symbolName, kind) {
    return localize(793, "{0} ({1})", symbolName, symbolKindNames[kind]);
  }
  exports.SymbolKinds = void 0;
  (function(SymbolKinds) {
    const byKind = /* @__PURE__ */ new Map();
    byKind.set(0, Codicon.symbolFile);
    byKind.set(1, Codicon.symbolModule);
    byKind.set(2, Codicon.symbolNamespace);
    byKind.set(3, Codicon.symbolPackage);
    byKind.set(4, Codicon.symbolClass);
    byKind.set(5, Codicon.symbolMethod);
    byKind.set(6, Codicon.symbolProperty);
    byKind.set(7, Codicon.symbolField);
    byKind.set(8, Codicon.symbolConstructor);
    byKind.set(9, Codicon.symbolEnum);
    byKind.set(10, Codicon.symbolInterface);
    byKind.set(11, Codicon.symbolFunction);
    byKind.set(12, Codicon.symbolVariable);
    byKind.set(13, Codicon.symbolConstant);
    byKind.set(14, Codicon.symbolString);
    byKind.set(15, Codicon.symbolNumber);
    byKind.set(16, Codicon.symbolBoolean);
    byKind.set(17, Codicon.symbolArray);
    byKind.set(18, Codicon.symbolObject);
    byKind.set(19, Codicon.symbolKey);
    byKind.set(20, Codicon.symbolNull);
    byKind.set(21, Codicon.symbolEnumMember);
    byKind.set(22, Codicon.symbolStruct);
    byKind.set(23, Codicon.symbolEvent);
    byKind.set(24, Codicon.symbolOperator);
    byKind.set(25, Codicon.symbolTypeParameter);
    function toIcon(kind) {
      let icon = byKind.get(kind);
      if (!icon) {
        console.info("No codicon found for SymbolKind " + kind);
        icon = Codicon.symbolProperty;
      }
      return icon;
    }
    SymbolKinds.toIcon = toIcon;
    const byCompletionKind = /* @__PURE__ */ new Map();
    byCompletionKind.set(
      0,
      20
      /* CompletionItemKind.File */
    );
    byCompletionKind.set(
      1,
      8
      /* CompletionItemKind.Module */
    );
    byCompletionKind.set(
      2,
      8
      /* CompletionItemKind.Module */
    );
    byCompletionKind.set(
      3,
      8
      /* CompletionItemKind.Module */
    );
    byCompletionKind.set(
      4,
      5
      /* CompletionItemKind.Class */
    );
    byCompletionKind.set(
      5,
      0
      /* CompletionItemKind.Method */
    );
    byCompletionKind.set(
      6,
      9
      /* CompletionItemKind.Property */
    );
    byCompletionKind.set(
      7,
      3
      /* CompletionItemKind.Field */
    );
    byCompletionKind.set(
      8,
      2
      /* CompletionItemKind.Constructor */
    );
    byCompletionKind.set(
      9,
      15
      /* CompletionItemKind.Enum */
    );
    byCompletionKind.set(
      10,
      7
      /* CompletionItemKind.Interface */
    );
    byCompletionKind.set(
      11,
      1
      /* CompletionItemKind.Function */
    );
    byCompletionKind.set(
      12,
      4
      /* CompletionItemKind.Variable */
    );
    byCompletionKind.set(
      13,
      14
      /* CompletionItemKind.Constant */
    );
    byCompletionKind.set(
      14,
      18
      /* CompletionItemKind.Text */
    );
    byCompletionKind.set(
      15,
      13
      /* CompletionItemKind.Value */
    );
    byCompletionKind.set(
      16,
      13
      /* CompletionItemKind.Value */
    );
    byCompletionKind.set(
      17,
      13
      /* CompletionItemKind.Value */
    );
    byCompletionKind.set(
      18,
      13
      /* CompletionItemKind.Value */
    );
    byCompletionKind.set(
      19,
      17
      /* CompletionItemKind.Keyword */
    );
    byCompletionKind.set(
      20,
      13
      /* CompletionItemKind.Value */
    );
    byCompletionKind.set(
      21,
      16
      /* CompletionItemKind.EnumMember */
    );
    byCompletionKind.set(
      22,
      6
      /* CompletionItemKind.Struct */
    );
    byCompletionKind.set(
      23,
      10
      /* CompletionItemKind.Event */
    );
    byCompletionKind.set(
      24,
      11
      /* CompletionItemKind.Operator */
    );
    byCompletionKind.set(
      25,
      24
      /* CompletionItemKind.TypeParameter */
    );
    function toCompletionKind(kind) {
      let completionKind = byCompletionKind.get(kind);
      if (completionKind === void 0) {
        console.info("No completion kind found for SymbolKind " + kind);
        completionKind = 20;
      }
      return completionKind;
    }
    SymbolKinds.toCompletionKind = toCompletionKind;
  })(exports.SymbolKinds || (exports.SymbolKinds = {}));
  const _FoldingRangeKind = class _FoldingRangeKind {
    /**
     * Returns a {@link FoldingRangeKind} for the given value.
     *
     * @param value of the kind.
     */
    static fromValue(value) {
      switch (value) {
        case "comment":
          return _FoldingRangeKind.Comment;
        case "imports":
          return _FoldingRangeKind.Imports;
        case "region":
          return _FoldingRangeKind.Region;
      }
      return new _FoldingRangeKind(value);
    }
    /**
     * Creates a new {@link FoldingRangeKind}.
     *
     * @param value of the kind.
     */
    constructor(value) {
      this.value = value;
    }
  };
  _FoldingRangeKind.Comment = new _FoldingRangeKind("comment");
  _FoldingRangeKind.Imports = new _FoldingRangeKind("imports");
  _FoldingRangeKind.Region = new _FoldingRangeKind("region");
  let FoldingRangeKind = _FoldingRangeKind;
  exports.NewSymbolNameTag = void 0;
  (function(NewSymbolNameTag) {
    NewSymbolNameTag[NewSymbolNameTag["AIGenerated"] = 1] = "AIGenerated";
  })(exports.NewSymbolNameTag || (exports.NewSymbolNameTag = {}));
  exports.NewSymbolNameTriggerKind = void 0;
  (function(NewSymbolNameTriggerKind) {
    NewSymbolNameTriggerKind[NewSymbolNameTriggerKind["Invoke"] = 0] = "Invoke";
    NewSymbolNameTriggerKind[NewSymbolNameTriggerKind["Automatic"] = 1] = "Automatic";
  })(exports.NewSymbolNameTriggerKind || (exports.NewSymbolNameTriggerKind = {}));
  exports.Command = void 0;
  (function(Command) {
    function is(obj) {
      if (!obj || typeof obj !== "object") {
        return false;
      }
      return typeof obj.id === "string" && typeof obj.title === "string";
    }
    Command.is = is;
  })(exports.Command || (exports.Command = {}));
  exports.InlayHintKind = void 0;
  (function(InlayHintKind) {
    InlayHintKind[InlayHintKind["Type"] = 1] = "Type";
    InlayHintKind[InlayHintKind["Parameter"] = 2] = "Parameter";
  })(exports.InlayHintKind || (exports.InlayHintKind = {}));
  class LazyTokenizationSupport {
    constructor(createSupport) {
      this.createSupport = createSupport;
      this._tokenizationSupport = null;
    }
    dispose() {
      if (this._tokenizationSupport) {
        this._tokenizationSupport.then((support) => {
          if (support) {
            support.dispose();
          }
        });
      }
    }
    get tokenizationSupport() {
      if (!this._tokenizationSupport) {
        this._tokenizationSupport = this.createSupport();
      }
      return this._tokenizationSupport;
    }
  }
  const TokenizationRegistry = new TokenizationRegistry$1();
  exports.AccessibilitySupport = void 0;
  (function(AccessibilitySupport) {
    AccessibilitySupport[AccessibilitySupport["Unknown"] = 0] = "Unknown";
    AccessibilitySupport[AccessibilitySupport["Disabled"] = 1] = "Disabled";
    AccessibilitySupport[AccessibilitySupport["Enabled"] = 2] = "Enabled";
  })(exports.AccessibilitySupport || (exports.AccessibilitySupport = {}));
  exports.CodeActionTriggerType = void 0;
  (function(CodeActionTriggerType) {
    CodeActionTriggerType[CodeActionTriggerType["Invoke"] = 1] = "Invoke";
    CodeActionTriggerType[CodeActionTriggerType["Auto"] = 2] = "Auto";
  })(exports.CodeActionTriggerType || (exports.CodeActionTriggerType = {}));
  exports.CompletionItemInsertTextRule = void 0;
  (function(CompletionItemInsertTextRule) {
    CompletionItemInsertTextRule[CompletionItemInsertTextRule["None"] = 0] = "None";
    CompletionItemInsertTextRule[CompletionItemInsertTextRule["KeepWhitespace"] = 1] = "KeepWhitespace";
    CompletionItemInsertTextRule[CompletionItemInsertTextRule["InsertAsSnippet"] = 4] = "InsertAsSnippet";
  })(exports.CompletionItemInsertTextRule || (exports.CompletionItemInsertTextRule = {}));
  exports.CompletionItemKind = void 0;
  (function(CompletionItemKind) {
    CompletionItemKind[CompletionItemKind["Method"] = 0] = "Method";
    CompletionItemKind[CompletionItemKind["Function"] = 1] = "Function";
    CompletionItemKind[CompletionItemKind["Constructor"] = 2] = "Constructor";
    CompletionItemKind[CompletionItemKind["Field"] = 3] = "Field";
    CompletionItemKind[CompletionItemKind["Variable"] = 4] = "Variable";
    CompletionItemKind[CompletionItemKind["Class"] = 5] = "Class";
    CompletionItemKind[CompletionItemKind["Struct"] = 6] = "Struct";
    CompletionItemKind[CompletionItemKind["Interface"] = 7] = "Interface";
    CompletionItemKind[CompletionItemKind["Module"] = 8] = "Module";
    CompletionItemKind[CompletionItemKind["Property"] = 9] = "Property";
    CompletionItemKind[CompletionItemKind["Event"] = 10] = "Event";
    CompletionItemKind[CompletionItemKind["Operator"] = 11] = "Operator";
    CompletionItemKind[CompletionItemKind["Unit"] = 12] = "Unit";
    CompletionItemKind[CompletionItemKind["Value"] = 13] = "Value";
    CompletionItemKind[CompletionItemKind["Constant"] = 14] = "Constant";
    CompletionItemKind[CompletionItemKind["Enum"] = 15] = "Enum";
    CompletionItemKind[CompletionItemKind["EnumMember"] = 16] = "EnumMember";
    CompletionItemKind[CompletionItemKind["Keyword"] = 17] = "Keyword";
    CompletionItemKind[CompletionItemKind["Text"] = 18] = "Text";
    CompletionItemKind[CompletionItemKind["Color"] = 19] = "Color";
    CompletionItemKind[CompletionItemKind["File"] = 20] = "File";
    CompletionItemKind[CompletionItemKind["Reference"] = 21] = "Reference";
    CompletionItemKind[CompletionItemKind["Customcolor"] = 22] = "Customcolor";
    CompletionItemKind[CompletionItemKind["Folder"] = 23] = "Folder";
    CompletionItemKind[CompletionItemKind["TypeParameter"] = 24] = "TypeParameter";
    CompletionItemKind[CompletionItemKind["User"] = 25] = "User";
    CompletionItemKind[CompletionItemKind["Issue"] = 26] = "Issue";
    CompletionItemKind[CompletionItemKind["Tool"] = 27] = "Tool";
    CompletionItemKind[CompletionItemKind["Snippet"] = 28] = "Snippet";
  })(exports.CompletionItemKind || (exports.CompletionItemKind = {}));
  exports.CompletionItemTag = void 0;
  (function(CompletionItemTag) {
    CompletionItemTag[CompletionItemTag["Deprecated"] = 1] = "Deprecated";
  })(exports.CompletionItemTag || (exports.CompletionItemTag = {}));
  exports.CompletionTriggerKind = void 0;
  (function(CompletionTriggerKind) {
    CompletionTriggerKind[CompletionTriggerKind["Invoke"] = 0] = "Invoke";
    CompletionTriggerKind[CompletionTriggerKind["TriggerCharacter"] = 1] = "TriggerCharacter";
    CompletionTriggerKind[CompletionTriggerKind["TriggerForIncompleteCompletions"] = 2] = "TriggerForIncompleteCompletions";
  })(exports.CompletionTriggerKind || (exports.CompletionTriggerKind = {}));
  exports.ContentWidgetPositionPreference = void 0;
  (function(ContentWidgetPositionPreference) {
    ContentWidgetPositionPreference[ContentWidgetPositionPreference["EXACT"] = 0] = "EXACT";
    ContentWidgetPositionPreference[ContentWidgetPositionPreference["ABOVE"] = 1] = "ABOVE";
    ContentWidgetPositionPreference[ContentWidgetPositionPreference["BELOW"] = 2] = "BELOW";
  })(exports.ContentWidgetPositionPreference || (exports.ContentWidgetPositionPreference = {}));
  exports.CursorChangeReason = void 0;
  (function(CursorChangeReason) {
    CursorChangeReason[CursorChangeReason["NotSet"] = 0] = "NotSet";
    CursorChangeReason[CursorChangeReason["ContentFlush"] = 1] = "ContentFlush";
    CursorChangeReason[CursorChangeReason["RecoverFromMarkers"] = 2] = "RecoverFromMarkers";
    CursorChangeReason[CursorChangeReason["Explicit"] = 3] = "Explicit";
    CursorChangeReason[CursorChangeReason["Paste"] = 4] = "Paste";
    CursorChangeReason[CursorChangeReason["Undo"] = 5] = "Undo";
    CursorChangeReason[CursorChangeReason["Redo"] = 6] = "Redo";
  })(exports.CursorChangeReason || (exports.CursorChangeReason = {}));
  exports.DefaultEndOfLine = void 0;
  (function(DefaultEndOfLine) {
    DefaultEndOfLine[DefaultEndOfLine["LF"] = 1] = "LF";
    DefaultEndOfLine[DefaultEndOfLine["CRLF"] = 2] = "CRLF";
  })(exports.DefaultEndOfLine || (exports.DefaultEndOfLine = {}));
  exports.DocumentHighlightKind$1 = void 0;
  (function(DocumentHighlightKind) {
    DocumentHighlightKind[DocumentHighlightKind["Text"] = 0] = "Text";
    DocumentHighlightKind[DocumentHighlightKind["Read"] = 1] = "Read";
    DocumentHighlightKind[DocumentHighlightKind["Write"] = 2] = "Write";
  })(exports.DocumentHighlightKind$1 || (exports.DocumentHighlightKind$1 = {}));
  exports.EditorAutoIndentStrategy = void 0;
  (function(EditorAutoIndentStrategy) {
    EditorAutoIndentStrategy[EditorAutoIndentStrategy["None"] = 0] = "None";
    EditorAutoIndentStrategy[EditorAutoIndentStrategy["Keep"] = 1] = "Keep";
    EditorAutoIndentStrategy[EditorAutoIndentStrategy["Brackets"] = 2] = "Brackets";
    EditorAutoIndentStrategy[EditorAutoIndentStrategy["Advanced"] = 3] = "Advanced";
    EditorAutoIndentStrategy[EditorAutoIndentStrategy["Full"] = 4] = "Full";
  })(exports.EditorAutoIndentStrategy || (exports.EditorAutoIndentStrategy = {}));
  exports.EditorOption = void 0;
  (function(EditorOption) {
    EditorOption[EditorOption["acceptSuggestionOnCommitCharacter"] = 0] = "acceptSuggestionOnCommitCharacter";
    EditorOption[EditorOption["acceptSuggestionOnEnter"] = 1] = "acceptSuggestionOnEnter";
    EditorOption[EditorOption["accessibilitySupport"] = 2] = "accessibilitySupport";
    EditorOption[EditorOption["accessibilityPageSize"] = 3] = "accessibilityPageSize";
    EditorOption[EditorOption["allowOverflow"] = 4] = "allowOverflow";
    EditorOption[EditorOption["allowVariableLineHeights"] = 5] = "allowVariableLineHeights";
    EditorOption[EditorOption["allowVariableFonts"] = 6] = "allowVariableFonts";
    EditorOption[EditorOption["allowVariableFontsInAccessibilityMode"] = 7] = "allowVariableFontsInAccessibilityMode";
    EditorOption[EditorOption["ariaLabel"] = 8] = "ariaLabel";
    EditorOption[EditorOption["ariaRequired"] = 9] = "ariaRequired";
    EditorOption[EditorOption["autoClosingBrackets"] = 10] = "autoClosingBrackets";
    EditorOption[EditorOption["autoClosingComments"] = 11] = "autoClosingComments";
    EditorOption[EditorOption["screenReaderAnnounceInlineSuggestion"] = 12] = "screenReaderAnnounceInlineSuggestion";
    EditorOption[EditorOption["autoClosingDelete"] = 13] = "autoClosingDelete";
    EditorOption[EditorOption["autoClosingOvertype"] = 14] = "autoClosingOvertype";
    EditorOption[EditorOption["autoClosingQuotes"] = 15] = "autoClosingQuotes";
    EditorOption[EditorOption["autoIndent"] = 16] = "autoIndent";
    EditorOption[EditorOption["autoIndentOnPaste"] = 17] = "autoIndentOnPaste";
    EditorOption[EditorOption["autoIndentOnPasteWithinString"] = 18] = "autoIndentOnPasteWithinString";
    EditorOption[EditorOption["automaticLayout"] = 19] = "automaticLayout";
    EditorOption[EditorOption["autoSurround"] = 20] = "autoSurround";
    EditorOption[EditorOption["bracketPairColorization"] = 21] = "bracketPairColorization";
    EditorOption[EditorOption["guides"] = 22] = "guides";
    EditorOption[EditorOption["codeLens"] = 23] = "codeLens";
    EditorOption[EditorOption["codeLensFontFamily"] = 24] = "codeLensFontFamily";
    EditorOption[EditorOption["codeLensFontSize"] = 25] = "codeLensFontSize";
    EditorOption[EditorOption["colorDecorators"] = 26] = "colorDecorators";
    EditorOption[EditorOption["colorDecoratorsLimit"] = 27] = "colorDecoratorsLimit";
    EditorOption[EditorOption["columnSelection"] = 28] = "columnSelection";
    EditorOption[EditorOption["comments"] = 29] = "comments";
    EditorOption[EditorOption["contextmenu"] = 30] = "contextmenu";
    EditorOption[EditorOption["copyWithSyntaxHighlighting"] = 31] = "copyWithSyntaxHighlighting";
    EditorOption[EditorOption["cursorBlinking"] = 32] = "cursorBlinking";
    EditorOption[EditorOption["cursorSmoothCaretAnimation"] = 33] = "cursorSmoothCaretAnimation";
    EditorOption[EditorOption["cursorStyle"] = 34] = "cursorStyle";
    EditorOption[EditorOption["cursorSurroundingLines"] = 35] = "cursorSurroundingLines";
    EditorOption[EditorOption["cursorSurroundingLinesStyle"] = 36] = "cursorSurroundingLinesStyle";
    EditorOption[EditorOption["cursorWidth"] = 37] = "cursorWidth";
    EditorOption[EditorOption["cursorHeight"] = 38] = "cursorHeight";
    EditorOption[EditorOption["disableLayerHinting"] = 39] = "disableLayerHinting";
    EditorOption[EditorOption["disableMonospaceOptimizations"] = 40] = "disableMonospaceOptimizations";
    EditorOption[EditorOption["domReadOnly"] = 41] = "domReadOnly";
    EditorOption[EditorOption["dragAndDrop"] = 42] = "dragAndDrop";
    EditorOption[EditorOption["dropIntoEditor"] = 43] = "dropIntoEditor";
    EditorOption[EditorOption["editContext"] = 44] = "editContext";
    EditorOption[EditorOption["emptySelectionClipboard"] = 45] = "emptySelectionClipboard";
    EditorOption[EditorOption["experimentalGpuAcceleration"] = 46] = "experimentalGpuAcceleration";
    EditorOption[EditorOption["experimentalWhitespaceRendering"] = 47] = "experimentalWhitespaceRendering";
    EditorOption[EditorOption["extraEditorClassName"] = 48] = "extraEditorClassName";
    EditorOption[EditorOption["fastScrollSensitivity"] = 49] = "fastScrollSensitivity";
    EditorOption[EditorOption["find"] = 50] = "find";
    EditorOption[EditorOption["fixedOverflowWidgets"] = 51] = "fixedOverflowWidgets";
    EditorOption[EditorOption["folding"] = 52] = "folding";
    EditorOption[EditorOption["foldingStrategy"] = 53] = "foldingStrategy";
    EditorOption[EditorOption["foldingHighlight"] = 54] = "foldingHighlight";
    EditorOption[EditorOption["foldingImportsByDefault"] = 55] = "foldingImportsByDefault";
    EditorOption[EditorOption["foldingMaximumRegions"] = 56] = "foldingMaximumRegions";
    EditorOption[EditorOption["unfoldOnClickAfterEndOfLine"] = 57] = "unfoldOnClickAfterEndOfLine";
    EditorOption[EditorOption["fontFamily"] = 58] = "fontFamily";
    EditorOption[EditorOption["fontInfo"] = 59] = "fontInfo";
    EditorOption[EditorOption["fontLigatures"] = 60] = "fontLigatures";
    EditorOption[EditorOption["fontSize"] = 61] = "fontSize";
    EditorOption[EditorOption["fontWeight"] = 62] = "fontWeight";
    EditorOption[EditorOption["fontVariations"] = 63] = "fontVariations";
    EditorOption[EditorOption["formatOnPaste"] = 64] = "formatOnPaste";
    EditorOption[EditorOption["formatOnType"] = 65] = "formatOnType";
    EditorOption[EditorOption["glyphMargin"] = 66] = "glyphMargin";
    EditorOption[EditorOption["gotoLocation"] = 67] = "gotoLocation";
    EditorOption[EditorOption["hideCursorInOverviewRuler"] = 68] = "hideCursorInOverviewRuler";
    EditorOption[EditorOption["hover"] = 69] = "hover";
    EditorOption[EditorOption["inDiffEditor"] = 70] = "inDiffEditor";
    EditorOption[EditorOption["inlineSuggest"] = 71] = "inlineSuggest";
    EditorOption[EditorOption["letterSpacing"] = 72] = "letterSpacing";
    EditorOption[EditorOption["lightbulb"] = 73] = "lightbulb";
    EditorOption[EditorOption["lineDecorationsWidth"] = 74] = "lineDecorationsWidth";
    EditorOption[EditorOption["lineHeight"] = 75] = "lineHeight";
    EditorOption[EditorOption["lineNumbers"] = 76] = "lineNumbers";
    EditorOption[EditorOption["lineNumbersMinChars"] = 77] = "lineNumbersMinChars";
    EditorOption[EditorOption["linkedEditing"] = 78] = "linkedEditing";
    EditorOption[EditorOption["links"] = 79] = "links";
    EditorOption[EditorOption["matchBrackets"] = 80] = "matchBrackets";
    EditorOption[EditorOption["minimap"] = 81] = "minimap";
    EditorOption[EditorOption["mouseStyle"] = 82] = "mouseStyle";
    EditorOption[EditorOption["mouseWheelScrollSensitivity"] = 83] = "mouseWheelScrollSensitivity";
    EditorOption[EditorOption["mouseWheelZoom"] = 84] = "mouseWheelZoom";
    EditorOption[EditorOption["multiCursorMergeOverlapping"] = 85] = "multiCursorMergeOverlapping";
    EditorOption[EditorOption["multiCursorModifier"] = 86] = "multiCursorModifier";
    EditorOption[EditorOption["mouseMiddleClickAction"] = 87] = "mouseMiddleClickAction";
    EditorOption[EditorOption["multiCursorPaste"] = 88] = "multiCursorPaste";
    EditorOption[EditorOption["multiCursorLimit"] = 89] = "multiCursorLimit";
    EditorOption[EditorOption["occurrencesHighlight"] = 90] = "occurrencesHighlight";
    EditorOption[EditorOption["occurrencesHighlightDelay"] = 91] = "occurrencesHighlightDelay";
    EditorOption[EditorOption["overtypeCursorStyle"] = 92] = "overtypeCursorStyle";
    EditorOption[EditorOption["overtypeOnPaste"] = 93] = "overtypeOnPaste";
    EditorOption[EditorOption["overviewRulerBorder"] = 94] = "overviewRulerBorder";
    EditorOption[EditorOption["overviewRulerLanes"] = 95] = "overviewRulerLanes";
    EditorOption[EditorOption["padding"] = 96] = "padding";
    EditorOption[EditorOption["pasteAs"] = 97] = "pasteAs";
    EditorOption[EditorOption["parameterHints"] = 98] = "parameterHints";
    EditorOption[EditorOption["peekWidgetDefaultFocus"] = 99] = "peekWidgetDefaultFocus";
    EditorOption[EditorOption["placeholder"] = 100] = "placeholder";
    EditorOption[EditorOption["definitionLinkOpensInPeek"] = 101] = "definitionLinkOpensInPeek";
    EditorOption[EditorOption["quickSuggestions"] = 102] = "quickSuggestions";
    EditorOption[EditorOption["quickSuggestionsDelay"] = 103] = "quickSuggestionsDelay";
    EditorOption[EditorOption["readOnly"] = 104] = "readOnly";
    EditorOption[EditorOption["readOnlyMessage"] = 105] = "readOnlyMessage";
    EditorOption[EditorOption["renameOnType"] = 106] = "renameOnType";
    EditorOption[EditorOption["renderRichScreenReaderContent"] = 107] = "renderRichScreenReaderContent";
    EditorOption[EditorOption["renderControlCharacters"] = 108] = "renderControlCharacters";
    EditorOption[EditorOption["renderFinalNewline"] = 109] = "renderFinalNewline";
    EditorOption[EditorOption["renderLineHighlight"] = 110] = "renderLineHighlight";
    EditorOption[EditorOption["renderLineHighlightOnlyWhenFocus"] = 111] = "renderLineHighlightOnlyWhenFocus";
    EditorOption[EditorOption["renderValidationDecorations"] = 112] = "renderValidationDecorations";
    EditorOption[EditorOption["renderWhitespace"] = 113] = "renderWhitespace";
    EditorOption[EditorOption["revealHorizontalRightPadding"] = 114] = "revealHorizontalRightPadding";
    EditorOption[EditorOption["roundedSelection"] = 115] = "roundedSelection";
    EditorOption[EditorOption["rulers"] = 116] = "rulers";
    EditorOption[EditorOption["scrollbar"] = 117] = "scrollbar";
    EditorOption[EditorOption["scrollBeyondLastColumn"] = 118] = "scrollBeyondLastColumn";
    EditorOption[EditorOption["scrollBeyondLastLine"] = 119] = "scrollBeyondLastLine";
    EditorOption[EditorOption["scrollPredominantAxis"] = 120] = "scrollPredominantAxis";
    EditorOption[EditorOption["selectionClipboard"] = 121] = "selectionClipboard";
    EditorOption[EditorOption["selectionHighlight"] = 122] = "selectionHighlight";
    EditorOption[EditorOption["selectionHighlightMaxLength"] = 123] = "selectionHighlightMaxLength";
    EditorOption[EditorOption["selectionHighlightMultiline"] = 124] = "selectionHighlightMultiline";
    EditorOption[EditorOption["selectOnLineNumbers"] = 125] = "selectOnLineNumbers";
    EditorOption[EditorOption["showFoldingControls"] = 126] = "showFoldingControls";
    EditorOption[EditorOption["showUnused"] = 127] = "showUnused";
    EditorOption[EditorOption["snippetSuggestions"] = 128] = "snippetSuggestions";
    EditorOption[EditorOption["smartSelect"] = 129] = "smartSelect";
    EditorOption[EditorOption["smoothScrolling"] = 130] = "smoothScrolling";
    EditorOption[EditorOption["stickyScroll"] = 131] = "stickyScroll";
    EditorOption[EditorOption["stickyTabStops"] = 132] = "stickyTabStops";
    EditorOption[EditorOption["stopRenderingLineAfter"] = 133] = "stopRenderingLineAfter";
    EditorOption[EditorOption["suggest"] = 134] = "suggest";
    EditorOption[EditorOption["suggestFontSize"] = 135] = "suggestFontSize";
    EditorOption[EditorOption["suggestLineHeight"] = 136] = "suggestLineHeight";
    EditorOption[EditorOption["suggestOnTriggerCharacters"] = 137] = "suggestOnTriggerCharacters";
    EditorOption[EditorOption["suggestSelection"] = 138] = "suggestSelection";
    EditorOption[EditorOption["tabCompletion"] = 139] = "tabCompletion";
    EditorOption[EditorOption["tabIndex"] = 140] = "tabIndex";
    EditorOption[EditorOption["trimWhitespaceOnDelete"] = 141] = "trimWhitespaceOnDelete";
    EditorOption[EditorOption["unicodeHighlighting"] = 142] = "unicodeHighlighting";
    EditorOption[EditorOption["unusualLineTerminators"] = 143] = "unusualLineTerminators";
    EditorOption[EditorOption["useShadowDOM"] = 144] = "useShadowDOM";
    EditorOption[EditorOption["useTabStops"] = 145] = "useTabStops";
    EditorOption[EditorOption["wordBreak"] = 146] = "wordBreak";
    EditorOption[EditorOption["wordSegmenterLocales"] = 147] = "wordSegmenterLocales";
    EditorOption[EditorOption["wordSeparators"] = 148] = "wordSeparators";
    EditorOption[EditorOption["wordWrap"] = 149] = "wordWrap";
    EditorOption[EditorOption["wordWrapBreakAfterCharacters"] = 150] = "wordWrapBreakAfterCharacters";
    EditorOption[EditorOption["wordWrapBreakBeforeCharacters"] = 151] = "wordWrapBreakBeforeCharacters";
    EditorOption[EditorOption["wordWrapColumn"] = 152] = "wordWrapColumn";
    EditorOption[EditorOption["wordWrapOverride1"] = 153] = "wordWrapOverride1";
    EditorOption[EditorOption["wordWrapOverride2"] = 154] = "wordWrapOverride2";
    EditorOption[EditorOption["wrappingIndent"] = 155] = "wrappingIndent";
    EditorOption[EditorOption["wrappingStrategy"] = 156] = "wrappingStrategy";
    EditorOption[EditorOption["showDeprecated"] = 157] = "showDeprecated";
    EditorOption[EditorOption["inertialScroll"] = 158] = "inertialScroll";
    EditorOption[EditorOption["inlayHints"] = 159] = "inlayHints";
    EditorOption[EditorOption["wrapOnEscapedLineFeeds"] = 160] = "wrapOnEscapedLineFeeds";
    EditorOption[EditorOption["effectiveCursorStyle"] = 161] = "effectiveCursorStyle";
    EditorOption[EditorOption["editorClassName"] = 162] = "editorClassName";
    EditorOption[EditorOption["pixelRatio"] = 163] = "pixelRatio";
    EditorOption[EditorOption["tabFocusMode"] = 164] = "tabFocusMode";
    EditorOption[EditorOption["layoutInfo"] = 165] = "layoutInfo";
    EditorOption[EditorOption["wrappingInfo"] = 166] = "wrappingInfo";
    EditorOption[EditorOption["defaultColorDecorators"] = 167] = "defaultColorDecorators";
    EditorOption[EditorOption["colorDecoratorsActivatedOn"] = 168] = "colorDecoratorsActivatedOn";
    EditorOption[EditorOption["inlineCompletionsAccessibilityVerbose"] = 169] = "inlineCompletionsAccessibilityVerbose";
    EditorOption[EditorOption["effectiveEditContext"] = 170] = "effectiveEditContext";
    EditorOption[EditorOption["scrollOnMiddleClick"] = 171] = "scrollOnMiddleClick";
    EditorOption[EditorOption["effectiveAllowVariableFonts"] = 172] = "effectiveAllowVariableFonts";
  })(exports.EditorOption || (exports.EditorOption = {}));
  exports.EndOfLinePreference = void 0;
  (function(EndOfLinePreference) {
    EndOfLinePreference[EndOfLinePreference["TextDefined"] = 0] = "TextDefined";
    EndOfLinePreference[EndOfLinePreference["LF"] = 1] = "LF";
    EndOfLinePreference[EndOfLinePreference["CRLF"] = 2] = "CRLF";
  })(exports.EndOfLinePreference || (exports.EndOfLinePreference = {}));
  exports.EndOfLineSequence = void 0;
  (function(EndOfLineSequence) {
    EndOfLineSequence[EndOfLineSequence["LF"] = 0] = "LF";
    EndOfLineSequence[EndOfLineSequence["CRLF"] = 1] = "CRLF";
  })(exports.EndOfLineSequence || (exports.EndOfLineSequence = {}));
  exports.GlyphMarginLane$1 = void 0;
  (function(GlyphMarginLane) {
    GlyphMarginLane[GlyphMarginLane["Left"] = 1] = "Left";
    GlyphMarginLane[GlyphMarginLane["Center"] = 2] = "Center";
    GlyphMarginLane[GlyphMarginLane["Right"] = 3] = "Right";
  })(exports.GlyphMarginLane$1 || (exports.GlyphMarginLane$1 = {}));
  exports.HoverVerbosityAction$1 = void 0;
  (function(HoverVerbosityAction) {
    HoverVerbosityAction[HoverVerbosityAction["Increase"] = 0] = "Increase";
    HoverVerbosityAction[HoverVerbosityAction["Decrease"] = 1] = "Decrease";
  })(exports.HoverVerbosityAction$1 || (exports.HoverVerbosityAction$1 = {}));
  exports.IndentAction = void 0;
  (function(IndentAction) {
    IndentAction[IndentAction["None"] = 0] = "None";
    IndentAction[IndentAction["Indent"] = 1] = "Indent";
    IndentAction[IndentAction["IndentOutdent"] = 2] = "IndentOutdent";
    IndentAction[IndentAction["Outdent"] = 3] = "Outdent";
  })(exports.IndentAction || (exports.IndentAction = {}));
  exports.InjectedTextCursorStops$1 = void 0;
  (function(InjectedTextCursorStops) {
    InjectedTextCursorStops[InjectedTextCursorStops["Both"] = 0] = "Both";
    InjectedTextCursorStops[InjectedTextCursorStops["Right"] = 1] = "Right";
    InjectedTextCursorStops[InjectedTextCursorStops["Left"] = 2] = "Left";
    InjectedTextCursorStops[InjectedTextCursorStops["None"] = 3] = "None";
  })(exports.InjectedTextCursorStops$1 || (exports.InjectedTextCursorStops$1 = {}));
  exports.InlayHintKind$1 = void 0;
  (function(InlayHintKind) {
    InlayHintKind[InlayHintKind["Type"] = 1] = "Type";
    InlayHintKind[InlayHintKind["Parameter"] = 2] = "Parameter";
  })(exports.InlayHintKind$1 || (exports.InlayHintKind$1 = {}));
  exports.InlineCompletionEndOfLifeReasonKind$1 = void 0;
  (function(InlineCompletionEndOfLifeReasonKind) {
    InlineCompletionEndOfLifeReasonKind[InlineCompletionEndOfLifeReasonKind["Accepted"] = 0] = "Accepted";
    InlineCompletionEndOfLifeReasonKind[InlineCompletionEndOfLifeReasonKind["Rejected"] = 1] = "Rejected";
    InlineCompletionEndOfLifeReasonKind[InlineCompletionEndOfLifeReasonKind["Ignored"] = 2] = "Ignored";
  })(exports.InlineCompletionEndOfLifeReasonKind$1 || (exports.InlineCompletionEndOfLifeReasonKind$1 = {}));
  exports.InlineCompletionHintStyle$1 = void 0;
  (function(InlineCompletionHintStyle) {
    InlineCompletionHintStyle[InlineCompletionHintStyle["Code"] = 1] = "Code";
    InlineCompletionHintStyle[InlineCompletionHintStyle["Label"] = 2] = "Label";
  })(exports.InlineCompletionHintStyle$1 || (exports.InlineCompletionHintStyle$1 = {}));
  exports.InlineCompletionTriggerKind$1 = void 0;
  (function(InlineCompletionTriggerKind) {
    InlineCompletionTriggerKind[InlineCompletionTriggerKind["Automatic"] = 0] = "Automatic";
    InlineCompletionTriggerKind[InlineCompletionTriggerKind["Explicit"] = 1] = "Explicit";
  })(exports.InlineCompletionTriggerKind$1 || (exports.InlineCompletionTriggerKind$1 = {}));
  var KeyCode;
  (function(KeyCode2) {
    KeyCode2[KeyCode2["DependsOnKbLayout"] = -1] = "DependsOnKbLayout";
    KeyCode2[KeyCode2["Unknown"] = 0] = "Unknown";
    KeyCode2[KeyCode2["Backspace"] = 1] = "Backspace";
    KeyCode2[KeyCode2["Tab"] = 2] = "Tab";
    KeyCode2[KeyCode2["Enter"] = 3] = "Enter";
    KeyCode2[KeyCode2["Shift"] = 4] = "Shift";
    KeyCode2[KeyCode2["Ctrl"] = 5] = "Ctrl";
    KeyCode2[KeyCode2["Alt"] = 6] = "Alt";
    KeyCode2[KeyCode2["PauseBreak"] = 7] = "PauseBreak";
    KeyCode2[KeyCode2["CapsLock"] = 8] = "CapsLock";
    KeyCode2[KeyCode2["Escape"] = 9] = "Escape";
    KeyCode2[KeyCode2["Space"] = 10] = "Space";
    KeyCode2[KeyCode2["PageUp"] = 11] = "PageUp";
    KeyCode2[KeyCode2["PageDown"] = 12] = "PageDown";
    KeyCode2[KeyCode2["End"] = 13] = "End";
    KeyCode2[KeyCode2["Home"] = 14] = "Home";
    KeyCode2[KeyCode2["LeftArrow"] = 15] = "LeftArrow";
    KeyCode2[KeyCode2["UpArrow"] = 16] = "UpArrow";
    KeyCode2[KeyCode2["RightArrow"] = 17] = "RightArrow";
    KeyCode2[KeyCode2["DownArrow"] = 18] = "DownArrow";
    KeyCode2[KeyCode2["Insert"] = 19] = "Insert";
    KeyCode2[KeyCode2["Delete"] = 20] = "Delete";
    KeyCode2[KeyCode2["Digit0"] = 21] = "Digit0";
    KeyCode2[KeyCode2["Digit1"] = 22] = "Digit1";
    KeyCode2[KeyCode2["Digit2"] = 23] = "Digit2";
    KeyCode2[KeyCode2["Digit3"] = 24] = "Digit3";
    KeyCode2[KeyCode2["Digit4"] = 25] = "Digit4";
    KeyCode2[KeyCode2["Digit5"] = 26] = "Digit5";
    KeyCode2[KeyCode2["Digit6"] = 27] = "Digit6";
    KeyCode2[KeyCode2["Digit7"] = 28] = "Digit7";
    KeyCode2[KeyCode2["Digit8"] = 29] = "Digit8";
    KeyCode2[KeyCode2["Digit9"] = 30] = "Digit9";
    KeyCode2[KeyCode2["KeyA"] = 31] = "KeyA";
    KeyCode2[KeyCode2["KeyB"] = 32] = "KeyB";
    KeyCode2[KeyCode2["KeyC"] = 33] = "KeyC";
    KeyCode2[KeyCode2["KeyD"] = 34] = "KeyD";
    KeyCode2[KeyCode2["KeyE"] = 35] = "KeyE";
    KeyCode2[KeyCode2["KeyF"] = 36] = "KeyF";
    KeyCode2[KeyCode2["KeyG"] = 37] = "KeyG";
    KeyCode2[KeyCode2["KeyH"] = 38] = "KeyH";
    KeyCode2[KeyCode2["KeyI"] = 39] = "KeyI";
    KeyCode2[KeyCode2["KeyJ"] = 40] = "KeyJ";
    KeyCode2[KeyCode2["KeyK"] = 41] = "KeyK";
    KeyCode2[KeyCode2["KeyL"] = 42] = "KeyL";
    KeyCode2[KeyCode2["KeyM"] = 43] = "KeyM";
    KeyCode2[KeyCode2["KeyN"] = 44] = "KeyN";
    KeyCode2[KeyCode2["KeyO"] = 45] = "KeyO";
    KeyCode2[KeyCode2["KeyP"] = 46] = "KeyP";
    KeyCode2[KeyCode2["KeyQ"] = 47] = "KeyQ";
    KeyCode2[KeyCode2["KeyR"] = 48] = "KeyR";
    KeyCode2[KeyCode2["KeyS"] = 49] = "KeyS";
    KeyCode2[KeyCode2["KeyT"] = 50] = "KeyT";
    KeyCode2[KeyCode2["KeyU"] = 51] = "KeyU";
    KeyCode2[KeyCode2["KeyV"] = 52] = "KeyV";
    KeyCode2[KeyCode2["KeyW"] = 53] = "KeyW";
    KeyCode2[KeyCode2["KeyX"] = 54] = "KeyX";
    KeyCode2[KeyCode2["KeyY"] = 55] = "KeyY";
    KeyCode2[KeyCode2["KeyZ"] = 56] = "KeyZ";
    KeyCode2[KeyCode2["Meta"] = 57] = "Meta";
    KeyCode2[KeyCode2["ContextMenu"] = 58] = "ContextMenu";
    KeyCode2[KeyCode2["F1"] = 59] = "F1";
    KeyCode2[KeyCode2["F2"] = 60] = "F2";
    KeyCode2[KeyCode2["F3"] = 61] = "F3";
    KeyCode2[KeyCode2["F4"] = 62] = "F4";
    KeyCode2[KeyCode2["F5"] = 63] = "F5";
    KeyCode2[KeyCode2["F6"] = 64] = "F6";
    KeyCode2[KeyCode2["F7"] = 65] = "F7";
    KeyCode2[KeyCode2["F8"] = 66] = "F8";
    KeyCode2[KeyCode2["F9"] = 67] = "F9";
    KeyCode2[KeyCode2["F10"] = 68] = "F10";
    KeyCode2[KeyCode2["F11"] = 69] = "F11";
    KeyCode2[KeyCode2["F12"] = 70] = "F12";
    KeyCode2[KeyCode2["F13"] = 71] = "F13";
    KeyCode2[KeyCode2["F14"] = 72] = "F14";
    KeyCode2[KeyCode2["F15"] = 73] = "F15";
    KeyCode2[KeyCode2["F16"] = 74] = "F16";
    KeyCode2[KeyCode2["F17"] = 75] = "F17";
    KeyCode2[KeyCode2["F18"] = 76] = "F18";
    KeyCode2[KeyCode2["F19"] = 77] = "F19";
    KeyCode2[KeyCode2["F20"] = 78] = "F20";
    KeyCode2[KeyCode2["F21"] = 79] = "F21";
    KeyCode2[KeyCode2["F22"] = 80] = "F22";
    KeyCode2[KeyCode2["F23"] = 81] = "F23";
    KeyCode2[KeyCode2["F24"] = 82] = "F24";
    KeyCode2[KeyCode2["NumLock"] = 83] = "NumLock";
    KeyCode2[KeyCode2["ScrollLock"] = 84] = "ScrollLock";
    KeyCode2[KeyCode2["Semicolon"] = 85] = "Semicolon";
    KeyCode2[KeyCode2["Equal"] = 86] = "Equal";
    KeyCode2[KeyCode2["Comma"] = 87] = "Comma";
    KeyCode2[KeyCode2["Minus"] = 88] = "Minus";
    KeyCode2[KeyCode2["Period"] = 89] = "Period";
    KeyCode2[KeyCode2["Slash"] = 90] = "Slash";
    KeyCode2[KeyCode2["Backquote"] = 91] = "Backquote";
    KeyCode2[KeyCode2["BracketLeft"] = 92] = "BracketLeft";
    KeyCode2[KeyCode2["Backslash"] = 93] = "Backslash";
    KeyCode2[KeyCode2["BracketRight"] = 94] = "BracketRight";
    KeyCode2[KeyCode2["Quote"] = 95] = "Quote";
    KeyCode2[KeyCode2["OEM_8"] = 96] = "OEM_8";
    KeyCode2[KeyCode2["IntlBackslash"] = 97] = "IntlBackslash";
    KeyCode2[KeyCode2["Numpad0"] = 98] = "Numpad0";
    KeyCode2[KeyCode2["Numpad1"] = 99] = "Numpad1";
    KeyCode2[KeyCode2["Numpad2"] = 100] = "Numpad2";
    KeyCode2[KeyCode2["Numpad3"] = 101] = "Numpad3";
    KeyCode2[KeyCode2["Numpad4"] = 102] = "Numpad4";
    KeyCode2[KeyCode2["Numpad5"] = 103] = "Numpad5";
    KeyCode2[KeyCode2["Numpad6"] = 104] = "Numpad6";
    KeyCode2[KeyCode2["Numpad7"] = 105] = "Numpad7";
    KeyCode2[KeyCode2["Numpad8"] = 106] = "Numpad8";
    KeyCode2[KeyCode2["Numpad9"] = 107] = "Numpad9";
    KeyCode2[KeyCode2["NumpadMultiply"] = 108] = "NumpadMultiply";
    KeyCode2[KeyCode2["NumpadAdd"] = 109] = "NumpadAdd";
    KeyCode2[KeyCode2["NUMPAD_SEPARATOR"] = 110] = "NUMPAD_SEPARATOR";
    KeyCode2[KeyCode2["NumpadSubtract"] = 111] = "NumpadSubtract";
    KeyCode2[KeyCode2["NumpadDecimal"] = 112] = "NumpadDecimal";
    KeyCode2[KeyCode2["NumpadDivide"] = 113] = "NumpadDivide";
    KeyCode2[KeyCode2["KEY_IN_COMPOSITION"] = 114] = "KEY_IN_COMPOSITION";
    KeyCode2[KeyCode2["ABNT_C1"] = 115] = "ABNT_C1";
    KeyCode2[KeyCode2["ABNT_C2"] = 116] = "ABNT_C2";
    KeyCode2[KeyCode2["AudioVolumeMute"] = 117] = "AudioVolumeMute";
    KeyCode2[KeyCode2["AudioVolumeUp"] = 118] = "AudioVolumeUp";
    KeyCode2[KeyCode2["AudioVolumeDown"] = 119] = "AudioVolumeDown";
    KeyCode2[KeyCode2["BrowserSearch"] = 120] = "BrowserSearch";
    KeyCode2[KeyCode2["BrowserHome"] = 121] = "BrowserHome";
    KeyCode2[KeyCode2["BrowserBack"] = 122] = "BrowserBack";
    KeyCode2[KeyCode2["BrowserForward"] = 123] = "BrowserForward";
    KeyCode2[KeyCode2["MediaTrackNext"] = 124] = "MediaTrackNext";
    KeyCode2[KeyCode2["MediaTrackPrevious"] = 125] = "MediaTrackPrevious";
    KeyCode2[KeyCode2["MediaStop"] = 126] = "MediaStop";
    KeyCode2[KeyCode2["MediaPlayPause"] = 127] = "MediaPlayPause";
    KeyCode2[KeyCode2["LaunchMediaPlayer"] = 128] = "LaunchMediaPlayer";
    KeyCode2[KeyCode2["LaunchMail"] = 129] = "LaunchMail";
    KeyCode2[KeyCode2["LaunchApp2"] = 130] = "LaunchApp2";
    KeyCode2[KeyCode2["Clear"] = 131] = "Clear";
    KeyCode2[KeyCode2["MAX_VALUE"] = 132] = "MAX_VALUE";
  })(KeyCode || (KeyCode = {}));
  var MarkerSeverity;
  (function(MarkerSeverity2) {
    MarkerSeverity2[MarkerSeverity2["Hint"] = 1] = "Hint";
    MarkerSeverity2[MarkerSeverity2["Info"] = 2] = "Info";
    MarkerSeverity2[MarkerSeverity2["Warning"] = 4] = "Warning";
    MarkerSeverity2[MarkerSeverity2["Error"] = 8] = "Error";
  })(MarkerSeverity || (MarkerSeverity = {}));
  var MarkerTag;
  (function(MarkerTag2) {
    MarkerTag2[MarkerTag2["Unnecessary"] = 1] = "Unnecessary";
    MarkerTag2[MarkerTag2["Deprecated"] = 2] = "Deprecated";
  })(MarkerTag || (MarkerTag = {}));
  exports.MinimapPosition = void 0;
  (function(MinimapPosition) {
    MinimapPosition[MinimapPosition["Inline"] = 1] = "Inline";
    MinimapPosition[MinimapPosition["Gutter"] = 2] = "Gutter";
  })(exports.MinimapPosition || (exports.MinimapPosition = {}));
  exports.MinimapSectionHeaderStyle = void 0;
  (function(MinimapSectionHeaderStyle) {
    MinimapSectionHeaderStyle[MinimapSectionHeaderStyle["Normal"] = 1] = "Normal";
    MinimapSectionHeaderStyle[MinimapSectionHeaderStyle["Underlined"] = 2] = "Underlined";
  })(exports.MinimapSectionHeaderStyle || (exports.MinimapSectionHeaderStyle = {}));
  exports.MouseTargetType = void 0;
  (function(MouseTargetType) {
    MouseTargetType[MouseTargetType["UNKNOWN"] = 0] = "UNKNOWN";
    MouseTargetType[MouseTargetType["TEXTAREA"] = 1] = "TEXTAREA";
    MouseTargetType[MouseTargetType["GUTTER_GLYPH_MARGIN"] = 2] = "GUTTER_GLYPH_MARGIN";
    MouseTargetType[MouseTargetType["GUTTER_LINE_NUMBERS"] = 3] = "GUTTER_LINE_NUMBERS";
    MouseTargetType[MouseTargetType["GUTTER_LINE_DECORATIONS"] = 4] = "GUTTER_LINE_DECORATIONS";
    MouseTargetType[MouseTargetType["GUTTER_VIEW_ZONE"] = 5] = "GUTTER_VIEW_ZONE";
    MouseTargetType[MouseTargetType["CONTENT_TEXT"] = 6] = "CONTENT_TEXT";
    MouseTargetType[MouseTargetType["CONTENT_EMPTY"] = 7] = "CONTENT_EMPTY";
    MouseTargetType[MouseTargetType["CONTENT_VIEW_ZONE"] = 8] = "CONTENT_VIEW_ZONE";
    MouseTargetType[MouseTargetType["CONTENT_WIDGET"] = 9] = "CONTENT_WIDGET";
    MouseTargetType[MouseTargetType["OVERVIEW_RULER"] = 10] = "OVERVIEW_RULER";
    MouseTargetType[MouseTargetType["SCROLLBAR"] = 11] = "SCROLLBAR";
    MouseTargetType[MouseTargetType["OVERLAY_WIDGET"] = 12] = "OVERLAY_WIDGET";
    MouseTargetType[MouseTargetType["OUTSIDE_EDITOR"] = 13] = "OUTSIDE_EDITOR";
  })(exports.MouseTargetType || (exports.MouseTargetType = {}));
  exports.NewSymbolNameTag$1 = void 0;
  (function(NewSymbolNameTag) {
    NewSymbolNameTag[NewSymbolNameTag["AIGenerated"] = 1] = "AIGenerated";
  })(exports.NewSymbolNameTag$1 || (exports.NewSymbolNameTag$1 = {}));
  exports.NewSymbolNameTriggerKind$1 = void 0;
  (function(NewSymbolNameTriggerKind) {
    NewSymbolNameTriggerKind[NewSymbolNameTriggerKind["Invoke"] = 0] = "Invoke";
    NewSymbolNameTriggerKind[NewSymbolNameTriggerKind["Automatic"] = 1] = "Automatic";
  })(exports.NewSymbolNameTriggerKind$1 || (exports.NewSymbolNameTriggerKind$1 = {}));
  exports.OverlayWidgetPositionPreference = void 0;
  (function(OverlayWidgetPositionPreference) {
    OverlayWidgetPositionPreference[OverlayWidgetPositionPreference["TOP_RIGHT_CORNER"] = 0] = "TOP_RIGHT_CORNER";
    OverlayWidgetPositionPreference[OverlayWidgetPositionPreference["BOTTOM_RIGHT_CORNER"] = 1] = "BOTTOM_RIGHT_CORNER";
    OverlayWidgetPositionPreference[OverlayWidgetPositionPreference["TOP_CENTER"] = 2] = "TOP_CENTER";
  })(exports.OverlayWidgetPositionPreference || (exports.OverlayWidgetPositionPreference = {}));
  exports.OverviewRulerLane$1 = void 0;
  (function(OverviewRulerLane) {
    OverviewRulerLane[OverviewRulerLane["Left"] = 1] = "Left";
    OverviewRulerLane[OverviewRulerLane["Center"] = 2] = "Center";
    OverviewRulerLane[OverviewRulerLane["Right"] = 4] = "Right";
    OverviewRulerLane[OverviewRulerLane["Full"] = 7] = "Full";
  })(exports.OverviewRulerLane$1 || (exports.OverviewRulerLane$1 = {}));
  exports.PartialAcceptTriggerKind = void 0;
  (function(PartialAcceptTriggerKind) {
    PartialAcceptTriggerKind[PartialAcceptTriggerKind["Word"] = 0] = "Word";
    PartialAcceptTriggerKind[PartialAcceptTriggerKind["Line"] = 1] = "Line";
    PartialAcceptTriggerKind[PartialAcceptTriggerKind["Suggest"] = 2] = "Suggest";
  })(exports.PartialAcceptTriggerKind || (exports.PartialAcceptTriggerKind = {}));
  exports.PositionAffinity = void 0;
  (function(PositionAffinity) {
    PositionAffinity[PositionAffinity["Left"] = 0] = "Left";
    PositionAffinity[PositionAffinity["Right"] = 1] = "Right";
    PositionAffinity[PositionAffinity["None"] = 2] = "None";
    PositionAffinity[PositionAffinity["LeftOfInjectedText"] = 3] = "LeftOfInjectedText";
    PositionAffinity[PositionAffinity["RightOfInjectedText"] = 4] = "RightOfInjectedText";
  })(exports.PositionAffinity || (exports.PositionAffinity = {}));
  exports.RenderLineNumbersType = void 0;
  (function(RenderLineNumbersType) {
    RenderLineNumbersType[RenderLineNumbersType["Off"] = 0] = "Off";
    RenderLineNumbersType[RenderLineNumbersType["On"] = 1] = "On";
    RenderLineNumbersType[RenderLineNumbersType["Relative"] = 2] = "Relative";
    RenderLineNumbersType[RenderLineNumbersType["Interval"] = 3] = "Interval";
    RenderLineNumbersType[RenderLineNumbersType["Custom"] = 4] = "Custom";
  })(exports.RenderLineNumbersType || (exports.RenderLineNumbersType = {}));
  exports.RenderMinimap = void 0;
  (function(RenderMinimap) {
    RenderMinimap[RenderMinimap["None"] = 0] = "None";
    RenderMinimap[RenderMinimap["Text"] = 1] = "Text";
    RenderMinimap[RenderMinimap["Blocks"] = 2] = "Blocks";
  })(exports.RenderMinimap || (exports.RenderMinimap = {}));
  exports.ScrollType = void 0;
  (function(ScrollType) {
    ScrollType[ScrollType["Smooth"] = 0] = "Smooth";
    ScrollType[ScrollType["Immediate"] = 1] = "Immediate";
  })(exports.ScrollType || (exports.ScrollType = {}));
  exports.ScrollbarVisibility = void 0;
  (function(ScrollbarVisibility) {
    ScrollbarVisibility[ScrollbarVisibility["Auto"] = 1] = "Auto";
    ScrollbarVisibility[ScrollbarVisibility["Hidden"] = 2] = "Hidden";
    ScrollbarVisibility[ScrollbarVisibility["Visible"] = 3] = "Visible";
  })(exports.ScrollbarVisibility || (exports.ScrollbarVisibility = {}));
  var SelectionDirection;
  (function(SelectionDirection2) {
    SelectionDirection2[SelectionDirection2["LTR"] = 0] = "LTR";
    SelectionDirection2[SelectionDirection2["RTL"] = 1] = "RTL";
  })(SelectionDirection || (SelectionDirection = {}));
  exports.ShowLightbulbIconMode = void 0;
  (function(ShowLightbulbIconMode) {
    ShowLightbulbIconMode["Off"] = "off";
    ShowLightbulbIconMode["OnCode"] = "onCode";
    ShowLightbulbIconMode["On"] = "on";
  })(exports.ShowLightbulbIconMode || (exports.ShowLightbulbIconMode = {}));
  exports.SignatureHelpTriggerKind$1 = void 0;
  (function(SignatureHelpTriggerKind) {
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["Invoke"] = 1] = "Invoke";
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["TriggerCharacter"] = 2] = "TriggerCharacter";
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["ContentChange"] = 3] = "ContentChange";
  })(exports.SignatureHelpTriggerKind$1 || (exports.SignatureHelpTriggerKind$1 = {}));
  exports.SymbolKind = void 0;
  (function(SymbolKind) {
    SymbolKind[SymbolKind["File"] = 0] = "File";
    SymbolKind[SymbolKind["Module"] = 1] = "Module";
    SymbolKind[SymbolKind["Namespace"] = 2] = "Namespace";
    SymbolKind[SymbolKind["Package"] = 3] = "Package";
    SymbolKind[SymbolKind["Class"] = 4] = "Class";
    SymbolKind[SymbolKind["Method"] = 5] = "Method";
    SymbolKind[SymbolKind["Property"] = 6] = "Property";
    SymbolKind[SymbolKind["Field"] = 7] = "Field";
    SymbolKind[SymbolKind["Constructor"] = 8] = "Constructor";
    SymbolKind[SymbolKind["Enum"] = 9] = "Enum";
    SymbolKind[SymbolKind["Interface"] = 10] = "Interface";
    SymbolKind[SymbolKind["Function"] = 11] = "Function";
    SymbolKind[SymbolKind["Variable"] = 12] = "Variable";
    SymbolKind[SymbolKind["Constant"] = 13] = "Constant";
    SymbolKind[SymbolKind["String"] = 14] = "String";
    SymbolKind[SymbolKind["Number"] = 15] = "Number";
    SymbolKind[SymbolKind["Boolean"] = 16] = "Boolean";
    SymbolKind[SymbolKind["Array"] = 17] = "Array";
    SymbolKind[SymbolKind["Object"] = 18] = "Object";
    SymbolKind[SymbolKind["Key"] = 19] = "Key";
    SymbolKind[SymbolKind["Null"] = 20] = "Null";
    SymbolKind[SymbolKind["EnumMember"] = 21] = "EnumMember";
    SymbolKind[SymbolKind["Struct"] = 22] = "Struct";
    SymbolKind[SymbolKind["Event"] = 23] = "Event";
    SymbolKind[SymbolKind["Operator"] = 24] = "Operator";
    SymbolKind[SymbolKind["TypeParameter"] = 25] = "TypeParameter";
  })(exports.SymbolKind || (exports.SymbolKind = {}));
  exports.SymbolTag = void 0;
  (function(SymbolTag) {
    SymbolTag[SymbolTag["Deprecated"] = 1] = "Deprecated";
  })(exports.SymbolTag || (exports.SymbolTag = {}));
  exports.TextDirection$1 = void 0;
  (function(TextDirection) {
    TextDirection[TextDirection["LTR"] = 0] = "LTR";
    TextDirection[TextDirection["RTL"] = 1] = "RTL";
  })(exports.TextDirection$1 || (exports.TextDirection$1 = {}));
  exports.TextEditorCursorBlinkingStyle = void 0;
  (function(TextEditorCursorBlinkingStyle) {
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Hidden"] = 0] = "Hidden";
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Blink"] = 1] = "Blink";
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Smooth"] = 2] = "Smooth";
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Phase"] = 3] = "Phase";
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Expand"] = 4] = "Expand";
    TextEditorCursorBlinkingStyle[TextEditorCursorBlinkingStyle["Solid"] = 5] = "Solid";
  })(exports.TextEditorCursorBlinkingStyle || (exports.TextEditorCursorBlinkingStyle = {}));
  exports.TextEditorCursorStyle = void 0;
  (function(TextEditorCursorStyle) {
    TextEditorCursorStyle[TextEditorCursorStyle["Line"] = 1] = "Line";
    TextEditorCursorStyle[TextEditorCursorStyle["Block"] = 2] = "Block";
    TextEditorCursorStyle[TextEditorCursorStyle["Underline"] = 3] = "Underline";
    TextEditorCursorStyle[TextEditorCursorStyle["LineThin"] = 4] = "LineThin";
    TextEditorCursorStyle[TextEditorCursorStyle["BlockOutline"] = 5] = "BlockOutline";
    TextEditorCursorStyle[TextEditorCursorStyle["UnderlineThin"] = 6] = "UnderlineThin";
  })(exports.TextEditorCursorStyle || (exports.TextEditorCursorStyle = {}));
  exports.TrackedRangeStickiness = void 0;
  (function(TrackedRangeStickiness) {
    TrackedRangeStickiness[TrackedRangeStickiness["AlwaysGrowsWhenTypingAtEdges"] = 0] = "AlwaysGrowsWhenTypingAtEdges";
    TrackedRangeStickiness[TrackedRangeStickiness["NeverGrowsWhenTypingAtEdges"] = 1] = "NeverGrowsWhenTypingAtEdges";
    TrackedRangeStickiness[TrackedRangeStickiness["GrowsOnlyWhenTypingBefore"] = 2] = "GrowsOnlyWhenTypingBefore";
    TrackedRangeStickiness[TrackedRangeStickiness["GrowsOnlyWhenTypingAfter"] = 3] = "GrowsOnlyWhenTypingAfter";
  })(exports.TrackedRangeStickiness || (exports.TrackedRangeStickiness = {}));
  exports.WrappingIndent = void 0;
  (function(WrappingIndent) {
    WrappingIndent[WrappingIndent["None"] = 0] = "None";
    WrappingIndent[WrappingIndent["Same"] = 1] = "Same";
    WrappingIndent[WrappingIndent["Indent"] = 2] = "Indent";
    WrappingIndent[WrappingIndent["DeepIndent"] = 3] = "DeepIndent";
  })(exports.WrappingIndent || (exports.WrappingIndent = {}));
  const _KeyMod = class _KeyMod {
    static chord(firstPart, secondPart) {
      return KeyChord(firstPart, secondPart);
    }
  };
  _KeyMod.CtrlCmd = 2048;
  _KeyMod.Shift = 1024;
  _KeyMod.Alt = 512;
  _KeyMod.WinCtrl = 256;
  let KeyMod = _KeyMod;
  function createMonacoBaseAPI() {
    return {
      editor: void 0,
      // undefined override expected here
      languages: void 0,
      // undefined override expected here
      CancellationTokenSource,
      Emitter,
      KeyCode,
      KeyMod,
      Position,
      Range,
      Selection,
      SelectionDirection,
      MarkerSeverity,
      MarkerTag,
      Uri: URI,
      Token
    };
  }
  function identity(t) {
    return t;
  }
  class LRUCachedFunction {
    constructor(arg1, arg2) {
      this.lastCache = void 0;
      this.lastArgKey = void 0;
      if (typeof arg1 === "function") {
        this._fn = arg1;
        this._computeKey = identity;
      } else {
        this._fn = arg2;
        this._computeKey = arg1.getCacheKey;
      }
    }
    get(arg) {
      const key = this._computeKey(arg);
      if (this.lastArgKey !== key) {
        this.lastArgKey = key;
        this.lastCache = this._fn(arg);
      }
      return this.lastCache;
    }
  }
  class CachedFunction {
    get cachedValues() {
      return this._map;
    }
    constructor(arg1, arg2) {
      this._map = /* @__PURE__ */ new Map();
      this._map2 = /* @__PURE__ */ new Map();
      if (typeof arg1 === "function") {
        this._fn = arg1;
        this._computeKey = identity;
      } else {
        this._fn = arg2;
        this._computeKey = arg1.getCacheKey;
      }
    }
    get(arg) {
      const key = this._computeKey(arg);
      if (this._map2.has(key)) {
        return this._map2.get(key);
      }
      const value = this._fn(arg);
      this._map.set(arg, value);
      this._map2.set(key, value);
      return value;
    }
  }
  var LazyValueState;
  (function(LazyValueState2) {
    LazyValueState2[LazyValueState2["Uninitialized"] = 0] = "Uninitialized";
    LazyValueState2[LazyValueState2["Running"] = 1] = "Running";
    LazyValueState2[LazyValueState2["Completed"] = 2] = "Completed";
  })(LazyValueState || (LazyValueState = {}));
  class Lazy {
    constructor(executor) {
      this.executor = executor;
      this._state = LazyValueState.Uninitialized;
    }
    /**
     * Get the wrapped value.
     *
     * This will force evaluation of the lazy value if it has not been resolved yet. Lazy values are only
     * resolved once. `getValue` will re-throw exceptions that are hit while resolving the value
     */
    get value() {
      if (this._state === LazyValueState.Uninitialized) {
        this._state = LazyValueState.Running;
        try {
          this._value = this.executor();
        } catch (err) {
          this._error = err;
        } finally {
          this._state = LazyValueState.Completed;
        }
      } else if (this._state === LazyValueState.Running) {
        throw new Error("Cannot read the value of a lazy that is being initialized");
      }
      if (this._error) {
        throw this._error;
      }
      return this._value;
    }
    /**
     * Get the wrapped value without forcing evaluation.
     */
    get rawValue() {
      return this._value;
    }
  }
  function isFalsyOrWhitespace(str) {
    if (!str || typeof str !== "string") {
      return true;
    }
    return str.trim().length === 0;
  }
  const _formatRegexp = /{(\d+)}/g;
  function format(value, ...args) {
    if (args.length === 0) {
      return value;
    }
    return value.replace(_formatRegexp, function(match, group) {
      const idx = parseInt(group, 10);
      return isNaN(idx) || idx < 0 || idx >= args.length ? match : args[idx];
    });
  }
  function htmlAttributeEncodeValue(value) {
    return value.replace(/[<>"'&]/g, (ch) => {
      switch (ch) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&apos;";
        case "&":
          return "&amp;";
      }
      return ch;
    });
  }
  function escape(html) {
    return html.replace(/[<>&]/g, function(match) {
      switch (match) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        default:
          return match;
      }
    });
  }
  function escapeRegExpCharacters(value) {
    return value.replace(/[\\\{\}\*\+\?\|\^\$\.\[\]\(\)]/g, "\\$&");
  }
  function trim(haystack, needle = " ") {
    const trimmed = ltrim(haystack, needle);
    return rtrim(trimmed, needle);
  }
  function ltrim(haystack, needle) {
    if (!haystack || !needle) {
      return haystack;
    }
    const needleLen = needle.length;
    let offset = 0;
    if (needleLen === 1) {
      const ch = needle.charCodeAt(0);
      while (offset < haystack.length && haystack.charCodeAt(offset) === ch) {
        offset++;
      }
    } else {
      while (haystack.startsWith(needle, offset)) {
        offset += needleLen;
      }
    }
    return haystack.substring(offset);
  }
  function rtrim(haystack, needle) {
    if (!haystack || !needle) {
      return haystack;
    }
    const needleLen = needle.length, haystackLen = haystack.length;
    if (needleLen === 1) {
      let end = haystackLen;
      const ch = needle.charCodeAt(0);
      while (end > 0 && haystack.charCodeAt(end - 1) === ch) {
        end--;
      }
      return haystack.substring(0, end);
    }
    let offset = haystackLen;
    while (offset > 0 && haystack.endsWith(needle, offset)) {
      offset -= needleLen;
    }
    return haystack.substring(0, offset);
  }
  function convertSimple2RegExpPattern(pattern) {
    return pattern.replace(/[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&").replace(/[\*]/g, ".*");
  }
  function createRegExp(searchString, isRegex, options = {}) {
    if (!searchString) {
      throw new Error("Cannot create regex from empty string");
    }
    if (!isRegex) {
      searchString = escapeRegExpCharacters(searchString);
    }
    if (options.wholeWord) {
      if (!/\B/.test(searchString.charAt(0))) {
        searchString = "\\b" + searchString;
      }
      if (!/\B/.test(searchString.charAt(searchString.length - 1))) {
        searchString = searchString + "\\b";
      }
    }
    let modifiers = "";
    if (options.global) {
      modifiers += "g";
    }
    if (!options.matchCase) {
      modifiers += "i";
    }
    if (options.multiline) {
      modifiers += "m";
    }
    if (options.unicode) {
      modifiers += "u";
    }
    return new RegExp(searchString, modifiers);
  }
  function regExpLeadsToEndlessLoop(regexp) {
    if (regexp.source === "^" || regexp.source === "^$" || regexp.source === "$" || regexp.source === "^\\s*$") {
      return false;
    }
    const match = regexp.exec("");
    return !!(match && regexp.lastIndex === 0);
  }
  function splitLines(str) {
    return str.split(/\r\n|\r|\n/);
  }
  function firstNonWhitespaceIndex(str) {
    for (let i = 0, len = str.length; i < len; i++) {
      const chCode = str.charCodeAt(i);
      if (chCode !== 32 && chCode !== 9) {
        return i;
      }
    }
    return -1;
  }
  function getLeadingWhitespace(str, start = 0, end = str.length) {
    for (let i = start; i < end; i++) {
      const chCode = str.charCodeAt(i);
      if (chCode !== 32 && chCode !== 9) {
        return str.substring(start, i);
      }
    }
    return str.substring(start, end);
  }
  function lastNonWhitespaceIndex(str, startIndex = str.length - 1) {
    for (let i = startIndex; i >= 0; i--) {
      const chCode = str.charCodeAt(i);
      if (chCode !== 32 && chCode !== 9) {
        return i;
      }
    }
    return -1;
  }
  function compare(a, b) {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  }
  function compareSubstring(a, b, aStart = 0, aEnd = a.length, bStart = 0, bEnd = b.length) {
    for (; aStart < aEnd && bStart < bEnd; aStart++, bStart++) {
      const codeA = a.charCodeAt(aStart);
      const codeB = b.charCodeAt(bStart);
      if (codeA < codeB) {
        return -1;
      } else if (codeA > codeB) {
        return 1;
      }
    }
    const aLen = aEnd - aStart;
    const bLen = bEnd - bStart;
    if (aLen < bLen) {
      return -1;
    } else if (aLen > bLen) {
      return 1;
    }
    return 0;
  }
  function compareIgnoreCase(a, b) {
    return compareSubstringIgnoreCase(a, b, 0, a.length, 0, b.length);
  }
  function compareSubstringIgnoreCase(a, b, aStart = 0, aEnd = a.length, bStart = 0, bEnd = b.length) {
    for (; aStart < aEnd && bStart < bEnd; aStart++, bStart++) {
      let codeA = a.charCodeAt(aStart);
      let codeB = b.charCodeAt(bStart);
      if (codeA === codeB) {
        continue;
      }
      if (codeA >= 128 || codeB >= 128) {
        return compareSubstring(a.toLowerCase(), b.toLowerCase(), aStart, aEnd, bStart, bEnd);
      }
      if (isLowerAsciiLetter(codeA)) {
        codeA -= 32;
      }
      if (isLowerAsciiLetter(codeB)) {
        codeB -= 32;
      }
      const diff = codeA - codeB;
      if (diff === 0) {
        continue;
      }
      return diff;
    }
    const aLen = aEnd - aStart;
    const bLen = bEnd - bStart;
    if (aLen < bLen) {
      return -1;
    } else if (aLen > bLen) {
      return 1;
    }
    return 0;
  }
  function isAsciiDigit(code) {
    return code >= 48 && code <= 57;
  }
  function isLowerAsciiLetter(code) {
    return code >= 97 && code <= 122;
  }
  function isUpperAsciiLetter(code) {
    return code >= 65 && code <= 90;
  }
  function equalsIgnoreCase(a, b) {
    return a.length === b.length && compareSubstringIgnoreCase(a, b) === 0;
  }
  function equals(a, b, ignoreCase) {
    return a === b || a !== void 0 && b !== void 0 && equalsIgnoreCase(a, b);
  }
  function startsWithIgnoreCase(str, candidate) {
    const len = candidate.length;
    return len <= str.length && compareSubstringIgnoreCase(str, candidate, 0, len) === 0;
  }
  function endsWithIgnoreCase(str, candidate) {
    const len = str.length;
    const start = len - candidate.length;
    return start >= 0 && compareSubstringIgnoreCase(str, candidate, start, len) === 0;
  }
  function commonPrefixLength(a, b) {
    const len = Math.min(a.length, b.length);
    let i;
    for (i = 0; i < len; i++) {
      if (a.charCodeAt(i) !== b.charCodeAt(i)) {
        return i;
      }
    }
    return len;
  }
  function commonSuffixLength(a, b) {
    const len = Math.min(a.length, b.length);
    let i;
    const aLastIndex = a.length - 1;
    const bLastIndex = b.length - 1;
    for (i = 0; i < len; i++) {
      if (a.charCodeAt(aLastIndex - i) !== b.charCodeAt(bLastIndex - i)) {
        return i;
      }
    }
    return len;
  }
  function isHighSurrogate(charCode) {
    return 55296 <= charCode && charCode <= 56319;
  }
  function isLowSurrogate(charCode) {
    return 56320 <= charCode && charCode <= 57343;
  }
  function computeCodePoint(highSurrogate, lowSurrogate) {
    return (highSurrogate - 55296 << 10) + (lowSurrogate - 56320) + 65536;
  }
  function getNextCodePoint(str, len, offset) {
    const charCode = str.charCodeAt(offset);
    if (isHighSurrogate(charCode) && offset + 1 < len) {
      const nextCharCode = str.charCodeAt(offset + 1);
      if (isLowSurrogate(nextCharCode)) {
        return computeCodePoint(charCode, nextCharCode);
      }
    }
    return charCode;
  }
  function getPrevCodePoint(str, offset) {
    const charCode = str.charCodeAt(offset - 1);
    if (isLowSurrogate(charCode) && offset > 1) {
      const prevCharCode = str.charCodeAt(offset - 2);
      if (isHighSurrogate(prevCharCode)) {
        return computeCodePoint(prevCharCode, charCode);
      }
    }
    return charCode;
  }
  class CodePointIterator {
    get offset() {
      return this._offset;
    }
    constructor(str, offset = 0) {
      this._str = str;
      this._len = str.length;
      this._offset = offset;
    }
    setOffset(offset) {
      this._offset = offset;
    }
    prevCodePoint() {
      const codePoint = getPrevCodePoint(this._str, this._offset);
      this._offset -= codePoint >= 65536 ? 2 : 1;
      return codePoint;
    }
    nextCodePoint() {
      const codePoint = getNextCodePoint(this._str, this._len, this._offset);
      this._offset += codePoint >= 65536 ? 2 : 1;
      return codePoint;
    }
    eol() {
      return this._offset >= this._len;
    }
  }
  class GraphemeIterator {
    get offset() {
      return this._iterator.offset;
    }
    constructor(str, offset = 0) {
      this._iterator = new CodePointIterator(str, offset);
    }
    nextGraphemeLength() {
      const graphemeBreakTree = GraphemeBreakTree.getInstance();
      const iterator = this._iterator;
      const initialOffset = iterator.offset;
      let graphemeBreakType = graphemeBreakTree.getGraphemeBreakType(iterator.nextCodePoint());
      while (!iterator.eol()) {
        const offset = iterator.offset;
        const nextGraphemeBreakType = graphemeBreakTree.getGraphemeBreakType(iterator.nextCodePoint());
        if (breakBetweenGraphemeBreakType(graphemeBreakType, nextGraphemeBreakType)) {
          iterator.setOffset(offset);
          break;
        }
        graphemeBreakType = nextGraphemeBreakType;
      }
      return iterator.offset - initialOffset;
    }
    prevGraphemeLength() {
      const graphemeBreakTree = GraphemeBreakTree.getInstance();
      const iterator = this._iterator;
      const initialOffset = iterator.offset;
      let graphemeBreakType = graphemeBreakTree.getGraphemeBreakType(iterator.prevCodePoint());
      while (iterator.offset > 0) {
        const offset = iterator.offset;
        const prevGraphemeBreakType = graphemeBreakTree.getGraphemeBreakType(iterator.prevCodePoint());
        if (breakBetweenGraphemeBreakType(prevGraphemeBreakType, graphemeBreakType)) {
          iterator.setOffset(offset);
          break;
        }
        graphemeBreakType = prevGraphemeBreakType;
      }
      return initialOffset - iterator.offset;
    }
    eol() {
      return this._iterator.eol();
    }
  }
  function nextCharLength(str, initialOffset) {
    const iterator = new GraphemeIterator(str, initialOffset);
    return iterator.nextGraphemeLength();
  }
  function prevCharLength(str, initialOffset) {
    const iterator = new GraphemeIterator(str, initialOffset);
    return iterator.prevGraphemeLength();
  }
  function getCharContainingOffset(str, offset) {
    if (offset > 0 && isLowSurrogate(str.charCodeAt(offset))) {
      offset--;
    }
    const endOffset = offset + nextCharLength(str, offset);
    const startOffset = endOffset - prevCharLength(str, endOffset);
    return [startOffset, endOffset];
  }
  let CONTAINS_RTL = void 0;
  function makeContainsRtl() {
    return /(?:[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05F4\u0608\u060B\u060D\u061B-\u064A\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u0710\u0712-\u072F\u074D-\u07A5\u07B1-\u07EA\u07F4\u07F5\u07FA\u07FE-\u0815\u081A\u0824\u0828\u0830-\u0858\u085E-\u088E\u08A0-\u08C9\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFD3D\uFD50-\uFDC7\uFDF0-\uFDFC\uFE70-\uFEFC]|\uD802[\uDC00-\uDD1B\uDD20-\uDE00\uDE10-\uDE35\uDE40-\uDEE4\uDEEB-\uDF35\uDF40-\uDFFF]|\uD803[\uDC00-\uDD23\uDE80-\uDEA9\uDEAD-\uDF45\uDF51-\uDF81\uDF86-\uDFF6]|\uD83A[\uDC00-\uDCCF\uDD00-\uDD43\uDD4B-\uDFFF]|\uD83B[\uDC00-\uDEBB])/;
  }
  function containsRTL(str) {
    if (!CONTAINS_RTL) {
      CONTAINS_RTL = makeContainsRtl();
    }
    return CONTAINS_RTL.test(str);
  }
  const IS_BASIC_ASCII = /^[\t\n\r\x20-\x7E]*$/;
  function isBasicASCII(str) {
    return IS_BASIC_ASCII.test(str);
  }
  const UNUSUAL_LINE_TERMINATORS = /[\u2028\u2029]/;
  function containsUnusualLineTerminators(str) {
    return UNUSUAL_LINE_TERMINATORS.test(str);
  }
  function isFullWidthCharacter(charCode) {
    return charCode >= 11904 && charCode <= 55215 || charCode >= 63744 && charCode <= 64255 || charCode >= 65281 && charCode <= 65374 || charCode >= 65504 && charCode <= 65510;
  }
  function isEmojiImprecise(x) {
    return x >= 127462 && x <= 127487 || x === 8986 || x === 8987 || x === 9200 || x === 9203 || x >= 9728 && x <= 10175 || x === 11088 || x === 11093 || x >= 127744 && x <= 128591 || x >= 128640 && x <= 128764 || x >= 128992 && x <= 129008 || x >= 129280 && x <= 129535 || x >= 129648 && x <= 129782;
  }
  const UTF8_BOM_CHARACTER = String.fromCharCode(
    65279
    /* CharCode.UTF8_BOM */
  );
  function startsWithUTF8BOM(str) {
    return !!(str && str.length > 0 && str.charCodeAt(0) === 65279);
  }
  function containsUppercaseCharacter(target, ignoreEscapedChars = false) {
    if (!target) {
      return false;
    }
    if (ignoreEscapedChars) {
      target = target.replace(/\\./g, "");
    }
    return target.toLowerCase() !== target;
  }
  function singleLetterHash(n) {
    const LETTERS_CNT = 90 - 65 + 1;
    n = n % (2 * LETTERS_CNT);
    if (n < LETTERS_CNT) {
      return String.fromCharCode(97 + n);
    }
    return String.fromCharCode(65 + n - LETTERS_CNT);
  }
  function breakBetweenGraphemeBreakType(breakTypeA, breakTypeB) {
    if (breakTypeA === 0) {
      return breakTypeB !== 5 && breakTypeB !== 7;
    }
    if (breakTypeA === 2) {
      if (breakTypeB === 3) {
        return false;
      }
    }
    if (breakTypeA === 4 || breakTypeA === 2 || breakTypeA === 3) {
      return true;
    }
    if (breakTypeB === 4 || breakTypeB === 2 || breakTypeB === 3) {
      return true;
    }
    if (breakTypeA === 8) {
      if (breakTypeB === 8 || breakTypeB === 9 || breakTypeB === 11 || breakTypeB === 12) {
        return false;
      }
    }
    if (breakTypeA === 11 || breakTypeA === 9) {
      if (breakTypeB === 9 || breakTypeB === 10) {
        return false;
      }
    }
    if (breakTypeA === 12 || breakTypeA === 10) {
      if (breakTypeB === 10) {
        return false;
      }
    }
    if (breakTypeB === 5 || breakTypeB === 13) {
      return false;
    }
    if (breakTypeB === 7) {
      return false;
    }
    if (breakTypeA === 1) {
      return false;
    }
    if (breakTypeA === 13 && breakTypeB === 14) {
      return false;
    }
    if (breakTypeA === 6 && breakTypeB === 6) {
      return false;
    }
    return true;
  }
  const _GraphemeBreakTree = class _GraphemeBreakTree {
    static getInstance() {
      if (!_GraphemeBreakTree._INSTANCE) {
        _GraphemeBreakTree._INSTANCE = new _GraphemeBreakTree();
      }
      return _GraphemeBreakTree._INSTANCE;
    }
    constructor() {
      this._data = getGraphemeBreakRawData();
    }
    getGraphemeBreakType(codePoint) {
      if (codePoint < 32) {
        if (codePoint === 10) {
          return 3;
        }
        if (codePoint === 13) {
          return 2;
        }
        return 4;
      }
      if (codePoint < 127) {
        return 0;
      }
      const data = this._data;
      const nodeCount = data.length / 3;
      let nodeIndex = 1;
      while (nodeIndex <= nodeCount) {
        if (codePoint < data[3 * nodeIndex]) {
          nodeIndex = 2 * nodeIndex;
        } else if (codePoint > data[3 * nodeIndex + 1]) {
          nodeIndex = 2 * nodeIndex + 1;
        } else {
          return data[3 * nodeIndex + 2];
        }
      }
      return 0;
    }
  };
  _GraphemeBreakTree._INSTANCE = null;
  let GraphemeBreakTree = _GraphemeBreakTree;
  function getGraphemeBreakRawData() {
    return JSON.parse("[0,0,0,51229,51255,12,44061,44087,12,127462,127487,6,7083,7085,5,47645,47671,12,54813,54839,12,128678,128678,14,3270,3270,5,9919,9923,14,45853,45879,12,49437,49463,12,53021,53047,12,71216,71218,7,128398,128399,14,129360,129374,14,2519,2519,5,4448,4519,9,9742,9742,14,12336,12336,14,44957,44983,12,46749,46775,12,48541,48567,12,50333,50359,12,52125,52151,12,53917,53943,12,69888,69890,5,73018,73018,5,127990,127990,14,128558,128559,14,128759,128760,14,129653,129655,14,2027,2035,5,2891,2892,7,3761,3761,5,6683,6683,5,8293,8293,4,9825,9826,14,9999,9999,14,43452,43453,5,44509,44535,12,45405,45431,12,46301,46327,12,47197,47223,12,48093,48119,12,48989,49015,12,49885,49911,12,50781,50807,12,51677,51703,12,52573,52599,12,53469,53495,12,54365,54391,12,65279,65279,4,70471,70472,7,72145,72147,7,119173,119179,5,127799,127818,14,128240,128244,14,128512,128512,14,128652,128652,14,128721,128722,14,129292,129292,14,129445,129450,14,129734,129743,14,1476,1477,5,2366,2368,7,2750,2752,7,3076,3076,5,3415,3415,5,4141,4144,5,6109,6109,5,6964,6964,5,7394,7400,5,9197,9198,14,9770,9770,14,9877,9877,14,9968,9969,14,10084,10084,14,43052,43052,5,43713,43713,5,44285,44311,12,44733,44759,12,45181,45207,12,45629,45655,12,46077,46103,12,46525,46551,12,46973,46999,12,47421,47447,12,47869,47895,12,48317,48343,12,48765,48791,12,49213,49239,12,49661,49687,12,50109,50135,12,50557,50583,12,51005,51031,12,51453,51479,12,51901,51927,12,52349,52375,12,52797,52823,12,53245,53271,12,53693,53719,12,54141,54167,12,54589,54615,12,55037,55063,12,69506,69509,5,70191,70193,5,70841,70841,7,71463,71467,5,72330,72342,5,94031,94031,5,123628,123631,5,127763,127765,14,127941,127941,14,128043,128062,14,128302,128317,14,128465,128467,14,128539,128539,14,128640,128640,14,128662,128662,14,128703,128703,14,128745,128745,14,129004,129007,14,129329,129330,14,129402,129402,14,129483,129483,14,129686,129704,14,130048,131069,14,173,173,4,1757,1757,1,2200,2207,5,2434,2435,7,2631,2632,5,2817,2817,5,3008,3008,5,3201,3201,5,3387,3388,5,3542,3542,5,3902,3903,7,4190,4192,5,6002,6003,5,6439,6440,5,6765,6770,7,7019,7027,5,7154,7155,7,8205,8205,13,8505,8505,14,9654,9654,14,9757,9757,14,9792,9792,14,9852,9853,14,9890,9894,14,9937,9937,14,9981,9981,14,10035,10036,14,11035,11036,14,42654,42655,5,43346,43347,7,43587,43587,5,44006,44007,7,44173,44199,12,44397,44423,12,44621,44647,12,44845,44871,12,45069,45095,12,45293,45319,12,45517,45543,12,45741,45767,12,45965,45991,12,46189,46215,12,46413,46439,12,46637,46663,12,46861,46887,12,47085,47111,12,47309,47335,12,47533,47559,12,47757,47783,12,47981,48007,12,48205,48231,12,48429,48455,12,48653,48679,12,48877,48903,12,49101,49127,12,49325,49351,12,49549,49575,12,49773,49799,12,49997,50023,12,50221,50247,12,50445,50471,12,50669,50695,12,50893,50919,12,51117,51143,12,51341,51367,12,51565,51591,12,51789,51815,12,52013,52039,12,52237,52263,12,52461,52487,12,52685,52711,12,52909,52935,12,53133,53159,12,53357,53383,12,53581,53607,12,53805,53831,12,54029,54055,12,54253,54279,12,54477,54503,12,54701,54727,12,54925,54951,12,55149,55175,12,68101,68102,5,69762,69762,7,70067,70069,7,70371,70378,5,70720,70721,7,71087,71087,5,71341,71341,5,71995,71996,5,72249,72249,7,72850,72871,5,73109,73109,5,118576,118598,5,121505,121519,5,127245,127247,14,127568,127569,14,127777,127777,14,127872,127891,14,127956,127967,14,128015,128016,14,128110,128172,14,128259,128259,14,128367,128368,14,128424,128424,14,128488,128488,14,128530,128532,14,128550,128551,14,128566,128566,14,128647,128647,14,128656,128656,14,128667,128673,14,128691,128693,14,128715,128715,14,128728,128732,14,128752,128752,14,128765,128767,14,129096,129103,14,129311,129311,14,129344,129349,14,129394,129394,14,129413,129425,14,129466,129471,14,129511,129535,14,129664,129666,14,129719,129722,14,129760,129767,14,917536,917631,5,13,13,2,1160,1161,5,1564,1564,4,1807,1807,1,2085,2087,5,2307,2307,7,2382,2383,7,2497,2500,5,2563,2563,7,2677,2677,5,2763,2764,7,2879,2879,5,2914,2915,5,3021,3021,5,3142,3144,5,3263,3263,5,3285,3286,5,3398,3400,7,3530,3530,5,3633,3633,5,3864,3865,5,3974,3975,5,4155,4156,7,4229,4230,5,5909,5909,7,6078,6085,7,6277,6278,5,6451,6456,7,6744,6750,5,6846,6846,5,6972,6972,5,7074,7077,5,7146,7148,7,7222,7223,5,7416,7417,5,8234,8238,4,8417,8417,5,9000,9000,14,9203,9203,14,9730,9731,14,9748,9749,14,9762,9763,14,9776,9783,14,9800,9811,14,9831,9831,14,9872,9873,14,9882,9882,14,9900,9903,14,9929,9933,14,9941,9960,14,9974,9974,14,9989,9989,14,10006,10006,14,10062,10062,14,10160,10160,14,11647,11647,5,12953,12953,14,43019,43019,5,43232,43249,5,43443,43443,5,43567,43568,7,43696,43696,5,43765,43765,7,44013,44013,5,44117,44143,12,44229,44255,12,44341,44367,12,44453,44479,12,44565,44591,12,44677,44703,12,44789,44815,12,44901,44927,12,45013,45039,12,45125,45151,12,45237,45263,12,45349,45375,12,45461,45487,12,45573,45599,12,45685,45711,12,45797,45823,12,45909,45935,12,46021,46047,12,46133,46159,12,46245,46271,12,46357,46383,12,46469,46495,12,46581,46607,12,46693,46719,12,46805,46831,12,46917,46943,12,47029,47055,12,47141,47167,12,47253,47279,12,47365,47391,12,47477,47503,12,47589,47615,12,47701,47727,12,47813,47839,12,47925,47951,12,48037,48063,12,48149,48175,12,48261,48287,12,48373,48399,12,48485,48511,12,48597,48623,12,48709,48735,12,48821,48847,12,48933,48959,12,49045,49071,12,49157,49183,12,49269,49295,12,49381,49407,12,49493,49519,12,49605,49631,12,49717,49743,12,49829,49855,12,49941,49967,12,50053,50079,12,50165,50191,12,50277,50303,12,50389,50415,12,50501,50527,12,50613,50639,12,50725,50751,12,50837,50863,12,50949,50975,12,51061,51087,12,51173,51199,12,51285,51311,12,51397,51423,12,51509,51535,12,51621,51647,12,51733,51759,12,51845,51871,12,51957,51983,12,52069,52095,12,52181,52207,12,52293,52319,12,52405,52431,12,52517,52543,12,52629,52655,12,52741,52767,12,52853,52879,12,52965,52991,12,53077,53103,12,53189,53215,12,53301,53327,12,53413,53439,12,53525,53551,12,53637,53663,12,53749,53775,12,53861,53887,12,53973,53999,12,54085,54111,12,54197,54223,12,54309,54335,12,54421,54447,12,54533,54559,12,54645,54671,12,54757,54783,12,54869,54895,12,54981,55007,12,55093,55119,12,55243,55291,10,66045,66045,5,68325,68326,5,69688,69702,5,69817,69818,5,69957,69958,7,70089,70092,5,70198,70199,5,70462,70462,5,70502,70508,5,70750,70750,5,70846,70846,7,71100,71101,5,71230,71230,7,71351,71351,5,71737,71738,5,72000,72000,7,72160,72160,5,72273,72278,5,72752,72758,5,72882,72883,5,73031,73031,5,73461,73462,7,94192,94193,7,119149,119149,7,121403,121452,5,122915,122916,5,126980,126980,14,127358,127359,14,127535,127535,14,127759,127759,14,127771,127771,14,127792,127793,14,127825,127867,14,127897,127899,14,127945,127945,14,127985,127986,14,128000,128007,14,128021,128021,14,128066,128100,14,128184,128235,14,128249,128252,14,128266,128276,14,128335,128335,14,128379,128390,14,128407,128419,14,128444,128444,14,128481,128481,14,128499,128499,14,128526,128526,14,128536,128536,14,128543,128543,14,128556,128556,14,128564,128564,14,128577,128580,14,128643,128645,14,128649,128649,14,128654,128654,14,128660,128660,14,128664,128664,14,128675,128675,14,128686,128689,14,128695,128696,14,128705,128709,14,128717,128719,14,128725,128725,14,128736,128741,14,128747,128748,14,128755,128755,14,128762,128762,14,128981,128991,14,129009,129023,14,129160,129167,14,129296,129304,14,129320,129327,14,129340,129342,14,129356,129356,14,129388,129392,14,129399,129400,14,129404,129407,14,129432,129442,14,129454,129455,14,129473,129474,14,129485,129487,14,129648,129651,14,129659,129660,14,129671,129679,14,129709,129711,14,129728,129730,14,129751,129753,14,129776,129782,14,917505,917505,4,917760,917999,5,10,10,3,127,159,4,768,879,5,1471,1471,5,1536,1541,1,1648,1648,5,1767,1768,5,1840,1866,5,2070,2073,5,2137,2139,5,2274,2274,1,2363,2363,7,2377,2380,7,2402,2403,5,2494,2494,5,2507,2508,7,2558,2558,5,2622,2624,7,2641,2641,5,2691,2691,7,2759,2760,5,2786,2787,5,2876,2876,5,2881,2884,5,2901,2902,5,3006,3006,5,3014,3016,7,3072,3072,5,3134,3136,5,3157,3158,5,3260,3260,5,3266,3266,5,3274,3275,7,3328,3329,5,3391,3392,7,3405,3405,5,3457,3457,5,3536,3537,7,3551,3551,5,3636,3642,5,3764,3772,5,3895,3895,5,3967,3967,7,3993,4028,5,4146,4151,5,4182,4183,7,4226,4226,5,4253,4253,5,4957,4959,5,5940,5940,7,6070,6070,7,6087,6088,7,6158,6158,4,6432,6434,5,6448,6449,7,6679,6680,5,6742,6742,5,6754,6754,5,6783,6783,5,6912,6915,5,6966,6970,5,6978,6978,5,7042,7042,7,7080,7081,5,7143,7143,7,7150,7150,7,7212,7219,5,7380,7392,5,7412,7412,5,8203,8203,4,8232,8232,4,8265,8265,14,8400,8412,5,8421,8432,5,8617,8618,14,9167,9167,14,9200,9200,14,9410,9410,14,9723,9726,14,9733,9733,14,9745,9745,14,9752,9752,14,9760,9760,14,9766,9766,14,9774,9774,14,9786,9786,14,9794,9794,14,9823,9823,14,9828,9828,14,9833,9850,14,9855,9855,14,9875,9875,14,9880,9880,14,9885,9887,14,9896,9897,14,9906,9916,14,9926,9927,14,9935,9935,14,9939,9939,14,9962,9962,14,9972,9972,14,9978,9978,14,9986,9986,14,9997,9997,14,10002,10002,14,10017,10017,14,10055,10055,14,10071,10071,14,10133,10135,14,10548,10549,14,11093,11093,14,12330,12333,5,12441,12442,5,42608,42610,5,43010,43010,5,43045,43046,5,43188,43203,7,43302,43309,5,43392,43394,5,43446,43449,5,43493,43493,5,43571,43572,7,43597,43597,7,43703,43704,5,43756,43757,5,44003,44004,7,44009,44010,7,44033,44059,12,44089,44115,12,44145,44171,12,44201,44227,12,44257,44283,12,44313,44339,12,44369,44395,12,44425,44451,12,44481,44507,12,44537,44563,12,44593,44619,12,44649,44675,12,44705,44731,12,44761,44787,12,44817,44843,12,44873,44899,12,44929,44955,12,44985,45011,12,45041,45067,12,45097,45123,12,45153,45179,12,45209,45235,12,45265,45291,12,45321,45347,12,45377,45403,12,45433,45459,12,45489,45515,12,45545,45571,12,45601,45627,12,45657,45683,12,45713,45739,12,45769,45795,12,45825,45851,12,45881,45907,12,45937,45963,12,45993,46019,12,46049,46075,12,46105,46131,12,46161,46187,12,46217,46243,12,46273,46299,12,46329,46355,12,46385,46411,12,46441,46467,12,46497,46523,12,46553,46579,12,46609,46635,12,46665,46691,12,46721,46747,12,46777,46803,12,46833,46859,12,46889,46915,12,46945,46971,12,47001,47027,12,47057,47083,12,47113,47139,12,47169,47195,12,47225,47251,12,47281,47307,12,47337,47363,12,47393,47419,12,47449,47475,12,47505,47531,12,47561,47587,12,47617,47643,12,47673,47699,12,47729,47755,12,47785,47811,12,47841,47867,12,47897,47923,12,47953,47979,12,48009,48035,12,48065,48091,12,48121,48147,12,48177,48203,12,48233,48259,12,48289,48315,12,48345,48371,12,48401,48427,12,48457,48483,12,48513,48539,12,48569,48595,12,48625,48651,12,48681,48707,12,48737,48763,12,48793,48819,12,48849,48875,12,48905,48931,12,48961,48987,12,49017,49043,12,49073,49099,12,49129,49155,12,49185,49211,12,49241,49267,12,49297,49323,12,49353,49379,12,49409,49435,12,49465,49491,12,49521,49547,12,49577,49603,12,49633,49659,12,49689,49715,12,49745,49771,12,49801,49827,12,49857,49883,12,49913,49939,12,49969,49995,12,50025,50051,12,50081,50107,12,50137,50163,12,50193,50219,12,50249,50275,12,50305,50331,12,50361,50387,12,50417,50443,12,50473,50499,12,50529,50555,12,50585,50611,12,50641,50667,12,50697,50723,12,50753,50779,12,50809,50835,12,50865,50891,12,50921,50947,12,50977,51003,12,51033,51059,12,51089,51115,12,51145,51171,12,51201,51227,12,51257,51283,12,51313,51339,12,51369,51395,12,51425,51451,12,51481,51507,12,51537,51563,12,51593,51619,12,51649,51675,12,51705,51731,12,51761,51787,12,51817,51843,12,51873,51899,12,51929,51955,12,51985,52011,12,52041,52067,12,52097,52123,12,52153,52179,12,52209,52235,12,52265,52291,12,52321,52347,12,52377,52403,12,52433,52459,12,52489,52515,12,52545,52571,12,52601,52627,12,52657,52683,12,52713,52739,12,52769,52795,12,52825,52851,12,52881,52907,12,52937,52963,12,52993,53019,12,53049,53075,12,53105,53131,12,53161,53187,12,53217,53243,12,53273,53299,12,53329,53355,12,53385,53411,12,53441,53467,12,53497,53523,12,53553,53579,12,53609,53635,12,53665,53691,12,53721,53747,12,53777,53803,12,53833,53859,12,53889,53915,12,53945,53971,12,54001,54027,12,54057,54083,12,54113,54139,12,54169,54195,12,54225,54251,12,54281,54307,12,54337,54363,12,54393,54419,12,54449,54475,12,54505,54531,12,54561,54587,12,54617,54643,12,54673,54699,12,54729,54755,12,54785,54811,12,54841,54867,12,54897,54923,12,54953,54979,12,55009,55035,12,55065,55091,12,55121,55147,12,55177,55203,12,65024,65039,5,65520,65528,4,66422,66426,5,68152,68154,5,69291,69292,5,69633,69633,5,69747,69748,5,69811,69814,5,69826,69826,5,69932,69932,7,70016,70017,5,70079,70080,7,70095,70095,5,70196,70196,5,70367,70367,5,70402,70403,7,70464,70464,5,70487,70487,5,70709,70711,7,70725,70725,7,70833,70834,7,70843,70844,7,70849,70849,7,71090,71093,5,71103,71104,5,71227,71228,7,71339,71339,5,71344,71349,5,71458,71461,5,71727,71735,5,71985,71989,7,71998,71998,5,72002,72002,7,72154,72155,5,72193,72202,5,72251,72254,5,72281,72283,5,72344,72345,5,72766,72766,7,72874,72880,5,72885,72886,5,73023,73029,5,73104,73105,5,73111,73111,5,92912,92916,5,94095,94098,5,113824,113827,4,119142,119142,7,119155,119162,4,119362,119364,5,121476,121476,5,122888,122904,5,123184,123190,5,125252,125258,5,127183,127183,14,127340,127343,14,127377,127386,14,127491,127503,14,127548,127551,14,127744,127756,14,127761,127761,14,127769,127769,14,127773,127774,14,127780,127788,14,127796,127797,14,127820,127823,14,127869,127869,14,127894,127895,14,127902,127903,14,127943,127943,14,127947,127950,14,127972,127972,14,127988,127988,14,127992,127994,14,128009,128011,14,128019,128019,14,128023,128041,14,128064,128064,14,128102,128107,14,128174,128181,14,128238,128238,14,128246,128247,14,128254,128254,14,128264,128264,14,128278,128299,14,128329,128330,14,128348,128359,14,128371,128377,14,128392,128393,14,128401,128404,14,128421,128421,14,128433,128434,14,128450,128452,14,128476,128478,14,128483,128483,14,128495,128495,14,128506,128506,14,128519,128520,14,128528,128528,14,128534,128534,14,128538,128538,14,128540,128542,14,128544,128549,14,128552,128555,14,128557,128557,14,128560,128563,14,128565,128565,14,128567,128576,14,128581,128591,14,128641,128642,14,128646,128646,14,128648,128648,14,128650,128651,14,128653,128653,14,128655,128655,14,128657,128659,14,128661,128661,14,128663,128663,14,128665,128666,14,128674,128674,14,128676,128677,14,128679,128685,14,128690,128690,14,128694,128694,14,128697,128702,14,128704,128704,14,128710,128714,14,128716,128716,14,128720,128720,14,128723,128724,14,128726,128727,14,128733,128735,14,128742,128744,14,128746,128746,14,128749,128751,14,128753,128754,14,128756,128758,14,128761,128761,14,128763,128764,14,128884,128895,14,128992,129003,14,129008,129008,14,129036,129039,14,129114,129119,14,129198,129279,14,129293,129295,14,129305,129310,14,129312,129319,14,129328,129328,14,129331,129338,14,129343,129343,14,129351,129355,14,129357,129359,14,129375,129387,14,129393,129393,14,129395,129398,14,129401,129401,14,129403,129403,14,129408,129412,14,129426,129431,14,129443,129444,14,129451,129453,14,129456,129465,14,129472,129472,14,129475,129482,14,129484,129484,14,129488,129510,14,129536,129647,14,129652,129652,14,129656,129658,14,129661,129663,14,129667,129670,14,129680,129685,14,129705,129708,14,129712,129718,14,129723,129727,14,129731,129733,14,129744,129750,14,129754,129759,14,129768,129775,14,129783,129791,14,917504,917504,4,917506,917535,4,917632,917759,4,918000,921599,4,0,9,4,11,12,4,14,31,4,169,169,14,174,174,14,1155,1159,5,1425,1469,5,1473,1474,5,1479,1479,5,1552,1562,5,1611,1631,5,1750,1756,5,1759,1764,5,1770,1773,5,1809,1809,5,1958,1968,5,2045,2045,5,2075,2083,5,2089,2093,5,2192,2193,1,2250,2273,5,2275,2306,5,2362,2362,5,2364,2364,5,2369,2376,5,2381,2381,5,2385,2391,5,2433,2433,5,2492,2492,5,2495,2496,7,2503,2504,7,2509,2509,5,2530,2531,5,2561,2562,5,2620,2620,5,2625,2626,5,2635,2637,5,2672,2673,5,2689,2690,5,2748,2748,5,2753,2757,5,2761,2761,7,2765,2765,5,2810,2815,5,2818,2819,7,2878,2878,5,2880,2880,7,2887,2888,7,2893,2893,5,2903,2903,5,2946,2946,5,3007,3007,7,3009,3010,7,3018,3020,7,3031,3031,5,3073,3075,7,3132,3132,5,3137,3140,7,3146,3149,5,3170,3171,5,3202,3203,7,3262,3262,7,3264,3265,7,3267,3268,7,3271,3272,7,3276,3277,5,3298,3299,5,3330,3331,7,3390,3390,5,3393,3396,5,3402,3404,7,3406,3406,1,3426,3427,5,3458,3459,7,3535,3535,5,3538,3540,5,3544,3550,7,3570,3571,7,3635,3635,7,3655,3662,5,3763,3763,7,3784,3789,5,3893,3893,5,3897,3897,5,3953,3966,5,3968,3972,5,3981,3991,5,4038,4038,5,4145,4145,7,4153,4154,5,4157,4158,5,4184,4185,5,4209,4212,5,4228,4228,7,4237,4237,5,4352,4447,8,4520,4607,10,5906,5908,5,5938,5939,5,5970,5971,5,6068,6069,5,6071,6077,5,6086,6086,5,6089,6099,5,6155,6157,5,6159,6159,5,6313,6313,5,6435,6438,7,6441,6443,7,6450,6450,5,6457,6459,5,6681,6682,7,6741,6741,7,6743,6743,7,6752,6752,5,6757,6764,5,6771,6780,5,6832,6845,5,6847,6862,5,6916,6916,7,6965,6965,5,6971,6971,7,6973,6977,7,6979,6980,7,7040,7041,5,7073,7073,7,7078,7079,7,7082,7082,7,7142,7142,5,7144,7145,5,7149,7149,5,7151,7153,5,7204,7211,7,7220,7221,7,7376,7378,5,7393,7393,7,7405,7405,5,7415,7415,7,7616,7679,5,8204,8204,5,8206,8207,4,8233,8233,4,8252,8252,14,8288,8292,4,8294,8303,4,8413,8416,5,8418,8420,5,8482,8482,14,8596,8601,14,8986,8987,14,9096,9096,14,9193,9196,14,9199,9199,14,9201,9202,14,9208,9210,14,9642,9643,14,9664,9664,14,9728,9729,14,9732,9732,14,9735,9741,14,9743,9744,14,9746,9746,14,9750,9751,14,9753,9756,14,9758,9759,14,9761,9761,14,9764,9765,14,9767,9769,14,9771,9773,14,9775,9775,14,9784,9785,14,9787,9791,14,9793,9793,14,9795,9799,14,9812,9822,14,9824,9824,14,9827,9827,14,9829,9830,14,9832,9832,14,9851,9851,14,9854,9854,14,9856,9861,14,9874,9874,14,9876,9876,14,9878,9879,14,9881,9881,14,9883,9884,14,9888,9889,14,9895,9895,14,9898,9899,14,9904,9905,14,9917,9918,14,9924,9925,14,9928,9928,14,9934,9934,14,9936,9936,14,9938,9938,14,9940,9940,14,9961,9961,14,9963,9967,14,9970,9971,14,9973,9973,14,9975,9977,14,9979,9980,14,9982,9985,14,9987,9988,14,9992,9996,14,9998,9998,14,10000,10001,14,10004,10004,14,10013,10013,14,10024,10024,14,10052,10052,14,10060,10060,14,10067,10069,14,10083,10083,14,10085,10087,14,10145,10145,14,10175,10175,14,11013,11015,14,11088,11088,14,11503,11505,5,11744,11775,5,12334,12335,5,12349,12349,14,12951,12951,14,42607,42607,5,42612,42621,5,42736,42737,5,43014,43014,5,43043,43044,7,43047,43047,7,43136,43137,7,43204,43205,5,43263,43263,5,43335,43345,5,43360,43388,8,43395,43395,7,43444,43445,7,43450,43451,7,43454,43456,7,43561,43566,5,43569,43570,5,43573,43574,5,43596,43596,5,43644,43644,5,43698,43700,5,43710,43711,5,43755,43755,7,43758,43759,7,43766,43766,5,44005,44005,5,44008,44008,5,44012,44012,7,44032,44032,11,44060,44060,11,44088,44088,11,44116,44116,11,44144,44144,11,44172,44172,11,44200,44200,11,44228,44228,11,44256,44256,11,44284,44284,11,44312,44312,11,44340,44340,11,44368,44368,11,44396,44396,11,44424,44424,11,44452,44452,11,44480,44480,11,44508,44508,11,44536,44536,11,44564,44564,11,44592,44592,11,44620,44620,11,44648,44648,11,44676,44676,11,44704,44704,11,44732,44732,11,44760,44760,11,44788,44788,11,44816,44816,11,44844,44844,11,44872,44872,11,44900,44900,11,44928,44928,11,44956,44956,11,44984,44984,11,45012,45012,11,45040,45040,11,45068,45068,11,45096,45096,11,45124,45124,11,45152,45152,11,45180,45180,11,45208,45208,11,45236,45236,11,45264,45264,11,45292,45292,11,45320,45320,11,45348,45348,11,45376,45376,11,45404,45404,11,45432,45432,11,45460,45460,11,45488,45488,11,45516,45516,11,45544,45544,11,45572,45572,11,45600,45600,11,45628,45628,11,45656,45656,11,45684,45684,11,45712,45712,11,45740,45740,11,45768,45768,11,45796,45796,11,45824,45824,11,45852,45852,11,45880,45880,11,45908,45908,11,45936,45936,11,45964,45964,11,45992,45992,11,46020,46020,11,46048,46048,11,46076,46076,11,46104,46104,11,46132,46132,11,46160,46160,11,46188,46188,11,46216,46216,11,46244,46244,11,46272,46272,11,46300,46300,11,46328,46328,11,46356,46356,11,46384,46384,11,46412,46412,11,46440,46440,11,46468,46468,11,46496,46496,11,46524,46524,11,46552,46552,11,46580,46580,11,46608,46608,11,46636,46636,11,46664,46664,11,46692,46692,11,46720,46720,11,46748,46748,11,46776,46776,11,46804,46804,11,46832,46832,11,46860,46860,11,46888,46888,11,46916,46916,11,46944,46944,11,46972,46972,11,47000,47000,11,47028,47028,11,47056,47056,11,47084,47084,11,47112,47112,11,47140,47140,11,47168,47168,11,47196,47196,11,47224,47224,11,47252,47252,11,47280,47280,11,47308,47308,11,47336,47336,11,47364,47364,11,47392,47392,11,47420,47420,11,47448,47448,11,47476,47476,11,47504,47504,11,47532,47532,11,47560,47560,11,47588,47588,11,47616,47616,11,47644,47644,11,47672,47672,11,47700,47700,11,47728,47728,11,47756,47756,11,47784,47784,11,47812,47812,11,47840,47840,11,47868,47868,11,47896,47896,11,47924,47924,11,47952,47952,11,47980,47980,11,48008,48008,11,48036,48036,11,48064,48064,11,48092,48092,11,48120,48120,11,48148,48148,11,48176,48176,11,48204,48204,11,48232,48232,11,48260,48260,11,48288,48288,11,48316,48316,11,48344,48344,11,48372,48372,11,48400,48400,11,48428,48428,11,48456,48456,11,48484,48484,11,48512,48512,11,48540,48540,11,48568,48568,11,48596,48596,11,48624,48624,11,48652,48652,11,48680,48680,11,48708,48708,11,48736,48736,11,48764,48764,11,48792,48792,11,48820,48820,11,48848,48848,11,48876,48876,11,48904,48904,11,48932,48932,11,48960,48960,11,48988,48988,11,49016,49016,11,49044,49044,11,49072,49072,11,49100,49100,11,49128,49128,11,49156,49156,11,49184,49184,11,49212,49212,11,49240,49240,11,49268,49268,11,49296,49296,11,49324,49324,11,49352,49352,11,49380,49380,11,49408,49408,11,49436,49436,11,49464,49464,11,49492,49492,11,49520,49520,11,49548,49548,11,49576,49576,11,49604,49604,11,49632,49632,11,49660,49660,11,49688,49688,11,49716,49716,11,49744,49744,11,49772,49772,11,49800,49800,11,49828,49828,11,49856,49856,11,49884,49884,11,49912,49912,11,49940,49940,11,49968,49968,11,49996,49996,11,50024,50024,11,50052,50052,11,50080,50080,11,50108,50108,11,50136,50136,11,50164,50164,11,50192,50192,11,50220,50220,11,50248,50248,11,50276,50276,11,50304,50304,11,50332,50332,11,50360,50360,11,50388,50388,11,50416,50416,11,50444,50444,11,50472,50472,11,50500,50500,11,50528,50528,11,50556,50556,11,50584,50584,11,50612,50612,11,50640,50640,11,50668,50668,11,50696,50696,11,50724,50724,11,50752,50752,11,50780,50780,11,50808,50808,11,50836,50836,11,50864,50864,11,50892,50892,11,50920,50920,11,50948,50948,11,50976,50976,11,51004,51004,11,51032,51032,11,51060,51060,11,51088,51088,11,51116,51116,11,51144,51144,11,51172,51172,11,51200,51200,11,51228,51228,11,51256,51256,11,51284,51284,11,51312,51312,11,51340,51340,11,51368,51368,11,51396,51396,11,51424,51424,11,51452,51452,11,51480,51480,11,51508,51508,11,51536,51536,11,51564,51564,11,51592,51592,11,51620,51620,11,51648,51648,11,51676,51676,11,51704,51704,11,51732,51732,11,51760,51760,11,51788,51788,11,51816,51816,11,51844,51844,11,51872,51872,11,51900,51900,11,51928,51928,11,51956,51956,11,51984,51984,11,52012,52012,11,52040,52040,11,52068,52068,11,52096,52096,11,52124,52124,11,52152,52152,11,52180,52180,11,52208,52208,11,52236,52236,11,52264,52264,11,52292,52292,11,52320,52320,11,52348,52348,11,52376,52376,11,52404,52404,11,52432,52432,11,52460,52460,11,52488,52488,11,52516,52516,11,52544,52544,11,52572,52572,11,52600,52600,11,52628,52628,11,52656,52656,11,52684,52684,11,52712,52712,11,52740,52740,11,52768,52768,11,52796,52796,11,52824,52824,11,52852,52852,11,52880,52880,11,52908,52908,11,52936,52936,11,52964,52964,11,52992,52992,11,53020,53020,11,53048,53048,11,53076,53076,11,53104,53104,11,53132,53132,11,53160,53160,11,53188,53188,11,53216,53216,11,53244,53244,11,53272,53272,11,53300,53300,11,53328,53328,11,53356,53356,11,53384,53384,11,53412,53412,11,53440,53440,11,53468,53468,11,53496,53496,11,53524,53524,11,53552,53552,11,53580,53580,11,53608,53608,11,53636,53636,11,53664,53664,11,53692,53692,11,53720,53720,11,53748,53748,11,53776,53776,11,53804,53804,11,53832,53832,11,53860,53860,11,53888,53888,11,53916,53916,11,53944,53944,11,53972,53972,11,54000,54000,11,54028,54028,11,54056,54056,11,54084,54084,11,54112,54112,11,54140,54140,11,54168,54168,11,54196,54196,11,54224,54224,11,54252,54252,11,54280,54280,11,54308,54308,11,54336,54336,11,54364,54364,11,54392,54392,11,54420,54420,11,54448,54448,11,54476,54476,11,54504,54504,11,54532,54532,11,54560,54560,11,54588,54588,11,54616,54616,11,54644,54644,11,54672,54672,11,54700,54700,11,54728,54728,11,54756,54756,11,54784,54784,11,54812,54812,11,54840,54840,11,54868,54868,11,54896,54896,11,54924,54924,11,54952,54952,11,54980,54980,11,55008,55008,11,55036,55036,11,55064,55064,11,55092,55092,11,55120,55120,11,55148,55148,11,55176,55176,11,55216,55238,9,64286,64286,5,65056,65071,5,65438,65439,5,65529,65531,4,66272,66272,5,68097,68099,5,68108,68111,5,68159,68159,5,68900,68903,5,69446,69456,5,69632,69632,7,69634,69634,7,69744,69744,5,69759,69761,5,69808,69810,7,69815,69816,7,69821,69821,1,69837,69837,1,69927,69931,5,69933,69940,5,70003,70003,5,70018,70018,7,70070,70078,5,70082,70083,1,70094,70094,7,70188,70190,7,70194,70195,7,70197,70197,7,70206,70206,5,70368,70370,7,70400,70401,5,70459,70460,5,70463,70463,7,70465,70468,7,70475,70477,7,70498,70499,7,70512,70516,5,70712,70719,5,70722,70724,5,70726,70726,5,70832,70832,5,70835,70840,5,70842,70842,5,70845,70845,5,70847,70848,5,70850,70851,5,71088,71089,7,71096,71099,7,71102,71102,7,71132,71133,5,71219,71226,5,71229,71229,5,71231,71232,5,71340,71340,7,71342,71343,7,71350,71350,7,71453,71455,5,71462,71462,7,71724,71726,7,71736,71736,7,71984,71984,5,71991,71992,7,71997,71997,7,71999,71999,1,72001,72001,1,72003,72003,5,72148,72151,5,72156,72159,7,72164,72164,7,72243,72248,5,72250,72250,1,72263,72263,5,72279,72280,7,72324,72329,1,72343,72343,7,72751,72751,7,72760,72765,5,72767,72767,5,72873,72873,7,72881,72881,7,72884,72884,7,73009,73014,5,73020,73021,5,73030,73030,1,73098,73102,7,73107,73108,7,73110,73110,7,73459,73460,5,78896,78904,4,92976,92982,5,94033,94087,7,94180,94180,5,113821,113822,5,118528,118573,5,119141,119141,5,119143,119145,5,119150,119154,5,119163,119170,5,119210,119213,5,121344,121398,5,121461,121461,5,121499,121503,5,122880,122886,5,122907,122913,5,122918,122922,5,123566,123566,5,125136,125142,5,126976,126979,14,126981,127182,14,127184,127231,14,127279,127279,14,127344,127345,14,127374,127374,14,127405,127461,14,127489,127490,14,127514,127514,14,127538,127546,14,127561,127567,14,127570,127743,14,127757,127758,14,127760,127760,14,127762,127762,14,127766,127768,14,127770,127770,14,127772,127772,14,127775,127776,14,127778,127779,14,127789,127791,14,127794,127795,14,127798,127798,14,127819,127819,14,127824,127824,14,127868,127868,14,127870,127871,14,127892,127893,14,127896,127896,14,127900,127901,14,127904,127940,14,127942,127942,14,127944,127944,14,127946,127946,14,127951,127955,14,127968,127971,14,127973,127984,14,127987,127987,14,127989,127989,14,127991,127991,14,127995,127999,5,128008,128008,14,128012,128014,14,128017,128018,14,128020,128020,14,128022,128022,14,128042,128042,14,128063,128063,14,128065,128065,14,128101,128101,14,128108,128109,14,128173,128173,14,128182,128183,14,128236,128237,14,128239,128239,14,128245,128245,14,128248,128248,14,128253,128253,14,128255,128258,14,128260,128263,14,128265,128265,14,128277,128277,14,128300,128301,14,128326,128328,14,128331,128334,14,128336,128347,14,128360,128366,14,128369,128370,14,128378,128378,14,128391,128391,14,128394,128397,14,128400,128400,14,128405,128406,14,128420,128420,14,128422,128423,14,128425,128432,14,128435,128443,14,128445,128449,14,128453,128464,14,128468,128475,14,128479,128480,14,128482,128482,14,128484,128487,14,128489,128494,14,128496,128498,14,128500,128505,14,128507,128511,14,128513,128518,14,128521,128525,14,128527,128527,14,128529,128529,14,128533,128533,14,128535,128535,14,128537,128537,14]");
  }
  function getLeftDeleteOffset(offset, str) {
    if (offset === 0) {
      return 0;
    }
    const emojiOffset = getOffsetBeforeLastEmojiComponent(offset, str);
    if (emojiOffset !== void 0) {
      return emojiOffset;
    }
    const iterator = new CodePointIterator(str, offset);
    iterator.prevCodePoint();
    return iterator.offset;
  }
  function getOffsetBeforeLastEmojiComponent(initialOffset, str) {
    const iterator = new CodePointIterator(str, initialOffset);
    let codePoint = iterator.prevCodePoint();
    while (isEmojiModifier(codePoint) || codePoint === 65039 || codePoint === 8419) {
      if (iterator.offset === 0) {
        return void 0;
      }
      codePoint = iterator.prevCodePoint();
    }
    if (!isEmojiImprecise(codePoint)) {
      return void 0;
    }
    let resultOffset = iterator.offset;
    if (resultOffset > 0) {
      const optionalZwjCodePoint = iterator.prevCodePoint();
      if (optionalZwjCodePoint === 8205) {
        resultOffset = iterator.offset;
      }
    }
    return resultOffset;
  }
  function isEmojiModifier(codePoint) {
    return 127995 <= codePoint && codePoint <= 127999;
  }
  const noBreakWhitespace = " ";
  const _AmbiguousCharacters = class _AmbiguousCharacters {
    static getInstance(locales) {
      return _AmbiguousCharacters.cache.get(Array.from(locales).join(","));
    }
    static getLocales() {
      return _AmbiguousCharacters._locales.value;
    }
    constructor(confusableDictionary) {
      this.confusableDictionary = confusableDictionary;
    }
    isAmbiguous(codePoint) {
      return this.confusableDictionary.has(codePoint);
    }
    /**
     * Returns the non basic ASCII code point that the given code point can be confused,
     * or undefined if such code point does note exist.
     */
    getPrimaryConfusable(codePoint) {
      return this.confusableDictionary.get(codePoint);
    }
    getConfusableCodePoints() {
      return new Set(this.confusableDictionary.keys());
    }
  };
  _AmbiguousCharacters.ambiguousCharacterData = new Lazy(() => {
    return JSON.parse('{"_common":[8232,32,8233,32,5760,32,8192,32,8193,32,8194,32,8195,32,8196,32,8197,32,8198,32,8200,32,8201,32,8202,32,8287,32,8199,32,8239,32,2042,95,65101,95,65102,95,65103,95,8208,45,8209,45,8210,45,65112,45,1748,45,8259,45,727,45,8722,45,10134,45,11450,45,1549,44,1643,44,184,44,42233,44,894,59,2307,58,2691,58,1417,58,1795,58,1796,58,5868,58,65072,58,6147,58,6153,58,8282,58,1475,58,760,58,42889,58,8758,58,720,58,42237,58,451,33,11601,33,660,63,577,63,2429,63,5038,63,42731,63,119149,46,8228,46,1793,46,1794,46,42510,46,68176,46,1632,46,1776,46,42232,46,1373,96,65287,96,8219,96,1523,96,8242,96,1370,96,8175,96,65344,96,900,96,8189,96,8125,96,8127,96,8190,96,697,96,884,96,712,96,714,96,715,96,756,96,699,96,701,96,700,96,702,96,42892,96,1497,96,2036,96,2037,96,5194,96,5836,96,94033,96,94034,96,65339,91,10088,40,10098,40,12308,40,64830,40,65341,93,10089,41,10099,41,12309,41,64831,41,10100,123,119060,123,10101,125,65342,94,8270,42,1645,42,8727,42,66335,42,5941,47,8257,47,8725,47,8260,47,9585,47,10187,47,10744,47,119354,47,12755,47,12339,47,11462,47,20031,47,12035,47,65340,92,65128,92,8726,92,10189,92,10741,92,10745,92,119311,92,119355,92,12756,92,20022,92,12034,92,42872,38,708,94,710,94,5869,43,10133,43,66203,43,8249,60,10094,60,706,60,119350,60,5176,60,5810,60,5120,61,11840,61,12448,61,42239,61,8250,62,10095,62,707,62,119351,62,5171,62,94015,62,8275,126,732,126,8128,126,8764,126,65372,124,65293,45,118002,50,120784,50,120794,50,120804,50,120814,50,120824,50,130034,50,42842,50,423,50,1000,50,42564,50,5311,50,42735,50,119302,51,118003,51,120785,51,120795,51,120805,51,120815,51,120825,51,130035,51,42923,51,540,51,439,51,42858,51,11468,51,1248,51,94011,51,71882,51,118004,52,120786,52,120796,52,120806,52,120816,52,120826,52,130036,52,5070,52,71855,52,118005,53,120787,53,120797,53,120807,53,120817,53,120827,53,130037,53,444,53,71867,53,118006,54,120788,54,120798,54,120808,54,120818,54,120828,54,130038,54,11474,54,5102,54,71893,54,119314,55,118007,55,120789,55,120799,55,120809,55,120819,55,120829,55,130039,55,66770,55,71878,55,2819,56,2538,56,2666,56,125131,56,118008,56,120790,56,120800,56,120810,56,120820,56,120830,56,130040,56,547,56,546,56,66330,56,2663,57,2920,57,2541,57,3437,57,118009,57,120791,57,120801,57,120811,57,120821,57,120831,57,130041,57,42862,57,11466,57,71884,57,71852,57,71894,57,9082,97,65345,97,119834,97,119886,97,119938,97,119990,97,120042,97,120094,97,120146,97,120198,97,120250,97,120302,97,120354,97,120406,97,120458,97,593,97,945,97,120514,97,120572,97,120630,97,120688,97,120746,97,65313,65,117974,65,119808,65,119860,65,119912,65,119964,65,120016,65,120068,65,120120,65,120172,65,120224,65,120276,65,120328,65,120380,65,120432,65,913,65,120488,65,120546,65,120604,65,120662,65,120720,65,5034,65,5573,65,42222,65,94016,65,66208,65,119835,98,119887,98,119939,98,119991,98,120043,98,120095,98,120147,98,120199,98,120251,98,120303,98,120355,98,120407,98,120459,98,388,98,5071,98,5234,98,5551,98,65314,66,8492,66,117975,66,119809,66,119861,66,119913,66,120017,66,120069,66,120121,66,120173,66,120225,66,120277,66,120329,66,120381,66,120433,66,42932,66,914,66,120489,66,120547,66,120605,66,120663,66,120721,66,5108,66,5623,66,42192,66,66178,66,66209,66,66305,66,65347,99,8573,99,119836,99,119888,99,119940,99,119992,99,120044,99,120096,99,120148,99,120200,99,120252,99,120304,99,120356,99,120408,99,120460,99,7428,99,1010,99,11429,99,43951,99,66621,99,128844,67,71913,67,71922,67,65315,67,8557,67,8450,67,8493,67,117976,67,119810,67,119862,67,119914,67,119966,67,120018,67,120174,67,120226,67,120278,67,120330,67,120382,67,120434,67,1017,67,11428,67,5087,67,42202,67,66210,67,66306,67,66581,67,66844,67,8574,100,8518,100,119837,100,119889,100,119941,100,119993,100,120045,100,120097,100,120149,100,120201,100,120253,100,120305,100,120357,100,120409,100,120461,100,1281,100,5095,100,5231,100,42194,100,8558,68,8517,68,117977,68,119811,68,119863,68,119915,68,119967,68,120019,68,120071,68,120123,68,120175,68,120227,68,120279,68,120331,68,120383,68,120435,68,5024,68,5598,68,5610,68,42195,68,8494,101,65349,101,8495,101,8519,101,119838,101,119890,101,119942,101,120046,101,120098,101,120150,101,120202,101,120254,101,120306,101,120358,101,120410,101,120462,101,43826,101,1213,101,8959,69,65317,69,8496,69,117978,69,119812,69,119864,69,119916,69,120020,69,120072,69,120124,69,120176,69,120228,69,120280,69,120332,69,120384,69,120436,69,917,69,120492,69,120550,69,120608,69,120666,69,120724,69,11577,69,5036,69,42224,69,71846,69,71854,69,66182,69,119839,102,119891,102,119943,102,119995,102,120047,102,120099,102,120151,102,120203,102,120255,102,120307,102,120359,102,120411,102,120463,102,43829,102,42905,102,383,102,7837,102,1412,102,119315,70,8497,70,117979,70,119813,70,119865,70,119917,70,120021,70,120073,70,120125,70,120177,70,120229,70,120281,70,120333,70,120385,70,120437,70,42904,70,988,70,120778,70,5556,70,42205,70,71874,70,71842,70,66183,70,66213,70,66853,70,65351,103,8458,103,119840,103,119892,103,119944,103,120048,103,120100,103,120152,103,120204,103,120256,103,120308,103,120360,103,120412,103,120464,103,609,103,7555,103,397,103,1409,103,117980,71,119814,71,119866,71,119918,71,119970,71,120022,71,120074,71,120126,71,120178,71,120230,71,120282,71,120334,71,120386,71,120438,71,1292,71,5056,71,5107,71,42198,71,65352,104,8462,104,119841,104,119945,104,119997,104,120049,104,120101,104,120153,104,120205,104,120257,104,120309,104,120361,104,120413,104,120465,104,1211,104,1392,104,5058,104,65320,72,8459,72,8460,72,8461,72,117981,72,119815,72,119867,72,119919,72,120023,72,120179,72,120231,72,120283,72,120335,72,120387,72,120439,72,919,72,120494,72,120552,72,120610,72,120668,72,120726,72,11406,72,5051,72,5500,72,42215,72,66255,72,731,105,9075,105,65353,105,8560,105,8505,105,8520,105,119842,105,119894,105,119946,105,119998,105,120050,105,120102,105,120154,105,120206,105,120258,105,120310,105,120362,105,120414,105,120466,105,120484,105,618,105,617,105,953,105,8126,105,890,105,120522,105,120580,105,120638,105,120696,105,120754,105,1110,105,42567,105,1231,105,43893,105,5029,105,71875,105,65354,106,8521,106,119843,106,119895,106,119947,106,119999,106,120051,106,120103,106,120155,106,120207,106,120259,106,120311,106,120363,106,120415,106,120467,106,1011,106,1112,106,65322,74,117983,74,119817,74,119869,74,119921,74,119973,74,120025,74,120077,74,120129,74,120181,74,120233,74,120285,74,120337,74,120389,74,120441,74,42930,74,895,74,1032,74,5035,74,5261,74,42201,74,119844,107,119896,107,119948,107,120000,107,120052,107,120104,107,120156,107,120208,107,120260,107,120312,107,120364,107,120416,107,120468,107,8490,75,65323,75,117984,75,119818,75,119870,75,119922,75,119974,75,120026,75,120078,75,120130,75,120182,75,120234,75,120286,75,120338,75,120390,75,120442,75,922,75,120497,75,120555,75,120613,75,120671,75,120729,75,11412,75,5094,75,5845,75,42199,75,66840,75,1472,108,8739,73,9213,73,65512,73,1633,108,1777,73,66336,108,125127,108,118001,108,120783,73,120793,73,120803,73,120813,73,120823,73,130033,73,65321,73,8544,73,8464,73,8465,73,117982,108,119816,73,119868,73,119920,73,120024,73,120128,73,120180,73,120232,73,120284,73,120336,73,120388,73,120440,73,65356,108,8572,73,8467,108,119845,108,119897,108,119949,108,120001,108,120053,108,120105,73,120157,73,120209,73,120261,73,120313,73,120365,73,120417,73,120469,73,448,73,120496,73,120554,73,120612,73,120670,73,120728,73,11410,73,1030,73,1216,73,1493,108,1503,108,1575,108,126464,108,126592,108,65166,108,65165,108,1994,108,11599,73,5825,73,42226,73,93992,73,66186,124,66313,124,119338,76,8556,76,8466,76,117985,76,119819,76,119871,76,119923,76,120027,76,120079,76,120131,76,120183,76,120235,76,120287,76,120339,76,120391,76,120443,76,11472,76,5086,76,5290,76,42209,76,93974,76,71843,76,71858,76,66587,76,66854,76,65325,77,8559,77,8499,77,117986,77,119820,77,119872,77,119924,77,120028,77,120080,77,120132,77,120184,77,120236,77,120288,77,120340,77,120392,77,120444,77,924,77,120499,77,120557,77,120615,77,120673,77,120731,77,1018,77,11416,77,5047,77,5616,77,5846,77,42207,77,66224,77,66321,77,119847,110,119899,110,119951,110,120003,110,120055,110,120107,110,120159,110,120211,110,120263,110,120315,110,120367,110,120419,110,120471,110,1400,110,1404,110,65326,78,8469,78,117987,78,119821,78,119873,78,119925,78,119977,78,120029,78,120081,78,120185,78,120237,78,120289,78,120341,78,120393,78,120445,78,925,78,120500,78,120558,78,120616,78,120674,78,120732,78,11418,78,42208,78,66835,78,3074,111,3202,111,3330,111,3458,111,2406,111,2662,111,2790,111,3046,111,3174,111,3302,111,3430,111,3664,111,3792,111,4160,111,1637,111,1781,111,65359,111,8500,111,119848,111,119900,111,119952,111,120056,111,120108,111,120160,111,120212,111,120264,111,120316,111,120368,111,120420,111,120472,111,7439,111,7441,111,43837,111,959,111,120528,111,120586,111,120644,111,120702,111,120760,111,963,111,120532,111,120590,111,120648,111,120706,111,120764,111,11423,111,4351,111,1413,111,1505,111,1607,111,126500,111,126564,111,126596,111,65259,111,65260,111,65258,111,65257,111,1726,111,64428,111,64429,111,64427,111,64426,111,1729,111,64424,111,64425,111,64423,111,64422,111,1749,111,3360,111,4125,111,66794,111,71880,111,71895,111,66604,111,1984,79,2534,79,2918,79,12295,79,70864,79,71904,79,118000,79,120782,79,120792,79,120802,79,120812,79,120822,79,130032,79,65327,79,117988,79,119822,79,119874,79,119926,79,119978,79,120030,79,120082,79,120134,79,120186,79,120238,79,120290,79,120342,79,120394,79,120446,79,927,79,120502,79,120560,79,120618,79,120676,79,120734,79,11422,79,1365,79,11604,79,4816,79,2848,79,66754,79,42227,79,71861,79,66194,79,66219,79,66564,79,66838,79,9076,112,65360,112,119849,112,119901,112,119953,112,120005,112,120057,112,120109,112,120161,112,120213,112,120265,112,120317,112,120369,112,120421,112,120473,112,961,112,120530,112,120544,112,120588,112,120602,112,120646,112,120660,112,120704,112,120718,112,120762,112,120776,112,11427,112,65328,80,8473,80,117989,80,119823,80,119875,80,119927,80,119979,80,120031,80,120083,80,120187,80,120239,80,120291,80,120343,80,120395,80,120447,80,929,80,120504,80,120562,80,120620,80,120678,80,120736,80,11426,80,5090,80,5229,80,42193,80,66197,80,119850,113,119902,113,119954,113,120006,113,120058,113,120110,113,120162,113,120214,113,120266,113,120318,113,120370,113,120422,113,120474,113,1307,113,1379,113,1382,113,8474,81,117990,81,119824,81,119876,81,119928,81,119980,81,120032,81,120084,81,120188,81,120240,81,120292,81,120344,81,120396,81,120448,81,11605,81,119851,114,119903,114,119955,114,120007,114,120059,114,120111,114,120163,114,120215,114,120267,114,120319,114,120371,114,120423,114,120475,114,43847,114,43848,114,7462,114,11397,114,43905,114,119318,82,8475,82,8476,82,8477,82,117991,82,119825,82,119877,82,119929,82,120033,82,120189,82,120241,82,120293,82,120345,82,120397,82,120449,82,422,82,5025,82,5074,82,66740,82,5511,82,42211,82,94005,82,65363,115,119852,115,119904,115,119956,115,120008,115,120060,115,120112,115,120164,115,120216,115,120268,115,120320,115,120372,115,120424,115,120476,115,42801,115,445,115,1109,115,43946,115,71873,115,66632,115,65331,83,117992,83,119826,83,119878,83,119930,83,119982,83,120034,83,120086,83,120138,83,120190,83,120242,83,120294,83,120346,83,120398,83,120450,83,1029,83,1359,83,5077,83,5082,83,42210,83,94010,83,66198,83,66592,83,119853,116,119905,116,119957,116,120009,116,120061,116,120113,116,120165,116,120217,116,120269,116,120321,116,120373,116,120425,116,120477,116,8868,84,10201,84,128872,84,65332,84,117993,84,119827,84,119879,84,119931,84,119983,84,120035,84,120087,84,120139,84,120191,84,120243,84,120295,84,120347,84,120399,84,120451,84,932,84,120507,84,120565,84,120623,84,120681,84,120739,84,11430,84,5026,84,42196,84,93962,84,71868,84,66199,84,66225,84,66325,84,119854,117,119906,117,119958,117,120010,117,120062,117,120114,117,120166,117,120218,117,120270,117,120322,117,120374,117,120426,117,120478,117,42911,117,7452,117,43854,117,43858,117,651,117,965,117,120534,117,120592,117,120650,117,120708,117,120766,117,1405,117,66806,117,71896,117,8746,85,8899,85,117994,85,119828,85,119880,85,119932,85,119984,85,120036,85,120088,85,120140,85,120192,85,120244,85,120296,85,120348,85,120400,85,120452,85,1357,85,4608,85,66766,85,5196,85,42228,85,94018,85,71864,85,8744,118,8897,118,65366,118,8564,118,119855,118,119907,118,119959,118,120011,118,120063,118,120115,118,120167,118,120219,118,120271,118,120323,118,120375,118,120427,118,120479,118,7456,118,957,118,120526,118,120584,118,120642,118,120700,118,120758,118,1141,118,1496,118,71430,118,43945,118,71872,118,119309,86,1639,86,1783,86,8548,86,117995,86,119829,86,119881,86,119933,86,119985,86,120037,86,120089,86,120141,86,120193,86,120245,86,120297,86,120349,86,120401,86,120453,86,1140,86,11576,86,5081,86,5167,86,42719,86,42214,86,93960,86,71840,86,66845,86,623,119,119856,119,119908,119,119960,119,120012,119,120064,119,120116,119,120168,119,120220,119,120272,119,120324,119,120376,119,120428,119,120480,119,7457,119,1121,119,1309,119,1377,119,71434,119,71438,119,71439,119,43907,119,71910,87,71919,87,117996,87,119830,87,119882,87,119934,87,119986,87,120038,87,120090,87,120142,87,120194,87,120246,87,120298,87,120350,87,120402,87,120454,87,1308,87,5043,87,5076,87,42218,87,5742,120,10539,120,10540,120,10799,120,65368,120,8569,120,119857,120,119909,120,119961,120,120013,120,120065,120,120117,120,120169,120,120221,120,120273,120,120325,120,120377,120,120429,120,120481,120,5441,120,5501,120,5741,88,9587,88,66338,88,71916,88,65336,88,8553,88,117997,88,119831,88,119883,88,119935,88,119987,88,120039,88,120091,88,120143,88,120195,88,120247,88,120299,88,120351,88,120403,88,120455,88,42931,88,935,88,120510,88,120568,88,120626,88,120684,88,120742,88,11436,88,11613,88,5815,88,42219,88,66192,88,66228,88,66327,88,66855,88,611,121,7564,121,65369,121,119858,121,119910,121,119962,121,120014,121,120066,121,120118,121,120170,121,120222,121,120274,121,120326,121,120378,121,120430,121,120482,121,655,121,7935,121,43866,121,947,121,8509,121,120516,121,120574,121,120632,121,120690,121,120748,121,1199,121,4327,121,71900,121,65337,89,117998,89,119832,89,119884,89,119936,89,119988,89,120040,89,120092,89,120144,89,120196,89,120248,89,120300,89,120352,89,120404,89,120456,89,933,89,978,89,120508,89,120566,89,120624,89,120682,89,120740,89,11432,89,1198,89,5033,89,5053,89,42220,89,94019,89,71844,89,66226,89,119859,122,119911,122,119963,122,120015,122,120067,122,120119,122,120171,122,120223,122,120275,122,120327,122,120379,122,120431,122,120483,122,7458,122,43923,122,71876,122,71909,90,66293,90,65338,90,8484,90,8488,90,117999,90,119833,90,119885,90,119937,90,119989,90,120041,90,120197,90,120249,90,120301,90,120353,90,120405,90,120457,90,918,90,120493,90,120551,90,120609,90,120667,90,120725,90,5059,90,42204,90,71849,90,65282,34,65283,35,65284,36,65285,37,65286,38,65290,42,65291,43,65294,46,65295,47,65296,48,65298,50,65299,51,65300,52,65301,53,65302,54,65303,55,65304,56,65305,57,65308,60,65309,61,65310,62,65312,64,65316,68,65318,70,65319,71,65324,76,65329,81,65330,82,65333,85,65334,86,65335,87,65343,95,65346,98,65348,100,65350,102,65355,107,65357,109,65358,110,65361,113,65362,114,65364,116,65365,117,65367,119,65370,122,65371,123,65373,125,119846,109],"_default":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"cs":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"de":[65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"es":[8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"fr":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"it":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"ja":[8211,45,8218,44,65281,33,8216,96,8245,96,180,96,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65292,44,65297,49,65307,59],"ko":[8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"pl":[65374,126,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"pt-BR":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"qps-ploc":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"ru":[65374,126,8218,44,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,305,105,921,73,1009,112,215,120,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"tr":[160,32,8211,45,65374,126,8218,44,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41,65292,44,65297,49,65307,59,65311,63],"zh-hans":[160,32,65374,126,8218,44,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65297,49],"zh-hant":[8211,45,65374,126,8218,44,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89]}');
  });
  _AmbiguousCharacters.cache = new LRUCachedFunction((localesStr) => {
    const locales = localesStr.split(",");
    function arrayToMap(arr) {
      const result = /* @__PURE__ */ new Map();
      for (let i = 0; i < arr.length; i += 2) {
        result.set(arr[i], arr[i + 1]);
      }
      return result;
    }
    function mergeMaps(map1, map2) {
      const result = new Map(map1);
      for (const [key, value] of map2) {
        result.set(key, value);
      }
      return result;
    }
    function intersectMaps(map1, map2) {
      if (!map1) {
        return map2;
      }
      const result = /* @__PURE__ */ new Map();
      for (const [key, value] of map1) {
        if (map2.has(key)) {
          result.set(key, value);
        }
      }
      return result;
    }
    const data = _AmbiguousCharacters.ambiguousCharacterData.value;
    let filteredLocales = locales.filter((l) => !l.startsWith("_") && Object.hasOwn(data, l));
    if (filteredLocales.length === 0) {
      filteredLocales = ["_default"];
    }
    let languageSpecificMap = void 0;
    for (const locale of filteredLocales) {
      const map2 = arrayToMap(data[locale]);
      languageSpecificMap = intersectMaps(languageSpecificMap, map2);
    }
    const commonMap = arrayToMap(data["_common"]);
    const map = mergeMaps(commonMap, languageSpecificMap);
    return new _AmbiguousCharacters(map);
  });
  _AmbiguousCharacters._locales = new Lazy(() => Object.keys(_AmbiguousCharacters.ambiguousCharacterData.value).filter((k) => !k.startsWith("_")));
  let AmbiguousCharacters = _AmbiguousCharacters;
  const _InvisibleCharacters = class _InvisibleCharacters {
    static getRawData() {
      return JSON.parse('{"_common":[11,12,13,127,847,1564,4447,4448,6068,6069,6155,6156,6157,6158,7355,7356,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8204,8205,8206,8207,8234,8235,8236,8237,8238,8239,8287,8288,8289,8290,8291,8292,8293,8294,8295,8296,8297,8298,8299,8300,8301,8302,8303,10240,12644,65024,65025,65026,65027,65028,65029,65030,65031,65032,65033,65034,65035,65036,65037,65038,65039,65279,65440,65520,65521,65522,65523,65524,65525,65526,65527,65528,65532,78844,119155,119156,119157,119158,119159,119160,119161,119162,917504,917505,917506,917507,917508,917509,917510,917511,917512,917513,917514,917515,917516,917517,917518,917519,917520,917521,917522,917523,917524,917525,917526,917527,917528,917529,917530,917531,917532,917533,917534,917535,917536,917537,917538,917539,917540,917541,917542,917543,917544,917545,917546,917547,917548,917549,917550,917551,917552,917553,917554,917555,917556,917557,917558,917559,917560,917561,917562,917563,917564,917565,917566,917567,917568,917569,917570,917571,917572,917573,917574,917575,917576,917577,917578,917579,917580,917581,917582,917583,917584,917585,917586,917587,917588,917589,917590,917591,917592,917593,917594,917595,917596,917597,917598,917599,917600,917601,917602,917603,917604,917605,917606,917607,917608,917609,917610,917611,917612,917613,917614,917615,917616,917617,917618,917619,917620,917621,917622,917623,917624,917625,917626,917627,917628,917629,917630,917631,917760,917761,917762,917763,917764,917765,917766,917767,917768,917769,917770,917771,917772,917773,917774,917775,917776,917777,917778,917779,917780,917781,917782,917783,917784,917785,917786,917787,917788,917789,917790,917791,917792,917793,917794,917795,917796,917797,917798,917799,917800,917801,917802,917803,917804,917805,917806,917807,917808,917809,917810,917811,917812,917813,917814,917815,917816,917817,917818,917819,917820,917821,917822,917823,917824,917825,917826,917827,917828,917829,917830,917831,917832,917833,917834,917835,917836,917837,917838,917839,917840,917841,917842,917843,917844,917845,917846,917847,917848,917849,917850,917851,917852,917853,917854,917855,917856,917857,917858,917859,917860,917861,917862,917863,917864,917865,917866,917867,917868,917869,917870,917871,917872,917873,917874,917875,917876,917877,917878,917879,917880,917881,917882,917883,917884,917885,917886,917887,917888,917889,917890,917891,917892,917893,917894,917895,917896,917897,917898,917899,917900,917901,917902,917903,917904,917905,917906,917907,917908,917909,917910,917911,917912,917913,917914,917915,917916,917917,917918,917919,917920,917921,917922,917923,917924,917925,917926,917927,917928,917929,917930,917931,917932,917933,917934,917935,917936,917937,917938,917939,917940,917941,917942,917943,917944,917945,917946,917947,917948,917949,917950,917951,917952,917953,917954,917955,917956,917957,917958,917959,917960,917961,917962,917963,917964,917965,917966,917967,917968,917969,917970,917971,917972,917973,917974,917975,917976,917977,917978,917979,917980,917981,917982,917983,917984,917985,917986,917987,917988,917989,917990,917991,917992,917993,917994,917995,917996,917997,917998,917999],"cs":[173,8203,12288],"de":[173,8203,12288],"es":[8203,12288],"fr":[173,8203,12288],"it":[160,173,12288],"ja":[173],"ko":[173,12288],"pl":[173,8203,12288],"pt-BR":[173,8203,12288],"qps-ploc":[160,173,8203,12288],"ru":[173,12288],"tr":[160,173,8203,12288],"zh-hans":[160,173,8203,12288],"zh-hant":[173,12288]}');
    }
    static getData() {
      if (!this._data) {
        this._data = new Set([...Object.values(_InvisibleCharacters.getRawData())].flat());
      }
      return this._data;
    }
    static isInvisibleCharacter(codePoint) {
      return _InvisibleCharacters.getData().has(codePoint);
    }
    static get codePoints() {
      return _InvisibleCharacters.getData();
    }
  };
  _InvisibleCharacters._data = void 0;
  let InvisibleCharacters = _InvisibleCharacters;
  const MicrotaskDelay = /* @__PURE__ */ Symbol("MicrotaskDelay");
  function isThenable(obj) {
    return !!obj && typeof obj.then === "function";
  }
  function createCancelablePromise(callback) {
    const source = new CancellationTokenSource();
    const thenable = callback(source.token);
    let isCancelled = false;
    const promise = new Promise((resolve2, reject) => {
      const subscription = source.token.onCancellationRequested(() => {
        isCancelled = true;
        subscription.dispose();
        reject(new CancellationError());
      });
      Promise.resolve(thenable).then((value) => {
        subscription.dispose();
        source.dispose();
        if (!isCancelled) {
          resolve2(value);
        } else if (isDisposable(value)) {
          value.dispose();
        }
      }, (err) => {
        subscription.dispose();
        source.dispose();
        reject(err);
      });
    });
    return new class {
      cancel() {
        source.cancel();
        source.dispose();
      }
      then(resolve2, reject) {
        return promise.then(resolve2, reject);
      }
      catch(reject) {
        return this.then(void 0, reject);
      }
      finally(onfinally) {
        return promise.finally(onfinally);
      }
    }();
  }
  function raceCancellation(promise, token, defaultValue) {
    return new Promise((resolve2, reject) => {
      const ref = token.onCancellationRequested(() => {
        ref.dispose();
        resolve2(defaultValue);
      });
      promise.then(resolve2, reject).finally(() => ref.dispose());
    });
  }
  function raceCancellationError(promise, token) {
    return new Promise((resolve2, reject) => {
      const ref = token.onCancellationRequested(() => {
        ref.dispose();
        reject(new CancellationError());
      });
      promise.then(resolve2, reject).finally(() => ref.dispose());
    });
  }
  function raceTimeout(promise, timeout2, onTimeout) {
    let promiseResolve = void 0;
    const timer = setTimeout(() => {
      promiseResolve?.(void 0);
      onTimeout?.();
    }, timeout2);
    return Promise.race([
      promise.finally(() => clearTimeout(timer)),
      new Promise((resolve2) => promiseResolve = resolve2)
    ]);
  }
  class Throttler {
    constructor() {
      this.activePromise = null;
      this.queuedPromise = null;
      this.queuedPromiseFactory = null;
      this.cancellationTokenSource = new CancellationTokenSource();
    }
    queue(promiseFactory) {
      if (this.cancellationTokenSource.token.isCancellationRequested) {
        return Promise.reject(new Error("Throttler is disposed"));
      }
      if (this.activePromise) {
        this.queuedPromiseFactory = promiseFactory;
        if (!this.queuedPromise) {
          const onComplete = () => {
            this.queuedPromise = null;
            if (this.cancellationTokenSource.token.isCancellationRequested) {
              return;
            }
            const result = this.queue(this.queuedPromiseFactory);
            this.queuedPromiseFactory = null;
            return result;
          };
          this.queuedPromise = new Promise((resolve2) => {
            this.activePromise.then(onComplete, onComplete).then(resolve2);
          });
        }
        return new Promise((resolve2, reject) => {
          this.queuedPromise.then(resolve2, reject);
        });
      }
      this.activePromise = promiseFactory(this.cancellationTokenSource.token);
      return new Promise((resolve2, reject) => {
        this.activePromise.then((result) => {
          this.activePromise = null;
          resolve2(result);
        }, (err) => {
          this.activePromise = null;
          reject(err);
        });
      });
    }
    dispose() {
      this.cancellationTokenSource.cancel();
    }
  }
  const timeoutDeferred = (timeout2, fn) => {
    let scheduled = true;
    const handle = setTimeout(() => {
      scheduled = false;
      fn();
    }, timeout2);
    return {
      isTriggered: () => scheduled,
      dispose: () => {
        clearTimeout(handle);
        scheduled = false;
      }
    };
  };
  const microtaskDeferred = (fn) => {
    let scheduled = true;
    queueMicrotask(() => {
      if (scheduled) {
        scheduled = false;
        fn();
      }
    });
    return {
      isTriggered: () => scheduled,
      dispose: () => {
        scheduled = false;
      }
    };
  };
  class Delayer {
    constructor(defaultDelay) {
      this.defaultDelay = defaultDelay;
      this.deferred = null;
      this.completionPromise = null;
      this.doResolve = null;
      this.doReject = null;
      this.task = null;
    }
    trigger(task, delay = this.defaultDelay) {
      this.task = task;
      this.cancelTimeout();
      if (!this.completionPromise) {
        this.completionPromise = new Promise((resolve2, reject) => {
          this.doResolve = resolve2;
          this.doReject = reject;
        }).then(() => {
          this.completionPromise = null;
          this.doResolve = null;
          if (this.task) {
            const task2 = this.task;
            this.task = null;
            return task2();
          }
          return void 0;
        });
      }
      const fn = () => {
        this.deferred = null;
        this.doResolve?.(null);
      };
      this.deferred = delay === MicrotaskDelay ? microtaskDeferred(fn) : timeoutDeferred(delay, fn);
      return this.completionPromise;
    }
    isTriggered() {
      return !!this.deferred?.isTriggered();
    }
    cancel() {
      this.cancelTimeout();
      if (this.completionPromise) {
        this.doReject?.(new CancellationError());
        this.completionPromise = null;
      }
    }
    cancelTimeout() {
      this.deferred?.dispose();
      this.deferred = null;
    }
    dispose() {
      this.cancel();
    }
  }
  class ThrottledDelayer {
    constructor(defaultDelay) {
      this.delayer = new Delayer(defaultDelay);
      this.throttler = new Throttler();
    }
    trigger(promiseFactory, delay) {
      return this.delayer.trigger(() => this.throttler.queue(promiseFactory), delay);
    }
    cancel() {
      this.delayer.cancel();
    }
    dispose() {
      this.delayer.dispose();
      this.throttler.dispose();
    }
  }
  function timeout(millis, token) {
    if (!token) {
      return createCancelablePromise((token2) => timeout(millis, token2));
    }
    return new Promise((resolve2, reject) => {
      const handle = setTimeout(() => {
        disposable.dispose();
        resolve2();
      }, millis);
      const disposable = token.onCancellationRequested(() => {
        clearTimeout(handle);
        disposable.dispose();
        reject(new CancellationError());
      });
    });
  }
  function disposableTimeout(handler, timeout2 = 0, store) {
    const timer = setTimeout(() => {
      handler();
      if (store) {
        disposable.dispose();
      }
    }, timeout2);
    const disposable = toDisposable(() => {
      clearTimeout(timer);
      store?.delete(disposable);
    });
    store?.add(disposable);
    return disposable;
  }
  function first(promiseFactories, shouldStop = (t) => !!t, defaultValue = null) {
    let index = 0;
    const len = promiseFactories.length;
    const loop = () => {
      if (index >= len) {
        return Promise.resolve(defaultValue);
      }
      const factory = promiseFactories[index++];
      const promise = Promise.resolve(factory());
      return promise.then((result) => {
        if (shouldStop(result)) {
          return Promise.resolve(result);
        }
        return loop();
      });
    };
    return loop();
  }
  class TaskQueue {
    constructor() {
      this._runningTask = void 0;
      this._pendingTasks = [];
    }
    /**
     * Waits for the current and pending tasks to finish, then runs and awaits the given task.
     * If the task is skipped because of clearPending, the promise is rejected with a CancellationError.
    */
    schedule(task) {
      const deferred = new DeferredPromise();
      this._pendingTasks.push({ task, deferred, setUndefinedWhenCleared: false });
      this._runIfNotRunning();
      return deferred.p;
    }
    _runIfNotRunning() {
      if (this._runningTask === void 0) {
        this._processQueue();
      }
    }
    async _processQueue() {
      if (this._pendingTasks.length === 0) {
        return;
      }
      const next = this._pendingTasks.shift();
      if (!next) {
        return;
      }
      if (this._runningTask) {
        throw new BugIndicatingError();
      }
      this._runningTask = next.task;
      try {
        const result = await next.task();
        next.deferred.complete(result);
      } catch (e) {
        next.deferred.error(e);
      } finally {
        this._runningTask = void 0;
        this._processQueue();
      }
    }
    /**
     * Clears all pending tasks. Does not cancel the currently running task.
    */
    clearPending() {
      const tasks = this._pendingTasks;
      this._pendingTasks = [];
      for (const task of tasks) {
        if (task.setUndefinedWhenCleared) {
          task.deferred.complete(void 0);
        } else {
          task.deferred.error(new CancellationError());
        }
      }
    }
  }
  class TimeoutTimer {
    constructor(runner, timeout2) {
      this._isDisposed = false;
      this._token = void 0;
      if (typeof runner === "function" && typeof timeout2 === "number") {
        this.setIfNotSet(runner, timeout2);
      }
    }
    dispose() {
      this.cancel();
      this._isDisposed = true;
    }
    cancel() {
      if (this._token !== void 0) {
        clearTimeout(this._token);
        this._token = void 0;
      }
    }
    cancelAndSet(runner, timeout2) {
      if (this._isDisposed) {
        throw new BugIndicatingError(`Calling 'cancelAndSet' on a disposed TimeoutTimer`);
      }
      this.cancel();
      this._token = setTimeout(() => {
        this._token = void 0;
        runner();
      }, timeout2);
    }
    setIfNotSet(runner, timeout2) {
      if (this._isDisposed) {
        throw new BugIndicatingError(`Calling 'setIfNotSet' on a disposed TimeoutTimer`);
      }
      if (this._token !== void 0) {
        return;
      }
      this._token = setTimeout(() => {
        this._token = void 0;
        runner();
      }, timeout2);
    }
  }
  class IntervalTimer {
    constructor() {
      this.disposable = void 0;
      this.isDisposed = false;
    }
    cancel() {
      this.disposable?.dispose();
      this.disposable = void 0;
    }
    cancelAndSet(runner, interval, context = globalThis) {
      if (this.isDisposed) {
        throw new BugIndicatingError(`Calling 'cancelAndSet' on a disposed IntervalTimer`);
      }
      this.cancel();
      const handle = context.setInterval(() => {
        runner();
      }, interval);
      this.disposable = toDisposable(() => {
        context.clearInterval(handle);
        this.disposable = void 0;
      });
    }
    dispose() {
      this.cancel();
      this.isDisposed = true;
    }
  }
  class RunOnceScheduler {
    constructor(runner, delay) {
      this.timeoutToken = void 0;
      this.runner = runner;
      this.timeout = delay;
      this.timeoutHandler = this.onTimeout.bind(this);
    }
    /**
     * Dispose RunOnceScheduler
     */
    dispose() {
      this.cancel();
      this.runner = null;
    }
    /**
     * Cancel current scheduled runner (if any).
     */
    cancel() {
      if (this.isScheduled()) {
        clearTimeout(this.timeoutToken);
        this.timeoutToken = void 0;
      }
    }
    /**
     * Cancel previous runner (if any) & schedule a new runner.
     */
    schedule(delay = this.timeout) {
      this.cancel();
      this.timeoutToken = setTimeout(this.timeoutHandler, delay);
    }
    get delay() {
      return this.timeout;
    }
    set delay(value) {
      this.timeout = value;
    }
    /**
     * Returns true if scheduled.
     */
    isScheduled() {
      return this.timeoutToken !== void 0;
    }
    onTimeout() {
      this.timeoutToken = void 0;
      if (this.runner) {
        this.doRun();
      }
    }
    doRun() {
      this.runner?.();
    }
  }
  exports.runWhenGlobalIdle = void 0;
  exports._runWhenIdle = void 0;
  (function() {
    const safeGlobal = globalThis;
    if (typeof safeGlobal.requestIdleCallback !== "function" || typeof safeGlobal.cancelIdleCallback !== "function") {
      exports._runWhenIdle = (_targetWindow, runner, timeout2) => {
        setTimeout0(() => {
          if (disposed) {
            return;
          }
          const end = Date.now() + 15;
          const deadline = {
            didTimeout: true,
            timeRemaining() {
              return Math.max(0, end - Date.now());
            }
          };
          runner(Object.freeze(deadline));
        });
        let disposed = false;
        return {
          dispose() {
            if (disposed) {
              return;
            }
            disposed = true;
          }
        };
      };
    } else {
      exports._runWhenIdle = (targetWindow, runner, timeout2) => {
        const handle = targetWindow.requestIdleCallback(runner, typeof timeout2 === "number" ? { timeout: timeout2 } : void 0);
        let disposed = false;
        return {
          dispose() {
            if (disposed) {
              return;
            }
            disposed = true;
            targetWindow.cancelIdleCallback(handle);
          }
        };
      };
    }
    exports.runWhenGlobalIdle = (runner, timeout2) => exports._runWhenIdle(globalThis, runner, timeout2);
  })();
  class AbstractIdleValue {
    constructor(targetWindow, executor) {
      this._didRun = false;
      this._executor = () => {
        try {
          this._value = executor();
        } catch (err) {
          this._error = err;
        } finally {
          this._didRun = true;
        }
      };
      this._handle = exports._runWhenIdle(targetWindow, () => this._executor());
    }
    dispose() {
      this._handle.dispose();
    }
    get value() {
      if (!this._didRun) {
        this._handle.dispose();
        this._executor();
      }
      if (this._error) {
        throw this._error;
      }
      return this._value;
    }
    get isInitialized() {
      return this._didRun;
    }
  }
  class GlobalIdleValue extends AbstractIdleValue {
    constructor(executor) {
      super(globalThis, executor);
    }
  }
  class DeferredPromise {
    get isRejected() {
      return this.outcome?.outcome === 1;
    }
    get isSettled() {
      return !!this.outcome;
    }
    constructor() {
      this.p = new Promise((c, e) => {
        this.completeCallback = c;
        this.errorCallback = e;
      });
    }
    complete(value) {
      if (this.isSettled) {
        return Promise.resolve();
      }
      return new Promise((resolve2) => {
        this.completeCallback(value);
        this.outcome = { outcome: 0, value };
        resolve2();
      });
    }
    error(err) {
      if (this.isSettled) {
        return Promise.resolve();
      }
      return new Promise((resolve2) => {
        this.errorCallback(err);
        this.outcome = { outcome: 1, value: err };
        resolve2();
      });
    }
    cancel() {
      return this.error(new CancellationError());
    }
  }
  exports.Promises = void 0;
  (function(Promises) {
    async function settled(promises) {
      let firstError = void 0;
      const result = await Promise.all(promises.map((promise) => promise.then((value) => value, (error) => {
        if (!firstError) {
          firstError = error;
        }
        return void 0;
      })));
      if (typeof firstError !== "undefined") {
        throw firstError;
      }
      return result;
    }
    Promises.settled = settled;
    function withAsyncBody(bodyFn) {
      return new Promise(async (resolve2, reject) => {
        try {
          await bodyFn(resolve2, reject);
        } catch (error) {
          reject(error);
        }
      });
    }
    Promises.withAsyncBody = withAsyncBody;
  })(exports.Promises || (exports.Promises = {}));
  function createCancelableAsyncIterableProducer(callback) {
    const source = new CancellationTokenSource();
    const innerIterable = callback(source.token);
    return new CancelableAsyncIterableProducer(source, async (emitter) => {
      const subscription = source.token.onCancellationRequested(() => {
        subscription.dispose();
        source.dispose();
        emitter.reject(new CancellationError());
      });
      try {
        for await (const item of innerIterable) {
          if (source.token.isCancellationRequested) {
            return;
          }
          emitter.emitOne(item);
        }
        subscription.dispose();
        source.dispose();
      } catch (err) {
        subscription.dispose();
        source.dispose();
        emitter.reject(err);
      }
    });
  }
  class ProducerConsumer {
    constructor() {
      this._unsatisfiedConsumers = [];
      this._unconsumedValues = [];
    }
    get hasFinalValue() {
      return !!this._finalValue;
    }
    produce(value) {
      this._ensureNoFinalValue();
      if (this._unsatisfiedConsumers.length > 0) {
        const deferred = this._unsatisfiedConsumers.shift();
        this._resolveOrRejectDeferred(deferred, value);
      } else {
        this._unconsumedValues.push(value);
      }
    }
    produceFinal(value) {
      this._ensureNoFinalValue();
      this._finalValue = value;
      for (const deferred of this._unsatisfiedConsumers) {
        this._resolveOrRejectDeferred(deferred, value);
      }
      this._unsatisfiedConsumers.length = 0;
    }
    _ensureNoFinalValue() {
      if (this._finalValue) {
        throw new BugIndicatingError("ProducerConsumer: cannot produce after final value has been set");
      }
    }
    _resolveOrRejectDeferred(deferred, value) {
      if (value.ok) {
        deferred.complete(value.value);
      } else {
        deferred.error(value.error);
      }
    }
    consume() {
      if (this._unconsumedValues.length > 0 || this._finalValue) {
        const value = this._unconsumedValues.length > 0 ? this._unconsumedValues.shift() : this._finalValue;
        if (value.ok) {
          return Promise.resolve(value.value);
        } else {
          return Promise.reject(value.error);
        }
      } else {
        const deferred = new DeferredPromise();
        this._unsatisfiedConsumers.push(deferred);
        return deferred.p;
      }
    }
  }
  const _AsyncIterableProducer = class _AsyncIterableProducer {
    constructor(executor, _onReturn) {
      this._onReturn = _onReturn;
      this._producerConsumer = new ProducerConsumer();
      this._iterator = {
        next: () => this._producerConsumer.consume(),
        return: () => {
          this._onReturn?.();
          return Promise.resolve({ done: true, value: void 0 });
        },
        throw: async (e) => {
          this._finishError(e);
          return { done: true, value: void 0 };
        }
      };
      queueMicrotask(async () => {
        const p = executor({
          emitOne: (value) => this._producerConsumer.produce({ ok: true, value: { done: false, value } }),
          emitMany: (values) => {
            for (const value of values) {
              this._producerConsumer.produce({ ok: true, value: { done: false, value } });
            }
          },
          reject: (error) => this._finishError(error)
        });
        if (!this._producerConsumer.hasFinalValue) {
          try {
            await p;
            this._finishOk();
          } catch (error) {
            this._finishError(error);
          }
        }
      });
    }
    static fromArray(items) {
      return new _AsyncIterableProducer((writer) => {
        writer.emitMany(items);
      });
    }
    static fromPromise(promise) {
      return new _AsyncIterableProducer(async (emitter) => {
        emitter.emitMany(await promise);
      });
    }
    static fromPromisesResolveOrder(promises) {
      return new _AsyncIterableProducer(async (emitter) => {
        await Promise.all(promises.map(async (p) => emitter.emitOne(await p)));
      });
    }
    static merge(iterables) {
      return new _AsyncIterableProducer(async (emitter) => {
        await Promise.all(iterables.map(async (iterable) => {
          for await (const item of iterable) {
            emitter.emitOne(item);
          }
        }));
      });
    }
    static map(iterable, mapFn) {
      return new _AsyncIterableProducer(async (emitter) => {
        for await (const item of iterable) {
          emitter.emitOne(mapFn(item));
        }
      });
    }
    static tee(iterable) {
      let emitter1;
      let emitter2;
      const defer = new DeferredPromise();
      const start = async () => {
        if (!emitter1 || !emitter2) {
          return;
        }
        try {
          for await (const item of iterable) {
            emitter1.emitOne(item);
            emitter2.emitOne(item);
          }
        } catch (err) {
          emitter1.reject(err);
          emitter2.reject(err);
        } finally {
          defer.complete();
        }
      };
      const p1 = new _AsyncIterableProducer(async (emitter) => {
        emitter1 = emitter;
        start();
        return defer.p;
      });
      const p2 = new _AsyncIterableProducer(async (emitter) => {
        emitter2 = emitter;
        start();
        return defer.p;
      });
      return [p1, p2];
    }
    map(mapFn) {
      return _AsyncIterableProducer.map(this, mapFn);
    }
    static coalesce(iterable) {
      return _AsyncIterableProducer.filter(iterable, (item) => !!item);
    }
    coalesce() {
      return _AsyncIterableProducer.coalesce(this);
    }
    static filter(iterable, filterFn) {
      return new _AsyncIterableProducer(async (emitter) => {
        for await (const item of iterable) {
          if (filterFn(item)) {
            emitter.emitOne(item);
          }
        }
      });
    }
    filter(filterFn) {
      return _AsyncIterableProducer.filter(this, filterFn);
    }
    _finishOk() {
      if (!this._producerConsumer.hasFinalValue) {
        this._producerConsumer.produceFinal({ ok: true, value: { done: true, value: void 0 } });
      }
    }
    _finishError(error) {
      if (!this._producerConsumer.hasFinalValue) {
        this._producerConsumer.produceFinal({ ok: false, error });
      }
    }
    [Symbol.asyncIterator]() {
      return this._iterator;
    }
  };
  _AsyncIterableProducer.EMPTY = _AsyncIterableProducer.fromArray([]);
  let AsyncIterableProducer = _AsyncIterableProducer;
  class CancelableAsyncIterableProducer extends AsyncIterableProducer {
    constructor(_source, executor) {
      super(executor);
      this._source = _source;
    }
    cancel() {
      this._source.cancel();
    }
  }
  const hasBuffer = typeof Buffer !== "undefined";
  new Lazy(() => new Uint8Array(256));
  let textDecoder;
  class VSBuffer {
    /**
     * When running in a nodejs context, if `actual` is not a nodejs Buffer, the backing store for
     * the returned `VSBuffer` instance might use a nodejs Buffer allocated from node's Buffer pool,
     * which is not transferrable.
     */
    static wrap(actual) {
      if (hasBuffer && !Buffer.isBuffer(actual)) {
        actual = Buffer.from(actual.buffer, actual.byteOffset, actual.byteLength);
      }
      return new VSBuffer(actual);
    }
    constructor(buffer) {
      this.buffer = buffer;
      this.byteLength = this.buffer.byteLength;
    }
    toString() {
      if (hasBuffer) {
        return this.buffer.toString();
      } else {
        if (!textDecoder) {
          textDecoder = new TextDecoder(void 0, { ignoreBOM: true });
        }
        return textDecoder.decode(this.buffer);
      }
    }
  }
  function readUInt16LE(source, offset) {
    return source[offset + 0] << 0 >>> 0 | source[offset + 1] << 8 >>> 0;
  }
  function writeUInt16LE(destination, value, offset) {
    destination[offset + 0] = value & 255;
    value = value >>> 8;
    destination[offset + 1] = value & 255;
  }
  function readUInt32BE(source, offset) {
    return source[offset] * 2 ** 24 + source[offset + 1] * 2 ** 16 + source[offset + 2] * 2 ** 8 + source[offset + 3];
  }
  function writeUInt32BE(destination, value, offset) {
    destination[offset + 3] = value;
    value = value >>> 8;
    destination[offset + 2] = value;
    value = value >>> 8;
    destination[offset + 1] = value;
    value = value >>> 8;
    destination[offset] = value;
  }
  function readUInt8(source, offset) {
    return source[offset];
  }
  function writeUInt8(destination, value, offset) {
    destination[offset] = value;
  }
  const hexChars = "0123456789abcdef";
  function encodeHex({ buffer }) {
    let result = "";
    for (let i = 0; i < buffer.length; i++) {
      const byte = buffer[i];
      result += hexChars[byte >>> 4];
      result += hexChars[byte & 15];
    }
    return result;
  }
  function hash(obj) {
    return doHash(obj, 0);
  }
  function doHash(obj, hashVal) {
    switch (typeof obj) {
      case "object":
        if (obj === null) {
          return numberHash(349, hashVal);
        } else if (Array.isArray(obj)) {
          return arrayHash(obj, hashVal);
        }
        return objectHash(obj, hashVal);
      case "string":
        return stringHash(obj, hashVal);
      case "boolean":
        return booleanHash(obj, hashVal);
      case "number":
        return numberHash(obj, hashVal);
      case "undefined":
        return numberHash(937, hashVal);
      default:
        return numberHash(617, hashVal);
    }
  }
  function numberHash(val, initialHashVal) {
    return (initialHashVal << 5) - initialHashVal + val | 0;
  }
  function booleanHash(b, initialHashVal) {
    return numberHash(b ? 433 : 863, initialHashVal);
  }
  function stringHash(s, hashVal) {
    hashVal = numberHash(149417, hashVal);
    for (let i = 0, length = s.length; i < length; i++) {
      hashVal = numberHash(s.charCodeAt(i), hashVal);
    }
    return hashVal;
  }
  function arrayHash(arr, initialHashVal) {
    initialHashVal = numberHash(104579, initialHashVal);
    return arr.reduce((hashVal, item) => doHash(item, hashVal), initialHashVal);
  }
  function objectHash(obj, initialHashVal) {
    initialHashVal = numberHash(181387, initialHashVal);
    return Object.keys(obj).sort().reduce((hashVal, key) => {
      hashVal = stringHash(key, hashVal);
      return doHash(obj[key], hashVal);
    }, initialHashVal);
  }
  function leftRotate(value, bits, totalBits = 32) {
    const delta = totalBits - bits;
    const mask = ~((1 << delta) - 1);
    return (value << bits | (mask & value) >>> delta) >>> 0;
  }
  function toHexString(bufferOrValue, bitsize = 32) {
    if (bufferOrValue instanceof ArrayBuffer) {
      return encodeHex(VSBuffer.wrap(new Uint8Array(bufferOrValue)));
    }
    return (bufferOrValue >>> 0).toString(16).padStart(bitsize / 4, "0");
  }
  const _StringSHA1 = class _StringSHA1 {
    // 80 * 4 = 320
    constructor() {
      this._h0 = 1732584193;
      this._h1 = 4023233417;
      this._h2 = 2562383102;
      this._h3 = 271733878;
      this._h4 = 3285377520;
      this._buff = new Uint8Array(
        64 + 3
        /* to fit any utf-8 */
      );
      this._buffDV = new DataView(this._buff.buffer);
      this._buffLen = 0;
      this._totalLen = 0;
      this._leftoverHighSurrogate = 0;
      this._finished = false;
    }
    update(str) {
      const strLen = str.length;
      if (strLen === 0) {
        return;
      }
      const buff = this._buff;
      let buffLen = this._buffLen;
      let leftoverHighSurrogate = this._leftoverHighSurrogate;
      let charCode;
      let offset;
      if (leftoverHighSurrogate !== 0) {
        charCode = leftoverHighSurrogate;
        offset = -1;
        leftoverHighSurrogate = 0;
      } else {
        charCode = str.charCodeAt(0);
        offset = 0;
      }
      while (true) {
        let codePoint = charCode;
        if (isHighSurrogate(charCode)) {
          if (offset + 1 < strLen) {
            const nextCharCode = str.charCodeAt(offset + 1);
            if (isLowSurrogate(nextCharCode)) {
              offset++;
              codePoint = computeCodePoint(charCode, nextCharCode);
            } else {
              codePoint = 65533;
            }
          } else {
            leftoverHighSurrogate = charCode;
            break;
          }
        } else if (isLowSurrogate(charCode)) {
          codePoint = 65533;
        }
        buffLen = this._push(buff, buffLen, codePoint);
        offset++;
        if (offset < strLen) {
          charCode = str.charCodeAt(offset);
        } else {
          break;
        }
      }
      this._buffLen = buffLen;
      this._leftoverHighSurrogate = leftoverHighSurrogate;
    }
    _push(buff, buffLen, codePoint) {
      if (codePoint < 128) {
        buff[buffLen++] = codePoint;
      } else if (codePoint < 2048) {
        buff[buffLen++] = 192 | (codePoint & 1984) >>> 6;
        buff[buffLen++] = 128 | (codePoint & 63) >>> 0;
      } else if (codePoint < 65536) {
        buff[buffLen++] = 224 | (codePoint & 61440) >>> 12;
        buff[buffLen++] = 128 | (codePoint & 4032) >>> 6;
        buff[buffLen++] = 128 | (codePoint & 63) >>> 0;
      } else {
        buff[buffLen++] = 240 | (codePoint & 1835008) >>> 18;
        buff[buffLen++] = 128 | (codePoint & 258048) >>> 12;
        buff[buffLen++] = 128 | (codePoint & 4032) >>> 6;
        buff[buffLen++] = 128 | (codePoint & 63) >>> 0;
      }
      if (buffLen >= 64) {
        this._step();
        buffLen -= 64;
        this._totalLen += 64;
        buff[0] = buff[64 + 0];
        buff[1] = buff[64 + 1];
        buff[2] = buff[64 + 2];
      }
      return buffLen;
    }
    digest() {
      if (!this._finished) {
        this._finished = true;
        if (this._leftoverHighSurrogate) {
          this._leftoverHighSurrogate = 0;
          this._buffLen = this._push(
            this._buff,
            this._buffLen,
            65533
            /* SHA1Constant.UNICODE_REPLACEMENT */
          );
        }
        this._totalLen += this._buffLen;
        this._wrapUp();
      }
      return toHexString(this._h0) + toHexString(this._h1) + toHexString(this._h2) + toHexString(this._h3) + toHexString(this._h4);
    }
    _wrapUp() {
      this._buff[this._buffLen++] = 128;
      this._buff.subarray(this._buffLen).fill(0);
      if (this._buffLen > 56) {
        this._step();
        this._buff.fill(0);
      }
      const ml = 8 * this._totalLen;
      this._buffDV.setUint32(56, Math.floor(ml / 4294967296), false);
      this._buffDV.setUint32(60, ml % 4294967296, false);
      this._step();
    }
    _step() {
      const bigBlock32 = _StringSHA1._bigBlock32;
      const data = this._buffDV;
      for (let j = 0; j < 64; j += 4) {
        bigBlock32.setUint32(j, data.getUint32(j, false), false);
      }
      for (let j = 64; j < 320; j += 4) {
        bigBlock32.setUint32(j, leftRotate(bigBlock32.getUint32(j - 12, false) ^ bigBlock32.getUint32(j - 32, false) ^ bigBlock32.getUint32(j - 56, false) ^ bigBlock32.getUint32(j - 64, false), 1), false);
      }
      let a = this._h0;
      let b = this._h1;
      let c = this._h2;
      let d = this._h3;
      let e = this._h4;
      let f, k;
      let temp;
      for (let j = 0; j < 80; j++) {
        if (j < 20) {
          f = b & c | ~b & d;
          k = 1518500249;
        } else if (j < 40) {
          f = b ^ c ^ d;
          k = 1859775393;
        } else if (j < 60) {
          f = b & c | b & d | c & d;
          k = 2400959708;
        } else {
          f = b ^ c ^ d;
          k = 3395469782;
        }
        temp = leftRotate(a, 5) + f + e + k + bigBlock32.getUint32(j * 4, false) & 4294967295;
        e = d;
        d = c;
        c = leftRotate(b, 30);
        b = a;
        a = temp;
      }
      this._h0 = this._h0 + a & 4294967295;
      this._h1 = this._h1 + b & 4294967295;
      this._h2 = this._h2 + c & 4294967295;
      this._h3 = this._h3 + d & 4294967295;
      this._h4 = this._h4 + e & 4294967295;
    }
  };
  _StringSHA1._bigBlock32 = new DataView(new ArrayBuffer(320));
  let StringSHA1 = _StringSHA1;
  var _a, _b, _c;
  class ResourceMapEntry {
    constructor(uri, value) {
      this.uri = uri;
      this.value = value;
    }
  }
  function isEntries(arg) {
    return Array.isArray(arg);
  }
  const _ResourceMap = class _ResourceMap {
    constructor(arg, toKey) {
      this[_a] = "ResourceMap";
      if (arg instanceof _ResourceMap) {
        this.map = new Map(arg.map);
        this.toKey = toKey ?? _ResourceMap.defaultToKey;
      } else if (isEntries(arg)) {
        this.map = /* @__PURE__ */ new Map();
        this.toKey = toKey ?? _ResourceMap.defaultToKey;
        for (const [resource, value] of arg) {
          this.set(resource, value);
        }
      } else {
        this.map = /* @__PURE__ */ new Map();
        this.toKey = arg ?? _ResourceMap.defaultToKey;
      }
    }
    set(resource, value) {
      this.map.set(this.toKey(resource), new ResourceMapEntry(resource, value));
      return this;
    }
    get(resource) {
      return this.map.get(this.toKey(resource))?.value;
    }
    has(resource) {
      return this.map.has(this.toKey(resource));
    }
    get size() {
      return this.map.size;
    }
    clear() {
      this.map.clear();
    }
    delete(resource) {
      return this.map.delete(this.toKey(resource));
    }
    forEach(clb, thisArg) {
      if (typeof thisArg !== "undefined") {
        clb = clb.bind(thisArg);
      }
      for (const [_, entry] of this.map) {
        clb(entry.value, entry.uri, this);
      }
    }
    *values() {
      for (const entry of this.map.values()) {
        yield entry.value;
      }
    }
    *keys() {
      for (const entry of this.map.values()) {
        yield entry.uri;
      }
    }
    *entries() {
      for (const entry of this.map.values()) {
        yield [entry.uri, entry.value];
      }
    }
    *[(_a = Symbol.toStringTag, Symbol.iterator)]() {
      for (const [, entry] of this.map) {
        yield [entry.uri, entry.value];
      }
    }
  };
  _ResourceMap.defaultToKey = (resource) => resource.toString();
  let ResourceMap = _ResourceMap;
  class ResourceSet {
    constructor(entriesOrKey, toKey) {
      this[_b] = "ResourceSet";
      if (!entriesOrKey || typeof entriesOrKey === "function") {
        this._map = new ResourceMap(entriesOrKey);
      } else {
        this._map = new ResourceMap(toKey);
        entriesOrKey.forEach(this.add, this);
      }
    }
    get size() {
      return this._map.size;
    }
    add(value) {
      this._map.set(value, value);
      return this;
    }
    clear() {
      this._map.clear();
    }
    delete(value) {
      return this._map.delete(value);
    }
    forEach(callbackfn, thisArg) {
      this._map.forEach((_value, key) => callbackfn.call(thisArg, key, key, this));
    }
    has(value) {
      return this._map.has(value);
    }
    entries() {
      return this._map.entries();
    }
    keys() {
      return this._map.keys();
    }
    values() {
      return this._map.keys();
    }
    [(_b = Symbol.toStringTag, Symbol.iterator)]() {
      return this.keys();
    }
  }
  class LinkedMap {
    constructor() {
      this[_c] = "LinkedMap";
      this._map = /* @__PURE__ */ new Map();
      this._head = void 0;
      this._tail = void 0;
      this._size = 0;
      this._state = 0;
    }
    clear() {
      this._map.clear();
      this._head = void 0;
      this._tail = void 0;
      this._size = 0;
      this._state++;
    }
    isEmpty() {
      return !this._head && !this._tail;
    }
    get size() {
      return this._size;
    }
    get first() {
      return this._head?.value;
    }
    get last() {
      return this._tail?.value;
    }
    has(key) {
      return this._map.has(key);
    }
    get(key, touch = 0) {
      const item = this._map.get(key);
      if (!item) {
        return void 0;
      }
      if (touch !== 0) {
        this.touch(item, touch);
      }
      return item.value;
    }
    set(key, value, touch = 0) {
      let item = this._map.get(key);
      if (item) {
        item.value = value;
        if (touch !== 0) {
          this.touch(item, touch);
        }
      } else {
        item = { key, value, next: void 0, previous: void 0 };
        switch (touch) {
          case 0:
            this.addItemLast(item);
            break;
          case 1:
            this.addItemFirst(item);
            break;
          case 2:
            this.addItemLast(item);
            break;
          default:
            this.addItemLast(item);
            break;
        }
        this._map.set(key, item);
        this._size++;
      }
      return this;
    }
    delete(key) {
      return !!this.remove(key);
    }
    remove(key) {
      const item = this._map.get(key);
      if (!item) {
        return void 0;
      }
      this._map.delete(key);
      this.removeItem(item);
      this._size--;
      return item.value;
    }
    shift() {
      if (!this._head && !this._tail) {
        return void 0;
      }
      if (!this._head || !this._tail) {
        throw new Error("Invalid list");
      }
      const item = this._head;
      this._map.delete(item.key);
      this.removeItem(item);
      this._size--;
      return item.value;
    }
    forEach(callbackfn, thisArg) {
      const state = this._state;
      let current = this._head;
      while (current) {
        if (thisArg) {
          callbackfn.bind(thisArg)(current.value, current.key, this);
        } else {
          callbackfn(current.value, current.key, this);
        }
        if (this._state !== state) {
          throw new Error(`LinkedMap got modified during iteration.`);
        }
        current = current.next;
      }
    }
    keys() {
      const map = this;
      const state = this._state;
      let current = this._head;
      const iterator = {
        [Symbol.iterator]() {
          return iterator;
        },
        next() {
          if (map._state !== state) {
            throw new Error(`LinkedMap got modified during iteration.`);
          }
          if (current) {
            const result = { value: current.key, done: false };
            current = current.next;
            return result;
          } else {
            return { value: void 0, done: true };
          }
        }
      };
      return iterator;
    }
    values() {
      const map = this;
      const state = this._state;
      let current = this._head;
      const iterator = {
        [Symbol.iterator]() {
          return iterator;
        },
        next() {
          if (map._state !== state) {
            throw new Error(`LinkedMap got modified during iteration.`);
          }
          if (current) {
            const result = { value: current.value, done: false };
            current = current.next;
            return result;
          } else {
            return { value: void 0, done: true };
          }
        }
      };
      return iterator;
    }
    entries() {
      const map = this;
      const state = this._state;
      let current = this._head;
      const iterator = {
        [Symbol.iterator]() {
          return iterator;
        },
        next() {
          if (map._state !== state) {
            throw new Error(`LinkedMap got modified during iteration.`);
          }
          if (current) {
            const result = { value: [current.key, current.value], done: false };
            current = current.next;
            return result;
          } else {
            return { value: void 0, done: true };
          }
        }
      };
      return iterator;
    }
    [(_c = Symbol.toStringTag, Symbol.iterator)]() {
      return this.entries();
    }
    trimOld(newSize) {
      if (newSize >= this.size) {
        return;
      }
      if (newSize === 0) {
        this.clear();
        return;
      }
      let current = this._head;
      let currentSize = this.size;
      while (current && currentSize > newSize) {
        this._map.delete(current.key);
        current = current.next;
        currentSize--;
      }
      this._head = current;
      this._size = currentSize;
      if (current) {
        current.previous = void 0;
      }
      this._state++;
    }
    trimNew(newSize) {
      if (newSize >= this.size) {
        return;
      }
      if (newSize === 0) {
        this.clear();
        return;
      }
      let current = this._tail;
      let currentSize = this.size;
      while (current && currentSize > newSize) {
        this._map.delete(current.key);
        current = current.previous;
        currentSize--;
      }
      this._tail = current;
      this._size = currentSize;
      if (current) {
        current.next = void 0;
      }
      this._state++;
    }
    addItemFirst(item) {
      if (!this._head && !this._tail) {
        this._tail = item;
      } else if (!this._head) {
        throw new Error("Invalid list");
      } else {
        item.next = this._head;
        this._head.previous = item;
      }
      this._head = item;
      this._state++;
    }
    addItemLast(item) {
      if (!this._head && !this._tail) {
        this._head = item;
      } else if (!this._tail) {
        throw new Error("Invalid list");
      } else {
        item.previous = this._tail;
        this._tail.next = item;
      }
      this._tail = item;
      this._state++;
    }
    removeItem(item) {
      if (item === this._head && item === this._tail) {
        this._head = void 0;
        this._tail = void 0;
      } else if (item === this._head) {
        if (!item.next) {
          throw new Error("Invalid list");
        }
        item.next.previous = void 0;
        this._head = item.next;
      } else if (item === this._tail) {
        if (!item.previous) {
          throw new Error("Invalid list");
        }
        item.previous.next = void 0;
        this._tail = item.previous;
      } else {
        const next = item.next;
        const previous = item.previous;
        if (!next || !previous) {
          throw new Error("Invalid list");
        }
        next.previous = previous;
        previous.next = next;
      }
      item.next = void 0;
      item.previous = void 0;
      this._state++;
    }
    touch(item, touch) {
      if (!this._head || !this._tail) {
        throw new Error("Invalid list");
      }
      if (touch !== 1 && touch !== 2) {
        return;
      }
      if (touch === 1) {
        if (item === this._head) {
          return;
        }
        const next = item.next;
        const previous = item.previous;
        if (item === this._tail) {
          previous.next = void 0;
          this._tail = previous;
        } else {
          next.previous = previous;
          previous.next = next;
        }
        item.previous = void 0;
        item.next = this._head;
        this._head.previous = item;
        this._head = item;
        this._state++;
      } else if (touch === 2) {
        if (item === this._tail) {
          return;
        }
        const next = item.next;
        const previous = item.previous;
        if (item === this._head) {
          next.previous = void 0;
          this._head = next;
        } else {
          next.previous = previous;
          previous.next = next;
        }
        item.next = void 0;
        item.previous = this._tail;
        this._tail.next = item;
        this._tail = item;
        this._state++;
      }
    }
    toJSON() {
      const data = [];
      this.forEach((value, key) => {
        data.push([key, value]);
      });
      return data;
    }
    fromJSON(data) {
      this.clear();
      for (const [key, value] of data) {
        this.set(key, value);
      }
    }
  }
  class Cache extends LinkedMap {
    constructor(limit, ratio = 1) {
      super();
      this._limit = limit;
      this._ratio = Math.min(Math.max(0, ratio), 1);
    }
    get limit() {
      return this._limit;
    }
    set limit(limit) {
      this._limit = limit;
      this.checkTrim();
    }
    get(key, touch = 2) {
      return super.get(key, touch);
    }
    peek(key) {
      return super.get(
        key,
        0
        /* Touch.None */
      );
    }
    set(key, value) {
      super.set(
        key,
        value,
        2
        /* Touch.AsNew */
      );
      return this;
    }
    checkTrim() {
      if (this.size > this._limit) {
        this.trim(Math.round(this._limit * this._ratio));
      }
    }
  }
  class LRUCache extends Cache {
    constructor(limit, ratio = 1) {
      super(limit, ratio);
    }
    trim(newSize) {
      this.trimOld(newSize);
    }
    set(key, value) {
      super.set(key, value);
      this.checkTrim();
      return this;
    }
  }
  class BidirectionalMap {
    constructor(entries) {
      this._m1 = /* @__PURE__ */ new Map();
      this._m2 = /* @__PURE__ */ new Map();
      if (entries) {
        for (const [key, value] of entries) {
          this.set(key, value);
        }
      }
    }
    clear() {
      this._m1.clear();
      this._m2.clear();
    }
    set(key, value) {
      this._m1.set(key, value);
      this._m2.set(value, key);
    }
    get(key) {
      return this._m1.get(key);
    }
    getKey(value) {
      return this._m2.get(value);
    }
    delete(key) {
      const value = this._m1.get(key);
      if (value === void 0) {
        return false;
      }
      this._m1.delete(key);
      this._m2.delete(value);
      return true;
    }
    keys() {
      return this._m1.keys();
    }
    values() {
      return this._m1.values();
    }
  }
  class SetMap {
    constructor() {
      this.map = /* @__PURE__ */ new Map();
    }
    add(key, value) {
      let values = this.map.get(key);
      if (!values) {
        values = /* @__PURE__ */ new Set();
        this.map.set(key, values);
      }
      values.add(value);
    }
    delete(key, value) {
      const values = this.map.get(key);
      if (!values) {
        return;
      }
      values.delete(value);
      if (values.size === 0) {
        this.map.delete(key);
      }
    }
    forEach(key, fn) {
      const values = this.map.get(key);
      if (!values) {
        return;
      }
      values.forEach(fn);
    }
  }
  class NKeyMap {
    constructor() {
      this._data = /* @__PURE__ */ new Map();
    }
    /**
     * Sets a value on the map. Note that unlike a standard `Map`, the first argument is the value.
     * This is because the spread operator is used for the keys and must be last..
     * @param value The value to set.
     * @param keys The keys for the value.
     */
    set(value, ...keys) {
      let currentMap = this._data;
      for (let i = 0; i < keys.length - 1; i++) {
        let nextMap = currentMap.get(keys[i]);
        if (nextMap === void 0) {
          nextMap = /* @__PURE__ */ new Map();
          currentMap.set(keys[i], nextMap);
        }
        currentMap = nextMap;
      }
      currentMap.set(keys[keys.length - 1], value);
    }
    get(...keys) {
      let currentMap = this._data;
      for (let i = 0; i < keys.length - 1; i++) {
        const nextMap = currentMap.get(keys[i]);
        if (nextMap === void 0) {
          return void 0;
        }
        currentMap = nextMap;
      }
      return currentMap.get(keys[keys.length - 1]);
    }
    clear() {
      this._data.clear();
    }
    /**
     * Get a textual representation of the map for debugging purposes.
     */
    toString() {
      const printMap = (map, depth) => {
        let result = "";
        for (const [key, value] of map) {
          result += `${"  ".repeat(depth)}${key}: `;
          if (value instanceof Map) {
            result += "\n" + printMap(value, depth + 1);
          } else {
            result += `${value}
`;
          }
        }
        return result;
      };
      return printMap(this._data, 0);
    }
  }
  const DEFAULT_CHANNEL = "default";
  const INITIALIZE = "$initialize";
  let webWorkerWarningLogged = false;
  function logOnceWebWorkerWarning(err) {
    if (!isWeb) {
      return;
    }
    if (!webWorkerWarningLogged) {
      webWorkerWarningLogged = true;
      console.warn("Could not create web worker(s). Falling back to loading web worker code in main thread, which might cause UI freezes. Please see https://github.com/microsoft/monaco-editor#faq");
    }
    console.warn(err.message);
  }
  class RequestMessage {
    constructor(vsWorker, req, channel, method, args) {
      this.vsWorker = vsWorker;
      this.req = req;
      this.channel = channel;
      this.method = method;
      this.args = args;
      this.type = 0;
    }
  }
  class ReplyMessage {
    constructor(vsWorker, seq, res, err) {
      this.vsWorker = vsWorker;
      this.seq = seq;
      this.res = res;
      this.err = err;
      this.type = 1;
    }
  }
  class SubscribeEventMessage {
    constructor(vsWorker, req, channel, eventName, arg) {
      this.vsWorker = vsWorker;
      this.req = req;
      this.channel = channel;
      this.eventName = eventName;
      this.arg = arg;
      this.type = 2;
    }
  }
  class EventMessage {
    constructor(vsWorker, req, event) {
      this.vsWorker = vsWorker;
      this.req = req;
      this.event = event;
      this.type = 3;
    }
  }
  class UnsubscribeEventMessage {
    constructor(vsWorker, req) {
      this.vsWorker = vsWorker;
      this.req = req;
      this.type = 4;
    }
  }
  class WebWorkerProtocol {
    constructor(handler) {
      this._workerId = -1;
      this._handler = handler;
      this._lastSentReq = 0;
      this._pendingReplies = /* @__PURE__ */ Object.create(null);
      this._pendingEmitters = /* @__PURE__ */ new Map();
      this._pendingEvents = /* @__PURE__ */ new Map();
    }
    setWorkerId(workerId) {
      this._workerId = workerId;
    }
    async sendMessage(channel, method, args) {
      const req = String(++this._lastSentReq);
      return new Promise((resolve2, reject) => {
        this._pendingReplies[req] = {
          resolve: resolve2,
          reject
        };
        this._send(new RequestMessage(this._workerId, req, channel, method, args));
      });
    }
    listen(channel, eventName, arg) {
      let req = null;
      const emitter = new Emitter({
        onWillAddFirstListener: () => {
          req = String(++this._lastSentReq);
          this._pendingEmitters.set(req, emitter);
          this._send(new SubscribeEventMessage(this._workerId, req, channel, eventName, arg));
        },
        onDidRemoveLastListener: () => {
          this._pendingEmitters.delete(req);
          this._send(new UnsubscribeEventMessage(this._workerId, req));
          req = null;
        }
      });
      return emitter.event;
    }
    handleMessage(message) {
      if (!message || !message.vsWorker) {
        return;
      }
      if (this._workerId !== -1 && message.vsWorker !== this._workerId) {
        return;
      }
      this._handleMessage(message);
    }
    createProxyToRemoteChannel(channel, sendMessageBarrier) {
      const handler = {
        get: (target, name) => {
          if (typeof name === "string" && !target[name]) {
            if (propertyIsDynamicEvent(name)) {
              target[name] = (arg) => {
                return this.listen(channel, name, arg);
              };
            } else if (propertyIsEvent(name)) {
              target[name] = this.listen(channel, name, void 0);
            } else if (name.charCodeAt(0) === 36) {
              target[name] = async (...myArgs) => {
                await sendMessageBarrier?.();
                return this.sendMessage(channel, name, myArgs);
              };
            }
          }
          return target[name];
        }
      };
      return new Proxy(/* @__PURE__ */ Object.create(null), handler);
    }
    _handleMessage(msg) {
      switch (msg.type) {
        case 1:
          return this._handleReplyMessage(msg);
        case 0:
          return this._handleRequestMessage(msg);
        case 2:
          return this._handleSubscribeEventMessage(msg);
        case 3:
          return this._handleEventMessage(msg);
        case 4:
          return this._handleUnsubscribeEventMessage(msg);
      }
    }
    _handleReplyMessage(replyMessage) {
      if (!this._pendingReplies[replyMessage.seq]) {
        console.warn("Got reply to unknown seq");
        return;
      }
      const reply = this._pendingReplies[replyMessage.seq];
      delete this._pendingReplies[replyMessage.seq];
      if (replyMessage.err) {
        let err = replyMessage.err;
        if (replyMessage.err.$isError) {
          const newErr = new Error();
          newErr.name = replyMessage.err.name;
          newErr.message = replyMessage.err.message;
          newErr.stack = replyMessage.err.stack;
          err = newErr;
        }
        reply.reject(err);
        return;
      }
      reply.resolve(replyMessage.res);
    }
    _handleRequestMessage(requestMessage) {
      const req = requestMessage.req;
      const result = this._handler.handleMessage(requestMessage.channel, requestMessage.method, requestMessage.args);
      result.then((r) => {
        this._send(new ReplyMessage(this._workerId, req, r, void 0));
      }, (e) => {
        if (e.detail instanceof Error) {
          e.detail = transformErrorForSerialization(e.detail);
        }
        this._send(new ReplyMessage(this._workerId, req, void 0, transformErrorForSerialization(e)));
      });
    }
    _handleSubscribeEventMessage(msg) {
      const req = msg.req;
      const disposable = this._handler.handleEvent(msg.channel, msg.eventName, msg.arg)((event) => {
        this._send(new EventMessage(this._workerId, req, event));
      });
      this._pendingEvents.set(req, disposable);
    }
    _handleEventMessage(msg) {
      const emitter = this._pendingEmitters.get(msg.req);
      if (emitter === void 0) {
        console.warn("Got event for unknown req");
        return;
      }
      emitter.fire(msg.event);
    }
    _handleUnsubscribeEventMessage(msg) {
      const event = this._pendingEvents.get(msg.req);
      if (event === void 0) {
        console.warn("Got unsubscribe for unknown req");
        return;
      }
      event.dispose();
      this._pendingEvents.delete(msg.req);
    }
    _send(msg) {
      const transfer = [];
      if (msg.type === 0) {
        for (let i = 0; i < msg.args.length; i++) {
          const arg = msg.args[i];
          if (arg instanceof ArrayBuffer) {
            transfer.push(arg);
          }
        }
      } else if (msg.type === 1) {
        if (msg.res instanceof ArrayBuffer) {
          transfer.push(msg.res);
        }
      }
      this._handler.sendMessage(msg, transfer);
    }
  }
  class WebWorkerClient extends Disposable {
    constructor(worker) {
      super();
      this._localChannels = /* @__PURE__ */ new Map();
      this._worker = this._register(worker);
      this._register(this._worker.onMessage((msg) => {
        this._protocol.handleMessage(msg);
      }));
      this._register(this._worker.onError((err) => {
        logOnceWebWorkerWarning(err);
        onUnexpectedError(err);
      }));
      this._protocol = new WebWorkerProtocol({
        sendMessage: (msg, transfer) => {
          this._worker.postMessage(msg, transfer);
        },
        handleMessage: (channel, method, args) => {
          return this._handleMessage(channel, method, args);
        },
        handleEvent: (channel, eventName, arg) => {
          return this._handleEvent(channel, eventName, arg);
        }
      });
      this._protocol.setWorkerId(this._worker.getId());
      this._onModuleLoaded = this._protocol.sendMessage(DEFAULT_CHANNEL, INITIALIZE, [
        this._worker.getId()
      ]).then(() => {
      });
      this.proxy = this._protocol.createProxyToRemoteChannel(DEFAULT_CHANNEL, async () => {
        await this._onModuleLoaded;
      });
      this._onModuleLoaded.catch((e) => {
        this._onError("Worker failed to load ", e);
      });
    }
    _handleMessage(channelName, method, args) {
      const channel = this._localChannels.get(channelName);
      if (!channel) {
        return Promise.reject(new Error(`Missing channel ${channelName} on main thread`));
      }
      const fn = channel[method];
      if (typeof fn !== "function") {
        return Promise.reject(new Error(`Missing method ${method} on main thread channel ${channelName}`));
      }
      try {
        return Promise.resolve(fn.apply(channel, args));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    _handleEvent(channelName, eventName, arg) {
      const channel = this._localChannels.get(channelName);
      if (!channel) {
        throw new Error(`Missing channel ${channelName} on main thread`);
      }
      if (propertyIsDynamicEvent(eventName)) {
        const fn = channel[eventName];
        if (typeof fn !== "function") {
          throw new Error(`Missing dynamic event ${eventName} on main thread channel ${channelName}.`);
        }
        const event = fn.call(channel, arg);
        if (typeof event !== "function") {
          throw new Error(`Missing dynamic event ${eventName} on main thread channel ${channelName}.`);
        }
        return event;
      }
      if (propertyIsEvent(eventName)) {
        const event = channel[eventName];
        if (typeof event !== "function") {
          throw new Error(`Missing event ${eventName} on main thread channel ${channelName}.`);
        }
        return event;
      }
      throw new Error(`Malformed event name ${eventName}`);
    }
    setChannel(channel, handler) {
      this._localChannels.set(channel, handler);
    }
    _onError(message, error) {
      console.error(message);
      console.info(error);
    }
  }
  function propertyIsEvent(name) {
    return name[0] === "o" && name[1] === "n" && isUpperAsciiLetter(name.charCodeAt(2));
  }
  function propertyIsDynamicEvent(name) {
    return /^onDynamic/.test(name) && isUpperAsciiLetter(name.charCodeAt(9));
  }
  class WebWorkerServer {
    constructor(postMessage, requestHandlerFactory) {
      this._localChannels = /* @__PURE__ */ new Map();
      this._remoteChannels = /* @__PURE__ */ new Map();
      this._protocol = new WebWorkerProtocol({
        sendMessage: (msg, transfer) => {
          postMessage(msg, transfer);
        },
        handleMessage: (channel, method, args) => this._handleMessage(channel, method, args),
        handleEvent: (channel, eventName, arg) => this._handleEvent(channel, eventName, arg)
      });
      this.requestHandler = requestHandlerFactory(this);
    }
    onmessage(msg) {
      this._protocol.handleMessage(msg);
    }
    _handleMessage(channel, method, args) {
      if (channel === DEFAULT_CHANNEL && method === INITIALIZE) {
        return this.initialize(args[0]);
      }
      const requestHandler = channel === DEFAULT_CHANNEL ? this.requestHandler : this._localChannels.get(channel);
      if (!requestHandler) {
        return Promise.reject(new Error(`Missing channel ${channel} on worker thread`));
      }
      const fn = requestHandler[method];
      if (typeof fn !== "function") {
        return Promise.reject(new Error(`Missing method ${method} on worker thread channel ${channel}`));
      }
      try {
        return Promise.resolve(fn.apply(requestHandler, args));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    _handleEvent(channel, eventName, arg) {
      const requestHandler = channel === DEFAULT_CHANNEL ? this.requestHandler : this._localChannels.get(channel);
      if (!requestHandler) {
        throw new Error(`Missing channel ${channel} on worker thread`);
      }
      if (propertyIsDynamicEvent(eventName)) {
        const fn = requestHandler[eventName];
        if (typeof fn !== "function") {
          throw new Error(`Missing dynamic event ${eventName} on request handler.`);
        }
        const event = fn.call(requestHandler, arg);
        if (typeof event !== "function") {
          throw new Error(`Missing dynamic event ${eventName} on request handler.`);
        }
        return event;
      }
      if (propertyIsEvent(eventName)) {
        const event = requestHandler[eventName];
        if (typeof event !== "function") {
          throw new Error(`Missing event ${eventName} on request handler.`);
        }
        return event;
      }
      throw new Error(`Malformed event name ${eventName}`);
    }
    getChannel(channel) {
      let inst = this._remoteChannels.get(channel);
      if (inst === void 0) {
        inst = this._protocol.createProxyToRemoteChannel(channel);
        this._remoteChannels.set(channel, inst);
      }
      return inst;
    }
    async initialize(workerId) {
      this._protocol.setWorkerId(workerId);
    }
  }
  class DiffChange {
    /**
     * Constructs a new DiffChange with the given sequence information
     * and content.
     */
    constructor(originalStart, originalLength, modifiedStart, modifiedLength) {
      this.originalStart = originalStart;
      this.originalLength = originalLength;
      this.modifiedStart = modifiedStart;
      this.modifiedLength = modifiedLength;
    }
    /**
     * The end point (exclusive) of the change in the original sequence.
     */
    getOriginalEnd() {
      return this.originalStart + this.originalLength;
    }
    /**
     * The end point (exclusive) of the change in the modified sequence.
     */
    getModifiedEnd() {
      return this.modifiedStart + this.modifiedLength;
    }
  }
  class StringDiffSequence {
    constructor(source) {
      this.source = source;
    }
    getElements() {
      const source = this.source;
      const characters = new Int32Array(source.length);
      for (let i = 0, len = source.length; i < len; i++) {
        characters[i] = source.charCodeAt(i);
      }
      return characters;
    }
  }
  function stringDiff(original, modified, pretty) {
    return new LcsDiff(new StringDiffSequence(original), new StringDiffSequence(modified)).ComputeDiff(pretty).changes;
  }
  class Debug {
    static Assert(condition, message) {
      if (!condition) {
        throw new Error(message);
      }
    }
  }
  class MyArray {
    /**
     * Copies a range of elements from an Array starting at the specified source index and pastes
     * them to another Array starting at the specified destination index. The length and the indexes
     * are specified as 64-bit integers.
     * sourceArray:
     *		The Array that contains the data to copy.
     * sourceIndex:
     *		A 64-bit integer that represents the index in the sourceArray at which copying begins.
     * destinationArray:
     *		The Array that receives the data.
     * destinationIndex:
     *		A 64-bit integer that represents the index in the destinationArray at which storing begins.
     * length:
     *		A 64-bit integer that represents the number of elements to copy.
     */
    static Copy(sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
      for (let i = 0; i < length; i++) {
        destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
      }
    }
    static Copy2(sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
      for (let i = 0; i < length; i++) {
        destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
      }
    }
  }
  class DiffChangeHelper {
    /**
     * Constructs a new DiffChangeHelper for the given DiffSequences.
     */
    constructor() {
      this.m_changes = [];
      this.m_originalStart = 1073741824;
      this.m_modifiedStart = 1073741824;
      this.m_originalCount = 0;
      this.m_modifiedCount = 0;
    }
    /**
     * Marks the beginning of the next change in the set of differences.
     */
    MarkNextChange() {
      if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
        this.m_changes.push(new DiffChange(this.m_originalStart, this.m_originalCount, this.m_modifiedStart, this.m_modifiedCount));
      }
      this.m_originalCount = 0;
      this.m_modifiedCount = 0;
      this.m_originalStart = 1073741824;
      this.m_modifiedStart = 1073741824;
    }
    /**
     * Adds the original element at the given position to the elements
     * affected by the current change. The modified index gives context
     * to the change position with respect to the original sequence.
     * @param originalIndex The index of the original element to add.
     * @param modifiedIndex The index of the modified element that provides corresponding position in the modified sequence.
     */
    AddOriginalElement(originalIndex, modifiedIndex) {
      this.m_originalStart = Math.min(this.m_originalStart, originalIndex);
      this.m_modifiedStart = Math.min(this.m_modifiedStart, modifiedIndex);
      this.m_originalCount++;
    }
    /**
     * Adds the modified element at the given position to the elements
     * affected by the current change. The original index gives context
     * to the change position with respect to the modified sequence.
     * @param originalIndex The index of the original element that provides corresponding position in the original sequence.
     * @param modifiedIndex The index of the modified element to add.
     */
    AddModifiedElement(originalIndex, modifiedIndex) {
      this.m_originalStart = Math.min(this.m_originalStart, originalIndex);
      this.m_modifiedStart = Math.min(this.m_modifiedStart, modifiedIndex);
      this.m_modifiedCount++;
    }
    /**
     * Retrieves all of the changes marked by the class.
     */
    getChanges() {
      if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
        this.MarkNextChange();
      }
      return this.m_changes;
    }
    /**
     * Retrieves all of the changes marked by the class in the reverse order
     */
    getReverseChanges() {
      if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
        this.MarkNextChange();
      }
      this.m_changes.reverse();
      return this.m_changes;
    }
  }
  class LcsDiff {
    /**
     * Constructs the DiffFinder
     */
    constructor(originalSequence, modifiedSequence, continueProcessingPredicate = null) {
      this.ContinueProcessingPredicate = continueProcessingPredicate;
      this._originalSequence = originalSequence;
      this._modifiedSequence = modifiedSequence;
      const [originalStringElements, originalElementsOrHash, originalHasStrings] = LcsDiff._getElements(originalSequence);
      const [modifiedStringElements, modifiedElementsOrHash, modifiedHasStrings] = LcsDiff._getElements(modifiedSequence);
      this._hasStrings = originalHasStrings && modifiedHasStrings;
      this._originalStringElements = originalStringElements;
      this._originalElementsOrHash = originalElementsOrHash;
      this._modifiedStringElements = modifiedStringElements;
      this._modifiedElementsOrHash = modifiedElementsOrHash;
      this.m_forwardHistory = [];
      this.m_reverseHistory = [];
    }
    static _isStringArray(arr) {
      return arr.length > 0 && typeof arr[0] === "string";
    }
    static _getElements(sequence) {
      const elements = sequence.getElements();
      if (LcsDiff._isStringArray(elements)) {
        const hashes = new Int32Array(elements.length);
        for (let i = 0, len = elements.length; i < len; i++) {
          hashes[i] = stringHash(elements[i], 0);
        }
        return [elements, hashes, true];
      }
      if (elements instanceof Int32Array) {
        return [[], elements, false];
      }
      return [[], new Int32Array(elements), false];
    }
    ElementsAreEqual(originalIndex, newIndex) {
      if (this._originalElementsOrHash[originalIndex] !== this._modifiedElementsOrHash[newIndex]) {
        return false;
      }
      return this._hasStrings ? this._originalStringElements[originalIndex] === this._modifiedStringElements[newIndex] : true;
    }
    ElementsAreStrictEqual(originalIndex, newIndex) {
      if (!this.ElementsAreEqual(originalIndex, newIndex)) {
        return false;
      }
      const originalElement = LcsDiff._getStrictElement(this._originalSequence, originalIndex);
      const modifiedElement = LcsDiff._getStrictElement(this._modifiedSequence, newIndex);
      return originalElement === modifiedElement;
    }
    static _getStrictElement(sequence, index) {
      if (typeof sequence.getStrictElement === "function") {
        return sequence.getStrictElement(index);
      }
      return null;
    }
    OriginalElementsAreEqual(index1, index2) {
      if (this._originalElementsOrHash[index1] !== this._originalElementsOrHash[index2]) {
        return false;
      }
      return this._hasStrings ? this._originalStringElements[index1] === this._originalStringElements[index2] : true;
    }
    ModifiedElementsAreEqual(index1, index2) {
      if (this._modifiedElementsOrHash[index1] !== this._modifiedElementsOrHash[index2]) {
        return false;
      }
      return this._hasStrings ? this._modifiedStringElements[index1] === this._modifiedStringElements[index2] : true;
    }
    ComputeDiff(pretty) {
      return this._ComputeDiff(0, this._originalElementsOrHash.length - 1, 0, this._modifiedElementsOrHash.length - 1, pretty);
    }
    /**
     * Computes the differences between the original and modified input
     * sequences on the bounded range.
     * @returns An array of the differences between the two input sequences.
     */
    _ComputeDiff(originalStart, originalEnd, modifiedStart, modifiedEnd, pretty) {
      const quitEarlyArr = [false];
      let changes = this.ComputeDiffRecursive(originalStart, originalEnd, modifiedStart, modifiedEnd, quitEarlyArr);
      if (pretty) {
        changes = this.PrettifyChanges(changes);
      }
      return {
        quitEarly: quitEarlyArr[0],
        changes
      };
    }
    /**
     * Private helper method which computes the differences on the bounded range
     * recursively.
     * @returns An array of the differences between the two input sequences.
     */
    ComputeDiffRecursive(originalStart, originalEnd, modifiedStart, modifiedEnd, quitEarlyArr) {
      quitEarlyArr[0] = false;
      while (originalStart <= originalEnd && modifiedStart <= modifiedEnd && this.ElementsAreEqual(originalStart, modifiedStart)) {
        originalStart++;
        modifiedStart++;
      }
      while (originalEnd >= originalStart && modifiedEnd >= modifiedStart && this.ElementsAreEqual(originalEnd, modifiedEnd)) {
        originalEnd--;
        modifiedEnd--;
      }
      if (originalStart > originalEnd || modifiedStart > modifiedEnd) {
        let changes;
        if (modifiedStart <= modifiedEnd) {
          Debug.Assert(originalStart === originalEnd + 1, "originalStart should only be one more than originalEnd");
          changes = [
            new DiffChange(originalStart, 0, modifiedStart, modifiedEnd - modifiedStart + 1)
          ];
        } else if (originalStart <= originalEnd) {
          Debug.Assert(modifiedStart === modifiedEnd + 1, "modifiedStart should only be one more than modifiedEnd");
          changes = [
            new DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, 0)
          ];
        } else {
          Debug.Assert(originalStart === originalEnd + 1, "originalStart should only be one more than originalEnd");
          Debug.Assert(modifiedStart === modifiedEnd + 1, "modifiedStart should only be one more than modifiedEnd");
          changes = [];
        }
        return changes;
      }
      const midOriginalArr = [0];
      const midModifiedArr = [0];
      const result = this.ComputeRecursionPoint(originalStart, originalEnd, modifiedStart, modifiedEnd, midOriginalArr, midModifiedArr, quitEarlyArr);
      const midOriginal = midOriginalArr[0];
      const midModified = midModifiedArr[0];
      if (result !== null) {
        return result;
      } else if (!quitEarlyArr[0]) {
        const leftChanges = this.ComputeDiffRecursive(originalStart, midOriginal, modifiedStart, midModified, quitEarlyArr);
        let rightChanges = [];
        if (!quitEarlyArr[0]) {
          rightChanges = this.ComputeDiffRecursive(midOriginal + 1, originalEnd, midModified + 1, modifiedEnd, quitEarlyArr);
        } else {
          rightChanges = [
            new DiffChange(midOriginal + 1, originalEnd - (midOriginal + 1) + 1, midModified + 1, modifiedEnd - (midModified + 1) + 1)
          ];
        }
        return this.ConcatenateChanges(leftChanges, rightChanges);
      }
      return [
        new DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, modifiedEnd - modifiedStart + 1)
      ];
    }
    WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr) {
      let forwardChanges = null;
      let reverseChanges = null;
      let changeHelper = new DiffChangeHelper();
      let diagonalMin = diagonalForwardStart;
      let diagonalMax = diagonalForwardEnd;
      let diagonalRelative = midOriginalArr[0] - midModifiedArr[0] - diagonalForwardOffset;
      let lastOriginalIndex = -1073741824;
      let historyIndex = this.m_forwardHistory.length - 1;
      do {
        const diagonal = diagonalRelative + diagonalForwardBase;
        if (diagonal === diagonalMin || diagonal < diagonalMax && forwardPoints[diagonal - 1] < forwardPoints[diagonal + 1]) {
          originalIndex = forwardPoints[diagonal + 1];
          modifiedIndex = originalIndex - diagonalRelative - diagonalForwardOffset;
          if (originalIndex < lastOriginalIndex) {
            changeHelper.MarkNextChange();
          }
          lastOriginalIndex = originalIndex;
          changeHelper.AddModifiedElement(originalIndex + 1, modifiedIndex);
          diagonalRelative = diagonal + 1 - diagonalForwardBase;
        } else {
          originalIndex = forwardPoints[diagonal - 1] + 1;
          modifiedIndex = originalIndex - diagonalRelative - diagonalForwardOffset;
          if (originalIndex < lastOriginalIndex) {
            changeHelper.MarkNextChange();
          }
          lastOriginalIndex = originalIndex - 1;
          changeHelper.AddOriginalElement(originalIndex, modifiedIndex + 1);
          diagonalRelative = diagonal - 1 - diagonalForwardBase;
        }
        if (historyIndex >= 0) {
          forwardPoints = this.m_forwardHistory[historyIndex];
          diagonalForwardBase = forwardPoints[0];
          diagonalMin = 1;
          diagonalMax = forwardPoints.length - 1;
        }
      } while (--historyIndex >= -1);
      forwardChanges = changeHelper.getReverseChanges();
      if (quitEarlyArr[0]) {
        let originalStartPoint = midOriginalArr[0] + 1;
        let modifiedStartPoint = midModifiedArr[0] + 1;
        if (forwardChanges !== null && forwardChanges.length > 0) {
          const lastForwardChange = forwardChanges[forwardChanges.length - 1];
          originalStartPoint = Math.max(originalStartPoint, lastForwardChange.getOriginalEnd());
          modifiedStartPoint = Math.max(modifiedStartPoint, lastForwardChange.getModifiedEnd());
        }
        reverseChanges = [
          new DiffChange(originalStartPoint, originalEnd - originalStartPoint + 1, modifiedStartPoint, modifiedEnd - modifiedStartPoint + 1)
        ];
      } else {
        changeHelper = new DiffChangeHelper();
        diagonalMin = diagonalReverseStart;
        diagonalMax = diagonalReverseEnd;
        diagonalRelative = midOriginalArr[0] - midModifiedArr[0] - diagonalReverseOffset;
        lastOriginalIndex = 1073741824;
        historyIndex = deltaIsEven ? this.m_reverseHistory.length - 1 : this.m_reverseHistory.length - 2;
        do {
          const diagonal = diagonalRelative + diagonalReverseBase;
          if (diagonal === diagonalMin || diagonal < diagonalMax && reversePoints[diagonal - 1] >= reversePoints[diagonal + 1]) {
            originalIndex = reversePoints[diagonal + 1] - 1;
            modifiedIndex = originalIndex - diagonalRelative - diagonalReverseOffset;
            if (originalIndex > lastOriginalIndex) {
              changeHelper.MarkNextChange();
            }
            lastOriginalIndex = originalIndex + 1;
            changeHelper.AddOriginalElement(originalIndex + 1, modifiedIndex + 1);
            diagonalRelative = diagonal + 1 - diagonalReverseBase;
          } else {
            originalIndex = reversePoints[diagonal - 1];
            modifiedIndex = originalIndex - diagonalRelative - diagonalReverseOffset;
            if (originalIndex > lastOriginalIndex) {
              changeHelper.MarkNextChange();
            }
            lastOriginalIndex = originalIndex;
            changeHelper.AddModifiedElement(originalIndex + 1, modifiedIndex + 1);
            diagonalRelative = diagonal - 1 - diagonalReverseBase;
          }
          if (historyIndex >= 0) {
            reversePoints = this.m_reverseHistory[historyIndex];
            diagonalReverseBase = reversePoints[0];
            diagonalMin = 1;
            diagonalMax = reversePoints.length - 1;
          }
        } while (--historyIndex >= -1);
        reverseChanges = changeHelper.getChanges();
      }
      return this.ConcatenateChanges(forwardChanges, reverseChanges);
    }
    /**
     * Given the range to compute the diff on, this method finds the point:
     * (midOriginal, midModified)
     * that exists in the middle of the LCS of the two sequences and
     * is the point at which the LCS problem may be broken down recursively.
     * This method will try to keep the LCS trace in memory. If the LCS recursion
     * point is calculated and the full trace is available in memory, then this method
     * will return the change list.
     * @param originalStart The start bound of the original sequence range
     * @param originalEnd The end bound of the original sequence range
     * @param modifiedStart The start bound of the modified sequence range
     * @param modifiedEnd The end bound of the modified sequence range
     * @param midOriginal The middle point of the original sequence range
     * @param midModified The middle point of the modified sequence range
     * @returns The diff changes, if available, otherwise null
     */
    ComputeRecursionPoint(originalStart, originalEnd, modifiedStart, modifiedEnd, midOriginalArr, midModifiedArr, quitEarlyArr) {
      let originalIndex = 0, modifiedIndex = 0;
      let diagonalForwardStart = 0, diagonalForwardEnd = 0;
      let diagonalReverseStart = 0, diagonalReverseEnd = 0;
      originalStart--;
      modifiedStart--;
      midOriginalArr[0] = 0;
      midModifiedArr[0] = 0;
      this.m_forwardHistory = [];
      this.m_reverseHistory = [];
      const maxDifferences = originalEnd - originalStart + (modifiedEnd - modifiedStart);
      const numDiagonals = maxDifferences + 1;
      const forwardPoints = new Int32Array(numDiagonals);
      const reversePoints = new Int32Array(numDiagonals);
      const diagonalForwardBase = modifiedEnd - modifiedStart;
      const diagonalReverseBase = originalEnd - originalStart;
      const diagonalForwardOffset = originalStart - modifiedStart;
      const diagonalReverseOffset = originalEnd - modifiedEnd;
      const delta = diagonalReverseBase - diagonalForwardBase;
      const deltaIsEven = delta % 2 === 0;
      forwardPoints[diagonalForwardBase] = originalStart;
      reversePoints[diagonalReverseBase] = originalEnd;
      quitEarlyArr[0] = false;
      for (let numDifferences = 1; numDifferences <= maxDifferences / 2 + 1; numDifferences++) {
        let furthestOriginalIndex = 0;
        let furthestModifiedIndex = 0;
        diagonalForwardStart = this.ClipDiagonalBound(diagonalForwardBase - numDifferences, numDifferences, diagonalForwardBase, numDiagonals);
        diagonalForwardEnd = this.ClipDiagonalBound(diagonalForwardBase + numDifferences, numDifferences, diagonalForwardBase, numDiagonals);
        for (let diagonal = diagonalForwardStart; diagonal <= diagonalForwardEnd; diagonal += 2) {
          if (diagonal === diagonalForwardStart || diagonal < diagonalForwardEnd && forwardPoints[diagonal - 1] < forwardPoints[diagonal + 1]) {
            originalIndex = forwardPoints[diagonal + 1];
          } else {
            originalIndex = forwardPoints[diagonal - 1] + 1;
          }
          modifiedIndex = originalIndex - (diagonal - diagonalForwardBase) - diagonalForwardOffset;
          const tempOriginalIndex = originalIndex;
          while (originalIndex < originalEnd && modifiedIndex < modifiedEnd && this.ElementsAreEqual(originalIndex + 1, modifiedIndex + 1)) {
            originalIndex++;
            modifiedIndex++;
          }
          forwardPoints[diagonal] = originalIndex;
          if (originalIndex + modifiedIndex > furthestOriginalIndex + furthestModifiedIndex) {
            furthestOriginalIndex = originalIndex;
            furthestModifiedIndex = modifiedIndex;
          }
          if (!deltaIsEven && Math.abs(diagonal - diagonalReverseBase) <= numDifferences - 1) {
            if (originalIndex >= reversePoints[diagonal]) {
              midOriginalArr[0] = originalIndex;
              midModifiedArr[0] = modifiedIndex;
              if (tempOriginalIndex <= reversePoints[diagonal] && 1447 > 0 && numDifferences <= 1447 + 1) {
                return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
              } else {
                return null;
              }
            }
          }
        }
        const matchLengthOfLongest = (furthestOriginalIndex - originalStart + (furthestModifiedIndex - modifiedStart) - numDifferences) / 2;
        if (this.ContinueProcessingPredicate !== null && !this.ContinueProcessingPredicate(furthestOriginalIndex, matchLengthOfLongest)) {
          quitEarlyArr[0] = true;
          midOriginalArr[0] = furthestOriginalIndex;
          midModifiedArr[0] = furthestModifiedIndex;
          if (matchLengthOfLongest > 0 && 1447 > 0 && numDifferences <= 1447 + 1) {
            return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
          } else {
            originalStart++;
            modifiedStart++;
            return [
              new DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, modifiedEnd - modifiedStart + 1)
            ];
          }
        }
        diagonalReverseStart = this.ClipDiagonalBound(diagonalReverseBase - numDifferences, numDifferences, diagonalReverseBase, numDiagonals);
        diagonalReverseEnd = this.ClipDiagonalBound(diagonalReverseBase + numDifferences, numDifferences, diagonalReverseBase, numDiagonals);
        for (let diagonal = diagonalReverseStart; diagonal <= diagonalReverseEnd; diagonal += 2) {
          if (diagonal === diagonalReverseStart || diagonal < diagonalReverseEnd && reversePoints[diagonal - 1] >= reversePoints[diagonal + 1]) {
            originalIndex = reversePoints[diagonal + 1] - 1;
          } else {
            originalIndex = reversePoints[diagonal - 1];
          }
          modifiedIndex = originalIndex - (diagonal - diagonalReverseBase) - diagonalReverseOffset;
          const tempOriginalIndex = originalIndex;
          while (originalIndex > originalStart && modifiedIndex > modifiedStart && this.ElementsAreEqual(originalIndex, modifiedIndex)) {
            originalIndex--;
            modifiedIndex--;
          }
          reversePoints[diagonal] = originalIndex;
          if (deltaIsEven && Math.abs(diagonal - diagonalForwardBase) <= numDifferences) {
            if (originalIndex <= forwardPoints[diagonal]) {
              midOriginalArr[0] = originalIndex;
              midModifiedArr[0] = modifiedIndex;
              if (tempOriginalIndex >= forwardPoints[diagonal] && 1447 > 0 && numDifferences <= 1447 + 1) {
                return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
              } else {
                return null;
              }
            }
          }
        }
        if (numDifferences <= 1447) {
          let temp = new Int32Array(diagonalForwardEnd - diagonalForwardStart + 2);
          temp[0] = diagonalForwardBase - diagonalForwardStart + 1;
          MyArray.Copy2(forwardPoints, diagonalForwardStart, temp, 1, diagonalForwardEnd - diagonalForwardStart + 1);
          this.m_forwardHistory.push(temp);
          temp = new Int32Array(diagonalReverseEnd - diagonalReverseStart + 2);
          temp[0] = diagonalReverseBase - diagonalReverseStart + 1;
          MyArray.Copy2(reversePoints, diagonalReverseStart, temp, 1, diagonalReverseEnd - diagonalReverseStart + 1);
          this.m_reverseHistory.push(temp);
        }
      }
      return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
    }
    /**
     * Shifts the given changes to provide a more intuitive diff.
     * While the first element in a diff matches the first element after the diff,
     * we shift the diff down.
     *
     * @param changes The list of changes to shift
     * @returns The shifted changes
     */
    PrettifyChanges(changes) {
      for (let i = 0; i < changes.length; i++) {
        const change = changes[i];
        const originalStop = i < changes.length - 1 ? changes[i + 1].originalStart : this._originalElementsOrHash.length;
        const modifiedStop = i < changes.length - 1 ? changes[i + 1].modifiedStart : this._modifiedElementsOrHash.length;
        const checkOriginal = change.originalLength > 0;
        const checkModified = change.modifiedLength > 0;
        while (change.originalStart + change.originalLength < originalStop && change.modifiedStart + change.modifiedLength < modifiedStop && (!checkOriginal || this.OriginalElementsAreEqual(change.originalStart, change.originalStart + change.originalLength)) && (!checkModified || this.ModifiedElementsAreEqual(change.modifiedStart, change.modifiedStart + change.modifiedLength))) {
          const startStrictEqual = this.ElementsAreStrictEqual(change.originalStart, change.modifiedStart);
          const endStrictEqual = this.ElementsAreStrictEqual(change.originalStart + change.originalLength, change.modifiedStart + change.modifiedLength);
          if (endStrictEqual && !startStrictEqual) {
            break;
          }
          change.originalStart++;
          change.modifiedStart++;
        }
        const mergedChangeArr = [null];
        if (i < changes.length - 1 && this.ChangesOverlap(changes[i], changes[i + 1], mergedChangeArr)) {
          changes[i] = mergedChangeArr[0];
          changes.splice(i + 1, 1);
          i--;
          continue;
        }
      }
      for (let i = changes.length - 1; i >= 0; i--) {
        const change = changes[i];
        let originalStop = 0;
        let modifiedStop = 0;
        if (i > 0) {
          const prevChange = changes[i - 1];
          originalStop = prevChange.originalStart + prevChange.originalLength;
          modifiedStop = prevChange.modifiedStart + prevChange.modifiedLength;
        }
        const checkOriginal = change.originalLength > 0;
        const checkModified = change.modifiedLength > 0;
        let bestDelta = 0;
        let bestScore = this._boundaryScore(change.originalStart, change.originalLength, change.modifiedStart, change.modifiedLength);
        for (let delta = 1; ; delta++) {
          const originalStart = change.originalStart - delta;
          const modifiedStart = change.modifiedStart - delta;
          if (originalStart < originalStop || modifiedStart < modifiedStop) {
            break;
          }
          if (checkOriginal && !this.OriginalElementsAreEqual(originalStart, originalStart + change.originalLength)) {
            break;
          }
          if (checkModified && !this.ModifiedElementsAreEqual(modifiedStart, modifiedStart + change.modifiedLength)) {
            break;
          }
          const touchingPreviousChange = originalStart === originalStop && modifiedStart === modifiedStop;
          const score2 = (touchingPreviousChange ? 5 : 0) + this._boundaryScore(originalStart, change.originalLength, modifiedStart, change.modifiedLength);
          if (score2 > bestScore) {
            bestScore = score2;
            bestDelta = delta;
          }
        }
        change.originalStart -= bestDelta;
        change.modifiedStart -= bestDelta;
        const mergedChangeArr = [null];
        if (i > 0 && this.ChangesOverlap(changes[i - 1], changes[i], mergedChangeArr)) {
          changes[i - 1] = mergedChangeArr[0];
          changes.splice(i, 1);
          i++;
          continue;
        }
      }
      if (this._hasStrings) {
        for (let i = 1, len = changes.length; i < len; i++) {
          const aChange = changes[i - 1];
          const bChange = changes[i];
          const matchedLength = bChange.originalStart - aChange.originalStart - aChange.originalLength;
          const aOriginalStart = aChange.originalStart;
          const bOriginalEnd = bChange.originalStart + bChange.originalLength;
          const abOriginalLength = bOriginalEnd - aOriginalStart;
          const aModifiedStart = aChange.modifiedStart;
          const bModifiedEnd = bChange.modifiedStart + bChange.modifiedLength;
          const abModifiedLength = bModifiedEnd - aModifiedStart;
          if (matchedLength < 5 && abOriginalLength < 20 && abModifiedLength < 20) {
            const t = this._findBetterContiguousSequence(aOriginalStart, abOriginalLength, aModifiedStart, abModifiedLength, matchedLength);
            if (t) {
              const [originalMatchStart, modifiedMatchStart] = t;
              if (originalMatchStart !== aChange.originalStart + aChange.originalLength || modifiedMatchStart !== aChange.modifiedStart + aChange.modifiedLength) {
                aChange.originalLength = originalMatchStart - aChange.originalStart;
                aChange.modifiedLength = modifiedMatchStart - aChange.modifiedStart;
                bChange.originalStart = originalMatchStart + matchedLength;
                bChange.modifiedStart = modifiedMatchStart + matchedLength;
                bChange.originalLength = bOriginalEnd - bChange.originalStart;
                bChange.modifiedLength = bModifiedEnd - bChange.modifiedStart;
              }
            }
          }
        }
      }
      return changes;
    }
    _findBetterContiguousSequence(originalStart, originalLength, modifiedStart, modifiedLength, desiredLength) {
      if (originalLength < desiredLength || modifiedLength < desiredLength) {
        return null;
      }
      const originalMax = originalStart + originalLength - desiredLength + 1;
      const modifiedMax = modifiedStart + modifiedLength - desiredLength + 1;
      let bestScore = 0;
      let bestOriginalStart = 0;
      let bestModifiedStart = 0;
      for (let i = originalStart; i < originalMax; i++) {
        for (let j = modifiedStart; j < modifiedMax; j++) {
          const score2 = this._contiguousSequenceScore(i, j, desiredLength);
          if (score2 > 0 && score2 > bestScore) {
            bestScore = score2;
            bestOriginalStart = i;
            bestModifiedStart = j;
          }
        }
      }
      if (bestScore > 0) {
        return [bestOriginalStart, bestModifiedStart];
      }
      return null;
    }
    _contiguousSequenceScore(originalStart, modifiedStart, length) {
      let score2 = 0;
      for (let l = 0; l < length; l++) {
        if (!this.ElementsAreEqual(originalStart + l, modifiedStart + l)) {
          return 0;
        }
        score2 += this._originalStringElements[originalStart + l].length;
      }
      return score2;
    }
    _OriginalIsBoundary(index) {
      if (index <= 0 || index >= this._originalElementsOrHash.length - 1) {
        return true;
      }
      return this._hasStrings && /^\s*$/.test(this._originalStringElements[index]);
    }
    _OriginalRegionIsBoundary(originalStart, originalLength) {
      if (this._OriginalIsBoundary(originalStart) || this._OriginalIsBoundary(originalStart - 1)) {
        return true;
      }
      if (originalLength > 0) {
        const originalEnd = originalStart + originalLength;
        if (this._OriginalIsBoundary(originalEnd - 1) || this._OriginalIsBoundary(originalEnd)) {
          return true;
        }
      }
      return false;
    }
    _ModifiedIsBoundary(index) {
      if (index <= 0 || index >= this._modifiedElementsOrHash.length - 1) {
        return true;
      }
      return this._hasStrings && /^\s*$/.test(this._modifiedStringElements[index]);
    }
    _ModifiedRegionIsBoundary(modifiedStart, modifiedLength) {
      if (this._ModifiedIsBoundary(modifiedStart) || this._ModifiedIsBoundary(modifiedStart - 1)) {
        return true;
      }
      if (modifiedLength > 0) {
        const modifiedEnd = modifiedStart + modifiedLength;
        if (this._ModifiedIsBoundary(modifiedEnd - 1) || this._ModifiedIsBoundary(modifiedEnd)) {
          return true;
        }
      }
      return false;
    }
    _boundaryScore(originalStart, originalLength, modifiedStart, modifiedLength) {
      const originalScore = this._OriginalRegionIsBoundary(originalStart, originalLength) ? 1 : 0;
      const modifiedScore = this._ModifiedRegionIsBoundary(modifiedStart, modifiedLength) ? 1 : 0;
      return originalScore + modifiedScore;
    }
    /**
     * Concatenates the two input DiffChange lists and returns the resulting
     * list.
     * @param The left changes
     * @param The right changes
     * @returns The concatenated list
     */
    ConcatenateChanges(left, right) {
      const mergedChangeArr = [];
      if (left.length === 0 || right.length === 0) {
        return right.length > 0 ? right : left;
      } else if (this.ChangesOverlap(left[left.length - 1], right[0], mergedChangeArr)) {
        const result = new Array(left.length + right.length - 1);
        MyArray.Copy(left, 0, result, 0, left.length - 1);
        result[left.length - 1] = mergedChangeArr[0];
        MyArray.Copy(right, 1, result, left.length, right.length - 1);
        return result;
      } else {
        const result = new Array(left.length + right.length);
        MyArray.Copy(left, 0, result, 0, left.length);
        MyArray.Copy(right, 0, result, left.length, right.length);
        return result;
      }
    }
    /**
     * Returns true if the two changes overlap and can be merged into a single
     * change
     * @param left The left change
     * @param right The right change
     * @param mergedChange The merged change if the two overlap, null otherwise
     * @returns True if the two changes overlap
     */
    ChangesOverlap(left, right, mergedChangeArr) {
      Debug.Assert(left.originalStart <= right.originalStart, "Left change is not less than or equal to right change");
      Debug.Assert(left.modifiedStart <= right.modifiedStart, "Left change is not less than or equal to right change");
      if (left.originalStart + left.originalLength >= right.originalStart || left.modifiedStart + left.modifiedLength >= right.modifiedStart) {
        const originalStart = left.originalStart;
        let originalLength = left.originalLength;
        const modifiedStart = left.modifiedStart;
        let modifiedLength = left.modifiedLength;
        if (left.originalStart + left.originalLength >= right.originalStart) {
          originalLength = right.originalStart + right.originalLength - left.originalStart;
        }
        if (left.modifiedStart + left.modifiedLength >= right.modifiedStart) {
          modifiedLength = right.modifiedStart + right.modifiedLength - left.modifiedStart;
        }
        mergedChangeArr[0] = new DiffChange(originalStart, originalLength, modifiedStart, modifiedLength);
        return true;
      } else {
        mergedChangeArr[0] = null;
        return false;
      }
    }
    /**
     * Helper method used to clip a diagonal index to the range of valid
     * diagonals. This also decides whether or not the diagonal index,
     * if it exceeds the boundary, should be clipped to the boundary or clipped
     * one inside the boundary depending on the Even/Odd status of the boundary
     * and numDifferences.
     * @param diagonal The index of the diagonal to clip.
     * @param numDifferences The current number of differences being iterated upon.
     * @param diagonalBaseIndex The base reference diagonal.
     * @param numDiagonals The total number of diagonals.
     * @returns The clipped diagonal index.
     */
    ClipDiagonalBound(diagonal, numDifferences, diagonalBaseIndex, numDiagonals) {
      if (diagonal >= 0 && diagonal < numDiagonals) {
        return diagonal;
      }
      const diagonalsBelow = diagonalBaseIndex;
      const diagonalsAbove = numDiagonals - diagonalBaseIndex - 1;
      const diffEven = numDifferences % 2 === 0;
      if (diagonal < 0) {
        const lowerBoundEven = diagonalsBelow % 2 === 0;
        return diffEven === lowerBoundEven ? 0 : 1;
      } else {
        const upperBoundEven = diagonalsAbove % 2 === 0;
        return diffEven === upperBoundEven ? numDiagonals - 1 : numDiagonals - 2;
      }
    }
  }
  function toUint8(v) {
    if (v < 0) {
      return 0;
    }
    if (v > 255) {
      return 255;
    }
    return v | 0;
  }
  function toUint32(v) {
    if (v < 0) {
      return 0;
    }
    if (v > 4294967295) {
      return 4294967295;
    }
    return v | 0;
  }
  class CharacterClassifier {
    constructor(_defaultValue) {
      const defaultValue = toUint8(_defaultValue);
      this._defaultValue = defaultValue;
      this._asciiMap = CharacterClassifier._createAsciiMap(defaultValue);
      this._map = /* @__PURE__ */ new Map();
    }
    static _createAsciiMap(defaultValue) {
      const asciiMap = new Uint8Array(256);
      asciiMap.fill(defaultValue);
      return asciiMap;
    }
    set(charCode, _value) {
      const value = toUint8(_value);
      if (charCode >= 0 && charCode < 256) {
        this._asciiMap[charCode] = value;
      } else {
        this._map.set(charCode, value);
      }
    }
    get(charCode) {
      if (charCode >= 0 && charCode < 256) {
        return this._asciiMap[charCode];
      } else {
        return this._map.get(charCode) || this._defaultValue;
      }
    }
    clear() {
      this._asciiMap.fill(this._defaultValue);
      this._map.clear();
    }
  }
  class CharacterSet {
    constructor() {
      this._actual = new CharacterClassifier(
        0
        /* Boolean.False */
      );
    }
    add(charCode) {
      this._actual.set(
        charCode,
        1
        /* Boolean.True */
      );
    }
    has(charCode) {
      return this._actual.get(charCode) === 1;
    }
    clear() {
      return this._actual.clear();
    }
  }
  class Uint8Matrix {
    constructor(rows, cols, defaultValue) {
      const data = new Uint8Array(rows * cols);
      for (let i = 0, len = rows * cols; i < len; i++) {
        data[i] = defaultValue;
      }
      this._data = data;
      this.rows = rows;
      this.cols = cols;
    }
    get(row, col) {
      return this._data[row * this.cols + col];
    }
    set(row, col, value) {
      this._data[row * this.cols + col] = value;
    }
  }
  class StateMachine {
    constructor(edges) {
      let maxCharCode = 0;
      let maxState = 0;
      for (let i = 0, len = edges.length; i < len; i++) {
        const [from, chCode, to] = edges[i];
        if (chCode > maxCharCode) {
          maxCharCode = chCode;
        }
        if (from > maxState) {
          maxState = from;
        }
        if (to > maxState) {
          maxState = to;
        }
      }
      maxCharCode++;
      maxState++;
      const states = new Uint8Matrix(
        maxState,
        maxCharCode,
        0
        /* State.Invalid */
      );
      for (let i = 0, len = edges.length; i < len; i++) {
        const [from, chCode, to] = edges[i];
        states.set(from, chCode, to);
      }
      this._states = states;
      this._maxCharCode = maxCharCode;
    }
    nextState(currentState, chCode) {
      if (chCode < 0 || chCode >= this._maxCharCode) {
        return 0;
      }
      return this._states.get(currentState, chCode);
    }
  }
  let _stateMachine = null;
  function getStateMachine() {
    if (_stateMachine === null) {
      _stateMachine = new StateMachine([
        [
          1,
          104,
          2
          /* State.H */
        ],
        [
          1,
          72,
          2
          /* State.H */
        ],
        [
          1,
          102,
          6
          /* State.F */
        ],
        [
          1,
          70,
          6
          /* State.F */
        ],
        [
          2,
          116,
          3
          /* State.HT */
        ],
        [
          2,
          84,
          3
          /* State.HT */
        ],
        [
          3,
          116,
          4
          /* State.HTT */
        ],
        [
          3,
          84,
          4
          /* State.HTT */
        ],
        [
          4,
          112,
          5
          /* State.HTTP */
        ],
        [
          4,
          80,
          5
          /* State.HTTP */
        ],
        [
          5,
          115,
          9
          /* State.BeforeColon */
        ],
        [
          5,
          83,
          9
          /* State.BeforeColon */
        ],
        [
          5,
          58,
          10
          /* State.AfterColon */
        ],
        [
          6,
          105,
          7
          /* State.FI */
        ],
        [
          6,
          73,
          7
          /* State.FI */
        ],
        [
          7,
          108,
          8
          /* State.FIL */
        ],
        [
          7,
          76,
          8
          /* State.FIL */
        ],
        [
          8,
          101,
          9
          /* State.BeforeColon */
        ],
        [
          8,
          69,
          9
          /* State.BeforeColon */
        ],
        [
          9,
          58,
          10
          /* State.AfterColon */
        ],
        [
          10,
          47,
          11
          /* State.AlmostThere */
        ],
        [
          11,
          47,
          12
          /* State.End */
        ]
      ]);
    }
    return _stateMachine;
  }
  let _classifier = null;
  function getClassifier() {
    if (_classifier === null) {
      _classifier = new CharacterClassifier(
        0
        /* CharacterClass.None */
      );
      const FORCE_TERMINATION_CHARACTERS = ` 	<>'"、。｡､，．：；‘〈「『〔（［｛｢｣｝］）〕』」〉’｀～…|`;
      for (let i = 0; i < FORCE_TERMINATION_CHARACTERS.length; i++) {
        _classifier.set(
          FORCE_TERMINATION_CHARACTERS.charCodeAt(i),
          1
          /* CharacterClass.ForceTermination */
        );
      }
      const CANNOT_END_WITH_CHARACTERS = ".,;:";
      for (let i = 0; i < CANNOT_END_WITH_CHARACTERS.length; i++) {
        _classifier.set(
          CANNOT_END_WITH_CHARACTERS.charCodeAt(i),
          2
          /* CharacterClass.CannotEndIn */
        );
      }
    }
    return _classifier;
  }
  class LinkComputer {
    static _createLink(classifier, line, lineNumber, linkBeginIndex, linkEndIndex) {
      let lastIncludedCharIndex = linkEndIndex - 1;
      do {
        const chCode = line.charCodeAt(lastIncludedCharIndex);
        const chClass = classifier.get(chCode);
        if (chClass !== 2) {
          break;
        }
        lastIncludedCharIndex--;
      } while (lastIncludedCharIndex > linkBeginIndex);
      if (linkBeginIndex > 0) {
        const charCodeBeforeLink = line.charCodeAt(linkBeginIndex - 1);
        const lastCharCodeInLink = line.charCodeAt(lastIncludedCharIndex);
        if (charCodeBeforeLink === 40 && lastCharCodeInLink === 41 || charCodeBeforeLink === 91 && lastCharCodeInLink === 93 || charCodeBeforeLink === 123 && lastCharCodeInLink === 125) {
          lastIncludedCharIndex--;
        }
      }
      return {
        range: {
          startLineNumber: lineNumber,
          startColumn: linkBeginIndex + 1,
          endLineNumber: lineNumber,
          endColumn: lastIncludedCharIndex + 2
        },
        url: line.substring(linkBeginIndex, lastIncludedCharIndex + 1)
      };
    }
    static computeLinks(model, stateMachine = getStateMachine()) {
      const classifier = getClassifier();
      const result = [];
      for (let i = 1, lineCount = model.getLineCount(); i <= lineCount; i++) {
        const line = model.getLineContent(i);
        const len = line.length;
        let j = 0;
        let linkBeginIndex = 0;
        let linkBeginChCode = 0;
        let state = 1;
        let hasOpenParens = false;
        let hasOpenSquareBracket = false;
        let inSquareBrackets = false;
        let hasOpenCurlyBracket = false;
        while (j < len) {
          let resetStateMachine = false;
          const chCode = line.charCodeAt(j);
          if (state === 13) {
            let chClass;
            switch (chCode) {
              case 40:
                hasOpenParens = true;
                chClass = 0;
                break;
              case 41:
                chClass = hasOpenParens ? 0 : 1;
                break;
              case 91:
                inSquareBrackets = true;
                hasOpenSquareBracket = true;
                chClass = 0;
                break;
              case 93:
                inSquareBrackets = false;
                chClass = hasOpenSquareBracket ? 0 : 1;
                break;
              case 123:
                hasOpenCurlyBracket = true;
                chClass = 0;
                break;
              case 125:
                chClass = hasOpenCurlyBracket ? 0 : 1;
                break;
              // The following three rules make it that ' or " or ` are allowed inside links
              // only if the link is wrapped by some other quote character
              case 39:
              case 34:
              case 96:
                if (linkBeginChCode === chCode) {
                  chClass = 1;
                } else if (linkBeginChCode === 39 || linkBeginChCode === 34 || linkBeginChCode === 96) {
                  chClass = 0;
                } else {
                  chClass = 1;
                }
                break;
              case 42:
                chClass = linkBeginChCode === 42 ? 1 : 0;
                break;
              case 32:
                chClass = inSquareBrackets ? 0 : 1;
                break;
              default:
                chClass = classifier.get(chCode);
            }
            if (chClass === 1) {
              result.push(LinkComputer._createLink(classifier, line, i, linkBeginIndex, j));
              resetStateMachine = true;
            }
          } else if (state === 12) {
            let chClass;
            if (chCode === 91) {
              hasOpenSquareBracket = true;
              chClass = 0;
            } else {
              chClass = classifier.get(chCode);
            }
            if (chClass === 1) {
              resetStateMachine = true;
            } else {
              state = 13;
            }
          } else {
            state = stateMachine.nextState(state, chCode);
            if (state === 0) {
              resetStateMachine = true;
            }
          }
          if (resetStateMachine) {
            state = 1;
            hasOpenParens = false;
            hasOpenSquareBracket = false;
            hasOpenCurlyBracket = false;
            linkBeginIndex = j + 1;
            linkBeginChCode = chCode;
          }
          j++;
        }
        if (state === 13) {
          result.push(LinkComputer._createLink(classifier, line, i, linkBeginIndex, len));
        }
      }
      return result;
    }
  }
  function computeLinks(model) {
    if (!model || typeof model.getLineCount !== "function" || typeof model.getLineContent !== "function") {
      return [];
    }
    return LinkComputer.computeLinks(model);
  }
  const _BasicInplaceReplace = class _BasicInplaceReplace {
    constructor() {
      this._defaultValueSet = [
        ["true", "false"],
        ["True", "False"],
        ["Private", "Public", "Friend", "ReadOnly", "Partial", "Protected", "WriteOnly"],
        ["public", "protected", "private"]
      ];
    }
    navigateValueSet(range1, text1, range2, text2, up) {
      if (range1 && text1) {
        const result = this.doNavigateValueSet(text1, up);
        if (result) {
          return {
            range: range1,
            value: result
          };
        }
      }
      if (range2 && text2) {
        const result = this.doNavigateValueSet(text2, up);
        if (result) {
          return {
            range: range2,
            value: result
          };
        }
      }
      return null;
    }
    doNavigateValueSet(text, up) {
      const numberResult = this.numberReplace(text, up);
      if (numberResult !== null) {
        return numberResult;
      }
      return this.textReplace(text, up);
    }
    numberReplace(value, up) {
      const precision = Math.pow(10, value.length - (value.lastIndexOf(".") + 1));
      let n1 = Number(value);
      const n2 = parseFloat(value);
      if (!isNaN(n1) && !isNaN(n2) && n1 === n2) {
        if (n1 === 0 && !up) {
          return null;
        } else {
          n1 = Math.floor(n1 * precision);
          n1 += up ? precision : -precision;
          return String(n1 / precision);
        }
      }
      return null;
    }
    textReplace(value, up) {
      return this.valueSetsReplace(this._defaultValueSet, value, up);
    }
    valueSetsReplace(valueSets, value, up) {
      let result = null;
      for (let i = 0, len = valueSets.length; result === null && i < len; i++) {
        result = this.valueSetReplace(valueSets[i], value, up);
      }
      return result;
    }
    valueSetReplace(valueSet, value, up) {
      let idx = valueSet.indexOf(value);
      if (idx >= 0) {
        idx += up ? 1 : -1;
        if (idx < 0) {
          idx = valueSet.length - 1;
        } else {
          idx %= valueSet.length;
        }
        return valueSet[idx];
      }
      return null;
    }
  };
  _BasicInplaceReplace.INSTANCE = new _BasicInplaceReplace();
  let BasicInplaceReplace = _BasicInplaceReplace;
  const safeIntl = {
    DateTimeFormat(locales, options) {
      return new Lazy(() => {
        try {
          return new Intl.DateTimeFormat(locales, options);
        } catch {
          return new Intl.DateTimeFormat(void 0, options);
        }
      });
    },
    Collator(locales, options) {
      return new Lazy(() => {
        try {
          return new Intl.Collator(locales, options);
        } catch {
          return new Intl.Collator(void 0, options);
        }
      });
    },
    Segmenter(locales, options) {
      return new Lazy(() => {
        try {
          return new Intl.Segmenter(locales, options);
        } catch {
          return new Intl.Segmenter(void 0, options);
        }
      });
    },
    Locale(tag, options) {
      return new Lazy(() => {
        try {
          return new Intl.Locale(tag, options);
        } catch {
          return new Intl.Locale(LANGUAGE_DEFAULT, options);
        }
      });
    },
    NumberFormat(locales, options) {
      return new Lazy(() => {
        try {
          return new Intl.NumberFormat(locales, options);
        } catch {
          return new Intl.NumberFormat(void 0, options);
        }
      });
    }
  };
  class WordCharacterClassifier extends CharacterClassifier {
    constructor(wordSeparators, intlSegmenterLocales) {
      super(
        0
        /* WordCharacterClass.Regular */
      );
      this._segmenter = null;
      this._cachedLine = null;
      this._cachedSegments = [];
      this.intlSegmenterLocales = intlSegmenterLocales;
      if (this.intlSegmenterLocales.length > 0) {
        this._segmenter = safeIntl.Segmenter(this.intlSegmenterLocales, { granularity: "word" });
      } else {
        this._segmenter = null;
      }
      for (let i = 0, len = wordSeparators.length; i < len; i++) {
        this.set(
          wordSeparators.charCodeAt(i),
          2
          /* WordCharacterClass.WordSeparator */
        );
      }
      this.set(
        32,
        1
        /* WordCharacterClass.Whitespace */
      );
      this.set(
        9,
        1
        /* WordCharacterClass.Whitespace */
      );
    }
    findPrevIntlWordBeforeOrAtOffset(line, offset) {
      let candidate = null;
      for (const segment of this._getIntlSegmenterWordsOnLine(line)) {
        if (segment.index > offset) {
          break;
        }
        candidate = segment;
      }
      return candidate;
    }
    findNextIntlWordAtOrAfterOffset(lineContent, offset) {
      for (const segment of this._getIntlSegmenterWordsOnLine(lineContent)) {
        if (segment.index < offset) {
          continue;
        }
        return segment;
      }
      return null;
    }
    _getIntlSegmenterWordsOnLine(line) {
      if (!this._segmenter) {
        return [];
      }
      if (this._cachedLine === line) {
        return this._cachedSegments;
      }
      this._cachedLine = line;
      this._cachedSegments = this._filterWordSegments(this._segmenter.value.segment(line));
      return this._cachedSegments;
    }
    _filterWordSegments(segments) {
      const result = [];
      for (const segment of segments) {
        if (this._isWordLike(segment)) {
          result.push(segment);
        }
      }
      return result;
    }
    _isWordLike(segment) {
      if (segment.isWordLike) {
        return true;
      }
      return false;
    }
  }
  const wordClassifierCache = new LRUCache(10);
  function getMapForWordSeparators(wordSeparators, intlSegmenterLocales) {
    const key = `${wordSeparators}/${intlSegmenterLocales.join(",")}`;
    let result = wordClassifierCache.get(key);
    if (!result) {
      result = new WordCharacterClassifier(wordSeparators, intlSegmenterLocales);
      wordClassifierCache.set(key, result);
    }
    return result;
  }
  exports.OverviewRulerLane = void 0;
  (function(OverviewRulerLane) {
    OverviewRulerLane[OverviewRulerLane["Left"] = 1] = "Left";
    OverviewRulerLane[OverviewRulerLane["Center"] = 2] = "Center";
    OverviewRulerLane[OverviewRulerLane["Right"] = 4] = "Right";
    OverviewRulerLane[OverviewRulerLane["Full"] = 7] = "Full";
  })(exports.OverviewRulerLane || (exports.OverviewRulerLane = {}));
  exports.GlyphMarginLane = void 0;
  (function(GlyphMarginLane) {
    GlyphMarginLane[GlyphMarginLane["Left"] = 1] = "Left";
    GlyphMarginLane[GlyphMarginLane["Center"] = 2] = "Center";
    GlyphMarginLane[GlyphMarginLane["Right"] = 3] = "Right";
  })(exports.GlyphMarginLane || (exports.GlyphMarginLane = {}));
  exports.TextDirection = void 0;
  (function(TextDirection) {
    TextDirection[TextDirection["LTR"] = 0] = "LTR";
    TextDirection[TextDirection["RTL"] = 1] = "RTL";
  })(exports.TextDirection || (exports.TextDirection = {}));
  exports.InjectedTextCursorStops = void 0;
  (function(InjectedTextCursorStops) {
    InjectedTextCursorStops[InjectedTextCursorStops["Both"] = 0] = "Both";
    InjectedTextCursorStops[InjectedTextCursorStops["Right"] = 1] = "Right";
    InjectedTextCursorStops[InjectedTextCursorStops["Left"] = 2] = "Left";
    InjectedTextCursorStops[InjectedTextCursorStops["None"] = 3] = "None";
  })(exports.InjectedTextCursorStops || (exports.InjectedTextCursorStops = {}));
  class TextModelResolvedOptions {
    get originalIndentSize() {
      return this._indentSizeIsTabSize ? "tabSize" : this.indentSize;
    }
    /**
     * @internal
     */
    constructor(src) {
      this._textModelResolvedOptionsBrand = void 0;
      this.tabSize = Math.max(1, src.tabSize | 0);
      if (src.indentSize === "tabSize") {
        this.indentSize = this.tabSize;
        this._indentSizeIsTabSize = true;
      } else {
        this.indentSize = Math.max(1, src.indentSize | 0);
        this._indentSizeIsTabSize = false;
      }
      this.insertSpaces = Boolean(src.insertSpaces);
      this.defaultEOL = src.defaultEOL | 0;
      this.trimAutoWhitespace = Boolean(src.trimAutoWhitespace);
      this.bracketPairColorizationOptions = src.bracketPairColorizationOptions;
    }
    /**
     * @internal
     */
    equals(other) {
      return this.tabSize === other.tabSize && this._indentSizeIsTabSize === other._indentSizeIsTabSize && this.indentSize === other.indentSize && this.insertSpaces === other.insertSpaces && this.defaultEOL === other.defaultEOL && this.trimAutoWhitespace === other.trimAutoWhitespace && equals$1(this.bracketPairColorizationOptions, other.bracketPairColorizationOptions);
    }
    /**
     * @internal
     */
    createChangeEvent(newOpts) {
      return {
        tabSize: this.tabSize !== newOpts.tabSize,
        indentSize: this.indentSize !== newOpts.indentSize,
        insertSpaces: this.insertSpaces !== newOpts.insertSpaces,
        trimAutoWhitespace: this.trimAutoWhitespace !== newOpts.trimAutoWhitespace
      };
    }
  }
  class FindMatch {
    /**
     * @internal
     */
    constructor(range2, matches) {
      this._findMatchBrand = void 0;
      this.range = range2;
      this.matches = matches;
    }
  }
  function isITextSnapshot(obj) {
    return !!obj && typeof obj.read === "function";
  }
  class ValidAnnotatedEditOperation {
    constructor(identifier, range2, text, forceMoveMarkers, isAutoWhitespaceEdit, _isTracked) {
      this.identifier = identifier;
      this.range = range2;
      this.text = text;
      this.forceMoveMarkers = forceMoveMarkers;
      this.isAutoWhitespaceEdit = isAutoWhitespaceEdit;
      this._isTracked = _isTracked;
    }
  }
  class SearchData {
    constructor(regex, wordSeparators, simpleSearch) {
      this.regex = regex;
      this.wordSeparators = wordSeparators;
      this.simpleSearch = simpleSearch;
    }
  }
  class ApplyEditsResult {
    constructor(reverseEdits, changes, trimAutoWhitespaceLineNumbers) {
      this.reverseEdits = reverseEdits;
      this.changes = changes;
      this.trimAutoWhitespaceLineNumbers = trimAutoWhitespaceLineNumbers;
    }
  }
  function shouldSynchronizeModel(model) {
    return !model.isTooLargeForSyncing() && !model.isForSimpleWidget;
  }
  const LIMIT_FIND_COUNT = 999;
  class SearchParams {
    constructor(searchString, isRegex, matchCase, wordSeparators) {
      this.searchString = searchString;
      this.isRegex = isRegex;
      this.matchCase = matchCase;
      this.wordSeparators = wordSeparators;
    }
    parseSearchRequest() {
      if (this.searchString === "") {
        return null;
      }
      let multiline;
      if (this.isRegex) {
        multiline = isMultilineRegexSource(this.searchString);
      } else {
        multiline = this.searchString.indexOf("\n") >= 0;
      }
      let regex = null;
      try {
        regex = createRegExp(this.searchString, this.isRegex, {
          matchCase: this.matchCase,
          wholeWord: false,
          multiline,
          global: true,
          unicode: true
        });
      } catch (err) {
        return null;
      }
      if (!regex) {
        return null;
      }
      let canUseSimpleSearch = !this.isRegex && !multiline;
      if (canUseSimpleSearch && this.searchString.toLowerCase() !== this.searchString.toUpperCase()) {
        canUseSimpleSearch = this.matchCase;
      }
      return new SearchData(regex, this.wordSeparators ? getMapForWordSeparators(this.wordSeparators, []) : null, canUseSimpleSearch ? this.searchString : null);
    }
  }
  function isMultilineRegexSource(searchString) {
    if (!searchString || searchString.length === 0) {
      return false;
    }
    for (let i = 0, len = searchString.length; i < len; i++) {
      const chCode = searchString.charCodeAt(i);
      if (chCode === 10) {
        return true;
      }
      if (chCode === 92) {
        i++;
        if (i >= len) {
          break;
        }
        const nextChCode = searchString.charCodeAt(i);
        if (nextChCode === 110 || nextChCode === 114 || nextChCode === 87) {
          return true;
        }
      }
    }
    return false;
  }
  function createFindMatch(range2, rawMatches, captureMatches) {
    if (!captureMatches) {
      return new FindMatch(range2, null);
    }
    const matches = [];
    for (let i = 0, len = rawMatches.length; i < len; i++) {
      matches[i] = rawMatches[i];
    }
    return new FindMatch(range2, matches);
  }
  class LineFeedCounter {
    constructor(text) {
      const lineFeedsOffsets = [];
      let lineFeedsOffsetsLen = 0;
      for (let i = 0, textLen = text.length; i < textLen; i++) {
        if (text.charCodeAt(i) === 10) {
          lineFeedsOffsets[lineFeedsOffsetsLen++] = i;
        }
      }
      this._lineFeedsOffsets = lineFeedsOffsets;
    }
    findLineFeedCountBeforeOffset(offset) {
      const lineFeedsOffsets = this._lineFeedsOffsets;
      let min = 0;
      let max = lineFeedsOffsets.length - 1;
      if (max === -1) {
        return 0;
      }
      if (offset <= lineFeedsOffsets[0]) {
        return 0;
      }
      while (min < max) {
        const mid = min + ((max - min) / 2 >> 0);
        if (lineFeedsOffsets[mid] >= offset) {
          max = mid - 1;
        } else {
          if (lineFeedsOffsets[mid + 1] >= offset) {
            min = mid;
            max = mid;
          } else {
            min = mid + 1;
          }
        }
      }
      return min + 1;
    }
  }
  class TextModelSearch {
    static findMatches(model, searchParams, searchRange, captureMatches, limitResultCount) {
      const searchData = searchParams.parseSearchRequest();
      if (!searchData) {
        return [];
      }
      if (searchData.regex.multiline) {
        return this._doFindMatchesMultiline(model, searchRange, new Searcher(searchData.wordSeparators, searchData.regex), captureMatches, limitResultCount);
      }
      return this._doFindMatchesLineByLine(model, searchRange, searchData, captureMatches, limitResultCount);
    }
    /**
     * Multiline search always executes on the lines concatenated with \n.
     * We must therefore compensate for the count of \n in case the model is CRLF
     */
    static _getMultilineMatchRange(model, deltaOffset, text, lfCounter, matchIndex, match0) {
      let startOffset;
      let lineFeedCountBeforeMatch = 0;
      if (lfCounter) {
        lineFeedCountBeforeMatch = lfCounter.findLineFeedCountBeforeOffset(matchIndex);
        startOffset = deltaOffset + matchIndex + lineFeedCountBeforeMatch;
      } else {
        startOffset = deltaOffset + matchIndex;
      }
      let endOffset;
      if (lfCounter) {
        const lineFeedCountBeforeEndOfMatch = lfCounter.findLineFeedCountBeforeOffset(matchIndex + match0.length);
        const lineFeedCountInMatch = lineFeedCountBeforeEndOfMatch - lineFeedCountBeforeMatch;
        endOffset = startOffset + match0.length + lineFeedCountInMatch;
      } else {
        endOffset = startOffset + match0.length;
      }
      const startPosition = model.getPositionAt(startOffset);
      const endPosition = model.getPositionAt(endOffset);
      return new Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
    }
    static _doFindMatchesMultiline(model, searchRange, searcher, captureMatches, limitResultCount) {
      const deltaOffset = model.getOffsetAt(searchRange.getStartPosition());
      const text = model.getValueInRange(
        searchRange,
        1
        /* EndOfLinePreference.LF */
      );
      const lfCounter = model.getEOL() === "\r\n" ? new LineFeedCounter(text) : null;
      const result = [];
      let counter = 0;
      let m;
      searcher.reset(0);
      while (m = searcher.next(text)) {
        result[counter++] = createFindMatch(this._getMultilineMatchRange(model, deltaOffset, text, lfCounter, m.index, m[0]), m, captureMatches);
        if (counter >= limitResultCount) {
          return result;
        }
      }
      return result;
    }
    static _doFindMatchesLineByLine(model, searchRange, searchData, captureMatches, limitResultCount) {
      const result = [];
      let resultLen = 0;
      if (searchRange.startLineNumber === searchRange.endLineNumber) {
        const text2 = model.getLineContent(searchRange.startLineNumber).substring(searchRange.startColumn - 1, searchRange.endColumn - 1);
        resultLen = this._findMatchesInLine(searchData, text2, searchRange.startLineNumber, searchRange.startColumn - 1, resultLen, result, captureMatches, limitResultCount);
        return result;
      }
      const text = model.getLineContent(searchRange.startLineNumber).substring(searchRange.startColumn - 1);
      resultLen = this._findMatchesInLine(searchData, text, searchRange.startLineNumber, searchRange.startColumn - 1, resultLen, result, captureMatches, limitResultCount);
      for (let lineNumber = searchRange.startLineNumber + 1; lineNumber < searchRange.endLineNumber && resultLen < limitResultCount; lineNumber++) {
        resultLen = this._findMatchesInLine(searchData, model.getLineContent(lineNumber), lineNumber, 0, resultLen, result, captureMatches, limitResultCount);
      }
      if (resultLen < limitResultCount) {
        const text2 = model.getLineContent(searchRange.endLineNumber).substring(0, searchRange.endColumn - 1);
        resultLen = this._findMatchesInLine(searchData, text2, searchRange.endLineNumber, 0, resultLen, result, captureMatches, limitResultCount);
      }
      return result;
    }
    static _findMatchesInLine(searchData, text, lineNumber, deltaOffset, resultLen, result, captureMatches, limitResultCount) {
      const wordSeparators = searchData.wordSeparators;
      if (!captureMatches && searchData.simpleSearch) {
        const searchString = searchData.simpleSearch;
        const searchStringLen = searchString.length;
        const textLength = text.length;
        let lastMatchIndex = -searchStringLen;
        while ((lastMatchIndex = text.indexOf(searchString, lastMatchIndex + searchStringLen)) !== -1) {
          if (!wordSeparators || isValidMatch(wordSeparators, text, textLength, lastMatchIndex, searchStringLen)) {
            result[resultLen++] = new FindMatch(new Range(lineNumber, lastMatchIndex + 1 + deltaOffset, lineNumber, lastMatchIndex + 1 + searchStringLen + deltaOffset), null);
            if (resultLen >= limitResultCount) {
              return resultLen;
            }
          }
        }
        return resultLen;
      }
      const searcher = new Searcher(searchData.wordSeparators, searchData.regex);
      let m;
      searcher.reset(0);
      do {
        m = searcher.next(text);
        if (m) {
          result[resultLen++] = createFindMatch(new Range(lineNumber, m.index + 1 + deltaOffset, lineNumber, m.index + 1 + m[0].length + deltaOffset), m, captureMatches);
          if (resultLen >= limitResultCount) {
            return resultLen;
          }
        }
      } while (m);
      return resultLen;
    }
    static findNextMatch(model, searchParams, searchStart, captureMatches) {
      const searchData = searchParams.parseSearchRequest();
      if (!searchData) {
        return null;
      }
      const searcher = new Searcher(searchData.wordSeparators, searchData.regex);
      if (searchData.regex.multiline) {
        return this._doFindNextMatchMultiline(model, searchStart, searcher, captureMatches);
      }
      return this._doFindNextMatchLineByLine(model, searchStart, searcher, captureMatches);
    }
    static _doFindNextMatchMultiline(model, searchStart, searcher, captureMatches) {
      const searchTextStart = new Position(searchStart.lineNumber, 1);
      const deltaOffset = model.getOffsetAt(searchTextStart);
      const lineCount = model.getLineCount();
      const text = model.getValueInRange(
        new Range(searchTextStart.lineNumber, searchTextStart.column, lineCount, model.getLineMaxColumn(lineCount)),
        1
        /* EndOfLinePreference.LF */
      );
      const lfCounter = model.getEOL() === "\r\n" ? new LineFeedCounter(text) : null;
      searcher.reset(searchStart.column - 1);
      const m = searcher.next(text);
      if (m) {
        return createFindMatch(this._getMultilineMatchRange(model, deltaOffset, text, lfCounter, m.index, m[0]), m, captureMatches);
      }
      if (searchStart.lineNumber !== 1 || searchStart.column !== 1) {
        return this._doFindNextMatchMultiline(model, new Position(1, 1), searcher, captureMatches);
      }
      return null;
    }
    static _doFindNextMatchLineByLine(model, searchStart, searcher, captureMatches) {
      const lineCount = model.getLineCount();
      const startLineNumber = searchStart.lineNumber;
      const text = model.getLineContent(startLineNumber);
      const r = this._findFirstMatchInLine(searcher, text, startLineNumber, searchStart.column, captureMatches);
      if (r) {
        return r;
      }
      for (let i = 1; i <= lineCount; i++) {
        const lineIndex = (startLineNumber + i - 1) % lineCount;
        const text2 = model.getLineContent(lineIndex + 1);
        const r2 = this._findFirstMatchInLine(searcher, text2, lineIndex + 1, 1, captureMatches);
        if (r2) {
          return r2;
        }
      }
      return null;
    }
    static _findFirstMatchInLine(searcher, text, lineNumber, fromColumn, captureMatches) {
      searcher.reset(fromColumn - 1);
      const m = searcher.next(text);
      if (m) {
        return createFindMatch(new Range(lineNumber, m.index + 1, lineNumber, m.index + 1 + m[0].length), m, captureMatches);
      }
      return null;
    }
    static findPreviousMatch(model, searchParams, searchStart, captureMatches) {
      const searchData = searchParams.parseSearchRequest();
      if (!searchData) {
        return null;
      }
      const searcher = new Searcher(searchData.wordSeparators, searchData.regex);
      if (searchData.regex.multiline) {
        return this._doFindPreviousMatchMultiline(model, searchStart, searcher, captureMatches);
      }
      return this._doFindPreviousMatchLineByLine(model, searchStart, searcher, captureMatches);
    }
    static _doFindPreviousMatchMultiline(model, searchStart, searcher, captureMatches) {
      const matches = this._doFindMatchesMultiline(model, new Range(1, 1, searchStart.lineNumber, searchStart.column), searcher, captureMatches, 10 * LIMIT_FIND_COUNT);
      if (matches.length > 0) {
        return matches[matches.length - 1];
      }
      const lineCount = model.getLineCount();
      if (searchStart.lineNumber !== lineCount || searchStart.column !== model.getLineMaxColumn(lineCount)) {
        return this._doFindPreviousMatchMultiline(model, new Position(lineCount, model.getLineMaxColumn(lineCount)), searcher, captureMatches);
      }
      return null;
    }
    static _doFindPreviousMatchLineByLine(model, searchStart, searcher, captureMatches) {
      const lineCount = model.getLineCount();
      const startLineNumber = searchStart.lineNumber;
      const text = model.getLineContent(startLineNumber).substring(0, searchStart.column - 1);
      const r = this._findLastMatchInLine(searcher, text, startLineNumber, captureMatches);
      if (r) {
        return r;
      }
      for (let i = 1; i <= lineCount; i++) {
        const lineIndex = (lineCount + startLineNumber - i - 1) % lineCount;
        const text2 = model.getLineContent(lineIndex + 1);
        const r2 = this._findLastMatchInLine(searcher, text2, lineIndex + 1, captureMatches);
        if (r2) {
          return r2;
        }
      }
      return null;
    }
    static _findLastMatchInLine(searcher, text, lineNumber, captureMatches) {
      let bestResult = null;
      let m;
      searcher.reset(0);
      while (m = searcher.next(text)) {
        bestResult = createFindMatch(new Range(lineNumber, m.index + 1, lineNumber, m.index + 1 + m[0].length), m, captureMatches);
      }
      return bestResult;
    }
  }
  function leftIsWordBounday(wordSeparators, text, textLength, matchStartIndex, matchLength) {
    if (matchStartIndex === 0) {
      return true;
    }
    const charBefore = text.charCodeAt(matchStartIndex - 1);
    if (wordSeparators.get(charBefore) !== 0) {
      return true;
    }
    if (charBefore === 13 || charBefore === 10) {
      return true;
    }
    if (matchLength > 0) {
      const firstCharInMatch = text.charCodeAt(matchStartIndex);
      if (wordSeparators.get(firstCharInMatch) !== 0) {
        return true;
      }
    }
    return false;
  }
  function rightIsWordBounday(wordSeparators, text, textLength, matchStartIndex, matchLength) {
    if (matchStartIndex + matchLength === textLength) {
      return true;
    }
    const charAfter = text.charCodeAt(matchStartIndex + matchLength);
    if (wordSeparators.get(charAfter) !== 0) {
      return true;
    }
    if (charAfter === 13 || charAfter === 10) {
      return true;
    }
    if (matchLength > 0) {
      const lastCharInMatch = text.charCodeAt(matchStartIndex + matchLength - 1);
      if (wordSeparators.get(lastCharInMatch) !== 0) {
        return true;
      }
    }
    return false;
  }
  function isValidMatch(wordSeparators, text, textLength, matchStartIndex, matchLength) {
    return leftIsWordBounday(wordSeparators, text, textLength, matchStartIndex, matchLength) && rightIsWordBounday(wordSeparators, text, textLength, matchStartIndex, matchLength);
  }
  class Searcher {
    constructor(wordSeparators, searchRegex) {
      this._wordSeparators = wordSeparators;
      this._searchRegex = searchRegex;
      this._prevMatchStartIndex = -1;
      this._prevMatchLength = 0;
    }
    reset(lastIndex) {
      this._searchRegex.lastIndex = lastIndex;
      this._prevMatchStartIndex = -1;
      this._prevMatchLength = 0;
    }
    next(text) {
      const textLength = text.length;
      let m;
      do {
        if (this._prevMatchStartIndex + this._prevMatchLength === textLength) {
          return null;
        }
        m = this._searchRegex.exec(text);
        if (!m) {
          return null;
        }
        const matchStartIndex = m.index;
        const matchLength = m[0].length;
        if (matchStartIndex === this._prevMatchStartIndex && matchLength === this._prevMatchLength) {
          if (matchLength === 0) {
            if (getNextCodePoint(text, textLength, this._searchRegex.lastIndex) > 65535) {
              this._searchRegex.lastIndex += 2;
            } else {
              this._searchRegex.lastIndex += 1;
            }
            continue;
          }
          return null;
        }
        this._prevMatchStartIndex = matchStartIndex;
        this._prevMatchLength = matchLength;
        if (!this._wordSeparators || isValidMatch(this._wordSeparators, text, textLength, matchStartIndex, matchLength)) {
          return m;
        }
      } while (m);
      return null;
    }
  }
  class UnicodeTextModelHighlighter {
    static computeUnicodeHighlights(model, options, range2) {
      const startLine = range2 ? range2.startLineNumber : 1;
      const endLine = range2 ? range2.endLineNumber : model.getLineCount();
      const codePointHighlighter = new CodePointHighlighter(options);
      const candidates = codePointHighlighter.getCandidateCodePoints();
      let regex;
      if (candidates === "allNonBasicAscii") {
        regex = new RegExp("[^\\t\\n\\r\\x20-\\x7E]", "g");
      } else {
        regex = new RegExp(`${buildRegExpCharClassExpr(Array.from(candidates))}`, "g");
      }
      const searcher = new Searcher(null, regex);
      const ranges = [];
      let hasMore = false;
      let m;
      let ambiguousCharacterCount = 0;
      let invisibleCharacterCount = 0;
      let nonBasicAsciiCharacterCount = 0;
      forLoop: for (let lineNumber = startLine, lineCount = endLine; lineNumber <= lineCount; lineNumber++) {
        const lineContent = model.getLineContent(lineNumber);
        const lineLength = lineContent.length;
        searcher.reset(0);
        do {
          m = searcher.next(lineContent);
          if (m) {
            let startIndex = m.index;
            let endIndex = m.index + m[0].length;
            if (startIndex > 0) {
              const charCodeBefore = lineContent.charCodeAt(startIndex - 1);
              if (isHighSurrogate(charCodeBefore)) {
                startIndex--;
              }
            }
            if (endIndex + 1 < lineLength) {
              const charCodeBefore = lineContent.charCodeAt(endIndex - 1);
              if (isHighSurrogate(charCodeBefore)) {
                endIndex++;
              }
            }
            const str = lineContent.substring(startIndex, endIndex);
            let word = getWordAtText(startIndex + 1, DEFAULT_WORD_REGEXP, lineContent, 0);
            if (word && word.endColumn <= startIndex + 1) {
              word = null;
            }
            const highlightReason = codePointHighlighter.shouldHighlightNonBasicASCII(str, word ? word.word : null);
            if (highlightReason !== 0) {
              if (highlightReason === 3) {
                ambiguousCharacterCount++;
              } else if (highlightReason === 2) {
                invisibleCharacterCount++;
              } else if (highlightReason === 1) {
                nonBasicAsciiCharacterCount++;
              } else {
                assertNever();
              }
              const MAX_RESULT_LENGTH = 1e3;
              if (ranges.length >= MAX_RESULT_LENGTH) {
                hasMore = true;
                break forLoop;
              }
              ranges.push(new Range(lineNumber, startIndex + 1, lineNumber, endIndex + 1));
            }
          }
        } while (m);
      }
      return {
        ranges,
        hasMore,
        ambiguousCharacterCount,
        invisibleCharacterCount,
        nonBasicAsciiCharacterCount
      };
    }
    static computeUnicodeHighlightReason(char, options) {
      const codePointHighlighter = new CodePointHighlighter(options);
      const reason = codePointHighlighter.shouldHighlightNonBasicASCII(char, null);
      switch (reason) {
        case 0:
          return null;
        case 2:
          return {
            kind: 1
            /* UnicodeHighlighterReasonKind.Invisible */
          };
        case 3: {
          const codePoint = char.codePointAt(0);
          const primaryConfusable = codePointHighlighter.ambiguousCharacters.getPrimaryConfusable(codePoint);
          const notAmbiguousInLocales = AmbiguousCharacters.getLocales().filter((l) => !AmbiguousCharacters.getInstance(/* @__PURE__ */ new Set([...options.allowedLocales, l])).isAmbiguous(codePoint));
          return { kind: 0, confusableWith: String.fromCodePoint(primaryConfusable), notAmbiguousInLocales };
        }
        case 1:
          return {
            kind: 2
            /* UnicodeHighlighterReasonKind.NonBasicAscii */
          };
      }
    }
  }
  function buildRegExpCharClassExpr(codePoints, flags) {
    const src = `[${escapeRegExpCharacters(codePoints.map((i) => String.fromCodePoint(i)).join(""))}]`;
    return src;
  }
  class CodePointHighlighter {
    constructor(options) {
      this.options = options;
      this.allowedCodePoints = new Set(options.allowedCodePoints);
      this.ambiguousCharacters = AmbiguousCharacters.getInstance(new Set(options.allowedLocales));
    }
    getCandidateCodePoints() {
      if (this.options.nonBasicASCII) {
        return "allNonBasicAscii";
      }
      const set = /* @__PURE__ */ new Set();
      if (this.options.invisibleCharacters) {
        for (const cp of InvisibleCharacters.codePoints) {
          if (!isAllowedInvisibleCharacter(String.fromCodePoint(cp))) {
            set.add(cp);
          }
        }
      }
      if (this.options.ambiguousCharacters) {
        for (const cp of this.ambiguousCharacters.getConfusableCodePoints()) {
          set.add(cp);
        }
      }
      for (const cp of this.allowedCodePoints) {
        set.delete(cp);
      }
      return set;
    }
    shouldHighlightNonBasicASCII(character, wordContext) {
      const codePoint = character.codePointAt(0);
      if (this.allowedCodePoints.has(codePoint)) {
        return 0;
      }
      if (this.options.nonBasicASCII) {
        return 1;
      }
      let hasBasicASCIICharacters = false;
      let hasNonConfusableNonBasicAsciiCharacter = false;
      if (wordContext) {
        for (const char of wordContext) {
          const codePoint2 = char.codePointAt(0);
          const isBasicASCII$1 = isBasicASCII(char);
          hasBasicASCIICharacters = hasBasicASCIICharacters || isBasicASCII$1;
          if (!isBasicASCII$1 && !this.ambiguousCharacters.isAmbiguous(codePoint2) && !InvisibleCharacters.isInvisibleCharacter(codePoint2)) {
            hasNonConfusableNonBasicAsciiCharacter = true;
          }
        }
      }
      if (
        /* Don't allow mixing weird looking characters with ASCII */
        !hasBasicASCIICharacters && /* Is there an obviously weird looking character? */
        hasNonConfusableNonBasicAsciiCharacter
      ) {
        return 0;
      }
      if (this.options.invisibleCharacters) {
        if (!isAllowedInvisibleCharacter(character) && InvisibleCharacters.isInvisibleCharacter(codePoint)) {
          return 2;
        }
      }
      if (this.options.ambiguousCharacters) {
        if (this.ambiguousCharacters.isAmbiguous(codePoint)) {
          return 3;
        }
      }
      return 0;
    }
  }
  function isAllowedInvisibleCharacter(character) {
    return character === " " || character === "\n" || character === "	";
  }
  class LinesDiff {
    constructor(changes, moves, hitTimeout) {
      this.changes = changes;
      this.moves = moves;
      this.hitTimeout = hitTimeout;
    }
  }
  class MovedText {
    constructor(lineRangeMapping, changes) {
      this.lineRangeMapping = lineRangeMapping;
      this.changes = changes;
    }
  }
  class OffsetRange {
    static fromTo(start, endExclusive) {
      return new OffsetRange(start, endExclusive);
    }
    static addRange(range2, sortedRanges) {
      let i = 0;
      while (i < sortedRanges.length && sortedRanges[i].endExclusive < range2.start) {
        i++;
      }
      let j = i;
      while (j < sortedRanges.length && sortedRanges[j].start <= range2.endExclusive) {
        j++;
      }
      if (i === j) {
        sortedRanges.splice(i, 0, range2);
      } else {
        const start = Math.min(range2.start, sortedRanges[i].start);
        const end = Math.max(range2.endExclusive, sortedRanges[j - 1].endExclusive);
        sortedRanges.splice(i, j - i, new OffsetRange(start, end));
      }
    }
    static tryCreate(start, endExclusive) {
      if (start > endExclusive) {
        return void 0;
      }
      return new OffsetRange(start, endExclusive);
    }
    static ofLength(length) {
      return new OffsetRange(0, length);
    }
    static ofStartAndLength(start, length) {
      return new OffsetRange(start, start + length);
    }
    static emptyAt(offset) {
      return new OffsetRange(offset, offset);
    }
    constructor(start, endExclusive) {
      this.start = start;
      this.endExclusive = endExclusive;
      if (start > endExclusive) {
        throw new BugIndicatingError(`Invalid range: ${this.toString()}`);
      }
    }
    get isEmpty() {
      return this.start === this.endExclusive;
    }
    delta(offset) {
      return new OffsetRange(this.start + offset, this.endExclusive + offset);
    }
    deltaStart(offset) {
      return new OffsetRange(this.start + offset, this.endExclusive);
    }
    deltaEnd(offset) {
      return new OffsetRange(this.start, this.endExclusive + offset);
    }
    get length() {
      return this.endExclusive - this.start;
    }
    toString() {
      return `[${this.start}, ${this.endExclusive})`;
    }
    equals(other) {
      return this.start === other.start && this.endExclusive === other.endExclusive;
    }
    containsRange(other) {
      return this.start <= other.start && other.endExclusive <= this.endExclusive;
    }
    contains(offset) {
      return this.start <= offset && offset < this.endExclusive;
    }
    /**
     * for all numbers n: range1.contains(n) or range2.contains(n) => range1.join(range2).contains(n)
     * The joined range is the smallest range that contains both ranges.
     */
    join(other) {
      return new OffsetRange(Math.min(this.start, other.start), Math.max(this.endExclusive, other.endExclusive));
    }
    /**
     * for all numbers n: range1.contains(n) and range2.contains(n) <=> range1.intersect(range2).contains(n)
     *
     * The resulting range is empty if the ranges do not intersect, but touch.
     * If the ranges don't even touch, the result is undefined.
     */
    intersect(other) {
      const start = Math.max(this.start, other.start);
      const end = Math.min(this.endExclusive, other.endExclusive);
      if (start <= end) {
        return new OffsetRange(start, end);
      }
      return void 0;
    }
    intersectionLength(range2) {
      const start = Math.max(this.start, range2.start);
      const end = Math.min(this.endExclusive, range2.endExclusive);
      return Math.max(0, end - start);
    }
    /**
     * `a.intersects(b)` iff there exists a number n so that `a.contains(n)` and `b.contains(n)`.
     * Warning: If one range is empty, this method returns always false.
    */
    intersects(other) {
      const start = Math.max(this.start, other.start);
      const end = Math.min(this.endExclusive, other.endExclusive);
      return start < end;
    }
    intersectsOrTouches(other) {
      const start = Math.max(this.start, other.start);
      const end = Math.min(this.endExclusive, other.endExclusive);
      return start <= end;
    }
    isBefore(other) {
      return this.endExclusive <= other.start;
    }
    isAfter(other) {
      return this.start >= other.endExclusive;
    }
    slice(arr) {
      return arr.slice(this.start, this.endExclusive);
    }
    substring(str) {
      return str.substring(this.start, this.endExclusive);
    }
    /**
     * Returns the given value if it is contained in this instance, otherwise the closest value that is contained.
     * The range must not be empty.
     */
    clip(value) {
      if (this.isEmpty) {
        throw new BugIndicatingError(`Invalid clipping range: ${this.toString()}`);
      }
      return Math.max(this.start, Math.min(this.endExclusive - 1, value));
    }
    /**
     * Returns `r := value + k * length` such that `r` is contained in this range.
     * The range must not be empty.
     *
     * E.g. `[5, 10).clipCyclic(10) === 5`, `[5, 10).clipCyclic(11) === 6` and `[5, 10).clipCyclic(4) === 9`.
     */
    clipCyclic(value) {
      if (this.isEmpty) {
        throw new BugIndicatingError(`Invalid clipping range: ${this.toString()}`);
      }
      if (value < this.start) {
        return this.endExclusive - (this.start - value) % this.length;
      }
      if (value >= this.endExclusive) {
        return this.start + (value - this.start) % this.length;
      }
      return value;
    }
    forEach(f) {
      for (let i = this.start; i < this.endExclusive; i++) {
        f(i);
      }
    }
    /**
     * this: [ 5, 10), range: [10, 15) => [5, 15)]
     * Throws if the ranges are not touching.
    */
    joinRightTouching(range2) {
      if (this.endExclusive !== range2.start) {
        throw new BugIndicatingError(`Invalid join: ${this.toString()} and ${range2.toString()}`);
      }
      return new OffsetRange(this.start, range2.endExclusive);
    }
    withMargin(marginStart, marginEnd) {
      if (marginEnd === void 0) {
        marginEnd = marginStart;
      }
      return new OffsetRange(this.start - marginStart, this.endExclusive + marginEnd);
    }
  }
  class OffsetRangeSet {
    constructor() {
      this._sortedRanges = [];
    }
    addRange(range2) {
      let i = 0;
      while (i < this._sortedRanges.length && this._sortedRanges[i].endExclusive < range2.start) {
        i++;
      }
      let j = i;
      while (j < this._sortedRanges.length && this._sortedRanges[j].start <= range2.endExclusive) {
        j++;
      }
      if (i === j) {
        this._sortedRanges.splice(i, 0, range2);
      } else {
        const start = Math.min(range2.start, this._sortedRanges[i].start);
        const end = Math.max(range2.endExclusive, this._sortedRanges[j - 1].endExclusive);
        this._sortedRanges.splice(i, j - i, new OffsetRange(start, end));
      }
    }
    toString() {
      return this._sortedRanges.map((r) => r.toString()).join(", ");
    }
    /**
     * Returns of there is a value that is contained in this instance and the given range.
     */
    intersectsStrict(other) {
      let i = 0;
      while (i < this._sortedRanges.length && this._sortedRanges[i].endExclusive <= other.start) {
        i++;
      }
      return i < this._sortedRanges.length && this._sortedRanges[i].start < other.endExclusive;
    }
    intersectWithRange(other) {
      const result = new OffsetRangeSet();
      for (const range2 of this._sortedRanges) {
        const intersection = range2.intersect(other);
        if (intersection) {
          result.addRange(intersection);
        }
      }
      return result;
    }
    intersectWithRangeLength(other) {
      return this.intersectWithRange(other).length;
    }
    get length() {
      return this._sortedRanges.reduce((prev, cur) => prev + cur.length, 0);
    }
  }
  function findLast(array, predicate, fromIndex = array.length - 1) {
    const idx = findLastIdx(array, predicate, fromIndex);
    if (idx === -1) {
      return void 0;
    }
    return array[idx];
  }
  function findLastIdx(array, predicate, fromIndex = array.length - 1) {
    for (let i = fromIndex; i >= 0; i--) {
      const element = array[i];
      if (predicate(element, i)) {
        return i;
      }
    }
    return -1;
  }
  function findLastMonotonous(array, predicate) {
    const idx = findLastIdxMonotonous(array, predicate);
    return idx === -1 ? void 0 : array[idx];
  }
  function findLastIdxMonotonous(array, predicate, startIdx = 0, endIdxEx = array.length) {
    let i = startIdx;
    let j = endIdxEx;
    while (i < j) {
      const k = Math.floor((i + j) / 2);
      if (predicate(array[k])) {
        i = k + 1;
      } else {
        j = k;
      }
    }
    return i - 1;
  }
  function findFirstMonotonous(array, predicate) {
    const idx = findFirstIdxMonotonousOrArrLen(array, predicate);
    return idx === array.length ? void 0 : array[idx];
  }
  function findFirstIdxMonotonousOrArrLen(array, predicate, startIdx = 0, endIdxEx = array.length) {
    let i = startIdx;
    let j = endIdxEx;
    while (i < j) {
      const k = Math.floor((i + j) / 2);
      if (predicate(array[k])) {
        j = k;
      } else {
        i = k + 1;
      }
    }
    return i;
  }
  const _MonotonousArray = class _MonotonousArray {
    constructor(_array) {
      this._array = _array;
      this._findLastMonotonousLastIdx = 0;
    }
    /**
     * The predicate must be monotonous, i.e. `arr.map(predicate)` must be like `[true, ..., true, false, ..., false]`!
     * For subsequent calls, current predicate must be weaker than (or equal to) the previous predicate, i.e. more entries must be `true`.
     */
    findLastMonotonous(predicate) {
      if (_MonotonousArray.assertInvariants) {
        if (this._prevFindLastPredicate) {
          for (const item of this._array) {
            if (this._prevFindLastPredicate(item) && !predicate(item)) {
              throw new Error("MonotonousArray: current predicate must be weaker than (or equal to) the previous predicate.");
            }
          }
        }
        this._prevFindLastPredicate = predicate;
      }
      const idx = findLastIdxMonotonous(this._array, predicate, this._findLastMonotonousLastIdx);
      this._findLastMonotonousLastIdx = idx + 1;
      return idx === -1 ? void 0 : this._array[idx];
    }
  };
  _MonotonousArray.assertInvariants = false;
  let MonotonousArray = _MonotonousArray;
  function findFirstMax(array, comparator) {
    if (array.length === 0) {
      return void 0;
    }
    let max = array[0];
    for (let i = 1; i < array.length; i++) {
      const item = array[i];
      if (comparator(item, max) > 0) {
        max = item;
      }
    }
    return max;
  }
  function findLastMax(array, comparator) {
    if (array.length === 0) {
      return void 0;
    }
    let max = array[0];
    for (let i = 1; i < array.length; i++) {
      const item = array[i];
      if (comparator(item, max) >= 0) {
        max = item;
      }
    }
    return max;
  }
  function findFirstMin(array, comparator) {
    return findFirstMax(array, (a, b) => -comparator(a, b));
  }
  function findMaxIdx(array, comparator) {
    if (array.length === 0) {
      return -1;
    }
    let maxIdx = 0;
    for (let i = 1; i < array.length; i++) {
      const item = array[i];
      if (comparator(item, array[maxIdx]) > 0) {
        maxIdx = i;
      }
    }
    return maxIdx;
  }
  function mapFindFirst(items, mapFn) {
    for (const value of items) {
      const mapped = mapFn(value);
      if (mapped !== void 0) {
        return mapped;
      }
    }
    return void 0;
  }
  const _LineRange = class _LineRange {
    static ofLength(startLineNumber, length) {
      return new _LineRange(startLineNumber, startLineNumber + length);
    }
    static fromRange(range2) {
      return new _LineRange(range2.startLineNumber, range2.endLineNumber);
    }
    static fromRangeInclusive(range2) {
      return new _LineRange(range2.startLineNumber, range2.endLineNumber + 1);
    }
    /**
     * @param lineRanges An array of arrays of of sorted line ranges.
     */
    static joinMany(lineRanges) {
      if (lineRanges.length === 0) {
        return [];
      }
      let result = new LineRangeSet(lineRanges[0].slice());
      for (let i = 1; i < lineRanges.length; i++) {
        result = result.getUnion(new LineRangeSet(lineRanges[i].slice()));
      }
      return result.ranges;
    }
    static join(lineRanges) {
      if (lineRanges.length === 0) {
        throw new BugIndicatingError("lineRanges cannot be empty");
      }
      let startLineNumber = lineRanges[0].startLineNumber;
      let endLineNumberExclusive = lineRanges[0].endLineNumberExclusive;
      for (let i = 1; i < lineRanges.length; i++) {
        startLineNumber = Math.min(startLineNumber, lineRanges[i].startLineNumber);
        endLineNumberExclusive = Math.max(endLineNumberExclusive, lineRanges[i].endLineNumberExclusive);
      }
      return new _LineRange(startLineNumber, endLineNumberExclusive);
    }
    /**
     * @internal
     */
    static deserialize(lineRange) {
      return new _LineRange(lineRange[0], lineRange[1]);
    }
    constructor(startLineNumber, endLineNumberExclusive) {
      if (startLineNumber > endLineNumberExclusive) {
        throw new BugIndicatingError(`startLineNumber ${startLineNumber} cannot be after endLineNumberExclusive ${endLineNumberExclusive}`);
      }
      this.startLineNumber = startLineNumber;
      this.endLineNumberExclusive = endLineNumberExclusive;
    }
    /**
     * Indicates if this line range contains the given line number.
     */
    contains(lineNumber) {
      return this.startLineNumber <= lineNumber && lineNumber < this.endLineNumberExclusive;
    }
    /**
     * Indicates if this line range is empty.
     */
    get isEmpty() {
      return this.startLineNumber === this.endLineNumberExclusive;
    }
    /**
     * Moves this line range by the given offset of line numbers.
     */
    delta(offset) {
      return new _LineRange(this.startLineNumber + offset, this.endLineNumberExclusive + offset);
    }
    deltaLength(offset) {
      return new _LineRange(this.startLineNumber, this.endLineNumberExclusive + offset);
    }
    /**
     * The number of lines this line range spans.
     */
    get length() {
      return this.endLineNumberExclusive - this.startLineNumber;
    }
    /**
     * Creates a line range that combines this and the given line range.
     */
    join(other) {
      return new _LineRange(Math.min(this.startLineNumber, other.startLineNumber), Math.max(this.endLineNumberExclusive, other.endLineNumberExclusive));
    }
    toString() {
      return `[${this.startLineNumber},${this.endLineNumberExclusive})`;
    }
    /**
     * The resulting range is empty if the ranges do not intersect, but touch.
     * If the ranges don't even touch, the result is undefined.
     */
    intersect(other) {
      const startLineNumber = Math.max(this.startLineNumber, other.startLineNumber);
      const endLineNumberExclusive = Math.min(this.endLineNumberExclusive, other.endLineNumberExclusive);
      if (startLineNumber <= endLineNumberExclusive) {
        return new _LineRange(startLineNumber, endLineNumberExclusive);
      }
      return void 0;
    }
    intersectsStrict(other) {
      return this.startLineNumber < other.endLineNumberExclusive && other.startLineNumber < this.endLineNumberExclusive;
    }
    intersectsOrTouches(other) {
      return this.startLineNumber <= other.endLineNumberExclusive && other.startLineNumber <= this.endLineNumberExclusive;
    }
    equals(b) {
      return this.startLineNumber === b.startLineNumber && this.endLineNumberExclusive === b.endLineNumberExclusive;
    }
    toInclusiveRange() {
      if (this.isEmpty) {
        return null;
      }
      return new Range(this.startLineNumber, 1, this.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER);
    }
    /**
     * @deprecated Using this function is discouraged because it might lead to bugs: The end position is not guaranteed to be a valid position!
    */
    toExclusiveRange() {
      return new Range(this.startLineNumber, 1, this.endLineNumberExclusive, 1);
    }
    mapToLineArray(f) {
      const result = [];
      for (let lineNumber = this.startLineNumber; lineNumber < this.endLineNumberExclusive; lineNumber++) {
        result.push(f(lineNumber));
      }
      return result;
    }
    forEach(f) {
      for (let lineNumber = this.startLineNumber; lineNumber < this.endLineNumberExclusive; lineNumber++) {
        f(lineNumber);
      }
    }
    /**
     * @internal
     */
    serialize() {
      return [this.startLineNumber, this.endLineNumberExclusive];
    }
    /**
     * Converts this 1-based line range to a 0-based offset range (subtracts 1!).
     * @internal
     */
    toOffsetRange() {
      return new OffsetRange(this.startLineNumber - 1, this.endLineNumberExclusive - 1);
    }
    addMargin(marginTop, marginBottom) {
      return new _LineRange(this.startLineNumber - marginTop, this.endLineNumberExclusive + marginBottom);
    }
  };
  _LineRange.compareByStart = compareBy((l) => l.startLineNumber, numberComparator);
  let LineRange = _LineRange;
  class LineRangeSet {
    constructor(_normalizedRanges = []) {
      this._normalizedRanges = _normalizedRanges;
    }
    get ranges() {
      return this._normalizedRanges;
    }
    addRange(range2) {
      if (range2.length === 0) {
        return;
      }
      const joinRangeStartIdx = findFirstIdxMonotonousOrArrLen(this._normalizedRanges, (r) => r.endLineNumberExclusive >= range2.startLineNumber);
      const joinRangeEndIdxExclusive = findLastIdxMonotonous(this._normalizedRanges, (r) => r.startLineNumber <= range2.endLineNumberExclusive) + 1;
      if (joinRangeStartIdx === joinRangeEndIdxExclusive) {
        this._normalizedRanges.splice(joinRangeStartIdx, 0, range2);
      } else if (joinRangeStartIdx === joinRangeEndIdxExclusive - 1) {
        const joinRange = this._normalizedRanges[joinRangeStartIdx];
        this._normalizedRanges[joinRangeStartIdx] = joinRange.join(range2);
      } else {
        const joinRange = this._normalizedRanges[joinRangeStartIdx].join(this._normalizedRanges[joinRangeEndIdxExclusive - 1]).join(range2);
        this._normalizedRanges.splice(joinRangeStartIdx, joinRangeEndIdxExclusive - joinRangeStartIdx, joinRange);
      }
    }
    contains(lineNumber) {
      const rangeThatStartsBeforeEnd = findLastMonotonous(this._normalizedRanges, (r) => r.startLineNumber <= lineNumber);
      return !!rangeThatStartsBeforeEnd && rangeThatStartsBeforeEnd.endLineNumberExclusive > lineNumber;
    }
    intersects(range2) {
      const rangeThatStartsBeforeEnd = findLastMonotonous(this._normalizedRanges, (r) => r.startLineNumber < range2.endLineNumberExclusive);
      return !!rangeThatStartsBeforeEnd && rangeThatStartsBeforeEnd.endLineNumberExclusive > range2.startLineNumber;
    }
    getUnion(other) {
      if (this._normalizedRanges.length === 0) {
        return other;
      }
      if (other._normalizedRanges.length === 0) {
        return this;
      }
      const result = [];
      let i1 = 0;
      let i2 = 0;
      let current = null;
      while (i1 < this._normalizedRanges.length || i2 < other._normalizedRanges.length) {
        let next = null;
        if (i1 < this._normalizedRanges.length && i2 < other._normalizedRanges.length) {
          const lineRange1 = this._normalizedRanges[i1];
          const lineRange2 = other._normalizedRanges[i2];
          if (lineRange1.startLineNumber < lineRange2.startLineNumber) {
            next = lineRange1;
            i1++;
          } else {
            next = lineRange2;
            i2++;
          }
        } else if (i1 < this._normalizedRanges.length) {
          next = this._normalizedRanges[i1];
          i1++;
        } else {
          next = other._normalizedRanges[i2];
          i2++;
        }
        if (current === null) {
          current = next;
        } else {
          if (current.endLineNumberExclusive >= next.startLineNumber) {
            current = new LineRange(current.startLineNumber, Math.max(current.endLineNumberExclusive, next.endLineNumberExclusive));
          } else {
            result.push(current);
            current = next;
          }
        }
      }
      if (current !== null) {
        result.push(current);
      }
      return new LineRangeSet(result);
    }
    /**
     * Subtracts all ranges in this set from `range` and returns the result.
     */
    subtractFrom(range2) {
      const joinRangeStartIdx = findFirstIdxMonotonousOrArrLen(this._normalizedRanges, (r) => r.endLineNumberExclusive >= range2.startLineNumber);
      const joinRangeEndIdxExclusive = findLastIdxMonotonous(this._normalizedRanges, (r) => r.startLineNumber <= range2.endLineNumberExclusive) + 1;
      if (joinRangeStartIdx === joinRangeEndIdxExclusive) {
        return new LineRangeSet([range2]);
      }
      const result = [];
      let startLineNumber = range2.startLineNumber;
      for (let i = joinRangeStartIdx; i < joinRangeEndIdxExclusive; i++) {
        const r = this._normalizedRanges[i];
        if (r.startLineNumber > startLineNumber) {
          result.push(new LineRange(startLineNumber, r.startLineNumber));
        }
        startLineNumber = r.endLineNumberExclusive;
      }
      if (startLineNumber < range2.endLineNumberExclusive) {
        result.push(new LineRange(startLineNumber, range2.endLineNumberExclusive));
      }
      return new LineRangeSet(result);
    }
    toString() {
      return this._normalizedRanges.map((r) => r.toString()).join(", ");
    }
    getIntersection(other) {
      const result = [];
      let i1 = 0;
      let i2 = 0;
      while (i1 < this._normalizedRanges.length && i2 < other._normalizedRanges.length) {
        const r1 = this._normalizedRanges[i1];
        const r2 = other._normalizedRanges[i2];
        const i = r1.intersect(r2);
        if (i && !i.isEmpty) {
          result.push(i);
        }
        if (r1.endLineNumberExclusive < r2.endLineNumberExclusive) {
          i1++;
        } else {
          i2++;
        }
      }
      return new LineRangeSet(result);
    }
    getWithDelta(value) {
      return new LineRangeSet(this._normalizedRanges.map((r) => r.delta(value)));
    }
  }
  const _TextLength = class _TextLength {
    static betweenPositions(position1, position2) {
      if (position1.lineNumber === position2.lineNumber) {
        return new _TextLength(0, position2.column - position1.column);
      } else {
        return new _TextLength(position2.lineNumber - position1.lineNumber, position2.column - 1);
      }
    }
    static fromPosition(pos) {
      return new _TextLength(pos.lineNumber - 1, pos.column - 1);
    }
    static ofRange(range2) {
      return _TextLength.betweenPositions(range2.getStartPosition(), range2.getEndPosition());
    }
    static ofText(text) {
      let line = 0;
      let column = 0;
      for (const c of text) {
        if (c === "\n") {
          line++;
          column = 0;
        } else {
          column++;
        }
      }
      return new _TextLength(line, column);
    }
    constructor(lineCount, columnCount) {
      this.lineCount = lineCount;
      this.columnCount = columnCount;
    }
    isGreaterThanOrEqualTo(other) {
      if (this.lineCount !== other.lineCount) {
        return this.lineCount > other.lineCount;
      }
      return this.columnCount >= other.columnCount;
    }
    add(other) {
      if (other.lineCount === 0) {
        return new _TextLength(this.lineCount, this.columnCount + other.columnCount);
      } else {
        return new _TextLength(this.lineCount + other.lineCount, other.columnCount);
      }
    }
    createRange(startPosition) {
      if (this.lineCount === 0) {
        return new Range(startPosition.lineNumber, startPosition.column, startPosition.lineNumber, startPosition.column + this.columnCount);
      } else {
        return new Range(startPosition.lineNumber, startPosition.column, startPosition.lineNumber + this.lineCount, this.columnCount + 1);
      }
    }
    toRange() {
      return new Range(1, 1, this.lineCount + 1, this.columnCount + 1);
    }
    toLineRange() {
      return LineRange.ofLength(1, this.lineCount + 1);
    }
    addToPosition(position) {
      if (this.lineCount === 0) {
        return new Position(position.lineNumber, position.column + this.columnCount);
      } else {
        return new Position(position.lineNumber + this.lineCount, this.columnCount + 1);
      }
    }
    toString() {
      return `${this.lineCount},${this.columnCount}`;
    }
  };
  _TextLength.zero = new _TextLength(0, 0);
  let TextLength = _TextLength;
  class PositionOffsetTransformerBase {
    getOffsetRange(range2) {
      return new OffsetRange(this.getOffset(range2.getStartPosition()), this.getOffset(range2.getEndPosition()));
    }
    getRange(offsetRange) {
      return Range.fromPositions(this.getPosition(offsetRange.start), this.getPosition(offsetRange.endExclusive));
    }
    getStringReplacement(edit) {
      return new Deps.deps.StringReplacement(this.getOffsetRange(edit.range), edit.text);
    }
    getTextReplacement(edit) {
      return new Deps.deps.TextReplacement(this.getRange(edit.replaceRange), edit.newText);
    }
    getTextEdit(edit) {
      const edits = edit.replacements.map((e) => this.getTextReplacement(e));
      return new Deps.deps.TextEdit(edits);
    }
  }
  const _Deps = class _Deps {
    static get deps() {
      if (!this._deps) {
        throw new Error("Dependencies not set. Call _setDependencies first.");
      }
      return this._deps;
    }
  };
  _Deps._deps = void 0;
  let Deps = _Deps;
  function _setPositionOffsetTransformerDependencies(deps) {
    Deps._deps = deps;
  }
  class PositionOffsetTransformer extends PositionOffsetTransformerBase {
    constructor(text) {
      super();
      this.text = text;
    }
    get lineStartOffsetByLineIdx() {
      if (!this._lineStartOffsetByLineIdx) {
        this._computeLineOffsets();
      }
      return this._lineStartOffsetByLineIdx;
    }
    get lineEndOffsetByLineIdx() {
      if (!this._lineEndOffsetByLineIdx) {
        this._computeLineOffsets();
      }
      return this._lineEndOffsetByLineIdx;
    }
    _computeLineOffsets() {
      this._lineStartOffsetByLineIdx = [];
      this._lineEndOffsetByLineIdx = [];
      this._lineStartOffsetByLineIdx.push(0);
      for (let i = 0; i < this.text.length; i++) {
        if (this.text.charAt(i) === "\n") {
          this._lineStartOffsetByLineIdx.push(i + 1);
          if (i > 0 && this.text.charAt(i - 1) === "\r") {
            this._lineEndOffsetByLineIdx.push(i - 1);
          } else {
            this._lineEndOffsetByLineIdx.push(i);
          }
        }
      }
      this._lineEndOffsetByLineIdx.push(this.text.length);
    }
    getOffset(position) {
      const valPos = this._validatePosition(position);
      return this.lineStartOffsetByLineIdx[valPos.lineNumber - 1] + valPos.column - 1;
    }
    _validatePosition(position) {
      if (position.lineNumber < 1) {
        return new Position(1, 1);
      }
      const lineCount = this.textLength.lineCount + 1;
      if (position.lineNumber > lineCount) {
        const lineLength2 = this.getLineLength(lineCount);
        return new Position(lineCount, lineLength2 + 1);
      }
      if (position.column < 1) {
        return new Position(position.lineNumber, 1);
      }
      const lineLength = this.getLineLength(position.lineNumber);
      if (position.column - 1 > lineLength) {
        return new Position(position.lineNumber, lineLength + 1);
      }
      return position;
    }
    getPosition(offset) {
      const idx = findLastIdxMonotonous(this.lineStartOffsetByLineIdx, (i) => i <= offset);
      const lineNumber = idx + 1;
      const column = offset - this.lineStartOffsetByLineIdx[idx] + 1;
      return new Position(lineNumber, column);
    }
    get textLength() {
      const lineIdx = this.lineStartOffsetByLineIdx.length - 1;
      return new Deps.deps.TextLength(lineIdx, this.text.length - this.lineStartOffsetByLineIdx[lineIdx]);
    }
    getLineLength(lineNumber) {
      return this.lineEndOffsetByLineIdx[lineNumber - 1] - this.lineStartOffsetByLineIdx[lineNumber - 1];
    }
  }
  class AbstractText {
    constructor() {
      this._transformer = void 0;
    }
    get endPositionExclusive() {
      return this.length.addToPosition(new Position(1, 1));
    }
    get lineRange() {
      return this.length.toLineRange();
    }
    getValue() {
      return this.getValueOfRange(this.length.toRange());
    }
    getValueOfOffsetRange(range2) {
      return this.getValueOfRange(this.getTransformer().getRange(range2));
    }
    getLineLength(lineNumber) {
      return this.getValueOfRange(new Range(lineNumber, 1, lineNumber, Number.MAX_SAFE_INTEGER)).length;
    }
    getTransformer() {
      if (!this._transformer) {
        this._transformer = new PositionOffsetTransformer(this.getValue());
      }
      return this._transformer;
    }
    getLineAt(lineNumber) {
      return this.getValueOfRange(new Range(lineNumber, 1, lineNumber, Number.MAX_SAFE_INTEGER));
    }
  }
  class LineBasedText extends AbstractText {
    constructor(_getLineContent, _lineCount) {
      assert(_lineCount >= 1);
      super();
      this._getLineContent = _getLineContent;
      this._lineCount = _lineCount;
    }
    getValueOfRange(range2) {
      if (range2.startLineNumber === range2.endLineNumber) {
        return this._getLineContent(range2.startLineNumber).substring(range2.startColumn - 1, range2.endColumn - 1);
      }
      let result = this._getLineContent(range2.startLineNumber).substring(range2.startColumn - 1);
      for (let i = range2.startLineNumber + 1; i < range2.endLineNumber; i++) {
        result += "\n" + this._getLineContent(i);
      }
      result += "\n" + this._getLineContent(range2.endLineNumber).substring(0, range2.endColumn - 1);
      return result;
    }
    getLineLength(lineNumber) {
      return this._getLineContent(lineNumber).length;
    }
    get length() {
      const lastLine = this._getLineContent(this._lineCount);
      return new TextLength(this._lineCount - 1, lastLine.length);
    }
  }
  class ArrayText extends LineBasedText {
    constructor(lines) {
      super((lineNumber) => lines[lineNumber - 1], lines.length);
    }
  }
  class StringText extends AbstractText {
    constructor(value) {
      super();
      this.value = value;
      this._t = new PositionOffsetTransformer(this.value);
    }
    getValueOfRange(range2) {
      return this._t.getOffsetRange(range2).substring(this.value);
    }
    get length() {
      return this._t.textLength;
    }
    // Override the getTransformer method to return the cached transformer
    getTransformer() {
      return this._t;
    }
  }
  class TextEdit {
    static fromStringEdit(edit, initialState) {
      const edits = edit.replacements.map((e) => TextReplacement.fromStringReplacement(e, initialState));
      return new TextEdit(edits);
    }
    static fromParallelReplacementsUnsorted(replacements) {
      const r = replacements.slice().sort(compareBy((i) => i.range, Range.compareRangesUsingStarts));
      return new TextEdit(r);
    }
    constructor(replacements) {
      this.replacements = replacements;
      assertFn(() => checkAdjacentItems(replacements, (a, b) => a.range.getEndPosition().isBeforeOrEqual(b.range.getStartPosition())));
    }
    mapPosition(position) {
      let lineDelta = 0;
      let curLine = 0;
      let columnDeltaInCurLine = 0;
      for (const replacement of this.replacements) {
        const start = replacement.range.getStartPosition();
        if (position.isBeforeOrEqual(start)) {
          break;
        }
        const end = replacement.range.getEndPosition();
        const len = TextLength.ofText(replacement.text);
        if (position.isBefore(end)) {
          const startPos = new Position(start.lineNumber + lineDelta, start.column + (start.lineNumber + lineDelta === curLine ? columnDeltaInCurLine : 0));
          const endPos = len.addToPosition(startPos);
          return rangeFromPositions(startPos, endPos);
        }
        if (start.lineNumber + lineDelta !== curLine) {
          columnDeltaInCurLine = 0;
        }
        lineDelta += len.lineCount - (replacement.range.endLineNumber - replacement.range.startLineNumber);
        if (len.lineCount === 0) {
          if (end.lineNumber !== start.lineNumber) {
            columnDeltaInCurLine += len.columnCount - (end.column - 1);
          } else {
            columnDeltaInCurLine += len.columnCount - (end.column - start.column);
          }
        } else {
          columnDeltaInCurLine = len.columnCount;
        }
        curLine = end.lineNumber + lineDelta;
      }
      return new Position(position.lineNumber + lineDelta, position.column + (position.lineNumber + lineDelta === curLine ? columnDeltaInCurLine : 0));
    }
    mapRange(range2) {
      function getStart(p) {
        return p instanceof Position ? p : p.getStartPosition();
      }
      function getEnd(p) {
        return p instanceof Position ? p : p.getEndPosition();
      }
      const start = getStart(this.mapPosition(range2.getStartPosition()));
      const end = getEnd(this.mapPosition(range2.getEndPosition()));
      return rangeFromPositions(start, end);
    }
    apply(text) {
      let result = "";
      let lastEditEnd = new Position(1, 1);
      for (const replacement of this.replacements) {
        const editRange = replacement.range;
        const editStart = editRange.getStartPosition();
        const editEnd = editRange.getEndPosition();
        const r2 = rangeFromPositions(lastEditEnd, editStart);
        if (!r2.isEmpty()) {
          result += text.getValueOfRange(r2);
        }
        result += replacement.text;
        lastEditEnd = editEnd;
      }
      const r = rangeFromPositions(lastEditEnd, text.endPositionExclusive);
      if (!r.isEmpty()) {
        result += text.getValueOfRange(r);
      }
      return result;
    }
    applyToString(str) {
      const strText = new StringText(str);
      return this.apply(strText);
    }
    getNewRanges() {
      const newRanges = [];
      let previousEditEndLineNumber = 0;
      let lineOffset = 0;
      let columnOffset = 0;
      for (const replacement of this.replacements) {
        const textLength = TextLength.ofText(replacement.text);
        const newRangeStart = Position.lift({
          lineNumber: replacement.range.startLineNumber + lineOffset,
          column: replacement.range.startColumn + (replacement.range.startLineNumber === previousEditEndLineNumber ? columnOffset : 0)
        });
        const newRange = textLength.createRange(newRangeStart);
        newRanges.push(newRange);
        lineOffset = newRange.endLineNumber - replacement.range.endLineNumber;
        columnOffset = newRange.endColumn - replacement.range.endColumn;
        previousEditEndLineNumber = replacement.range.endLineNumber;
      }
      return newRanges;
    }
    toReplacement(text) {
      if (this.replacements.length === 0) {
        throw new BugIndicatingError();
      }
      if (this.replacements.length === 1) {
        return this.replacements[0];
      }
      const startPos = this.replacements[0].range.getStartPosition();
      const endPos = this.replacements[this.replacements.length - 1].range.getEndPosition();
      let newText = "";
      for (let i = 0; i < this.replacements.length; i++) {
        const curEdit = this.replacements[i];
        newText += curEdit.text;
        if (i < this.replacements.length - 1) {
          const nextEdit = this.replacements[i + 1];
          const gapRange = Range.fromPositions(curEdit.range.getEndPosition(), nextEdit.range.getStartPosition());
          const gapText = text.getValueOfRange(gapRange);
          newText += gapText;
        }
      }
      return new TextReplacement(Range.fromPositions(startPos, endPos), newText);
    }
    toString(text) {
      if (text === void 0) {
        return this.replacements.map((edit) => edit.toString()).join("\n");
      }
      if (typeof text === "string") {
        return this.toString(new StringText(text));
      }
      if (this.replacements.length === 0) {
        return "";
      }
      return this.replacements.map((r) => {
        const maxLength = 10;
        const originalText = text.getValueOfRange(r.range);
        const beforeRange = Range.fromPositions(new Position(Math.max(1, r.range.startLineNumber - 1), 1), r.range.getStartPosition());
        let beforeText = text.getValueOfRange(beforeRange);
        if (beforeText.length > maxLength) {
          beforeText = "..." + beforeText.substring(beforeText.length - maxLength);
        }
        const afterRange = Range.fromPositions(r.range.getEndPosition(), new Position(r.range.endLineNumber + 1, 1));
        let afterText = text.getValueOfRange(afterRange);
        if (afterText.length > maxLength) {
          afterText = afterText.substring(0, maxLength) + "...";
        }
        let replacedText = originalText;
        if (replacedText.length > maxLength) {
          const halfMax = Math.floor(maxLength / 2);
          replacedText = replacedText.substring(0, halfMax) + "..." + replacedText.substring(replacedText.length - halfMax);
        }
        let newText = r.text;
        if (newText.length > maxLength) {
          const halfMax = Math.floor(maxLength / 2);
          newText = newText.substring(0, halfMax) + "..." + newText.substring(newText.length - halfMax);
        }
        if (replacedText.length === 0) {
          return `${beforeText}❰${newText}❱${afterText}`;
        }
        return `${beforeText}❰${replacedText}↦${newText}❱${afterText}`;
      }).join("\n");
    }
  }
  class TextReplacement {
    static joinReplacements(replacements, initialValue) {
      if (replacements.length === 0) {
        throw new BugIndicatingError();
      }
      if (replacements.length === 1) {
        return replacements[0];
      }
      const startPos = replacements[0].range.getStartPosition();
      const endPos = replacements[replacements.length - 1].range.getEndPosition();
      let newText = "";
      for (let i = 0; i < replacements.length; i++) {
        const curEdit = replacements[i];
        newText += curEdit.text;
        if (i < replacements.length - 1) {
          const nextEdit = replacements[i + 1];
          const gapRange = Range.fromPositions(curEdit.range.getEndPosition(), nextEdit.range.getStartPosition());
          const gapText = initialValue.getValueOfRange(gapRange);
          newText += gapText;
        }
      }
      return new TextReplacement(Range.fromPositions(startPos, endPos), newText);
    }
    static fromStringReplacement(replacement, initialState) {
      return new TextReplacement(initialState.getTransformer().getRange(replacement.replaceRange), replacement.newText);
    }
    static delete(range2) {
      return new TextReplacement(range2, "");
    }
    constructor(range2, text) {
      this.range = range2;
      this.text = text;
    }
    get isEmpty() {
      return this.range.isEmpty() && this.text.length === 0;
    }
    static equals(first2, second) {
      return first2.range.equalsRange(second.range) && first2.text === second.text;
    }
    equals(other) {
      return TextReplacement.equals(this, other);
    }
    removeCommonPrefixAndSuffix(text) {
      const prefix = this.removeCommonPrefix(text);
      const suffix = prefix.removeCommonSuffix(text);
      return suffix;
    }
    removeCommonPrefix(text) {
      const normalizedOriginalText = text.getValueOfRange(this.range).replaceAll("\r\n", "\n");
      const normalizedModifiedText = this.text.replaceAll("\r\n", "\n");
      const commonPrefixLen = commonPrefixLength(normalizedOriginalText, normalizedModifiedText);
      const start = TextLength.ofText(normalizedOriginalText.substring(0, commonPrefixLen)).addToPosition(this.range.getStartPosition());
      const newText = normalizedModifiedText.substring(commonPrefixLen);
      const range2 = Range.fromPositions(start, this.range.getEndPosition());
      return new TextReplacement(range2, newText);
    }
    removeCommonSuffix(text) {
      const normalizedOriginalText = text.getValueOfRange(this.range).replaceAll("\r\n", "\n");
      const normalizedModifiedText = this.text.replaceAll("\r\n", "\n");
      const commonSuffixLen = commonSuffixLength(normalizedOriginalText, normalizedModifiedText);
      const end = TextLength.ofText(normalizedOriginalText.substring(0, normalizedOriginalText.length - commonSuffixLen)).addToPosition(this.range.getStartPosition());
      const newText = normalizedModifiedText.substring(0, normalizedModifiedText.length - commonSuffixLen);
      const range2 = Range.fromPositions(this.range.getStartPosition(), end);
      return new TextReplacement(range2, newText);
    }
    toString() {
      const start = this.range.getStartPosition();
      const end = this.range.getEndPosition();
      return `(${start.lineNumber},${start.column} -> ${end.lineNumber},${end.column}): "${this.text}"`;
    }
  }
  function rangeFromPositions(start, end) {
    if (start.lineNumber === end.lineNumber && start.column === Number.MAX_SAFE_INTEGER) {
      return Range.fromPositions(end, end);
    } else if (!start.isBeforeOrEqual(end)) {
      throw new BugIndicatingError("start must be before end");
    }
    return new Range(start.lineNumber, start.column, end.lineNumber, end.column);
  }
  class LineRangeMapping {
    static inverse(mapping, originalLineCount, modifiedLineCount) {
      const result = [];
      let lastOriginalEndLineNumber = 1;
      let lastModifiedEndLineNumber = 1;
      for (const m of mapping) {
        const r2 = new LineRangeMapping(new LineRange(lastOriginalEndLineNumber, m.original.startLineNumber), new LineRange(lastModifiedEndLineNumber, m.modified.startLineNumber));
        if (!r2.modified.isEmpty) {
          result.push(r2);
        }
        lastOriginalEndLineNumber = m.original.endLineNumberExclusive;
        lastModifiedEndLineNumber = m.modified.endLineNumberExclusive;
      }
      const r = new LineRangeMapping(new LineRange(lastOriginalEndLineNumber, originalLineCount + 1), new LineRange(lastModifiedEndLineNumber, modifiedLineCount + 1));
      if (!r.modified.isEmpty) {
        result.push(r);
      }
      return result;
    }
    static clip(mapping, originalRange, modifiedRange) {
      const result = [];
      for (const m of mapping) {
        const original = m.original.intersect(originalRange);
        const modified = m.modified.intersect(modifiedRange);
        if (original && !original.isEmpty && modified && !modified.isEmpty) {
          result.push(new LineRangeMapping(original, modified));
        }
      }
      return result;
    }
    constructor(originalRange, modifiedRange) {
      this.original = originalRange;
      this.modified = modifiedRange;
    }
    toString() {
      return `{${this.original.toString()}->${this.modified.toString()}}`;
    }
    flip() {
      return new LineRangeMapping(this.modified, this.original);
    }
    join(other) {
      return new LineRangeMapping(this.original.join(other.original), this.modified.join(other.modified));
    }
    /**
     * This method assumes that the LineRangeMapping describes a valid diff!
     * I.e. if one range is empty, the other range cannot be the entire document.
     * It avoids various problems when the line range points to non-existing line-numbers.
    */
    toRangeMapping() {
      const origInclusiveRange = this.original.toInclusiveRange();
      const modInclusiveRange = this.modified.toInclusiveRange();
      if (origInclusiveRange && modInclusiveRange) {
        return new RangeMapping(origInclusiveRange, modInclusiveRange);
      } else if (this.original.startLineNumber === 1 || this.modified.startLineNumber === 1) {
        if (!(this.modified.startLineNumber === 1 && this.original.startLineNumber === 1)) {
          throw new BugIndicatingError("not a valid diff");
        }
        return new RangeMapping(new Range(this.original.startLineNumber, 1, this.original.endLineNumberExclusive, 1), new Range(this.modified.startLineNumber, 1, this.modified.endLineNumberExclusive, 1));
      } else {
        return new RangeMapping(new Range(this.original.startLineNumber - 1, Number.MAX_SAFE_INTEGER, this.original.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), new Range(this.modified.startLineNumber - 1, Number.MAX_SAFE_INTEGER, this.modified.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER));
      }
    }
    /**
     * This method assumes that the LineRangeMapping describes a valid diff!
     * I.e. if one range is empty, the other range cannot be the entire document.
     * It avoids various problems when the line range points to non-existing line-numbers.
    */
    toRangeMapping2(original, modified) {
      if (isValidLineNumber(this.original.endLineNumberExclusive, original) && isValidLineNumber(this.modified.endLineNumberExclusive, modified)) {
        return new RangeMapping(new Range(this.original.startLineNumber, 1, this.original.endLineNumberExclusive, 1), new Range(this.modified.startLineNumber, 1, this.modified.endLineNumberExclusive, 1));
      }
      if (!this.original.isEmpty && !this.modified.isEmpty) {
        return new RangeMapping(Range.fromPositions(new Position(this.original.startLineNumber, 1), normalizePosition(new Position(this.original.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), original)), Range.fromPositions(new Position(this.modified.startLineNumber, 1), normalizePosition(new Position(this.modified.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), modified)));
      }
      if (this.original.startLineNumber > 1 && this.modified.startLineNumber > 1) {
        return new RangeMapping(Range.fromPositions(normalizePosition(new Position(this.original.startLineNumber - 1, Number.MAX_SAFE_INTEGER), original), normalizePosition(new Position(this.original.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), original)), Range.fromPositions(normalizePosition(new Position(this.modified.startLineNumber - 1, Number.MAX_SAFE_INTEGER), modified), normalizePosition(new Position(this.modified.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER), modified)));
      }
      throw new BugIndicatingError();
    }
  }
  function normalizePosition(position, content) {
    if (position.lineNumber < 1) {
      return new Position(1, 1);
    }
    if (position.lineNumber > content.length) {
      return new Position(content.length, content[content.length - 1].length + 1);
    }
    const line = content[position.lineNumber - 1];
    if (position.column > line.length + 1) {
      return new Position(position.lineNumber, line.length + 1);
    }
    return position;
  }
  function isValidLineNumber(lineNumber, lines) {
    return lineNumber >= 1 && lineNumber <= lines.length;
  }
  class DetailedLineRangeMapping extends LineRangeMapping {
    static fromRangeMappings(rangeMappings) {
      const originalRange = LineRange.join(rangeMappings.map((r) => LineRange.fromRangeInclusive(r.originalRange)));
      const modifiedRange = LineRange.join(rangeMappings.map((r) => LineRange.fromRangeInclusive(r.modifiedRange)));
      return new DetailedLineRangeMapping(originalRange, modifiedRange, rangeMappings);
    }
    constructor(originalRange, modifiedRange, innerChanges) {
      super(originalRange, modifiedRange);
      this.innerChanges = innerChanges;
    }
    flip() {
      return new DetailedLineRangeMapping(this.modified, this.original, this.innerChanges?.map((c) => c.flip()));
    }
    withInnerChangesFromLineRanges() {
      return new DetailedLineRangeMapping(this.original, this.modified, [this.toRangeMapping()]);
    }
  }
  class RangeMapping {
    static fromEdit(edit) {
      const newRanges = edit.getNewRanges();
      const result = edit.replacements.map((e, idx) => new RangeMapping(e.range, newRanges[idx]));
      return result;
    }
    static assertSorted(rangeMappings) {
      for (let i = 1; i < rangeMappings.length; i++) {
        const previous = rangeMappings[i - 1];
        const current = rangeMappings[i];
        if (!(previous.originalRange.getEndPosition().isBeforeOrEqual(current.originalRange.getStartPosition()) && previous.modifiedRange.getEndPosition().isBeforeOrEqual(current.modifiedRange.getStartPosition()))) {
          throw new BugIndicatingError("Range mappings must be sorted");
        }
      }
    }
    constructor(originalRange, modifiedRange) {
      this.originalRange = originalRange;
      this.modifiedRange = modifiedRange;
    }
    toString() {
      return `{${this.originalRange.toString()}->${this.modifiedRange.toString()}}`;
    }
    flip() {
      return new RangeMapping(this.modifiedRange, this.originalRange);
    }
    /**
     * Creates a single text edit that describes the change from the original to the modified text.
    */
    toTextEdit(modified) {
      const newText = modified.getValueOfRange(this.modifiedRange);
      return new TextReplacement(this.originalRange, newText);
    }
  }
  function lineRangeMappingFromRangeMappings(alignments, originalLines, modifiedLines, dontAssertStartLine = false) {
    const changes = [];
    for (const g of groupAdjacentBy(alignments.map((a) => getLineRangeMapping(a, originalLines, modifiedLines)), (a1, a2) => a1.original.intersectsOrTouches(a2.original) || a1.modified.intersectsOrTouches(a2.modified))) {
      const first2 = g[0];
      const last = g[g.length - 1];
      changes.push(new DetailedLineRangeMapping(first2.original.join(last.original), first2.modified.join(last.modified), g.map((a) => a.innerChanges[0])));
    }
    assertFn(() => {
      if (!dontAssertStartLine && changes.length > 0) {
        if (changes[0].modified.startLineNumber !== changes[0].original.startLineNumber) {
          return false;
        }
        if (modifiedLines.length.lineCount - changes[changes.length - 1].modified.endLineNumberExclusive !== originalLines.length.lineCount - changes[changes.length - 1].original.endLineNumberExclusive) {
          return false;
        }
      }
      return checkAdjacentItems(changes, (m1, m2) => m2.original.startLineNumber - m1.original.endLineNumberExclusive === m2.modified.startLineNumber - m1.modified.endLineNumberExclusive && // There has to be an unchanged line in between (otherwise both diffs should have been joined)
      m1.original.endLineNumberExclusive < m2.original.startLineNumber && m1.modified.endLineNumberExclusive < m2.modified.startLineNumber);
    });
    return changes;
  }
  function getLineRangeMapping(rangeMapping, originalLines, modifiedLines) {
    let lineStartDelta = 0;
    let lineEndDelta = 0;
    if (rangeMapping.modifiedRange.endColumn === 1 && rangeMapping.originalRange.endColumn === 1 && rangeMapping.originalRange.startLineNumber + lineStartDelta <= rangeMapping.originalRange.endLineNumber && rangeMapping.modifiedRange.startLineNumber + lineStartDelta <= rangeMapping.modifiedRange.endLineNumber) {
      lineEndDelta = -1;
    }
    if (rangeMapping.modifiedRange.startColumn - 1 >= modifiedLines.getLineLength(rangeMapping.modifiedRange.startLineNumber) && rangeMapping.originalRange.startColumn - 1 >= originalLines.getLineLength(rangeMapping.originalRange.startLineNumber) && rangeMapping.originalRange.startLineNumber <= rangeMapping.originalRange.endLineNumber + lineEndDelta && rangeMapping.modifiedRange.startLineNumber <= rangeMapping.modifiedRange.endLineNumber + lineEndDelta) {
      lineStartDelta = 1;
    }
    const originalLineRange = new LineRange(rangeMapping.originalRange.startLineNumber + lineStartDelta, rangeMapping.originalRange.endLineNumber + 1 + lineEndDelta);
    const modifiedLineRange = new LineRange(rangeMapping.modifiedRange.startLineNumber + lineStartDelta, rangeMapping.modifiedRange.endLineNumber + 1 + lineEndDelta);
    return new DetailedLineRangeMapping(originalLineRange, modifiedLineRange, [rangeMapping]);
  }
  const MINIMUM_MATCHING_CHARACTER_LENGTH = 3;
  class LegacyLinesDiffComputer {
    computeDiff(originalLines, modifiedLines, options) {
      const diffComputer = new DiffComputer(originalLines, modifiedLines, {
        maxComputationTime: options.maxComputationTimeMs,
        shouldIgnoreTrimWhitespace: options.ignoreTrimWhitespace,
        shouldComputeCharChanges: true,
        shouldMakePrettyDiff: true,
        shouldPostProcessCharChanges: true
      });
      const result = diffComputer.computeDiff();
      const changes = [];
      let lastChange = null;
      for (const c of result.changes) {
        let originalRange;
        if (c.originalEndLineNumber === 0) {
          originalRange = new LineRange(c.originalStartLineNumber + 1, c.originalStartLineNumber + 1);
        } else {
          originalRange = new LineRange(c.originalStartLineNumber, c.originalEndLineNumber + 1);
        }
        let modifiedRange;
        if (c.modifiedEndLineNumber === 0) {
          modifiedRange = new LineRange(c.modifiedStartLineNumber + 1, c.modifiedStartLineNumber + 1);
        } else {
          modifiedRange = new LineRange(c.modifiedStartLineNumber, c.modifiedEndLineNumber + 1);
        }
        let change = new DetailedLineRangeMapping(originalRange, modifiedRange, c.charChanges?.map((c2) => new RangeMapping(new Range(c2.originalStartLineNumber, c2.originalStartColumn, c2.originalEndLineNumber, c2.originalEndColumn), new Range(c2.modifiedStartLineNumber, c2.modifiedStartColumn, c2.modifiedEndLineNumber, c2.modifiedEndColumn))));
        if (lastChange) {
          if (lastChange.modified.endLineNumberExclusive === change.modified.startLineNumber || lastChange.original.endLineNumberExclusive === change.original.startLineNumber) {
            change = new DetailedLineRangeMapping(lastChange.original.join(change.original), lastChange.modified.join(change.modified), lastChange.innerChanges && change.innerChanges ? lastChange.innerChanges.concat(change.innerChanges) : void 0);
            changes.pop();
          }
        }
        changes.push(change);
        lastChange = change;
      }
      assertFn(() => {
        return checkAdjacentItems(changes, (m1, m2) => m2.original.startLineNumber - m1.original.endLineNumberExclusive === m2.modified.startLineNumber - m1.modified.endLineNumberExclusive && // There has to be an unchanged line in between (otherwise both diffs should have been joined)
        m1.original.endLineNumberExclusive < m2.original.startLineNumber && m1.modified.endLineNumberExclusive < m2.modified.startLineNumber);
      });
      return new LinesDiff(changes, [], result.quitEarly);
    }
  }
  function computeDiff(originalSequence, modifiedSequence, continueProcessingPredicate, pretty) {
    const diffAlgo = new LcsDiff(originalSequence, modifiedSequence, continueProcessingPredicate);
    return diffAlgo.ComputeDiff(pretty);
  }
  let LineSequence$1 = class LineSequence {
    constructor(lines) {
      const startColumns = [];
      const endColumns = [];
      for (let i = 0, length = lines.length; i < length; i++) {
        startColumns[i] = getFirstNonBlankColumn(lines[i], 1);
        endColumns[i] = getLastNonBlankColumn(lines[i], 1);
      }
      this.lines = lines;
      this._startColumns = startColumns;
      this._endColumns = endColumns;
    }
    getElements() {
      const elements = [];
      for (let i = 0, len = this.lines.length; i < len; i++) {
        elements[i] = this.lines[i].substring(this._startColumns[i] - 1, this._endColumns[i] - 1);
      }
      return elements;
    }
    getStrictElement(index) {
      return this.lines[index];
    }
    getStartLineNumber(i) {
      return i + 1;
    }
    getEndLineNumber(i) {
      return i + 1;
    }
    createCharSequence(shouldIgnoreTrimWhitespace, startIndex, endIndex) {
      const charCodes = [];
      const lineNumbers = [];
      const columns = [];
      let len = 0;
      for (let index = startIndex; index <= endIndex; index++) {
        const lineContent = this.lines[index];
        const startColumn = shouldIgnoreTrimWhitespace ? this._startColumns[index] : 1;
        const endColumn = shouldIgnoreTrimWhitespace ? this._endColumns[index] : lineContent.length + 1;
        for (let col = startColumn; col < endColumn; col++) {
          charCodes[len] = lineContent.charCodeAt(col - 1);
          lineNumbers[len] = index + 1;
          columns[len] = col;
          len++;
        }
        if (!shouldIgnoreTrimWhitespace && index < endIndex) {
          charCodes[len] = 10;
          lineNumbers[len] = index + 1;
          columns[len] = lineContent.length + 1;
          len++;
        }
      }
      return new CharSequence(charCodes, lineNumbers, columns);
    }
  };
  class CharSequence {
    constructor(charCodes, lineNumbers, columns) {
      this._charCodes = charCodes;
      this._lineNumbers = lineNumbers;
      this._columns = columns;
    }
    toString() {
      return "[" + this._charCodes.map((s, idx) => (s === 10 ? "\\n" : String.fromCharCode(s)) + `-(${this._lineNumbers[idx]},${this._columns[idx]})`).join(", ") + "]";
    }
    _assertIndex(index, arr) {
      if (index < 0 || index >= arr.length) {
        throw new Error(`Illegal index`);
      }
    }
    getElements() {
      return this._charCodes;
    }
    getStartLineNumber(i) {
      if (i > 0 && i === this._lineNumbers.length) {
        return this.getEndLineNumber(i - 1);
      }
      this._assertIndex(i, this._lineNumbers);
      return this._lineNumbers[i];
    }
    getEndLineNumber(i) {
      if (i === -1) {
        return this.getStartLineNumber(i + 1);
      }
      this._assertIndex(i, this._lineNumbers);
      if (this._charCodes[i] === 10) {
        return this._lineNumbers[i] + 1;
      }
      return this._lineNumbers[i];
    }
    getStartColumn(i) {
      if (i > 0 && i === this._columns.length) {
        return this.getEndColumn(i - 1);
      }
      this._assertIndex(i, this._columns);
      return this._columns[i];
    }
    getEndColumn(i) {
      if (i === -1) {
        return this.getStartColumn(i + 1);
      }
      this._assertIndex(i, this._columns);
      if (this._charCodes[i] === 10) {
        return 1;
      }
      return this._columns[i] + 1;
    }
  }
  class CharChange {
    constructor(originalStartLineNumber, originalStartColumn, originalEndLineNumber, originalEndColumn, modifiedStartLineNumber, modifiedStartColumn, modifiedEndLineNumber, modifiedEndColumn) {
      this.originalStartLineNumber = originalStartLineNumber;
      this.originalStartColumn = originalStartColumn;
      this.originalEndLineNumber = originalEndLineNumber;
      this.originalEndColumn = originalEndColumn;
      this.modifiedStartLineNumber = modifiedStartLineNumber;
      this.modifiedStartColumn = modifiedStartColumn;
      this.modifiedEndLineNumber = modifiedEndLineNumber;
      this.modifiedEndColumn = modifiedEndColumn;
    }
    static createFromDiffChange(diffChange, originalCharSequence, modifiedCharSequence) {
      const originalStartLineNumber = originalCharSequence.getStartLineNumber(diffChange.originalStart);
      const originalStartColumn = originalCharSequence.getStartColumn(diffChange.originalStart);
      const originalEndLineNumber = originalCharSequence.getEndLineNumber(diffChange.originalStart + diffChange.originalLength - 1);
      const originalEndColumn = originalCharSequence.getEndColumn(diffChange.originalStart + diffChange.originalLength - 1);
      const modifiedStartLineNumber = modifiedCharSequence.getStartLineNumber(diffChange.modifiedStart);
      const modifiedStartColumn = modifiedCharSequence.getStartColumn(diffChange.modifiedStart);
      const modifiedEndLineNumber = modifiedCharSequence.getEndLineNumber(diffChange.modifiedStart + diffChange.modifiedLength - 1);
      const modifiedEndColumn = modifiedCharSequence.getEndColumn(diffChange.modifiedStart + diffChange.modifiedLength - 1);
      return new CharChange(originalStartLineNumber, originalStartColumn, originalEndLineNumber, originalEndColumn, modifiedStartLineNumber, modifiedStartColumn, modifiedEndLineNumber, modifiedEndColumn);
    }
  }
  function postProcessCharChanges(rawChanges) {
    if (rawChanges.length <= 1) {
      return rawChanges;
    }
    const result = [rawChanges[0]];
    let prevChange = result[0];
    for (let i = 1, len = rawChanges.length; i < len; i++) {
      const currChange = rawChanges[i];
      const originalMatchingLength = currChange.originalStart - (prevChange.originalStart + prevChange.originalLength);
      const modifiedMatchingLength = currChange.modifiedStart - (prevChange.modifiedStart + prevChange.modifiedLength);
      const matchingLength = Math.min(originalMatchingLength, modifiedMatchingLength);
      if (matchingLength < MINIMUM_MATCHING_CHARACTER_LENGTH) {
        prevChange.originalLength = currChange.originalStart + currChange.originalLength - prevChange.originalStart;
        prevChange.modifiedLength = currChange.modifiedStart + currChange.modifiedLength - prevChange.modifiedStart;
      } else {
        result.push(currChange);
        prevChange = currChange;
      }
    }
    return result;
  }
  class LineChange {
    constructor(originalStartLineNumber, originalEndLineNumber, modifiedStartLineNumber, modifiedEndLineNumber, charChanges) {
      this.originalStartLineNumber = originalStartLineNumber;
      this.originalEndLineNumber = originalEndLineNumber;
      this.modifiedStartLineNumber = modifiedStartLineNumber;
      this.modifiedEndLineNumber = modifiedEndLineNumber;
      this.charChanges = charChanges;
    }
    static createFromDiffResult(shouldIgnoreTrimWhitespace, diffChange, originalLineSequence, modifiedLineSequence, continueCharDiff, shouldComputeCharChanges, shouldPostProcessCharChanges) {
      let originalStartLineNumber;
      let originalEndLineNumber;
      let modifiedStartLineNumber;
      let modifiedEndLineNumber;
      let charChanges = void 0;
      if (diffChange.originalLength === 0) {
        originalStartLineNumber = originalLineSequence.getStartLineNumber(diffChange.originalStart) - 1;
        originalEndLineNumber = 0;
      } else {
        originalStartLineNumber = originalLineSequence.getStartLineNumber(diffChange.originalStart);
        originalEndLineNumber = originalLineSequence.getEndLineNumber(diffChange.originalStart + diffChange.originalLength - 1);
      }
      if (diffChange.modifiedLength === 0) {
        modifiedStartLineNumber = modifiedLineSequence.getStartLineNumber(diffChange.modifiedStart) - 1;
        modifiedEndLineNumber = 0;
      } else {
        modifiedStartLineNumber = modifiedLineSequence.getStartLineNumber(diffChange.modifiedStart);
        modifiedEndLineNumber = modifiedLineSequence.getEndLineNumber(diffChange.modifiedStart + diffChange.modifiedLength - 1);
      }
      if (shouldComputeCharChanges && diffChange.originalLength > 0 && diffChange.originalLength < 20 && diffChange.modifiedLength > 0 && diffChange.modifiedLength < 20 && continueCharDiff()) {
        const originalCharSequence = originalLineSequence.createCharSequence(shouldIgnoreTrimWhitespace, diffChange.originalStart, diffChange.originalStart + diffChange.originalLength - 1);
        const modifiedCharSequence = modifiedLineSequence.createCharSequence(shouldIgnoreTrimWhitespace, diffChange.modifiedStart, diffChange.modifiedStart + diffChange.modifiedLength - 1);
        if (originalCharSequence.getElements().length > 0 && modifiedCharSequence.getElements().length > 0) {
          let rawChanges = computeDiff(originalCharSequence, modifiedCharSequence, continueCharDiff, true).changes;
          if (shouldPostProcessCharChanges) {
            rawChanges = postProcessCharChanges(rawChanges);
          }
          charChanges = [];
          for (let i = 0, length = rawChanges.length; i < length; i++) {
            charChanges.push(CharChange.createFromDiffChange(rawChanges[i], originalCharSequence, modifiedCharSequence));
          }
        }
      }
      return new LineChange(originalStartLineNumber, originalEndLineNumber, modifiedStartLineNumber, modifiedEndLineNumber, charChanges);
    }
  }
  class DiffComputer {
    constructor(originalLines, modifiedLines, opts) {
      this.shouldComputeCharChanges = opts.shouldComputeCharChanges;
      this.shouldPostProcessCharChanges = opts.shouldPostProcessCharChanges;
      this.shouldIgnoreTrimWhitespace = opts.shouldIgnoreTrimWhitespace;
      this.shouldMakePrettyDiff = opts.shouldMakePrettyDiff;
      this.originalLines = originalLines;
      this.modifiedLines = modifiedLines;
      this.original = new LineSequence$1(originalLines);
      this.modified = new LineSequence$1(modifiedLines);
      this.continueLineDiff = createContinueProcessingPredicate(opts.maxComputationTime);
      this.continueCharDiff = createContinueProcessingPredicate(opts.maxComputationTime === 0 ? 0 : Math.min(opts.maxComputationTime, 5e3));
    }
    computeDiff() {
      if (this.original.lines.length === 1 && this.original.lines[0].length === 0) {
        if (this.modified.lines.length === 1 && this.modified.lines[0].length === 0) {
          return {
            quitEarly: false,
            changes: []
          };
        }
        return {
          quitEarly: false,
          changes: [{
            originalStartLineNumber: 1,
            originalEndLineNumber: 1,
            modifiedStartLineNumber: 1,
            modifiedEndLineNumber: this.modified.lines.length,
            charChanges: void 0
          }]
        };
      }
      if (this.modified.lines.length === 1 && this.modified.lines[0].length === 0) {
        return {
          quitEarly: false,
          changes: [{
            originalStartLineNumber: 1,
            originalEndLineNumber: this.original.lines.length,
            modifiedStartLineNumber: 1,
            modifiedEndLineNumber: 1,
            charChanges: void 0
          }]
        };
      }
      const diffResult = computeDiff(this.original, this.modified, this.continueLineDiff, this.shouldMakePrettyDiff);
      const rawChanges = diffResult.changes;
      const quitEarly = diffResult.quitEarly;
      if (this.shouldIgnoreTrimWhitespace) {
        const lineChanges = [];
        for (let i = 0, length = rawChanges.length; i < length; i++) {
          lineChanges.push(LineChange.createFromDiffResult(this.shouldIgnoreTrimWhitespace, rawChanges[i], this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
        }
        return {
          quitEarly,
          changes: lineChanges
        };
      }
      const result = [];
      let originalLineIndex = 0;
      let modifiedLineIndex = 0;
      for (let i = -1, len = rawChanges.length; i < len; i++) {
        const nextChange = i + 1 < len ? rawChanges[i + 1] : null;
        const originalStop = nextChange ? nextChange.originalStart : this.originalLines.length;
        const modifiedStop = nextChange ? nextChange.modifiedStart : this.modifiedLines.length;
        while (originalLineIndex < originalStop && modifiedLineIndex < modifiedStop) {
          const originalLine = this.originalLines[originalLineIndex];
          const modifiedLine = this.modifiedLines[modifiedLineIndex];
          if (originalLine !== modifiedLine) {
            {
              let originalStartColumn = getFirstNonBlankColumn(originalLine, 1);
              let modifiedStartColumn = getFirstNonBlankColumn(modifiedLine, 1);
              while (originalStartColumn > 1 && modifiedStartColumn > 1) {
                const originalChar = originalLine.charCodeAt(originalStartColumn - 2);
                const modifiedChar = modifiedLine.charCodeAt(modifiedStartColumn - 2);
                if (originalChar !== modifiedChar) {
                  break;
                }
                originalStartColumn--;
                modifiedStartColumn--;
              }
              if (originalStartColumn > 1 || modifiedStartColumn > 1) {
                this._pushTrimWhitespaceCharChange(result, originalLineIndex + 1, 1, originalStartColumn, modifiedLineIndex + 1, 1, modifiedStartColumn);
              }
            }
            {
              let originalEndColumn = getLastNonBlankColumn(originalLine, 1);
              let modifiedEndColumn = getLastNonBlankColumn(modifiedLine, 1);
              const originalMaxColumn = originalLine.length + 1;
              const modifiedMaxColumn = modifiedLine.length + 1;
              while (originalEndColumn < originalMaxColumn && modifiedEndColumn < modifiedMaxColumn) {
                const originalChar = originalLine.charCodeAt(originalEndColumn - 1);
                const modifiedChar = originalLine.charCodeAt(modifiedEndColumn - 1);
                if (originalChar !== modifiedChar) {
                  break;
                }
                originalEndColumn++;
                modifiedEndColumn++;
              }
              if (originalEndColumn < originalMaxColumn || modifiedEndColumn < modifiedMaxColumn) {
                this._pushTrimWhitespaceCharChange(result, originalLineIndex + 1, originalEndColumn, originalMaxColumn, modifiedLineIndex + 1, modifiedEndColumn, modifiedMaxColumn);
              }
            }
          }
          originalLineIndex++;
          modifiedLineIndex++;
        }
        if (nextChange) {
          result.push(LineChange.createFromDiffResult(this.shouldIgnoreTrimWhitespace, nextChange, this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
          originalLineIndex += nextChange.originalLength;
          modifiedLineIndex += nextChange.modifiedLength;
        }
      }
      return {
        quitEarly,
        changes: result
      };
    }
    _pushTrimWhitespaceCharChange(result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn) {
      if (this._mergeTrimWhitespaceCharChange(result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn)) {
        return;
      }
      let charChanges = void 0;
      if (this.shouldComputeCharChanges) {
        charChanges = [new CharChange(originalLineNumber, originalStartColumn, originalLineNumber, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedLineNumber, modifiedEndColumn)];
      }
      result.push(new LineChange(originalLineNumber, originalLineNumber, modifiedLineNumber, modifiedLineNumber, charChanges));
    }
    _mergeTrimWhitespaceCharChange(result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn) {
      const len = result.length;
      if (len === 0) {
        return false;
      }
      const prevChange = result[len - 1];
      if (prevChange.originalEndLineNumber === 0 || prevChange.modifiedEndLineNumber === 0) {
        return false;
      }
      if (prevChange.originalEndLineNumber === originalLineNumber && prevChange.modifiedEndLineNumber === modifiedLineNumber) {
        if (this.shouldComputeCharChanges && prevChange.charChanges) {
          prevChange.charChanges.push(new CharChange(originalLineNumber, originalStartColumn, originalLineNumber, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedLineNumber, modifiedEndColumn));
        }
        return true;
      }
      if (prevChange.originalEndLineNumber + 1 === originalLineNumber && prevChange.modifiedEndLineNumber + 1 === modifiedLineNumber) {
        prevChange.originalEndLineNumber = originalLineNumber;
        prevChange.modifiedEndLineNumber = modifiedLineNumber;
        if (this.shouldComputeCharChanges && prevChange.charChanges) {
          prevChange.charChanges.push(new CharChange(originalLineNumber, originalStartColumn, originalLineNumber, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedLineNumber, modifiedEndColumn));
        }
        return true;
      }
      return false;
    }
  }
  function getFirstNonBlankColumn(txt, defaultValue) {
    const r = firstNonWhitespaceIndex(txt);
    if (r === -1) {
      return defaultValue;
    }
    return r + 1;
  }
  function getLastNonBlankColumn(txt, defaultValue) {
    const r = lastNonWhitespaceIndex(txt);
    if (r === -1) {
      return defaultValue;
    }
    return r + 2;
  }
  function createContinueProcessingPredicate(maximumRuntime) {
    if (maximumRuntime === 0) {
      return () => true;
    }
    const startTime = Date.now();
    return () => {
      return Date.now() - startTime < maximumRuntime;
    };
  }
  class DiffAlgorithmResult {
    static trivial(seq1, seq2) {
      return new DiffAlgorithmResult([new SequenceDiff(OffsetRange.ofLength(seq1.length), OffsetRange.ofLength(seq2.length))], false);
    }
    static trivialTimedOut(seq1, seq2) {
      return new DiffAlgorithmResult([new SequenceDiff(OffsetRange.ofLength(seq1.length), OffsetRange.ofLength(seq2.length))], true);
    }
    constructor(diffs, hitTimeout) {
      this.diffs = diffs;
      this.hitTimeout = hitTimeout;
    }
  }
  class SequenceDiff {
    static invert(sequenceDiffs, doc1Length) {
      const result = [];
      forEachAdjacent(sequenceDiffs, (a, b) => {
        result.push(SequenceDiff.fromOffsetPairs(a ? a.getEndExclusives() : OffsetPair.zero, b ? b.getStarts() : new OffsetPair(doc1Length, (a ? a.seq2Range.endExclusive - a.seq1Range.endExclusive : 0) + doc1Length)));
      });
      return result;
    }
    static fromOffsetPairs(start, endExclusive) {
      return new SequenceDiff(new OffsetRange(start.offset1, endExclusive.offset1), new OffsetRange(start.offset2, endExclusive.offset2));
    }
    static assertSorted(sequenceDiffs) {
      let last = void 0;
      for (const cur of sequenceDiffs) {
        if (last) {
          if (!(last.seq1Range.endExclusive <= cur.seq1Range.start && last.seq2Range.endExclusive <= cur.seq2Range.start)) {
            throw new BugIndicatingError("Sequence diffs must be sorted");
          }
        }
        last = cur;
      }
    }
    constructor(seq1Range, seq2Range) {
      this.seq1Range = seq1Range;
      this.seq2Range = seq2Range;
    }
    swap() {
      return new SequenceDiff(this.seq2Range, this.seq1Range);
    }
    toString() {
      return `${this.seq1Range} <-> ${this.seq2Range}`;
    }
    join(other) {
      return new SequenceDiff(this.seq1Range.join(other.seq1Range), this.seq2Range.join(other.seq2Range));
    }
    delta(offset) {
      if (offset === 0) {
        return this;
      }
      return new SequenceDiff(this.seq1Range.delta(offset), this.seq2Range.delta(offset));
    }
    deltaStart(offset) {
      if (offset === 0) {
        return this;
      }
      return new SequenceDiff(this.seq1Range.deltaStart(offset), this.seq2Range.deltaStart(offset));
    }
    deltaEnd(offset) {
      if (offset === 0) {
        return this;
      }
      return new SequenceDiff(this.seq1Range.deltaEnd(offset), this.seq2Range.deltaEnd(offset));
    }
    intersect(other) {
      const i1 = this.seq1Range.intersect(other.seq1Range);
      const i2 = this.seq2Range.intersect(other.seq2Range);
      if (!i1 || !i2) {
        return void 0;
      }
      return new SequenceDiff(i1, i2);
    }
    getStarts() {
      return new OffsetPair(this.seq1Range.start, this.seq2Range.start);
    }
    getEndExclusives() {
      return new OffsetPair(this.seq1Range.endExclusive, this.seq2Range.endExclusive);
    }
  }
  const _OffsetPair = class _OffsetPair {
    constructor(offset1, offset2) {
      this.offset1 = offset1;
      this.offset2 = offset2;
    }
    toString() {
      return `${this.offset1} <-> ${this.offset2}`;
    }
    delta(offset) {
      if (offset === 0) {
        return this;
      }
      return new _OffsetPair(this.offset1 + offset, this.offset2 + offset);
    }
    equals(other) {
      return this.offset1 === other.offset1 && this.offset2 === other.offset2;
    }
  };
  _OffsetPair.zero = new _OffsetPair(0, 0);
  _OffsetPair.max = new _OffsetPair(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  let OffsetPair = _OffsetPair;
  const _InfiniteTimeout = class _InfiniteTimeout {
    isValid() {
      return true;
    }
  };
  _InfiniteTimeout.instance = new _InfiniteTimeout();
  let InfiniteTimeout = _InfiniteTimeout;
  class DateTimeout {
    constructor(timeout2) {
      this.timeout = timeout2;
      this.startTime = Date.now();
      this.valid = true;
      if (timeout2 <= 0) {
        throw new BugIndicatingError("timeout must be positive");
      }
    }
    // Recommendation: Set a log-point `{this.disable()}` in the body
    isValid() {
      const valid = Date.now() - this.startTime < this.timeout;
      if (!valid && this.valid) {
        this.valid = false;
      }
      return this.valid;
    }
  }
  class Array2D {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.array = [];
      this.array = new Array(width * height);
    }
    get(x, y) {
      return this.array[x + y * this.width];
    }
    set(x, y, value) {
      this.array[x + y * this.width] = value;
    }
  }
  function isSpace(charCode) {
    return charCode === 32 || charCode === 9;
  }
  const _LineRangeFragment = class _LineRangeFragment {
    static getKey(chr) {
      let key = this.chrKeys.get(chr);
      if (key === void 0) {
        key = this.chrKeys.size;
        this.chrKeys.set(chr, key);
      }
      return key;
    }
    constructor(range2, lines, source) {
      this.range = range2;
      this.lines = lines;
      this.source = source;
      this.histogram = [];
      let counter = 0;
      for (let i = range2.startLineNumber - 1; i < range2.endLineNumberExclusive - 1; i++) {
        const line = lines[i];
        for (let j = 0; j < line.length; j++) {
          counter++;
          const chr = line[j];
          const key2 = _LineRangeFragment.getKey(chr);
          this.histogram[key2] = (this.histogram[key2] || 0) + 1;
        }
        counter++;
        const key = _LineRangeFragment.getKey("\n");
        this.histogram[key] = (this.histogram[key] || 0) + 1;
      }
      this.totalCount = counter;
    }
    computeSimilarity(other) {
      let sumDifferences = 0;
      const maxLength = Math.max(this.histogram.length, other.histogram.length);
      for (let i = 0; i < maxLength; i++) {
        sumDifferences += Math.abs((this.histogram[i] ?? 0) - (other.histogram[i] ?? 0));
      }
      return 1 - sumDifferences / (this.totalCount + other.totalCount);
    }
  };
  _LineRangeFragment.chrKeys = /* @__PURE__ */ new Map();
  let LineRangeFragment = _LineRangeFragment;
  class DynamicProgrammingDiffing {
    compute(sequence1, sequence2, timeout2 = InfiniteTimeout.instance, equalityScore) {
      if (sequence1.length === 0 || sequence2.length === 0) {
        return DiffAlgorithmResult.trivial(sequence1, sequence2);
      }
      const lcsLengths = new Array2D(sequence1.length, sequence2.length);
      const directions = new Array2D(sequence1.length, sequence2.length);
      const lengths = new Array2D(sequence1.length, sequence2.length);
      for (let s12 = 0; s12 < sequence1.length; s12++) {
        for (let s22 = 0; s22 < sequence2.length; s22++) {
          if (!timeout2.isValid()) {
            return DiffAlgorithmResult.trivialTimedOut(sequence1, sequence2);
          }
          const horizontalLen = s12 === 0 ? 0 : lcsLengths.get(s12 - 1, s22);
          const verticalLen = s22 === 0 ? 0 : lcsLengths.get(s12, s22 - 1);
          let extendedSeqScore;
          if (sequence1.getElement(s12) === sequence2.getElement(s22)) {
            if (s12 === 0 || s22 === 0) {
              extendedSeqScore = 0;
            } else {
              extendedSeqScore = lcsLengths.get(s12 - 1, s22 - 1);
            }
            if (s12 > 0 && s22 > 0 && directions.get(s12 - 1, s22 - 1) === 3) {
              extendedSeqScore += lengths.get(s12 - 1, s22 - 1);
            }
            extendedSeqScore += equalityScore ? equalityScore(s12, s22) : 1;
          } else {
            extendedSeqScore = -1;
          }
          const newValue = Math.max(horizontalLen, verticalLen, extendedSeqScore);
          if (newValue === extendedSeqScore) {
            const prevLen = s12 > 0 && s22 > 0 ? lengths.get(s12 - 1, s22 - 1) : 0;
            lengths.set(s12, s22, prevLen + 1);
            directions.set(s12, s22, 3);
          } else if (newValue === horizontalLen) {
            lengths.set(s12, s22, 0);
            directions.set(s12, s22, 1);
          } else if (newValue === verticalLen) {
            lengths.set(s12, s22, 0);
            directions.set(s12, s22, 2);
          }
          lcsLengths.set(s12, s22, newValue);
        }
      }
      const result = [];
      let lastAligningPosS1 = sequence1.length;
      let lastAligningPosS2 = sequence2.length;
      function reportDecreasingAligningPositions(s12, s22) {
        if (s12 + 1 !== lastAligningPosS1 || s22 + 1 !== lastAligningPosS2) {
          result.push(new SequenceDiff(new OffsetRange(s12 + 1, lastAligningPosS1), new OffsetRange(s22 + 1, lastAligningPosS2)));
        }
        lastAligningPosS1 = s12;
        lastAligningPosS2 = s22;
      }
      let s1 = sequence1.length - 1;
      let s2 = sequence2.length - 1;
      while (s1 >= 0 && s2 >= 0) {
        if (directions.get(s1, s2) === 3) {
          reportDecreasingAligningPositions(s1, s2);
          s1--;
          s2--;
        } else {
          if (directions.get(s1, s2) === 1) {
            s1--;
          } else {
            s2--;
          }
        }
      }
      reportDecreasingAligningPositions(-1, -1);
      result.reverse();
      return new DiffAlgorithmResult(result, false);
    }
  }
  class MyersDiffAlgorithm {
    compute(seq1, seq2, timeout2 = InfiniteTimeout.instance) {
      if (seq1.length === 0 || seq2.length === 0) {
        return DiffAlgorithmResult.trivial(seq1, seq2);
      }
      const seqX = seq1;
      const seqY = seq2;
      function getXAfterSnake(x, y) {
        while (x < seqX.length && y < seqY.length && seqX.getElement(x) === seqY.getElement(y)) {
          x++;
          y++;
        }
        return x;
      }
      let d = 0;
      const V = new FastInt32Array();
      V.set(0, getXAfterSnake(0, 0));
      const paths = new FastArrayNegativeIndices();
      paths.set(0, V.get(0) === 0 ? null : new SnakePath(null, 0, 0, V.get(0)));
      let k = 0;
      loop: while (true) {
        d++;
        if (!timeout2.isValid()) {
          return DiffAlgorithmResult.trivialTimedOut(seqX, seqY);
        }
        const lowerBound = -Math.min(d, seqY.length + d % 2);
        const upperBound = Math.min(d, seqX.length + d % 2);
        for (k = lowerBound; k <= upperBound; k += 2) {
          const maxXofDLineTop = k === upperBound ? -1 : V.get(k + 1);
          const maxXofDLineLeft = k === lowerBound ? -1 : V.get(k - 1) + 1;
          const x = Math.min(Math.max(maxXofDLineTop, maxXofDLineLeft), seqX.length);
          const y = x - k;
          if (x > seqX.length || y > seqY.length) {
            continue;
          }
          const newMaxX = getXAfterSnake(x, y);
          V.set(k, newMaxX);
          const lastPath = x === maxXofDLineTop ? paths.get(k + 1) : paths.get(k - 1);
          paths.set(k, newMaxX !== x ? new SnakePath(lastPath, x, y, newMaxX - x) : lastPath);
          if (V.get(k) === seqX.length && V.get(k) - k === seqY.length) {
            break loop;
          }
        }
      }
      let path = paths.get(k);
      const result = [];
      let lastAligningPosS1 = seqX.length;
      let lastAligningPosS2 = seqY.length;
      while (true) {
        const endX = path ? path.x + path.length : 0;
        const endY = path ? path.y + path.length : 0;
        if (endX !== lastAligningPosS1 || endY !== lastAligningPosS2) {
          result.push(new SequenceDiff(new OffsetRange(endX, lastAligningPosS1), new OffsetRange(endY, lastAligningPosS2)));
        }
        if (!path) {
          break;
        }
        lastAligningPosS1 = path.x;
        lastAligningPosS2 = path.y;
        path = path.prev;
      }
      result.reverse();
      return new DiffAlgorithmResult(result, false);
    }
  }
  class SnakePath {
    constructor(prev, x, y, length) {
      this.prev = prev;
      this.x = x;
      this.y = y;
      this.length = length;
    }
  }
  class FastInt32Array {
    constructor() {
      this.positiveArr = new Int32Array(10);
      this.negativeArr = new Int32Array(10);
    }
    get(idx) {
      if (idx < 0) {
        idx = -idx - 1;
        return this.negativeArr[idx];
      } else {
        return this.positiveArr[idx];
      }
    }
    set(idx, value) {
      if (idx < 0) {
        idx = -idx - 1;
        if (idx >= this.negativeArr.length) {
          const arr = this.negativeArr;
          this.negativeArr = new Int32Array(arr.length * 2);
          this.negativeArr.set(arr);
        }
        this.negativeArr[idx] = value;
      } else {
        if (idx >= this.positiveArr.length) {
          const arr = this.positiveArr;
          this.positiveArr = new Int32Array(arr.length * 2);
          this.positiveArr.set(arr);
        }
        this.positiveArr[idx] = value;
      }
    }
  }
  class FastArrayNegativeIndices {
    constructor() {
      this.positiveArr = [];
      this.negativeArr = [];
    }
    get(idx) {
      if (idx < 0) {
        idx = -idx - 1;
        return this.negativeArr[idx];
      } else {
        return this.positiveArr[idx];
      }
    }
    set(idx, value) {
      if (idx < 0) {
        idx = -idx - 1;
        this.negativeArr[idx] = value;
      } else {
        this.positiveArr[idx] = value;
      }
    }
  }
  class LinesSliceCharSequence {
    constructor(lines, range2, considerWhitespaceChanges) {
      this.lines = lines;
      this.range = range2;
      this.considerWhitespaceChanges = considerWhitespaceChanges;
      this.elements = [];
      this.firstElementOffsetByLineIdx = [];
      this.lineStartOffsets = [];
      this.trimmedWsLengthsByLineIdx = [];
      this.firstElementOffsetByLineIdx.push(0);
      for (let lineNumber = this.range.startLineNumber; lineNumber <= this.range.endLineNumber; lineNumber++) {
        let line = lines[lineNumber - 1];
        let lineStartOffset = 0;
        if (lineNumber === this.range.startLineNumber && this.range.startColumn > 1) {
          lineStartOffset = this.range.startColumn - 1;
          line = line.substring(lineStartOffset);
        }
        this.lineStartOffsets.push(lineStartOffset);
        let trimmedWsLength = 0;
        if (!considerWhitespaceChanges) {
          const trimmedStartLine = line.trimStart();
          trimmedWsLength = line.length - trimmedStartLine.length;
          line = trimmedStartLine.trimEnd();
        }
        this.trimmedWsLengthsByLineIdx.push(trimmedWsLength);
        const lineLength = lineNumber === this.range.endLineNumber ? Math.min(this.range.endColumn - 1 - lineStartOffset - trimmedWsLength, line.length) : line.length;
        for (let i = 0; i < lineLength; i++) {
          this.elements.push(line.charCodeAt(i));
        }
        if (lineNumber < this.range.endLineNumber) {
          this.elements.push("\n".charCodeAt(0));
          this.firstElementOffsetByLineIdx.push(this.elements.length);
        }
      }
    }
    toString() {
      return `Slice: "${this.text}"`;
    }
    get text() {
      return this.getText(new OffsetRange(0, this.length));
    }
    getText(range2) {
      return this.elements.slice(range2.start, range2.endExclusive).map((e) => String.fromCharCode(e)).join("");
    }
    getElement(offset) {
      return this.elements[offset];
    }
    get length() {
      return this.elements.length;
    }
    getBoundaryScore(length) {
      const prevCategory = getCategory(length > 0 ? this.elements[length - 1] : -1);
      const nextCategory = getCategory(length < this.elements.length ? this.elements[length] : -1);
      if (prevCategory === 7 && nextCategory === 8) {
        return 0;
      }
      if (prevCategory === 8) {
        return 150;
      }
      let score2 = 0;
      if (prevCategory !== nextCategory) {
        score2 += 10;
        if (prevCategory === 0 && nextCategory === 1) {
          score2 += 1;
        }
      }
      score2 += getCategoryBoundaryScore(prevCategory);
      score2 += getCategoryBoundaryScore(nextCategory);
      return score2;
    }
    translateOffset(offset, preference = "right") {
      const i = findLastIdxMonotonous(this.firstElementOffsetByLineIdx, (value) => value <= offset);
      const lineOffset = offset - this.firstElementOffsetByLineIdx[i];
      return new Position(this.range.startLineNumber + i, 1 + this.lineStartOffsets[i] + lineOffset + (lineOffset === 0 && preference === "left" ? 0 : this.trimmedWsLengthsByLineIdx[i]));
    }
    translateRange(range2) {
      const pos1 = this.translateOffset(range2.start, "right");
      const pos2 = this.translateOffset(range2.endExclusive, "left");
      if (pos2.isBefore(pos1)) {
        return Range.fromPositions(pos2, pos2);
      }
      return Range.fromPositions(pos1, pos2);
    }
    /**
     * Finds the word that contains the character at the given offset
     */
    findWordContaining(offset) {
      if (offset < 0 || offset >= this.elements.length) {
        return void 0;
      }
      if (!isWordChar(this.elements[offset])) {
        return void 0;
      }
      let start = offset;
      while (start > 0 && isWordChar(this.elements[start - 1])) {
        start--;
      }
      let end = offset;
      while (end < this.elements.length && isWordChar(this.elements[end])) {
        end++;
      }
      return new OffsetRange(start, end);
    }
    /** fooBar has the two sub-words foo and bar */
    findSubWordContaining(offset) {
      if (offset < 0 || offset >= this.elements.length) {
        return void 0;
      }
      if (!isWordChar(this.elements[offset])) {
        return void 0;
      }
      let start = offset;
      while (start > 0 && isWordChar(this.elements[start - 1]) && !isUpperCase(this.elements[start])) {
        start--;
      }
      let end = offset;
      while (end < this.elements.length && isWordChar(this.elements[end]) && !isUpperCase(this.elements[end])) {
        end++;
      }
      return new OffsetRange(start, end);
    }
    countLinesIn(range2) {
      return this.translateOffset(range2.endExclusive).lineNumber - this.translateOffset(range2.start).lineNumber;
    }
    isStronglyEqual(offset1, offset2) {
      return this.elements[offset1] === this.elements[offset2];
    }
    extendToFullLines(range2) {
      const start = findLastMonotonous(this.firstElementOffsetByLineIdx, (x) => x <= range2.start) ?? 0;
      const end = findFirstMonotonous(this.firstElementOffsetByLineIdx, (x) => range2.endExclusive <= x) ?? this.elements.length;
      return new OffsetRange(start, end);
    }
  }
  function isWordChar(charCode) {
    return charCode >= 97 && charCode <= 122 || charCode >= 65 && charCode <= 90 || charCode >= 48 && charCode <= 57;
  }
  function isUpperCase(charCode) {
    return charCode >= 65 && charCode <= 90;
  }
  const score = {
    [
      0
      /* CharBoundaryCategory.WordLower */
    ]: 0,
    [
      1
      /* CharBoundaryCategory.WordUpper */
    ]: 0,
    [
      2
      /* CharBoundaryCategory.WordNumber */
    ]: 0,
    [
      3
      /* CharBoundaryCategory.End */
    ]: 10,
    [
      4
      /* CharBoundaryCategory.Other */
    ]: 2,
    [
      5
      /* CharBoundaryCategory.Separator */
    ]: 30,
    [
      6
      /* CharBoundaryCategory.Space */
    ]: 3,
    [
      7
      /* CharBoundaryCategory.LineBreakCR */
    ]: 10,
    [
      8
      /* CharBoundaryCategory.LineBreakLF */
    ]: 10
  };
  function getCategoryBoundaryScore(category) {
    return score[category];
  }
  function getCategory(charCode) {
    if (charCode === 10) {
      return 8;
    } else if (charCode === 13) {
      return 7;
    } else if (isSpace(charCode)) {
      return 6;
    } else if (charCode >= 97 && charCode <= 122) {
      return 0;
    } else if (charCode >= 65 && charCode <= 90) {
      return 1;
    } else if (charCode >= 48 && charCode <= 57) {
      return 2;
    } else if (charCode === -1) {
      return 3;
    } else if (charCode === 44 || charCode === 59) {
      return 5;
    } else {
      return 4;
    }
  }
  function computeMovedLines(changes, originalLines, modifiedLines, hashedOriginalLines, hashedModifiedLines, timeout2) {
    let { moves, excludedChanges } = computeMovesFromSimpleDeletionsToSimpleInsertions(changes, originalLines, modifiedLines, timeout2);
    if (!timeout2.isValid()) {
      return [];
    }
    const filteredChanges = changes.filter((c) => !excludedChanges.has(c));
    const unchangedMoves = computeUnchangedMoves(filteredChanges, hashedOriginalLines, hashedModifiedLines, originalLines, modifiedLines, timeout2);
    pushMany(moves, unchangedMoves);
    moves = joinCloseConsecutiveMoves(moves);
    moves = moves.filter((current) => {
      const lines = current.original.toOffsetRange().slice(originalLines).map((l) => l.trim());
      const originalText = lines.join("\n");
      return originalText.length >= 15 && countWhere(lines, (l) => l.length >= 2) >= 2;
    });
    moves = removeMovesInSameDiff(changes, moves);
    return moves;
  }
  function countWhere(arr, predicate) {
    let count = 0;
    for (const t of arr) {
      if (predicate(t)) {
        count++;
      }
    }
    return count;
  }
  function computeMovesFromSimpleDeletionsToSimpleInsertions(changes, originalLines, modifiedLines, timeout2) {
    const moves = [];
    const deletions = changes.filter((c) => c.modified.isEmpty && c.original.length >= 3).map((d) => new LineRangeFragment(d.original, originalLines, d));
    const insertions = new Set(changes.filter((c) => c.original.isEmpty && c.modified.length >= 3).map((d) => new LineRangeFragment(d.modified, modifiedLines, d)));
    const excludedChanges = /* @__PURE__ */ new Set();
    for (const deletion of deletions) {
      let highestSimilarity = -1;
      let best;
      for (const insertion of insertions) {
        const similarity = deletion.computeSimilarity(insertion);
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          best = insertion;
        }
      }
      if (highestSimilarity > 0.9 && best) {
        insertions.delete(best);
        moves.push(new LineRangeMapping(deletion.range, best.range));
        excludedChanges.add(deletion.source);
        excludedChanges.add(best.source);
      }
      if (!timeout2.isValid()) {
        return { moves, excludedChanges };
      }
    }
    return { moves, excludedChanges };
  }
  function computeUnchangedMoves(changes, hashedOriginalLines, hashedModifiedLines, originalLines, modifiedLines, timeout2) {
    const moves = [];
    const original3LineHashes = new SetMap();
    for (const change of changes) {
      for (let i = change.original.startLineNumber; i < change.original.endLineNumberExclusive - 2; i++) {
        const key = `${hashedOriginalLines[i - 1]}:${hashedOriginalLines[i + 1 - 1]}:${hashedOriginalLines[i + 2 - 1]}`;
        original3LineHashes.add(key, { range: new LineRange(i, i + 3) });
      }
    }
    const possibleMappings = [];
    changes.sort(compareBy((c) => c.modified.startLineNumber, numberComparator));
    for (const change of changes) {
      let lastMappings = [];
      for (let i = change.modified.startLineNumber; i < change.modified.endLineNumberExclusive - 2; i++) {
        const key = `${hashedModifiedLines[i - 1]}:${hashedModifiedLines[i + 1 - 1]}:${hashedModifiedLines[i + 2 - 1]}`;
        const currentModifiedRange = new LineRange(i, i + 3);
        const nextMappings = [];
        original3LineHashes.forEach(key, ({ range: range2 }) => {
          for (const lastMapping of lastMappings) {
            if (lastMapping.originalLineRange.endLineNumberExclusive + 1 === range2.endLineNumberExclusive && lastMapping.modifiedLineRange.endLineNumberExclusive + 1 === currentModifiedRange.endLineNumberExclusive) {
              lastMapping.originalLineRange = new LineRange(lastMapping.originalLineRange.startLineNumber, range2.endLineNumberExclusive);
              lastMapping.modifiedLineRange = new LineRange(lastMapping.modifiedLineRange.startLineNumber, currentModifiedRange.endLineNumberExclusive);
              nextMappings.push(lastMapping);
              return;
            }
          }
          const mapping = {
            modifiedLineRange: currentModifiedRange,
            originalLineRange: range2
          };
          possibleMappings.push(mapping);
          nextMappings.push(mapping);
        });
        lastMappings = nextMappings;
      }
      if (!timeout2.isValid()) {
        return [];
      }
    }
    possibleMappings.sort(reverseOrder(compareBy((m) => m.modifiedLineRange.length, numberComparator)));
    const modifiedSet = new LineRangeSet();
    const originalSet = new LineRangeSet();
    for (const mapping of possibleMappings) {
      const diffOrigToMod = mapping.modifiedLineRange.startLineNumber - mapping.originalLineRange.startLineNumber;
      const modifiedSections = modifiedSet.subtractFrom(mapping.modifiedLineRange);
      const originalTranslatedSections = originalSet.subtractFrom(mapping.originalLineRange).getWithDelta(diffOrigToMod);
      const modifiedIntersectedSections = modifiedSections.getIntersection(originalTranslatedSections);
      for (const s of modifiedIntersectedSections.ranges) {
        if (s.length < 3) {
          continue;
        }
        const modifiedLineRange = s;
        const originalLineRange = s.delta(-diffOrigToMod);
        moves.push(new LineRangeMapping(originalLineRange, modifiedLineRange));
        modifiedSet.addRange(modifiedLineRange);
        originalSet.addRange(originalLineRange);
      }
    }
    moves.sort(compareBy((m) => m.original.startLineNumber, numberComparator));
    const monotonousChanges = new MonotonousArray(changes);
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const firstTouchingChangeOrig = monotonousChanges.findLastMonotonous((c) => c.original.startLineNumber <= move.original.startLineNumber);
      const firstTouchingChangeMod = findLastMonotonous(changes, (c) => c.modified.startLineNumber <= move.modified.startLineNumber);
      const linesAbove = Math.max(move.original.startLineNumber - firstTouchingChangeOrig.original.startLineNumber, move.modified.startLineNumber - firstTouchingChangeMod.modified.startLineNumber);
      const lastTouchingChangeOrig = monotonousChanges.findLastMonotonous((c) => c.original.startLineNumber < move.original.endLineNumberExclusive);
      const lastTouchingChangeMod = findLastMonotonous(changes, (c) => c.modified.startLineNumber < move.modified.endLineNumberExclusive);
      const linesBelow = Math.max(lastTouchingChangeOrig.original.endLineNumberExclusive - move.original.endLineNumberExclusive, lastTouchingChangeMod.modified.endLineNumberExclusive - move.modified.endLineNumberExclusive);
      let extendToTop;
      for (extendToTop = 0; extendToTop < linesAbove; extendToTop++) {
        const origLine = move.original.startLineNumber - extendToTop - 1;
        const modLine = move.modified.startLineNumber - extendToTop - 1;
        if (origLine > originalLines.length || modLine > modifiedLines.length) {
          break;
        }
        if (modifiedSet.contains(modLine) || originalSet.contains(origLine)) {
          break;
        }
        if (!areLinesSimilar(originalLines[origLine - 1], modifiedLines[modLine - 1], timeout2)) {
          break;
        }
      }
      if (extendToTop > 0) {
        originalSet.addRange(new LineRange(move.original.startLineNumber - extendToTop, move.original.startLineNumber));
        modifiedSet.addRange(new LineRange(move.modified.startLineNumber - extendToTop, move.modified.startLineNumber));
      }
      let extendToBottom;
      for (extendToBottom = 0; extendToBottom < linesBelow; extendToBottom++) {
        const origLine = move.original.endLineNumberExclusive + extendToBottom;
        const modLine = move.modified.endLineNumberExclusive + extendToBottom;
        if (origLine > originalLines.length || modLine > modifiedLines.length) {
          break;
        }
        if (modifiedSet.contains(modLine) || originalSet.contains(origLine)) {
          break;
        }
        if (!areLinesSimilar(originalLines[origLine - 1], modifiedLines[modLine - 1], timeout2)) {
          break;
        }
      }
      if (extendToBottom > 0) {
        originalSet.addRange(new LineRange(move.original.endLineNumberExclusive, move.original.endLineNumberExclusive + extendToBottom));
        modifiedSet.addRange(new LineRange(move.modified.endLineNumberExclusive, move.modified.endLineNumberExclusive + extendToBottom));
      }
      if (extendToTop > 0 || extendToBottom > 0) {
        moves[i] = new LineRangeMapping(new LineRange(move.original.startLineNumber - extendToTop, move.original.endLineNumberExclusive + extendToBottom), new LineRange(move.modified.startLineNumber - extendToTop, move.modified.endLineNumberExclusive + extendToBottom));
      }
    }
    return moves;
  }
  function areLinesSimilar(line1, line2, timeout2) {
    if (line1.trim() === line2.trim()) {
      return true;
    }
    if (line1.length > 300 && line2.length > 300) {
      return false;
    }
    const myersDiffingAlgorithm = new MyersDiffAlgorithm();
    const result = myersDiffingAlgorithm.compute(new LinesSliceCharSequence([line1], new Range(1, 1, 1, line1.length), false), new LinesSliceCharSequence([line2], new Range(1, 1, 1, line2.length), false), timeout2);
    let commonNonSpaceCharCount = 0;
    const inverted = SequenceDiff.invert(result.diffs, line1.length);
    for (const seq of inverted) {
      seq.seq1Range.forEach((idx) => {
        if (!isSpace(line1.charCodeAt(idx))) {
          commonNonSpaceCharCount++;
        }
      });
    }
    function countNonWsChars(str) {
      let count = 0;
      for (let i = 0; i < line1.length; i++) {
        if (!isSpace(str.charCodeAt(i))) {
          count++;
        }
      }
      return count;
    }
    const longerLineLength = countNonWsChars(line1.length > line2.length ? line1 : line2);
    const r = commonNonSpaceCharCount / longerLineLength > 0.6 && longerLineLength > 10;
    return r;
  }
  function joinCloseConsecutiveMoves(moves) {
    if (moves.length === 0) {
      return moves;
    }
    moves.sort(compareBy((m) => m.original.startLineNumber, numberComparator));
    const result = [moves[0]];
    for (let i = 1; i < moves.length; i++) {
      const last = result[result.length - 1];
      const current = moves[i];
      const originalDist = current.original.startLineNumber - last.original.endLineNumberExclusive;
      const modifiedDist = current.modified.startLineNumber - last.modified.endLineNumberExclusive;
      const currentMoveAfterLast = originalDist >= 0 && modifiedDist >= 0;
      if (currentMoveAfterLast && originalDist + modifiedDist <= 2) {
        result[result.length - 1] = last.join(current);
        continue;
      }
      result.push(current);
    }
    return result;
  }
  function removeMovesInSameDiff(changes, moves) {
    const changesMonotonous = new MonotonousArray(changes);
    moves = moves.filter((m) => {
      const diffBeforeEndOfMoveOriginal = changesMonotonous.findLastMonotonous((c) => c.original.startLineNumber < m.original.endLineNumberExclusive) || new LineRangeMapping(new LineRange(1, 1), new LineRange(1, 1));
      const diffBeforeEndOfMoveModified = findLastMonotonous(changes, (c) => c.modified.startLineNumber < m.modified.endLineNumberExclusive);
      const differentDiffs = diffBeforeEndOfMoveOriginal !== diffBeforeEndOfMoveModified;
      return differentDiffs;
    });
    return moves;
  }
  function optimizeSequenceDiffs(sequence1, sequence2, sequenceDiffs) {
    let result = sequenceDiffs;
    result = joinSequenceDiffsByShifting(sequence1, sequence2, result);
    result = joinSequenceDiffsByShifting(sequence1, sequence2, result);
    result = shiftSequenceDiffs(sequence1, sequence2, result);
    return result;
  }
  function joinSequenceDiffsByShifting(sequence1, sequence2, sequenceDiffs) {
    if (sequenceDiffs.length === 0) {
      return sequenceDiffs;
    }
    const result = [];
    result.push(sequenceDiffs[0]);
    for (let i = 1; i < sequenceDiffs.length; i++) {
      const prevResult = result[result.length - 1];
      let cur = sequenceDiffs[i];
      if (cur.seq1Range.isEmpty || cur.seq2Range.isEmpty) {
        const length = cur.seq1Range.start - prevResult.seq1Range.endExclusive;
        let d;
        for (d = 1; d <= length; d++) {
          if (sequence1.getElement(cur.seq1Range.start - d) !== sequence1.getElement(cur.seq1Range.endExclusive - d) || sequence2.getElement(cur.seq2Range.start - d) !== sequence2.getElement(cur.seq2Range.endExclusive - d)) {
            break;
          }
        }
        d--;
        if (d === length) {
          result[result.length - 1] = new SequenceDiff(new OffsetRange(prevResult.seq1Range.start, cur.seq1Range.endExclusive - length), new OffsetRange(prevResult.seq2Range.start, cur.seq2Range.endExclusive - length));
          continue;
        }
        cur = cur.delta(-d);
      }
      result.push(cur);
    }
    const result2 = [];
    for (let i = 0; i < result.length - 1; i++) {
      const nextResult = result[i + 1];
      let cur = result[i];
      if (cur.seq1Range.isEmpty || cur.seq2Range.isEmpty) {
        const length = nextResult.seq1Range.start - cur.seq1Range.endExclusive;
        let d;
        for (d = 0; d < length; d++) {
          if (!sequence1.isStronglyEqual(cur.seq1Range.start + d, cur.seq1Range.endExclusive + d) || !sequence2.isStronglyEqual(cur.seq2Range.start + d, cur.seq2Range.endExclusive + d)) {
            break;
          }
        }
        if (d === length) {
          result[i + 1] = new SequenceDiff(new OffsetRange(cur.seq1Range.start + length, nextResult.seq1Range.endExclusive), new OffsetRange(cur.seq2Range.start + length, nextResult.seq2Range.endExclusive));
          continue;
        }
        if (d > 0) {
          cur = cur.delta(d);
        }
      }
      result2.push(cur);
    }
    if (result.length > 0) {
      result2.push(result[result.length - 1]);
    }
    return result2;
  }
  function shiftSequenceDiffs(sequence1, sequence2, sequenceDiffs) {
    if (!sequence1.getBoundaryScore || !sequence2.getBoundaryScore) {
      return sequenceDiffs;
    }
    for (let i = 0; i < sequenceDiffs.length; i++) {
      const prevDiff = i > 0 ? sequenceDiffs[i - 1] : void 0;
      const diff = sequenceDiffs[i];
      const nextDiff = i + 1 < sequenceDiffs.length ? sequenceDiffs[i + 1] : void 0;
      const seq1ValidRange = new OffsetRange(prevDiff ? prevDiff.seq1Range.endExclusive + 1 : 0, nextDiff ? nextDiff.seq1Range.start - 1 : sequence1.length);
      const seq2ValidRange = new OffsetRange(prevDiff ? prevDiff.seq2Range.endExclusive + 1 : 0, nextDiff ? nextDiff.seq2Range.start - 1 : sequence2.length);
      if (diff.seq1Range.isEmpty) {
        sequenceDiffs[i] = shiftDiffToBetterPosition(diff, sequence1, sequence2, seq1ValidRange, seq2ValidRange);
      } else if (diff.seq2Range.isEmpty) {
        sequenceDiffs[i] = shiftDiffToBetterPosition(diff.swap(), sequence2, sequence1, seq2ValidRange, seq1ValidRange).swap();
      }
    }
    return sequenceDiffs;
  }
  function shiftDiffToBetterPosition(diff, sequence1, sequence2, seq1ValidRange, seq2ValidRange) {
    const maxShiftLimit = 100;
    let deltaBefore = 1;
    while (diff.seq1Range.start - deltaBefore >= seq1ValidRange.start && diff.seq2Range.start - deltaBefore >= seq2ValidRange.start && sequence2.isStronglyEqual(diff.seq2Range.start - deltaBefore, diff.seq2Range.endExclusive - deltaBefore) && deltaBefore < maxShiftLimit) {
      deltaBefore++;
    }
    deltaBefore--;
    let deltaAfter = 0;
    while (diff.seq1Range.start + deltaAfter < seq1ValidRange.endExclusive && diff.seq2Range.endExclusive + deltaAfter < seq2ValidRange.endExclusive && sequence2.isStronglyEqual(diff.seq2Range.start + deltaAfter, diff.seq2Range.endExclusive + deltaAfter) && deltaAfter < maxShiftLimit) {
      deltaAfter++;
    }
    if (deltaBefore === 0 && deltaAfter === 0) {
      return diff;
    }
    let bestDelta = 0;
    let bestScore = -1;
    for (let delta = -deltaBefore; delta <= deltaAfter; delta++) {
      const seq2OffsetStart = diff.seq2Range.start + delta;
      const seq2OffsetEndExclusive = diff.seq2Range.endExclusive + delta;
      const seq1Offset = diff.seq1Range.start + delta;
      const score2 = sequence1.getBoundaryScore(seq1Offset) + sequence2.getBoundaryScore(seq2OffsetStart) + sequence2.getBoundaryScore(seq2OffsetEndExclusive);
      if (score2 > bestScore) {
        bestScore = score2;
        bestDelta = delta;
      }
    }
    return diff.delta(bestDelta);
  }
  function removeShortMatches(sequence1, sequence2, sequenceDiffs) {
    const result = [];
    for (const s of sequenceDiffs) {
      const last = result[result.length - 1];
      if (!last) {
        result.push(s);
        continue;
      }
      if (s.seq1Range.start - last.seq1Range.endExclusive <= 2 || s.seq2Range.start - last.seq2Range.endExclusive <= 2) {
        result[result.length - 1] = new SequenceDiff(last.seq1Range.join(s.seq1Range), last.seq2Range.join(s.seq2Range));
      } else {
        result.push(s);
      }
    }
    return result;
  }
  function extendDiffsToEntireWordIfAppropriate(sequence1, sequence2, sequenceDiffs, findParent, force = false) {
    const equalMappings = SequenceDiff.invert(sequenceDiffs, sequence1.length);
    const additional = [];
    let lastPoint = new OffsetPair(0, 0);
    function scanWord(pair, equalMapping) {
      if (pair.offset1 < lastPoint.offset1 || pair.offset2 < lastPoint.offset2) {
        return;
      }
      const w1 = findParent(sequence1, pair.offset1);
      const w2 = findParent(sequence2, pair.offset2);
      if (!w1 || !w2) {
        return;
      }
      let w = new SequenceDiff(w1, w2);
      const equalPart = w.intersect(equalMapping);
      let equalChars1 = equalPart.seq1Range.length;
      let equalChars2 = equalPart.seq2Range.length;
      while (equalMappings.length > 0) {
        const next = equalMappings[0];
        const intersects = next.seq1Range.intersects(w.seq1Range) || next.seq2Range.intersects(w.seq2Range);
        if (!intersects) {
          break;
        }
        const v1 = findParent(sequence1, next.seq1Range.start);
        const v2 = findParent(sequence2, next.seq2Range.start);
        const v = new SequenceDiff(v1, v2);
        const equalPart2 = v.intersect(next);
        equalChars1 += equalPart2.seq1Range.length;
        equalChars2 += equalPart2.seq2Range.length;
        w = w.join(v);
        if (w.seq1Range.endExclusive >= next.seq1Range.endExclusive) {
          equalMappings.shift();
        } else {
          break;
        }
      }
      if (force && equalChars1 + equalChars2 < w.seq1Range.length + w.seq2Range.length || equalChars1 + equalChars2 < (w.seq1Range.length + w.seq2Range.length) * 2 / 3) {
        additional.push(w);
      }
      lastPoint = w.getEndExclusives();
    }
    while (equalMappings.length > 0) {
      const next = equalMappings.shift();
      if (next.seq1Range.isEmpty) {
        continue;
      }
      scanWord(next.getStarts(), next);
      scanWord(next.getEndExclusives().delta(-1), next);
    }
    const merged = mergeSequenceDiffs(sequenceDiffs, additional);
    return merged;
  }
  function mergeSequenceDiffs(sequenceDiffs1, sequenceDiffs2) {
    const result = [];
    while (sequenceDiffs1.length > 0 || sequenceDiffs2.length > 0) {
      const sd1 = sequenceDiffs1[0];
      const sd2 = sequenceDiffs2[0];
      let next;
      if (sd1 && (!sd2 || sd1.seq1Range.start < sd2.seq1Range.start)) {
        next = sequenceDiffs1.shift();
      } else {
        next = sequenceDiffs2.shift();
      }
      if (result.length > 0 && result[result.length - 1].seq1Range.endExclusive >= next.seq1Range.start) {
        result[result.length - 1] = result[result.length - 1].join(next);
      } else {
        result.push(next);
      }
    }
    return result;
  }
  function removeVeryShortMatchingLinesBetweenDiffs(sequence1, _sequence2, sequenceDiffs) {
    let diffs = sequenceDiffs;
    if (diffs.length === 0) {
      return diffs;
    }
    let counter = 0;
    let shouldRepeat;
    do {
      shouldRepeat = false;
      const result = [
        diffs[0]
      ];
      for (let i = 1; i < diffs.length; i++) {
        let shouldJoinDiffs = function(before, after) {
          const unchangedRange = new OffsetRange(lastResult.seq1Range.endExclusive, cur.seq1Range.start);
          const unchangedText = sequence1.getText(unchangedRange);
          const unchangedTextWithoutWs = unchangedText.replace(/\s/g, "");
          if (unchangedTextWithoutWs.length <= 4 && (before.seq1Range.length + before.seq2Range.length > 5 || after.seq1Range.length + after.seq2Range.length > 5)) {
            return true;
          }
          return false;
        };
        const cur = diffs[i];
        const lastResult = result[result.length - 1];
        const shouldJoin = shouldJoinDiffs(lastResult, cur);
        if (shouldJoin) {
          shouldRepeat = true;
          result[result.length - 1] = result[result.length - 1].join(cur);
        } else {
          result.push(cur);
        }
      }
      diffs = result;
    } while (counter++ < 10 && shouldRepeat);
    return diffs;
  }
  function removeVeryShortMatchingTextBetweenLongDiffs(sequence1, sequence2, sequenceDiffs) {
    let diffs = sequenceDiffs;
    if (diffs.length === 0) {
      return diffs;
    }
    let counter = 0;
    let shouldRepeat;
    do {
      shouldRepeat = false;
      const result = [
        diffs[0]
      ];
      for (let i = 1; i < diffs.length; i++) {
        let shouldJoinDiffs = function(before, after) {
          const unchangedRange = new OffsetRange(lastResult.seq1Range.endExclusive, cur.seq1Range.start);
          const unchangedLineCount = sequence1.countLinesIn(unchangedRange);
          if (unchangedLineCount > 5 || unchangedRange.length > 500) {
            return false;
          }
          const unchangedText = sequence1.getText(unchangedRange).trim();
          if (unchangedText.length > 20 || unchangedText.split(/\r\n|\r|\n/).length > 1) {
            return false;
          }
          const beforeLineCount1 = sequence1.countLinesIn(before.seq1Range);
          const beforeSeq1Length = before.seq1Range.length;
          const beforeLineCount2 = sequence2.countLinesIn(before.seq2Range);
          const beforeSeq2Length = before.seq2Range.length;
          const afterLineCount1 = sequence1.countLinesIn(after.seq1Range);
          const afterSeq1Length = after.seq1Range.length;
          const afterLineCount2 = sequence2.countLinesIn(after.seq2Range);
          const afterSeq2Length = after.seq2Range.length;
          const max = 2 * 40 + 50;
          function cap(v) {
            return Math.min(v, max);
          }
          if (Math.pow(Math.pow(cap(beforeLineCount1 * 40 + beforeSeq1Length), 1.5) + Math.pow(cap(beforeLineCount2 * 40 + beforeSeq2Length), 1.5), 1.5) + Math.pow(Math.pow(cap(afterLineCount1 * 40 + afterSeq1Length), 1.5) + Math.pow(cap(afterLineCount2 * 40 + afterSeq2Length), 1.5), 1.5) > (max ** 1.5) ** 1.5 * 1.3) {
            return true;
          }
          return false;
        };
        const cur = diffs[i];
        const lastResult = result[result.length - 1];
        const shouldJoin = shouldJoinDiffs(lastResult, cur);
        if (shouldJoin) {
          shouldRepeat = true;
          result[result.length - 1] = result[result.length - 1].join(cur);
        } else {
          result.push(cur);
        }
      }
      diffs = result;
    } while (counter++ < 10 && shouldRepeat);
    const newDiffs = [];
    forEachWithNeighbors(diffs, (prev, cur, next) => {
      let newDiff = cur;
      function shouldMarkAsChanged(text) {
        return text.length > 0 && text.trim().length <= 3 && cur.seq1Range.length + cur.seq2Range.length > 100;
      }
      const fullRange1 = sequence1.extendToFullLines(cur.seq1Range);
      const prefix = sequence1.getText(new OffsetRange(fullRange1.start, cur.seq1Range.start));
      if (shouldMarkAsChanged(prefix)) {
        newDiff = newDiff.deltaStart(-prefix.length);
      }
      const suffix = sequence1.getText(new OffsetRange(cur.seq1Range.endExclusive, fullRange1.endExclusive));
      if (shouldMarkAsChanged(suffix)) {
        newDiff = newDiff.deltaEnd(suffix.length);
      }
      const availableSpace = SequenceDiff.fromOffsetPairs(prev ? prev.getEndExclusives() : OffsetPair.zero, next ? next.getStarts() : OffsetPair.max);
      const result = newDiff.intersect(availableSpace);
      if (newDiffs.length > 0 && result.getStarts().equals(newDiffs[newDiffs.length - 1].getEndExclusives())) {
        newDiffs[newDiffs.length - 1] = newDiffs[newDiffs.length - 1].join(result);
      } else {
        newDiffs.push(result);
      }
    });
    return newDiffs;
  }
  class LineSequence {
    constructor(trimmedHash, lines) {
      this.trimmedHash = trimmedHash;
      this.lines = lines;
    }
    getElement(offset) {
      return this.trimmedHash[offset];
    }
    get length() {
      return this.trimmedHash.length;
    }
    getBoundaryScore(length) {
      const indentationBefore = length === 0 ? 0 : getIndentation(this.lines[length - 1]);
      const indentationAfter = length === this.lines.length ? 0 : getIndentation(this.lines[length]);
      return 1e3 - (indentationBefore + indentationAfter);
    }
    getText(range2) {
      return this.lines.slice(range2.start, range2.endExclusive).join("\n");
    }
    isStronglyEqual(offset1, offset2) {
      return this.lines[offset1] === this.lines[offset2];
    }
  }
  function getIndentation(str) {
    let i = 0;
    while (i < str.length && (str.charCodeAt(i) === 32 || str.charCodeAt(i) === 9)) {
      i++;
    }
    return i;
  }
  class DefaultLinesDiffComputer {
    constructor() {
      this.dynamicProgrammingDiffing = new DynamicProgrammingDiffing();
      this.myersDiffingAlgorithm = new MyersDiffAlgorithm();
    }
    computeDiff(originalLines, modifiedLines, options) {
      if (originalLines.length <= 1 && equals$2(originalLines, modifiedLines, (a, b) => a === b)) {
        return new LinesDiff([], [], false);
      }
      if (originalLines.length === 1 && originalLines[0].length === 0 || modifiedLines.length === 1 && modifiedLines[0].length === 0) {
        return new LinesDiff([
          new DetailedLineRangeMapping(new LineRange(1, originalLines.length + 1), new LineRange(1, modifiedLines.length + 1), [
            new RangeMapping(new Range(1, 1, originalLines.length, originalLines[originalLines.length - 1].length + 1), new Range(1, 1, modifiedLines.length, modifiedLines[modifiedLines.length - 1].length + 1))
          ])
        ], [], false);
      }
      const timeout2 = options.maxComputationTimeMs === 0 ? InfiniteTimeout.instance : new DateTimeout(options.maxComputationTimeMs);
      const considerWhitespaceChanges = !options.ignoreTrimWhitespace;
      const perfectHashes = /* @__PURE__ */ new Map();
      function getOrCreateHash(text) {
        let hash2 = perfectHashes.get(text);
        if (hash2 === void 0) {
          hash2 = perfectHashes.size;
          perfectHashes.set(text, hash2);
        }
        return hash2;
      }
      const originalLinesHashes = originalLines.map((l) => getOrCreateHash(l.trim()));
      const modifiedLinesHashes = modifiedLines.map((l) => getOrCreateHash(l.trim()));
      const sequence1 = new LineSequence(originalLinesHashes, originalLines);
      const sequence2 = new LineSequence(modifiedLinesHashes, modifiedLines);
      const lineAlignmentResult = (() => {
        if (sequence1.length + sequence2.length < 1700) {
          return this.dynamicProgrammingDiffing.compute(sequence1, sequence2, timeout2, (offset1, offset2) => originalLines[offset1] === modifiedLines[offset2] ? modifiedLines[offset2].length === 0 ? 0.1 : 1 + Math.log(1 + modifiedLines[offset2].length) : 0.99);
        }
        return this.myersDiffingAlgorithm.compute(sequence1, sequence2, timeout2);
      })();
      let lineAlignments = lineAlignmentResult.diffs;
      let hitTimeout = lineAlignmentResult.hitTimeout;
      lineAlignments = optimizeSequenceDiffs(sequence1, sequence2, lineAlignments);
      lineAlignments = removeVeryShortMatchingLinesBetweenDiffs(sequence1, sequence2, lineAlignments);
      const alignments = [];
      const scanForWhitespaceChanges = (equalLinesCount) => {
        if (!considerWhitespaceChanges) {
          return;
        }
        for (let i = 0; i < equalLinesCount; i++) {
          const seq1Offset = seq1LastStart + i;
          const seq2Offset = seq2LastStart + i;
          if (originalLines[seq1Offset] !== modifiedLines[seq2Offset]) {
            const characterDiffs = this.refineDiff(originalLines, modifiedLines, new SequenceDiff(new OffsetRange(seq1Offset, seq1Offset + 1), new OffsetRange(seq2Offset, seq2Offset + 1)), timeout2, considerWhitespaceChanges, options);
            for (const a of characterDiffs.mappings) {
              alignments.push(a);
            }
            if (characterDiffs.hitTimeout) {
              hitTimeout = true;
            }
          }
        }
      };
      let seq1LastStart = 0;
      let seq2LastStart = 0;
      for (const diff of lineAlignments) {
        assertFn(() => diff.seq1Range.start - seq1LastStart === diff.seq2Range.start - seq2LastStart);
        const equalLinesCount = diff.seq1Range.start - seq1LastStart;
        scanForWhitespaceChanges(equalLinesCount);
        seq1LastStart = diff.seq1Range.endExclusive;
        seq2LastStart = diff.seq2Range.endExclusive;
        const characterDiffs = this.refineDiff(originalLines, modifiedLines, diff, timeout2, considerWhitespaceChanges, options);
        if (characterDiffs.hitTimeout) {
          hitTimeout = true;
        }
        for (const a of characterDiffs.mappings) {
          alignments.push(a);
        }
      }
      scanForWhitespaceChanges(originalLines.length - seq1LastStart);
      const original = new ArrayText(originalLines);
      const modified = new ArrayText(modifiedLines);
      const changes = lineRangeMappingFromRangeMappings(alignments, original, modified);
      let moves = [];
      if (options.computeMoves) {
        moves = this.computeMoves(changes, originalLines, modifiedLines, originalLinesHashes, modifiedLinesHashes, timeout2, considerWhitespaceChanges, options);
      }
      assertFn(() => {
        function validatePosition(pos, lines) {
          if (pos.lineNumber < 1 || pos.lineNumber > lines.length) {
            return false;
          }
          const line = lines[pos.lineNumber - 1];
          if (pos.column < 1 || pos.column > line.length + 1) {
            return false;
          }
          return true;
        }
        function validateRange(range2, lines) {
          if (range2.startLineNumber < 1 || range2.startLineNumber > lines.length + 1) {
            return false;
          }
          if (range2.endLineNumberExclusive < 1 || range2.endLineNumberExclusive > lines.length + 1) {
            return false;
          }
          return true;
        }
        for (const c of changes) {
          if (!c.innerChanges) {
            return false;
          }
          for (const ic of c.innerChanges) {
            const valid = validatePosition(ic.modifiedRange.getStartPosition(), modifiedLines) && validatePosition(ic.modifiedRange.getEndPosition(), modifiedLines) && validatePosition(ic.originalRange.getStartPosition(), originalLines) && validatePosition(ic.originalRange.getEndPosition(), originalLines);
            if (!valid) {
              return false;
            }
          }
          if (!validateRange(c.modified, modifiedLines) || !validateRange(c.original, originalLines)) {
            return false;
          }
        }
        return true;
      });
      return new LinesDiff(changes, moves, hitTimeout);
    }
    computeMoves(changes, originalLines, modifiedLines, hashedOriginalLines, hashedModifiedLines, timeout2, considerWhitespaceChanges, options) {
      const moves = computeMovedLines(changes, originalLines, modifiedLines, hashedOriginalLines, hashedModifiedLines, timeout2);
      const movesWithDiffs = moves.map((m) => {
        const moveChanges = this.refineDiff(originalLines, modifiedLines, new SequenceDiff(m.original.toOffsetRange(), m.modified.toOffsetRange()), timeout2, considerWhitespaceChanges, options);
        const mappings = lineRangeMappingFromRangeMappings(moveChanges.mappings, new ArrayText(originalLines), new ArrayText(modifiedLines), true);
        return new MovedText(m, mappings);
      });
      return movesWithDiffs;
    }
    refineDiff(originalLines, modifiedLines, diff, timeout2, considerWhitespaceChanges, options) {
      const lineRangeMapping = toLineRangeMapping(diff);
      const rangeMapping = lineRangeMapping.toRangeMapping2(originalLines, modifiedLines);
      const slice1 = new LinesSliceCharSequence(originalLines, rangeMapping.originalRange, considerWhitespaceChanges);
      const slice2 = new LinesSliceCharSequence(modifiedLines, rangeMapping.modifiedRange, considerWhitespaceChanges);
      const diffResult = slice1.length + slice2.length < 500 ? this.dynamicProgrammingDiffing.compute(slice1, slice2, timeout2) : this.myersDiffingAlgorithm.compute(slice1, slice2, timeout2);
      let diffs = diffResult.diffs;
      diffs = optimizeSequenceDiffs(slice1, slice2, diffs);
      diffs = extendDiffsToEntireWordIfAppropriate(slice1, slice2, diffs, (seq, idx) => seq.findWordContaining(idx));
      if (options.extendToSubwords) {
        diffs = extendDiffsToEntireWordIfAppropriate(slice1, slice2, diffs, (seq, idx) => seq.findSubWordContaining(idx), true);
      }
      diffs = removeShortMatches(slice1, slice2, diffs);
      diffs = removeVeryShortMatchingTextBetweenLongDiffs(slice1, slice2, diffs);
      const result = diffs.map((d) => new RangeMapping(slice1.translateRange(d.seq1Range), slice2.translateRange(d.seq2Range)));
      return {
        mappings: result,
        hitTimeout: diffResult.hitTimeout
      };
    }
  }
  function toLineRangeMapping(sequenceDiff) {
    return new LineRangeMapping(new LineRange(sequenceDiff.seq1Range.start + 1, sequenceDiff.seq1Range.endExclusive + 1), new LineRange(sequenceDiff.seq2Range.start + 1, sequenceDiff.seq2Range.endExclusive + 1));
  }
  const linesDiffComputers = {
    getLegacy: () => new LegacyLinesDiffComputer(),
    getDefault: () => new DefaultLinesDiffComputer()
  };
  function roundFloat(number, decimalPoints) {
    const decimal = Math.pow(10, decimalPoints);
    return Math.round(number * decimal) / decimal;
  }
  class RGBA {
    constructor(r, g, b, a = 1) {
      this._rgbaBrand = void 0;
      this.r = Math.min(255, Math.max(0, r)) | 0;
      this.g = Math.min(255, Math.max(0, g)) | 0;
      this.b = Math.min(255, Math.max(0, b)) | 0;
      this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
    }
    static equals(a, b) {
      return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
    }
  }
  class HSLA {
    constructor(h, s, l, a) {
      this._hslaBrand = void 0;
      this.h = Math.max(Math.min(360, h), 0) | 0;
      this.s = roundFloat(Math.max(Math.min(1, s), 0), 3);
      this.l = roundFloat(Math.max(Math.min(1, l), 0), 3);
      this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
    }
    static equals(a, b) {
      return a.h === b.h && a.s === b.s && a.l === b.l && a.a === b.a;
    }
    /**
     * Converts an RGB color value to HSL. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns h in the set [0, 360], s, and l in the set [0, 1].
     */
    static fromRGBA(rgba) {
      const r = rgba.r / 255;
      const g = rgba.g / 255;
      const b = rgba.b / 255;
      const a = rgba.a;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (min + max) / 2;
      const chroma = max - min;
      if (chroma > 0) {
        s = Math.min(l <= 0.5 ? chroma / (2 * l) : chroma / (2 - 2 * l), 1);
        switch (max) {
          case r:
            h = (g - b) / chroma + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / chroma + 2;
            break;
          case b:
            h = (r - g) / chroma + 4;
            break;
        }
        h *= 60;
        h = Math.round(h);
      }
      return new HSLA(h, s, l, a);
    }
    static _hue2rgb(p, q, t) {
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      }
      if (t < 1 / 2) {
        return q;
      }
      if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
      }
      return p;
    }
    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h in the set [0, 360] s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     */
    static toRGBA(hsla) {
      const h = hsla.h / 360;
      const { s, l, a } = hsla;
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = HSLA._hue2rgb(p, q, h + 1 / 3);
        g = HSLA._hue2rgb(p, q, h);
        b = HSLA._hue2rgb(p, q, h - 1 / 3);
      }
      return new RGBA(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a);
    }
  }
  class HSVA {
    constructor(h, s, v, a) {
      this._hsvaBrand = void 0;
      this.h = Math.max(Math.min(360, h), 0) | 0;
      this.s = roundFloat(Math.max(Math.min(1, s), 0), 3);
      this.v = roundFloat(Math.max(Math.min(1, v), 0), 3);
      this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
    }
    static equals(a, b) {
      return a.h === b.h && a.s === b.s && a.v === b.v && a.a === b.a;
    }
    // from http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
    static fromRGBA(rgba) {
      const r = rgba.r / 255;
      const g = rgba.g / 255;
      const b = rgba.b / 255;
      const cmax = Math.max(r, g, b);
      const cmin = Math.min(r, g, b);
      const delta = cmax - cmin;
      const s = cmax === 0 ? 0 : delta / cmax;
      let m;
      if (delta === 0) {
        m = 0;
      } else if (cmax === r) {
        m = ((g - b) / delta % 6 + 6) % 6;
      } else if (cmax === g) {
        m = (b - r) / delta + 2;
      } else {
        m = (r - g) / delta + 4;
      }
      return new HSVA(Math.round(m * 60), s, cmax, rgba.a);
    }
    // from http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
    static toRGBA(hsva) {
      const { h, s, v, a } = hsva;
      const c = v * s;
      const x = c * (1 - Math.abs(h / 60 % 2 - 1));
      const m = v - c;
      let [r, g, b] = [0, 0, 0];
      if (h < 60) {
        r = c;
        g = x;
      } else if (h < 120) {
        r = x;
        g = c;
      } else if (h < 180) {
        g = c;
        b = x;
      } else if (h < 240) {
        g = x;
        b = c;
      } else if (h < 300) {
        r = x;
        b = c;
      } else if (h <= 360) {
        r = c;
        b = x;
      }
      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);
      return new RGBA(r, g, b, a);
    }
  }
  const _Color = class _Color {
    static fromHex(hex) {
      return _Color.Format.CSS.parseHex(hex) || _Color.red;
    }
    static equals(a, b) {
      if (!a && !b) {
        return true;
      }
      if (!a || !b) {
        return false;
      }
      return a.equals(b);
    }
    get hsla() {
      if (this._hsla) {
        return this._hsla;
      } else {
        return HSLA.fromRGBA(this.rgba);
      }
    }
    get hsva() {
      if (this._hsva) {
        return this._hsva;
      }
      return HSVA.fromRGBA(this.rgba);
    }
    constructor(arg) {
      if (!arg) {
        throw new Error("Color needs a value");
      } else if (arg instanceof RGBA) {
        this.rgba = arg;
      } else if (arg instanceof HSLA) {
        this._hsla = arg;
        this.rgba = HSLA.toRGBA(arg);
      } else if (arg instanceof HSVA) {
        this._hsva = arg;
        this.rgba = HSVA.toRGBA(arg);
      } else {
        throw new Error("Invalid color ctor argument");
      }
    }
    equals(other) {
      return !!other && RGBA.equals(this.rgba, other.rgba) && HSLA.equals(this.hsla, other.hsla) && HSVA.equals(this.hsva, other.hsva);
    }
    /**
     * http://www.w3.org/TR/WCAG20/#relativeluminancedef
     * Returns the number in the set [0, 1]. O => Darkest Black. 1 => Lightest white.
     */
    getRelativeLuminance() {
      const R = _Color._relativeLuminanceForComponent(this.rgba.r);
      const G = _Color._relativeLuminanceForComponent(this.rgba.g);
      const B = _Color._relativeLuminanceForComponent(this.rgba.b);
      const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
      return roundFloat(luminance, 4);
    }
    static _relativeLuminanceForComponent(color) {
      const c = color / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }
    /**
     *	http://24ways.org/2010/calculating-color-contrast
     *  Return 'true' if lighter color otherwise 'false'
     */
    isLighter() {
      const yiq = (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1e3;
      return yiq >= 128;
    }
    isLighterThan(another) {
      const lum1 = this.getRelativeLuminance();
      const lum2 = another.getRelativeLuminance();
      return lum1 > lum2;
    }
    isDarkerThan(another) {
      const lum1 = this.getRelativeLuminance();
      const lum2 = another.getRelativeLuminance();
      return lum1 < lum2;
    }
    lighten(factor) {
      return new _Color(new HSLA(this.hsla.h, this.hsla.s, this.hsla.l + this.hsla.l * factor, this.hsla.a));
    }
    darken(factor) {
      return new _Color(new HSLA(this.hsla.h, this.hsla.s, this.hsla.l - this.hsla.l * factor, this.hsla.a));
    }
    transparent(factor) {
      const { r, g, b, a } = this.rgba;
      return new _Color(new RGBA(r, g, b, a * factor));
    }
    isTransparent() {
      return this.rgba.a === 0;
    }
    isOpaque() {
      return this.rgba.a === 1;
    }
    opposite() {
      return new _Color(new RGBA(255 - this.rgba.r, 255 - this.rgba.g, 255 - this.rgba.b, this.rgba.a));
    }
    /**
     * Mixes the current color with the provided color based on the given factor.
     * @param color The color to mix with
     * @param factor The factor of mixing (0 means this color, 1 means the input color, 0.5 means equal mix)
     * @returns A new color representing the mix
     */
    mix(color, factor = 0.5) {
      const normalize2 = Math.min(Math.max(factor, 0), 1);
      const thisRGBA = this.rgba;
      const otherRGBA = color.rgba;
      const r = thisRGBA.r + (otherRGBA.r - thisRGBA.r) * normalize2;
      const g = thisRGBA.g + (otherRGBA.g - thisRGBA.g) * normalize2;
      const b = thisRGBA.b + (otherRGBA.b - thisRGBA.b) * normalize2;
      const a = thisRGBA.a + (otherRGBA.a - thisRGBA.a) * normalize2;
      return new _Color(new RGBA(r, g, b, a));
    }
    makeOpaque(opaqueBackground) {
      if (this.isOpaque() || opaqueBackground.rgba.a !== 1) {
        return this;
      }
      const { r, g, b, a } = this.rgba;
      return new _Color(new RGBA(opaqueBackground.rgba.r - a * (opaqueBackground.rgba.r - r), opaqueBackground.rgba.g - a * (opaqueBackground.rgba.g - g), opaqueBackground.rgba.b - a * (opaqueBackground.rgba.b - b), 1));
    }
    toString() {
      if (!this._toString) {
        this._toString = _Color.Format.CSS.format(this);
      }
      return this._toString;
    }
    toNumber32Bit() {
      if (!this._toNumber32Bit) {
        this._toNumber32Bit = (this.rgba.r << 24 | this.rgba.g << 16 | this.rgba.b << 8 | this.rgba.a * 255 << 0) >>> 0;
      }
      return this._toNumber32Bit;
    }
    static getLighterColor(of, relative2, factor) {
      if (of.isLighterThan(relative2)) {
        return of;
      }
      factor = factor ? factor : 0.5;
      const lum1 = of.getRelativeLuminance();
      const lum2 = relative2.getRelativeLuminance();
      factor = factor * (lum2 - lum1) / lum2;
      return of.lighten(factor);
    }
    static getDarkerColor(of, relative2, factor) {
      if (of.isDarkerThan(relative2)) {
        return of;
      }
      factor = factor ? factor : 0.5;
      const lum1 = of.getRelativeLuminance();
      const lum2 = relative2.getRelativeLuminance();
      factor = factor * (lum1 - lum2) / lum1;
      return of.darken(factor);
    }
  };
  _Color.white = new _Color(new RGBA(255, 255, 255, 1));
  _Color.black = new _Color(new RGBA(0, 0, 0, 1));
  _Color.red = new _Color(new RGBA(255, 0, 0, 1));
  _Color.blue = new _Color(new RGBA(0, 0, 255, 1));
  _Color.green = new _Color(new RGBA(0, 255, 0, 1));
  _Color.cyan = new _Color(new RGBA(0, 255, 255, 1));
  _Color.lightgrey = new _Color(new RGBA(211, 211, 211, 1));
  _Color.transparent = new _Color(new RGBA(0, 0, 0, 0));
  let Color = _Color;
  (function(Color2) {
    (function(Format) {
      (function(CSS) {
        function formatRGB(color) {
          if (color.rgba.a === 1) {
            return `rgb(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b})`;
          }
          return Color2.Format.CSS.formatRGBA(color);
        }
        CSS.formatRGB = formatRGB;
        function formatRGBA(color) {
          return `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${+color.rgba.a.toFixed(2)})`;
        }
        CSS.formatRGBA = formatRGBA;
        function formatHSL(color) {
          if (color.hsla.a === 1) {
            return `hsl(${color.hsla.h}, ${Math.round(color.hsla.s * 100)}%, ${Math.round(color.hsla.l * 100)}%)`;
          }
          return Color2.Format.CSS.formatHSLA(color);
        }
        CSS.formatHSL = formatHSL;
        function formatHSLA(color) {
          return `hsla(${color.hsla.h}, ${Math.round(color.hsla.s * 100)}%, ${Math.round(color.hsla.l * 100)}%, ${color.hsla.a.toFixed(2)})`;
        }
        CSS.formatHSLA = formatHSLA;
        function _toTwoDigitHex(n) {
          const r = n.toString(16);
          return r.length !== 2 ? "0" + r : r;
        }
        function formatHex(color) {
          return `#${_toTwoDigitHex(color.rgba.r)}${_toTwoDigitHex(color.rgba.g)}${_toTwoDigitHex(color.rgba.b)}`;
        }
        CSS.formatHex = formatHex;
        function formatHexA(color, compact = false) {
          if (compact && color.rgba.a === 1) {
            return Color2.Format.CSS.formatHex(color);
          }
          return `#${_toTwoDigitHex(color.rgba.r)}${_toTwoDigitHex(color.rgba.g)}${_toTwoDigitHex(color.rgba.b)}${_toTwoDigitHex(Math.round(color.rgba.a * 255))}`;
        }
        CSS.formatHexA = formatHexA;
        function format2(color) {
          if (color.isOpaque()) {
            return Color2.Format.CSS.formatHex(color);
          }
          return Color2.Format.CSS.formatRGBA(color);
        }
        CSS.format = format2;
        function parse(css) {
          if (css === "transparent") {
            return Color2.transparent;
          }
          if (css.startsWith("#")) {
            return parseHex(css);
          }
          if (css.startsWith("rgba(")) {
            const color = css.match(/rgba\((?<r>(?:\+|-)?\d+), *(?<g>(?:\+|-)?\d+), *(?<b>(?:\+|-)?\d+), *(?<a>(?:\+|-)?\d+(\.\d+)?)\)/);
            if (!color) {
              throw new Error("Invalid color format " + css);
            }
            const r = parseInt(color.groups?.r ?? "0");
            const g = parseInt(color.groups?.g ?? "0");
            const b = parseInt(color.groups?.b ?? "0");
            const a = parseFloat(color.groups?.a ?? "0");
            return new Color2(new RGBA(r, g, b, a));
          }
          if (css.startsWith("rgb(")) {
            const color = css.match(/rgb\((?<r>(?:\+|-)?\d+), *(?<g>(?:\+|-)?\d+), *(?<b>(?:\+|-)?\d+)\)/);
            if (!color) {
              throw new Error("Invalid color format " + css);
            }
            const r = parseInt(color.groups?.r ?? "0");
            const g = parseInt(color.groups?.g ?? "0");
            const b = parseInt(color.groups?.b ?? "0");
            return new Color2(new RGBA(r, g, b));
          }
          return parseNamedKeyword(css);
        }
        CSS.parse = parse;
        function parseNamedKeyword(css) {
          switch (css) {
            case "aliceblue":
              return new Color2(new RGBA(240, 248, 255, 1));
            case "antiquewhite":
              return new Color2(new RGBA(250, 235, 215, 1));
            case "aqua":
              return new Color2(new RGBA(0, 255, 255, 1));
            case "aquamarine":
              return new Color2(new RGBA(127, 255, 212, 1));
            case "azure":
              return new Color2(new RGBA(240, 255, 255, 1));
            case "beige":
              return new Color2(new RGBA(245, 245, 220, 1));
            case "bisque":
              return new Color2(new RGBA(255, 228, 196, 1));
            case "black":
              return new Color2(new RGBA(0, 0, 0, 1));
            case "blanchedalmond":
              return new Color2(new RGBA(255, 235, 205, 1));
            case "blue":
              return new Color2(new RGBA(0, 0, 255, 1));
            case "blueviolet":
              return new Color2(new RGBA(138, 43, 226, 1));
            case "brown":
              return new Color2(new RGBA(165, 42, 42, 1));
            case "burlywood":
              return new Color2(new RGBA(222, 184, 135, 1));
            case "cadetblue":
              return new Color2(new RGBA(95, 158, 160, 1));
            case "chartreuse":
              return new Color2(new RGBA(127, 255, 0, 1));
            case "chocolate":
              return new Color2(new RGBA(210, 105, 30, 1));
            case "coral":
              return new Color2(new RGBA(255, 127, 80, 1));
            case "cornflowerblue":
              return new Color2(new RGBA(100, 149, 237, 1));
            case "cornsilk":
              return new Color2(new RGBA(255, 248, 220, 1));
            case "crimson":
              return new Color2(new RGBA(220, 20, 60, 1));
            case "cyan":
              return new Color2(new RGBA(0, 255, 255, 1));
            case "darkblue":
              return new Color2(new RGBA(0, 0, 139, 1));
            case "darkcyan":
              return new Color2(new RGBA(0, 139, 139, 1));
            case "darkgoldenrod":
              return new Color2(new RGBA(184, 134, 11, 1));
            case "darkgray":
              return new Color2(new RGBA(169, 169, 169, 1));
            case "darkgreen":
              return new Color2(new RGBA(0, 100, 0, 1));
            case "darkgrey":
              return new Color2(new RGBA(169, 169, 169, 1));
            case "darkkhaki":
              return new Color2(new RGBA(189, 183, 107, 1));
            case "darkmagenta":
              return new Color2(new RGBA(139, 0, 139, 1));
            case "darkolivegreen":
              return new Color2(new RGBA(85, 107, 47, 1));
            case "darkorange":
              return new Color2(new RGBA(255, 140, 0, 1));
            case "darkorchid":
              return new Color2(new RGBA(153, 50, 204, 1));
            case "darkred":
              return new Color2(new RGBA(139, 0, 0, 1));
            case "darksalmon":
              return new Color2(new RGBA(233, 150, 122, 1));
            case "darkseagreen":
              return new Color2(new RGBA(143, 188, 143, 1));
            case "darkslateblue":
              return new Color2(new RGBA(72, 61, 139, 1));
            case "darkslategray":
              return new Color2(new RGBA(47, 79, 79, 1));
            case "darkslategrey":
              return new Color2(new RGBA(47, 79, 79, 1));
            case "darkturquoise":
              return new Color2(new RGBA(0, 206, 209, 1));
            case "darkviolet":
              return new Color2(new RGBA(148, 0, 211, 1));
            case "deeppink":
              return new Color2(new RGBA(255, 20, 147, 1));
            case "deepskyblue":
              return new Color2(new RGBA(0, 191, 255, 1));
            case "dimgray":
              return new Color2(new RGBA(105, 105, 105, 1));
            case "dimgrey":
              return new Color2(new RGBA(105, 105, 105, 1));
            case "dodgerblue":
              return new Color2(new RGBA(30, 144, 255, 1));
            case "firebrick":
              return new Color2(new RGBA(178, 34, 34, 1));
            case "floralwhite":
              return new Color2(new RGBA(255, 250, 240, 1));
            case "forestgreen":
              return new Color2(new RGBA(34, 139, 34, 1));
            case "fuchsia":
              return new Color2(new RGBA(255, 0, 255, 1));
            case "gainsboro":
              return new Color2(new RGBA(220, 220, 220, 1));
            case "ghostwhite":
              return new Color2(new RGBA(248, 248, 255, 1));
            case "gold":
              return new Color2(new RGBA(255, 215, 0, 1));
            case "goldenrod":
              return new Color2(new RGBA(218, 165, 32, 1));
            case "gray":
              return new Color2(new RGBA(128, 128, 128, 1));
            case "green":
              return new Color2(new RGBA(0, 128, 0, 1));
            case "greenyellow":
              return new Color2(new RGBA(173, 255, 47, 1));
            case "grey":
              return new Color2(new RGBA(128, 128, 128, 1));
            case "honeydew":
              return new Color2(new RGBA(240, 255, 240, 1));
            case "hotpink":
              return new Color2(new RGBA(255, 105, 180, 1));
            case "indianred":
              return new Color2(new RGBA(205, 92, 92, 1));
            case "indigo":
              return new Color2(new RGBA(75, 0, 130, 1));
            case "ivory":
              return new Color2(new RGBA(255, 255, 240, 1));
            case "khaki":
              return new Color2(new RGBA(240, 230, 140, 1));
            case "lavender":
              return new Color2(new RGBA(230, 230, 250, 1));
            case "lavenderblush":
              return new Color2(new RGBA(255, 240, 245, 1));
            case "lawngreen":
              return new Color2(new RGBA(124, 252, 0, 1));
            case "lemonchiffon":
              return new Color2(new RGBA(255, 250, 205, 1));
            case "lightblue":
              return new Color2(new RGBA(173, 216, 230, 1));
            case "lightcoral":
              return new Color2(new RGBA(240, 128, 128, 1));
            case "lightcyan":
              return new Color2(new RGBA(224, 255, 255, 1));
            case "lightgoldenrodyellow":
              return new Color2(new RGBA(250, 250, 210, 1));
            case "lightgray":
              return new Color2(new RGBA(211, 211, 211, 1));
            case "lightgreen":
              return new Color2(new RGBA(144, 238, 144, 1));
            case "lightgrey":
              return new Color2(new RGBA(211, 211, 211, 1));
            case "lightpink":
              return new Color2(new RGBA(255, 182, 193, 1));
            case "lightsalmon":
              return new Color2(new RGBA(255, 160, 122, 1));
            case "lightseagreen":
              return new Color2(new RGBA(32, 178, 170, 1));
            case "lightskyblue":
              return new Color2(new RGBA(135, 206, 250, 1));
            case "lightslategray":
              return new Color2(new RGBA(119, 136, 153, 1));
            case "lightslategrey":
              return new Color2(new RGBA(119, 136, 153, 1));
            case "lightsteelblue":
              return new Color2(new RGBA(176, 196, 222, 1));
            case "lightyellow":
              return new Color2(new RGBA(255, 255, 224, 1));
            case "lime":
              return new Color2(new RGBA(0, 255, 0, 1));
            case "limegreen":
              return new Color2(new RGBA(50, 205, 50, 1));
            case "linen":
              return new Color2(new RGBA(250, 240, 230, 1));
            case "magenta":
              return new Color2(new RGBA(255, 0, 255, 1));
            case "maroon":
              return new Color2(new RGBA(128, 0, 0, 1));
            case "mediumaquamarine":
              return new Color2(new RGBA(102, 205, 170, 1));
            case "mediumblue":
              return new Color2(new RGBA(0, 0, 205, 1));
            case "mediumorchid":
              return new Color2(new RGBA(186, 85, 211, 1));
            case "mediumpurple":
              return new Color2(new RGBA(147, 112, 219, 1));
            case "mediumseagreen":
              return new Color2(new RGBA(60, 179, 113, 1));
            case "mediumslateblue":
              return new Color2(new RGBA(123, 104, 238, 1));
            case "mediumspringgreen":
              return new Color2(new RGBA(0, 250, 154, 1));
            case "mediumturquoise":
              return new Color2(new RGBA(72, 209, 204, 1));
            case "mediumvioletred":
              return new Color2(new RGBA(199, 21, 133, 1));
            case "midnightblue":
              return new Color2(new RGBA(25, 25, 112, 1));
            case "mintcream":
              return new Color2(new RGBA(245, 255, 250, 1));
            case "mistyrose":
              return new Color2(new RGBA(255, 228, 225, 1));
            case "moccasin":
              return new Color2(new RGBA(255, 228, 181, 1));
            case "navajowhite":
              return new Color2(new RGBA(255, 222, 173, 1));
            case "navy":
              return new Color2(new RGBA(0, 0, 128, 1));
            case "oldlace":
              return new Color2(new RGBA(253, 245, 230, 1));
            case "olive":
              return new Color2(new RGBA(128, 128, 0, 1));
            case "olivedrab":
              return new Color2(new RGBA(107, 142, 35, 1));
            case "orange":
              return new Color2(new RGBA(255, 165, 0, 1));
            case "orangered":
              return new Color2(new RGBA(255, 69, 0, 1));
            case "orchid":
              return new Color2(new RGBA(218, 112, 214, 1));
            case "palegoldenrod":
              return new Color2(new RGBA(238, 232, 170, 1));
            case "palegreen":
              return new Color2(new RGBA(152, 251, 152, 1));
            case "paleturquoise":
              return new Color2(new RGBA(175, 238, 238, 1));
            case "palevioletred":
              return new Color2(new RGBA(219, 112, 147, 1));
            case "papayawhip":
              return new Color2(new RGBA(255, 239, 213, 1));
            case "peachpuff":
              return new Color2(new RGBA(255, 218, 185, 1));
            case "peru":
              return new Color2(new RGBA(205, 133, 63, 1));
            case "pink":
              return new Color2(new RGBA(255, 192, 203, 1));
            case "plum":
              return new Color2(new RGBA(221, 160, 221, 1));
            case "powderblue":
              return new Color2(new RGBA(176, 224, 230, 1));
            case "purple":
              return new Color2(new RGBA(128, 0, 128, 1));
            case "rebeccapurple":
              return new Color2(new RGBA(102, 51, 153, 1));
            case "red":
              return new Color2(new RGBA(255, 0, 0, 1));
            case "rosybrown":
              return new Color2(new RGBA(188, 143, 143, 1));
            case "royalblue":
              return new Color2(new RGBA(65, 105, 225, 1));
            case "saddlebrown":
              return new Color2(new RGBA(139, 69, 19, 1));
            case "salmon":
              return new Color2(new RGBA(250, 128, 114, 1));
            case "sandybrown":
              return new Color2(new RGBA(244, 164, 96, 1));
            case "seagreen":
              return new Color2(new RGBA(46, 139, 87, 1));
            case "seashell":
              return new Color2(new RGBA(255, 245, 238, 1));
            case "sienna":
              return new Color2(new RGBA(160, 82, 45, 1));
            case "silver":
              return new Color2(new RGBA(192, 192, 192, 1));
            case "skyblue":
              return new Color2(new RGBA(135, 206, 235, 1));
            case "slateblue":
              return new Color2(new RGBA(106, 90, 205, 1));
            case "slategray":
              return new Color2(new RGBA(112, 128, 144, 1));
            case "slategrey":
              return new Color2(new RGBA(112, 128, 144, 1));
            case "snow":
              return new Color2(new RGBA(255, 250, 250, 1));
            case "springgreen":
              return new Color2(new RGBA(0, 255, 127, 1));
            case "steelblue":
              return new Color2(new RGBA(70, 130, 180, 1));
            case "tan":
              return new Color2(new RGBA(210, 180, 140, 1));
            case "teal":
              return new Color2(new RGBA(0, 128, 128, 1));
            case "thistle":
              return new Color2(new RGBA(216, 191, 216, 1));
            case "tomato":
              return new Color2(new RGBA(255, 99, 71, 1));
            case "turquoise":
              return new Color2(new RGBA(64, 224, 208, 1));
            case "violet":
              return new Color2(new RGBA(238, 130, 238, 1));
            case "wheat":
              return new Color2(new RGBA(245, 222, 179, 1));
            case "white":
              return new Color2(new RGBA(255, 255, 255, 1));
            case "whitesmoke":
              return new Color2(new RGBA(245, 245, 245, 1));
            case "yellow":
              return new Color2(new RGBA(255, 255, 0, 1));
            case "yellowgreen":
              return new Color2(new RGBA(154, 205, 50, 1));
            default:
              return null;
          }
        }
        function parseHex(hex) {
          const length = hex.length;
          if (length === 0) {
            return null;
          }
          if (hex.charCodeAt(0) !== 35) {
            return null;
          }
          if (length === 7) {
            const r = 16 * _parseHexDigit(hex.charCodeAt(1)) + _parseHexDigit(hex.charCodeAt(2));
            const g = 16 * _parseHexDigit(hex.charCodeAt(3)) + _parseHexDigit(hex.charCodeAt(4));
            const b = 16 * _parseHexDigit(hex.charCodeAt(5)) + _parseHexDigit(hex.charCodeAt(6));
            return new Color2(new RGBA(r, g, b, 1));
          }
          if (length === 9) {
            const r = 16 * _parseHexDigit(hex.charCodeAt(1)) + _parseHexDigit(hex.charCodeAt(2));
            const g = 16 * _parseHexDigit(hex.charCodeAt(3)) + _parseHexDigit(hex.charCodeAt(4));
            const b = 16 * _parseHexDigit(hex.charCodeAt(5)) + _parseHexDigit(hex.charCodeAt(6));
            const a = 16 * _parseHexDigit(hex.charCodeAt(7)) + _parseHexDigit(hex.charCodeAt(8));
            return new Color2(new RGBA(r, g, b, a / 255));
          }
          if (length === 4) {
            const r = _parseHexDigit(hex.charCodeAt(1));
            const g = _parseHexDigit(hex.charCodeAt(2));
            const b = _parseHexDigit(hex.charCodeAt(3));
            return new Color2(new RGBA(16 * r + r, 16 * g + g, 16 * b + b));
          }
          if (length === 5) {
            const r = _parseHexDigit(hex.charCodeAt(1));
            const g = _parseHexDigit(hex.charCodeAt(2));
            const b = _parseHexDigit(hex.charCodeAt(3));
            const a = _parseHexDigit(hex.charCodeAt(4));
            return new Color2(new RGBA(16 * r + r, 16 * g + g, 16 * b + b, (16 * a + a) / 255));
          }
          return null;
        }
        CSS.parseHex = parseHex;
        function _parseHexDigit(charCode) {
          switch (charCode) {
            case 48:
              return 0;
            case 49:
              return 1;
            case 50:
              return 2;
            case 51:
              return 3;
            case 52:
              return 4;
            case 53:
              return 5;
            case 54:
              return 6;
            case 55:
              return 7;
            case 56:
              return 8;
            case 57:
              return 9;
            case 97:
              return 10;
            case 65:
              return 10;
            case 98:
              return 11;
            case 66:
              return 11;
            case 99:
              return 12;
            case 67:
              return 12;
            case 100:
              return 13;
            case 68:
              return 13;
            case 101:
              return 14;
            case 69:
              return 14;
            case 102:
              return 15;
            case 70:
              return 15;
          }
          return 0;
        }
      })(Format.CSS || (Format.CSS = {}));
    })(Color2.Format || (Color2.Format = {}));
  })(Color || (Color = {}));
  function _parseCaptureGroups(captureGroups) {
    const values = [];
    for (const captureGroup of captureGroups) {
      const parsedNumber = Number(captureGroup);
      if (parsedNumber || parsedNumber === 0 && captureGroup.replace(/\s/g, "") !== "") {
        values.push(parsedNumber);
      }
    }
    return values;
  }
  function _toIColor(r, g, b, a) {
    return {
      red: r / 255,
      blue: b / 255,
      green: g / 255,
      alpha: a
    };
  }
  function _findRange(model, match) {
    const index = match.index;
    const length = match[0].length;
    if (index === void 0) {
      return;
    }
    const startPosition = model.positionAt(index);
    const range2 = {
      startLineNumber: startPosition.lineNumber,
      startColumn: startPosition.column,
      endLineNumber: startPosition.lineNumber,
      endColumn: startPosition.column + length
    };
    return range2;
  }
  function _findHexColorInformation(range2, hexValue) {
    if (!range2) {
      return;
    }
    const parsedHexColor = Color.Format.CSS.parseHex(hexValue);
    if (!parsedHexColor) {
      return;
    }
    return {
      range: range2,
      color: _toIColor(parsedHexColor.rgba.r, parsedHexColor.rgba.g, parsedHexColor.rgba.b, parsedHexColor.rgba.a)
    };
  }
  function _findRGBColorInformation(range2, matches, isAlpha) {
    if (!range2 || matches.length !== 1) {
      return;
    }
    const match = matches[0];
    const captureGroups = match.values();
    const parsedRegex = _parseCaptureGroups(captureGroups);
    return {
      range: range2,
      color: _toIColor(parsedRegex[0], parsedRegex[1], parsedRegex[2], isAlpha ? parsedRegex[3] : 1)
    };
  }
  function _findHSLColorInformation(range2, matches, isAlpha) {
    if (!range2 || matches.length !== 1) {
      return;
    }
    const match = matches[0];
    const captureGroups = match.values();
    const parsedRegex = _parseCaptureGroups(captureGroups);
    const colorEquivalent = new Color(new HSLA(parsedRegex[0], parsedRegex[1] / 100, parsedRegex[2] / 100, isAlpha ? parsedRegex[3] : 1));
    return {
      range: range2,
      color: _toIColor(colorEquivalent.rgba.r, colorEquivalent.rgba.g, colorEquivalent.rgba.b, colorEquivalent.rgba.a)
    };
  }
  function _findMatches(model, regex) {
    if (typeof model === "string") {
      return [...model.matchAll(regex)];
    } else {
      return model.findMatches(regex);
    }
  }
  function computeColors(model) {
    const result = [];
    const initialValidationRegex = new RegExp(`\\b(rgb|rgba|hsl|hsla)(\\([0-9\\s,.\\%\\/]*\\))|^(#)([A-Fa-f0-9]{3})\\b|^(#)([A-Fa-f0-9]{4})\\b|^(#)([A-Fa-f0-9]{6})\\b|^(#)([A-Fa-f0-9]{8})\\b|(?<=['"\\s])(#)([A-Fa-f0-9]{3})\\b|(?<=['"\\s])(#)([A-Fa-f0-9]{4})\\b|(?<=['"\\s])(#)([A-Fa-f0-9]{6})\\b|(?<=['"\\s])(#)([A-Fa-f0-9]{8})\\b`, "gm");
    const initialValidationMatches = _findMatches(model, initialValidationRegex);
    if (initialValidationMatches.length > 0) {
      for (const initialMatch of initialValidationMatches) {
        const initialCaptureGroups = initialMatch.filter((captureGroup) => captureGroup !== void 0);
        const colorScheme = initialCaptureGroups[1];
        const colorParameters = initialCaptureGroups[2];
        if (!colorParameters) {
          continue;
        }
        let colorInformation;
        if (colorScheme === "rgb") {
          const regexParameters = /^\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*[\s,]\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*[\s,]\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*\)$/gm;
          colorInformation = _findRGBColorInformation(_findRange(model, initialMatch), _findMatches(colorParameters, regexParameters), false);
        } else if (colorScheme === "rgba") {
          const regexParameters = /^\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*[\s,]\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*[\s,]\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*(?:[\s,]|[\s]*\/)\s*(0[.][0-9]+|[.][0-9]+|[01][.]|[01])\s*\)$/gm;
          colorInformation = _findRGBColorInformation(_findRange(model, initialMatch), _findMatches(colorParameters, regexParameters), true);
        } else if (colorScheme === "hsl") {
          const regexParameters = /^\(\s*((?:360(?:\.0+)?|(?:36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])(?:\.\d+)?))\s*[\s,]\s*(100(?:\.0+)?|\d{1,2}[.]\d*|\d{1,2})%\s*[\s,]\s*(100(?:\.0+)?|\d{1,2}[.]\d*|\d{1,2})%\s*\)$/gm;
          colorInformation = _findHSLColorInformation(_findRange(model, initialMatch), _findMatches(colorParameters, regexParameters), false);
        } else if (colorScheme === "hsla") {
          const regexParameters = /^\(\s*((?:360(?:\.0+)?|(?:36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])(?:\.\d+)?))\s*[\s,]\s*(100(?:\.0+)?|\d{1,2}[.]\d*|\d{1,2})%\s*[\s,]\s*(100(?:\.0+)?|\d{1,2}[.]\d*|\d{1,2})%\s*(?:[\s,]|[\s]*\/)\s*(0[.][0-9]+|[.][0-9]+|[01][.]0*|[01])\s*\)$/gm;
          colorInformation = _findHSLColorInformation(_findRange(model, initialMatch), _findMatches(colorParameters, regexParameters), true);
        } else if (colorScheme === "#") {
          colorInformation = _findHexColorInformation(_findRange(model, initialMatch), colorScheme + colorParameters);
        }
        if (colorInformation) {
          result.push(colorInformation);
        }
      }
    }
    return result;
  }
  function computeDefaultDocumentColors(model) {
    if (!model || typeof model.getValue !== "function" || typeof model.positionAt !== "function") {
      return [];
    }
    return computeColors(model);
  }
  const trimDashesRegex = /^-+|-+$/g;
  const CHUNK_SIZE = 100;
  const MAX_SECTION_LINES = 5;
  function findSectionHeaders(model, options) {
    let headers = [];
    if (options.findRegionSectionHeaders && options.foldingRules?.markers) {
      const regionHeaders = collectRegionHeaders(model, options);
      headers = headers.concat(regionHeaders);
    }
    if (options.findMarkSectionHeaders) {
      const markHeaders = collectMarkHeaders(model, options);
      headers = headers.concat(markHeaders);
    }
    return headers;
  }
  function collectRegionHeaders(model, options) {
    const regionHeaders = [];
    const endLineNumber = model.getLineCount();
    for (let lineNumber = 1; lineNumber <= endLineNumber; lineNumber++) {
      const lineContent = model.getLineContent(lineNumber);
      const match = lineContent.match(options.foldingRules.markers.start);
      if (match) {
        const range2 = { startLineNumber: lineNumber, startColumn: match[0].length + 1, endLineNumber: lineNumber, endColumn: lineContent.length + 1 };
        if (range2.endColumn > range2.startColumn) {
          const sectionHeader = {
            range: range2,
            ...getHeaderText(lineContent.substring(match[0].length)),
            shouldBeInComments: false
          };
          if (sectionHeader.text || sectionHeader.hasSeparatorLine) {
            regionHeaders.push(sectionHeader);
          }
        }
      }
    }
    return regionHeaders;
  }
  function collectMarkHeaders(model, options) {
    const markHeaders = [];
    const endLineNumber = model.getLineCount();
    if (!options.markSectionHeaderRegex || options.markSectionHeaderRegex.trim() === "") {
      return markHeaders;
    }
    const multiline = isMultilineRegexSource(options.markSectionHeaderRegex);
    const regex = new RegExp(options.markSectionHeaderRegex, `gdm${multiline ? "s" : ""}`);
    if (regExpLeadsToEndlessLoop(regex)) {
      return markHeaders;
    }
    for (let startLine = 1; startLine <= endLineNumber; startLine += CHUNK_SIZE - MAX_SECTION_LINES) {
      const endLine = Math.min(startLine + CHUNK_SIZE - 1, endLineNumber);
      const lines = [];
      for (let i = startLine; i <= endLine; i++) {
        lines.push(model.getLineContent(i));
      }
      const text = lines.join("\n");
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(text)) !== null) {
        const precedingText = text.substring(0, match.index);
        const lineOffset = (precedingText.match(/\n/g) || []).length;
        const lineNumber = startLine + lineOffset;
        const matchLines = match[0].split("\n");
        const matchHeight = matchLines.length;
        const matchEndLine = lineNumber + matchHeight - 1;
        const lineStartIndex = precedingText.lastIndexOf("\n") + 1;
        const startColumn = match.index - lineStartIndex + 1;
        const lastMatchLine = matchLines[matchLines.length - 1];
        const endColumn = matchHeight === 1 ? startColumn + match[0].length : lastMatchLine.length + 1;
        const range2 = {
          startLineNumber: lineNumber,
          startColumn,
          endLineNumber: matchEndLine,
          endColumn
        };
        const text2 = (match.groups ?? {})["label"] ?? "";
        const hasSeparatorLine = ((match.groups ?? {})["separator"] ?? "") !== "";
        const sectionHeader = {
          range: range2,
          text: text2,
          hasSeparatorLine,
          shouldBeInComments: true
        };
        if (sectionHeader.text || sectionHeader.hasSeparatorLine) {
          if (markHeaders.length === 0 || markHeaders[markHeaders.length - 1].range.endLineNumber < sectionHeader.range.startLineNumber) {
            markHeaders.push(sectionHeader);
          }
        }
        regex.lastIndex = match.index + match[0].length;
      }
    }
    return markHeaders;
  }
  function getHeaderText(text) {
    text = text.trim();
    const hasSeparatorLine = text.startsWith("-");
    text = text.replace(trimDashesRegex, "");
    return { text, hasSeparatorLine };
  }
  class PrefixSumComputer {
    constructor(values) {
      this.values = values;
      this.prefixSum = new Uint32Array(values.length);
      this.prefixSumValidIndex = new Int32Array(1);
      this.prefixSumValidIndex[0] = -1;
    }
    insertValues(insertIndex, insertValues) {
      insertIndex = toUint32(insertIndex);
      const oldValues = this.values;
      const oldPrefixSum = this.prefixSum;
      const insertValuesLen = insertValues.length;
      if (insertValuesLen === 0) {
        return false;
      }
      this.values = new Uint32Array(oldValues.length + insertValuesLen);
      this.values.set(oldValues.subarray(0, insertIndex), 0);
      this.values.set(oldValues.subarray(insertIndex), insertIndex + insertValuesLen);
      this.values.set(insertValues, insertIndex);
      if (insertIndex - 1 < this.prefixSumValidIndex[0]) {
        this.prefixSumValidIndex[0] = insertIndex - 1;
      }
      this.prefixSum = new Uint32Array(this.values.length);
      if (this.prefixSumValidIndex[0] >= 0) {
        this.prefixSum.set(oldPrefixSum.subarray(0, this.prefixSumValidIndex[0] + 1));
      }
      return true;
    }
    setValue(index, value) {
      index = toUint32(index);
      value = toUint32(value);
      if (this.values[index] === value) {
        return false;
      }
      this.values[index] = value;
      if (index - 1 < this.prefixSumValidIndex[0]) {
        this.prefixSumValidIndex[0] = index - 1;
      }
      return true;
    }
    removeValues(startIndex, count) {
      startIndex = toUint32(startIndex);
      count = toUint32(count);
      const oldValues = this.values;
      const oldPrefixSum = this.prefixSum;
      if (startIndex >= oldValues.length) {
        return false;
      }
      const maxCount = oldValues.length - startIndex;
      if (count >= maxCount) {
        count = maxCount;
      }
      if (count === 0) {
        return false;
      }
      this.values = new Uint32Array(oldValues.length - count);
      this.values.set(oldValues.subarray(0, startIndex), 0);
      this.values.set(oldValues.subarray(startIndex + count), startIndex);
      this.prefixSum = new Uint32Array(this.values.length);
      if (startIndex - 1 < this.prefixSumValidIndex[0]) {
        this.prefixSumValidIndex[0] = startIndex - 1;
      }
      if (this.prefixSumValidIndex[0] >= 0) {
        this.prefixSum.set(oldPrefixSum.subarray(0, this.prefixSumValidIndex[0] + 1));
      }
      return true;
    }
    getTotalSum() {
      if (this.values.length === 0) {
        return 0;
      }
      return this._getPrefixSum(this.values.length - 1);
    }
    /**
     * Returns the sum of the first `index + 1` many items.
     * @returns `SUM(0 <= j <= index, values[j])`.
     */
    getPrefixSum(index) {
      if (index < 0) {
        return 0;
      }
      index = toUint32(index);
      return this._getPrefixSum(index);
    }
    _getPrefixSum(index) {
      if (index <= this.prefixSumValidIndex[0]) {
        return this.prefixSum[index];
      }
      let startIndex = this.prefixSumValidIndex[0] + 1;
      if (startIndex === 0) {
        this.prefixSum[0] = this.values[0];
        startIndex++;
      }
      if (index >= this.values.length) {
        index = this.values.length - 1;
      }
      for (let i = startIndex; i <= index; i++) {
        this.prefixSum[i] = this.prefixSum[i - 1] + this.values[i];
      }
      this.prefixSumValidIndex[0] = Math.max(this.prefixSumValidIndex[0], index);
      return this.prefixSum[index];
    }
    getIndexOf(sum2) {
      sum2 = Math.floor(sum2);
      this.getTotalSum();
      let low = 0;
      let high = this.values.length - 1;
      let mid = 0;
      let midStop = 0;
      let midStart = 0;
      while (low <= high) {
        mid = low + (high - low) / 2 | 0;
        midStop = this.prefixSum[mid];
        midStart = midStop - this.values[mid];
        if (sum2 < midStart) {
          high = mid - 1;
        } else if (sum2 >= midStop) {
          low = mid + 1;
        } else {
          break;
        }
      }
      return new PrefixSumIndexOfResult(mid, sum2 - midStart);
    }
  }
  class ConstantTimePrefixSumComputer {
    constructor(values) {
      this._values = values;
      this._isValid = false;
      this._validEndIndex = -1;
      this._prefixSum = [];
      this._indexBySum = [];
    }
    /**
     * @returns SUM(0 <= j < values.length, values[j])
     */
    getTotalSum() {
      this._ensureValid();
      return this._indexBySum.length;
    }
    /**
     * Returns the sum of the first `count` many items.
     * @returns `SUM(0 <= j < count, values[j])`.
     */
    getPrefixSum(count) {
      this._ensureValid();
      if (count === 0) {
        return 0;
      }
      return this._prefixSum[count - 1];
    }
    /**
     * @returns `result`, such that `getPrefixSum(result.index) + result.remainder = sum`
     */
    getIndexOf(sum2) {
      this._ensureValid();
      const idx = this._indexBySum[sum2];
      const viewLinesAbove = idx > 0 ? this._prefixSum[idx - 1] : 0;
      return new PrefixSumIndexOfResult(idx, sum2 - viewLinesAbove);
    }
    removeValues(start, deleteCount) {
      this._values.splice(start, deleteCount);
      this._invalidate(start);
    }
    insertValues(insertIndex, insertArr) {
      this._values = arrayInsert(this._values, insertIndex, insertArr);
      this._invalidate(insertIndex);
    }
    _invalidate(index) {
      this._isValid = false;
      this._validEndIndex = Math.min(this._validEndIndex, index - 1);
    }
    _ensureValid() {
      if (this._isValid) {
        return;
      }
      for (let i = this._validEndIndex + 1, len = this._values.length; i < len; i++) {
        const value = this._values[i];
        const sumAbove = i > 0 ? this._prefixSum[i - 1] : 0;
        this._prefixSum[i] = sumAbove + value;
        for (let j = 0; j < value; j++) {
          this._indexBySum[sumAbove + j] = i;
        }
      }
      this._prefixSum.length = this._values.length;
      this._indexBySum.length = this._prefixSum[this._prefixSum.length - 1];
      this._isValid = true;
      this._validEndIndex = this._values.length - 1;
    }
    setValue(index, value) {
      if (this._values[index] === value) {
        return;
      }
      this._values[index] = value;
      this._invalidate(index);
    }
  }
  class PrefixSumIndexOfResult {
    constructor(index, remainder) {
      this.index = index;
      this.remainder = remainder;
      this._prefixSumIndexOfResultBrand = void 0;
      this.index = index;
      this.remainder = remainder;
    }
  }
  class MirrorTextModel {
    constructor(uri, lines, eol, versionId) {
      this._uri = uri;
      this._lines = lines;
      this._eol = eol;
      this._versionId = versionId;
      this._lineStarts = null;
      this._cachedTextValue = null;
    }
    dispose() {
      this._lines.length = 0;
    }
    get version() {
      return this._versionId;
    }
    getText() {
      if (this._cachedTextValue === null) {
        this._cachedTextValue = this._lines.join(this._eol);
      }
      return this._cachedTextValue;
    }
    onEvents(e) {
      if (e.eol && e.eol !== this._eol) {
        this._eol = e.eol;
        this._lineStarts = null;
      }
      const changes = e.changes;
      for (const change of changes) {
        this._acceptDeleteRange(change.range);
        this._acceptInsertText(new Position(change.range.startLineNumber, change.range.startColumn), change.text);
      }
      this._versionId = e.versionId;
      this._cachedTextValue = null;
    }
    _ensureLineStarts() {
      if (!this._lineStarts) {
        const eolLength = this._eol.length;
        const linesLength = this._lines.length;
        const lineStartValues = new Uint32Array(linesLength);
        for (let i = 0; i < linesLength; i++) {
          lineStartValues[i] = this._lines[i].length + eolLength;
        }
        this._lineStarts = new PrefixSumComputer(lineStartValues);
      }
    }
    /**
     * All changes to a line's text go through this method
     */
    _setLineText(lineIndex, newValue) {
      this._lines[lineIndex] = newValue;
      if (this._lineStarts) {
        this._lineStarts.setValue(lineIndex, this._lines[lineIndex].length + this._eol.length);
      }
    }
    _acceptDeleteRange(range2) {
      if (range2.startLineNumber === range2.endLineNumber) {
        if (range2.startColumn === range2.endColumn) {
          return;
        }
        this._setLineText(range2.startLineNumber - 1, this._lines[range2.startLineNumber - 1].substring(0, range2.startColumn - 1) + this._lines[range2.startLineNumber - 1].substring(range2.endColumn - 1));
        return;
      }
      this._setLineText(range2.startLineNumber - 1, this._lines[range2.startLineNumber - 1].substring(0, range2.startColumn - 1) + this._lines[range2.endLineNumber - 1].substring(range2.endColumn - 1));
      this._lines.splice(range2.startLineNumber, range2.endLineNumber - range2.startLineNumber);
      if (this._lineStarts) {
        this._lineStarts.removeValues(range2.startLineNumber, range2.endLineNumber - range2.startLineNumber);
      }
    }
    _acceptInsertText(position, insertText) {
      if (insertText.length === 0) {
        return;
      }
      const insertLines = splitLines(insertText);
      if (insertLines.length === 1) {
        this._setLineText(position.lineNumber - 1, this._lines[position.lineNumber - 1].substring(0, position.column - 1) + insertLines[0] + this._lines[position.lineNumber - 1].substring(position.column - 1));
        return;
      }
      insertLines[insertLines.length - 1] += this._lines[position.lineNumber - 1].substring(position.column - 1);
      this._setLineText(position.lineNumber - 1, this._lines[position.lineNumber - 1].substring(0, position.column - 1) + insertLines[0]);
      const newLengths = new Uint32Array(insertLines.length - 1);
      for (let i = 1; i < insertLines.length; i++) {
        this._lines.splice(position.lineNumber + i - 1, 0, insertLines[i]);
        newLengths[i - 1] = insertLines[i].length + this._eol.length;
      }
      if (this._lineStarts) {
        this._lineStarts.insertValues(position.lineNumber, newLengths);
      }
    }
  }
  const STOP_SYNC_MODEL_DELTA_TIME_MS = 60 * 1e3;
  class WorkerTextModelSyncClient extends Disposable {
    constructor(proxy, modelService, keepIdleModels = false) {
      super();
      this._syncedModels = /* @__PURE__ */ Object.create(null);
      this._syncedModelsLastUsedTime = /* @__PURE__ */ Object.create(null);
      this._proxy = proxy;
      this._modelService = modelService;
      if (!keepIdleModels) {
        const timer = new IntervalTimer();
        timer.cancelAndSet(() => this._checkStopModelSync(), Math.round(STOP_SYNC_MODEL_DELTA_TIME_MS / 2));
        this._register(timer);
      }
    }
    dispose() {
      for (const modelUrl in this._syncedModels) {
        dispose(this._syncedModels[modelUrl]);
      }
      this._syncedModels = /* @__PURE__ */ Object.create(null);
      this._syncedModelsLastUsedTime = /* @__PURE__ */ Object.create(null);
      super.dispose();
    }
    ensureSyncedResources(resources, forceLargeModels = false) {
      for (const resource of resources) {
        const resourceStr = resource.toString();
        if (!this._syncedModels[resourceStr]) {
          this._beginModelSync(resource, forceLargeModels);
        }
        if (this._syncedModels[resourceStr]) {
          this._syncedModelsLastUsedTime[resourceStr] = (/* @__PURE__ */ new Date()).getTime();
        }
      }
    }
    _checkStopModelSync() {
      const currentTime = (/* @__PURE__ */ new Date()).getTime();
      const toRemove = [];
      for (const modelUrl in this._syncedModelsLastUsedTime) {
        const elapsedTime = currentTime - this._syncedModelsLastUsedTime[modelUrl];
        if (elapsedTime > STOP_SYNC_MODEL_DELTA_TIME_MS) {
          toRemove.push(modelUrl);
        }
      }
      for (const e of toRemove) {
        this._stopModelSync(e);
      }
    }
    _beginModelSync(resource, forceLargeModels) {
      const model = this._modelService.getModel(resource);
      if (!model) {
        return;
      }
      if (!forceLargeModels && model.isTooLargeForSyncing()) {
        return;
      }
      const modelUrl = resource.toString();
      this._proxy.$acceptNewModel({
        url: model.uri.toString(),
        lines: model.getLinesContent(),
        EOL: model.getEOL(),
        versionId: model.getVersionId()
      });
      const toDispose = new DisposableStore();
      toDispose.add(model.onDidChangeContent((e) => {
        this._proxy.$acceptModelChanged(modelUrl.toString(), e);
      }));
      toDispose.add(model.onWillDispose(() => {
        this._stopModelSync(modelUrl);
      }));
      toDispose.add(toDisposable(() => {
        this._proxy.$acceptRemovedModel(modelUrl);
      }));
      this._syncedModels[modelUrl] = toDispose;
    }
    _stopModelSync(modelUrl) {
      const toDispose = this._syncedModels[modelUrl];
      delete this._syncedModels[modelUrl];
      delete this._syncedModelsLastUsedTime[modelUrl];
      dispose(toDispose);
    }
  }
  class WorkerTextModelSyncServer {
    constructor() {
      this._models = /* @__PURE__ */ Object.create(null);
    }
    getModel(uri) {
      return this._models[uri];
    }
    getModels() {
      const all = [];
      Object.keys(this._models).forEach((key) => all.push(this._models[key]));
      return all;
    }
    $acceptNewModel(data) {
      this._models[data.url] = new MirrorModel(URI.parse(data.url), data.lines, data.EOL, data.versionId);
    }
    $acceptModelChanged(uri, e) {
      if (!this._models[uri]) {
        return;
      }
      const model = this._models[uri];
      model.onEvents(e);
    }
    $acceptRemovedModel(uri) {
      if (!this._models[uri]) {
        return;
      }
      delete this._models[uri];
    }
  }
  class MirrorModel extends MirrorTextModel {
    get uri() {
      return this._uri;
    }
    get eol() {
      return this._eol;
    }
    getValue() {
      return this.getText();
    }
    findMatches(regex) {
      const matches = [];
      for (let i = 0; i < this._lines.length; i++) {
        const line = this._lines[i];
        const offsetToAdd = this.offsetAt(new Position(i + 1, 1));
        const iteratorOverMatches = line.matchAll(regex);
        for (const match of iteratorOverMatches) {
          if (match.index || match.index === 0) {
            match.index = match.index + offsetToAdd;
          }
          matches.push(match);
        }
      }
      return matches;
    }
    getLinesContent() {
      return this._lines.slice(0);
    }
    getLineCount() {
      return this._lines.length;
    }
    getLineContent(lineNumber) {
      return this._lines[lineNumber - 1];
    }
    getWordAtPosition(position, wordDefinition) {
      const wordAtText = getWordAtText(position.column, ensureValidWordDefinition(wordDefinition), this._lines[position.lineNumber - 1], 0);
      if (wordAtText) {
        return new Range(position.lineNumber, wordAtText.startColumn, position.lineNumber, wordAtText.endColumn);
      }
      return null;
    }
    words(wordDefinition) {
      const lines = this._lines;
      const wordenize = this._wordenize.bind(this);
      let lineNumber = 0;
      let lineText = "";
      let wordRangesIdx = 0;
      let wordRanges = [];
      return {
        *[Symbol.iterator]() {
          while (true) {
            if (wordRangesIdx < wordRanges.length) {
              const value = lineText.substring(wordRanges[wordRangesIdx].start, wordRanges[wordRangesIdx].end);
              wordRangesIdx += 1;
              yield value;
            } else {
              if (lineNumber < lines.length) {
                lineText = lines[lineNumber];
                wordRanges = wordenize(lineText, wordDefinition);
                wordRangesIdx = 0;
                lineNumber += 1;
              } else {
                break;
              }
            }
          }
        }
      };
    }
    getLineWords(lineNumber, wordDefinition) {
      const content = this._lines[lineNumber - 1];
      const ranges = this._wordenize(content, wordDefinition);
      const words = [];
      for (const range2 of ranges) {
        words.push({
          word: content.substring(range2.start, range2.end),
          startColumn: range2.start + 1,
          endColumn: range2.end + 1
        });
      }
      return words;
    }
    _wordenize(content, wordDefinition) {
      const result = [];
      let match;
      wordDefinition.lastIndex = 0;
      while (match = wordDefinition.exec(content)) {
        if (match[0].length === 0) {
          break;
        }
        result.push({ start: match.index, end: match.index + match[0].length });
      }
      return result;
    }
    getValueInRange(range2) {
      range2 = this._validateRange(range2);
      if (range2.startLineNumber === range2.endLineNumber) {
        return this._lines[range2.startLineNumber - 1].substring(range2.startColumn - 1, range2.endColumn - 1);
      }
      const lineEnding = this._eol;
      const startLineIndex = range2.startLineNumber - 1;
      const endLineIndex = range2.endLineNumber - 1;
      const resultLines = [];
      resultLines.push(this._lines[startLineIndex].substring(range2.startColumn - 1));
      for (let i = startLineIndex + 1; i < endLineIndex; i++) {
        resultLines.push(this._lines[i]);
      }
      resultLines.push(this._lines[endLineIndex].substring(0, range2.endColumn - 1));
      return resultLines.join(lineEnding);
    }
    offsetAt(position) {
      position = this._validatePosition(position);
      this._ensureLineStarts();
      return this._lineStarts.getPrefixSum(position.lineNumber - 2) + (position.column - 1);
    }
    positionAt(offset) {
      offset = Math.floor(offset);
      offset = Math.max(0, offset);
      this._ensureLineStarts();
      const out = this._lineStarts.getIndexOf(offset);
      const lineLength = this._lines[out.index].length;
      return {
        lineNumber: 1 + out.index,
        column: 1 + Math.min(out.remainder, lineLength)
      };
    }
    _validateRange(range2) {
      const start = this._validatePosition({ lineNumber: range2.startLineNumber, column: range2.startColumn });
      const end = this._validatePosition({ lineNumber: range2.endLineNumber, column: range2.endColumn });
      if (start.lineNumber !== range2.startLineNumber || start.column !== range2.startColumn || end.lineNumber !== range2.endLineNumber || end.column !== range2.endColumn) {
        return {
          startLineNumber: start.lineNumber,
          startColumn: start.column,
          endLineNumber: end.lineNumber,
          endColumn: end.column
        };
      }
      return range2;
    }
    _validatePosition(position) {
      if (!Position.isIPosition(position)) {
        throw new Error("bad position");
      }
      let { lineNumber, column } = position;
      let hasChanged = false;
      if (lineNumber < 1) {
        lineNumber = 1;
        column = 1;
        hasChanged = true;
      } else if (lineNumber > this._lines.length) {
        lineNumber = this._lines.length;
        column = this._lines[lineNumber - 1].length + 1;
        hasChanged = true;
      } else {
        const maxCharacter = this._lines[lineNumber - 1].length + 1;
        if (column < 1) {
          column = 1;
          hasChanged = true;
        } else if (column > maxCharacter) {
          column = maxCharacter;
          hasChanged = true;
        }
      }
      if (!hasChanged) {
        return position;
      } else {
        return { lineNumber, column };
      }
    }
  }
  const _EditorWorker = class _EditorWorker {
    constructor(_foreignModule = null) {
      this._foreignModule = _foreignModule;
      this._requestHandlerBrand = void 0;
      this._workerTextModelSyncServer = new WorkerTextModelSyncServer();
    }
    dispose() {
    }
    async $ping() {
      return "pong";
    }
    _getModel(uri) {
      return this._workerTextModelSyncServer.getModel(uri);
    }
    getModels() {
      return this._workerTextModelSyncServer.getModels();
    }
    $acceptNewModel(data) {
      this._workerTextModelSyncServer.$acceptNewModel(data);
    }
    $acceptModelChanged(uri, e) {
      this._workerTextModelSyncServer.$acceptModelChanged(uri, e);
    }
    $acceptRemovedModel(uri) {
      this._workerTextModelSyncServer.$acceptRemovedModel(uri);
    }
    async $computeUnicodeHighlights(url, options, range2) {
      const model = this._getModel(url);
      if (!model) {
        return { ranges: [], hasMore: false, ambiguousCharacterCount: 0, invisibleCharacterCount: 0, nonBasicAsciiCharacterCount: 0 };
      }
      return UnicodeTextModelHighlighter.computeUnicodeHighlights(model, options, range2);
    }
    async $findSectionHeaders(url, options) {
      const model = this._getModel(url);
      if (!model) {
        return [];
      }
      return findSectionHeaders(model, options);
    }
    // ---- BEGIN diff --------------------------------------------------------------------------
    async $computeDiff(originalUrl, modifiedUrl, options, algorithm) {
      const original = this._getModel(originalUrl);
      const modified = this._getModel(modifiedUrl);
      if (!original || !modified) {
        return null;
      }
      const result = _EditorWorker.computeDiff(original, modified, options, algorithm);
      return result;
    }
    static computeDiff(originalTextModel, modifiedTextModel, options, algorithm) {
      const diffAlgorithm = algorithm === "advanced" ? linesDiffComputers.getDefault() : linesDiffComputers.getLegacy();
      const originalLines = originalTextModel.getLinesContent();
      const modifiedLines = modifiedTextModel.getLinesContent();
      const result = diffAlgorithm.computeDiff(originalLines, modifiedLines, options);
      const identical = result.changes.length > 0 ? false : this._modelsAreIdentical(originalTextModel, modifiedTextModel);
      function getLineChanges(changes) {
        return changes.map((m) => [m.original.startLineNumber, m.original.endLineNumberExclusive, m.modified.startLineNumber, m.modified.endLineNumberExclusive, m.innerChanges?.map((m2) => [
          m2.originalRange.startLineNumber,
          m2.originalRange.startColumn,
          m2.originalRange.endLineNumber,
          m2.originalRange.endColumn,
          m2.modifiedRange.startLineNumber,
          m2.modifiedRange.startColumn,
          m2.modifiedRange.endLineNumber,
          m2.modifiedRange.endColumn
        ])]);
      }
      return {
        identical,
        quitEarly: result.hitTimeout,
        changes: getLineChanges(result.changes),
        moves: result.moves.map((m) => [
          m.lineRangeMapping.original.startLineNumber,
          m.lineRangeMapping.original.endLineNumberExclusive,
          m.lineRangeMapping.modified.startLineNumber,
          m.lineRangeMapping.modified.endLineNumberExclusive,
          getLineChanges(m.changes)
        ])
      };
    }
    static _modelsAreIdentical(original, modified) {
      const originalLineCount = original.getLineCount();
      const modifiedLineCount = modified.getLineCount();
      if (originalLineCount !== modifiedLineCount) {
        return false;
      }
      for (let line = 1; line <= originalLineCount; line++) {
        const originalLine = original.getLineContent(line);
        const modifiedLine = modified.getLineContent(line);
        if (originalLine !== modifiedLine) {
          return false;
        }
      }
      return true;
    }
    async $computeMoreMinimalEdits(modelUrl, edits, pretty) {
      const model = this._getModel(modelUrl);
      if (!model) {
        return edits;
      }
      const result = [];
      let lastEol = void 0;
      edits = edits.slice(0).sort((a, b) => {
        if (a.range && b.range) {
          return Range.compareRangesUsingStarts(a.range, b.range);
        }
        const aRng = a.range ? 0 : 1;
        const bRng = b.range ? 0 : 1;
        return aRng - bRng;
      });
      let writeIndex = 0;
      for (let readIndex = 1; readIndex < edits.length; readIndex++) {
        if (Range.getEndPosition(edits[writeIndex].range).equals(Range.getStartPosition(edits[readIndex].range))) {
          edits[writeIndex].range = Range.fromPositions(Range.getStartPosition(edits[writeIndex].range), Range.getEndPosition(edits[readIndex].range));
          edits[writeIndex].text += edits[readIndex].text;
        } else {
          writeIndex++;
          edits[writeIndex] = edits[readIndex];
        }
      }
      edits.length = writeIndex + 1;
      for (let { range: range2, text, eol } of edits) {
        if (typeof eol === "number") {
          lastEol = eol;
        }
        if (Range.isEmpty(range2) && !text) {
          continue;
        }
        const original = model.getValueInRange(range2);
        text = text.replace(/\r\n|\n|\r/g, model.eol);
        if (original === text) {
          continue;
        }
        if (Math.max(text.length, original.length) > _EditorWorker._diffLimit) {
          result.push({ range: range2, text });
          continue;
        }
        const changes = stringDiff(original, text, pretty);
        const editOffset = model.offsetAt(Range.lift(range2).getStartPosition());
        for (const change of changes) {
          const start = model.positionAt(editOffset + change.originalStart);
          const end = model.positionAt(editOffset + change.originalStart + change.originalLength);
          const newEdit = {
            text: text.substr(change.modifiedStart, change.modifiedLength),
            range: { startLineNumber: start.lineNumber, startColumn: start.column, endLineNumber: end.lineNumber, endColumn: end.column }
          };
          if (model.getValueInRange(newEdit.range) !== newEdit.text) {
            result.push(newEdit);
          }
        }
      }
      if (typeof lastEol === "number") {
        result.push({ eol: lastEol, text: "", range: { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 } });
      }
      return result;
    }
    // ---- END minimal edits ---------------------------------------------------------------
    async $computeLinks(modelUrl) {
      const model = this._getModel(modelUrl);
      if (!model) {
        return null;
      }
      return computeLinks(model);
    }
    // --- BEGIN default document colors -----------------------------------------------------------
    async $computeDefaultDocumentColors(modelUrl) {
      const model = this._getModel(modelUrl);
      if (!model) {
        return null;
      }
      return computeDefaultDocumentColors(model);
    }
    async $textualSuggest(modelUrls, leadingWord, wordDef, wordDefFlags) {
      const sw = new StopWatch();
      const wordDefRegExp = new RegExp(wordDef, wordDefFlags);
      const seen = /* @__PURE__ */ new Set();
      outer: for (const url of modelUrls) {
        const model = this._getModel(url);
        if (!model) {
          continue;
        }
        for (const word of model.words(wordDefRegExp)) {
          if (word === leadingWord || !isNaN(Number(word))) {
            continue;
          }
          seen.add(word);
          if (seen.size > _EditorWorker._suggestionsLimit) {
            break outer;
          }
        }
      }
      return { words: Array.from(seen), duration: sw.elapsed() };
    }
    // ---- END suggest --------------------------------------------------------------------------
    //#region -- word ranges --
    async $computeWordRanges(modelUrl, range2, wordDef, wordDefFlags) {
      const model = this._getModel(modelUrl);
      if (!model) {
        return /* @__PURE__ */ Object.create(null);
      }
      const wordDefRegExp = new RegExp(wordDef, wordDefFlags);
      const result = /* @__PURE__ */ Object.create(null);
      for (let line = range2.startLineNumber; line < range2.endLineNumber; line++) {
        const words = model.getLineWords(line, wordDefRegExp);
        for (const word of words) {
          if (!isNaN(Number(word.word))) {
            continue;
          }
          let array = result[word.word];
          if (!array) {
            array = [];
            result[word.word] = array;
          }
          array.push({
            startLineNumber: line,
            startColumn: word.startColumn,
            endLineNumber: line,
            endColumn: word.endColumn
          });
        }
      }
      return result;
    }
    //#endregion
    async $navigateValueSet(modelUrl, range2, up, wordDef, wordDefFlags) {
      const model = this._getModel(modelUrl);
      if (!model) {
        return null;
      }
      const wordDefRegExp = new RegExp(wordDef, wordDefFlags);
      if (range2.startColumn === range2.endColumn) {
        range2 = {
          startLineNumber: range2.startLineNumber,
          startColumn: range2.startColumn,
          endLineNumber: range2.endLineNumber,
          endColumn: range2.endColumn + 1
        };
      }
      const selectionText = model.getValueInRange(range2);
      const wordRange = model.getWordAtPosition({ lineNumber: range2.startLineNumber, column: range2.startColumn }, wordDefRegExp);
      if (!wordRange) {
        return null;
      }
      const word = model.getValueInRange(wordRange);
      const result = BasicInplaceReplace.INSTANCE.navigateValueSet(range2, selectionText, wordRange, word, up);
      return result;
    }
    // ---- BEGIN foreign module support --------------------------------------------------------------------------
    // foreign method request
    $fmr(method, args) {
      if (!this._foreignModule || typeof this._foreignModule[method] !== "function") {
        return Promise.reject(new Error("Missing requestHandler or method: " + method));
      }
      try {
        return Promise.resolve(this._foreignModule[method].apply(this._foreignModule, args));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
  _EditorWorker._diffLimit = 1e5;
  _EditorWorker._suggestionsLimit = 1e4;
  let EditorWorker = _EditorWorker;
  if (typeof importScripts === "function") {
    globalThis.monaco = createMonacoBaseAPI();
  }
  const _EditorWorkerHost = class _EditorWorkerHost {
    static getChannel(workerServer) {
      return workerServer.getChannel(_EditorWorkerHost.CHANNEL_NAME);
    }
    static setChannel(workerClient, obj) {
      workerClient.setChannel(_EditorWorkerHost.CHANNEL_NAME, obj);
    }
  };
  _EditorWorkerHost.CHANNEL_NAME = "editorWorkerHost";
  let EditorWorkerHost = _EditorWorkerHost;
  exports.AbstractIdleValue = AbstractIdleValue;
  exports.AbstractText = AbstractText;
  exports.ApplyEditsResult = ApplyEditsResult;
  exports.ArrayQueue = ArrayQueue;
  exports.AsyncIterableProducer = AsyncIterableProducer;
  exports.BidirectionalMap = BidirectionalMap;
  exports.BugIndicatingError = BugIndicatingError;
  exports.CachedFunction = CachedFunction;
  exports.CallbackIterable = CallbackIterable;
  exports.CancellationError = CancellationError;
  exports.CancellationTokenSource = CancellationTokenSource;
  exports.CharacterClassifier = CharacterClassifier;
  exports.CharacterSet = CharacterSet;
  exports.Codicon = Codicon;
  exports.Color = Color;
  exports.ConstantTimePrefixSumComputer = ConstantTimePrefixSumComputer;
  exports.DEFAULT_WORD_REGEXP = DEFAULT_WORD_REGEXP;
  exports.DebounceEmitter = DebounceEmitter;
  exports.DeferredPromise = DeferredPromise;
  exports.Delayer = Delayer;
  exports.DetailedLineRangeMapping = DetailedLineRangeMapping;
  exports.Disposable = Disposable;
  exports.DisposableMap = DisposableMap;
  exports.DisposableStore = DisposableStore;
  exports.EVENT_KEY_CODE_MAP = EVENT_KEY_CODE_MAP;
  exports.EditorWorker = EditorWorker;
  exports.EditorWorkerHost = EditorWorkerHost;
  exports.Emitter = Emitter;
  exports.EncodedTokenizationResult = EncodedTokenizationResult;
  exports.EventBufferer = EventBufferer;
  exports.EventMultiplexer = EventMultiplexer;
  exports.FindMatch = FindMatch;
  exports.FoldingRangeKind = FoldingRangeKind;
  exports.GlobalIdleValue = GlobalIdleValue;
  exports.GraphemeIterator = GraphemeIterator;
  exports.HSVA = HSVA;
  exports.IMMUTABLE_CODE_TO_KEY_CODE = IMMUTABLE_CODE_TO_KEY_CODE;
  exports.ImmortalReference = ImmortalReference;
  exports.IntervalTimer = IntervalTimer;
  exports.InvisibleCharacters = InvisibleCharacters;
  exports.KeyChord = KeyChord;
  exports.LRUCache = LRUCache;
  exports.Lazy = Lazy;
  exports.LazyTokenizationSupport = LazyTokenizationSupport;
  exports.LcsDiff = LcsDiff;
  exports.LineRange = LineRange;
  exports.LineRangeMapping = LineRangeMapping;
  exports.LineRangeSet = LineRangeSet;
  exports.LinkedList = LinkedList;
  exports.MicrotaskDelay = MicrotaskDelay;
  exports.MicrotaskEmitter = MicrotaskEmitter;
  exports.MovedText = MovedText;
  exports.MutableDisposable = MutableDisposable;
  exports.NKeyMap = NKeyMap;
  exports.NotSupportedError = NotSupportedError;
  exports.OS = OS;
  exports.OffsetRange = OffsetRange;
  exports.OffsetRangeSet = OffsetRangeSet;
  exports.PauseableEmitter = PauseableEmitter;
  exports.Permutation = Permutation;
  exports.Position = Position;
  exports.PositionOffsetTransformer = PositionOffsetTransformer;
  exports.PositionOffsetTransformerBase = PositionOffsetTransformerBase;
  exports.ProviderId = ProviderId;
  exports.RGBA = RGBA;
  exports.Range = Range;
  exports.RangeMapping = RangeMapping;
  exports.RefCountedDisposable = RefCountedDisposable;
  exports.Relay = Relay;
  exports.ResourceMap = ResourceMap;
  exports.ResourceSet = ResourceSet;
  exports.RunOnceScheduler = RunOnceScheduler;
  exports.SearchParams = SearchParams;
  exports.Searcher = Searcher;
  exports.SelectedSuggestionInfo = SelectedSuggestionInfo;
  exports.Selection = Selection;
  exports.SetMap = SetMap;
  exports.StopWatch = StopWatch;
  exports.StringDiffSequence = StringDiffSequence;
  exports.StringSHA1 = StringSHA1;
  exports.StringText = StringText;
  exports.TaskQueue = TaskQueue;
  exports.TextEdit = TextEdit;
  exports.TextLength = TextLength;
  exports.TextModelResolvedOptions = TextModelResolvedOptions;
  exports.TextModelSearch = TextModelSearch;
  exports.TextReplacement = TextReplacement;
  exports.ThrottledDelayer = ThrottledDelayer;
  exports.TimeoutTimer = TimeoutTimer;
  exports.Token = Token;
  exports.TokenizationRegistry = TokenizationRegistry;
  exports.TokenizationResult = TokenizationResult;
  exports.UNUSUAL_LINE_TERMINATORS = UNUSUAL_LINE_TERMINATORS;
  exports.URI = URI;
  exports.USUAL_WORD_SEPARATORS = USUAL_WORD_SEPARATORS;
  exports.UTF8_BOM_CHARACTER = UTF8_BOM_CHARACTER;
  exports.UnicodeTextModelHighlighter = UnicodeTextModelHighlighter;
  exports.VSBuffer = VSBuffer;
  exports.ValidAnnotatedEditOperation = ValidAnnotatedEditOperation;
  exports.WebWorkerClient = WebWorkerClient;
  exports.WebWorkerServer = WebWorkerServer;
  exports.WorkerTextModelSyncClient = WorkerTextModelSyncClient;
  exports._setPositionOffsetTransformerDependencies = _setPositionOffsetTransformerDependencies;
  exports.arrayInsert = arrayInsert;
  exports.asArray = asArray;
  exports.assert = assert;
  exports.assertFn = assertFn;
  exports.assertNever = assertNever;
  exports.assertReturnsDefined = assertReturnsDefined;
  exports.assertType = assertType;
  exports.basename = basename;
  exports.binarySearch = binarySearch;
  exports.binarySearch2 = binarySearch2;
  exports.booleanComparator = booleanComparator;
  exports.cancelOnDispose = cancelOnDispose;
  exports.canceled = canceled;
  exports.checkAdjacentItems = checkAdjacentItems;
  exports.cloneAndChange = cloneAndChange;
  exports.coalesce = coalesce;
  exports.coalesceInPlace = coalesceInPlace;
  exports.combinedDisposable = combinedDisposable;
  exports.commonPrefixLength = commonPrefixLength;
  exports.commonSuffixLength = commonSuffixLength;
  exports.compare = compare;
  exports.compareBy = compareBy;
  exports.compareIgnoreCase = compareIgnoreCase;
  exports.compareSubstring = compareSubstring;
  exports.compareSubstringIgnoreCase = compareSubstringIgnoreCase;
  exports.compareUndefinedSmallest = compareUndefinedSmallest;
  exports.containsRTL = containsRTL;
  exports.containsUnusualLineTerminators = containsUnusualLineTerminators;
  exports.containsUppercaseCharacter = containsUppercaseCharacter;
  exports.convertSimple2RegExpPattern = convertSimple2RegExpPattern;
  exports.createCancelableAsyncIterableProducer = createCancelableAsyncIterableProducer;
  exports.createCancelablePromise = createCancelablePromise;
  exports.createEventDeliveryQueue = createEventDeliveryQueue;
  exports.createFindMatch = createFindMatch;
  exports.createMonacoBaseAPI = createMonacoBaseAPI;
  exports.createRegExp = createRegExp;
  exports.createSingleCallFunction = createSingleCallFunction;
  exports.deepClone = deepClone;
  exports.deepFreeze = deepFreeze;
  exports.dirname = dirname;
  exports.disposableTimeout = disposableTimeout;
  exports.dispose = dispose;
  exports.distinct = distinct;
  exports.doHash = doHash;
  exports.endsWithIgnoreCase = endsWithIgnoreCase;
  exports.ensureValidWordDefinition = ensureValidWordDefinition;
  exports.env = env;
  exports.equals = equals$2;
  exports.equals$1 = equals$1;
  exports.equals$2 = equals;
  exports.equalsIgnoreCase = equalsIgnoreCase;
  exports.escape = escape;
  exports.escapeRegExpCharacters = escapeRegExpCharacters;
  exports.extname = extname;
  exports.findFirstIdxMonotonousOrArrLen = findFirstIdxMonotonousOrArrLen;
  exports.findFirstMax = findFirstMax;
  exports.findFirstMin = findFirstMin;
  exports.findLast = findLast;
  exports.findLastMax = findLastMax;
  exports.findMaxIdx = findMaxIdx;
  exports.first = first;
  exports.firstNonWhitespaceIndex = firstNonWhitespaceIndex;
  exports.forEachAdjacent = forEachAdjacent;
  exports.format = format;
  exports.getAriaLabelForSymbol = getAriaLabelForSymbol;
  exports.getCharContainingOffset = getCharContainingOffset;
  exports.getCodiconFontCharacters = getCodiconFontCharacters;
  exports.getLeadingWhitespace = getLeadingWhitespace;
  exports.getLeftDeleteOffset = getLeftDeleteOffset;
  exports.getMapForWordSeparators = getMapForWordSeparators;
  exports.getNLSLanguage = getNLSLanguage;
  exports.getNLSMessages = getNLSMessages;
  exports.getNextCodePoint = getNextCodePoint;
  exports.getWordAtText = getWordAtText;
  exports.groupAdjacentBy = groupAdjacentBy;
  exports.groupBy = groupBy;
  exports.hash = hash;
  exports.htmlAttributeEncodeValue = htmlAttributeEncodeValue;
  exports.illegalArgument = illegalArgument;
  exports.illegalState = illegalState;
  exports.isAndroid = isAndroid;
  exports.isArrayOf = isArrayOf;
  exports.isAsciiDigit = isAsciiDigit;
  exports.isBasicASCII = isBasicASCII;
  exports.isBoolean = isBoolean;
  exports.isCancellationError = isCancellationError;
  exports.isChrome = isChrome;
  exports.isDefined = isDefined;
  exports.isDisposable = isDisposable;
  exports.isEdge = isEdge;
  exports.isEmojiImprecise = isEmojiImprecise;
  exports.isFalsyOrEmpty = isFalsyOrEmpty;
  exports.isFalsyOrWhitespace = isFalsyOrWhitespace;
  exports.isFirefox = isFirefox;
  exports.isFullWidthCharacter = isFullWidthCharacter;
  exports.isFunction = isFunction;
  exports.isHighSurrogate = isHighSurrogate;
  exports.isIOS = isIOS;
  exports.isITextSnapshot = isITextSnapshot;
  exports.isIterable = isIterable;
  exports.isLinux = isLinux;
  exports.isLittleEndian = isLittleEndian;
  exports.isLocationLink = isLocationLink;
  exports.isLowSurrogate = isLowSurrogate;
  exports.isLowerAsciiLetter = isLowerAsciiLetter;
  exports.isMacintosh = isMacintosh;
  exports.isMobile = isMobile;
  exports.isModifierKey = isModifierKey;
  exports.isNative = isNative;
  exports.isNonEmptyArray = isNonEmptyArray;
  exports.isNumber = isNumber;
  exports.isObject = isObject;
  exports.isSafari = isSafari;
  exports.isString = isString;
  exports.isThenable = isThenable;
  exports.isUndefined = isUndefined;
  exports.isUndefinedOrNull = isUndefinedOrNull;
  exports.isUpperAsciiLetter = isUpperAsciiLetter;
  exports.isValidMatch = isValidMatch;
  exports.isWeb = isWeb;
  exports.isWindows = isWindows;
  exports.join = join;
  exports.language = language;
  exports.lastNonWhitespaceIndex = lastNonWhitespaceIndex;
  exports.lineRangeMappingFromRangeMappings = lineRangeMappingFromRangeMappings;
  exports.linesDiffComputers = linesDiffComputers;
  exports.localize = localize;
  exports.localize2 = localize2;
  exports.logOnceWebWorkerWarning = logOnceWebWorkerWarning;
  exports.ltrim = ltrim;
  exports.mapFilter = mapFilter;
  exports.mapFindFirst = mapFindFirst;
  exports.markAsSingleton = markAsSingleton;
  exports.mixin = mixin;
  exports.nextCharLength = nextCharLength;
  exports.noBreakWhitespace = noBreakWhitespace;
  exports.normalize = normalize;
  exports.numberComparator = numberComparator;
  exports.ok = ok;
  exports.onBugIndicatingError = onBugIndicatingError;
  exports.onUnexpectedError = onUnexpectedError;
  exports.onUnexpectedExternalError = onUnexpectedExternalError;
  exports.platform = platform$1;
  exports.posix = posix;
  exports.prevCharLength = prevCharLength;
  exports.pushMany = pushMany;
  exports.pushToEnd = pushToEnd;
  exports.pushToStart = pushToStart;
  exports.quickSelect = quickSelect;
  exports.raceCancellation = raceCancellation;
  exports.raceCancellationError = raceCancellationError;
  exports.raceTimeout = raceTimeout;
  exports.range = range;
  exports.readUInt16LE = readUInt16LE;
  exports.readUInt32BE = readUInt32BE;
  exports.readUInt8 = readUInt8;
  exports.regExpLeadsToEndlessLoop = regExpLeadsToEndlessLoop;
  exports.relative = relative;
  exports.removeFastWithoutKeepingOrder = removeFastWithoutKeepingOrder;
  exports.resolve = resolve;
  exports.reverseOrder = reverseOrder;
  exports.rtrim = rtrim;
  exports.safeIntl = safeIntl;
  exports.sep = sep;
  exports.setTimeout0 = setTimeout0;
  exports.shouldSynchronizeModel = shouldSynchronizeModel;
  exports.singleLetterHash = singleLetterHash;
  exports.softAssert = softAssert;
  exports.splice = splice;
  exports.splitLines = splitLines;
  exports.startsWithIgnoreCase = startsWithIgnoreCase;
  exports.startsWithUTF8BOM = startsWithUTF8BOM;
  exports.sum = sum;
  exports.tail = tail;
  exports.tieBreakComparators = tieBreakComparators;
  exports.timeout = timeout;
  exports.toDisposable = toDisposable;
  exports.toUint8 = toUint8;
  exports.trim = trim;
  exports.upcast = upcast;
  exports.uriToFsPath = uriToFsPath;
  exports.validateConstraints = validateConstraints;
  exports.webWorkerOrigin = webWorkerOrigin;
  exports.writeUInt16LE = writeUInt16LE;
  exports.writeUInt32BE = writeUInt32BE;
  exports.writeUInt8 = writeUInt8;
}));
