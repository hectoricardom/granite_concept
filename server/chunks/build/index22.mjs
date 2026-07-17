import { ssr, ssrHydrationKey, ssrStyleProperty, escape, createComponent, ssrAttribute } from 'solid-js/web';
import { A as At, R as Rt, L as Lt, a as A$1, U, n } from '../nitro/nitro.mjs';
import { Show, For } from 'solid-js';
import { E } from './images-DUzp1oc3.mjs';
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

var w = ["<img", ' alt="', '" width="120" height="120" loading="lazy">'], b = ["<div", ' class="material-row-body"><h2>', '</h2><p class="material-row-meta"><span class="material-row-tipo">', "</span> \xB7 <!--$-->", "<!--/--> \xB7 <!--$-->", '<!--/--></p><p class="material-row-desc">', "</p></div>"];
function C(t) {
  const { lang: i } = At();
  return createComponent(A$1, { get href() {
    return `/materiales/${t.material.slug}`;
  }, class: "material-row", get children() {
    return [ssr(w, ssrHydrationKey() + ssrAttribute("src", escape(E(t.material.slug), true), false), `Textura de ${escape(t.material.nombre, true)}`), ssr(b, ssrHydrationKey(), escape(t.material.nombre), escape(t.material.tipo), escape(t.material.tono), escape("$".repeat(t.material.nivel)), escape(t.material.desc[i()]))];
  } });
}
var M = ["<section", ' class="container" style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><h1>", '</h1><p style="', '">', "</p><!--$-->", "<!--/--></section>"], x = ["<div", ' style="', '">', "</div>"];
const A = U(() => n(), "materials");
function j() {
  const t = y(() => A()), { t: i } = At();
  return ssr(M, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5)"), escape(createComponent(Rt, { children: "Materiales \u2014 Granite Concepts Louisville" })), escape(createComponent(Lt, { name: "description", content: "Cat\xE1logo de granito, cuarzo y m\xE1rmol para encimeras en Louisville, KY: Carrara, Calacatta, Ubatuba, Negro Absoluto y m\xE1s." })), escape(i("catalogo.titulo")), ssrStyleProperty("max-width:", "38rem"), escape(i("catalogo.intro")), escape(createComponent(Show, { get when() {
    return t();
  }, children: (m) => ssr(x, ssrHydrationKey(), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(min(20rem, 100%), 1fr))") + ssrStyleProperty(";gap:", "var(--sp-2)") + ssrStyleProperty(";margin-top:", "var(--sp-4)"), escape(createComponent(For, { get each() {
    return m();
  }, children: (n) => createComponent(C, { material: n }) }))) })));
}

export { j as default };
//# sourceMappingURL=index22.mjs.map
