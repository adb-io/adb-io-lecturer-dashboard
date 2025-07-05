/**
 * ADB-IO Lecturer Dashboard - Course Creation Module
 * Green Computing: Efficient course creation with minimal resource usage
 */

export default class CourseCreation {
    constructor(user) {
        this.user = user;
        this.currentStep = 1;
        this.totalSteps = 5;
        this.courseData = {
            basic: {},
            curriculum: [],
            lessons: [],
            assessments: [],
            settings: {}
        };
        this.isEditing = false;
        this.editingCourseId = null;
    }

    async init() {
        try {
            this.renderCourseCreationPage();
            this.setupEventListeners();
            this.loadDraftData();
        } catch (error) {
            console.error('Failed to initialize course creation:', error);
            this.showError('Failed to load course creation interface');
        }
    }

    renderCourseCreationPage() {
        const courseCreationSection = document.getElementById('course-creation');
        if (!courseCreationSection) return;

        courseCreationSection.innerHTML = `
            <div class="course-creation-container">
                <!-- Progress Header -->
                <div class="creation-progress">
                    <div class="progress-header">
                        <h1 class="creation-title">
                            ${this.isEditing ? 'Edit Course' : 'Create New Course'}
                        </h1>
                        <div class="step-indicator">
                            Step ${this.currentStep} of ${this.totalSteps}
                        </div>
                    </div>
                    
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(this.currentStep / this.totalSteps) * 100}%"></div>
                    </div>
                    
                    <div class="step-labels">
                        <span class="step-label ${this.currentStep >= 1 ? 'active' : ''}">Basic Info</span>
                        <span class="step-label ${this.currentStep >= 2 ? 'active' : ''}">Curriculum</span>
                        <span class="step-label ${this.currentStep >= 3 ? 'active' : ''}">Lessons</span>
                        <span class="step-label ${this.currentStep >= 4 ? 'active' : ''}">Assessments</span>
                        <span class="step-label ${this.currentStep >= 5 ? 'active' : ''}">Settings</span>
                    </div>
                </div>

                <!-- Creation Steps -->
                <div class="creation-steps">
                    ${this.renderCurrentStep()}
                </div>

                <!-- Navigation -->
                <div class="creation-navigation">
                    <button class="btn btn-secondary" id="prev-step" ${this.currentStep === 1 ? 'disabled' : ''}>
                        ← Previous
                    </button>
                    
                    <div class="nav-actions">
                        <button class="btn btn-outline" id="save-draft">
                            💾 Save Draft
                        </button>
                        <button class="btn btn-outline" id="preview-course">
                            👁️ Preview
                        </button>
                    </div>
                    
                    <button class="btn btn-primary" id="next-step">
                        ${this.currentStep === this.totalSteps ? 'Publish Course' : 'Next →'}
                    </button>
                </div>
            </div>
        `;
    }

    renderCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.renderBasicInfoStep();
            case 2:
                return this.renderCurriculumStep();
            case 3:
                return this.renderLessonsStep();
            case 4:
                return this.renderAssessmentsStep();
            case 5:
                return this.renderSettingsStep();
            default:
                return '<div>Invalid step</div>';
        }
    }

    renderBasicInfoStep() {
        return `
            <div class="step-content" id="step-basic">
                <div class="step-header">
                    <h2>Course Basic Information</h2>
                    <p>Provide essential details about your course</p>
                </div>

                <div class="form-grid">
                    <div class="form-group full-width">
                        <label for="course-title">Course Title *</label>
                        <input type="text" id="course-title" class="form-input" 
                               placeholder="e.g., Introduction to Digital Business"
                               value="${this.courseData.basic.title || ''}" required>
                        <small class="form-hint">Choose a clear, descriptive title that students will understand</small>
                    </div>

                    <div class="form-group">
                        <label for="course-category">Category *</label>
                        <select id="course-category" class="form-select" required>
                            <option value="">Select Category</option>
                            <option value="business" ${this.courseData.basic.category === 'business' ? 'selected' : ''}>Business</option>
                            <option value="technology" ${this.courseData.basic.category === 'technology' ? 'selected' : ''}>Technology</option>
                            <option value="data-science" ${this.courseData.basic.category === 'data-science' ? 'selected' : ''}>Data Science</option>
                            <option value="marketing" ${this.courseData.basic.category === 'marketing' ? 'selected' : ''}>Marketing</option>
                            <option value="sustainability" ${this.courseData.basic.category === 'sustainability' ? 'selected' : ''}>Sustainability</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="course-level">Difficulty Level *</label>
                        <select id="course-level" class="form-select" required>
                            <option value="">Select Level</option>
                            <option value="beginner" ${this.courseData.basic.level === 'beginner' ? 'selected' : ''}>Beginner</option>
                            <option value="intermediate" ${this.courseData.basic.level === 'intermediate' ? 'selected' : ''}>Intermediate</option>
                            <option value="advanced" ${this.courseData.basic.level === 'advanced' ? 'selected' : ''}>Advanced</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="course-duration">Duration (weeks) *</label>
                        <input type="number" id="course-duration" class="form-input" 
                               min="1" max="52" placeholder="12"
                               value="${this.courseData.basic.duration || ''}" required>
                    </div>

                    <div class="form-group">
                        <label for="course-credits">Credits</label>
                        <input type="number" id="course-credits" class="form-input" 
                               min="1" max="10" placeholder="3"
                               value="${this.courseData.basic.credits || ''}">
                    </div>

                    <div class="form-group full-width">
                        <label for="course-description">Course Description *</label>
                        <textarea id="course-description" class="form-textarea" rows="4" 
                                  placeholder="Describe what students will learn in this course..."
                                  required>${this.courseData.basic.description || ''}</textarea>
                    </div>

                    <div class="form-group full-width">
                        <label for="course-objectives">Learning Objectives</label>
                        <div class="objectives-container">
                            <div class="objectives-list" id="objectives-list">
                                ${this.renderObjectivesList()}
                            </div>
                            <button type="button" class="btn btn-outline btn-sm" id="add-objective">
                                + Add Learning Objective
                            </button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="course-prerequisites">Prerequisites</label>
                        <textarea id="course-prerequisites" class="form-textarea" rows="3" 
                                  placeholder="List any required knowledge or courses...">${this.courseData.basic.prerequisites || ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="course-thumbnail">Course Thumbnail</label>
                        <div class="file-upload-area" id="thumbnail-upload">
                            <div class="upload-placeholder">
                                <span class="upload-icon">📷</span>
                                <span class="upload-text">Click to upload thumbnail</span>
                                <span class="upload-hint">Recommended: 1200x675px, max 2MB</span>
                            </div>
                            <input type="file" id="course-thumbnail-input" accept="image/*" hidden>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderObjectivesList() {
        const objectives = this.courseData.basic.objectives || [];
        return objectives.map((objective, index) => `
            <div class="objective-item">
                <input type="text" class="form-input objective-input" 
                       placeholder="Learning objective..." 
                       value="${objective}" data-index="${index}">
                <button type="button" class="btn btn-danger btn-sm remove-objective" data-index="${index}">
                    ×
                </button>
            </div>
        `).join('');
    }

    renderCurriculumStep() {
        return `
            <div class="step-content" id="step-curriculum">
                <div class="step-header">
                    <h2>Course Curriculum</h2>
                    <p>Organize your course into modules and topics</p>
                </div>

                <div class="curriculum-builder">
                    <div class="curriculum-toolbar">
                        <button class="btn btn-primary" id="add-module">
                            + Add Module
                        </button>
                        <button class="btn btn-outline" id="import-curriculum">
                            📁 Import from Template
                        </button>
                    </div>

                    <div class="modules-container" id="modules-container">
                        ${this.renderModulesList()}
                    </div>
                </div>
            </div>
        `;
    }

    renderModulesList() {
        const modules = this.courseData.curriculum || [];
        if (modules.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">📚</div>
                    <h3>No modules yet</h3>
                    <p>Start building your curriculum by adding your first module</p>
                </div>
            `;
        }

        return modules.map((module, index) => `
            <div class="module-card" data-module-index="${index}">
                <div class="module-header">
                    <div class="module-info">
                        <input type="text" class="module-title-input" 
                               placeholder="Module title..." 
                               value="${module.title || ''}" 
                               data-module-index="${index}">
                        <textarea class="module-description-input" 
                                  placeholder="Module description..."
                                  data-module-index="${index}">${module.description || ''}</textarea>
                    </div>
                    <div class="module-actions">
                        <button class="btn btn-sm btn-outline" data-action="move-up" data-module-index="${index}">↑</button>
                        <button class="btn btn-sm btn-outline" data-action="move-down" data-module-index="${index}">↓</button>
                        <button class="btn btn-sm btn-danger" data-action="delete" data-module-index="${index}">×</button>
                    </div>
                </div>
                
                <div class="topics-container">
                    <div class="topics-list" data-module-index="${index}">
                        ${this.renderTopicsList(module.topics || [], index)}
                    </div>
                    <button class="btn btn-sm btn-outline add-topic" data-module-index="${index}">
                        + Add Topic
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderTopicsList(topics, moduleIndex) {
        return topics.map((topic, topicIndex) => `
            <div class="topic-item" data-module-index="${moduleIndex}" data-topic-index="${topicIndex}">
                <input type="text" class="topic-input" 
                       placeholder="Topic name..." 
                       value="${topic}" 
                       data-module-index="${moduleIndex}" 
                       data-topic-index="${topicIndex}">
                <button class="btn btn-sm btn-danger remove-topic" 
                        data-module-index="${moduleIndex}" 
                        data-topic-index="${topicIndex}">×</button>
            </div>
        `).join('');
    }

    renderLessonsStep() {
        return `
            <div class="step-content" id="step-lessons">
                <div class="step-header">
                    <h2>Course Lessons</h2>
                    <p>Create detailed lessons with content and materials</p>
                </div>

                <div class="lessons-builder">
                    <div class="lessons-toolbar">
                        <button class="btn btn-primary" id="add-lesson">
                            + Add Lesson
                        </button>
                        <button class="btn btn-outline" id="bulk-import">
                            📁 Bulk Import
                        </button>
                    </div>

                    <div class="lessons-container" id="lessons-container">
                        ${this.renderLessonsList()}
                    </div>
                </div>
            </div>
        `;
    }

    renderLessonsList() {
        const lessons = this.courseData.lessons || [];
        if (lessons.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">🎓</div>
                    <h3>No lessons yet</h3>
                    <p>Start creating engaging lessons for your students</p>
                </div>
            `;
        }

        return lessons.map((lesson, index) => `
            <div class="lesson-card" data-lesson-index="${index}">
                <div class="lesson-header">
                    <div class="lesson-info">
                        <input type="text" class="lesson-title-input"
                               placeholder="Lesson title..."
                               value="${lesson.title || ''}"
                               data-lesson-index="${index}">
                        <div class="lesson-meta">
                            <select class="lesson-type-select" data-lesson-index="${index}">
                                <option value="video" ${lesson.type === 'video' ? 'selected' : ''}>Video</option>
                                <option value="text" ${lesson.type === 'text' ? 'selected' : ''}>Text/Reading</option>
                                <option value="interactive" ${lesson.type === 'interactive' ? 'selected' : ''}>Interactive</option>
                                <option value="quiz" ${lesson.type === 'quiz' ? 'selected' : ''}>Quiz</option>
                            </select>
                            <input type="number" class="lesson-duration-input"
                                   placeholder="Duration (min)"
                                   value="${lesson.duration || ''}"
                                   data-lesson-index="${index}">
                        </div>
                    </div>
                    <div class="lesson-actions">
                        <button class="btn btn-sm btn-outline" data-action="edit" data-lesson-index="${index}">✏️</button>
                        <button class="btn btn-sm btn-outline" data-action="preview" data-lesson-index="${index}">👁️</button>
                        <button class="btn btn-sm btn-danger" data-action="delete" data-lesson-index="${index}">×</button>
                    </div>
                </div>

                <div class="lesson-content">
                    <textarea class="lesson-description-input"
                              placeholder="Lesson description and content..."
                              data-lesson-index="${index}">${lesson.content || ''}</textarea>
                </div>
            </div>
        `).join('');
    }

    renderAssessmentsStep() {
        return `
            <div class="step-content" id="step-assessments">
                <div class="step-header">
                    <h2>Course Assessments</h2>
                    <p>Design assessments to evaluate student learning</p>
                </div>

                <div class="assessments-builder">
                    <div class="assessments-toolbar">
                        <button class="btn btn-primary" id="add-assessment">
                            + Add Assessment
                        </button>
                        <button class="btn btn-outline" id="assessment-templates">
                            📋 Use Template
                        </button>
                    </div>

                    <div class="assessments-container" id="assessments-container">
                        ${this.renderAssessmentsList()}
                    </div>
                </div>
            </div>
        `;
    }

    renderAssessmentsList() {
        const assessments = this.courseData.assessments || [];
        if (assessments.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No assessments yet</h3>
                    <p>Create assessments to evaluate student progress</p>
                </div>
            `;
        }

        return assessments.map((assessment, index) => `
            <div class="assessment-card" data-assessment-index="${index}">
                <div class="assessment-header">
                    <div class="assessment-info">
                        <input type="text" class="assessment-title-input"
                               placeholder="Assessment title..."
                               value="${assessment.title || ''}"
                               data-assessment-index="${index}">
                        <div class="assessment-meta">
                            <select class="assessment-type-select" data-assessment-index="${index}">
                                <option value="quiz" ${assessment.type === 'quiz' ? 'selected' : ''}>Quiz</option>
                                <option value="assignment" ${assessment.type === 'assignment' ? 'selected' : ''}>Assignment</option>
                                <option value="project" ${assessment.type === 'project' ? 'selected' : ''}>Project</option>
                                <option value="exam" ${assessment.type === 'exam' ? 'selected' : ''}>Exam</option>
                            </select>
                            <input type="number" class="assessment-weight-input"
                                   placeholder="Weight %"
                                   value="${assessment.weight || ''}"
                                   data-assessment-index="${index}">
                        </div>
                    </div>
                    <div class="assessment-actions">
                        <button class="btn btn-sm btn-outline" data-action="edit" data-assessment-index="${index}">✏️</button>
                        <button class="btn btn-sm btn-danger" data-action="delete" data-assessment-index="${index}">×</button>
                    </div>
                </div>

                <div class="assessment-content">
                    <textarea class="assessment-description-input"
                              placeholder="Assessment description and instructions..."
                              data-assessment-index="${index}">${assessment.description || ''}</textarea>
                </div>
            </div>
        `).join('');
    }

    renderSettingsStep() {
        return `
            <div class="step-content" id="step-settings">
                <div class="step-header">
                    <h2>Course Settings</h2>
                    <p>Configure enrollment, pricing, and publication settings</p>
                </div>

                <div class="settings-grid">
                    <div class="settings-section">
                        <h3>Enrollment Settings</h3>

                        <div class="form-group">
                            <label for="enrollment-type">Enrollment Type</label>
                            <select id="enrollment-type" class="form-select">
                                <option value="open" ${this.courseData.settings.enrollmentType === 'open' ? 'selected' : ''}>Open Enrollment</option>
                                <option value="approval" ${this.courseData.settings.enrollmentType === 'approval' ? 'selected' : ''}>Approval Required</option>
                                <option value="invitation" ${this.courseData.settings.enrollmentType === 'invitation' ? 'selected' : ''}>Invitation Only</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="max-students">Maximum Students</label>
                            <input type="number" id="max-students" class="form-input"
                                   placeholder="Leave empty for unlimited"
                                   value="${this.courseData.settings.maxStudents || ''}">
                        </div>

                        <div class="form-group">
                            <label for="enrollment-start">Enrollment Start Date</label>
                            <input type="datetime-local" id="enrollment-start" class="form-input"
                                   value="${this.courseData.settings.enrollmentStart || ''}">
                        </div>

                        <div class="form-group">
                            <label for="enrollment-end">Enrollment End Date</label>
                            <input type="datetime-local" id="enrollment-end" class="form-input"
                                   value="${this.courseData.settings.enrollmentEnd || ''}">
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>Course Schedule</h3>

                        <div class="form-group">
                            <label for="course-start">Course Start Date</label>
                            <input type="date" id="course-start" class="form-input"
                                   value="${this.courseData.settings.courseStart || ''}">
                        </div>

                        <div class="form-group">
                            <label for="course-end">Course End Date</label>
                            <input type="date" id="course-end" class="form-input"
                                   value="${this.courseData.settings.courseEnd || ''}">
                        </div>

                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="self-paced"
                                       ${this.courseData.settings.selfPaced ? 'checked' : ''}>
                                Self-paced learning
                            </label>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>Pricing & Certification</h3>

                        <div class="form-group">
                            <label for="course-price">Course Price (USD)</label>
                            <input type="number" id="course-price" class="form-input"
                                   placeholder="0 for free"
                                   value="${this.courseData.settings.price || ''}">
                        </div>

                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="certificate-enabled"
                                       ${this.courseData.settings.certificateEnabled ? 'checked' : ''}>
                                Provide completion certificate
                            </label>
                        </div>

                        <div class="form-group">
                            <label for="passing-grade">Passing Grade (%)</label>
                            <input type="number" id="passing-grade" class="form-input"
                                   min="0" max="100" placeholder="70"
                                   value="${this.courseData.settings.passingGrade || ''}">
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>Green Computing</h3>

                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="green-computing-enabled"
                                       ${this.courseData.settings.greenComputingEnabled ? 'checked' : ''}>
                                Enable green computing tracking
                            </label>
                            <small class="form-hint">Track carbon footprint and energy usage for this course</small>
                        </div>

                        <div class="form-group">
                            <label for="sustainability-goals">Sustainability Goals</label>
                            <textarea id="sustainability-goals" class="form-textarea" rows="3"
                                      placeholder="Define environmental goals for this course...">${this.courseData.settings.sustainabilityGoals || ''}</textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Navigation listeners
        document.getElementById('next-step')?.addEventListener('click', () => this.nextStep());
        document.getElementById('prev-step')?.addEventListener('click', () => this.prevStep());
        document.getElementById('save-draft')?.addEventListener('click', () => this.saveDraft());
        document.getElementById('preview-course')?.addEventListener('click', () => this.previewCourse());

        // Basic info listeners
        document.getElementById('course-title')?.addEventListener('input', (e) => {
            this.courseData.basic.title = e.target.value;
        });
        document.getElementById('course-category')?.addEventListener('change', (e) => {
            this.courseData.basic.category = e.target.value;
        });
        document.getElementById('course-level')?.addEventListener('change', (e) => {
            this.courseData.basic.level = e.target.value;
        });
        document.getElementById('course-duration')?.addEventListener('input', (e) => {
            this.courseData.basic.duration = parseInt(e.target.value);
        });
        document.getElementById('course-credits')?.addEventListener('input', (e) => {
            this.courseData.basic.credits = parseInt(e.target.value);
        });
        document.getElementById('course-description')?.addEventListener('input', (e) => {
            this.courseData.basic.description = e.target.value;
        });
        document.getElementById('course-prerequisites')?.addEventListener('input', (e) => {
            this.courseData.basic.prerequisites = e.target.value;
        });

        // Objectives listeners
        document.getElementById('add-objective')?.addEventListener('click', () => this.addObjective());
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-objective')) {
                this.removeObjective(parseInt(e.target.dataset.index));
            }
        });

        // Curriculum listeners
        document.getElementById('add-module')?.addEventListener('click', () => this.addModule());
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-topic')) {
                this.addTopic(parseInt(e.target.dataset.moduleIndex));
            }
            if (e.target.classList.contains('remove-topic')) {
                this.removeTopic(
                    parseInt(e.target.dataset.moduleIndex),
                    parseInt(e.target.dataset.topicIndex)
                );
            }
        });

        // Lessons listeners
        document.getElementById('add-lesson')?.addEventListener('click', () => this.addLesson());

        // Assessments listeners
        document.getElementById('add-assessment')?.addEventListener('click', () => this.addAssessment());

        // File upload listeners
        document.getElementById('course-thumbnail-input')?.addEventListener('change', (e) => {
            this.handleThumbnailUpload(e);
        });
        document.getElementById('thumbnail-upload')?.addEventListener('click', () => {
            document.getElementById('course-thumbnail-input')?.click();
        });
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.renderCourseCreationPage();
                this.setupEventListeners();
            } else {
                this.publishCourse();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.renderCourseCreationPage();
            this.setupEventListeners();
        }
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validateBasicInfo();
            case 2:
                return this.validateCurriculum();
            case 3:
                return this.validateLessons();
            case 4:
                return this.validateAssessments();
            case 5:
                return this.validateSettings();
            default:
                return true;
        }
    }

    validateBasicInfo() {
        const title = document.getElementById('course-title')?.value;
        const category = document.getElementById('course-category')?.value;
        const level = document.getElementById('course-level')?.value;
        const duration = document.getElementById('course-duration')?.value;
        const description = document.getElementById('course-description')?.value;

        if (!title || !category || !level || !duration || !description) {
            this.showError('Please fill in all required fields');
            return false;
        }

        return true;
    }

    validateCurriculum() {
        if (this.courseData.curriculum.length === 0) {
            this.showError('Please add at least one module to your curriculum');
            return false;
        }

        for (const module of this.courseData.curriculum) {
            if (!module.title || module.topics.length === 0) {
                this.showError('Each module must have a title and at least one topic');
                return false;
            }
        }

        return true;
    }

    validateLessons() {
        if (this.courseData.lessons.length === 0) {
            this.showError('Please add at least one lesson');
            return false;
        }

        for (const lesson of this.courseData.lessons) {
            if (!lesson.title || !lesson.content) {
                this.showError('Each lesson must have a title and content');
                return false;
            }
        }

        return true;
    }

    validateAssessments() {
        // Assessments are optional, but if present, must be valid
        for (const assessment of this.courseData.assessments) {
            if (!assessment.title || !assessment.description) {
                this.showError('Each assessment must have a title and description');
                return false;
            }
        }

        return true;
    }

    validateSettings() {
        const enrollmentType = document.getElementById('enrollment-type')?.value;
        const courseStart = document.getElementById('course-start')?.value;

        if (!enrollmentType || !courseStart) {
            this.showError('Please configure enrollment type and course start date');
            return false;
        }

        return true;
    }

    addObjective() {
        if (!this.courseData.basic.objectives) {
            this.courseData.basic.objectives = [];
        }
        this.courseData.basic.objectives.push('');
        this.updateObjectivesList();
    }

    removeObjective(index) {
        this.courseData.basic.objectives.splice(index, 1);
        this.updateObjectivesList();
    }

    updateObjectivesList() {
        const objectivesList = document.getElementById('objectives-list');
        if (objectivesList) {
            objectivesList.innerHTML = this.renderObjectivesList();
        }
    }

    addModule() {
        this.courseData.curriculum.push({
            title: '',
            description: '',
            topics: []
        });
        this.updateModulesList();
    }

    addTopic(moduleIndex) {
        if (this.courseData.curriculum[moduleIndex]) {
            this.courseData.curriculum[moduleIndex].topics.push('');
            this.updateModulesList();
        }
    }

    removeTopic(moduleIndex, topicIndex) {
        if (this.courseData.curriculum[moduleIndex]) {
            this.courseData.curriculum[moduleIndex].topics.splice(topicIndex, 1);
            this.updateModulesList();
        }
    }

    updateModulesList() {
        const modulesContainer = document.getElementById('modules-container');
        if (modulesContainer) {
            modulesContainer.innerHTML = this.renderModulesList();
        }
    }

    addLesson() {
        this.courseData.lessons.push({
            title: '',
            type: 'video',
            duration: '',
            content: ''
        });
        this.updateLessonsList();
    }

    updateLessonsList() {
        const lessonsContainer = document.getElementById('lessons-container');
        if (lessonsContainer) {
            lessonsContainer.innerHTML = this.renderLessonsList();
        }
    }

    addAssessment() {
        this.courseData.assessments.push({
            title: '',
            type: 'quiz',
            weight: '',
            description: ''
        });
        this.updateAssessmentsList();
    }

    updateAssessmentsList() {
        const assessmentsContainer = document.getElementById('assessments-container');
        if (assessmentsContainer) {
            assessmentsContainer.innerHTML = this.renderAssessmentsList();
        }
    }

    handleThumbnailUpload(event) {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                this.showError('File size must be less than 2MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const uploadArea = document.getElementById('thumbnail-upload');
                uploadArea.innerHTML = `
                    <div class="upload-preview">
                        <img src="${e.target.result}" alt="Course thumbnail" class="thumbnail-preview">
                        <button type="button" class="btn btn-sm btn-danger remove-thumbnail">Remove</button>
                    </div>
                `;

                document.querySelector('.remove-thumbnail')?.addEventListener('click', () => {
                    this.removeThumbnail();
                });
            };
            reader.readAsDataURL(file);
        }
    }

    removeThumbnail() {
        const uploadArea = document.getElementById('thumbnail-upload');
        uploadArea.innerHTML = `
            <div class="upload-placeholder">
                <span class="upload-icon">📷</span>
                <span class="upload-text">Click to upload thumbnail</span>
                <span class="upload-hint">Recommended: 1200x675px, max 2MB</span>
            </div>
        `;
        document.getElementById('course-thumbnail-input').value = '';
    }

    async saveDraft() {
        try {
            this.collectCurrentStepData();

            // Save to localStorage for now (replace with API call later)
            const draftData = {
                ...this.courseData,
                lastModified: new Date().toISOString(),
                step: this.currentStep
            };

            localStorage.setItem('course-draft', JSON.stringify(draftData));
            this.showSuccess('Draft saved successfully!');
        } catch (error) {
            console.error('Failed to save draft:', error);
            this.showError('Failed to save draft');
        }
    }

    loadDraftData() {
        try {
            const draftData = localStorage.getItem('course-draft');
            if (draftData) {
                const parsed = JSON.parse(draftData);
                this.courseData = { ...this.courseData, ...parsed };
                this.currentStep = parsed.step || 1;
            }
        } catch (error) {
            console.error('Failed to load draft:', error);
        }
    }

    collectCurrentStepData() {
        switch (this.currentStep) {
            case 1:
                this.collectBasicInfoData();
                break;
            case 2:
                this.collectCurriculumData();
                break;
            case 3:
                this.collectLessonsData();
                break;
            case 4:
                this.collectAssessmentsData();
                break;
            case 5:
                this.collectSettingsData();
                break;
        }
    }

    collectBasicInfoData() {
        this.courseData.basic = {
            title: document.getElementById('course-title')?.value || '',
            category: document.getElementById('course-category')?.value || '',
            level: document.getElementById('course-level')?.value || '',
            duration: parseInt(document.getElementById('course-duration')?.value) || 0,
            credits: parseInt(document.getElementById('course-credits')?.value) || 0,
            description: document.getElementById('course-description')?.value || '',
            prerequisites: document.getElementById('course-prerequisites')?.value || '',
            objectives: this.courseData.basic.objectives || []
        };
    }

    collectCurriculumData() {
        // Curriculum data is already updated in real-time through event listeners
    }

    collectLessonsData() {
        // Lessons data is already updated in real-time through event listeners
    }

    collectAssessmentsData() {
        // Assessments data is already updated in real-time through event listeners
    }

    collectSettingsData() {
        this.courseData.settings = {
            enrollmentType: document.getElementById('enrollment-type')?.value || 'open',
            maxStudents: parseInt(document.getElementById('max-students')?.value) || null,
            enrollmentStart: document.getElementById('enrollment-start')?.value || '',
            enrollmentEnd: document.getElementById('enrollment-end')?.value || '',
            courseStart: document.getElementById('course-start')?.value || '',
            courseEnd: document.getElementById('course-end')?.value || '',
            selfPaced: document.getElementById('self-paced')?.checked || false,
            price: parseFloat(document.getElementById('course-price')?.value) || 0,
            certificateEnabled: document.getElementById('certificate-enabled')?.checked || false,
            passingGrade: parseInt(document.getElementById('passing-grade')?.value) || 70,
            greenComputingEnabled: document.getElementById('green-computing-enabled')?.checked || false,
            sustainabilityGoals: document.getElementById('sustainability-goals')?.value || ''
        };
    }

    async previewCourse() {
        this.collectCurrentStepData();

        // Open preview in new window/modal
        const previewWindow = window.open('', '_blank', 'width=1200,height=800');
        previewWindow.document.write(`
            <html>
                <head>
                    <title>Course Preview - ${this.courseData.basic.title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .preview-header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
                        .preview-section { margin-bottom: 30px; }
                        .preview-section h3 { color: #333; border-left: 4px solid #007bff; padding-left: 10px; }
                    </style>
                </head>
                <body>
                    <div class="preview-header">
                        <h1>${this.courseData.basic.title || 'Untitled Course'}</h1>
                        <p><strong>Category:</strong> ${this.courseData.basic.category}</p>
                        <p><strong>Level:</strong> ${this.courseData.basic.level}</p>
                        <p><strong>Duration:</strong> ${this.courseData.basic.duration} weeks</p>
                    </div>

                    <div class="preview-section">
                        <h3>Description</h3>
                        <p>${this.courseData.basic.description || 'No description provided'}</p>
                    </div>

                    <div class="preview-section">
                        <h3>Learning Objectives</h3>
                        <ul>
                            ${(this.courseData.basic.objectives || []).map(obj => `<li>${obj}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="preview-section">
                        <h3>Curriculum</h3>
                        ${this.courseData.curriculum.map((module, index) => `
                            <h4>Module ${index + 1}: ${module.title}</h4>
                            <p>${module.description}</p>
                            <ul>
                                ${module.topics.map(topic => `<li>${topic}</li>`).join('')}
                            </ul>
                        `).join('')}
                    </div>

                    <div class="preview-section">
                        <h3>Lessons (${this.courseData.lessons.length})</h3>
                        ${this.courseData.lessons.map((lesson, index) => `
                            <h4>Lesson ${index + 1}: ${lesson.title}</h4>
                            <p><strong>Type:</strong> ${lesson.type} | <strong>Duration:</strong> ${lesson.duration} minutes</p>
                        `).join('')}
                    </div>

                    <div class="preview-section">
                        <h3>Assessments (${this.courseData.assessments.length})</h3>
                        ${this.courseData.assessments.map((assessment, index) => `
                            <h4>${assessment.title}</h4>
                            <p><strong>Type:</strong> ${assessment.type} | <strong>Weight:</strong> ${assessment.weight}%</p>
                        `).join('')}
                    </div>
                </body>
            </html>
        `);
    }

    async publishCourse() {
        try {
            this.collectCurrentStepData();

            if (!this.validateAllSteps()) {
                this.showError('Please complete all required fields before publishing');
                return;
            }

            // Show confirmation dialog
            const confirmed = confirm('Are you sure you want to publish this course? Once published, it will be available to students.');
            if (!confirmed) return;

            // Simulate API call to publish course
            const courseData = {
                ...this.courseData,
                id: 'course_' + Date.now(),
                instructorId: this.user.id,
                status: 'published',
                createdAt: new Date().toISOString(),
                publishedAt: new Date().toISOString()
            };

            // For now, save to localStorage (replace with actual API call)
            const publishedCourses = JSON.parse(localStorage.getItem('published-courses') || '[]');
            publishedCourses.push(courseData);
            localStorage.setItem('published-courses', JSON.stringify(publishedCourses));

            // Clear draft
            localStorage.removeItem('course-draft');

            this.showSuccess('Course published successfully!');

            // Redirect to course management or dashboard
            setTimeout(() => {
                if (window.lecturerDashboardApp) {
                    window.lecturerDashboardApp.navigateToSection('courses');
                }
            }, 2000);

        } catch (error) {
            console.error('Failed to publish course:', error);
            this.showError('Failed to publish course. Please try again.');
        }
    }

    validateAllSteps() {
        return this.validateBasicInfo() &&
               this.validateCurriculum() &&
               this.validateLessons() &&
               this.validateAssessments() &&
               this.validateSettings();
    }

    showError(message) {
        // Create and show error notification
        const notification = document.createElement('div');
        notification.className = 'notification notification-error';
        notification.innerHTML = `
            <span class="notification-icon">❌</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">×</button>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    showSuccess(message) {
        // Create and show success notification
        const notification = document.createElement('div');
        notification.className = 'notification notification-success';
        notification.innerHTML = `
            <span class="notification-icon">✅</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">×</button>
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
}
