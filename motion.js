// Intersection reveals and scroll progress. No animation library or scroll interception.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer;
  let panels = [];
  let hero;
  let ticking = false;

  function updateScroll() {
    ticking = false;
    document.body.classList.toggle('is-scrolled', window.scrollY > 34);
    if (reduceMotion.matches) return;

    const viewport = window.innerHeight;
    if (hero) {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < viewport) {
        const travel = Math.max(-1, Math.min(1, -rect.top / Math.max(rect.height, 1)));
        hero.style.setProperty('--hero-shift', `${Math.round(travel * 22)}px`);
      }
    }
    panels.forEach(panel => {
      const rect = panel.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;
      const progress = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport + rect.height)));
      panel.style.setProperty('--panel-progress', `${Math.round(progress * 100)}%`);
      panel.querySelector('.story-media')?.style.setProperty('--media-shift', `${(progress * 8 - 7).toFixed(2)}%`);
    });
  }

  function requestScrollUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScroll);
  }

  function initMotion() {
    observer?.disconnect();
    panels = [...document.querySelectorAll('[data-story-panel]')];
    hero = document.querySelector('.avatar-stage');

    const targets = [
      ...document.querySelectorAll('.story-intro, .story-outro, .story-content'),
      ...document.querySelectorAll('.page-stack > .surface:not(.home-hero):not(.profile-card)')
    ];
    targets.forEach(target => {
      if (!target.classList.contains('story-content')) target.setAttribute('data-motion-reveal', '');
      target.classList.remove('is-visible');
    });

    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      targets.forEach(target => target.classList.add('is-visible'));
      panels.forEach(panel => panel.classList.add('is-in-view'));
      updateScroll();
      return;
    }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        if (entry.target.classList.contains('story-content')) entry.target.closest('.story-panel')?.classList.add('is-in-view');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    targets.forEach(target => observer.observe(target));
    requestScrollUpdate();
  }

  document.documentElement.classList.add('motion-ready');
  window.addEventListener('znypr:page-ready', initMotion);
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });
  reduceMotion.addEventListener('change', initMotion);
  document.addEventListener('DOMContentLoaded', requestScrollUpdate);
})();
