import { ssr, ssrHydrationKey, escape, createComponent, ssrAttribute } from 'solid-js/web';
import { createSignal, onMount, Show } from 'solid-js';
import { H as He, h as ht } from '../nitro/nitro.mjs';
import { a as at, n as nt, r as rt, e as et } from './auth-C4c1oFqj.mjs';
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

var f = ["<p", ' class="auth-error" role="alert">', "</p>"], y = ["<main", ' class="auth-page"><!--$-->', '<!--/--><div class="auth-card"><p class="auth-brand"><span class="brand-serif">Granite</span> Concepts</p><h1>Panel de administraci\xF3n</h1><p class="auth-sub">Inicia sesi\xF3n para gestionar materiales, escenas y trabajos.</p><button class="hero-cta auth-btn" type="button"', ">", "</button><!--$-->", "<!--/--></div></main>"];
function E() {
  const c = He(), [t, v] = createSignal(null), [e, A] = createSignal(false);
  return onMount(async () => {
    await at(), nt() && rt() && c("/admin", { replace: true });
  }), ssr(y, ssrHydrationKey(), escape(createComponent(ht, { children: "Acceso \u2014 Granite Concepts" })), ssrAttribute("disabled", e(), true), e() ? "Redirigiendo\u2026" : "Iniciar sesi\xF3n con Google", escape(createComponent(Show, { get when() {
    return t() || et();
  }, get children() {
    return ssr(f, ssrHydrationKey(), escape(t() || et()));
  } })));
}

export { E as default };
//# sourceMappingURL=login2.mjs.map
