import { ssr, ssrHydrationKey, ssrStyleProperty, escape, createComponent, ssrAttribute } from 'solid-js/web';
import { Y, H as H$1, Q } from './index-CUDOCGCg.mjs';
import { Show, createSignal, For } from 'solid-js';
import { n as nt, k as k$1, b as o } from '../nitro/nitro.mjs';
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

var f = ["<p", ' class="qf-error" role="alert">', "</p>"], P = ["<p", ' class="qf-ok" role="status">', "</p>"], S = ["<form", ' class="quote-form" novalidate><div class="qf-field"><label for="qf-nombre">', '</label><input id="qf-nombre" name="nombre" autocomplete="name" required', "><!--$-->", '<!--/--></div><div class="qf-field"><label for="qf-telefono">', '</label><input id="qf-telefono" name="telefono" type="tel" autocomplete="tel" required', "><!--$-->", '<!--/--></div><div class="qf-field"><label for="qf-tipo">', '</label><select id="qf-tipo" name="tipoProyecto">', '</select></div><div class="qf-field"><label for="qf-material">', '</label><select id="qf-material" name="material"', "><option value>", "</option><!--$-->", '<!--/--></select></div><div class="qf-field qf-field-full"><label for="qf-mensaje">', '</label><textarea id="qf-mensaje" name="mensaje" rows="4"></textarea></div><div class="qf-field-full"><button type="submit" class="hero-cta qf-submit"', ">", "</button><!--$-->", "<!--/--><!--$-->", "<!--/--></div></form>"], _ = ["<option", ">", "</option>"], x = ["<option", "", ">", "</option>"];
const C = ["cocina", "bano", "isla", "barra", "otro"];
function j(c) {
  var _a;
  const { t, lang: u } = Y(), [d] = nt(), [m, M] = createSignal("idle"), [n, T] = createSignal({});
  return ssr(S, ssrHydrationKey(), escape(t("cotizacion.nombre")), ssrAttribute("aria-invalid", !!n().nombre, false), escape(createComponent(Show, { get when() {
    return n().nombre;
  }, get children() {
    return ssr(f, ssrHydrationKey(), escape(n().nombre));
  } })), escape(t("cotizacion.telefono")), ssrAttribute("aria-invalid", !!n().telefono, false), escape(createComponent(Show, { get when() {
    return n().telefono;
  }, get children() {
    return ssr(f, ssrHydrationKey(), escape(n().telefono));
  } })), escape(t("cotizacion.tipoProyecto")), escape(createComponent(For, { each: C, children: (l) => ssr(_, ssrHydrationKey() + ssrAttribute("value", escape(l, true), false), escape(t(`cotizacion.tipos.${l}`))) })), escape(t("cotizacion.material")), ssrAttribute("value", escape((_a = d.material) != null ? _a : "", true), false), escape(t("cotizacion.sinPreferencia")), escape(createComponent(For, { get each() {
    return c.materials;
  }, children: (l) => ssr(x, ssrHydrationKey() + ssrAttribute("value", escape(l.slug, true), false), ssrAttribute("selected", d.material === l.slug, true), escape(l.nombre)) })), escape(t("cotizacion.mensaje")), ssrAttribute("disabled", m() === "sending", true), m() === "sending" ? escape(t("cotizacion.enviando")) : escape(t("cotizacion.enviar")), escape(createComponent(Show, { get when() {
    return m() === "ok";
  }, get children() {
    return ssr(P, ssrHydrationKey(), escape(t("cotizacion.exito")));
  } })), escape(createComponent(Show, { get when() {
    return m() === "error";
  }, get children() {
    return ssr(f, ssrHydrationKey(), escape(t("cotizacion.errorEnvio")));
  } })));
}
var k = ["<section", ' class="container" style="', '"><!--$-->', "<!--/--><!--$-->", "<!--/--><h1>", '</h1><p style="', '">', "</p><!--$-->", "<!--/--></section>"];
const A = k$1(() => o(), "materials");
function H() {
  const { t: c } = Y(), t = y(() => A());
  return ssr(k, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5)"), escape(createComponent(H$1, { children: "Cotizaci\xF3n gratis \u2014 Granite Concepts Louisville" })), escape(createComponent(Q, { name: "description", content: "Cotizaci\xF3n gratuita de encimeras de granito, cuarzo y m\xE1rmol en Louisville, KY. Atenci\xF3n en espa\xF1ol e ingl\xE9s." })), escape(c("cotizacion.titulo")), ssrStyleProperty("max-width:", "34rem"), escape(c("cotizacion.intro")), escape(createComponent(Show, { get when() {
    return t();
  }, children: (u) => createComponent(j, { get materials() {
    return u();
  } }) })));
}

export { H as default };
//# sourceMappingURL=cotizacion.mjs.map
