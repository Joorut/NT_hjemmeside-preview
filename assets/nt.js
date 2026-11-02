// Nuuk Transport (site-nt): undersider i menuen og indlejring af lossekalenderen med automatisk højde.
(() => {
  // Tjenester > fold en tjenestes undersider ud/ind
  document.querySelectorAll('.dd-sub-toggle').forEach((btn) => btn.addEventListener('click', (e) => {
    e.stopPropagation(); // dropdownen skal blive åben
    const list = document.getElementById(btn.getAttribute('aria-controls'));
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    list.hidden = !open;
    btn.closest('.dd-item')?.classList.toggle('open', open);
  }));
})();

(() => {
  document.querySelectorAll('[data-cal]').forEach((box) => {
    const frame = box.querySelector('iframe[data-src]');
    const fallback = box.querySelector('.cal-fallback');
    const hosts = (box.dataset.hosts || '').split(' ').filter(Boolean);
    // Kalenderen sender Content-Security-Policy frame-ancestors transport.gl, så andre værter får en tom ramme.
    if (!frame || !hosts.includes(location.hostname)) return;
    frame.src = frame.dataset.src;
    frame.hidden = false;
    if (fallback) fallback.hidden = true;
    const origin = box.dataset.origin;
    window.addEventListener('message', (e) => {
      if (e.origin !== origin || e.source !== frame.contentWindow) return;
      const d = e.data;
      if (!d || d.type !== 'nt-calendar-height' || typeof d.height !== 'number') return;
      frame.style.height = `${Math.min(Math.max(Math.round(d.height), 420), 4000)}px`;
    });
  });
})();
