/**
 * faq.js
 * Accordion behaviour — one item open at a time.
 */

'use strict';

function initFAQ() {
  const { qsa, on } = window.MG;

  const items = qsa('.faq-item');

  items.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    on(btn, 'click', () => {
      const isOpen = item.classList.contains('is-open');

      /* Close all */
      items.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.faq-question')
             ?.setAttribute('aria-expanded', 'false');
      });

      /* Toggle clicked */
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
