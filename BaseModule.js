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
    render() {
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