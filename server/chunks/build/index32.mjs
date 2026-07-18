import { ssr, ssrHydrationKey, ssrStyleProperty, escape, createComponent, ssrAttribute } from 'solid-js/web';
import { a as at, o as oe, h as ht, p as pt, E, y as y$1, b as p } from '../nitro/nitro.mjs';
import { createMemo, For, Show } from 'solid-js';
import { a, B as B$1 } from './WorkCard-kIVRKyDa.mjs';
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

var L = ["<div", ' style="', '">', "</div>"], P = ["<section", ' class="container" style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><h1>", '</h1><p style="', '">', '</p><div class="scene-tabs" role="group"', "><a", ">", "</a><!--$-->", '<!--/--></div><div class="scene-tabs" role="group"', "><a", ">", "</a><!--$-->", "<!--/--></div><!--$-->", "<!--/--></section>"], j = ["<a", ">", "</a>"], k = ["<p", ' style="', '">', "</p>"];
const z = E(() => y$1(), "trabajos"), H = E(() => p(), "materials");
function B() {
  const u = y(() => z()), $ = y(() => H()), [e] = at(), { t: s } = oe(), d = createMemo(() => {
    var _a;
    return ((_a = u()) != null ? _a : []).filter((r) => (!e.material || r.material === e.material) && (!e.espacio || r.espacio === e.espacio));
  }), c = (r, f) => {
    const m = new URLSearchParams(), b = r === "material" ? f : e.material, g = r === "espacio" ? f : e.espacio;
    b && m.set("material", b), g && m.set("espacio", g);
    const h = m.toString();
    return h ? `?${h}` : "/trabajos";
  };
  return ssr(P, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5)"), escape(createComponent(ht, { children: "Trabajos \u2014 Granite Concepts Louisville" })), escape(createComponent(pt, { name: "description", content: "Encimeras de granito y cuarzo instaladas en Louisville: cocinas, ba\xF1os, islas y barras." })), escape(s("trabajos.titulo")), ssrStyleProperty("max-width:", "38rem"), escape(s("trabajos.intro")), ssrAttribute("aria-label", escape(s("trabajos.filtroEspacio"), true), false), ssrAttribute("href", escape(c("espacio", void 0), true), false) + ssrAttribute("aria-current", e.espacio ? escape(void 0, true) : "true", false), escape(s("trabajos.todos")), escape(createComponent(For, { each: a, children: (r) => ssr(j, ssrHydrationKey() + ssrAttribute("href", escape(c("espacio", r), true), false) + ssrAttribute("aria-current", e.espacio === r ? "true" : escape(void 0, true), false), escape(s(`visualizador.escenas.${r}`))) })), ssrAttribute("aria-label", escape(s("trabajos.filtroMaterial"), true), false), ssrAttribute("href", escape(c("material", void 0), true), false) + ssrAttribute("aria-current", e.material ? escape(void 0, true) : "true", false), escape(s("trabajos.todos")), escape(createComponent(For, { get each() {
    var _a;
    return (_a = $()) != null ? _a : [];
  }, children: (r) => ssr(j, ssrHydrationKey() + ssrAttribute("href", escape(c("material", r.slug), true), false) + ssrAttribute("aria-current", e.material === r.slug ? "true" : escape(void 0, true), false), escape(r.nombre)) })), escape(createComponent(Show, { get when() {
    return d().length > 0;
  }, get fallback() {
    var _a;
    return ssr(k, ssrHydrationKey(), ssrStyleProperty("margin-top:", "var(--sp-4)") + ssrStyleProperty(";max-width:", "34rem"), ((_a = u()) != null ? _a : []).length === 0 ? escape(s("trabajos.vacio")) : escape(s("trabajos.noResultados")));
  }, get children() {
    return ssr(L, ssrHydrationKey(), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(min(18rem, 100%), 1fr))") + ssrStyleProperty(";gap:", "var(--sp-3)") + ssrStyleProperty(";margin-top:", "var(--sp-4)"), escape(createComponent(For, { get each() {
      return d();
    }, children: (r) => createComponent(B$1, { trabajo: r }) })));
  } })));
}

export { B as default };
//# sourceMappingURL=index32.mjs.map
