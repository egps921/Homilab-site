const revealOpts = { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 };

function observeReveal(elements, onReveal) {
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onReveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, revealOpts);
    elements.forEach((el) => observer.observe(el));
  } else {
    elements.forEach((el) => onReveal(el));
  }
}

observeReveal(document.querySelectorAll('.scroll-reveal'), (el) => {
  el.classList.add('is-revealed');
});

observeReveal(document.querySelectorAll('.links-reveal'), (stack) => {
  stack.classList.add('is-revealed');
});
