/**
 * ADB-IO Student Portal - Course Materials Viewer Module
 * Green Computing: Efficient materials viewing with minimal resource usage
 */

export default class CourseMaterials {
    constructor(user) {
        this.user = user;
        this.currentCourse = null;
        this.currentModule = null;
        this.currentMaterial = null;
        this.materials = [];
        this.currentIndex = 0;
        this.progress = {};
    }

    async init(courseId, moduleId) {
        try {
            await this.loadCourseMaterials(courseId, moduleId);
            this.renderMaterialsViewer();
            this.setupEventListeners();
            this.loadMaterial(0); // Load first material
        } catch (error) {
            console.error('Failed to initialize course materials:', error);
            this.showError('Failed to load course materials');
        }
    }

    async loadCourseMaterials(courseId, moduleId) {
        // Mock course materials data
        const materialsData = {
            'course_001': {
                'module_004': {
                    courseTitle: 'Introduction to Digital Business',
                    moduleTitle: 'Digital Marketing Essentials',
                    moduleDescription: 'Learn digital marketing strategies and customer engagement techniques',
                    materials: [
                        {
                            id: 'material_001',
                            title: 'Introduction to Digital Marketing',
                            type: 'video',
                            duration: '15:30',
                            description: 'Overview of digital marketing landscape and key concepts',
                            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                            completed: false,
                            notes: '',
                            transcript: 'Digital marketing has revolutionized how businesses connect with customers...'
                        },
                        {
                            id: 'material_002',
                            title: 'Digital Marketing Strategy Framework',
                            type: 'pdf',
                            pages: 25,
                            description: 'Comprehensive guide to developing digital marketing strategies',
                            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                            completed: false,
                            notes: '',
                            downloadable: true
                        },
                        {
                            id: 'material_003',
                            title: 'Social Media Marketing Platforms',
                            type: 'interactive',
                            duration: '10:00',
                            description: 'Interactive exploration of major social media platforms',
                            url: '#interactive-content',
                            completed: false,
                            notes: '',
                            activities: [
                                'Platform comparison exercise',
                                'Audience analysis tool',
                                'Content planning template'
                            ]
                        },
                        {
                            id: 'material_004',
                            title: 'SEO Fundamentals',
                            type: 'video',
                            duration: '20:45',
                            description: 'Search Engine Optimization basics and best practices',
                            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                            completed: false,
                            notes: '',
                            transcript: 'Search Engine Optimization is crucial for digital visibility...'
                        },
                        {
                            id: 'material_005',
                            title: 'Email Marketing Best Practices',
                            type: 'pdf',
                            pages: 18,
                            description: 'Guide to effective email marketing campaigns',
                            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                            completed: false,
                            notes: '',
                            downloadable: true
                        },
                        {
                            id: 'material_006',
                            title: 'Digital Marketing Quiz',
                            type: 'quiz',
                            questions: 10,
                            description: 'Test your understanding of digital marketing concepts',
                            url: '#quiz-content',
                            completed: false,
                            notes: '',
                            timeLimit: '15:00',
                            passingScore: 70
                        }
                    ]
                }
            }
        };

        const courseData = materialsData[courseId];
        if (!courseData || !courseData[moduleId]) {
            throw new Error('Course materials not found');
        }

        const moduleData = courseData[moduleId];
        this.currentCourse = { id: courseId, title: moduleData.courseTitle };
        this.currentModule = { 
            id: moduleId, 
            title: moduleData.moduleTitle,
            description: moduleData.moduleDescription
        };
        this.materials = moduleData.materials;
        
        // Load progress from localStorage (mock)
        this.loadProgress();
    }

    loadProgress() {
        const progressKey = `progress_${this.currentCourse.id}_${this.currentModule.id}`;
        const savedProgress = localStorage.getItem(progressKey);
        if (savedProgress) {
            this.progress = JSON.parse(savedProgress);
            // Apply progress to materials
            this.materials.forEach(material => {
                if (this.progress[material.id]) {
                    material.completed = this.progress[material.id].completed;
                    material.notes = this.progress[material.id].notes || '';
                }
            });
        }
    }

    saveProgress() {
        const progressKey = `progress_${this.currentCourse.id}_${this.currentModule.id}`;
        localStorage.setItem(progressKey, JSON.stringify(this.progress));
    }

    renderMaterialsViewer() {
        const coursesSection = document.getElementById('courses');
        if (!coursesSection) return;

        coursesSection.innerHTML = `
            <div class="materials-viewer">
                <!-- Header -->
                <div class="materials-header">
                    <button class="back-button" id="back-to-course">
                        ← Back to Course
                    </button>
                    
                    <div class="module-info">
                        <div class="breadcrumb">
                            <span class="course-name">${this.currentCourse.title}</span>
                            <span class="separator">›</span>
                            <span class="module-name">${this.currentModule.title}</span>
                        </div>
                        <p class="module-description">${this.currentModule.description}</p>
                    </div>
                    
                    <div class="progress-indicator">
                        <span class="progress-text">
                            ${this.getCompletedCount()}/${this.materials.length} completed
                        </span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.getProgressPercentage()}%"></div>
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="materials-content">
                    <!-- Sidebar Navigation -->
                    <div class="materials-sidebar">
                        <h3>Materials</h3>
                        <div class="materials-list">
                            ${this.renderMaterialsList()}
                        </div>
                    </div>

                    <!-- Content Viewer -->
                    <div class="materials-main">
                        <div class="material-header">
                            <div class="material-info">
                                <h2 id="current-material-title">Select a material to begin</h2>
                                <p id="current-material-description"></p>
                                <div class="material-meta" id="current-material-meta"></div>
                            </div>
                            
                            <div class="material-actions">
                                <button class="btn btn-secondary" id="toggle-notes">
                                    📝 Notes
                                </button>
                                <button class="btn btn-secondary" id="mark-complete" style="display: none;">
                                    ✓ Mark Complete
                                </button>
                            </div>
                        </div>

                        <div class="material-content" id="material-content">
                            <div class="material-placeholder">
                                <div class="placeholder-icon">📚</div>
                                <h3>Welcome to Course Materials</h3>
                                <p>Select a material from the sidebar to start learning</p>
                            </div>
                        </div>

                        <!-- Navigation Controls -->
                        <div class="material-navigation">
                            <button class="btn btn-secondary" id="prev-material" disabled>
                                ← Previous
                            </button>
                            
                            <div class="material-counter">
                                <span id="current-position">0</span> of ${this.materials.length}
                            </div>
                            
                            <button class="btn btn-primary" id="next-material">
                                Next →
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Notes Panel -->
                <div class="notes-panel" id="notes-panel" style="display: none;">
                    <div class="notes-header">
                        <h4>My Notes</h4>
                        <button class="close-notes" id="close-notes">×</button>
                    </div>
                    <textarea 
                        id="material-notes" 
                        placeholder="Add your notes here..."
                        rows="10"
                    ></textarea>
                    <div class="notes-actions">
                        <button class="btn btn-primary" id="save-notes">Save Notes</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderMaterialsList() {
        return this.materials.map((material, index) => `
            <div class="material-item ${material.completed ? 'completed' : ''} ${index === this.currentIndex ? 'active' : ''}" 
                 data-index="${index}">
                <div class="material-icon">
                    ${this.getMaterialIcon(material.type)}
                </div>
                <div class="material-details">
                    <h4 class="material-title">${material.title}</h4>
                    <div class="material-meta">
                        ${material.duration ? `<span class="duration">⏱️ ${material.duration}</span>` : ''}
                        ${material.pages ? `<span class="pages">📄 ${material.pages} pages</span>` : ''}
                        ${material.questions ? `<span class="questions">❓ ${material.questions} questions</span>` : ''}
                    </div>
                </div>
                <div class="material-status">
                    ${material.completed ? 
                        '<span class="status-badge completed">✓</span>' : 
                        '<span class="status-badge pending">○</span>'
                    }
                </div>
            </div>
        `).join('');
    }

    getMaterialIcon(type) {
        const icons = {
            'video': '🎥',
            'pdf': '📄',
            'interactive': '🎮',
            'quiz': '❓',
            'audio': '🎵',
            'text': '📝'
        };
        return icons[type] || '📚';
    }

    getCompletedCount() {
        return this.materials.filter(m => m.completed).length;
    }

    getProgressPercentage() {
        return Math.round((this.getCompletedCount() / this.materials.length) * 100);
    }

    loadMaterial(index) {
        if (index < 0 || index >= this.materials.length) return;

        this.currentIndex = index;
        this.currentMaterial = this.materials[index];

        // Update UI
        this.updateMaterialHeader();
        this.updateMaterialContent();
        this.updateNavigation();
        this.updateSidebar();
        this.loadNotes();
    }

    updateMaterialHeader() {
        const material = this.currentMaterial;

        document.getElementById('current-material-title').textContent = material.title;
        document.getElementById('current-material-description').textContent = material.description;

        const metaElement = document.getElementById('current-material-meta');
        let metaHTML = `<span class="material-type">${this.getMaterialIcon(material.type)} ${material.type.toUpperCase()}</span>`;

        if (material.duration) metaHTML += `<span class="duration">⏱️ ${material.duration}</span>`;
        if (material.pages) metaHTML += `<span class="pages">📄 ${material.pages} pages</span>`;
        if (material.questions) metaHTML += `<span class="questions">❓ ${material.questions} questions</span>`;

        metaElement.innerHTML = metaHTML;

        // Show/hide mark complete button
        const markCompleteBtn = document.getElementById('mark-complete');
        if (material.completed) {
            markCompleteBtn.style.display = 'none';
        } else {
            markCompleteBtn.style.display = 'inline-block';
        }
    }

    updateMaterialContent() {
        const material = this.currentMaterial;
        const contentElement = document.getElementById('material-content');

        switch (material.type) {
            case 'video':
                contentElement.innerHTML = this.renderVideoContent(material);
                break;
            case 'pdf':
                contentElement.innerHTML = this.renderPDFContent(material);
                break;
            case 'interactive':
                contentElement.innerHTML = this.renderInteractiveContent(material);
                break;
            case 'quiz':
                contentElement.innerHTML = this.renderQuizContent(material);
                break;
            default:
                contentElement.innerHTML = this.renderDefaultContent(material);
        }
    }

    renderVideoContent(material) {
        return `
            <div class="video-container">
                <iframe
                    src="${material.url}"
                    frameborder="0"
                    allowfullscreen
                    class="video-player"
                    title="${material.title}"
                ></iframe>

                ${material.transcript ? `
                    <div class="video-controls">
                        <button class="btn btn-secondary" id="toggle-transcript">
                            📝 Show Transcript
                        </button>
                    </div>

                    <div class="transcript" id="transcript" style="display: none;">
                        <h4>Transcript</h4>
                        <p>${material.transcript}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderPDFContent(material) {
        return `
            <div class="pdf-container">
                <div class="pdf-header">
                    <span class="pdf-info">📄 ${material.pages} pages</span>
                    ${material.downloadable ? `
                        <a href="${material.url}" download class="btn btn-secondary">
                            ⬇️ Download PDF
                        </a>
                    ` : ''}
                </div>

                <iframe
                    src="${material.url}"
                    class="pdf-viewer"
                    title="${material.title}"
                ></iframe>
            </div>
        `;
    }

    renderInteractiveContent(material) {
        return `
            <div class="interactive-container">
                <div class="interactive-header">
                    <h3>Interactive Learning</h3>
                    <p>Engage with the following activities to enhance your understanding:</p>
                </div>

                <div class="activities-list">
                    ${material.activities.map((activity, index) => `
                        <div class="activity-item">
                            <div class="activity-number">${index + 1}</div>
                            <div class="activity-content">
                                <h4>${activity}</h4>
                                <button class="btn btn-primary activity-btn" data-activity="${index}">
                                    Start Activity
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="interactive-placeholder">
                    <div class="placeholder-icon">🎮</div>
                    <p>Interactive content will be loaded here</p>
                </div>
            </div>
        `;
    }

    renderQuizContent(material) {
        return `
            <div class="quiz-container">
                <div class="quiz-header">
                    <h3>Quiz: ${material.title}</h3>
                    <div class="quiz-info">
                        <span class="questions">❓ ${material.questions} questions</span>
                        <span class="time-limit">⏱️ ${material.timeLimit}</span>
                        <span class="passing-score">🎯 ${material.passingScore}% to pass</span>
                    </div>
                </div>

                <div class="quiz-content">
                    <div class="quiz-placeholder">
                        <div class="placeholder-icon">❓</div>
                        <h4>Ready to take the quiz?</h4>
                        <p>Test your knowledge of the concepts covered in this module.</p>
                        <button class="btn btn-primary" id="start-quiz">
                            Start Quiz
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderDefaultContent(material) {
        return `
            <div class="default-content">
                <div class="content-icon">${this.getMaterialIcon(material.type)}</div>
                <h3>${material.title}</h3>
                <p>${material.description}</p>
                <button class="btn btn-primary">
                    Open Material
                </button>
            </div>
        `;
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-material');
        const nextBtn = document.getElementById('next-material');
        const positionSpan = document.getElementById('current-position');

        prevBtn.disabled = this.currentIndex === 0;
        nextBtn.disabled = this.currentIndex === this.materials.length - 1;
        positionSpan.textContent = this.currentIndex + 1;

        // Update next button text
        if (this.currentIndex === this.materials.length - 1) {
            nextBtn.textContent = 'Complete Module';
        } else {
            nextBtn.textContent = 'Next →';
        }
    }

    updateSidebar() {
        // Remove active class from all items
        document.querySelectorAll('.material-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current item
        const currentItem = document.querySelector(`[data-index="${this.currentIndex}"]`);
        if (currentItem) {
            currentItem.classList.add('active');
        }
    }

    loadNotes() {
        const notesTextarea = document.getElementById('material-notes');
        if (notesTextarea && this.currentMaterial) {
            notesTextarea.value = this.currentMaterial.notes || '';
        }
    }

    setupEventListeners() {
        // Back button
        const backButton = document.getElementById('back-to-course');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.goBackToCourse();
            });
        }

        // Material navigation
        const prevBtn = document.getElementById('prev-material');
        const nextBtn = document.getElementById('next-material');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.loadMaterial(this.currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.currentIndex === this.materials.length - 1) {
                    this.completeModule();
                } else {
                    this.loadMaterial(this.currentIndex + 1);
                }
            });
        }

        // Sidebar material selection
        const materialsViewer = document.querySelector('.materials-viewer');
        if (materialsViewer) {
            materialsViewer.addEventListener('click', (e) => {
                const materialItem = e.target.closest('.material-item');
                if (materialItem) {
                    const index = parseInt(materialItem.dataset.index);
                    this.loadMaterial(index);
                }
            });
        }

        // Notes panel
        const toggleNotesBtn = document.getElementById('toggle-notes');
        const closeNotesBtn = document.getElementById('close-notes');
        const saveNotesBtn = document.getElementById('save-notes');

        if (toggleNotesBtn) {
            toggleNotesBtn.addEventListener('click', () => {
                this.toggleNotesPanel();
            });
        }

        if (closeNotesBtn) {
            closeNotesBtn.addEventListener('click', () => {
                this.closeNotesPanel();
            });
        }

        if (saveNotesBtn) {
            saveNotesBtn.addEventListener('click', () => {
                this.saveNotes();
            });
        }

        // Mark complete button
        const markCompleteBtn = document.getElementById('mark-complete');
        if (markCompleteBtn) {
            markCompleteBtn.addEventListener('click', () => {
                this.markMaterialComplete();
            });
        }

        // Content-specific event listeners
        this.setupContentEventListeners();
    }

    setupContentEventListeners() {
        // Video transcript toggle
        const transcriptBtn = document.getElementById('toggle-transcript');
        if (transcriptBtn) {
            transcriptBtn.addEventListener('click', () => {
                const transcript = document.getElementById('transcript');
                if (transcript) {
                    const isVisible = transcript.style.display !== 'none';
                    transcript.style.display = isVisible ? 'none' : 'block';
                    transcriptBtn.textContent = isVisible ? '📝 Show Transcript' : '📝 Hide Transcript';
                }
            });
        }

        // Quiz start button
        const startQuizBtn = document.getElementById('start-quiz');
        if (startQuizBtn) {
            startQuizBtn.addEventListener('click', () => {
                this.startQuiz();
            });
        }

        // Activity buttons
        const activityBtns = document.querySelectorAll('.activity-btn');
        activityBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const activityIndex = e.target.dataset.activity;
                this.startActivity(activityIndex);
            });
        });
    }

    toggleNotesPanel() {
        const notesPanel = document.getElementById('notes-panel');
        if (notesPanel) {
            const isVisible = notesPanel.style.display !== 'none';
            notesPanel.style.display = isVisible ? 'none' : 'block';
        }
    }

    closeNotesPanel() {
        const notesPanel = document.getElementById('notes-panel');
        if (notesPanel) {
            notesPanel.style.display = 'none';
        }
    }

    saveNotes() {
        const notesTextarea = document.getElementById('material-notes');
        if (notesTextarea && this.currentMaterial) {
            const notes = notesTextarea.value;
            this.currentMaterial.notes = notes;

            // Update progress
            if (!this.progress[this.currentMaterial.id]) {
                this.progress[this.currentMaterial.id] = {};
            }
            this.progress[this.currentMaterial.id].notes = notes;
            this.saveProgress();

            this.showSuccess('Notes saved successfully!');
        }
    }

    markMaterialComplete() {
        if (this.currentMaterial) {
            this.currentMaterial.completed = true;

            // Update progress
            if (!this.progress[this.currentMaterial.id]) {
                this.progress[this.currentMaterial.id] = {};
            }
            this.progress[this.currentMaterial.id].completed = true;
            this.saveProgress();

            // Update UI
            this.updateMaterialHeader();
            this.updateSidebar();
            this.updateProgressIndicator();

            this.showSuccess('Material marked as complete!');

            // Auto-advance to next material
            setTimeout(() => {
                if (this.currentIndex < this.materials.length - 1) {
                    this.loadMaterial(this.currentIndex + 1);
                }
            }, 1000);
        }
    }

    updateProgressIndicator() {
        const progressText = document.querySelector('.progress-text');
        const progressFill = document.querySelector('.progress-fill');

        if (progressText) {
            progressText.textContent = `${this.getCompletedCount()}/${this.materials.length} completed`;
        }

        if (progressFill) {
            progressFill.style.width = `${this.getProgressPercentage()}%`;
        }
    }

    startQuiz() {
        alert('Quiz functionality will be implemented in the next phase. This would open an interactive quiz interface.');
    }

    startActivity(activityIndex) {
        const activity = this.currentMaterial.activities[activityIndex];
        alert(`Starting activity: "${activity}". Interactive activities will be implemented in the next phase.`);
    }

    completeModule() {
        const completedCount = this.getCompletedCount();
        const totalCount = this.materials.length;

        if (completedCount === totalCount) {
            alert(`Congratulations! You have completed all materials in "${this.currentModule.title}".`);
        } else {
            const remaining = totalCount - completedCount;
            alert(`You have ${remaining} materials remaining. Complete all materials to finish the module.`);
        }
    }

    goBackToCourse() {
        // Navigate back to course detail
        if (window.app && window.app.modules && window.app.modules.courseDetail) {
            window.app.modules.courseDetail.init(this.currentCourse.id);
        } else {
            window.app.navigateToSection('courses');
        }
    }

    showSuccess(message) {
        // Simple success notification
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showError(message) {
        console.error(message);
        // TODO: Implement proper error display
    }

    destroy() {
        // Cleanup event listeners
        console.log('Course materials module destroyed');
    }
}
