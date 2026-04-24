document.addEventListener('DOMContentLoaded', function() {
  const preloader = document.querySelector('.preloader');
  
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 800);
    });
  }

  const header = document.querySelector('header');
  const scrollTopBtn = document.querySelector('.scroll-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
      if (scrollTopBtn) scrollTopBtn.classList.add('visible');
    } else {
      header.classList.remove('scrolled');
      if (scrollTopBtn) scrollTopBtn.classList.remove('visible');
    }
  });

  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('nav ul');
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenuBtn.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });
    
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.textContent = '☰';
      });
    });
  }

  const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.style.animationPlayState = 'running';
        }, delay);
      }
    });
  }, observerOptions);
  
  animateOnScrollElements.forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });

  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '50px' });
  
  lazyImages.forEach(img => imageObserver.observe(img));

  const counters = document.querySelectorAll('.counter-number');
  
  const countUp = (counter) => {
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCount = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.ceil(current).toLocaleString();
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };
    
    updateCount();
  };
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));

  const testimonialContainer = document.querySelector('.testimonial-container');
  if (testimonialContainer) {
    const testimonials = testimonialContainer.querySelectorAll('.testimonial');
    let currentIndex = 0;
    
    testimonials.forEach((testimonial, index) => {
      if (index !== 0) {
        testimonial.style.display = 'none';
        testimonial.style.opacity = '0';
      }
    });
    
    const showTestimonial = (index) => {
      testimonials.forEach((testimonial, i) => {
        if (i === index) {
          testimonial.style.display = 'block';
          setTimeout(() => {
            testimonial.style.opacity = '1';
            testimonial.style.transform = 'translateY(0)';
          }, 50);
        } else {
          testimonial.style.opacity = '0';
          testimonial.style.transform = 'translateY(20px)';
          setTimeout(() => {
            testimonial.style.display = 'none';
          }, 400);
        }
      });
      currentIndex = index;
    };
    
    const prevBtn = testimonialContainer.querySelector('.prev-btn');
    const nextBtn = testimonialContainer.querySelector('.next-btn');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = testimonials.length - 1;
        showTestimonial(newIndex);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        let newIndex = currentIndex + 1;
        if (newIndex >= testimonials.length) newIndex = 0;
        showTestimonial(newIndex);
      });
    }
    
    setInterval(() => {
      let newIndex = currentIndex + 1;
      if (newIndex >= testimonials.length) newIndex = 0;
      showTestimonial(newIndex);
    }, 6000);
  }

  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const inputs = form.querySelectorAll('input, textarea, select');
      let isValid = true;
      
      inputs.forEach(input => {
        if (input.required && !input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#e53e3e';
        } else {
          input.style.borderColor = '#e2e8f0';
        }
      });
      
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
          isValid = false;
          emailInput.style.borderColor = '#e53e3e';
        }
      }
      
      if (isValid) {
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;
        
        setTimeout(() => {
          alert('Thank you! Your submission has been received. We will contact you shortly.');
          form.reset();
          btn.textContent = originalText;
          btn.disabled = false;
        }, 1500);
      } else {
        alert('Please fill in all required fields correctly.');
      }
    });
    
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.style.borderColor = '#4299e1';
      });
      input.addEventListener('blur', () => {
        if (input.value) {
          input.style.borderColor = '#48bb78';
        } else {
          input.style.borderColor = '#e2e8f0';
        }
      });
    });
  });

  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    scrollTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.animation = 'pulse 0.3s ease';
    });
    card.addEventListener('animationend', () => {
      card.style.animation = '';
    });
  });

  const animatedNumbers = document.querySelectorAll('[data-count]');
  animatedNumbers.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
  });
});

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  setTimeout(() => {
    const heroElements = document.querySelectorAll('.hero h1, .hero p, .hero-btns, .hero-stats, .hero-badge');
    heroElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 150);
    });
  }, 900);
});

function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const particleContainer = hero.querySelector('.hero-particles');
  if (!particleContainer) return;
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 5}s;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    particleContainer.appendChild(particle);
  }
}

document.addEventListener('DOMContentLoaded', initParticles);