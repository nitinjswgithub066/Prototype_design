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
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            offset: 100,
            once: true,
            easing: 'ease-in-out'
        });
    }
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

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
                    const offsetTop = target.offsetTop - 80;
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

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Press 'H' to go to home
    if (e.key === 'h' || e.key === 'H') {
        document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Press 'D' to go to dashboard (monitoring section)
    if (e.key === 'd' || e.key === 'D') {
        document.querySelector('#monitoring').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Press 'Escape' to close any open modals or notifications
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            notification.querySelector('.notification-close').click();
        });
    }
});

// Initialize live monitoring simulation
setTimeout(simulateLiveMonitoring, 3000);

// Initialize notifications
setTimeout(initializeNotifications, 10000);

// Initialize performance monitoring
initializePerformanceMonitoring();

// Export functions for potential external use
window.ClassroomMonitoring = {
    showNotification,
    updateMetricsRealTime,
    simulateLiveMonitoring
};

// Console welcome message
console.log(`
🎓 Classroom Monitoring System Initialized
📊 Ministry of Social Justice and Empowerment
🚀 All systems operational
`);

// Add CSS for touch interactions
const touchStyles = document.createElement('style');
touchStyles.textContent = `
    .touch-active {
        transform: scale(0.95) !important;
        transition: transform 0.1s ease !important;
    }
    
    .notification {
        font-family: 'Inter', sans-serif;
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
    }
    
    .notification-close:hover {
        color: #333;
    }
`;
document.head.appendChild(touchStyles);