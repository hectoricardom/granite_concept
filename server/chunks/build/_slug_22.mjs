import { ssr, ssrHydrationKey, ssrStyleProperty, escape, createComponent } from 'solid-js/web';
import { Show } from 'solid-js';
import { x as xt, A as At, R as Rt, L as Lt, u, a as A, U, r } from '../nitro/nitro.mjs';
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
const S = U(() => r(), "trabajos");
function G() {
  const c = xt(), i = y(() => S()), { t: l, lang: o } = At(), p = () => {
    var _a;
    return (_a = i()) == null ? void 0 : _a.find((t) => t.slug === c.slug);
  };
  return ssr(_, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5)"), escape(createComponent(Show, { get when() {
    return p();
  }, get fallback() {
    return [createComponent(u, { code: 404 }), ssr(C, ssrHydrationKey()), ssr(n, ssrHydrationKey(), escape(createComponent(A, { href: "/trabajos", get children() {
      return l("trabajos.titulo");
    } })))];
  }, children: (t) => [createComponent(Rt, { get children() {
    return `${t().titulo[o()]} \u2014 Granite Concepts`;
  } }), createComponent(Lt, { name: "description", get content() {
    return t().desc[o()];
  } }), ssr(H, ssrHydrationKey(), escape(t().titulo[o()])), ssr(n, ssrHydrationKey(), escape(t().desc[o()]))] })));
}

export { G as default };
//# sourceMappingURL=_slug_22.mjs.map
