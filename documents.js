/**
 * @module Documents
 * @description Состав выпускаемой документации КБ
 * @version 1.0.0
 * @dependencies ['_state', '_router']
 */

import BaseModule from './BaseModule.js';

export default class Documents extends BaseModule {
    constructor(app) {
        super(app);
        this.name = 'documents';
        this.version = '1.0.0';
        this.dependencies = ['_state', '_router'];
        
        this.meta = {
            title: 'Состав документации',
            icon: '📋',
            description: 'Полный перечень выпускаемой КБ документации',
            navLabel: 'Документы',
            status: 'ready'
        };
        
        this.currentDoc = null;
    }
    
    async loadData() {
        this.data = {
            documents: [
                {
                    id: 1,
                    number: '01',
                    title: 'Эскизы для согласования',
                    description: 'Первичные чертежи для утверждения заказчиком',
                    icon: '✏️',
                    color: '#667eea',
                    details: {
                        purpose: 'Согласование с заказчиком основных решений',
                        format: 'PDF',
                        content: [
                            'Изометрические виды в цвете',
                            'Основные габариты',
                            'Материалы и текстуры',
                            'Фурнитура и техника',
                            'Общая концепция'
                        ],
                        requirements: [
                            'Актуальная дата выпуска',
                            'ФИО исполнителя',
                            'Номер из ПланФикс',
                            'Нумерация листов'
                        ]
                    }
                },
                {
                    id: 2,
                    number: '02',
                    title: 'Чертежи для изготовления',
                    description: 'Рабочая документация для производства в цехе',
                    icon: '📐',
                    color: '#10b981',
                    details: {
                        purpose: 'Производство изделий в цехе',
                        format: 'PDF',
                        content: [
                            'Все виды с размерами',
                            'Разрезы и сечения',
                            'Узлы и детали',
                            'Схема сборки',
                            'Спецификация'
                        ],
                        requirements: [
                            'Полная деталировка',
                            'Указание материалов',
                            'Направление текстуры',
                            'Способы крепления'
                        ]
                    }
                },
                {
                    id: 3,
                    number: '03',
                    title: 'Спецификация деталей',
                    description: 'Полный перечень всех элементов изделия',
                    icon: '📊',
                    color: '#f59e0b',
                    details: {
                        purpose: 'Контроль комплектности и заказ материалов',
                        format: 'PDF / Excel',
                        content: [
                            'Номера деталей',
                            'Наименования',
                            'Количество',
                            'Размеры ДхШхТ',
                            'Материалы и кромки'
                        ],
                        requirements: [
                            'Формат: блок.деталь',
                            'Длина вдоль текстуры',
                            'Съемные детали отдельно',
                            'Примечания где нужно'
                        ]
                    }
                },
                {
                    id: 4,
                    number: '04', 
                    title: 'Чертежи для субподряда',
                    description: 'Документация для сторонних подрядчиков',
                    icon: '🏗️',
                    color: '#8b5cf6',
                    details: {
                        purpose: 'Передача работ субподрядчикам',
                        format: 'PDF / DWG',
                        content: [
                            'Упрощенные чертежи',
                            'Только их часть работ',
                            'Габариты и привязки',
                            'Точки подключения',
                            'Требования к монтажу'
                        ],
                        requirements: [
                            'Четкое разделение работ',
                            'Контактные размеры',
                            'Допуски и зазоры',
                            'Материалы крепежа'
                        ]
                    }
                },
                {
                    id: 5,
                    number: '05',
                    title: 'Заявка в снабжение',
                    description: 'Excel файл с материалами и фурнитурой',
                    icon: '📦',
                    color: '#ec4899',
                    details: {
                        purpose: 'Закупка материалов и комплектующих',
                        format: 'Excel',
                        content: [
                            'Список ЛДСП/МДФ',
                            'Фурнитура по типам',
                            'Метизы и крепеж',
                            'Стекла и зеркала',
                            'Электрика и подсветка'
                        ],
                        requirements: [
                            'Артикулы поставщиков',
                            'Точные количества',
                            'Запас на брак',
                            'Сроки поставки'
                        ]
                    }
                },
                {
                    id: 6,
                    number: '06',
                    title: 'Файлы Базис Мебельщик',
                    description: 'Для заказа ЛДСП и передачи на ЧПУ',
                    icon: '💾',
                    color: '#06b6d4',
                    details: {
                        purpose: 'Автоматизация раскроя и обработки',
                        format: '.b3d / .bpj',
                        content: [
                            'Модель изделия',
                            'Карты раскроя',
                            'Присадки и фрезеровки',
                            'Кромление деталей',
                            'Этикетки деталей'
                        ],
                        requirements: [
                            'Анализ модели пройден',
                            'Кромки проверены',
                            'Нумерация деталей',
                            'Блоки объединены'
                        ]
                    }
                },
                {
                    id: 7,
                    number: '07',
                    title: 'Файлы DXF',
                    description: 'Для подрядчиков по металлу и стеклу',
                    icon: '📏',
                    color: '#84cc16',
                    details: {
                        purpose: 'Точная резка на сторонних производствах',
                        format: 'DXF / DWG',
                        content: [
                            'Контуры деталей',
                            'Отверстия и вырезы',
                            'Радиусы и фаски',
                            'Гравировка и маркировка',
                            'Линии гибки'
                        ],
                        requirements: [
                            'Масштаб 1:1',
                            'Замкнутые контуры',
                            'Слои по операциям',
                            'Единицы измерения'
                        ]
                    }
                }
            ]
        };
        
        this.setCache(this.data);
    }
    
    renderContent() {
        if (this.currentDoc) {
            return this.renderDocument();
        }
        
        return this.renderDocumentsList();
    }
    
    renderDocumentsList() {
        return `
            <div class="documents-page">
                <div class="page-header">
                    <button class="back-btn" onclick="window.location.hash = '/'">
                        ← Назад
                    </button>
                    <h1>${this.meta.icon} ${this.meta.title}</h1>
                    <p>${this.meta.description}</p>
                </div>
                
                <div class="documents-grid">
                    ${this.data.documents.map(doc => `
                        <div class="document-card" onclick="app.getModule('documents').openDocument(${doc.id})">
                            <div class="doc-number" style="background: ${doc.color}20; color: ${doc.color}">
                                ${doc.number}
                            </div>
                            <div class="doc-content">
                                <h3>${doc.title}</h3>
                                <p>${doc.description}</p>
                            </div>
                            <div class="doc-arrow">→</div>
                        </div>
                    `).join('')}
                </div>
                
                <style>
                    .documents-page {
                        max-width: 900px;
                        margin: 0 auto;
                    }
                    
                    .page-header {
                        margin-bottom: 32px;
                    }
                    
                    .page-header h1 {
                        font-size: 32px;
                        margin: 16px 0 8px;
                    }
                    
                    .page-header p {
                        color: var(--text-secondary);
                        font-size: 18px;
                    }
                    
                    .back-btn {
                        background: var(--bg-secondary);
                        border: none;
                        padding: 10px 20px;
                        border-radius: 10px;
                        font-size: 16px;
                        color: var(--text-primary);
                        cursor: pointer;
                        transition: all 0.2s;
                    }
                    
                    .back-btn:hover {
                        background: var(--bg-tertiary);
                        transform: translateX(-4px);
                    }
                    
                    .documents-grid {
                        display: grid;
                        gap: 12px;
                    }
                    
                    .document-card {
                        background: var(--bg-primary);
                        border-radius: 16px;
                        padding: 20px;
                        display: grid;
                        grid-template-columns: auto 1fr auto;
                        align-items: center;
                        gap: 20px;
                        cursor: pointer;
                        transition: all 0.3s;
                        border: 1px solid var(--border-color);
                    }
                    
                    .document-card:hover {
                        transform: translateX(8px);
                        box-shadow: var(--shadow-md);
                        border-color: transparent;
                    }
                    
                    .doc-number {
                        width: 56px;
                        height: 56px;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        font-weight: bold;
                    }
                    
                    .doc-content h3 {
                        font-size: 18px;
                        margin-bottom: 4px;
                        color: var(--text-primary);
                    }
                    
                    .doc-content p {
                        font-size: 14px;
                        color: var(--text-secondary);
                    }
                    
                    .doc-arrow {
                        font-size: 20px;
                        color: var(--text-light);
                    }
                    
                    @media (max-width: 768px) {
                        .documents-page {
                            padding: 0;
                        }
                        
                        .page-header h1 {
                            font-size: 24px;
                        }
                        
                        .page-header p {
                            font-size: 16px;
                        }
                        
                        .document-card {
                            padding: 16px;
                            gap: 16px;
                        }
                        
                        .doc-number {
                            width: 48px;
                            height: 48px;
                            font-size: 20px;
                        }
                        
                        .doc-content h3 {
                            font-size: 16px;
                        }
                    }
                </style>
            </div>
        `;
    }
    
    renderDocument() {
        const doc = this.data.documents.find(d => d.id === this.currentDoc);
        if (!doc) return '<p>Документ не найден</p>';
        
        return `
            <div class="document-detail">
                <div class="page-header">
                    <button class="back-btn" onclick="app.getModule('documents').goBack()">
                        ← Назад к списку
                    </button>
                    <div class="doc-header">
                        <div class="doc-icon" style="background: ${doc.color}20; color: ${doc.color}">
                            ${doc.icon}
                        </div>
                        <div>
                            <h1>${doc.title}</h1>
                            <p>${doc.description}</p>
                        </div>
                    </div>
                </div>
                
                <div class="doc-details">
                    <div class="detail-section">
                        <h3>📎 Назначение</h3>
                        <p>${doc.details.purpose}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3>📄 Формат</h3>
                        <p>${doc.details.format}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3>📋 Состав документа</h3>
                        <ul>
                            ${doc.details.content.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h3>⚠️ Обязательные требования</h3>
                        <ul class="requirements">
                            ${doc.details.requirements.map(req => `<li>${req}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="doc-actions">
                    <button class="btn btn-primary" onclick="app.getModule('checklist').openChecklist('${doc.title.toLowerCase().replace(/ /g, '-')}')">
                        ✓ Открыть чек-лист
                    </button>
                    <button class="btn btn-secondary" onclick="app.getModule('knowledge-base').search('${doc.title}')">
                        📚 Найти в базе знаний
                    </button>
                </div>
                
                <style>
                    .document-detail {
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    
                    .doc-header {
                        display: flex;
                        align-items: center;
                        gap: 20px;
                        margin-top: 24px;
                    }
                    
                    .doc-icon {
                        width: 64px;
                        height: 64px;
                        border-radius: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 32px;
                    }
                    
                    .doc-details {
                        background: var(--bg-primary);
                        border-radius: 20px;
                        padding: 32px;
                        margin: 32px 0;
                        border: 1px solid var(--border-color);
                    }
                    
                    .detail-section {
                        margin-bottom: 32px;
                    }
                    
                    .detail-section:last-child {
                        margin-bottom: 0;
                    }
                    
                    .detail-section h3 {
                        font-size: 18px;
                        margin-bottom: 12px;
                        color: var(--text-primary);
                    }
                    
                    .detail-section p {
                        color: var(--text-secondary);
                        line-height: 1.6;
                    }
                    
                    .detail-section ul {
                        margin-left: 20px;
                        color: var(--text-secondary);
                    }
                    
                    .detail-section li {
                        margin-bottom: 8px;
                        line-height: 1.5;
                    }
                    
                    .requirements li {
                        color: var(--text-primary);
                        font-weight: 500;
                    }
                    
                    .doc-actions {
                        display: flex;
                        gap: 12px;
                    }
                    
                    @media (max-width: 768px) {
                        .doc-header {
                            flex-direction: column;
                            text-align: center;
                            gap: 16px;
                        }
                        
                        .doc-details {
                            padding: 20px;
                            margin: 20px 0;
                        }
                        
                        .detail-section {
                            margin-bottom: 24px;
                        }
                        
                        .doc-actions {
                            flex-direction: column;
                        }
                        
                        .doc-actions .btn {
                            width: 100%;
                            justify-content: center;
                        }
                    }
                </style>
            </div>
        `;
    }
    
    getPublicMethods() {
        return {
            openDocument: (id) => this.openDocument(id),
            goBack: () => this.goBack()
        };
    }
    
    openDocument(id) {
        this.currentDoc = id;
        this.app.router.navigate(`/documents/${id}`);
        this.render();
    }
    
    goBack() {
        this.currentDoc = null;
        this.app.router.navigate('/documents');
        this.render();
    }
    
    render() {
        const container = document.getElementById('content');
        if (container) {
            container.innerHTML = this.renderContent();
        }
    }
}