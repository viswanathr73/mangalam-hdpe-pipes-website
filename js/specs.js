/**
 * specs.js
 * Handles the mobile table-to-stacked-cards transformation.
 * On screens ≤768px the two-column table is replaced with
 * stacked rows (param label above, value below).
 * Uses a ResizeObserver so it reacts to live viewport changes.
 */

'use strict';

function initSpecs() {
  const { qs } = window.MG;

  const tableWrap = qs('.specs-table-wrap');
  if (!tableWrap) return;

  /* Collect all param+spec pairs from the desktop columns */
  const paramCells = [...tableWrap.querySelectorAll('.specs-col--param .specs-cell')];
  const specCells = [...tableWrap.querySelectorAll('.specs-col--spec  .specs-cell')];

  if (!paramCells.length || !specCells.length) return;

  /* Build the mobile rows once, keep them in a fragment */
  const mobileHeader = buildMobileHeader();
  const mobileRows = paramCells.map((paramCell, i) => {
    const specCell = specCells[i];
    return buildMobileRow(
      paramCell.querySelector('span')?.textContent?.trim() ?? '',
      specCell                             /* pass the whole cell for flag+text */
    );
  });

  let mobileInjected = false;

  function buildMobileHeader() {
    const el = document.createElement('div');
    el.className = 'specs-mobile-header';
    el.textContent = 'Specifications';
    return el;
  }

  function buildMobileRow(param, specCell) {
    const row = document.createElement('div');
    row.className = 'specs-row-mobile';

    const pEl = document.createElement('p');
    pEl.className = 'specs-row-mobile__param';
    pEl.textContent = param;

    const vEl = document.createElement('div');
    vEl.className = 'specs-row-mobile__value';
    /* Clone the spec cell's inner content (preserves flag emoji etc.) */
    [...specCell.childNodes].forEach(node => vEl.appendChild(node.cloneNode(true)));

    row.appendChild(pEl);
    row.appendChild(vEl);
    return row;
  }

  function injectMobileRows() {
    if (mobileInjected) return;
    tableWrap.classList.add('is-stacked');
    tableWrap.appendChild(mobileHeader);
    mobileRows.forEach(row => tableWrap.appendChild(row));
    mobileInjected = true;
  }

  function removeMobileRows() {
    if (!mobileInjected) return;
    tableWrap.classList.remove('is-stacked');
    tableWrap.removeChild(mobileHeader);
    mobileRows.forEach(row => {
      if (row.parentNode === tableWrap) tableWrap.removeChild(row);
    });
    mobileInjected = false;
  }

  function check(width) {
    if (width <= 768) {
      injectMobileRows();
    } else {
      removeMobileRows();
    }
  }

  /* ResizeObserver — fires on element resize, not just window */
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(entries => {
      check(entries[0].contentRect.width);
    }).observe(tableWrap);
  } else {
    /* Fallback: window resize */
    check(window.innerWidth);
    window.addEventListener('resize', window.MG.debounce(() => {
      check(window.innerWidth);
    }, 150));
  }

  /* Initial check */
  check(tableWrap.offsetWidth);
}
