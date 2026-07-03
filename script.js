/* ============================================================
   RITIK KUMAR — PORTFOLIO INTERACTIVITY
   Particles · Typewriter · Scroll Reveal · Navigation · Tilt
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Particle Canvas ──────────────────────────────────────────
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    // Adaptive particle count
    const getParticleCount = () => {
      const w = canvas.width;
      if (w < 600) return 30;
      if (w < 1000) return 50;
      return 70;
    };

    const CONNECTION_DIST = 130;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resize();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        initParticles();
      }, 200);
    });

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5 + 0.5;
        this.baseOpacity = Math.random() * 0.4 + 0.1;
        this.opacity = this.baseOpacity;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;

        // Mouse interaction
        if (mouse.x !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            this.x += dx * force * 0.008;
            this.y += dy * force * 0.008;
            this.opacity = Math.min(this.baseOpacity + force * 0.3, 0.8);
          } else {
            this.opacity += (this.baseOpacity - this.opacity) * 0.05;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
        ctx.fill();
      }
    }

    function initParticles() {
      const count = getParticleCount();
      particles = Array.from({ length: count }, () => new Particle());
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.06;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animate);
    }

    initParticles();
    animate();
  }


  // ── Typewriter ───────────────────────────────────────────────
  const typewriterEl = document.querySelector('.typewriter-text');
  if (typewriterEl) {
    const phrases = [
      'Full-Stack Developer',
      'AI Enthusiast',
      'Python Developer',
      'Automation Builder',
      'MCA Student'
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function typewrite() {
      const current = phrases[phraseIdx];
      let speed;

      if (deleting) {
        typewriterEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        speed = 35;
      } else {
        typewriterEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        speed = 70 + Math.random() * 30; // Slight randomness for natural feel
      }

      if (!deleting && charIdx === current.length) {
        deleting = true;
        speed = 2200; // Pause at complete phrase
      } else if (deleting && charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed = 400;
      }

      setTimeout(typewrite, speed);
    }

    // Start after a brief delay
    setTimeout(typewrite, 800);
  }


  // ── Scroll Reveal ────────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }


  // ── Navbar ───────────────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      // Scrolled state
      if (navbar) {
        navbar.classList.toggle('scrolled', scrollY > 40);
      }

      // Active link
      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 140;
        if (scrollY >= top) {
          current = section.getAttribute('id');
        }
      });

      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
      });

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  // ── Mobile Nav ───────────────────────────────────────────────
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-links');
  const overlay = document.getElementById('nav-overlay');

  function closeMenu() {
    toggle?.classList.remove('active');
    menu?.classList.remove('open');
    overlay?.classList.remove('visible');
    document.body.style.overflow = '';
  }

  function openMenu() {
    toggle?.classList.add('active');
    menu?.classList.add('open');
    overlay?.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  toggle?.addEventListener('click', () => {
    menu?.classList.contains('open') ? closeMenu() : openMenu();
  });

  menu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  overlay?.addEventListener('click', closeMenu);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  // ── Smooth Scroll ───────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ── Back to Top ──────────────────────────────────────────────
  document.querySelector('.back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ── Project Card Tilt (Desktop) ──────────────────────────────
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (y - 0.5) * -4;
        const rotateY = (x - 0.5) * 4;

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }

});
