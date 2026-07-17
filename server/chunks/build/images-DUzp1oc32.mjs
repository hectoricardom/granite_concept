const t = /* @__PURE__ */ new Set(["isla/calacatta-oro", "isla/blanco-carrara", "bano/calacatta-oro", "bano/blanco-carrara", "cocina/calacatta-oro", "cocina/blanco-carrara", "barra/calacatta-oro", "barra/blanco-carrara"]);
function i(a, c, o, s) {
  const r = t.has(`${a}/${c}`) ? "avif" : "svg";
  return `/img/scenes/${a}/${c}.${r}`;
}
const n = /* @__PURE__ */ new Set(["blanco-carrara", "calacatta-oro"]);
function E(a, c) {
  const o = n.has(a) ? "avif" : "svg";
  return `/img/swatches/${a}.${o}`;
}

export { E, i };
//# sourceMappingURL=images-DUzp1oc32.mjs.map
