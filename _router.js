/**
 * @module Router
 * @description Клиентский роутер для навигации между модулями
 * @version 1.0.1 - FIXED
 */

export default class Router {
    constructor(app) {
        this.app = app;
        this.routes = new Map();
        this.currentRoute = null;
        this.history = [];
        
        // Базовые маршруты
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
        
        // Специальная обработка для главной страницы со Stories
        if (hash === '/' || hash === '') {
            this.showHomePage();
            return;
        }
        
        // Для всех остальных страниц показываем стандартный интерфейс
        this.showStandardPage();
        
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
     * Показать главную страницу со Stories
     * ИСПРАВЛЕНО: убрана повторная инициализация
     */
    showHomePage() {
        // Получаем элементы
        const homeContainer = document.getElementById('home-container');
        const desktopHomeContainer = document.getElementById('desktop-home-container');
        const mainHeader = document.getElementById('main-header');
        const mainContent = document.getElementById('content');
        const mainFooter = document.getElementById('main-footer');
        
        // Определяем тип устройства
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Показываем мобильную версию со Stories
            if (homeContainer) homeContainer.classList.remove('hidden');
            if (desktopHomeContainer) desktopHomeContainer.classList.add('hidden');
        } else {
            // Показываем десктопную версию
            if (homeContainer) homeContainer.classList.add('hidden');
            if (desktopHomeContainer) desktopHomeContainer.classList.remove('hidden');
        }
        
        // Скрываем стандартный интерфейс для обеих версий
        if (mainHeader) mainHeader.classList.add('hidden');
        if (mainContent) mainContent.classList.add('hidden');
        if (mainFooter) mainFooter.classList.add('hidden');
        
        // Всегда вызываем initHomePage для stories
        const stories = this.app.getModule('stories');
        if (stories) {
            stories.initHomePage();
            this.app.log('Stories home page initialized', 'info');
        }
    }
    
    /**
     * Показать стандартную страницу
     */
    showStandardPage() {
        const homeContainer = document.getElementById('home-container');
        const desktopHomeContainer = document.getElementById('desktop-home-container');
        const mainHeader = document.getElementById('main-header');
        const mainContent = document.getElementById('content');
        const mainFooter = document.getElementById('main-footer');
        
        // Скрываем интерфейс главной (и мобильный, и десктопный)
        if (homeContainer) homeContainer.classList.add('hidden');
        if (desktopHomeContainer) desktopHomeContainer.classList.add('hidden');
        
        // Показываем стандартный интерфейс
        if (mainHeader) mainHeader.classList.remove('hidden');
        if (mainContent) mainContent.classList.remove('hidden');
        if (mainFooter) mainFooter.classList.remove('hidden');
        
        // Останавливаем автопрокрутку Stories если она есть
        const stories = this.app.getModule('stories');
        if (stories && stories.stopAutoPlay) {
            stories.stopAutoPlay();
        }
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
