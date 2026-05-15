/* Altez — minimal interactions: mobile menu, scroll reveals, year, count-up */

(() => {
  const burger = document.querySelector('.burger');

  // Mobile menu toggle
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

  // Scroll-reveal
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

  // Year
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Stat count-up
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
