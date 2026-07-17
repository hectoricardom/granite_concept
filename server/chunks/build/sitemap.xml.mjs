import { d as n$1, f as t } from '../nitro/nitro.mjs';
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
import 'solid-js';
import 'solid-js/web';
import 'solid-js/web/storage';
import 'seroval';
import 'seroval-plugins/web';
import '@solid-primitives/i18n';

const n = "https://graniteconcepts.example";
async function m() {
  const [s, t$1] = await Promise.all([n$1(), t()]), e = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${["/", "/materiales", "/trabajos", "/cotizacion", ...s.map((a) => `/materiales/${a.slug}`), ...t$1.map((a) => `/trabajos/${a.slug}`)].map((a) => `  <url><loc>${n}${a}</loc></url>`).join(`
`)}
</urlset>`;
  return new Response(e, { headers: { "Content-Type": "application/xml" } });
}

export { m as GET };
//# sourceMappingURL=sitemap.xml.mjs.map
