import { ssrElement, mergeProps as mergeProps$1 } from 'solid-js/web';
import { mergeProps, splitProps, createMemo } from 'solid-js';
import { U as Ue, D as De, O as Oe, r as C } from '../nitro/nitro.mjs';

function A(e) {
  e = mergeProps({ inactiveClass: "inactive", activeClass: "active" }, e);
  const [, r] = splitProps(e, ["href", "state", "class", "activeClass", "inactiveClass", "end"]), i = Ue(() => e.href), o = De(i), l = Oe(), a = createMemo(() => {
    const n = i();
    if (n === void 0) return [false, false];
    const t = C(n.split(/[?#]/, 1)[0]).toLowerCase(), s = decodeURI(C(l.pathname).toLowerCase());
    return [e.end ? t === s : s.startsWith(t + "/") || s === t, t === s];
  });
  return ssrElement("a", mergeProps$1(r, { get href() {
    return o() || e.href;
  }, get state() {
    return JSON.stringify(e.state);
  }, get classList() {
    return { ...e.class && { [e.class]: true }, [e.inactiveClass]: !a()[0], [e.activeClass]: a()[0], ...r.classList };
  }, link: true, get "aria-current"() {
    return a()[1] ? "page" : void 0;
  } }), void 0, true);
}

export { A };
//# sourceMappingURL=components-CDQikSFO.mjs.map
