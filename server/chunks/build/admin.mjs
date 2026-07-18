import { ssr, ssrHydrationKey, escape, createComponent, ssrAttribute } from 'solid-js/web';
import { createSignal, onMount, Show, For } from 'solid-js';
import { k } from './index-BgYMpQL1.mjs';
import { a as at, n as nt, r as rt, H as H$1, Z as Z$1 } from './auth-C4c1oFqj2.mjs';
import { F as Fe } from '../nitro/nitro.mjs';
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

const y = "https://ssgloghr.com";
function O() {
  return y;
}
async function I(n, a = {}) {
  console.log(y);
  const m = await Z$1(`${y}/api/query`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: n, params: a }) }), t = await m.json().catch(() => ({}));
  if (!m.ok || t.error) throw new Error(t.error || `API ${m.status}`);
  return t.data;
}
function C(n) {
  let a = n;
  for (; a && typeof a == "object" && "data" in a && !Array.isArray(a); ) a = a.data;
  return a;
}
function v(n, a = "images") {
  var _a;
  return (_a = n.url) != null ? _a : n.file ? `/public/showroom/${a}/${n.file}` : void 0;
}
async function L() {
  var _a, _b, _c, _d, _e;
  const n = C(await I("getShowroomAdmin", {}));
  return { materials: ((_a = n == null ? void 0 : n.materials) != null ? _a : []).map((a) => ({ ...a, url: v(a) })), scenes: (_b = n == null ? void 0 : n.scenes) != null ? _b : [], combos: ((_c = n == null ? void 0 : n.combos) != null ? _c : []).map((a) => ({ ...a, url: v(a) })), gallery: ((_d = n == null ? void 0 : n.gallery) != null ? _d : []).map((a) => ({ ...a, url: v(a, a.kind === "video" ? "videos" : "images") })), quotes: (_e = n == null ? void 0 : n.quotes) != null ? _e : [], quoteCounts: n == null ? void 0 : n.quoteCounts };
}
async function R(n) {
  var _a;
  const a = C(await I("listShowroomQuotes", {}));
  return Array.isArray(a) ? a : (_a = a == null ? void 0 : a.quotes) != null ? _a : [];
}
var U = ["<span", ' class="admin-user"><!--$-->', '<!--/--><button class="admin-link">Cerrar sesi\xF3n</button></span>'], V = ["<p", ' class="admin-warn">Falta <code>VITE_API_URL</code>. Config\xFAralo para conectar el backend.</p>'], F = ["<nav", ' class="admin-tabs">', "</nav>"], G = ["<main", ' class="admin"><!--$-->', '<!--/--><header class="admin-head"><h1>Panel de administraci\xF3n</h1><!--$-->', "<!--/--></header><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></main>"], Q = ["<p", ' class="', '">', "</p>"], B = ["<p", ' class="auth-loading">Verificando acceso\u2026</p>'], H = ["<button", ' class="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--></button>"], J = ["<p", ">Cargando\u2026</p>"], K = ["<button", ' type="button" class="admin-btn-ghost">Cancelar</button>'], Z = ["<section", ' class="admin-section"><form class="admin-form"><h2>', '</h2><div class="admin-grid"><label>Nombre<input name="name" required></label><label>Tipo<select name="tipo">', '</select></label><label>Tono<select name="tono">', '</select></label><label>Dureza<select name="dureza">', '</select></label><label>Nivel ($)<input name="nivel" type="number" min="1" max="3" value="1"></label><label>Veta (ES)<input name="veta_es"></label><label>Veta (EN)<input name="veta_en"></label><label>Swatch (imagen)<input name="swatch" type="file" accept="image/*"></label><label class="admin-full">Descripci\xF3n (ES)<textarea name="desc_es" rows="2"></textarea></label><label class="admin-full">Descripci\xF3n (EN)<textarea name="desc_en" rows="2"></textarea></label></div><div class="admin-actions"><button class="hero-cta" type="submit">', "</button><!--$-->", '<!--/--></div></form><div class="admin-seedbar"><span><!--$-->', '<!--/--> materiales en el backend</span><button type="button" class="admin-btn-ghost"', ">", '</button></div><ul class="admin-list">', "</ul></section>"], h = ["<option", ">", "</option>"], W = ["<li", "><span><strong>", "</strong> <em>", "</em><!--$-->", '<!--/--></span><span class="admin-row-actions"><button class="admin-link">editar</button><button class="admin-link admin-danger">borrar</button></span></li>'], X = ["<section", ' class="admin-section"><form class="admin-form"><h2>Nueva escena</h2><div class="admin-grid"><label>Nombre<input name="name" required placeholder="Cocina, Ba\xF1o\u2026"></label></div><button class="hero-cta" type="submit">Crear escena</button></form><ul class="admin-list">', "</ul></section>"], Y = ["<li", "><span><strong>", "</strong> <em>", '</em></span><button class="admin-link admin-danger">borrar</button></li>'], ee = ["<section", ' class="admin-section"><form class="admin-form"><h2>Asignar imagen a escena \xD7 material</h2><div class="admin-grid"><label>Escena<select name="sceneId" required>', '</select></label><label>Material<select name="materialId" required>', '</select></label><label>Imagen<input type="file" accept="image/*" required></label></div><button class="hero-cta" type="submit">Guardar combo</button></form><ul class="admin-list">', "</ul></section>"], P = ["<img", ' src="', '" alt width="40" height="40">'], ae = ["<li", '><span class="admin-combo"><!--$-->', "<!--/--><strong>", "</strong> \xD7 <strong>", '</strong></span><button class="admin-link admin-danger">borrar</button></li>'], te = ["<section", ' class="admin-section"><form class="admin-form"><h2>Nuevo trabajo</h2><div class="admin-grid"><label>Tipo<select name="kind"><option value="image">imagen</option><option value="video">video</option></select></label><label>Archivo<input type="file" accept="image/*,video/mp4" required></label><label>T\xEDtulo<input name="title"></label><label>Espacio<select name="espacio"><option value>\u2014</option><!--$-->', '<!--/--></select></label><label>Material<select name="material"><option value>\u2014</option><!--$-->', '<!--/--></select></label><label class="admin-full">Descripci\xF3n<textarea name="description" rows="2"></textarea></label></div><button class="hero-cta" type="submit">Agregar trabajo</button></form><ul class="admin-list">', "</ul></section>"], ne = ["<li", '><span class="admin-combo"><!--$-->', "<!--/--><strong>", "</strong> <em>", '</em></span><button class="admin-link admin-danger">borrar</button></li>'], le = ["<section", ' class="admin-section"><h2>Cotizaciones</h2><ul class="admin-list">', "</ul></section>"], re = ["<li", ">Sin cotizaciones.</li>"], se = ["<br", ">"], ie = ["<small", ">", "</small>"], oe = ["<li", "><span><strong>", "</strong> \xB7 <!--$-->", "<!--/--><!--$-->", "<!--/--></span><select", '><option value="new">new</option><option value="contacted">contacted</option><option value="closed">closed</option></select></li>'];
const ce = ["granito", "cuarzo", "marmol", "cuarcita"], ue = ["claro", "medio", "oscuro", "calido"], me = ["media", "alta", "muy-alta"], de = ["cocina", "bano", "isla", "barra"];
function Ae() {
  const n = Fe(), [a, m] = createSignal(false), [t, d] = createSignal(null), [o, $e] = createSignal("materiales"), [T, _] = createSignal(null);
  onMount(async () => {
    if (await at(), !nt() || !rt()) {
      n("/login", { replace: true });
      return;
    }
    m(true), S();
  });
  async function S() {
    try {
      d(await L());
    } catch (i) {
      f("err", `No pude cargar el panel: ${i.message}`);
    }
  }
  function f(i, w) {
    _({ kind: i, text: w }), setTimeout(() => _(null), 4e3);
  }
  async function q() {
  }
  async function b(i, w) {
    try {
      return await i(), await S(), f("ok", w), true;
    } catch (E) {
      return f("err", E.message), false;
    }
  }
  const $ = O();
  return ssr(G, ssrHydrationKey(), escape(createComponent(k, { children: "Panel \u2014 Granite Concepts" })), escape(createComponent(Show, { get when() {
    return a();
  }, get children() {
    return ssr(U, ssrHydrationKey(), escape(createComponent(Show, { get when() {
      var _a;
      return (_a = H$1()) == null ? void 0 : _a.name;
    }, get children() {
      return [H$1().name, " \xB7 "];
    } })));
  } })), escape(createComponent(Show, { get when() {
    return T();
  }, children: (i) => ssr(Q, ssrHydrationKey(), `admin-flash admin-flash-${escape(i().kind, true)}`, escape(i().text)) })), escape(createComponent(Show, { when: !$, get children() {
    return ssr(V, ssrHydrationKey());
  } })), escape(createComponent(Show, { get when() {
    return a();
  }, get fallback() {
    return ssr(B, ssrHydrationKey());
  }, get children() {
    return [ssr(F, ssrHydrationKey(), escape(createComponent(For, { each: ["materiales", "escenas", "combos", "trabajos", "cotizaciones"], children: (i) => ssr(H, ssrHydrationKey(), `admin-tab ${o() === i ? "admin-tab-on" : ""}`, escape(i), escape(createComponent(Show, { get when() {
      var _a, _b;
      return i === "cotizaciones" && ((_b = (_a = t()) == null ? void 0 : _a.quotes) == null ? void 0 : _b.length);
    }, get children() {
      var _a;
      return [" ", "(", (_a = t()) == null ? void 0 : _a.quotes.length, ")"];
    } }))) }))), createComponent(Show, { get when() {
      return t();
    }, get fallback() {
      return ssr(J, ssrHydrationKey());
    }, children: (i) => [createComponent(Show, { get when() {
      return o() === "materiales";
    }, get children() {
      return createComponent(ge, { get data() {
        return i();
      }, run: b, onSeed: q });
    } }), createComponent(Show, { get when() {
      return o() === "escenas";
    }, get children() {
      return createComponent(he, { get data() {
        return i();
      }, run: b });
    } }), createComponent(Show, { get when() {
      return o() === "combos";
    }, get children() {
      return createComponent(be, { get data() {
        return i();
      }, run: b, base: $ });
    } }), createComponent(Show, { get when() {
      return o() === "trabajos";
    }, get children() {
      return createComponent(pe, { get data() {
        return i();
      }, run: b, base: $ });
    } }), createComponent(Show, { get when() {
      return o() === "cotizaciones";
    }, get children() {
      return createComponent(fe, { get data() {
        return i();
      }, run: b });
    } })] })];
  } })));
}
function ge(n) {
  const [a, m] = createSignal(null), [t, d] = createSignal(false);
  return ssr(Z, ssrHydrationKey(), a() ? "Editar material" : "Nuevo material", escape(createComponent(For, { each: ce, children: (o) => ssr(h, ssrHydrationKey(), escape(o)) })), escape(createComponent(For, { each: ue, children: (o) => ssr(h, ssrHydrationKey(), escape(o)) })), escape(createComponent(For, { each: me, children: (o) => ssr(h, ssrHydrationKey(), escape(o)) })), a() ? "Guardar" : "Crear material", escape(createComponent(Show, { get when() {
    return a();
  }, get children() {
    return ssr(K, ssrHydrationKey());
  } })), escape(n.data.materials.length), ssrAttribute("disabled", t(), true), t() ? "Importando\u2026" : `Importar ${escape(materialsSeed.length)} del seed`, escape(createComponent(For, { get each() {
    return n.data.materials;
  }, children: (o) => ssr(W, ssrHydrationKey(), escape(o.name), escape(o.slug), o.active === false ? " \xB7 inactivo" : "") })));
}
function he(n) {
  return ssr(X, ssrHydrationKey(), escape(createComponent(For, { get each() {
    return n.data.scenes;
  }, children: (a) => ssr(Y, ssrHydrationKey(), escape(a.name), escape(a.slug)) })));
}
function be(n) {
  const a = (t) => {
    var _a, _b, _c;
    return (_c = (_b = (_a = n.data.scenes.find((d) => d.id === t.sceneId || d.slug === t.sceneSlug || d.id === t.sceneSlug)) == null ? void 0 : _a.name) != null ? _b : t.sceneSlug) != null ? _c : t.sceneId;
  }, m = (t) => {
    var _a, _b, _c;
    return (_c = (_b = (_a = n.data.materials.find((d) => d.id === t.materialId || d.slug === t.materialSlug || d.id === t.materialSlug)) == null ? void 0 : _a.name) != null ? _b : t.materialSlug) != null ? _c : t.materialId;
  };
  return ssr(ee, ssrHydrationKey(), escape(createComponent(For, { get each() {
    return n.data.scenes;
  }, children: (t) => ssr(h, ssrHydrationKey() + ssrAttribute("value", escape(t.id, true), false), escape(t.name)) })), escape(createComponent(For, { get each() {
    return n.data.materials;
  }, children: (t) => ssr(h, ssrHydrationKey() + ssrAttribute("value", escape(t.id, true), false), escape(t.name)) })), escape(createComponent(For, { get each() {
    return n.data.combos;
  }, children: (t) => ssr(ae, ssrHydrationKey(), escape(createComponent(Show, { get when() {
    return n.base && t.url;
  }, get children() {
    return ssr(P, ssrHydrationKey(), `${escape(n.base, true)}${escape(t.url, true)}?w=100`);
  } })), escape(a(t)), escape(m(t))) })));
}
function pe(n) {
  return ssr(te, ssrHydrationKey(), escape(createComponent(For, { each: de, children: (a) => ssr(h, ssrHydrationKey(), escape(a)) })), escape(createComponent(For, { get each() {
    return n.data.materials;
  }, children: (a) => ssr(h, ssrHydrationKey() + ssrAttribute("value", escape(a.slug, true), false), escape(a.name)) })), escape(createComponent(For, { get each() {
    return n.data.gallery;
  }, children: (a) => ssr(ne, ssrHydrationKey(), escape(createComponent(Show, { get when() {
    return n.base && a.kind === "image";
  }, get children() {
    return ssr(P, ssrHydrationKey(), `${escape(n.base, true)}${escape(a.url, true)}?w=100`);
  } })), escape(a.title || "(sin t\xEDtulo)"), escape(a.kind)) })));
}
function fe(n) {
  var _a;
  const [a, m] = createSignal((_a = n.data.quotes) != null ? _a : []);
  return onMount(async () => {
    try {
      m(await R());
    } catch {
    }
  }), ssr(le, ssrHydrationKey(), escape(createComponent(For, { get each() {
    return a();
  }, get fallback() {
    return ssr(re, ssrHydrationKey());
  }, children: (t) => ssr(oe, ssrHydrationKey(), escape(t.name), escape(t.phone || t.email), escape(createComponent(Show, { get when() {
    return t.message;
  }, get children() {
    return [ssr(se, ssrHydrationKey()), ssr(ie, ssrHydrationKey(), escape(t.message))];
  } })), ssrAttribute("value", escape(t.status, true), false)) })));
}

export { Ae as default };
//# sourceMappingURL=admin.mjs.map
