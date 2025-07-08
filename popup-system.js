/**
 * LifeScribe Website Popup System
 * Responsive, accessible popup component with LifeScribe branding
 * Mobile-optimized with Core Web Vitals performance considerations
 */

class LifeScribePopupSystem {
    constructor() {
        this.config = null;
        this.isInitialized = false;
        this.sessionId = this.getOrCreateSessionId();
        this.apiBase = this.detectApiBase();
        this.currentPopup = null;
        this.displayedPopups = new Set();
        
        // Performance tracking
        this.performanceMetrics = {
            loadStart: Date.now(),
            firstDisplay: null,
            userInteraction: null
        };

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Initialize the popup system
     */
    async init() {
        try {
            console.log('🎯 LifeScribe Popup System: Initializing...');
            
            // Load active popups for current page
            const activePopups = await this.getActivePopups();
            
            if (activePopups.length > 0) {
                // Setup triggers for the first active popup
                const popup = activePopups[0];
                await this.setupPopupTriggers(popup);
            }

            this.isInitialized = true;
            console.log('✅ LifeScribe Popup System: Ready');
            
        } catch (error) {
            console.error('❌ LifeScribe Popup System: Initialization failed', error);
        }
    }

    /**
     * Get active popups for current page
     */
    async getActivePopups() {
        try {
            const deviceType = this.getDeviceType();
            const pageUrl = window.location.href;
            
            const response = await fetch(`${this.apiBase}/api/popup/active?page_url=${encodeURIComponent(pageUrl)}&device_type=${deviceType}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                return data.popups || [];
            } else {
                console.warn('Failed to get active popups:', data.error);
                return [];
            }
        } catch (error) {
            console.error('Error fetching active popups:', error);
            return [];
        }
    }

    /**
     * Setup popup triggers based on configuration
     */
    async setupPopupTriggers(popup) {
        try {
            // Get full popup configuration
            const config = await this.getPopupConfig(popup.id);
            if (!config) return;

            this.config = config;

            // Setup trigger based on type
            switch (config.trigger_type) {
                case 'time':
                    this.setupTimeBasedTrigger(config);
                    break;
                case 'scroll':
                    this.setupScrollBasedTrigger(config);
                    break;
                case 'exit-intent':
                    this.setupExitIntentTrigger(config);
                    break;
                case 'page-load':
                    this.setupPageLoadTrigger(config);
                    break;
                default:
                    console.warn('Unknown trigger type:', config.trigger_type);
            }
        } catch (error) {
            console.error('Error setting up popup triggers:', error);
        }
    }

    /**
     * Get popup configuration with template
     */
    async getPopupConfig(popupId) {
        try {
            const response = await fetch(`${this.apiBase}/api/popup/config/${popupId}?session_id=${this.sessionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                return data.config;
            } else {
                console.warn('Failed to get popup config:', data.error);
                return null;
            }
        } catch (error) {
            console.error('Error fetching popup config:', error);
            return null;
        }
    }

    /**
     * Setup time-based trigger
     */
    setupTimeBasedTrigger(config) {
        const delay = config.trigger_value || 5000; // Default 5 seconds
        
        setTimeout(() => {
            this.showPopup(config);
        }, delay);
    }

    /**
     * Setup scroll-based trigger
     */
    setupScrollBasedTrigger(config) {
        const threshold = config.trigger_value || 50; // Default 50%
        let triggered = false;

        const handleScroll = () => {
            if (triggered) return;

            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent >= threshold) {
                triggered = true;
                this.showPopup(config);
                window.removeEventListener('scroll', handleScroll);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    /**
     * Setup exit-intent trigger
     */
    setupExitIntentTrigger(config) {
        let triggered = false;
        let isMouseOut = false;

        const handleMouseLeave = (e) => {
            if (triggered) return;
            
            // Only trigger if mouse is leaving towards the top of the page
            if (e.clientY <= 0) {
                triggered = true;
                this.showPopup(config);
                document.removeEventListener('mouseleave', handleMouseLeave);
            }
        };

        // Only works on desktop
        if (this.getDeviceType() === 'desktop') {
            document.addEventListener('mouseleave', handleMouseLeave);
        }
    }

    /**
     * Setup page load trigger
     */
    setupPageLoadTrigger(config) {
        // Trigger immediately after page load
        setTimeout(() => {
            this.showPopup(config);
        }, 100);
    }

    /**
     * Show popup with configuration
     */
    async showPopup(config) {
        try {
            // Check if already displayed
            if (this.displayedPopups.has(config.id)) {
                return;
            }

            // Track performance
            if (!this.performanceMetrics.firstDisplay) {
                this.performanceMetrics.firstDisplay = Date.now();
            }

            // Create popup element
            const popupElement = this.createPopupElement(config);
            
            // Add to DOM
            document.body.appendChild(popupElement);
            
            // Mark as displayed
            this.displayedPopups.add(config.id);
            this.currentPopup = {
                id: config.id,
                element: popupElement,
                config: config,
                displayTime: Date.now()
            };

            // Show with animation
            requestAnimationFrame(() => {
                popupElement.classList.add('show');
            });

            // Track impression
            await this.trackEvent('impression', config.id);

            // Setup escape key handler
            this.setupKeyboardHandlers();

            console.log('✅ Popup displayed:', config.name);

        } catch (error) {
            console.error('Error showing popup:', error);
        }
    }

    /**
     * Create popup DOM element
     */
    createPopupElement(config) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'lifescribe-popup-overlay';
        overlay.id = `lifescribe-popup-${config.id}`;

        // Process templates with configuration
        const htmlTemplate = this.processTemplate(config.html_template, config);
        const cssTemplate = this.processTemplate(config.css_template, config);

        // Add CSS
        if (cssTemplate) {
            const style = document.createElement('style');
            style.textContent = cssTemplate;
            document.head.appendChild(style);
        }

        // Set HTML content
        overlay.innerHTML = htmlTemplate;

        // Add event listeners
        this.setupPopupEventListeners(overlay, config);

        return overlay;
    }

    /**
     * Process template with configuration values
     */
    processTemplate(template, config) {
        if (!template) return '';

        return template
            .replace(/{{popup_id}}/g, config.id)
            .replace(/{{title}}/g, config.title || 'Join Our Community')
            .replace(/{{subtitle}}/g, config.subtitle || 'Get exclusive updates and special offers')
            .replace(/{{email_placeholder}}/g, config.email_placeholder || 'Enter your email address')
            .replace(/{{submit_button_text}}/g, config.submit_button_text || 'Get My Discount')
            .replace(/{{privacy_text}}/g, config.privacy_text || 'We respect your privacy. Unsubscribe at any time.')
            .replace(/{{background_color}}/g, config.background_color || '#F9F3E9')
            .replace(/{{text_color}}/g, config.text_color || '#1A5F7A')
            .replace(/{{accent_color}}/g, config.accent_color || '#D4AC0D')
            .replace(/{{border_radius}}/g, config.border_radius || '8');
    }

    /**
     * Setup popup event listeners
     */
    setupPopupEventListeners(overlay, config) {
        // Close button
        const closeButton = overlay.querySelector('.lifescribe-popup-close');
        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.closePopup('close');
            });
        }

        // Form submission
        const form = overlay.querySelector('.lifescribe-popup-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form, config);
            });
        }

        // Overlay click to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closePopup('overlay_click');
            }
        });

        // Touch events for mobile
        this.setupTouchEvents(overlay);
    }

    /**
     * Setup touch events for mobile interaction
     */
    setupTouchEvents(overlay) {
        if (this.getDeviceType() === 'mobile') {
            let startY = 0;
            
            overlay.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY;
            }, { passive: true });

            overlay.addEventListener('touchmove', (e) => {
                const currentY = e.touches[0].clientY;
                const diff = startY - currentY;
                
                // If swiping up significantly, close popup
                if (diff > 100) {
                    this.closePopup('swipe_up');
                }
            }, { passive: true });
        }
    }

    /**
     * Setup keyboard handlers
     */
    setupKeyboardHandlers() {
        const handleKeydown = (e) => {
            if (e.key === 'Escape' && this.currentPopup) {
                this.closePopup('escape_key');
                document.removeEventListener('keydown', handleKeydown);
            }
        };

        document.addEventListener('keydown', handleKeydown);
    }

    /**
     * Handle form submission
     */
    async handleFormSubmission(form, config) {
        try {
            const formData = new FormData(form);
            const email = formData.get('email') || form.querySelector('#lifescribe-email')?.value;

            if (!email) {
                this.showFormError('Email is required');
                return;
            }

            if (!this.isValidEmail(email)) {
                this.showFormError('Please enter a valid email address');
                return;
            }

            // Track user interaction timing
            if (!this.performanceMetrics.userInteraction) {
                this.performanceMetrics.userInteraction = Date.now();
            }

            // Show loading state
            const submitButton = form.querySelector('.lifescribe-popup-submit');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;

            // Submit to API
            const submissionData = {
                email: email,
                popup_id: config.id,
                session_id: this.sessionId,
                page_url: window.location.href,
                user_agent: navigator.userAgent,
                referrer: document.referrer,
                device_type: this.getDeviceType(),
                time_to_action: this.currentPopup ? Date.now() - this.currentPopup.displayTime : 0
            };

            const response = await fetch(`${this.apiBase}/api/popup/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionData)
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccessMessage(result.discount_code);
                setTimeout(() => this.closePopup('success'), 3000);
            } else {
                this.showFormError(result.error || 'Submission failed. Please try again.');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormError('Network error. Please try again.');
            
            const submitButton = form.querySelector('.lifescribe-popup-submit');
            if (submitButton) {
                submitButton.textContent = submitButton.dataset.originalText || 'Try Again';
                submitButton.disabled = false;
            }
        }
    }

    /**
     * Show success message in popup
     */
    showSuccessMessage(discountCode) {
        if (!this.currentPopup) return;

        const content = this.currentPopup.element.querySelector('.lifescribe-popup-content');
        if (content) {
            content.innerHTML = `
                <div class="lifescribe-success-message">
                    <div class="lifescribe-success-icon">✓</div>
                    <h2 class="lifescribe-success-title">Thank You!</h2>
                    <p class="lifescribe-success-text">Your discount code:</p>
                    <div class="lifescribe-discount-code">${discountCode}</div>
                    <p class="lifescribe-success-subtitle">Check your email for details!</p>
                </div>
            `;

            // Add success styles
            const style = document.createElement('style');
            style.textContent = `
                .lifescribe-success-message {
                    text-align: center;
                }
                .lifescribe-success-icon {
                    font-size: 48px;
                    color: #146152;
                    margin-bottom: 20px;
                }
                .lifescribe-success-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 28px;
                    color: #1A5F7A;
                    margin-bottom: 15px;
                }
                .lifescribe-success-text {
                    font-family: 'Inter', sans-serif;
                    color: #5D6D7E;
                    margin-bottom: 10px;
                }
                .lifescribe-discount-code {
                    font-family: 'Inter', sans-serif;
                    font-size: 24px;
                    font-weight: 600;
                    color: #D4AC0D;
                    background: rgba(212, 172, 13, 0.1);
                    padding: 15px 20px;
                    border-radius: 8px;
                    margin: 15px 0;
                    border: 2px dashed #D4AC0D;
                }
                .lifescribe-success-subtitle {
                    font-family: 'Inter', sans-serif;
                    color: #5D6D7E;
                    font-size: 14px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Show form error message
     */
    showFormError(message) {
        // Remove existing error
        const existingError = document.querySelector('.lifescribe-form-error');
        if (existingError) {
            existingError.remove();
        }

        // Create error element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'lifescribe-form-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #7D1935;
            background: rgba(125, 25, 53, 0.1);
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
            font-size: 14px;
            text-align: center;
            border: 1px solid rgba(125, 25, 53, 0.2);
        `;

        // Insert before submit button
        const form = this.currentPopup?.element.querySelector('.lifescribe-popup-form');
        const submitButton = form?.querySelector('.lifescribe-popup-submit');
        if (form && submitButton) {
            form.insertBefore(errorDiv, submitButton);
        }
    }

    /**
     * Close popup with reason
     */
    async closePopup(reason = 'manual') {
        if (!this.currentPopup) return;

        try {
            // Track close event
            await this.trackEvent('close', this.currentPopup.id, {
                close_reason: reason,
                time_displayed: Date.now() - this.currentPopup.displayTime
            });

            // Animate out
            this.currentPopup.element.classList.remove('show');

            // Remove after animation
            setTimeout(() => {
                if (this.currentPopup?.element?.parentNode) {
                    this.currentPopup.element.parentNode.removeChild(this.currentPopup.element);
                }
                this.currentPopup = null;
            }, 300);

        } catch (error) {
            console.error('Error closing popup:', error);
        }
    }

    /**
     * Track analytics event
     */
    async trackEvent(eventType, popupId, additionalData = {}) {
        try {
            const eventData = {
                popup_id: popupId,
                event_type: eventType,
                session_id: this.sessionId,
                page_url: window.location.href,
                user_agent: navigator.userAgent,
                time_on_page: Date.now() - this.performanceMetrics.loadStart,
                scroll_depth: this.getScrollDepth(),
                ...additionalData
            };

            await fetch(`${this.apiBase}/api/popup/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });

        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }

    /**
     * Utility functions
     */
    getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem('lifescribe_popup_session');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('lifescribe_popup_session', sessionId);
        }
        return sessionId;
    }

    detectApiBase() {
        // In development, use localhost:3000, in production use current domain
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
            return 'http://localhost:3000';
        }
        return window.location.origin;
    }

    getDeviceType() {
        const userAgent = navigator.userAgent;
        if (/iPad/.test(userAgent)) return 'tablet';
        if (/Mobile|Android|iPhone/.test(userAgent)) return 'mobile';
        return 'desktop';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getScrollDepth() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        return scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
    }
}

// Auto-initialize when script loads
window.LifeScribePopupSystem = LifeScribePopupSystem;

// Initialize popup system
if (typeof window !== 'undefined') {
    window.lifescribePopups = new LifeScribePopupSystem();
}

// Expose global functions for backward compatibility
window.closeLifeScribePopup = function() {
    if (window.lifescribePopups && window.lifescribePopups.currentPopup) {
        window.lifescribePopups.closePopup('manual');
    }
};

window.submitLifeScribeEmail = function(event) {
    event.preventDefault();
    if (window.lifescribePopups && window.lifescribePopups.currentPopup) {
        const form = event.target;
        window.lifescribePopups.handleFormSubmission(form, window.lifescribePopups.currentPopup.config);
    }
};