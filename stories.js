/**
 * @module Stories
 * @description Кейсы, примеры решений, обсуждения
 * @version 1.0.0
 * @dependencies ['_state', '_router']
 */

import BaseModule from './BaseModule.js';

export default class Stories extends BaseModule {
    constructor(app) {
        super(app);
        this.name = 'stories';
        this.version = '1.0.0';
        this.dependencies = ['_state', '_router'];
        
        this.meta = {
            title: 'Stories',
            icon: '💬',
            description: 'Кейсы, примеры решений, обсуждения',
            navLabel: 'Stories',
            status: 'beta'
        };
    }
    
    async loadData() {
        // Демо данные для Stories
        this.data = {
            stories: [
                {
                    id: 1,
                    title: 'Успешная проверка сложного проекта',
                    author: 'Иван Петров',
                    avatar: '👤',
                    date: '2 дня назад',
                    category: 'Кейс',
                    content: 'Делюсь опытом проверки проекта кухни-гостиной площадью 45м². Основные сложности были с...',
                    likes: 24,
                    comments: 8,
                    image: null,
                    tags: ['кухня', 'проверка', 'опыт']
                },
                {
                    id: 2,
                    title: 'Лайфхак: быстрая проверка спецификаций',
                    author: 'Мария Сидорова',
                    avatar: '👩',
                    date: '1 неделю назад',
                    category: 'Совет',
                    content: 'Нашла способ как сократить время проверки спецификаций в 2 раза. Использую макрос который...',
                    likes: 45,
                    comments: 12,
                    image: null,
                    tags: ['спецификация', 'оптимизация', 'совет']
                },
                {
                    id: 3,
                    title: 'Проблема с фасадами выше 1950мм',
                    author: 'Алексей Козлов',
                    avatar: '👨',
                    date: '3 недели назад',
                    category: 'Вопрос',
                    content: 'Столкнулся с проблемой при проектировании высоких фасадов. Забыл про выпрямители и...',
                    likes: 15,
                    comments: 23,
                    image: null,
                    tags: ['фасады', 'проблема', 'решение']
                }
            ],
            
            categories: [
                { id: 'case', name: 'Кейсы', count: 12 },
                { id: 'tip', name: 'Советы', count: 28 },
                { id: 'question', name: 'Вопросы', count: 15 },
                { id: 'discussion', name: 'Обсуждения', count: 7 }
            ]
        };
        
        this.setCache(this.data);
    }
    
    renderContent() {
        return `
            <div class="stories-container">
                <div class="stories-header">
                    <h1>${this.meta.icon} ${this.meta.title}</h1>
                    <p>${this.meta.description}</p>
                </div>
                
                <div class="stories-toolbar" style="display: flex; gap: 1rem; margin: 2rem 0; align-items: center;">
                    <button class="btn btn-primary" onclick="app.getModule('stories').createStory()">
                        ✍️ Написать
                    </button>
                    
                    <div class="stories-filters" style="display: flex; gap: 0.5rem; margin-left: auto;">
                        ${this.data.categories.map(cat => `
                            <button class="tab" style="padding: 0.5rem 1rem; background: var(--bg-secondary); 
                                    border: none; border-radius: var(--radius); cursor: pointer;">
                                ${cat.name} (${cat.count})
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="stories-feed">
                    ${this.data.stories.map(story => this.renderStory(story)).join('')}
                </div>
                
                <div style="text-align: center; padding: 2rem;">
                    <button class="btn btn-secondary">
                        Загрузить ещё
                    </button>
                </div>
            </div>
        `;
    }
    
    renderStory(story) {
        return `
            <article class="story-card card" style="margin-bottom: 1.5rem;">
                <div class="story-header" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <div class="story-avatar" style="width: 40px; height: 40px; background: var(--bg-secondary); 
                         border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                         font-size: 1.5rem;">
                        ${story.avatar}
                    </div>
                    <div>
                        <div style="font-weight: 600;">${story.author}</div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary);">
                            ${story.date} • ${story.category}
                        </div>
                    </div>
                </div>
                
                <div class="story-content">
                    <h3 style="margin-bottom: 1rem;">${story.title}</h3>
                    <p style="color: var(--text-secondary); line-height: 1.6;">
                        ${story.content}
                    </p>
                    
                    <div class="story-tags" style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        ${story.tags.map(tag => `
                            <span style="padding: 0.25rem 0.75rem; background: var(--bg-secondary); 
                                  border-radius: var(--radius-full); font-size: 0.875rem;">
                                #${tag}
                            </span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="story-actions" style="display: flex; gap: 1rem; margin-top: 1.5rem; 
                     padding-top: 1rem; border-top: 1px solid var(--border-color);">
                    <button class="story-action" style="display: flex; align-items: center; gap: 0.5rem; 
                            background: none; border: none; cursor: pointer; color: var(--text-secondary);"
                            onclick="app.getModule('stories').likeStory(${story.id})">
                        ❤️ ${story.likes}
                    </button>
                    <button class="story-action" style="display: flex; align-items: center; gap: 0.5rem; 
                            background: none; border: none; cursor: pointer; color: var(--text-secondary);"
                            onclick="app.getModule('stories').openComments(${story.id})">
                        💬 ${story.comments}
                    </button>
                    <button class="story-action" style="display: flex; align-items: center; gap: 0.5rem; 
                            background: none; border: none; cursor: pointer; color: var(--text-secondary); 
                            margin-left: auto;">
                        🔗 Поделиться
                    </button>
                </div>
            </article>
        `;
    }
    
    getPublicMethods() {
        return {
            createStory: () => this.createStory(),
            likeStory: (id) => this.likeStory(id),
            openComments: (id) => this.openComments(id)
        };
    }
    
    createStory() {
        this.log('Creating new story...');
        alert('Создание историй будет добавлено в следующей версии');
    }
    
    likeStory(id) {
        this.log(`Liked story ${id}`);
        const story = this.data.stories.find(s => s.id === id);
        if (story) {
            story.likes++;
            this.render();
        }
    }
    
    openComments(id) {
        this.log(`Opening comments for story ${id}`);
        alert('Комментарии будут добавлены в следующей версии');
    }
    
    render() {
        const container = document.getElementById('content');
        if (container) {
            container.innerHTML = this.renderContent();
        }
    }
}
