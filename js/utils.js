/**
 * utils.js — Shared helper functions
 * Loaded first. All other JS modules can use these.
 */

'use strict';

/* ── DOM helpers ─────────────────────────────────────── */

/** Select one element */
const qs = (sel, ctx = document) => ctx.querySelector(sel);

/** Select all elements → Array */
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/** Add event listener with optional options */
const on = (el, event, handler, opts = {}) => {
  if (el) el.addEventListener(event, handler, opts);
};

/* ── Class helpers ───────────────────────────────────── */
const addClass = (el, ...cls) => el?.classList.add(...cls);
const removeClass = (el, ...cls) => el?.classList.remove(...cls);
const toggleClass = (el, cls, force) => el?.classList.toggle(cls, force);
const hasClass = (el, cls) => el?.classList.contains(cls) ?? false;

/* ── RAF throttle ────────────────────────────────────── */
/**
 * Returns a throttled version of fn that runs at most once per animation frame.
 * Ideal for scroll / resize handlers.
 */
function rafThrottle(fn) {
  let ticking = false;
  return function (...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        fn.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}

/* ── Debounce ────────────────────────────────────────── */
function debounce(fn, delay = 150) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ── Clamp ───────────────────────────────────────────── */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/* ── Smooth scroll to element ────────────────────────── */
function scrollToEl(el, offset = 0) {
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* ── Lock / unlock body scroll ───────────────────────── */
function lockScroll() { document.body.style.overflow = 'hidden'; }
function unlockScroll() { document.body.style.overflow = ''; }

/* ── Export to window for cross-file access ─────────── */
window.MG = {
  qs, qsa, on,
  addClass, removeClass, toggleClass, hasClass,
  rafThrottle, debounce, clamp,
  scrollToEl, lockScroll, unlockScroll,
};
