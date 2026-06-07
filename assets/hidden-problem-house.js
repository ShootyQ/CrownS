const stepElements = Array.from(document.querySelectorAll('.inspection-step'));
const stageCard = document.querySelector('.stage-card');
const stageTitle = document.getElementById('stage-title');
const stageCopy = document.getElementById('stage-copy');
const activeLayerChip = document.getElementById('active-layer-chip');
const layerButtons = Array.from(document.querySelectorAll('[data-layer-target]'));
const progressStops = Array.from(document.querySelectorAll('[data-progress-target]'));

const setActiveStep = (step) => {
  if (!step || !stageCard) {
    return;
  }

  const layer = step.dataset.layer;
  const layerName = step.dataset.layerName;
  const title = step.dataset.title;
  const copy = step.dataset.copy;
  const summaryKey = step.dataset.summaryKey;
  const summaryValue = step.dataset.summary;

  stageCard.dataset.activeLayer = layer;
  stageTitle.textContent = title;
  stageCopy.textContent = copy;
  activeLayerChip.textContent = layerName;

  stepElements.forEach((item) => {
    item.classList.toggle('is-current', item === step);
  });

  layerButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.layerTarget === layer);
  });

  progressStops.forEach((stop) => {
    stop.classList.toggle('is-active', stop.dataset.progressTarget === layer);
  });

  if (summaryKey && summaryValue) {
    const summaryTarget = document.getElementById(`summary-${summaryKey}`);
    const summaryRow = summaryTarget?.closest('.summary-row');

    if (summaryTarget) {
      summaryTarget.textContent = summaryValue;
    }

    if (summaryRow) {
      summaryRow.classList.add('is-complete');
    }
  }
};

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

    if (visible) {
      setActiveStep(visible.target);
    }
  },
  {
    threshold: [0.35, 0.6, 0.85],
    rootMargin: '-15% 0px -35% 0px',
  },
);

stepElements.forEach((step) => {
  observer.observe(step);
});

layerButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetLayer = button.dataset.layerTarget;
    const targetStep = stepElements.find((step) => step.dataset.layer === targetLayer);

    if (targetStep) {
      targetStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveStep(targetStep);
    }
  });
});

if (stepElements.length > 0) {
  setActiveStep(stepElements[0]);
}