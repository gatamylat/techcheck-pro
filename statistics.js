/**
 * @module Statistics
 * @description Аналитика проверок и типовых ошибок
 * @version 1.0.0
 * @dependencies ['_state', '_router']
 */

import BaseModule from './BaseModule.js';

export default class Statistics extends BaseModule {
    constructor(app) {
        super(app);
        this.name = 'statistics';
        this.version = '1.0.0';
        this.dependencies = ['_state', '_router'];
        
        this.meta = {
            title: 'Статистика',
            icon: '📊',
            description: 'Аналитика проверок и типовых ошибок',
            navLabel: 'Статистика',
            status: 'soon'
        };
    }
    
    async loadData() {
        // Демо данные для статистики
        this.data = {
            summary: {
                totalChecks: 127,
                completedChecks: 89,
                inProgressChecks: 38,
                averageScore: 87,
                totalErrors: 342,
                criticalErrors: 45
            },
            
            topErrors: [
                { name: 'Не указана маркировка ЛДСП', count: 45, critical: true },
                { name: 'Отсутствует направление текстуры', count: 38, critical: true },
                { name: 'Не обозначены ручки', count: 32, critical: false },
                { name: 'Нет информации по электрике', count: 28, critical: true },
                { name: 'Зазоры между фасадами не указаны', count: 24, critical: false }
            ],
            
            weeklyStats: [
                { day: 'Пн', checks: 12, errors: 34 },
                { day: 'Вт', checks: 18, errors: 42 },
                { day: 'Ср', checks: 15, errors: 28 },
                { day: 'Чт', checks: 22, errors: 51 },
                { day: 'Пт', checks: 19, errors: 38 },
                { day: 'Сб', checks: 8, errors: 15 },
                { day: 'Вс', checks: 5, errors: 10 }
            ],
            
            documentTypes: [
                { type: 'Эскизы', percentage: 35 },
                { type: 'Чертежи', percentage: 28 },
                { type: 'Спецификации', percentage: 20 },
                { type: 'Базис файлы', percentage: 17 }
            ]
        };
        
        this.setCache(this.data);
    }
    
    renderContent() {
        return `
            <div class="statistics-container">
                <div class="statistics-header">
                    <h1>${this.meta.icon} ${this.meta.title}</h1>
                    <p>${this.meta.description}</p>
                </div>
                
                <div class="stats-period-selector" style="display: flex; gap: 1rem; margin: 2rem 0;">
                    <button class="btn btn-secondary">Сегодня</button>
                    <button class="btn btn-primary">Неделя</button>
                    <button class="btn btn-secondary">Месяц</button>
                    <button class="btn btn-secondary">Квартал</button>
                    <button class="btn btn-secondary">Год</button>
                </div>
                
                <!-- Общая статистика -->
                <div class="stats-summary" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                     gap: 1.5rem; margin-bottom: 3rem;">
                    ${this.renderStatCard('Всего проверок', this.data.summary.totalChecks, '📝', 'var(--primary-color)')}
                    ${this.renderStatCard('Завершено', this.data.summary.completedChecks, '✅', 'var(--success-color)')}
                    ${this.renderStatCard('В процессе', this.data.summary.inProgressChecks, '⏳', 'var(--warning-color)')}
                    ${this.renderStatCard('Средний балл', this.data.summary.averageScore + '%', '⭐', 'var(--info-color)')}
                    ${this.renderStatCard('Всего ошибок', this.data.summary.totalErrors, '⚠️', 'var(--error-color)')}
                    ${this.renderStatCard('Критичных', this.data.summary.criticalErrors, '🚨', 'var(--error-color)')}
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <!-- График проверок по дням -->
                    <div class="card">
                        <h3>Проверки по дням недели</h3>
                        <div class="chart-container" style="padding: 1rem;">
                            <div class="bar-chart" style="display: flex; gap: 1rem; align-items: flex-end; 
                                 height: 200px; justify-content: space-between;">
                                ${this.data.weeklyStats.map(stat => `
                                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                                        <div style="width: 100%; background: var(--primary-light); 
                                             height: ${stat.checks * 8}px; border-radius: var(--radius) var(--radius) 0 0;
                                             margin-bottom: 0.5rem; position: relative;">
                                            <span style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%);
                                                  font-size: 0.875rem; font-weight: 600;">
                                                ${stat.checks}
                                            </span>
                                        </div>
                                        <span style="font-size: 0.875rem; color: var(--text-secondary);">
                                            ${stat.day}
                                        </span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Топ ошибок -->
                    <div class="card">
                        <h3>Частые ошибки</h3>
                        <div class="errors-list" style="padding: 1rem;">
                            ${this.data.topErrors.map((error, index) => `
                                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                                    <span style="width: 24px; height: 24px; background: ${error.critical ? 'var(--error-light)' : 'var(--warning-light)'};
                                          color: ${error.critical ? 'var(--error-color)' : 'var(--warning-color)'};
                                          border-radius: 50%; display: flex; align-items: center; justify-content: center;
                                          font-size: 0.75rem; font-weight: bold;">
                                        ${index + 1}
                                    </span>
                                    <div style="flex: 1;">
                                        <div style="font-size: 0.875rem;">${error.name}</div>
                                        <div style="width: 100%; height: 4px; background: var(--bg-secondary); 
                                             border-radius: var(--radius-full); margin-top: 0.25rem; overflow: hidden;">
                                            <div style="width: ${(error.count / this.data.topErrors[0].count) * 100}%; 
                                                 height: 100%; background: ${error.critical ? 'var(--error-color)' : 'var(--warning-color)'};">
                                            </div>
                                        </div>
                                    </div>
                                    <span style="font-weight: 600; color: var(--text-secondary);">
                                        ${error.count}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Типы документов -->
                <div class="card" style="margin-top: 2rem;">
                    <h3>Распределение по типам документов</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                         gap: 1rem; padding: 1rem;">
                        ${this.data.documentTypes.map(type => `
                            <div style="text-align: center;">
                                <div style="font-size: 2rem; font-weight: bold; color: var(--primary-color);">
                                    ${type.percentage}%
                                </div>
                                <div style="color: var(--text-secondary); margin-top: 0.5rem;">
                                    ${type.type}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="stats-placeholder" style="text-align: center; padding: 3rem; 
                     background: var(--bg-secondary); border-radius: var(--radius); margin-top: 2rem;">
                    <p style="color: var(--text-secondary);">
                        Модуль статистики находится в разработке. Здесь будут графики, диаграммы и детальная аналитика.
                    </p>
                </div>
            </div>
        `;
    }
    
    renderStatCard(title, value, icon, color) {
        return `
            <div class="stat-card" style="background: var(--bg-primary); border-radius: var(--radius); 
                 padding: 1.5rem; box-shadow: var(--shadow-md); text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">${icon}</div>
                <div style="font-size: 2rem; font-weight: bold; color: ${color};">
                    ${value}
                </div>
                <div style="color: var(--text-secondary); margin-top: 0.5rem;">
                    ${title}
                </div>
            </div>
        `;
    }
    
    getPublicMethods() {
        return {
            exportReport: () => this.exportReport(),
            refreshStats: () => this.refreshStats()
        };
    }
    
    exportReport() {
        this.log('Exporting statistics report...');
        alert('Экспорт отчетов будет добавлен в следующей версии');
    }
    
    refreshStats() {
        this.log('Refreshing statistics...');
        this.loadData();
        this.render();
    }
    
    render() {
        const container = document.getElementById('content');
        if (container) {
            container.innerHTML = this.renderContent();
        }
    }
}