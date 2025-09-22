/**
 * @module App
 * @description Ядро модульной системы TechCheck Pro
 * @version 1.0.0
 * @author TechCheck Team
 */

export default class App {
    constructor() {
        this.modules = new Map();
        this.config = null;
        this.router = null;
        this.state = null;
        this.debug = new URLSearchParams(window.location.search).has('debug');
        this.container = document.getElementById('content');
        
        // Реестр модулей - ЗДЕСЬ ДОБАВЛЯЕМ НОВЫЕ МОДУЛИ
        this.moduleRegistry = {
            // Системные модули (загружаются первыми)
            system: [
                '_config',
                '_router', 
                '_state'
            ],
            // Функциональные модули
            functional: [
                'knowledge-base',
                'checklist',
                'wiki',
                'stories',
                // Добавляем новые модули просто новой строкой!
                // 'my-new-module',
            ],
            // Будущие модули (показываются как "скоро")
            future: [
                'statistics',
                'llm-check'
            ]
        };
        
        // Метаданные модулей
        this.moduleMeta = {
            'knowledge-base': {
                title: 'База знаний',
                icon: '📚',
                description: 'Нормы проектирования Массивбург, стандарты оформления',
                navLabel: 'База знаний',
                status: 'ready'
            },
            'checklist': {
                title: 'Чек-листы',
                icon: '✓',
                description: 'Интерактивные списки проверки документации',
                navLabel: 'Чек-листы',
                status: 'ready'
            },
            'wiki': {
                title: 'Wiki',
                icon: '📖',
                description: 'База знаний команды, инструкции, best practices',
                navLabel: 'Wiki',
                status: 'beta'
            },
            'stories': {
                title: 'Stories',
                icon: '💬',
                description: 'Кейсы, примеры решений, обсуждения',
                navLabel: 'Stories',
                status: 'beta'
            },
            'statistics': {
                title: 'Статистика',
                icon: '📊',
                description: 'Аналитика проверок и типовых ошибок',
                navLabel: 'Статистика',
                status: 'soon'
            },
            'llm-check': {
                title: 'AI Проверка',
                icon: '🤖',
                description: 'Автоматическая проверка чертежей с помощью LLM',
                navLabel: 'AI',
                status: 'soon'
            }
            // Метаданные для новых модулей добавляем здесь
        };
    }
    
    /**
     * Инициализация приложения
     */
    async init() {
        try {
            this.log('🚀 Starting TechCheck Pro...', 'system');
            
            // 1. Загружаем системные модули
            await this.loadSystemModules();
            
            // 2. Загружаем функциональные модули
            await this.loadFunctionalModules();
            
            // 3. Инициализируем все загруженные модули
            await this.initializeModules();
            
            // 4. Строим навигацию
            this.buildNavigation();
            
            // 5. Запускаем роутер
            this.router.start();
            
            // 6. Скрываем загрузчик
            this.hideLoader();
            
            this.log(`✅ App started with ${this.modules.size} modules`, 'success');
            
        } catch (error) {
            this.log(`❌ Fatal error: ${error.message}`, 'error');
            this.showError(error.message);
        }
    }
    
    /**
     * Загрузка системных модулей
     */
    async loadSystemModules() {
        this.log('Loading system modules...', 'system');
        
        for (const moduleName of this.moduleRegistry.system) {
            try {
                const module = await import(`./${moduleName}.js`);
                const instance = new module.default(this);
                this.modules.set(moduleName, instance);
                
                // Сохраняем ссылки на системные модули
                if (moduleName === '_config') this.config = instance;
                if (moduleName === '_router') this.router = instance;
                if (moduleName === '_state') this.state = instance;
                
                this.log(`✓ System module loaded: ${moduleName}`, 'system');
            } catch (error) {
                this.log(`✗ Failed to load ${moduleName}: ${error.message}`, 'error');
                // Создаём заглушку для отсутствующего модуля
                this.createModuleStub(moduleName, 'system');
            }
        }
    }
    
    /**
     * Загрузка функциональных модулей
     */
    async loadFunctionalModules() {
        this.log('Loading functional modules...', 'system');
        
        const allModules = [
            ...this.moduleRegistry.functional,
            ...this.moduleRegistry.future
        ];
        
        for (const moduleName of allModules) {
            try {
                const module = await import(`./${moduleName}.js`);
                const instance = new module.default(this);
                this.modules.set(moduleName, instance);
                this.log(`✓ Module loaded: ${moduleName}`, 'module');
            } catch (error) {
                this.log(`✗ Module not found: ${moduleName} (stub created)`, 'warning');
                this.createModuleStub(moduleName, 'functional');
            }
        }
    }
    
    /**
     * Создание заглушки для отсутствующего модуля
     */
    createModuleStub(moduleName, type) {
        const meta = this.moduleMeta[moduleName] || {
            title: moduleName,
            icon: '📦',
            description: 'Module in development',
            navLabel: moduleName,
            status: 'soon'
        };
        
        const stub = {
            name: moduleName,
            type: type,
            meta: meta,
            isStub: true,
            
            init() {
                console.log(`Stub init: ${moduleName}`);
            },
            
            render() {
                return `
                    <div style="padding: 3rem; text-align: center;">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">${meta.icon}</div>
                        <h1>${meta.title}</h1>
                        <p style="color: var(--text-secondary); margin: 1rem 0;">
                            ${meta.description}
                        </p>
                        <div style="display: inline-block; padding: 0.5rem 1rem; 
                                    background: var(--bg-secondary); border-radius: 20px; 
                                    margin-top: 1rem;">
                            Модуль "${moduleName}" ${meta.status === 'soon' ? 'в разработке' : 'загружается'}...
                        </div>
                    </div>
                `;
            }
        };
        
        this.modules.set(moduleName, stub);
    }
    
    /**
     * Инициализация всех модулей
     */
    async initializeModules() {
        this.log('Initializing modules...', 'system');
        
        for (const [name, module] of this.modules) {
            try {
                if (module.init && typeof module.init === 'function') {
                    await module.init();
                    this.log(`✓ Initialized: ${name}`, 'module');
                }
            } catch (error) {
                this.log(`✗ Init failed for ${name}: ${error.message}`, 'error');
            }
        }
    }
    
    /**
     * Построение навигации
     */
    buildNavigation() {
        const nav = document.getElementById('main-nav');
        if (!nav) return;
        
        nav.innerHTML = '';
        
        // Главная всегда первая
        this.addNavLink(nav, '/', 'Главная');
        
        // Добавляем функциональные модули
        for (const moduleName of this.moduleRegistry.functional) {
            const meta = this.moduleMeta[moduleName];
            if (meta && meta.status !== 'hidden') {
                this.addNavLink(nav, `/${moduleName}`, meta.navLabel);
            }
        }
    }
    
    /**
     * Добавление ссылки в навигацию
     */
    addNavLink(nav, path, label) {
        const link = document.createElement('a');
        link.className = 'nav-link';
        link.textContent = label;
        link.dataset.route = path;
        link.href = '#' + path;
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            this.router.navigate(path);
        });
        
        nav.appendChild(link);
    }
    
    /**
     * Получение модуля
     */
    getModule(name) {
        return this.modules.get(name);
    }
    
    /**
     * Регистрация нового модуля "на лету"
     */
    async registerModule(name, meta = {}) {
        // Добавляем в реестр
        if (!this.moduleRegistry.functional.includes(name)) {
            this.moduleRegistry.functional.push(name);
        }
        
        // Добавляем метаданные
        this.moduleMeta[name] = {
            title: meta.title || name,
            icon: meta.icon || '📦',
            description: meta.description || '',
            navLabel: meta.navLabel || name,
            status: meta.status || 'beta'
        };
        
        // Пытаемся загрузить
        try {
            const module = await import(`./${name}.js`);
            const instance = new module.default(this);
            this.modules.set(name, instance);
            
            if (instance.init) {
                await instance.init();
            }
            
            // Обновляем навигацию
            this.buildNavigation();
            
            this.log(`✅ Module registered: ${name}`, 'success');
            return true;
        } catch (error) {
            this.log(`❌ Failed to register ${name}: ${error.message}`, 'error');
            this.createModuleStub(name, 'functional');
            return false;
        }
    }
    
    /**
     * Скрытие загрузчика
     */
    hideLoader() {
        const loader = document.getElementById('loader');
        const app = document.getElementById('app');
        
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                if (app) app.classList.add('loaded');
            }, 300);
        }
    }
    
    /**
     * Показ ошибки
     */
    showError(message) {
        if (this.container) {
            this.container.innerHTML = `
                <div style="padding: 3rem; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h2>Ошибка загрузки</h2>
                    <p style="color: var(--text-secondary); margin-top: 1rem;">
                        ${message}
                    </p>
                    <button onclick="location.reload()" 
                            style="margin-top: 2rem; padding: 0.5rem 1.5rem; 
                                   background: var(--primary-color); color: white; 
                                   border: none; border-radius: var(--radius); cursor: pointer;">
                        Перезагрузить
                    </button>
                </div>
            `;
        }
    }
    
    /**
     * Универсальный логгер
     */
    log(message, type = 'info') {
        // Определяем эмодзи и цвет
        const styles = {
            'system': { emoji: '⚙️', color: '#6366f1' },
            'module': { emoji: '📦', color: '#3b82f6' },
            'success': { emoji: '✅', color: '#10b981' },
            'warning': { emoji: '⚠️', color: '#f59e0b' },
            'error': { emoji: '❌', color: '#ef4444' },
            'info': { emoji: '📝', color: '#64748b' }
        };
        
        const style = styles[type] || styles.info;
        
        // Консоль
        console.log(
            `%c${style.emoji} ${message}`,
            `color: ${style.color}; font-weight: ${type === 'error' ? 'bold' : 'normal'}`
        );
        
        // Debug панель
        if (this.debug) {
            this.logToDebugPanel(message, type);
        }
    }
    
    /**
     * Логирование в debug панель
     */
    logToDebugPanel(message, type) {
        const panel = document.getElementById('debug-logs');
        if (!panel) return;
        
        const entry = document.createElement('div');
        entry.className = 'debug-log';
        entry.style.color = type === 'error' ? '#ef4444' : 
                           type === 'warning' ? '#f59e0b' : 
                           type === 'success' ? '#10b981' : '#94a3b8';
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        panel.insertBefore(entry, panel.firstChild);
        
        // Ограничиваем количество записей
        while (panel.children.length > 50) {
            panel.removeChild(panel.lastChild);
        }
    }
}