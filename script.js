// Modern JavaScript for Portfolio - Enhanced Version

// Utility Functions
const utils = {
  // Check if element is in viewport
  isInViewport: (element, offset = 0) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
      rect.bottom >= offset
    );
  },

  // Throttle function for performance
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  },

  // Debounce function
  debounce: (func, wait, immediate) => {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },

  // Smooth counter animation
  animateCounter: (element, target, duration = 2000, suffix = '') => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + suffix;
      }
    };

    updateCounter();
  }
};

// Particle Animation System
class ParticleSystem {
  constructor() {
    this.container = document.getElementById('particles');
    this.particles = [];
    this.particleCount = 50;
    this.init();
  }

  init() {
    if (!this.container) return;
    
    for (let i = 0; i < this.particleCount; i++) {
      this.createParticle();
    }
  }

  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    
    this.container.appendChild(particle);
    this.particles.push(particle);
  }
}

// Header Management Enhanced
class HeaderManager {
  constructor() {
    this.header = document.getElementById('header');
    this.lastScrollY = window.scrollY;
    this.ticking = false;
    this.init();
  }

  init() {
    if (this.header) {
      window.addEventListener('scroll', this.handleScroll.bind(this));
    }
  }

  handleScroll() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.updateHeader();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  updateHeader() {
    const currentScrollY = window.scrollY;
    
    // Add scrolled class for styling
    if (currentScrollY > 50) {
      this.header.classList.add('header-scrolled');
    } else {
      this.header.classList.remove('header-scrolled');
    }

    // Hide/show header on scroll
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      this.header.classList.add('hidden');
    } else {
      this.header.classList.remove('hidden');
    }

    this.lastScrollY = currentScrollY;
  }
}

// Mobile Menu Management Enhanced
class MobileMenu {
  constructor() {
    this.menuToggle = document.getElementById('menuToggle');
    this.nav = document.getElementById('nav');
    this.isOpen = false;
    this.init();
  }

  init() {
    if (this.menuToggle && this.nav) {
      this.menuToggle.addEventListener('click', this.toggle.bind(this));
      
      // Close menu when clicking on links
      this.nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', this.close.bind(this));
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.nav.contains(e.target) && !this.menuToggle.contains(e.target)) {
          this.close();
        }
      });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Handle resize
      window.addEventListener('resize', utils.debounce(() => {
        if (window.innerWidth > 1024 && this.isOpen) {
          this.close();
        }
      }, 250));
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.nav.classList.add('active');
    this.menuToggle.classList.add('active');
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
    this.menuToggle.setAttribute('aria-expanded', 'true');
  }

  close() {
    this.nav.classList.remove('active');
    this.menuToggle.classList.remove('active');
    this.isOpen = false;
    document.body.style.overflow = '';
    this.menuToggle.setAttribute('aria-expanded', 'false');
  }
}

// Smooth Scrolling Enhanced
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', this.handleClick.bind(this));
    });
  }

  handleClick(e) {
    e.preventDefault();
    
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const headerHeight = document.getElementById('header')?.offsetHeight || 80;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update URL without jumping
      history.pushState(null, null, targetId);
    }
  }
}

// Active Section Highlighter Enhanced
class ActiveSectionHighlighter {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.observerOptions = {
      rootMargin: '-50% 0px -50% 0px'
    };
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);
      this.sections.forEach(section => this.observer.observe(section));
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        this.updateActiveNavLink(id);
      }
    });
  }

  updateActiveNavLink(activeId) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      }
    });
  }
}

// Counter Animation
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number[data-target]');
    this.animated = new Set();
    this.init();
  }

  init() {
    if (this.counters.length > 0) {
      window.addEventListener('scroll', utils.throttle(this.checkCounters.bind(this), 100));
      this.checkCounters();
    }
  }

  checkCounters() {
    this.counters.forEach(counter => {
      if (!this.animated.has(counter) && utils.isInViewport(counter, 100)) {
        this.animateCounter(counter);
        this.animated.add(counter);
      }
    });
  }

  animateCounter(counter) {
    const target = parseFloat(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    utils.animateCounter(counter, target, 2000, suffix);
  }
}

// Skill Bars Animation Enhanced
class SkillBarsAnimator {
  constructor() {
    this.skillBars = document.querySelectorAll('.progress-fill');
    this.animated = new Set();
    this.init();
  }

  init() {
    if (this.skillBars.length > 0) {
      window.addEventListener('scroll', utils.throttle(this.checkAnimation.bind(this), 100));
      this.checkAnimation();
    }
  }

  checkAnimation() {
    this.skillBars.forEach(bar => {
      if (!this.animated.has(bar) && utils.isInViewport(bar, 100)) {
        this.animateBar(bar);
        this.animated.add(bar);
      }
    });
  }

  animateBar(bar) {
    const width = bar.getAttribute('data-width');
    if (width) {
      setTimeout(() => {
        bar.style.width = width + '%';
      }, Math.random() * 300 + 100);
    }
  }
}

// Scroll Animations Enhanced
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('[data-animate]');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window && this.elements.length > 0) {
      this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      });

      this.elements.forEach(element => this.observer.observe(element));
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animationType = element.getAttribute('data-animate');
        const delay = element.getAttribute('data-delay') || 0;
        
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.animation = `${animationType} 0.8s ease-out forwards`;
        }, delay);

        this.observer.unobserve(element);
      }
    });
  }
}

// Tools Filter Enhanced
class ToolsFilter {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.toolCards = document.querySelectorAll('.tool-card');
    this.activeFilter = 'all';
    this.init();
  }

  init() {
    if (this.filterButtons.length > 0) {
      this.filterButtons.forEach(button => {
        button.addEventListener('click', this.handleFilter.bind(this));
      });
    }
  }

  handleFilter(e) {
    const category = e.target.getAttribute('data-category');
    
    // Update active button
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter tools with animation
    this.toolCards.forEach((card, index) => {
      const cardCategory = card.getAttribute('data-category');
      
      if (category === 'all' || cardCategory === category) {
        setTimeout(() => {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        }, index * 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });

    this.activeFilter = category;
  }
}

// Contact Form Handler Enhanced
class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', this.handleSubmit.bind(this));
      
      // Add real-time validation
      this.form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', this.validateField.bind(this));
        field.addEventListener('input', this.clearErrors.bind(this));
      });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      // Get form data
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());

      // Here you would normally send to your server
      // For demo, we'll simulate a delay
      await this.simulateSubmission(data);
      
      this.showSuccess('Message sent successfully! I\'ll get back to you soon.');
      this.form.reset();
    } catch (error) {
      this.showError('Failed to send message. Please try again or contact me directly.');
    } finally {
      // Restore button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  async simulateSubmission(data) {
    // Log the form data for demo
    console.log('Form submitted with:', data);
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Simulation error'));
        }
      }, 2000);
    });
  }

  validateForm() {
    let isValid = true;
    const requiredFields = this.form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!this.validateField({ target: field })) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    this.clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      errorMessage = 'This field is required';
      isValid = false;
    }
    // Email validation
    else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = 'Please enter a valid email address';
        isValid = false;
      }
    }
    // Phone validation (optional)
    else if (field.type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        errorMessage = 'Please enter a valid phone number';
        isValid = false;
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  clearErrors(e) {
    this.clearFieldError(e.target);
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type) {
    // Remove any existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    // Auto remove after 5 seconds
    const autoRemoveTimeout = setTimeout(() => {
      this.removeNotification(notification);
    }, 5000);

    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
      clearTimeout(autoRemoveTimeout);
      this.removeNotification(notification);
    });
  }

  removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }
}

// Scroll to Top Button Enhanced
class ScrollToTop {
  constructor() {
    this.button = document.getElementById('scrollTop');
    this.isVisible = false;
    this.init();
  }

  init() {
    if (this.button) {
      window.addEventListener('scroll', utils.throttle(this.handleScroll.bind(this), 100));
      this.button.addEventListener('click', this.scrollToTop.bind(this));
    }
  }

  handleScroll() {
    const shouldShow = window.scrollY > 300;
    
    if (shouldShow && !this.isVisible) {
      this.show();
    } else if (!shouldShow && this.isVisible) {
      this.hide();
    }
  }

  show() {
    this.button.classList.add('visible');
    this.isVisible = true;
  }

  hide() {
    this.button.classList.remove('visible');
    this.isVisible = false;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// Performance Observer
class PerformanceObserver {
  constructor() {
    this.init();
  }

  init() {
    // Check for slow devices
    if ('connection' in navigator && navigator.connection.saveData) {
      document.documentElement.classList.add('save-data');
    }

    // Reduce animations on slower devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
      document.documentElement.classList.add('reduce-animations');
    }

    // Respect user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      document.documentElement.classList.add('reduce-animations');
    }

    // Update on change
    prefersReducedMotion.addEventListener('change', (e) => {
      if (e.matches) {
        document.documentElement.classList.add('reduce-animations');
      } else {
        document.documentElement.classList.remove('reduce-animations');
      }
    });
  }
}

// Theme Manager (for future dark/light mode)
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Portfolio initializing...');

  // Initialize all components
  const app = {
    particles: new ParticleSystem(),
    header: new HeaderManager(),
    mobileMenu: new MobileMenu(),
    smoothScroll: new SmoothScroll(),
    activeSection: new ActiveSectionHighlighter(),
    counters: new CounterAnimation(),
    skillBars: new SkillBarsAnimator(),
    scrollAnimations: new ScrollAnimations(),
    toolsFilter: new ToolsFilter(),
    contactForm: new ContactForm(),
    scrollTop: new ScrollToTop(),
    performance: new PerformanceObserver(),
    theme: new ThemeManager()
  };

  // Make app available globally for debugging
  window.portfolioApp = app;

  // Add loaded class when everything is ready
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    console.log('✅ Portfolio loaded successfully');
  });

  // Log performance metrics
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`📊 Page load time: ${pageLoadTime}ms`);
      }, 0);
    });
  }
});

// Service Worker Registration (for PWA support)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered:', registration);
    }).catch(error => {
      console.log('SW registration failed:', error);
    });
  });
}