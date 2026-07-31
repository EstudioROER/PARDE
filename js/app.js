document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('nav');
  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      mobileToggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });
  }

  // Scroll Reveal Animation (Intersection Observer)
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  revealElements.forEach(el => revealObserver.observe(el));

  // Active Navigation Link on Scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // --- Interactive Antes vs. Después Component ---
  const btnBefore = document.getElementById('btn-show-before');
  const btnAfter = document.getElementById('btn-show-after');
  const viewBefore = document.getElementById('view-before');
  const viewAfter = document.getElementById('view-after');

  if (btnBefore && btnAfter && viewBefore && viewAfter) {
    btnBefore.addEventListener('click', () => {
      btnBefore.classList.add('active');
      btnAfter.classList.remove('active');
      viewBefore.classList.add('active');
      viewAfter.classList.remove('active');
    });

    btnAfter.addEventListener('click', () => {
      btnAfter.classList.add('active');
      btnBefore.classList.remove('active');
      viewAfter.classList.add('active');
      viewBefore.classList.remove('active');
    });
  }
});
