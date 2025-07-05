/**
 * ADB-IO Lecturer Dashboard - Main Application
 * Green Computing: Optimized for performance and minimal resource usage
 */

// Import modules
import CourseCreation from './js/modules/course-creation.js';

class LecturerDashboardApp {
    constructor() {
        this.currentUser = this.getMockUser(); // Mock user for development
        this.modules = {};
        this.currentSection = 'dashboard';
        this.init();
    }

    async init() {
        try {
            // Show loading screen
            this.showLoadingScreen();

            // Initialize modules
            await this.initializeModules();
            this.setupNavigation();
            this.setupEventListeners();
            this.updateUserInterface();
            this.trackGreenMetrics();

            // Hide loading screen
            this.hideLoadingScreen();

        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.hideLoadingScreen();
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    }

    async initializeModules() {
        try {
            // Initialize course creation module
            this.modules.courseCreation = new CourseCreation(this.currentUser);

            // Initialize all modules
            await Promise.all([
                this.modules.courseCreation.init()
            ]);

            console.log('All modules initialized successfully');
        } catch (error) {
            console.error('Failed to initialize modules:', error);
            throw error;
        }
    }

    getMockUser() {
        return {
            id: 'lecturer_001',
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@adb-io.edu',
            role: 'lecturer',
            department: 'Digital Business',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            joinDate: '2023-01-15',
            coursesCreated: 12,
            studentsEnrolled: 450,
            rating: 4.8
        };
    }

    setupNavigation() {
        // Setup navigation menu
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                if (section) {
                    this.navigateToSection(section);
                }
            });
        });

        // Setup mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const sidebar = document.querySelector('.sidebar');

        if (mobileMenuToggle && sidebar) {
            mobileMenuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }
    }

    navigateToSection(section, params = {}) {
        // Hide all sections
        const sections = document.querySelectorAll('.main-section');
        sections.forEach(s => s.style.display = 'none');

        // Show target section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.style.display = 'block';
            this.currentSection = section;

            // Update navigation active state
            this.updateNavigationState(section);

            // Handle section-specific logic
            this.handleSectionNavigation(section, params);
        }
    }

    updateNavigationState(activeSection) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === activeSection) {
                item.classList.add('active');
            }
        });
    }

    handleSectionNavigation(section, params) {
        switch (section) {
            case 'course-creation':
                if (this.modules.courseCreation) {
                    this.modules.courseCreation.init();
                }
                break;
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'courses':
                this.loadCoursesData();
                break;
            default:
                console.log(`Navigated to ${section}`);
        }
    }

    setupEventListeners() {
        // Global event listeners
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'n':
                        e.preventDefault();
                        this.navigateToSection('course-creation');
                        break;
                    case 'd':
                        e.preventDefault();
                        this.navigateToSection('dashboard');
                        break;
                }
            }
        });
    }

    updateUserInterface() {
        // Update user info in header
        const userNameElement = document.getElementById('user-name');
        const userAvatarElement = document.getElementById('user-avatar');

        if (userNameElement) {
            userNameElement.textContent = this.currentUser.name;
        }

        if (userAvatarElement) {
            userAvatarElement.src = this.currentUser.avatar;
            userAvatarElement.alt = this.currentUser.name;
        }

        // Update dashboard stats
        this.updateDashboardStats();
    }

    updateDashboardStats() {
        const statsElements = {
            'courses-created': this.currentUser.coursesCreated,
            'students-enrolled': this.currentUser.studentsEnrolled,
            'instructor-rating': this.currentUser.rating
        };

        Object.entries(statsElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    loadDashboardData() {
        // Load dashboard-specific data
        console.log('Loading dashboard data...');
    }

    loadCoursesData() {
        // Load courses data
        console.log('Loading courses data...');
    }

    trackGreenMetrics() {
        // Track green computing metrics
        const startTime = performance.now();

        // Monitor resource usage
        if ('memory' in performance) {
            const memoryInfo = performance.memory;
            console.log('Memory usage:', {
                used: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) + ' MB',
                total: Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024) + ' MB'
            });
        }

        // Track page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now() - startTime;
            console.log(`Page loaded in ${Math.round(loadTime)}ms`);

            // Store green metrics
            this.storeGreenMetrics({
                loadTime: Math.round(loadTime),
                timestamp: new Date().toISOString()
            });
        });
    }

    storeGreenMetrics(metrics) {
        try {
            const existingMetrics = JSON.parse(localStorage.getItem('green-metrics') || '[]');
            existingMetrics.push(metrics);

            // Keep only last 100 entries
            if (existingMetrics.length > 100) {
                existingMetrics.splice(0, existingMetrics.length - 100);
            }

            localStorage.setItem('green-metrics', JSON.stringify(existingMetrics));
        } catch (error) {
            console.error('Failed to store green metrics:', error);
        }
    }

    handleResize() {
        // Handle responsive behavior
        const sidebar = document.querySelector('.sidebar');
        if (window.innerWidth > 768 && sidebar) {
            sidebar.classList.remove('active');
        }
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    showError(message) {
        console.error(message);
        // You can implement a more sophisticated error display here
        alert(message);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lecturerDashboardApp = new LecturerDashboardApp();
});

// Make app globally available
window.LecturerDashboardApp = LecturerDashboardApp;