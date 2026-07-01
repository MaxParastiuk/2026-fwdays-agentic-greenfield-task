// Shared one-time <style> injector for component pseudo-states (hover/focus/
// active) that inline styles can't express. Each component injects once,
// keyed by id. Rules reference the design-system CSS custom properties.
const _done = {};
export function inject(id, css) {
  if (typeof document === 'undefined' || _done[id]) return;
  _done[id] = true;
  const el = document.createElement('style');
  el.setAttribute('data-ds', id);
  el.textContent = css;
  document.head.appendChild(el);
}
