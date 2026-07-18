import { ssr, ssrHydrationKey, ssrStyleProperty, escape, createComponent, ssrAttribute } from 'solid-js/web';
import { Show, For } from 'solid-js';
import { d as ot, o as oe, h as ht, p as pt, A as A$1, u, E, w } from '../nitro/nitro.mjs';
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

var _ = ["<section", ' class="container" style="', '">', "</section>"], C = ["<h1", ">404</h1>"], A = ["<p", ">", "</p>"], H = ["<div", ' style="', '"><img', ' alt="', '" width="600" height="600" style="', '"><div><p class="eyebrow">', "</p><h1>", "</h1><p>", '</p><dl class="material-info">', '</dl><p style="', '">', "</p><p>", "</p></div></div>"], M = ["<div", ' style="', '"><dt style="', '">', '</dt><dd style="', '">', "</dd></div>"];
const S = E((l) => w(l), "material");
function I() {
  const l = ot(), d = y(() => S(l.slug)), { t: a, lang: n } = oe();
  return ssr(_, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5)"), escape(createComponent(Show, { get when() {
    return d();
  }, get fallback() {
    return [createComponent(u, { code: 404 }), ssr(C, ssrHydrationKey()), ssr(A, ssrHydrationKey(), escape(createComponent(A$1, { href: "/materiales", get children() {
      return a("catalogo.titulo");
    } })))];
  }, children: (t) => [createComponent(ht, { get children() {
    return `${t().nombre} \u2014 encimeras en Louisville | Granite Concepts`;
  } }), createComponent(pt, { name: "description", get content() {
    return t().desc[n()];
  } }), ssr(H, ssrHydrationKey(), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(min(20rem, 100%), 1fr))") + ssrStyleProperty(";gap:", "var(--sp-4)") + ssrStyleProperty(";align-items:", "center"), ssrAttribute("src", escape(t().swatch, true), false), `Textura macro de ${escape(t().nombre, true)}`, ssrStyleProperty("border-radius:", "var(--radius)") + ssrStyleProperty(";width:", "100%") + ssrStyleProperty(";height:", "auto"), escape(a(`valores.tipo.${t().tipo}`)), escape(t().nombre), escape(t().desc[n()]), escape(createComponent(For, { get each() {
    return [[a("visualizador.tono"), a(`valores.tono.${t().tono}`)], [a("visualizador.veta"), t().veta[n()]], [a("visualizador.dureza"), a(`valores.dureza.${t().dureza}`)], [a("visualizador.inversion"), "$".repeat(t().nivel)]];
  }, children: ([p, u]) => ssr(M, ssrHydrationKey(), ssrStyleProperty("display:", "flex") + ssrStyleProperty(";justify-content:", "space-between") + ssrStyleProperty(";padding:", "0.5rem 0") + ssrStyleProperty(";border-bottom:", "1px solid var(--bruma)"), ssrStyleProperty("color:", "var(--texto-label)"), escape(p), ssrStyleProperty("margin:", 0), escape(u)) })), ssrStyleProperty("margin-top:", "var(--sp-3)"), escape(createComponent(A$1, { class: "hero-cta", get href() {
    return `/cotizacion?material=${t().slug}`;
  }, get children() {
    return a("catalogo.detalleCta");
  } })), escape(createComponent(A$1, { get href() {
    return `/?escena=cocina&material=${t().slug}`;
  }, get children() {
    return a("catalogo.verEnEscena");
  } })))] })));
}

export { I as default };
//# sourceMappingURL=_slug_3.mjs.map
