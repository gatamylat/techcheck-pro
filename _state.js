/**
 * @module State
 * @description Управление глобальным состоянием приложения
 * @version 1.0.0
 */

export default class State {
    constructor(app) {
        this.app = app;
        this.name = '_state';
        this.version = '1.0.0';
        
        // Глобальное состояние
        this.state = {
            // Системное состояние
            system: {
                initialized: false,
                loading: false,
                online: navigator.onLine,
                lastUpdate: new Date().toISOString()
            },
            
            // Навигация
            navigation: {
                currentRoute: '/',
                previousRoute: null,
                history: [],
                params: {}
            },
            
            // Пользователь
            user: {
                name: null,
                role: null,
                preferences: {
                    theme: 'light',
                    language: 'ru',
                    compactMode: false
                }
            },
            
            // Модули
            modules: {
                loaded: [],
                active: null,
                states: {}
            },
            
            // Данные
            data: {
                cache: {},
                temp: {},
                persistent: {}
            },
            
            // UI состояние
            ui: {
                sidebarOpen: true,
                modalOpen: false,
                notifications: [],
                activeTab: null
            }
        };
        
        // Подписчики на изменения
        this.subscribers = new Map();
        
        // История изменений (для отладки)
        this.history = [];
        this.historyLimit = 50;
    }
    
    /**
     * Инициализация
     */
    init() {
        // Загружаем сохраненное состояние
        this.loadState();
        
        // Подписываемся на события
        this.setupEventListeners();
        
        // Запускаем автосохранение
        this.startAutoSave();
        
        this.app.log('State manager initialized', 'system');
    }
    
    /**
     * Получить значение из состояния
     */
    get(path, defaultValue = null) {
        if (!path) return this.state;
        
        const keys = path.split('.');
        let value = this.state;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return defaultValue;
            }
        }
        
        return value;
    }
    
    /**
     * Установить значение в состояние
     */
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        
        // Находим родительский объект
        let target = this.state;
        for (const key of keys) {
            if (!(key in target) || typeof target[key] !== 'object') {
                target[key] = {};
            }
            target = target[key];
        }
        
        // Сохраняем старое значение для истории
        const oldValue = target[lastKey];
        
        // Устанавливаем новое значение
        target[lastKey] = value;
        
        // Добавляем в историю
        this.addToHistory({
            path,
            oldValue,
            newValue: value,
            timestamp: Date.now()
        });
        
        // Уведомляем подписчиков
        this.notify(path, value, oldValue);
        
        // Сохраняем состояние
        this.saveState();
        
        this.app.log(`State updated: ${path}`, 'info');
        
        return value;
    }
    
    /**
     * Обновить значение (merge для объектов)
     */
    update(path, updates) {
        const current = this.get(path);
        
        if (typeof current === 'object' && typeof updates === 'object') {
            const merged = { ...current, ...updates };
            return this.set(path, merged);
        } else {
            return this.set(path, updates);
        }
    }
    
    /**
     * Удалить значение
     */
    delete(path) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        
        let target = this.state;
        for (const key of keys) {
            if (!(key in target)) return false;
            target = target[key];
        }
        
        if (lastKey in target) {
            const oldValue = target[lastKey];
            delete target[lastKey];
            
            this.addToHistory({
                path,
                oldValue,
                newValue: undefined,
                timestamp: Date.now(),
                action: 'delete'
            });
            
            this.notify(path, undefined, oldValue);
            this.saveState();
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Подписаться на изменения
     */
    subscribe(path, callback) {
        if (!this.subscribers.has(path)) {
            this.subscribers.set(path, new Set());
        }
        
        this.subscribers.get(path).add(callback);
        
        // Возвращаем функцию отписки
        return () => {
            const callbacks = this.subscribers.get(path);
            if (callbacks) {
                callbacks.delete(callback);
                if (callbacks.size === 0) {
                    this.subscribers.delete(path);
                }
            }
        };
    }
    
    /**
     * Уведомить подписчиков
     */
    notify(path, newValue, oldValue) {
        // Уведомляем точных подписчиков
        const exactCallbacks = this.subscribers.get(path);
        if (exactCallbacks) {
            exactCallbacks.forEach(callback => {
                try {
                    callback(newValue, oldValue, path);
                } catch (error) {
                    this.app.log(`Subscriber error: ${error.message}`, 'error');
                }
            });
        }
        
        // Уведомляем подписчиков родительских путей
        const parts = path.split('.');
        for (let i = parts.length - 1; i > 0; i--) {
            const parentPath = parts.slice(0, i).join('.');
            const parentCallbacks = this.subscribers.get(parentPath);
            
            if (parentCallbacks) {
                const parentValue = this.get(parentPath);
                parentCallbacks.forEach(callback => {
                    try {
                        callback(parentValue, null, parentPath);
                    } catch (error) {
                        this.app.log(`Parent subscriber error: ${error.message}`, 'error');
                    }
                });
            }
        }
        
        // Глобальные подписчики
        const globalCallbacks = this.subscribers.get('*');
        if (globalCallbacks) {
            globalCallbacks.forEach(callback => {
                try {
                    callback(newValue, oldValue, path);
                } catch (error) {
                    this.app.log(`Global subscriber error: ${error.message}`, 'error');
                }
            });
        }
    }
    
    /**
     * Добавить в историю
     */
    addToHistory(change) {
        this.history.unshift(change);
        
        // Ограничиваем размер истории
        if (this.history.length > this.historyLimit) {
            this.history.pop();
        }
    }
    
    /**
     * Получить историю изменений
     */
    getHistory(limit = 10) {
        return this.history.slice(0, limit);
    }
    
    /**
     * Очистить историю
     */
    clearHistory() {
        this.history = [];
    }
    
    /**
     * Загрузить состояние из localStorage
     */
    loadState() {
        try {
            const saved = localStorage.getItem('techcheck_state');
            if (saved) {
                const savedState = JSON.parse(saved);
                // Мержим с дефолтным состоянием
                this.state = this.deepMerge(this.state, savedState);
                this.app.log('State loaded from storage', 'system');
            }
        } catch (error) {
            this.app.log(`Failed to load state: ${error.message}`, 'error');
        }
    }
    
    /**
     * Сохранить состояние в localStorage
     */
    saveState() {
        try {
            // Сохраняем только persistent данные
            const toSave = {
                user: this.state.user,
                data: {
                    persistent: this.state.data.persistent
                },
                ui: {
                    sidebarOpen: this.state.ui.sidebarOpen
                }
            };
            
            localStorage.setItem('techcheck_state', JSON.stringify(toSave));
        } catch (error) {
            this.app.log(`Failed to save state: ${error.message}`, 'error');
        }
    }
    
    /**
     * Автосохранение
     */
    startAutoSave() {
        // Сохраняем каждые 30 секунд
        this.autoSaveInterval = setInterval(() => {
            this.saveState();
        }, 30000);
    }
    
    /**
     * Остановить автосохранение
     */
    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
    }
    
    /**
     * Настройка слушателей событий
     */
    setupEventListeners() {
        // Отслеживаем онлайн/офлайн статус
        window.addEventListener('online', () => {
            this.set('system.online', true);
            this.app.log('Application is online', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.set('system.online', false);
            this.app.log('Application is offline', 'warning');
        });
        
        // Сохраняем состояние перед закрытием
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
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
     * Сброс состояния
     */
    reset() {
        const confirm = window.confirm('Вы уверены что хотите сбросить все данные?');
        if (confirm) {
            localStorage.removeItem('techcheck_state');
            location.reload();
        }
    }
    
    /**
     * Экспорт состояния
     */
    export() {
        return JSON.stringify(this.state, null, 2);
    }
    
    /**
     * Импорт состояния
     */
    import(stateJson) {
        try {
            const newState = JSON.parse(stateJson);
            this.state = newState;
            this.saveState();
            this.notify('*', this.state, null);
            return true;
        } catch (error) {
            this.app.log(`Failed to import state: ${error.message}`, 'error');
            return false;
        }
    }
    
    /**
     * Отладочная информация
     */
    debug() {
        console.group('🔍 State Debug Info');
        console.log('Current State:', this.state);
        console.log('Subscribers:', this.subscribers);
        console.log('Recent History:', this.getHistory(5));
        console.log('Storage Size:', new Blob([JSON.stringify(this.state)]).size, 'bytes');
        console.groupEnd();
    }
}