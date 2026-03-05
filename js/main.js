/**
 * main.js — Entry point.
 * Calls init functions from every module after DOM is ready.
 * Each module guards itself with null-checks so missing HTML
 * sections never throw.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* Core UI */
  initStickyHeader?.();
  initNavbar?.();

  /* Sections */
  initHero?.();
  initSpecs?.();
  initApplications?.();
  initProcess?.();
  initManufacturing?.();
  initPortfolio?.();
  initResources?.();
  initFAQ?.();

  /* Overlays */
  initModals?.();

  /* Animations */
  initAnimations?.();

  console.log('%cMangalam HDPE — ready', 'color:#2B3990;font-weight:700');
});
