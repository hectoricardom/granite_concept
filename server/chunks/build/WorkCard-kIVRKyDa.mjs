import { createComponent, ssr, ssrHydrationKey, ssrAttribute, escape, ssrStyle, ssrStyleProperty } from 'solid-js/web';
import { Show } from 'solid-js';
import { o as oe, A } from '../nitro/nitro.mjs';

const a = ["cocina", "bano", "isla", "barra"];
[...a], [...a], [...a], [...a], [...a], [...a], [...a], [...a], [...a], [...a], [...a];
var b = ["<video", ' preload="metadata" muted playsinline style="', '"></video>'], y = ["<h3", ' style="', '">', "</h3>"], w = ["<p", ' style="', '">', "</p>"], f = ["<img", ' width="600" height="400" loading="lazy" style="', '">'];
const u = { "border-radius": "var(--radius)", width: "100%", height: "auto", "aspect-ratio": "3/2", "object-fit": "cover", background: "var(--nube)" };
function B(e) {
  const { lang: l, t: m } = oe(), g = () => a.includes(e.trabajo.espacio);
  return createComponent(A, { get href() {
    return `/trabajos/${e.trabajo.slug}`;
  }, class: "work-card", get children() {
    return [createComponent(Show, { get when() {
      return e.trabajo.kind === "video";
    }, get fallback() {
      return ssr(f, ssrHydrationKey() + ssrAttribute("src", escape(e.trabajo.fotos[0], true), false) + ssrAttribute("alt", escape(e.trabajo.titulo[l()], true), false), ssrStyle(u));
    }, get children() {
      return ssr(b, ssrHydrationKey() + ssrAttribute("src", escape(e.trabajo.fotos[0], true), false), ssrStyle(u));
    } }), ssr(y, ssrHydrationKey(), ssrStyleProperty("font-size:", "1.25rem") + ssrStyleProperty(";margin:", "var(--sp-1) 0 0"), escape(e.trabajo.titulo[l()])), createComponent(Show, { get when() {
      return g();
    }, get children() {
      return ssr(w, ssrHydrationKey(), ssrStyleProperty("color:", "var(--texto-label)") + ssrStyleProperty(";font-size:", "0.875rem") + ssrStyleProperty(";text-transform:", "capitalize"), escape(m(`visualizador.escenas.${e.trabajo.espacio}`)));
    } })];
  } });
}

export { B, a };
//# sourceMappingURL=WorkCard-kIVRKyDa.mjs.map
