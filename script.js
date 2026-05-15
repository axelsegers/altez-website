/* Altez — interactions: i18n, mobile menu, scroll reveals, year, count-up */

(() => {
  /* ---------- i18n ---------- */
  const SUPPORTED = ['nl', 'en', 'fr', 'de'];
  const STORAGE_KEY = 'altez.lang';

  function resolveInitialLang() {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get('lang');
    if (fromUrl && SUPPORTED.includes(fromUrl)) return fromUrl;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.includes(stored)) return stored;
    } catch (_) {}
    return 'nl';
  }

  function applyLang(lang) {
    const dict = (window.TRANSLATIONS && window.TRANSLATIONS[lang]) || {};
    if (!dict || !Object.keys(dict).length) return;

    // Text nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.innerHTML = dict[key];
    });

    // Attribute translations: data-i18n-attr="attribute:key"  (also supports multiple, comma-separated)
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.getAttribute('data-i18n-attr');
      spec.split(',').forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s && s.trim());
        if (attr && key && dict[key] != null) el.setAttribute(attr, dict[key]);
      });
    });

    // <html lang> and <title> already covered by data-i18n on the title element
    document.documentElement.setAttribute('lang', lang);

    // Active state on language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.lang === lang);
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
  }

  function setLang(lang, { updateUrl = true } = {}) {
    if (!SUPPORTED.includes(lang)) return;
    applyLang(lang);
    if (updateUrl) {
      const url = new URL(location.href);
      if (lang === 'nl') url.searchParams.delete('lang');
      else url.searchParams.set('lang', lang);
      history.replaceState(null, '', url.toString());
    }
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    e.preventDefault();
    setLang(btn.dataset.lang);
  });

  // Apply on load
  setLang(resolveInitialLang(), { updateUrl: false });

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.nav a').forEach(a => {
      a.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const targets = document.querySelectorAll(
    '.service-card, .stat, .about__copy, .about__visual, ' +
    '.step, .project, .sector, .cta-band__inner, .contact__intro, .form, .section__head'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const idx = e.target.parentElement
        ? Array.from(e.target.parentElement.children).indexOf(e.target)
        : 0;
      setTimeout(() => e.target.classList.add('is-visible'), Math.min(idx * 70, 350));
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  targets.forEach(el => io.observe(el));

  /* ---------- Year ---------- */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Stat count-up ---------- */
  const counters = document.querySelectorAll('.stat__num[data-target]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.round(eased * target);
        el.innerHTML = suffix ? `${val}<sup>${suffix}</sup>` : `${val}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cio.observe(c));
})();
