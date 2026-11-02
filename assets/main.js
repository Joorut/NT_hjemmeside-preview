// Usisaat – menu, dropdown, filtrering af materiel og tilbudsformular
(() => {
  const burger = document.querySelector('.burger');
  const nav = document.getElementById('nav');
  const header = document.querySelector('header.site');

  const setNavTop = () => {
    const r = header.getBoundingClientRect();
    document.documentElement.style.setProperty('--nav-top', `${Math.max(0, r.bottom)}px`);
  };
  const closeNav = () => {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  burger?.addEventListener('click', () => {
    setNavTop();
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Dropdown "Tjenester"
  const ddBtn = document.querySelector('.dd > button');
  const ddMenu = document.getElementById('dd-tjenester');
  const closeDd = () => { ddMenu?.classList.remove('open'); ddBtn?.setAttribute('aria-expanded', 'false'); };
  ddBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = ddMenu.classList.toggle('open');
    ddBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.dd')) closeDd(); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (ddMenu?.classList.contains('open')) { closeDd(); ddBtn.focus(); }
    else if (nav.classList.contains('open')) { closeNav(); burger.focus(); }
  });
  nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { closeNav(); closeDd(); }));
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeNav(); });

  // Filtrering af materiel
  const filters = document.querySelectorAll('.filters button');
  filters.forEach((btn) => btn.addEventListener('click', () => {
    filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    const cat = btn.dataset.cat;
    document.querySelectorAll('.vehicle').forEach((v) => { v.hidden = cat !== 'alle' && v.dataset.cat !== cat; });
    const shown = document.querySelectorAll('.vehicle:not([hidden])').length;
    const live = document.getElementById('fleet-status');
    const lang = document.documentElement.lang;
    if (live) live.textContent = lang === 'en' ? `Showing ${shown} vehicles` : lang === 'kl' ? `Biilit ${shown}` : `Viser ${shown} køretøjer`;
  }));

  // Tilbudsformular (prototype: valideres og bekræftes lokalt, sendes ikke)
  const form = document.getElementById('tilbud-form');
  if (form) {
    const params = new URLSearchParams(location.search);
    const pre = params.get('ydelse');
    if (pre) form.querySelector(`input[name="ydelse"][value="${CSS.escape(pre)}"]`)?.setAttribute('checked', '');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let first = null;
      form.querySelectorAll('[required]').forEach((el) => {
        const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
        el.setAttribute('aria-invalid', String(bad));
        if (bad && !first) first = el;
      });
      if (first) { first.focus(); return; }
      form.hidden = true;
      const ok = document.getElementById('tilbud-ok');
      ok.classList.add('show');
      ok.focus();
    });
    form.querySelectorAll('[required]').forEach((el) => el.addEventListener('input', () => el.removeAttribute('aria-invalid')));
  }
})();
