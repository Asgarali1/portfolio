// Analytics and Performance Monitoring System
// Portfolio Website Analytics - Asgar Ali

class PortfolioAnalytics {
    constructor() {
        this.startTime = performance.now();
        this.interactions = [];
        this.performanceMetrics = {};
        this.init();
    }

    init() {
        this.setupGoogleAnalytics();
        this.trackPageLoad();
        this.trackUserInteractions();
        this.trackPerformanceMetrics();
        this.trackScrollBehavior();
        this.trackSectionViews();
        this.setupErrorTracking();
    }

    // Google Analytics Setup and Custom Events
    setupGoogleAnalytics() {
        // Custom event tracking for portfolio interactions
        this.trackEvent = (action, category, label, value) => {
            if (typeof gtag !== 'undefined') {
                gtag('event', action, {
                    event_category: category,
                    event_label: label,
                    value: value
                });
            }
        };
    }

    // Track page load performance
    trackPageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.startTime;
            
            // Track load time
            this.trackEvent('page_load_time', 'Performance', 'Load Time', Math.round(loadTime));
            
            // Track navigation timing
            if (performance.getEntriesByType) {
                const navTiming = performance.getEntriesByType('navigation')[0];
                if (navTiming) {
                    this.performanceMetrics = {
                        domContentLoaded: Math.round(navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart),
                        loadComplete: Math.round(navTiming.loadEventEnd - navTiming.loadEventStart),
                        firstPaint: this.getFirstPaint(),
                        firstContentfulPaint: this.getFirstContentfulPaint()
                    };
                    
                    // Send performance metrics to analytics
                    Object.entries(this.performanceMetrics).forEach(([metric, value]) => {
                        if (value > 0) {
                            this.trackEvent(metric, 'Performance', metric, value);
                        }
                    });
                }
            }
        });
    }

    // Get First Paint timing
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? Math.round(firstPaint.startTime) : 0;
    }

    // Get First Contentful Paint timing
    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return firstContentfulPaint ? Math.round(firstContentfulPaint.startTime) : 0;
    }

    // Track user interactions
    trackUserInteractions() {
        // Track navigation clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const section = e.target.getAttribute('href').replace('#', '');
                this.trackEvent('navigation_click', 'User Interaction', section);
                this.interactions.push({
                    type: 'navigation',
                    section: section,
                    timestamp: Date.now()
                });
            });
        });

        // Track social media clicks
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const platform = this.getSocialPlatform(link.href);
                this.trackEvent('social_click', 'User Interaction', platform);
                this.interactions.push({
                    type: 'social',
                    platform: platform,
                    timestamp: Date.now()
                });
            });
        });

        // Track project link clicks
        document.querySelectorAll('.project-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                const linkType = link.textContent.includes('Demo') ? 'live_demo' : 'repository';
                const projectTitle = link.closest('.project-card').querySelector('h4').textContent;
                this.trackEvent('project_click', 'User Interaction', `${projectTitle} - ${linkType}`);
                this.interactions.push({
                    type: 'project',
                    project: projectTitle,
                    linkType: linkType,
                    timestamp: Date.now()
                });
            });
        });

        // Track contact button clicks
        document.querySelectorAll('.hero-buttons a, .contact-links a').forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonText = e.target.textContent.trim();
                this.trackEvent('cta_click', 'User Interaction', buttonText);
                this.interactions.push({
                    type: 'cta',
                    button: buttonText,
                    timestamp: Date.now()
                });
            });
        });

        // Track theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.body.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                this.trackEvent('theme_change', 'User Interaction', newTheme);
                this.interactions.push({
                    type: 'theme',
                    theme: newTheme,
                    timestamp: Date.now()
                });
            });
        }
    }

    // Get social media platform from URL
    getSocialPlatform(url) {
        if (url.includes('linkedin')) return 'LinkedIn';
        if (url.includes('github')) return 'GitHub';
        if (url.includes('codechef')) return 'CodeChef';
        return 'Unknown';
    }

    // Track scroll behavior and section views
    trackScrollBehavior() {
        let scrollTimeout;
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            maxScroll = Math.max(maxScroll, scrollPercent);
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.trackEvent('scroll_depth', 'User Behavior', 'Max Scroll Percentage', maxScroll);
            }, 1000);
        });
    }

    // Track section views using Intersection Observer
    trackSectionViews() {
        const sections = document.querySelectorAll('section[id]');
        const sectionViews = new Map();
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const sectionId = entry.target.id;
                    if (!sectionViews.has(sectionId)) {
                        sectionViews.set(sectionId, Date.now());
                        this.trackEvent('section_view', 'User Behavior', sectionId);
                        this.interactions.push({
                            type: 'section_view',
                            section: sectionId,
                            timestamp: Date.now()
                        });
                    }
                }
            });
        }, {
            threshold: 0.5
        });

        sections.forEach(section => observer.observe(section));
    }

    // Track performance metrics continuously
    trackPerformanceMetrics() {
        // Track memory usage if available
        if (performance.memory) {
            setInterval(() => {
                const memoryInfo = {
                    usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
                    totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
                    jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
                };
                
                // Only track if memory usage is significant
                if (memoryInfo.usedJSHeapSize > 10) {
                    this.trackEvent('memory_usage', 'Performance', 'Used JS Heap Size (MB)', memoryInfo.usedJSHeapSize);
                }
            }, 30000); // Every 30 seconds
        }

        // Track long tasks if available
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (entry.duration > 50) { // Tasks longer than 50ms
                            this.trackEvent('long_task', 'Performance', 'Task Duration', Math.round(entry.duration));
                        }
                    });
                });
                observer.observe({entryTypes: ['longtask']});
            } catch (e) {
                console.log('Long task observer not supported');
            }
        }
    }

    // Error tracking
    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            this.trackEvent('javascript_error', 'Error', event.message, 1);
            console.error('Tracked JS Error:', event.message);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.trackEvent('promise_rejection', 'Error', event.reason, 1);
            console.error('Tracked Promise Rejection:', event.reason);
        });
    }

    // Get analytics summary
    getAnalyticsSummary() {
        return {
            performanceMetrics: this.performanceMetrics,
            totalInteractions: this.interactions.length,
            interactionTypes: this.getInteractionSummary(),
            sessionDuration: Date.now() - this.startTime
        };
    }

    // Get interaction summary
    getInteractionSummary() {
        const summary = {};
        this.interactions.forEach(interaction => {
            summary[interaction.type] = (summary[interaction.type] || 0) + 1;
        });
        return summary;
    }

    // Send custom conversion events
    trackConversion(type, value) {
        this.trackEvent('conversion', 'Conversion', type, value);
        
        // Track specific portfolio conversions
        if (type === 'contact_attempt') {
            this.trackEvent('contact_attempt', 'Lead Generation', 'Contact Form', 1);
        } else if (type === 'project_engagement') {
            this.trackEvent('project_engagement', 'Portfolio Engagement', 'Project View', 1);
        } else if (type === 'resume_download') {
            this.trackEvent('resume_download', 'Lead Generation', 'Resume Download', 1);
        }
    }

    // Track time spent on page before leaving
    trackPageExit() {
        window.addEventListener('beforeunload', () => {
            const sessionDuration = Date.now() - this.startTime;
            this.trackEvent('session_duration', 'User Behavior', 'Time on Site', Math.round(sessionDuration / 1000));
        });
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioAnalytics = new PortfolioAnalytics();
    
    // Track page exit
    window.portfolioAnalytics.trackPageExit();
    
    // Expose analytics summary to console for debugging
    window.getAnalyticsSummary = () => {
        console.log('Portfolio Analytics Summary:', window.portfolioAnalytics.getAnalyticsSummary());
    };
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioAnalytics;
}