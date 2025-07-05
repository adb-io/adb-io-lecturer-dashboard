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
            // Comprehensive mock data for development
            this.courses = [
                {
                    id: 'course_001',
                    title: 'Introduction to Digital Business',
                    description: 'Learn the fundamentals of digital business transformation and how technology is reshaping modern business practices.',
                    instructor: 'Dr. Sarah Johnson',
                    duration: '8 weeks',
                    level: 'Beginner',
                    enrolled: true,
                    progress: 75,
                    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
                    category: 'Business',
                    rating: 4.8,
                    students: 245,
                    modules: 12,
                    assignments: 8,
                    nextDeadline: '2025-07-15',
                    status: 'active'
                },
                {
                    id: 'course_002',
                    title: 'Data Analytics for Business',
                    description: 'Master data analytics tools and techniques for business insights using Python, SQL, and visualization tools.',
                    instructor: 'Prof. Michael Chen',
                    duration: '10 weeks',
                    level: 'Intermediate',
                    enrolled: true,
                    progress: 45,
                    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
                    category: 'Analytics',
                    rating: 4.9,
                    students: 189,
                    modules: 15,
                    assignments: 12,
                    nextDeadline: '2025-07-20',
                    status: 'active'
                },
                {
                    id: 'course_003',
                    title: 'Digital Marketing Strategy',
                    description: 'Comprehensive guide to digital marketing including SEO, social media, content marketing, and analytics.',
                    instructor: 'Ms. Emily Rodriguez',
                    duration: '6 weeks',
                    level: 'Beginner',
                    enrolled: true,
                    progress: 90,
                    thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=250&fit=crop',
                    category: 'Marketing',
                    rating: 4.7,
                    students: 312,
                    modules: 10,
                    assignments: 6,
                    nextDeadline: '2025-07-12',
                    status: 'completing'
                },
                {
                    id: 'course_004',
                    title: 'AI and Machine Learning Basics',
                    description: 'Introduction to artificial intelligence and machine learning concepts with practical applications.',
                    instructor: 'Dr. James Wilson',
                    duration: '12 weeks',
                    level: 'Advanced',
                    enrolled: false,
                    progress: 0,
                    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop',
                    category: 'Technology',
                    rating: 4.9,
                    students: 156,
                    modules: 18,
                    assignments: 15,
                    nextDeadline: null,
                    status: 'available'
                },
                {
                    id: 'course_005',
                    title: 'Sustainable Business Practices',
                    description: 'Learn how to implement sustainable and environmentally friendly practices in modern business.',
                    instructor: 'Dr. Lisa Green',
                    duration: '8 weeks',
                    level: 'Intermediate',
                    enrolled: false,
                    progress: 0,
                    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
                    category: 'Sustainability',
                    rating: 4.6,
                    students: 98,
                    modules: 12,
                    assignments: 10,
                    nextDeadline: null,
                    status: 'available'
                },
                {
                    id: 'course_006',
                    title: 'Project Management Fundamentals',
                    description: 'Master project management methodologies including Agile, Scrum, and traditional approaches.',
                    instructor: 'Mr. David Kim',
                    duration: '7 weeks',
                    level: 'Intermediate',
                    enrolled: false,
                    progress: 0,
                    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
                    category: 'Management',
                    rating: 4.5,
                    students: 203,
                    modules: 14,
                    assignments: 9,
                    nextDeadline: null,
                    status: 'available'
                }
            ];

            this.filteredCourses = [...this.courses];
        } catch (error) {
            console.error('Error loading courses:', error);
            this.showError('Failed to load courses');
        }
    }

    renderCoursesPage() {
        const coursesSection = document.getElementById('courses');
        if (!coursesSection) return;

        coursesSection.innerHTML = `
            <div class="courses-header">
                <h2>My Courses</h2>
                <p>Manage your enrolled courses and discover new learning opportunities</p>
            </div>

            <div class="courses-filters">
                <div class="filter-group">
                    <label for="course-search">Search Courses:</label>
                    <input type="text" id="course-search" placeholder="Search by title or instructor..." value="${this.searchQuery}">
                </div>
                
                <div class="filter-group">
                    <label for="category-filter">Category:</label>
                    <select id="category-filter">
                        <option value="all">All Categories</option>
                        <option value="Business">Business</option>
                        <option value="Analytics">Analytics</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Technology">Technology</option>
                        <option value="Sustainability">Sustainability</option>
                        <option value="Management">Management</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="level-filter">Level:</label>
                    <select id="level-filter">
                        <option value="all">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="status-filter">Status:</label>
                    <select id="status-filter">
                        <option value="all">All Courses</option>
                        <option value="enrolled">Enrolled</option>
                        <option value="available">Available</option>
                    </select>
                </div>
            </div>

            <div class="courses-grid" id="courses-grid">
                ${this.renderCourseCards()}
            </div>
        `;
    }

    renderCourseCards() {
        if (this.filteredCourses.length === 0) {
            return '<div class="no-courses">No courses found matching your criteria.</div>';
        }

        return this.filteredCourses.map(course => `
            <div class="course-card ${course.enrolled ? 'enrolled' : 'available'}" data-course-id="${course.id}">
                <div class="course-thumbnail">
                    <img src="${course.thumbnail}" alt="${course.title}" loading="lazy">
                    <div class="course-level">${course.level}</div>
                    ${course.enrolled ? `<div class="course-progress-overlay">${course.progress}% Complete</div>` : ''}
                </div>
                
                <div class="course-content">
                    <div class="course-category">${course.category}</div>
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-description">${course.description}</p>
                    
                    <div class="course-instructor">
                        <span class="instructor-name">👨‍🏫 ${course.instructor}</span>
                    </div>
                    
                    <div class="course-meta">
                        <span class="duration">⏱️ ${course.duration}</span>
                        <span class="rating">⭐ ${course.rating}</span>
                        <span class="students">👥 ${course.students}</span>
                    </div>
                    
                    ${course.enrolled ? `
                        <div class="course-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${course.progress}%"></div>
                            </div>
                            <span class="progress-text">${course.progress}% Complete</span>
                        </div>
                        
                        ${course.nextDeadline ? `
                            <div class="next-deadline">
                                📅 Next deadline: ${new Date(course.nextDeadline).toLocaleDateString()}
                            </div>
                        ` : ''}
                        
                        <div class="course-actions">
                            <button class="btn btn-primary continue-course" data-course-id="${course.id}">
                                Continue Learning
                            </button>
                            <button class="btn btn-secondary view-details" data-course-id="${course.id}">
                                View Details
                            </button>
                        </div>
                    ` : `
                        <div class="course-info">
                            <span class="modules">📚 ${course.modules} modules</span>
                            <span class="assignments">📝 ${course.assignments} assignments</span>
                        </div>
                        
                        <div class="course-actions">
                            <button class="btn btn-primary enroll-course" data-course-id="${course.id}">
                                Enroll Now
                            </button>
                            <button class="btn btn-secondary view-details" data-course-id="${course.id}">
                                View Details
                            </button>
                        </div>
                    `}
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('course-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.filterCourses();
            });
        }

        // Filter functionality
        const categoryFilter = document.getElementById('category-filter');
        const levelFilter = document.getElementById('level-filter');
        const statusFilter = document.getElementById('status-filter');

        [categoryFilter, levelFilter, statusFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => {
                    this.filterCourses();
                });
            }
        });

        // Course action buttons
        this.setupCourseActions();
    }

    setupCourseActions() {
        const coursesGrid = document.getElementById('courses-grid');
        if (!coursesGrid) return;

        coursesGrid.addEventListener('click', (e) => {
            const courseId = e.target.dataset.courseId;
            if (!courseId) return;

            if (e.target.classList.contains('continue-course')) {
                this.continueCourse(courseId);
            } else if (e.target.classList.contains('enroll-course')) {
                this.enrollCourse(courseId);
            } else if (e.target.classList.contains('view-details')) {
                this.viewCourseDetails(courseId);
            }
        });
    }

    filterCourses() {
        const categoryFilter = document.getElementById('category-filter')?.value || 'all';
        const levelFilter = document.getElementById('level-filter')?.value || 'all';
        const statusFilter = document.getElementById('status-filter')?.value || 'all';

        this.filteredCourses = this.courses.filter(course => {
            const matchesSearch = this.searchQuery === '' ||
                course.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                course.instructor.toLowerCase().includes(this.searchQuery.toLowerCase());

            const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
            const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'enrolled' && course.enrolled) ||
                (statusFilter === 'available' && !course.enrolled);

            return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
        });

        this.updateCoursesGrid();
    }

    updateCoursesGrid() {
        const coursesGrid = document.getElementById('courses-grid');
        if (coursesGrid) {
            coursesGrid.innerHTML = this.renderCourseCards();
            this.setupCourseActions();
        }
    }

    continueCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (course) {
            console.log(`Continuing course: ${course.title}`);
            // Navigate to course materials
            if (window.studentPortalApp) {
                window.studentPortalApp.navigateToSection('course-materials', {
                    courseId: courseId,
                    moduleId: 'module_001' // Default to first module
                });
            }
        }
    }

    enrollCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (course) {
            course.enrolled = true;
            course.progress = 0;
            course.status = 'active';
            console.log(`Enrolled in course: ${course.title}`);
            this.updateCoursesGrid();
            alert(`Successfully enrolled in "${course.title}"!`);
        }
    }

    viewCourseDetails(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (course) {
            console.log(`Viewing details for course: ${course.title}`);
            // Navigate to course details page
            if (window.studentPortalApp) {
                window.studentPortalApp.navigateToSection('course-detail', { courseId });
            }
        }
    }

    showError(message) {
        console.error(message);
        // TODO: Implement proper error display
    }

    destroy() {
        // Cleanup event listeners
        console.log('Courses module destroyed');
    }
}
