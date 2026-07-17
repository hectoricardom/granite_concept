import { createComponent, ssr, ssrHydrationKey, escape, ssrStyleProperty, isServer, ssrAttribute, ssrElement, mergeProps } from 'solid-js/web';
import { Y, Q } from './index-CUDOCGCg.mjs';
import { Show, For, createSignal, createEffect, on, onMount, createMemo, onCleanup } from 'solid-js';
import { n as nt, c as a, k, b as o, d as i } from '../nitro/nitro.mjs';
import { f, w, h } from './images-mTFtFHLz2.mjs';
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

var te = ["<img", ' class="', '"', ' alt width="1600" height="500">'], ae = ["<section", ' class="hero"><div class="hero-sticky"><div class="hero-blobs" aria-hidden="true"><span class="blob blob-1"></span><span class="blob blob-2"></span><span class="blob blob-3"></span></div><div class="hero-copy container"><p class="eyebrow hero-line hero-line-0">Granito \xB7 Cuarzo \xB7 M\xE1rmol \u2014 Louisville, KY</p><h1><span class="hero-line hero-line-1">', '</span><span class="hero-line hero-line-2">', '</span></h1><p class="hero-sub hero-line hero-line-3">', '</p><div class="hero-actions hero-line hero-line-3"><!--$-->', '<!--/--><a href="#visualizador" class="hero-secondary">', '</a></div></div><div class="hero-slab" aria-hidden="true"><img class="', '"', ' alt width="1600" height="500"><!--$-->', "<!--/--></div></div></section>"];
function re() {
  const { t } = Y(), [a] = nt();
  let n, s, c, b, o;
  const d = () => a.material || "blanco-carrara", [$, L] = createSignal(f(d())), [A$1, w] = createSignal(""), [S, M] = createSignal("a");
  let j = 0;
  return createEffect(on(d, (f$1, m) => {
    if (isServer || m === void 0) return;
    const h = f(f$1), u = ++j, y = new Image();
    y.src = h, y.decode().then(() => {
      u === j && (S() === "a" ? (w(h), M("b")) : (L(h), M("a")));
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
  }), ssr(ae, ssrHydrationKey(), escape(t("home.tituloL1")), escape(t("home.tituloL2")), escape(t("home.subtitulo")), escape(createComponent(A, { href: "/cotizacion", class: "hero-cta", get children() {
    return t("home.cta");
  } })), escape(t("home.verMateriales")), `hero-slab-layer ${S() === "a" ? "slab-on" : ""}`, ssrAttribute("src", escape($(), true), false), escape(createComponent(Show, { get when() {
    return A$1();
  }, get children() {
    return ssr(te, ssrHydrationKey(), `hero-slab-layer ${S() === "b" ? "slab-on" : ""}`, ssrAttribute("src", escape(A$1(), true), false));
  } })));
}
var se = ["<img", ' class="', '"', ' width="1200" height="800" decoding="async">'], ie = ["<div", ' class="scene-missing"><img', ' alt width="72" height="72"><p><!--$-->', "<!--/--> \u2014 <!--$-->", "<!--/--></p></div>"], ne = ["<div", ' class="scene-viewer" aria-live="polite"><img class="', '"', ' width="1200" height="800" decoding="async" fetchpriority="high"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], le = ["<div", ' class="scene-caption"><p class="scene-caption-name">', '</p><p class="scene-caption-meta"><!--$-->', "<!--/--> \xB7 <!--$-->", "<!--/--> \xB7 <!--$-->", "<!--/--></p></div>"];
function oe(t) {
  const { t: a, lang: n } = Y(), s = t.available ? w(t.escena, t.material.slug) : "", [c, b] = createSignal(s), [o, d] = createSignal(""), [$, L] = createSignal("a"), [A, w$1] = createSignal(!t.available), [S, M] = createSignal(h()), [j, f$1] = createSignal("");
  let m = 0;
  function h() {
    return `${t.escenaLabel} \u2014 ${t.material.nombre}`;
  }
  return createEffect(on(() => [t.escena, t.material.slug, t.available], ([u, y, _], I) => {
    if (!_) {
      w$1(true);
      return;
    }
    if (isServer || !I) {
      w$1(false);
      return;
    }
    const E = w(u, y), K = ++m, T = new Image();
    T.src = E, T.decode().then(() => {
      K === m && (w$1(false), $() === "a" ? (d(E), f$1(h()), L("b")) : (b(E), M(h()), L("a")));
    }).catch(() => {
      K === m && w$1(true);
    });
  })), onCleanup(() => m++), ssr(ne, ssrHydrationKey(), `scene-layer ${$() === "a" ? "scene-visible" : ""}`, ssrAttribute("src", escape(c(), true), false) + ssrAttribute("alt", $() === "a" ? escape(S(), true) : "", false), escape(createComponent(Show, { get when() {
    return o();
  }, get children() {
    return ssr(se, ssrHydrationKey(), `scene-layer ${$() === "b" ? "scene-visible" : ""}`, ssrAttribute("src", escape(o(), true), false) + ssrAttribute("alt", $() === "b" ? escape(j(), true) : "", false));
  } })), escape(createComponent(Show, { get when() {
    return !A();
  }, get children() {
    return createComponent(Show, { get when() {
      return t.material;
    }, keyed: true, children: (u) => ssr(le, ssrHydrationKey(), escape(u.nombre), escape(a(`valores.tipo.${u.tipo}`)), escape(u.veta[n()]), escape("$".repeat(u.nivel))) });
  } })), escape(createComponent(Show, { get when() {
    return A();
  }, get children() {
    return ssr(ie, ssrHydrationKey(), ssrAttribute("src", escape(f(t.material.slug), true), false), escape(t.material.nombre), escape(a("visualizador.proximamente")));
  } })));
}
var ce = ["<ul", ' class="material-picker" role="list">', "</ul>"], ue = ["<img", ' alt width="44" height="44" loading="lazy">'], de = ["<span>", "</span>"], me = ["<li", ">", "</li>"];
function he(t) {
  return ssr(ce, ssrHydrationKey(), escape(createComponent(For, { get each() {
    return t.materials;
  }, children: (a) => ssr(me, ssrHydrationKey(), ssrElement("a", mergeProps({ class: "material-chip", get href() {
    return `?escena=${t.escena}&material=${a.slug}`;
  } }, { noscroll: "", replace: true }, { get "aria-current"() {
    return t.selected === a.slug ? "true" : void 0;
  } }), () => [ssr(ue, ssrAttribute("src", escape(f(a.slug), true), false)), ssr(de, escape(a.nombre))], false)) })));
}
var ge = ["<div", ' class="material-info"><h3>', '</h3><p class="material-desc">', "</p><dl>", "</dl></div>"], ve = ["<div", "><dt>", "</dt><dd>", "</dd></div>"];
function pe(t) {
  const { t: a, lang: n } = Y(), s = () => t.material, c = () => [[a("visualizador.tipo"), a(`valores.tipo.${s().tipo}`)], [a("visualizador.tono"), a(`valores.tono.${s().tono}`)], [a("visualizador.veta"), s().veta[n()]], [a("visualizador.dureza"), a(`valores.dureza.${s().dureza}`)], [a("visualizador.inversion"), "$".repeat(s().nivel)]];
  return ssr(ge, ssrHydrationKey(), escape(t.material.nombre), escape(t.material.desc[n()]), escape(createComponent(For, { get each() {
    return c();
  }, children: ([b, o]) => ssr(ve, ssrHydrationKey(), escape(b), escape(o)) })));
}
var be = ["<section", ' class="visualizer" id="visualizador"><h2>', '</h2><nav class="scene-tabs"', ">", '</nav><div class="visualizer-grid"><!--$-->', '<!--/--><div class="visualizer-side"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div></section>"];
function $e(t) {
  const { t: a$1 } = Y(), [n] = nt(), s = createMemo(() => a.includes(n.escena) ? n.escena : "cocina"), c = createMemo(() => {
    var _a;
    return (_a = t.materials.find((d) => d.slug === n.material)) != null ? _a : t.materials[0];
  }), b = () => a$1(`visualizador.escenas.${s()}`), o = () => h(s(), c().slug);
  return ssr(be, ssrHydrationKey(), escape(a$1("visualizador.titulo")), ssrAttribute("aria-label", escape(a$1("visualizador.titulo"), true), false), escape(createComponent(For, { each: a, children: (d) => ssrElement("a", mergeProps({ get href() {
    return `?escena=${d}&material=${c().slug}`;
  } }, { noscroll: "", replace: true }, { get "aria-current"() {
    return s() === d ? "true" : void 0;
  } }), () => escape(a$1(`visualizador.escenas.${d}`)), true) })), escape(createComponent(oe, { get escena() {
    return s();
  }, get material() {
    return c();
  }, get escenaLabel() {
    return b();
  }, get available() {
    return o();
  } })), escape(createComponent(he, { get materials() {
    return t.materials;
  }, get escena() {
    return s();
  }, get selected() {
    return c().slug;
  } })), escape(createComponent(pe, { get material() {
    return c();
  } })));
}
var fe = ["<div", ' class="container">', "</div>"], ye = ["<section", ' class="container" style="', '"><h2>', '</h2><div style="', '">', '</div><p style="', '">', "</p></section>"], ze = ["<section", ' class="container" style="', '"><h2>', '</h2><p style="', '">', "</p><p>", "</p></section>"];
const we = k(() => o(), "materials"), _e = k(() => i(), "trabajos");
function Ie() {
  const { t } = Y(), a = y(() => we()), n = y(() => _e());
  return [createComponent(Q, { name: "description", content: "Encimeras de granito, cuarzo y m\xE1rmol en Louisville, KY. Visualiza cada piedra en tu cocina o ba\xF1o y pide tu cotizaci\xF3n gratis. Atenci\xF3n en espa\xF1ol e ingl\xE9s." }), createComponent(Q, { property: "og:title", content: "Granite Concepts \u2014 Encimeras en Louisville, KY" }), createComponent(Q, { property: "og:description", content: "Visualiza granito, cuarzo y m\xE1rmol en tu espacio. Cotizaci\xF3n gratis, atenci\xF3n biling\xFCe." }), createComponent(Q, { property: "og:type", content: "website" }), createComponent(re, {}), ssr(fe, ssrHydrationKey(), escape(createComponent(Show, { get when() {
    return a();
  }, children: (s) => createComponent($e, { get materials() {
    return s();
  } }) }))), createComponent(Show, { get when() {
    var _a;
    return ((_a = n()) != null ? _a : []).length > 0;
  }, get children() {
    return ssr(ye, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5) 0"), escape(t("trabajos.destacados")), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(min(18rem, 100%), 1fr))") + ssrStyleProperty(";gap:", "var(--sp-3)"), escape(createComponent(For, { get each() {
      var _a;
      return ((_a = n()) != null ? _a : []).slice(0, 3);
    }, children: (s) => createComponent(p, { trabajo: s }) })), ssrStyleProperty("margin-top:", "var(--sp-3)"), escape(createComponent(A, { href: "/trabajos", get children() {
      return t("trabajos.verTodos");
    } })));
  } }), ssr(ze, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-6)") + ssrStyleProperty(";text-align:", "center"), escape(t("home.cta")), ssrStyleProperty("max-width:", "32rem") + ssrStyleProperty(";margin-inline:", "auto"), escape(t("home.subtitulo")), escape(createComponent(A, { href: "/cotizacion", class: "hero-cta", get children() {
    return t("nav.cotizacion");
  } })))];
}

export { Ie as default };
//# sourceMappingURL=index.mjs.map
