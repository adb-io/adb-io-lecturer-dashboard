/**
 * ADB-IO Student Portal - Course Progress Tracking Module
 * Green Computing: Efficient progress tracking with minimal resource usage
 */

export default class CourseProgress {
    constructor(user) {
        this.user = user;
        this.progressData = {};
        this.achievements = [];
        this.studyStreak = 0;
        this.weeklyGoals = {};
        this.analytics = {};
    }

    async init() {
        try {
            await this.loadProgressData();
            this.renderProgressDashboard();
            this.setupEventListeners();
            this.calculateAnalytics();
        } catch (error) {
            console.error('Failed to initialize course progress:', error);
            this.showError('Failed to load progress data');
        }
    }

    async loadProgressData() {
        // Mock progress data - in real app, this would come from API
        this.progressData = {
            overallProgress: 68,
            totalCourses: 6,
            enrolledCourses: 3,
            completedCourses: 1,
            totalModules: 45,
            completedModules: 28,
            totalAssignments: 24,
            completedAssignments: 16,
            totalStudyTime: 156, // hours
            thisWeekStudyTime: 12,
            studyStreak: 15, // days
            longestStreak: 23,
            courses: [
                {
                    id: 'course_001',
                    title: 'Introduction to Digital Business',
                    progress: 75,
                    modules: 12,
                    completedModules: 9,
                    assignments: 8,
                    completedAssignments: 6,
                    studyTime: 45,
                    lastAccessed: '2025-07-05',
                    status: 'active',
                    grade: 'A-',
                    weeklyProgress: [65, 68, 70, 72, 75] // Last 5 weeks
                },
                {
                    id: 'course_002',
                    title: 'Data Analytics for Business',
                    progress: 45,
                    modules: 15,
                    completedModules: 7,
                    assignments: 12,
                    completedAssignments: 5,
                    studyTime: 38,
                    lastAccessed: '2025-07-04',
                    status: 'active',
                    grade: 'B+',
                    weeklyProgress: [20, 25, 32, 38, 45]
                },
                {
                    id: 'course_003',
                    title: 'Digital Marketing Strategy',
                    progress: 100,
                    modules: 10,
                    completedModules: 10,
                    assignments: 6,
                    completedAssignments: 6,
                    studyTime: 28,
                    lastAccessed: '2025-07-03',
                    status: 'completed',
                    grade: 'A',
                    weeklyProgress: [85, 90, 95, 98, 100],
                    completedDate: '2025-07-03',
                    certificate: true
                }
            ],
            weeklyActivity: [
                { day: 'Mon', hours: 2.5, modules: 2 },
                { day: 'Tue', hours: 1.8, modules: 1 },
                { day: 'Wed', hours: 3.2, modules: 3 },
                { day: 'Thu', hours: 2.1, modules: 2 },
                { day: 'Fri', hours: 1.5, modules: 1 },
                { day: 'Sat', hours: 0.8, modules: 1 },
                { day: 'Sun', hours: 0.1, modules: 0 }
            ],
            monthlyProgress: [
                { month: 'Jan', completed: 5 },
                { month: 'Feb', completed: 8 },
                { month: 'Mar', completed: 12 },
                { month: 'Apr', completed: 15 },
                { month: 'May', completed: 20 },
                { month: 'Jun', completed: 25 },
                { month: 'Jul', completed: 28 }
            ]
        };

        this.achievements = [
            {
                id: 'first_course',
                title: 'First Steps',
                description: 'Complete your first course',
                icon: '🎯',
                earned: true,
                earnedDate: '2025-07-03',
                points: 100
            },
            {
                id: 'study_streak_7',
                title: 'Week Warrior',
                description: 'Study for 7 consecutive days',
                icon: '🔥',
                earned: true,
                earnedDate: '2025-06-28',
                points: 50
            },
            {
                id: 'study_streak_30',
                title: 'Month Master',
                description: 'Study for 30 consecutive days',
                icon: '🏆',
                earned: false,
                progress: 15,
                target: 30,
                points: 200
            },
            {
                id: 'perfect_score',
                title: 'Perfectionist',
                description: 'Get 100% on 5 assignments',
                icon: '⭐',
                earned: false,
                progress: 2,
                target: 5,
                points: 150
            },
            {
                id: 'early_bird',
                title: 'Early Bird',
                description: 'Complete 10 modules before deadline',
                icon: '🌅',
                earned: true,
                earnedDate: '2025-06-15',
                points: 75
            }
        ];

        this.weeklyGoals = {
            studyHours: { target: 15, current: 12 },
            modulesCompleted: { target: 8, current: 10 },
            assignmentsSubmitted: { target: 3, current: 2 }
        };
    }

    renderProgressDashboard() {
        const coursesSection = document.getElementById('courses');
        if (!coursesSection) return;

        coursesSection.innerHTML = `
            <div class="progress-dashboard">
                <!-- Header -->
                <div class="progress-header">
                    <h2>Learning Progress</h2>
                    <p>Track your learning journey and achievements</p>
                </div>

                <!-- Overview Stats -->
                <div class="progress-overview">
                    <div class="stat-card">
                        <div class="stat-icon">📚</div>
                        <div class="stat-content">
                            <h3>${this.progressData.overallProgress}%</h3>
                            <p>Overall Progress</p>
                        </div>
                        <div class="stat-chart">
                            <div class="circular-progress" data-progress="${this.progressData.overallProgress}">
                                <svg viewBox="0 0 36 36">
                                    <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                    <path class="circle" stroke-dasharray="${this.progressData.overallProgress}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-content">
                            <h3>${this.progressData.completedCourses}/${this.progressData.enrolledCourses}</h3>
                            <p>Courses Completed</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">📖</div>
                        <div class="stat-content">
                            <h3>${this.progressData.completedModules}/${this.progressData.totalModules}</h3>
                            <p>Modules Completed</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">🔥</div>
                        <div class="stat-content">
                            <h3>${this.progressData.studyStreak}</h3>
                            <p>Day Study Streak</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">⏱️</div>
                        <div class="stat-content">
                            <h3>${this.progressData.totalStudyTime}h</h3>
                            <p>Total Study Time</p>
                        </div>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="progress-content">
                    <!-- Course Progress -->
                    <div class="progress-section">
                        <h3>Course Progress</h3>
                        <div class="course-progress-list">
                            ${this.renderCourseProgressList()}
                        </div>
                    </div>

                    <!-- Weekly Goals -->
                    <div class="progress-section">
                        <h3>Weekly Goals</h3>
                        <div class="weekly-goals">
                            ${this.renderWeeklyGoals()}
                        </div>
                    </div>

                    <!-- Study Activity Chart -->
                    <div class="progress-section full-width">
                        <h3>Weekly Study Activity</h3>
                        <div class="activity-chart">
                            ${this.renderActivityChart()}
                        </div>
                    </div>

                    <!-- Achievements -->
                    <div class="progress-section">
                        <h3>Achievements</h3>
                        <div class="achievements-grid">
                            ${this.renderAchievements()}
                        </div>
                    </div>

                    <!-- Learning Analytics -->
                    <div class="progress-section">
                        <h3>Learning Insights</h3>
                        <div class="analytics-cards">
                            ${this.renderAnalytics()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Initialize charts and animations
        this.initializeCharts();
    }

    renderCourseProgressList() {
        return this.progressData.courses.map(course => `
            <div class="course-progress-item ${course.status}">
                <div class="course-info">
                    <h4>${course.title}</h4>
                    <div class="course-meta">
                        <span class="grade">Grade: ${course.grade}</span>
                        <span class="last-accessed">Last: ${new Date(course.lastAccessed).toLocaleDateString()}</span>
                    </div>
                </div>
                
                <div class="progress-details">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${course.progress}%"></div>
                        <span class="progress-text">${course.progress}%</span>
                    </div>
                    
                    <div class="progress-stats">
                        <span>📚 ${course.completedModules}/${course.modules} modules</span>
                        <span>📝 ${course.completedAssignments}/${course.assignments} assignments</span>
                        <span>⏱️ ${course.studyTime}h studied</span>
                    </div>
                </div>

                ${course.status === 'completed' ? `
                    <div class="completion-badge">
                        <span class="badge completed">✓ Completed</span>
                        ${course.certificate ? '<span class="badge certificate">🏆 Certificate</span>' : ''}
                    </div>
                ` : `
                    <div class="course-actions">
                        <button class="btn btn-primary btn-sm" data-course-id="${course.id}">
                            Continue
                        </button>
                    </div>
                `}
            </div>
        `).join('');
    }

    renderWeeklyGoals() {
        return Object.entries(this.weeklyGoals).map(([key, goal]) => {
            const percentage = Math.min((goal.current / goal.target) * 100, 100);
            const isCompleted = goal.current >= goal.target;
            
            return `
                <div class="goal-item ${isCompleted ? 'completed' : ''}">
                    <div class="goal-header">
                        <span class="goal-title">${this.getGoalTitle(key)}</span>
                        <span class="goal-progress">${goal.current}/${goal.target}</span>
                    </div>
                    <div class="goal-bar">
                        <div class="goal-fill" style="width: ${percentage}%"></div>
                    </div>
                    ${isCompleted ? '<div class="goal-badge">🎯 Goal Achieved!</div>' : ''}
                </div>
            `;
        }).join('');
    }

    getGoalTitle(key) {
        const titles = {
            studyHours: 'Study Hours',
            modulesCompleted: 'Modules Completed',
            assignmentsSubmitted: 'Assignments Submitted'
        };
        return titles[key] || key;
    }

    renderActivityChart() {
        const maxHours = Math.max(...this.progressData.weeklyActivity.map(d => d.hours));

        return `
            <div class="chart-container">
                <div class="chart-bars">
                    ${this.progressData.weeklyActivity.map(day => {
                        const height = (day.hours / maxHours) * 100;
                        return `
                            <div class="chart-bar-container">
                                <div class="chart-bar" style="height: ${height}%" data-value="${day.hours}h">
                                    <div class="bar-fill"></div>
                                </div>
                                <span class="chart-label">${day.day}</span>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="chart-summary">
                    <div class="summary-item">
                        <span class="summary-label">This Week:</span>
                        <span class="summary-value">${this.progressData.thisWeekStudyTime}h</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Average:</span>
                        <span class="summary-value">${(this.progressData.thisWeekStudyTime / 7).toFixed(1)}h/day</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderAchievements() {
        return this.achievements.map(achievement => `
            <div class="achievement-card ${achievement.earned ? 'earned' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-content">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>

                    ${achievement.earned ? `
                        <div class="achievement-earned">
                            <span class="earned-date">Earned: ${new Date(achievement.earnedDate).toLocaleDateString()}</span>
                            <span class="points">+${achievement.points} points</span>
                        </div>
                    ` : achievement.progress !== undefined ? `
                        <div class="achievement-progress">
                            <div class="progress-bar mini">
                                <div class="progress-fill" style="width: ${(achievement.progress / achievement.target) * 100}%"></div>
                            </div>
                            <span class="progress-text">${achievement.progress}/${achievement.target}</span>
                        </div>
                    ` : `
                        <div class="achievement-locked">
                            <span class="locked-text">🔒 Locked</span>
                        </div>
                    `}
                </div>
            </div>
        `).join('');
    }

    renderAnalytics() {
        const analytics = this.calculateAnalytics();

        return `
            <div class="analytics-card">
                <div class="analytics-icon">📊</div>
                <div class="analytics-content">
                    <h4>Study Efficiency</h4>
                    <p>You complete an average of <strong>${analytics.modulesPerHour}</strong> modules per hour</p>
                </div>
            </div>

            <div class="analytics-card">
                <div class="analytics-icon">🎯</div>
                <div class="analytics-content">
                    <h4>Consistency Score</h4>
                    <p>Your study consistency is <strong>${analytics.consistencyScore}%</strong> this month</p>
                </div>
            </div>

            <div class="analytics-card">
                <div class="analytics-icon">📈</div>
                <div class="analytics-content">
                    <h4>Learning Velocity</h4>
                    <p>You're learning <strong>${analytics.learningVelocity}%</strong> faster than last month</p>
                </div>
            </div>

            <div class="analytics-card">
                <div class="analytics-icon">🏆</div>
                <div class="analytics-content">
                    <h4>Achievement Rate</h4>
                    <p><strong>${analytics.achievementRate}%</strong> of available achievements earned</p>
                </div>
            </div>
        `;
    }

    calculateAnalytics() {
        const totalStudyTime = this.progressData.totalStudyTime;
        const completedModules = this.progressData.completedModules;
        const modulesPerHour = (completedModules / totalStudyTime).toFixed(1);

        // Calculate consistency score based on study streak
        const consistencyScore = Math.min((this.progressData.studyStreak / 30) * 100, 100).toFixed(0);

        // Mock learning velocity calculation
        const learningVelocity = 15; // 15% faster than last month

        // Calculate achievement rate
        const earnedAchievements = this.achievements.filter(a => a.earned).length;
        const achievementRate = ((earnedAchievements / this.achievements.length) * 100).toFixed(0);

        return {
            modulesPerHour,
            consistencyScore,
            learningVelocity,
            achievementRate
        };
    }

    initializeCharts() {
        // Animate circular progress
        const circularProgress = document.querySelector('.circular-progress');
        if (circularProgress) {
            setTimeout(() => {
                circularProgress.classList.add('animated');
            }, 500);
        }

        // Animate chart bars
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('animated');
            }, 100 * index);
        });

        // Animate progress bars
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('animated');
            }, 200 * index);
        });
    }

    setupEventListeners() {
        // Course continue buttons
        const progressDashboard = document.querySelector('.progress-dashboard');
        if (progressDashboard) {
            progressDashboard.addEventListener('click', (e) => {
                if (e.target.dataset.courseId) {
                    this.continueCourse(e.target.dataset.courseId);
                }
            });
        }

        // Chart bar hover effects
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach(bar => {
            bar.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.value);
            });

            bar.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    continueCourse(courseId) {
        const course = this.progressData.courses.find(c => c.id === courseId);
        if (course) {
            console.log(`Continuing course: ${course.title}`);
            // Navigate to course detail
            if (window.app && window.app.modules && window.app.modules.courseDetail) {
                window.app.modules.courseDetail.init(courseId);
            } else {
                alert(`Continuing "${course.title}". Course detail will be loaded.`);
            }
        }
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'chart-tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 0.5rem;
            font-size: 0.8rem;
            z-index: 1000;
            pointer-events: none;
        `;

        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - 40) + 'px';

        document.body.appendChild(tooltip);
    }

    hideTooltip() {
        const tooltip = document.querySelector('.chart-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    showError(message) {
        console.error(message);
        // TODO: Implement proper error display
    }

    destroy() {
        // Cleanup event listeners
        console.log('Course progress module destroyed');
    }
}
