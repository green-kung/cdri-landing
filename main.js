  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function toggleMenu() {
  const links = document.getElementById('navLinks');
  links.classList.toggle('open');
  links.querySelectorAll('a').forEach(a => {
    a.onclick = () => links.classList.remove('open');
  });
}
