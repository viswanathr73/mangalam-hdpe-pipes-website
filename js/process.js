/**
 * process.js — Peek carousel
 *
 * Layout:
 *  Desktop >1080:  4 visible (2 full + ~90% peek on both sides)
 *  ≤1080px:        4 visible (2 full + 10% peek on both sides)
 *  ≤800px:         2 full visible
 *  ≤480px:         1 full + right peek
 *
 * The CSS sets card widths via flex/vw. JS reads offsetWidth
 * at runtime so it always gets the correct translated offset
 * regardless of breakpoint.
 *
 * translateX strategy:
 *  offset = index × (cardWidth + gap)
 * 
 * The .process-carousel has padding-left = container-px.
 * At index=0 the first card aligns with the header text.
 * Partial right cards are visible because the section has
 * overflow:hidden but the track extends past the right edge.
 */

'use strict';

function initProcess() {
  const { qs, on, debounce, clamp } = window.MG;

  const track   = qs('.process-track');
  const prevBtn = qs('.process-nav__btn--prev');
  const nextBtn = qs('.process-nav__btn--next');
  if (!track || !prevBtn || !nextBtn) return;

  let index = 0;

  /* ── Measurements (read live from DOM) ───────────── */
  function cardWidth() {
    const card = track.querySelector('.process-card');
    if (!card) return 420;
    const gap = parseInt(getComputedStyle(track).gap) || 16;
    return card.offsetWidth + gap;
  }

  function visibleCount() {
    /* How many full cards fit in the carousel viewport */
    const viewport = qs('.process-carousel')?.offsetWidth || window.innerWidth;
    const card     = track.querySelector('.process-card')?.offsetWidth || 420;
    const gap      = parseInt(getComputedStyle(track).gap) || 16;
    return Math.max(1, Math.floor((viewport + gap) / (card + gap)));
  }

  function totalCards() {
    return track.querySelectorAll('.process-card').length;
  }

  function maxIndex() {
    /* Stop when last card's right edge aligns with viewport right */
    const total   = totalCards();
    const visible = visibleCount();
    return Math.max(0, total - visible);
  }

  /* ── Navigate ─────────────────────────────────────── */
  function goTo(i) {
    index = clamp(i, 0, maxIndex());
    track.style.transform = `translateX(-${index * cardWidth()}px)`;
    syncButtons();
  }

  function syncButtons() {
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= maxIndex();
  }

  /* ── Prev / Next ──────────────────────────────────── */
  on(prevBtn, 'click', () => goTo(index - 1));
  on(nextBtn, 'click', () => goTo(index + 1));

  /* ── Touch + drag ─────────────────────────────────── */
  let startX   = null;
  let dragging = false;

  function onDragStart(x) { startX = x; dragging = false; }
  function onDragMove(x)  { if (Math.abs(x - startX) > 5) dragging = true; }
  function onDragEnd(x) {
    if (startX === null) return;
    const diff = startX - x;
    if (Math.abs(diff) > 60) goTo(index + (diff > 0 ? 1 : -1));
    startX = null;
  }

  on(track, 'mousedown',  e => onDragStart(e.clientX));
  on(track, 'mousemove',  e => { if (startX !== null) onDragMove(e.clientX); });
  on(track, 'mouseup',    e => onDragEnd(e.clientX));
  on(track, 'mouseleave', e => { if (startX !== null) onDragEnd(e.clientX); });
  on(track, 'click',      e => { if (dragging) e.preventDefault(); });

  on(track, 'touchstart', e => onDragStart(e.touches[0].clientX),        { passive: true });
  on(track, 'touchmove',  e => onDragMove(e.touches[0].clientX),         { passive: true });
  on(track, 'touchend',   e => onDragEnd(e.changedTouches[0].clientX));

  /* ── Reset on resize ──────────────────────────────── */
  window.addEventListener('resize', debounce(() => {
    goTo(clamp(index, 0, maxIndex()));
  }, 150));

  /* ── Init ─────────────────────────────────────────── */
  goTo(0);
}
