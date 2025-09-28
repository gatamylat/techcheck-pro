/**
 * @module Stories
 * @description РАБОЧАЯ версия Stories - объединение успешных решений
 * @version 6.0.0 - COMBINED
 */

import BaseModule from './BaseModule.js';

export default class Stories extends BaseModule {
    constructor(app) {
        super(app);
        this.name = 'stories';
        this.version = '6.0.0-combined';
        this.dependencies = ['_state', '_router'];
        
        this.meta = {
            title: 'Stories',
            icon: '💬',
            description: 'Главная страница со Stories и модулями',
            navLabel: 'Stories',
            status: 'ready'
        };
        
        // Состояние карусели
        this.currentSlide = 0;
        this.totalSlides = 5;
        // БЕЗ автопрокрутки!
        this.autoPlayInterval = null;
        
        // Состояние панели
        this.isExpanded = false;
        this.isDragging = false;
        this.startY = 0;
        this.currentTop = 380;
        
        // DOM элементы
        this.elements = {};
        
        // Флаг для предотвращения двойных свайпов
        this.isTransitioning = false;
    }
    
    async init() {
        await super.init();
        this.initDOMElements();
    }
    
    initDOMElements() {
        this.elements = {
            homeContainer: document.getElementById('home-container'),
            desktopHomeContainer: document.getElementById('desktop-home-container'),
            mainHeader: document.getElementById('main-header'),
            mainContent: document.getElementById('content'),
            mainFooter: document.getElementById('main-footer'),
            homeHeader: document.getElementById('homeHeader'),
            storiesHero: document.getElementById('storiesHero'),
            storiesCarousel: document.getElementById('storiesCarousel'),
            carouselIndicators: document.getElementById('carouselIndicators'),
            mainContentPanel: document.getElementById('mainContent'),
            homeModules: document.getElementById('homeModules'),
            searchFab: document.getElementById('searchFab')
        };
    }
    
    async loadData() {
        // Данные из рабочей версии 2.0.0
        this.data = {
            slides: [
                {
                    id: 1,
                    title: 'TechCheck Pro',
                    subtitle: 'Система проверки документации',
                    gradient: 'rainbow',
                    action: null
                },
                {
                    id: 2,
                    title: 'Новости',
                    subtitle: 'Обновления системы',
                    gradient: 'purple',
                    action: 'news'
                },
                {
                    id: 3,
                    title: 'Совет дня',
                    subtitle: 'Полезные лайфхаки',
                    gradient: 'pink',
                    action: 'tips'
                },
                {
                    id: 4,
                    title: '127',
                    subtitle: 'Проверок за неделю',
                    gradient: 'blue',
                    action: 'stats'
                },
                {
                    id: 5,
                    title: 'Команда',
                    subtitle: 'Лучшие проверяющие',
                    gradient: 'green',
                    action: 'team'
                }
            ]
        };
        
        this.totalSlides = this.data.slides.length;
        this.setCache(this.data);
    }
    
    initHomePage() {
        this.initDOMElements();
        
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            this.showMobileHome();
        } else {
            this.showDesktopHome();
        }
    }
    
    showMobileHome() {
        // Скрываем десктоп и стандартные элементы
        if (this.elements.desktopHomeContainer) {
            this.elements.desktopHomeContainer.classList.add('hidden');
        }
        if (this.elements.mainHeader) this.elements.mainHeader.classList.add('hidden');
        if (this.elements.mainContent) this.elements.mainContent.classList.add('hidden');
        if (this.elements.mainFooter) this.elements.mainFooter.classList.add('hidden');
        
        // Показываем мобильную версию
        if (this.elements.homeContainer) {
            this.elements.homeContainer.classList.remove('hidden');
        }
        
        // Рендерим компоненты (из версии 2.0.0)
        this.renderStoriesSlides();
        this.renderIndicators();
        this.renderHomeModules();
        
        // Инициализация событий с задержкой
        setTimeout(() => {
            this.initCarouselEvents();
            this.initPanelDragging();
            this.initSearchButton();
            // НЕ вызываем startAutoPlay()!
        }, 100);
        
        this.log('Mobile home initialized', 'success');
    }
    
    renderStoriesSlides() {
        if (!this.elements.storiesCarousel) return;
        
        // Используем структуру из версии 2.0.0, которая работала
        this.elements.storiesCarousel.innerHTML = this.data.slides.map((slide, index) => `
            <div class="story-slide story-gradient-${slide.gradient}" 
     onclick="app.getModule('stories').openStory(${index})"
     style="min-width: 100%; flex-shrink: 0;">>
                <h1 class="story-title">${slide.title}</h1>
                <p class="story-subtitle">${slide.subtitle}</p>
            </div>
        `).join('');
        
        // Добавляем стиль для карусели
        this.elements.storiesCarousel.style.cssText = `
            display: flex;
            height: 100%;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateX(0);
        `;
    }
    
    renderIndicators() {
        if (!this.elements.carouselIndicators) return;
        
        this.elements.carouselIndicators.innerHTML = this.data.slides.map((_, index) => `
            <button class="carousel-indicator ${index === 0 ? 'active' : ''}" 
                    onclick="app.getModule('stories').goToSlide(${index})"></button>
        `).join('');
    }
    
    renderHomeModules() {
        if (!this.elements.homeModules) return;
        
        const modules = [
            { id: 'knowledge-base', icon: '📚', title: 'База знаний', desc: 'ГОСТ стандарты' },
            { id: 'checklist', icon: '✓', title: 'Чек-листы', desc: 'Проверка документов' },
            { id: 'documents', icon: '📋', title: 'Документы', desc: 'Состав КБ' },
            { id: 'wiki', icon: '📖', title: 'Wiki', desc: 'База команды', status: 'beta' }
        ];
        
        const futureModules = [
            { icon: '📊', title: 'Статистика', desc: 'Аналитика проверок', date: 'Q2 2025' },
            { icon: '🤖', title: 'AI Проверка', desc: 'Автоматический анализ', date: 'Q3 2025' }
        ];
        
        this.elements.homeModules.innerHTML = `
            <!-- Основные модули -->
            <div class="home-modules">
                <div class="grid grid-2">
                    ${modules.map(module => `
                        <div class="module-card" onclick="window.location.hash = '/${module.id}'">
                            ${module.status ? `<span class="module-status status-${module.status}">Beta</span>` : ''}
                            <div class="module-header">
                                <div class="module-icon">${module.icon}</div>
                                <div class="module-info">
                                    <h3>${module.title}</h3>
                                    <p>${module.desc}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Будущие модули -->
            <section class="future-section">
                <h2>Скоро</h2>
                <div class="future-modules">
                    ${futureModules.map(module => `
                        <div class="future-card">
                            <span class="future-badge">${module.date}</span>
                            <div class="future-icon">${module.icon}</div>
                            <div class="future-title">${module.title}</div>
                            <div class="future-desc">${module.desc}</div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }
    
    initCarouselEvents() {
        if (!this.elements.storiesHero) return;
        
        let touchStartX = 0;
        let touchStartY = 0;
        
        // Убираем старые обработчики
        const newHero = this.elements.storiesHero.cloneNode(true);
        this.elements.storiesHero.parentNode.replaceChild(newHero, this.elements.storiesHero);
        this.elements.storiesHero = newHero;
        
        this.elements.storiesHero.addEventListener('touchstart', (e) => {
            if (this.isTransitioning) return; // Блокируем если идет переход
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        this.elements.storiesHero.addEventListener('touchend', (e) => {
            if (this.isTransitioning) return; // Блокируем если идет переход
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const diffX = touchStartX - touchEndX;
            const diffY = Math.abs(touchStartY - touchEndY);
            
            // Проверяем что это горизонтальный свайп
            if (Math.abs(diffX) > diffY && Math.abs(diffX) > 50) {
                this.handleSwipe(diffX);
            }
        }, { passive: true });
        
        // Слушаем окончание анимации
        this.elements.storiesCarousel.addEventListener('transitionend', () => {
            this.isTransitioning = false;
        });
    }
    
    handleSwipe(diff) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        if (diff > 0) {
            this.nextSlide();
        } else {
            this.prevSlide();
        }
        
        // Сброс флага через время анимации
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    goToSlide(index) {
        if (index < 0) index = this.totalSlides - 1;
        if (index >= this.totalSlides) index = 0;
        
        this.currentSlide = index;
        
        if (this.elements.storiesCarousel) {
            this.elements.storiesCarousel.style.transform = `translateX(-${index * 100}%)`;
        }
        
        // Обновляем индикаторы
        const indicators = document.querySelectorAll('.carousel-indicator');
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === index);
        });
        
        this.log(`Slide ${index + 1}/${this.totalSlides}`, 'info');
    }
    
    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }
    
    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    }
    
    initPanelDragging() {
        const panel = this.elements.mainContentPanel;
        if (!panel) return;
        
        // Упрощенная версия без лишнего
        panel.addEventListener('touchstart', (e) => {
            if (e.target.closest('.module-card, .future-card, button')) return;
            
            this.isDragging = true;
            this.startY = e.touches[0].clientY;
            panel.classList.add('is-dragging');
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            
            e.preventDefault();
            const deltaY = e.touches[0].clientY - this.startY;
            let newTop = this.currentTop + deltaY;
            
            newTop = Math.max(40, Math.min(380, newTop));
            panel.style.top = newTop + 'px';
        }, { passive: false });
        
        document.addEventListener('touchend', () => {
            if (!this.isDragging) return;
            
            this.isDragging = false;
            panel.classList.remove('is-dragging');
            
            const currentY = parseInt(panel.style.top) || 380;
            if (currentY < 230) {
                this.expandPanel();
            } else {
                this.collapsePanel();
            }
        });
        
        // Клик на хедер
        if (this.elements.homeHeader) {
            this.elements.homeHeader.addEventListener('click', () => {
                this.collapsePanel();
            });
        }
    }
    
    expandPanel() {
        if (!this.elements.mainContentPanel) return;
        
        this.isExpanded = true;
        this.currentTop = 40;
        this.elements.mainContentPanel.style.top = '40px';
        this.elements.mainContentPanel.classList.add('is-expanded');
        
        if (this.elements.storiesHero) {
            this.elements.storiesHero.classList.add('is-hidden');
        }
        if (this.elements.homeHeader) {
            this.elements.homeHeader.classList.add('is-visible');
        }
    }
    
    collapsePanel() {
        if (!this.elements.mainContentPanel) return;
        
        this.isExpanded = false;
        this.currentTop = 380;
        this.elements.mainContentPanel.style.top = '380px';
        this.elements.mainContentPanel.classList.remove('is-expanded');
        
        if (this.elements.storiesHero) {
            this.elements.storiesHero.classList.remove('is-hidden');
        }
        if (this.elements.homeHeader) {
            this.elements.homeHeader.classList.remove('is-visible');
        }
    }
    
    initSearchButton() {
        if (!this.elements.searchFab) return;
        
        this.elements.searchFab.addEventListener('click', () => {
            alert('Функция поиска будет добавлена в следующей версии');
        });
    }
    
    showDesktopHome() {
        // Скрываем мобильную версию
        if (this.elements.homeContainer) {
            this.elements.homeContainer.classList.add('hidden');
        }
        
        // Показываем десктоп
        if (this.elements.desktopHomeContainer) {
            this.elements.desktopHomeContainer.classList.remove('hidden');
        }
        
        // Показываем стандартный интерфейс для десктопа
        if (this.elements.mainHeader) this.elements.mainHeader.classList.remove('hidden');
        if (this.elements.mainContent) this.elements.mainContent.classList.remove('hidden');
        if (this.elements.mainFooter) this.elements.mainFooter.classList.remove('hidden');
        
        // Простая десктоп версия
        if (this.elements.desktopHomeContainer) {
            this.elements.desktopHomeContainer.innerHTML = `
                <div class="desktop-hero">
                    <div class="desktop-hero-content">
                        <h1 class="gradient-text">Проверяйте документацию быстро и точно</h1>
                        <p class="text-secondary mb-3">Стандарты Массивбург • Интерактивные чек-листы • База знаний</p>
                        <div class="hero-actions">
                            <button class="btn btn-primary" onclick="window.location.hash = '/checklist'">
                                🚀 Начать проверку
                            </button>
                            <button class="btn btn-secondary" onclick="window.location.hash = '/knowledge-base'">
                                📖 База знаний
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="desktop-modules-grid">
                    <div class="module-card" onclick="window.location.hash = '/documents'">
                        <span class="module-status status-ready">Готово</span>
                        <div class="module-header">
                            <div class="module-icon">📋</div>
                            <div class="module-info">
                                <h3>Состав документации</h3>
                                <p>7 типов документов</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="module-card" onclick="window.location.hash = '/knowledge-base'">
                        <span class="module-status status-ready">Готово</span>
                        <div class="module-header">
                            <div class="module-icon">📚</div>
                            <div class="module-info">
                                <h3>База знаний</h3>
                                <p>ГОСТ стандарты</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="module-card" onclick="window.location.hash = '/checklist'">
                        <span class="module-status status-ready">Готово</span>
                        <div class="module-header">
                            <div class="module-icon">✓</div>
                            <div class="module-info">
                                <h3>Чек-листы</h3>
                                <p>Проверка документов</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        this.log('Desktop home initialized', 'success');
    }
    
    openStory(index) {
        const slide = this.data.slides[index];
        this.log(`Opening story: ${slide.title}`);
        
        if (slide.action) {
            switch(slide.action) {
                case 'news':
                    alert('Новости системы будут добавлены в следующей версии');
                    break;
                case 'tips':
                    alert('Советы и лайфхаки будут добавлены в следующей версии');
                    break;
                case 'stats':
                    this.app.router.navigate('/statistics');
                    break;
                case 'team':
                    alert('Информация о команде будет добавлена в следующей версии');
                    break;
            }
        }
    }
    
    getPublicMethods() {
        return {
            goToSlide: (index) => this.goToSlide(index),
            nextSlide: () => this.nextSlide(),
            prevSlide: () => this.prevSlide(),
            openStory: (index) => this.openStory(index),
            initHomePage: () => this.initHomePage(),
            expandPanel: () => this.expandPanel(),
            collapsePanel: () => this.collapsePanel()
        };
    }
}
