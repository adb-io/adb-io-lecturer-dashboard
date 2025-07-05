/**
 * ADB-IO Student Portal - Assignments Module
 * Green Computing: Efficient assignment management with minimal resource usage
 */

export default class Assignments {
    constructor(user) {
        this.user = user;
        this.assignments = [];
        this.filteredAssignments = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.currentAssignment = null;
    }

    async init() {
        try {
            await this.loadAssignments();
            this.renderAssignmentsPage();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize assignments:', error);
            this.showError('Failed to load assignments');
        }
    }

    async loadAssignments() {
        try {
            // Mock assignment data for development
            this.assignments = [
                {
                    id: 'assignment_001',
                    title: 'Digital Business Strategy Analysis',
                    description: 'Analyze a real-world digital transformation case study and present your findings.',
                    courseId: 'course_001',
                    courseName: 'Introduction to Digital Business',
                    type: 'essay',
                    dueDate: '2025-07-20T23:59:00Z',
                    submittedDate: null,
                    status: 'pending',
                    maxPoints: 100,
                    earnedPoints: null,
                    instructions: `
                        <h4>Assignment Instructions:</h4>
                        <ol>
                            <li>Choose a company that has undergone digital transformation</li>
                            <li>Research their transformation journey (2-3 years)</li>
                            <li>Analyze the strategies, challenges, and outcomes</li>
                            <li>Present your findings in a 2000-word report</li>
                            <li>Include at least 5 credible sources</li>
                        </ol>
                        <h4>Submission Requirements:</h4>
                        <ul>
                            <li>PDF format only</li>
                            <li>Maximum file size: 10MB</li>
                            <li>Include bibliography</li>
                            <li>Use APA citation style</li>
                        </ul>
                    `,
                    allowedFileTypes: ['pdf'],
                    maxFileSize: 10485760, // 10MB
                    submissionHistory: [],
                    feedback: null,
                    rubric: {
                        criteria: [
                            { name: 'Research Quality', points: 25, description: 'Depth and credibility of research' },
                            { name: 'Analysis', points: 30, description: 'Quality of strategic analysis' },
                            { name: 'Writing Quality', points: 25, description: 'Clarity and organization' },
                            { name: 'Citations', points: 20, description: 'Proper use of sources and citations' }
                        ]
                    }
                },
                {
                    id: 'assignment_002',
                    title: 'Data Analytics Dashboard Project',
                    description: 'Create an interactive dashboard using business data.',
                    courseId: 'course_002',
                    courseName: 'Data Analytics for Business',
                    type: 'project',
                    dueDate: '2025-07-25T23:59:00Z',
                    submittedDate: '2025-07-03T14:30:00Z',
                    status: 'submitted',
                    maxPoints: 150,
                    earnedPoints: 135,
                    instructions: `
                        <h4>Project Requirements:</h4>
                        <ol>
                            <li>Use provided dataset or find your own business dataset</li>
                            <li>Create interactive visualizations</li>
                            <li>Include at least 5 different chart types</li>
                            <li>Provide insights and recommendations</li>
                            <li>Submit both dashboard file and presentation</li>
                        </ol>
                    `,
                    allowedFileTypes: ['zip', 'pdf', 'pptx'],
                    maxFileSize: 52428800, // 50MB
                    submissionHistory: [
                        {
                            id: 'sub_001',
                            fileName: 'analytics_dashboard_project.zip',
                            fileSize: 15728640,
                            submittedAt: '2025-07-03T14:30:00Z',
                            status: 'graded'
                        }
                    ],
                    feedback: {
                        grade: 135,
                        comments: 'Excellent work! Great use of visualizations and insightful analysis.',
                        gradedAt: '2025-07-05T10:15:00Z',
                        gradedBy: 'Dr. Michael Chen'
                    }
                },
                {
                    id: 'assignment_003',
                    title: 'Green Computing Research Paper',
                    description: 'Research and write about sustainable computing practices.',
                    courseId: 'course_003',
                    courseName: 'Sustainable Technology',
                    type: 'research',
                    dueDate: '2025-07-30T23:59:00Z',
                    submittedDate: null,
                    status: 'draft',
                    maxPoints: 120,
                    earnedPoints: null,
                    instructions: `
                        <h4>Research Paper Guidelines:</h4>
                        <ol>
                            <li>Focus on green computing practices in organizations</li>
                            <li>Include case studies and real-world examples</li>
                            <li>Discuss environmental impact and benefits</li>
                            <li>Propose recommendations for implementation</li>
                            <li>3000-4000 words with proper citations</li>
                        </ol>
                    `,
                    allowedFileTypes: ['pdf', 'docx'],
                    maxFileSize: 20971520, // 20MB
                    submissionHistory: [],
                    feedback: null
                },
                {
                    id: 'assignment_004',
                    title: 'Weekly Quiz - Digital Marketing',
                    description: 'Multiple choice quiz covering digital marketing fundamentals.',
                    courseId: 'course_001',
                    courseName: 'Introduction to Digital Business',
                    type: 'quiz',
                    dueDate: '2025-07-15T23:59:00Z',
                    submittedDate: '2025-07-02T16:45:00Z',
                    status: 'graded',
                    maxPoints: 50,
                    earnedPoints: 42,
                    instructions: `
                        <h4>Quiz Instructions:</h4>
                        <ul>
                            <li>20 multiple choice questions</li>
                            <li>Time limit: 30 minutes</li>
                            <li>One attempt only</li>
                            <li>Covers modules 1-4 content</li>
                        </ul>
                    `,
                    allowedFileTypes: [],
                    maxFileSize: 0,
                    submissionHistory: [
                        {
                            id: 'sub_002',
                            submittedAt: '2025-07-02T16:45:00Z',
                            status: 'graded',
                            timeSpent: 1680 // seconds
                        }
                    ],
                    feedback: {
                        grade: 42,
                        comments: 'Good understanding of core concepts. Review social media marketing strategies.',
                        gradedAt: '2025-07-02T17:00:00Z',
                        gradedBy: 'Dr. Sarah Johnson'
                    }
                }
            ];

            this.filteredAssignments = [...this.assignments];
            console.log('Assignments loaded successfully');
        } catch (error) {
            console.error('Failed to load assignments:', error);
            throw error;
        }
    }

    renderAssignmentsPage() {
        const assignmentsSection = document.getElementById('assignments');
        if (!assignmentsSection) return;

        assignmentsSection.innerHTML = `
            <div class="section-header">
                <h1 class="section-title">Assignments</h1>
                <p class="section-subtitle">View and submit your assignments.</p>
            </div>

            <div class="assignments-container">
                <!-- Filters and Search -->
                <div class="assignments-filters">
                    <div class="filter-group">
                        <label for="assignment-status-filter">Status:</label>
                        <select id="assignment-status-filter" class="filter-select">
                            <option value="all">All Assignments</option>
                            <option value="pending">Pending</option>
                            <option value="draft">Draft</option>
                            <option value="submitted">Submitted</option>
                            <option value="graded">Graded</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label for="assignment-type-filter">Type:</label>
                        <select id="assignment-type-filter" class="filter-select">
                            <option value="all">All Types</option>
                            <option value="essay">Essay</option>
                            <option value="project">Project</option>
                            <option value="research">Research</option>
                            <option value="quiz">Quiz</option>
                        </select>
                    </div>

                    <div class="search-group">
                        <input type="text" id="assignment-search" placeholder="Search assignments..." class="search-input">
                        <button class="search-btn">🔍</button>
                    </div>
                </div>

                <!-- Assignment Stats -->
                <div class="assignment-stats">
                    <div class="stat-card">
                        <div class="stat-number">${this.getAssignmentCount('pending')}</div>
                        <div class="stat-label">Pending</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.getAssignmentCount('submitted')}</div>
                        <div class="stat-label">Submitted</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.getAssignmentCount('graded')}</div>
                        <div class="stat-label">Graded</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${this.getAverageGrade()}%</div>
                        <div class="stat-label">Average Grade</div>
                    </div>
                </div>

                <!-- Assignments Grid -->
                <div class="assignments-grid" id="assignments-grid">
                    ${this.renderAssignmentCards()}
                </div>
            </div>
        `;

        this.updateAssignmentsGrid();
    }

    renderAssignmentCards() {
        return this.filteredAssignments.map(assignment => {
            const dueDate = new Date(assignment.dueDate);
            const isOverdue = dueDate < new Date() && assignment.status === 'pending';
            const timeRemaining = this.getTimeRemaining(dueDate);
            
            return `
                <div class="assignment-card ${assignment.status} ${isOverdue ? 'overdue' : ''}" data-assignment-id="${assignment.id}">
                    <div class="assignment-header">
                        <h3 class="assignment-title">${assignment.title}</h3>
                        <span class="assignment-status status-${assignment.status}">${this.getStatusLabel(assignment.status)}</span>
                    </div>
                    
                    <div class="assignment-meta">
                        <div class="course-name">📚 ${assignment.courseName}</div>
                        <div class="assignment-type">📝 ${assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1)}</div>
                        <div class="due-date ${isOverdue ? 'overdue' : ''}">
                            ⏰ Due: ${dueDate.toLocaleDateString()} ${dueDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        ${timeRemaining ? `<div class="time-remaining">${timeRemaining}</div>` : ''}
                    </div>

                    <div class="assignment-description">
                        ${assignment.description}
                    </div>

                    <div class="assignment-points">
                        <span class="max-points">Max Points: ${assignment.maxPoints}</span>
                        ${assignment.earnedPoints !== null ? 
                            `<span class="earned-points">Earned: ${assignment.earnedPoints}/${assignment.maxPoints} (${Math.round((assignment.earnedPoints/assignment.maxPoints)*100)}%)</span>` 
                            : ''
                        }
                    </div>

                    <div class="assignment-actions">
                        <button class="btn btn-primary view-assignment" data-assignment-id="${assignment.id}">
                            View Details
                        </button>
                        ${assignment.status === 'pending' || assignment.status === 'draft' ? 
                            `<button class="btn btn-success submit-assignment" data-assignment-id="${assignment.id}">
                                ${assignment.status === 'draft' ? 'Continue' : 'Submit'}
                            </button>` 
                            : ''
                        }
                        ${assignment.feedback ? 
                            `<button class="btn btn-secondary view-feedback" data-assignment-id="${assignment.id}">
                                View Feedback
                            </button>` 
                            : ''
                        }
                    </div>
                </div>
            `;
        }).join('');
    }

    setupEventListeners() {
        // Filter and search listeners
        const statusFilter = document.getElementById('assignment-status-filter');
        const typeFilter = document.getElementById('assignment-type-filter');
        const searchInput = document.getElementById('assignment-search');

        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterAssignments());
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.filterAssignments());
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.filterAssignments();
            });
        }

        // Assignment action listeners
        const assignmentsGrid = document.getElementById('assignments-grid');
        if (assignmentsGrid) {
            assignmentsGrid.addEventListener('click', (e) => {
                const assignmentId = e.target.getAttribute('data-assignment-id');
                if (!assignmentId) return;

                if (e.target.classList.contains('view-assignment')) {
                    this.viewAssignmentDetails(assignmentId);
                } else if (e.target.classList.contains('submit-assignment')) {
                    this.showSubmissionInterface(assignmentId);
                } else if (e.target.classList.contains('view-feedback')) {
                    this.viewFeedback(assignmentId);
                }
            });
        }
    }

    filterAssignments() {
        const statusFilter = document.getElementById('assignment-status-filter')?.value || 'all';
        const typeFilter = document.getElementById('assignment-type-filter')?.value || 'all';

        this.filteredAssignments = this.assignments.filter(assignment => {
            const matchesSearch = this.searchQuery === '' ||
                assignment.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                assignment.courseName.toLowerCase().includes(this.searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'overdue' ? this.isOverdue(assignment) : assignment.status === statusFilter);

            const matchesType = typeFilter === 'all' || assignment.type === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });

        this.updateAssignmentsGrid();
    }

    updateAssignmentsGrid() {
        const assignmentsGrid = document.getElementById('assignments-grid');
        if (assignmentsGrid) {
            assignmentsGrid.innerHTML = this.renderAssignmentCards();
        }

        // Update stats
        this.updateStats();
    }

    updateStats() {
        const statCards = document.querySelectorAll('.stat-card .stat-number');
        if (statCards.length >= 4) {
            statCards[0].textContent = this.getAssignmentCount('pending');
            statCards[1].textContent = this.getAssignmentCount('submitted');
            statCards[2].textContent = this.getAssignmentCount('graded');
            statCards[3].textContent = this.getAverageGrade() + '%';
        }
    }

    getAssignmentCount(status) {
        if (status === 'overdue') {
            return this.assignments.filter(a => this.isOverdue(a)).length;
        }
        return this.assignments.filter(a => a.status === status).length;
    }

    getAverageGrade() {
        const gradedAssignments = this.assignments.filter(a => a.earnedPoints !== null);
        if (gradedAssignments.length === 0) return 0;

        const totalEarned = gradedAssignments.reduce((sum, a) => sum + a.earnedPoints, 0);
        const totalPossible = gradedAssignments.reduce((sum, a) => sum + a.maxPoints, 0);

        return Math.round((totalEarned / totalPossible) * 100);
    }

    isOverdue(assignment) {
        const dueDate = new Date(assignment.dueDate);
        return dueDate < new Date() && assignment.status === 'pending';
    }

    getTimeRemaining(dueDate) {
        const now = new Date();
        const diff = dueDate - now;

        if (diff <= 0) return 'Overdue';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} remaining`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
        } else {
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
        }
    }

    getStatusLabel(status) {
        const labels = {
            'pending': 'Pending',
            'draft': 'Draft',
            'submitted': 'Submitted',
            'graded': 'Graded'
        };
        return labels[status] || status;
    }

    viewAssignmentDetails(assignmentId) {
        const assignment = this.assignments.find(a => a.id === assignmentId);
        if (assignment && window.studentPortalApp) {
            window.studentPortalApp.navigateToSection('assignment-detail', { assignmentId });
        }
    }

    showSubmissionInterface(assignmentId) {
        const assignment = this.assignments.find(a => a.id === assignmentId);
        if (assignment && window.studentPortalApp) {
            window.studentPortalApp.navigateToSection('assignment-submit', { assignmentId });
        }
    }

    viewFeedback(assignmentId) {
        const assignment = this.assignments.find(a => a.id === assignmentId);
        if (assignment && assignment.feedback) {
            this.showFeedbackModal(assignment);
        }
    }

    showFeedbackModal(assignment) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content feedback-modal">
                <div class="modal-header">
                    <h3>Assignment Feedback</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="assignment-info">
                        <h4>${assignment.title}</h4>
                        <p><strong>Course:</strong> ${assignment.courseName}</p>
                    </div>
                    <div class="grade-info">
                        <div class="grade-display">
                            <span class="grade">${assignment.earnedPoints}/${assignment.maxPoints}</span>
                            <span class="percentage">(${Math.round((assignment.earnedPoints/assignment.maxPoints)*100)}%)</span>
                        </div>
                        <div class="graded-by">
                            Graded by ${assignment.feedback.gradedBy} on ${new Date(assignment.feedback.gradedAt).toLocaleDateString()}
                        </div>
                    </div>
                    <div class="feedback-comments">
                        <h5>Instructor Comments:</h5>
                        <p>${assignment.feedback.comments}</p>
                    </div>
                    ${assignment.rubric ? this.renderRubricFeedback(assignment) : ''}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary close-modal">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    renderRubricFeedback(assignment) {
        if (!assignment.rubric) return '';

        return `
            <div class="rubric-feedback">
                <h5>Grading Rubric:</h5>
                <div class="rubric-criteria">
                    ${assignment.rubric.criteria.map(criterion => `
                        <div class="criterion">
                            <div class="criterion-name">${criterion.name}</div>
                            <div class="criterion-description">${criterion.description}</div>
                            <div class="criterion-points">${criterion.points} points</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    showError(message) {
        console.error(message);
        // In a real implementation, this would show a toast notification
    }

    showSuccess(message) {
        console.log(message);
        // In a real implementation, this would show a toast notification
    }
}
