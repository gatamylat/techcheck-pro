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
        return `
            <div class="home-container">
                <!-- Hero блок -->
                <section class="hero">
                    <h1>Проверяйте документацию быстро и точно</h1>
                    <p>Стандарты Массивбург • Интерактивные чек-листы • База знаний</p>
                    <div class="hero-actions">
                        <button class="btn btn-primary" onclick="app.router.navigate('/checklist')">
                            🚀 Начать проверку
                        </button>
                        <button class="btn btn-secondary" onclick="app.router.navigate('/knowledge-base')">
                            📖 База знаний
                        </button>
                    </div>
                </section>

                <!-- Основная сетка -->
                <div class="main-grid">
                    <!-- Документация - большая карточка -->
                    <div class="docs-card" onclick="app.router.navigate('/documents')">
                        <h2>📋 Состав документации</h2>
                        <p>7 типов документов для проверки</p>
                    </div>

                    <!-- База знаний -->
                    <div class="module-card" onclick="app.router.navigate('/knowledge-base')">
                        <span class="module-status status-ready">Готово</span>
                        <div class="module-header">
                            <div class="module-icon">📚</div>
                            <div class="module-info">
                                <h3>База знаний</h3>
                                <p>Нормы проектирования, ГОСТ стандарты</p>
                            </div>
                        </div>
                    </div>

                    <!-- Чек-листы -->
                    <div class="module-card" onclick="app.router.navigate('/checklist')">
                        <span class="module-status status-ready">Готово</span>
                        <div class="module-header">
                            <div class="module-icon">✓</div>
                            <div class="module-info">
                                <h3>Чек-листы</h3>
                                <p>Интерактивная проверка документов</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Дополнительные модули -->
                <div class="special-modules">
                    <!-- Wiki -->
                    <div class="module-card" onclick="app.router.navigate('/wiki')">
                        <span class="module-status status-beta">Beta</span>
                        <div class="module-header">
                            <div class="module-icon">📖</div>
                            <div class="module-info">
                                <h3>Wiki</h3>
                                <p>База знаний команды</p>
                            </div>
                        </div>
                    </div>

                    <!-- Stories -->
                    <div class="module-card" onclick="app.router.navigate('/stories')">
                        <span class="module-status status-beta">Beta</span>
                        <div class="module-header">
                            <div class="module-icon">💬</div>
                            <div class="module-info">
                                <h3>Stories</h3>
                                <p>Кейсы и обсуждения</p>
                            </div>
                        </div>
                    </div>

                    <!-- Статистика -->
                    <div class="special-card" onclick="app.router.navigate('/statistics')">
                        <h3>📊 Статистика</h3>
                        <p>Скоро</p>
                    </div>

                    <!-- AI Проверка -->
                    <div class="special-card" onclick="app.router.navigate('/llm-check')">
                        <h3>🤖 AI Проверка</h3>
                        <p>Скоро</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Hero секция
     */
    renderHero() {
        // Удаляем этот метод, так как теперь все в renderHome()
        return '';
    }
    
    /**
     * Блок документации
     */
    renderDocuments() {
        // Удаляем этот метод, так как теперь все в renderHome()
        return '';
    }
    
    /**
     * Блок модулей
     */
    renderModules(modules) {
        // Удаляем этот метод, так как теперь все в renderHome()
        return '';
    }
    
    /**
     * Карточка модуля
     */
    renderModuleCard(moduleInfo) {
        // Удаляем этот метод, так как теперь все в renderHome()
        return '';
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
