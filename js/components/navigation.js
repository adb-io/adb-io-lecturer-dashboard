/**
 * ADB-IO Student Portal - Navigation Component
 * Green Computing: Efficient navigation with minimal resource usage
 */

export class Navigation {
    constructor(app) {
        this.app = app;
        this.isCollapsed = false;
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupNavigationLinks();
        this.setupUserMenu();
        this.restoreNavigationState();
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');
        
        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (sidebar.classList.contains('sidebar--open') && 
                    !sidebar.contains(e.target) && 
                    !mobileMenuBtn.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && sidebar.classList.contains('sidebar--open')) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    setupNavigationLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('data-target');
                
                if (target) {
                    this.navigateToSection(target);
                    this.updateActiveLink(target);
                    this.closeMobileMenu();
                }
            });

            // Add hover effects for better UX
            link.addEventListener('mouseenter', () => {
                this.showTooltip(link);
            });

            link.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    setupUserMenu() {
        const userMenu = document.querySelector('.header__user');
        const logoutBtn = document.getElementById('logout-btn');

        if (userMenu) {
            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserMenu();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Close user menu when clicking outside
        document.addEventListener('click', () => {
            this.closeUserMenu();
        });
    }

    navigateToSection(section) {
        // Delegate to main app
        if (this.app && this.app.navigateToSection) {
            this.app.navigateToSection(section);
        }

        // Track navigation
        this.trackNavigation(section);
    }

    updateActiveLink(section) {
        // Remove active class from all links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to current link
        const activeLink = document.querySelector(`[data-target="${section}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Update page title
        this.updatePageTitle(section);
    }

    updatePageTitle(section) {
        const titles = {
            dashboard: 'Dashboard',
            courses: 'My Courses',
            assignments: 'Assignments',
            progress: 'Progress Tracking',
            'ai-assistant': 'AI Assistant',
            profile: 'Profile'
        };

        const title = titles[section] || 'Student Portal';
        document.title = `${title} - ADB-IO Green LMS`;
    }

    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('sidebar--open');
            
            // Update aria attributes for accessibility
            const isOpen = sidebar.classList.contains('sidebar--open');
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            
            if (mobileMenuBtn) {
                mobileMenuBtn.setAttribute('aria-expanded', isOpen);
            }
            
            sidebar.setAttribute('aria-hidden', !isOpen);
        }
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('sidebar--open');
            
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            if (mobileMenuBtn) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
            
            sidebar.setAttribute('aria-hidden', 'true');
        }
    }

    toggleUserMenu() {
        const userMenu = document.querySelector('.user-menu-dropdown');
        if (userMenu) {
            userMenu.classList.toggle('show');
        }
    }

    closeUserMenu() {
        const userMenu = document.querySelector('.user-menu-dropdown');
        if (userMenu) {
            userMenu.classList.remove('show');
        }
    }

    async handleLogout() {
        try {
            // Show confirmation dialog
            const confirmed = await this.showLogoutConfirmation();
            
            if (confirmed) {
                // Show loading state
                this.showLogoutLoading();
                
                // Delegate to main app
                if (this.app && this.app.logout) {
                    await this.app.logout();
                }
            }
        } catch (error) {
            console.error('Logout error:', error);
            this.showError('Failed to logout. Please try again.');
        }
    }

    showLogoutConfirmation() {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'logout-confirmation-modal';
            modal.innerHTML = `
                <div class="modal-backdrop">
                    <div class="modal-content">
                        <h3>Confirm Logout</h3>
                        <p>Are you sure you want to logout?</p>
                        <div class="modal-actions">
                            <button class="btn btn--secondary" data-action="cancel">Cancel</button>
                            <button class="btn btn--primary" data-action="confirm">Logout</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            modal.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-action') === 'confirm') {
                    resolve(true);
                    modal.remove();
                } else if (e.target.getAttribute('data-action') === 'cancel' || 
                          e.target.classList.contains('modal-backdrop')) {
                    resolve(false);
                    modal.remove();
                }
            });
        });
    }

    showLogoutLoading() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.innerHTML = '<div class="spinner"></div>';
            logoutBtn.disabled = true;
        }
    }

    showTooltip(element) {
        if (window.innerWidth > 1024) return; // Only show on mobile/tablet
        
        const text = element.querySelector('.nav-text')?.textContent;
        if (!text) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'nav-tooltip';
        tooltip.textContent = text;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.right + 10}px`;
        tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltip.offsetHeight / 2)}px`;
        
        this.currentTooltip = tooltip;
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    trackNavigation(section) {
        // Track navigation for analytics
        const navigationEvent = {
            type: 'navigation',
            section,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };

        // Store for later analytics
        if (this.app && this.app.storageManager) {
            const events = this.app.storageManager.getCache('navigation_events', []);
            events.push(navigationEvent);
            this.app.storageManager.setCache('navigation_events', events, 86400);
        }
    }

    restoreNavigationState() {
        // Restore collapsed state
        const isCollapsed = this.app?.storageManager?.getPreference('sidebarCollapsed', false);
        if (isCollapsed) {
            this.collapseSidebar();
        }
    }

    collapseSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.add('sidebar--collapsed');
            this.isCollapsed = true;
            
            // Save state
            if (this.app?.storageManager) {
                this.app.storageManager.setPreference('sidebarCollapsed', true);
            }
        }
    }

    expandSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('sidebar--collapsed');
            this.isCollapsed = false;
            
            // Save state
            if (this.app?.storageManager) {
                this.app.storageManager.setPreference('sidebarCollapsed', false);
            }
        }
    }

    updateUserInfo(user) {
        const userNameElement = document.getElementById('user-name');
        const userAvatarElement = document.getElementById('user-avatar');
        
        if (userNameElement && user) {
            userNameElement.textContent = user.name || 'Student';
        }
        
        if (userAvatarElement && user) {
            userAvatarElement.src = user.avatar || 'assets/images/default-avatar.png';
            userAvatarElement.alt = `${user.name || 'Student'} Avatar`;
        }
    }

    showError(message) {
        console.error('Navigation error:', message);
        // In a real implementation, this would show a toast notification
    }

    destroy() {
        // Clean up event listeners and resources
        this.hideTooltip();
        this.closeUserMenu();
        this.closeMobileMenu();
    }
}

export default Navigation;
