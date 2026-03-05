/**
 * sticky-header.js
 * Shows sticky header when user scrolls past the main navbar.
 * Hides it when scrolling DOWN, shows when scrolling UP.
 */

'use strict';

function initStickyHeader() {
  const { qs, addClass, removeClass, rafThrottle } = window.MG;

  const sticky = qs('#stickyHeader');
  const mainNav = qs('#mainNav');
  if (!sticky || !mainNav) return;

  let lastY = window.scrollY;

  const update = rafThrottle(() => {
    const navRect = mainNav.getBoundingClientRect();
    const scrollY = window.scrollY;

    if (navRect.bottom > 0) {
      /* Navbar still visible → always hide sticky */
      removeClass(sticky, 'is-visible');
      sticky.setAttribute('aria-hidden', 'true');
    } else {
      if (scrollY < lastY) {
        /* Scrolling UP → show */
        addClass(sticky, 'is-visible');
        sticky.setAttribute('aria-hidden', 'false');
      } else {
        /* Scrolling DOWN → hide */
        removeClass(sticky, 'is-visible');
        sticky.setAttribute('aria-hidden', 'true');
      }
    }

    lastY = scrollY;
  });

  window.addEventListener('scroll', update, { passive: true });
}
