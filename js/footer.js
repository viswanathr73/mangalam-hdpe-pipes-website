/**
 * footer.js
 * Lightweight enhancements for the Footer Section.
 * No dependencies required.
 */

(function () {
  'use strict';

  /* -------------------------------------------------------
     1. Highlight active footer link based on current URL
  ------------------------------------------------------- */
  function setActiveFooterLink() {
    const currentPath = window.location.pathname;
    const footerLinks = document.querySelectorAll('.footer-links a, .footer-bottom-links a');

    footerLinks.forEach(function (link) {
      try {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        if (linkPath === currentPath && linkPath !== '/') {
          link.classList.add('footer-link--active');
          link.setAttribute('aria-current', 'page');
        }
      } catch (e) {
        // ignore invalid hrefs
      }
    });
  }

  /* -------------------------------------------------------
     2. Smooth scroll to top if a hash-free logo/brand link
        inside the footer is clicked
  ------------------------------------------------------- */
  function bindLogoScrollTop() {
    const bannerLogo = document.querySelector('.footer-banner-logo a');
    if (bannerLogo) {
      bannerLogo.addEventListener('click', function (e) {
        if (window.location.pathname === '/') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }

  /* -------------------------------------------------------
     3. Animate footer columns into view using
        IntersectionObserver (fade-up reveal)
  ------------------------------------------------------- */
  function initRevealAnimation() {
    // Guard: skip if IntersectionObserver not supported
    if (!('IntersectionObserver' in window)) return;

    const targets = document.querySelectorAll(
      '.footer-banner, .footer-col, .footer-bottom'
    );

    // Add base style once
    targets.forEach(function (el, idx) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease ' + idx * 0.07 + 's, transform 0.5s ease ' + idx * 0.07 + 's';
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
      { threshold: 0.15 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* -------------------------------------------------------
     4. Auto-update copyright year
  ------------------------------------------------------- */
  function updateCopyrightYear() {
    const copyright = document.querySelector('.footer-copyright');
    if (!copyright) return;

    const currentYear = new Date().getFullYear();
    copyright.innerHTML = copyright.innerHTML.replace(
      /Copyright\s*&copy;\s*\d{4}/,
      'Copyright &copy; ' + currentYear
    );
  }

  /* -------------------------------------------------------
     Init
  ------------------------------------------------------- */
  function init() {
    setActiveFooterLink();
    bindLogoScrollTop();
    initRevealAnimation();
    updateCopyrightYear();
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();