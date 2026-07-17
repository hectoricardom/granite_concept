import { createComponent, ssr, ssrHydrationKey, escape, ssrStyleProperty, isServer, ssrAttribute, ssrElement, mergeProps } from 'solid-js/web';
import { A as At, L as Lt, a as A, C as Ct, b as a, U as U$1, t, r } from '../nitro/nitro.mjs';
import { Show, For, createSignal, createEffect, on, onMount, createMemo, onCleanup } from 'solid-js';
import { w, h } from './images-B43p2foP.mjs';
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

var U = ["<img", ' class="', '"', ' alt width="1600" height="500">'], Z = ["<section", ' class="hero"><div class="hero-sticky"><div class="hero-blobs" aria-hidden="true"><span class="blob blob-1"></span><span class="blob blob-2"></span><span class="blob blob-3"></span></div><div class="hero-copy container"><p class="eyebrow hero-line hero-line-0">Granito \xB7 Cuarzo \xB7 M\xE1rmol \u2014 Louisville, KY</p><h1><span class="hero-line hero-line-1">', '</span><span class="hero-line hero-line-2">', '</span></h1><p class="hero-sub hero-line hero-line-3">', '</p><div class="hero-actions hero-line hero-line-3"><!--$-->', '<!--/--><a href="#visualizador" class="hero-secondary">', '</a></div></div><div class="hero-slab" aria-hidden="true"><img class="', '"', ' alt width="1600" height="500"><!--$-->', "<!--/--></div></div></section>"];
function ee() {
  const { t } = At(), [r] = Ct();
  let l, i, u, v, c;
  const b = () => r.material || "blanco-carrara", [A$1, E] = createSignal(w(b())), [w$1, I] = createSignal(""), [_, x] = createSignal("a");
  let L = 0;
  return createEffect(on(b, (d, m) => {
    if (isServer || m === void 0) return;
    const o = w(d), z = ++L, $ = new Image();
    $.src = o, $.decode().then(() => {
      z === L && (_() === "a" ? (I(o), x("b")) : (E(o), x("a")));
    }).catch(() => {
    });
  })), onMount(async () => {
    if (isServer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { animate: d, scroll: m } = await import('motion'), o = { target: l, offset: ["start start", "end start"] };
    m(d(i, { y: [0, -120], opacity: [1, 0] }, { ease: "linear" }), o), m(d(v, { y: [0, -260] }, { ease: "linear" }), o), m(d(u, { transform: ["translateY(34%) scale(1.06)", "translateY(0%) scale(1)"], clipPath: ["inset(0 12% 0 12% round 22px)", "inset(0 0% 0 0% round 14px)"] }, { ease: "linear" }), { target: l, offset: ["start start", "end 85%"] });
    const z = 6;
    c.addEventListener("mousemove", ($) => {
      const f = c.getBoundingClientRect(), M = (($.clientX - f.left) / f.width - 0.5) * 2 * z, j = (($.clientY - f.top) / f.height - 0.5) * 2 * z;
      c.style.translate = `${M}px ${j}px`;
    }), c.addEventListener("mouseleave", () => {
      c.style.translate = "0px 0px";
    });
  }), ssr(Z, ssrHydrationKey(), escape(t("home.tituloL1")), escape(t("home.tituloL2")), escape(t("home.subtitulo")), escape(createComponent(A, { href: "/cotizacion", class: "hero-cta", get children() {
    return t("home.cta");
  } })), escape(t("home.verMateriales")), `hero-slab-layer ${_() === "a" ? "slab-on" : ""}`, ssrAttribute("src", escape(A$1(), true), false), escape(createComponent(Show, { get when() {
    return w$1();
  }, get children() {
    return ssr(U, ssrHydrationKey(), `hero-slab-layer ${_() === "b" ? "slab-on" : ""}`, ssrAttribute("src", escape(w$1(), true), false));
  } })));
}
var te = ["<img", ' class="', '"', ' width="1200" height="800" decoding="async">'], ae = ["<div", ' class="scene-missing"><img', ' alt width="72" height="72"><p><!--$-->', "<!--/--> \u2014 <!--$-->", "<!--/--></p></div>"], re = ["<div", ' class="scene-viewer" aria-live="polite"><img class="', '"', ' width="1200" height="800" decoding="async" fetchpriority="high"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], se = ["<div", ' class="scene-caption"><p class="scene-caption-name">', '</p><p class="scene-caption-meta"><!--$-->', "<!--/--> \xB7 <!--$-->", "<!--/--> \xB7 <!--$-->", "<!--/--></p></div>"];
function ie(t) {
  const { t: r } = At(), l = h(t.escena, t.material.slug), [i, u] = createSignal(l), [v, c] = createSignal(""), [b, A] = createSignal("a"), [E, w$1] = createSignal(false), [I, _] = createSignal(m()), [x, L] = createSignal("");
  let d = 0;
  function m() {
    return `${t.escenaLabel} \u2014 ${t.material.nombre}`;
  }
  return createEffect(on(() => [t.escena, t.material.slug], ([o, z], $) => {
    if (isServer || !$) return;
    const f = h(o, z), M = ++d, j = new Image();
    j.src = f, j.decode().then(() => {
      M === d && (w$1(false), b() === "a" ? (c(f), L(m()), A("b")) : (u(f), _(m()), A("a")));
    }).catch(() => {
      M === d && w$1(true);
    });
  })), onCleanup(() => d++), ssr(re, ssrHydrationKey(), `scene-layer ${b() === "a" ? "scene-visible" : ""}`, ssrAttribute("src", escape(i(), true), false) + ssrAttribute("alt", b() === "a" ? escape(I(), true) : "", false), escape(createComponent(Show, { get when() {
    return v();
  }, get children() {
    return ssr(te, ssrHydrationKey(), `scene-layer ${b() === "b" ? "scene-visible" : ""}`, ssrAttribute("src", escape(v(), true), false) + ssrAttribute("alt", b() === "b" ? escape(x(), true) : "", false));
  } })), escape(createComponent(Show, { get when() {
    return !E();
  }, get children() {
    return createComponent(Show, { get when() {
      return t.material;
    }, keyed: true, children: (o) => ssr(se, ssrHydrationKey(), escape(o.nombre), escape(o.tipo), escape(o.veta), escape("$".repeat(o.nivel))) });
  } })), escape(createComponent(Show, { get when() {
    return E();
  }, get children() {
    return ssr(ae, ssrHydrationKey(), ssrAttribute("src", escape(w(t.material.slug), true), false), escape(t.material.nombre), escape(r("visualizador.proximamente")));
  } })));
}
var ne = ["<ul", ' class="material-picker" role="list">', "</ul>"], le = ["<img", ' alt width="44" height="44" loading="lazy">'], ce = ["<span>", "</span>"], oe = ["<li", ">", "</li>"];
function ue(t) {
  return ssr(ne, ssrHydrationKey(), escape(createComponent(For, { get each() {
    return t.materials;
  }, children: (r) => ssr(oe, ssrHydrationKey(), ssrElement("a", mergeProps({ class: "material-chip", get href() {
    return `?escena=${t.escena}&material=${r.slug}`;
  } }, { noscroll: "", replace: true }, { get "aria-current"() {
    return t.selected === r.slug ? "true" : void 0;
  } }), () => [ssr(le, ssrAttribute("src", escape(w(r.slug), true), false)), ssr(ce, escape(r.nombre))], false)) })));
}
var de = ["<div", ' class="material-info"><h3>', '</h3><p class="material-desc">', "</p><dl>", "</dl></div>"], me = ["<div", "><dt>", "</dt><dd>", "</dd></div>"];
function he(t) {
  const { t: r, lang: l } = At(), i = () => [[r("visualizador.tipo"), t.material.tipo], [r("visualizador.tono"), t.material.tono], [r("visualizador.veta"), t.material.veta], [r("visualizador.dureza"), t.material.dureza.replace("-", " ")], [r("visualizador.inversion"), "$".repeat(t.material.nivel)]];
  return ssr(de, ssrHydrationKey(), escape(t.material.nombre), escape(t.material.desc[l()]), escape(createComponent(For, { get each() {
    return i();
  }, children: ([u, v]) => ssr(me, ssrHydrationKey(), escape(u), escape(v)) })));
}
var ge = ["<section", ' class="visualizer" id="visualizador"><h2>', '</h2><nav class="scene-tabs"', ">", '</nav><div class="visualizer-grid"><!--$-->', '<!--/--><div class="visualizer-side"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div></section>"];
function pe(t) {
  const { t: r } = At(), [l] = Ct(), i = createMemo(() => a.includes(l.escena) ? l.escena : "cocina"), u = createMemo(() => {
    var _a;
    return (_a = t.materials.find((c) => c.slug === l.material)) != null ? _a : t.materials[0];
  }), v = () => r(`visualizador.escenas.${i()}`);
  return ssr(ge, ssrHydrationKey(), escape(r("visualizador.titulo")), ssrAttribute("aria-label", escape(r("visualizador.titulo"), true), false), escape(createComponent(For, { each: a, children: (c) => ssrElement("a", mergeProps({ get href() {
    return `?escena=${c}&material=${u().slug}`;
  } }, { noscroll: "", replace: true }, { get "aria-current"() {
    return i() === c ? "true" : void 0;
  } }), () => escape(r(`visualizador.escenas.${c}`)), true) })), escape(createComponent(ie, { get escena() {
    return i();
  }, get material() {
    return u();
  }, get escenaLabel() {
    return v();
  } })), escape(createComponent(ue, { get materials() {
    return t.materials;
  }, get escena() {
    return i();
  }, get selected() {
    return u().slug;
  } })), escape(createComponent(he, { get material() {
    return u();
  } })));
}
var ve = ["<div", ' class="container">', "</div>"], be = ["<section", ' class="container" style="', '"><h2>', '</h2><div style="', '">', '</div><p style="', '">', "</p></section>"], fe = ["<section", ' class="container" style="', '"><h2>', '</h2><p style="', '">', "</p><p>", "</p></section>"];
const $e = U$1(() => t(), "materials"), ye = U$1(() => r(), "trabajos");
function je() {
  const { t } = At(), r = y(() => $e()), l = y(() => ye());
  return [createComponent(Lt, { name: "description", content: "Encimeras de granito, cuarzo y m\xE1rmol en Louisville, KY. Visualiza cada piedra en tu cocina o ba\xF1o y pide tu cotizaci\xF3n gratis. Atenci\xF3n en espa\xF1ol e ingl\xE9s." }), createComponent(Lt, { property: "og:title", content: "Granite Concepts \u2014 Encimeras en Louisville, KY" }), createComponent(Lt, { property: "og:description", content: "Visualiza granito, cuarzo y m\xE1rmol en tu espacio. Cotizaci\xF3n gratis, atenci\xF3n biling\xFCe." }), createComponent(Lt, { property: "og:type", content: "website" }), createComponent(ee, {}), ssr(ve, ssrHydrationKey(), escape(createComponent(Show, { get when() {
    return r();
  }, children: (i) => createComponent(pe, { get materials() {
    return i();
  } }) }))), createComponent(Show, { get when() {
    var _a;
    return ((_a = l()) != null ? _a : []).length > 0;
  }, get children() {
    return ssr(be, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5) 0"), escape(t("trabajos.destacados")), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(min(18rem, 100%), 1fr))") + ssrStyleProperty(";gap:", "var(--sp-3)"), escape(createComponent(For, { get each() {
      var _a;
      return ((_a = l()) != null ? _a : []).slice(0, 3);
    }, children: (i) => createComponent(p, { trabajo: i }) })), ssrStyleProperty("margin-top:", "var(--sp-3)"), escape(createComponent(A, { href: "/trabajos", get children() {
      return t("trabajos.verTodos");
    } })));
  } }), ssr(fe, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-6)") + ssrStyleProperty(";text-align:", "center"), escape(t("home.cta")), ssrStyleProperty("max-width:", "32rem") + ssrStyleProperty(";margin-inline:", "auto"), escape(t("home.subtitulo")), escape(createComponent(A, { href: "/cotizacion", class: "hero-cta", get children() {
    return t("nav.cotizacion");
  } })))];
}

export { je as default };
//# sourceMappingURL=index4.mjs.map
