(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer;
  function revealPage() {
    observer?.disconnect();
    const targets = [...document.querySelectorAll('[data-motion-reveal], .page-stack > .surface')];
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      targets.forEach(node => node.classList.add('is-visible'));
      return;
    }
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { rootMargin:'0px 0px -2% 0px', threshold:.08 });
    targets.forEach(node => {
      node.setAttribute('data-motion-reveal','');
      node.classList.remove('is-visible');
      observer.observe(node);
    });
  }
  document.documentElement.classList.add('motion-ready');
  window.addEventListener('znypr:page-ready', revealPage);
  reduceMotion.addEventListener('change', revealPage);
})();
