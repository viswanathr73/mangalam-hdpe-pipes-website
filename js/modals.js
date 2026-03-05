/**
 * modals.js
 * Handles both popups:
 *   #quoteModal      — "Request a call back"
 *   #datasheetModal  — "Email catalogue"
 *
 * Public API (available immediately — NOT inside DOMContentLoaded):
 *   window.openModal(id)
 *   window.closeModal(id)
 *   window.openQuoteModal()
 *   window.openDatasheetModal()
 *
 * NOTE: The public functions are defined at parse time so that
 * inline onclick="window.openQuoteModal?.()" attributes on
 * dynamically-rendered buttons always resolve correctly,
 * regardless of call order in main.js.
 */

'use strict';

/* ── Core open / close helpers (defined at parse time) ── */

function _openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    modal.querySelector('input:not([type=hidden]), select, textarea')?.focus();
  }, 320);
}

function _closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  setTimeout(() => _resetModal(modal), 300);
}

function _resetModal(modal) {
  modal.querySelector('form')?.reset();
  const form    = modal.querySelector('.modal-form');
  const success = modal.querySelector('.modal-success');
  const btn     = modal.querySelector('.modal-form__submit');
  if (form)    form.style.display = '';
  if (success) success.classList.remove('is-visible');
  if (btn) {
    btn.disabled    = false;
    btn.textContent = btn.dataset.origText || btn.textContent;
  }
}

/* ── Expose globally immediately (before DOMContentLoaded) ── */
window.openModal          = _openModal;
window.closeModal         = _closeModal;
window.openQuoteModal     = () => _openModal('quoteModal');
window.openDatasheetModal = () => _openModal('datasheetModal');

/* ── Wire up interaction listeners after DOM is ready ── */
function initModals() {
  /* Backdrop click → close */
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) _closeModal(overlay.id);
    });
  });

  /* Escape key → close any open modal */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal-overlay.is-open')
      .forEach(m => _closeModal(m.id));
  });

  /* Close buttons (×) */
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      _closeModal(btn.closest('.modal-overlay')?.id);
    });
  });

  /* ── Datasheet: disable submit until email is filled ── */
  const dsEmail  = document.getElementById('ds-email');
  const dsSubmit = document.querySelector('#datasheetForm .modal-form__submit');

  if (dsEmail && dsSubmit) {
    dsSubmit.dataset.origText = dsSubmit.textContent.trim();
    dsSubmit.disabled = true;
    dsEmail.addEventListener('input', () => {
      dsSubmit.disabled = !dsEmail.value.trim();
    });
  }

  /* ── Quote form submit ──────────────────────────────── */
  const quoteForm    = document.getElementById('quoteForm');
  const quoteSuccess = document.getElementById('quoteSuccess');
  if (quoteForm) {
    const qBtn = quoteForm.querySelector('.modal-form__submit');
    if (qBtn) qBtn.dataset.origText = qBtn.textContent.trim();

    quoteForm.addEventListener('submit', e => {
      e.preventDefault();
      if (qBtn) { qBtn.disabled = true; qBtn.textContent = 'Sending…'; }
      setTimeout(() => {
        quoteForm.style.display = 'none';
        quoteSuccess?.classList.add('is-visible');
        setTimeout(() => _closeModal('quoteModal'), 3000);
      }, 900);
    });
  }

  /* ── Datasheet form submit ──────────────────────────── */
  const dsForm    = document.getElementById('datasheetForm');
  const dsSuccess = document.getElementById('datasheetSuccess');
  if (dsForm) {
    dsForm.addEventListener('submit', e => {
      e.preventDefault();
      if (dsSubmit) { dsSubmit.disabled = true; dsSubmit.textContent = 'Sending…'; }
      setTimeout(() => {
        dsForm.style.display = 'none';
        dsSuccess?.classList.add('is-visible');
        setTimeout(() => _closeModal('datasheetModal'), 3000);
      }, 900);
    });
  }
}