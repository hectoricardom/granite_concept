import { createComponent, ssr, ssrHydrationKey, escape, ssrStyleProperty, isServer, ssrAttribute, ssrElement, mergeProps } from 'solid-js/web';
import { Y, Q } from './index-CUDOCGCg.mjs';
import { Show, For, createSignal, createEffect, on, onMount, createMemo, onCleanup } from 'solid-js';
import { n as nt, c as a, k, b as o, d as i } from '../nitro/nitro.mjs';
import { m, h } from './images-BZgZFbVl2.mjs';
import { A } from './components-DxvOFfFE.mjs';
import { p } from './WorkCard-CvhiIkXg.mjs';
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

var ee = ["<img", ' class="', '"', ' alt width="1600" height="500">'], te = ["<section", ' class="hero"><div class="hero-sticky"><div class="hero-blobs" aria-hidden="true"><span class="blob blob-1"></span><span class="blob blob-2"></span><span class="blob blob-3"></span></div><div class="hero-copy container"><p class="eyebrow hero-line hero-line-0">Granito \xB7 Cuarzo \xB7 M\xE1rmol \u2014 Louisville, KY</p><h1><span class="hero-line hero-line-1">', '</span><span class="hero-line hero-line-2">', '</span></h1><p class="hero-sub hero-line hero-line-3">', '</p><div class="hero-actions hero-line hero-line-3"><!--$-->', '<!--/--><a href="#visualizador" class="hero-secondary">', '</a></div></div><div class="hero-slab" aria-hidden="true"><img class="', '"', ' alt width="1600" height="500"><!--$-->', "<!--/--></div></div></section>"];
function ae() {
  const { t } = Y(), [a] = nt();
  let n, s, c, b, o;
  const d = () => a.material || "blanco-carrara", [$, L] = createSignal(m(d())), [S, w] = createSignal(""), [A$1, M] = createSignal("a");
  let j = 0;
  return createEffect(on(d, (f, m$1) => {
    if (isServer || m$1 === void 0) return;
    const h = m(f), u = ++j, y = new Image();
    y.src = h, y.decode().then(() => {
      u === j && (A$1() === "a" ? (w(h), M("b")) : (L(h), M("a")));
    }).catch(() => {
    });
  })), onMount(async () => {
    if (isServer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { animate: f, scroll: m } = await import('motion'), h = { target: n, offset: ["start start", "end start"] };
    m(f(s, { y: [0, -120], opacity: [1, 0] }, { ease: "linear" }), h), m(f(b, { y: [0, -260] }, { ease: "linear" }), h), m(f(c, { transform: ["translateY(34%) scale(1.06)", "translateY(0%) scale(1)"], clipPath: ["inset(0 12% 0 12% round 22px)", "inset(0 0% 0 0% round 14px)"] }, { ease: "linear" }), { target: n, offset: ["start start", "end 85%"] });
    const u = 6;
    o.addEventListener("mousemove", (y) => {
      const _ = o.getBoundingClientRect(), I = ((y.clientX - _.left) / _.width - 0.5) * 2 * u, E = ((y.clientY - _.top) / _.height - 0.5) * 2 * u;
      o.style.translate = `${I}px ${E}px`;
    }), o.addEventListener("mouseleave", () => {
      o.style.translate = "0px 0px";
    });
  }), ssr(te, ssrHydrationKey(), escape(t("home.tituloL1")), escape(t("home.tituloL2")), escape(t("home.subtitulo")), escape(createComponent(A, { href: "/cotizacion", class: "hero-cta", get children() {
    return t("home.cta");
  } })), escape(t("home.verMateriales")), `hero-slab-layer ${A$1() === "a" ? "slab-on" : ""}`, ssrAttribute("src", escape($(), true), false), escape(createComponent(Show, { get when() {
    return S();
  }, get children() {
    return ssr(ee, ssrHydrationKey(), `hero-slab-layer ${A$1() === "b" ? "slab-on" : ""}`, ssrAttribute("src", escape(S(), true), false));
  } })));
}
var re = ["<img", ' class="', '"', ' width="1200" height="800" decoding="async">'], se = ["<div", ' class="scene-missing"><img', ' alt width="72" height="72"><p><!--$-->', "<!--/--> \u2014 <!--$-->", "<!--/--></p></div>"], ie = ["<div", ' class="scene-viewer" aria-live="polite"><img class="', '"', ' width="1200" height="800" decoding="async" fetchpriority="high"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], ne = ["<div", ' class="scene-caption"><p class="scene-caption-name">', '</p><p class="scene-caption-meta"><!--$-->', "<!--/--> \xB7 <!--$-->", "<!--/--> \xB7 <!--$-->", "<!--/--></p></div>"];
function le(t) {
  const { t: a, lang: n } = Y(), s = t.available ? h(t.escena, t.material.slug) : "", [c, b] = createSignal(s), [o, d] = createSignal(""), [$, L] = createSignal("a"), [S, w] = createSignal(!t.available), [A, M] = createSignal(h$1()), [j, f] = createSignal("");
  let m$1 = 0;
  function h$1() {
    return `${t.escenaLabel} \u2014 ${t.material.nombre}`;
  }
  return createEffect(on(() => [t.escena, t.material.slug, t.available], ([u, y, _], I) => {
    if (!_) {
      w(true);
      return;
    }
    if (isServer || !I) {
      w(false);
      return;
    }
    const E = h(u, y), K = ++m$1, T = new Image();
    T.src = E, T.decode().then(() => {
      K === m$1 && (w(false), $() === "a" ? (d(E), f(h$1()), L("b")) : (b(E), M(h$1()), L("a")));
    }).catch(() => {
      K === m$1 && w(true);
    });
  })), onCleanup(() => m$1++), ssr(ie, ssrHydrationKey(), `scene-layer ${$() === "a" ? "scene-visible" : ""}`, ssrAttribute("src", escape(c(), true), false) + ssrAttribute("alt", $() === "a" ? escape(A(), true) : "", false), escape(createComponent(Show, { get when() {
    return o();
  }, get children() {
    return ssr(re, ssrHydrationKey(), `scene-layer ${$() === "b" ? "scene-visible" : ""}`, ssrAttribute("src", escape(o(), true), false) + ssrAttribute("alt", $() === "b" ? escape(j(), true) : "", false));
  } })), escape(createComponent(Show, { get when() {
    return !S();
  }, get children() {
    return createComponent(Show, { get when() {
      return t.material;
    }, keyed: true, children: (u) => ssr(ne, ssrHydrationKey(), escape(u.nombre), escape(a(`valores.tipo.${u.tipo}`)), escape(u.veta[n()]), escape("$".repeat(u.nivel))) });
  } })), escape(createComponent(Show, { get when() {
    return S();
  }, get children() {
    return ssr(se, ssrHydrationKey(), ssrAttribute("src", escape(m(t.material.slug), true), false), escape(t.material.nombre), escape(a("visualizador.proximamente")));
  } })));
}
var oe = ["<ul", ' class="material-picker" role="list">', "</ul>"], ce = ["<img", ' alt width="44" height="44" loading="lazy">'], ue = ["<span>", "</span>"], de = ["<li", ">", "</li>"];
function me(t) {
  return ssr(oe, ssrHydrationKey(), escape(createComponent(For, { get each() {
    return t.materials;
  }, children: (a) => ssr(de, ssrHydrationKey(), ssrElement("a", mergeProps({ class: "material-chip", get href() {
    return `?escena=${t.escena}&material=${a.slug}`;
  } }, { noscroll: "", replace: true }, { get "aria-current"() {
    return t.selected === a.slug ? "true" : void 0;
  } }), () => [ssr(ce, ssrAttribute("src", escape(m(a.slug), true), false)), ssr(ue, escape(a.nombre))], false)) })));
}
var he = ["<div", ' class="material-info"><h3>', '</h3><p class="material-desc">', "</p><dl>", "</dl></div>"], ge = ["<div", "><dt>", "</dt><dd>", "</dd></div>"];
function ve(t) {
  const { t: a, lang: n } = Y(), s = () => t.material, c = () => [[a("visualizador.tipo"), a(`valores.tipo.${s().tipo}`)], [a("visualizador.tono"), a(`valores.tono.${s().tono}`)], [a("visualizador.veta"), s().veta[n()]], [a("visualizador.dureza"), a(`valores.dureza.${s().dureza}`)], [a("visualizador.inversion"), "$".repeat(s().nivel)]];
  return ssr(he, ssrHydrationKey(), escape(t.material.nombre), escape(t.material.desc[n()]), escape(createComponent(For, { get each() {
    return c();
  }, children: ([b, o]) => ssr(ge, ssrHydrationKey(), escape(b), escape(o)) })));
}
var pe = ["<section", ' class="visualizer" id="visualizador"><h2>', '</h2><nav class="scene-tabs"', ">", '</nav><div class="visualizer-grid"><!--$-->', '<!--/--><div class="visualizer-side"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div></section>"];
function be(t) {
  const { t: a$1 } = Y(), [n] = nt(), s = createMemo(() => a.includes(n.escena) ? n.escena : "cocina"), c = createMemo(() => {
    var _a;
    return (_a = t.materials.find((d) => d.slug === n.material)) != null ? _a : t.materials[0];
  }), b = () => a$1(`visualizador.escenas.${s()}`), o = () => c().escenas.includes(s());
  return ssr(pe, ssrHydrationKey(), escape(a$1("visualizador.titulo")), ssrAttribute("aria-label", escape(a$1("visualizador.titulo"), true), false), escape(createComponent(For, { each: a, children: (d) => ssrElement("a", mergeProps({ get href() {
    return `?escena=${d}&material=${c().slug}`;
  } }, { noscroll: "", replace: true }, { get "aria-current"() {
    return s() === d ? "true" : void 0;
  } }), () => escape(a$1(`visualizador.escenas.${d}`)), true) })), escape(createComponent(le, { get escena() {
    return s();
  }, get material() {
    return c();
  }, get escenaLabel() {
    return b();
  }, get available() {
    return o();
  } })), escape(createComponent(me, { get materials() {
    return t.materials;
  }, get escena() {
    return s();
  }, get selected() {
    return c().slug;
  } })), escape(createComponent(ve, { get material() {
    return c();
  } })));
}
var $e = ["<div", ' class="container">', "</div>"], fe = ["<section", ' class="container" style="', '"><h2>', '</h2><div style="', '">', '</div><p style="', '">', "</p></section>"], ye = ["<section", ' class="container" style="', '"><h2>', '</h2><p style="', '">', "</p><p>", "</p></section>"];
const ze = k(() => o(), "materials"), we = k(() => i(), "trabajos");
function Be() {
  const { t } = Y(), a = y(() => ze()), n = y(() => we());
  return [createComponent(Q, { name: "description", content: "Encimeras de granito, cuarzo y m\xE1rmol en Louisville, KY. Visualiza cada piedra en tu cocina o ba\xF1o y pide tu cotizaci\xF3n gratis. Atenci\xF3n en espa\xF1ol e ingl\xE9s." }), createComponent(Q, { property: "og:title", content: "Granite Concepts \u2014 Encimeras en Louisville, KY" }), createComponent(Q, { property: "og:description", content: "Visualiza granito, cuarzo y m\xE1rmol en tu espacio. Cotizaci\xF3n gratis, atenci\xF3n biling\xFCe." }), createComponent(Q, { property: "og:type", content: "website" }), createComponent(ae, {}), ssr($e, ssrHydrationKey(), escape(createComponent(Show, { get when() {
    return a();
  }, children: (s) => createComponent(be, { get materials() {
    return s();
  } }) }))), createComponent(Show, { get when() {
    var _a;
    return ((_a = n()) != null ? _a : []).length > 0;
  }, get children() {
    return ssr(fe, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5) 0"), escape(t("trabajos.destacados")), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(min(18rem, 100%), 1fr))") + ssrStyleProperty(";gap:", "var(--sp-3)"), escape(createComponent(For, { get each() {
      var _a;
      return ((_a = n()) != null ? _a : []).slice(0, 3);
    }, children: (s) => createComponent(p, { trabajo: s }) })), ssrStyleProperty("margin-top:", "var(--sp-3)"), escape(createComponent(A, { href: "/trabajos", get children() {
      return t("trabajos.verTodos");
    } })));
  } }), ssr(ye, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-6)") + ssrStyleProperty(";text-align:", "center"), escape(t("home.cta")), ssrStyleProperty("max-width:", "32rem") + ssrStyleProperty(";margin-inline:", "auto"), escape(t("home.subtitulo")), escape(createComponent(A, { href: "/cotizacion", class: "hero-cta", get children() {
    return t("nav.cotizacion");
  } })))];
}

export { Be as default };
//# sourceMappingURL=index.mjs.map
