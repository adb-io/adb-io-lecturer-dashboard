/**
 * ADB-IO Student Portal - AI Assistant Module
 * Green Computing: Efficient AI integration with minimal resource usage
 */

export default class AIAssistant {
    constructor(user) {
        this.user = user;
        this.chatHistory = [];
        this.isTyping = false;
        this.recommendations = [];
        this.learningProfile = {};
        this.init();
    }

    async init() {
        try {
            await this.loadAIData();
            this.renderAIPage();
            this.setupEventListeners();
            this.loadChatHistory();
        } catch (error) {
            console.error('Failed to initialize AI assistant:', error);
            this.showError('Failed to load AI assistant');
        }
    }

    async loadAIData() {
        try {
            const [recommendations, profile] = await Promise.all([
                this.loadRecommendations(),
                this.loadLearningProfile()
            ]);

            this.recommendations = recommendations;
            this.learningProfile = profile;

            return { recommendations, profile };
        } catch (error) {
            console.error('Error loading AI data:', error);
            throw error;
        }
    }

    async loadRecommendations() {
        // Mock data - replace with actual AI API call
        return [
            {
                id: 1,
                type: 'study-plan',
                title: 'Optimize Your Study Schedule',
                description: 'Based on your learning patterns, I recommend studying JavaScript for 45 minutes in the morning.',
                confidence: 0.89,
                priority: 'high',
                actionable: true,
                estimatedImpact: 'High',
                category: 'productivity'
            },
            {
                id: 2,
                type: 'content',
                title: 'Review Weak Areas',
                description: 'Your quiz results show you need more practice with async/await concepts.',
                confidence: 0.76,
                priority: 'medium',
                actionable: true,
                estimatedImpact: 'Medium',
                category: 'learning'
            },
            {
                id: 3,
                type: 'motivation',
                title: 'Celebrate Your Progress',
                description: 'You\'ve completed 75% of your courses! Keep up the excellent work.',
                confidence: 1.0,
                priority: 'low',
                actionable: false,
                estimatedImpact: 'Low',
                category: 'motivation'
            }
        ];
    }

    async loadLearningProfile() {
        // Mock data - replace with actual AI API call
        return {
            learningStyle: 'visual',
            preferredTime: 'morning',
            averageSessionLength: 45,
            strengths: ['Problem Solving', 'Logical Thinking'],
            weaknesses: ['Time Management', 'Async Programming'],
            interests: ['Web Development', 'AI/ML'],
            goals: ['Complete JavaScript Course', 'Build Portfolio Project'],
            carbonFootprint: {
                saved: 2.3,
                target: 5.0,
                efficiency: 76
            }
        };
    }

    renderAIPage() {
        const aiSection = document.getElementById('ai-assistant');
        if (!aiSection) return;

        const aiHTML = `
            <div class="section-header">
                <h1 class="section-title">🤖 AI Assistant</h1>
                <p class="section-subtitle">Get personalized learning recommendations and support.</p>
            </div>

            <div class="ai-assistant-container">
                ${this.renderAIChat()}
                ${this.renderAIRecommendations()}
                ${this.renderLearningInsights()}
            </div>
        `;

        aiSection.innerHTML = aiHTML;
    }

    renderAIChat() {
        return `
            <div class="ai-chat">
                <div class="ai-chat__header">
                    <h3 class="ai-chat__title">
                        <span class="ai-status-indicator"></span>
                        AI Learning Assistant
                    </h3>
                    <div class="ai-chat__actions">
                        <button class="ai-chat__clear" title="Clear chat">🗑️</button>
                        <button class="ai-chat__settings" title="Settings">⚙️</button>
                    </div>
                </div>
                
                <div class="ai-chat__messages" id="ai-chat-messages">
                    <div class="ai-message ai-message--assistant">
                        <div class="ai-message__avatar">🤖</div>
                        <div class="ai-message__content">
                            <p>Hello! I'm your AI learning assistant. I can help you with:</p>
                            <ul>
                                <li>📚 Study recommendations</li>
                                <li>📊 Progress analysis</li>
                                <li>🎯 Goal setting</li>
                                <li>🌱 Green learning tips</li>
                            </ul>
                            <p>What would you like to know?</p>
                        </div>
                        <div class="ai-message__timestamp">${this.formatTime(new Date())}</div>
                    </div>
                </div>
                
                <div class="ai-chat__input">
                    <textarea 
                        id="ai-chat-input" 
                        class="ai-chat__input-field" 
                        placeholder="Ask me anything about your learning..."
                        rows="2"
                    ></textarea>
                    <button id="ai-chat-send" class="ai-chat__send-btn" disabled>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22,2 15,22 11,13 2,9"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    renderAIRecommendations() {
        return `
            <div class="ai-recommendations-section">
                <h2 class="dashboard-section__title">💡 AI Recommendations</h2>
                <div class="ai-recommendations-grid">
                    ${this.recommendations.map(rec => this.renderRecommendationCard(rec)).join('')}
                </div>
            </div>
        `;
    }

    renderRecommendationCard(recommendation) {
        const priorityColor = this.getPriorityColor(recommendation.priority);
        const confidencePercentage = Math.round(recommendation.confidence * 100);

        return `
            <div class="ai-recommendation-card" data-recommendation-id="${recommendation.id}">
                <div class="ai-recommendation-header">
                    <div class="ai-recommendation-type">${recommendation.category}</div>
                    <div class="ai-recommendation-priority" style="background: ${priorityColor};">
                        ${recommendation.priority}
                    </div>
                </div>
                
                <h3 class="ai-recommendation-title">${recommendation.title}</h3>
                <p class="ai-recommendation-description">${recommendation.description}</p>
                
                <div class="ai-recommendation-meta">
                    <div class="ai-confidence">
                        <span class="ai-confidence-label">Confidence:</span>
                        <div class="ai-confidence-bar">
                            <div class="ai-confidence-fill" style="width: ${confidencePercentage}%"></div>
                        </div>
                        <span class="ai-confidence-value">${confidencePercentage}%</span>
                    </div>
                    
                    <div class="ai-impact">
                        <span class="ai-impact-label">Impact:</span>
                        <span class="ai-impact-value">${recommendation.estimatedImpact}</span>
                    </div>
                </div>
                
                ${recommendation.actionable ? `
                    <div class="ai-recommendation-actions">
                        <button class="btn btn--primary btn--sm" data-action="apply" data-recommendation-id="${recommendation.id}">
                            Apply Recommendation
                        </button>
                        <button class="btn btn--secondary btn--sm" data-action="dismiss" data-recommendation-id="${recommendation.id}">
                            Dismiss
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderLearningInsights() {
        const { learningProfile } = this;
        
        return `
            <div class="learning-insights-section">
                <h2 class="dashboard-section__title">📊 Learning Insights</h2>
                
                <div class="insights-grid">
                    <div class="insight-card">
                        <h3>Learning Style</h3>
                        <div class="insight-value">${learningProfile.learningStyle}</div>
                        <p class="insight-description">Your preferred learning approach</p>
                    </div>
                    
                    <div class="insight-card">
                        <h3>Optimal Study Time</h3>
                        <div class="insight-value">${learningProfile.preferredTime}</div>
                        <p class="insight-description">When you learn most effectively</p>
                    </div>
                    
                    <div class="insight-card">
                        <h3>Session Length</h3>
                        <div class="insight-value">${learningProfile.averageSessionLength} min</div>
                        <p class="insight-description">Your average study session</p>
                    </div>
                    
                    <div class="insight-card">
                        <h3>Green Efficiency</h3>
                        <div class="insight-value">${learningProfile.carbonFootprint.efficiency}%</div>
                        <p class="insight-description">Carbon footprint efficiency</p>
                    </div>
                </div>
                
                <div class="strengths-weaknesses">
                    <div class="strengths">
                        <h3>💪 Strengths</h3>
                        <ul>
                            ${learningProfile.strengths.map(strength => `<li>${strength}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="weaknesses">
                        <h3>🎯 Areas for Improvement</h3>
                        <ul>
                            ${learningProfile.weaknesses.map(weakness => `<li>${weakness}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="carbon-impact">
                    <h3>🌱 Environmental Impact</h3>
                    <div class="carbon-stats">
                        <div class="carbon-stat">
                            <span class="carbon-value">${learningProfile.carbonFootprint.saved}kg</span>
                            <span class="carbon-label">CO₂ Saved</span>
                        </div>
                        <div class="carbon-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(learningProfile.carbonFootprint.saved / learningProfile.carbonFootprint.target) * 100}%"></div>
                            </div>
                            <span class="carbon-target">Target: ${learningProfile.carbonFootprint.target}kg</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Chat input handling
        const chatInput = document.getElementById('ai-chat-input');
        const sendButton = document.getElementById('ai-chat-send');

        if (chatInput && sendButton) {
            chatInput.addEventListener('input', (e) => {
                sendButton.disabled = e.target.value.trim().length === 0;
            });

            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            sendButton.addEventListener('click', () => this.sendMessage());
        }

        // Chat actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.ai-chat__clear')) {
                this.clearChat();
            } else if (e.target.matches('[data-action="apply"]')) {
                const recommendationId = e.target.getAttribute('data-recommendation-id');
                this.applyRecommendation(recommendationId);
            } else if (e.target.matches('[data-action="dismiss"]')) {
                const recommendationId = e.target.getAttribute('data-recommendation-id');
                this.dismissRecommendation(recommendationId);
            }
        });
    }

    async sendMessage() {
        const input = document.getElementById('ai-chat-input');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        document.getElementById('ai-chat-send').disabled = true;

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Simulate AI response
            const response = await this.getAIResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'assistant');
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
            console.error('AI response error:', error);
        }
    }

    async getAIResponse(message) {
        // Mock AI response - replace with actual AI API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const responses = [
            "Based on your learning pattern, I recommend focusing on JavaScript fundamentals for the next week.",
            "Your progress in Data Structures is excellent! Consider moving to advanced algorithms next.",
            "I notice you learn best in the morning. Try scheduling your most challenging topics then.",
            "Great question! Let me analyze your learning data and provide personalized recommendations.",
            "Your green learning efficiency is at 76%. Here are some tips to improve it further..."
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `ai-message ai-message--${sender}`;
        
        messageElement.innerHTML = `
            ${sender === 'assistant' ? '<div class="ai-message__avatar">🤖</div>' : ''}
            <div class="ai-message__content">
                <p>${content}</p>
            </div>
            <div class="ai-message__timestamp">${this.formatTime(new Date())}</div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Save to chat history
        this.chatHistory.push({
            content,
            sender,
            timestamp: new Date()
        });
    }

    showTypingIndicator() {
        this.isTyping = true;
        const messagesContainer = document.getElementById('ai-chat-messages');
        const typingElement = document.createElement('div');
        typingElement.className = 'ai-message ai-message--assistant ai-typing';
        typingElement.id = 'ai-typing-indicator';
        
        typingElement.innerHTML = `
            <div class="ai-message__avatar">🤖</div>
            <div class="ai-message__content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingElement = document.getElementById('ai-typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    clearChat() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        messagesContainer.innerHTML = `
            <div class="ai-message ai-message--assistant">
                <div class="ai-message__avatar">🤖</div>
                <div class="ai-message__content">
                    <p>Chat cleared! How can I help you today?</p>
                </div>
                <div class="ai-message__timestamp">${this.formatTime(new Date())}</div>
            </div>
        `;
        this.chatHistory = [];
    }

    async applyRecommendation(recommendationId) {
        try {
            const recommendation = this.recommendations.find(r => r.id == recommendationId);
            if (!recommendation) return;

            console.log(`Applying recommendation: ${recommendation.title}`);
            this.showSuccess(`Applied: ${recommendation.title}`);
            
            // Remove recommendation from UI
            const card = document.querySelector(`[data-recommendation-id="${recommendationId}"]`);
            if (card) {
                card.style.opacity = '0.5';
                card.querySelector('.ai-recommendation-actions').innerHTML = '<span class="applied-label">✅ Applied</span>';
            }
            
        } catch (error) {
            console.error('Failed to apply recommendation:', error);
            this.showError('Failed to apply recommendation');
        }
    }

    async dismissRecommendation(recommendationId) {
        try {
            const card = document.querySelector(`[data-recommendation-id="${recommendationId}"]`);
            if (card) {
                card.style.transition = 'opacity 0.3s ease';
                card.style.opacity = '0';
                setTimeout(() => card.remove(), 300);
            }
            
        } catch (error) {
            console.error('Failed to dismiss recommendation:', error);
        }
    }

    loadChatHistory() {
        // Load chat history from localStorage
        const saved = localStorage.getItem('ai-chat-history');
        if (saved) {
            this.chatHistory = JSON.parse(saved);
        }
    }

    saveChatHistory() {
        localStorage.setItem('ai-chat-history', JSON.stringify(this.chatHistory));
    }

    // Utility methods
    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    getPriorityColor(priority) {
        const colors = {
            high: '#ef4444',
            medium: '#f59e0b',
            low: '#10b981'
        };
        return colors[priority] || '#6b7280';
    }

    showSuccess(message) {
        console.log('Success:', message);
    }

    showError(message) {
        console.error('Error:', message);
    }

    destroy() {
        this.saveChatHistory();
        // Clean up event listeners and resources
    }
}
