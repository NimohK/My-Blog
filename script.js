// Utility Functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Image Loading
function initImageLoading() {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Handle lazy-loaded images
        if (img.dataset.src) {
          const tempImage = new Image();
          tempImage.onload = () => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          };
          tempImage.onerror = () => {
            console.error('Failed to load image:', img.dataset.src);
            img.src = 'images/log2.png'; // Fallback image
            img.classList.add('loaded');
            observer.unobserve(img);
          };
          tempImage.src = img.dataset.src;
        }
        
        // Handle direct src images
        else if (img.src) {
          if (img.complete) {
            img.classList.add('loaded');
            observer.unobserve(img);
          } else {
            img.onload = () => {
              img.classList.add('loaded');
              observer.unobserve(img);
            };
            img.onerror = () => {
              console.error('Failed to load image:', img.src);
              img.src = 'images/log2.png'; // Fallback image
              img.classList.add('loaded');
              observer.unobserve(img);
            };
          }
        }
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.1
  });

  // Observe all images
  document.querySelectorAll('img').forEach(img => imageObserver.observe(img));
}

// Image Slider with Error Handling
function initSlider() {
  const slider = document.querySelector('.image-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.slide');
  const next = slider.querySelector('.next');
  const prev = slider.querySelector('.prev');
  let currentSlide = 0;
  let slideInterval;
  let isAnimating = false;

  if (!slides.length) {
    console.warn('No slides found in slider');
    return;
  }

  function showSlide(index) {
    if (isAnimating) return;
    isAnimating = true;

    const container = slider.querySelector('.slider-container');
    const slideWidth = slider.offsetWidth;
    
    container.style.transition = 'transform 0.5s ease-out';
    container.style.transform = `translateX(-${index * slideWidth}px)`;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }

  function nextSlide() {
    if (isAnimating) return;
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
    resetInterval();
  }

  function prevSlide() {
    if (isAnimating) return;
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
    resetInterval();
  }

  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  }

  // Initialize slider
  if (next && prev) {
    next.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
    });

    prev.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
    });

    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        nextSlide();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        prevSlide();
      }
    }
  }

  // Start automatic slideshow
  resetInterval();

  // Cleanup
  window.addEventListener('unload', () => {
    clearInterval(slideInterval);
  });

  // Pause on hover
  slider.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });

  slider.addEventListener('mouseleave', () => {
    resetInterval();
  });

  // Initial slide
  showSlide(currentSlide);
}

// Enhanced Form Validation
function initFormValidation() {
  const form = document.querySelector('form');
  if (!form) return;

  const inputs = form.querySelectorAll('input, textarea');
  const errorMessages = {};

  function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let message = '';

    switch(input.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        message = 'Please enter a valid email address';
        break;
      case 'text':
        isValid = value.length >= 2;
        message = 'This field is required (minimum 2 characters)';
        break;
      default:
        isValid = value.length > 0;
        message = 'This field is required';
    }

    if (!isValid) {
      input.setCustomValidity(message);
      errorMessages[input.id] = message;
    } else {
      input.setCustomValidity('');
      delete errorMessages[input.id];
    }

    return isValid;
  }

  inputs.forEach(input => {
    input.addEventListener('input', () => validateInput(input));
    input.addEventListener('blur', () => validateInput(input));
  });

  form.addEventListener('submit', (e) => {
    let isValid = true;
    inputs.forEach(input => {
      if (!validateInput(input)) isValid = false;
    });

    if (!isValid) {
      e.preventDefault();
      const firstError = Object.values(errorMessages)[0];
      alert(firstError);
    }
  });
}

// Optimized Scroll Handlers
const handleScroll = debounce(() => {
  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    backToTopButton.classList.toggle('visible', window.pageYOffset > 300);
  }

  // Update scroll progress
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
  }
}, 100);

// Consolidated Initialization
function initApp() {
  // Initialize all features
  initImageLoading();
  initSlider();
  initFormValidation();
  initThemeToggle();
  initScrollAnimations();
  initBackToTop();
  initFeaturedContent();
  initScrollProgress();
  initEnhancedAnimations();
  initParallax();
  initTypingAnimation();

  // Add scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true });
}

// Single DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', initApp);

// Contact form validation (on contact.html)
function validateForm() {
  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const message = document.querySelector('#message').value.trim();

  if (!name || !email || !message) {
    alert('Please fill out all fields.');
    return false;
  }

  return true;
}

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    });
  }
});

// Theme Toggle Functionality
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Set initial theme based on user preference
  if (localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && prefersDarkScheme.matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
}

// Scroll Animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  animatedElements.forEach(element => observer.observe(element));
}

// Back to Top Button
function initBackToTop() {
  const backToTopButton = document.querySelector('.back-to-top');
  
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });

    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Featured Posts/Quotes
function initFeaturedContent() {
  const quotes = [
    "The best way to predict the future is to create it.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only way to do great work is to love what you do."
  ];

  const featuredSection = document.querySelector('.featured-post');
  if (featuredSection) {
    // Rotate quotes every 5 seconds
    let currentQuoteIndex = 0;
    setInterval(() => {
      currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
      featuredSection.querySelector('p').textContent = quotes[currentQuoteIndex];
      featuredSection.classList.add('fade-in');
      setTimeout(() => featuredSection.classList.remove('fade-in'), 100);
    }, 5000);
  }
}

// Scroll Progress Bar
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
  });
}

// Enhanced Animation Observer
function initEnhancedAnimations() {
  const animatedElements = document.querySelectorAll('.float, .pulse, .shine, .rotate-in, .bounce-in, .slide-up');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.visibility = 'visible';
        entry.target.style.opacity = '1';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  animatedElements.forEach(element => {
    element.style.visibility = 'hidden';
    element.style.opacity = '0';
    observer.observe(element);
  });
}

// Parallax Effect
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}

// Typing Animation
function initTypingAnimation() {
  const typingElements = document.querySelectorAll('.typing-animation');
  
  typingElements.forEach(element => {
    const text = element.textContent;
    element.textContent = '';
    let i = 0;
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, 100);
      }
    }
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        type();
        observer.disconnect();
      }
    });
    
    observer.observe(element);
  });
}
