import { createComponent, ssr, ssrHydrationKey, escape, ssrStyleProperty, isServer, ssrAttribute, ssrElement, mergeProps } from 'solid-js/web';
import { A as At, L as Lt, a as A, C as Ct, b as a, U as U$1, n, t } from '../nitro/nitro.mjs';
import { Show, For, onMount, createMemo, createSignal, createEffect, on, onCleanup } from 'solid-js';
import { E, i } from './images-DUzp1oc3.mjs';
import { p } from './WorkCard-DVhptAHi.mjs';
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

var U = ["<section", ' class="hero"><div class="hero-sticky"><div class="hero-blobs" aria-hidden="true"><span class="blob blob-1"></span><span class="blob blob-2"></span><span class="blob blob-3"></span></div><div class="hero-copy container"><p class="eyebrow hero-line hero-line-0">Granito \xB7 Cuarzo \xB7 M\xE1rmol \u2014 Louisville, KY</p><h1><span class="hero-line hero-line-1">', '</span><span class="hero-line hero-line-2">', '</span></h1><p class="hero-sub hero-line hero-line-3">', '</p><div class="hero-actions hero-line hero-line-3"><!--$-->', '<!--/--><a href="#visualizador" class="hero-secondary">', '</a></div></div><div class="hero-slab" aria-hidden="true"><img', ' alt width="1600" height="500"></div></div></section>'];
function Z() {
  const { t } = At();
  let r, l, i, u, c;
  return onMount(async () => {
    if (isServer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { animate: o, scroll: d } = await import('motion'), $ = { target: r, offset: ["start start", "end start"] };
    d(o(l, { y: [0, -120], opacity: [1, 0] }, { ease: "linear" }), $), d(o(u, { y: [0, -260] }, { ease: "linear" }), $), d(o(i, { transform: ["translateY(34%) scale(1.06)", "translateY(0%) scale(1)"], clipPath: ["inset(0 12% 0 12% round 22px)", "inset(0 0% 0 0% round 14px)"] }, { ease: "linear" }), { target: r, offset: ["start start", "end 85%"] });
    const b = 6;
    c.addEventListener("mousemove", (y) => {
      const g = c.getBoundingClientRect(), x = ((y.clientX - g.left) / g.width - 0.5) * 2 * b, A = ((y.clientY - g.top) / g.height - 0.5) * 2 * b;
      c.style.translate = `${x}px ${A}px`;
    }), c.addEventListener("mouseleave", () => {
      c.style.translate = "0px 0px";
    });
  }), ssr(U, ssrHydrationKey(), escape(t("home.tituloL1")), escape(t("home.tituloL2")), escape(t("home.subtitulo")), escape(createComponent(A, { href: "/cotizacion", class: "hero-cta", get children() {
    return t("home.cta");
  } })), escape(t("home.verMateriales")), ssrAttribute("src", escape(E("calacatta-oro"), true), false));
}
var ee = ["<img", ' class="', '"', ' width="1200" height="800" decoding="async">'], te = ["<div", ' class="scene-missing"><img', ' alt width="72" height="72"><p><!--$-->', "<!--/--> \u2014 <!--$-->", "<!--/--></p></div>"], ae = ["<div", ' class="scene-viewer" aria-live="polite"><img class="', '"', ' width="1200" height="800" decoding="async" fetchpriority="high"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], re = ["<div", ' class="scene-caption"><p class="scene-caption-name">', '</p><p class="scene-caption-meta"><!--$-->', "<!--/--> \xB7 <!--$-->", "<!--/--> \xB7 <!--$-->", "<!--/--></p></div>"];
function se(t) {
  const { t: r } = At(), l = i(t.escena, t.material.slug), [i$1, u] = createSignal(l), [c, o] = createSignal(""), [d, $] = createSignal("a"), [b, y] = createSignal(false), [g, x] = createSignal(L()), [A, G] = createSignal("");
  let w = 0;
  function L() {
    return `${t.escenaLabel} \u2014 ${t.material.nombre}`;
  }
  return createEffect(on(() => [t.escena, t.material.slug], ([p, Q], T) => {
    if (isServer || !T) return;
    const S = i(p, Q), C = ++w, k = new Image();
    k.src = S, k.decode().then(() => {
      C === w && (y(false), d() === "a" ? (o(S), G(L()), $("b")) : (u(S), x(L()), $("a")));
    }).catch(() => {
      C === w && y(true);
    });
  })), onCleanup(() => w++), ssr(ae, ssrHydrationKey(), `scene-layer ${d() === "a" ? "scene-visible" : ""}`, ssrAttribute("src", escape(i$1(), true), false) + ssrAttribute("alt", d() === "a" ? escape(g(), true) : "", false), escape(createComponent(Show, { get when() {
    return c();
  }, get children() {
    return ssr(ee, ssrHydrationKey(), `scene-layer ${d() === "b" ? "scene-visible" : ""}`, ssrAttribute("src", escape(c(), true), false) + ssrAttribute("alt", d() === "b" ? escape(A(), true) : "", false));
  } })), escape(createComponent(Show, { get when() {
    return !b();
  }, get children() {
    return createComponent(Show, { get when() {
      return t.material;
    }, keyed: true, children: (p) => ssr(re, ssrHydrationKey(), escape(p.nombre), escape(p.tipo), escape(p.veta), escape("$".repeat(p.nivel))) });
  } })), escape(createComponent(Show, { get when() {
    return b();
  }, get children() {
    return ssr(te, ssrHydrationKey(), ssrAttribute("src", escape(E(t.material.slug), true), false), escape(t.material.nombre), escape(r("visualizador.proximamente")));
  } })));
}
var ie = ["<ul", ' class="material-picker" role="list">', "</ul>"], ne = ["<img", ' alt width="44" height="44" loading="lazy">'], le = ["<span>", "</span>"], ce = ["<li", ">", "</li>"];
function oe(t) {
  return ssr(ie, ssrHydrationKey(), escape(createComponent(For, { get each() {
    return t.materials;
  }, children: (r) => ssr(ce, ssrHydrationKey(), ssrElement("a", mergeProps({ class: "material-chip", get href() {
    return `?escena=${t.escena}&material=${r.slug}`;
  } }, { noscroll: "", replace: true }, { get "aria-current"() {
    return t.selected === r.slug ? "true" : void 0;
  } }), () => [ssr(ne, ssrAttribute("src", escape(E(r.slug), true), false)), ssr(le, escape(r.nombre))], false)) })));
}
var ue = ["<div", ' class="material-info"><h3>', '</h3><p class="material-desc">', "</p><dl>", "</dl></div>"], de = ["<div", "><dt>", "</dt><dd>", "</dd></div>"];
function me(t) {
  const { t: r, lang: l } = At(), i = () => [[r("visualizador.tipo"), t.material.tipo], [r("visualizador.tono"), t.material.tono], [r("visualizador.veta"), t.material.veta], [r("visualizador.dureza"), t.material.dureza.replace("-", " ")], [r("visualizador.inversion"), "$".repeat(t.material.nivel)]];
  return ssr(ue, ssrHydrationKey(), escape(t.material.nombre), escape(t.material.desc[l()]), escape(createComponent(For, { get each() {
    return i();
  }, children: ([u, c]) => ssr(de, ssrHydrationKey(), escape(u), escape(c)) })));
}
var he = ["<section", ' class="visualizer" id="visualizador"><h2>', '</h2><nav class="scene-tabs"', ">", '</nav><div class="visualizer-grid"><!--$-->', '<!--/--><div class="visualizer-side"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div></section>"];
function ge(t) {
  const { t: r } = At(), [l] = Ct(), i = createMemo(() => a.includes(l.escena) ? l.escena : "cocina"), u = createMemo(() => {
    var _a;
    return (_a = t.materials.find((o) => o.slug === l.material)) != null ? _a : t.materials[0];
  }), c = () => r(`visualizador.escenas.${i()}`);
  return ssr(he, ssrHydrationKey(), escape(r("visualizador.titulo")), ssrAttribute("aria-label", escape(r("visualizador.titulo"), true), false), escape(createComponent(For, { each: a, children: (o) => ssrElement("a", mergeProps({ get href() {
    return `?escena=${o}&material=${u().slug}`;
  } }, { noscroll: "", replace: true }, { get "aria-current"() {
    return i() === o ? "true" : void 0;
  } }), () => escape(r(`visualizador.escenas.${o}`)), true) })), escape(createComponent(se, { get escena() {
    return i();
  }, get material() {
    return u();
  }, get escenaLabel() {
    return c();
  } })), escape(createComponent(oe, { get materials() {
    return t.materials;
  }, get escena() {
    return i();
  }, get selected() {
    return u().slug;
  } })), escape(createComponent(me, { get material() {
    return u();
  } })));
}
var pe = ["<div", ' class="container">', "</div>"], ve = ["<section", ' class="container" style="', '"><h2>', '</h2><div style="', '">', '</div><p style="', '">', "</p></section>"], fe = ["<section", ' class="container" style="', '"><h2>', '</h2><p style="', '">', "</p><p>", "</p></section>"];
const $e = U$1(() => n(), "materials"), be = U$1(() => t(), "trabajos");
function Me() {
  const { t } = At(), r = y(() => $e()), l = y(() => be());
  return [createComponent(Lt, { name: "description", content: "Encimeras de granito, cuarzo y m\xE1rmol en Louisville, KY. Visualiza cada piedra en tu cocina o ba\xF1o y pide tu cotizaci\xF3n gratis. Atenci\xF3n en espa\xF1ol e ingl\xE9s." }), createComponent(Lt, { property: "og:title", content: "Granite Concepts \u2014 Encimeras en Louisville, KY" }), createComponent(Lt, { property: "og:description", content: "Visualiza granito, cuarzo y m\xE1rmol en tu espacio. Cotizaci\xF3n gratis, atenci\xF3n biling\xFCe." }), createComponent(Lt, { property: "og:type", content: "website" }), createComponent(Z, {}), ssr(pe, ssrHydrationKey(), escape(createComponent(Show, { get when() {
    return r();
  }, children: (i) => createComponent(ge, { get materials() {
    return i();
  } }) }))), createComponent(Show, { get when() {
    var _a;
    return ((_a = l()) != null ? _a : []).length > 0;
  }, get children() {
    return ssr(ve, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5) 0"), escape(t("trabajos.destacados")), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(min(18rem, 100%), 1fr))") + ssrStyleProperty(";gap:", "var(--sp-3)"), escape(createComponent(For, { get each() {
      var _a;
      return ((_a = l()) != null ? _a : []).slice(0, 3);
    }, children: (i) => createComponent(p, { trabajo: i }) })), ssrStyleProperty("margin-top:", "var(--sp-3)"), escape(createComponent(A, { href: "/trabajos", get children() {
      return t("trabajos.verTodos");
    } })));
  } }), ssr(fe, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-6)") + ssrStyleProperty(";text-align:", "center"), escape(t("home.cta")), ssrStyleProperty("max-width:", "32rem") + ssrStyleProperty(";margin-inline:", "auto"), escape(t("home.subtitulo")), escape(createComponent(A, { href: "/cotizacion", class: "hero-cta", get children() {
    return t("nav.cotizacion");
  } })))];
}

export { Me as default };
//# sourceMappingURL=index4.mjs.map
