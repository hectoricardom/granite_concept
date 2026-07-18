import { createComponent, ssr, ssrHydrationKey, escape, ssrStyleProperty, isServer, ssrAttribute, ssrElement, mergeProps } from 'solid-js/web';
import { o as oe$1, p as pt, A, a as at, E, b as p, c as h, y as y$1 } from '../nitro/nitro.mjs';
import { Show, For, createSignal, createEffect, on, onMount, createMemo, onCleanup } from 'solid-js';
import { B, a } from './WorkCard-kIVRKyDa.mjs';
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

var ee = ["<img", ' class="', '"', ' alt width="1600" height="500">'], te = ["<section", ' class="hero"><div class="hero-sticky"><div class="hero-blobs" aria-hidden="true"><span class="blob blob-1"></span><span class="blob blob-2"></span><span class="blob blob-3"></span></div><div class="hero-copy container"><p class="eyebrow hero-line hero-line-0">Granito \xB7 Cuarzo \xB7 M\xE1rmol \u2014 Louisville, KY</p><h1><span class="hero-line hero-line-1">', '</span><span class="hero-line hero-line-2">', '</span></h1><p class="hero-sub hero-line hero-line-3">', '</p><div class="hero-actions hero-line hero-line-3"><!--$-->', '<!--/--><a href="#visualizador" class="hero-secondary">', '</a></div></div><div class="hero-slab" aria-hidden="true"><img class="', '"', ' alt width="1600" height="500"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div></section>"], ae = ["<div", ' class="hero-slab-info"><span class="hero-slab-name">', '</span><span class="hero-slab-meta"><!--$-->', "<!--/--> \xB7 <!--$-->", "<!--/--> \xB7 <!--$-->", "<!--/--></span></div>"];
function re(t) {
  var _a, _b;
  const { t: a, lang: d } = oe$1(), [n] = at();
  let c, m, w, S, s;
  const g = () => {
    var _a2, _b2;
    return n.material || ((_b2 = (_a2 = t.materials) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.slug) || "";
  }, E = () => {
    var _a2;
    return (_a2 = t.materials) == null ? void 0 : _a2.find((l) => l.slug === g());
  }, [M, _] = createSignal((_b = (_a = E()) == null ? void 0 : _a.swatch) != null ? _b : ""), [j, P] = createSignal(""), [x, k] = createSignal("a");
  let z = 0;
  return createEffect(on(g, (l, u) => {
    var _a2, _b2;
    if (isServer || u === void 0) return;
    const h = (_b2 = (_a2 = t.materials) == null ? void 0 : _a2.find((p) => p.slug === l)) == null ? void 0 : _b2.swatch;
    if (!h) return;
    const A = ++z, v = new Image();
    v.src = h, v.decode().then(() => {
      A === z && (x() === "a" ? (P(h), k("b")) : (_(h), k("a")));
    }).catch(() => {
    });
  })), onMount(async () => {
    if (isServer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { animate: l, scroll: u } = await import('motion'), h = { target: c, offset: ["start start", "end start"] };
    u(l(m, { y: [0, -120], opacity: [1, 0] }, { ease: "linear" }), h), u(l(S, { y: [0, -260] }, { ease: "linear" }), h), u(l(w, { transform: ["translateY(34%) scale(1.06)", "translateY(0%) scale(1)"], clipPath: ["inset(0 12% 0 12% round 22px)", "inset(0 0% 0 0% round 14px)"] }, { ease: "linear" }), { target: c, offset: ["start start", "end 85%"] });
    const A = 6;
    s.addEventListener("mousemove", (v) => {
      const p = s.getBoundingClientRect(), C = ((v.clientX - p.left) / p.width - 0.5) * 2 * A, N = ((v.clientY - p.top) / p.height - 0.5) * 2 * A;
      s.style.translate = `${C}px ${N}px`;
    }), s.addEventListener("mouseleave", () => {
      s.style.translate = "0px 0px";
    });
  }), ssr(te, ssrHydrationKey(), escape(a("home.tituloL1")), escape(a("home.tituloL2")), escape(a("home.subtitulo")), escape(createComponent(A, { href: "/cotizacion", class: "hero-cta", get children() {
    return a("home.cta");
  } })), escape(a("home.verMateriales")), `hero-slab-layer ${x() === "a" ? "slab-on" : ""}`, ssrAttribute("src", escape(M(), true), false), escape(createComponent(Show, { get when() {
    return j();
  }, get children() {
    return ssr(ee, ssrHydrationKey(), `hero-slab-layer ${x() === "b" ? "slab-on" : ""}`, ssrAttribute("src", escape(j(), true), false));
  } })), escape(createComponent(Show, { get when() {
    return E();
  }, keyed: true, children: (l) => ssr(ae, ssrHydrationKey(), escape(l.nombre), escape(a(`valores.tipo.${l.tipo}`)), escape(l.veta[d()]), escape("$".repeat(l.nivel))) })));
}
var se = ["<img", ' class="', '"', ' width="1200" height="800" decoding="async">'], ne = ["<div", ' class="scene-missing"><img', ' alt width="72" height="72"><p><!--$-->', "<!--/--> \u2014 <!--$-->", "<!--/--></p></div>"], ie = ["<div", ' class="scene-viewer" aria-live="polite"><img class="', '"', ' width="1200" height="800" decoding="async" fetchpriority="high"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], le = ["<div", ' class="scene-caption"><p class="scene-caption-name">', '</p><p class="scene-caption-meta"><!--$-->', "<!--/--> \xB7 <!--$-->", "<!--/--> \xB7 <!--$-->", "<!--/--></p></div>"];
function ce(t) {
  const { t: a, lang: d } = oe$1(), n = (u, h) => {
    var _a;
    return (_a = h.escenaSrc[u]) != null ? _a : "";
  }, c = t.available ? n(t.escena, t.material) : "", [m, w] = createSignal(c), [S, s] = createSignal(""), [g, E] = createSignal("a"), [M, _] = createSignal(!t.available), [j, P] = createSignal(l()), [x, k] = createSignal("");
  let z = 0;
  function l() {
    return `${t.escenaLabel} \u2014 ${t.material.nombre}`;
  }
  return createEffect(on(() => [t.escena, t.material.slug, t.available], ([u, , h], A) => {
    if (!h) {
      _(true);
      return;
    }
    if (isServer || !A) {
      _(false);
      return;
    }
    const v = n(u, t.material), p = ++z, C = new Image();
    C.src = v, C.decode().then(() => {
      p === z && (_(false), g() === "a" ? (s(v), k(l()), E("b")) : (w(v), P(l()), E("a")));
    }).catch(() => {
      p === z && _(true);
    });
  })), onCleanup(() => z++), ssr(ie, ssrHydrationKey(), `scene-layer ${g() === "a" ? "scene-visible" : ""}`, ssrAttribute("src", escape(m(), true), false) + ssrAttribute("alt", g() === "a" ? escape(j(), true) : "", false), escape(createComponent(Show, { get when() {
    return S();
  }, get children() {
    return ssr(se, ssrHydrationKey(), `scene-layer ${g() === "b" ? "scene-visible" : ""}`, ssrAttribute("src", escape(S(), true), false) + ssrAttribute("alt", g() === "b" ? escape(x(), true) : "", false));
  } })), escape(createComponent(Show, { get when() {
    return !M();
  }, get children() {
    return createComponent(Show, { get when() {
      return t.material;
    }, keyed: true, children: (u) => ssr(le, ssrHydrationKey(), escape(u.nombre), escape(a(`valores.tipo.${u.tipo}`)), escape(u.veta[d()]), escape("$".repeat(u.nivel))) });
  } })), escape(createComponent(Show, { get when() {
    return M();
  }, get children() {
    return ssr(ne, ssrHydrationKey(), ssrAttribute("src", escape(t.material.swatch, true), false), escape(t.material.nombre), escape(a("visualizador.proximamente")));
  } })));
}
var oe = ["<ul", ' class="material-picker" role="list">', "</ul>"], ue = ["<img", ' alt width="44" height="44" loading="lazy">'], de = ["<span>", "</span>"], me = ["<li", ">", "</li>"];
function he(t) {
  return ssr(oe, ssrHydrationKey(), escape(createComponent(For, { get each() {
    return t.materials;
  }, children: (a) => ssr(me, ssrHydrationKey(), ssrElement("a", mergeProps({ class: "material-chip", get href() {
    return `?escena=${t.escena}&material=${a.slug}`;
  } }, { noscroll: "", replace: true }, { get "aria-current"() {
    return t.selected === a.slug ? "true" : void 0;
  } }), () => [ssr(ue, ssrAttribute("src", escape(a.swatch, true), false)), ssr(de, escape(a.nombre))], false)) })));
}
var ge = ["<div", ' class="material-info"><h3>', '</h3><p class="material-desc">', "</p><dl>", "</dl></div>"], ve = ["<div", "><dt>", "</dt><dd>", "</dd></div>"];
function pe(t) {
  const { t: a, lang: d } = oe$1(), n = () => t.material, c = () => [[a("visualizador.tipo"), a(`valores.tipo.${n().tipo}`)], [a("visualizador.tono"), a(`valores.tono.${n().tono}`)], [a("visualizador.veta"), n().veta[d()]], [a("visualizador.dureza"), a(`valores.dureza.${n().dureza}`)], [a("visualizador.inversion"), "$".repeat(n().nivel)]];
  return ssr(ge, ssrHydrationKey(), escape(t.material.nombre), escape(t.material.desc[d()]), escape(createComponent(For, { get each() {
    return c();
  }, children: ([m, w]) => ssr(ve, ssrHydrationKey(), escape(m), escape(w)) })));
}
var be = ["<section", ' class="visualizer" id="visualizador"><h2>', '</h2><nav class="scene-tabs"', ">", '</nav><div class="visualizer-grid"><!--$-->', '<!--/--><div class="visualizer-side"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div></section>"];
function $e(t) {
  const { t: a$1 } = oe$1(), [d] = at(), n = createMemo(() => t.scenes && t.scenes.length ? t.scenes : a.map((s) => ({ slug: s, nombre: a$1(`visualizador.escenas.${s}`) }))), c = createMemo(() => {
    const s = n();
    return s.some((g) => g.slug === d.escena) ? d.escena : s[0].slug;
  }), m = createMemo(() => {
    var _a;
    return (_a = t.materials.find((s) => s.slug === d.material)) != null ? _a : t.materials[0];
  }), w = () => {
    var _a, _b;
    return (_b = (_a = n().find((s) => s.slug === c())) == null ? void 0 : _a.nombre) != null ? _b : c();
  }, S = () => !!m().escenaSrc[c()];
  return ssr(be, ssrHydrationKey(), escape(a$1("visualizador.titulo")), ssrAttribute("aria-label", escape(a$1("visualizador.titulo"), true), false), escape(createComponent(For, { get each() {
    return n();
  }, children: (s) => ssrElement("a", mergeProps({ get href() {
    return `?escena=${s.slug}&material=${m().slug}`;
  } }, { noscroll: "", replace: true }, { get "aria-current"() {
    return c() === s.slug ? "true" : void 0;
  } }), () => escape(s.nombre), true) })), escape(createComponent(ce, { get escena() {
    return c();
  }, get material() {
    return m();
  }, get escenaLabel() {
    return w();
  }, get available() {
    return S();
  } })), escape(createComponent(he, { get materials() {
    return t.materials;
  }, get escena() {
    return c();
  }, get selected() {
    return m().slug;
  } })), escape(createComponent(pe, { get material() {
    return m();
  } })));
}
var fe = ["<div", ' class="container">', "</div>"], ye = ["<section", ' class="container" style="', '"><h2>', '</h2><div style="', '">', '</div><p style="', '">', "</p></section>"], we = ["<section", ' class="container" style="', '"><h2>', '</h2><p style="', '">', "</p><p>", "</p></section>"];
const ze = E(() => p(), "materials"), Se = E(() => h(), "scenes"), _e = E(() => y$1(), "trabajos");
function Ye() {
  const { t } = oe$1(), a = y(() => ze()), d = y(() => Se()), n = y(() => _e());
  return [createComponent(pt, { name: "description", content: "Encimeras de granito, cuarzo y m\xE1rmol en Louisville, KY. Visualiza cada piedra en tu cocina o ba\xF1o y pide tu cotizaci\xF3n gratis. Atenci\xF3n en espa\xF1ol e ingl\xE9s." }), createComponent(pt, { property: "og:title", content: "Granite Concepts \u2014 Encimeras en Louisville, KY" }), createComponent(pt, { property: "og:description", content: "Visualiza granito, cuarzo y m\xE1rmol en tu espacio. Cotizaci\xF3n gratis, atenci\xF3n biling\xFCe." }), createComponent(pt, { property: "og:type", content: "website" }), createComponent(re, { get materials() {
    return a();
  } }), ssr(fe, ssrHydrationKey(), escape(createComponent(Show, { get when() {
    var _a;
    return (_a = a()) == null ? void 0 : _a.length;
  }, get children() {
    return createComponent($e, { get materials() {
      return a();
    }, get scenes() {
      return d();
    } });
  } }))), createComponent(Show, { get when() {
    var _a;
    return ((_a = n()) != null ? _a : []).length > 0;
  }, get children() {
    return ssr(ye, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5) 0"), escape(t("trabajos.destacados")), ssrStyleProperty("display:", "grid") + ssrStyleProperty(";grid-template-columns:", "repeat(auto-fit, minmax(min(18rem, 100%), 1fr))") + ssrStyleProperty(";gap:", "var(--sp-3)"), escape(createComponent(For, { get each() {
      var _a;
      return ((_a = n()) != null ? _a : []).slice(0, 3);
    }, children: (c) => createComponent(B, { trabajo: c }) })), ssrStyleProperty("margin-top:", "var(--sp-3)"), escape(createComponent(A, { href: "/trabajos", get children() {
      return t("trabajos.verTodos");
    } })));
  } }), ssr(we, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-6)") + ssrStyleProperty(";text-align:", "center"), escape(t("home.cta")), ssrStyleProperty("max-width:", "32rem") + ssrStyleProperty(";margin-inline:", "auto"), escape(t("home.subtitulo")), escape(createComponent(A, { href: "/cotizacion", class: "hero-cta", get children() {
    return t("nav.cotizacion");
  } })))];
}

export { Ye as default };
//# sourceMappingURL=index4.mjs.map
