/**
 * @module Router
 * @description Клиентский роутер для навигации между модулями
 * @version 1.0.0
 */

export default class Router {
    constructor(app) {
        this.app = app;
        this.routes = new Map();
        this.currentRoute = null;
        this.history = [];
        
        // Базовые маршруты
        this.routes.set('/', () => this.renderHome());
        this.routes.set('/404', () => this.render404());
    }
    
    /**
     * Инициализация роутера
     */
    init() {
        // Подписываемся на изменения хеша
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('popstate', () => this.handleRoute());
        
        this.app.log('Router initialized', 'system');
    }
    
    /**
     * Запуск роутера
     */
    start() {
        this.handleRoute();
    }
    
    /**
     * Добавление маршрута
     */
    add(path, handler) {
        this.routes.set(path, handler);
        this.app.log(`Route registered: ${path}`, 'system');
    }
    
    /**
     * Удаление маршрута
     */
    remove(path) {
        this.routes.delete(path);
    }
    
    /**
     * Навигация
     */
    navigate(path, data = {}) {
        // Сохраняем в историю
        if (this.currentRoute) {
            this.history.push(this.currentRoute);
        }
        
        // Меняем URL
        window.location.hash = path;
        
        // Передаём данные
        this.routeData = data;
        
        this.app.log(`Navigate to: ${path}`, 'module');
    }
    
    /**
     * Назад
     */
    back() {
        if (this.history.length > 0) {
            const previous = this.history.pop();
            this.navigate(previous);
        } else {
            this.navigate('/');
        }
    }
    
    /**
     * Обработка маршрута
     */
    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        this.currentRoute = hash;
        
        // Обновляем активный пункт меню
        this.updateNavigation(hash);
        
        // Ищем обработчик
        const handler = this.routes.get(hash);
        
        if (handler) {
            // Вызываем обработчик
            const content = handler(this.routeData);
            this.render(content);
        } else {
            // Пробуем найти модуль
            const moduleName = hash.slice(1).split('/')[0];
            const module = this.app.getModule(moduleName);
            
            if (module) {
                const content = module.render ? module.render() : 'Module has no render method';
                this.render(content);
            } else {
                // 404
                this.navigate('/404');
            }
        }
        
        // Скроллим вверх
        window.scrollTo(0, 0);
    }
    
    /**
     * Обновление активной навигации
     */
    updateNavigation(path) {
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkPath = link.dataset.route || link.getAttribute('href')?.slice(1);
            link.classList.toggle('active', linkPath === path);
        });
    }
    
    /**
     * Рендер контента
     */
    render(content) {
        const container = document.getElementById('content');
        if (!container) return;
        
        // Если это строка - вставляем HTML
        if (typeof content === 'string') {
            container.innerHTML = content;
        } 
        // Если это Promise - ждём
        else if (content instanceof Promise) {
            container.innerHTML = '<div class="loading">Загрузка...</div>';
            content.then(html => {
                container.innerHTML = html;
            });
        }
        // Если это функция - вызываем
        else if (typeof content === 'function') {
            container.innerHTML = content();
        }
        
        // Инициализируем интерактивные элементы
        this.initInteractiveElements(container);
    }
    
    /**
     * Инициализация интерактивных элементов
     */
    initInteractiveElements(container) {
        // Обрабатываем ссылки с data-route
        container.querySelectorAll('[data-route]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(el.dataset.route);
            });
        });
        
        // Обрабатываем кнопки с data-action
        container.querySelectorAll('[data-action]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const [moduleName, methodName] = el.dataset.action.split('.');
                const module = this.app.getModule(moduleName);
                if (module && module[methodName]) {
                    module[methodName](el.dataset);
                }
            });
        });
    }
    
    /**
     * Рендер главной страницы
     */
    renderHome() {
        const modules = [];
        
        // Собираем информацию о модулях
        this.app.modules.forEach((module, name) => {
            if (!name.startsWith('_')) {
                const meta = module.meta || this.app.moduleMeta[name] || {};
                modules.push({
                    name,
                    ...meta,
                    module
                });
            }
        });
        
        return `
            <div class="home-container">
                ${this.renderHero()}
                ${this.renderDocuments()}
                ${this.renderModules(modules)}
            </div>
        `;
    }
    
    /**
     * Hero секция
     */
    renderHero() {
        return `
            <section class="hero">
                <h1>Система проверки технической документации</h1>
                <p>Стандарты Массивбург • Чек-листы • База знаний</p>
                <div class="hero-actions">
                    <button data-route="/checklist" class="btn btn-primary">
                        🚀 Начать проверку
                    </button>
                    <button data-route="/wiki/guide" class="btn btn-secondary">
                        📖 Руководство
                    </button>
                </div>
            </section>
        `;
    }
    
    /**
     * Блок документации
     */
    renderDocuments() {
        const docs = [
            { id: 1, title: 'Эскизы для согласования', desc: 'Первичные чертежи для утверждения' },
            { id: 2, title: 'Чертежи для изготовления', desc: 'Рабочая документация для цеха' },
            { id: 3, title: 'Спецификация деталей', desc: 'Полный перечень элементов' },
            { id: 4, title: 'Чертежи для субподряда', desc: 'Документация для подрядчиков' },
            { id: 5, title: 'Заявка в снабжение', desc: 'Excel с материалами и фурнитурой' },
            { id: 6, title: 'Файлы Базис Мебельщик', desc: 'Для заказа ЛДСП и ЧПУ' },
            { id: 7, title: 'Файлы DXF', desc: 'Для подрядчиков (по запросу)' }
        ];
        
        return `
            <section class="docs-section">
                <h2>📋 Состав выпускаемой КБ документации</h2>
                <div class="docs-list">
                    ${docs.map(doc => `
                        <div class="doc-item" data-route="/checklist?doc=${doc.id}">
                            <span class="doc-number">${doc.id}</span>
                            <div class="doc-content">
                                <div class="doc-title">${doc.title}</div>
                                <div class="doc-desc">${doc.desc}</div>
                            </div>
                            <span class="doc-arrow">→</span>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }
    
    /**
     * Блок модулей
     */
    renderModules(modules) {
        return `
            <section class="modules-section">
                <h2>Модули системы</h2>
                <div class="modules-grid">
                    ${modules.map(m => this.renderModuleCard(m)).join('')}
                </div>
            </section>
        `;
    }
    
    /**
     * Карточка модуля
     */
    renderModuleCard(moduleInfo) {
        const statusClass = {
            'ready': 'status-ready',
            'beta': 'status-beta',
            'soon': 'status-soon'
        }[moduleInfo.status] || 'status-soon';
        
        const statusText = {
            'ready': 'Готово',
            'beta': 'Beta',
            'soon': 'Скоро'
        }[moduleInfo.status] || 'В разработке';
        
        return `
            <div class="module-card" data-route="/${moduleInfo.name}">
                <div class="module-icon">${moduleInfo.icon || '📦'}</div>
                <h3>${moduleInfo.title}</h3>
                <p>${moduleInfo.description}</p>
                <span class="module-status ${statusClass}">${statusText}</span>
            </div>
        `;
    }
    
    /**
     * 404 страница
     */
    render404() {
        return `
            <div class="error-page">
                <h1>404</h1>
                <p>Страница не найдена</p>
                <button data-route="/" class="btn btn-primary">
                    На главную
                </button>
            </div>
        `;
    }
    
    /**
     * Получение параметров из URL
     */
    getParams() {
        const hash = window.location.hash.slice(1);
        const [path, query] = hash.split('?');
        const params = new URLSearchParams(query || '');
        
        return {
            path,
            params: Object.fromEntries(params)
        };
    }
}