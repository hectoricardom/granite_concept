const i = ["bano/bay-shore", "bano/black-galaxy", "bano/black-pearl", "bano/blanco-carrara", "bano/blue-dunes", "bano/calacatta-oro", "bano/cincinnati", "bano/fantasy-brown", "bano/luna-pearl", "bano/smithtown", "bano/taj-mahal", "bano/valiant-avila", "barra/black-galaxy", "barra/black-pearl", "barra/blanco-carrara", "barra/blue-dunes", "barra/calacatta-oro", "barra/cincinnati", "barra/fantasy-brown", "barra/luna-pearl", "barra/smithtown", "barra/taj-mahal", "barra/valiant-avila", "cocina/bay-shore", "cocina/black-galaxy", "cocina/black-pearl", "cocina/blanco-carrara", "cocina/blue-dunes", "cocina/calacatta-oro", "cocina/cincinnati", "cocina/fantasy-brown", "cocina/luna-pearl", "cocina/smithtown", "cocina/taj-mahal", "cocina/valiant-avila", "isla/bay-shore", "isla/black-galaxy", "isla/black-pearl", "isla/blanco-carrara", "isla/blue-dunes", "isla/calacatta-oro", "isla/cincinnati", "isla/fantasy-brown", "isla/luna-pearl", "isla/smithtown", "isla/taj-mahal", "isla/valiant-avila"], t = ["bay-shore", "black-galaxy", "black-pearl", "blanco-carrara", "blue-dunes", "calacatta-oro", "cincinnati", "fantasy-brown", "luna-pearl", "smithtown", "taj-mahal", "valiant-avila"], l = { scenes: i, swatches: t }, o = "svg", r = new Set(l.scenes), b = new Set(l.swatches);
function h(a, n) {
  return r.has(`${a}/${n}`);
}
function w(a, n, c, e) {
  const s = r.has(`${a}/${n}`) ? "avif" : o;
  return `/img/scenes/${a}/${n}.${s}`;
}
function f(a, n) {
  const c = b.has(a) ? "avif" : o;
  return `/img/swatches/${a}.${c}`;
}

export { f, h, w };
//# sourceMappingURL=images-mTFtFHLz2.mjs.map
