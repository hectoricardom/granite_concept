import { createComponent, ssr, ssrHydrationKey, escape, isServer, ssrAttribute, getRequestEvent, delegateEvents } from 'solid-js/web';
import { W, H, Y, J } from './index-Gy6Hlstv.mjs';
import { V as Vt, $ as $e, h as ot, I as Ie, i as Ce$1, j as ke, s as st, K, l as le$1, Q as Qe, m as ae, E as Ee$1, p as rt, q as Ve } from '../nitro/nitro.mjs';
import { Suspense, createSignal, onCleanup, children, createMemo, getOwner, sharedConfig, untrack, Show, on, createRoot } from 'solid-js';
import { A } from './components-DxvOFfFE.mjs';
import '@solid-primitives/i18n';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import 'solid-js/web/storage';
import 'seroval';
import 'seroval-plugins/web';

const q = (e) => (r) => {
  const { base: n } = r, a = children(() => r.children), t = createMemo(() => $e(a(), r.base || ""));
  let s;
  const c = ot(e, t, () => s, { base: n, singleFlight: r.singleFlight, transformUrl: r.transformUrl });
  return e.create && e.create(c), createComponent(Ie.Provider, { value: c, get children() {
    return createComponent(ue, { routerState: c, get root() {
      return r.root;
    }, get preload() {
      return r.rootPreload || r.rootLoad;
    }, get children() {
      return [(s = getOwner()) && null, createComponent(le, { routerState: c, get branches() {
        return t();
      } })];
    } });
  } });
};
function ue(e) {
  const r = e.routerState.location, n = e.routerState.params, a = createMemo(() => e.preload && untrack(() => {
    rt(true), e.preload({ params: n, location: r, intent: ke() || "initial" }), rt(false);
  }));
  return createComponent(Show, { get when() {
    return e.root;
  }, keyed: true, get fallback() {
    return e.children;
  }, children: (t) => createComponent(t, { params: n, location: r, get data() {
    return a();
  }, get children() {
    return e.children;
  } }) });
}
function le(e) {
  if (isServer) {
    const t = getRequestEvent();
    if (t && t.router && t.router.dataOnly) {
      de(t, e.routerState, e.branches);
      return;
    }
    t && ((t.router || (t.router = {})).matches || (t.router.matches = e.routerState.matches().map(({ route: s, path: c, params: g }) => ({ path: s.originalPath, pattern: s.pattern, match: c, params: g, info: s.info }))));
  }
  const r = [];
  let n;
  const a = createMemo(on(e.routerState.matches, (t, s, c) => {
    let g = s && t.length === s.length;
    const m = [];
    for (let d = 0, w = t.length; d < w; d++) {
      const v = s && s[d], b = t[d];
      c && v && b.route.key === v.route.key ? m[d] = c[d] : (g = false, r[d] && r[d](), createRoot((L) => {
        r[d] = L, m[d] = st(e.routerState, m[d - 1] || e.routerState.base, I(() => a()[d + 1]), () => {
          var _a;
          const y = e.routerState.matches();
          return (_a = y[d]) != null ? _a : y[0];
        });
      }));
    }
    return r.splice(t.length).forEach((d) => d()), c && g ? c : (n = m[0], m);
  }));
  return I(() => a() && n)();
}
const I = (e) => () => createComponent(Show, { get when() {
  return e();
}, keyed: true, children: (r) => createComponent(le$1.Provider, { value: r, get children() {
  return r.outlet();
} }) });
function de(e, r, n) {
  const a = new URL(e.request.url), t = K(n, new URL(e.router.previousUrl || e.request.url).pathname), s = K(n, a.pathname);
  for (let c = 0; c < s.length; c++) {
    (!t[c] || s[c].route !== t[c].route) && (e.router.dataOnly = true);
    const { route: g, params: m } = s[c];
    g.preload && g.preload({ params: m, location: r.location, intent: "preload" });
  }
}
function he([e, r], n, a) {
  return [e, a ? (t) => r(a(t)) : r];
}
function me(e) {
  let r = false;
  const n = (t) => typeof t == "string" ? { value: t } : t, a = he(createSignal(n(e.get()), { equals: (t, s) => t.value === s.value && t.state === s.state }), void 0, (t) => (!r && e.set(t), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), t));
  return e.init && onCleanup(e.init((t = e.get()) => {
    r = true, a[1](n(t)), r = false;
  })), q({ signal: a, create: e.create, utils: e.utils });
}
function fe(e, r, n) {
  return e.addEventListener(r, n), () => e.removeEventListener(r, n);
}
function ge(e, r) {
  const n = e && document.getElementById(e);
  n ? n.scrollIntoView() : r && window.scrollTo(0, 0);
}
function pe(e) {
  const r = new URL(e);
  return r.pathname + r.search;
}
function be(e) {
  let r;
  const n = { value: e.url || (r = getRequestEvent()) && pe(r.request.url) || "" };
  return q({ signal: [() => n, (a) => Object.assign(n, a)] })(e);
}
const we = /* @__PURE__ */ new Map();
function ve(e = true, r = false, n = "/_server", a) {
  return (t) => {
    const s = t.base.path(), c = t.navigatorFactory(t.base);
    let g, m;
    function d(o) {
      return o.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function w(o) {
      if (o.defaultPrevented || o.button !== 0 || o.metaKey || o.altKey || o.ctrlKey || o.shiftKey) return;
      const i = o.composedPath().find(($) => $ instanceof Node && $.nodeName.toUpperCase() === "A");
      if (!i || r && !i.hasAttribute("link")) return;
      const h = d(i), l = h ? i.href.baseVal : i.href;
      if ((h ? i.target.baseVal : i.target) || !l && !i.hasAttribute("state")) return;
      const R = (i.getAttribute("rel") || "").split(/\s+/);
      if (i.hasAttribute("download") || R && R.includes("external")) return;
      const S = h ? new URL(l, document.baseURI) : new URL(l);
      if (!(S.origin !== window.location.origin || s && S.pathname && !S.pathname.toLowerCase().startsWith(s.toLowerCase()))) return [i, S];
    }
    function v(o) {
      const i = w(o);
      if (!i) return;
      const [h, l] = i, k = t.parsePath(l.pathname + l.search + l.hash), R = h.getAttribute("state");
      o.preventDefault(), c(k, { resolve: false, replace: h.hasAttribute("replace"), scroll: !h.hasAttribute("noscroll"), state: R ? JSON.parse(R) : void 0 });
    }
    function b(o) {
      const i = w(o);
      if (!i) return;
      const [h, l] = i;
      a && (l.pathname = a(l.pathname)), t.preloadRoute(l, h.getAttribute("preload") !== "false");
    }
    function L(o) {
      clearTimeout(g);
      const i = w(o);
      if (!i) return m = null;
      const [h, l] = i;
      m !== h && (a && (l.pathname = a(l.pathname)), g = setTimeout(() => {
        t.preloadRoute(l, h.getAttribute("preload") !== "false"), m = h;
      }, 20));
    }
    function y(o) {
      if (o.defaultPrevented) return;
      let i = o.submitter && o.submitter.hasAttribute("formaction") ? o.submitter.getAttribute("formaction") : o.target.getAttribute("action");
      if (!i) return;
      if (!i.startsWith("https://action/")) {
        const l = new URL(i, Ce$1);
        if (i = t.parsePath(l.pathname + l.search), !i.startsWith(n)) return;
      }
      if (o.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const h = we.get(i);
      if (h) {
        o.preventDefault();
        const l = new FormData(o.target, o.submitter);
        h.call({ r: t, f: o.target }, o.target.enctype === "multipart/form-data" ? l : new URLSearchParams(l));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", v), e && (document.addEventListener("mousemove", L, { passive: true }), document.addEventListener("focusin", b, { passive: true }), document.addEventListener("touchstart", b, { passive: true })), document.addEventListener("submit", y), onCleanup(() => {
      document.removeEventListener("click", v), e && (document.removeEventListener("mousemove", L), document.removeEventListener("focusin", b), document.removeEventListener("touchstart", b)), document.removeEventListener("submit", y);
    });
  };
}
function ye(e) {
  if (isServer) return be(e);
  const r = () => {
    const a = window.location.pathname.replace(/^\/+/, "/") + window.location.search, t = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: a + window.location.hash, state: t };
  }, n = Ee$1();
  return me({ get: r, set({ value: a, replace: t, scroll: s, state: c }) {
    t ? window.history.replaceState(Qe(c), "", a) : window.history.pushState(c, "", a), ge(decodeURIComponent(window.location.hash.slice(1)), s), ae();
  }, init: (a) => fe(window, "popstate", Ve(a, (t) => {
    if (t) return !n.confirm(t);
    {
      const s = r();
      return !n.confirm(s.value, { state: s.state });
    }
  })), create: ve(e.preload, e.explicitLinks, e.actionBase, e.transformUrl), utils: { go: (a) => window.history.go(a), beforeLeave: n } })(e);
}
var Re = ["<span", ' class="brand-serif">Granite</span>'], Le = ["<header", ' class="site-header"><div class="container site-header-inner"><!--$-->', '<!--/--><nav aria-label="principal"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--><button type="button" class="lang-toggle"', ">", "</button></nav></div></header>"];
function Se() {
  const { t: e, lang: r, setLang: n } = J();
  return ssr(Le, ssrHydrationKey(), escape(createComponent(A, { href: "/", class: "brand", "aria-label": "Granite Concepts \u2014 Inicio", get children() {
    return [ssr(Re, ssrHydrationKey()), " Concepts"];
  } })), escape(createComponent(A, { href: "/materiales", get children() {
    return e("nav.materiales");
  } })), escape(createComponent(A, { href: "/trabajos", get children() {
    return e("nav.trabajos");
  } })), escape(createComponent(A, { href: "/cotizacion", class: "nav-cta", get children() {
    return e("nav.cotizacion");
  } })), ssrAttribute("aria-label", r() === "es" ? "Switch to English" : "Cambiar a espa\xF1ol", false), r() === "es" ? "EN" : "ES");
}
var Ee = ["<footer", ' class="site-footer"><div class="container site-footer-inner"><div><p class="footer-brand"><span class="brand-serif">Granite</span> Concepts</p><p class="footer-lema">', '</p></div><nav aria-label="pie de p\xE1gina"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--></nav><p class="footer-copy">\xA9 <!--$-->', "<!--/--> Granite Concepts \xB7 Louisville, KY \xB7 <!--$-->", "<!--/--></p></div></footer>"];
function Ae() {
  const { t: e } = J();
  return ssr(Ee, ssrHydrationKey(), escape(e("footer.lema")), escape(createComponent(A, { href: "/materiales", get children() {
    return e("nav.materiales");
  } })), escape(createComponent(A, { href: "/trabajos", get children() {
    return e("nav.trabajos");
  } })), escape(createComponent(A, { href: "/cotizacion", get children() {
    return e("nav.cotizacion");
  } })), escape((/* @__PURE__ */ new Date()).getFullYear()), escape(e("footer.derechos")));
}
var Ce = ["<main", ">", "</main>"];
function ze() {
  return createComponent(ye, { root: (e) => createComponent(W, { get children() {
    return [createComponent(H, { children: "Granite Concepts \u2014 Encimeras de granito y cuarzo en Louisville, KY" }), createComponent(Y, { get children() {
      return [createComponent(Se, {}), ssr(Ce, ssrHydrationKey(), escape(createComponent(Suspense, { get children() {
        return e.children;
      } }))), createComponent(Ae, {})];
    } })];
  } }), get children() {
    return createComponent(Vt, {});
  } });
}

export { ze as default };
//# sourceMappingURL=app-DoL6yWtQ.mjs.map
