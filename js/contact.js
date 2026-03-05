/**
 * contact.js
 * Form validation & UX enhancements for the Contact Form Section.
 * No external dependencies.
 */

(function () {
  'use strict';

  /* -------------------------------------------------------
     1. Fade-up reveal on scroll
  ------------------------------------------------------- */
  function initReveal() {
    if (!('IntersectionObserver' in window)) return;

    var targets = document.querySelectorAll('.contact-content, .contact-form-card');
    targets.forEach(function (el, idx) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition =
        'opacity 0.5s ease ' + idx * 0.12 + 's, transform 0.5s ease ' + idx * 0.12 + 's';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* -------------------------------------------------------
     2. Form validation helpers
  ------------------------------------------------------- */
  function isEmpty(val) {
    return !val || val.trim() === '';
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function isValidPhone(val) {
    return /^[0-9\s\-]{7,15}$/.test(val.trim());
  }

  function setFieldError(input, message) {
    clearFieldError(input);
    input.classList.add('cf-input--error');
    var err = document.createElement('span');
    err.className = 'cf-field-error';
    err.textContent = message;
    var wrapper = input.closest('.form-field');
    if (wrapper) wrapper.appendChild(err);
  }

  function clearFieldError(input) {
    input.classList.remove('cf-input--error');
    var wrapper = input.closest('.form-field');
    if (wrapper) {
      var existing = wrapper.querySelector('.cf-field-error');
      if (existing) existing.remove();
    }
  }

  /* -------------------------------------------------------
     3. Form submission handler
  ------------------------------------------------------- */
  function initForm() {
    var btn = document.querySelector('.form-submit-btn');
    if (!btn) return;

    // Inject error & success styles once
    injectFormStyles();

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var valid = true;

      var nameInput  = document.getElementById('cf-fullname');
      var compInput  = document.getElementById('cf-company');
      var emailInput = document.getElementById('cf-email');
      var phoneInput = document.getElementById('cf-phone');

      // Clear previous errors
      [nameInput, compInput, emailInput, phoneInput].forEach(clearFieldError);

      if (nameInput && isEmpty(nameInput.value)) {
        setFieldError(nameInput, 'Full name is required.');
        valid = false;
      }

      if (compInput && isEmpty(compInput.value)) {
        setFieldError(compInput, 'Company name is required.');
        valid = false;
      }

      if (emailInput) {
        if (isEmpty(emailInput.value)) {
          setFieldError(emailInput, 'Email address is required.');
          valid = false;
        } else if (!isValidEmail(emailInput.value)) {
          setFieldError(emailInput, 'Please enter a valid email address.');
          valid = false;
        }
      }

      if (phoneInput) {
        if (isEmpty(phoneInput.value)) {
          setFieldError(phoneInput, 'Phone number is required.');
          valid = false;
        } else if (!isValidPhone(phoneInput.value)) {
          setFieldError(phoneInput, 'Please enter a valid phone number.');
          valid = false;
        }
      }

      if (!valid) return;

      // Success state
      btn.disabled = true;
      btn.textContent = 'Submitting…';

      // Simulate async submit (replace with real fetch/XHR)
      setTimeout(function () {
        btn.textContent = '✓ Request Sent!';
        btn.style.backgroundColor = '#1a7a3c';
        setTimeout(function () {
          btn.disabled = false;
          btn.textContent = 'Request Custom Quote';
          btn.style.backgroundColor = '';
        }, 3500);
      }, 1200);
    });

    // Live clear errors on input
    var inputs = document.querySelectorAll('.contact-form-card input');
    inputs.forEach(function (input) {
      input.addEventListener('input', function () { clearFieldError(input); });
    });
  }

  /* -------------------------------------------------------
     4. Inject dynamic form styles (errors)
  ------------------------------------------------------- */
  function injectFormStyles() {
    if (document.getElementById('cf-dynamic-styles')) return;
    var style = document.createElement('style');
    style.id = 'cf-dynamic-styles';
    style.textContent = [
      '.cf-input--error { border-color: #d93025 !important; box-shadow: 0 0 0 3px rgba(217,48,37,0.12) !important; }',
      '.form-field--phone.cf-phone--error { border-color: #d93025 !important; box-shadow: 0 0 0 3px rgba(217,48,37,0.12) !important; }',
      '.cf-field-error { display: block; font-size: 11px; color: #d93025; margin-top: 4px; padding-left: 2px; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  /* -------------------------------------------------------
     Init
  ------------------------------------------------------- */
  function init() {
    initReveal();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();