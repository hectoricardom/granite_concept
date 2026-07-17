import { onCleanup } from 'solid-js';
import { isServer, getRequestEvent } from 'solid-js/web';

const u = isServer ? (t) => {
  const e = getRequestEvent();
  return e.response.status = t.code, e.response.statusText = t.text, onCleanup(() => !e.nativeEvent.handled && !e.complete && (e.response.status = 200)), null;
} : (t) => null;

export { u };
//# sourceMappingURL=HttpStatusCode-DH8IeaZe.mjs.map
