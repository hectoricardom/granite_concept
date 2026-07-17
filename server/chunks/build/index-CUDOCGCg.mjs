import { isServer, createComponent, useAssets, ssr, spread, escape } from 'solid-js/web';
import { useContext, createContext, createUniqueId, createRenderEffect, onCleanup, createSignal, onMount, createMemo, sharedConfig } from 'solid-js';
import * as se from '@solid-primitives/i18n';

const C = createContext(), E = ["title", "meta"], u = [], m = ["name", "http-equiv", "content", "charset", "media"].concat(["property"]), d = (t, o) => {
  const e = Object.fromEntries(Object.entries(t.props).filter(([r]) => o.includes(r)).sort());
  return (Object.hasOwn(e, "name") || Object.hasOwn(e, "property")) && (e.name = e.name || e.property, delete e.property), t.tag + JSON.stringify(e);
};
function O() {
  if (!sharedConfig.context) {
    const e = document.head.querySelectorAll("[data-sm]");
    Array.prototype.forEach.call(e, (r) => r.parentNode.removeChild(r));
  }
  const t = /* @__PURE__ */ new Map();
  function o(e) {
    if (e.ref) return e.ref;
    let r = document.querySelector(`[data-sm="${e.id}"]`);
    return r ? (r.tagName.toLowerCase() !== e.tag && (r.parentNode && r.parentNode.removeChild(r), r = document.createElement(e.tag)), r.removeAttribute("data-sm")) : r = document.createElement(e.tag), r;
  }
  return { addTag(e) {
    if (E.indexOf(e.tag) !== -1) {
      const i = e.tag === "title" ? u : m, n = d(e, i);
      t.has(n) || t.set(n, []);
      let s = t.get(n), p = s.length;
      s = [...s, e], t.set(n, s);
      let c = o(e);
      e.ref = c, spread(c, e.props);
      let l = null;
      for (var r = p - 1; r >= 0; r--) if (s[r] != null) {
        l = s[r];
        break;
      }
      return c.parentNode != document.head && document.head.appendChild(c), l && l.ref && l.ref.parentNode && document.head.removeChild(l.ref), p;
    }
    let a = o(e);
    return e.ref = a, spread(a, e.props), a.parentNode != document.head && document.head.appendChild(a), -1;
  }, removeTag(e, r) {
    const a = e.tag === "title" ? u : m, i = d(e, a);
    if (e.ref) {
      const n = t.get(i);
      if (n) {
        if (e.ref.parentNode) {
          e.ref.parentNode.removeChild(e.ref);
          for (let s = r - 1; s >= 0; s--) n[s] != null && document.head.appendChild(n[s].ref);
        }
        n[r] = null, t.set(i, n);
      } else e.ref.parentNode && e.ref.parentNode.removeChild(e.ref);
    }
  } };
}
function $() {
  const t = [];
  return useAssets(() => ssr(V(t))), { addTag(o) {
    if (E.indexOf(o.tag) !== -1) {
      const e = o.tag === "title" ? u : m, r = d(o, e), a = t.findIndex((i) => i.tag === o.tag && d(i, e) === r);
      a !== -1 && t.splice(a, 1);
    }
    return t.push(o), t.length;
  }, removeTag(o, e) {
  } };
}
const W = (t) => {
  const o = isServer ? $() : O();
  return createComponent(C.Provider, { value: o, get children() {
    return t.children;
  } });
}, z = (t, o, e) => (A({ tag: t, props: o, setting: e, id: createUniqueId(), get name() {
  return o.name || o.property;
} }), null);
function A(t) {
  const o = useContext(C);
  if (!o) throw new Error("<MetaProvider /> should be in the tree");
  createRenderEffect(() => {
    const e = o.addTag(t);
    onCleanup(() => o.removeTag(t, e));
  });
}
function V(t) {
  return t.map((o) => {
    var _a, _b;
    const r = Object.keys(o.props).map((i) => i === "children" ? "" : ` ${i}="${escape(o.props[i], true)}"`).join("");
    let a = o.props.children;
    return Array.isArray(a) && (a = a.join("")), ((_a = o.setting) == null ? void 0 : _a.close) ? `<${o.tag} data-sm="${o.id}"${r}>${((_b = o.setting) == null ? void 0 : _b.escape) ? escape(a) : a || ""}</${o.tag}>` : `<${o.tag} data-sm="${o.id}"${r}/>`;
  }).join("");
}
const H = (t) => z("title", t, { escape: true, close: true }), Q = (t) => z("meta", t), B = { valores: { tipo: { granito: "Granito", cuarzo: "Cuarzo", marmol: "M\xE1rmol", cuarcita: "Cuarcita" }, tono: { claro: "Claro", medio: "Medio", oscuro: "Oscuro", calido: "C\xE1lido" }, dureza: { media: "Media", alta: "Alta", "muy-alta": "Muy alta" } }, nav: { inicio: "Inicio", materiales: "Materiales", trabajos: "Trabajos", cotizacion: "Cotizaci\xF3n" }, footer: { lema: "Encimeras de granito y cuarzo en Louisville, KY", contacto: "Contacto", derechos: "Todos los derechos reservados" }, home: { titulo: "La piedra que transforma tu espacio", tituloL1: "La piedra que", tituloL2: "transforma tu espacio", subtitulo: "Granito, cuarzo y m\xE1rmol seleccionados a mano, fabricados e instalados por expertos en Louisville.", cta: "Pide tu cotizaci\xF3n", verMateriales: "Ver materiales" }, cotizacion: { titulo: "Pide tu cotizaci\xF3n", intro: "Cu\xE9ntanos de tu proyecto y te contactamos el mismo d\xEDa h\xE1bil. Sin compromiso.", nombre: "Nombre", telefono: "Tel\xE9fono", tipoProyecto: "Tipo de proyecto", tipos: { cocina: "Cocina", bano: "Ba\xF1o", isla: "Isla", barra: "Barra", otro: "Otro" }, material: "Material de inter\xE9s (opcional)", sinPreferencia: "Sin preferencia", mensaje: "Cu\xE9ntanos m\xE1s (opcional)", enviar: "Enviar solicitud", enviando: "Enviando\u2026", exito: "\xA1Recibido! Te contactamos pronto.", errorEnvio: "No pudimos enviar tu solicitud en este momento. Ll\xE1manos o escr\xEDbenos y te atendemos al instante.", errorNombre: "Escribe tu nombre", errorTelefono: "Escribe un tel\xE9fono v\xE1lido" }, catalogo: { titulo: "Materiales", intro: "Cada losa es \xFAnica. Estas son las familias que trabajamos; vis\xEDtanos para ver el inventario actual.", verEnEscena: "Ver en escena", detalleCta: "\xBFTe gusta esta piedra? Pide tu cotizaci\xF3n", disponibleEn: "Disponible en el visualizador" }, trabajos: { titulo: "Trabajos", destacados: "Trabajos recientes", verTodos: "Ver todos los trabajos", intro: "Proyectos fabricados e instalados por nuestro equipo en Louisville.", filtroMaterial: "Material", filtroEspacio: "Espacio", todos: "Todos", vacio: "Estamos fotografiando nuestros proyectos recientes. Vuelve pronto \u2014 o visita el showroom.", noResultados: "Sin proyectos con esos filtros." }, visualizador: { titulo: "Visualiza tu espacio", escenas: { cocina: "Cocina", bano: "Ba\xF1o", isla: "Isla", barra: "Barra" }, proximamente: "Foto pr\xF3ximamente", tipo: "Tipo", tono: "Tono", veta: "Veta", dureza: "Dureza", inversion: "Inversi\xF3n" } }, k = { valores: { tipo: { granito: "Granite", cuarzo: "Quartz", marmol: "Marble", cuarcita: "Quartzite" }, tono: { claro: "Light", medio: "Medium", oscuro: "Dark", calido: "Warm" }, dureza: { media: "Medium", alta: "High", "muy-alta": "Very high" } }, nav: { inicio: "Home", materiales: "Materials", trabajos: "Our Work", cotizacion: "Free Quote" }, footer: { lema: "Granite & quartz countertops in Louisville, KY", contacto: "Contact", derechos: "All rights reserved" }, home: { titulo: "Stone that transforms your space", tituloL1: "Stone that", tituloL2: "transforms your space", subtitulo: "Hand-selected granite, quartz and marble, fabricated and installed by experts in Louisville.", cta: "Get your free quote", verMateriales: "Browse materials" }, cotizacion: { titulo: "Get your free quote", intro: "Tell us about your project and we'll reach out the same business day. No commitment.", nombre: "Name", telefono: "Phone", tipoProyecto: "Project type", tipos: { cocina: "Kitchen", bano: "Bathroom", isla: "Island", barra: "Bar", otro: "Other" }, material: "Material of interest (optional)", sinPreferencia: "No preference", mensaje: "Tell us more (optional)", enviar: "Send request", enviando: "Sending\u2026", exito: "Received! We'll be in touch soon.", errorEnvio: "We couldn't send your request right now. Call or text us and we'll help you right away.", errorNombre: "Enter your name", errorTelefono: "Enter a valid phone number" }, catalogo: { titulo: "Materials", intro: "Every slab is unique. These are the families we work with; visit us to see current inventory.", verEnEscena: "See it in a room", detalleCta: "Love this stone? Get your free quote", disponibleEn: "Available in the visualizer" }, trabajos: { titulo: "Our Work", destacados: "Recent projects", verTodos: "See all projects", intro: "Projects fabricated and installed by our team in Louisville.", filtroMaterial: "Material", filtroEspacio: "Space", todos: "All", vacio: "We're photographing our recent projects. Check back soon \u2014 or visit the showroom.", noResultados: "No projects match those filters." }, visualizador: { titulo: "Visualize your space", escenas: { cocina: "Kitchen", bano: "Bathroom", isla: "Island", barra: "Bar" }, proximamente: "Photo coming soon", tipo: "Type", tono: "Tone", veta: "Veining", dureza: "Hardness", inversion: "Investment" } }, K = { es: B, en: k }, M = createContext();
function F(t) {
  const [o, e] = createSignal("es");
  onMount(() => {
    localStorage.getItem("lang") === "en" && (e("en"), document.documentElement.lang = "en");
  });
  const r = createMemo(() => se.flatten(K[o()])), a = se.translator(r), i = (n) => {
    e(n), isServer || (localStorage.setItem("lang", n), document.documentElement.lang = n);
  };
  return createComponent(M.Provider, { value: { lang: o, setLang: i, t: a }, get children() {
    return t.children;
  } });
}
function Y() {
  const t = useContext(M);
  if (!t) throw new Error("useI18n fuera de I18nProvider");
  return t;
}

export { F, H, Q, W, Y };
//# sourceMappingURL=index-CUDOCGCg.mjs.map
