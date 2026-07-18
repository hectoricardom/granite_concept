import { ssr, ssrHydrationKey, ssrStyleProperty, escape, createComponent } from 'solid-js/web';
import { Show } from 'solid-js';
import { u } from './HttpStatusCode-DH8IeaZe.mjs';
import { k, H as H$1 } from './index-BgYMpQL1.mjs';
import { z as ze, m, i as y$1 } from '../nitro/nitro.mjs';
import { C as C$1 } from './index-CctOUFvw.mjs';
import { y } from './createAsync-CBz8AaaQ2.mjs';
import { A } from './components-CDQikSFO.mjs';
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
const S = m(() => y$1(), "trabajos");
function K() {
  const m = ze(), i = y(() => S()), { t: p, lang: a } = C$1(), c = () => {
    var _a;
    return (_a = i()) == null ? void 0 : _a.find((t) => t.slug === m.slug);
  };
  return ssr(_, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5)"), escape(createComponent(Show, { get when() {
    return c();
  }, get fallback() {
    return [createComponent(u, { code: 404 }), ssr(C, ssrHydrationKey()), ssr(n, ssrHydrationKey(), escape(createComponent(A, { href: "/trabajos", get children() {
      return p("trabajos.titulo");
    } })))];
  }, children: (t) => [createComponent(k, { get children() {
    return `${t().titulo[a()]} \u2014 Granite Concepts`;
  } }), createComponent(H$1, { name: "description", get content() {
    return t().desc[a()];
  } }), ssr(H, ssrHydrationKey(), escape(t().titulo[a()])), ssr(n, ssrHydrationKey(), escape(t().desc[a()]))] })));
}

export { K as default };
//# sourceMappingURL=_slug_2.mjs.map
