// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initThemeSwitcher();
    initNavbar();
    initSmoothScrolling();
    initScrollAnimations();
    initTypingEffect();
    initSkillsAnimation();
    initProjectsFilter();
    initBlogFilter();
    initContactForm();
});

// Theme Switcher functionality
function initThemeSwitcher() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;
    
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme on page load
    setTheme(savedTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        setTheme(newTheme);
        
        // Add click animation
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Function to set theme
    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme icon with animation
        themeIcon.style.transform = 'rotate(180deg)';
        
        setTimeout(() => {
            if (theme === 'dark') {
                themeIcon.className = 'fas fa-sun';
            } else {
                themeIcon.className = 'fas fa-moon';
            }
            themeIcon.style.transform = 'rotate(0deg)';
        }, 150);
        
        // Update meta theme-color for mobile browsers
        updateMetaThemeColor(theme);
        
        // Trigger custom event for theme change
        const themeChangeEvent = new CustomEvent('themeChanged', {
            detail: { theme: theme }
        });
        document.dispatchEvent(themeChangeEvent);
    }
    
    // Update meta theme-color for mobile browsers
    function updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        if (theme === 'dark') {
            metaThemeColor.content = '#0f172a';
        } else {
            metaThemeColor.content = '#6366f1';
        }
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Only apply system theme if no saved preference exists
        if (!localStorage.getItem('theme')) {
            setTheme(mediaQuery.matches ? 'dark' : 'light');
        }
        
        // Listen for changes in system theme preference
        mediaQuery.addEventListener('change', function(e) {
            // Only apply system theme if no saved preference exists
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    // Keyboard accessibility for theme toggle
    themeToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
}

// Navbar functionality
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Mobile menu close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.skill-category, .education-card, .project-card, .about-content, .about-image, .certification-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'all 0.6s ease-out';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
}

// Typing effect for hero subtitle
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    const text = 'Aspiring MERN Stack Developer';
    let index = 0;
    
    subtitle.textContent = '';
    
    function typeWriter() {
        if (index < text.length) {
            subtitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 100);
        } else {
            // Add blinking cursor effect
            subtitle.innerHTML += '<span class="cursor">|</span>';
            
            // Add CSS for cursor animation
            const style = document.createElement('style');
            style.textContent = `
                .cursor {
                    animation: blink 1s infinite;
                }
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Start typing effect after a delay
    setTimeout(typeWriter, 1000);
}

// Skills section animation
function initSkillsAnimation() {
    const skillCategories = document.querySelectorAll('.skill-category');
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillsObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    entry.target.style.transition = 'all 0.6s ease-out';
                    
                    // Animate skill bars within this category
                    const categoryBars = entry.target.querySelectorAll('.skill-progress');
                    categoryBars.forEach((bar, barIndex) => {
                        setTimeout(() => {
                            const width = bar.getAttribute('data-width');
                            bar.style.width = width;
                        }, barIndex * 200);
                    });
                }, index * 200); // Stagger animation
            }
        });
    }, { threshold: 0.1 });
    
    skillCategories.forEach(category => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px) scale(0.9)';
        skillsObserver.observe(category);
    });
    
    // Initialize skill bars with 0 width
    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });
}

// Projects filter functionality (for future expansion)
function initProjectsFilter() {
    const projectCards = document.querySelectorAll('.project-card');
    
    // Add hover effects
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Blog filter functionality
function initBlogFilter() {
    const filterButtons = document.querySelectorAll('.blog-filter-btn');
    const blogPosts = document.querySelectorAll('.blog-post');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    // Blog filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter blog posts
            blogPosts.forEach(post => {
                const category = post.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    post.style.display = 'block';
                    post.style.opacity = '0';
                    post.style.transform = 'translateY(20px)';
                    
                    // Animate in
                    setTimeout(() => {
                        post.style.opacity = '1';
                        post.style.transform = 'translateY(0)';
                        post.style.transition = 'all 0.4s ease';
                    }, 100);
                } else {
                    post.style.opacity = '0';
                    post.style.transform = 'translateY(-20px)';
                    post.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        post.style.display = 'none';
                    }, 300);
                }
            });
            
            // Add click animation to button
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Newsletter form functionality
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('.btn');
            const originalText = submitBtn.textContent;
            
            // Basic email validation
            const email = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(email)) {
                emailInput.style.borderColor = '#dc3545';
                emailInput.focus();
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            
            // Simulate subscription (replace with actual API call)
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                submitBtn.style.background = '#28a745';
                emailInput.value = '';
                emailInput.style.borderColor = '';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }
    
    // Blog post hover effects
    blogPosts.forEach(post => {
        post.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        post.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Recent posts hover effects
    const recentPostItems = document.querySelectorAll('.recent-post-item');
    recentPostItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Category items hover effects
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Tag cloud hover effects
    const tagItems = document.querySelectorAll('.tag-item');
    tagItems.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.transition = 'all 0.3s ease';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Initialize blog posts animation on scroll
    const blogObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'all 0.6s ease-out';
            }
        });
    }, { threshold: 0.1 });
    
    blogPosts.forEach(post => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(30px)';
        blogObserver.observe(post);
    });
    
    // Sidebar widgets animation
    const sidebarWidgets = document.querySelectorAll('.sidebar-widget');
    sidebarWidgets.forEach((widget, index) => {
        widget.style.opacity = '0';
        widget.style.transform = 'translateX(30px)';
        
        setTimeout(() => {
            widget.style.opacity = '1';
            widget.style.transform = 'translateX(0)';
            widget.style.transition = 'all 0.6s ease-out';
        }, index * 200);
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Contact link animations
    const contactLinks = document.querySelectorAll('.contact-link, .social-link-item');
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    if (!contactForm) return;
    
    // Form validation
    function validateForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const value = field.value.trim();
            const fieldContainer = field.closest('.form-group') || field.closest('.form-check');
            
            // Remove existing validation classes
            field.classList.remove('is-valid', 'is-invalid');
            
            if (!value) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                // Additional validation for specific fields
                if (field.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        field.classList.add('is-invalid');
                        isValid = false;
                    } else {
                        field.classList.add('is-valid');
                    }
                } else if (field.name === 'firstName' || field.name === 'lastName') {
                    if (value.length < 2) {
                        field.classList.add('is-invalid');
                        isValid = false;
                    } else {
                        field.classList.add('is-valid');
                    }
                } else if (field.name === 'message') {
                    if (value.length < 10) {
                        field.classList.add('is-invalid');
                        isValid = false;
                    } else {
                        field.classList.add('is-valid');
                    }
                } else {
                    field.classList.add('is-valid');
                }
            }
        });
        
        // Phone number validation (optional field)
        const phoneField = document.getElementById('phone');
        if (phoneField && phoneField.value.trim()) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(phoneField.value.trim().replace(/[\s\-\(\)]/g, ''))) {
                phoneField.classList.add('is-invalid');
                isValid = false;
            } else {
                phoneField.classList.add('is-valid');
            }
        }
        
        return isValid;
    }
    
    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') || (this.value && this.value.trim())) {
                validateForm();
            }
        });
        
        input.addEventListener('input', function() {
            // Remove invalid class on input
            if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
            }
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Hide previous messages
        successMessage.classList.add('d-none');
        errorMessage.classList.add('d-none');
        
        // Validate form
        if (!validateForm()) {
            // Scroll to first invalid field
            const firstInvalid = contactForm.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.classList.add('d-none');
        btnLoading.classList.remove('d-none');
        
        try {
            // Simulate form submission (replace with actual API call)
            await simulateFormSubmission();
            
            // Show success message
            successMessage.classList.remove('d-none');
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Reset form
            contactForm.reset();
            
            // Remove validation classes
            formInputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Show error message
            errorMessage.classList.remove('d-none');
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.classList.remove('d-none');
            btnLoading.classList.add('d-none');
        }
    });
    
    // Simulate form submission (replace with actual backend integration)
    async function simulateFormSubmission() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% success rate for demo)
                if (Math.random() > 0.1) {
                    resolve({ success: true, message: 'Message sent successfully' });
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 2000); // 2 second delay to show loading state
        });
    }
    
    // Auto-hide messages after 10 seconds
    function autoHideMessage(element) {
        setTimeout(() => {
            if (!element.classList.contains('d-none')) {
                element.classList.add('d-none');
            }
        }, 10000);
    }
    
    // Watch for message visibility changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if ((target === successMessage || target === errorMessage) && 
                    !target.classList.contains('d-none')) {
                    autoHideMessage(target);
                }
            }
        });
    });
    
    observer.observe(successMessage, { attributes: true });
    observer.observe(errorMessage, { attributes: true });
}

// Utility function to add loading animation
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.remove();
    }
}

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    const floatingCard = document.querySelector('.floating-card');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    if (floatingCard) {
        floatingCard.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Add scroll-to-top button
function addScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--gradient-primary);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = 'var(--shadow-heavy)';
    });
    
    scrollButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'var(--shadow-medium)';
    });
}

// Initialize scroll-to-top button
addScrollToTopButton();

// Add dynamic year to footer
function updateFooterYear() {
    const footer = document.querySelector('.footer p');
    if (footer) {
        const currentYear = new Date().getFullYear();
        footer.textContent = `© ${currentYear} Asgar Ali. All rights reserved.`;
    }
}

updateFooterYear();

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add loading screen
window.addEventListener('load', function() {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--dark-color);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    loadingScreen.innerHTML = `
        <div class="loading-content text-center">
            <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-white">Loading Portfolio...</p>
        </div>
    `;
    
    document.body.appendChild(loadingScreen);
    
    // Hide loading screen after content is loaded
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 1000);
});

// Add custom cursor effect (optional enhancement)
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        opacity: 0;
    `;
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.opacity = '0.7';
    });
    
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '0.7';
    });
    
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
    });
    
    // Scale cursor on hover over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.style.transform = 'scale(1.5)';
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// Uncomment to enable custom cursor
// initCustomCursor();