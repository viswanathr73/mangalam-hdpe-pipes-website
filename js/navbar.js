/**
 * navbar.js
 * Handles:
 *  1. Mobile hamburger toggle (.navbar-mobile-btn / .navbar-mobile-menu)
 *  2. Products dropdown keyboard / click support (.navbar-dropdown)
 *  3. Close dropdown/menu on outside click or Escape
 */

'use strict';

function initNavbar() {
  const { qs, qsa, on, addClass, removeClass, toggleClass } = window.MG;

  /* ── 1. Mobile menu toggle ────────────────────────── */
  const burger    = qs('.navbar-mobile-btn');
  const mobileMenu = qs('.navbar-mobile-menu');

  if (burger && mobileMenu) {
    on(burger, 'click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      burger.classList.toggle('is-active', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /* ── 2. Products dropdown (click on mobile/keyboard) */
  const dropdown = qs('.navbar-dropdown');
  const trigger  = qs('.navbar-dropdown__trigger');

  if (dropdown && trigger) {
    /* Toggle on click (works on both desktop and mobile) */
    on(trigger, 'click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });

    /* Keyboard: Enter / Space opens, Escape closes */
    on(trigger, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
      if (e.key === 'Escape') {
        removeClass(dropdown, 'is-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });

    /* Trap Escape inside open dropdown menu */
    on(qs('.navbar-dropdown__menu'), 'keydown', (e) => {
      if (e.key === 'Escape') {
        removeClass(dropdown, 'is-open');
        trigger.focus();
      }
    });
  }

  /* ── 3. Close everything on outside click ─────────── */
  on(document, 'click', (e) => {
    /* Close dropdown */
    if (dropdown && !dropdown.contains(e.target)) {
      removeClass(dropdown, 'is-open');
      trigger?.setAttribute('aria-expanded', 'false');
    }
    /* Close mobile menu */
    const nav = qs('.navbar');
    if (mobileMenu && nav && !nav.contains(e.target)) {
      removeClass(mobileMenu, 'is-open');
      burger?.classList.remove('is-active');
      burger?.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── 4. Close mobile menu on Escape ──────────────── */
  on(document, 'keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (mobileMenu) {
      removeClass(mobileMenu, 'is-open');
      burger?.classList.remove('is-active');
    }
  });

  /* ── 5. Smooth scroll for in-page anchor links ────── */
  const stickyHeader = qs('#stickyHeader');
  qsa('a[href^="#"]').forEach(link => {
    on(link, 'click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = qs(href);
      if (!target) return;
      e.preventDefault();
      const offset = (stickyHeader?.offsetHeight ?? 0) + 16;
      window.MG.scrollToEl(target, offset);
      /* Close mobile menu after navigation */
      if (mobileMenu) {
        removeClass(mobileMenu, 'is-open');
        burger?.classList.remove('is-active');
      }
    });
  });
}
