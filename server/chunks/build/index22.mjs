import { ssr, ssrHydrationKey, ssrStyleProperty, escape, createComponent, ssrAttribute } from 'solid-js/web';
import { o as oe, h as ht, p as pt, A, E, b as p } from '../nitro/nitro.mjs';
import { Show, For } from 'solid-js';
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

var v = ["<img", ' alt="', '" width="120" height="120" loading="lazy">'], w = ["<div", ' class="material-row-body"><h2>', '</h2><p class="material-row-meta"><span class="material-row-tipo">', "</span> \xB7 <!--$-->", "<!--/--> \xB7 <!--$-->", '<!--/--></p><p class="material-row-desc">', "</p></div>"];
function b(t) {
  const { t: i, lang: s } = oe();
  return createComponent(A, { get href() {
    return `/materiales/${t.material.slug}`;
  }, class: "material-row", get children() {
    return [ssr(v, ssrHydrationKey() + ssrAttribute("src", escape(t.material.swatch, true), false), `Textura de ${escape(t.material.nombre, true)}`), ssr(w, ssrHydrationKey(), escape(t.material.nombre), escape(i(`valores.tipo.${t.material.tipo}`)), escape(i(`valores.tono.${t.material.tono}`)), escape("$".repeat(t.material.nivel)), escape(t.material.desc[s()]))];
  } });
}
var C = ["<section", ' class="container" style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><h1>", '</h1><p style="', '">', "</p><!--$-->", "<!--/--></section>"], M = ["<div", ' style="', '">', "</div>"];
const x = E(() => p(), "materials");
function j() {
  const t = y(() => x()), { t: i } = oe();
  return ssr(C, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5)"), escape(createComponent(ht, { children: "Materiales \u2014 Granite Concepts Louisville" })), escape(createComponent(pt, { name: "description", content: "Cat\xE1logo de granito, cuarzo y m\xE1rmol para encimeras en Louisville, KY: Carrara, Calacatta, Ubatuba, Negro Absoluto y m\xE1s." })), escape(i("catalogo.titulo")), ssrStyleProperty("max-width:", "38rem"), escape(i("catalogo.intro")), escape(createComponent(Show, { get when() {
    return t();
  }, children: (s) => ssr(M, ssrHydrationKey(), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(min(20rem, 100%), 1fr))") + ssrStyleProperty(";gap:", "var(--sp-2)") + ssrStyleProperty(";margin-top:", "var(--sp-4)"), escape(createComponent(For, { get each() {
    return s();
  }, children: (n) => createComponent(b, { material: n }) }))) })));
}

export { j as default };
//# sourceMappingURL=index22.mjs.map
