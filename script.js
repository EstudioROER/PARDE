document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('bg-video');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // If reduced motion, remove the source so it just shows the poster
    video.pause();
    video.innerHTML = '';
    video.load();
  } else {
    // Scroll-driven video playback
    // The user requested: "la pagina avance a medida que se haga scroll en la pagina para que calce cada seccion con otra en el video"
    
    // We need to wait for the video metadata to load to know its duration
    video.addEventListener('loadedmetadata', () => {
      const duration = video.duration;
      
      const onScroll = () => {
        // Calculate how far we've scrolled
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollFraction = window.scrollY / maxScroll;
        
        // Map scroll fraction to video time
        // We use requestAnimationFrame for smoother scrubbing
        requestAnimationFrame(() => {
          if (!isNaN(duration) && isFinite(duration)) {
            // Keep it just under duration to prevent loop wrap issues
            video.currentTime = Math.min(scrollFraction * duration, duration - 0.1);
          }
        });
      };
      
      window.addEventListener('scroll', onScroll, { passive: true });
      // Trigger once on load
      onScroll();
    });
    
    // In case metadata is already loaded
    if (video.readyState >= 1) {
      video.dispatchEvent(new Event('loadedmetadata'));
    }
  }

  // Reveal Animations
  const revealElements = document.querySelectorAll('h1, h2, p, .cta-primary, .cta-secondary, .hero-footer, .data-row, .cabin-silhouette, .section-num');
  
  revealElements.forEach(el => el.classList.add('reveal'));

  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }
});
