const slot = document.getElementById('hero-gif-slot');
const img = slot?.querySelector('img');
img?.addEventListener('error', () => slot.classList.add('is-empty'));
if (img?.complete && !img.naturalWidth) slot.classList.add('is-empty');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CHAR_STEP = 0.07;
const CHAR_DUR = 0.55;
const HOMI_LEN = 4;
const TITLE = 'HomiLAB';

const titleEl = document.getElementById('hero-title');
const descMask = document.querySelector('.hero-open__desc-mask');

let endTime = 0.15;

if (titleEl) {
  const labWrap = document.createElement('span');
  labWrap.className = 'title-lab';

  [...TITLE].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'hero-char' + (i >= HOMI_LEN ? ' hero-char--lab' : '');
    span.textContent = ch;
    if (!reducedMotion) {
      span.style.animationDelay = `${0.15 + i * CHAR_STEP}s`;
    } else {
      span.classList.add('hero-char--done');
    }
    if (i < HOMI_LEN) {
      titleEl.appendChild(span);
    } else {
      labWrap.appendChild(span);
    }
  });

  const wave = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  wave.setAttribute('class', 'title-lab__wave');
  wave.setAttribute('viewBox', '0 0 100 12');
  wave.setAttribute('preserveAspectRatio', 'none');
  wave.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('class', 'title-lab__path');
  path.setAttribute('d', 'M2,8 Q25,3 50,7 T98,6');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2.2');
  path.setAttribute('stroke-linecap', 'butt');
  path.setAttribute('stroke-linejoin', 'miter');
  wave.appendChild(path);
  labWrap.appendChild(wave);
  titleEl.appendChild(labWrap);

  endTime = 0.15 + TITLE.length * CHAR_STEP + CHAR_DUR;

  if (reducedMotion) {
    path.classList.add('is-drawn');
  } else {
    setTimeout(() => path.classList.add('is-drawn'), (endTime - CHAR_DUR + 0.08) * 1000);
  }
}

if (reducedMotion) {
  descMask?.classList.add('is-revealed');
} else {
  setTimeout(() => descMask?.classList.add('is-revealed'), endTime * 1000);
}
