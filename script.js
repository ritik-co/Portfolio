/* ============================================================
   RITIK KUMAR — PORTFOLIO SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navigation Toggle ────────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');

  if (navToggle && navLinks && navOverlay) {
    const toggleMenu = () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      navOverlay.classList.toggle('visible');
      document.body.classList.toggle('nav-lock');
    };

    navToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);

    // Close menu when clicking link items
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
          toggleMenu();
        }
      });
    });
  }

  // ── Scrolled Navbar Style ─────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ── Scroll Reveal Intersection Observer ────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // ── Scroll to Top Button ──────────────────────────────────────
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// ── Project Gallery Switcher (Global) ───────────────────────────
function changeGalleryImage(targetId, imagePath, thumbnailEl) {
  const mainImage = document.getElementById(targetId);
  if (!mainImage) return;

  // Fade out main image
  mainImage.style.opacity = 0;

  setTimeout(() => {
    // Swap image source
    mainImage.src = imagePath;
    // Fade in
    mainImage.style.opacity = 1;
  }, 150);

  // Manage active class on siblings
  const parent = thumbnailEl.parentElement;
  if (parent) {
    parent.querySelectorAll('.thumb-card').forEach(card => {
      card.classList.remove('active');
    });
  }
  thumbnailEl.classList.add('active');
}
