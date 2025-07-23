// Full-width Ali Abdaal Style JavaScript Enhancements

document.addEventListener('DOMContentLoaded', function() {
  // Header scroll effect
  const header = document.querySelector('.site-header');
  
  function handleScroll() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleScroll);
  
  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        // Stop observing after animation triggers
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all animatable elements
  const animatableElements = document.querySelectorAll(
    '.article-card, .course-card, .stat-card, .section-header'
  );
  
  animatableElements.forEach(el => {
    observer.observe(el);
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Newsletter form enhancement
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('.newsletter-input').value;
      
      if (email) {
        // Show success message (in a real app, this would submit to a service)
        const button = this.querySelector('.newsletter-button');
        const originalText = button.textContent;
        
        button.textContent = '✓ 已訂閱!';
        button.style.background = '#10b981';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '';
          this.querySelector('.newsletter-input').value = '';
        }, 3000);
      }
    });
  }
  
  // Parallax effect for hero section
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroHeight = hero.offsetHeight;
      const parallaxSpeed = scrolled * 0.5;
      
      if (scrolled < heroHeight) {
        hero.style.transform = `translateY(${parallaxSpeed}px)`;
      }
    });
  }
  
  // Enhanced card hover effects with tilt
  const cards = document.querySelectorAll('.article-card, .course-card, .stat-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
  
  // Typing animation for hero title
  const heroTitle = document.querySelector('.hero-text h1');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid white';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        // Remove cursor after typing is complete
        setTimeout(() => {
          heroTitle.style.borderRight = 'none';
        }, 1000);
      }
    };
    
    // Start typing animation after a brief delay
    setTimeout(typeWriter, 1000);
  }
  
  // Mobile navigation toggle (basic implementation)
  const navToggle = document.createElement('button');
  navToggle.innerHTML = '☰';
  navToggle.className = 'nav-toggle';
  navToggle.style.cssText = `
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-primary);
    cursor: pointer;
    padding: 0.5rem;
  `;
  
  const navLinks = document.querySelector('.nav-links');
  const navContainer = document.querySelector('.nav-container');
  
  if (navContainer && navLinks) {
    navContainer.insertBefore(navToggle, navLinks);
    
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('nav-open');
    });
  }
  
  // Add mobile styles for navigation
  const mobileNavStyles = document.createElement('style');
  mobileNavStyles.textContent = `
    @media (max-width: 768px) {
      .nav-toggle {
        display: block !important;
      }
      
      .nav-links {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 1rem 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }
      
      .nav-links.nav-open {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }
      
      .nav-link {
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--border-light);
      }
      
      .nav-link:last-child {
        border-bottom: none;
      }
    }
  `;
  document.head.appendChild(mobileNavStyles);
  
  // Lazy loading for images
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
  
  // Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`Page load time: ${pageLoadTime}ms`);
    });
  }
  
  // Add fade-in animation styles
  const animationStyles = document.createElement('style');
  animationStyles.textContent = `
    .fade-in-up {
      animation: fadeInUp 0.8s ease-out forwards;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .article-card,
    .course-card,
    .stat-card,
    .section-header {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
  `;
  document.head.appendChild(animationStyles);
});

// Utility functions
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Optimized scroll handler
const optimizedScrollHandler = throttle(function() {
  // Handle scroll-based animations here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);