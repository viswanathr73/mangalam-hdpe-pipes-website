/**
 * applications.js
 * Carousel for "Versatile Applications" section.
 * Supports: prev/next buttons · dot navigation · touch/drag.
 */

'use strict';

function initApplications() {
  const { qs, qsa, on, clamp, debounce } = window.MG;

  const carousel = qs('#appCarousel');
  const prevBtn = qs('#appPrev');
  const nextBtn = qs('#appNext');
  const dotsWrap = qs('#appDots');
  if (!carousel) return;

  const cards = qsa('.app-card', carousel);
  let index = 0;

  /* ── Visible cards per viewport ──────────────────── */
  function visibleCount() {
    if (window.innerWidth <= 800) return 1;
    if (window.innerWidth <= 1080) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, cards.length - visibleCount());
  }

  function cardWidth() {
    if (!cards[0]) return 0;
    const gap = parseInt(getComputedStyle(carousel).gap) || 20;
    return cards[0].offsetWidth + gap;
  }

  /* ── Scroll to index ──────────────────────────────── */
  function goTo(i) {
    index = clamp(i, 0, maxIndex());
    carousel.scrollTo({ left: index * cardWidth(), behavior: 'smooth' });
    syncButtons();
    syncDots();
  }

  function syncButtons() {
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index >= maxIndex();
  }

  /* ── Dots ─────────────────────────────────────────── */
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    const total = maxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === index ? ' is-active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      on(dot, 'click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function syncDots() {
    if (!dotsWrap) return;
    qsa('.carousel-dot', dotsWrap).forEach((d, i) =>
      d.classList.toggle('is-active', i === index)
    );
  }

  /* ── Button listeners ─────────────────────────────── */
  on(prevBtn, 'click', () => goTo(index - 1));
  on(nextBtn, 'click', () => goTo(index + 1));

  /* ── Touch / drag ─────────────────────────────────── */
  let dragStart = null;
  on(carousel, 'mousedown', e => { dragStart = e.clientX; });
  on(carousel, 'touchstart', e => { dragStart = e.touches[0].clientX; }, { passive: true });
  on(carousel, 'mouseup', e => drag(e.clientX));
  on(carousel, 'touchend', e => drag(e.changedTouches[0].clientX));

  function drag(endX) {
    if (dragStart === null) return;
    const diff = dragStart - endX;
    if (Math.abs(diff) > 50) goTo(index + (diff > 0 ? 1 : -1));
    dragStart = null;
  }

  /* ── Rebuild on resize ────────────────────────────── */
  window.addEventListener('resize', debounce(() => {
    buildDots();
    goTo(clamp(index, 0, maxIndex()));
  }, 200));

  /* ── Init ─────────────────────────────────────────── */
  buildDots();
  syncButtons();
}
