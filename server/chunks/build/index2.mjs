import { ssr, ssrHydrationKey, ssrStyleProperty, escape, createComponent, ssrAttribute } from 'solid-js/web';
import { J, H, F as F$1 } from './index-Gy6Hlstv.mjs';
import { Show, For } from 'solid-js';
import { k, c as t } from '../nitro/nitro.mjs';
import { w as w$1 } from './images-B43p2foP2.mjs';
import { A as A$1 } from './components-DxvOFfFE.mjs';
import { y } from './createAsync-CBz8AaaQ2.mjs';
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

var w = ["<img", ' alt="', '" width="120" height="120" loading="lazy">'], b = ["<div", ' class="material-row-body"><h2>', '</h2><p class="material-row-meta"><span class="material-row-tipo">', "</span> \xB7 <!--$-->", "<!--/--> \xB7 <!--$-->", '<!--/--></p><p class="material-row-desc">', "</p></div>"];
function M(t) {
  const { lang: i } = J();
  return createComponent(A$1, { get href() {
    return `/materiales/${t.material.slug}`;
  }, class: "material-row", get children() {
    return [ssr(w, ssrHydrationKey() + ssrAttribute("src", escape(w$1(t.material.slug), true), false), `Textura de ${escape(t.material.nombre, true)}`), ssr(b, ssrHydrationKey(), escape(t.material.nombre), escape(t.material.tipo), escape(t.material.tono), escape("$".repeat(t.material.nivel)), escape(t.material.desc[i()]))];
  } });
}
var C = ["<section", ' class="container" style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><h1>", '</h1><p style="', '">', "</p><!--$-->", "<!--/--></section>"], x = ["<div", ' style="', '">', "</div>"];
const A = k(() => t(), "materials");
function F() {
  const t = y(() => A()), { t: i } = J();
  return ssr(C, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5)"), escape(createComponent(H, { children: "Materiales \u2014 Granite Concepts Louisville" })), escape(createComponent(F$1, { name: "description", content: "Cat\xE1logo de granito, cuarzo y m\xE1rmol para encimeras en Louisville, KY: Carrara, Calacatta, Ubatuba, Negro Absoluto y m\xE1s." })), escape(i("catalogo.titulo")), ssrStyleProperty("max-width:", "38rem"), escape(i("catalogo.intro")), escape(createComponent(Show, { get when() {
    return t();
  }, children: (m) => ssr(x, ssrHydrationKey(), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(min(20rem, 100%), 1fr))") + ssrStyleProperty(";gap:", "var(--sp-2)") + ssrStyleProperty(";margin-top:", "var(--sp-4)"), escape(createComponent(For, { get each() {
    return m();
  }, children: (n) => createComponent(M, { material: n }) }))) })));
}

export { F as default };
//# sourceMappingURL=index2.mjs.map
