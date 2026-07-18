import { createSignal } from 'solid-js';

const v = { VITE_APP_ID: "subpay", VITE_IDSVC_URL: "https://ssgloghr.com/idsvc" }, i = v || {};
let f = { authBase: i.VITE_AUTH_BASE || "", idsvcUrl: i.VITE_IDSVC_URL || "", appId: i.VITE_APP_ID || "", clientId: i.VITE_SSO_CLIENT_ID || "", perms: {}, callbackPath: "/callback" };
function L(t) {
  f = { ...f, ...t };
}
function l() {
  return f;
}
const O = () => l().idsvcUrl, _ = () => l().appId, g = () => `idsvc_refresh_${_()}`;
let r = null;
const A = () => localStorage.getItem(g()), b = (t) => {
  r = t.access, localStorage.setItem(g(), t.refresh);
}, P = () => {
  r = null, localStorage.removeItem(g());
}, Y = (t) => b(t), D = () => !!A();
async function C(t, e) {
  const n = await fetch(`${O()}${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), s = await n.json().catch(() => ({}));
  if (!n.ok) throw Object.assign(new Error(s.error || `HTTP ${n.status}`), { status: n.status });
  return s && typeof s == "object" && s.data !== void 0 ? s.data : s;
}
let o = null;
async function p() {
  return o || (o = (async () => {
    const t = A();
    if (!t) return false;
    try {
      const e = await C("/auth/refresh", { refresh: t, app: _() });
      return b(e), true;
    } catch (e) {
      return ((e == null ? void 0 : e.status) === 401 || (e == null ? void 0 : e.status) === 400) && P(), false;
    } finally {
      o = null;
    }
  })(), o);
}
function m() {
  if (!r) return null;
  try {
    return JSON.parse(atob(r.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}
function R() {
  var _a;
  const t = m();
  return !!t && (t.superadmin || !!((_a = t.apps) == null ? void 0 : _a[_()]));
}
function T() {
  const t = m();
  return !t || t.exp * 1e3 - Date.now() < 6e4;
}
async function $() {
  return (!r || T()) && await p(), r;
}
async function Z(t, e = {}) {
  (!r || T()) && await p();
  const n = () => ({ ...e, headers: { ...e.headers || {}, Authorization: `Bearer ${r}` } });
  let s = await fetch(t, n());
  return s.status === 401 && await p() && (s = await fetch(t, n())), s;
}
function d(t) {
  if (typeof t == "boolean") return t;
  if (typeof t == "number") return t === 1;
  if (typeof t == "string") {
    const e = t.trim().toLowerCase();
    return e === "true" || e === "1" || e === "yes";
  }
  return false;
}
const I = "ops_user", h = /* @__PURE__ */ new Set();
function w() {
  for (const t of h) t();
}
function k(t) {
  return h.add(t), () => h.delete(t);
}
const N = () => {
  try {
    return JSON.parse(localStorage.getItem(I) || "null");
  } catch {
    return null;
  }
};
let a = N(), j = false, B = null;
const H = () => a, U = () => ({ user: a, loading: j, error: B });
function J(t) {
  t && localStorage.setItem(I, JSON.stringify(t)), a = t, w();
}
function x() {
  var _a;
  const t = m();
  if (!t) return false;
  const e = l().appId, s = (((_a = t.apps) == null ? void 0 : _a[e]) || Object.values(t.apps || {})[0] || {}).scope || {}, y = s.flags || {}, V = { id: t.sub, uid: t.uid, originalUserId: t.sub, googleUid: t.sub, name: t.name || "", email: t.email || (a == null ? void 0 : a.email) || "", businessId: s.businessId || "", permissions: { ...y, isAdmin: !!t.superadmin || d(y.isAdmin) }, superadmin: !!t.superadmin, apps: t.apps };
  return J(V), true;
}
async function F() {
  return D() ? navigator.onLine ? await $() ? (x(), true) : (localStorage.removeItem(I), a = null, w(), false) : !!a : false;
}
function K(t) {
  var _a, _b;
  if (R()) return true;
  const e = H();
  return e ? d(e.superadmin) || d((_a = e.permissions) == null ? void 0 : _a.isAdmin) ? true : !!((_b = e.apps) == null ? void 0 : _b[l().appId]) : false;
}
const S = U(), [M, z] = createSignal(S.user), [tt, W] = createSignal(S.loading), [et, q] = createSignal(S.error);
k(() => {
  const t = U();
  z(t.user), W(t.loading), q(t.error);
});
const G = { VITE_APP_ID: "subpay", VITE_IDSVC_URL: "https://ssgloghr.com/idsvc" }, c = G, Q = { admin: ["*"], owner: ["*"], showroom: ["showroom.manage"] };
L({ authBase: c.VITE_AUTH_BASE || c.VITE_SSO_URL || "https://ssgloghr.com", idsvcUrl: c.VITE_IDSVC_URL, appId: c.VITE_APP_ID, clientId: c.VITE_SSO_CLIENT_ID || "subpay", perms: Q, callbackPath: "/callback" });
const [st, E] = createSignal(true), nt = () => !!M(), rt = () => K();
async function at() {
  E(true);
  try {
    await F();
  } catch {
  } finally {
    E(false);
  }
}

export { H, Y, Z, at as a, et as e, l, nt as n, rt as r, x };
//# sourceMappingURL=auth-C4c1oFqj2.mjs.map
