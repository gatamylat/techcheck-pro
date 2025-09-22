/**
 * @module Config
 * @description Конфигурация системы TechCheck Pro
 * @version 1.0.0
 */

export default class Config {
    constructor(app) {
        this.app = app;
        this.name = '_config';
        this.version = '1.0.0';
        
        // Основная конфигурация
        this.config = {
            app: {
                name: 'TechCheck Pro',
                version: '1.0.0',
                description: 'Система проверки технической документации',
                company: 'Массивбург',
                debug: new URLSearchParams(window.location.search).has('debug')
            },
            
            // Реестр модулей
            modules: {
                system: ['_config', '_router', '_state'],
                functional: ['knowledge-base', 'checklist', 'wiki', 'stories'],
                future: ['statistics', 'llm-check']
            },
            
            // Метаданные модулей
            moduleMeta: {
                'knowledge-base': {
                    title: 'База знаний',
                    icon: '📚',
                    description: 'Нормы проектирования Массивбург',
                    navLabel: 'База знаний',
                    status: 'ready'
                },
                'checklist': {
                    title: 'Чек-листы',
                    icon: '✓',
                    description: 'Интерактивные списки проверки',
                    navLabel: 'Чек-листы',
                    status: 'ready'
                },
                'wiki': {
                    title: 'Wiki',
                    icon: '📖',
                    description: 'База знаний команды',
                    navLabel: 'Wiki',
                    status: 'beta'
                },
                'stories': {
                    title: 'Stories',
                    icon: '💬',
                    description: 'Кейсы и примеры',
                    navLabel: 'Stories',
                    status: 'beta'
                },
                'statistics': {
                    title: 'Статистика',
                    icon: '📊',
                    description: 'Аналитика проверок',
                    navLabel: 'Статистика',
                    status: 'soon'
                },
                'llm-check': {
                    title: 'AI Проверка',
                    icon: '🤖',
                    description: 'Автоматическая проверка с LLM',
                    navLabel: 'AI',
                    status: 'soon'
                }
            },
            
            // Настройки интерфейса
            ui: {
                theme: 'light',
                language: 'ru',
                dateFormat: 'DD.MM.YYYY',
                animations: true,
                compactMode: false
            },
            
            // Настройки хранилища
            storage: {
                prefix: 'techcheck_',
                version: 1,
                compress: false
            },
            
            // API endpoints (для будущего)
            api: {
                baseUrl: '',
                timeout: 30000,
                retries: 3
            }
        };
    }
    
    /**
     * Инициализация
     */
    init() {
        // Загружаем сохраненные настройки
        this.loadSettings();
        
        // Применяем тему
        this.applyTheme();
        
        // Устанавливаем язык
        this.setLanguage();
        
        this.app.log('Config initialized', 'system');
    }
    
    /**
     * Получить значение конфигурации
     */
    get(key, defaultValue = null) {
        const keys = key.split('.');
        let value = this.config;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue;
            }
        }
        
        return value;
    }
    
    /**
     * Установить значение конфигурации
     */
    set(key, value) {
        const keys = key.split('.');
        let target = this.config;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!(k in target) || typeof target[k] !== 'object') {
                target[k] = {};
            }
            target = target[k];
        }
        
        target[keys[keys.length - 1]] = value;
        this.saveSettings();
        
        this.app.log(`Config updated: ${key} = ${value}`, 'system');
    }
    
    /**
     * Получить все настройки
     */
    getAll() {
        return this.config;
    }
    
    /**
     * Загрузить настройки из localStorage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('techcheck_config');
            if (saved) {
                const savedConfig = JSON.parse(saved);
                // Мержим с дефолтными настройками
                this.config = this.deepMerge(this.config, savedConfig);
            }
        } catch (error) {
            this.app.log('Failed to load settings', 'error');
        }
    }
    
    /**
     * Сохранить настройки
     */
    saveSettings() {
        try {
            localStorage.setItem('techcheck_config', JSON.stringify(this.config));
        } catch (error) {
            this.app.log('Failed to save settings', 'error');
        }
    }
    
    /**
     * Применить тему
     */
    applyTheme() {
        const theme = this.get('ui.theme', 'light');
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    /**
     * Установить язык
     */
    setLanguage() {
        const lang = this.get('ui.language', 'ru');
        document.documentElement.setAttribute('lang', lang);
    }
    
    /**
     * Переключить тему
     */
    toggleTheme() {
        const currentTheme = this.get('ui.theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.set('ui.theme', newTheme);
        this.applyTheme();
    }
    
    /**
     * Глубокое слияние объектов
     */
    deepMerge(target, source) {
        const output = Object.assign({}, target);
        
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.deepMerge(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        
        return output;
    }
    
    /**
     * Проверка на объект
     */
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }
    
    /**
     * Экспорт конфигурации
     */
    export() {
        return JSON.stringify(this.config, null, 2);
    }
    
    /**
     * Импорт конфигурации
     */
    import(configJson) {
        try {
            const newConfig = JSON.parse(configJson);
            this.config = this.deepMerge(this.config, newConfig);
            this.saveSettings();
            this.applyTheme();
            this.setLanguage();
            return true;
        } catch (error) {
            this.app.log('Failed to import config', 'error');
            return false;
        }
    }
    
    /**
     * Сброс настроек
     */
    reset() {
        localStorage.removeItem('techcheck_config');
        location.reload();
    }
}