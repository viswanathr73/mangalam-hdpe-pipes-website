/**
 * animations.js
 * Scroll-triggered fade-up animations using IntersectionObserver.
 * Applied to cards and key elements across all sections.
 */

'use strict';

function initAnimations() {
  const { qsa } = window.MG;

  /* Elements to animate */
  const targets = qsa([
    '.spec-card',
    '.app-card',
    '.process-step',
    '.testimonial-card',
    '.portfolio-card',
    '.resource-card',
    '.faq-item',
    '.section-header',
    '.specs-cta',
  ].join(', '));

  if (!targets.length) return;

  /* Set initial hidden state */
  targets.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(22px)';
    /* Stagger within groups of 4 */
    el.style.transition = `opacity 0.45s ease ${(i % 4) * 0.07}s,
                           transform 0.45s ease ${(i % 4) * 0.07}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:  0.1,
    rootMargin: '0px 0px -36px 0px',
  });

  targets.forEach(el => observer.observe(el));
}
