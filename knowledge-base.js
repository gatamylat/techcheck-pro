/**
 * @module KnowledgeBase
 * @description База знаний - нормы проектирования Массивбург
 * @version 1.0.0
 * @dependencies ['_state', '_router']
 */

import BaseModule from './BaseModule.js';

export default class KnowledgeBase extends BaseModule {
    constructor(app) {
        super(app);
        this.name = 'knowledge-base';
        this.version = '1.0.0';
        this.dependencies = ['_state', '_router'];
        
        this.meta = {
            title: 'База знаний',
            icon: '📚',
            description: 'Нормы проектирования Массивбург, стандарты оформления, требования к документации',
            navLabel: 'База знаний',
            status: 'ready'
        };
        
        this.categories = [
            { 
                id: 'sketches',
                title: 'Эскизы и согласование',
                icon: '✏️',
                color: '#3b82f6'
            },
            { 
                id: 'drawings',
                title: 'Рабочие чертежи',
                icon: '📐',
                color: '#10b981'
            },
            { 
                id: 'specs',
                title: 'Спецификации',
                icon: '📋',
                color: '#f59e0b'
            },
            { 
                id: 'subcontract',
                title: 'Документы для субподряда',
                icon: '🏗️',
                color: '#8b5cf6'
            },
            { 
                id: 'basis',
                title: 'Базис Мебельщик',
                icon: '💾',
                color: '#ec4899'
            },
            { 
                id: 'typical',
                title: 'Типовые решения',
                icon: '🔧',
                color: '#06b6d4'
            },
            { 
                id: 'furniture',
                title: 'Фурнитура',
                icon: '🔩',
                color: '#84cc16'
            },
            { 
                id: 'tech',
                title: 'Встроенная техника',
                icon: '🔌',
                color: '#f97316'
            }
        ];
        
        this.searchQuery = '';
        this.currentCategory = null;
        this.currentArticle = null;
    }
    
    async loadData() {
        this.data = {
            articles: [
                {
                    id: 'sketch-approval',
                    category: 'sketches',
                    title: 'Оформление эскиза для согласования',
                    tags: ['эскиз', 'согласование', 'заказчик'],
                    content: {
                        overview: 'Все чертежи должны быть сохранены в формате PDF. Эскизы - это первичная документация для согласования с заказчиком.',
                        sections: [
                            {
                                title: 'Штамп чертежа',
                                items: [
                                    'Актуальная дата выпуска документации',
                                    'Фамилия исполнителя',
                                    'Номер и название изделия из ПланФикс',
                                    'Позиция и название детали или узла',
                                    'Порядковый номер листа'
                                ]
                            },
                            {
                                title: 'Первый лист',
                                items: [
                                    'Изометрические виды в цвете',
                                    'Условные текстуры материалов',
                                    'Описание используемых материалов',
                                    'Лицевая фурнитура и её цвет',
                                    'Подсветка (если есть)',
                                    'Перечень техники с моделями'
                                ]
                            }
                        ],
                        important: 'На первом листе обязательно размещаются изометрические виды изделия в цвете!'
                    }
                },
                {
                    id: 'main-drawings',
                    category: 'drawings',
                    title: 'Основные чертежи',
                    tags: ['чертеж', 'производство', 'цех'],
                    content: {
                        overview: 'После согласования заказчиком, раздел дополняется информацией для цеха.',
                        sections: [
                            {
                                title: 'Состав чертежей',
                                items: [
                                    'Вид спереди с фасадами и без',
                                    'Вид сверху (план, горизонтальный разрез)',
                                    'Основные сечения',
                                    'Все важные узлы крупно'
                                ]
                            },
                            {
                                title: 'Обязательные размеры',
                                items: [
                                    'Общие габариты изделия',
                                    'Высоты между полками',
                                    'Высоты от пола до штанг',
                                    'Зазоры между изделием и стенами',
                                    'Зазоры между фасадами (стандарт 4мм)'
                                ]
                            }
                        ],
                        important: 'Все выводы электрики, воды, люки должны быть нанесены на соответствующие виды!'
                    }
                },
                {
                    id: 'self-check',
                    category: 'drawings',
                    title: 'Лист самопроверки',
                    tags: ['проверка', 'чек-лист', 'контроль'],
                    content: {
                        overview: 'Перед передачей чертежей на согласование необходимо проверить критические моменты.',
                        sections: [
                            {
                                title: 'Основные пункты проверки',
                                items: [
                                    'Указаны отделка, цвет, маркировка ЛДСП',
                                    'Подписана техника (наименование/модель)',
                                    'Обозначены ручки (модель или скриншот)',
                                    'Указана информация по электрике',
                                    'Учтено расположение розеток',
                                    'Проверены габариты для проноса',
                                    'Учтен материал стен для крепления',
                                    'Обозначены все необходимые зазоры',
                                    'Фасады выше 1950мм - скрытые выпрямители',
                                    'Направление текстуры обозначено'
                                ]
                            }
                        ],
                        important: 'Фасады выше 1950мм требуют использования скрытых выпрямителей!'
                    }
                }
            ]
        };
        
        this.setCache(this.data);
    }
    
    renderContent() {
    if (this.currentArticle) {
        return this.renderArticle();
    }
    
    if (this.currentCategory) {
        return this.renderCategory();
    }
    
    return this.renderMain();
}
    
    renderMain() {
    const isMobile = window.innerWidth <= 767;
    return `
        <div class="knowledge-base">
            ${isMobile ? '<h1 class="gradient-text mobile-page-title">База знаний</h1>' : ''}
            ${this.renderSearch()}
                
                <div class="categories-grid">
                    ${this.categories.map(cat => this.renderCategoryCard(cat)).join('')}
                </div>
                
                <div class="recent-articles">
                    <h3>Популярные статьи</h3>
                    <div class="articles-list">
                        ${this.getPopularArticles().map(article => 
                            this.renderArticleCard(article)
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderSearch() {
        return `
            <div class="search-container">
                <input type="text" 
                       class="search-input" 
                       placeholder="Поиск по базе знаний..." 
                       value="${this.searchQuery}"
                       onkeyup="app.getModule('knowledge-base').search(this.value)">
                <button class="search-btn">🔍</button>
            </div>
        `;
    }
    
    renderCategoryCard(category) {
        const count = this.data.articles.filter(a => a.category === category.id).length;
        
        return `
            <div class="category-card" 
                 onclick="app.getModule('knowledge-base').openCategory('${category.id}')"
                 style="border-left-color: ${category.color};">
                <div class="category-icon" style="background: ${category.color}20;">
                    ${category.icon}
                </div>
                <h3>${category.title}</h3>
                <span class="category-count">${count} статей</span>
            </div>
        `;
    }
    
    renderArticleCard(article) {
        const category = this.categories.find(c => c.id === article.category);
        
        return `
            <div class="article-card" 
                 onclick="app.getModule('knowledge-base').openArticle('${article.id}')">
                <div class="article-header">
                    <span class="article-category" style="color: ${category?.color}">
                        ${category?.icon} ${category?.title}
                    </span>
                </div>
                <h4>${article.title}</h4>
                <div class="article-tags">
                    ${article.tags.map(tag => 
                        `<span class="tag">#${tag}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    renderCategory() {
        const category = this.categories.find(c => c.id === this.currentCategory);
        const articles = this.data.articles.filter(a => a.category === this.currentCategory);
        
        return `
            <div class="category-page">
                <div class="breadcrumbs">
                    <span onclick="app.getModule('knowledge-base').goHome()">
                        База знаний
                    </span>
                    <span>→</span>
                    <span>${category.title}</span>
                </div>
                
                <div class="category-header" style="border-left-color: ${category.color};">
                    <h2>
                        <span style="color: ${category.color};">${category.icon}</span>
                        ${category.title}
                    </h2>
                </div>
                
                <div class="articles-grid">
                    ${articles.map(article => this.renderArticleCard(article)).join('')}
                </div>
            </div>
        `;
    }
    
    renderArticle() {
        const article = this.data.articles.find(a => a.id === this.currentArticle);
        if (!article) return '<p>Статья не найдена</p>';
        
        const category = this.categories.find(c => c.id === article.category);
        
        return `
            <div class="article-page">
                <div class="breadcrumbs">
                    <span onclick="app.getModule('knowledge-base').goHome()">
                        База знаний
                    </span>
                    <span>→</span>
                    <span onclick="app.getModule('knowledge-base').openCategory('${category.id}')">
                        ${category.title}
                    </span>
                    <span>→</span>
                    <span>${article.title}</span>
                </div>
                
                <article>
                    <header class="article-header">
                        <h1>${article.title}</h1>
                        <div class="article-meta">
                            <span class="category-badge" style="background: ${category.color}20; color: ${category.color};">
                                ${category.icon} ${category.title}
                            </span>
                        </div>
                    </header>
                    
                    <div class="article-content">
                        <div class="overview">
                            ${article.content.overview}
                        </div>
                        
                        ${article.content.important ? `
                            <div class="important-block">
                                <strong>⚠️ Важно:</strong> ${article.content.important}
                            </div>
                        ` : ''}
                        
                        ${article.content.sections.map(section => `
                            <section>
                                <h3>${section.title}</h3>
                                <ul>
                                    ${section.items.map(item => `<li>${item}</li>`).join('')}
                                </ul>
                            </section>
                        `).join('')}
                    </div>
                    
                    <footer class="article-footer">
                        <div class="article-tags">
                            ${article.tags.map(tag => 
                                `<span class="tag" onclick="app.getModule('knowledge-base').searchByTag('${tag}')">
                                    #${tag}
                                </span>`
                            ).join('')}
                        </div>
                    </footer>
                </article>
            </div>
        `;
    }
    
    getPublicMethods() {
        return {
            search: (query) => this.search(query),
            openCategory: (id) => this.openCategory(id),
            openArticle: (id) => this.openArticle(id),
            goHome: () => this.goHome(),
            searchByTag: (tag) => this.searchByTag(tag)
        };
    }
   
    search(query) {
        this.searchQuery = query;
        this.log(`Searching: ${query}`);
        this.render();
    }
    
    openCategory(categoryId) {
        this.currentCategory = categoryId;
        this.currentArticle = null;
        this.app.router.navigate(`/knowledge-base/category/${categoryId}`);
        this.render();
    }
    
    openArticle(articleId) {
        this.currentArticle = articleId;
        this.app.router.navigate(`/knowledge-base/article/${articleId}`);
        this.render();
    }
    
    goHome() {
        this.currentCategory = null;
        this.currentArticle = null;
        this.app.router.navigate('/knowledge-base');
        this.render();
    }
    
    searchByTag(tag) {
        this.searchQuery = `#${tag}`;
        this.search(this.searchQuery);
    }
    
    getPopularArticles() {
        return this.data.articles.slice(0, 3);
    }
}
