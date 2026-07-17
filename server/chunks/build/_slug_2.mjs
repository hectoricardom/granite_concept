import { ssr, ssrHydrationKey, ssrStyleProperty, escape, createComponent } from 'solid-js/web';
import { Show } from 'solid-js';
import { u } from './HttpStatusCode-DH8IeaZe.mjs';
import { J, H as H$1, F } from './index-Gy6Hlstv.mjs';
import { g as tt, k, f as t } from '../nitro/nitro.mjs';
import { y } from './createAsync-CBz8AaaQ2.mjs';
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

var _ = ["<section", ' class="container" style="', '">', "</section>"], C = ["<h1", ">404</h1>"], n = ["<p", ">", "</p>"], H = ["<h1", ">", "</h1>"];
const S = k(() => t(), "trabajos");
function G() {
  const c = tt(), i = y(() => S()), { t: m, lang: o } = J(), p = () => {
    var _a;
    return (_a = i()) == null ? void 0 : _a.find((t) => t.slug === c.slug);
  };
  return ssr(_, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5)"), escape(createComponent(Show, { get when() {
    return p();
  }, get fallback() {
    return [createComponent(u, { code: 404 }), ssr(C, ssrHydrationKey()), ssr(n, ssrHydrationKey(), escape(createComponent(A, { href: "/trabajos", get children() {
      return m("trabajos.titulo");
    } })))];
  }, children: (t) => [createComponent(H$1, { get children() {
    return `${t().titulo[o()]} \u2014 Granite Concepts`;
  } }), createComponent(F, { name: "description", get content() {
    return t().desc[o()];
  } }), ssr(H, ssrHydrationKey(), escape(t().titulo[o()])), ssr(n, ssrHydrationKey(), escape(t().desc[o()]))] })));
}

export { G as default };
//# sourceMappingURL=_slug_2.mjs.map
