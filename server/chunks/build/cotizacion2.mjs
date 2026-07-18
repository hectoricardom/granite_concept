import { ssr, ssrHydrationKey, ssrStyleProperty, escape, createComponent, ssrAttribute } from 'solid-js/web';
import { o as oe, h as ht, p as pt, a as at, E, b as p } from '../nitro/nitro.mjs';
import { Show, createSignal, For } from 'solid-js';
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

var f = ["<p", ' class="qf-error" role="alert">', "</p>"], P = ["<p", ' class="qf-ok" role="status">', "</p>"], S = ["<form", ' class="quote-form" novalidate><div class="qf-field"><label for="qf-nombre">', '</label><input id="qf-nombre" name="nombre" autocomplete="name" required', "><!--$-->", '<!--/--></div><div class="qf-field"><label for="qf-telefono">', '</label><input id="qf-telefono" name="telefono" type="tel" autocomplete="tel" required', "><!--$-->", '<!--/--></div><div class="qf-field"><label for="qf-email">', '</label><input id="qf-email" name="email" type="email" autocomplete="email"></div><div class="qf-field"><label for="qf-tipo">', '</label><select id="qf-tipo" name="tipoProyecto">', '</select></div><div class="qf-field"><label for="qf-material">', '</label><select id="qf-material" name="material"', "><option value>", "</option><!--$-->", '<!--/--></select></div><div class="qf-field qf-field-full"><label for="qf-mensaje">', '</label><textarea id="qf-mensaje" name="mensaje" rows="4"></textarea></div><div class="qf-field-full"><button type="submit" class="hero-cta qf-submit"', ">", "</button><!--$-->", "<!--/--><!--$-->", "<!--/--></div></form>"], _ = ["<option", ">", "</option>"], j = ["<option", "", ">", "</option>"];
const x = ["cocina", "bano", "isla", "barra", "otro"];
function C(c) {
  var _a;
  const { t, lang: u } = oe(), [d] = at(), [m, T] = createSignal("idle"), [l, E] = createSignal({});
  return ssr(S, ssrHydrationKey(), escape(t("cotizacion.nombre")), ssrAttribute("aria-invalid", !!l().nombre, false), escape(createComponent(Show, { get when() {
    return l().nombre;
  }, get children() {
    return ssr(f, ssrHydrationKey(), escape(l().nombre));
  } })), escape(t("cotizacion.telefono")), ssrAttribute("aria-invalid", !!l().telefono, false), escape(createComponent(Show, { get when() {
    return l().telefono;
  }, get children() {
    return ssr(f, ssrHydrationKey(), escape(l().telefono));
  } })), escape(t("cotizacion.email")), escape(t("cotizacion.tipoProyecto")), escape(createComponent(For, { each: x, children: (n) => ssr(_, ssrHydrationKey() + ssrAttribute("value", escape(n, true), false), escape(t(`cotizacion.tipos.${n}`))) })), escape(t("cotizacion.material")), ssrAttribute("value", escape((_a = d.material) != null ? _a : "", true), false), escape(t("cotizacion.sinPreferencia")), escape(createComponent(For, { get each() {
    return c.materials;
  }, children: (n) => ssr(j, ssrHydrationKey() + ssrAttribute("value", escape(n.slug, true), false), ssrAttribute("selected", d.material === n.slug, true), escape(n.nombre)) })), escape(t("cotizacion.mensaje")), ssrAttribute("disabled", m() === "sending", true), m() === "sending" ? escape(t("cotizacion.enviando")) : escape(t("cotizacion.enviar")), escape(createComponent(Show, { get when() {
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
const A = E(() => p(), "materials");
function H() {
  const { t: c } = oe(), t = y(() => A());
  return ssr(k, ssrHydrationKey(), ssrStyleProperty("padding-block:", "var(--sp-5)"), escape(createComponent(ht, { children: "Cotizaci\xF3n gratis \u2014 Granite Concepts Louisville" })), escape(createComponent(pt, { name: "description", content: "Cotizaci\xF3n gratuita de encimeras de granito, cuarzo y m\xE1rmol en Louisville, KY. Atenci\xF3n en espa\xF1ol e ingl\xE9s." })), escape(c("cotizacion.titulo")), ssrStyleProperty("max-width:", "34rem"), escape(c("cotizacion.intro")), escape(createComponent(Show, { get when() {
    return t();
  }, children: (u) => createComponent(C, { get materials() {
    return u();
  } }) })));
}

export { H as default };
//# sourceMappingURL=cotizacion2.mjs.map
