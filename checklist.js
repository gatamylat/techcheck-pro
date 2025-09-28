/**
 * @module Checklist
 * @description Интерактивные чек-листы для проверки документации
 * @version 1.0.0
 * @dependencies ['_state', '_router']
 */

import BaseModule from './BaseModule.js';

export default class Checklist extends BaseModule {
    constructor(app) {
        super(app);
        this.name = 'checklist';
        this.version = '1.0.0';
        this.dependencies = ['_state', '_router'];
        
        this.meta = {
            title: 'Чек-листы',
            icon: '✓',
            description: 'Интерактивные списки проверки для каждого типа документации',
            navLabel: 'Чек-листы',
            status: 'ready'
        };
        
        this.currentChecklist = null;
        this.activeCheck = null;
        this.checkResults = {};
    }
    
    async loadData() {
        // Чек-листы на основе документа
        this.data = {
            checklists: [
                {
                    id: 'sketch-approval',
                    title: 'Эскизы для согласования',
                    icon: '✏️',
                    description: 'Проверка эскизов перед отправкой заказчику',
                    category: 'approval',
                    sections: [
                        {
                            title: 'Общие требования',
                            id: 'general',
                            checks: [
                                { id: 'pdf-format', text: 'Чертежи сохранены в формате PDF', critical: true },
                                { id: 'date', text: 'Указана актуальная дата выпуска', critical: true },
                                { id: 'author', text: 'Указана фамилия исполнителя', critical: false },
                                { id: 'planfix-number', text: 'Указан номер из ПланФикс', critical: true },
                                { id: 'page-numbers', text: 'Проставлены номера листов', critical: false }
                            ]
                        },
                        {
                            title: 'Первый лист',
                            id: 'first-page',
                            checks: [
                                { id: 'iso-views', text: 'Размещены изометрические виды в цвете', critical: true },
                                { id: 'materials', text: 'Описаны используемые материалы с толщинами', critical: true },
                                { id: 'furniture', text: 'Указана лицевая фурнитура и её цвет', critical: false },
                                { id: 'lighting', text: 'Описана подсветка (если есть)', critical: false },
                                { id: 'tech', text: 'Перечислена техника с моделями', critical: false }
                            ]
                        },
                        {
                            title: 'Основные виды',
                            id: 'main-views',
                            checks: [
                                { id: 'front-view', text: 'Есть вид спереди с размерами', critical: true },
                                { id: 'top-view', text: 'Есть вид сверху с привязками', critical: true },
                                { id: 'sections', text: 'Показаны необходимые сечения', critical: true },
                                { id: 'nodes', text: 'Важные узлы показаны крупно', critical: false },
                                { id: 'gaps', text: 'Обозначены зазоры между изделием и стенами', critical: true }
                            ]
                        }
                    ]
                },
                {
                    id: 'production-drawings',
                    title: 'Чертежи для производства',
                    icon: '📐',
                    description: 'Проверка рабочей документации для цеха',
                    category: 'production',
                    sections: [
                        {
                            title: 'Состав комплекта',
                            id: 'package',
                            checks: [
                                { id: 'main-drawings', text: 'Основные чертежи с размерами', critical: true },
                                { id: 'assembly-scheme', text: 'Схема монтажа с описанием', critical: true },
                                { id: 'room-plan', text: 'План помещения с местом монтажа', critical: false },
                                { id: 'iso-assembly', text: 'Изометрия с обозначением секций', critical: true },
                                { id: 'sections-sheets', text: 'Листы для каждой секции', critical: true }
                            ]
                        },
                        {
                            title: 'Деталировка секций',
                            id: 'detailing',
                            checks: [
                                { id: 'section-dims', text: 'Указаны габариты каждой секции', critical: true },
                                { id: 'parts-callouts', text: 'Все детали обозначены выносками', critical: true },
                                { id: 'spec-table', text: 'Таблица спецификации заполнена', critical: true },
                                { id: 'texture-direction', text: 'Направление текстуры указано', critical: true },
                                { id: 'complex-parts', text: 'Сложные детали показаны отдельно', critical: false }
                            ]
                        }
                    ]
                },
                {
                    id: 'self-check',
                    title: 'Лист самопроверки',
                    icon: '🔍',
                    description: 'Финальная проверка перед передачей',
                    category: 'final',
                    sections: [
                        {
                            title: 'Материалы и отделка',
                            id: 'materials',
                            checks: [
                                { id: 'ldsp-marking', text: 'Указаны отделка, цвет, маркировка ЛДСП', critical: true },
                                { id: 'texture-direction', text: 'Обозначено направление текстуры', critical: true },
                                { id: 'edge-banding', text: 'Все кромки ЛДСП обозначены', critical: false },
                                { id: 'visible-sides', text: 'Видовые элементы с фасадной отделкой', critical: true }
                            ]
                        },
                        {
                            title: 'Фурнитура и техника',
                            id: 'furniture-tech',
                            checks: [
                                { id: 'handles', text: 'Ручки обозначены (модель/скриншот)', critical: true },
                                { id: 'tech-models', text: 'Техника подписана (наименование/модель)', critical: true },
                                { id: 'electrical', text: 'Информация по электрике указана', critical: true },
                                { id: 'sockets', text: 'Учтено расположение розеток', critical: true },
                                { id: 'hidden-fasteners', text: 'Видимый крепеж отсутствует', critical: false }
                            ]
                        },
                        {
                            title: 'Монтаж и габариты',
                            id: 'mounting',
                            checks: [
                                { id: 'transport', text: 'Габариты позволяют пронос в помещение', critical: true },
                                { id: 'wall-material', text: 'Учтен материал стен для крепления', critical: true },
                                { id: 'gaps', text: 'Все необходимые зазоры обозначены', critical: true },
                                { id: 'facade-gaps', text: 'Зазоры между фасадами 3-4мм', critical: false },
                                { id: 'ceiling-lights', text: 'Светильники не мешают фасадам', critical: false }
                            ]
                        },
                        {
                            title: 'Специальные требования',
                            id: 'special',
                            checks: [
                                { id: 'high-facades', text: 'Фасады >1950мм со скрытыми выпрямителями', critical: true },
                                { id: 'straighteners', text: 'Полки заглублены на 10мм под выпрямители', critical: false },
                                { id: 'material-limits', text: 'Габариты не превышают размер материала', critical: true },
                                { id: 'opening-check', text: 'Ящики и фасады свободно открываются', critical: true },
                                { id: 'sections-connection', text: 'Способ стяжки секций определен', critical: false }
                            ]
                        }
                    ]
                },
                {
                    id: 'specification',
                    title: 'Спецификация',
                    icon: '📋',
                    description: 'Проверка спецификации деталей',
                    category: 'documents',
                    sections: [
                        {
                            title: 'Формат спецификации',
                            id: 'format',
                            checks: [
                                { id: 'numbering', text: 'Номера в формате блок.деталь', critical: true },
                                { id: 'names', text: 'Наименования деталей корректны', critical: true },
                                { id: 'quantity', text: 'Количество указано верно', critical: true },
                                { id: 'dimensions', text: 'Габариты ДхШхТ проставлены', critical: true },
                                { id: 'materials', text: 'Материалы с облицовкой указаны', critical: true }
                            ]
                        },
                        {
                            title: 'Правила оформления',
                            id: 'rules',
                            checks: [
                                { id: 'texture-length', text: 'Длина указана вдоль текстуры', critical: true },
                                { id: 'composite-parts', text: 'Составные фасады не разбиты', critical: false },
                                { id: 'removable-parts', text: 'Съемные детали отдельно', critical: false },
                                { id: 'notes', text: 'Примечания где необходимо', critical: false }
                            ]
                        }
                    ]
                },
                {
                    id: 'basis-files',
                    title: 'Файлы Базис',
                    icon: '💾',
                    description: 'Проверка файлов для Базис Мебельщик',
                    category: 'files',
                    sections: [
                        {
                            title: 'Для заказа ЛДСП',
                            id: 'ldsp-order',
                            checks: [
                                { id: 'only-ldsp', text: 'Только детали ЛДСП и ХДФ', critical: true },
                                { id: 'edge-banding', text: 'Все торцы с кромкой ABS', critical: true },
                                { id: 'thick-edge', text: 'Для толщин >16мм кромка 2мм', critical: false },
                                { id: 'blocks', text: 'Секции объединены в блоки', critical: true },
                                { id: 'hierarchy', text: 'Иерархическая расстановка позиций', critical: false }
                            ]
                        },
                        {
                            title: 'Для ЧПУ',
                            id: 'cnc',
                            checks: [
                                { id: 'all-parts', text: 'Все детали кроме профильных', critical: true },
                                { id: 'drilling', text: 'Актуальные присадки и фрезеровки', critical: true },
                                { id: 'numbering', text: 'Каждой детали присвоен номер', critical: true },
                                { id: 'step-files', text: 'Сложные формы в STEP', critical: false },
                                { id: 'model-check', text: 'Выполнен "Анализ модели"', critical: true }
                            ]
                        }
                    ]
                }
            ],
            
            templates: {
                report: {
                    title: 'Отчет о проверке',
                    sections: ['summary', 'critical', 'warnings', 'passed']
                }
            }
        };
        
        const savedResults = this.getCache('results');
        if (savedResults) {
            this.checkResults = savedResults;
        }
        
        this.setCache(this.data);
    }
    
    renderContent() {
        if (this.activeCheck) {
            return this.renderActiveCheck();
        }
        
        if (this.currentChecklist) {
            return this.renderChecklist();
        }
        
        return this.renderMain();
    }
    
    renderMain() {
    const stats = this.getStatistics();
    const isMobile = window.innerWidth <= 767;
    
    return `
        <div class="checklists-container">
            ${isMobile ? '<h1 class="gradient-text mobile-page-title">Чек-листы</h1>' : ''}
                <div class="checklists-header">
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-value">${stats.total}</div>
                            <div class="stat-label">Всего проверок</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${stats.completed}</div>
                            <div class="stat-label">Завершено</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${stats.inProgress}</div>
                            <div class="stat-label">В процессе</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${stats.successRate}%</div>
                            <div class="stat-label">Успешность</div>
                        </div>
                    </div>
                </div>
                
                <div class="checklists-categories">
                    <h3>Категории проверок</h3>
                    <div class="categories-tabs">
                        <button class="tab active" onclick="app.getModule('checklist').filterByCategory('all')">
                            Все
                        </button>
                        <button class="tab" onclick="app.getModule('checklist').filterByCategory('approval')">
                            Согласование
                        </button>
                        <button class="tab" onclick="app.getModule('checklist').filterByCategory('production')">
                            Производство
                        </button>
                        <button class="tab" onclick="app.getModule('checklist').filterByCategory('documents')">
                            Документы
                        </button>
                        <button class="tab" onclick="app.getModule('checklist').filterByCategory('final')">
                            Финальная
                        </button>
                    </div>
                </div>
                
                <div class="checklists-grid">
                    ${this.data.checklists.map(checklist => 
                        this.renderChecklistCard(checklist)
                    ).join('')}
                </div>
                
                ${this.renderRecentChecks()}
            </div>
        `;
    }
    
    renderChecklistCard(checklist) {
        const progress = this.getChecklistProgress(checklist.id);
        const statusClass = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : '';
        
        return `
            <div class="checklist-card ${statusClass}" 
                 onclick="app.getModule('checklist').openChecklist('${checklist.id}')">
                <div class="checklist-icon">${checklist.icon}</div>
                <h3>${checklist.title}</h3>
                <p>${checklist.description}</p>
                
                ${progress > 0 ? `
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="progress-text">${progress}% выполнено</span>
                ` : `
                    <button class="start-btn">Начать проверку →</button>
                `}
            </div>
        `;
    }
    
    renderChecklist() {
        const checklist = this.data.checklists.find(c => c.id === this.currentChecklist);
        if (!checklist) return '<p>Чек-лист не найден</p>';
        
        const results = this.checkResults[checklist.id] || {};
        const progress = this.getChecklistProgress(checklist.id);
        
        return `
            <div class="checklist-page">
                <div class="breadcrumbs">
                    <span onclick="app.getModule('checklist').goHome()">Чек-листы</span>
                    <span>→</span>
                    <span>${checklist.title}</span>
                </div>
                
                <div class="checklist-header">
                    <h1>${checklist.icon} ${checklist.title}</h1>
                    <p>${checklist.description}</p>
                    
                    <div class="progress-summary">
                        <div class="progress-bar large">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span class="progress-text">${this.getCompletedCount(checklist.id)} из ${this.getTotalCount(checklist.id)} пунктов выполнено</span>
                    </div>
                </div>
                
                <div class="checklist-sections">
                    ${checklist.sections.map(section => 
                        this.renderSection(section, checklist.id)
                    ).join('')}
                </div>
                
                <div class="checklist-actions">
                    <button class="btn btn-secondary" onclick="app.getModule('checklist').saveProgress()">
                        💾 Сохранить прогресс
                    </button>
                    <button class="btn btn-primary" onclick="app.getModule('checklist').generateReport('${checklist.id}')">
                        📄 Создать отчет
                    </button>
                    ${progress === 100 ? `
                        <button class="btn btn-success" onclick="app.getModule('checklist').completeCheck('${checklist.id}')">
                            ✅ Завершить проверку
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    renderSection(section, checklistId) {
        const results = this.checkResults[checklistId] || {};
        const sectionResults = results[section.id] || {};
        const completed = section.checks.filter(c => sectionResults[c.id]).length;
        
        return `
            <div class="checklist-section">
                <h3>${section.title} <span class="section-progress">${completed}/${section.checks.length}</span></h3>
                <div class="checks-list">
                    ${section.checks.map(check => `
                        <label class="check-item ${check.critical ? 'critical' : ''} ${sectionResults[check.id] ? 'checked' : ''}">
                            <input type="checkbox" 
                                   ${sectionResults[check.id] ? 'checked' : ''}
                                   onchange="app.getModule('checklist').toggleCheck('${checklistId}', '${section.id}', '${check.id}')">
                            <span class="check-text">${check.text}</span>
                            ${check.critical ? '<span class="critical-badge">Критично</span>' : ''}
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderRecentChecks() {
        const recent = this.getRecentChecks();
        if (recent.length === 0) return '';
        
        return `
            <div class="recent-checks">
                <h3>Недавние проверки</h3>
                <div class="recent-list">
                    ${recent.map(check => `
                        <div class="recent-item" onclick="app.getModule('checklist').loadCheck('${check.id}')">
                            <div class="recent-icon">${check.icon}</div>
                            <div class="recent-info">
                                <div class="recent-title">${check.title}</div>
                                <div class="recent-date">${check.date}</div>
                            </div>
                            <div class="recent-progress">${check.progress}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    getPublicMethods() {
        return {
            openChecklist: (id) => this.openChecklist(id),
            toggleCheck: (checklistId, sectionId, checkId) => this.toggleCheck(checklistId, sectionId, checkId),
            saveProgress: () => this.saveProgress(),
            generateReport: (id) => this.generateReport(id),
            completeCheck: (id) => this.completeCheck(id),
            goHome: () => this.goHome(),
            filterByCategory: (category) => this.filterByCategory(category),
            loadCheck: (id) => this.loadCheck(id)
        };
    }
    
    openChecklist(id) {
        this.currentChecklist = id;
        this.app.router.navigate(`/checklist/${id}`);
        this.render();
    }
    
    toggleCheck(checklistId, sectionId, checkId) {
        if (!this.checkResults[checklistId]) {
            this.checkResults[checklistId] = {};
        }
        if (!this.checkResults[checklistId][sectionId]) {
            this.checkResults[checklistId][sectionId] = {};
        }
        
        this.checkResults[checklistId][sectionId][checkId] = 
            !this.checkResults[checklistId][sectionId][checkId];
        
        this.saveProgress();
        this.render();
    }
    
    saveProgress() {
        this.setCache(this.checkResults, 'results');
        this.log('Progress saved');
        this.showNotification('Прогресс сохранен');
    }
    
    generateReport(checklistId) {
        const checklist = this.data.checklists.find(c => c.id === checklistId);
        const results = this.checkResults[checklistId] || {};
        
        this.log(`Generating report for ${checklistId}`);
        this.showNotification('Отчет сгенерирован');
    }
    
    completeCheck(checklistId) {
        this.log(`Completing check ${checklistId}`);
        this.showNotification('Проверка завершена');
        this.goHome();
    }
    
    getChecklistProgress(checklistId) {
        const checklist = this.data.checklists.find(c => c.id === checklistId);
        if (!checklist) return 0;
        
        const results = this.checkResults[checklistId] || {};
        let completed = 0;
        let total = 0;
        
        checklist.sections.forEach(section => {
            const sectionResults = results[section.id] || {};
            completed += section.checks.filter(c => sectionResults[c.id]).length;
            total += section.checks.length;
        });
        
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }
    
    getCompletedCount(checklistId) {
        const checklist = this.data.checklists.find(c => c.id === checklistId);
        if (!checklist) return 0;
        
        const results = this.checkResults[checklistId] || {};
        let completed = 0;
        
        checklist.sections.forEach(section => {
            const sectionResults = results[section.id] || {};
            completed += section.checks.filter(c => sectionResults[c.id]).length;
        });
        
        return completed;
    }
    
    getTotalCount(checklistId) {
        const checklist = this.data.checklists.find(c => c.id === checklistId);
        if (!checklist) return 0;
        
        let total = 0;
        checklist.sections.forEach(section => {
            total += section.checks.length;
        });
        
        return total;
    }
    
    getStatistics() {
        const total = this.data.checklists.length;
        const completed = Object.keys(this.checkResults).filter(id => 
            this.getChecklistProgress(id) === 100
        ).length;
        const inProgress = Object.keys(this.checkResults).filter(id => 
            this.getChecklistProgress(id) > 0 && this.getChecklistProgress(id) < 100
        ).length;
        
        return {
            total,
            completed,
            inProgress,
            successRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }
    
    getRecentChecks() {
        return [];
    }
    
    goHome() {
        this.currentChecklist = null;
        this.activeCheck = null;
        this.app.router.navigate('/checklist');
        this.render();
    }
    
    filterByCategory(category) {
        this.log(`Filtering by category: ${category}`);
        this.render();
    }
    
    loadCheck(id) {
        this.log(`Loading check: ${id}`);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
   
}
