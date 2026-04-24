document.addEventListener('DOMContentLoaded', function() {
  const preloader = document.querySelector('.preloader');
  
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 500);
    });
  }

  const header = document.querySelector('header');
  const scrollTopBtn = document.querySelector('.scroll-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('bg-white', 'shadow-md');
      header.classList.remove('bg-white/95');
      if (scrollTopBtn) scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      header.classList.remove('shadow-md');
      header.classList.add('bg-white/95', 'backdrop-blur-lg');
      if (scrollTopBtn) scrollTopBtn.classList.add('opacity-0', 'pointer-events-none');
    }
  });

  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('nav ul');
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('hidden');
      mobileMenuBtn.textContent = navMenu.classList.contains('hidden') ? '☰' : '✕';
    });
    
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.add('hidden');
        mobileMenuBtn.textContent = '☰';
      });
    });
  }

  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animateElements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

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
        testimonial.classList.add('hidden');
      }
    });
    
    const showTestimonial = (index) => {
      testimonials.forEach((testimonial, i) => {
        if (i === index) {
          testimonial.classList.remove('hidden');
          testimonial.style.animation = 'fadeIn 0.4s ease-out';
        } else {
          testimonial.classList.add('hidden');
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
          input.classList.add('border-red-500');
        } else {
          input.classList.remove('border-red-500');
        }
      });
      
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
  });

  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    scrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

window.addEventListener('load', () => {
  const heroElements = document.querySelectorAll('.hero-animate');
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('animate-fade-in-up');
      el.style.opacity = '1';
    }, 200 + (index * 150));
  });
});