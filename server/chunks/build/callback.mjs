import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { createSignal, onMount, Show } from 'solid-js';
import { k } from './index-BgYMpQL1.mjs';
import { l, Y, x } from './auth-C4c1oFqj2.mjs';
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

const m = "pkce_verifier", f = "sso_state";
class t extends Error {
  constructor(e, o) {
    super(o), this.code = e, this.name = "SsoError";
  }
}
async function y(a) {
  const e = a.get("code"), o = a.get("state"), r = sessionStorage.getItem(f), d = sessionStorage.getItem(m);
  if (!e) throw new t("invalid_code", "Falta el c\xF3digo de autorizaci\xF3n.");
  if (!o || o !== r) throw new t("csrf", "Estado inv\xE1lido (posible CSRF).");
  if (!d) throw new t("pkce_failed", "Falta el verificador PKCE (\xBFotra pesta\xF1a?).");
  let i;
  try {
    i = await fetch(`${l().authBase}/sso/exchange`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: e, client_id: l().clientId, code_verifier: d }) });
  } catch {
    throw new t("exchange_failed", "No se pudo contactar el servidor de autenticaci\xF3n.");
  }
  if (!i.ok) throw new t("invalid_code", "El c\xF3digo es inv\xE1lido o expir\xF3.");
  const s = await i.json().catch(() => ({}));
  if (!s.access || !s.refresh) throw new t("exchange_failed", "El servidor no devolvi\xF3 los tokens de sesi\xF3n (JWT).");
  if (Y({ access: s.access, refresh: s.refresh }), !x()) throw new t("exchange_failed", "No se pudieron leer los claims del JWT.");
  sessionStorage.removeItem(m), sessionStorage.removeItem(f);
}
var C = ["<div", ' class="auth-card"><h1>Error de acceso</h1><p class="auth-error" role="alert">', '</p><button class="hero-cta auth-btn" type="button">Volver</button></div>'], b = ["<main", ' class="auth-page"><!--$-->', "<!--/--><!--$-->", "<!--/--></main>"], T = ["<p", ' class="auth-loading">Completando inicio de sesi\xF3n\u2026</p>'];
function P() {
  const a = Fe(), [e, o] = createSignal(null);
  return onMount(async () => {
    try {
      await y(new URLSearchParams(window.location.search)), a("/admin", { replace: true });
    } catch (r) {
      o(r instanceof Error ? r.message : "No se pudo completar el inicio de sesi\xF3n.");
    }
  }), ssr(b, ssrHydrationKey(), escape(createComponent(k, { children: "Acceso \u2014 Granite Concepts" })), escape(createComponent(Show, { get when() {
    return e();
  }, get fallback() {
    return ssr(T, ssrHydrationKey());
  }, get children() {
    return ssr(C, ssrHydrationKey(), escape(e()));
  } })));
}

export { P as default };
//# sourceMappingURL=callback.mjs.map
