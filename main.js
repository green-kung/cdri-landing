  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Horizontal scroll for flow section (GSAP ScrollTrigger)
  function initFlowScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector('.js-flow-scroll');
    const list    = document.querySelector('.js-flow-list');
    if (!section || !list) return;

    // Only on non-mobile (>= 768px)
    ScrollTrigger.matchMedia({
      '(min-width: 768px)': function () {
        gsap.to(list, {
          x: () => -(list.scrollWidth - section.offsetWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => '+=' + (list.scrollWidth - section.offsetWidth + 200),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });
      }
    });
  }

  // Run after GSAP scripts are loaded
  window.addEventListener('load', initFlowScroll);

function toggleMenu() {
  const links = document.getElementById('navLinks');
  links.classList.toggle('open');
  links.querySelectorAll('a').forEach(a => {
    a.onclick = () => links.classList.remove('open');
  });
}
