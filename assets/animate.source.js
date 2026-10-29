/* Znypr motion layer v2. Glue only: the animation engine is GSAP (core, ScrollTrigger, SplitText)
   plus Lenis for smooth scrolling. Everything animated is transform, opacity or clip-path,
   so it runs on the GPU. Respects prefers-reduced-motion. */
(function () {
  if (!window.gsap || !window.Lenis) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  var manual = !!window.__manual; // test harness: frames are stepped by hand
  var mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {
    var doc = document.documentElement, booting = true;
    doc.classList.add('motion');
    gsap.delayedCall(0.95, function () { booting = false; });

    var css = document.createElement('style');
    css.textContent =
      '.wipe{position:fixed;inset:0;z-index:300;pointer-events:none;display:flex}' +
      '.wipe i{flex:1;background:linear-gradient(180deg,#0e2230,#08141c);box-shadow:inset -1px 0 rgba(160,205,235,.14);transform-origin:50% 100%}' +
      '.wipe b{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:italic 900 clamp(52px,11vw,150px)/1 Barlow,Arial,sans-serif;letter-spacing:-.06em;color:#eff7fb;opacity:0;text-shadow:0 0 40px rgba(130,195,235,.45)}' +
      '.spot{position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .25s;z-index:3;' +
      'background:radial-gradient(circle 260px at var(--mx,50%) var(--my,50%),rgba(190,230,255,.20),rgba(190,230,255,0) 65%);mix-blend-mode:screen}' +
      '.marquee{overflow:hidden;white-space:nowrap;padding:clamp(34px,5vw,70px) 0 0;pointer-events:none;user-select:none}' +
      '.marquee span{display:inline-block;font:italic 900 clamp(72px,12vw,190px)/.95 Barlow,Arial,sans-serif;letter-spacing:-.06em;text-transform:uppercase;color:transparent;-webkit-text-stroke:1.5px rgba(205,232,251,.26);padding-right:.35em}' +
      '.marquee span.fill{color:rgba(205,232,251,.10);-webkit-text-stroke:0}' +
      '.democursor{position:fixed;left:0;top:0;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;border:2px solid #eaf7ff;background:rgba(190,230,255,.22);box-shadow:0 0 22px rgba(150,210,245,.7);z-index:400;pointer-events:none}';
    document.head.appendChild(css);

    // Smooth scroll, driven by GSAP's ticker so every animation shares one clock.
    var lenis = new Lenis({ lerp: 0.085 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);

    // ---- Page transition: five glass strips + wordmark wipe between pages -----------------
    var wipe = document.createElement('div');
    wipe.className = 'wipe';
    wipe.innerHTML = '<i></i><i></i><i></i><i></i><i></i><b>ZNYPR</b>';
    document.body.appendChild(wipe);
    var strips = wipe.querySelectorAll('i'), mark = wipe.querySelector('b');
    gsap.set(strips, { scaleY: 1, transformOrigin: '50% 0%' });      // start covered...
    gsap.set(mark, { opacity: 1, scale: 1 });
    gsap.timeline({ delay: 0.15 })                                    // ...then open
      .to(mark, { opacity: 0, scale: 1.12, duration: 0.55, ease: 'power2.in' }, 0.15)
      .to(strips, { scaleY: 0, duration: 0.8, ease: 'expo.inOut', stagger: { each: 0.07, from: 'start' } }, 0.3);

    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|https?:)/.test(href) || href.indexOf('#') > -1) return;
      e.preventDefault();
      gsap.set(strips, { transformOrigin: '50% 100%' });
      gsap.timeline({ onComplete: function () { location.href = href; } })
        .to(strips, { scaleY: 1, duration: 0.65, ease: 'expo.inOut', stagger: { each: 0.06, from: 'end' } }, 0)
        .to(mark, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.35);
    });

    // ---- Headlines: letters flip up out of a line mask ----------------------------------------
    document.querySelectorAll('h1.display, h2.display, h3.brush, .copy-card h2, .setup-copy h3').forEach(function (el) {
      SplitText.create(el, {
        type: 'chars,lines', mask: 'lines', autoSplit: true,
        onSplit: function (self) {
          gsap.set(self.chars, { transformOrigin: '0% 100%' });
          return gsap.from(self.chars, {
            yPercent: 125, rotation: 9, duration: 1, ease: 'expo.out', stagger: 0.022,
            delay: booting ? 1.05 : 0,
            scrollTrigger: { trigger: el, start: 'top 92%', once: true }
          });
        }
      });
    });

    // ---- Panels fade up in staggered rows; media wipes open ----------------------------------------
    var cards = '.feature, .more-row .mcard, .scard, .setup, .feature-card, .zs-band, .stat, .pcard, .icard, .fb, .dl, .mailcard, .panel, .section-heading p, .page-head p';
    gsap.set(cards, { opacity: 0, y: 60 });
    ScrollTrigger.batch(cards, {
      start: 'top 93%', once: true,
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.11, overwrite: 'auto', delay: booting ? 1.15 : 0 });
      }
    });
    gsap.utils.toArray('.feature-shot, .setup-photo, .mthumb, .pphoto, .photo-card, .banner .frames').forEach(function (el) {
      gsap.fromTo(el, { clipPath: 'inset(0 100% 0 0 round 18px)' }, {
        clipPath: 'inset(0 0% 0 0 round 18px)', duration: 1.3, ease: 'expo.inOut', delay: booting ? 1.2 : 0,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });

    // ---- Parallax: images drift against their frames ----------------------------------------------
    document.querySelectorAll('.feature-shot img, .setup-photo img, .scard > img, .feature-card > img, .mthumb img, .photo-card img').forEach(function (img) {
      var frame = img.closest('.feature-shot, .setup-photo, .scard, .feature-card, .mthumb, .photo-card') || img.parentElement;
      gsap.fromTo(img, { yPercent: -7, scale: 1.16 }, {
        yPercent: 7, scale: 1.16, ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // ---- Scroll-driven marquee band between Videos and Setup ---------------------------------------
    var setup = document.getElementById('setup');
    if (setup) {
      var band = document.createElement('div');
      band.className = 'marquee';
      var words = 'Roblox Rivals · Setup · Fitness · Merch · ';
      band.innerHTML = '<div class="track"><span>' + words + '</span><span class="fill">' + words + '</span><span>' + words + '</span></div>';
      setup.parentNode.insertBefore(band, setup);
      gsap.fromTo(band.firstChild, { xPercent: 0 }, {
        xPercent: -33, ease: 'none',
        scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
    }

    // ---- Count-up numbers -------------------------------------------------------------------------
    document.querySelectorAll('.stat .num, .rows .num').forEach(function (el) {
      var m = el.textContent.trim().match(/^([\d.]+)(.*)$/);
      if (!m) return;
      var target = parseFloat(m[1]), suffix = m[2], dec = (m[1].split('.')[1] || '').length, o = { v: 0 };
      el.textContent = (0).toFixed(dec) + suffix;
      gsap.to(o, {
        v: target, duration: 1.8, ease: 'power3.out', delay: booting ? 1.3 : 0,
        onUpdate: function () { el.textContent = o.v.toFixed(dec) + suffix; },
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      });
    });

    // ---- Cursor effects: glass spotlight, 3D tilt, magnetic buttons -------------------------------
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches || manual;
    if (fine) {
      gsap.utils.toArray('.glass, .scard, .zs-band, .fb, .feature-card, .banner').forEach(function (el) {
        if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
        var spot = document.createElement('span');
        spot.className = 'spot';
        el.appendChild(spot);
        el.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
          spot.style.setProperty('--mx', x + 'px'); spot.style.setProperty('--my', y + 'px'); spot.style.opacity = 1;
          if (el.matches('.scard, .pcard, .mcard, .vcard, .feature-card, .stat, .icard')) {
            gsap.to(el, { rotationY: (x / r.width - 0.5) * 12, rotationX: -(y / r.height - 0.5) * 12, transformPerspective: 900, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
          }
        });
        el.addEventListener('pointerleave', function () {
          spot.style.opacity = 0;
          gsap.to(el, { rotationY: 0, rotationX: 0, duration: 0.8, ease: 'elastic.out(1,.6)', overwrite: 'auto' });
        });
      });
      gsap.utils.toArray('.btn, .fb-ico').forEach(function (b) {
        b.addEventListener('pointermove', function (e) {
          var r = b.getBoundingClientRect();
          gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.4, ease: 'power3.out' });
        });
        b.addEventListener('pointerleave', function () { gsap.to(b, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,.5)' }); });
      });
    }

    // Footer wordmark rises as the footer arrives.
    gsap.fromTo('.fb-mark', { yPercent: 22, opacity: 0.15 }, {
      yPercent: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: '.fb', start: 'top 90%', end: 'bottom bottom', scrub: true }
    });

    return function () { lenis.destroy(); };
  });

  if (manual) { // recording harness: freeze the real clock, step by hand, show a visible cursor
    gsap.ticker.sleep();
    var base = gsap.ticker.time, t = 0;
    window.__step = function (dt) { t += dt; gsap.updateRoot(base + t); if (window.__lenis) window.__lenis.raf(t * 1000 + 1e6); };
    var cur = document.createElement('div'); cur.className = 'democursor'; cur.style.opacity = 0; document.body.appendChild(cur);
    document.addEventListener('pointermove', function (e) { cur.style.opacity = 1; cur.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; });
  }
})();
