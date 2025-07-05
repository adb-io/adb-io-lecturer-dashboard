/**
 * ADB-IO Student Portal - Course Detail Module
 * Green Computing: Efficient course detail management with minimal resource usage
 */

export default class CourseDetail {
    constructor(user) {
        this.user = user;
        this.currentCourse = null;
        this.modules = [];
        this.assignments = [];
    }

    async init(courseId) {
        try {
            await this.loadCourseDetail(courseId);
            this.renderCourseDetailPage();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize course detail:', error);
            this.showError('Failed to load course details');
        }
    }

    async loadCourseDetail(courseId) {
        // Mock course detail data
        const courseData = {
            'course_001': {
                id: 'course_001',
                title: 'Introduction to Digital Business',
                description: 'Learn the fundamentals of digital business transformation and how technology is reshaping modern business practices. This comprehensive course covers digital strategy, e-commerce, digital marketing, and emerging technologies.',
                longDescription: `
                    <p>In today's rapidly evolving business landscape, digital transformation is no longer optional—it's essential. This course provides a comprehensive introduction to digital business concepts, strategies, and technologies that are reshaping industries worldwide.</p>
                    
                    <h4>What You'll Learn:</h4>
                    <ul>
                        <li>Digital business strategy and planning</li>
                        <li>E-commerce platforms and digital marketplaces</li>
                        <li>Digital marketing and customer engagement</li>
                        <li>Data analytics for business decisions</li>
                        <li>Emerging technologies and their business applications</li>
                        <li>Digital transformation case studies</li>
                    </ul>
                    
                    <h4>Course Outcomes:</h4>
                    <p>Upon completion, you'll be able to develop digital business strategies, understand key technologies, and lead digital transformation initiatives in your organization.</p>
                `,
                instructor: {
                    name: 'Dr. Sarah Johnson',
                    title: 'Professor of Digital Business',
                    bio: 'Dr. Sarah Johnson is a renowned expert in digital business transformation with over 15 years of experience in both academia and industry. She has consulted for Fortune 500 companies and published extensively on digital strategy.',
                    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=059669&color=fff&size=100',
                    credentials: ['PhD in Business Administration', 'MBA in Technology Management', 'Certified Digital Transformation Expert']
                },
                duration: '8 weeks',
                level: 'Beginner',
                enrolled: true,
                progress: 75,
                thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
                category: 'Business',
                rating: 4.8,
                students: 245,
                totalModules: 12,
                completedModules: 9,
                assignments: 8,
                completedAssignments: 6,
                nextDeadline: '2025-07-15',
                status: 'active',
                estimatedTime: '6-8 hours per week',
                prerequisites: 'Basic understanding of business concepts',
                language: 'English',
                certificate: true,
                modules: [
                    {
                        id: 'module_001',
                        title: 'Introduction to Digital Business',
                        description: 'Overview of digital transformation and its impact on modern business',
                        duration: '45 minutes',
                        completed: true,
                        lessons: 4,
                        quiz: true,
                        materials: ['Video Lecture', 'Reading Materials', 'Quiz']
                    },
                    {
                        id: 'module_002',
                        title: 'Digital Strategy Fundamentals',
                        description: 'Learn how to develop and implement digital business strategies',
                        duration: '60 minutes',
                        completed: true,
                        lessons: 5,
                        quiz: true,
                        materials: ['Video Lecture', 'Case Study', 'Quiz']
                    },
                    {
                        id: 'module_003',
                        title: 'E-commerce and Digital Marketplaces',
                        description: 'Understanding online business models and digital marketplaces',
                        duration: '75 minutes',
                        completed: true,
                        lessons: 6,
                        quiz: true,
                        materials: ['Video Lecture', 'Interactive Demo', 'Assignment']
                    },
                    {
                        id: 'module_004',
                        title: 'Digital Marketing Essentials',
                        description: 'Digital marketing strategies and customer engagement techniques',
                        duration: '90 minutes',
                        completed: false,
                        lessons: 7,
                        quiz: true,
                        materials: ['Video Lecture', 'Practical Exercise', 'Quiz'],
                        current: true
                    },
                    {
                        id: 'module_005',
                        title: 'Data Analytics for Business',
                        description: 'Using data analytics to drive business decisions',
                        duration: '80 minutes',
                        completed: false,
                        lessons: 6,
                        quiz: true,
                        materials: ['Video Lecture', 'Hands-on Lab', 'Project']
                    }
                ],
                assignments: [
                    {
                        id: 'assignment_001',
                        title: 'Digital Strategy Analysis',
                        description: 'Analyze a company\'s digital transformation strategy',
                        dueDate: '2025-07-15',
                        status: 'submitted',
                        grade: 'A-',
                        points: 85
                    },
                    {
                        id: 'assignment_002',
                        title: 'E-commerce Platform Comparison',
                        description: 'Compare different e-commerce platforms and their features',
                        dueDate: '2025-07-20',
                        status: 'pending',
                        points: 100
                    }
                ]
            }
        };

        this.currentCourse = courseData[courseId] || null;
        if (!this.currentCourse) {
            throw new Error('Course not found');
        }
    }

    renderCourseDetailPage() {
        const coursesSection = document.getElementById('courses');
        if (!coursesSection) return;

        const course = this.currentCourse;
        
        coursesSection.innerHTML = `
            <div class="course-detail">
                <!-- Course Header -->
                <div class="course-header">
                    <button class="back-button" id="back-to-courses">
                        ← Back to Courses
                    </button>
                    
                    <div class="course-hero">
                        <div class="course-hero-image">
                            <img src="${course.thumbnail}" alt="${course.title}">
                            <div class="course-level-badge">${course.level}</div>
                        </div>
                        
                        <div class="course-hero-content">
                            <div class="course-category">${course.category}</div>
                            <h1 class="course-title">${course.title}</h1>
                            <p class="course-description">${course.description}</p>
                            
                            <div class="course-meta-grid">
                                <div class="meta-item">
                                    <span class="meta-label">Instructor:</span>
                                    <span class="meta-value">${course.instructor.name}</span>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-label">Duration:</span>
                                    <span class="meta-value">${course.duration}</span>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-label">Level:</span>
                                    <span class="meta-value">${course.level}</span>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-label">Students:</span>
                                    <span class="meta-value">${course.students}</span>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-label">Rating:</span>
                                    <span class="meta-value">⭐ ${course.rating}</span>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-label">Language:</span>
                                    <span class="meta-value">${course.language}</span>
                                </div>
                            </div>
                            
                            ${course.enrolled ? `
                                <div class="course-progress-section">
                                    <div class="progress-stats">
                                        <span>Progress: ${course.progress}%</span>
                                        <span>Modules: ${course.completedModules}/${course.totalModules}</span>
                                        <span>Assignments: ${course.completedAssignments}/${course.assignments}</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${course.progress}%"></div>
                                    </div>
                                </div>
                                
                                <div class="course-actions">
                                    <button class="btn btn-primary continue-learning" data-course-id="${course.id}">
                                        Continue Learning
                                    </button>
                                    <button class="btn btn-secondary download-materials">
                                        Download Materials
                                    </button>
                                </div>
                            ` : `
                                <div class="course-actions">
                                    <button class="btn btn-primary enroll-now" data-course-id="${course.id}">
                                        Enroll Now - Free
                                    </button>
                                    <button class="btn btn-secondary preview-course">
                                        Preview Course
                                    </button>
                                </div>
                            `}
                        </div>
                    </div>
                </div>

                <!-- Course Content Tabs -->
                <div class="course-content">
                    <div class="course-tabs">
                        <button class="tab-button active" data-tab="overview">Overview</button>
                        <button class="tab-button" data-tab="modules">Modules</button>
                        <button class="tab-button" data-tab="assignments">Assignments</button>
                        <button class="tab-button" data-tab="instructor">Instructor</button>
                    </div>

                    <div class="tab-content">
                        <!-- Overview Tab -->
                        <div class="tab-panel active" id="overview-panel">
                            <div class="overview-content">
                                <h3>Course Overview</h3>
                                ${course.longDescription}
                                
                                <div class="course-features">
                                    <h4>Course Features</h4>
                                    <div class="features-grid">
                                        <div class="feature-item">
                                            <span class="feature-icon">📚</span>
                                            <span>${course.totalModules} Modules</span>
                                        </div>
                                        <div class="feature-item">
                                            <span class="feature-icon">📝</span>
                                            <span>${course.assignments} Assignments</span>
                                        </div>
                                        <div class="feature-item">
                                            <span class="feature-icon">⏱️</span>
                                            <span>${course.estimatedTime}</span>
                                        </div>
                                        <div class="feature-item">
                                            <span class="feature-icon">🏆</span>
                                            <span>Certificate Included</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="prerequisites">
                                    <h4>Prerequisites</h4>
                                    <p>${course.prerequisites}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Modules Tab -->
                        <div class="tab-panel" id="modules-panel">
                            <div class="modules-list">
                                <h3>Course Modules</h3>
                                ${this.renderModulesList(course.modules)}
                            </div>
                        </div>

                        <!-- Assignments Tab -->
                        <div class="tab-panel" id="assignments-panel">
                            <div class="assignments-list">
                                <h3>Assignments</h3>
                                ${this.renderAssignmentsList(course.assignments)}
                            </div>
                        </div>

                        <!-- Instructor Tab -->
                        <div class="tab-panel" id="instructor-panel">
                            <div class="instructor-info">
                                ${this.renderInstructorInfo(course.instructor)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderModulesList(modules) {
        return modules.map((module, index) => `
            <div class="module-item ${module.completed ? 'completed' : ''} ${module.current ? 'current' : ''}">
                <div class="module-header">
                    <div class="module-number">${index + 1}</div>
                    <div class="module-info">
                        <h4 class="module-title">${module.title}</h4>
                        <p class="module-description">${module.description}</p>
                        <div class="module-meta">
                            <span class="duration">⏱️ ${module.duration}</span>
                            <span class="lessons">📚 ${module.lessons} lessons</span>
                            <span class="materials">📄 ${module.materials.join(', ')}</span>
                        </div>
                    </div>
                    <div class="module-status">
                        ${module.completed ?
                            '<span class="status-badge completed">✓ Completed</span>' :
                            module.current ?
                                '<span class="status-badge current">📍 Current</span>' :
                                '<span class="status-badge pending">⏳ Pending</span>'
                        }
                    </div>
                </div>

                ${module.completed || module.current ? `
                    <div class="module-actions">
                        <button class="btn btn-sm btn-primary" data-module-id="${module.id}">
                            ${module.completed ? 'Review Module' : 'Continue Module'}
                        </button>
                        ${module.quiz ? '<button class="btn btn-sm btn-secondary">Take Quiz</button>' : ''}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    renderAssignmentsList(assignments) {
        return assignments.map(assignment => `
            <div class="assignment-item ${assignment.status}">
                <div class="assignment-header">
                    <div class="assignment-info">
                        <h4 class="assignment-title">${assignment.title}</h4>
                        <p class="assignment-description">${assignment.description}</p>
                        <div class="assignment-meta">
                            <span class="due-date">📅 Due: ${new Date(assignment.dueDate).toLocaleDateString()}</span>
                            <span class="points">🎯 ${assignment.points} points</span>
                            ${assignment.grade ? `<span class="grade">📊 Grade: ${assignment.grade}</span>` : ''}
                        </div>
                    </div>
                    <div class="assignment-status">
                        ${assignment.status === 'submitted' ?
                            '<span class="status-badge submitted">✓ Submitted</span>' :
                            assignment.status === 'graded' ?
                                '<span class="status-badge graded">📊 Graded</span>' :
                                '<span class="status-badge pending">⏳ Pending</span>'
                        }
                    </div>
                </div>

                <div class="assignment-actions">
                    ${assignment.status === 'pending' ?
                        `<button class="btn btn-primary" data-assignment-id="${assignment.id}">Start Assignment</button>` :
                        `<button class="btn btn-secondary" data-assignment-id="${assignment.id}">View Submission</button>`
                    }
                </div>
            </div>
        `).join('');
    }

    renderInstructorInfo(instructor) {
        return `
            <div class="instructor-profile">
                <div class="instructor-header">
                    <img src="${instructor.avatar}" alt="${instructor.name}" class="instructor-avatar">
                    <div class="instructor-details">
                        <h3 class="instructor-name">${instructor.name}</h3>
                        <p class="instructor-title">${instructor.title}</p>
                        <div class="instructor-credentials">
                            ${instructor.credentials.map(cred => `<span class="credential">${cred}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <div class="instructor-bio">
                    <h4>About the Instructor</h4>
                    <p>${instructor.bio}</p>
                </div>

                <div class="instructor-actions">
                    <button class="btn btn-secondary">Message Instructor</button>
                    <button class="btn btn-secondary">View Profile</button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Back button
        const backButton = document.getElementById('back-to-courses');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.goBackToCourses();
            });
        }

        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Course actions
        this.setupCourseActions();
    }

    setupCourseActions() {
        const courseDetail = document.querySelector('.course-detail');
        if (!courseDetail) return;

        courseDetail.addEventListener('click', (e) => {
            if (e.target.classList.contains('continue-learning')) {
                this.continueLearning();
            } else if (e.target.classList.contains('enroll-now')) {
                this.enrollInCourse();
            } else if (e.target.classList.contains('preview-course')) {
                this.previewCourse();
            } else if (e.target.dataset.moduleId) {
                this.openModule(e.target.dataset.moduleId);
            } else if (e.target.dataset.assignmentId) {
                this.openAssignment(e.target.dataset.assignmentId);
            }
        });
    }

    switchTab(tabName) {
        // Remove active class from all tabs and panels
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

        // Add active class to selected tab and panel
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-panel`).classList.add('active');
    }

    goBackToCourses() {
        // Navigate back to courses list
        window.app.navigateToSection('courses');
    }

    continueLearning() {
        const currentModule = this.currentCourse.modules.find(m => m.current);
        if (currentModule) {
            this.openModule(currentModule.id);
        } else {
            alert('Continue learning from where you left off!');
        }
    }

    enrollInCourse() {
        // Simulate enrollment
        this.currentCourse.enrolled = true;
        this.currentCourse.progress = 0;
        this.renderCourseDetailPage();
        alert(`Successfully enrolled in "${this.currentCourse.title}"!`);
    }

    previewCourse() {
        alert('Course preview will be available soon!');
    }

    openModule(moduleId) {
        const module = this.currentCourse.modules.find(m => m.id === moduleId);
        if (module) {
            alert(`Opening module: "${module.title}". Module content will be implemented next.`);
        }
    }

    openAssignment(assignmentId) {
        const assignment = this.currentCourse.assignments.find(a => a.id === assignmentId);
        if (assignment) {
            alert(`Opening assignment: "${assignment.title}". Assignment interface will be implemented next.`);
        }
    }

    showError(message) {
        console.error(message);
        // TODO: Implement proper error display
    }

    destroy() {
        // Cleanup event listeners
        console.log('Course detail module destroyed');
    }
}
