/**
 * ADB-IO Student Portal - Courses Module
 * Green Computing: Efficient course management with minimal resource usage
 */

export default class Courses {
    constructor(user) {
        this.user = user;
        this.courses = [];
        this.filteredCourses = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
    }

    async init() {
        try {
            await this.loadCourses();
            this.renderCoursesPage();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize courses:', error);
            this.showError('Failed to load courses');
        }
    }

    async loadCourses() {
        try {
            // Mock data - replace with actual API call
            this.courses = [
                {
                    id: 1,
                    title: 'JavaScript Fundamentals',
                    description: 'Learn the basics of JavaScript programming language including variables, functions, and control structures.',
                    instructor: 'Dr. Sarah Johnson',
                    duration: '8 weeks',
                    progress: 90,
                    status: 'in-progress',
                    difficulty: 'beginner',
                    category: 'programming',
                    enrolledDate: '2024-01-15',
                    lastAccessed: '2024-01-20',
                    totalLessons: 24,
                    completedLessons: 22,
                    nextLesson: 'Advanced Functions',
                    image: 'assets/images/courses/javascript.jpg',
                    tags: ['JavaScript', 'Programming', 'Web Development']
                },
                {
                    id: 2,
                    title: 'Data Structures & Algorithms',
                    description: 'Master fundamental data structures and algorithms essential for software development.',
                    instructor: 'Prof. Michael Chen',
                    duration: '12 weeks',
                    progress: 65,
                    status: 'in-progress',
                    difficulty: 'intermediate',
                    category: 'computer-science',
                    enrolledDate: '2024-01-10',
                    lastAccessed: '2024-01-19',
                    totalLessons: 36,
                    completedLessons: 23,
                    nextLesson: 'Binary Trees',
                    image: 'assets/images/courses/algorithms.jpg',
                    tags: ['Algorithms', 'Data Structures', 'Computer Science']
                },
                {
                    id: 3,
                    title: 'Web Development Bootcamp',
                    description: 'Complete web development course covering HTML, CSS, JavaScript, and modern frameworks.',
                    instructor: 'Emily Rodriguez',
                    duration: '16 weeks',
                    progress: 55,
                    status: 'in-progress',
                    difficulty: 'beginner',
                    category: 'web-development',
                    enrolledDate: '2024-01-05',
                    lastAccessed: '2024-01-18',
                    totalLessons: 48,
                    completedLessons: 26,
                    nextLesson: 'React Components',
                    image: 'assets/images/courses/web-dev.jpg',
                    tags: ['HTML', 'CSS', 'JavaScript', 'React']
                },
                {
                    id: 4,
                    title: 'Database Design Principles',
                    description: 'Learn database design, normalization, and SQL for effective data management.',
                    instructor: 'Dr. James Wilson',
                    duration: '10 weeks',
                    progress: 70,
                    status: 'in-progress',
                    difficulty: 'intermediate',
                    category: 'database',
                    enrolledDate: '2024-01-12',
                    lastAccessed: '2024-01-17',
                    totalLessons: 30,
                    completedLessons: 21,
                    nextLesson: 'Query Optimization',
                    image: 'assets/images/courses/database.jpg',
                    tags: ['SQL', 'Database', 'Data Modeling']
                },
                {
                    id: 5,
                    title: 'Machine Learning Basics',
                    description: 'Introduction to machine learning concepts, algorithms, and practical applications.',
                    instructor: 'Dr. Lisa Park',
                    duration: '14 weeks',
                    progress: 30,
                    status: 'in-progress',
                    difficulty: 'advanced',
                    category: 'ai-ml',
                    enrolledDate: '2024-01-08',
                    lastAccessed: '2024-01-16',
                    totalLessons: 42,
                    completedLessons: 13,
                    nextLesson: 'Linear Regression',
                    image: 'assets/images/courses/ml.jpg',
                    tags: ['Machine Learning', 'AI', 'Python', 'Statistics']
                }
            ];

            this.filteredCourses = [...this.courses];
            return this.courses;
        } catch (error) {
            console.error('Error loading courses:', error);
            throw error;
        }
    }

    renderCoursesPage() {
        const coursesSection = document.getElementById('courses');
        if (!coursesSection) return;

        const coursesHTML = `
            <div class="section-header">
                <h1 class="section-title">My Courses</h1>
                <p class="section-subtitle">Manage your enrolled courses and track progress.</p>
            </div>

            ${this.renderCoursesFilter()}
            ${this.renderCoursesGrid()}
        `;

        coursesSection.innerHTML = coursesHTML;
    }

    renderCoursesFilter() {
        return `
            <div class="courses-filter">
                <input 
                    type="text" 
                    id="courses-search" 
                    class="courses-filter__search" 
                    placeholder="Search courses..."
                    value="${this.searchQuery}"
                >
                <select id="courses-category" class="courses-filter__select">
                    <option value="all">All Categories</option>
                    <option value="programming">Programming</option>
                    <option value="web-development">Web Development</option>
                    <option value="computer-science">Computer Science</option>
                    <option value="database">Database</option>
                    <option value="ai-ml">AI & Machine Learning</option>
                </select>
                <select id="courses-status" class="courses-filter__select">
                    <option value="all">All Status</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="not-started">Not Started</option>
                </select>
                <select id="courses-difficulty" class="courses-filter__select">
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>
        `;
    }

    renderCoursesGrid() {
        if (this.filteredCourses.length === 0) {
            return `
                <div class="placeholder-content">
                    <p>No courses found matching your criteria.</p>
                </div>
            `;
        }

        const coursesHTML = this.filteredCourses.map(course => this.renderCourseCard(course)).join('');
        
        return `
            <div class="courses-grid">
                ${coursesHTML}
            </div>
        `;
    }

    renderCourseCard(course) {
        const progressPercentage = Math.round(course.progress);
        const difficultyColor = this.getDifficultyColor(course.difficulty);
        
        return `
            <div class="course-card" data-course-id="${course.id}">
                <div class="course-card__image" style="background: linear-gradient(135deg, ${difficultyColor}20, ${difficultyColor}40);">
                    <div class="course-card__difficulty" style="background: ${difficultyColor};">
                        ${course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                    </div>
                </div>
                
                <div class="course-card__content">
                    <h3 class="course-card__title">${course.title}</h3>
                    <p class="course-card__description">${course.description}</p>
                    
                    <div class="course-card__meta">
                        <span class="course-card__instructor">👨‍🏫 ${course.instructor}</span>
                        <span class="course-card__duration">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12,6 12,12 16,14"></polyline>
                            </svg>
                            ${course.duration}
                        </span>
                    </div>
                    
                    <div class="course-card__progress">
                        <div class="course-card__progress-label">
                            <span class="course-card__progress-text">Progress</span>
                            <span class="course-card__progress-percentage">${progressPercentage}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                        </div>
                        <div class="course-card__lessons">
                            ${course.completedLessons}/${course.totalLessons} lessons completed
                        </div>
                    </div>
                    
                    <div class="course-card__next-lesson">
                        <strong>Next:</strong> ${course.nextLesson}
                    </div>
                    
                    <div class="course-card__tags">
                        ${course.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    
                    <div class="course-card__actions">
                        <button class="btn btn--primary" data-action="continue" data-course-id="${course.id}">
                            Continue Learning
                        </button>
                        <button class="btn btn--secondary" data-action="details" data-course-id="${course.id}">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('courses-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.filterCourses();
            });
        }

        // Filter dropdowns
        ['courses-category', 'courses-status', 'courses-difficulty'].forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.addEventListener('change', () => {
                    this.filterCourses();
                });
            }
        });

        // Course action buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="continue"]')) {
                const courseId = e.target.getAttribute('data-course-id');
                this.continueCourse(courseId);
            } else if (e.target.matches('[data-action="details"]')) {
                const courseId = e.target.getAttribute('data-course-id');
                this.showCourseDetails(courseId);
            }
        });
    }

    filterCourses() {
        const categoryFilter = document.getElementById('courses-category')?.value || 'all';
        const statusFilter = document.getElementById('courses-status')?.value || 'all';
        const difficultyFilter = document.getElementById('courses-difficulty')?.value || 'all';

        this.filteredCourses = this.courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                                course.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                                course.instructor.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                                course.tags.some(tag => tag.toLowerCase().includes(this.searchQuery.toLowerCase()));

            const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
            const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
            const matchesDifficulty = difficultyFilter === 'all' || course.difficulty === difficultyFilter;

            return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty;
        });

        this.updateCoursesGrid();
    }

    updateCoursesGrid() {
        const coursesGrid = document.querySelector('.courses-grid');
        if (coursesGrid) {
            coursesGrid.innerHTML = this.renderCoursesGrid().replace('<div class="courses-grid">', '').replace('</div>', '');
        }
    }

    async continueCourse(courseId) {
        try {
            const course = this.courses.find(c => c.id == courseId);
            if (!course) return;

            console.log(`Continuing course: ${course.title}`);
            
            // In a real implementation, this would navigate to the course content
            // For now, we'll show a success message
            this.showSuccess(`Continuing ${course.title}...`);
            
            // Update last accessed time
            course.lastAccessed = new Date().toISOString().split('T')[0];
            
        } catch (error) {
            console.error('Failed to continue course:', error);
            this.showError('Failed to continue course');
        }
    }

    async showCourseDetails(courseId) {
        try {
            const course = this.courses.find(c => c.id == courseId);
            if (!course) return;

            console.log(`Showing details for course: ${course.title}`);
            
            // In a real implementation, this would open a modal or navigate to a details page
            this.showSuccess(`Loading details for ${course.title}...`);
            
        } catch (error) {
            console.error('Failed to show course details:', error);
            this.showError('Failed to load course details');
        }
    }

    getDifficultyColor(difficulty) {
        const colors = {
            beginner: '#10b981',
            intermediate: '#f59e0b',
            advanced: '#ef4444'
        };
        return colors[difficulty] || '#6b7280';
    }

    // Utility methods
    showSuccess(message) {
        console.log('Success:', message);
        // This would integrate with a toast notification system
    }

    showError(message) {
        console.error('Error:', message);
        // This would integrate with a toast notification system
    }

    async refresh() {
        try {
            await this.loadCourses();
            this.filterCourses();
            this.showSuccess('Courses refreshed successfully');
        } catch (error) {
            console.error('Failed to refresh courses:', error);
            this.showError('Failed to refresh courses');
        }
    }

    destroy() {
        // Clean up event listeners and resources
    }
}

export default Courses;
