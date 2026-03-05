/**
 * resources.js
 * Enhancements for the Resources & Downloads section.
 * No dependencies required.
 */

(function () {
  'use strict';

  /* -------------------------------------------------------
     1. Fade-up reveal on scroll using IntersectionObserver
  ------------------------------------------------------- */
  function initReveal() {
    if (!('IntersectionObserver' in window)) return;

    const targets = document.querySelectorAll(
      '.resources-header, .resource-item'
    );

    targets.forEach(function (el, idx) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition =
        'opacity 0.45s ease ' + idx * 0.08 + 's, transform 0.45s ease ' + idx * 0.08 + 's';
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* -------------------------------------------------------
     2. Download click feedback — brief visual pulse on the
        row to confirm user action
  ------------------------------------------------------- */
  function bindDownloadFeedback() {
    const downloadBtns = document.querySelectorAll('.resource-download-btn');

    downloadBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        // If href is '#', prevent default and show feedback only
        if (btn.getAttribute('href') === '#') {
          e.preventDefault();
        }

        const item = btn.closest('.resource-item');
        if (!item) return;

        item.classList.add('resource-item--downloading');
        setTimeout(function () {
          item.classList.remove('resource-item--downloading');
        }, 600);
      });
    });
  }

  /* -------------------------------------------------------
     Init
  ------------------------------------------------------- */
  function init() {
    initReveal();
    bindDownloadFeedback();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();