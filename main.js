// Main JavaScript File for Classroom Monitoring System
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    // Hide loading spinner after content loads
    setTimeout(() => {
        const loadingSpinner = document.getElementById('loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.style.opacity = '0';
            setTimeout(() => {
                loadingSpinner.style.display = 'none';
            }, 500);
        }
    }, 1500);

    // Initialize all components
    initializeNavigation();
    initializeHeroAnimations();
    initializeCounterAnimations();
    initializeScrollAnimations();
    initializeCharts();
    initializeProgressBars();
    initializeTypingAnimation();
    initializeParallaxEffects();
    initializeResponsiveHandlers();
    initializeZoomHandling();
    
    // Initialize AOS (Animate On Scroll) with responsive settings
    if (typeof AOS !== 'undefined') {
        const isMobile = window.innerWidth <= 768;
        AOS.init({
            duration: isMobile ? 600 : 1000,
            offset: isMobile ? 50 : 100,
            once: true,
            easing: 'ease-in-out',
            disable: function() {
                return window.innerWidth < 480; // Disable on very small screens
            }
        });
    }
}

// Responsive handlers for window resize and orientation change
function initializeResponsiveHandlers() {
    let resizeTimeout;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            handleResponsiveChanges();
        }, 250);
    });
    
    window.addEventListener('orientationchange', function() {
        setTimeout(handleResponsiveChanges, 300);
    });
}

// Handle responsive changes
function handleResponsiveChanges() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    // Update AOS settings
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
    
    // Adjust floating particles performance
    const particles = document.querySelector('.floating-particles');
    if (particles) {
        if (isMobile) {
            particles.style.animationDuration = '40s';
            particles.style.opacity = '0.3';
        } else if (isTablet) {
            particles.style.animationDuration = '30s';
            particles.style.opacity = '0.5';
        } else {
            particles.style.animationDuration = '20s';
            particles.style.opacity = '1';
        }
    }
    
    // Update chart responsiveness
    if (typeof Chart !== 'undefined') {
        Chart.defaults.responsive = true;
        Chart.defaults.maintainAspectRatio = !isMobile;
    }
}

// Zoom level detection and handling
function initializeZoomHandling() {
    function detectZoom() {
        const viewport = window.visualViewport;
        let zoomLevel = 1;
        
        if (viewport) {
            zoomLevel = window.outerWidth / viewport.width;
        } else {
            // Fallback method
            zoomLevel = window.devicePixelRatio || 1;
        }
        
        return Math.round(zoomLevel * 100);
    }
    
    function handleZoomChange() {
        const zoomLevel = detectZoom();
        const body = document.body;
        
        // Add zoom level classes
        body.classList.remove('zoom-high', 'zoom-medium', 'zoom-normal');
        
        if (zoomLevel >= 150) {
            body.classList.add('zoom-high');
        } else if (zoomLevel >= 110) {
            body.classList.add('zoom-medium');
        } else {
            body.classList.add('zoom-normal');
        }
        
        // Adjust performance based on zoom
        const particles = document.querySelector('.floating-particles');
        if (particles && zoomLevel > 125) {
            particles.style.animationPlayState = 'paused';
        } else if (particles) {
            particles.style.animationPlayState = 'running';
        }
    }
    
    // Initial zoom detection
    handleZoomChange();
    
    // Monitor for zoom changes
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleZoomChange);
    } else {
        // Fallback for older browsers
        window.addEventListener('resize', handleZoomChange);
    }
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navbarHeight = navbar.offsetHeight;
                    const offsetTop = target.offsetTop - navbarHeight - 20;
                    
                    // Close mobile menu if open
                    if (navbarCollapse.classList.contains('show')) {
                        navbarToggler.click();
                    }
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Active nav link highlighting
    window.addEventListener('scroll', highlightActiveNavLink);
    
    // Enhanced mobile menu handling
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }
}

// Enhanced mobile touch interactions
function initializeTouchInteractions() {
    if ('ontouchstart' in window) {
        const touchElements = document.querySelectorAll('.feature-card, .contact-card, .analytics-card, .btn');
        
        touchElements.forEach(element => {
            let touchStartY = 0;
            let touchStartTime = 0;
            
            element.addEventListener('touchstart', function(e) {
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
                this.classList.add('touch-active');
            }, { passive: true });
            
            element.addEventListener('touchmove', function(e) {
                const touchY = e.touches[0].clientY;
                const deltaY = Math.abs(touchY - touchStartY);
                
                // If user is scrolling, remove touch state
                if (deltaY > 10) {
                    this.classList.remove('touch-active');
                }
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                const touchDuration = Date.now() - touchStartTime;
                
                // Add a slight delay for visual feedback
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, touchDuration < 150 ? 100 : 0);
            });
            
            // Handle touch cancellation
            element.addEventListener('touchcancel', function() {
                this.classList.remove('touch-active');
            });
        });
    }
}

// Highlight active navigation link based on scroll position
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
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

// Hero section animations
function initializeHeroAnimations() {
    // Floating particles animation
    createFloatingParticles();
    
    // Hero buttons hover effects
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
}

// Create floating particles effect
function createFloatingParticles() {
    const particlesContainer = document.querySelector('.floating-particles');
    if (!particlesContainer) return;

    // Add additional dynamic particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }

    // Add floating particle keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% { transform: translateY(100vh) translateX(0px) scale(0); opacity: 0; }
            10% { opacity: 1; transform: scale(1); }
            90% { opacity: 1; }
            100% { transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px) scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Counter animations for statistics
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Animate counter numbers
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// Typing animation for hero text
function initializeTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const words = ['Monitoring System', 'Analysis Platform', 'Quality Assurance', 'Smart Solution'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const originalText = typingElement.textContent;

    function typeAnimation() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause before deleting
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeAnimation, typeSpeed);
    }

    // Start typing animation after initial delay
    setTimeout(() => {
        typingElement.textContent = '';
        typeAnimation();
    }, 2000);
}

// Initialize progress bar animations
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateProgressBar(entry.target);
            }
        });
    }, observerOptions);

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// Animate progress bars
function animateProgressBar(progressBar) {
    const targetWidth = progressBar.style.width;
    progressBar.style.width = '0%';
    
    setTimeout(() => {
        progressBar.style.transition = 'width 1.5s ease-out';
        progressBar.style.width = targetWidth;
    }, 200);
}

// Initialize charts
function initializeCharts() {
    createTrendChart();
    updateMetricsRealTime();
}

// Create trend analysis chart
function createTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx || typeof Chart === 'undefined') return;

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Student Engagement',
            data: [65, 70, 75, 82, 78, 85],
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
        }, {
            label: 'Training Quality',
            data: [70, 75, 80, 85, 88, 90],
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
        }, {
            label: 'Infrastructure Score',
            data: [80, 82, 78, 85, 90, 92],
            borderColor: '#ffc107',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#666'
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: '#e9ecef'
                },
                ticks: {
                    color: '#666',
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        },
        elements: {
            point: {
                radius: 6,
                hoverRadius: 8,
                backgroundColor: '#fff',
                borderWidth: 2
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
}

// Real-time metrics simulation
function updateMetricsRealTime() {
    const metrics = document.querySelectorAll('.metric-value');
    
    setInterval(() => {
        metrics.forEach(metric => {
            const currentValue = parseInt(metric.textContent);
            const variation = Math.random() * 4 - 2; // Random variation between -2 and +2
            const newValue = Math.max(0, Math.min(100, currentValue + variation));
            
            // Add smooth transition
            metric.style.transition = 'all 0.3s ease';
            metric.textContent = Math.round(newValue) + '%';
            
            // Update color based on value
            updateMetricColor(metric, newValue);
        });
    }, 5000); // Update every 5 seconds
}

// Update metric color based on value
function updateMetricColor(element, value) {
    element.classList.remove('excellent', 'good', 'warning');
    
    if (value >= 90) {
        element.classList.add('excellent');
    } else if (value >= 75) {
        element.classList.add('good');
    } else {
        element.classList.add('warning');
    }
}

// Scroll animations and effects
function initializeScrollAnimations() {
    // Feature cards hover effect
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Contact cards animation
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.contact-icon');
            icon.style.transform = 'rotate(360deg) scale(1.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.contact-icon');
            icon.style.transform = 'rotate(0deg) scale(1)';
        });
    });

    // Flag items animation
    const flagItems = document.querySelectorAll('.flag-item');
    flagItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('animate__animated', 'animate__fadeInUp');
    });
}

// Parallax effects
function initializeParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Hero parallax effect
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        // Floating cards parallax
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            const speed = 0.1 + (index * 0.05);
            card.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Live data simulation for monitoring
function simulateLiveMonitoring() {
    const detectionBoxes = document.querySelectorAll('.detection-box');
    const activities = [
        'Student Engagement: 85%',
        'Instructor Activity: Teaching',
        'Training Quality: Good',
        'Classroom Attendance: 92%',
        'Interactive Session: Active',
        'Equipment Status: Functional'
    ];

    setInterval(() => {
        detectionBoxes.forEach((box, index) => {
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            box.textContent = randomActivity;
            
            // Add glowing effect
            box.style.boxShadow = '0 0 20px rgba(0, 123, 255, 0.5)';
            setTimeout(() => {
                box.style.boxShadow = 'none';
            }, 1000);
        });
    }, 3000);
}

// Initialize notification system
function initializeNotifications() {
    // Simulate new alerts
    setInterval(() => {
        showNotification('New monitoring alert', 'Institution #234 requires attention', 'warning');
    }, 30000); // Every 30 seconds
}

// Show notification
function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <strong>${title}</strong>
            <p>${message}</p>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        padding: 20px;
        max-width: 300px;
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        border-left: 4px solid ${type === 'warning' ? '#ffc107' : '#007bff'};
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }
    }, 5000);
}

// Performance monitoring
function initializePerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
        
        // Show performance notification if load time is slow
        if (loadTime > 3000) {
            showNotification('Performance Alert', 'Page load time is slower than expected', 'warning');
        }
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could implement error reporting here
});

// Mobile touch interactions
function initializeTouchInteractions() {
    if ('ontouchstart' in window) {
        const touchElements = document.querySelectorAll('.feature-card, .contact-card, .analytics-card');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
        });
    }
}

// Initialize all touch interactions
initializeTouchInteractions();

// Enhanced keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Press 'H' to go to home
    if ((e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Press 'D' to go to dashboard (monitoring section)
    if ((e.key === 'd' || e.key === 'D') && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        document.querySelector('#monitoring').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Press 'F' to go to features
    if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        document.querySelector('#features').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Press 'Escape' to close any open modals or notifications
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            const closeBtn = notification.querySelector('.notification-close');
            if (closeBtn) closeBtn.click();
        });
        
        // Close mobile menu if open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarCollapse && navbarCollapse.classList.contains('show') && navbarToggler) {
            navbarToggler.click();
        }
    }
});

// Initialize live monitoring simulation
setTimeout(simulateLiveMonitoring, 3000);

// Initialize notifications
setTimeout(initializeNotifications, 10000);

// Initialize performance monitoring
initializePerformanceMonitoring();

// Enhanced error handling with user feedback
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Show user-friendly error notification for critical errors
    if (e.error && e.error.stack && e.error.stack.includes('Chart')) {
        showNotification('Display Issue', 'Some charts may not display correctly. Please refresh the page.', 'warning');
    }
});

// Handle promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    e.preventDefault(); // Prevent default browser behavior
});

// Service Worker registration for better performance (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Register service worker if one exists
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            console.log('Service Worker check completed');
        });
    });
}

// Export functions for potential external use
window.ClassroomMonitoring = {
    showNotification,
    updateMetricsRealTime,
    simulateLiveMonitoring,
    handleResponsiveChanges,
    initializeTouchInteractions
};

// Console welcome message with system info
console.log(`
🎓 Classroom Monitoring System Initialized
📊 Ministry of Social Justice and Empowerment
🚀 All systems operational
📱 Responsive: ${window.innerWidth <= 768 ? 'Mobile' : 'Desktop'} mode
🔍 Zoom level: ${Math.round((window.outerWidth / window.innerWidth) * 100)}%
⚡ Performance: High
`);

// Add enhanced CSS for improved touch interactions and zoom handling
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    /* Enhanced touch interactions */
    .touch-active {
        transform: scale(0.95) !important;
        transition: transform 0.1s ease !important;
        opacity: 0.8;
    }
    
    /* Zoom-specific styles */
    .zoom-high .floating-particles {
        animation: none !important;
        display: none;
    }
    
    .zoom-high .feature-card {
        transition: none !important;
    }
    
    .zoom-medium .floating-particles {
        animation-duration: 60s !important;
        opacity: 0.3 !important;
    }
    
    /* Improved notification styles */
    .notification {
        font-family: 'Inter', sans-serif;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .notification-content strong {
        color: #333;
        font-size: 1rem;
        margin-bottom: 5px;
        display: block;
    }
    
    .notification-content p {
        color: #666;
        font-size: 0.9rem;
        margin: 0;
        line-height: 1.4;
    }
    
    .notification-close {
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #999;
        cursor: pointer;
        line-height: 1;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    }
    
    .notification-close:hover {
        color: #333;
        background: rgba(0, 0, 0, 0.1);
    }
    
    /* Loading improvements */
    .loading-overlay {
        backdrop-filter: blur(5px);
    }
    
    /* Better focus indicators */
    .btn:focus-visible,
    .nav-link:focus-visible,
    .navbar-toggler:focus-visible {
        outline: 3px solid #007bff;
        outline-offset: 3px;
        box-shadow: none;
    }
    
    /* Mobile-specific improvements */
    @media (max-width: 768px) {
        .btn {
            min-height: 48px; /* Larger touch targets on mobile */
            font-size: 1rem;
        }
        
        .navbar-nav .nav-link {
            min-height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .notification {
            max-width: calc(100vw - 20px);
            left: 10px;
            right: 10px;
            margin: 0 auto;
        }
    }
    
    /* High contrast improvements */
    @media (prefers-contrast: high) {
        .notification {
            border: 2px solid #000;
            background: #fff;
            color: #000;
        }
        
        .btn-primary {
            background: #0000ff;
            border-color: #0000ff;
            color: #fff;
        }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        .touch-active {
            transform: none !important;
            opacity: 0.9;
        }
        
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
`;
document.head.appendChild(enhancedStyles);