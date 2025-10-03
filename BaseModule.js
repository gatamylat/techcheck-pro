/**
 * @module BaseModule
 * @description Базовый класс для всех модулей системы
 * @version 1.0.0
 */

export default class BaseModule {
    constructor(app) {
        this.app = app;
        this.name = 'base-module';
        this.version = '1.0.0';
        this.dependencies = [];
        this.routes = [];
        this.initialized = false;
        this.api = {};
        
        // Метаданные модуля
        this.meta = {
            title: 'Base Module',
            icon: '📦',
            description: 'Базовый модуль',
            navLabel: 'Module',
            status: 'ready' // ready | beta | soon | hidden
        };
    }
    
    /**
     * Инициализация модуля
     * Вызывается автоматически при загрузке
     */
    async init() {
        this.log('Initializing...');
        
        // Проверяем зависимости
        if (!this.checkDependencies()) {
            throw new Error(`Missing dependencies for ${this.name}`);
        }
        
        // Регистрируем маршруты
        this.registerRoutes();
        
        // Загружаем данные
        await this.loadData();
        
        // Создаём API
        this.createAPI();
        
        this.initialized = true;
        this.log('Initialized successfully');
    }
    
    /**
     * Проверка зависимостей
     */
    checkDependencies() {
        for (const dep of this.dependencies) {
            if (!this.app.getModule(dep)) {
                this.log(`Missing dependency: ${dep}`, 'error');
                return false;
            }
        }
        return true;
    }
    
    /**
     * Регистрация маршрутов модуля
     */
    registerRoutes() {
        const router = this.app.router;
        if (!router) return;
        
        // Основной маршрут модуля
        router.add(`/${this.name}`, () => this.render());
        
        // Дополнительные маршруты
        this.routes.forEach(route => {
            router.add(route.path, route.handler.bind(this));
        });
    }
    
    /**
     * Загрузка данных модуля
     */
    async loadData() {
        // Проверяем localStorage
        const cached = this.getCache();
        if (cached) {
            this.data = cached;
            this.log('Data loaded from cache');
            return;
        }
        
        // Загружаем из JSON
        try {
            const response = await fetch(`data/${this.name}.json`);
            if (response.ok) {
                this.data = await response.json();
                this.setCache(this.data);
                this.log('Data loaded from file');
            }
        } catch (error) {
            this.log('No data file found, using defaults', 'warning');
            this.data = this.getDefaultData();
        }
    }
    
    /**
     * Данные по умолчанию
     */
    getDefaultData() {
        return {};
    }
    
    /**
     * Создание публичного API модуля
     */
    createAPI() {
        this.api = {
            getName: () => this.name,
            getVersion: () => this.version,
            getMeta: () => this.meta,
            getData: () => this.data,
            render: () => this.render(),
            // Добавляем методы специфичные для модуля
            ...this.getPublicMethods()
        };
    }
    
    /**
     * Публичные методы модуля (переопределяется в наследниках)
     */
    getPublicMethods() {
        return {};
    }
    
    /**
     * Основной метод рендеринга
     */
    /**
 * Основной метод рендеринга
 */
render() {
    const isMobile = window.innerWidth <= 767;
    
    // Для мобильных добавляем сайдбар
    if (isMobile) {
        // Проверяем, не существует ли уже сайдбар на странице
        const existingSidebar = document.getElementById('globalMobileSidebar');
if (existingSidebar) existingSidebar.remove();
const sidebarHtml = this.renderMobileSidebar();
        
        
        // НЕ используем mobile-content класс - управляем через CSS
        return `
            ${sidebarHtml}
            <div class="module-container" data-module="${this.name}">
                ${this.renderContent()}
            </div>
        `;
    }
    
    // Десктопная версия
    return `
        <div class="module-container" data-module="${this.name}">
            ${this.renderHeader()}
            ${this.renderContent()}
            ${this.renderFooter()}
        </div>
    `;
}
    
    /**
     * Рендер заголовка модуля
     */
    renderHeader() {
        return `
            <div class="module-header">
                <h1>
                    <span class="module-icon">${this.meta.icon}</span>
                    ${this.meta.title}
                </h1>
                <p class="module-description">${this.meta.description}</p>
            </div>
        `;
    }
    
    /**
     * Рендер контента (переопределяется в наследниках)
     */
    renderContent() {
        return `
            <div class="module-content">
                <p>Override renderContent() in your module</p>
            </div>
        `;
    }
    /**
 * Рендер мобильного сайдбара (единый для всех модулей)
 */
renderMobileSidebar() {
    // Только для мобильных устройств
    if (window.innerWidth > 767) return '';
    
    return `
        <aside class="mobile-sidebar" id="globalMobileSidebar">
            <div class="mobile-sidebar-toggle" onclick="this.parentElement.classList.toggle('expanded')">
                ☰
            </div>
            <div class="mobile-sidebar-content">
                <div class="mobile-sidebar-item" onclick="app.router.navigate('/')">
                    <div class="mobile-sidebar-icon">⚡</div>
                    <span class="mobile-sidebar-label">Главная</span>
                </div>
                
                <div class="mobile-sidebar-divider"></div>
                
                <div class="mobile-sidebar-item ${this.name === 'knowledge-base' ? 'active' : ''}" 
                     onclick="app.router.navigate('/knowledge-base')">
                    <div class="mobile-sidebar-icon">📚</div>
                    <span class="mobile-sidebar-label">База знаний</span>
                    <span class="mobile-sidebar-status mobile-status-ready">ok</span>
                </div>
                
                <div class="mobile-sidebar-item ${this.name === 'checklist' ? 'active' : ''}"
                     onclick="app.router.navigate('/checklist')">
                    <div class="mobile-sidebar-icon">✓</div>
                    <span class="mobile-sidebar-label">Чек-листы</span>
                    <span class="mobile-sidebar-status mobile-status-ready">ok</span>
                </div>
                
                <div class="mobile-sidebar-item ${this.name === 'documents' ? 'active' : ''}"
                     onclick="app.router.navigate('/documents')">
                    <div class="mobile-sidebar-icon">📋</div>
                    <span class="mobile-sidebar-label">Документы</span>
                    <span class="mobile-sidebar-status mobile-status-ready">ok</span>
                </div>
                
                <div class="mobile-sidebar-item ${this.name === 'wiki' ? 'active' : ''}"
                     onclick="app.router.navigate('/wiki')">
                    <div class="mobile-sidebar-icon">📖</div>
                    <span class="mobile-sidebar-label">Wiki</span>
                    <span class="mobile-sidebar-status mobile-status-beta">beta</span>
                </div>
                
                <div class="mobile-sidebar-item ${this.name === 'stories' ? 'active' : ''}"
                     onclick="app.router.navigate('/stories')">
                    <div class="mobile-sidebar-icon">💬</div>
                    <span class="mobile-sidebar-label">Stories</span>
                    <span class="mobile-sidebar-status mobile-status-beta">beta</span>
                </div>
                
                <div class="mobile-sidebar-divider"></div>
                
                <div class="mobile-sidebar-item disabled">
                    <div class="mobile-sidebar-icon">📊</div>
                    <span class="mobile-sidebar-label">Статистика</span>
                    <span class="mobile-sidebar-status mobile-status-soon">soon</span>
                </div>
                
                <div class="mobile-sidebar-item disabled">
                    <div class="mobile-sidebar-icon">🤖</div>
                    <span class="mobile-sidebar-label">AI Check</span>
                    <span class="mobile-sidebar-status mobile-status-soon">soon</span>
                </div>
            </div>
        </aside>
    `;
}
    
    /**
     * Рендер футера модуля
     */
    renderFooter() {
        return `
            <div class="module-footer">
                <small>Module: ${this.name} v${this.version}</small>
            </div>
        `;
    }
    
    /**
     * Работа с кэшем
     */
    getCache(key = null) {
        const cacheKey = `techcheck_${this.name}`;
        try {
            const cached = localStorage.getItem(cacheKey);
            if (!cached) return null;
            
            const data = JSON.parse(cached);
            return key ? data[key] : data;
        } catch (error) {
            this.log('Cache read error', 'error');
            return null;
        }
    }
    
    setCache(data, key = null) {
        const cacheKey = `techcheck_${this.name}`;
        try {
            if (key) {
                const existing = this.getCache() || {};
                existing[key] = data;
                localStorage.setItem(cacheKey, JSON.stringify(existing));
            } else {
                localStorage.setItem(cacheKey, JSON.stringify(data));
            }
            return true;
        } catch (error) {
            this.log('Cache write error', 'error');
            return false;
        }
    }
    
    clearCache() {
        const cacheKey = `techcheck_${this.name}`;
        localStorage.removeItem(cacheKey);
        this.log('Cache cleared');
    }
    
    /**
     * Утилиты
     */
    log(message, type = 'info') {
        this.app.log(`[${this.name}] ${message}`, type);
    }
    
    emit(event, data = {}) {
        // Отправляем событие через глобальную шину
        window.dispatchEvent(new CustomEvent(`module:${event}`, {
            detail: { module: this.name, ...data }
        }));
    }
    
    on(event, handler) {
        // Подписываемся на события
        window.addEventListener(`module:${event}`, handler);
    }
    
    off(event, handler) {
        // Отписываемся от событий
        window.removeEventListener(`module:${event}`, handler);
    }
    
    /**
     * Хелперы для работы с DOM
     */
    $(selector) {
        return document.querySelector(selector);
    }
    
    $$(selector) {
        return document.querySelectorAll(selector);
    }
    
    createElement(html) {
        const div = document.createElement('div');
        div.innerHTML = html.trim();
        return div.firstChild;
    }

/**
     * Показать изображение в модальном окне
     * Согласно документации techcheck-images-strategy.md
     */
    showExample(imagePath, caption) {
        // Создаем модальное окно для просмотра изображения
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="this.parentElement.parentElement.remove()">✕</button>
                <img src="${imagePath}" alt="${caption}" onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23f0f2f5%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-family=%22sans-serif%22 font-size=%2216%22 fill=%22%238c92a0%22%3E📷 Изображение недоступно%3C/text%3E%3C/svg%3E';">
                <p class="modal-caption">${caption}</p>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Блокируем скролл body
        document.body.style.overflow = 'hidden';
        
        // Восстанавливаем скролл при закрытии
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop') || 
                e.target.classList.contains('modal-close')) {
                document.body.style.overflow = '';
            }
        });
        
        // Закрытие по Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.body.style.overflow = '';
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    
    /**
     * Рендер галереи изображений
     */
    renderGallery(images) {
        if (!images || images.length === 0) return '';
        
        return `
            <div class="image-gallery">
                ${images.map((img, index) => `
                    <div class="gallery-item" 
                         onclick="app.getModule('${this.name}').showExample('${img.path || img.image}', '${img.caption || img.title}')">
                        ${img.path ? 
                            `<img src="${img.path}" alt="${img.caption}" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'image-placeholder\\'>📷</div>';">` :
                            `<div class="image-placeholder">📷</div>`
                        }
                        <div class="gallery-overlay">
                            <span>🔍 Смотреть</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * Рендер примеров (хорошие/плохие)
     */
    renderExamples(examples) {
        if (!examples || examples.length === 0) return '';
        
        return `
            <section class="examples-section">
                <h3>Примеры</h3>
                <div class="examples-grid">
                    ${examples.map(ex => `
                        <div class="example-card ${ex.type}" 
                             onclick="app.getModule('${this.name}').showExample('${ex.image}', '${ex.caption}')">
                            ${ex.image ? 
                                `<img src="${ex.image}" alt="${ex.caption}" loading="lazy" onerror="this.onerror=null; this.innerHTML='<div class=\\'image-placeholder\\'>📷</div>';">` :
                                `<div class="image-placeholder">${ex.type === 'bad' ? '❌' : '✅'}</div>`
                            }
                            <p>${ex.type === 'bad' ? '❌' : '✅'} ${ex.caption}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }
    
    /**
     * Lazy loading для изображений
     */
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    /**
     * Методы жизненного цикла
     */
    async beforeInit() {
        // Вызывается перед инициализацией
    }
    
    async afterInit() {
        // Вызывается после инициализации
    }
    
    async beforeDestroy() {
        // Вызывается перед уничтожением
    }
    
    destroy() {
        this.beforeDestroy();
        this.clearCache();
        this.initialized = false;
        this.log('Module destroyed');
    }
}

/**
 * ============================================
 * ПРИМЕР СОЗДАНИЯ НОВОГО МОДУЛЯ
 * ============================================
 * 
 * import BaseModule from './BaseModule.js';
 * 
 * export default class MyModule extends BaseModule {
 *     constructor(app) {
 *         super(app);
 *         this.name = 'my-module';
 *         this.version = '1.0.0';
 *         this.dependencies = ['_state', '_router'];
 *         
 *         this.meta = {
 *             title: 'Мой Модуль',
 *             icon: '🚀',
 *             description: 'Описание модуля',
 *             navLabel: 'Мой модуль',
 *             status: 'ready'
 *         };
 *     }
 *     
 *     renderContent() {
 *         return `
 *             <div>
 *                 <h2>Контент моего модуля</h2>
 *             </div>
 *         `;
 *     }
 *     
 *     getPublicMethods() {
 *         return {
 *             doSomething: () => this.doSomething()
 *         };
 *     }
 * }
 */
