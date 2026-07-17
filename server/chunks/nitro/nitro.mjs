import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import { createHash } from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
import invariant from 'vinxi/lib/invariant';
import { virtualId, handlerModule, join as join$1 } from 'vinxi/lib/path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { getOwner, getListener, onCleanup, sharedConfig, createSignal, startTransition, createMemo, useContext, untrack, createContext as createContext$1, createRenderEffect, on, runWithOwner, resetErrorBoundaries, batch, createComponent, lazy, createUniqueId, onMount, mergeProps as mergeProps$1, splitProps, catchError, ErrorBoundary, Suspense, children, Show, createRoot } from 'solid-js';
import { isServer, getRequestEvent, renderToString, ssrElement, escape, mergeProps, ssr, createComponent as createComponent$1, useAssets, spread, renderToStream, ssrHydrationKey, NoHydration, Hydration, ssrAttribute, HydrationScript, delegateEvents } from 'solid-js/web';
import { provideRequestEvent } from 'solid-js/web/storage';
import { Feature, fromJSON, crossSerializeStream, getCrossReferenceHeader, toCrossJSONStream } from 'seroval';
import { AbortSignalPlugin, CustomEventPlugin, DOMExceptionPlugin, EventPlugin, FormDataPlugin, HeadersPlugin, ReadableStreamPlugin, RequestPlugin, ResponsePlugin, URLSearchParamsPlugin, URLPlugin } from 'seroval-plugins/web';
import * as se from '@solid-primitives/i18n';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const nextChar = input[_base.length];
  if (nextChar && nextChar !== "/" && nextChar !== "?") {
    return input;
  }
  const trimmed = input.slice(_base.length).replace(/^\/+/, "");
  return "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = { ...defaults };
  for (const key of Object.keys(baseObject)) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o$2(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o$2("Readable.asyncIterator")}iterator(e){throw o$2("Readable.iterator")}map(e,t){throw o$2("Readable.map")}filter(e,t){throw o$2("Readable.filter")}forEach(e,t){throw o$2("Readable.forEach")}reduce(e,t,r){throw o$2("Readable.reduce")}find(e,t){throw o$2("Readable.find")}findIndex(e,t){throw o$2("Readable.findIndex")}some(e,t){throw o$2("Readable.some")}toArray(e){throw o$2("Readable.toArray")}every(e,t){throw o$2("Readable.every")}flatMap(e,t){throw o$2("Readable.flatMap")}drop(e,t){throw o$2("Readable.drop")}take(e,t){throw o$2("Readable.take")}asIndexedPairs(e){throw o$2("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c=class{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _$1(){return Object.assign(c.prototype,i$1.prototype),Object.assign(c.prototype,l$1.prototype),c}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_$1();let A$2 = class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}};class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A$2;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}let w$1 = class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}};const E$1=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E$1,t=Array.isArray(n)||H$2(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H$2(n){return typeof n?.entries=="function"}function v$1(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S$3=new Set([101,204,205,304]);async function b$1(n,e){const t=new y,r=new w$1(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S$3.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C$1(n,e,t={}){try{const r=await b$1(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v$1(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp$1(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

let H3Error$1 = class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode$1(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage$1(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
};
function createError$2(input) {
  if (typeof input === "string") {
    return new H3Error$1(input);
  }
  if (isError$1(input)) {
    return input;
  }
  const err = new H3Error$1(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp$1(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode$1(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode$1(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage$1(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError$1(error) ? error : createError$2(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus$1(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES$1.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError$1(input) {
  return input?.constructor?.__h3_error__ === true;
}
function isMethod$1(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod$1(event, expected, allowHead) {
  if (!isMethod$1(event, expected)) {
    throw createError$2({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders$1(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader$1(event, name) {
  const headers = getRequestHeaders$1(event);
  const value = headers[name.toLowerCase()];
  return value;
}
function getRequestHost$1(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol$1(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL$1(event, opts = {}) {
  const host = getRequestHost$1(event, opts);
  const protocol = getRequestProtocol$1(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol$1 = Symbol.for("h3RawBody");
const PayloadMethods$1$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody$1(event, encoding = "utf8") {
  assertMethod$1(event, PayloadMethods$1$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol$1] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !/\bchunked\b/i.test(
    String(event.node.req.headers["transfer-encoding"] ?? "")
  )) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol$1] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream$1(event) {
  if (!PayloadMethods$1$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol$1 in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody$1(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES$1 = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS$1 = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage$1(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS$1, "");
}
function sanitizeStatusCode$1(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}
function splitCookiesString$1(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString$1(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer$1 = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send$1(event, data, type) {
  if (type) {
    defaultContentType$1(event, type);
  }
  return new Promise((resolve) => {
    defer$1(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode$1(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus$1(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode$1(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage$1(text);
  }
}
function defaultContentType$1(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect$1(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode$1(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send$1(event, html, MIMES$1.html);
}
function getResponseHeader$1(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader$1(event, name, value) {
  event.node.res.setHeader(name, value);
}
function appendResponseHeader$1(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader$1(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream$1(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp$1(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp$1(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse$1(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString$1(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode$1(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage$1(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream$1(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream$1(event);
      duplex = "half";
    } else {
      body = await readRawBody$1(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$2({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode$1(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage$1(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString$1(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders$1(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

let H3Event$1 = class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders$1(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse$1(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
};
function isEvent(input) {
  return hasProp$1(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event$1(req, res);
}
function _normalizeNodeHeaders$1(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler$1(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray$1(handler.onRequest),
    onBeforeResponse: _normalizeArray$1(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler$1(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray$1(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler$1(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler$1 = defineEventHandler$1;
function isEventHandler(input) {
  return hasProp$1(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler$1((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler$1(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _rawReqUrl = event.node.req.url || "/";
    const _reqPath = _decodePath(event._path || _rawReqUrl);
    event._path = _reqPath;
    const _needsRawUrl = _reqPath !== _rawReqUrl;
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _needsRawUrl ? layer.route.length > 1 ? _rawReqUrl.slice(layer.route.length) || "/" : _rawReqUrl : _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$2({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse$1(event, val);
    }
    if (isStream(val)) {
      return sendStream$1(event, val);
    }
    if (val.buffer) {
      return send$1(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send$1(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$2(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send$1(event, val, MIMES$1.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send$1(event, JSON.stringify(val, void 0, jsonSpace), MIMES$1.json);
  }
  if (valType === "bigint") {
    return send$1(event, val.toString(), MIMES$1.json);
  }
  throw createError$2({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function _decodePath(url) {
  const qIndex = url.indexOf("?");
  const path = qIndex === -1 ? url : url.slice(0, qIndex);
  const query = qIndex === -1 ? "" : url.slice(qIndex);
  const decodedPath = path.includes("%25") ? decodePath(path.replace(/%25/g, "%2525")) : decodePath(path);
  return decodedPath + query;
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$2({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$2({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler$1((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$2(_error);
      if (!isError$1(_error)) {
        error.unhandled = true;
      }
      setResponseStatus$1(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController = globalThis.AbortController || i;
createFetch({ fetch, Headers: Headers$1, AbortController });

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError$1(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError$1);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError$1(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError$1(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError$1(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r$2="sha256",s="base64url";function digest(t){if(e)return e(r$2,t,s);const o=createHash(r$2).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize$1(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize$1(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler$1(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString$1(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {};



const appConfig$1 = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/"
  },
  "nitro": {
    "routeRules": {
      "/_build/assets/**": {
        "headers": {
          "cache-control": "public, immutable, max-age=31536000"
        }
      }
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  {
    return _sharedRuntimeConfig;
  }
}
_deepFreeze(klona(appConfig$1));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

const nitroAsyncContext = getContext("nitro-app", {
  asyncContext: true,
  AsyncLocalStorage: AsyncLocalStorage 
});

function isPathInScope(pathname, base) {
  let canonical;
  try {
    const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
    canonical = new URL(pre, "http://_").pathname;
  } catch {
    return false;
  }
  return !base || canonical === base || canonical.startsWith(base + "/");
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler$1((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError$2({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect$1(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError$2({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString$1(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$0 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus$1(event, res.status, res.statusText);
    return send$1(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL$1(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus$1(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader$1(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const appConfig = {"name":"vinxi","routers":[{"name":"public","type":"static","base":"/","dir":"./public","root":"/Users/hector/Documents/granite_concepts","order":0,"outDir":"/Users/hector/Documents/granite_concepts/.vinxi/build/public"},{"name":"ssr","type":"http","link":{"client":"client"},"handler":"src/entry-server.tsx","extensions":["js","jsx","ts","tsx"],"target":"server","root":"/Users/hector/Documents/granite_concepts","base":"/","outDir":"/Users/hector/Documents/granite_concepts/.vinxi/build/ssr","order":1},{"name":"client","type":"client","base":"/_build","handler":"src/entry-client.tsx","extensions":["js","jsx","ts","tsx"],"target":"browser","root":"/Users/hector/Documents/granite_concepts","outDir":"/Users/hector/Documents/granite_concepts/.vinxi/build/client","order":2},{"name":"server-fns","type":"http","base":"/_server","handler":"node_modules/@solidjs/start/dist/runtime/server-handler.js","target":"server","root":"/Users/hector/Documents/granite_concepts","outDir":"/Users/hector/Documents/granite_concepts/.vinxi/build/server-fns","order":3}],"server":{"compressPublicAssets":{"brotli":true},"routeRules":{"/_build/assets/**":{"headers":{"cache-control":"public, immutable, max-age=31536000"}}},"experimental":{"asyncContext":true},"preset":"node-server"},"root":"/Users/hector/Documents/granite_concepts"};
					const buildManifest = {"ssr":{"_HttpStatusCode-DH8IeaZe.js":{"file":"assets/HttpStatusCode-DH8IeaZe.js","name":"HttpStatusCode"},"_WorkCard-DVhptAHi.js":{"file":"assets/WorkCard-DVhptAHi.js","name":"WorkCard","imports":["_index-BYXpTUyv.js","_components-DVz6I4yd.js"]},"_api-DvMp1z1V.js":{"file":"assets/api-DvMp1z1V.js","name":"api"},"_components-DVz6I4yd.js":{"file":"assets/components-DVz6I4yd.js","name":"components","imports":["_index-BYXpTUyv.js"]},"_createAsync-CBz8AaaQ.js":{"file":"assets/createAsync-CBz8AaaQ.js","name":"createAsync"},"_images-B43p2foP.js":{"file":"assets/images-B43p2foP.js","name":"images"},"_index-BYXpTUyv.js":{"file":"assets/index-BYXpTUyv.js","name":"index"},"node_modules/@fontsource-variable/outfit/files/outfit-latin-ext-wght-normal.woff2":{"file":"assets/outfit-latin-ext-wght-normal-DdQaqQDo.woff2","src":"node_modules/@fontsource-variable/outfit/files/outfit-latin-ext-wght-normal.woff2"},"node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2":{"file":"assets/outfit-latin-wght-normal-Bc-8i84L.woff2","src":"node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-italic.woff":{"file":"assets/cormorant-garamond-cyrillic-300-italic-Bo30KLu4.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-italic.woff2":{"file":"assets/cormorant-garamond-cyrillic-300-italic-Bi4RSOgf.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-normal.woff":{"file":"assets/cormorant-garamond-cyrillic-300-normal-KEduutn5.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-normal.woff2":{"file":"assets/cormorant-garamond-cyrillic-300-normal-DZNkLIMe.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-italic.woff":{"file":"assets/cormorant-garamond-cyrillic-400-italic-AH1vqu4S.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-italic.woff2":{"file":"assets/cormorant-garamond-cyrillic-400-italic-D3GtrbRZ.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-normal.woff":{"file":"assets/cormorant-garamond-cyrillic-400-normal-CVFrM67f.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-normal.woff2":{"file":"assets/cormorant-garamond-cyrillic-400-normal-DD2KOZkl.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-italic.woff":{"file":"assets/cormorant-garamond-cyrillic-ext-300-italic-Dj41S4NK.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-italic.woff2":{"file":"assets/cormorant-garamond-cyrillic-ext-300-italic-B31MkR9z.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-normal.woff":{"file":"assets/cormorant-garamond-cyrillic-ext-300-normal-B5wCrnbP.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-normal.woff2":{"file":"assets/cormorant-garamond-cyrillic-ext-300-normal-D8IReVS-.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-italic.woff":{"file":"assets/cormorant-garamond-cyrillic-ext-400-italic-C_Uk1MUY.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-italic.woff2":{"file":"assets/cormorant-garamond-cyrillic-ext-400-italic-BEGvmv_3.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-normal.woff":{"file":"assets/cormorant-garamond-cyrillic-ext-400-normal-DLdKLAvx.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-normal.woff2":{"file":"assets/cormorant-garamond-cyrillic-ext-400-normal-W3Dto7M0.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff":{"file":"assets/cormorant-garamond-latin-300-italic-DRnsRYID.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff2":{"file":"assets/cormorant-garamond-latin-300-italic-qkwBXYHn.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff":{"file":"assets/cormorant-garamond-latin-300-normal-BuXLI6C0.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff2":{"file":"assets/cormorant-garamond-latin-300-normal-Cw-E_7L1.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff":{"file":"assets/cormorant-garamond-latin-400-italic-BLh7T8o8.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2":{"file":"assets/cormorant-garamond-latin-400-italic-Dc_OZ8oc.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff":{"file":"assets/cormorant-garamond-latin-400-normal-B7YtguxJ.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2":{"file":"assets/cormorant-garamond-latin-400-normal-B-1hWBU7.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-italic.woff":{"file":"assets/cormorant-garamond-latin-ext-300-italic-DambfolG.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-italic.woff2":{"file":"assets/cormorant-garamond-latin-ext-300-italic-Bt0Wsy7Q.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-normal.woff":{"file":"assets/cormorant-garamond-latin-ext-300-normal-DueGyF8j.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-normal.woff2":{"file":"assets/cormorant-garamond-latin-ext-300-normal-BsCYHBWC.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-italic.woff":{"file":"assets/cormorant-garamond-latin-ext-400-italic-CQvLaSWn.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-italic.woff2":{"file":"assets/cormorant-garamond-latin-ext-400-italic-BdEzgT7i.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-normal.woff":{"file":"assets/cormorant-garamond-latin-ext-400-normal-uvC0WHQr.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-normal.woff2":{"file":"assets/cormorant-garamond-latin-ext-400-normal-Drx2k2n9.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-italic.woff":{"file":"assets/cormorant-garamond-vietnamese-300-italic-DjSFy2Pr.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-italic.woff2":{"file":"assets/cormorant-garamond-vietnamese-300-italic-CCKicgM4.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-normal.woff":{"file":"assets/cormorant-garamond-vietnamese-300-normal-ByHlPz7v.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-normal.woff2":{"file":"assets/cormorant-garamond-vietnamese-300-normal-BTzPAsHw.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-italic.woff":{"file":"assets/cormorant-garamond-vietnamese-400-italic-CJpMwFnN.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-italic.woff2":{"file":"assets/cormorant-garamond-vietnamese-400-italic-BoXDRTEW.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-normal.woff":{"file":"assets/cormorant-garamond-vietnamese-400-normal-4uxlocMh.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-normal.woff2":{"file":"assets/cormorant-garamond-vietnamese-400-normal-6K-YXo6g.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-normal.woff2"},"src/routes/cotizacion.tsx?pick=default&pick=$css":{"file":"cotizacion.js","name":"cotizacion","src":"src/routes/cotizacion.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BYXpTUyv.js","_api-DvMp1z1V.js","_createAsync-CBz8AaaQ.js"],"css":["assets/cotizacion-DfL1dgXL.css"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"index.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BYXpTUyv.js","_api-DvMp1z1V.js","_images-B43p2foP.js","_components-DVz6I4yd.js","_WorkCard-DVhptAHi.js","_createAsync-CBz8AaaQ.js"],"css":["assets/index-C-w2-xr9.css"]},"src/routes/materiales/[slug].tsx?pick=default&pick=$css":{"file":"_slug_.js","name":"_slug_","src":"src/routes/materiales/[slug].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_HttpStatusCode-DH8IeaZe.js","_index-BYXpTUyv.js","_api-DvMp1z1V.js","_images-B43p2foP.js","_createAsync-CBz8AaaQ.js","_components-DVz6I4yd.js"]},"src/routes/materiales/index.tsx?pick=default&pick=$css":{"file":"index2.js","name":"index","src":"src/routes/materiales/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BYXpTUyv.js","_api-DvMp1z1V.js","_images-B43p2foP.js","_components-DVz6I4yd.js","_createAsync-CBz8AaaQ.js"],"css":["assets/index-BuiKoTyY.css"]},"src/routes/sitemap.xml.ts?pick=GET":{"file":"sitemap.xml.js","name":"sitemap.xml","src":"src/routes/sitemap.xml.ts?pick=GET","isEntry":true,"isDynamicEntry":true,"imports":["_api-DvMp1z1V.js"]},"src/routes/trabajos/[slug].tsx?pick=default&pick=$css":{"file":"_slug_2.js","name":"_slug_","src":"src/routes/trabajos/[slug].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_HttpStatusCode-DH8IeaZe.js","_index-BYXpTUyv.js","_api-DvMp1z1V.js","_createAsync-CBz8AaaQ.js","_components-DVz6I4yd.js"]},"src/routes/trabajos/index.tsx?pick=default&pick=$css":{"file":"index3.js","name":"index","src":"src/routes/trabajos/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BYXpTUyv.js","_api-DvMp1z1V.js","_WorkCard-DVhptAHi.js","_createAsync-CBz8AaaQ.js","_components-DVz6I4yd.js"]},"virtual:$vinxi/handler/ssr":{"file":"ssr.js","name":"ssr","src":"virtual:$vinxi/handler/ssr","isEntry":true,"imports":["_api-DvMp1z1V.js","_index-BYXpTUyv.js","_components-DVz6I4yd.js","_HttpStatusCode-DH8IeaZe.js"],"dynamicImports":["src/routes/cotizacion.tsx?pick=default&pick=$css","src/routes/cotizacion.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/materiales/[slug].tsx?pick=default&pick=$css","src/routes/materiales/[slug].tsx?pick=default&pick=$css","src/routes/materiales/index.tsx?pick=default&pick=$css","src/routes/materiales/index.tsx?pick=default&pick=$css","src/routes/sitemap.xml.ts?pick=GET","src/routes/sitemap.xml.ts?pick=GET","src/routes/sitemap.xml.ts?pick=GET","src/routes/sitemap.xml.ts?pick=GET","src/routes/trabajos/[slug].tsx?pick=default&pick=$css","src/routes/trabajos/[slug].tsx?pick=default&pick=$css","src/routes/trabajos/index.tsx?pick=default&pick=$css","src/routes/trabajos/index.tsx?pick=default&pick=$css"],"css":["assets/ssr-B8ii3ENT.css"],"assets":["assets/cormorant-garamond-cyrillic-ext-300-normal-D8IReVS-.woff2","assets/cormorant-garamond-cyrillic-ext-300-normal-B5wCrnbP.woff","assets/cormorant-garamond-cyrillic-300-normal-DZNkLIMe.woff2","assets/cormorant-garamond-cyrillic-300-normal-KEduutn5.woff","assets/cormorant-garamond-vietnamese-300-normal-BTzPAsHw.woff2","assets/cormorant-garamond-vietnamese-300-normal-ByHlPz7v.woff","assets/cormorant-garamond-latin-ext-300-normal-BsCYHBWC.woff2","assets/cormorant-garamond-latin-ext-300-normal-DueGyF8j.woff","assets/cormorant-garamond-latin-300-normal-Cw-E_7L1.woff2","assets/cormorant-garamond-latin-300-normal-BuXLI6C0.woff","assets/cormorant-garamond-cyrillic-ext-400-normal-W3Dto7M0.woff2","assets/cormorant-garamond-cyrillic-ext-400-normal-DLdKLAvx.woff","assets/cormorant-garamond-cyrillic-400-normal-DD2KOZkl.woff2","assets/cormorant-garamond-cyrillic-400-normal-CVFrM67f.woff","assets/cormorant-garamond-vietnamese-400-normal-6K-YXo6g.woff2","assets/cormorant-garamond-vietnamese-400-normal-4uxlocMh.woff","assets/cormorant-garamond-latin-ext-400-normal-Drx2k2n9.woff2","assets/cormorant-garamond-latin-ext-400-normal-uvC0WHQr.woff","assets/cormorant-garamond-latin-400-normal-B-1hWBU7.woff2","assets/cormorant-garamond-latin-400-normal-B7YtguxJ.woff","assets/cormorant-garamond-cyrillic-ext-300-italic-B31MkR9z.woff2","assets/cormorant-garamond-cyrillic-ext-300-italic-Dj41S4NK.woff","assets/cormorant-garamond-cyrillic-300-italic-Bi4RSOgf.woff2","assets/cormorant-garamond-cyrillic-300-italic-Bo30KLu4.woff","assets/cormorant-garamond-vietnamese-300-italic-CCKicgM4.woff2","assets/cormorant-garamond-vietnamese-300-italic-DjSFy2Pr.woff","assets/cormorant-garamond-latin-ext-300-italic-Bt0Wsy7Q.woff2","assets/cormorant-garamond-latin-ext-300-italic-DambfolG.woff","assets/cormorant-garamond-latin-300-italic-qkwBXYHn.woff2","assets/cormorant-garamond-latin-300-italic-DRnsRYID.woff","assets/cormorant-garamond-cyrillic-ext-400-italic-BEGvmv_3.woff2","assets/cormorant-garamond-cyrillic-ext-400-italic-C_Uk1MUY.woff","assets/cormorant-garamond-cyrillic-400-italic-D3GtrbRZ.woff2","assets/cormorant-garamond-cyrillic-400-italic-AH1vqu4S.woff","assets/cormorant-garamond-vietnamese-400-italic-BoXDRTEW.woff2","assets/cormorant-garamond-vietnamese-400-italic-CJpMwFnN.woff","assets/cormorant-garamond-latin-ext-400-italic-BdEzgT7i.woff2","assets/cormorant-garamond-latin-ext-400-italic-CQvLaSWn.woff","assets/cormorant-garamond-latin-400-italic-Dc_OZ8oc.woff2","assets/cormorant-garamond-latin-400-italic-BLh7T8o8.woff","assets/outfit-latin-ext-wght-normal-DdQaqQDo.woff2","assets/outfit-latin-wght-normal-Bc-8i84L.woff2"]}},"client":{"_HttpStatusCode-DjTx85av.js":{"file":"assets/HttpStatusCode-DjTx85av.js","name":"HttpStatusCode"},"_WorkCard-D3ctHGyQ.js":{"file":"assets/WorkCard-D3ctHGyQ.js","name":"WorkCard","imports":["_index-i8seYcQE.js","_components-0DQTjknt.js"]},"_components-0DQTjknt.js":{"file":"assets/components-0DQTjknt.js","name":"components","imports":["_index-i8seYcQE.js"]},"_createAsync-zEJ5ZHo1.js":{"file":"assets/createAsync-zEJ5ZHo1.js","name":"createAsync","imports":["_index-i8seYcQE.js"]},"_images-B43p2foP.js":{"file":"assets/images-B43p2foP.js","name":"images"},"_index-i8seYcQE.js":{"file":"assets/index-i8seYcQE.js","name":"index"},"_preload-helper-ug3pwPZ1.js":{"file":"assets/preload-helper-ug3pwPZ1.js","name":"preload-helper"},"node_modules/@fontsource-variable/outfit/files/outfit-latin-ext-wght-normal.woff2":{"file":"assets/outfit-latin-ext-wght-normal-DdQaqQDo.woff2","src":"node_modules/@fontsource-variable/outfit/files/outfit-latin-ext-wght-normal.woff2"},"node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2":{"file":"assets/outfit-latin-wght-normal-Bc-8i84L.woff2","src":"node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-italic.woff":{"file":"assets/cormorant-garamond-cyrillic-300-italic-Bo30KLu4.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-italic.woff2":{"file":"assets/cormorant-garamond-cyrillic-300-italic-Bi4RSOgf.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-normal.woff":{"file":"assets/cormorant-garamond-cyrillic-300-normal-KEduutn5.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-normal.woff2":{"file":"assets/cormorant-garamond-cyrillic-300-normal-DZNkLIMe.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-italic.woff":{"file":"assets/cormorant-garamond-cyrillic-400-italic-AH1vqu4S.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-italic.woff2":{"file":"assets/cormorant-garamond-cyrillic-400-italic-D3GtrbRZ.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-normal.woff":{"file":"assets/cormorant-garamond-cyrillic-400-normal-CVFrM67f.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-normal.woff2":{"file":"assets/cormorant-garamond-cyrillic-400-normal-DD2KOZkl.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-italic.woff":{"file":"assets/cormorant-garamond-cyrillic-ext-300-italic-Dj41S4NK.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-italic.woff2":{"file":"assets/cormorant-garamond-cyrillic-ext-300-italic-B31MkR9z.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-normal.woff":{"file":"assets/cormorant-garamond-cyrillic-ext-300-normal-B5wCrnbP.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-normal.woff2":{"file":"assets/cormorant-garamond-cyrillic-ext-300-normal-D8IReVS-.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-italic.woff":{"file":"assets/cormorant-garamond-cyrillic-ext-400-italic-C_Uk1MUY.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-italic.woff2":{"file":"assets/cormorant-garamond-cyrillic-ext-400-italic-BEGvmv_3.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-normal.woff":{"file":"assets/cormorant-garamond-cyrillic-ext-400-normal-DLdKLAvx.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-normal.woff2":{"file":"assets/cormorant-garamond-cyrillic-ext-400-normal-W3Dto7M0.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff":{"file":"assets/cormorant-garamond-latin-300-italic-DRnsRYID.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff2":{"file":"assets/cormorant-garamond-latin-300-italic-qkwBXYHn.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff":{"file":"assets/cormorant-garamond-latin-300-normal-BuXLI6C0.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff2":{"file":"assets/cormorant-garamond-latin-300-normal-Cw-E_7L1.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff":{"file":"assets/cormorant-garamond-latin-400-italic-BLh7T8o8.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2":{"file":"assets/cormorant-garamond-latin-400-italic-Dc_OZ8oc.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff":{"file":"assets/cormorant-garamond-latin-400-normal-B7YtguxJ.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2":{"file":"assets/cormorant-garamond-latin-400-normal-B-1hWBU7.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-italic.woff":{"file":"assets/cormorant-garamond-latin-ext-300-italic-DambfolG.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-italic.woff2":{"file":"assets/cormorant-garamond-latin-ext-300-italic-Bt0Wsy7Q.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-normal.woff":{"file":"assets/cormorant-garamond-latin-ext-300-normal-DueGyF8j.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-normal.woff2":{"file":"assets/cormorant-garamond-latin-ext-300-normal-BsCYHBWC.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-italic.woff":{"file":"assets/cormorant-garamond-latin-ext-400-italic-CQvLaSWn.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-italic.woff2":{"file":"assets/cormorant-garamond-latin-ext-400-italic-BdEzgT7i.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-normal.woff":{"file":"assets/cormorant-garamond-latin-ext-400-normal-uvC0WHQr.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-normal.woff2":{"file":"assets/cormorant-garamond-latin-ext-400-normal-Drx2k2n9.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-italic.woff":{"file":"assets/cormorant-garamond-vietnamese-300-italic-DjSFy2Pr.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-italic.woff2":{"file":"assets/cormorant-garamond-vietnamese-300-italic-CCKicgM4.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-normal.woff":{"file":"assets/cormorant-garamond-vietnamese-300-normal-ByHlPz7v.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-normal.woff2":{"file":"assets/cormorant-garamond-vietnamese-300-normal-BTzPAsHw.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-italic.woff":{"file":"assets/cormorant-garamond-vietnamese-400-italic-CJpMwFnN.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-italic.woff2":{"file":"assets/cormorant-garamond-vietnamese-400-italic-BoXDRTEW.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-normal.woff":{"file":"assets/cormorant-garamond-vietnamese-400-normal-4uxlocMh.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-normal.woff2":{"file":"assets/cormorant-garamond-vietnamese-400-normal-6K-YXo6g.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-normal.woff2"},"node_modules/motion/dist/es/index.mjs":{"file":"assets/index-D_iTvzxp.js","name":"index","src":"node_modules/motion/dist/es/index.mjs","isDynamicEntry":true},"src/routes/cotizacion.tsx?pick=default&pick=$css":{"file":"assets/cotizacion-C1eYfkfT.js","name":"cotizacion","src":"src/routes/cotizacion.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-i8seYcQE.js","_createAsync-zEJ5ZHo1.js"],"css":["assets/cotizacion-DfL1dgXL.css"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"assets/index-DJUHhCCz.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-i8seYcQE.js","_preload-helper-ug3pwPZ1.js","_images-B43p2foP.js","_components-0DQTjknt.js","_WorkCard-D3ctHGyQ.js","_createAsync-zEJ5ZHo1.js"],"dynamicImports":["node_modules/motion/dist/es/index.mjs"],"css":["assets/index-C-w2-xr9.css"]},"src/routes/materiales/[slug].tsx?pick=default&pick=$css":{"file":"assets/_slug_-D6aU25E-.js","name":"_slug_","src":"src/routes/materiales/[slug].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-i8seYcQE.js","_HttpStatusCode-DjTx85av.js","_images-B43p2foP.js","_createAsync-zEJ5ZHo1.js","_components-0DQTjknt.js"]},"src/routes/materiales/index.tsx?pick=default&pick=$css":{"file":"assets/index-I8QQSZSd.js","name":"index","src":"src/routes/materiales/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-i8seYcQE.js","_images-B43p2foP.js","_components-0DQTjknt.js","_createAsync-zEJ5ZHo1.js"],"css":["assets/index-BuiKoTyY.css"]},"src/routes/trabajos/[slug].tsx?pick=default&pick=$css":{"file":"assets/_slug_-YkaNfiRu.js","name":"_slug_","src":"src/routes/trabajos/[slug].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-i8seYcQE.js","_HttpStatusCode-DjTx85av.js","_createAsync-zEJ5ZHo1.js","_components-0DQTjknt.js"]},"src/routes/trabajos/index.tsx?pick=default&pick=$css":{"file":"assets/index-C8dBSCGx.js","name":"index","src":"src/routes/trabajos/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-i8seYcQE.js","_WorkCard-D3ctHGyQ.js","_createAsync-zEJ5ZHo1.js","_components-0DQTjknt.js"]},"virtual:$vinxi/handler/client":{"file":"assets/client-D4-Wx9yw.js","name":"client","src":"virtual:$vinxi/handler/client","isEntry":true,"imports":["_index-i8seYcQE.js","_preload-helper-ug3pwPZ1.js","_components-0DQTjknt.js","_HttpStatusCode-DjTx85av.js"],"dynamicImports":["src/routes/cotizacion.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/materiales/[slug].tsx?pick=default&pick=$css","src/routes/materiales/index.tsx?pick=default&pick=$css","src/routes/trabajos/[slug].tsx?pick=default&pick=$css","src/routes/trabajos/index.tsx?pick=default&pick=$css"],"css":["assets/client-B8ii3ENT.css"],"assets":["assets/cormorant-garamond-cyrillic-ext-300-normal-D8IReVS-.woff2","assets/cormorant-garamond-cyrillic-ext-300-normal-B5wCrnbP.woff","assets/cormorant-garamond-cyrillic-300-normal-DZNkLIMe.woff2","assets/cormorant-garamond-cyrillic-300-normal-KEduutn5.woff","assets/cormorant-garamond-vietnamese-300-normal-BTzPAsHw.woff2","assets/cormorant-garamond-vietnamese-300-normal-ByHlPz7v.woff","assets/cormorant-garamond-latin-ext-300-normal-BsCYHBWC.woff2","assets/cormorant-garamond-latin-ext-300-normal-DueGyF8j.woff","assets/cormorant-garamond-latin-300-normal-Cw-E_7L1.woff2","assets/cormorant-garamond-latin-300-normal-BuXLI6C0.woff","assets/cormorant-garamond-cyrillic-ext-400-normal-W3Dto7M0.woff2","assets/cormorant-garamond-cyrillic-ext-400-normal-DLdKLAvx.woff","assets/cormorant-garamond-cyrillic-400-normal-DD2KOZkl.woff2","assets/cormorant-garamond-cyrillic-400-normal-CVFrM67f.woff","assets/cormorant-garamond-vietnamese-400-normal-6K-YXo6g.woff2","assets/cormorant-garamond-vietnamese-400-normal-4uxlocMh.woff","assets/cormorant-garamond-latin-ext-400-normal-Drx2k2n9.woff2","assets/cormorant-garamond-latin-ext-400-normal-uvC0WHQr.woff","assets/cormorant-garamond-latin-400-normal-B-1hWBU7.woff2","assets/cormorant-garamond-latin-400-normal-B7YtguxJ.woff","assets/cormorant-garamond-cyrillic-ext-300-italic-B31MkR9z.woff2","assets/cormorant-garamond-cyrillic-ext-300-italic-Dj41S4NK.woff","assets/cormorant-garamond-cyrillic-300-italic-Bi4RSOgf.woff2","assets/cormorant-garamond-cyrillic-300-italic-Bo30KLu4.woff","assets/cormorant-garamond-vietnamese-300-italic-CCKicgM4.woff2","assets/cormorant-garamond-vietnamese-300-italic-DjSFy2Pr.woff","assets/cormorant-garamond-latin-ext-300-italic-Bt0Wsy7Q.woff2","assets/cormorant-garamond-latin-ext-300-italic-DambfolG.woff","assets/cormorant-garamond-latin-300-italic-qkwBXYHn.woff2","assets/cormorant-garamond-latin-300-italic-DRnsRYID.woff","assets/cormorant-garamond-cyrillic-ext-400-italic-BEGvmv_3.woff2","assets/cormorant-garamond-cyrillic-ext-400-italic-C_Uk1MUY.woff","assets/cormorant-garamond-cyrillic-400-italic-D3GtrbRZ.woff2","assets/cormorant-garamond-cyrillic-400-italic-AH1vqu4S.woff","assets/cormorant-garamond-vietnamese-400-italic-BoXDRTEW.woff2","assets/cormorant-garamond-vietnamese-400-italic-CJpMwFnN.woff","assets/cormorant-garamond-latin-ext-400-italic-BdEzgT7i.woff2","assets/cormorant-garamond-latin-ext-400-italic-CQvLaSWn.woff","assets/cormorant-garamond-latin-400-italic-Dc_OZ8oc.woff2","assets/cormorant-garamond-latin-400-italic-BLh7T8o8.woff","assets/outfit-latin-ext-wght-normal-DdQaqQDo.woff2","assets/outfit-latin-wght-normal-Bc-8i84L.woff2"]}},"server-fns":{"_HttpStatusCode-DH8IeaZe.js":{"file":"assets/HttpStatusCode-DH8IeaZe.js","name":"HttpStatusCode"},"_WorkCard-S6pLa_Ls.js":{"file":"assets/WorkCard-S6pLa_Ls.js","name":"WorkCard","imports":["_index-Gy6Hlstv.js","_components-DxvOFfFE.js"]},"_api-DvMp1z1V.js":{"file":"assets/api-DvMp1z1V.js","name":"api"},"_components-DxvOFfFE.js":{"file":"assets/components-DxvOFfFE.js","name":"components","imports":["_query-12-Gn2-p.js"]},"_createAsync-CBz8AaaQ.js":{"file":"assets/createAsync-CBz8AaaQ.js","name":"createAsync"},"_images-B43p2foP.js":{"file":"assets/images-B43p2foP.js","name":"images"},"_index-Gy6Hlstv.js":{"file":"assets/index-Gy6Hlstv.js","name":"index"},"_query-12-Gn2-p.js":{"file":"assets/query-12-Gn2-p.js","name":"query"},"_server-fns-1pH05WOE.js":{"file":"assets/server-fns-1pH05WOE.js","name":"server-fns","imports":["_api-DvMp1z1V.js","_query-12-Gn2-p.js"],"dynamicImports":["src/routes/cotizacion.tsx?pick=default&pick=$css","src/routes/cotizacion.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/materiales/[slug].tsx?pick=default&pick=$css","src/routes/materiales/[slug].tsx?pick=default&pick=$css","src/routes/materiales/index.tsx?pick=default&pick=$css","src/routes/materiales/index.tsx?pick=default&pick=$css","src/routes/sitemap.xml.ts?pick=GET","src/routes/sitemap.xml.ts?pick=GET","src/routes/sitemap.xml.ts?pick=GET","src/routes/sitemap.xml.ts?pick=GET","src/routes/trabajos/[slug].tsx?pick=default&pick=$css","src/routes/trabajos/[slug].tsx?pick=default&pick=$css","src/routes/trabajos/index.tsx?pick=default&pick=$css","src/routes/trabajos/index.tsx?pick=default&pick=$css","src/app.tsx"]},"node_modules/@fontsource-variable/outfit/files/outfit-latin-ext-wght-normal.woff2":{"file":"assets/outfit-latin-ext-wght-normal-DdQaqQDo.woff2","src":"node_modules/@fontsource-variable/outfit/files/outfit-latin-ext-wght-normal.woff2"},"node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2":{"file":"assets/outfit-latin-wght-normal-Bc-8i84L.woff2","src":"node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-italic.woff":{"file":"assets/cormorant-garamond-cyrillic-300-italic-Bo30KLu4.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-italic.woff2":{"file":"assets/cormorant-garamond-cyrillic-300-italic-Bi4RSOgf.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-normal.woff":{"file":"assets/cormorant-garamond-cyrillic-300-normal-KEduutn5.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-normal.woff2":{"file":"assets/cormorant-garamond-cyrillic-300-normal-DZNkLIMe.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-300-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-italic.woff":{"file":"assets/cormorant-garamond-cyrillic-400-italic-AH1vqu4S.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-italic.woff2":{"file":"assets/cormorant-garamond-cyrillic-400-italic-D3GtrbRZ.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-normal.woff":{"file":"assets/cormorant-garamond-cyrillic-400-normal-CVFrM67f.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-normal.woff2":{"file":"assets/cormorant-garamond-cyrillic-400-normal-DD2KOZkl.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-400-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-italic.woff":{"file":"assets/cormorant-garamond-cyrillic-ext-300-italic-Dj41S4NK.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-italic.woff2":{"file":"assets/cormorant-garamond-cyrillic-ext-300-italic-B31MkR9z.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-normal.woff":{"file":"assets/cormorant-garamond-cyrillic-ext-300-normal-B5wCrnbP.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-normal.woff2":{"file":"assets/cormorant-garamond-cyrillic-ext-300-normal-D8IReVS-.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-300-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-italic.woff":{"file":"assets/cormorant-garamond-cyrillic-ext-400-italic-C_Uk1MUY.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-italic.woff2":{"file":"assets/cormorant-garamond-cyrillic-ext-400-italic-BEGvmv_3.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-normal.woff":{"file":"assets/cormorant-garamond-cyrillic-ext-400-normal-DLdKLAvx.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-normal.woff2":{"file":"assets/cormorant-garamond-cyrillic-ext-400-normal-W3Dto7M0.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-ext-400-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff":{"file":"assets/cormorant-garamond-latin-300-italic-DRnsRYID.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff2":{"file":"assets/cormorant-garamond-latin-300-italic-qkwBXYHn.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff":{"file":"assets/cormorant-garamond-latin-300-normal-BuXLI6C0.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff2":{"file":"assets/cormorant-garamond-latin-300-normal-Cw-E_7L1.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff":{"file":"assets/cormorant-garamond-latin-400-italic-BLh7T8o8.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2":{"file":"assets/cormorant-garamond-latin-400-italic-Dc_OZ8oc.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff":{"file":"assets/cormorant-garamond-latin-400-normal-B7YtguxJ.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2":{"file":"assets/cormorant-garamond-latin-400-normal-B-1hWBU7.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-italic.woff":{"file":"assets/cormorant-garamond-latin-ext-300-italic-DambfolG.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-italic.woff2":{"file":"assets/cormorant-garamond-latin-ext-300-italic-Bt0Wsy7Q.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-normal.woff":{"file":"assets/cormorant-garamond-latin-ext-300-normal-DueGyF8j.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-normal.woff2":{"file":"assets/cormorant-garamond-latin-ext-300-normal-BsCYHBWC.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-300-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-italic.woff":{"file":"assets/cormorant-garamond-latin-ext-400-italic-CQvLaSWn.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-italic.woff2":{"file":"assets/cormorant-garamond-latin-ext-400-italic-BdEzgT7i.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-normal.woff":{"file":"assets/cormorant-garamond-latin-ext-400-normal-uvC0WHQr.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-normal.woff2":{"file":"assets/cormorant-garamond-latin-ext-400-normal-Drx2k2n9.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-ext-400-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-italic.woff":{"file":"assets/cormorant-garamond-vietnamese-300-italic-DjSFy2Pr.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-italic.woff2":{"file":"assets/cormorant-garamond-vietnamese-300-italic-CCKicgM4.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-normal.woff":{"file":"assets/cormorant-garamond-vietnamese-300-normal-ByHlPz7v.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-normal.woff2":{"file":"assets/cormorant-garamond-vietnamese-300-normal-BTzPAsHw.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-300-normal.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-italic.woff":{"file":"assets/cormorant-garamond-vietnamese-400-italic-CJpMwFnN.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-italic.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-italic.woff2":{"file":"assets/cormorant-garamond-vietnamese-400-italic-BoXDRTEW.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-italic.woff2"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-normal.woff":{"file":"assets/cormorant-garamond-vietnamese-400-normal-4uxlocMh.woff","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-normal.woff"},"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-normal.woff2":{"file":"assets/cormorant-garamond-vietnamese-400-normal-6K-YXo6g.woff2","src":"node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-vietnamese-400-normal.woff2"},"src/app.tsx":{"file":"assets/app-DoL6yWtQ.js","name":"app","src":"src/app.tsx","isDynamicEntry":true,"imports":["_index-Gy6Hlstv.js","_server-fns-1pH05WOE.js","_components-DxvOFfFE.js","_query-12-Gn2-p.js","_api-DvMp1z1V.js"],"css":["assets/app-h3uGFq88.css"],"assets":["assets/cormorant-garamond-cyrillic-ext-300-normal-D8IReVS-.woff2","assets/cormorant-garamond-cyrillic-ext-300-normal-B5wCrnbP.woff","assets/cormorant-garamond-cyrillic-300-normal-DZNkLIMe.woff2","assets/cormorant-garamond-cyrillic-300-normal-KEduutn5.woff","assets/cormorant-garamond-vietnamese-300-normal-BTzPAsHw.woff2","assets/cormorant-garamond-vietnamese-300-normal-ByHlPz7v.woff","assets/cormorant-garamond-latin-ext-300-normal-BsCYHBWC.woff2","assets/cormorant-garamond-latin-ext-300-normal-DueGyF8j.woff","assets/cormorant-garamond-latin-300-normal-Cw-E_7L1.woff2","assets/cormorant-garamond-latin-300-normal-BuXLI6C0.woff","assets/cormorant-garamond-cyrillic-ext-400-normal-W3Dto7M0.woff2","assets/cormorant-garamond-cyrillic-ext-400-normal-DLdKLAvx.woff","assets/cormorant-garamond-cyrillic-400-normal-DD2KOZkl.woff2","assets/cormorant-garamond-cyrillic-400-normal-CVFrM67f.woff","assets/cormorant-garamond-vietnamese-400-normal-6K-YXo6g.woff2","assets/cormorant-garamond-vietnamese-400-normal-4uxlocMh.woff","assets/cormorant-garamond-latin-ext-400-normal-Drx2k2n9.woff2","assets/cormorant-garamond-latin-ext-400-normal-uvC0WHQr.woff","assets/cormorant-garamond-latin-400-normal-B-1hWBU7.woff2","assets/cormorant-garamond-latin-400-normal-B7YtguxJ.woff","assets/cormorant-garamond-cyrillic-ext-300-italic-B31MkR9z.woff2","assets/cormorant-garamond-cyrillic-ext-300-italic-Dj41S4NK.woff","assets/cormorant-garamond-cyrillic-300-italic-Bi4RSOgf.woff2","assets/cormorant-garamond-cyrillic-300-italic-Bo30KLu4.woff","assets/cormorant-garamond-vietnamese-300-italic-CCKicgM4.woff2","assets/cormorant-garamond-vietnamese-300-italic-DjSFy2Pr.woff","assets/cormorant-garamond-latin-ext-300-italic-Bt0Wsy7Q.woff2","assets/cormorant-garamond-latin-ext-300-italic-DambfolG.woff","assets/cormorant-garamond-latin-300-italic-qkwBXYHn.woff2","assets/cormorant-garamond-latin-300-italic-DRnsRYID.woff","assets/cormorant-garamond-cyrillic-ext-400-italic-BEGvmv_3.woff2","assets/cormorant-garamond-cyrillic-ext-400-italic-C_Uk1MUY.woff","assets/cormorant-garamond-cyrillic-400-italic-D3GtrbRZ.woff2","assets/cormorant-garamond-cyrillic-400-italic-AH1vqu4S.woff","assets/cormorant-garamond-vietnamese-400-italic-BoXDRTEW.woff2","assets/cormorant-garamond-vietnamese-400-italic-CJpMwFnN.woff","assets/cormorant-garamond-latin-ext-400-italic-BdEzgT7i.woff2","assets/cormorant-garamond-latin-ext-400-italic-CQvLaSWn.woff","assets/cormorant-garamond-latin-400-italic-Dc_OZ8oc.woff2","assets/cormorant-garamond-latin-400-italic-BLh7T8o8.woff","assets/outfit-latin-ext-wght-normal-DdQaqQDo.woff2","assets/outfit-latin-wght-normal-Bc-8i84L.woff2"]},"src/routes/cotizacion.tsx?pick=default&pick=$css":{"file":"cotizacion.js","name":"cotizacion","src":"src/routes/cotizacion.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-Gy6Hlstv.js","_api-DvMp1z1V.js","_query-12-Gn2-p.js","_createAsync-CBz8AaaQ.js"],"css":["assets/cotizacion-DfL1dgXL.css"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"index.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-Gy6Hlstv.js","_api-DvMp1z1V.js","_images-B43p2foP.js","_query-12-Gn2-p.js","_components-DxvOFfFE.js","_WorkCard-S6pLa_Ls.js","_createAsync-CBz8AaaQ.js"],"css":["assets/index-C-w2-xr9.css"]},"src/routes/materiales/[slug].tsx?pick=default&pick=$css":{"file":"_slug_.js","name":"_slug_","src":"src/routes/materiales/[slug].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_HttpStatusCode-DH8IeaZe.js","_index-Gy6Hlstv.js","_api-DvMp1z1V.js","_images-B43p2foP.js","_query-12-Gn2-p.js","_createAsync-CBz8AaaQ.js","_components-DxvOFfFE.js"]},"src/routes/materiales/index.tsx?pick=default&pick=$css":{"file":"index2.js","name":"index","src":"src/routes/materiales/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-Gy6Hlstv.js","_api-DvMp1z1V.js","_images-B43p2foP.js","_components-DxvOFfFE.js","_createAsync-CBz8AaaQ.js","_query-12-Gn2-p.js"],"css":["assets/index-BuiKoTyY.css"]},"src/routes/sitemap.xml.ts?pick=GET":{"file":"sitemap.xml.js","name":"sitemap.xml","src":"src/routes/sitemap.xml.ts?pick=GET","isEntry":true,"isDynamicEntry":true,"imports":["_api-DvMp1z1V.js"]},"src/routes/trabajos/[slug].tsx?pick=default&pick=$css":{"file":"_slug_2.js","name":"_slug_","src":"src/routes/trabajos/[slug].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_HttpStatusCode-DH8IeaZe.js","_index-Gy6Hlstv.js","_api-DvMp1z1V.js","_query-12-Gn2-p.js","_createAsync-CBz8AaaQ.js","_components-DxvOFfFE.js"]},"src/routes/trabajos/index.tsx?pick=default&pick=$css":{"file":"index3.js","name":"index","src":"src/routes/trabajos/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-Gy6Hlstv.js","_api-DvMp1z1V.js","_WorkCard-S6pLa_Ls.js","_createAsync-CBz8AaaQ.js","_query-12-Gn2-p.js","_components-DxvOFfFE.js"]},"virtual:$vinxi/handler/server-fns":{"file":"server-fns.js","name":"server-fns","src":"virtual:$vinxi/handler/server-fns","isEntry":true,"imports":["_server-fns-1pH05WOE.js","_api-DvMp1z1V.js","_query-12-Gn2-p.js"]}}};

					const routeManifest = {"ssr":{},"client":{},"server-fns":{}};

        function createProdApp(appConfig) {
          return {
            config: { ...appConfig, buildManifest, routeManifest },
            getRouter(name) {
              return appConfig.routers.find(router => router.name === name)
            }
          }
        }

        function plugin$2(app) {
          const prodApp = createProdApp(appConfig);
          globalThis.app = prodApp;
        }

function plugin$1(app) {
	globalThis.$handle = (event) => app.h3App.handler(event);
}

/**
 * Traverses the module graph and collects assets for a given chunk
 *
 * @param {any} manifest Client manifest
 * @param {string} id Chunk id
 * @param {Map<string, string[]>} assetMap Cache of assets
 * @param {string[]} stack Stack of chunk ids to prevent circular dependencies
 * @returns Array of asset URLs
 */
function findAssetsInViteManifest(manifest, id, assetMap = new Map(), stack = []) {
	if (stack.includes(id)) {
		return [];
	}

	const cached = assetMap.get(id);
	if (cached) {
		return cached;
	}
	const chunk = manifest[id];
	if (!chunk) {
		return [];
	}

	const assets = [
		...(chunk.assets?.filter(Boolean) || []),
		...(chunk.css?.filter(Boolean) || [])
	];
	if (chunk.imports) {
		stack.push(id);
		for (let i = 0, l = chunk.imports.length; i < l; i++) {
			assets.push(...findAssetsInViteManifest(manifest, chunk.imports[i], assetMap, stack));
		}
		stack.pop();
	}
	assets.push(chunk.file);
	const all = Array.from(new Set(assets));
	assetMap.set(id, all);

	return all;
}

/** @typedef {import("../app.js").App & { config: { buildManifest: { [key:string]: any } }}} ProdApp */

function createHtmlTagsForAssets(router, app, assets) {
	return assets
		.filter(
			(asset) =>
				asset.endsWith(".css") ||
				asset.endsWith(".js") ||
				asset.endsWith(".mjs"),
		)
		.map((asset) => ({
			tag: "link",
			attrs: {
				href: joinURL(app.config.server.baseURL ?? "/", router.base, asset),
				key: join$1(app.config.server.baseURL ?? "", router.base, asset),
				...(asset.endsWith(".css")
					? { rel: "stylesheet", fetchPriority: "high" }
					: { rel: "modulepreload" }),
			},
		}));
}

/**
 *
 * @param {ProdApp} app
 * @returns
 */
function createProdManifest(app) {
	const manifest = new Proxy(
		{},
		{
			get(target, routerName) {
				invariant(typeof routerName === "string", "Bundler name expected");
				const router = app.getRouter(routerName);
				const bundlerManifest = app.config.buildManifest[routerName];

				invariant(
					router.type !== "static",
					"manifest not available for static router",
				);
				return {
					handler: router.handler,
					async assets() {
						/** @type {{ [key: string]: string[] }} */
						let assets = {};
						assets[router.handler] = await this.inputs[router.handler].assets();
						for (const route of (await router.internals.routes?.getRoutes()) ??
							[]) {
							assets[route.filePath] = await this.inputs[
								route.filePath
							].assets();
						}
						return assets;
					},
					async routes() {
						return (await router.internals.routes?.getRoutes()) ?? [];
					},
					async json() {
						/** @type {{ [key: string]: { output: string; assets: string[]} }} */
						let json = {};
						for (const input of Object.keys(this.inputs)) {
							json[input] = {
								output: this.inputs[input].output.path,
								assets: await this.inputs[input].assets(),
							};
						}
						return json;
					},
					chunks: new Proxy(
						{},
						{
							get(target, chunk) {
								invariant(typeof chunk === "string", "Chunk expected");
								const chunkPath = join$1(
									router.outDir,
									router.base,
									chunk + ".mjs",
								);
								return {
									import() {
										if (globalThis.$$chunks[chunk + ".mjs"]) {
											return globalThis.$$chunks[chunk + ".mjs"];
										}
										return import(
											/* @vite-ignore */ pathToFileURL(chunkPath).href
										);
									},
									output: {
										path: chunkPath,
									},
								};
							},
						},
					),
					inputs: new Proxy(
						{},
						{
							ownKeys(target) {
								const keys = Object.keys(bundlerManifest)
									.filter((id) => bundlerManifest[id].isEntry)
									.map((id) => id);
								return keys;
							},
							getOwnPropertyDescriptor(k) {
								return {
									enumerable: true,
									configurable: true,
								};
							},
							get(target, input) {
								invariant(typeof input === "string", "Input expected");
								if (router.target === "server") {
									const id =
										input === router.handler
											? virtualId(handlerModule(router))
											: input;
									return {
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: join$1(
												router.outDir,
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								} else if (router.target === "browser") {
									const id =
										input === router.handler && !input.endsWith(".html")
											? virtualId(handlerModule(router))
											: input;
									return {
										import() {
											return import(
												/* @vite-ignore */ joinURL(
													app.config.server.baseURL ?? "",
													router.base,
													bundlerManifest[id].file,
												)
											);
										},
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: joinURL(
												app.config.server.baseURL ?? "",
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								}
							},
						},
					),
				};
			},
		},
	);

	return manifest;
}

function plugin() {
	globalThis.MANIFEST =
		createProdManifest(globalThis.app)
			;
}

const chunks = {};
			 



			 function app() {
				 globalThis.$$chunks = chunks;
			 }

const plugins = [
  plugin$2,
plugin$1,
plugin,
app
];

const assets = {
  "/favicon.svg": {
    "type": "image/svg+xml",
    "etag": "\"fe-eemrWpDANs4gCK9mIOsqHNHqL1s\"",
    "mtime": "2026-07-17T19:33:17.501Z",
    "size": 254,
    "path": "../public/favicon.svg"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"4d-hf5LRFEfAzp0lJwLLM6pIrmPm6s\"",
    "mtime": "2026-07-17T19:33:17.501Z",
    "size": 77,
    "path": "../public/robots.txt"
  },
  "/assets/cormorant-garamond-cyrillic-300-italic-Bi4RSOgf.woff2": {
    "type": "font/woff2",
    "etag": "\"3068-PcW3fleGg213fE14eLAZ4FfebCg\"",
    "mtime": "2026-07-17T19:33:17.527Z",
    "size": 12392,
    "path": "../public/assets/cormorant-garamond-cyrillic-300-italic-Bi4RSOgf.woff2"
  },
  "/assets/cormorant-garamond-cyrillic-300-italic-Bo30KLu4.woff": {
    "type": "font/woff",
    "etag": "\"3cfc-ZL5G9Tm2VIgY/5jUNjpCeWAsPl4\"",
    "mtime": "2026-07-17T19:33:17.527Z",
    "size": 15612,
    "path": "../public/assets/cormorant-garamond-cyrillic-300-italic-Bo30KLu4.woff"
  },
  "/assets/cormorant-garamond-cyrillic-300-normal-DZNkLIMe.woff2": {
    "type": "font/woff2",
    "etag": "\"2fe0-tor/Zw4N4Q8m99DCL6z37+vBcuY\"",
    "mtime": "2026-07-17T19:33:17.527Z",
    "size": 12256,
    "path": "../public/assets/cormorant-garamond-cyrillic-300-normal-DZNkLIMe.woff2"
  },
  "/assets/cormorant-garamond-cyrillic-300-normal-KEduutn5.woff": {
    "type": "font/woff",
    "etag": "\"3b3c-/KT0xhbDBsShWpF/E0OQpi0UJEg\"",
    "mtime": "2026-07-17T19:33:17.527Z",
    "size": 15164,
    "path": "../public/assets/cormorant-garamond-cyrillic-300-normal-KEduutn5.woff"
  },
  "/assets/cormorant-garamond-cyrillic-400-italic-AH1vqu4S.woff": {
    "type": "font/woff",
    "etag": "\"3e8c-vuG7ZdOYlvAi8XntVayWrdGH3I4\"",
    "mtime": "2026-07-17T19:33:17.527Z",
    "size": 16012,
    "path": "../public/assets/cormorant-garamond-cyrillic-400-italic-AH1vqu4S.woff"
  },
  "/assets/cormorant-garamond-cyrillic-400-italic-D3GtrbRZ.woff2": {
    "type": "font/woff2",
    "etag": "\"31b0-WpEGO2ZZDwZw3yhkAhhXXHwMjIA\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 12720,
    "path": "../public/assets/cormorant-garamond-cyrillic-400-italic-D3GtrbRZ.woff2"
  },
  "/assets/cormorant-garamond-cyrillic-400-normal-CVFrM67f.woff": {
    "type": "font/woff",
    "etag": "\"3d50-XCV+tzKH13DKsRqSfSlBVs9ZqH4\"",
    "mtime": "2026-07-17T19:33:17.527Z",
    "size": 15696,
    "path": "../public/assets/cormorant-garamond-cyrillic-400-normal-CVFrM67f.woff"
  },
  "/assets/cormorant-garamond-cyrillic-400-normal-DD2KOZkl.woff2": {
    "type": "font/woff2",
    "etag": "\"31e8-vwlRkfqNiOhu8jAtpp4hMZwAx8I\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 12776,
    "path": "../public/assets/cormorant-garamond-cyrillic-400-normal-DD2KOZkl.woff2"
  },
  "/assets/cormorant-garamond-cyrillic-ext-300-italic-B31MkR9z.woff2": {
    "type": "font/woff2",
    "etag": "\"3788-/sGMUhu8Y3HNLfNPuM8ZX9Qsr3o\"",
    "mtime": "2026-07-17T19:33:17.527Z",
    "size": 14216,
    "path": "../public/assets/cormorant-garamond-cyrillic-ext-300-italic-B31MkR9z.woff2"
  },
  "/assets/cormorant-garamond-cyrillic-ext-300-italic-Dj41S4NK.woff": {
    "type": "font/woff",
    "etag": "\"4878-3+6qytSFU/u78S2PRDQhdVpFSeI\"",
    "mtime": "2026-07-17T19:33:17.527Z",
    "size": 18552,
    "path": "../public/assets/cormorant-garamond-cyrillic-ext-300-italic-Dj41S4NK.woff"
  },
  "/assets/cormorant-garamond-cyrillic-ext-300-normal-B5wCrnbP.woff": {
    "type": "font/woff",
    "etag": "\"41dc-K84NXDH/w4+LWcUkih8pESLVyQw\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 16860,
    "path": "../public/assets/cormorant-garamond-cyrillic-ext-300-normal-B5wCrnbP.woff"
  },
  "/assets/cormorant-garamond-cyrillic-ext-400-italic-BEGvmv_3.woff2": {
    "type": "font/woff2",
    "etag": "\"399c-BSGaBxsdgQlGC31XI1mPwQ3SOak\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 14748,
    "path": "../public/assets/cormorant-garamond-cyrillic-ext-400-italic-BEGvmv_3.woff2"
  },
  "/assets/cormorant-garamond-cyrillic-ext-300-normal-D8IReVS-.woff2": {
    "type": "font/woff2",
    "etag": "\"33e4-MP9xAaMtPpHvHs24gii9L+n1YYM\"",
    "mtime": "2026-07-17T19:33:17.527Z",
    "size": 13284,
    "path": "../public/assets/cormorant-garamond-cyrillic-ext-300-normal-D8IReVS-.woff2"
  },
  "/assets/cormorant-garamond-cyrillic-ext-400-normal-W3Dto7M0.woff2": {
    "type": "font/woff2",
    "etag": "\"3660-4ffgpEH9mWDcu2do7M9ndzNYKA0\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 13920,
    "path": "../public/assets/cormorant-garamond-cyrillic-ext-400-normal-W3Dto7M0.woff2"
  },
  "/assets/cormorant-garamond-cyrillic-ext-400-italic-C_Uk1MUY.woff": {
    "type": "font/woff",
    "etag": "\"4ac0-q6aID/vYtH5bAifKoQewLHZIEdQ\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 19136,
    "path": "../public/assets/cormorant-garamond-cyrillic-ext-400-italic-C_Uk1MUY.woff"
  },
  "/assets/cormorant-garamond-latin-300-italic-DRnsRYID.woff": {
    "type": "font/woff",
    "etag": "\"7c1c-O6ojxW6O4/pW7S1zZbuyPgskHVg\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 31772,
    "path": "../public/assets/cormorant-garamond-latin-300-italic-DRnsRYID.woff"
  },
  "/assets/cormorant-garamond-cyrillic-ext-400-normal-DLdKLAvx.woff": {
    "type": "font/woff",
    "etag": "\"4414-nZ05aqplOpNbo+Cb0cI2Xh249d8\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 17428,
    "path": "../public/assets/cormorant-garamond-cyrillic-ext-400-normal-DLdKLAvx.woff"
  },
  "/assets/cormorant-garamond-latin-300-italic-qkwBXYHn.woff2": {
    "type": "font/woff2",
    "etag": "\"57d4-+qaMGhOUeOdmytD3703PhpOL1cs\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 22484,
    "path": "../public/assets/cormorant-garamond-latin-300-italic-qkwBXYHn.woff2"
  },
  "/assets/cormorant-garamond-latin-300-normal-BuXLI6C0.woff": {
    "type": "font/woff",
    "etag": "\"7508-u1KAIcLDbVUlb5nheOcFc6ShKKQ\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 29960,
    "path": "../public/assets/cormorant-garamond-latin-300-normal-BuXLI6C0.woff"
  },
  "/assets/cormorant-garamond-latin-300-normal-Cw-E_7L1.woff2": {
    "type": "font/woff2",
    "etag": "\"5594-BpOyVPlWKLEkdSK4o6x3lNDzvSE\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 21908,
    "path": "../public/assets/cormorant-garamond-latin-300-normal-Cw-E_7L1.woff2"
  },
  "/assets/cormorant-garamond-latin-400-italic-BLh7T8o8.woff": {
    "type": "font/woff",
    "etag": "\"8078-4VkY1Evw3rkCJJtuUs+n8W1g5Lw\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 32888,
    "path": "../public/assets/cormorant-garamond-latin-400-italic-BLh7T8o8.woff"
  },
  "/assets/cormorant-garamond-latin-400-italic-Dc_OZ8oc.woff2": {
    "type": "font/woff2",
    "etag": "\"5c6c-gQ/mrJ4YWdX29DaZqxY+2CXhY0A\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 23660,
    "path": "../public/assets/cormorant-garamond-latin-400-italic-Dc_OZ8oc.woff2"
  },
  "/assets/cormorant-garamond-latin-400-normal-B-1hWBU7.woff2": {
    "type": "font/woff2",
    "etag": "\"595c-plElvBMbfA4vsaFAqui//GFeZ5o\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 22876,
    "path": "../public/assets/cormorant-garamond-latin-400-normal-B-1hWBU7.woff2"
  },
  "/assets/cormorant-garamond-latin-400-normal-B7YtguxJ.woff": {
    "type": "font/woff",
    "etag": "\"7904-9V90i7R9qGBbagyxxIPch9DOJgo\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 30980,
    "path": "../public/assets/cormorant-garamond-latin-400-normal-B7YtguxJ.woff"
  },
  "/assets/cormorant-garamond-latin-ext-300-italic-Bt0Wsy7Q.woff2": {
    "type": "font/woff2",
    "etag": "\"4b34-b0iA+N4e6kfSpVN/lbfWhWwqrVg\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 19252,
    "path": "../public/assets/cormorant-garamond-latin-ext-300-italic-Bt0Wsy7Q.woff2"
  },
  "/assets/cormorant-garamond-latin-ext-300-italic-DambfolG.woff": {
    "type": "font/woff",
    "etag": "\"6c10-aNVaQ5oH3oFdvGzh1No4RldRZGU\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 27664,
    "path": "../public/assets/cormorant-garamond-latin-ext-300-italic-DambfolG.woff"
  },
  "/assets/cormorant-garamond-latin-ext-300-normal-BsCYHBWC.woff2": {
    "type": "font/woff2",
    "etag": "\"4a88-inJb/gvWkIDxa4Rm3+JD3cvVwdY\"",
    "mtime": "2026-07-17T19:33:17.528Z",
    "size": 19080,
    "path": "../public/assets/cormorant-garamond-latin-ext-300-normal-BsCYHBWC.woff2"
  },
  "/assets/cormorant-garamond-latin-ext-300-normal-DueGyF8j.woff": {
    "type": "font/woff",
    "etag": "\"6970-zpZ3+4RrgapXjBvao/d8OnWoMCM\"",
    "mtime": "2026-07-17T19:33:17.529Z",
    "size": 26992,
    "path": "../public/assets/cormorant-garamond-latin-ext-300-normal-DueGyF8j.woff"
  },
  "/assets/cormorant-garamond-latin-ext-400-italic-BdEzgT7i.woff2": {
    "type": "font/woff2",
    "etag": "\"4f3c-UNW60/lWAI9Yq/mTdnUANa6oZoA\"",
    "mtime": "2026-07-17T19:33:17.529Z",
    "size": 20284,
    "path": "../public/assets/cormorant-garamond-latin-ext-400-italic-BdEzgT7i.woff2"
  },
  "/assets/cormorant-garamond-latin-ext-400-italic-CQvLaSWn.woff": {
    "type": "font/woff",
    "etag": "\"702c-aVQvKsLO20yon+8zZDwocDShFFw\"",
    "mtime": "2026-07-17T19:33:17.529Z",
    "size": 28716,
    "path": "../public/assets/cormorant-garamond-latin-ext-400-italic-CQvLaSWn.woff"
  },
  "/assets/cormorant-garamond-latin-ext-400-normal-uvC0WHQr.woff": {
    "type": "font/woff",
    "etag": "\"6d18-McfiZ8PaVOWL5YgYKU94JxQwMFU\"",
    "mtime": "2026-07-17T19:33:17.529Z",
    "size": 27928,
    "path": "../public/assets/cormorant-garamond-latin-ext-400-normal-uvC0WHQr.woff"
  },
  "/assets/cormorant-garamond-latin-ext-400-normal-Drx2k2n9.woff2": {
    "type": "font/woff2",
    "etag": "\"4db0-nad/GoSq2cQK8+zE21r7i24bdjY\"",
    "mtime": "2026-07-17T19:33:17.529Z",
    "size": 19888,
    "path": "../public/assets/cormorant-garamond-latin-ext-400-normal-Drx2k2n9.woff2"
  },
  "/assets/cormorant-garamond-vietnamese-300-italic-CCKicgM4.woff2": {
    "type": "font/woff2",
    "etag": "\"1828-qXG6MHSWX5L7s0t+b+jdyQXywgw\"",
    "mtime": "2026-07-17T19:33:17.529Z",
    "size": 6184,
    "path": "../public/assets/cormorant-garamond-vietnamese-300-italic-CCKicgM4.woff2"
  },
  "/assets/cormorant-garamond-vietnamese-300-italic-DjSFy2Pr.woff": {
    "type": "font/woff",
    "etag": "\"2294-/nXZE8er1MS3uOF0s/lqfRSYUv4\"",
    "mtime": "2026-07-17T19:33:17.529Z",
    "size": 8852,
    "path": "../public/assets/cormorant-garamond-vietnamese-300-italic-DjSFy2Pr.woff"
  },
  "/assets/cormorant-garamond-vietnamese-300-normal-ByHlPz7v.woff": {
    "type": "font/woff",
    "etag": "\"2228-VoKDT9pVng73k0UN7USLd2vNYNk\"",
    "mtime": "2026-07-17T19:33:17.529Z",
    "size": 8744,
    "path": "../public/assets/cormorant-garamond-vietnamese-300-normal-ByHlPz7v.woff"
  },
  "/assets/cormorant-garamond-vietnamese-300-normal-BTzPAsHw.woff2": {
    "type": "font/woff2",
    "etag": "\"1850-mcA8wbz/JIDnGXp/kVIs686fKBs\"",
    "mtime": "2026-07-17T19:33:17.529Z",
    "size": 6224,
    "path": "../public/assets/cormorant-garamond-vietnamese-300-normal-BTzPAsHw.woff2"
  },
  "/assets/cormorant-garamond-vietnamese-400-italic-BoXDRTEW.woff2": {
    "type": "font/woff2",
    "etag": "\"1a6c-bye8Y6DumedoHTv6bowxfN2+JCQ\"",
    "mtime": "2026-07-17T19:33:17.529Z",
    "size": 6764,
    "path": "../public/assets/cormorant-garamond-vietnamese-400-italic-BoXDRTEW.woff2"
  },
  "/assets/cormorant-garamond-vietnamese-400-italic-CJpMwFnN.woff": {
    "type": "font/woff",
    "etag": "\"24c0-JREuZQEmOHGewKikLiuzOyJms0w\"",
    "mtime": "2026-07-17T19:33:17.529Z",
    "size": 9408,
    "path": "../public/assets/cormorant-garamond-vietnamese-400-italic-CJpMwFnN.woff"
  },
  "/assets/cormorant-garamond-vietnamese-400-normal-4uxlocMh.woff": {
    "type": "font/woff",
    "etag": "\"2464-sNlDqyrGwuOXb49cv43hafatBpY\"",
    "mtime": "2026-07-17T19:33:17.529Z",
    "size": 9316,
    "path": "../public/assets/cormorant-garamond-vietnamese-400-normal-4uxlocMh.woff"
  },
  "/assets/cormorant-garamond-vietnamese-400-normal-6K-YXo6g.woff2": {
    "type": "font/woff2",
    "etag": "\"1a58-7J/nLaYlJJIBHtYRfJHATtWdRMA\"",
    "mtime": "2026-07-17T19:33:17.529Z",
    "size": 6744,
    "path": "../public/assets/cormorant-garamond-vietnamese-400-normal-6K-YXo6g.woff2"
  },
  "/assets/cotizacion-DfL1dgXL.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"393-O7ikAXYQZKY541kmTrEuGJDTpjk\"",
    "mtime": "2026-07-17T19:33:17.530Z",
    "size": 915,
    "path": "../public/assets/cotizacion-DfL1dgXL.css"
  },
  "/assets/index-C-w2-xr9.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"14bc-MPPvtuOnW3apjjT4NddFZ2H33BQ\"",
    "mtime": "2026-07-17T19:33:17.530Z",
    "size": 5308,
    "path": "../public/assets/index-C-w2-xr9.css"
  },
  "/assets/index-BuiKoTyY.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"267-1t219o4n0bgOGHnXCR/9xJr8Q38\"",
    "mtime": "2026-07-17T19:33:17.529Z",
    "size": 615,
    "path": "../public/assets/index-BuiKoTyY.css"
  },
  "/assets/index-C-w2-xr9.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5e5-gONcpBUjp0NiPSq6RMOIC8CwkPQ\"",
    "mtime": "2026-07-17T19:33:17.566Z",
    "size": 1509,
    "path": "../public/assets/index-C-w2-xr9.css.br"
  },
  "/assets/index-C-w2-xr9.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6d2-PifT60oVsIq2b1/JrSfDEpduFOQ\"",
    "mtime": "2026-07-17T19:33:17.561Z",
    "size": 1746,
    "path": "../public/assets/index-C-w2-xr9.css.gz"
  },
  "/assets/outfit-latin-ext-wght-normal-DdQaqQDo.woff2": {
    "type": "font/woff2",
    "etag": "\"39d8-sqVel30br8w1wJ7fkoMuV0KPYjs\"",
    "mtime": "2026-07-17T19:33:17.529Z",
    "size": 14808,
    "path": "../public/assets/outfit-latin-ext-wght-normal-DdQaqQDo.woff2"
  },
  "/assets/outfit-latin-wght-normal-Bc-8i84L.woff2": {
    "type": "font/woff2",
    "etag": "\"7e24-2KMW98v6RuaYdskl5Y+/e3wavw0\"",
    "mtime": "2026-07-17T19:33:17.530Z",
    "size": 32292,
    "path": "../public/assets/outfit-latin-wght-normal-Bc-8i84L.woff2"
  },
  "/assets/ssr-B8ii3ENT.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"32d2-cuUme97aX+srluaWrxlfIMybRAI\"",
    "mtime": "2026-07-17T19:33:17.530Z",
    "size": 13010,
    "path": "../public/assets/ssr-B8ii3ENT.css"
  },
  "/assets/ssr-B8ii3ENT.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"895-gdlixNUU0BclaJCrYaTyFcbqFyA\"",
    "mtime": "2026-07-17T19:33:17.574Z",
    "size": 2197,
    "path": "../public/assets/ssr-B8ii3ENT.css.br"
  },
  "/assets/ssr-B8ii3ENT.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9e4-jmb9l2ql3lp2KuKuBcatWcL7lkw\"",
    "mtime": "2026-07-17T19:33:17.566Z",
    "size": 2532,
    "path": "../public/assets/ssr-B8ii3ENT.css.gz"
  },
  "/_build/.vite/manifest.json.br": {
    "type": "application/json",
    "encoding": "br",
    "etag": "\"612-lXZRF3dvpnjwkwLF9bOwA6iTC7o\"",
    "mtime": "2026-07-17T19:33:17.579Z",
    "size": 1554,
    "path": "../public/_build/.vite/manifest.json.br"
  },
  "/_build/.vite/manifest.json": {
    "type": "application/json",
    "encoding": null,
    "etag": "\"4cb8-XTM1oUYAMZlUNZr0GwVqZreyj/4\"",
    "mtime": "2026-07-17T19:33:17.534Z",
    "size": 19640,
    "path": "../public/_build/.vite/manifest.json"
  },
  "/_build/.vite/manifest.json.gz": {
    "type": "application/json",
    "encoding": "gzip",
    "etag": "\"6fb-EE8IqsfN2F0XP5QxXx5gS+UVmyc\"",
    "mtime": "2026-07-17T19:33:17.567Z",
    "size": 1787,
    "path": "../public/_build/.vite/manifest.json.gz"
  },
  "/_build/assets/HttpStatusCode-DjTx85av.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"20-6m70mxigcQrfQOHf/Wz+MEC183U\"",
    "mtime": "2026-07-17T19:33:17.535Z",
    "size": 32,
    "path": "../public/_build/assets/HttpStatusCode-DjTx85av.js"
  },
  "/_build/assets/WorkCard-D3ctHGyQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"398-fXNAo9+EfrfLkCFOcfeNCBhBMwM\"",
    "mtime": "2026-07-17T19:33:17.535Z",
    "size": 920,
    "path": "../public/_build/assets/WorkCard-D3ctHGyQ.js"
  },
  "/_build/assets/_slug_-D6aU25E-.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"94f-sS6X1SIqhcW8aDjf/0BZCM5b0ic\"",
    "mtime": "2026-07-17T19:33:17.536Z",
    "size": 2383,
    "path": "../public/_build/assets/_slug_-D6aU25E-.js"
  },
  "/_build/assets/_slug_-D6aU25E-.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"421-bjJ0JeMKDuSHGyykSFR+W4Fv/bU\"",
    "mtime": "2026-07-17T19:33:17.574Z",
    "size": 1057,
    "path": "../public/_build/assets/_slug_-D6aU25E-.js.br"
  },
  "/_build/assets/_slug_-D6aU25E-.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"4dc-C8tN16NgkKvg7mKOBKyhMfWZEog\"",
    "mtime": "2026-07-17T19:33:17.574Z",
    "size": 1244,
    "path": "../public/_build/assets/_slug_-D6aU25E-.js.gz"
  },
  "/_build/assets/client-B8ii3ENT.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"32d2-cuUme97aX+srluaWrxlfIMybRAI\"",
    "mtime": "2026-07-17T19:33:17.535Z",
    "size": 13010,
    "path": "../public/_build/assets/client-B8ii3ENT.css"
  },
  "/_build/assets/_slug_-YkaNfiRu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3cf-362WEWCA/aSlmt54EY8AA4zNU2s\"",
    "mtime": "2026-07-17T19:33:17.535Z",
    "size": 975,
    "path": "../public/_build/assets/_slug_-YkaNfiRu.js"
  },
  "/_build/assets/client-B8ii3ENT.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9e4-jmb9l2ql3lp2KuKuBcatWcL7lkw\"",
    "mtime": "2026-07-17T19:33:17.574Z",
    "size": 2532,
    "path": "../public/_build/assets/client-B8ii3ENT.css.gz"
  },
  "/_build/assets/client-D4-Wx9yw.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"495b-aUK9aEvFvmsOv2Rxwpc+/9eKNQc\"",
    "mtime": "2026-07-17T19:33:17.536Z",
    "size": 18779,
    "path": "../public/_build/assets/client-D4-Wx9yw.js"
  },
  "/_build/assets/client-D4-Wx9yw.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"188d-4UJKdXFkHKH/YGJd9aTCsQfGoME\"",
    "mtime": "2026-07-17T19:33:17.588Z",
    "size": 6285,
    "path": "../public/_build/assets/client-D4-Wx9yw.js.br"
  },
  "/_build/assets/client-B8ii3ENT.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"895-gdlixNUU0BclaJCrYaTyFcbqFyA\"",
    "mtime": "2026-07-17T19:33:17.583Z",
    "size": 2197,
    "path": "../public/_build/assets/client-B8ii3ENT.css.br"
  },
  "/_build/assets/client-D4-Wx9yw.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1b75-u806dDTXv2fYC/CpVQvxyqSjJLA\"",
    "mtime": "2026-07-17T19:33:17.574Z",
    "size": 7029,
    "path": "../public/_build/assets/client-D4-Wx9yw.js.gz"
  },
  "/_build/assets/components-0DQTjknt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"32c-jIzsTYC702y/clkDeyiwkPWbgZI\"",
    "mtime": "2026-07-17T19:33:17.535Z",
    "size": 812,
    "path": "../public/_build/assets/components-0DQTjknt.js"
  },
  "/_build/assets/cormorant-garamond-cyrillic-300-italic-Bi4RSOgf.woff2": {
    "type": "font/woff2",
    "etag": "\"3068-PcW3fleGg213fE14eLAZ4FfebCg\"",
    "mtime": "2026-07-17T19:33:17.535Z",
    "size": 12392,
    "path": "../public/_build/assets/cormorant-garamond-cyrillic-300-italic-Bi4RSOgf.woff2"
  },
  "/_build/assets/cormorant-garamond-cyrillic-300-italic-Bo30KLu4.woff": {
    "type": "font/woff",
    "etag": "\"3cfc-ZL5G9Tm2VIgY/5jUNjpCeWAsPl4\"",
    "mtime": "2026-07-17T19:33:17.535Z",
    "size": 15612,
    "path": "../public/_build/assets/cormorant-garamond-cyrillic-300-italic-Bo30KLu4.woff"
  },
  "/_build/assets/cormorant-garamond-cyrillic-300-normal-DZNkLIMe.woff2": {
    "type": "font/woff2",
    "etag": "\"2fe0-tor/Zw4N4Q8m99DCL6z37+vBcuY\"",
    "mtime": "2026-07-17T19:33:17.536Z",
    "size": 12256,
    "path": "../public/_build/assets/cormorant-garamond-cyrillic-300-normal-DZNkLIMe.woff2"
  },
  "/_build/assets/cormorant-garamond-cyrillic-300-normal-KEduutn5.woff": {
    "type": "font/woff",
    "etag": "\"3b3c-/KT0xhbDBsShWpF/E0OQpi0UJEg\"",
    "mtime": "2026-07-17T19:33:17.536Z",
    "size": 15164,
    "path": "../public/_build/assets/cormorant-garamond-cyrillic-300-normal-KEduutn5.woff"
  },
  "/_build/assets/cormorant-garamond-cyrillic-400-italic-AH1vqu4S.woff": {
    "type": "font/woff",
    "etag": "\"3e8c-vuG7ZdOYlvAi8XntVayWrdGH3I4\"",
    "mtime": "2026-07-17T19:33:17.536Z",
    "size": 16012,
    "path": "../public/_build/assets/cormorant-garamond-cyrillic-400-italic-AH1vqu4S.woff"
  },
  "/_build/assets/cormorant-garamond-cyrillic-400-italic-D3GtrbRZ.woff2": {
    "type": "font/woff2",
    "etag": "\"31b0-WpEGO2ZZDwZw3yhkAhhXXHwMjIA\"",
    "mtime": "2026-07-17T19:33:17.535Z",
    "size": 12720,
    "path": "../public/_build/assets/cormorant-garamond-cyrillic-400-italic-D3GtrbRZ.woff2"
  },
  "/_build/assets/cormorant-garamond-cyrillic-400-normal-CVFrM67f.woff": {
    "type": "font/woff",
    "etag": "\"3d50-XCV+tzKH13DKsRqSfSlBVs9ZqH4\"",
    "mtime": "2026-07-17T19:33:17.536Z",
    "size": 15696,
    "path": "../public/_build/assets/cormorant-garamond-cyrillic-400-normal-CVFrM67f.woff"
  },
  "/_build/assets/cormorant-garamond-cyrillic-400-normal-DD2KOZkl.woff2": {
    "type": "font/woff2",
    "etag": "\"31e8-vwlRkfqNiOhu8jAtpp4hMZwAx8I\"",
    "mtime": "2026-07-17T19:33:17.536Z",
    "size": 12776,
    "path": "../public/_build/assets/cormorant-garamond-cyrillic-400-normal-DD2KOZkl.woff2"
  },
  "/_build/assets/cormorant-garamond-cyrillic-ext-300-italic-B31MkR9z.woff2": {
    "type": "font/woff2",
    "etag": "\"3788-/sGMUhu8Y3HNLfNPuM8ZX9Qsr3o\"",
    "mtime": "2026-07-17T19:33:17.537Z",
    "size": 14216,
    "path": "../public/_build/assets/cormorant-garamond-cyrillic-ext-300-italic-B31MkR9z.woff2"
  },
  "/_build/assets/cormorant-garamond-cyrillic-ext-300-italic-Dj41S4NK.woff": {
    "type": "font/woff",
    "etag": "\"4878-3+6qytSFU/u78S2PRDQhdVpFSeI\"",
    "mtime": "2026-07-17T19:33:17.537Z",
    "size": 18552,
    "path": "../public/_build/assets/cormorant-garamond-cyrillic-ext-300-italic-Dj41S4NK.woff"
  },
  "/_build/assets/cormorant-garamond-cyrillic-ext-300-normal-B5wCrnbP.woff": {
    "type": "font/woff",
    "etag": "\"41dc-K84NXDH/w4+LWcUkih8pESLVyQw\"",
    "mtime": "2026-07-17T19:33:17.536Z",
    "size": 16860,
    "path": "../public/_build/assets/cormorant-garamond-cyrillic-ext-300-normal-B5wCrnbP.woff"
  },
  "/_build/assets/cormorant-garamond-cyrillic-ext-300-normal-D8IReVS-.woff2": {
    "type": "font/woff2",
    "etag": "\"33e4-MP9xAaMtPpHvHs24gii9L+n1YYM\"",
    "mtime": "2026-07-17T19:33:17.536Z",
    "size": 13284,
    "path": "../public/_build/assets/cormorant-garamond-cyrillic-ext-300-normal-D8IReVS-.woff2"
  },
  "/_build/assets/cormorant-garamond-cyrillic-ext-400-italic-C_Uk1MUY.woff": {
    "type": "font/woff",
    "etag": "\"4ac0-q6aID/vYtH5bAifKoQewLHZIEdQ\"",
    "mtime": "2026-07-17T19:33:17.537Z",
    "size": 19136,
    "path": "../public/_build/assets/cormorant-garamond-cyrillic-ext-400-italic-C_Uk1MUY.woff"
  },
  "/_build/assets/cormorant-garamond-cyrillic-ext-400-italic-BEGvmv_3.woff2": {
    "type": "font/woff2",
    "etag": "\"399c-BSGaBxsdgQlGC31XI1mPwQ3SOak\"",
    "mtime": "2026-07-17T19:33:17.536Z",
    "size": 14748,
    "path": "../public/_build/assets/cormorant-garamond-cyrillic-ext-400-italic-BEGvmv_3.woff2"
  },
  "/_build/assets/cormorant-garamond-cyrillic-ext-400-normal-W3Dto7M0.woff2": {
    "type": "font/woff2",
    "etag": "\"3660-4ffgpEH9mWDcu2do7M9ndzNYKA0\"",
    "mtime": "2026-07-17T19:33:17.537Z",
    "size": 13920,
    "path": "../public/_build/assets/cormorant-garamond-cyrillic-ext-400-normal-W3Dto7M0.woff2"
  },
  "/_build/assets/cormorant-garamond-cyrillic-ext-400-normal-DLdKLAvx.woff": {
    "type": "font/woff",
    "etag": "\"4414-nZ05aqplOpNbo+Cb0cI2Xh249d8\"",
    "mtime": "2026-07-17T19:33:17.537Z",
    "size": 17428,
    "path": "../public/_build/assets/cormorant-garamond-cyrillic-ext-400-normal-DLdKLAvx.woff"
  },
  "/_build/assets/cormorant-garamond-latin-300-italic-DRnsRYID.woff": {
    "type": "font/woff",
    "etag": "\"7c1c-O6ojxW6O4/pW7S1zZbuyPgskHVg\"",
    "mtime": "2026-07-17T19:33:17.536Z",
    "size": 31772,
    "path": "../public/_build/assets/cormorant-garamond-latin-300-italic-DRnsRYID.woff"
  },
  "/_build/assets/cormorant-garamond-latin-300-italic-qkwBXYHn.woff2": {
    "type": "font/woff2",
    "etag": "\"57d4-+qaMGhOUeOdmytD3703PhpOL1cs\"",
    "mtime": "2026-07-17T19:33:17.537Z",
    "size": 22484,
    "path": "../public/_build/assets/cormorant-garamond-latin-300-italic-qkwBXYHn.woff2"
  },
  "/_build/assets/cormorant-garamond-latin-300-normal-BuXLI6C0.woff": {
    "type": "font/woff",
    "etag": "\"7508-u1KAIcLDbVUlb5nheOcFc6ShKKQ\"",
    "mtime": "2026-07-17T19:33:17.537Z",
    "size": 29960,
    "path": "../public/_build/assets/cormorant-garamond-latin-300-normal-BuXLI6C0.woff"
  },
  "/_build/assets/cormorant-garamond-latin-300-normal-Cw-E_7L1.woff2": {
    "type": "font/woff2",
    "etag": "\"5594-BpOyVPlWKLEkdSK4o6x3lNDzvSE\"",
    "mtime": "2026-07-17T19:33:17.537Z",
    "size": 21908,
    "path": "../public/_build/assets/cormorant-garamond-latin-300-normal-Cw-E_7L1.woff2"
  },
  "/_build/assets/cormorant-garamond-latin-400-italic-BLh7T8o8.woff": {
    "type": "font/woff",
    "etag": "\"8078-4VkY1Evw3rkCJJtuUs+n8W1g5Lw\"",
    "mtime": "2026-07-17T19:33:17.537Z",
    "size": 32888,
    "path": "../public/_build/assets/cormorant-garamond-latin-400-italic-BLh7T8o8.woff"
  },
  "/_build/assets/cormorant-garamond-latin-400-italic-Dc_OZ8oc.woff2": {
    "type": "font/woff2",
    "etag": "\"5c6c-gQ/mrJ4YWdX29DaZqxY+2CXhY0A\"",
    "mtime": "2026-07-17T19:33:17.538Z",
    "size": 23660,
    "path": "../public/_build/assets/cormorant-garamond-latin-400-italic-Dc_OZ8oc.woff2"
  },
  "/_build/assets/cormorant-garamond-latin-400-normal-B-1hWBU7.woff2": {
    "type": "font/woff2",
    "etag": "\"595c-plElvBMbfA4vsaFAqui//GFeZ5o\"",
    "mtime": "2026-07-17T19:33:17.538Z",
    "size": 22876,
    "path": "../public/_build/assets/cormorant-garamond-latin-400-normal-B-1hWBU7.woff2"
  },
  "/_build/assets/cormorant-garamond-latin-ext-300-italic-Bt0Wsy7Q.woff2": {
    "type": "font/woff2",
    "etag": "\"4b34-b0iA+N4e6kfSpVN/lbfWhWwqrVg\"",
    "mtime": "2026-07-17T19:33:17.538Z",
    "size": 19252,
    "path": "../public/_build/assets/cormorant-garamond-latin-ext-300-italic-Bt0Wsy7Q.woff2"
  },
  "/_build/assets/cormorant-garamond-latin-400-normal-B7YtguxJ.woff": {
    "type": "font/woff",
    "etag": "\"7904-9V90i7R9qGBbagyxxIPch9DOJgo\"",
    "mtime": "2026-07-17T19:33:17.538Z",
    "size": 30980,
    "path": "../public/_build/assets/cormorant-garamond-latin-400-normal-B7YtguxJ.woff"
  },
  "/_build/assets/cormorant-garamond-latin-ext-300-normal-DueGyF8j.woff": {
    "type": "font/woff",
    "etag": "\"6970-zpZ3+4RrgapXjBvao/d8OnWoMCM\"",
    "mtime": "2026-07-17T19:33:17.538Z",
    "size": 26992,
    "path": "../public/_build/assets/cormorant-garamond-latin-ext-300-normal-DueGyF8j.woff"
  },
  "/_build/assets/cormorant-garamond-latin-ext-300-italic-DambfolG.woff": {
    "type": "font/woff",
    "etag": "\"6c10-aNVaQ5oH3oFdvGzh1No4RldRZGU\"",
    "mtime": "2026-07-17T19:33:17.537Z",
    "size": 27664,
    "path": "../public/_build/assets/cormorant-garamond-latin-ext-300-italic-DambfolG.woff"
  },
  "/_build/assets/cormorant-garamond-latin-ext-300-normal-BsCYHBWC.woff2": {
    "type": "font/woff2",
    "etag": "\"4a88-inJb/gvWkIDxa4Rm3+JD3cvVwdY\"",
    "mtime": "2026-07-17T19:33:17.537Z",
    "size": 19080,
    "path": "../public/_build/assets/cormorant-garamond-latin-ext-300-normal-BsCYHBWC.woff2"
  },
  "/_build/assets/cormorant-garamond-latin-ext-400-italic-BdEzgT7i.woff2": {
    "type": "font/woff2",
    "etag": "\"4f3c-UNW60/lWAI9Yq/mTdnUANa6oZoA\"",
    "mtime": "2026-07-17T19:33:17.538Z",
    "size": 20284,
    "path": "../public/_build/assets/cormorant-garamond-latin-ext-400-italic-BdEzgT7i.woff2"
  },
  "/_build/assets/cormorant-garamond-latin-ext-400-italic-CQvLaSWn.woff": {
    "type": "font/woff",
    "etag": "\"702c-aVQvKsLO20yon+8zZDwocDShFFw\"",
    "mtime": "2026-07-17T19:33:17.538Z",
    "size": 28716,
    "path": "../public/_build/assets/cormorant-garamond-latin-ext-400-italic-CQvLaSWn.woff"
  },
  "/_build/assets/cormorant-garamond-latin-ext-400-normal-Drx2k2n9.woff2": {
    "type": "font/woff2",
    "etag": "\"4db0-nad/GoSq2cQK8+zE21r7i24bdjY\"",
    "mtime": "2026-07-17T19:33:17.539Z",
    "size": 19888,
    "path": "../public/_build/assets/cormorant-garamond-latin-ext-400-normal-Drx2k2n9.woff2"
  },
  "/_build/assets/cormorant-garamond-latin-ext-400-normal-uvC0WHQr.woff": {
    "type": "font/woff",
    "etag": "\"6d18-McfiZ8PaVOWL5YgYKU94JxQwMFU\"",
    "mtime": "2026-07-17T19:33:17.539Z",
    "size": 27928,
    "path": "../public/_build/assets/cormorant-garamond-latin-ext-400-normal-uvC0WHQr.woff"
  },
  "/_build/assets/cormorant-garamond-vietnamese-300-italic-CCKicgM4.woff2": {
    "type": "font/woff2",
    "etag": "\"1828-qXG6MHSWX5L7s0t+b+jdyQXywgw\"",
    "mtime": "2026-07-17T19:33:17.538Z",
    "size": 6184,
    "path": "../public/_build/assets/cormorant-garamond-vietnamese-300-italic-CCKicgM4.woff2"
  },
  "/_build/assets/cormorant-garamond-vietnamese-300-italic-DjSFy2Pr.woff": {
    "type": "font/woff",
    "etag": "\"2294-/nXZE8er1MS3uOF0s/lqfRSYUv4\"",
    "mtime": "2026-07-17T19:33:17.539Z",
    "size": 8852,
    "path": "../public/_build/assets/cormorant-garamond-vietnamese-300-italic-DjSFy2Pr.woff"
  },
  "/_build/assets/cormorant-garamond-vietnamese-300-normal-BTzPAsHw.woff2": {
    "type": "font/woff2",
    "etag": "\"1850-mcA8wbz/JIDnGXp/kVIs686fKBs\"",
    "mtime": "2026-07-17T19:33:17.538Z",
    "size": 6224,
    "path": "../public/_build/assets/cormorant-garamond-vietnamese-300-normal-BTzPAsHw.woff2"
  },
  "/_build/assets/cormorant-garamond-vietnamese-300-normal-ByHlPz7v.woff": {
    "type": "font/woff",
    "etag": "\"2228-VoKDT9pVng73k0UN7USLd2vNYNk\"",
    "mtime": "2026-07-17T19:33:17.539Z",
    "size": 8744,
    "path": "../public/_build/assets/cormorant-garamond-vietnamese-300-normal-ByHlPz7v.woff"
  },
  "/_build/assets/cormorant-garamond-vietnamese-400-italic-BoXDRTEW.woff2": {
    "type": "font/woff2",
    "etag": "\"1a6c-bye8Y6DumedoHTv6bowxfN2+JCQ\"",
    "mtime": "2026-07-17T19:33:17.538Z",
    "size": 6764,
    "path": "../public/_build/assets/cormorant-garamond-vietnamese-400-italic-BoXDRTEW.woff2"
  },
  "/_build/assets/cormorant-garamond-vietnamese-400-italic-CJpMwFnN.woff": {
    "type": "font/woff",
    "etag": "\"24c0-JREuZQEmOHGewKikLiuzOyJms0w\"",
    "mtime": "2026-07-17T19:33:17.538Z",
    "size": 9408,
    "path": "../public/_build/assets/cormorant-garamond-vietnamese-400-italic-CJpMwFnN.woff"
  },
  "/_build/assets/cormorant-garamond-vietnamese-400-normal-4uxlocMh.woff": {
    "type": "font/woff",
    "etag": "\"2464-sNlDqyrGwuOXb49cv43hafatBpY\"",
    "mtime": "2026-07-17T19:33:17.539Z",
    "size": 9316,
    "path": "../public/_build/assets/cormorant-garamond-vietnamese-400-normal-4uxlocMh.woff"
  },
  "/_build/assets/cormorant-garamond-vietnamese-400-normal-6K-YXo6g.woff2": {
    "type": "font/woff2",
    "etag": "\"1a58-7J/nLaYlJJIBHtYRfJHATtWdRMA\"",
    "mtime": "2026-07-17T19:33:17.539Z",
    "size": 6744,
    "path": "../public/_build/assets/cormorant-garamond-vietnamese-400-normal-6K-YXo6g.woff2"
  },
  "/_build/assets/cotizacion-C1eYfkfT.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"1119-HaWDoFHBR70x4jfILsc75W0m6XQ\"",
    "mtime": "2026-07-17T19:33:17.538Z",
    "size": 4377,
    "path": "../public/_build/assets/cotizacion-C1eYfkfT.js"
  },
  "/_build/assets/cotizacion-C1eYfkfT.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"62e-50rEoNbNDCwevE7nbUetQPVO9RI\"",
    "mtime": "2026-07-17T19:33:17.583Z",
    "size": 1582,
    "path": "../public/_build/assets/cotizacion-C1eYfkfT.js.br"
  },
  "/_build/assets/cotizacion-C1eYfkfT.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"715-HHRSOrQ6jhXm5yHEelxQuUPEp54\"",
    "mtime": "2026-07-17T19:33:17.579Z",
    "size": 1813,
    "path": "../public/_build/assets/cotizacion-C1eYfkfT.js.gz"
  },
  "/_build/assets/cotizacion-DfL1dgXL.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"393-O7ikAXYQZKY541kmTrEuGJDTpjk\"",
    "mtime": "2026-07-17T19:33:17.539Z",
    "size": 915,
    "path": "../public/_build/assets/cotizacion-DfL1dgXL.css"
  },
  "/_build/assets/createAsync-zEJ5ZHo1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"29b-hTD07vWgXoRVTXi02bOSEKlnyjw\"",
    "mtime": "2026-07-17T19:33:17.539Z",
    "size": 667,
    "path": "../public/_build/assets/createAsync-zEJ5ZHo1.js"
  },
  "/_build/assets/images-B43p2foP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2ea-dMQsmPME+NWjEAZt9usnV6LiUEU\"",
    "mtime": "2026-07-17T19:33:17.540Z",
    "size": 746,
    "path": "../public/_build/assets/images-B43p2foP.js"
  },
  "/_build/assets/index-BuiKoTyY.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"267-1t219o4n0bgOGHnXCR/9xJr8Q38\"",
    "mtime": "2026-07-17T19:33:17.539Z",
    "size": 615,
    "path": "../public/_build/assets/index-BuiKoTyY.css"
  },
  "/_build/assets/index-C-w2-xr9.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"14bc-MPPvtuOnW3apjjT4NddFZ2H33BQ\"",
    "mtime": "2026-07-17T19:33:17.539Z",
    "size": 5308,
    "path": "../public/_build/assets/index-C-w2-xr9.css"
  },
  "/_build/assets/index-C-w2-xr9.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5e5-gONcpBUjp0NiPSq6RMOIC8CwkPQ\"",
    "mtime": "2026-07-17T19:33:17.586Z",
    "size": 1509,
    "path": "../public/_build/assets/index-C-w2-xr9.css.br"
  },
  "/_build/assets/index-C-w2-xr9.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6d2-PifT60oVsIq2b1/JrSfDEpduFOQ\"",
    "mtime": "2026-07-17T19:33:17.583Z",
    "size": 1746,
    "path": "../public/_build/assets/index-C-w2-xr9.css.gz"
  },
  "/_build/assets/index-C8dBSCGx.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"c15-SSJ9LwGt3feY+iCOd0+SKHmNmXI\"",
    "mtime": "2026-07-17T19:33:17.540Z",
    "size": 3093,
    "path": "../public/_build/assets/index-C8dBSCGx.js"
  },
  "/_build/assets/index-C8dBSCGx.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"4c1-NJIJKN7av7ZIg08oA8FZx06Y4aY\"",
    "mtime": "2026-07-17T19:33:17.586Z",
    "size": 1217,
    "path": "../public/_build/assets/index-C8dBSCGx.js.br"
  },
  "/_build/assets/index-C8dBSCGx.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"587-/sQWaHbA0itAEn/cNg/XvqjTbMo\"",
    "mtime": "2026-07-17T19:33:17.583Z",
    "size": 1415,
    "path": "../public/_build/assets/index-C8dBSCGx.js.gz"
  },
  "/_build/assets/index-DJUHhCCz.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"27b9-M/wEo72JSt9/kLYO79TcCDGhP04\"",
    "mtime": "2026-07-17T19:33:17.539Z",
    "size": 10169,
    "path": "../public/_build/assets/index-DJUHhCCz.js"
  },
  "/_build/assets/index-DJUHhCCz.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"d77-bfX9+XLLFFvL1hmYnuQma+k5ybY\"",
    "mtime": "2026-07-17T19:33:17.587Z",
    "size": 3447,
    "path": "../public/_build/assets/index-DJUHhCCz.js.br"
  },
  "/_build/assets/index-DJUHhCCz.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"f85-cdnAyBrRART4SJCqnsyIvWH4Cm0\"",
    "mtime": "2026-07-17T19:33:17.586Z",
    "size": 3973,
    "path": "../public/_build/assets/index-DJUHhCCz.js.gz"
  },
  "/_build/assets/index-D_iTvzxp.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"11f62-DFvM0YKrgi7+UK3u8jAMP/BMTik\"",
    "mtime": "2026-07-17T19:33:17.539Z",
    "size": 73570,
    "path": "../public/_build/assets/index-D_iTvzxp.js"
  },
  "/_build/assets/index-D_iTvzxp.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"5d2f-6qY77eWC4qZ8qe5U900AGi3zxj8\"",
    "mtime": "2026-07-17T19:33:17.645Z",
    "size": 23855,
    "path": "../public/_build/assets/index-D_iTvzxp.js.br"
  },
  "/_build/assets/index-D_iTvzxp.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6622-6tpsg4308Z74N6ScEQKYlhYlZvM\"",
    "mtime": "2026-07-17T19:33:17.587Z",
    "size": 26146,
    "path": "../public/_build/assets/index-D_iTvzxp.js.gz"
  },
  "/_build/assets/index-I8QQSZSd.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"873-O+VrqNhHDS44rHMN7irk8hbP0W8\"",
    "mtime": "2026-07-17T19:33:17.534Z",
    "size": 2163,
    "path": "../public/_build/assets/index-I8QQSZSd.js"
  },
  "/_build/assets/index-I8QQSZSd.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"3bb-gan7rfCa6kncoB6e1vHMhXq8wp4\"",
    "mtime": "2026-07-17T19:33:17.587Z",
    "size": 955,
    "path": "../public/_build/assets/index-I8QQSZSd.js.br"
  },
  "/_build/assets/index-I8QQSZSd.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"451-fXqSRNctLt9uRebfb88T73l1n04\"",
    "mtime": "2026-07-17T19:33:17.587Z",
    "size": 1105,
    "path": "../public/_build/assets/index-I8QQSZSd.js.gz"
  },
  "/_build/assets/index-i8seYcQE.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"b2f8-cl42N27XAAkxbugQa9dxZHihtPQ\"",
    "mtime": "2026-07-17T19:33:17.540Z",
    "size": 45816,
    "path": "../public/_build/assets/index-i8seYcQE.js"
  },
  "/_build/assets/index-i8seYcQE.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"3f57-PPAHIA2QUnbwjM2tl0EYaaswCnQ\"",
    "mtime": "2026-07-17T19:33:17.621Z",
    "size": 16215,
    "path": "../public/_build/assets/index-i8seYcQE.js.br"
  },
  "/_build/assets/index-i8seYcQE.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"4648-V447XycNyjSQILVjEvQeMDdYiYs\"",
    "mtime": "2026-07-17T19:33:17.587Z",
    "size": 17992,
    "path": "../public/_build/assets/index-i8seYcQE.js.gz"
  },
  "/_build/assets/outfit-latin-ext-wght-normal-DdQaqQDo.woff2": {
    "type": "font/woff2",
    "etag": "\"39d8-sqVel30br8w1wJ7fkoMuV0KPYjs\"",
    "mtime": "2026-07-17T19:33:17.539Z",
    "size": 14808,
    "path": "../public/_build/assets/outfit-latin-ext-wght-normal-DdQaqQDo.woff2"
  },
  "/_build/assets/outfit-latin-wght-normal-Bc-8i84L.woff2": {
    "type": "font/woff2",
    "etag": "\"7e24-2KMW98v6RuaYdskl5Y+/e3wavw0\"",
    "mtime": "2026-07-17T19:33:17.534Z",
    "size": 32292,
    "path": "../public/_build/assets/outfit-latin-wght-normal-Bc-8i84L.woff2"
  },
  "/_build/assets/preload-helper-ug3pwPZ1.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"45d-XiQMNpbVR2X0xJL+SxLhHj6mxQk\"",
    "mtime": "2026-07-17T19:33:17.540Z",
    "size": 1117,
    "path": "../public/_build/assets/preload-helper-ug3pwPZ1.js"
  },
  "/_build/assets/preload-helper-ug3pwPZ1.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"219-M4m9Tmf23DzC7fqfeE0YouucbAc\"",
    "mtime": "2026-07-17T19:33:17.590Z",
    "size": 537,
    "path": "../public/_build/assets/preload-helper-ug3pwPZ1.js.br"
  },
  "/_build/assets/preload-helper-ug3pwPZ1.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"28d-Z5ThR7vdKzwXSki3u9wq9pzNr0w\"",
    "mtime": "2026-07-17T19:33:17.589Z",
    "size": 653,
    "path": "../public/_build/assets/preload-helper-ug3pwPZ1.js.gz"
  },
  "/_server/assets/app-h3uGFq88.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"32fc-XPQ5jb9S7hjmMuQaUTsC5rdA6k8\"",
    "mtime": "2026-07-17T19:33:17.546Z",
    "size": 13052,
    "path": "../public/_server/assets/app-h3uGFq88.css"
  },
  "/_server/assets/app-h3uGFq88.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"891-cD16FZQEevZVySEo1rmkn4VuyYQ\"",
    "mtime": "2026-07-17T19:33:17.606Z",
    "size": 2193,
    "path": "../public/_server/assets/app-h3uGFq88.css.br"
  },
  "/_server/assets/app-h3uGFq88.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"9eb-29+kMhwcWAL8aag366Ta2kNfoPo\"",
    "mtime": "2026-07-17T19:33:17.596Z",
    "size": 2539,
    "path": "../public/_server/assets/app-h3uGFq88.css.gz"
  },
  "/_server/assets/cormorant-garamond-cyrillic-300-italic-Bi4RSOgf.woff2": {
    "type": "font/woff2",
    "etag": "\"3068-PcW3fleGg213fE14eLAZ4FfebCg\"",
    "mtime": "2026-07-17T19:33:17.547Z",
    "size": 12392,
    "path": "../public/_server/assets/cormorant-garamond-cyrillic-300-italic-Bi4RSOgf.woff2"
  },
  "/_server/assets/cormorant-garamond-cyrillic-300-italic-Bo30KLu4.woff": {
    "type": "font/woff",
    "etag": "\"3cfc-ZL5G9Tm2VIgY/5jUNjpCeWAsPl4\"",
    "mtime": "2026-07-17T19:33:17.546Z",
    "size": 15612,
    "path": "../public/_server/assets/cormorant-garamond-cyrillic-300-italic-Bo30KLu4.woff"
  },
  "/_server/assets/cormorant-garamond-cyrillic-300-normal-DZNkLIMe.woff2": {
    "type": "font/woff2",
    "etag": "\"2fe0-tor/Zw4N4Q8m99DCL6z37+vBcuY\"",
    "mtime": "2026-07-17T19:33:17.547Z",
    "size": 12256,
    "path": "../public/_server/assets/cormorant-garamond-cyrillic-300-normal-DZNkLIMe.woff2"
  },
  "/_server/assets/cormorant-garamond-cyrillic-300-normal-KEduutn5.woff": {
    "type": "font/woff",
    "etag": "\"3b3c-/KT0xhbDBsShWpF/E0OQpi0UJEg\"",
    "mtime": "2026-07-17T19:33:17.547Z",
    "size": 15164,
    "path": "../public/_server/assets/cormorant-garamond-cyrillic-300-normal-KEduutn5.woff"
  },
  "/_server/assets/cormorant-garamond-cyrillic-400-italic-AH1vqu4S.woff": {
    "type": "font/woff",
    "etag": "\"3e8c-vuG7ZdOYlvAi8XntVayWrdGH3I4\"",
    "mtime": "2026-07-17T19:33:17.546Z",
    "size": 16012,
    "path": "../public/_server/assets/cormorant-garamond-cyrillic-400-italic-AH1vqu4S.woff"
  },
  "/_server/assets/cormorant-garamond-cyrillic-400-italic-D3GtrbRZ.woff2": {
    "type": "font/woff2",
    "etag": "\"31b0-WpEGO2ZZDwZw3yhkAhhXXHwMjIA\"",
    "mtime": "2026-07-17T19:33:17.547Z",
    "size": 12720,
    "path": "../public/_server/assets/cormorant-garamond-cyrillic-400-italic-D3GtrbRZ.woff2"
  },
  "/_server/assets/cormorant-garamond-cyrillic-400-normal-CVFrM67f.woff": {
    "type": "font/woff",
    "etag": "\"3d50-XCV+tzKH13DKsRqSfSlBVs9ZqH4\"",
    "mtime": "2026-07-17T19:33:17.547Z",
    "size": 15696,
    "path": "../public/_server/assets/cormorant-garamond-cyrillic-400-normal-CVFrM67f.woff"
  },
  "/_server/assets/cormorant-garamond-cyrillic-400-normal-DD2KOZkl.woff2": {
    "type": "font/woff2",
    "etag": "\"31e8-vwlRkfqNiOhu8jAtpp4hMZwAx8I\"",
    "mtime": "2026-07-17T19:33:17.547Z",
    "size": 12776,
    "path": "../public/_server/assets/cormorant-garamond-cyrillic-400-normal-DD2KOZkl.woff2"
  },
  "/_server/assets/cormorant-garamond-cyrillic-ext-300-italic-B31MkR9z.woff2": {
    "type": "font/woff2",
    "etag": "\"3788-/sGMUhu8Y3HNLfNPuM8ZX9Qsr3o\"",
    "mtime": "2026-07-17T19:33:17.548Z",
    "size": 14216,
    "path": "../public/_server/assets/cormorant-garamond-cyrillic-ext-300-italic-B31MkR9z.woff2"
  },
  "/_server/assets/cormorant-garamond-cyrillic-ext-300-italic-Dj41S4NK.woff": {
    "type": "font/woff",
    "etag": "\"4878-3+6qytSFU/u78S2PRDQhdVpFSeI\"",
    "mtime": "2026-07-17T19:33:17.547Z",
    "size": 18552,
    "path": "../public/_server/assets/cormorant-garamond-cyrillic-ext-300-italic-Dj41S4NK.woff"
  },
  "/_server/assets/cormorant-garamond-cyrillic-ext-300-normal-B5wCrnbP.woff": {
    "type": "font/woff",
    "etag": "\"41dc-K84NXDH/w4+LWcUkih8pESLVyQw\"",
    "mtime": "2026-07-17T19:33:17.547Z",
    "size": 16860,
    "path": "../public/_server/assets/cormorant-garamond-cyrillic-ext-300-normal-B5wCrnbP.woff"
  },
  "/_server/assets/cormorant-garamond-cyrillic-ext-300-normal-D8IReVS-.woff2": {
    "type": "font/woff2",
    "etag": "\"33e4-MP9xAaMtPpHvHs24gii9L+n1YYM\"",
    "mtime": "2026-07-17T19:33:17.548Z",
    "size": 13284,
    "path": "../public/_server/assets/cormorant-garamond-cyrillic-ext-300-normal-D8IReVS-.woff2"
  },
  "/_server/assets/cormorant-garamond-cyrillic-ext-400-italic-BEGvmv_3.woff2": {
    "type": "font/woff2",
    "etag": "\"399c-BSGaBxsdgQlGC31XI1mPwQ3SOak\"",
    "mtime": "2026-07-17T19:33:17.549Z",
    "size": 14748,
    "path": "../public/_server/assets/cormorant-garamond-cyrillic-ext-400-italic-BEGvmv_3.woff2"
  },
  "/_server/assets/cormorant-garamond-cyrillic-ext-400-italic-C_Uk1MUY.woff": {
    "type": "font/woff",
    "etag": "\"4ac0-q6aID/vYtH5bAifKoQewLHZIEdQ\"",
    "mtime": "2026-07-17T19:33:17.548Z",
    "size": 19136,
    "path": "../public/_server/assets/cormorant-garamond-cyrillic-ext-400-italic-C_Uk1MUY.woff"
  },
  "/_server/assets/cormorant-garamond-cyrillic-ext-400-normal-DLdKLAvx.woff": {
    "type": "font/woff",
    "etag": "\"4414-nZ05aqplOpNbo+Cb0cI2Xh249d8\"",
    "mtime": "2026-07-17T19:33:17.547Z",
    "size": 17428,
    "path": "../public/_server/assets/cormorant-garamond-cyrillic-ext-400-normal-DLdKLAvx.woff"
  },
  "/_server/assets/cormorant-garamond-cyrillic-ext-400-normal-W3Dto7M0.woff2": {
    "type": "font/woff2",
    "etag": "\"3660-4ffgpEH9mWDcu2do7M9ndzNYKA0\"",
    "mtime": "2026-07-17T19:33:17.549Z",
    "size": 13920,
    "path": "../public/_server/assets/cormorant-garamond-cyrillic-ext-400-normal-W3Dto7M0.woff2"
  },
  "/_server/assets/cormorant-garamond-latin-300-italic-DRnsRYID.woff": {
    "type": "font/woff",
    "etag": "\"7c1c-O6ojxW6O4/pW7S1zZbuyPgskHVg\"",
    "mtime": "2026-07-17T19:33:17.547Z",
    "size": 31772,
    "path": "../public/_server/assets/cormorant-garamond-latin-300-italic-DRnsRYID.woff"
  },
  "/_server/assets/cormorant-garamond-latin-300-italic-qkwBXYHn.woff2": {
    "type": "font/woff2",
    "etag": "\"57d4-+qaMGhOUeOdmytD3703PhpOL1cs\"",
    "mtime": "2026-07-17T19:33:17.548Z",
    "size": 22484,
    "path": "../public/_server/assets/cormorant-garamond-latin-300-italic-qkwBXYHn.woff2"
  },
  "/_server/assets/cormorant-garamond-latin-300-normal-BuXLI6C0.woff": {
    "type": "font/woff",
    "etag": "\"7508-u1KAIcLDbVUlb5nheOcFc6ShKKQ\"",
    "mtime": "2026-07-17T19:33:17.548Z",
    "size": 29960,
    "path": "../public/_server/assets/cormorant-garamond-latin-300-normal-BuXLI6C0.woff"
  },
  "/_server/assets/cormorant-garamond-latin-300-normal-Cw-E_7L1.woff2": {
    "type": "font/woff2",
    "etag": "\"5594-BpOyVPlWKLEkdSK4o6x3lNDzvSE\"",
    "mtime": "2026-07-17T19:33:17.548Z",
    "size": 21908,
    "path": "../public/_server/assets/cormorant-garamond-latin-300-normal-Cw-E_7L1.woff2"
  },
  "/_server/assets/cormorant-garamond-latin-400-italic-BLh7T8o8.woff": {
    "type": "font/woff",
    "etag": "\"8078-4VkY1Evw3rkCJJtuUs+n8W1g5Lw\"",
    "mtime": "2026-07-17T19:33:17.548Z",
    "size": 32888,
    "path": "../public/_server/assets/cormorant-garamond-latin-400-italic-BLh7T8o8.woff"
  },
  "/_server/assets/cormorant-garamond-latin-400-italic-Dc_OZ8oc.woff2": {
    "type": "font/woff2",
    "etag": "\"5c6c-gQ/mrJ4YWdX29DaZqxY+2CXhY0A\"",
    "mtime": "2026-07-17T19:33:17.548Z",
    "size": 23660,
    "path": "../public/_server/assets/cormorant-garamond-latin-400-italic-Dc_OZ8oc.woff2"
  },
  "/_server/assets/cormorant-garamond-latin-400-normal-B-1hWBU7.woff2": {
    "type": "font/woff2",
    "etag": "\"595c-plElvBMbfA4vsaFAqui//GFeZ5o\"",
    "mtime": "2026-07-17T19:33:17.549Z",
    "size": 22876,
    "path": "../public/_server/assets/cormorant-garamond-latin-400-normal-B-1hWBU7.woff2"
  },
  "/_server/assets/cormorant-garamond-latin-ext-300-italic-Bt0Wsy7Q.woff2": {
    "type": "font/woff2",
    "etag": "\"4b34-b0iA+N4e6kfSpVN/lbfWhWwqrVg\"",
    "mtime": "2026-07-17T19:33:17.548Z",
    "size": 19252,
    "path": "../public/_server/assets/cormorant-garamond-latin-ext-300-italic-Bt0Wsy7Q.woff2"
  },
  "/_server/assets/cormorant-garamond-latin-400-normal-B7YtguxJ.woff": {
    "type": "font/woff",
    "etag": "\"7904-9V90i7R9qGBbagyxxIPch9DOJgo\"",
    "mtime": "2026-07-17T19:33:17.548Z",
    "size": 30980,
    "path": "../public/_server/assets/cormorant-garamond-latin-400-normal-B7YtguxJ.woff"
  },
  "/_server/assets/cormorant-garamond-latin-ext-300-normal-BsCYHBWC.woff2": {
    "type": "font/woff2",
    "etag": "\"4a88-inJb/gvWkIDxa4Rm3+JD3cvVwdY\"",
    "mtime": "2026-07-17T19:33:17.549Z",
    "size": 19080,
    "path": "../public/_server/assets/cormorant-garamond-latin-ext-300-normal-BsCYHBWC.woff2"
  },
  "/_server/assets/cormorant-garamond-latin-ext-300-italic-DambfolG.woff": {
    "type": "font/woff",
    "etag": "\"6c10-aNVaQ5oH3oFdvGzh1No4RldRZGU\"",
    "mtime": "2026-07-17T19:33:17.549Z",
    "size": 27664,
    "path": "../public/_server/assets/cormorant-garamond-latin-ext-300-italic-DambfolG.woff"
  },
  "/_server/assets/cormorant-garamond-latin-ext-300-normal-DueGyF8j.woff": {
    "type": "font/woff",
    "etag": "\"6970-zpZ3+4RrgapXjBvao/d8OnWoMCM\"",
    "mtime": "2026-07-17T19:33:17.549Z",
    "size": 26992,
    "path": "../public/_server/assets/cormorant-garamond-latin-ext-300-normal-DueGyF8j.woff"
  },
  "/_server/assets/cormorant-garamond-latin-ext-400-italic-BdEzgT7i.woff2": {
    "type": "font/woff2",
    "etag": "\"4f3c-UNW60/lWAI9Yq/mTdnUANa6oZoA\"",
    "mtime": "2026-07-17T19:33:17.550Z",
    "size": 20284,
    "path": "../public/_server/assets/cormorant-garamond-latin-ext-400-italic-BdEzgT7i.woff2"
  },
  "/_server/assets/cormorant-garamond-latin-ext-400-italic-CQvLaSWn.woff": {
    "type": "font/woff",
    "etag": "\"702c-aVQvKsLO20yon+8zZDwocDShFFw\"",
    "mtime": "2026-07-17T19:33:17.550Z",
    "size": 28716,
    "path": "../public/_server/assets/cormorant-garamond-latin-ext-400-italic-CQvLaSWn.woff"
  },
  "/_server/assets/cormorant-garamond-latin-ext-400-normal-Drx2k2n9.woff2": {
    "type": "font/woff2",
    "etag": "\"4db0-nad/GoSq2cQK8+zE21r7i24bdjY\"",
    "mtime": "2026-07-17T19:33:17.549Z",
    "size": 19888,
    "path": "../public/_server/assets/cormorant-garamond-latin-ext-400-normal-Drx2k2n9.woff2"
  },
  "/_server/assets/cormorant-garamond-latin-ext-400-normal-uvC0WHQr.woff": {
    "type": "font/woff",
    "etag": "\"6d18-McfiZ8PaVOWL5YgYKU94JxQwMFU\"",
    "mtime": "2026-07-17T19:33:17.549Z",
    "size": 27928,
    "path": "../public/_server/assets/cormorant-garamond-latin-ext-400-normal-uvC0WHQr.woff"
  },
  "/_server/assets/cormorant-garamond-vietnamese-300-italic-CCKicgM4.woff2": {
    "type": "font/woff2",
    "etag": "\"1828-qXG6MHSWX5L7s0t+b+jdyQXywgw\"",
    "mtime": "2026-07-17T19:33:17.549Z",
    "size": 6184,
    "path": "../public/_server/assets/cormorant-garamond-vietnamese-300-italic-CCKicgM4.woff2"
  },
  "/_server/assets/cormorant-garamond-vietnamese-300-italic-DjSFy2Pr.woff": {
    "type": "font/woff",
    "etag": "\"2294-/nXZE8er1MS3uOF0s/lqfRSYUv4\"",
    "mtime": "2026-07-17T19:33:17.550Z",
    "size": 8852,
    "path": "../public/_server/assets/cormorant-garamond-vietnamese-300-italic-DjSFy2Pr.woff"
  },
  "/_server/assets/cormorant-garamond-vietnamese-300-normal-BTzPAsHw.woff2": {
    "type": "font/woff2",
    "etag": "\"1850-mcA8wbz/JIDnGXp/kVIs686fKBs\"",
    "mtime": "2026-07-17T19:33:17.549Z",
    "size": 6224,
    "path": "../public/_server/assets/cormorant-garamond-vietnamese-300-normal-BTzPAsHw.woff2"
  },
  "/_server/assets/cormorant-garamond-vietnamese-300-normal-ByHlPz7v.woff": {
    "type": "font/woff",
    "etag": "\"2228-VoKDT9pVng73k0UN7USLd2vNYNk\"",
    "mtime": "2026-07-17T19:33:17.550Z",
    "size": 8744,
    "path": "../public/_server/assets/cormorant-garamond-vietnamese-300-normal-ByHlPz7v.woff"
  },
  "/_server/assets/cormorant-garamond-vietnamese-400-italic-BoXDRTEW.woff2": {
    "type": "font/woff2",
    "etag": "\"1a6c-bye8Y6DumedoHTv6bowxfN2+JCQ\"",
    "mtime": "2026-07-17T19:33:17.550Z",
    "size": 6764,
    "path": "../public/_server/assets/cormorant-garamond-vietnamese-400-italic-BoXDRTEW.woff2"
  },
  "/_server/assets/cormorant-garamond-vietnamese-400-italic-CJpMwFnN.woff": {
    "type": "font/woff",
    "etag": "\"24c0-JREuZQEmOHGewKikLiuzOyJms0w\"",
    "mtime": "2026-07-17T19:33:17.551Z",
    "size": 9408,
    "path": "../public/_server/assets/cormorant-garamond-vietnamese-400-italic-CJpMwFnN.woff"
  },
  "/_server/assets/cormorant-garamond-vietnamese-400-normal-4uxlocMh.woff": {
    "type": "font/woff",
    "etag": "\"2464-sNlDqyrGwuOXb49cv43hafatBpY\"",
    "mtime": "2026-07-17T19:33:17.551Z",
    "size": 9316,
    "path": "../public/_server/assets/cormorant-garamond-vietnamese-400-normal-4uxlocMh.woff"
  },
  "/_server/assets/cormorant-garamond-vietnamese-400-normal-6K-YXo6g.woff2": {
    "type": "font/woff2",
    "etag": "\"1a58-7J/nLaYlJJIBHtYRfJHATtWdRMA\"",
    "mtime": "2026-07-17T19:33:17.550Z",
    "size": 6744,
    "path": "../public/_server/assets/cormorant-garamond-vietnamese-400-normal-6K-YXo6g.woff2"
  },
  "/_server/assets/cotizacion-DfL1dgXL.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"393-O7ikAXYQZKY541kmTrEuGJDTpjk\"",
    "mtime": "2026-07-17T19:33:17.551Z",
    "size": 915,
    "path": "../public/_server/assets/cotizacion-DfL1dgXL.css"
  },
  "/_server/assets/index-C-w2-xr9.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"14bc-MPPvtuOnW3apjjT4NddFZ2H33BQ\"",
    "mtime": "2026-07-17T19:33:17.550Z",
    "size": 5308,
    "path": "../public/_server/assets/index-C-w2-xr9.css"
  },
  "/_server/assets/index-C-w2-xr9.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"5e5-gONcpBUjp0NiPSq6RMOIC8CwkPQ\"",
    "mtime": "2026-07-17T19:33:17.603Z",
    "size": 1509,
    "path": "../public/_server/assets/index-C-w2-xr9.css.br"
  },
  "/_server/assets/index-C-w2-xr9.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6d2-PifT60oVsIq2b1/JrSfDEpduFOQ\"",
    "mtime": "2026-07-17T19:33:17.603Z",
    "size": 1746,
    "path": "../public/_server/assets/index-C-w2-xr9.css.gz"
  },
  "/_server/assets/index-BuiKoTyY.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"267-1t219o4n0bgOGHnXCR/9xJr8Q38\"",
    "mtime": "2026-07-17T19:33:17.550Z",
    "size": 615,
    "path": "../public/_server/assets/index-BuiKoTyY.css"
  },
  "/_server/assets/outfit-latin-ext-wght-normal-DdQaqQDo.woff2": {
    "type": "font/woff2",
    "etag": "\"39d8-sqVel30br8w1wJ7fkoMuV0KPYjs\"",
    "mtime": "2026-07-17T19:33:17.551Z",
    "size": 14808,
    "path": "../public/_server/assets/outfit-latin-ext-wght-normal-DdQaqQDo.woff2"
  },
  "/_server/assets/outfit-latin-wght-normal-Bc-8i84L.woff2": {
    "type": "font/woff2",
    "etag": "\"7e24-2KMW98v6RuaYdskl5Y+/e3wavw0\"",
    "mtime": "2026-07-17T19:33:17.552Z",
    "size": 32292,
    "path": "../public/_server/assets/outfit-latin-wght-normal-Bc-8i84L.woff2"
  },
  "/img/swatches/blanco-carrara-1600.avif": {
    "type": "image/avif",
    "etag": "\"455a-ezFQwoncKXJXqdyCFInP7IuV7uE\"",
    "mtime": "2026-07-17T19:33:17.499Z",
    "size": 17754,
    "path": "../public/img/swatches/blanco-carrara-1600.avif"
  },
  "/img/swatches/blanco-carrara-1600.webp": {
    "type": "image/webp",
    "etag": "\"4c0a-nYY6LvMhHTmc/bHj/TCjYS1P1L4\"",
    "mtime": "2026-07-17T19:33:17.501Z",
    "size": 19466,
    "path": "../public/img/swatches/blanco-carrara-1600.webp"
  },
  "/img/swatches/blanco-carrara-480.avif": {
    "type": "image/avif",
    "etag": "\"1274-B4e8lqBWeYw/oEeOnPHdFJgz4Hc\"",
    "mtime": "2026-07-17T19:33:17.501Z",
    "size": 4724,
    "path": "../public/img/swatches/blanco-carrara-480.avif"
  },
  "/img/swatches/blanco-carrara-480.webp": {
    "type": "image/webp",
    "etag": "\"e62-IhUkUmIZ40y+pIWnXulj7qQxBPA\"",
    "mtime": "2026-07-17T19:33:17.501Z",
    "size": 3682,
    "path": "../public/img/swatches/blanco-carrara-480.webp"
  },
  "/img/swatches/blanco-carrara-960.avif": {
    "type": "image/avif",
    "etag": "\"2751-5fPrKnNaX9/wDrGz9EJWMLv38FM\"",
    "mtime": "2026-07-17T19:33:17.501Z",
    "size": 10065,
    "path": "../public/img/swatches/blanco-carrara-960.avif"
  },
  "/img/swatches/blanco-carrara-960.webp": {
    "type": "image/webp",
    "etag": "\"243e-otF8AJtyaP/N+h6tSzAAUHY6Uj8\"",
    "mtime": "2026-07-17T19:33:17.501Z",
    "size": 9278,
    "path": "../public/img/swatches/blanco-carrara-960.webp"
  },
  "/img/swatches/blanco-carrara.avif": {
    "type": "image/avif",
    "etag": "\"2751-5fPrKnNaX9/wDrGz9EJWMLv38FM\"",
    "mtime": "2026-07-17T19:33:17.501Z",
    "size": 10065,
    "path": "../public/img/swatches/blanco-carrara.avif"
  },
  "/img/swatches/blanco-carrara.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"521-gZrg7CKY0tLjPr7xwdEChcp1uFI\"",
    "mtime": "2026-07-17T19:33:17.501Z",
    "size": 1313,
    "path": "../public/img/swatches/blanco-carrara.svg"
  },
  "/img/swatches/blanco-carrara.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"173-WJgtF+7kVCGOm0+xurT8yCf/ob4\"",
    "mtime": "2026-07-17T19:33:17.613Z",
    "size": 371,
    "path": "../public/img/swatches/blanco-carrara.svg.br"
  },
  "/img/swatches/blanco-carrara.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"1c8-RBfHYsf+3PvQd3oSVnqpx4gHTN0\"",
    "mtime": "2026-07-17T19:33:17.613Z",
    "size": 456,
    "path": "../public/img/swatches/blanco-carrara.svg.gz"
  },
  "/img/swatches/blanco-carrara.webp": {
    "type": "image/webp",
    "etag": "\"243e-otF8AJtyaP/N+h6tSzAAUHY6Uj8\"",
    "mtime": "2026-07-17T19:33:17.501Z",
    "size": 9278,
    "path": "../public/img/swatches/blanco-carrara.webp"
  },
  "/img/swatches/blue-dunes-1600.avif": {
    "type": "image/avif",
    "etag": "\"41594-Ccmoc3W+5l06cSSjdFKjqZqRfOA\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 267668,
    "path": "../public/img/swatches/blue-dunes-1600.avif"
  },
  "/img/swatches/blue-dunes-480.webp": {
    "type": "image/webp",
    "etag": "\"10eea-NQeytb+q/6xnmtzACYPh4eGKtNk\"",
    "mtime": "2026-07-17T19:33:17.501Z",
    "size": 69354,
    "path": "../public/img/swatches/blue-dunes-480.webp"
  },
  "/img/swatches/blue-dunes-480.avif": {
    "type": "image/avif",
    "etag": "\"b001-Ry7Jy89J1ZUdbXXBVJGBW+8glr0\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 45057,
    "path": "../public/img/swatches/blue-dunes-480.avif"
  },
  "/img/swatches/blue-dunes-960.avif": {
    "type": "image/avif",
    "etag": "\"230e2-oZ4Y4ooxKfc1x06naTngDZOdrNo\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 143586,
    "path": "../public/img/swatches/blue-dunes-960.avif"
  },
  "/img/swatches/blue-dunes.avif": {
    "type": "image/avif",
    "etag": "\"230e2-oZ4Y4ooxKfc1x06naTngDZOdrNo\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 143586,
    "path": "../public/img/swatches/blue-dunes.avif"
  },
  "/img/swatches/blue-dunes-960.webp": {
    "type": "image/webp",
    "etag": "\"3b328-pfsAhm/gyDvCvXjs/PQSADTSlNk\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 242472,
    "path": "../public/img/swatches/blue-dunes-960.webp"
  },
  "/img/swatches/blue-dunes-1600.webp": {
    "type": "image/webp",
    "etag": "\"67e3e-OINrBpOZ5MYDLrEMh3w7lyR/mCw\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 425534,
    "path": "../public/img/swatches/blue-dunes-1600.webp"
  },
  "/img/swatches/blue-dunes.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3b5f-52BGcVRKoJgFOrxnjt5WNzLukKg\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 15199,
    "path": "../public/img/swatches/blue-dunes.svg"
  },
  "/img/swatches/blue-dunes.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"7d8-H78E4+/rY6rOD4MJ3jaM1V0FCvU\"",
    "mtime": "2026-07-17T19:33:17.627Z",
    "size": 2008,
    "path": "../public/img/swatches/blue-dunes.svg.br"
  },
  "/img/swatches/blue-dunes.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"9ab-D4sMisCnR2NVBGiWeuAqI+XSXQk\"",
    "mtime": "2026-07-17T19:33:17.617Z",
    "size": 2475,
    "path": "../public/img/swatches/blue-dunes.svg.gz"
  },
  "/img/swatches/calacatta-oro-1600.avif": {
    "type": "image/avif",
    "etag": "\"3cba-XBJxR/TBLW4U/03oxHySVWMMp0E\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 15546,
    "path": "../public/img/swatches/calacatta-oro-1600.avif"
  },
  "/img/swatches/blue-dunes.webp": {
    "type": "image/webp",
    "etag": "\"3b328-pfsAhm/gyDvCvXjs/PQSADTSlNk\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 242472,
    "path": "../public/img/swatches/blue-dunes.webp"
  },
  "/img/swatches/calacatta-oro-1600.webp": {
    "type": "image/webp",
    "etag": "\"4eb2-BX9GLujQ5KFfxmZnunYr7bvG1vE\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 20146,
    "path": "../public/img/swatches/calacatta-oro-1600.webp"
  },
  "/img/swatches/calacatta-oro-480.avif": {
    "type": "image/avif",
    "etag": "\"fa8-xcJEEilMA1IIChfIUzyWzngm8d4\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 4008,
    "path": "../public/img/swatches/calacatta-oro-480.avif"
  },
  "/img/swatches/calacatta-oro-480.webp": {
    "type": "image/webp",
    "etag": "\"e8a-7T13ibtjt7ej5/SktdtWoWlwEiM\"",
    "mtime": "2026-07-17T19:33:17.503Z",
    "size": 3722,
    "path": "../public/img/swatches/calacatta-oro-480.webp"
  },
  "/img/swatches/calacatta-oro-960.avif": {
    "type": "image/avif",
    "etag": "\"2167-xQzlJraz5LJra2iaZVhr3a/LDM0\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 8551,
    "path": "../public/img/swatches/calacatta-oro-960.avif"
  },
  "/img/swatches/calacatta-oro-960.webp": {
    "type": "image/webp",
    "etag": "\"263e-ovgaZGfzEW229DiKjssG7et9Nug\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 9790,
    "path": "../public/img/swatches/calacatta-oro-960.webp"
  },
  "/img/swatches/calacatta-oro.avif": {
    "type": "image/avif",
    "etag": "\"2167-xQzlJraz5LJra2iaZVhr3a/LDM0\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 8551,
    "path": "../public/img/swatches/calacatta-oro.avif"
  },
  "/img/swatches/calacatta-oro.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"529-yG/9XC5T87mdLR9Zp6WMx8fHfo8\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 1321,
    "path": "../public/img/swatches/calacatta-oro.svg"
  },
  "/img/swatches/calacatta-oro.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"172-bZ9NtdvyEG87oB15Vq35NOtz8Xg\"",
    "mtime": "2026-07-17T19:33:17.620Z",
    "size": 370,
    "path": "../public/img/swatches/calacatta-oro.svg.br"
  },
  "/img/swatches/calacatta-oro.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"1c6-DX3ySz4+0u/Ms5VO8On7QLn67ZQ\"",
    "mtime": "2026-07-17T19:33:17.620Z",
    "size": 454,
    "path": "../public/img/swatches/calacatta-oro.svg.gz"
  },
  "/img/swatches/calacatta-oro.webp": {
    "type": "image/webp",
    "etag": "\"263e-ovgaZGfzEW229DiKjssG7et9Nug\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 9790,
    "path": "../public/img/swatches/calacatta-oro.webp"
  },
  "/img/swatches/gris-niebla.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"523-XSXPKIBrZXHwxLGA8rey5Ulq1tU\"",
    "mtime": "2026-07-17T19:33:17.502Z",
    "size": 1315,
    "path": "../public/img/swatches/gris-niebla.svg"
  },
  "/img/swatches/gris-niebla.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"174-VaL02vQAG/E+7TeQyZb+Ts5b0pI\"",
    "mtime": "2026-07-17T19:33:17.621Z",
    "size": 372,
    "path": "../public/img/swatches/gris-niebla.svg.br"
  },
  "/img/swatches/gris-niebla.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"1bc-bpUb58UAwmdHxVZQVsBBWhMXznw\"",
    "mtime": "2026-07-17T19:33:17.621Z",
    "size": 444,
    "path": "../public/img/swatches/gris-niebla.svg.gz"
  },
  "/img/swatches/gris-perla.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3b62-MuEgzamV2GlztieuFHBGOVZ8m3A\"",
    "mtime": "2026-07-17T19:33:17.503Z",
    "size": 15202,
    "path": "../public/img/swatches/gris-perla.svg"
  },
  "/img/swatches/gris-perla.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"7df-V/EhLBLMXe9Mqj9J4uUFDeuu+lg\"",
    "mtime": "2026-07-17T19:33:17.636Z",
    "size": 2015,
    "path": "../public/img/swatches/gris-perla.svg.br"
  },
  "/img/swatches/gris-perla.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"9b4-8iz/Oeh5vToESruSs9FwZlKjzVo\"",
    "mtime": "2026-07-17T19:33:17.621Z",
    "size": 2484,
    "path": "../public/img/swatches/gris-perla.svg.gz"
  },
  "/img/swatches/luna-pearl-1600.avif": {
    "type": "image/avif",
    "etag": "\"43f3d-08HSwJdYxtUSIyeNiyjNjrgdgnQ\"",
    "mtime": "2026-07-17T19:33:17.503Z",
    "size": 278333,
    "path": "../public/img/swatches/luna-pearl-1600.avif"
  },
  "/img/swatches/luna-pearl-480.webp": {
    "type": "image/webp",
    "etag": "\"108fa-u7VWRV6P4MDKcaquaWuqV2xB+ck\"",
    "mtime": "2026-07-17T19:33:17.503Z",
    "size": 67834,
    "path": "../public/img/swatches/luna-pearl-480.webp"
  },
  "/img/swatches/luna-pearl-480.avif": {
    "type": "image/avif",
    "etag": "\"a13b-SMjcYjE9N0P4bAyXKv2szydy/Mg\"",
    "mtime": "2026-07-17T19:33:17.503Z",
    "size": 41275,
    "path": "../public/img/swatches/luna-pearl-480.avif"
  },
  "/img/swatches/luna-pearl-960.avif": {
    "type": "image/avif",
    "etag": "\"1ff4d-WpZyOZXRqjl9tmSlWmn7bMDPOC0\"",
    "mtime": "2026-07-17T19:33:17.503Z",
    "size": 130893,
    "path": "../public/img/swatches/luna-pearl-960.avif"
  },
  "/img/swatches/luna-pearl-960.webp": {
    "type": "image/webp",
    "etag": "\"31f7c-u+1laFiwOewsQZtxiFlH6KWuWME\"",
    "mtime": "2026-07-17T19:33:17.503Z",
    "size": 204668,
    "path": "../public/img/swatches/luna-pearl-960.webp"
  },
  "/img/swatches/luna-pearl.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3b5b-yKHD9wgqOTq2by8k7b9gxtX9pQ4\"",
    "mtime": "2026-07-17T19:33:17.503Z",
    "size": 15195,
    "path": "../public/img/swatches/luna-pearl.svg"
  },
  "/img/swatches/luna-pearl.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"7c7-O1ehd/VHHRcG3XRYMG9IvBobGT0\"",
    "mtime": "2026-07-17T19:33:17.636Z",
    "size": 1991,
    "path": "../public/img/swatches/luna-pearl.svg.br"
  },
  "/img/swatches/luna-pearl-1600.webp": {
    "type": "image/webp",
    "etag": "\"5b01a-rebp6lZTjdLrHDvuH0iVAyKLOzo\"",
    "mtime": "2026-07-17T19:33:17.503Z",
    "size": 372762,
    "path": "../public/img/swatches/luna-pearl-1600.webp"
  },
  "/img/swatches/luna-pearl.avif": {
    "type": "image/avif",
    "etag": "\"1ff4d-WpZyOZXRqjl9tmSlWmn7bMDPOC0\"",
    "mtime": "2026-07-17T19:33:17.503Z",
    "size": 130893,
    "path": "../public/img/swatches/luna-pearl.avif"
  },
  "/img/swatches/luna-pearl.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"9a0-ATVqnXV7tNasJvpyMMmdl80qFPk\"",
    "mtime": "2026-07-17T19:33:17.627Z",
    "size": 2464,
    "path": "../public/img/swatches/luna-pearl.svg.gz"
  },
  "/img/swatches/marron-baltico.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3b83-bJbt7OgKMDRrTwVVdEkL7KM5Zlw\"",
    "mtime": "2026-07-17T19:33:17.503Z",
    "size": 15235,
    "path": "../public/img/swatches/marron-baltico.svg"
  },
  "/img/swatches/marron-baltico.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"7d0-DVVQWuszyFFGG/ju5jXaFotmjKc\"",
    "mtime": "2026-07-17T19:33:17.640Z",
    "size": 2000,
    "path": "../public/img/swatches/marron-baltico.svg.br"
  },
  "/img/swatches/marron-baltico.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"9c8-mtfZWOOFzRO6AQggUbSU7y+r0GU\"",
    "mtime": "2026-07-17T19:33:17.636Z",
    "size": 2504,
    "path": "../public/img/swatches/marron-baltico.svg.gz"
  },
  "/img/swatches/luna-pearl.webp": {
    "type": "image/webp",
    "etag": "\"31f7c-u+1laFiwOewsQZtxiFlH6KWuWME\"",
    "mtime": "2026-07-17T19:33:17.504Z",
    "size": 204668,
    "path": "../public/img/swatches/luna-pearl.webp"
  },
  "/img/swatches/negro-absoluto.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3b8f-8mBLss9Pnr4TJQBRfPnht96cdFM\"",
    "mtime": "2026-07-17T19:33:17.504Z",
    "size": 15247,
    "path": "../public/img/swatches/negro-absoluto.svg"
  },
  "/img/swatches/negro-absoluto.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"7cc-TblNqKFxkmJCWt35RaxB1Uwb7Fo\"",
    "mtime": "2026-07-17T19:33:17.647Z",
    "size": 1996,
    "path": "../public/img/swatches/negro-absoluto.svg.br"
  },
  "/img/swatches/negro-absoluto.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"9a0-ToSSpmgYC+RU7/BDsM3Ut4g/1Io\"",
    "mtime": "2026-07-17T19:33:17.636Z",
    "size": 2464,
    "path": "../public/img/swatches/negro-absoluto.svg.gz"
  },
  "/img/swatches/negro-marquina.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"174-8DqIyGJFFSjoXsiSuJTZ41Sb3/o\"",
    "mtime": "2026-07-17T19:33:17.636Z",
    "size": 372,
    "path": "../public/img/swatches/negro-marquina.svg.br"
  },
  "/img/swatches/negro-marquina.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"528-l4+AM8lvAJf0B1I9KcWA+kPy7cU\"",
    "mtime": "2026-07-17T19:33:17.503Z",
    "size": 1320,
    "path": "../public/img/swatches/negro-marquina.svg"
  },
  "/img/swatches/negro-marquina.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"1be-4g9P6M76eAamZDdPn5YxSuVQ3Ps\"",
    "mtime": "2026-07-17T19:33:17.636Z",
    "size": 446,
    "path": "../public/img/swatches/negro-marquina.svg.gz"
  },
  "/img/swatches/smithtown-1600.avif": {
    "type": "image/avif",
    "etag": "\"a1b2-lsIAsAzAs6a7yDVR0WMGSiN1VIs\"",
    "mtime": "2026-07-17T19:33:17.503Z",
    "size": 41394,
    "path": "../public/img/swatches/smithtown-1600.avif"
  },
  "/img/swatches/smithtown-1600.webp": {
    "type": "image/webp",
    "etag": "\"8d3e-fCL+9rA8T58rEAUKd4PTzpfrQCQ\"",
    "mtime": "2026-07-17T19:33:17.505Z",
    "size": 36158,
    "path": "../public/img/swatches/smithtown-1600.webp"
  },
  "/img/swatches/smithtown-480.avif": {
    "type": "image/avif",
    "etag": "\"2402-iF8mRGNOWsfwkkPYGTQXvdAWHnk\"",
    "mtime": "2026-07-17T19:33:17.505Z",
    "size": 9218,
    "path": "../public/img/swatches/smithtown-480.avif"
  },
  "/img/swatches/smithtown-480.webp": {
    "type": "image/webp",
    "etag": "\"1bfe-EsuKJYJGnolqXCJqzQtcfaTaavU\"",
    "mtime": "2026-07-17T19:33:17.505Z",
    "size": 7166,
    "path": "../public/img/swatches/smithtown-480.webp"
  },
  "/img/swatches/smithtown-960.avif": {
    "type": "image/avif",
    "etag": "\"58b8-N+43wPEc3ceeikY7FXlIaMLVGdE\"",
    "mtime": "2026-07-17T19:33:17.505Z",
    "size": 22712,
    "path": "../public/img/swatches/smithtown-960.avif"
  },
  "/img/swatches/smithtown-960.webp": {
    "type": "image/webp",
    "etag": "\"4938-Da4/C2txOdwYDkSueoEUihT0g1w\"",
    "mtime": "2026-07-17T19:33:17.504Z",
    "size": 18744,
    "path": "../public/img/swatches/smithtown-960.webp"
  },
  "/img/swatches/smithtown.avif": {
    "type": "image/avif",
    "etag": "\"58b8-N+43wPEc3ceeikY7FXlIaMLVGdE\"",
    "mtime": "2026-07-17T19:33:17.505Z",
    "size": 22712,
    "path": "../public/img/swatches/smithtown.avif"
  },
  "/img/swatches/smithtown.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"519-5OAH7yV6Vrhul3+7ns4EC20GKMk\"",
    "mtime": "2026-07-17T19:33:17.505Z",
    "size": 1305,
    "path": "../public/img/swatches/smithtown.svg"
  },
  "/img/swatches/smithtown.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"16c-X8RL03v+agqc8HBFbyc6pgoxCao\"",
    "mtime": "2026-07-17T19:33:17.640Z",
    "size": 364,
    "path": "../public/img/swatches/smithtown.svg.br"
  },
  "/img/swatches/smithtown.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"1bf-IqvkA6EnU42YrrcqCjr/agvdqCk\"",
    "mtime": "2026-07-17T19:33:17.640Z",
    "size": 447,
    "path": "../public/img/swatches/smithtown.svg.gz"
  },
  "/img/swatches/smithtown.webp": {
    "type": "image/webp",
    "etag": "\"4938-Da4/C2txOdwYDkSueoEUihT0g1w\"",
    "mtime": "2026-07-17T19:33:17.505Z",
    "size": 18744,
    "path": "../public/img/swatches/smithtown.webp"
  },
  "/img/swatches/verde-ubatuba.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3b8e-rXGMkgWdJsjuOch0m4XExwgy7X0\"",
    "mtime": "2026-07-17T19:33:17.505Z",
    "size": 15246,
    "path": "../public/img/swatches/verde-ubatuba.svg"
  },
  "/img/swatches/verde-ubatuba.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"7d1-3/RTHOnyV8ATzGrB16MSF7tRg2c\"",
    "mtime": "2026-07-17T19:33:17.660Z",
    "size": 2001,
    "path": "../public/img/swatches/verde-ubatuba.svg.br"
  },
  "/img/swatches/verde-ubatuba.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"9aa-5YcbGDd9wdiri7tNkJdD6MeJ4+0\"",
    "mtime": "2026-07-17T19:33:17.640Z",
    "size": 2474,
    "path": "../public/img/swatches/verde-ubatuba.svg.gz"
  },
  "/img/scenes/bano/blanco-carrara-1600.webp": {
    "type": "image/webp",
    "etag": "\"b6a2-09nG9CyUZ5VCm5GaSI6TLiPmLTU\"",
    "mtime": "2026-07-17T19:33:17.505Z",
    "size": 46754,
    "path": "../public/img/scenes/bano/blanco-carrara-1600.webp"
  },
  "/img/scenes/bano/blanco-carrara-1600.avif": {
    "type": "image/avif",
    "etag": "\"a786-sVfijrqCFErv02OaJKFaAOCvRZY\"",
    "mtime": "2026-07-17T19:33:17.505Z",
    "size": 42886,
    "path": "../public/img/scenes/bano/blanco-carrara-1600.avif"
  },
  "/img/scenes/bano/blanco-carrara-480.avif": {
    "type": "image/avif",
    "etag": "\"1bd1-jkRaJDZ5SnxctsA9TqHZ0CUITEc\"",
    "mtime": "2026-07-17T19:33:17.499Z",
    "size": 7121,
    "path": "../public/img/scenes/bano/blanco-carrara-480.avif"
  },
  "/img/scenes/bano/blanco-carrara-480.webp": {
    "type": "image/webp",
    "etag": "\"1d08-SVoqXDT/EK9ovRtvJr71K3zlP50\"",
    "mtime": "2026-07-17T19:33:17.505Z",
    "size": 7432,
    "path": "../public/img/scenes/bano/blanco-carrara-480.webp"
  },
  "/img/scenes/bano/blanco-carrara-960.avif": {
    "type": "image/avif",
    "etag": "\"4c19-loOIoFIRkAC8kPdo52DB9iUaAtQ\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 19481,
    "path": "../public/img/scenes/bano/blanco-carrara-960.avif"
  },
  "/img/scenes/bano/blanco-carrara-960.webp": {
    "type": "image/webp",
    "etag": "\"5088-CpYP4inMvgKG2zFxZlFF1HDaDzE\"",
    "mtime": "2026-07-17T19:33:17.505Z",
    "size": 20616,
    "path": "../public/img/scenes/bano/blanco-carrara-960.webp"
  },
  "/img/scenes/bano/blanco-carrara.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"807-wsFqgdfP2pzM1uvU61KSg/d+aQw\"",
    "mtime": "2026-07-17T19:33:17.505Z",
    "size": 2055,
    "path": "../public/img/scenes/bano/blanco-carrara.svg"
  },
  "/img/scenes/bano/blanco-carrara.avif": {
    "type": "image/avif",
    "etag": "\"4c19-loOIoFIRkAC8kPdo52DB9iUaAtQ\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 19481,
    "path": "../public/img/scenes/bano/blanco-carrara.avif"
  },
  "/img/scenes/bano/blanco-carrara.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"20f-718LhFfln/CPkbvnku6QZijVVIA\"",
    "mtime": "2026-07-17T19:33:17.642Z",
    "size": 527,
    "path": "../public/img/scenes/bano/blanco-carrara.svg.br"
  },
  "/img/scenes/bano/blanco-carrara.webp": {
    "type": "image/webp",
    "etag": "\"5088-CpYP4inMvgKG2zFxZlFF1HDaDzE\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 20616,
    "path": "../public/img/scenes/bano/blanco-carrara.webp"
  },
  "/img/scenes/bano/blanco-carrara.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"285-yFX1uZl3qoiPKA5xF0tpEpVbHn8\"",
    "mtime": "2026-07-17T19:33:17.642Z",
    "size": 645,
    "path": "../public/img/scenes/bano/blanco-carrara.svg.gz"
  },
  "/img/scenes/bano/blue-dunes-1600.avif": {
    "type": "image/avif",
    "etag": "\"12272-RaAVpxtDIkIv/IREmViarKfT6s0\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 74354,
    "path": "../public/img/scenes/bano/blue-dunes-1600.avif"
  },
  "/img/scenes/bano/blue-dunes-1600.webp": {
    "type": "image/webp",
    "etag": "\"15846-w+dNT4KLQGedHTrUL21/etD1WeY\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 88134,
    "path": "../public/img/scenes/bano/blue-dunes-1600.webp"
  },
  "/img/scenes/bano/blue-dunes-480.avif": {
    "type": "image/avif",
    "etag": "\"280b-EOabVWU4W8LhnvRyKshjzGTsLBw\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 10251,
    "path": "../public/img/scenes/bano/blue-dunes-480.avif"
  },
  "/img/scenes/bano/blue-dunes-480.webp": {
    "type": "image/webp",
    "etag": "\"2e92-QBGxHGrbAs+30I8qESBY3s8S1Oc\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 11922,
    "path": "../public/img/scenes/bano/blue-dunes-480.webp"
  },
  "/img/scenes/bano/blue-dunes-960.webp": {
    "type": "image/webp",
    "etag": "\"9df2-BBlhG62h05BKWScW5PK+o7FyRbw\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 40434,
    "path": "../public/img/scenes/bano/blue-dunes-960.webp"
  },
  "/img/scenes/bano/blue-dunes.avif": {
    "type": "image/avif",
    "etag": "\"85c6-1O1CP4RqbfjTCj2N+Jxf6yBd+nI\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 34246,
    "path": "../public/img/scenes/bano/blue-dunes.avif"
  },
  "/img/scenes/bano/blue-dunes.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3e25-xSaOZ5F2Np9yxv4Fys793qJ+5Qg\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 15909,
    "path": "../public/img/scenes/bano/blue-dunes.svg"
  },
  "/img/scenes/bano/blue-dunes-960.avif": {
    "type": "image/avif",
    "etag": "\"85c6-1O1CP4RqbfjTCj2N+Jxf6yBd+nI\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 34246,
    "path": "../public/img/scenes/bano/blue-dunes-960.avif"
  },
  "/img/scenes/bano/blue-dunes.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"8c2-qyIrC2eOARkz4BJrVbGPyKBcGko\"",
    "mtime": "2026-07-17T19:33:17.661Z",
    "size": 2242,
    "path": "../public/img/scenes/bano/blue-dunes.svg.br"
  },
  "/img/scenes/bano/blue-dunes.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"aa0-jcD++pnxSL1cqbVm5ftqtcR5K4M\"",
    "mtime": "2026-07-17T19:33:17.645Z",
    "size": 2720,
    "path": "../public/img/scenes/bano/blue-dunes.svg.gz"
  },
  "/img/scenes/bano/blue-dunes.webp": {
    "type": "image/webp",
    "etag": "\"9df2-BBlhG62h05BKWScW5PK+o7FyRbw\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 40434,
    "path": "../public/img/scenes/bano/blue-dunes.webp"
  },
  "/img/scenes/bano/calacatta-oro-1600.avif": {
    "type": "image/avif",
    "etag": "\"9ff6-FF4JDxwJfhEINF413y4VSL8h9p4\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 40950,
    "path": "../public/img/scenes/bano/calacatta-oro-1600.avif"
  },
  "/img/scenes/bano/calacatta-oro-1600.webp": {
    "type": "image/webp",
    "etag": "\"a36e-C8x1QM4oXSghTv1h6ZAzbE8eRaA\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 41838,
    "path": "../public/img/scenes/bano/calacatta-oro-1600.webp"
  },
  "/img/scenes/bano/calacatta-oro-480.avif": {
    "type": "image/avif",
    "etag": "\"1bf9-45qL8PvQV4FkHUzVcLgA7fObbY0\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 7161,
    "path": "../public/img/scenes/bano/calacatta-oro-480.avif"
  },
  "/img/scenes/bano/calacatta-oro-960.avif": {
    "type": "image/avif",
    "etag": "\"4c17-YUKG0Zft23xCNNTaDV+lhfah7Lo\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 19479,
    "path": "../public/img/scenes/bano/calacatta-oro-960.avif"
  },
  "/img/scenes/bano/calacatta-oro.avif": {
    "type": "image/avif",
    "etag": "\"4c17-YUKG0Zft23xCNNTaDV+lhfah7Lo\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 19479,
    "path": "../public/img/scenes/bano/calacatta-oro.avif"
  },
  "/img/scenes/bano/calacatta-oro-960.webp": {
    "type": "image/webp",
    "etag": "\"4ad6-gyy80MREQO7Ovzo/e6s69+peKRI\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 19158,
    "path": "../public/img/scenes/bano/calacatta-oro-960.webp"
  },
  "/img/scenes/bano/calacatta-oro-480.webp": {
    "type": "image/webp",
    "etag": "\"1b16-LWr+OVg9KDpefjb35viVfWdcCEI\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 6934,
    "path": "../public/img/scenes/bano/calacatta-oro-480.webp"
  },
  "/img/scenes/bano/calacatta-oro.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"7f0-/Pu6+h3ODus7N/NtdHE6KFN+oMQ\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 2032,
    "path": "../public/img/scenes/bano/calacatta-oro.svg"
  },
  "/img/scenes/bano/calacatta-oro.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"21f-lt8kNfxawW5Uoio1VIWX/MaeveI\"",
    "mtime": "2026-07-17T19:33:17.647Z",
    "size": 543,
    "path": "../public/img/scenes/bano/calacatta-oro.svg.br"
  },
  "/img/scenes/bano/calacatta-oro.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"28b-vS1Rdiaksla524CLLoxtQif29M4\"",
    "mtime": "2026-07-17T19:33:17.647Z",
    "size": 651,
    "path": "../public/img/scenes/bano/calacatta-oro.svg.gz"
  },
  "/img/scenes/bano/gris-niebla.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"7e3-aJKqHlqkhyrpZopU0/g0vjvx9PM\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 2019,
    "path": "../public/img/scenes/bano/gris-niebla.svg"
  },
  "/img/scenes/bano/calacatta-oro.webp": {
    "type": "image/webp",
    "etag": "\"4ad6-gyy80MREQO7Ovzo/e6s69+peKRI\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 19158,
    "path": "../public/img/scenes/bano/calacatta-oro.webp"
  },
  "/img/scenes/bano/gris-niebla.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"28d-JFUyAGYLQHbgEGDY67U6FHajW6A\"",
    "mtime": "2026-07-17T19:33:17.647Z",
    "size": 653,
    "path": "../public/img/scenes/bano/gris-niebla.svg.gz"
  },
  "/img/scenes/bano/gris-perla.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3e38-waEDimcN52RqlngV2QxYRCu05mU\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 15928,
    "path": "../public/img/scenes/bano/gris-perla.svg"
  },
  "/img/scenes/bano/gris-niebla.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"223-Kob9Wc4kmb93XB+VB0LgpqFeg/4\"",
    "mtime": "2026-07-17T19:33:17.647Z",
    "size": 547,
    "path": "../public/img/scenes/bano/gris-niebla.svg.br"
  },
  "/img/scenes/bano/gris-perla.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"8cc-t9Fj1D7aOQsvKmM0h5XF+sQkdyM\"",
    "mtime": "2026-07-17T19:33:17.661Z",
    "size": 2252,
    "path": "../public/img/scenes/bano/gris-perla.svg.br"
  },
  "/img/scenes/bano/gris-perla.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a98-VyxUDct9LZA94HU6ENPlhae6774\"",
    "mtime": "2026-07-17T19:33:17.647Z",
    "size": 2712,
    "path": "../public/img/scenes/bano/gris-perla.svg.gz"
  },
  "/img/scenes/bano/luna-pearl-1600.avif": {
    "type": "image/avif",
    "etag": "\"14aa0-LgVLshDLcL41wq9ylD0TOFq809U\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 84640,
    "path": "../public/img/scenes/bano/luna-pearl-1600.avif"
  },
  "/img/scenes/bano/luna-pearl-1600.webp": {
    "type": "image/webp",
    "etag": "\"1aef4-f8ZKq0eaDI4FJ0JYh5+ZRFb2dyg\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 110324,
    "path": "../public/img/scenes/bano/luna-pearl-1600.webp"
  },
  "/img/scenes/bano/luna-pearl-480.avif": {
    "type": "image/avif",
    "etag": "\"2e0c-+qcixwoY0M8Xxe9DAV+vkVl9mlw\"",
    "mtime": "2026-07-17T19:33:17.506Z",
    "size": 11788,
    "path": "../public/img/scenes/bano/luna-pearl-480.avif"
  },
  "/img/scenes/bano/luna-pearl-960.avif": {
    "type": "image/avif",
    "etag": "\"9c47-aXsHUjNbie/p8stH2/2eduppcWA\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 40007,
    "path": "../public/img/scenes/bano/luna-pearl-960.avif"
  },
  "/img/scenes/bano/luna-pearl-960.webp": {
    "type": "image/webp",
    "etag": "\"b45a-ZbM61oeuI+/s/fyCfh8G9demjPo\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 46170,
    "path": "../public/img/scenes/bano/luna-pearl-960.webp"
  },
  "/img/scenes/bano/luna-pearl-480.webp": {
    "type": "image/webp",
    "etag": "\"3200-QYdBtUaD8ehulqvm3hRyofXFgz0\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 12800,
    "path": "../public/img/scenes/bano/luna-pearl-480.webp"
  },
  "/img/scenes/bano/luna-pearl.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3e23-AoiVKuHJKho05i08aZ5FcLA1fvk\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 15907,
    "path": "../public/img/scenes/bano/luna-pearl.svg"
  },
  "/img/scenes/bano/luna-pearl.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"89b-k5Osh4+fNaEKPtphmfdwaZ80srE\"",
    "mtime": "2026-07-17T19:33:17.661Z",
    "size": 2203,
    "path": "../public/img/scenes/bano/luna-pearl.svg.br"
  },
  "/img/scenes/bano/luna-pearl.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a9b-00dsAfExcanneaZSYzr97duY/yo\"",
    "mtime": "2026-07-17T19:33:17.660Z",
    "size": 2715,
    "path": "../public/img/scenes/bano/luna-pearl.svg.gz"
  },
  "/img/scenes/bano/marron-baltico.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3e34-odgiD2/IKgPYvItIfXebP2zP6rY\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 15924,
    "path": "../public/img/scenes/bano/marron-baltico.svg"
  },
  "/img/scenes/bano/luna-pearl.avif": {
    "type": "image/avif",
    "etag": "\"9c47-aXsHUjNbie/p8stH2/2eduppcWA\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 40007,
    "path": "../public/img/scenes/bano/luna-pearl.avif"
  },
  "/img/scenes/bano/luna-pearl.webp": {
    "type": "image/webp",
    "etag": "\"b45a-ZbM61oeuI+/s/fyCfh8G9demjPo\"",
    "mtime": "2026-07-17T19:33:17.508Z",
    "size": 46170,
    "path": "../public/img/scenes/bano/luna-pearl.webp"
  },
  "/img/scenes/bano/marron-baltico.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a85-lQhw0TfJwfBVBg2XFdVPpy3+HHE\"",
    "mtime": "2026-07-17T19:33:17.661Z",
    "size": 2693,
    "path": "../public/img/scenes/bano/marron-baltico.svg.gz"
  },
  "/img/scenes/bano/negro-absoluto.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3e3e-DDvidaIgzuQPjT0a1xYRG1Aq2HQ\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 15934,
    "path": "../public/img/scenes/bano/negro-absoluto.svg"
  },
  "/img/scenes/bano/negro-absoluto.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"8a1-bvHGcDlf4TcrKspofjPHbk4F0RU\"",
    "mtime": "2026-07-17T19:33:17.669Z",
    "size": 2209,
    "path": "../public/img/scenes/bano/negro-absoluto.svg.br"
  },
  "/img/scenes/bano/negro-absoluto.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a89-3lxzTRf4pTcVJBDVQXn/cGshDCM\"",
    "mtime": "2026-07-17T19:33:17.661Z",
    "size": 2697,
    "path": "../public/img/scenes/bano/negro-absoluto.svg.gz"
  },
  "/img/scenes/bano/negro-marquina.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"7ec-x+y1+ii7o+deRPpDOwdv8MxjJ5Y\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 2028,
    "path": "../public/img/scenes/bano/negro-marquina.svg"
  },
  "/img/scenes/bano/negro-marquina.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"228-7QAZjZkZ/Y47qa4BGtLJ4+EJ2NE\"",
    "mtime": "2026-07-17T19:33:17.663Z",
    "size": 552,
    "path": "../public/img/scenes/bano/negro-marquina.svg.br"
  },
  "/img/scenes/bano/smithtown-1600.avif": {
    "type": "image/avif",
    "etag": "\"b4bd-nYrqq1r0Oj8cUkluqfhQ3O88Yqg\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 46269,
    "path": "../public/img/scenes/bano/smithtown-1600.avif"
  },
  "/img/scenes/bano/negro-marquina.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"28b-fvu7PgmmqwgwIkMn7YB5XMYg9pw\"",
    "mtime": "2026-07-17T19:33:17.661Z",
    "size": 651,
    "path": "../public/img/scenes/bano/negro-marquina.svg.gz"
  },
  "/img/scenes/bano/smithtown-480.avif": {
    "type": "image/avif",
    "etag": "\"1e8a-7J3SRb6y/ldJJJ928tCSYmtG3ms\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 7818,
    "path": "../public/img/scenes/bano/smithtown-480.avif"
  },
  "/img/scenes/bano/smithtown-1600.webp": {
    "type": "image/webp",
    "etag": "\"cab4-vAiwJU02In2dyhBAazoY5FT5kmI\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 51892,
    "path": "../public/img/scenes/bano/smithtown-1600.webp"
  },
  "/img/scenes/bano/marron-baltico.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"8c6-N0kvsBhgr51orPOlahqLhXwTfJk\"",
    "mtime": "2026-07-17T19:33:17.663Z",
    "size": 2246,
    "path": "../public/img/scenes/bano/marron-baltico.svg.br"
  },
  "/img/scenes/bano/smithtown-960.avif": {
    "type": "image/avif",
    "etag": "\"549c-Uv/9v0ee2YNmZ+SMMCs1fIwLTys\"",
    "mtime": "2026-07-17T19:33:17.508Z",
    "size": 21660,
    "path": "../public/img/scenes/bano/smithtown-960.avif"
  },
  "/img/scenes/bano/smithtown-480.webp": {
    "type": "image/webp",
    "etag": "\"1fa4-IEHZ9WASIAEO9LOKM1AbZu9q/wQ\"",
    "mtime": "2026-07-17T19:33:17.508Z",
    "size": 8100,
    "path": "../public/img/scenes/bano/smithtown-480.webp"
  },
  "/img/scenes/bano/smithtown-960.webp": {
    "type": "image/webp",
    "etag": "\"5b20-5+zU2yDON105YYaXY8gDCFV2qYk\"",
    "mtime": "2026-07-17T19:33:17.507Z",
    "size": 23328,
    "path": "../public/img/scenes/bano/smithtown-960.webp"
  },
  "/img/scenes/bano/smithtown.avif": {
    "type": "image/avif",
    "etag": "\"549c-Uv/9v0ee2YNmZ+SMMCs1fIwLTys\"",
    "mtime": "2026-07-17T19:33:17.508Z",
    "size": 21660,
    "path": "../public/img/scenes/bano/smithtown.avif"
  },
  "/img/scenes/bano/smithtown.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"215-LKUjGQJu6/l0rx/6rdKi/FvAFyo\"",
    "mtime": "2026-07-17T19:33:17.664Z",
    "size": 533,
    "path": "../public/img/scenes/bano/smithtown.svg.br"
  },
  "/img/scenes/bano/smithtown.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"7dc-JllxwqpGOKspe/x9QsRPuO+E7/o\"",
    "mtime": "2026-07-17T19:33:17.508Z",
    "size": 2012,
    "path": "../public/img/scenes/bano/smithtown.svg"
  },
  "/img/scenes/bano/smithtown.webp": {
    "type": "image/webp",
    "etag": "\"5b20-5+zU2yDON105YYaXY8gDCFV2qYk\"",
    "mtime": "2026-07-17T19:33:17.508Z",
    "size": 23328,
    "path": "../public/img/scenes/bano/smithtown.webp"
  },
  "/img/scenes/bano/smithtown.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"28a-dQT0dt7BKU9kc+HGAAM52WN84y8\"",
    "mtime": "2026-07-17T19:33:17.663Z",
    "size": 650,
    "path": "../public/img/scenes/bano/smithtown.svg.gz"
  },
  "/img/scenes/bano/verde-ubatuba.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3e3b-KztxqsWFIgkPLLbXdhHAgnr5D/Y\"",
    "mtime": "2026-07-17T19:33:17.508Z",
    "size": 15931,
    "path": "../public/img/scenes/bano/verde-ubatuba.svg"
  },
  "/img/scenes/bano/verde-ubatuba.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"8b3-zxGPq3BeOQWn8Wdk6HuGhYvO1mc\"",
    "mtime": "2026-07-17T19:33:17.677Z",
    "size": 2227,
    "path": "../public/img/scenes/bano/verde-ubatuba.svg.br"
  },
  "/img/scenes/bano/verde-ubatuba.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a8e-s2Nsx11c+XXWXRFTpIFN0rG+bBs\"",
    "mtime": "2026-07-17T19:33:17.663Z",
    "size": 2702,
    "path": "../public/img/scenes/bano/verde-ubatuba.svg.gz"
  },
  "/img/scenes/barra/blanco-carrara-1600.avif": {
    "type": "image/avif",
    "etag": "\"d741-pP4PN2Jh38KfF0p8BzbX9N63xGw\"",
    "mtime": "2026-07-17T19:33:17.501Z",
    "size": 55105,
    "path": "../public/img/scenes/barra/blanco-carrara-1600.avif"
  },
  "/img/scenes/barra/blanco-carrara-1600.webp": {
    "type": "image/webp",
    "etag": "\"ed96-8Bm0P2k6ggx0sUDWUL7jlqZKTlo\"",
    "mtime": "2026-07-17T19:33:17.516Z",
    "size": 60822,
    "path": "../public/img/scenes/barra/blanco-carrara-1600.webp"
  },
  "/img/scenes/barra/blanco-carrara-480.avif": {
    "type": "image/avif",
    "etag": "\"24f6-MZ4iSI+z3qxOMp29eqgWskRD/RM\"",
    "mtime": "2026-07-17T19:33:17.515Z",
    "size": 9462,
    "path": "../public/img/scenes/barra/blanco-carrara-480.avif"
  },
  "/img/scenes/barra/blanco-carrara-480.webp": {
    "type": "image/webp",
    "etag": "\"28da-AfdpsOjOiA1Dh5NzXA7Rb6cicQA\"",
    "mtime": "2026-07-17T19:33:17.516Z",
    "size": 10458,
    "path": "../public/img/scenes/barra/blanco-carrara-480.webp"
  },
  "/img/scenes/barra/blanco-carrara-960.webp": {
    "type": "image/webp",
    "etag": "\"71de-RW0oCx1eofieEQAxMJ7foyxHFNs\"",
    "mtime": "2026-07-17T19:33:17.516Z",
    "size": 29150,
    "path": "../public/img/scenes/barra/blanco-carrara-960.webp"
  },
  "/img/scenes/barra/blanco-carrara-960.avif": {
    "type": "image/avif",
    "etag": "\"6878-Eb2gqq9m/8cfXDU96Z988q15Rc0\"",
    "mtime": "2026-07-17T19:33:17.516Z",
    "size": 26744,
    "path": "../public/img/scenes/barra/blanco-carrara-960.avif"
  },
  "/img/scenes/barra/blanco-carrara.avif": {
    "type": "image/avif",
    "etag": "\"6878-Eb2gqq9m/8cfXDU96Z988q15Rc0\"",
    "mtime": "2026-07-17T19:33:17.516Z",
    "size": 26744,
    "path": "../public/img/scenes/barra/blanco-carrara.avif"
  },
  "/img/scenes/barra/blanco-carrara.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"789-89+0kVppuMiQpQ0VP8wytmuG7jg\"",
    "mtime": "2026-07-17T19:33:17.516Z",
    "size": 1929,
    "path": "../public/img/scenes/barra/blanco-carrara.svg"
  },
  "/img/scenes/barra/blanco-carrara.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"1d7-ZOTCv6XIwav+NxIdqV+MdvbHDeY\"",
    "mtime": "2026-07-17T19:33:17.666Z",
    "size": 471,
    "path": "../public/img/scenes/barra/blanco-carrara.svg.br"
  },
  "/img/scenes/barra/blanco-carrara.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"24c-kuOMFjyddL44GlVPyFm+dBh1XYo\"",
    "mtime": "2026-07-17T19:33:17.664Z",
    "size": 588,
    "path": "../public/img/scenes/barra/blanco-carrara.svg.gz"
  },
  "/img/scenes/barra/blanco-carrara.webp": {
    "type": "image/webp",
    "etag": "\"71de-RW0oCx1eofieEQAxMJ7foyxHFNs\"",
    "mtime": "2026-07-17T19:33:17.516Z",
    "size": 29150,
    "path": "../public/img/scenes/barra/blanco-carrara.webp"
  },
  "/img/scenes/barra/blue-dunes-1600.avif": {
    "type": "image/avif",
    "etag": "\"1a53f-pvXixS8MelCKunU06pkDzsSTQ98\"",
    "mtime": "2026-07-17T19:33:17.517Z",
    "size": 107839,
    "path": "../public/img/scenes/barra/blue-dunes-1600.avif"
  },
  "/img/scenes/barra/blue-dunes-1600.webp": {
    "type": "image/webp",
    "etag": "\"21516-xYI1SxiJMUI7tU0piIzNo7VJB5I\"",
    "mtime": "2026-07-17T19:33:17.517Z",
    "size": 136470,
    "path": "../public/img/scenes/barra/blue-dunes-1600.webp"
  },
  "/img/scenes/barra/blue-dunes-480.avif": {
    "type": "image/avif",
    "etag": "\"374f-R/29wzm6BiepndQ1wJfPdgqIyZo\"",
    "mtime": "2026-07-17T19:33:17.516Z",
    "size": 14159,
    "path": "../public/img/scenes/barra/blue-dunes-480.avif"
  },
  "/img/scenes/barra/blue-dunes-480.webp": {
    "type": "image/webp",
    "etag": "\"41ba-xAMPie37xYa2ZfvQ2iAmyU4w6D0\"",
    "mtime": "2026-07-17T19:33:17.516Z",
    "size": 16826,
    "path": "../public/img/scenes/barra/blue-dunes-480.webp"
  },
  "/img/scenes/barra/blue-dunes-960.avif": {
    "type": "image/avif",
    "etag": "\"c6d4-o/VJKmP7X7H0TIoWyMXoNI8L4Jg\"",
    "mtime": "2026-07-17T19:33:17.517Z",
    "size": 50900,
    "path": "../public/img/scenes/barra/blue-dunes-960.avif"
  },
  "/img/scenes/barra/blue-dunes-960.webp": {
    "type": "image/webp",
    "etag": "\"ea8a-TwB/9J7DydqfWU3pftdtT+oB/WI\"",
    "mtime": "2026-07-17T19:33:17.517Z",
    "size": 60042,
    "path": "../public/img/scenes/barra/blue-dunes-960.webp"
  },
  "/img/scenes/barra/blue-dunes.avif": {
    "type": "image/avif",
    "etag": "\"c6d4-o/VJKmP7X7H0TIoWyMXoNI8L4Jg\"",
    "mtime": "2026-07-17T19:33:17.517Z",
    "size": 50900,
    "path": "../public/img/scenes/barra/blue-dunes.avif"
  },
  "/img/scenes/barra/blue-dunes.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3dab-OwcF3mgznBpPdwDRqXmkm7h4C2k\"",
    "mtime": "2026-07-17T19:33:17.517Z",
    "size": 15787,
    "path": "../public/img/scenes/barra/blue-dunes.svg"
  },
  "/img/scenes/barra/blue-dunes.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"892-BBVzmlO9sXLplVIZu013t9vjiqs\"",
    "mtime": "2026-07-17T19:33:17.682Z",
    "size": 2194,
    "path": "../public/img/scenes/barra/blue-dunes.svg.br"
  },
  "/img/scenes/barra/blue-dunes.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a6b-zuI0/yN60uFpWua2J13B9rkgggI\"",
    "mtime": "2026-07-17T19:33:17.666Z",
    "size": 2667,
    "path": "../public/img/scenes/barra/blue-dunes.svg.gz"
  },
  "/img/scenes/barra/blue-dunes.webp": {
    "type": "image/webp",
    "etag": "\"ea8a-TwB/9J7DydqfWU3pftdtT+oB/WI\"",
    "mtime": "2026-07-17T19:33:17.517Z",
    "size": 60042,
    "path": "../public/img/scenes/barra/blue-dunes.webp"
  },
  "/img/scenes/barra/calacatta-oro-1600.avif": {
    "type": "image/avif",
    "etag": "\"d040-Q9ijZpR0cfqIpcaRplwJqoSMr8c\"",
    "mtime": "2026-07-17T19:33:17.517Z",
    "size": 53312,
    "path": "../public/img/scenes/barra/calacatta-oro-1600.avif"
  },
  "/img/scenes/barra/calacatta-oro-1600.webp": {
    "type": "image/webp",
    "etag": "\"e5ba-2+JHRwXI1ssTokyGWtpYLf+T1Ag\"",
    "mtime": "2026-07-17T19:33:17.517Z",
    "size": 58810,
    "path": "../public/img/scenes/barra/calacatta-oro-1600.webp"
  },
  "/img/scenes/barra/calacatta-oro-480.avif": {
    "type": "image/avif",
    "etag": "\"24ed-0ddEFjZideuvs5H1GLzQo3munjs\"",
    "mtime": "2026-07-17T19:33:17.517Z",
    "size": 9453,
    "path": "../public/img/scenes/barra/calacatta-oro-480.avif"
  },
  "/img/scenes/barra/calacatta-oro-480.webp": {
    "type": "image/webp",
    "etag": "\"289e-S9GNYLepjNU3yUyoPAEmCofY1i0\"",
    "mtime": "2026-07-17T19:33:17.517Z",
    "size": 10398,
    "path": "../public/img/scenes/barra/calacatta-oro-480.webp"
  },
  "/img/scenes/barra/calacatta-oro-960.avif": {
    "type": "image/avif",
    "etag": "\"693a-9RIlKaYa5CdoTKwAdv6c5QRYdvU\"",
    "mtime": "2026-07-17T19:33:17.517Z",
    "size": 26938,
    "path": "../public/img/scenes/barra/calacatta-oro-960.avif"
  },
  "/img/scenes/barra/calacatta-oro-960.webp": {
    "type": "image/webp",
    "etag": "\"701a-IgdWfkO46G4NZJKmYoeCLytpIaw\"",
    "mtime": "2026-07-17T19:33:17.518Z",
    "size": 28698,
    "path": "../public/img/scenes/barra/calacatta-oro-960.webp"
  },
  "/img/scenes/barra/calacatta-oro.avif": {
    "type": "image/avif",
    "etag": "\"693a-9RIlKaYa5CdoTKwAdv6c5QRYdvU\"",
    "mtime": "2026-07-17T19:33:17.518Z",
    "size": 26938,
    "path": "../public/img/scenes/barra/calacatta-oro.avif"
  },
  "/img/scenes/barra/calacatta-oro.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"773-aLyrQIh/VNE6l2OPsiXzxi7wJ5U\"",
    "mtime": "2026-07-17T19:33:17.518Z",
    "size": 1907,
    "path": "../public/img/scenes/barra/calacatta-oro.svg"
  },
  "/img/scenes/barra/calacatta-oro.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"1e2-HpHLPWj6pApDgbnO3AJcI5D692s\"",
    "mtime": "2026-07-17T19:33:17.668Z",
    "size": 482,
    "path": "../public/img/scenes/barra/calacatta-oro.svg.br"
  },
  "/img/scenes/barra/calacatta-oro.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"253-0rjFmyfB1CwSjPA3oXDa6wpbcoM\"",
    "mtime": "2026-07-17T19:33:17.668Z",
    "size": 595,
    "path": "../public/img/scenes/barra/calacatta-oro.svg.gz"
  },
  "/img/scenes/barra/calacatta-oro.webp": {
    "type": "image/webp",
    "etag": "\"701a-IgdWfkO46G4NZJKmYoeCLytpIaw\"",
    "mtime": "2026-07-17T19:33:17.518Z",
    "size": 28698,
    "path": "../public/img/scenes/barra/calacatta-oro.webp"
  },
  "/img/scenes/barra/gris-niebla.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"768-JSI8ycORaC0XI5Cv7JzkDRTlf28\"",
    "mtime": "2026-07-17T19:33:17.518Z",
    "size": 1896,
    "path": "../public/img/scenes/barra/gris-niebla.svg"
  },
  "/img/scenes/barra/gris-niebla.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"1e4-IVwvG/6HWmBjDc4mNzGJY5MWJbs\"",
    "mtime": "2026-07-17T19:33:17.670Z",
    "size": 484,
    "path": "../public/img/scenes/barra/gris-niebla.svg.br"
  },
  "/img/scenes/barra/gris-niebla.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"258-840JbHsXrBMEgBMcV5WUjy6FPY0\"",
    "mtime": "2026-07-17T19:33:17.669Z",
    "size": 600,
    "path": "../public/img/scenes/barra/gris-niebla.svg.gz"
  },
  "/img/scenes/barra/gris-perla.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3dbe-2o0RPbOyc++zr27vRRV/EslxoIA\"",
    "mtime": "2026-07-17T19:33:17.517Z",
    "size": 15806,
    "path": "../public/img/scenes/barra/gris-perla.svg"
  },
  "/img/scenes/barra/gris-perla.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"896-jhBmiH07oq6qNsqYTXHp0xVzfIE\"",
    "mtime": "2026-07-17T19:33:17.682Z",
    "size": 2198,
    "path": "../public/img/scenes/barra/gris-perla.svg.br"
  },
  "/img/scenes/barra/gris-perla.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a65-B7QyFZYqw1oI9bKRfR3YNn08mnY\"",
    "mtime": "2026-07-17T19:33:17.670Z",
    "size": 2661,
    "path": "../public/img/scenes/barra/gris-perla.svg.gz"
  },
  "/img/scenes/barra/luna-pearl-1600.avif": {
    "type": "image/avif",
    "etag": "\"1d71b-rWAHtEO7Mob+ga32WIiHUI+ppGA\"",
    "mtime": "2026-07-17T19:33:17.519Z",
    "size": 120603,
    "path": "../public/img/scenes/barra/luna-pearl-1600.avif"
  },
  "/img/scenes/barra/luna-pearl-1600.webp": {
    "type": "image/webp",
    "etag": "\"27676-KsMpJbbuG7BUhy+3uGFqT/Vk9n4\"",
    "mtime": "2026-07-17T19:33:17.518Z",
    "size": 161398,
    "path": "../public/img/scenes/barra/luna-pearl-1600.webp"
  },
  "/img/scenes/barra/luna-pearl-480.avif": {
    "type": "image/avif",
    "etag": "\"3b6e-v4qu+NtG4dWXCwwRRdZDTDx5nxU\"",
    "mtime": "2026-07-17T19:33:17.518Z",
    "size": 15214,
    "path": "../public/img/scenes/barra/luna-pearl-480.avif"
  },
  "/img/scenes/barra/luna-pearl-480.webp": {
    "type": "image/webp",
    "etag": "\"4948-0MXaDaqf8cjnfOz3Pvg7U7FlqRg\"",
    "mtime": "2026-07-17T19:33:17.518Z",
    "size": 18760,
    "path": "../public/img/scenes/barra/luna-pearl-480.webp"
  },
  "/img/scenes/barra/luna-pearl-960.webp": {
    "type": "image/webp",
    "etag": "\"115b0-34y2djqJrfUJ3NlE2QOBwxCkxd4\"",
    "mtime": "2026-07-17T19:33:17.518Z",
    "size": 71088,
    "path": "../public/img/scenes/barra/luna-pearl-960.webp"
  },
  "/img/scenes/barra/luna-pearl-960.avif": {
    "type": "image/avif",
    "etag": "\"da5f-sNyYHoixc6OGv+vj+z2LaX8aQMI\"",
    "mtime": "2026-07-17T19:33:17.519Z",
    "size": 55903,
    "path": "../public/img/scenes/barra/luna-pearl-960.avif"
  },
  "/img/scenes/barra/luna-pearl.avif": {
    "type": "image/avif",
    "etag": "\"da5f-sNyYHoixc6OGv+vj+z2LaX8aQMI\"",
    "mtime": "2026-07-17T19:33:17.518Z",
    "size": 55903,
    "path": "../public/img/scenes/barra/luna-pearl.avif"
  },
  "/img/scenes/barra/luna-pearl.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3da9-OHk4ODw+hxA4h2VbeR04ojmuSPk\"",
    "mtime": "2026-07-17T19:33:17.519Z",
    "size": 15785,
    "path": "../public/img/scenes/barra/luna-pearl.svg"
  },
  "/img/scenes/barra/luna-pearl.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"87a-uvT5TTDYfXtG4oXp74IaG0Lbk90\"",
    "mtime": "2026-07-17T19:33:17.682Z",
    "size": 2170,
    "path": "../public/img/scenes/barra/luna-pearl.svg.br"
  },
  "/img/scenes/barra/luna-pearl.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a67-h7gjGPlYxvsiuHGWewPNLVNwju4\"",
    "mtime": "2026-07-17T19:33:17.677Z",
    "size": 2663,
    "path": "../public/img/scenes/barra/luna-pearl.svg.gz"
  },
  "/img/scenes/barra/luna-pearl.webp": {
    "type": "image/webp",
    "etag": "\"115b0-34y2djqJrfUJ3NlE2QOBwxCkxd4\"",
    "mtime": "2026-07-17T19:33:17.518Z",
    "size": 71088,
    "path": "../public/img/scenes/barra/luna-pearl.webp"
  },
  "/img/scenes/barra/marron-baltico.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3db6-7YvbRP9hBtcf6p7wohiKazGlcGI\"",
    "mtime": "2026-07-17T19:33:17.519Z",
    "size": 15798,
    "path": "../public/img/scenes/barra/marron-baltico.svg"
  },
  "/img/scenes/barra/marron-baltico.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"892-KBG25FhAq7GGff2sxkXwYDOmIyA\"",
    "mtime": "2026-07-17T19:33:17.688Z",
    "size": 2194,
    "path": "../public/img/scenes/barra/marron-baltico.svg.br"
  },
  "/img/scenes/barra/negro-absoluto.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3dc0-WRbYtS1vSfjmB/pfDzC/8HgSuIE\"",
    "mtime": "2026-07-17T19:33:17.518Z",
    "size": 15808,
    "path": "../public/img/scenes/barra/negro-absoluto.svg"
  },
  "/img/scenes/barra/marron-baltico.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a4f-BRnDq+P0a3x3lWoikVkwSPRbcPA\"",
    "mtime": "2026-07-17T19:33:17.682Z",
    "size": 2639,
    "path": "../public/img/scenes/barra/marron-baltico.svg.gz"
  },
  "/img/scenes/barra/negro-absoluto.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"86b-eDz1NF1RWmS4vLWJppi20IFw/fM\"",
    "mtime": "2026-07-17T19:33:17.691Z",
    "size": 2155,
    "path": "../public/img/scenes/barra/negro-absoluto.svg.br"
  },
  "/img/scenes/barra/negro-absoluto.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a50-ngfpDKfagO3EtUXcrw7+zffkkEs\"",
    "mtime": "2026-07-17T19:33:17.682Z",
    "size": 2640,
    "path": "../public/img/scenes/barra/negro-absoluto.svg.gz"
  },
  "/img/scenes/barra/negro-marquina.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"1ea-zOvtY7bGoBPjMdh9yPK4kJ0M81Y\"",
    "mtime": "2026-07-17T19:33:17.685Z",
    "size": 490,
    "path": "../public/img/scenes/barra/negro-marquina.svg.br"
  },
  "/img/scenes/barra/negro-marquina.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"76e-lwfWZD+NxTONlG5rmBwzUIoEWhs\"",
    "mtime": "2026-07-17T19:33:17.519Z",
    "size": 1902,
    "path": "../public/img/scenes/barra/negro-marquina.svg"
  },
  "/img/scenes/barra/negro-marquina.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"257-wOuj/ac56P3HMaXtO0cN+/veORg\"",
    "mtime": "2026-07-17T19:33:17.682Z",
    "size": 599,
    "path": "../public/img/scenes/barra/negro-marquina.svg.gz"
  },
  "/img/scenes/barra/smithtown-1600.avif": {
    "type": "image/avif",
    "etag": "\"ec26-Ii/LGTnVcciFmeET0HFQ6u0XHSM\"",
    "mtime": "2026-07-17T19:33:17.519Z",
    "size": 60454,
    "path": "../public/img/scenes/barra/smithtown-1600.avif"
  },
  "/img/scenes/barra/smithtown-1600.webp": {
    "type": "image/webp",
    "etag": "\"f862-konb1Q1SCNw6gpaExk+cmlIbFSQ\"",
    "mtime": "2026-07-17T19:33:17.519Z",
    "size": 63586,
    "path": "../public/img/scenes/barra/smithtown-1600.webp"
  },
  "/img/scenes/barra/smithtown-480.avif": {
    "type": "image/avif",
    "etag": "\"297b-Al8XP2Mc9nOMZBMTvDIiJTtHIMo\"",
    "mtime": "2026-07-17T19:33:17.519Z",
    "size": 10619,
    "path": "../public/img/scenes/barra/smithtown-480.avif"
  },
  "/img/scenes/barra/smithtown-480.webp": {
    "type": "image/webp",
    "etag": "\"2e66-88+JUKAnEtKuKka/El9eoFf/RPs\"",
    "mtime": "2026-07-17T19:33:17.519Z",
    "size": 11878,
    "path": "../public/img/scenes/barra/smithtown-480.webp"
  },
  "/img/scenes/barra/smithtown-960.avif": {
    "type": "image/avif",
    "etag": "\"74c0-8XIfUEpnQHnu9tQfgMwtSqubrYY\"",
    "mtime": "2026-07-17T19:33:17.519Z",
    "size": 29888,
    "path": "../public/img/scenes/barra/smithtown-960.avif"
  },
  "/img/scenes/barra/smithtown-960.webp": {
    "type": "image/webp",
    "etag": "\"7ed8-p4Khlhnn6OdT/60RTnoYE/3/vn4\"",
    "mtime": "2026-07-17T19:33:17.519Z",
    "size": 32472,
    "path": "../public/img/scenes/barra/smithtown-960.webp"
  },
  "/img/scenes/barra/smithtown.avif": {
    "type": "image/avif",
    "etag": "\"74c0-8XIfUEpnQHnu9tQfgMwtSqubrYY\"",
    "mtime": "2026-07-17T19:33:17.519Z",
    "size": 29888,
    "path": "../public/img/scenes/barra/smithtown.avif"
  },
  "/img/scenes/barra/smithtown.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"763-bz64mo4NlioOT8dtAw7TFme87+k\"",
    "mtime": "2026-07-17T19:33:17.519Z",
    "size": 1891,
    "path": "../public/img/scenes/barra/smithtown.svg"
  },
  "/img/scenes/barra/smithtown.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"1d9-LvzbXHoXtMe25bjpos34XNWiHvc\"",
    "mtime": "2026-07-17T19:33:17.685Z",
    "size": 473,
    "path": "../public/img/scenes/barra/smithtown.svg.br"
  },
  "/img/scenes/barra/smithtown.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"255-vUoLjK8WC91MXh0ekPcvsfSGHok\"",
    "mtime": "2026-07-17T19:33:17.685Z",
    "size": 597,
    "path": "../public/img/scenes/barra/smithtown.svg.gz"
  },
  "/img/scenes/barra/smithtown.webp": {
    "type": "image/webp",
    "etag": "\"7ed8-p4Khlhnn6OdT/60RTnoYE/3/vn4\"",
    "mtime": "2026-07-17T19:33:17.519Z",
    "size": 32472,
    "path": "../public/img/scenes/barra/smithtown.webp"
  },
  "/img/scenes/barra/verde-ubatuba.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3dbe-Y26a+u7OFkprEqowr1yAYhpExGw\"",
    "mtime": "2026-07-17T19:33:17.519Z",
    "size": 15806,
    "path": "../public/img/scenes/barra/verde-ubatuba.svg"
  },
  "/img/scenes/barra/verde-ubatuba.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"86d-GSKYXh0ElqFmj4/hQIW0eh4wq9s\"",
    "mtime": "2026-07-17T19:33:17.701Z",
    "size": 2157,
    "path": "../public/img/scenes/barra/verde-ubatuba.svg.br"
  },
  "/img/scenes/barra/verde-ubatuba.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a5b-sLYWtZADzJ94DMqymf7+14jShpc\"",
    "mtime": "2026-07-17T19:33:17.685Z",
    "size": 2651,
    "path": "../public/img/scenes/barra/verde-ubatuba.svg.gz"
  },
  "/img/scenes/cocina/blanco-carrara-1600.avif": {
    "type": "image/avif",
    "etag": "\"c400-fL4zQ62mhiBK2O17tt8dQ26jJtg\"",
    "mtime": "2026-07-17T19:33:17.500Z",
    "size": 50176,
    "path": "../public/img/scenes/cocina/blanco-carrara-1600.avif"
  },
  "/img/scenes/cocina/blanco-carrara-1600.webp": {
    "type": "image/webp",
    "etag": "\"d346-rThqkD6UEnDg1LmeYBWNsyqEqGY\"",
    "mtime": "2026-07-17T19:33:17.508Z",
    "size": 54086,
    "path": "../public/img/scenes/cocina/blanco-carrara-1600.webp"
  },
  "/img/scenes/cocina/blanco-carrara-480.avif": {
    "type": "image/avif",
    "etag": "\"2349-mpd8WZqDNpWt9xO9PHbcVZq+HqY\"",
    "mtime": "2026-07-17T19:33:17.508Z",
    "size": 9033,
    "path": "../public/img/scenes/cocina/blanco-carrara-480.avif"
  },
  "/img/scenes/cocina/blanco-carrara-960.avif": {
    "type": "image/avif",
    "etag": "\"5e97-WN3aFFKsmk342Be+HJDoLd8QmqU\"",
    "mtime": "2026-07-17T19:33:17.508Z",
    "size": 24215,
    "path": "../public/img/scenes/cocina/blanco-carrara-960.avif"
  },
  "/img/scenes/cocina/blanco-carrara-480.webp": {
    "type": "image/webp",
    "etag": "\"26ce-i4RGUmlr3KFPKjLPN59J/UtZXoE\"",
    "mtime": "2026-07-17T19:33:17.508Z",
    "size": 9934,
    "path": "../public/img/scenes/cocina/blanco-carrara-480.webp"
  },
  "/img/scenes/cocina/blanco-carrara-960.webp": {
    "type": "image/webp",
    "etag": "\"65d2-mbRp9wL/TM2v0otjhcQUpmPggJU\"",
    "mtime": "2026-07-17T19:33:17.509Z",
    "size": 26066,
    "path": "../public/img/scenes/cocina/blanco-carrara-960.webp"
  },
  "/img/scenes/cocina/blanco-carrara.avif": {
    "type": "image/avif",
    "etag": "\"5e97-WN3aFFKsmk342Be+HJDoLd8QmqU\"",
    "mtime": "2026-07-17T19:33:17.509Z",
    "size": 24215,
    "path": "../public/img/scenes/cocina/blanco-carrara.avif"
  },
  "/img/scenes/cocina/blanco-carrara.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"88b-ikvH3+YIxVILFBYUyET/RCeCWB4\"",
    "mtime": "2026-07-17T19:33:17.508Z",
    "size": 2187,
    "path": "../public/img/scenes/cocina/blanco-carrara.svg"
  },
  "/img/scenes/cocina/blanco-carrara.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"22d-DX2HPjF2KmzlIdr0f9FKz+PvwMU\"",
    "mtime": "2026-07-17T19:33:17.709Z",
    "size": 557,
    "path": "../public/img/scenes/cocina/blanco-carrara.svg.br"
  },
  "/img/scenes/cocina/blanco-carrara.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2b0-/sK8Uv49NheVFDFGHOf6xqlHBbA\"",
    "mtime": "2026-07-17T19:33:17.709Z",
    "size": 688,
    "path": "../public/img/scenes/cocina/blanco-carrara.svg.gz"
  },
  "/img/scenes/cocina/blanco-carrara.webp": {
    "type": "image/webp",
    "etag": "\"65d2-mbRp9wL/TM2v0otjhcQUpmPggJU\"",
    "mtime": "2026-07-17T19:33:17.508Z",
    "size": 26066,
    "path": "../public/img/scenes/cocina/blanco-carrara.webp"
  },
  "/img/scenes/cocina/blue-dunes-1600.avif": {
    "type": "image/avif",
    "etag": "\"15ade-QnC9sVe9kberg6w4oevpvbd0NXs\"",
    "mtime": "2026-07-17T19:33:17.508Z",
    "size": 88798,
    "path": "../public/img/scenes/cocina/blue-dunes-1600.avif"
  },
  "/img/scenes/cocina/blue-dunes-1600.webp": {
    "type": "image/webp",
    "etag": "\"1981e-bD8zCfNEVYlcgAjbVhi1wDX3uao\"",
    "mtime": "2026-07-17T19:33:17.509Z",
    "size": 104478,
    "path": "../public/img/scenes/cocina/blue-dunes-1600.webp"
  },
  "/img/scenes/cocina/blue-dunes-480.avif": {
    "type": "image/avif",
    "etag": "\"2dfb-5XPvVddhmEzusyz6kUmAsiYUqcs\"",
    "mtime": "2026-07-17T19:33:17.509Z",
    "size": 11771,
    "path": "../public/img/scenes/cocina/blue-dunes-480.avif"
  },
  "/img/scenes/cocina/blue-dunes-480.webp": {
    "type": "image/webp",
    "etag": "\"35c8-cLtt9aduLd++LEiasFbuhxHjO8o\"",
    "mtime": "2026-07-17T19:33:17.509Z",
    "size": 13768,
    "path": "../public/img/scenes/cocina/blue-dunes-480.webp"
  },
  "/img/scenes/cocina/blue-dunes-960.avif": {
    "type": "image/avif",
    "etag": "\"9c1f-de0NYG1AnXVH6Gi+vEi5okk1BFw\"",
    "mtime": "2026-07-17T19:33:17.509Z",
    "size": 39967,
    "path": "../public/img/scenes/cocina/blue-dunes-960.avif"
  },
  "/img/scenes/cocina/blue-dunes-960.webp": {
    "type": "image/webp",
    "etag": "\"b318-PVoVXwFcp/8Ti+DvjViqKlMqjko\"",
    "mtime": "2026-07-17T19:33:17.509Z",
    "size": 45848,
    "path": "../public/img/scenes/cocina/blue-dunes-960.webp"
  },
  "/img/scenes/cocina/blue-dunes.avif": {
    "type": "image/avif",
    "etag": "\"9c1f-de0NYG1AnXVH6Gi+vEi5okk1BFw\"",
    "mtime": "2026-07-17T19:33:17.509Z",
    "size": 39967,
    "path": "../public/img/scenes/cocina/blue-dunes.avif"
  },
  "/img/scenes/cocina/blue-dunes.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3ea9-D9jf9pGTd9I4WeO+y3tk/mT0yp0\"",
    "mtime": "2026-07-17T19:33:17.509Z",
    "size": 16041,
    "path": "../public/img/scenes/cocina/blue-dunes.svg"
  },
  "/img/scenes/cocina/blue-dunes.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"8e3-ezUUdkWX8p9HouiqraWUhq8UCPE\"",
    "mtime": "2026-07-17T19:33:17.728Z",
    "size": 2275,
    "path": "../public/img/scenes/cocina/blue-dunes.svg.br"
  },
  "/img/scenes/cocina/blue-dunes.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"ac4-IvFNn9KcyqICjZkmr1Newmkdr0U\"",
    "mtime": "2026-07-17T19:33:17.710Z",
    "size": 2756,
    "path": "../public/img/scenes/cocina/blue-dunes.svg.gz"
  },
  "/img/scenes/cocina/blue-dunes.webp": {
    "type": "image/webp",
    "etag": "\"b318-PVoVXwFcp/8Ti+DvjViqKlMqjko\"",
    "mtime": "2026-07-17T19:33:17.509Z",
    "size": 45848,
    "path": "../public/img/scenes/cocina/blue-dunes.webp"
  },
  "/img/scenes/cocina/calacatta-oro-1600.webp": {
    "type": "image/webp",
    "etag": "\"f390-NKRwwQ3pVsPRBTrkDvGCsK/1FuI\"",
    "mtime": "2026-07-17T19:33:17.510Z",
    "size": 62352,
    "path": "../public/img/scenes/cocina/calacatta-oro-1600.webp"
  },
  "/img/scenes/cocina/calacatta-oro-1600.avif": {
    "type": "image/avif",
    "etag": "\"d5d6-0J/duNXU7IJFVPHag6+RwmlwIoM\"",
    "mtime": "2026-07-17T19:33:17.509Z",
    "size": 54742,
    "path": "../public/img/scenes/cocina/calacatta-oro-1600.avif"
  },
  "/img/scenes/cocina/calacatta-oro-480.webp": {
    "type": "image/webp",
    "etag": "\"2aa4-KJT0V/+ou7OZq5MSp1DLqWH8Ne4\"",
    "mtime": "2026-07-17T19:33:17.510Z",
    "size": 10916,
    "path": "../public/img/scenes/cocina/calacatta-oro-480.webp"
  },
  "/img/scenes/cocina/calacatta-oro-960.avif": {
    "type": "image/avif",
    "etag": "\"6753-qXvvc1em01wNeCgpwduyHwOqOkY\"",
    "mtime": "2026-07-17T19:33:17.510Z",
    "size": 26451,
    "path": "../public/img/scenes/cocina/calacatta-oro-960.avif"
  },
  "/img/scenes/cocina/calacatta-oro-480.avif": {
    "type": "image/avif",
    "etag": "\"255d-BpaM2q/GRJWxVkzZWIusGKThi5I\"",
    "mtime": "2026-07-17T19:33:17.510Z",
    "size": 9565,
    "path": "../public/img/scenes/cocina/calacatta-oro-480.avif"
  },
  "/img/scenes/cocina/calacatta-oro-960.webp": {
    "type": "image/webp",
    "etag": "\"76a0-tomynNvbkWi8MJp4UWgTqDFqAuw\"",
    "mtime": "2026-07-17T19:33:17.510Z",
    "size": 30368,
    "path": "../public/img/scenes/cocina/calacatta-oro-960.webp"
  },
  "/img/scenes/cocina/calacatta-oro.avif": {
    "type": "image/avif",
    "etag": "\"6753-qXvvc1em01wNeCgpwduyHwOqOkY\"",
    "mtime": "2026-07-17T19:33:17.510Z",
    "size": 26451,
    "path": "../public/img/scenes/cocina/calacatta-oro.avif"
  },
  "/img/scenes/cocina/calacatta-oro.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"874-nD4rV+NdtimGwCKiIfrZOGUHCOQ\"",
    "mtime": "2026-07-17T19:33:17.510Z",
    "size": 2164,
    "path": "../public/img/scenes/cocina/calacatta-oro.svg"
  },
  "/img/scenes/cocina/calacatta-oro.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"23a-Cp2WTSVkHpJQhcVozPD/qPAVcZA\"",
    "mtime": "2026-07-17T19:33:17.714Z",
    "size": 570,
    "path": "../public/img/scenes/cocina/calacatta-oro.svg.br"
  },
  "/img/scenes/cocina/calacatta-oro.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2b4-qkzMEUVrxGM+k0OHgpTi1G1IwoU\"",
    "mtime": "2026-07-17T19:33:17.714Z",
    "size": 692,
    "path": "../public/img/scenes/cocina/calacatta-oro.svg.gz"
  },
  "/img/scenes/cocina/calacatta-oro.webp": {
    "type": "image/webp",
    "etag": "\"76a0-tomynNvbkWi8MJp4UWgTqDFqAuw\"",
    "mtime": "2026-07-17T19:33:17.510Z",
    "size": 30368,
    "path": "../public/img/scenes/cocina/calacatta-oro.webp"
  },
  "/img/scenes/cocina/gris-niebla.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"867-ZhrIQxzeatAoqlXbcTe0ihLw/ss\"",
    "mtime": "2026-07-17T19:33:17.510Z",
    "size": 2151,
    "path": "../public/img/scenes/cocina/gris-niebla.svg"
  },
  "/img/scenes/cocina/gris-niebla.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"240-4h+0QMVeZCd55yJN3FeX5dZQ84E\"",
    "mtime": "2026-07-17T19:33:17.714Z",
    "size": 576,
    "path": "../public/img/scenes/cocina/gris-niebla.svg.br"
  },
  "/img/scenes/cocina/gris-niebla.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2bb-qA2NgPf9U6XbZWWUUj4xjJtmKUA\"",
    "mtime": "2026-07-17T19:33:17.714Z",
    "size": 699,
    "path": "../public/img/scenes/cocina/gris-niebla.svg.gz"
  },
  "/img/scenes/cocina/gris-perla.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"8e9-VNaCURIx3TMtLrI4izFT4uAg87w\"",
    "mtime": "2026-07-17T19:33:17.728Z",
    "size": 2281,
    "path": "../public/img/scenes/cocina/gris-perla.svg.br"
  },
  "/img/scenes/cocina/gris-perla.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3ebc-+O58RsVTvPk6FHjyC0GzQPqVyLE\"",
    "mtime": "2026-07-17T19:33:17.510Z",
    "size": 16060,
    "path": "../public/img/scenes/cocina/gris-perla.svg"
  },
  "/img/scenes/cocina/gris-perla.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"ac0-/VNwvDrK3aLwxPKjGtV33OLwXCU\"",
    "mtime": "2026-07-17T19:33:17.714Z",
    "size": 2752,
    "path": "../public/img/scenes/cocina/gris-perla.svg.gz"
  },
  "/img/scenes/cocina/luna-pearl-1600.avif": {
    "type": "image/avif",
    "etag": "\"1b890-S6c/Mc1nE8zoN+joL04YdowR52g\"",
    "mtime": "2026-07-17T19:33:17.510Z",
    "size": 112784,
    "path": "../public/img/scenes/cocina/luna-pearl-1600.avif"
  },
  "/img/scenes/cocina/luna-pearl-1600.webp": {
    "type": "image/webp",
    "etag": "\"24296-rEBtplnj4dbImJOH7dB7GkrRZbA\"",
    "mtime": "2026-07-17T19:33:17.510Z",
    "size": 148118,
    "path": "../public/img/scenes/cocina/luna-pearl-1600.webp"
  },
  "/img/scenes/cocina/luna-pearl-480.avif": {
    "type": "image/avif",
    "etag": "\"3134-dTSrcyLv4G2wOSOLIeKWMX7zYt0\"",
    "mtime": "2026-07-17T19:33:17.510Z",
    "size": 12596,
    "path": "../public/img/scenes/cocina/luna-pearl-480.avif"
  },
  "/img/scenes/cocina/luna-pearl-480.webp": {
    "type": "image/webp",
    "etag": "\"3dd8-E5hLn67Pdj7LcVoGkVHQcBYxrSQ\"",
    "mtime": "2026-07-17T19:33:17.510Z",
    "size": 15832,
    "path": "../public/img/scenes/cocina/luna-pearl-480.webp"
  },
  "/img/scenes/cocina/luna-pearl-960.avif": {
    "type": "image/avif",
    "etag": "\"c197-j098UWC18PT2y4OpEm9Bej7CSCU\"",
    "mtime": "2026-07-17T19:33:17.510Z",
    "size": 49559,
    "path": "../public/img/scenes/cocina/luna-pearl-960.avif"
  },
  "/img/scenes/cocina/luna-pearl.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3ea7-JVu6NacyYV8tpy8GYrNFTMRTM3U\"",
    "mtime": "2026-07-17T19:33:17.511Z",
    "size": 16039,
    "path": "../public/img/scenes/cocina/luna-pearl.svg"
  },
  "/img/scenes/cocina/luna-pearl-960.webp": {
    "type": "image/webp",
    "etag": "\"f11e-E7zYw1DDYE0mmP4Ydmtcfcnl61o\"",
    "mtime": "2026-07-17T19:33:17.511Z",
    "size": 61726,
    "path": "../public/img/scenes/cocina/luna-pearl-960.webp"
  },
  "/img/scenes/cocina/luna-pearl.avif": {
    "type": "image/avif",
    "etag": "\"c197-j098UWC18PT2y4OpEm9Bej7CSCU\"",
    "mtime": "2026-07-17T19:33:17.511Z",
    "size": 49559,
    "path": "../public/img/scenes/cocina/luna-pearl.avif"
  },
  "/img/scenes/cocina/luna-pearl.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"8c3-6ws7Shgx4Y/sX1ax/qPP31kKZtw\"",
    "mtime": "2026-07-17T19:33:17.728Z",
    "size": 2243,
    "path": "../public/img/scenes/cocina/luna-pearl.svg.br"
  },
  "/img/scenes/cocina/luna-pearl.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"ac4-stJeEvokxCcdhBU/a38/zdyPz1A\"",
    "mtime": "2026-07-17T19:33:17.727Z",
    "size": 2756,
    "path": "../public/img/scenes/cocina/luna-pearl.svg.gz"
  },
  "/img/scenes/cocina/marron-baltico.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3eb8-OiB3CWeJYsli+vKMgWBEoIihPh8\"",
    "mtime": "2026-07-17T19:33:17.510Z",
    "size": 16056,
    "path": "../public/img/scenes/cocina/marron-baltico.svg"
  },
  "/img/scenes/cocina/marron-baltico.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"8e3-MMMamuiatnSdUgMvJWz6vi5cF0s\"",
    "mtime": "2026-07-17T19:33:17.732Z",
    "size": 2275,
    "path": "../public/img/scenes/cocina/marron-baltico.svg.br"
  },
  "/img/scenes/cocina/marron-baltico.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"aa7-+fLZc6ueuy/EL6zQGfs1V89rJeg\"",
    "mtime": "2026-07-17T19:33:17.728Z",
    "size": 2727,
    "path": "../public/img/scenes/cocina/marron-baltico.svg.gz"
  },
  "/img/scenes/cocina/negro-absoluto.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3ec2-PZzzIUdxyvJ8Qh7B6YaFWaSJz8o\"",
    "mtime": "2026-07-17T19:33:17.511Z",
    "size": 16066,
    "path": "../public/img/scenes/cocina/negro-absoluto.svg"
  },
  "/img/scenes/cocina/luna-pearl.webp": {
    "type": "image/webp",
    "etag": "\"f11e-E7zYw1DDYE0mmP4Ydmtcfcnl61o\"",
    "mtime": "2026-07-17T19:33:17.511Z",
    "size": 61726,
    "path": "../public/img/scenes/cocina/luna-pearl.webp"
  },
  "/img/scenes/cocina/negro-absoluto.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"aaf-W81pc7nAg5TXpD4iblF49OR9KpQ\"",
    "mtime": "2026-07-17T19:33:17.728Z",
    "size": 2735,
    "path": "../public/img/scenes/cocina/negro-absoluto.svg.gz"
  },
  "/img/scenes/cocina/negro-absoluto.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"8c2-Cz71pNxUR4ohEufgkhsC7kgAxa8\"",
    "mtime": "2026-07-17T19:33:17.735Z",
    "size": 2242,
    "path": "../public/img/scenes/cocina/negro-absoluto.svg.br"
  },
  "/img/scenes/cocina/negro-marquina.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"870-o4CPYbkNmjxb9+N+KNF7i7I1hb4\"",
    "mtime": "2026-07-17T19:33:17.511Z",
    "size": 2160,
    "path": "../public/img/scenes/cocina/negro-marquina.svg"
  },
  "/img/scenes/cocina/negro-marquina.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"240-7j4F4R6M6V26E2lqtKz0r2ozqyk\"",
    "mtime": "2026-07-17T19:33:17.730Z",
    "size": 576,
    "path": "../public/img/scenes/cocina/negro-marquina.svg.br"
  },
  "/img/scenes/cocina/smithtown-1600.avif": {
    "type": "image/avif",
    "etag": "\"cf16-OI6EbFDWuxom0c6Ae3/ZB+GrIhw\"",
    "mtime": "2026-07-17T19:33:17.511Z",
    "size": 53014,
    "path": "../public/img/scenes/cocina/smithtown-1600.avif"
  },
  "/img/scenes/cocina/smithtown-480.avif": {
    "type": "image/avif",
    "etag": "\"250a-k3ln5HlHPVVbyi/f3WbH9C1jtY0\"",
    "mtime": "2026-07-17T19:33:17.511Z",
    "size": 9482,
    "path": "../public/img/scenes/cocina/smithtown-480.avif"
  },
  "/img/scenes/cocina/smithtown-1600.webp": {
    "type": "image/webp",
    "etag": "\"e60a-ZQZzTRwiiDyhZVb1yulYkapac4M\"",
    "mtime": "2026-07-17T19:33:17.511Z",
    "size": 58890,
    "path": "../public/img/scenes/cocina/smithtown-1600.webp"
  },
  "/img/scenes/cocina/negro-marquina.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2b8-7C/jU6jb6SwEFEJW7Ld4MF32lko\"",
    "mtime": "2026-07-17T19:33:17.728Z",
    "size": 696,
    "path": "../public/img/scenes/cocina/negro-marquina.svg.gz"
  },
  "/img/scenes/cocina/smithtown-480.webp": {
    "type": "image/webp",
    "etag": "\"2a6e-K7FgHQ1wcxRnl2/cgtgcUnrofx0\"",
    "mtime": "2026-07-17T19:33:17.511Z",
    "size": 10862,
    "path": "../public/img/scenes/cocina/smithtown-480.webp"
  },
  "/img/scenes/cocina/smithtown-960.avif": {
    "type": "image/avif",
    "etag": "\"6750-I7OtLhKvKSGIMQ+kMy1znZsV5JQ\"",
    "mtime": "2026-07-17T19:33:17.511Z",
    "size": 26448,
    "path": "../public/img/scenes/cocina/smithtown-960.avif"
  },
  "/img/scenes/cocina/smithtown-960.webp": {
    "type": "image/webp",
    "etag": "\"726a-lDcKS5FuSBRnSztHsG9ILu6alG0\"",
    "mtime": "2026-07-17T19:33:17.511Z",
    "size": 29290,
    "path": "../public/img/scenes/cocina/smithtown-960.webp"
  },
  "/img/scenes/cocina/smithtown.avif": {
    "type": "image/avif",
    "etag": "\"6750-I7OtLhKvKSGIMQ+kMy1znZsV5JQ\"",
    "mtime": "2026-07-17T19:33:17.511Z",
    "size": 26448,
    "path": "../public/img/scenes/cocina/smithtown.avif"
  },
  "/img/scenes/cocina/smithtown.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"860-ksn/hNA5hdPCoTP5bu27cohgqHY\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 2144,
    "path": "../public/img/scenes/cocina/smithtown.svg"
  },
  "/img/scenes/cocina/smithtown.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"233-CUVNCLfpKh4eQo43AYURrbkUj/E\"",
    "mtime": "2026-07-17T19:33:17.730Z",
    "size": 563,
    "path": "../public/img/scenes/cocina/smithtown.svg.br"
  },
  "/img/scenes/cocina/smithtown.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"2b9-jpY2cxAHNEUEmMLKitwitH/ctPs\"",
    "mtime": "2026-07-17T19:33:17.730Z",
    "size": 697,
    "path": "../public/img/scenes/cocina/smithtown.svg.gz"
  },
  "/img/scenes/cocina/smithtown.webp": {
    "type": "image/webp",
    "etag": "\"726a-lDcKS5FuSBRnSztHsG9ILu6alG0\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 29290,
    "path": "../public/img/scenes/cocina/smithtown.webp"
  },
  "/img/scenes/cocina/verde-ubatuba.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3ebf-sIrNfLH1rGCTfejYmGx4CzXhM/U\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 16063,
    "path": "../public/img/scenes/cocina/verde-ubatuba.svg"
  },
  "/img/scenes/cocina/verde-ubatuba.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"8ca-E+8lI04s4HjLkm8qRHxh/CKPa3I\"",
    "mtime": "2026-07-17T19:33:17.742Z",
    "size": 2250,
    "path": "../public/img/scenes/cocina/verde-ubatuba.svg.br"
  },
  "/img/scenes/cocina/verde-ubatuba.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"ab3-B3NHfT/vK1EpF1Vhw0hMA7l+dhU\"",
    "mtime": "2026-07-17T19:33:17.730Z",
    "size": 2739,
    "path": "../public/img/scenes/cocina/verde-ubatuba.svg.gz"
  },
  "/img/scenes/isla/blanco-carrara-1600.avif": {
    "type": "image/avif",
    "etag": "\"1053a-E9+2ToBCp2c0VI7HkdoCcHKZ9Y8\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 66874,
    "path": "../public/img/scenes/isla/blanco-carrara-1600.avif"
  },
  "/img/scenes/isla/blanco-carrara-1600.webp": {
    "type": "image/webp",
    "etag": "\"12ee8-1TVT6wGeRALT4UjYqg0kCefUos0\"",
    "mtime": "2026-07-17T19:33:17.500Z",
    "size": 77544,
    "path": "../public/img/scenes/isla/blanco-carrara-1600.webp"
  },
  "/img/scenes/isla/blanco-carrara-480.avif": {
    "type": "image/avif",
    "etag": "\"29e4-qAlSMF4MHBcDOG0DFYoA8WlYyMU\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 10724,
    "path": "../public/img/scenes/isla/blanco-carrara-480.avif"
  },
  "/img/scenes/isla/blanco-carrara-480.webp": {
    "type": "image/webp",
    "etag": "\"2fcc-v8z1i4EfLXO9YThCGSChEdxxOLM\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 12236,
    "path": "../public/img/scenes/isla/blanco-carrara-480.webp"
  },
  "/img/scenes/isla/blanco-carrara-960.avif": {
    "type": "image/avif",
    "etag": "\"7c2d-i4hnq1A/Zh2rKg1793WjWEL+vgg\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 31789,
    "path": "../public/img/scenes/isla/blanco-carrara-960.avif"
  },
  "/img/scenes/isla/blanco-carrara-960.webp": {
    "type": "image/webp",
    "etag": "\"8cac-nB1ST8Dw640ftx3bGAM2NNUxYUk\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 36012,
    "path": "../public/img/scenes/isla/blanco-carrara-960.webp"
  },
  "/img/scenes/isla/blanco-carrara.avif": {
    "type": "image/avif",
    "etag": "\"7c2d-i4hnq1A/Zh2rKg1793WjWEL+vgg\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 31789,
    "path": "../public/img/scenes/isla/blanco-carrara.avif"
  },
  "/img/scenes/isla/blanco-carrara.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"1f7-YYPrgjTEJun+V/cWBX9BCw48IUI\"",
    "mtime": "2026-07-17T19:33:17.687Z",
    "size": 503,
    "path": "../public/img/scenes/isla/blanco-carrara.svg.br"
  },
  "/img/scenes/isla/blanco-carrara.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"7fa-JAko4rE89Pg0pPdVgwn5IYMY/NI\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 2042,
    "path": "../public/img/scenes/isla/blanco-carrara.svg"
  },
  "/img/scenes/isla/blanco-carrara.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"26c-bIK3+MN2BHzVzP5EPtBABUKquoE\"",
    "mtime": "2026-07-17T19:33:17.687Z",
    "size": 620,
    "path": "../public/img/scenes/isla/blanco-carrara.svg.gz"
  },
  "/img/scenes/isla/blanco-carrara.webp": {
    "type": "image/webp",
    "etag": "\"8cac-nB1ST8Dw640ftx3bGAM2NNUxYUk\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 36012,
    "path": "../public/img/scenes/isla/blanco-carrara.webp"
  },
  "/img/scenes/isla/blue-dunes-1600.avif": {
    "type": "image/avif",
    "etag": "\"1e40e-y14hfbOSdjcd+0Ll7Y34p2iVbNQ\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 123918,
    "path": "../public/img/scenes/isla/blue-dunes-1600.avif"
  },
  "/img/scenes/isla/blue-dunes-480.avif": {
    "type": "image/avif",
    "etag": "\"3cc9-7Lk6U1D1Km9+QSP6QihUIiC7H2Q\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 15561,
    "path": "../public/img/scenes/isla/blue-dunes-480.avif"
  },
  "/img/scenes/isla/blue-dunes-1600.webp": {
    "type": "image/webp",
    "etag": "\"277d6-Uy4JcjNDfJ0aUebA0V3PZzBlMjU\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 161750,
    "path": "../public/img/scenes/isla/blue-dunes-1600.webp"
  },
  "/img/scenes/isla/blue-dunes-480.webp": {
    "type": "image/webp",
    "etag": "\"4b06-XWadjc1aFojEdTGukGlnGS7HA6Y\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 19206,
    "path": "../public/img/scenes/isla/blue-dunes-480.webp"
  },
  "/img/scenes/isla/blue-dunes-960.avif": {
    "type": "image/avif",
    "etag": "\"dc3e-44bdXIEncfQZEySGOlUd/nCFdqs\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 56382,
    "path": "../public/img/scenes/isla/blue-dunes-960.avif"
  },
  "/img/scenes/isla/blue-dunes-960.webp": {
    "type": "image/webp",
    "etag": "\"119ba-st3B6XI//L1yOM+cX+e4ic/+3ks\"",
    "mtime": "2026-07-17T19:33:17.513Z",
    "size": 72122,
    "path": "../public/img/scenes/isla/blue-dunes-960.webp"
  },
  "/img/scenes/isla/blue-dunes.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3e14-1YuRDKgzQY+fgsE4Fk1mW8GOvBg\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 15892,
    "path": "../public/img/scenes/isla/blue-dunes.svg"
  },
  "/img/scenes/isla/blue-dunes.avif": {
    "type": "image/avif",
    "etag": "\"dc3e-44bdXIEncfQZEySGOlUd/nCFdqs\"",
    "mtime": "2026-07-17T19:33:17.513Z",
    "size": 56382,
    "path": "../public/img/scenes/isla/blue-dunes.avif"
  },
  "/img/scenes/isla/blue-dunes.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"89d-BX8XsRMsE5Uv0u9Up0deTE4xW0o\"",
    "mtime": "2026-07-17T19:33:17.704Z",
    "size": 2205,
    "path": "../public/img/scenes/isla/blue-dunes.svg.br"
  },
  "/img/scenes/isla/blue-dunes.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a86-UKcGlIeac1A/yIoWxgzrgw/QTas\"",
    "mtime": "2026-07-17T19:33:17.688Z",
    "size": 2694,
    "path": "../public/img/scenes/isla/blue-dunes.svg.gz"
  },
  "/img/scenes/isla/blue-dunes.webp": {
    "type": "image/webp",
    "etag": "\"119ba-st3B6XI//L1yOM+cX+e4ic/+3ks\"",
    "mtime": "2026-07-17T19:33:17.512Z",
    "size": 72122,
    "path": "../public/img/scenes/isla/blue-dunes.webp"
  },
  "/img/scenes/isla/calacatta-oro-1600.avif": {
    "type": "image/avif",
    "etag": "\"11725-EVDF+GDM/H3NylI21pKxZmcawzg\"",
    "mtime": "2026-07-17T19:33:17.513Z",
    "size": 71461,
    "path": "../public/img/scenes/isla/calacatta-oro-1600.avif"
  },
  "/img/scenes/isla/calacatta-oro-1600.webp": {
    "type": "image/webp",
    "etag": "\"13d0a-aMyVVn/frCNRji535Tl7DAMvGTc\"",
    "mtime": "2026-07-17T19:33:17.513Z",
    "size": 81162,
    "path": "../public/img/scenes/isla/calacatta-oro-1600.webp"
  },
  "/img/scenes/isla/calacatta-oro-480.avif": {
    "type": "image/avif",
    "etag": "\"2ba2-nrMdpmAdBEKLiz5umyfKEpn56sE\"",
    "mtime": "2026-07-17T19:33:17.513Z",
    "size": 11170,
    "path": "../public/img/scenes/isla/calacatta-oro-480.avif"
  },
  "/img/scenes/isla/calacatta-oro-480.webp": {
    "type": "image/webp",
    "etag": "\"319a-31+3wTXceJmfHnMb4mQwQnnpEuQ\"",
    "mtime": "2026-07-17T19:33:17.513Z",
    "size": 12698,
    "path": "../public/img/scenes/isla/calacatta-oro-480.webp"
  },
  "/img/scenes/isla/calacatta-oro-960.avif": {
    "type": "image/avif",
    "etag": "\"82e5-rYdo4vuiX2LtCog3cltxRc96sJ0\"",
    "mtime": "2026-07-17T19:33:17.513Z",
    "size": 33509,
    "path": "../public/img/scenes/isla/calacatta-oro-960.avif"
  },
  "/img/scenes/isla/calacatta-oro-960.webp": {
    "type": "image/webp",
    "etag": "\"9176-YLX9Ik9FrrPF804j0XdeFfr+DSM\"",
    "mtime": "2026-07-17T19:33:17.513Z",
    "size": 37238,
    "path": "../public/img/scenes/isla/calacatta-oro-960.webp"
  },
  "/img/scenes/isla/calacatta-oro.avif": {
    "type": "image/avif",
    "etag": "\"82e5-rYdo4vuiX2LtCog3cltxRc96sJ0\"",
    "mtime": "2026-07-17T19:33:17.513Z",
    "size": 33509,
    "path": "../public/img/scenes/isla/calacatta-oro.avif"
  },
  "/img/scenes/isla/calacatta-oro.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"7e2-Lc04wyQrkEojh+0hzXH6pNVI/18\"",
    "mtime": "2026-07-17T19:33:17.513Z",
    "size": 2018,
    "path": "../public/img/scenes/isla/calacatta-oro.svg"
  },
  "/img/scenes/isla/calacatta-oro.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"200-pITw1KoEPNart5HKFK1tbwwoSIY\"",
    "mtime": "2026-07-17T19:33:17.691Z",
    "size": 512,
    "path": "../public/img/scenes/isla/calacatta-oro.svg.br"
  },
  "/img/scenes/isla/calacatta-oro.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"26f-Rz4VQihAoqeVE6S8fyqHIFL97sQ\"",
    "mtime": "2026-07-17T19:33:17.691Z",
    "size": 623,
    "path": "../public/img/scenes/isla/calacatta-oro.svg.gz"
  },
  "/img/scenes/isla/calacatta-oro.webp": {
    "type": "image/webp",
    "etag": "\"9176-YLX9Ik9FrrPF804j0XdeFfr+DSM\"",
    "mtime": "2026-07-17T19:33:17.513Z",
    "size": 37238,
    "path": "../public/img/scenes/isla/calacatta-oro.webp"
  },
  "/img/scenes/isla/gris-niebla.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"7d3-IIWnkTUkKZ06NGRFF8nwV49T81s\"",
    "mtime": "2026-07-17T19:33:17.513Z",
    "size": 2003,
    "path": "../public/img/scenes/isla/gris-niebla.svg"
  },
  "/img/scenes/isla/gris-niebla.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"208-eHpDwxH7hwZ9dtUqa0d1w6qAR5Q\"",
    "mtime": "2026-07-17T19:33:17.691Z",
    "size": 520,
    "path": "../public/img/scenes/isla/gris-niebla.svg.br"
  },
  "/img/scenes/isla/gris-perla.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3e27-oYrM+IHlcjhpikybZqrzmzLN8i4\"",
    "mtime": "2026-07-17T19:33:17.513Z",
    "size": 15911,
    "path": "../public/img/scenes/isla/gris-perla.svg"
  },
  "/img/scenes/isla/gris-perla.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"8aa-k3oDwX6d2sbm5iMstSCBrCbTXag\"",
    "mtime": "2026-07-17T19:33:17.705Z",
    "size": 2218,
    "path": "../public/img/scenes/isla/gris-perla.svg.br"
  },
  "/img/scenes/isla/gris-perla.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a84-6EpjB6xjGWcc+g+QK+Mq2Y1RNrs\"",
    "mtime": "2026-07-17T19:33:17.691Z",
    "size": 2692,
    "path": "../public/img/scenes/isla/gris-perla.svg.gz"
  },
  "/img/scenes/isla/gris-niebla.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"275-fHyfP1//gR2DSbM/4e5mJFoPohA\"",
    "mtime": "2026-07-17T19:33:17.691Z",
    "size": 629,
    "path": "../public/img/scenes/isla/gris-niebla.svg.gz"
  },
  "/img/scenes/isla/luna-pearl-1600.avif": {
    "type": "image/avif",
    "etag": "\"23d01-k/YQZvGZC9sC4E36BSaH2IDlPK4\"",
    "mtime": "2026-07-17T19:33:17.514Z",
    "size": 146689,
    "path": "../public/img/scenes/isla/luna-pearl-1600.avif"
  },
  "/img/scenes/isla/luna-pearl-1600.webp": {
    "type": "image/webp",
    "etag": "\"31ec0-oCXp9lUJOmNO8rb67JbfoT0atLY\"",
    "mtime": "2026-07-17T19:33:17.514Z",
    "size": 204480,
    "path": "../public/img/scenes/isla/luna-pearl-1600.webp"
  },
  "/img/scenes/isla/luna-pearl-480.avif": {
    "type": "image/avif",
    "etag": "\"4028-UHkWhUW8afswD190FTFlv+zOcMs\"",
    "mtime": "2026-07-17T19:33:17.513Z",
    "size": 16424,
    "path": "../public/img/scenes/isla/luna-pearl-480.avif"
  },
  "/img/scenes/isla/luna-pearl-960.avif": {
    "type": "image/avif",
    "etag": "\"fe43-MhJIkjxw64jPcIKZUm0Bn9SyHd8\"",
    "mtime": "2026-07-17T19:33:17.514Z",
    "size": 65091,
    "path": "../public/img/scenes/isla/luna-pearl-960.avif"
  },
  "/img/scenes/isla/luna-pearl-480.webp": {
    "type": "image/webp",
    "etag": "\"544e-yL3JACeSYUSXcqW+LLNhcewiE/M\"",
    "mtime": "2026-07-17T19:33:17.514Z",
    "size": 21582,
    "path": "../public/img/scenes/isla/luna-pearl-480.webp"
  },
  "/img/scenes/isla/luna-pearl-960.webp": {
    "type": "image/webp",
    "etag": "\"1585e-4C0Tzb1O8lKW/MbYTHokgbwsdgk\"",
    "mtime": "2026-07-17T19:33:17.514Z",
    "size": 88158,
    "path": "../public/img/scenes/isla/luna-pearl-960.webp"
  },
  "/img/scenes/isla/luna-pearl.avif": {
    "type": "image/avif",
    "etag": "\"fe43-MhJIkjxw64jPcIKZUm0Bn9SyHd8\"",
    "mtime": "2026-07-17T19:33:17.514Z",
    "size": 65091,
    "path": "../public/img/scenes/isla/luna-pearl.avif"
  },
  "/img/scenes/isla/luna-pearl.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3e12-ZWIh1PmzhUTWc8g8xFRBti6jXuE\"",
    "mtime": "2026-07-17T19:33:17.514Z",
    "size": 15890,
    "path": "../public/img/scenes/isla/luna-pearl.svg"
  },
  "/img/scenes/isla/luna-pearl.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"887-0dFmbinzg1SR0GQQHXHN4GSdSgc\"",
    "mtime": "2026-07-17T19:33:17.705Z",
    "size": 2183,
    "path": "../public/img/scenes/isla/luna-pearl.svg.br"
  },
  "/img/scenes/isla/luna-pearl.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a82-bc7kLZE7Bd+eF1y6PFOLLmgplSs\"",
    "mtime": "2026-07-17T19:33:17.701Z",
    "size": 2690,
    "path": "../public/img/scenes/isla/luna-pearl.svg.gz"
  },
  "/img/scenes/isla/luna-pearl.webp": {
    "type": "image/webp",
    "etag": "\"1585e-4C0Tzb1O8lKW/MbYTHokgbwsdgk\"",
    "mtime": "2026-07-17T19:33:17.514Z",
    "size": 88158,
    "path": "../public/img/scenes/isla/luna-pearl.webp"
  },
  "/img/scenes/isla/marron-baltico.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3e27-L+t/CP1LZnq8iPm0n/jtPNrMppw\"",
    "mtime": "2026-07-17T19:33:17.515Z",
    "size": 15911,
    "path": "../public/img/scenes/isla/marron-baltico.svg"
  },
  "/img/scenes/isla/marron-baltico.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a6b-2CFsbLtXFaPRpCMs4DRjGeNIMcA\"",
    "mtime": "2026-07-17T19:33:17.704Z",
    "size": 2667,
    "path": "../public/img/scenes/isla/marron-baltico.svg.gz"
  },
  "/img/scenes/isla/marron-baltico.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"89f-TGzRw1otPZ/0ehFU+xPFkFZ0OwM\"",
    "mtime": "2026-07-17T19:33:17.709Z",
    "size": 2207,
    "path": "../public/img/scenes/isla/marron-baltico.svg.br"
  },
  "/img/scenes/isla/negro-absoluto.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3e31-caACpcSj6LZFFNK4f95OIhGBy+Q\"",
    "mtime": "2026-07-17T19:33:17.514Z",
    "size": 15921,
    "path": "../public/img/scenes/isla/negro-absoluto.svg"
  },
  "/img/scenes/isla/negro-absoluto.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"893-jHTBTTrkALDftdPVuBap95cJ+ck\"",
    "mtime": "2026-07-17T19:33:17.714Z",
    "size": 2195,
    "path": "../public/img/scenes/isla/negro-absoluto.svg.br"
  },
  "/img/scenes/isla/negro-marquina.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"7df-4x+ZSETBhOBXRj2p7lZLRFiuXns\"",
    "mtime": "2026-07-17T19:33:17.515Z",
    "size": 2015,
    "path": "../public/img/scenes/isla/negro-marquina.svg"
  },
  "/img/scenes/isla/negro-absoluto.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a72-24vIBbBulpzLHW7zmviT+J1tjSc\"",
    "mtime": "2026-07-17T19:33:17.705Z",
    "size": 2674,
    "path": "../public/img/scenes/isla/negro-absoluto.svg.gz"
  },
  "/img/scenes/isla/negro-marquina.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"271-8EUgJu8x0JY8ppdCiQwjTK8F63c\"",
    "mtime": "2026-07-17T19:33:17.705Z",
    "size": 625,
    "path": "../public/img/scenes/isla/negro-marquina.svg.gz"
  },
  "/img/scenes/isla/negro-marquina.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"205-Y+RScPcqcUnesSFo3VzcKU3xmr4\"",
    "mtime": "2026-07-17T19:33:17.705Z",
    "size": 517,
    "path": "../public/img/scenes/isla/negro-marquina.svg.br"
  },
  "/img/scenes/isla/smithtown-1600.avif": {
    "type": "image/avif",
    "etag": "\"11e75-katIH1w1F3rRakv84OPL4HDmyi4\"",
    "mtime": "2026-07-17T19:33:17.516Z",
    "size": 73333,
    "path": "../public/img/scenes/isla/smithtown-1600.avif"
  },
  "/img/scenes/isla/smithtown-1600.webp": {
    "type": "image/webp",
    "etag": "\"13408-tPZrG53aVsVmfTC+O4bPHo5Pi9w\"",
    "mtime": "2026-07-17T19:33:17.514Z",
    "size": 78856,
    "path": "../public/img/scenes/isla/smithtown-1600.webp"
  },
  "/img/scenes/isla/smithtown-480.avif": {
    "type": "image/avif",
    "etag": "\"2a93-UwffkIKUwEmwY0xAUOYRcGBQrW8\"",
    "mtime": "2026-07-17T19:33:17.515Z",
    "size": 10899,
    "path": "../public/img/scenes/isla/smithtown-480.avif"
  },
  "/img/scenes/isla/smithtown-480.webp": {
    "type": "image/webp",
    "etag": "\"2ed6-WnV26DMotH0OI52eKPIC8wapzOg\"",
    "mtime": "2026-07-17T19:33:17.514Z",
    "size": 11990,
    "path": "../public/img/scenes/isla/smithtown-480.webp"
  },
  "/img/scenes/isla/smithtown-960.avif": {
    "type": "image/avif",
    "etag": "\"8368-4z+QoJW9W+ijVhVHnJnsnjTVE9M\"",
    "mtime": "2026-07-17T19:33:17.515Z",
    "size": 33640,
    "path": "../public/img/scenes/isla/smithtown-960.avif"
  },
  "/img/scenes/isla/smithtown-960.webp": {
    "type": "image/webp",
    "etag": "\"8eda-mTQsTzLM3TZSjFmIdmb62XTVGqs\"",
    "mtime": "2026-07-17T19:33:17.515Z",
    "size": 36570,
    "path": "../public/img/scenes/isla/smithtown-960.webp"
  },
  "/img/scenes/isla/smithtown.avif": {
    "type": "image/avif",
    "etag": "\"8368-4z+QoJW9W+ijVhVHnJnsnjTVE9M\"",
    "mtime": "2026-07-17T19:33:17.515Z",
    "size": 33640,
    "path": "../public/img/scenes/isla/smithtown.avif"
  },
  "/img/scenes/isla/smithtown.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"7ca-OjqQ65/U+l/PT7wCqAjDntyAEyA\"",
    "mtime": "2026-07-17T19:33:17.515Z",
    "size": 1994,
    "path": "../public/img/scenes/isla/smithtown.svg"
  },
  "/img/scenes/isla/smithtown.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"1f8-mf29xUlmAIxpDmR03SXv/VEouwc\"",
    "mtime": "2026-07-17T19:33:17.707Z",
    "size": 504,
    "path": "../public/img/scenes/isla/smithtown.svg.br"
  },
  "/img/scenes/isla/smithtown.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"272-Yvy2MU4qVgNDFr9z3yfvRYn2C6Y\"",
    "mtime": "2026-07-17T19:33:17.707Z",
    "size": 626,
    "path": "../public/img/scenes/isla/smithtown.svg.gz"
  },
  "/img/scenes/isla/smithtown.webp": {
    "type": "image/webp",
    "etag": "\"8eda-mTQsTzLM3TZSjFmIdmb62XTVGqs\"",
    "mtime": "2026-07-17T19:33:17.515Z",
    "size": 36570,
    "path": "../public/img/scenes/isla/smithtown.webp"
  },
  "/img/scenes/isla/verde-ubatuba.svg": {
    "type": "image/svg+xml",
    "encoding": null,
    "etag": "\"3e2d-l5D61i2nKNGOvPwmdirIjHBXEZs\"",
    "mtime": "2026-07-17T19:33:17.516Z",
    "size": 15917,
    "path": "../public/img/scenes/isla/verde-ubatuba.svg"
  },
  "/img/scenes/isla/verde-ubatuba.svg.br": {
    "type": "image/svg+xml",
    "encoding": "br",
    "etag": "\"88f-OKPqSjEJl/KMCAjq4zT/LZ9lR+g\"",
    "mtime": "2026-07-17T19:33:17.727Z",
    "size": 2191,
    "path": "../public/img/scenes/isla/verde-ubatuba.svg.br"
  },
  "/img/scenes/isla/verde-ubatuba.svg.gz": {
    "type": "image/svg+xml",
    "encoding": "gzip",
    "etag": "\"a75-HijqFKiCkoUZXVKirTi8u7nMnAA\"",
    "mtime": "2026-07-17T19:33:17.707Z",
    "size": 2677,
    "path": "../public/img/scenes/isla/verde-ubatuba.svg.gz"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _unn3Eh = eventHandler$1((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader$1(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader$1(event, "Cache-Control");
      throw createError$2({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader$1(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader$1(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus$1(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader$1(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus$1(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader$1(event, "Content-Type")) {
    setResponseHeader$1(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader$1(event, "ETag")) {
    setResponseHeader$1(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader$1(event, "Last-Modified")) {
    setResponseHeader$1(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader$1(event, "Content-Encoding")) {
    setResponseHeader$1(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader$1(event, "Content-Length")) {
    setResponseHeader$1(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

function parseSetCookie$1(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair$1(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair$1(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = new NullObject();
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = event.node.req.headers["x-forwarded-host"];
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}
function getRequestIP(event, opts = {}) {
  if (event.context.clientAddress) {
    return event.context.clientAddress;
  }
  if (opts.xForwardedFor) {
    const xForwardedFor = getRequestHeader(event, "x-forwarded-for")?.split(",").shift()?.trim();
    if (xForwardedFor) {
      return xForwardedFor;
    }
  }
  if (event.node.req.socket.remoteAddress) {
    return event.node.req.socket.remoteAddress;
  }
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

const MIMES = {
  html: "text/html"};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeaders(event) {
  return event.node.res.getHeaders();
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;

const a$1 = ["cocina", "bano", "isla", "barra"], n$1 = [{ slug: "blanco-carrara", nombre: "Blanco Carrara", tipo: "marmol", tono: "claro", veta: "veta suave", dureza: "media", nivel: 2, desc: { es: "M\xE1rmol blanco perla con vetas grises suaves y plumosas, acabado honed sutil.", en: "Pearl-white marble with soft feathery gray veining, subtle honed finish." }, swatch: "/img/swatches/blanco-carrara", escenas: [...a$1] }, { slug: "calacatta-oro", nombre: "Calacatta Oro", tipo: "cuarzo", tono: "calido", veta: "veta dram\xE1tica", dureza: "muy-alta", nivel: 3, desc: { es: "Cuarzo blanco c\xE1lido con vetas doradas y grises dram\xE1ticas en diagonal.", en: "Warm white quartz with bold dramatic gold and gray diagonal veins." }, swatch: "/img/swatches/calacatta-oro", escenas: [...a$1] }, { slug: "blue-dunes", nombre: "Blue Dunes", tipo: "granito", tono: "medio", veta: "bandeado fluido", dureza: "muy-alta", nivel: 3, desc: { es: "Granito ex\xF3tico con bandas fluidas de gris, taupe y arena que cruzan la losa en diagonal, salpicado de cristales plateados.", en: "Exotic granite with flowing bands of grey, taupe and sand crossing the slab diagonally, flecked with silver crystals." }, swatch: "/img/swatches/blue-dunes", escenas: [...a$1] }, { slug: "smithtown", nombre: "Smithtown", tipo: "cuarzo", tono: "claro", veta: "veta gris difusa", dureza: "muy-alta", nivel: 2, desc: { es: "Cuarzo blanco brillante con una red de vetas grises finas y una veta central m\xE1s marcada, estilo m\xE1rmol.", en: "Bright white quartz with a network of fine grey veins and a bolder central vein, marble look." }, swatch: "/img/swatches/smithtown", escenas: [...a$1] }, { slug: "luna-pearl", nombre: "Luna Pearl", tipo: "granito", tono: "claro", veta: "moteado gris y negro", dureza: "muy-alta", nivel: 1, desc: { es: "Granito Luna Pearl con moteado uniforme en blanco, gris y perla salpicado de peque\xF1os puntos negros; un cl\xE1sico vers\xE1til.", en: "Luna Pearl granite with uniform white, grey and pearl speckling flecked with small black dots; a versatile classic." }, swatch: "/img/swatches/luna-pearl", escenas: [...a$1] }];
async function t$1() {
  return n$1;
}
async function o$1(e) {
  return (await t$1()).find((s) => s.slug === e);
}
async function r$1() {
  return [];
}

function Ee$1() {
  let e = /* @__PURE__ */ new Set();
  function t(r) {
    return e.add(r), () => e.delete(r);
  }
  let n = false;
  function o(r, s) {
    if (n) return !(n = false);
    const c = { to: r, options: s, defaultPrevented: false, preventDefault: () => c.defaultPrevented = true };
    for (const h of e) h.listener({ ...c, from: h.location, retry: (m) => {
      m && (n = true), h.navigate(r, { ...s, resolve: false });
    } });
    return !c.defaultPrevented;
  }
  return { subscribe: t, confirm: o };
}
let z$2;
function ae$1() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), z$2 = window.history.state._depth;
}
isServer || ae$1();
function Qe$2(e) {
  return { ...e, _depth: window.history.state && window.history.state._depth };
}
function Ve$2(e, t) {
  let n = false;
  return () => {
    const o = z$2;
    ae$1();
    const r = o == null ? null : z$2 - o;
    if (n) {
      n = false;
      return;
    }
    r && t(r) ? (n = true, window.history.go(-r)) : e();
  };
}
const Se = /^(?:[a-z0-9]+:)?\/\//i, Ae = /^\/+|(\/)\/+$/g, Ce$1 = "http://sr";
function I(e, t = false) {
  const n = e.replace(Ae, "$1");
  return n ? t || /^[?#]/.test(n) ? n : "/" + n : "";
}
function U$3(e, t, n) {
  if (Se.test(t)) return;
  const o = I(e), r = n && I(n);
  let s = "";
  return !r || t.startsWith("/") ? s = o : r.toLowerCase().indexOf(o.toLowerCase()) !== 0 ? s = o + r : s = r, (s || "/") + I(t, !s);
}
function Le(e, t) {
  if (e == null) throw new Error(t);
  return e;
}
function Fe(e, t) {
  return I(e).replace(/\/*(\*.*)?$/g, "") + I(t);
}
function ce$1(e) {
  const t = {};
  return e.searchParams.forEach((n, o) => {
    o in t ? Array.isArray(t[o]) ? t[o].push(n) : t[o] = [t[o], n] : t[o] = n;
  }), t;
}
function _e$1(e, t, n) {
  const [o, r] = e.split("/*", 2), s = o.split("/").filter(Boolean), c = s.length;
  return (h) => {
    const m = h.split("/").filter(Boolean), p = m.length - c;
    if (p < 0 || p > 0 && r === void 0 && !t) return null;
    const i = { path: c ? "" : "/", params: {} }, a = (g) => n === void 0 ? void 0 : n[g];
    for (let g = 0; g < c; g++) {
      const u = s[g], y = u[0] === ":", f = y ? m[g] : m[g].toLowerCase(), w = y ? u.slice(1) : u.toLowerCase();
      if (y && H$1(f, a(w))) i.params[w] = f;
      else if (y || !H$1(f, w)) return null;
      i.path += `/${f}`;
    }
    if (r) {
      const g = p ? m.slice(-p).join("/") : "";
      if (H$1(g, a(r))) i.params[r] = g;
      else return null;
    }
    return i;
  };
}
function H$1(e, t) {
  const n = (o) => o === e;
  return t === void 0 ? true : typeof t == "string" ? n(t) : typeof t == "function" ? t(e) : Array.isArray(t) ? t.some(n) : t instanceof RegExp ? t.test(e) : false;
}
function je(e) {
  const [t, n] = e.pattern.split("/*", 2), o = t.split("/").filter(Boolean);
  return o.reduce((r, s) => r + (s.startsWith(":") ? 2 : 3), o.length - (n === void 0 ? 0 : 1));
}
function ie$2(e) {
  const t = /* @__PURE__ */ new Map(), n = getOwner();
  return new Proxy({}, { get(o, r) {
    return t.has(r) || runWithOwner(n, () => t.set(r, createMemo(() => e()[r]))), t.get(r)();
  }, getOwnPropertyDescriptor() {
    return { enumerable: true, configurable: true };
  }, ownKeys() {
    return Reflect.ownKeys(e());
  }, has(o, r) {
    return r in e();
  } });
}
function qe(e, t) {
  const n = new URLSearchParams(e);
  Object.entries(t).forEach(([r, s]) => {
    s == null || s === "" || s instanceof Array && !s.length ? n.delete(r) : s instanceof Array ? (n.delete(r), s.forEach((c) => {
      n.append(r, String(c));
    })) : n.set(r, String(s));
  });
  const o = n.toString();
  return o ? `?${o}` : "";
}
function ue$1(e) {
  let t = /(\/?\:[^\/]+)\?/.exec(e);
  if (!t) return [e];
  let n = e.slice(0, t.index), o = e.slice(t.index + t[0].length);
  const r = [n, n += t[1]];
  for (; t = /^(\/\:[^\/]+)\?/.exec(o); ) r.push(n += t[1]), o = o.slice(t[0].length);
  return ue$1(o).reduce((s, c) => [...s, ...r.map((h) => h + c)], []);
}
const Be$1 = 100, Ie = createContext$1(), le$1 = createContext$1(), M$1 = () => Le(useContext(Ie), "<A> and 'use' router primitives can be only used inside a Route."), Me = () => useContext(le$1) || M$1().base, Ze$2 = (e) => {
  const t = Me();
  return createMemo(() => t.resolvePath(e()));
}, et$2 = (e) => {
  const t = M$1();
  return createMemo(() => {
    const n = e();
    return n !== void 0 ? t.renderPath(n) : n;
  });
}, fe = () => M$1().navigatorFactory(), De$1 = () => M$1().location, tt$2 = () => M$1().params, nt$2 = () => {
  const e = De$1(), t = fe(), n = (o, r) => {
    const s = untrack(() => qe(e.search, o) + e.hash);
    t(s, { scroll: false, resolve: false, ...r });
  };
  return [e.query, n];
};
function Te$1(e, t = "") {
  const { component: n, preload: o, load: r, children: s, info: c } = e, h = !s || Array.isArray(s) && !s.length, m = { key: e, component: n, preload: o || r, info: c };
  return he(e.path).reduce((p, i) => {
    for (const a of ue$1(i)) {
      const g = Fe(t, a);
      let u = h ? g : g.split("/*", 1)[0];
      u = u.split("/").map((y) => y.startsWith(":") || y.startsWith("*") ? y : encodeURIComponent(y)).join("/"), p.push({ ...m, originalPath: i, pattern: u, matcher: _e$1(u, !h, e.matchFilters) });
    }
    return p;
  }, []);
}
function We$2(e, t = 0) {
  return { routes: e, score: je(e[e.length - 1]) * 1e4 - t, matcher(n) {
    const o = [];
    for (let r = e.length - 1; r >= 0; r--) {
      const s = e[r], c = s.matcher(n);
      if (!c) return null;
      o.unshift({ ...c, route: s });
    }
    return o;
  } };
}
function he(e) {
  return Array.isArray(e) ? e : [e];
}
function $e(e, t = "", n = [], o = []) {
  const r = he(e);
  for (let s = 0, c = r.length; s < c; s++) {
    const h = r[s];
    if (h && typeof h == "object") {
      h.hasOwnProperty("path") || (h.path = "");
      const m = Te$1(h, t);
      for (const p of m) {
        n.push(p);
        const i = Array.isArray(h.children) && h.children.length === 0;
        if (h.children && !i) $e(h.children, p.pattern, n, o);
        else {
          const a = We$2([...n], o.length);
          o.push(a);
        }
        n.pop();
      }
    }
  }
  return n.length ? o : o.sort((s, c) => c.score - s.score);
}
function K$2(e, t) {
  for (let n = 0, o = e.length; n < o; n++) {
    const r = e[n].matcher(t);
    if (r) return r;
  }
  return [];
}
function Ue$1(e, t, n) {
  const o = new URL(Ce$1), r = createMemo((i) => {
    const a = e();
    try {
      return new URL(a, o);
    } catch {
      return console.error(`Invalid path ${a}`), i;
    }
  }, o, { equals: (i, a) => i.href === a.href }), s = createMemo(() => r().pathname), c = createMemo(() => r().search, true), h = createMemo(() => r().hash), m = () => "", p = on(c, () => ce$1(r()));
  return { get pathname() {
    return s();
  }, get search() {
    return c();
  }, get hash() {
    return h();
  }, get state() {
    return t();
  }, get key() {
    return m();
  }, query: n ? n(p) : ie$2(p) };
}
let S$2;
function ke$1() {
  return S$2;
}
let B$3 = false;
function He$1() {
  return B$3;
}
function rt$2(e) {
  B$3 = e;
}
function ot$2(e, t, n, o = {}) {
  const { signal: [r, s], utils: c = {} } = e, h = c.parsePath || ((l) => l), m = c.renderPath || ((l) => l), p = c.beforeLeave || Ee$1(), i = U$3("", o.base || "");
  if (i === void 0) throw new Error(`${i} is not a valid base path`);
  i && !r().value && s({ value: i, replace: true, scroll: false });
  const [a, g] = createSignal(false);
  let u;
  const y = (l, d) => {
    d.value === f() && d.state === P() || (u === void 0 && g(true), S$2 = l, u = d, startTransition(() => {
      u === d && (w(u.value), C(u.state), resetErrorBoundaries(), isServer || J[1]((v) => v.filter((L) => L.pending)));
    }).finally(() => {
      u === d && batch(() => {
        S$2 = void 0, l === "navigate" && ge(u), g(false), u = void 0;
      });
    }));
  }, [f, w] = createSignal(r().value), [P, C] = createSignal(r().state), b = Ue$1(f, P, c.queryWrapper), O = [], J = createSignal(isServer ? we() : []), X = createMemo(() => typeof o.transformUrl == "function" ? K$2(t(), o.transformUrl(b.pathname)) : K$2(t(), b.pathname)), Y = () => {
    const l = X(), d = {};
    for (let v = 0; v < l.length; v++) Object.assign(d, l[v].params);
    return d;
  }, de = c.paramsWrapper ? c.paramsWrapper(Y, t) : ie$2(Y), Q = { pattern: i, path: () => i, outlet: () => null, resolvePath(l) {
    return U$3(i, l);
  } };
  return createRenderEffect(on(r, (l) => y("native", l), { defer: true })), { base: Q, location: b, params: de, isRouting: a, renderPath: m, parsePath: h, navigatorFactory: me, matches: X, beforeLeave: p, preloadRoute: ye, singleFlight: o.singleFlight === void 0 ? true : o.singleFlight, submissions: J };
  function pe(l, d, v) {
    untrack(() => {
      if (typeof d == "number") {
        d && (c.go ? c.go(d) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const L = !d || d[0] === "?", { replace: T, resolve: F, scroll: W, state: _ } = { replace: false, resolve: !L, scroll: true, ...v }, j = F ? l.resolvePath(d) : U$3(L && b.pathname || "", d);
      if (j === void 0) throw new Error(`Path '${d}' is not a routable path`);
      if (O.length >= Be$1) throw new Error("Too many redirects");
      const V = f();
      if (j !== V || _ !== P()) if (isServer) {
        const Z = getRequestEvent();
        Z && (Z.response = { status: 302, headers: new Headers({ Location: j }) }), s({ value: j, replace: T, scroll: W, state: _ });
      } else p.confirm(j, v) && (O.push({ value: V, replace: T, scroll: W, state: P() }), y("navigate", { value: j, state: _ }));
    });
  }
  function me(l) {
    return l = l || useContext(le$1) || Q, (d, v) => pe(l, d, v);
  }
  function ge(l) {
    const d = O[0];
    d && (s({ ...l, replace: d.replace, scroll: d.scroll }), O.length = 0);
  }
  function ye(l, d) {
    const v = K$2(t(), l.pathname), L = S$2;
    S$2 = "preload";
    for (let T in v) {
      const { route: F, params: W } = v[T];
      F.component && F.component.preload && F.component.preload();
      const { preload: _ } = F;
      B$3 = true, d && _ && runWithOwner(n(), () => _({ params: W, location: { pathname: l.pathname, search: l.search, hash: l.hash, query: ce$1(l), state: null, key: "" }, intent: "preload" })), B$3 = false;
    }
    S$2 = L;
  }
  function we() {
    const l = getRequestEvent();
    return l && l.router && l.router.submission ? [l.router.submission] : [];
  }
}
function st$2(e, t, n, o) {
  const { base: r, location: s, params: c } = e, { pattern: h, component: m, preload: p } = o().route, i = createMemo(() => o().path);
  m && m.preload && m.preload(), B$3 = true;
  const a = p ? p({ params: c, location: s, intent: S$2 || "initial" }) : void 0;
  return B$3 = false, { parent: t, pattern: h, path: i, outlet: () => m ? createComponent(m, { params: c, location: s, data: a, get children() {
    return n();
  } }) : n(), resolvePath(u) {
    return U$3(r.path(), u, i());
  } };
}
const Ke$2 = "Location", ze$1 = 5e3, Ne$1 = 18e4;
let N$1 = /* @__PURE__ */ new Map();
isServer || setInterval(() => {
  const e = Date.now();
  for (let [t, n] of N$1.entries()) !n[4].count && e - n[0] > Ne$1 && N$1.delete(t);
}, 3e5);
function D$2() {
  if (!isServer) return N$1;
  const e = getRequestEvent();
  if (!e) throw new Error("Cannot find cache context");
  return (e.router || (e.router = {})).cache || (e.router.cache = /* @__PURE__ */ new Map());
}
function k$2(e, t) {
  e.GET && (e = e.GET);
  const n = (...o) => {
    const r = D$2(), s = ke$1(), c = He$1(), m = getOwner() ? fe() : void 0, p = Date.now(), i = t + ee(o);
    let a = r.get(i), g;
    if (isServer) {
      const f = getRequestEvent();
      if (f) {
        const w = (f.router || (f.router = {})).dataOnly;
        if (w) {
          const P = f && (f.router.data || (f.router.data = {}));
          if (P && i in P) return P[i];
          if (Array.isArray(w) && !Ge$2(i, w)) return P[i] = void 0, Promise.resolve();
        }
      }
    }
    if (getListener() && !isServer && (g = true, onCleanup(() => a[4].count--)), a && a[0] && (isServer || s === "native" || a[4].count || Date.now() - a[0] < ze$1)) {
      g && (a[4].count++, a[4][0]()), a[3] === "preload" && s !== "preload" && (a[0] = p);
      let f = a[1];
      return s !== "preload" && (f = "then" in a[1] ? a[1].then(y(false), y(true)) : y(false)(a[1]), !isServer && s === "navigate" && startTransition(() => a[4][1](a[0]))), c && "then" in f && f.catch(() => {
      }), f;
    }
    let u;
    if (!isServer && sharedConfig.has && sharedConfig.has(i) ? (u = sharedConfig.load(i), delete globalThis._$HY.r[i]) : u = e(...o), a ? (a[0] = p, a[1] = u, a[3] = s, !isServer && s === "navigate" && startTransition(() => a[4][1](a[0]))) : (r.set(i, a = [p, u, , s, createSignal(p)]), a[4].count = 0), g && (a[4].count++, a[4][0]()), isServer) {
      const f = getRequestEvent();
      if (f && f.router.dataOnly) return f.router.data[i] = u;
    }
    if (s !== "preload" && (u = "then" in u ? u.then(y(false), y(true)) : y(false)(u)), c && "then" in u && u.catch(() => {
    }), isServer && sharedConfig.context && sharedConfig.context.async && !sharedConfig.context.noHydrate) {
      const f = getRequestEvent();
      (!f || !f.serverOnly) && sharedConfig.context.serialize(i, u);
    }
    return u;
    function y(f) {
      return async (w) => {
        if (w instanceof Response) {
          const P = getRequestEvent();
          if (P) for (const [b, O] of w.headers) b == "set-cookie" ? P.response.headers.append("set-cookie", O) : P.response.headers.set(b, O);
          const C = w.headers.get(Ke$2);
          if (C !== null) {
            m && C.startsWith("/") ? startTransition(() => {
              m(C, { replace: true });
            }) : isServer ? P && (P.response.status = 302) : window.location.href = C;
            return;
          }
          w.customBody && (w = await w.customBody());
        }
        if (f) throw w;
        return a[2] = w, w;
      };
    }
  };
  return n.keyFor = (...o) => t + ee(o), n.key = t, n;
}
k$2.get = (e) => D$2().get(e)[2];
k$2.set = (e, t) => {
  const n = D$2(), o = Date.now();
  let r = n.get(e);
  r ? (r[0] = o, r[1] = Promise.resolve(t), r[2] = t, r[3] = "preload") : (n.set(e, r = [o, Promise.resolve(t), t, "preload", createSignal(o)]), r[4].count = 0);
};
k$2.delete = (e) => D$2().delete(e);
k$2.clear = () => D$2().clear();
function Ge$2(e, t) {
  for (let n of t) if (n && e.startsWith(n)) return true;
  return false;
}
function ee(e) {
  return JSON.stringify(e, (t, n) => Je$2(n) ? Object.keys(n).sort().reduce((o, r) => (o[r] = n[r], o), {}) : n);
}
function Je$2(e) {
  let t;
  return e != null && typeof e == "object" && (!(t = Object.getPrototypeOf(e)) || t === Object.prototype);
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
function Ne(e) {
  let r;
  const t = M(e), n = { duplex: "half", method: e.method, headers: e.headers };
  return e.node.req.body instanceof ArrayBuffer ? new Request(t, { ...n, body: e.node.req.body }) : new Request(t, { ...n, get body() {
    return r || (r = Ze$1(e), r);
  } });
}
function ze(e) {
  var _a;
  return (_a = e.web) != null ? _a : e.web = { request: Ne(e), url: M(e) }, e.web.request;
}
function We$1() {
  return rt$1();
}
const D$1 = /* @__PURE__ */ Symbol("$HTTPEvent");
function Be(e) {
  return typeof e == "object" && (e instanceof H3Event || (e == null ? void 0 : e[D$1]) instanceof H3Event || (e == null ? void 0 : e.__is_event__) === true);
}
function u$1(e) {
  return function(...r) {
    var _a;
    let t = r[0];
    if (Be(t)) r[0] = t instanceof H3Event || t.__is_event__ ? t : t[D$1];
    else {
      if (!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext)) throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      if (t = We$1(), !t) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
      r.unshift(t);
    }
    return e(...r);
  };
}
const M = u$1(getRequestURL), Je$1 = u$1(getRequestIP), $$1 = u$1(setResponseStatus), P = u$1(getResponseStatus), Xe$1 = u$1(getResponseStatusText), S$1 = u$1(getResponseHeaders), H = u$1(getResponseHeader), Qe$1 = u$1(setResponseHeader), N = u$1(appendResponseHeader), Ge$1 = u$1(parseCookies), Ke$1 = u$1(getCookie), Ve$1 = u$1(setCookie), h = u$1(setHeader), Ze$1 = u$1(getRequestWebStream), Ye$1 = u$1(removeResponseHeader), et$1 = u$1(ze);
function tt$1() {
  var _a;
  return getContext("nitro-app", { asyncContext: !!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext), AsyncLocalStorage: AsyncLocalStorage });
}
function rt$1() {
  return tt$1().use().event;
}
const w = "Invariant Violation", { setPrototypeOf: st$1 = function(e, r) {
  return e.__proto__ = r, e;
} } = Object;
let q$1 = class q extends Error {
  constructor(r = w) {
    super(typeof r == "number" ? `${w}: ${r} (see https://github.com/apollographql/invariant-packages)` : r);
    __publicField$1(this, "framesToPop", 1);
    __publicField$1(this, "name", w);
    st$1(this, q.prototype);
  }
};
function nt$1(e, r) {
  if (!e) throw new q$1(r);
}
const k$1 = "solidFetchEvent";
function ot$1(e) {
  return { request: et$1(e), response: ut$1(e), clientAddress: Je$1(e), locals: {}, nativeEvent: e };
}
function at$1(e) {
  return { ...e };
}
function it$1(e) {
  if (!e.context[k$1]) {
    const r = ot$1(e);
    e.context[k$1] = r;
  }
  return e.context[k$1];
}
function A$1(e, r) {
  for (const [t, n] of r.entries()) N(e, t, n);
}
let ct$1 = class ct {
  constructor(r) {
    __publicField$1(this, "event");
    this.event = r;
  }
  get(r) {
    const t = H(this.event, r);
    return Array.isArray(t) ? t.join(", ") : t || null;
  }
  has(r) {
    return this.get(r) !== null;
  }
  set(r, t) {
    return Qe$1(this.event, r, t);
  }
  delete(r) {
    return Ye$1(this.event, r);
  }
  append(r, t) {
    N(this.event, r, t);
  }
  getSetCookie() {
    const r = H(this.event, "Set-Cookie");
    return Array.isArray(r) ? r : [r];
  }
  forEach(r) {
    return Object.entries(S$1(this.event)).forEach(([t, n]) => r(Array.isArray(n) ? n.join(", ") : n, t, this));
  }
  entries() {
    return Object.entries(S$1(this.event)).map(([r, t]) => [r, Array.isArray(t) ? t.join(", ") : t])[Symbol.iterator]();
  }
  keys() {
    return Object.keys(S$1(this.event))[Symbol.iterator]();
  }
  values() {
    return Object.values(S$1(this.event)).map((r) => Array.isArray(r) ? r.join(", ") : r)[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
};
function ut$1(e) {
  return { get status() {
    return P(e);
  }, set status(r) {
    $$1(e, r);
  }, get statusText() {
    return Xe$1(e);
  }, set statusText(r) {
    $$1(e, P(e), r);
  }, headers: new ct$1(e) };
}
const lt$2 = k$2(() => t$1(), "materials"), pt$2 = { preload: () => lt$2() }, dt$2 = k$2(() => t$1(), "materials"), ft$2 = k$2(() => r$1(), "trabajos"), mt$2 = { preload: () => Promise.all([dt$2(), ft$2()]) }, ht$2 = k$2((e) => o$1(e), "material"), gt$2 = { preload: ({ params: e }) => ht$2(e.slug) }, yt$1 = k$2(() => t$1(), "materials"), Rt$2 = { preload: () => yt$1() }, St$2 = k$2(() => r$1(), "trabajos"), $t$1 = k$2(() => t$1(), "materials"), bt$2 = { preload: () => Promise.all([St$2(), $t$1()]) }, z$1 = [{ page: true, $component: { src: "src/routes/cotizacion.tsx?pick=default&pick=$css", build: () => import('../build/cotizacion.mjs'), import: () => import('../build/cotizacion.mjs') }, $$route: { require: () => ({ route: pt$2 }), src: "src/routes/cotizacion.tsx?pick=route" }, path: "/cotizacion", filePath: "/Users/hector/Documents/granite_concepts/src/routes/cotizacion.tsx" }, { page: true, $component: { src: "src/routes/index.tsx?pick=default&pick=$css", build: () => import('../build/index.mjs'), import: () => import('../build/index.mjs') }, $$route: { require: () => ({ route: mt$2 }), src: "src/routes/index.tsx?pick=route" }, path: "/", filePath: "/Users/hector/Documents/granite_concepts/src/routes/index.tsx" }, { page: true, $component: { src: "src/routes/materiales/[slug].tsx?pick=default&pick=$css", build: () => import('../build/_slug_.mjs'), import: () => import('../build/_slug_.mjs') }, $$route: { require: () => ({ route: gt$2 }), src: "src/routes/materiales/[slug].tsx?pick=route" }, path: "/materiales/:slug", filePath: "/Users/hector/Documents/granite_concepts/src/routes/materiales/[slug].tsx" }, { page: true, $component: { src: "src/routes/materiales/index.tsx?pick=default&pick=$css", build: () => import('../build/index2.mjs'), import: () => import('../build/index2.mjs') }, $$route: { require: () => ({ route: Rt$2 }), src: "src/routes/materiales/index.tsx?pick=route" }, path: "/materiales/", filePath: "/Users/hector/Documents/granite_concepts/src/routes/materiales/index.tsx" }, { page: false, $GET: { src: "src/routes/sitemap.xml.ts?pick=GET", build: () => import('../build/sitemap.xml.mjs'), import: () => import('../build/sitemap.xml.mjs') }, $HEAD: { src: "src/routes/sitemap.xml.ts?pick=GET", build: () => import('../build/sitemap.xml.mjs'), import: () => import('../build/sitemap.xml.mjs') }, path: "/sitemap.xml", filePath: "/Users/hector/Documents/granite_concepts/src/routes/sitemap.xml.ts" }, { page: true, $component: { src: "src/routes/trabajos/[slug].tsx?pick=default&pick=$css", build: () => import('../build/_slug_2.mjs'), import: () => import('../build/_slug_2.mjs') }, path: "/trabajos/:slug", filePath: "/Users/hector/Documents/granite_concepts/src/routes/trabajos/[slug].tsx" }, { page: true, $component: { src: "src/routes/trabajos/index.tsx?pick=default&pick=$css", build: () => import('../build/index3.mjs'), import: () => import('../build/index3.mjs') }, $$route: { require: () => ({ route: bt$2 }), src: "src/routes/trabajos/index.tsx?pick=route" }, path: "/trabajos/", filePath: "/Users/hector/Documents/granite_concepts/src/routes/trabajos/index.tsx" }], xt$2 = wt$2(z$1.filter((e) => e.page));
function wt$2(e) {
  function r(t, n, o, a) {
    const i = Object.values(t).find((c) => o.startsWith(c.id + "/"));
    return i ? (r(i.children || (i.children = []), n, o.slice(i.id.length)), t) : (t.push({ ...n, id: o, path: o.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/") }), t);
  }
  return e.sort((t, n) => t.path.length - n.path.length).reduce((t, n) => r(t, n, n.path, n.path), []);
}
function kt$1(e) {
  return e.$HEAD || e.$GET || e.$POST || e.$PUT || e.$PATCH || e.$DELETE;
}
createRouter$1({ routes: z$1.reduce((e, r) => {
  if (!kt$1(r)) return e;
  let t = r.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (n, o) => `**:${o}`).split("/").map((n) => n.startsWith(":") || n.startsWith("*") ? n : encodeURIComponent(n)).join("/");
  if (/:[^/]*\?/g.test(t)) throw new Error(`Optional parameters are not supported in API routes: ${t}`);
  if (e[t]) throw new Error(`Duplicate API routes for "${t}" found at "${e[t].route.path}" and "${r.path}"`);
  return e[t] = { route: r }, e;
}, {}) });
var Tt$2 = " ";
const qt$1 = { style: (e) => ssrElement("style", e.attrs, () => e.children, true), link: (e) => ssrElement("link", e.attrs, void 0, true), script: (e) => e.attrs.src ? ssrElement("script", mergeProps(() => e.attrs, { get id() {
  return e.key;
} }), () => ssr(Tt$2), true) : null, noscript: (e) => ssrElement("noscript", e.attrs, () => escape(e.children), true) };
function Et$2(e, r) {
  let { tag: t, attrs: { key: n, ...o } = { key: void 0 }, children: a } = e;
  return qt$1[t]({ attrs: { ...o, nonce: r }, key: n, children: a });
}
function Pt$2(e, r, t, n = "default") {
  return lazy(async () => {
    var _a;
    {
      const a = (await e.import())[n], c = (await ((_a = r.inputs) == null ? void 0 : _a[e.src].assets())).filter((l) => l.tag === "style" || l.attrs.rel === "stylesheet");
      return { default: (l) => [...c.map((g) => Et$2(g)), createComponent(a, l)] };
    }
  });
}
function W() {
  function e(t) {
    return { ...t, ...t.$$route ? t.$$route.require().route : void 0, info: { ...t.$$route ? t.$$route.require().route.info : {}, filesystem: true }, component: t.$component && Pt$2(t.$component, globalThis.MANIFEST.client, globalThis.MANIFEST.ssr), children: t.children ? t.children.map(e) : void 0 };
  }
  return xt$2.map(e);
}
let C;
const Vt$1 = isServer ? () => getRequestEvent().routes : () => C || (C = W());
function Ht$1(e) {
  const r = Ke$1(e.nativeEvent, "flash");
  if (r) try {
    let t = JSON.parse(r);
    if (!t || !t.result) return;
    const n = [...t.input.slice(0, -1), new Map(t.input[t.input.length - 1])], o = t.error ? new Error(t.result) : t.result;
    return { input: n, url: t.url, pending: false, result: t.thrown ? void 0 : o, error: t.thrown ? o : void 0 };
  } catch (t) {
    console.error(t);
  } finally {
    Ve$1(e.nativeEvent, "flash", "", { maxAge: 0 });
  }
}
async function At$2(e) {
  const r = globalThis.MANIFEST.client;
  return globalThis.MANIFEST.ssr, e.response.headers.set("Content-Type", "text/html"), Object.assign(e, { manifest: await r.json(), assets: [...await r.inputs[r.handler].assets()], router: { submission: Ht$1(e) }, routes: W(), complete: false, $islands: /* @__PURE__ */ new Set() });
}
const Ct$2 = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function Ft$1(e) {
  return e.status && Ct$2.has(e.status) ? e.status : 302;
}
const Lt$2 = {}, E = [AbortSignalPlugin, CustomEventPlugin, DOMExceptionPlugin, EventPlugin, FormDataPlugin, HeadersPlugin, ReadableStreamPlugin, RequestPlugin, ResponsePlugin, URLSearchParamsPlugin, URLPlugin], Ut$1 = 64, B$2 = Feature.RegExp;
function J$2(e) {
  const r = new TextEncoder().encode(e), t = r.length, n = t.toString(16), o = "00000000".substring(0, 8 - n.length) + n, a = new TextEncoder().encode(`;0x${o};`), i = new Uint8Array(12 + t);
  return i.set(a), i.set(r, 12), i;
}
function F$1(e, r) {
  return new ReadableStream({ start(t) {
    crossSerializeStream(r, { scopeId: e, plugins: E, onSerialize(n, o) {
      t.enqueue(J$2(o ? `(${getCrossReferenceHeader(e)},${n})` : n));
    }, onDone() {
      t.close();
    }, onError(n) {
      t.error(n);
    } });
  } });
}
function _t$1(e) {
  return new ReadableStream({ start(r) {
    toCrossJSONStream(e, { disabledFeatures: B$2, depthLimit: Ut$1, plugins: E, onParse(t) {
      r.enqueue(J$2(JSON.stringify(t)));
    }, onDone() {
      r.close();
    }, onError(t) {
      r.error(t);
    } });
  } });
}
async function L$1(e) {
  return fromJSON(JSON.parse(e), { plugins: E, disabledFeatures: B$2 });
}
async function jt$2(e) {
  const r = it$1(e), t = r.request, n = t.headers.get("X-Server-Id"), o = t.headers.get("X-Server-Instance"), a = t.headers.has("X-Single-Flight"), i = new URL(t.url);
  let c, d;
  if (n) nt$1(typeof n == "string", "Invalid server function"), [c, d] = decodeURIComponent(n).split("#");
  else if (c = i.searchParams.get("id"), d = i.searchParams.get("name"), !c || !d) return new Response(null, { status: 404 });
  const l = Lt$2[c];
  let g;
  if (!l) return new Response(null, { status: 404 });
  g = await l.importer();
  const X = g[l.functionName];
  let f = [];
  if (!o || e.method === "GET") {
    const s = i.searchParams.get("args");
    if (s) {
      const p = await L$1(s);
      for (const y of p) f.push(y);
    }
  }
  if (e.method === "POST") {
    const s = t.headers.get("content-type"), p = e.node.req, y = p instanceof ReadableStream, Q = p.body instanceof ReadableStream, G = y && p.locked || Q && p.body.locked, K = y ? p : p.body, x = G ? t : new Request(t, { ...t, body: K });
    t.headers.get("x-serialized") ? f = await L$1(await x.text()) : (s == null ? void 0 : s.startsWith("multipart/form-data")) || (s == null ? void 0 : s.startsWith("application/x-www-form-urlencoded")) ? f.push(await x.formData()) : (s == null ? void 0 : s.startsWith("application/json")) && (f = await x.json());
  }
  try {
    let s = await provideRequestEvent(r, async () => (sharedConfig.context = { event: r }, r.locals.serverFunctionMeta = { id: c + "#" + d }, X(...f)));
    if (a && o && (s = await _(r, s)), s instanceof Response) {
      if (s.headers && s.headers.has("X-Content-Raw")) return s;
      o && (s.headers && A$1(e, s.headers), s.status && (s.status < 300 || s.status >= 400) && $$1(e, s.status), s.customBody ? s = await s.customBody() : s.body == null && (s = null));
    }
    if (!o) return U$2(s, t, f);
    return h(e, "x-serialized", "true"), h(e, "content-type", "text/javascript"), F$1(o, s);
    return _t$1(s);
  } catch (s) {
    if (s instanceof Response) a && o && (s = await _(r, s)), s.headers && A$1(e, s.headers), s.status && (!o || s.status < 300 || s.status >= 400) && $$1(e, s.status), s.customBody ? s = s.customBody() : s.body == null && (s = null), h(e, "X-Error", "true");
    else if (o) {
      const p = s instanceof Error ? s.message : typeof s == "string" ? s : "true";
      h(e, "X-Error", p.replace(/[\r\n]+/g, ""));
    } else s = U$2(s, t, f, true);
    return o ? (h(e, "x-serialized", "true"), h(e, "content-type", "text/javascript"), F$1(o, s)) : s;
  }
}
function U$2(e, r, t, n) {
  const o = new URL(r.url), a = e instanceof Error;
  let i = 302, c;
  return e instanceof Response ? (c = new Headers(e.headers), e.headers.has("Location") && (c.set("Location", new URL(e.headers.get("Location"), o.origin + "").toString()), i = Ft$1(e))) : c = new Headers({ Location: new URL(r.headers.get("referer")).toString() }), e && c.append("Set-Cookie", `flash=${encodeURIComponent(JSON.stringify({ url: o.pathname + o.search, result: a ? e.message : e, thrown: n, error: a, input: [...t.slice(0, -1), [...t[t.length - 1].entries()]] }))}; Secure; HttpOnly;`), new Response(null, { status: i, headers: c });
}
let v;
function It$1(e) {
  var _a;
  const r = new Headers(e.request.headers), t = Ge$1(e.nativeEvent), n = e.response.headers.getSetCookie();
  r.delete("cookie");
  let o = false;
  return ((_a = e.nativeEvent.node) == null ? void 0 : _a.req) && (o = true, e.nativeEvent.node.req.headers.cookie = ""), n.forEach((a) => {
    if (!a) return;
    const { maxAge: i, expires: c, name: d, value: l } = parseSetCookie$1(a);
    if (i != null && i <= 0) {
      delete t[d];
      return;
    }
    if (c != null && c.getTime() <= Date.now()) {
      delete t[d];
      return;
    }
    t[d] = l;
  }), Object.entries(t).forEach(([a, i]) => {
    r.append("cookie", `${a}=${i}`), o && (e.nativeEvent.node.req.headers.cookie += `${a}=${i};`);
  }), r;
}
async function _(e, r) {
  let t, n = new URL(e.request.headers.get("referer")).toString();
  r instanceof Response && (r.headers.has("X-Revalidate") && (t = r.headers.get("X-Revalidate").split(",")), r.headers.has("Location") && (n = new URL(r.headers.get("Location"), new URL(e.request.url).origin + "").toString()));
  const o = at$1(e);
  return o.request = new Request(n, { headers: It$1(e) }), await provideRequestEvent(o, async () => {
    await At$2(o), v || (v = (await import('../build/app-DoL6yWtQ.mjs')).default), o.router.dataOnly = t || true, o.router.previousUrl = e.request.headers.get("referer");
    try {
      renderToString(() => {
        sharedConfig.context.event = o, v();
      });
    } catch (c) {
      console.log(c);
    }
    const a = o.router.data;
    if (!a) return r;
    let i = false;
    for (const c in a) a[c] === void 0 ? delete a[c] : i = true;
    return i && (r instanceof Response ? r.customBody && (a._$value = r.customBody()) : (a._$value = r, r = new Response(null, { status: 200 })), r.customBody = () => a, r.headers.set("X-Single-Flight", "true")), r;
  });
}
const Zt$1 = eventHandler(jt$2);

const a = ["cocina", "bano", "isla", "barra"], n = [{ slug: "blanco-carrara", nombre: "Blanco Carrara", tipo: "marmol", tono: "claro", veta: "veta suave", dureza: "media", nivel: 2, desc: { es: "M\xE1rmol blanco perla con vetas grises suaves y plumosas, acabado honed sutil.", en: "Pearl-white marble with soft feathery gray veining, subtle honed finish." }, swatch: "/img/swatches/blanco-carrara", escenas: [...a] }, { slug: "calacatta-oro", nombre: "Calacatta Oro", tipo: "cuarzo", tono: "calido", veta: "veta dram\xE1tica", dureza: "muy-alta", nivel: 3, desc: { es: "Cuarzo blanco c\xE1lido con vetas doradas y grises dram\xE1ticas en diagonal.", en: "Warm white quartz with bold dramatic gold and gray diagonal veins." }, swatch: "/img/swatches/calacatta-oro", escenas: [...a] }, { slug: "blue-dunes", nombre: "Blue Dunes", tipo: "granito", tono: "medio", veta: "bandeado fluido", dureza: "muy-alta", nivel: 3, desc: { es: "Granito ex\xF3tico con bandas fluidas de gris, taupe y arena que cruzan la losa en diagonal, salpicado de cristales plateados.", en: "Exotic granite with flowing bands of grey, taupe and sand crossing the slab diagonally, flecked with silver crystals." }, swatch: "/img/swatches/blue-dunes", escenas: [...a] }, { slug: "smithtown", nombre: "Smithtown", tipo: "cuarzo", tono: "claro", veta: "veta gris difusa", dureza: "muy-alta", nivel: 2, desc: { es: "Cuarzo blanco brillante con una red de vetas grises finas y una veta central m\xE1s marcada, estilo m\xE1rmol.", en: "Bright white quartz with a network of fine grey veins and a bolder central vein, marble look." }, swatch: "/img/swatches/smithtown", escenas: [...a] }, { slug: "luna-pearl", nombre: "Luna Pearl", tipo: "granito", tono: "claro", veta: "moteado gris y negro", dureza: "muy-alta", nivel: 1, desc: { es: "Granito Luna Pearl con moteado uniforme en blanco, gris y perla salpicado de peque\xF1os puntos negros; un cl\xE1sico vers\xE1til.", en: "Luna Pearl granite with uniform white, grey and pearl speckling flecked with small black dots; a versatile classic." }, swatch: "/img/swatches/luna-pearl", escenas: [...a] }];
async function t() {
  return n;
}
async function o(e) {
  return (await t()).find((s) => s.slug === e);
}
async function r() {
  return [];
}

function We() {
  let t = /* @__PURE__ */ new Set();
  function n(o) {
    return t.add(o), () => t.delete(o);
  }
  let e = false;
  function r(o, a) {
    if (e) return !(e = false);
    const s = { to: o, options: a, defaultPrevented: false, preventDefault: () => s.defaultPrevented = true };
    for (const l of t) l.listener({ ...s, from: l.location, retry: (p) => {
      p && (e = true), l.navigate(o, { ...a, resolve: false });
    } });
    return !s.defaultPrevented;
  }
  return { subscribe: n, confirm: r };
}
let G$1;
function me() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), G$1 = window.history.state._depth;
}
isServer || me();
function bt$1(t) {
  return { ...t, _depth: window.history.state && window.history.state._depth };
}
function wt$1(t, n) {
  let e = false;
  return () => {
    const r = G$1;
    me();
    const o = r == null ? null : G$1 - r;
    if (e) {
      e = false;
      return;
    }
    o && n(o) ? (e = true, window.history.go(-o)) : t();
  };
}
const _e = /^(?:[a-z0-9]+:)?\/\//i, ke = /^\/+|(\/)\/+$/g, Ke = "http://sr";
function z(t, n = false) {
  const e = t.replace(ke, "$1");
  return e ? n || /^[?#]/.test(e) ? e : "/" + e : "";
}
function k(t, n, e) {
  if (_e.test(n)) return;
  const r = z(t), o = e && z(e);
  let a = "";
  return !o || n.startsWith("/") ? a = r : o.toLowerCase().indexOf(r.toLowerCase()) !== 0 ? a = r + o : a = o, (a || "/") + z(n, !a);
}
function He(t, n) {
  if (t == null) throw new Error(n);
  return t;
}
function Ue(t, n) {
  return z(t).replace(/\/*(\*.*)?$/g, "") + z(n);
}
function ge(t) {
  const n = {};
  return t.searchParams.forEach((e, r) => {
    r in n ? Array.isArray(n[r]) ? n[r].push(e) : n[r] = [n[r], e] : n[r] = e;
  }), n;
}
function Ve(t, n, e) {
  const [r, o] = t.split("/*", 2), a = r.split("/").filter(Boolean), s = a.length;
  return (l) => {
    const p = l.split("/").filter(Boolean), f = p.length - s;
    if (f < 0 || f > 0 && o === void 0 && !n) return null;
    const i = { path: s ? "" : "/", params: {} }, c = (g) => e === void 0 ? void 0 : e[g];
    for (let g = 0; g < s; g++) {
      const u = a[g], y = u[0] === ":", h = y ? p[g] : p[g].toLowerCase(), v = y ? u.slice(1) : u.toLowerCase();
      if (y && V$1(h, c(v))) i.params[v] = h;
      else if (y || !V$1(h, v)) return null;
      i.path += `/${h}`;
    }
    if (o) {
      const g = f ? p.slice(-f).join("/") : "";
      if (V$1(g, c(o))) i.params[o] = g;
      else return null;
    }
    return i;
  };
}
function V$1(t, n) {
  const e = (r) => r === t;
  return n === void 0 ? true : typeof n == "string" ? e(n) : typeof n == "function" ? n(t) : Array.isArray(n) ? n.some(e) : n instanceof RegExp ? n.test(t) : false;
}
function De(t) {
  const [n, e] = t.pattern.split("/*", 2), r = n.split("/").filter(Boolean);
  return r.reduce((o, a) => o + (a.startsWith(":") ? 2 : 3), r.length - (e === void 0 ? 0 : 1));
}
function ye(t) {
  const n = /* @__PURE__ */ new Map(), e = getOwner();
  return new Proxy({}, { get(r, o) {
    return n.has(o) || runWithOwner(e, () => n.set(o, createMemo(() => t()[o]))), n.get(o)();
  }, getOwnPropertyDescriptor() {
    return { enumerable: true, configurable: true };
  }, ownKeys() {
    return Reflect.ownKeys(t());
  }, has(r, o) {
    return o in t();
  } });
}
function Ge(t, n) {
  const e = new URLSearchParams(t);
  Object.entries(n).forEach(([o, a]) => {
    a == null || a === "" || a instanceof Array && !a.length ? e.delete(o) : a instanceof Array ? (e.delete(o), a.forEach((s) => {
      e.append(o, String(s));
    })) : e.set(o, String(a));
  });
  const r = e.toString();
  return r ? `?${r}` : "";
}
function ve(t) {
  let n = /(\/?\:[^\/]+)\?/.exec(t);
  if (!n) return [t];
  let e = t.slice(0, n.index), r = t.slice(n.index + n[0].length);
  const o = [e, e += n[1]];
  for (; n = /^(\/\:[^\/]+)\?/.exec(r); ) o.push(e += n[1]), r = r.slice(n[0].length);
  return ve(r).reduce((a, s) => [...a, ...o.map((l) => l + s)], []);
}
const Ye = 100, Je = createContext$1(), be = createContext$1(), $ = () => He(useContext(Je), "<A> and 'use' router primitives can be only used inside a Route."), Qe = () => useContext(be) || $().base, Pt$1 = (t) => {
  const n = Qe();
  return createMemo(() => n.resolvePath(t()));
}, Et$1 = (t) => {
  const n = $();
  return createMemo(() => {
    const e = t();
    return e !== void 0 ? n.renderPath(e) : e;
  });
}, we = () => $().navigatorFactory(), Xe = () => $().location, xt$1 = () => $().params, Ct$1 = () => {
  const t = Xe(), n = we(), e = (r, o) => {
    const a = untrack(() => Ge(t.search, r) + t.hash);
    n(a, { scroll: false, resolve: false, ...o });
  };
  return [t.query, e];
};
function Ze(t, n = "") {
  const { component: e, preload: r, load: o, children: a, info: s } = t, l = !a || Array.isArray(a) && !a.length, p = { key: t, component: e, preload: r || o, info: s };
  return Pe(t.path).reduce((f, i) => {
    for (const c of ve(i)) {
      const g = Ue(n, c);
      let u = l ? g : g.split("/*", 1)[0];
      u = u.split("/").map((y) => y.startsWith(":") || y.startsWith("*") ? y : encodeURIComponent(y)).join("/"), f.push({ ...p, originalPath: i, pattern: u, matcher: Ve(u, !l, t.matchFilters) });
    }
    return f;
  }, []);
}
function et(t, n = 0) {
  return { routes: t, score: De(t[t.length - 1]) * 1e4 - n, matcher(e) {
    const r = [];
    for (let o = t.length - 1; o >= 0; o--) {
      const a = t[o], s = a.matcher(e);
      if (!s) return null;
      r.unshift({ ...s, route: a });
    }
    return r;
  } };
}
function Pe(t) {
  return Array.isArray(t) ? t : [t];
}
function tt(t, n = "", e = [], r = []) {
  const o = Pe(t);
  for (let a = 0, s = o.length; a < s; a++) {
    const l = o[a];
    if (l && typeof l == "object") {
      l.hasOwnProperty("path") || (l.path = "");
      const p = Ze(l, n);
      for (const f of p) {
        e.push(f);
        const i = Array.isArray(l.children) && l.children.length === 0;
        if (l.children && !i) tt(l.children, f.pattern, e, r);
        else {
          const c = et([...e], r.length);
          r.push(c);
        }
        e.pop();
      }
    }
  }
  return e.length ? r : r.sort((a, s) => s.score - a.score);
}
function D(t, n) {
  for (let e = 0, r = t.length; e < r; e++) {
    const o = t[e].matcher(n);
    if (o) return o;
  }
  return [];
}
function nt(t, n, e) {
  const r = new URL(Ke), o = createMemo((i) => {
    const c = t();
    try {
      return new URL(c, r);
    } catch {
      return console.error(`Invalid path ${c}`), i;
    }
  }, r, { equals: (i, c) => i.href === c.href }), a = createMemo(() => o().pathname), s = createMemo(() => o().search, true), l = createMemo(() => o().hash), p = () => "", f = on(s, () => ge(o()));
  return { get pathname() {
    return a();
  }, get search() {
    return s();
  }, get hash() {
    return l();
  }, get state() {
    return n();
  }, get key() {
    return p();
  }, query: e ? e(f) : ye(f) };
}
let S;
function rt() {
  return S;
}
let q = false;
function ot() {
  return q;
}
function Tt$1(t) {
  q = t;
}
function St$1(t, n, e, r = {}) {
  const { signal: [o, a], utils: s = {} } = t, l = s.parsePath || ((d) => d), p = s.renderPath || ((d) => d), f = s.beforeLeave || We(), i = k("", r.base || "");
  if (i === void 0) throw new Error(`${i} is not a valid base path`);
  i && !o().value && a({ value: i, replace: true, scroll: false });
  const [c, g] = createSignal(false);
  let u;
  const y = (d, m) => {
    m.value === h() && m.state === w() || (u === void 0 && g(true), S = d, u = m, startTransition(() => {
      u === m && (v(u.value), R(u.state), resetErrorBoundaries(), isServer || X[1]((P) => P.filter((L) => L.pending)));
    }).finally(() => {
      u === m && batch(() => {
        S = void 0, d === "navigate" && Re(u), g(false), u = void 0;
      });
    }));
  }, [h, v] = createSignal(o().value), [w, R] = createSignal(o().state), C = nt(h, w, s.queryWrapper), T = [], X = createSignal(isServer ? Me() : []), Z = createMemo(() => typeof r.transformUrl == "function" ? D(n(), r.transformUrl(C.pathname)) : D(n(), C.pathname)), ee = () => {
    const d = Z(), m = {};
    for (let P = 0; P < d.length; P++) Object.assign(m, d[P].params);
    return m;
  }, Se = s.paramsWrapper ? s.paramsWrapper(ee, n) : ye(ee), te = { pattern: i, path: () => i, outlet: () => null, resolvePath(d) {
    return k(i, d);
  } };
  return createRenderEffect(on(o, (d) => y("native", d), { defer: true })), { base: te, location: C, params: Se, isRouting: c, renderPath: p, parsePath: l, navigatorFactory: Oe, matches: Z, beforeLeave: f, preloadRoute: Le, singleFlight: r.singleFlight === void 0 ? true : r.singleFlight, submissions: X };
  function je(d, m, P) {
    untrack(() => {
      if (typeof m == "number") {
        m && (s.go ? s.go(m) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const L = !m || m[0] === "?", { replace: F, resolve: M, scroll: W, state: A } = { replace: false, resolve: !L, scroll: true, ...P }, I = M ? d.resolvePath(m) : k(L && C.pathname || "", m);
      if (I === void 0) throw new Error(`Path '${m}' is not a routable path`);
      if (T.length >= Ye) throw new Error("Too many redirects");
      const ne = h();
      if (I !== ne || A !== w()) if (isServer) {
        const re = getRequestEvent();
        re && (re.response = { status: 302, headers: new Headers({ Location: I }) }), a({ value: I, replace: F, scroll: W, state: A });
      } else f.confirm(I, P) && (T.push({ value: ne, replace: F, scroll: W, state: w() }), y("navigate", { value: I, state: A }));
    });
  }
  function Oe(d) {
    return d = d || useContext(be) || te, (m, P) => je(d, m, P);
  }
  function Re(d) {
    const m = T[0];
    m && (a({ ...d, replace: m.replace, scroll: m.scroll }), T.length = 0);
  }
  function Le(d, m) {
    const P = D(n(), d.pathname), L = S;
    S = "preload";
    for (let F in P) {
      const { route: M, params: W } = P[F];
      M.component && M.component.preload && M.component.preload();
      const { preload: A } = M;
      q = true, m && A && runWithOwner(e(), () => A({ params: W, location: { pathname: d.pathname, search: d.search, hash: d.hash, query: ge(d), state: null, key: "" }, intent: "preload" })), q = false;
    }
    S = L;
  }
  function Me() {
    const d = getRequestEvent();
    return d && d.router && d.router.submission ? [d.router.submission] : [];
  }
}
function jt$1(t, n, e, r) {
  const { base: o, location: a, params: s } = t, { pattern: l, component: p, preload: f } = r().route, i = createMemo(() => r().path);
  p && p.preload && p.preload(), q = true;
  const c = f ? f({ params: s, location: a, intent: S || "initial" }) : void 0;
  return q = false, { parent: n, pattern: l, path: i, outlet: () => p ? createComponent(p, { params: s, location: a, data: c, get children() {
    return e();
  } }) : e(), resolvePath(u) {
    return k(o.path(), u, i());
  } };
}
const at = "Location", st = 5e3, it = 18e4;
let Y$1 = /* @__PURE__ */ new Map();
isServer || setInterval(() => {
  const t = Date.now();
  for (let [n, e] of Y$1.entries()) !e[4].count && t - e[0] > it && Y$1.delete(n);
}, 3e5);
function B$1() {
  if (!isServer) return Y$1;
  const t = getRequestEvent();
  if (!t) throw new Error("Cannot find cache context");
  return (t.router || (t.router = {})).cache || (t.router.cache = /* @__PURE__ */ new Map());
}
function U$1(t, n) {
  t.GET && (t = t.GET);
  const e = (...r) => {
    const o = B$1(), a = rt(), s = ot(), p = getOwner() ? we() : void 0, f = Date.now(), i = n + ie$1(r);
    let c = o.get(i), g;
    if (isServer) {
      const h = getRequestEvent();
      if (h) {
        const v = (h.router || (h.router = {})).dataOnly;
        if (v) {
          const w = h && (h.router.data || (h.router.data = {}));
          if (w && i in w) return w[i];
          if (Array.isArray(v) && !ct(i, v)) return w[i] = void 0, Promise.resolve();
        }
      }
    }
    if (getListener() && !isServer && (g = true, onCleanup(() => c[4].count--)), c && c[0] && (isServer || a === "native" || c[4].count || Date.now() - c[0] < st)) {
      g && (c[4].count++, c[4][0]()), c[3] === "preload" && a !== "preload" && (c[0] = f);
      let h = c[1];
      return a !== "preload" && (h = "then" in c[1] ? c[1].then(y(false), y(true)) : y(false)(c[1]), !isServer && a === "navigate" && startTransition(() => c[4][1](c[0]))), s && "then" in h && h.catch(() => {
      }), h;
    }
    let u;
    if (!isServer && sharedConfig.has && sharedConfig.has(i) ? (u = sharedConfig.load(i), delete globalThis._$HY.r[i]) : u = t(...r), c ? (c[0] = f, c[1] = u, c[3] = a, !isServer && a === "navigate" && startTransition(() => c[4][1](c[0]))) : (o.set(i, c = [f, u, , a, createSignal(f)]), c[4].count = 0), g && (c[4].count++, c[4][0]()), isServer) {
      const h = getRequestEvent();
      if (h && h.router.dataOnly) return h.router.data[i] = u;
    }
    if (a !== "preload" && (u = "then" in u ? u.then(y(false), y(true)) : y(false)(u)), s && "then" in u && u.catch(() => {
    }), isServer && sharedConfig.context && sharedConfig.context.async && !sharedConfig.context.noHydrate) {
      const h = getRequestEvent();
      (!h || !h.serverOnly) && sharedConfig.context.serialize(i, u);
    }
    return u;
    function y(h) {
      return async (v) => {
        if (v instanceof Response) {
          const w = getRequestEvent();
          if (w) for (const [C, T] of v.headers) C == "set-cookie" ? w.response.headers.append("set-cookie", T) : w.response.headers.set(C, T);
          const R = v.headers.get(at);
          if (R !== null) {
            p && R.startsWith("/") ? startTransition(() => {
              p(R, { replace: true });
            }) : isServer ? w && (w.response.status = 302) : window.location.href = R;
            return;
          }
          v.customBody && (v = await v.customBody());
        }
        if (h) throw v;
        return c[2] = v, v;
      };
    }
  };
  return e.keyFor = (...r) => n + ie$1(r), e.key = n, e;
}
U$1.get = (t) => B$1().get(t)[2];
U$1.set = (t, n) => {
  const e = B$1(), r = Date.now();
  let o = e.get(t);
  o ? (o[0] = r, o[1] = Promise.resolve(n), o[2] = n, o[3] = "preload") : (e.set(t, o = [r, Promise.resolve(n), n, "preload", createSignal(r)]), o[4].count = 0);
};
U$1.delete = (t) => B$1().delete(t);
U$1.clear = () => B$1().clear();
function ct(t, n) {
  for (let e of n) if (e && t.startsWith(e)) return true;
  return false;
}
function ie$1(t) {
  return JSON.stringify(t, (n, e) => lt$1(e) ? Object.keys(e).sort().reduce((r, o) => (r[o] = e[o], r), {}) : e);
}
function lt$1(t) {
  let n;
  return t != null && typeof t == "object" && (!(n = Object.getPrototypeOf(t)) || n === Object.prototype);
}
const Ee = createContext$1(), xe = ["title", "meta"], J$1 = [], Q$1 = ["name", "http-equiv", "content", "charset", "media"].concat(["property"]), K$1 = (t, n) => {
  const e = Object.fromEntries(Object.entries(t.props).filter(([r]) => n.includes(r)).sort());
  return (Object.hasOwn(e, "name") || Object.hasOwn(e, "property")) && (e.name = e.name || e.property, delete e.property), t.tag + JSON.stringify(e);
};
function ut() {
  if (!sharedConfig.context) {
    const e = document.head.querySelectorAll("[data-sm]");
    Array.prototype.forEach.call(e, (r) => r.parentNode.removeChild(r));
  }
  const t = /* @__PURE__ */ new Map();
  function n(e) {
    if (e.ref) return e.ref;
    let r = document.querySelector(`[data-sm="${e.id}"]`);
    return r ? (r.tagName.toLowerCase() !== e.tag && (r.parentNode && r.parentNode.removeChild(r), r = document.createElement(e.tag)), r.removeAttribute("data-sm")) : r = document.createElement(e.tag), r;
  }
  return { addTag(e) {
    if (xe.indexOf(e.tag) !== -1) {
      const a = e.tag === "title" ? J$1 : Q$1, s = K$1(e, a);
      t.has(s) || t.set(s, []);
      let l = t.get(s), p = l.length;
      l = [...l, e], t.set(s, l);
      let f = n(e);
      e.ref = f, spread(f, e.props);
      let i = null;
      for (var r = p - 1; r >= 0; r--) if (l[r] != null) {
        i = l[r];
        break;
      }
      return f.parentNode != document.head && document.head.appendChild(f), i && i.ref && i.ref.parentNode && document.head.removeChild(i.ref), p;
    }
    let o = n(e);
    return e.ref = o, spread(o, e.props), o.parentNode != document.head && document.head.appendChild(o), -1;
  }, removeTag(e, r) {
    const o = e.tag === "title" ? J$1 : Q$1, a = K$1(e, o);
    if (e.ref) {
      const s = t.get(a);
      if (s) {
        if (e.ref.parentNode) {
          e.ref.parentNode.removeChild(e.ref);
          for (let l = r - 1; l >= 0; l--) s[l] != null && document.head.appendChild(s[l].ref);
        }
        s[r] = null, t.set(a, s);
      } else e.ref.parentNode && e.ref.parentNode.removeChild(e.ref);
    }
  } };
}
function dt$1() {
  const t = [];
  return useAssets(() => ssr(ht$1(t))), { addTag(n) {
    if (xe.indexOf(n.tag) !== -1) {
      const e = n.tag === "title" ? J$1 : Q$1, r = K$1(n, e), o = t.findIndex((a) => a.tag === n.tag && K$1(a, e) === r);
      o !== -1 && t.splice(o, 1);
    }
    return t.push(n), t.length;
  }, removeTag(n, e) {
  } };
}
const Ot$1 = (t) => {
  const n = isServer ? dt$1() : ut();
  return createComponent$1(Ee.Provider, { value: n, get children() {
    return t.children;
  } });
}, Ce = (t, n, e) => (ft$1({ tag: t, props: n, setting: e, id: createUniqueId(), get name() {
  return n.name || n.property;
} }), null);
function ft$1(t) {
  const n = useContext(Ee);
  if (!n) throw new Error("<MetaProvider /> should be in the tree");
  createRenderEffect(() => {
    const e = n.addTag(t);
    onCleanup(() => n.removeTag(t, e));
  });
}
function ht$1(t) {
  return t.map((n) => {
    var _a, _b;
    const r = Object.keys(n.props).map((a) => a === "children" ? "" : ` ${a}="${escape(n.props[a], true)}"`).join("");
    let o = n.props.children;
    return Array.isArray(o) && (o = o.join("")), ((_a = n.setting) == null ? void 0 : _a.close) ? `<${n.tag} data-sm="${n.id}"${r}>${((_b = n.setting) == null ? void 0 : _b.escape) ? escape(o) : o || ""}</${n.tag}>` : `<${n.tag} data-sm="${n.id}"${r}/>`;
  }).join("");
}
const Rt$1 = (t) => Ce("title", t, { escape: true, close: true }), Lt$1 = (t) => Ce("meta", t), pt$1 = { nav: { inicio: "Inicio", materiales: "Materiales", trabajos: "Trabajos", cotizacion: "Cotizaci\xF3n" }, footer: { lema: "Encimeras de granito y cuarzo en Louisville, KY", contacto: "Contacto", derechos: "Todos los derechos reservados" }, home: { titulo: "La piedra que transforma tu espacio", tituloL1: "La piedra que", tituloL2: "transforma tu espacio", subtitulo: "Granito, cuarzo y m\xE1rmol seleccionados a mano, fabricados e instalados por expertos en Louisville.", cta: "Pide tu cotizaci\xF3n", verMateriales: "Ver materiales" }, cotizacion: { titulo: "Pide tu cotizaci\xF3n", intro: "Cu\xE9ntanos de tu proyecto y te contactamos el mismo d\xEDa h\xE1bil. Sin compromiso.", nombre: "Nombre", telefono: "Tel\xE9fono", tipoProyecto: "Tipo de proyecto", tipos: { cocina: "Cocina", bano: "Ba\xF1o", isla: "Isla", barra: "Barra", otro: "Otro" }, material: "Material de inter\xE9s (opcional)", sinPreferencia: "Sin preferencia", mensaje: "Cu\xE9ntanos m\xE1s (opcional)", enviar: "Enviar solicitud", enviando: "Enviando\u2026", exito: "\xA1Recibido! Te contactamos pronto.", errorEnvio: "No pudimos enviar tu solicitud en este momento. Ll\xE1manos o escr\xEDbenos y te atendemos al instante.", errorNombre: "Escribe tu nombre", errorTelefono: "Escribe un tel\xE9fono v\xE1lido" }, catalogo: { titulo: "Materiales", intro: "Cada losa es \xFAnica. Estas son las familias que trabajamos; vis\xEDtanos para ver el inventario actual.", verEnEscena: "Ver en escena", detalleCta: "\xBFTe gusta esta piedra? Pide tu cotizaci\xF3n", disponibleEn: "Disponible en el visualizador" }, trabajos: { titulo: "Trabajos", destacados: "Trabajos recientes", verTodos: "Ver todos los trabajos", intro: "Proyectos fabricados e instalados por nuestro equipo en Louisville.", filtroMaterial: "Material", filtroEspacio: "Espacio", todos: "Todos", vacio: "Estamos fotografiando nuestros proyectos recientes. Vuelve pronto \u2014 o visita el showroom.", noResultados: "Sin proyectos con esos filtros." }, visualizador: { titulo: "Visualiza tu espacio", escenas: { cocina: "Cocina", bano: "Ba\xF1o", isla: "Isla", barra: "Barra" }, proximamente: "Foto pr\xF3ximamente", tipo: "Tipo", tono: "Tono", veta: "Veta", dureza: "Dureza", inversion: "Inversi\xF3n" } }, mt$1 = { nav: { inicio: "Home", materiales: "Materials", trabajos: "Our Work", cotizacion: "Free Quote" }, footer: { lema: "Granite & quartz countertops in Louisville, KY", contacto: "Contact", derechos: "All rights reserved" }, home: { titulo: "Stone that transforms your space", tituloL1: "Stone that", tituloL2: "transforms your space", subtitulo: "Hand-selected granite, quartz and marble, fabricated and installed by experts in Louisville.", cta: "Get your free quote", verMateriales: "Browse materials" }, cotizacion: { titulo: "Get your free quote", intro: "Tell us about your project and we'll reach out the same business day. No commitment.", nombre: "Name", telefono: "Phone", tipoProyecto: "Project type", tipos: { cocina: "Kitchen", bano: "Bathroom", isla: "Island", barra: "Bar", otro: "Other" }, material: "Material of interest (optional)", sinPreferencia: "No preference", mensaje: "Tell us more (optional)", enviar: "Send request", enviando: "Sending\u2026", exito: "Received! We'll be in touch soon.", errorEnvio: "We couldn't send your request right now. Call or text us and we'll help you right away.", errorNombre: "Enter your name", errorTelefono: "Enter a valid phone number" }, catalogo: { titulo: "Materials", intro: "Every slab is unique. These are the families we work with; visit us to see current inventory.", verEnEscena: "See it in a room", detalleCta: "Love this stone? Get your free quote", disponibleEn: "Available in the visualizer" }, trabajos: { titulo: "Our Work", destacados: "Recent projects", verTodos: "See all projects", intro: "Projects fabricated and installed by our team in Louisville.", filtroMaterial: "Material", filtroEspacio: "Space", todos: "All", vacio: "We're photographing our recent projects. Check back soon \u2014 or visit the showroom.", noResultados: "No projects match those filters." }, visualizador: { titulo: "Visualize your space", escenas: { cocina: "Kitchen", bano: "Bathroom", isla: "Island", barra: "Bar" }, proximamente: "Photo coming soon", tipo: "Type", tono: "Tone", veta: "Veining", dureza: "Hardness", inversion: "Investment" } }, gt$1 = { es: pt$1, en: mt$1 }, Te = createContext$1();
function Mt$1(t) {
  const [n, e] = createSignal("es");
  onMount(() => {
    localStorage.getItem("lang") === "en" && (e("en"), document.documentElement.lang = "en");
  });
  const r = createMemo(() => se.flatten(gt$1[n()])), o = se.translator(r), a = (s) => {
    e(s), isServer || (localStorage.setItem("lang", s), document.documentElement.lang = s);
  };
  return createComponent$1(Te.Provider, { value: { lang: n, setLang: a, t: o }, get children() {
    return t.children;
  } });
}
function At$1() {
  const t = useContext(Te);
  if (!t) throw new Error("useI18n fuera de I18nProvider");
  return t;
}

function A(t) {
  t = mergeProps$1({ inactiveClass: "inactive", activeClass: "active" }, t);
  const [, r] = splitProps(t, ["href", "state", "class", "activeClass", "inactiveClass", "end"]), i = Pt$1(() => t.href), o = Et$1(i), l = Xe(), a = createMemo(() => {
    const n = i();
    if (n === void 0) return [false, false];
    const e = z(n.split(/[?#]/, 1)[0]).toLowerCase(), s = decodeURI(z(l.pathname).toLowerCase());
    return [t.end ? e === s : s.startsWith(e + "/") || s === e, e === s];
  });
  return ssrElement("a", mergeProps(r, { get href() {
    return o() || t.href;
  }, get state() {
    return JSON.stringify(t.state);
  }, get classList() {
    return { ...t.class && { [t.class]: true }, [t.inactiveClass]: !a()[0], [t.activeClass]: a()[0], ...r.classList };
  }, link: true, get "aria-current"() {
    return a()[1] ? "page" : void 0;
  } }), void 0, true);
}

const u = isServer ? (t) => {
  const e = getRequestEvent();
  return e.response.status = t.code, e.response.statusText = t.text, onCleanup(() => !e.nativeEvent.handled && !e.complete && (e.response.status = 200)), null;
} : (t) => null;

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
function lt(e) {
  let t;
  const r = ae(e), s = { duplex: "half", method: e.method, headers: e.headers };
  return e.node.req.body instanceof ArrayBuffer ? new Request(r, { ...s, body: e.node.req.body }) : new Request(r, { ...s, get body() {
    return t || (t = wt(e), t);
  } });
}
function dt(e) {
  var _a;
  return (_a = e.web) != null ? _a : e.web = { request: lt(e), url: ae(e) }, e.web.request;
}
function pt() {
  return At();
}
const oe = /* @__PURE__ */ Symbol("$HTTPEvent");
function ht(e) {
  return typeof e == "object" && (e instanceof H3Event || (e == null ? void 0 : e[oe]) instanceof H3Event || (e == null ? void 0 : e.__is_event__) === true);
}
function b(e) {
  return function(...t) {
    var _a;
    let r = t[0];
    if (ht(r)) t[0] = r instanceof H3Event || r.__is_event__ ? r : r[oe];
    else {
      if (!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext)) throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      if (r = pt(), !r) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
      t.unshift(r);
    }
    return e(...t);
  };
}
const ae = b(getRequestURL), mt = b(getRequestIP), U = b(setResponseStatus), B = b(getResponseStatus), ft = b(getResponseStatusText), L = b(getResponseHeaders), G = b(getResponseHeader), gt = b(setResponseHeader), bt = b(appendResponseHeader), K = b(sendRedirect), yt = b(getCookie), $t = b(setCookie), vt = b(setHeader), wt = b(getRequestWebStream), Rt = b(removeResponseHeader), Et = b(dt);
function St() {
  var _a;
  return getContext("nitro-app", { asyncContext: !!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext), AsyncLocalStorage: AsyncLocalStorage });
}
function At() {
  return St().use().event;
}
const ie = (e) => (t) => {
  const { base: r } = t, s = children(() => t.children), n = createMemo(() => tt(s(), t.base || ""));
  let o;
  const a = St$1(e, n, () => o, { base: r, singleFlight: t.singleFlight, transformUrl: t.transformUrl });
  return e.create && e.create(a), createComponent$1(Je.Provider, { value: a, get children() {
    return createComponent$1(xt, { routerState: a, get root() {
      return t.root;
    }, get preload() {
      return t.rootPreload || t.rootLoad;
    }, get children() {
      return [(o = getOwner()) && null, createComponent$1(Tt, { routerState: a, get branches() {
        return n();
      } })];
    } });
  } });
};
function xt(e) {
  const t = e.routerState.location, r = e.routerState.params, s = createMemo(() => e.preload && untrack(() => {
    Tt$1(true), e.preload({ params: r, location: t, intent: rt() || "initial" }), Tt$1(false);
  }));
  return createComponent$1(Show, { get when() {
    return e.root;
  }, keyed: true, get fallback() {
    return e.children;
  }, children: (n) => createComponent$1(n, { params: r, location: t, get data() {
    return s();
  }, get children() {
    return e.children;
  } }) });
}
function Tt(e) {
  if (isServer) {
    const n = getRequestEvent();
    if (n && n.router && n.router.dataOnly) {
      kt(n, e.routerState, e.branches);
      return;
    }
    n && ((n.router || (n.router = {})).matches || (n.router.matches = e.routerState.matches().map(({ route: o, path: a, params: i }) => ({ path: o.originalPath, pattern: o.pattern, match: a, params: i, info: o.info }))));
  }
  const t = [];
  let r;
  const s = createMemo(on(e.routerState.matches, (n, o, a) => {
    let i = o && n.length === o.length;
    const l = [];
    for (let d = 0, v = n.length; d < v; d++) {
      const E = o && o[d], R = n[d];
      a && E && R.route.key === E.route.key ? l[d] = a[d] : (i = false, t[d] && t[d](), createRoot((f) => {
        t[d] = f, l[d] = jt$1(e.routerState, l[d - 1] || e.routerState.base, Q(() => s()[d + 1]), () => {
          var _a;
          const y = e.routerState.matches();
          return (_a = y[d]) != null ? _a : y[0];
        });
      }));
    }
    return t.splice(n.length).forEach((d) => d()), a && i ? a : (r = l[0], l);
  }));
  return Q(() => s() && r)();
}
const Q = (e) => () => createComponent$1(Show, { get when() {
  return e();
}, keyed: true, children: (t) => createComponent$1(be.Provider, { value: t, get children() {
  return t.outlet();
} }) });
function kt(e, t, r) {
  const s = new URL(e.request.url), n = D(r, new URL(e.router.previousUrl || e.request.url).pathname), o = D(r, s.pathname);
  for (let a = 0; a < o.length; a++) {
    (!n[a] || o[a].route !== n[a].route) && (e.router.dataOnly = true);
    const { route: i, params: l } = o[a];
    i.preload && i.preload({ params: l, location: t.location, intent: "preload" });
  }
}
function Ct([e, t], r, s) {
  return [e, s ? (n) => t(s(n)) : t];
}
function Pt(e) {
  let t = false;
  const r = (n) => typeof n == "string" ? { value: n } : n, s = Ct(createSignal(r(e.get()), { equals: (n, o) => n.value === o.value && n.state === o.state }), void 0, (n) => (!t && e.set(n), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), n));
  return e.init && onCleanup(e.init((n = e.get()) => {
    t = true, s[1](r(n)), t = false;
  })), ie({ signal: s, create: e.create, utils: e.utils });
}
function Lt(e, t, r) {
  return e.addEventListener(t, r), () => e.removeEventListener(t, r);
}
function Ht(e, t) {
  const r = e && document.getElementById(e);
  r ? r.scrollIntoView() : t && window.scrollTo(0, 0);
}
function qt(e) {
  const t = new URL(e);
  return t.pathname + t.search;
}
function _t(e) {
  let t;
  const r = { value: e.url || (t = getRequestEvent()) && qt(t.request.url) || "" };
  return ie({ signal: [() => r, (s) => Object.assign(r, s)] })(e);
}
const jt = /* @__PURE__ */ new Map();
function It(e = true, t = false, r = "/_server", s) {
  return (n) => {
    const o = n.base.path(), a = n.navigatorFactory(n.base);
    let i, l;
    function d(u) {
      return u.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function v(u) {
      if (u.defaultPrevented || u.button !== 0 || u.metaKey || u.altKey || u.ctrlKey || u.shiftKey) return;
      const p = u.composedPath().find((N) => N instanceof Node && N.nodeName.toUpperCase() === "A");
      if (!p || t && !p.hasAttribute("link")) return;
      const g = d(p), h = g ? p.href.baseVal : p.href;
      if ((g ? p.target.baseVal : p.target) || !h && !p.hasAttribute("state")) return;
      const T = (p.getAttribute("rel") || "").split(/\s+/);
      if (p.hasAttribute("download") || T && T.includes("external")) return;
      const C = g ? new URL(h, document.baseURI) : new URL(h);
      if (!(C.origin !== window.location.origin || o && C.pathname && !C.pathname.toLowerCase().startsWith(o.toLowerCase()))) return [p, C];
    }
    function E(u) {
      const p = v(u);
      if (!p) return;
      const [g, h] = p, M = n.parsePath(h.pathname + h.search + h.hash), T = g.getAttribute("state");
      u.preventDefault(), a(M, { resolve: false, replace: g.hasAttribute("replace"), scroll: !g.hasAttribute("noscroll"), state: T ? JSON.parse(T) : void 0 });
    }
    function R(u) {
      const p = v(u);
      if (!p) return;
      const [g, h] = p;
      s && (h.pathname = s(h.pathname)), n.preloadRoute(h, g.getAttribute("preload") !== "false");
    }
    function f(u) {
      clearTimeout(i);
      const p = v(u);
      if (!p) return l = null;
      const [g, h] = p;
      l !== g && (s && (h.pathname = s(h.pathname)), i = setTimeout(() => {
        n.preloadRoute(h, g.getAttribute("preload") !== "false"), l = g;
      }, 20));
    }
    function y(u) {
      if (u.defaultPrevented) return;
      let p = u.submitter && u.submitter.hasAttribute("formaction") ? u.submitter.getAttribute("formaction") : u.target.getAttribute("action");
      if (!p) return;
      if (!p.startsWith("https://action/")) {
        const h = new URL(p, Ke);
        if (p = n.parsePath(h.pathname + h.search), !p.startsWith(r)) return;
      }
      if (u.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const g = jt.get(p);
      if (g) {
        u.preventDefault();
        const h = new FormData(u.target, u.submitter);
        g.call({ r: n, f: u.target }, u.target.enctype === "multipart/form-data" ? h : new URLSearchParams(h));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", E), e && (document.addEventListener("mousemove", f, { passive: true }), document.addEventListener("focusin", R, { passive: true }), document.addEventListener("touchstart", R, { passive: true })), document.addEventListener("submit", y), onCleanup(() => {
      document.removeEventListener("click", E), e && (document.removeEventListener("mousemove", f), document.removeEventListener("focusin", R), document.removeEventListener("touchstart", R)), document.removeEventListener("submit", y);
    });
  };
}
function Ut(e) {
  if (isServer) return _t(e);
  const t = () => {
    const s = window.location.pathname.replace(/^\/+/, "/") + window.location.search, n = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: s + window.location.hash, state: n };
  }, r = We();
  return Pt({ get: t, set({ value: s, replace: n, scroll: o, state: a }) {
    n ? window.history.replaceState(bt$1(a), "", s) : window.history.pushState(a, "", s), Ht(decodeURIComponent(window.location.hash.slice(1)), o), me();
  }, init: (s) => Lt(window, "popstate", wt$1(s, (n) => {
    if (n) return !r.confirm(n);
    {
      const o = t();
      return !r.confirm(o.value, { state: o.state });
    }
  })), create: It(e.preload, e.explicitLinks, e.actionBase, e.transformUrl), utils: { go: (s) => window.history.go(s), beforeLeave: r } })(e);
}
const Ot = U$1(() => t(), "materials"), Ft = { preload: () => Ot() }, Dt = U$1(() => t(), "materials"), Mt = U$1(() => r(), "trabajos"), Nt = { preload: () => Promise.all([Dt(), Mt()]) }, zt = U$1((e) => o(e), "material"), Wt = { preload: ({ params: e }) => zt(e.slug) }, Bt = U$1(() => t(), "materials"), Gt = { preload: () => Bt() }, Kt = U$1(() => r(), "trabajos"), Qt = U$1(() => t(), "materials"), Jt = { preload: () => Promise.all([Kt(), Qt()]) }, ce = [{ page: true, $component: { src: "src/routes/cotizacion.tsx?pick=default&pick=$css", build: () => import('../build/cotizacion2.mjs'), import: () => import('../build/cotizacion2.mjs') }, $$route: { require: () => ({ route: Ft }), src: "src/routes/cotizacion.tsx?pick=route" }, path: "/cotizacion", filePath: "/Users/hector/Documents/granite_concepts/src/routes/cotizacion.tsx" }, { page: true, $component: { src: "src/routes/index.tsx?pick=default&pick=$css", build: () => import('../build/index4.mjs'), import: () => import('../build/index4.mjs') }, $$route: { require: () => ({ route: Nt }), src: "src/routes/index.tsx?pick=route" }, path: "/", filePath: "/Users/hector/Documents/granite_concepts/src/routes/index.tsx" }, { page: true, $component: { src: "src/routes/materiales/[slug].tsx?pick=default&pick=$css", build: () => import('../build/_slug_3.mjs'), import: () => import('../build/_slug_3.mjs') }, $$route: { require: () => ({ route: Wt }), src: "src/routes/materiales/[slug].tsx?pick=route" }, path: "/materiales/:slug", filePath: "/Users/hector/Documents/granite_concepts/src/routes/materiales/[slug].tsx" }, { page: true, $component: { src: "src/routes/materiales/index.tsx?pick=default&pick=$css", build: () => import('../build/index22.mjs'), import: () => import('../build/index22.mjs') }, $$route: { require: () => ({ route: Gt }), src: "src/routes/materiales/index.tsx?pick=route" }, path: "/materiales/", filePath: "/Users/hector/Documents/granite_concepts/src/routes/materiales/index.tsx" }, { page: false, $GET: { src: "src/routes/sitemap.xml.ts?pick=GET", build: () => import('../build/sitemap2.xml.mjs'), import: () => import('../build/sitemap2.xml.mjs') }, $HEAD: { src: "src/routes/sitemap.xml.ts?pick=GET", build: () => import('../build/sitemap2.xml.mjs'), import: () => import('../build/sitemap2.xml.mjs') }, path: "/sitemap.xml", filePath: "/Users/hector/Documents/granite_concepts/src/routes/sitemap.xml.ts" }, { page: true, $component: { src: "src/routes/trabajos/[slug].tsx?pick=default&pick=$css", build: () => import('../build/_slug_22.mjs'), import: () => import('../build/_slug_22.mjs') }, path: "/trabajos/:slug", filePath: "/Users/hector/Documents/granite_concepts/src/routes/trabajos/[slug].tsx" }, { page: true, $component: { src: "src/routes/trabajos/index.tsx?pick=default&pick=$css", build: () => import('../build/index32.mjs'), import: () => import('../build/index32.mjs') }, $$route: { require: () => ({ route: Jt }), src: "src/routes/trabajos/index.tsx?pick=route" }, path: "/trabajos/", filePath: "/Users/hector/Documents/granite_concepts/src/routes/trabajos/index.tsx" }], Yt = Vt(ce.filter((e) => e.page));
function Vt(e) {
  function t(r, s, n, o) {
    const a = Object.values(r).find((i) => n.startsWith(i.id + "/"));
    return a ? (t(a.children || (a.children = []), s, n.slice(a.id.length)), r) : (r.push({ ...s, id: n, path: n.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/") }), r);
  }
  return e.sort((r, s) => r.path.length - s.path.length).reduce((r, s) => t(r, s, s.path, s.path), []);
}
function Xt(e, t) {
  const r = er.lookup(e);
  if (r && r.route) {
    const s = r.route, n = t === "HEAD" ? s.$HEAD || s.$GET : s[`$${t}`];
    if (n === void 0) return;
    const o = s.page === true && s.$component !== void 0;
    return { handler: n, params: r.params, isPage: o };
  }
}
function Zt(e) {
  return e.$HEAD || e.$GET || e.$POST || e.$PUT || e.$PATCH || e.$DELETE;
}
const er = createRouter$1({ routes: ce.reduce((e, t) => {
  if (!Zt(t)) return e;
  let r = t.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (s, n) => `**:${n}`).split("/").map((s) => s.startsWith(":") || s.startsWith("*") ? s : encodeURIComponent(s)).join("/");
  if (/:[^/]*\?/g.test(r)) throw new Error(`Optional parameters are not supported in API routes: ${r}`);
  if (e[r]) throw new Error(`Duplicate API routes for "${r}" found at "${e[r].route.path}" and "${t.path}"`);
  return e[r] = { route: t }, e;
}, {}) }), j = "solidFetchEvent";
function tr(e) {
  return { request: Et(e), response: sr(e), clientAddress: mt(e), locals: {}, nativeEvent: e };
}
function rr(e) {
  if (!e.context[j]) {
    const t = tr(e);
    e.context[j] = t;
  }
  return e.context[j];
}
class nr {
  constructor(t) {
    __publicField(this, "event");
    this.event = t;
  }
  get(t) {
    const r = G(this.event, t);
    return Array.isArray(r) ? r.join(", ") : r || null;
  }
  has(t) {
    return this.get(t) !== null;
  }
  set(t, r) {
    return gt(this.event, t, r);
  }
  delete(t) {
    return Rt(this.event, t);
  }
  append(t, r) {
    bt(this.event, t, r);
  }
  getSetCookie() {
    const t = G(this.event, "Set-Cookie");
    return Array.isArray(t) ? t : [t];
  }
  forEach(t) {
    return Object.entries(L(this.event)).forEach(([r, s]) => t(Array.isArray(s) ? s.join(", ") : s, r, this));
  }
  entries() {
    return Object.entries(L(this.event)).map(([t, r]) => [t, Array.isArray(r) ? r.join(", ") : r])[Symbol.iterator]();
  }
  keys() {
    return Object.keys(L(this.event))[Symbol.iterator]();
  }
  values() {
    return Object.values(L(this.event)).map((t) => Array.isArray(t) ? t.join(", ") : t)[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}
function sr(e) {
  return { get status() {
    return B(e);
  }, set status(t) {
    U(e, t);
  }, get statusText() {
    return ft(e);
  }, set statusText(t) {
    U(e, B(e), t);
  }, headers: new nr(e) };
}
var ar = " ";
const ir = { style: (e) => ssrElement("style", e.attrs, () => e.children, true), link: (e) => ssrElement("link", e.attrs, void 0, true), script: (e) => e.attrs.src ? ssrElement("script", mergeProps(() => e.attrs, { get id() {
  return e.key;
} }), () => ssr(ar), true) : null, noscript: (e) => ssrElement("noscript", e.attrs, () => escape(e.children), true) };
function O(e, t) {
  let { tag: r, attrs: { key: s, ...n } = { key: void 0 }, children: o } = e;
  return ir[r]({ attrs: { ...n, nonce: t }, key: s, children: o });
}
function cr(e, t, r, s = "default") {
  return lazy(async () => {
    var _a;
    {
      const o = (await e.import())[s], i = (await ((_a = t.inputs) == null ? void 0 : _a[e.src].assets())).filter((d) => d.tag === "style" || d.attrs.rel === "stylesheet");
      return { default: (d) => [...i.map((v) => O(v)), createComponent(o, d)] };
    }
  });
}
function ue() {
  function e(r) {
    return { ...r, ...r.$$route ? r.$$route.require().route : void 0, info: { ...r.$$route ? r.$$route.require().route.info : {}, filesystem: true }, component: r.$component && cr(r.$component, globalThis.MANIFEST.client, globalThis.MANIFEST.ssr), children: r.children ? r.children.map(e) : void 0 };
  }
  return Yt.map(e);
}
let J;
const ur = isServer ? () => getRequestEvent().routes : () => J || (J = ue());
function lr(e) {
  const t = yt(e.nativeEvent, "flash");
  if (t) try {
    let r = JSON.parse(t);
    if (!r || !r.result) return;
    const s = [...r.input.slice(0, -1), new Map(r.input[r.input.length - 1])], n = r.error ? new Error(r.result) : r.result;
    return { input: s, url: r.url, pending: false, result: r.thrown ? void 0 : n, error: r.thrown ? n : void 0 };
  } catch (r) {
    console.error(r);
  } finally {
    $t(e.nativeEvent, "flash", "", { maxAge: 0 });
  }
}
async function dr(e) {
  const t = globalThis.MANIFEST.client;
  return globalThis.MANIFEST.ssr, e.response.headers.set("Content-Type", "text/html"), Object.assign(e, { manifest: await t.json(), assets: [...await t.inputs[t.handler].assets()], router: { submission: lr(e) }, routes: ue(), complete: false, $islands: /* @__PURE__ */ new Set() });
}
const pr = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function F(e) {
  return e.status && pr.has(e.status) ? e.status : 302;
}
function hr(e, t, r = {}, s) {
  return eventHandler({ handler: (n) => {
    const o = rr(n);
    return provideRequestEvent(o, async () => {
      const a = Xt(new URL(o.request.url).pathname, o.request.method);
      if (a) {
        const f = await a.handler.import(), y = o.request.method === "HEAD" ? f.HEAD || f.GET : f[o.request.method];
        o.params = a.params || {}, sharedConfig.context = { event: o };
        const u = await y(o);
        if (u !== void 0) return u;
        if (o.request.method !== "GET") throw new Error(`API handler for ${o.request.method} "${o.request.url}" did not return a response.`);
        if (!a.isPage) return;
      }
      const i = await t(o), l = typeof r == "function" ? await r(i) : { ...r }, d = l.mode || "stream";
      if (l.nonce && (i.nonce = l.nonce), d === "sync") {
        const f = renderToString(() => (sharedConfig.context.event = i, e(i)), l);
        if (i.complete = true, i.response && i.response.headers.get("Location")) {
          const y = F(i.response);
          return K(n, i.response.headers.get("Location"), y);
        }
        return f;
      }
      if (l.onCompleteAll) {
        const f = l.onCompleteAll;
        l.onCompleteAll = (y) => {
          V(i)(y), f(y);
        };
      } else l.onCompleteAll = V(i);
      if (l.onCompleteShell) {
        const f = l.onCompleteShell;
        l.onCompleteShell = (y) => {
          Y(i, n)(), f(y);
        };
      } else l.onCompleteShell = Y(i, n);
      const v = renderToStream(() => (sharedConfig.context.event = i, e(i)), l);
      if (i.response && i.response.headers.get("Location")) {
        const f = F(i.response);
        return K(n, i.response.headers.get("Location"), f);
      }
      if (d === "async") return v;
      const { writable: E, readable: R } = new TransformStream();
      return v.pipeTo(E), R;
    });
  } });
}
function Y(e, t) {
  return () => {
    if (e.response && e.response.headers.get("Location")) {
      const r = F(e.response);
      U(t, r), vt(t, "Location", e.response.headers.get("Location"));
    }
  };
}
function V(e) {
  return ({ write: t }) => {
    e.complete = true;
    const r = e.response && e.response.headers.get("Location");
    r && t(`<script>window.location="${r}"<\/script>`);
  };
}
function mr(e, t, r) {
  return hr(e, dr, t);
}
var fr = ["<span", ' class="brand-serif">Granite</span>'], gr = ["<header", ' class="site-header"><div class="container site-header-inner"><!--$-->', '<!--/--><nav aria-label="principal"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--><button type="button" class="lang-toggle"', ">", "</button></nav></div></header>"];
function br() {
  const { t: e, lang: t, setLang: r } = At$1();
  return ssr(gr, ssrHydrationKey(), escape(createComponent$1(A, { href: "/", class: "brand", "aria-label": "Granite Concepts \u2014 Inicio", get children() {
    return [ssr(fr, ssrHydrationKey()), " Concepts"];
  } })), escape(createComponent$1(A, { href: "/materiales", get children() {
    return e("nav.materiales");
  } })), escape(createComponent$1(A, { href: "/trabajos", get children() {
    return e("nav.trabajos");
  } })), escape(createComponent$1(A, { href: "/cotizacion", class: "nav-cta", get children() {
    return e("nav.cotizacion");
  } })), ssrAttribute("aria-label", t() === "es" ? "Switch to English" : "Cambiar a espa\xF1ol", false), t() === "es" ? "EN" : "ES");
}
var yr = ["<footer", ' class="site-footer"><div class="container site-footer-inner"><div><p class="footer-brand"><span class="brand-serif">Granite</span> Concepts</p><p class="footer-lema">', '</p></div><nav aria-label="pie de p\xE1gina"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--></nav><p class="footer-copy">\xA9 <!--$-->', "<!--/--> Granite Concepts \xB7 Louisville, KY \xB7 <!--$-->", "<!--/--></p></div></footer>"];
function $r() {
  const { t: e } = At$1();
  return ssr(yr, ssrHydrationKey(), escape(e("footer.lema")), escape(createComponent$1(A, { href: "/materiales", get children() {
    return e("nav.materiales");
  } })), escape(createComponent$1(A, { href: "/trabajos", get children() {
    return e("nav.trabajos");
  } })), escape(createComponent$1(A, { href: "/cotizacion", get children() {
    return e("nav.cotizacion");
  } })), escape((/* @__PURE__ */ new Date()).getFullYear()), escape(e("footer.derechos")));
}
var vr = ["<main", ">", "</main>"];
function wr() {
  return createComponent$1(Ut, { root: (e) => createComponent$1(Ot$1, { get children() {
    return [createComponent$1(Rt$1, { children: "Granite Concepts \u2014 Encimeras de granito y cuarzo en Louisville, KY" }), createComponent$1(Mt$1, { get children() {
      return [createComponent$1(br, {}), ssr(vr, ssrHydrationKey(), escape(createComponent$1(Suspense, { get children() {
        return e.children;
      } }))), createComponent$1($r, {})];
    } })];
  } }), get children() {
    return createComponent$1(ur, {});
  } });
}
var Rr = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">', "</span>"], Er = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">500 | Internal Server Error</span>'];
const Sr = (e) => {
  const t = isServer ? "500 | Internal Server Error" : "Error | Uncaught Client Exception";
  return createComponent$1(ErrorBoundary, { fallback: (r) => (console.error(r), [ssr(Rr, ssrHydrationKey(), escape(t)), createComponent$1(u, { code: 500 })]), get children() {
    return e.children;
  } });
}, Ar = (e) => {
  let t = false;
  const r = catchError(() => e.children, (s) => {
    console.error(s), t = !!s;
  });
  return t ? [ssr(Er, ssrHydrationKey()), createComponent$1(u, { code: 500 })] : r;
};
var X = ["<script", ">", "<\/script>"], xr = ["<script", ' type="module"', " async", "><\/script>"], Tr = ["<script", ' type="module" async', "><\/script>"];
const kr = ssr("<!DOCTYPE html>");
function le(e, t, r = []) {
  for (let s = 0; s < t.length; s++) {
    const n = t[s];
    if (n.path !== e[0].path) continue;
    let o = [...r, n];
    if (n.children) {
      const a = e.slice(1);
      if (a.length === 0 || (o = le(a, n.children, o), !o)) continue;
    }
    return o;
  }
}
function Cr(e) {
  const t = getRequestEvent(), r = t.nonce;
  let s = [];
  return Promise.resolve().then(async () => {
    let n = [];
    if (t.router && t.router.matches) {
      const o = [...t.router.matches];
      for (; o.length && (!o[0].info || !o[0].info.filesystem); ) o.shift();
      const a = o.length && le(o, t.routes);
      if (a) {
        const i = globalThis.MANIFEST.client.inputs;
        for (let l = 0; l < a.length; l++) {
          const d = a[l], v = i[d.$component.src];
          n.push(v.assets());
        }
      }
    }
    s = await Promise.all(n).then((o) => [...new Map(o.flat().map((a) => [a.attrs.key, a])).values()].filter((a) => a.attrs.rel === "modulepreload" && !t.assets.find((i) => i.attrs.key === a.attrs.key)));
  }), useAssets(() => s.length ? s.map((n) => O(n)) : void 0), createComponent$1(NoHydration, { get children() {
    return [kr, createComponent$1(Ar, { get children() {
      return createComponent$1(e.document, { get assets() {
        return [createComponent$1(HydrationScript, {}), t.assets.map((n) => O(n, r))];
      }, get scripts() {
        return r ? [ssr(X, ssrHydrationKey() + ssrAttribute("nonce", escape(r, true), false), `window.manifest = ${JSON.stringify(t.manifest)}`), ssr(xr, ssrHydrationKey(), ssrAttribute("nonce", escape(r, true), false), ssrAttribute("src", escape(globalThis.MANIFEST.client.inputs[globalThis.MANIFEST.client.handler].output.path, true), false))] : [ssr(X, ssrHydrationKey(), `window.manifest = ${JSON.stringify(t.manifest)}`), ssr(Tr, ssrHydrationKey(), ssrAttribute("src", escape(globalThis.MANIFEST.client.inputs[globalThis.MANIFEST.client.handler].output.path, true), false))];
      }, get children() {
        return createComponent$1(Hydration, { get children() {
          return createComponent$1(Sr, { get children() {
            return createComponent$1(wr, {});
          } });
        } });
      } });
    } })];
  } });
}
var Pr = ['<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="/favicon.svg" type="image/svg+xml">', "</head>"], Lr = ["<html", ' lang="es">', '<body><div id="app">', "</div><!--$-->", "<!--/--></body></html>"];
const Wr = mr(() => createComponent$1(Cr, { document: ({ assets: e, children: t, scripts: r }) => ssr(Lr, ssrHydrationKey(), createComponent$1(NoHydration, { get children() {
  return ssr(Pr, escape(e));
} }), escape(t), escape(r)) }));

const handlers = [
  { route: '', handler: _unn3Eh, lazy: false, middleware: true, method: undefined },
  { route: '/_server', handler: Zt$1, lazy: false, middleware: true, method: undefined },
  { route: '/', handler: Wr, lazy: false, middleware: true, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b$1(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C$1(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  {
    const _handler = h3App.handler;
    h3App.handler = (event) => {
      const ctx = { event };
      return nitroAsyncContext.callAsync(ctx, () => _handler(event));
    };
  }
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { $e as $, At$1 as A, Ct$1 as C, De$1 as D, Ee$1 as E, Ie as I, K$2 as K, Lt$1 as L, Qe$2 as Q, Rt$1 as R, U$1 as U, Vt$1 as V, Ze$2 as Z, A as a, a as b, t$1 as c, a$1 as d, r$1 as e, tt$2 as f, o$1 as g, ot$2 as h, Ce$1 as i, ke$1 as j, k$2 as k, le$1 as l, ae$1 as m, nt$2 as n, o, rt$2 as p, Ve$2 as q, r, st$2 as s, t, u, et$2 as v, I as w, xt$1 as x, nodeServer as y };
//# sourceMappingURL=nitro.mjs.map
