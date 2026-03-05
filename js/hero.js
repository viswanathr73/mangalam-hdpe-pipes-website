/**
 * hero.js
 * Two behaviours:
 *  1. Thumbnail click → swap main image with fade transition
 *  2. Mouse-tracking zoom — transform-origin follows cursor
 *     so the zoom always centres on where the user points
 */

'use strict';

function initHero() {
  const { qs, qsa, on } = window.MG;

  const wrap = qs('#heroImageWrap');
  const mainImg = qs('#heroMainImage');
  const thumbs = qsa('.hero-thumb');

  if (!wrap || !mainImg) return;

  /* ── 1. Thumbnail click: swap image ────────────────── */
  thumbs.forEach((thumb, i) => {
    on(thumb, 'click', () => {
      const newSrc = thumb.dataset.src;
      if (!newSrc || mainImg.src.endsWith(newSrc)) return;

      /* Fade out → swap → fade in */
      mainImg.style.opacity = '0';
      mainImg.style.transition = 'opacity 0.18s ease';

      setTimeout(() => {
        mainImg.src = newSrc;
        mainImg.style.opacity = '1';
      }, 180);

      /* Update active state + aria */
      thumbs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });
      thumb.classList.add('is-active');
      thumb.setAttribute('aria-selected', 'true');
      thumb.setAttribute('tabindex', '0');
    });

    /* Keyboard: Enter or Space fires click */
    on(thumb, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        thumb.click();
      }
    });
  });

  /* ── 2. Mouse-tracking zoom ─────────────────────────── */
  on(wrap, 'mousemove', (e) => {
    const r = wrap.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    mainImg.style.transformOrigin = `${x.toFixed(1)}% ${y.toFixed(1)}%`;
  });

  on(wrap, 'mouseleave', () => {
    /* Reset origin so the scale-down animation centres correctly */
    mainImg.style.transformOrigin = 'center center';
  });
}
