import { ssr, ssrHydrationKey, ssrStyleProperty, escape, createComponent } from 'solid-js/web';
import { Show } from 'solid-js';
import { d as ot, o as oe, h as ht, p as pt, u, A, E, y as y$1 } from '../nitro/nitro.mjs';
import { y } from './createAsync-CBz8AaaQ.mjs';
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
import '@solid-primitives/i18n';

var _ = ["<section", ' class="container" style="', '">', "</section>"], C = ["<h1", ">404</h1>"], n = ["<p", ">", "</p>"], H = ["<h1", ">", "</h1>"];
const S = E(() => y$1(), "trabajos");
function I() {
  const c = ot(), i = y(() => S()), { t: m, lang: a } = oe(), p = () => {
    var _a;
    return (_a = i()) == null ? void 0 : _a.find((t) => t.slug === c.slug);
  };
  return ssr(_, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5)"), escape(createComponent(Show, { get when() {
    return p();
  }, get fallback() {
    return [createComponent(u, { code: 404 }), ssr(C, ssrHydrationKey()), ssr(n, ssrHydrationKey(), escape(createComponent(A, { href: "/trabajos", get children() {
      return m("trabajos.titulo");
    } })))];
  }, children: (t) => [createComponent(ht, { get children() {
    return `${t().titulo[a()]} \u2014 Granite Concepts`;
  } }), createComponent(pt, { name: "description", get content() {
    return t().desc[a()];
  } }), ssr(H, ssrHydrationKey(), escape(t().titulo[a()])), ssr(n, ssrHydrationKey(), escape(t().desc[a()]))] })));
}

export { I as default };
//# sourceMappingURL=_slug_22.mjs.map
