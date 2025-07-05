/**
 * ADB-IO Modal Component (Local Copy)
 * EXTRACTED FROM: https://adb-io.github.io/adb-io-shared-components/js/components/modal.js
 * Green Computing: Optimized for performance and minimal resource usage
 */

class Modal {
    constructor(options = {}) {
        this.options = {
            title: options.title || 'Modal',
            content: options.content || '',
            size: options.size || 'medium', // small, medium, large
            closable: options.closable !== false,
            backdrop: options.backdrop !== false,
            keyboard: options.keyboard !== false,
            ...options
        };
        
        this.isOpen = false;
        this.element = null;
        this.backdrop = null;
        
        this.init();
    }
    
    init() {
        this.createElement();
        this.bindEvents();
    }
    
    createElement() {
        // Create backdrop
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'modal-backdrop';
        
        // Create modal container
        this.element = document.createElement('div');
        this.element.className = `modal modal-${this.options.size}`;
        this.element.setAttribute('role', 'dialog');
        this.element.setAttribute('aria-modal', 'true');
        this.element.setAttribute('aria-labelledby', 'modal-title');
        
        // Create modal content
        this.element.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modal-title" class="modal-title">${this.options.title}</h3>
                    ${this.options.closable ? '<button type="button" class="modal-close" aria-label="Close">&times;</button>' : ''}
                </div>
                <div class="modal-body">
                    ${this.options.content}
                </div>
                ${this.options.footer ? `<div class="modal-footer">${this.options.footer}</div>` : ''}
            </div>
        `;
        
        // Add styles if not already present
        this.addStyles();
    }
    
    addStyles() {
        if (!document.getElementById('modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'modal-styles';
            styles.textContent = `
                .modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                    z-index: 1000;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .modal-backdrop.show {
                    opacity: 1;
                }
                
                .modal {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.9);
                    z-index: 1001;
                    max-width: 90vw;
                    max-height: 90vh;
                    opacity: 0;
                    transition: all 0.3s ease;
                }
                
                .modal.show {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                
                .modal-small { width: 400px; }
                .modal-medium { width: 600px; }
                .modal-large { width: 800px; }
                
                .modal-content {
                    background: var(--white, #ffffff);
                    border-radius: var(--radius-xl, 0.75rem);
                    box-shadow: var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    max-height: 90vh;
                }
                
                .modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--spacing-6, 1.5rem);
                    border-bottom: 1px solid var(--gray-200, #e5e7eb);
                }
                
                .modal-title {
                    margin: 0;
                    font-size: var(--font-size-lg, 1.125rem);
                    font-weight: 600;
                    color: var(--gray-900, #111827);
                }
                
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: var(--gray-500, #6b7280);
                    padding: var(--spacing-2, 0.5rem);
                    border-radius: var(--radius, 0.375rem);
                    transition: var(--transition, all 0.15s ease-in-out);
                }
                
                .modal-close:hover {
                    color: var(--gray-700, #374151);
                    background: var(--gray-100, #f3f4f6);
                }
                
                .modal-body {
                    padding: var(--spacing-6, 1.5rem);
                    overflow-y: auto;
                    flex: 1;
                }
                
                .modal-footer {
                    padding: var(--spacing-6, 1.5rem);
                    border-top: 1px solid var(--gray-200, #e5e7eb);
                    display: flex;
                    gap: var(--spacing-3, 0.75rem);
                    justify-content: flex-end;
                }
                
                @media (max-width: 768px) {
                    .modal {
                        width: 95vw !important;
                        max-width: none;
                    }
                    
                    .modal-header,
                    .modal-body,
                    .modal-footer {
                        padding: var(--spacing-4, 1rem);
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    bindEvents() {
        // Close button
        if (this.options.closable) {
            const closeBtn = this.element.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close());
            }
        }
        
        // Backdrop click
        if (this.options.backdrop) {
            this.backdrop.addEventListener('click', () => this.close());
        }
        
        // Keyboard events
        if (this.options.keyboard) {
            this.handleKeyboard = (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            };
        }
    }
    
    open() {
        if (this.isOpen) return;
        
        document.body.appendChild(this.backdrop);
        document.body.appendChild(this.element);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add keyboard listener
        if (this.options.keyboard) {
            document.addEventListener('keydown', this.handleKeyboard);
        }
        
        // Trigger animations
        requestAnimationFrame(() => {
            this.backdrop.classList.add('show');
            this.element.classList.add('show');
        });
        
        this.isOpen = true;
        
        // Focus management
        const firstFocusable = this.element.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        // Emit open event
        this.element.dispatchEvent(new CustomEvent('modal:open'));
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.backdrop.classList.remove('show');
        this.element.classList.remove('show');
        
        // Remove keyboard listener
        if (this.options.keyboard) {
            document.removeEventListener('keydown', this.handleKeyboard);
        }
        
        // Wait for animation to complete
        setTimeout(() => {
            if (this.backdrop.parentNode) {
                this.backdrop.parentNode.removeChild(this.backdrop);
            }
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            this.isOpen = false;
            
            // Emit close event
            this.element.dispatchEvent(new CustomEvent('modal:close'));
        }, 300);
    }
    
    setContent(content) {
        const body = this.element.querySelector('.modal-body');
        if (body) {
            body.innerHTML = content;
        }
    }
    
    setTitle(title) {
        const titleElement = this.element.querySelector('.modal-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }
}

// Alert function
function showAlert(message, type = 'info', duration = 3000) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert-notification');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert-notification alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <span class="alert-icon">${getAlertIcon(type)}</span>
            <span class="alert-message">${message}</span>
            <button class="alert-close">&times;</button>
        </div>
    `;
    
    // Add styles if not present
    addAlertStyles();
    
    // Add to DOM
    document.body.appendChild(alert);
    
    // Show animation
    requestAnimationFrame(() => {
        alert.classList.add('show');
    });
    
    // Auto remove
    const timeout = setTimeout(() => {
        removeAlert(alert);
    }, duration);
    
    // Manual close
    const closeBtn = alert.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        removeAlert(alert);
    });
}

function getAlertIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

function removeAlert(alert) {
    alert.classList.remove('show');
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 300);
}

function addAlertStyles() {
    if (!document.getElementById('alert-styles')) {
        const styles = document.createElement('style');
        styles.id = 'alert-styles';
        styles.textContent = `
            .alert-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1002;
                min-width: 300px;
                max-width: 500px;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            }
            
            .alert-notification.show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .alert-content {
                display: flex;
                align-items: center;
                gap: var(--spacing-3, 0.75rem);
                padding: var(--spacing-4, 1rem);
                border-radius: var(--radius-lg, 0.5rem);
                box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
                background: var(--white, #ffffff);
                border-left: 4px solid;
            }
            
            .alert-success .alert-content { border-left-color: var(--success, #10b981); }
            .alert-error .alert-content { border-left-color: var(--danger, #ef4444); }
            .alert-warning .alert-content { border-left-color: var(--warning, #f59e0b); }
            .alert-info .alert-content { border-left-color: var(--primary, #2563eb); }
            
            .alert-icon {
                font-weight: bold;
                font-size: var(--font-size-lg, 1.125rem);
            }
            
            .alert-success .alert-icon { color: var(--success, #10b981); }
            .alert-error .alert-icon { color: var(--danger, #ef4444); }
            .alert-warning .alert-icon { color: var(--warning, #f59e0b); }
            .alert-info .alert-icon { color: var(--primary, #2563eb); }
            
            .alert-message {
                flex: 1;
                color: var(--gray-800, #1f2937);
            }
            
            .alert-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: var(--gray-500, #6b7280);
                padding: var(--spacing-1, 0.25rem);
                border-radius: var(--radius, 0.375rem);
                transition: var(--transition, all 0.15s ease-in-out);
            }
            
            .alert-close:hover {
                color: var(--gray-700, #374151);
                background: var(--gray-100, #f3f4f6);
            }
            
            @media (max-width: 768px) {
                .alert-notification {
                    right: 10px;
                    left: 10px;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Export for use
export { Modal, showAlert };
