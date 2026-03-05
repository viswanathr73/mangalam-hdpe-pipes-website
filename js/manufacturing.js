/**
 * manufacturing.js — Manufacturing Process step tabs
 *
 * Steps: 7 named stages of HDPE pipe production
 * Clicking a tab swaps the card content (title, desc, bullets, image)
 * and updates:
 *   - active tab highlight
 *   - step badge text on mobile ("Step X/7: Name")
 *   - prev/next button disabled states
 * Image prev/next arrows on the card do the same as tab clicks.
 */

'use strict';

function initManufacturing() {
  const { qs, qsa, on } = window.MG;

  /* ── Step data ────────────────────────────────────── */
  const STEPS = [
    {
      id:     'raw-material',
      label:  'Raw Material',
      title:  'High-Grade Raw Material Selection',
      desc:   'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
      bullets: ['PE100 grade material', 'Optimal molecular weight distribution'],
      img:    'assets/images/mfg-raw-material.jpg',
      imgAlt: 'Workers handling raw HDPE material at the manufacturing plant',
    },
    {
      id:     'extrusion',
      label:  'Extrusion',
      title:  'Precision Extrusion Process',
      desc:   'Our state-of-the-art extruders process PE100 compound at optimal temperatures to produce pipes with consistent wall thickness and density.',
      bullets: ['Temperature-controlled zones', 'Consistent melt flow index'],
      img:    'assets/images/mfg-extrusion.jpg',
      imgAlt: 'HDPE pipe extrusion line in operation',
    },
    {
      id:     'cooling',
      label:  'Cooling',
      title:  'Controlled Cooling & Sizing',
      desc:   'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
      bullets: ['Water-bath cooling system', 'Precision diameter control'],
      img:    'assets/images/mfg-cooling.jpg',
      imgAlt: 'Cooling tanks in the manufacturing process',
    },
    {
      id:     'sizing',
      label:  'Sizing',
      title:  'Dimensional Accuracy & Sizing',
      desc:   'Each pipe is drawn through a calibration sleeve that sets the final outer diameter to within ±0.1mm tolerance.',
      bullets: ['±0.1mm dimensional tolerance', 'SDR-compliant wall thickness'],
      img:    'assets/images/mfg-sizing.jpg',
      imgAlt: 'Pipe sizing equipment on the production line',
    },
    {
      id:     'quality-control',
      label:  'Quality Control',
      title:  'Rigorous Quality Control Testing',
      desc:   'Every production run undergoes hydrostatic pressure testing, dimensional verification, and material property analysis per IS/ISO standards.',
      bullets: ['Hydrostatic pressure testing', 'In-line thickness measurement'],
      img:    'assets/images/mfg-qc.jpg',
      imgAlt: 'Quality control team testing HDPE pipes',
    },
    {
      id:     'marking',
      label:  'Marking',
      title:  'Permanent Identification Marking',
      desc:   'Laser or inkjet marking applies product specifications, certification marks, and batch codes for full traceability.',
      bullets: ['Laser-etched specifications', 'ISO 4427 marking compliance'],
      img:    'assets/images/mfg-marking.jpg',
      imgAlt: 'Pipe marking station on the production line',
    },
    {
      id:     'coiling',
      label:  'Coiling',
      title:  'Precision Coiling & Packaging',
      desc:   'Smaller-diameter pipes are coiled on motorised spools for efficient transport and on-site deployment with minimal handling effort.',
      bullets: ['Motorised coiling spools', 'Up to 500m coil lengths'],
      img:    'assets/images/mfg-coiling.jpg',
      imgAlt: 'HDPE pipe coiling machine',
    },
    {
      id:     'packaging',
      label:  'Packaging',
      title:  'Protective Packaging & Dispatch',
      desc:   'Finished pipes and coils are bundled, labelled, and shrink-wrapped for protected delivery to project sites across India.',
      bullets: ['UV-protective wrapping', 'Barcode-tracked dispatch'],
      img:    'assets/images/mfg-packaging.jpg',
      imgAlt: 'Packaged HDPE pipes ready for dispatch',
    },
  ];

  let currentStep = 0;

  /* ── DOM refs ─────────────────────────────────────── */
  const tabs       = qsa('.mfg-tab');
  const badge      = qs('.mfg-step-badge');
  const cardTitle  = qs('.mfg-card__title');
  const cardDesc   = qs('.mfg-card__desc');
  const cardBullets= qs('.mfg-card__bullets');
  const cardImg    = qs('.mfg-card__img');
  const prevImg    = qs('.mfg-card__nav--prev');
  const nextImg    = qs('.mfg-card__nav--next');
  const prevMobile = qs('.mfg-mobile-nav__btn--prev');
  const nextMobile = qs('.mfg-mobile-nav__btn--next');

  if (!tabs.length || !cardTitle) return;

  /* ── Render step ──────────────────────────────────── */
  function render(i) {
    const step = STEPS[i];
    if (!step) return;

    /* Fade: opacity 0 → swap → opacity 1 */
    if (cardTitle) {
      cardTitle.style.opacity = '0';
      setTimeout(() => {
        cardTitle.textContent  = step.title;
        if (cardDesc)    cardDesc.textContent = step.desc;
        if (cardBullets) {
          cardBullets.innerHTML = step.bullets
            .map(b => `<li>${b}</li>`).join('');
        }
        if (cardImg) {
          cardImg.src = step.img;
          cardImg.alt = step.imgAlt;
        }
        if (badge) badge.textContent = `Step ${i + 1}/${STEPS.length}: ${step.label}`;
        cardTitle.style.opacity = '1';
      }, 160);
    }

    /* Sync tabs */
    tabs.forEach((tab, idx) => {
      tab.classList.toggle('is-active', idx === i);
      tab.setAttribute('aria-selected', idx === i ? 'true' : 'false');
    });

    /* Sync nav buttons */
    const atStart = i === 0;
    const atEnd   = i === STEPS.length - 1;
    if (prevImg)    prevImg.disabled    = atStart;
    if (nextImg)    nextImg.disabled    = atEnd;
    if (prevMobile) prevMobile.disabled = atStart;
    if (nextMobile) nextMobile.disabled = atEnd;
  }

  function goTo(i) {
    currentStep = Math.max(0, Math.min(i, STEPS.length - 1));
    render(currentStep);
    /* Scroll active tab into view in the tab strip */
    tabs[currentStep]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  /* ── Tab clicks ───────────────────────────────────── */
  tabs.forEach((tab, i) => {
    on(tab, 'click', () => goTo(i));
  });

  /* ── Image nav arrows ─────────────────────────────── */
  if (prevImg) on(prevImg, 'click', () => goTo(currentStep - 1));
  if (nextImg) on(nextImg, 'click', () => goTo(currentStep + 1));

  /* ── Mobile prev/next text buttons ───────────────── */
  if (prevMobile) on(prevMobile, 'click', () => goTo(currentStep - 1));
  if (nextMobile) on(nextMobile, 'click', () => goTo(currentStep + 1));

  /* ── Init ─────────────────────────────────────────── */
  goTo(0);
}
