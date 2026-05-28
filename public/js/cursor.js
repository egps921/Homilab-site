(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const root = document.documentElement;
  root.classList.add('has-custom-cursor');

  const img = document.createElement('img');
  img.src = '/media/cursor.svg';
  img.className = 'site-cursor__img';
  img.width = 32;
  img.height = 32;
  img.alt = '';
  img.draggable = false;
  document.body.appendChild(img);

  let x = -100;
  let y = -100;

  document.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    img.style.left = x + 'px';
    img.style.top = y + 'px';
  });

  const hoverSel = 'a, button, input, textarea, select, label, .link-card, .chat-fab';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSel)) root.classList.add('cursor--hover');
  });

  document.addEventListener('mouseout', (e) => {
    if (!e.target.closest(hoverSel)) return;
    const to = e.relatedTarget;
    if (!to || !to.closest(hoverSel)) root.classList.remove('cursor--hover');
  });
})();
