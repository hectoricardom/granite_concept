import { ssr, ssrHydrationKey, ssrStyleProperty, escape, createComponent, ssrAttribute } from 'solid-js/web';
import { Show, For } from 'solid-js';
import { u } from './HttpStatusCode-DH8IeaZe.mjs';
import { J, H as H$1, F } from './index-Gy6Hlstv.mjs';
import { f as tt, k, g as o } from '../nitro/nitro.mjs';
import { w } from './images-B43p2foP2.mjs';
import { y } from './createAsync-CBz8AaaQ2.mjs';
import { A as A$1 } from './components-DxvOFfFE.mjs';
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

var C = ["<section", ' class="container" style="', '">', "</section>"], M = ["<h1", ">404</h1>"], A = ["<p", ">", "</p>"], H = ["<div", ' style="', '"><img', ' alt="', '" width="600" height="600" style="', '"><div><p class="eyebrow" style="', '">', "</p><h1>", "</h1><p>", '</p><dl class="material-info">', '</dl><p style="', '">', "</p><p>", "</p></div></div>"], S = ["<div", ' style="', '"><dt style="', '">', '</dt><dd style="', '">', "</dd></div>"];
const T = k((l) => o(l), "material");
function L() {
  const l = tt(), d = y(() => T(l.slug)), { t: i, lang: c } = J();
  return ssr(C, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5)"), escape(createComponent(Show, { get when() {
    return d();
  }, get fallback() {
    return [createComponent(u, { code: 404 }), ssr(M, ssrHydrationKey()), ssr(A, ssrHydrationKey(), escape(createComponent(A$1, { href: "/materiales", get children() {
      return i("catalogo.titulo");
    } })))];
  }, children: (t) => [createComponent(H$1, { get children() {
    return `${t().nombre} \u2014 encimeras en Louisville | Granite Concepts`;
  } }), createComponent(F, { name: "description", get content() {
    return t().desc[c()];
  } }), ssr(H, ssrHydrationKey(), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(min(20rem, 100%), 1fr))") + ssrStyleProperty(";gap:", "var(--sp-4)") + ssrStyleProperty(";align-items:", "center"), ssrAttribute("src", escape(w(t().slug), true), false), `Textura macro de ${escape(t().nombre, true)}`, ssrStyleProperty("border-radius:", "var(--radius)") + ssrStyleProperty(";width:", "100%") + ssrStyleProperty(";height:", "auto"), ssrStyleProperty("text-transform:", "capitalize"), escape(t().tipo), escape(t().nombre), escape(t().desc[c()]), escape(createComponent(For, { get each() {
    return [[i("visualizador.tono"), t().tono], [i("visualizador.veta"), t().veta], [i("visualizador.dureza"), t().dureza.replace("-", " ")], [i("visualizador.inversion"), "$".repeat(t().nivel)]];
  }, children: ([p, m]) => ssr(S, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";padding:", "0.5rem 0") + ssrStyleProperty(";border-bottom:", "1px solid var(--bruma)"), ssrStyleProperty("color:", "var(--texto-label)"), escape(p), ssrStyleProperty("margin:", 0) + ssrStyleProperty(";text-transform:", "capitalize"), escape(m)) })), ssrStyleProperty("margin-top:", "var(--sp-3)"), escape(createComponent(A$1, { class: "hero-cta", get href() {
    return `/cotizacion?material=${t().slug}`;
  }, get children() {
    return i("catalogo.detalleCta");
  } })), escape(createComponent(A$1, { get href() {
    return `/?material=${t().slug}#visualizador`;
  }, get children() {
    return i("catalogo.verEnEscena");
  } })))] })));
}

export { L as default };
//# sourceMappingURL=_slug_.mjs.map
