/**
 * ADB-IO Student Portal - Dashboard Cards Component
 * Green Computing: Efficient dashboard cards with minimal resource usage
 */

export class DashboardCards {
    constructor(container, apiClient) {
        this.container = container;
        this.apiClient = apiClient;
        this.cards = new Map();
        this.animationQueue = [];
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setupContainer();
        this.createDefaultCards();
        this.setupEventListeners();
    }

    setupContainer() {
        if (this.container) {
            this.container.className = 'dashboard-cards-container';
        }
    }

    createDefaultCards() {
        const defaultCards = [
            {
                id: 'courses',
                title: 'Enrolled Courses',
                icon: '📚',
                value: 0,
                type: 'number',
                color: 'primary',
                description: 'Active courses'
            },
            {
                id: 'assignments',
                title: 'Pending Assignments',
                icon: '📝',
                value: 0,
                type: 'number',
                color: 'warning',
                description: 'Due soon'
            },
            {
                id: 'progress',
                title: 'Overall Progress',
                icon: '📊',
                value: 0,
                type: 'percentage',
                color: 'success',
                description: 'Completion rate'
            },
            {
                id: 'streak',
                title: 'Study Streak',
                icon: '🔥',
                value: 0,
                type: 'number',
                color: 'accent',
                description: 'Days in a row'
            }
        ];

        defaultCards.forEach(cardConfig => {
            this.createCard(cardConfig);
        });
    }

    createCard(config) {
        const card = document.createElement('div');
        card.className = `dashboard-card dashboard-card--${config.color}`;
        card.setAttribute('data-card-id', config.id);
        
        card.innerHTML = `
            <div class="dashboard-card__header">
                <div class="dashboard-card__icon">${config.icon}</div>
                <div class="dashboard-card__actions">
                    <button class="dashboard-card__refresh" title="Refresh" data-action="refresh">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <polyline points="1 20 1 14 7 14"></polyline>
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="dashboard-card__content">
                <div class="dashboard-card__value" data-value="${config.value}">
                    ${this.formatValue(config.value, config.type)}
                </div>
                <div class="dashboard-card__title">${config.title}</div>
                <div class="dashboard-card__description">${config.description}</div>
            </div>
            
            <div class="dashboard-card__footer">
                <div class="dashboard-card__trend" data-trend="neutral">
                    <span class="trend-icon">→</span>
                    <span class="trend-text">No change</span>
                </div>
            </div>
        `;

        // Add click handler for card interaction
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.dashboard-card__actions')) {
                this.handleCardClick(config.id);
            }
        });

        // Add refresh handler
        const refreshBtn = card.querySelector('[data-action="refresh"]');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.refreshCard(config.id);
            });
        }

        this.container.appendChild(card);
        this.cards.set(config.id, { element: card, config });

        // Animate card entrance
        this.animateCardEntrance(card);

        return card;
    }

    updateCard(cardId, data) {
        const card = this.cards.get(cardId);
        if (!card) return;

        const { element, config } = card;
        const valueElement = element.querySelector('.dashboard-card__value');
        const trendElement = element.querySelector('.dashboard-card__trend');

        if (valueElement && data.value !== undefined) {
            const oldValue = parseFloat(valueElement.getAttribute('data-value')) || 0;
            const newValue = data.value;
            
            // Animate value change
            this.animateValueChange(valueElement, oldValue, newValue, config.type);
            
            // Update trend
            if (trendElement && oldValue !== newValue) {
                this.updateTrend(trendElement, oldValue, newValue);
            }
        }

        // Update other properties
        if (data.title) {
            const titleElement = element.querySelector('.dashboard-card__title');
            if (titleElement) titleElement.textContent = data.title;
        }

        if (data.description) {
            const descElement = element.querySelector('.dashboard-card__description');
            if (descElement) descElement.textContent = data.description;
        }

        if (data.color && data.color !== config.color) {
            element.className = element.className.replace(
                `dashboard-card--${config.color}`,
                `dashboard-card--${data.color}`
            );
            config.color = data.color;
        }
    }

    updateMultipleCards(updates) {
        // Batch update multiple cards for better performance
        Object.entries(updates).forEach(([cardId, data]) => {
            this.updateCard(cardId, data);
        });
    }

    formatValue(value, type) {
        switch (type) {
            case 'percentage':
                return `${Math.round(value)}%`;
            case 'currency':
                return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                }).format(value);
            case 'number':
                return new Intl.NumberFormat('id-ID').format(value);
            case 'time':
                return this.formatTime(value);
            default:
                return value.toString();
        }
    }

    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    }

    animateValueChange(element, oldValue, newValue, type) {
        const duration = 1000; // 1 second
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = oldValue + (newValue - oldValue) * easeOut;
            element.textContent = this.formatValue(currentValue, type);
            element.setAttribute('data-value', currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = this.formatValue(newValue, type);
                element.setAttribute('data-value', newValue);
            }
        };
        
        requestAnimationFrame(animate);
    }

    updateTrend(trendElement, oldValue, newValue) {
        const difference = newValue - oldValue;
        const percentChange = oldValue !== 0 ? (difference / oldValue) * 100 : 0;
        
        let trendClass, trendIcon, trendText;
        
        if (difference > 0) {
            trendClass = 'trend-up';
            trendIcon = '↗';
            trendText = `+${Math.abs(percentChange).toFixed(1)}%`;
        } else if (difference < 0) {
            trendClass = 'trend-down';
            trendIcon = '↘';
            trendText = `-${Math.abs(percentChange).toFixed(1)}%`;
        } else {
            trendClass = 'trend-neutral';
            trendIcon = '→';
            trendText = 'No change';
        }
        
        trendElement.className = `dashboard-card__trend ${trendClass}`;
        trendElement.setAttribute('data-trend', trendClass.replace('trend-', ''));
        
        const iconElement = trendElement.querySelector('.trend-icon');
        const textElement = trendElement.querySelector('.trend-text');
        
        if (iconElement) iconElement.textContent = trendIcon;
        if (textElement) textElement.textContent = trendText;
    }

    animateCardEntrance(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // Use intersection observer for performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(card);
    }

    handleCardClick(cardId) {
        // Emit custom event for card interaction
        const event = new CustomEvent('cardClick', {
            detail: { cardId }
        });
        
        this.container.dispatchEvent(event);
        
        // Add visual feedback
        const card = this.cards.get(cardId);
        if (card) {
            this.addClickFeedback(card.element);
        }
    }

    addClickFeedback(element) {
        element.classList.add('dashboard-card--clicked');
        setTimeout(() => {
            element.classList.remove('dashboard-card--clicked');
        }, 200);
    }

    async refreshCard(cardId) {
        const card = this.cards.get(cardId);
        if (!card) return;

        const refreshBtn = card.element.querySelector('[data-action="refresh"]');
        if (refreshBtn) {
            refreshBtn.classList.add('refreshing');
        }

        try {
            // Emit refresh event
            const event = new CustomEvent('cardRefresh', {
                detail: { cardId }
            });
            this.container.dispatchEvent(event);
            
            // Simulate loading time
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.error('Failed to refresh card:', error);
        } finally {
            if (refreshBtn) {
                refreshBtn.classList.remove('refreshing');
            }
        }
    }

    setupEventListeners() {
        // Handle window resize for responsive behavior
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    handleResize() {
        // Adjust card layout for different screen sizes
        const cards = this.container.querySelectorAll('.dashboard-card');
        cards.forEach(card => {
            // Recalculate any size-dependent properties
            this.adjustCardSize(card);
        });
    }

    adjustCardSize(card) {
        // Responsive adjustments based on container width
        const containerWidth = this.container.offsetWidth;
        
        if (containerWidth < 768) {
            card.classList.add('dashboard-card--mobile');
        } else {
            card.classList.remove('dashboard-card--mobile');
        }
    }

    debounce(func, wait) {
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

    // Public API methods
    getCard(cardId) {
        return this.cards.get(cardId);
    }

    removeCard(cardId) {
        const card = this.cards.get(cardId);
        if (card) {
            card.element.remove();
            this.cards.delete(cardId);
        }
    }

    clear() {
        this.cards.forEach(card => {
            card.element.remove();
        });
        this.cards.clear();
    }

    destroy() {
        this.clear();
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
    }
}

export default DashboardCards;
