/**
 * @module Wiki
 * @description База знаний команды
 * @version 1.0.0
 * @dependencies ['_state', '_router']
 */

import BaseModule from './BaseModule.js';

export default class Wiki extends BaseModule {
    constructor(app) {
        super(app);
        this.name = 'wiki';
        this.version = '1.0.0';
        this.dependencies = ['_state', '_router'];
        
        this.meta = {
            title: 'Wiki',
            icon: '📖',
            description: 'База знаний команды, инструкции, best practices',
            navLabel: 'Wiki',
            status: 'beta'
        };
        
        this.articles = [];
    }
    
    async loadData() {
        // Демо данные для Wiki
        this.data = {
            categories: [
                { id: 'guides', name: 'Руководства', icon: '📚', count: 3 },
                { id: 'faq', name: 'Частые вопросы', icon: '❓', count: 5 },
                { id: 'tips', name: 'Советы и трюки', icon: '💡', count: 4 },
                { id: 'updates', name: 'Обновления', icon: '🔄', count: 2 }
            ],
            articles: [
                {
                    id: 1,
                    category: 'guides',
                    title: 'Как начать работу с системой',
                    content: 'Пошаговое руководство для новых пользователей...',
                    author: 'Админ',
                    date: '2024-01-15',
                    views: 245
                },
                {
                    id: 2,
                    category: 'faq',
                    title: 'Как добавить новый ГОСТ?',
                    content: 'Для добавления нового стандарта необходимо...',
                    author: 'Техподдержка',
                    date: '2024-01-10',
                    views: 128
                },
                {
                    id: 3,
                    category: 'tips',
                    title: 'Горячие клавиши',
                    content: 'Список полезных сочетаний клавиш...',
                    author: 'Разработчик',
                    date: '2024-01-08',
                    views: 89
                }
            ]
        };
        
        this.setCache(this.data);
    }
    
    renderContent() {
        return `
            <div class="wiki-container">
                <div class="wiki-header">
                    <h1>${this.meta.icon} ${this.meta.title}</h1>
                    <p>${this.meta.description}</p>
                </div>
                
                <div class="wiki-actions">
                    <button class="btn btn-primary" onclick="app.getModule('wiki').createArticle()">
                        ➕ Создать статью
                    </button>
                    <input type="search" placeholder="Поиск по Wiki..." class="search-input" 
                           style="max-width: 300px; margin-left: auto;">
                </div>
                
                <div class="wiki-content" style="display: grid; grid-template-columns: 250px 1fr; gap: 2rem; margin-top: 2rem;">
                    <aside class="wiki-sidebar">
                        <h3>Категории</h3>
                        <div class="categories-list">
                            ${this.data.categories.map(cat => `
                                <div class="category-item" style="padding: 0.75rem; margin-bottom: 0.5rem; 
                                     background: var(--bg-secondary); border-radius: var(--radius); 
                                     cursor: pointer; transition: var(--transition);"
                                     onmouseover="this.style.background='var(--bg-tertiary)'"
                                     onmouseout="this.style.background='var(--bg-secondary)'">
                                    <span>${cat.icon}</span>
                                    <span>${cat.name}</span>
                                    <span style="margin-left: auto; background: var(--bg-primary); 
                                          padding: 0.25rem 0.5rem; border-radius: var(--radius-full); 
                                          font-size: 0.75rem;">${cat.count}</span>
                                </div>
                            `).join('')}
                        </div>
                    </aside>
                    
                    <main class="wiki-articles">
                        <h3>Последние статьи</h3>
                        <div class="articles-list">
                            ${this.data.articles.map(article => `
                                <article class="wiki-article card" style="margin-bottom: 1rem;">
                                    <h4>${article.title}</h4>
                                    <p style="color: var(--text-secondary);">${article.content}</p>
                                    <div style="display: flex; gap: 1rem; margin-top: 1rem; 
                                                font-size: 0.875rem; color: var(--text-light);">
                                        <span>👤 ${article.author}</span>
                                        <span>📅 ${article.date}</span>
                                        <span>👁️ ${article.views} просмотров</span>
                                        <a href="#" style="margin-left: auto;">Читать далее →</a>
                                    </div>
                                </article>
                            `).join('')}
                        </div>
                        
                        <div class="wiki-placeholder" style="text-align: center; padding: 3rem; 
                                                             background: var(--bg-secondary); 
                                                             border-radius: var(--radius); 
                                                             margin-top: 2rem;">
                            <p style="color: var(--text-secondary);">
                                Wiki находится в разработке. Скоро здесь появится больше контента!
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        `;
    }
    
    getPublicMethods() {
        return {
            createArticle: () => this.createArticle(),
            searchArticles: (query) => this.searchArticles(query)
        };
    }
    
    createArticle() {
        this.log('Creating new article...');
        alert('Функция создания статей будет добавлена в следующей версии');
    }
    
    searchArticles(query) {
        this.log(`Searching for: ${query}`);
        // Поиск по статьям
    }
}