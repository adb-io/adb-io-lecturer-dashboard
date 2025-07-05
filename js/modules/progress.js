/**
 * ADB-IO Student Portal - Progress Tracking Module
 * Green Computing: Efficient progress monitoring with minimal resource usage
 */

export default class Progress {
    constructor(user) {
        this.user = user;
        this.progressData = {};
        this.achievements = [];
        this.learningPath = [];
        this.init();
    }

    async init() {
        try {
            await this.loadProgressData();
            this.renderProgressPage();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize progress tracking:', error);
            this.showError('Failed to load progress data');
        }
    }

    async loadProgressData() {
        try {
            const [progress, achievements, learningPath] = await Promise.all([
                this.loadOverallProgress(),
                this.loadAchievements(),
                this.loadLearningPath()
            ]);

            this.progressData = progress;
            this.achievements = achievements;
            this.learningPath = learningPath;

            return { progress, achievements, learningPath };
        } catch (error) {
            console.error('Error loading progress data:', error);
            throw error;
        }
    }

    async loadOverallProgress() {
        // Mock data - replace with actual API call
        return {
            overall: {
                percentage: 75,
                totalCourses: 5,
                completedCourses: 2,
                inProgressCourses: 3,
                totalHours: 124.5,
                completedHours: 93.2,
                averageGrade: 87.5,
                streak: 12
            },
            courses: [
                {
                    id: 1,
                    name: 'JavaScript Fundamentals',
                    progress: 90,
                    grade: 92,
                    timeSpent: 28.5,
                    status: 'in-progress',
                    lastActivity: '2024-01-20'
                },
                {
                    id: 2,
                    name: 'Data Structures',
                    progress: 65,
                    grade: 85,
                    timeSpent: 22.3,
                    status: 'in-progress',
                    lastActivity: '2024-01-19'
                },
                {
                    id: 3,
                    name: 'Web Development',
                    progress: 55,
                    grade: 88,
                    timeSpent: 18.7,
                    status: 'in-progress',
                    lastActivity: '2024-01-18'
                },
                {
                    id: 4,
                    name: 'Database Design',
                    progress: 100,
                    grade: 94,
                    timeSpent: 15.2,
                    status: 'completed',
                    lastActivity: '2024-01-15'
                },
                {
                    id: 5,
                    name: 'Algorithms',
                    progress: 100,
                    grade: 89,
                    timeSpent: 32.0,
                    status: 'completed',
                    lastActivity: '2024-01-10'
                }
            ],
            weekly: [
                { week: 'Week 1', hours: 8.5, completed: 3 },
                { week: 'Week 2', hours: 12.2, completed: 5 },
                { week: 'Week 3', hours: 15.8, completed: 7 },
                { week: 'Week 4', hours: 18.3, completed: 8 },
                { week: 'Week 5', hours: 14.7, completed: 6 },
                { week: 'Week 6', hours: 16.9, completed: 9 },
                { week: 'Week 7', hours: 17.3, completed: 8 }
            ],
            skills: [
                { name: 'JavaScript', level: 85, category: 'Programming' },
                { name: 'Problem Solving', level: 78, category: 'Cognitive' },
                { name: 'Web Development', level: 72, category: 'Technical' },
                { name: 'Database Design', level: 88, category: 'Technical' },
                { name: 'Algorithms', level: 80, category: 'Computer Science' }
            ]
        };
    }

    async loadAchievements() {
        // Mock data - replace with actual API call
        return [
            {
                id: 1,
                title: 'First Course Completed',
                description: 'Complete your first course',
                icon: '🎓',
                earned: true,
                earnedDate: '2024-01-10',
                category: 'milestone'
            },
            {
                id: 2,
                title: 'Perfect Score',
                description: 'Get 100% on an assignment',
                icon: '💯',
                earned: true,
                earnedDate: '2024-01-12',
                category: 'achievement'
            },
            {
                id: 3,
                title: 'Study Streak',
                description: 'Study for 7 consecutive days',
                icon: '🔥',
                earned: true,
                earnedDate: '2024-01-15',
                category: 'habit'
            },
            {
                id: 4,
                title: 'Quick Learner',
                description: 'Complete a course in under 2 weeks',
                icon: '⚡',
                earned: true,
                earnedDate: '2024-01-18',
                category: 'speed'
            },
            {
                id: 5,
                title: 'Green Champion',
                description: 'Save 5kg of CO2 through efficient learning',
                icon: '🌱',
                earned: false,
                progress: 46,
                category: 'sustainability'
            },
            {
                id: 6,
                title: 'Master Student',
                description: 'Complete 10 courses',
                icon: '👑',
                earned: false,
                progress: 20,
                category: 'milestone'
            }
        ];
    }

    async loadLearningPath() {
        // Mock data - replace with actual API call
        return [
            {
                id: 1,
                title: 'Web Development Fundamentals',
                description: 'Master the basics of web development',
                courses: ['HTML/CSS', 'JavaScript', 'React'],
                progress: 67,
                estimatedTime: '12 weeks',
                difficulty: 'beginner'
            },
            {
                id: 2,
                title: 'Computer Science Core',
                description: 'Essential computer science concepts',
                courses: ['Data Structures', 'Algorithms', 'Database Design'],
                progress: 78,
                estimatedTime: '16 weeks',
                difficulty: 'intermediate'
            },
            {
                id: 3,
                title: 'Advanced Programming',
                description: 'Advanced programming concepts and patterns',
                courses: ['Design Patterns', 'System Design', 'Performance Optimization'],
                progress: 0,
                estimatedTime: '20 weeks',
                difficulty: 'advanced'
            }
        ];
    }

    renderProgressPage() {
        const progressSection = document.getElementById('progress');
        if (!progressSection) return;

        const progressHTML = `
            <div class="section-header">
                <h1 class="section-title">Progress Tracking</h1>
                <p class="section-subtitle">Monitor your learning journey and achievements.</p>
            </div>

            ${this.renderProgressOverview()}
            ${this.renderProgressCharts()}
            ${this.renderAchievements()}
            ${this.renderLearningPaths()}
        `;

        progressSection.innerHTML = progressHTML;
    }

    renderProgressOverview() {
        const { overall } = this.progressData;
        
        return `
            <div class="progress-overview">
                <div class="progress-stat-card">
                    <div class="progress-stat-card__icon">📊</div>
                    <div class="progress-stat-card__content">
                        <h3>Overall Progress</h3>
                        <div class="progress-circle" data-percentage="${overall.percentage}">
                            <span class="progress-circle__value">${overall.percentage}%</span>
                        </div>
                    </div>
                </div>

                <div class="progress-stat-card">
                    <div class="progress-stat-card__icon">📚</div>
                    <div class="progress-stat-card__content">
                        <h3>Courses</h3>
                        <p class="stat-value">${overall.completedCourses}/${overall.totalCourses}</p>
                        <p class="stat-label">Completed</p>
                    </div>
                </div>

                <div class="progress-stat-card">
                    <div class="progress-stat-card__icon">⏱️</div>
                    <div class="progress-stat-card__content">
                        <h3>Study Time</h3>
                        <p class="stat-value">${overall.completedHours}h</p>
                        <p class="stat-label">Total Hours</p>
                    </div>
                </div>

                <div class="progress-stat-card">
                    <div class="progress-stat-card__icon">🎯</div>
                    <div class="progress-stat-card__content">
                        <h3>Average Grade</h3>
                        <p class="stat-value">${overall.averageGrade}%</p>
                        <p class="stat-label">Across all courses</p>
                    </div>
                </div>

                <div class="progress-stat-card">
                    <div class="progress-stat-card__icon">🔥</div>
                    <div class="progress-stat-card__content">
                        <h3>Study Streak</h3>
                        <p class="stat-value">${overall.streak}</p>
                        <p class="stat-label">Days in a row</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderProgressCharts() {
        return `
            <div class="progress-charts">
                <div class="progress-chart">
                    <h3 class="progress-chart__title">Course Progress</h3>
                    <div class="course-progress-list">
                        ${this.progressData.courses.map(course => `
                            <div class="course-progress-item">
                                <div class="course-progress-info">
                                    <span class="course-name">${course.name}</span>
                                    <span class="course-grade">Grade: ${course.grade}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${course.progress}%"></div>
                                </div>
                                <span class="progress-percentage">${course.progress}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="progress-chart">
                    <h3 class="progress-chart__title">Weekly Activity</h3>
                    <div class="weekly-chart">
                        ${this.progressData.weekly.map(week => `
                            <div class="weekly-bar">
                                <div class="weekly-bar__fill" style="height: ${(week.hours / 20) * 100}%"></div>
                                <span class="weekly-bar__label">${week.week}</span>
                                <span class="weekly-bar__value">${week.hours}h</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="progress-chart">
                    <h3 class="progress-chart__title">Skill Development</h3>
                    <div class="skills-chart">
                        ${this.progressData.skills.map(skill => `
                            <div class="skill-item">
                                <div class="skill-info">
                                    <span class="skill-name">${skill.name}</span>
                                    <span class="skill-category">${skill.category}</span>
                                </div>
                                <div class="skill-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${skill.level}%"></div>
                                    </div>
                                    <span class="skill-level">${skill.level}%</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderAchievements() {
        const earnedAchievements = this.achievements.filter(a => a.earned);
        const unlockedAchievements = this.achievements.filter(a => !a.earned);

        return `
            <div class="achievements-section">
                <h2 class="dashboard-section__title">🏆 Achievements</h2>
                
                <div class="achievements-tabs">
                    <button class="achievements-tab active" data-tab="earned">
                        Earned (${earnedAchievements.length})
                    </button>
                    <button class="achievements-tab" data-tab="available">
                        Available (${unlockedAchievements.length})
                    </button>
                </div>

                <div class="achievements-content">
                    <div class="achievements-grid" data-tab-content="earned">
                        ${earnedAchievements.map(achievement => this.renderAchievementBadge(achievement)).join('')}
                    </div>
                    
                    <div class="achievements-grid hidden" data-tab-content="available">
                        ${unlockedAchievements.map(achievement => this.renderAchievementBadge(achievement)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderAchievementBadge(achievement) {
        const earnedClass = achievement.earned ? 'achievement-badge--earned' : '';
        const progressBar = !achievement.earned && achievement.progress ? `
            <div class="achievement-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${achievement.progress}%"></div>
                </div>
                <span class="progress-text">${achievement.progress}%</span>
            </div>
        ` : '';

        return `
            <div class="achievement-badge ${earnedClass}" data-achievement-id="${achievement.id}">
                <div class="achievement-badge__icon">${achievement.icon}</div>
                <h4 class="achievement-badge__title">${achievement.title}</h4>
                <p class="achievement-badge__description">${achievement.description}</p>
                ${progressBar}
                ${achievement.earned ? `<div class="achievement-date">Earned: ${achievement.earnedDate}</div>` : ''}
            </div>
        `;
    }

    renderLearningPaths() {
        return `
            <div class="learning-paths-section">
                <h2 class="dashboard-section__title">🛤️ Learning Paths</h2>
                <div class="learning-paths-grid">
                    ${this.learningPath.map(path => `
                        <div class="learning-path-card" data-path-id="${path.id}">
                            <div class="learning-path-header">
                                <h3 class="learning-path-title">${path.title}</h3>
                                <span class="learning-path-difficulty ${path.difficulty}">${path.difficulty}</span>
                            </div>
                            <p class="learning-path-description">${path.description}</p>
                            
                            <div class="learning-path-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${path.progress}%"></div>
                                </div>
                                <span class="progress-percentage">${path.progress}%</span>
                            </div>
                            
                            <div class="learning-path-courses">
                                <strong>Courses:</strong> ${path.courses.join(', ')}
                            </div>
                            
                            <div class="learning-path-meta">
                                <span class="estimated-time">📅 ${path.estimatedTime}</span>
                            </div>
                            
                            <button class="btn btn--primary" data-action="continue-path" data-path-id="${path.id}">
                                ${path.progress > 0 ? 'Continue Path' : 'Start Path'}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Achievement tabs
        document.addEventListener('click', (e) => {
            if (e.target.matches('.achievements-tab')) {
                const tab = e.target.getAttribute('data-tab');
                this.switchAchievementTab(tab);
            }
        });

        // Learning path actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="continue-path"]')) {
                const pathId = e.target.getAttribute('data-path-id');
                this.continueLearningPath(pathId);
            }
        });
    }

    switchAchievementTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.achievements-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('[data-tab-content]').forEach(content => {
            content.classList.add('hidden');
        });
        document.querySelector(`[data-tab-content="${tab}"]`).classList.remove('hidden');
    }

    async continueLearningPath(pathId) {
        try {
            const path = this.learningPath.find(p => p.id == pathId);
            if (!path) return;

            console.log(`Continuing learning path: ${path.title}`);
            this.showSuccess(`Continuing ${path.title}...`);
            
        } catch (error) {
            console.error('Failed to continue learning path:', error);
            this.showError('Failed to continue learning path');
        }
    }

    // Utility methods
    showSuccess(message) {
        console.log('Success:', message);
    }

    showError(message) {
        console.error('Error:', message);
    }

    async refresh() {
        try {
            await this.loadProgressData();
            this.renderProgressPage();
            this.showSuccess('Progress data refreshed successfully');
        } catch (error) {
            console.error('Failed to refresh progress data:', error);
            this.showError('Failed to refresh progress data');
        }
    }

    destroy() {
        // Clean up event listeners and resources
    }
}
