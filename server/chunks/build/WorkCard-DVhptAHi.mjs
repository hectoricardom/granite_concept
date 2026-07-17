import { createComponent, ssr, ssrHydrationKey, ssrAttribute, escape, ssrStyleProperty } from 'solid-js/web';
import { A as At, a as A } from '../nitro/nitro.mjs';

var m = ["<img", ' width="600" height="400" loading="lazy" style="', '">'], b = ["<h3", ' style="', '">', "</h3>"], d = ["<p", ' style="', '">', "</p>"];
function p(r) {
  const { lang: s, t: l } = At();
  return createComponent(A, { get href() {
    return `/trabajos/${r.trabajo.slug}`;
  }, class: "work-card", get children() {
    return [ssr(m, ssrHydrationKey() + ssrAttribute("src", escape(r.trabajo.fotos[0], true), false) + ssrAttribute("alt", escape(r.trabajo.titulo[s()], true), false), ssrStyleProperty("border-radius:", "var(--radius)") + ssrStyleProperty(";width:", "100%") + ssrStyleProperty(";height:", "auto") + ssrStyleProperty(";aspect-ratio:", "3/2") + ssrStyleProperty(";object-fit:", "cover") + ssrStyleProperty(";background:", "var(--nube)")), ssr(b, ssrHydrationKey(), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";margin:", "var(--sp-1) 0 0"), escape(r.trabajo.titulo[s()])), ssr(d, ssrHydrationKey(), ssrStyleProperty("color:", "var(--texto-label)") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";text-transform:", "capitalize"), escape(l(`visualizador.escenas.${r.trabajo.espacio}`)))];
  } });
}

export { p };
//# sourceMappingURL=WorkCard-DVhptAHi.mjs.map
