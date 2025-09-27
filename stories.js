/**
 * @module Stories
 * @description Stories карусель и управление главной страницей
 * @version 3.0.0 - COMPLETELY FIXED
 * @dependencies ['_state', '_router']
 */

import BaseModule from './BaseModule.js';

export default class Stories extends BaseModule {
    constructor(app) {
        super(app);
        this.name = 'stories';
        this.version = '3.0.0';
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
        this.autoPlayInterval = null;
        this.autoPlayEnabled = false; // ОТКЛЮЧЕНО!
        
        // Состояние панели
        this.isExpanded = false;
        this.isDragging = false;
        this.startY = 0;
        this.startTop = 380;
        this.currentTop = 380;
        this.expandedTop = 40;
        this.collapsedTop = 380;
        this.threshold = 230;
        
        // DOM элементы
        this.elements = {};
        
        // ВАЖНО: Флаг инициализации
        this.isInitialized = false;
    }
    
    async init() {
        await super.init();
        this.initDOMElements();
        // НЕ вызываем initHomePage здесь - роутер сделает это сам!
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
        // Stories слайды
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
        // ЗАЩИТА ОТ ПОВТОРНОЙ ИНИЦИАЛИЗАЦИИ
        if (this.isInitialized && window.innerWidth < 768) {
            this.log('Home page already initialized, skipping...', 'info');
            return;
        }
        
        // Обновляем DOM элементы
        this.initDOMElements();
        
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Скрываем десктопную версию
            if (this.elements.desktopHomeContainer) {
                this.elements.desktopHomeContainer.classList.add('hidden');
            }
            // Показываем мобильную версию
            if (this.elements.homeContainer) {
                this.elements.homeContainer.classList.remove('hidden');
            }
            
            // ИСПРАВЛЕНИЕ: Добавляем стили для слайдов
            this.injectSlideStyles();
            
            // Мобильная версия со Stories
            this.renderStoriesSlides();
            this.renderIndicators();
            this.renderHomeModules();
            this.initCarouselEvents();
            this.initPanelDragging();
            this.initSearchButton();
            
            // Устанавливаем на первый слайд
            this.currentSlide = 0;
            this.goToSlide(0);
            
            this.isInitialized = true;
            this.log('Mobile home page initialized with Stories', 'success');
        } else {
            // Скрываем мобильную версию
            if (this.elements.homeContainer) {
                this.elements.homeContainer.classList.add('hidden');
            }
            // Показываем десктопную версию
            if (this.elements.desktopHomeContainer) {
                this.elements.desktopHomeContainer.classList.remove('hidden');
            }
            
            // Десктопная версия
            this.renderDesktopHome();
            this.isInitialized = false; // Для десктопа можем перерисовывать
            this.log('Desktop home page initialized', 'success');
        }
        
        // Слушаем изменение размера окна
        this.handleResize();
    }
    
    /**
     * НОВЫЙ МЕТОД: Внедрение стилей для исправления белых слайдов
     */
    injectSlideStyles() {
        // Проверяем, не добавили ли уже стили
        if (document.getElementById('stories-slide-fix')) return;
        
        const style = document.createElement('style');
        style.id = 'stories-slide-fix';
        style.innerHTML = `
            /* ФИКС: Правильное позиционирование слайдов */
            .stories-carousel {
                position: relative;
                width: 100%;
                height: 100%;
            }
            
            .story-slide {
                position: relative !important;
                width: 100% !important;
                height: 100% !important;
                flex-shrink: 0 !important;
            }
            
            /* ФИКС: Убеждаемся что градиенты видны */
            .story-gradient-rainbow {
                background: linear-gradient(135deg, 
                    #FF006E 0%, 
                    #8338EC 20%, 
                    #3A86FF 40%, 
                    #06FFB4 60%, 
                    #FFBE0B 80%, 
                    #FB5607 100%) !important;
                background-size: 400% 400% !important;
            }
            
            .story-gradient-purple {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            }
            
            .story-gradient-pink {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
            }
            
            .story-gradient-blue {
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
            }
            
            .story-gradient-green {
                background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%) !important;
            }
        `;
        document.head.appendChild(style);
        this.log('Injected slide fix styles', 'success');
    }
    
    renderStoriesSlides() {
        if (!this.elements.storiesCarousel) {
            this.log('Stories carousel element not found', 'error');
            return;
        }
        
        // Очищаем и перерисовываем
        this.elements.storiesCarousel.innerHTML = '';
        
        // Создаем слайды с правильными классами
        const slidesHTML = this.data.slides.map((slide, index) => {
            // ВАЖНО: Добавляем data-атрибут для отладки
            return `
                <div class="story-slide story-gradient-${slide.gradient}" 
                     data-slide-index="${index}"
                     data-slide-gradient="${slide.gradient}"
                     onclick="app.getModule('stories').openStory(${index})">
                    <h1 class="story-title">${slide.title}</h1>
                    <p class="story-subtitle">${slide.subtitle}</p>
                </div>
            `;
        }).join('');
        
        this.elements.storiesCarousel.innerHTML = slidesHTML;
        
        // Сброс позиции
        this.elements.storiesCarousel.style.transform = 'translateX(0)';
        this.currentSlide = 0;
        
        this.log(`Rendered ${this.totalSlides} story slides`, 'success');
        
        // Проверка слайдов
        const renderedSlides = this.elements.storiesCarousel.querySelectorAll('.story-slide');
        this.log(`Actual slides in DOM: ${renderedSlides.length}`, 'info');
    }
    
    renderIndicators() {
        if (!this.elements.carouselIndicators) {
            this.log('Carousel indicators element not found', 'warning');
            return;
        }
        
        this.elements.carouselIndicators.innerHTML = this.data.slides.map((_, index) => `
            <button class="carousel-indicator ${index === 0 ? 'active' : ''}" 
                    data-indicator-index="${index}"
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
    
    /**
     * Рендер десктопной версии главной страницы
     */
    renderDesktopHome() {
        if (!this.elements.desktopHomeContainer) {
            this.log('Desktop home container not found', 'warning');
            return;
        }
        
        // Очищаем мобильные элементы
        if (this.elements.homeContainer) {
            this.elements.homeContainer.classList.add('hidden');
        }
        
        this.elements.desktopHomeContainer.innerHTML = `
            <!-- Hero блок -->
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
            
            <!-- Основные модули -->
            <div class="desktop-modules-grid">
                <!-- Большая карточка документации -->
                <div class="module-card" onclick="window.location.hash = '/documents'">
                    <span class="module-status status-ready">Готово</span>
                    <div class="module-header">
                        <div class="module-icon">📋</div>
                        <div class="module-info">
                            <h3>Состав документации</h3>
                            <p>7 типов документов для проверки</p>
                        </div>
                    </div>
                </div>
                
                <!-- База знаний -->
                <div class="module-card" onclick="window.location.hash = '/knowledge-base'">
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
                <div class="module-card" onclick="window.location.hash = '/checklist'">
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
            <h2 class="mt-4 mb-3">Дополнительные модули</h2>
            <div class="desktop-special-grid">
                <!-- Wiki -->
                <div class="module-card" onclick="window.location.hash = '/wiki'">
                    <span class="module-status status-beta">Beta</span>
                    <div class="module-header">
                        <div class="module-icon">📖</div>
                        <div class="module-info">
                            <h3>Wiki</h3>
                            <p>База знаний команды</p>
                        </div>
                    </div>
                </div>
                
                <!-- Статистика -->
                <div class="module-card" style="opacity: 0.6; cursor: not-allowed;">
                    <span class="module-status status-soon">Скоро</span>
                    <div class="module-header">
                        <div class="module-icon">📊</div>
                        <div class="module-info">
                            <h3>Статистика</h3>
                            <p>Аналитика проверок</p>
                        </div>
                    </div>
                </div>
                
                <!-- AI Проверка -->
                <div class="module-card" style="opacity: 0.6; cursor: not-allowed;">
                    <span class="module-status status-soon">Скоро</span>
                    <div class="module-header">
                        <div class="module-icon">🤖</div>
                        <div class="module-info">
                            <h3>AI Проверка</h3>
                            <p>Автоматическая проверка с LLM</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.log('Desktop home rendered', 'success');
    }

    /**
     * Обработка изменения размера окна
     */
    handleResize() {
        // Удаляем старый обработчик если есть
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
        
        // Создаем новый обработчик с debounce
        let resizeTimer;
        this.resizeHandler = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const isMobile = window.innerWidth < 768;
                const wasMobile = this.elements.homeContainer && 
                                !this.elements.homeContainer.classList.contains('hidden');
                
                // Если изменился тип устройства - перерисовываем
                if ((isMobile && !wasMobile) || (!isMobile && wasMobile)) {
                    this.isInitialized = false; // Сбрасываем флаг для перерисовки
                    this.initHomePage();
                }
            }, 250);
        };
        
        window.addEventListener('resize', this.resizeHandler);
    }
    
    initCarouselEvents() {
        if (!this.elements.storiesHero) return;
        
        // Удаляем старые обработчики если есть
        const newHero = this.elements.storiesHero.cloneNode(true);
        this.elements.storiesHero.parentNode.replaceChild(newHero, this.elements.storiesHero);
        this.elements.storiesHero = newHero;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.elements.storiesHero.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        this.elements.storiesHero.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe(touchStartX - touchEndX);
        }, { passive: true });
    }
    
    handleSwipe(diff) {
        const swipeThreshold = 50;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    initPanelDragging() {
        const panel = this.elements.mainContentPanel;
        if (!panel) return;
        
        // Touch события
        panel.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('touchend', (e) => this.endDrag(e), { passive: true });
        
        // Mouse события (для десктопа)
        panel.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', (e) => this.endDrag(e));
        
        // Клик на хедер "Домой"
        if (this.elements.homeHeader) {
            this.elements.homeHeader.addEventListener('click', () => {
                this.collapsePanel();
            });
        }
    }
    
    startDrag(e) {
        // Проверяем, что не кликнули на интерактивный элемент
        if (e.target.closest('.module-card, .future-card, .search-fab, button')) {
            return;
        }
        
        this.isDragging = true;
        this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        this.startTop = this.currentTop;
        this.elements.mainContentPanel.classList.add('is-dragging');
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        const deltaY = clientY - this.startY;
        let newTop = this.startTop + deltaY;
        
        // Ограничиваем движение
        newTop = Math.max(this.expandedTop, Math.min(this.collapsedTop, newTop));
        
        this.elements.mainContentPanel.style.top = newTop + 'px';
        this.currentTop = newTop;
    }
    
    endDrag(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.elements.mainContentPanel.classList.remove('is-dragging');
        
        // Определяем финальную позицию
        if (this.currentTop < this.threshold) {
            this.expandPanel();
        } else {
            this.collapsePanel();
        }
    }
    
    expandPanel() {
        if (!this.elements.mainContentPanel) return;
        
        this.isExpanded = true;
        this.currentTop = this.expandedTop;
        this.elements.mainContentPanel.classList.add('is-expanded');
        
        if (this.elements.storiesHero) {
            this.elements.storiesHero.classList.add('is-hidden');
        }
        
        if (this.elements.homeHeader) {
            this.elements.homeHeader.classList.add('is-visible');
        }
        
        this.elements.mainContentPanel.style.top = this.currentTop + 'px';
        this.stopAutoPlay();
    }
    
    collapsePanel() {
        if (!this.elements.mainContentPanel) return;
        
        this.isExpanded = false;
        this.currentTop = this.collapsedTop;
        this.elements.mainContentPanel.classList.remove('is-expanded');
        
        if (this.elements.storiesHero) {
            this.elements.storiesHero.classList.remove('is-hidden');
        }
        
        if (this.elements.homeHeader) {
            this.elements.homeHeader.classList.remove('is-visible');
        }
        
        this.elements.mainContentPanel.style.top = this.currentTop + 'px';
        // НЕ запускаем автопрокрутку
    }
    
    initSearchButton() {
        if (!this.elements.searchFab) return;
        
        this.elements.searchFab.addEventListener('click', () => {
            this.openSearch();
        });
    }
    
    goToSlide(index) {
        // Проверка границ и цикличность
        if (index < 0) {
            index = this.totalSlides - 1;
        } else if (index >= this.totalSlides) {
            index = 0;
        }
        
        // Устанавливаем текущий слайд
        this.currentSlide = index;
        
        // Проверяем наличие элементов
        if (!this.elements.storiesCarousel) {
            this.log('Stories carousel not found', 'error');
            return;
        }
        
        // Применяем трансформацию
        const translateValue = -index * 100;
        this.elements.storiesCarousel.style.transform = `translateX(${translateValue}%)`;
        
        // Обновляем индикаторы
        if (this.elements.carouselIndicators) {
            const indicators = this.elements.carouselIndicators.querySelectorAll('.carousel-indicator');
            indicators.forEach((ind, i) => {
                ind.classList.toggle('active', i === index);
            });
        }
        
        // Отладочная информация
        const currentSlideEl = this.elements.storiesCarousel.querySelector(`[data-slide-index="${index}"]`);
        if (currentSlideEl) {
            const gradient = currentSlideEl.getAttribute('data-slide-gradient');
            this.log(`Slide ${index + 1}/${this.totalSlides} - gradient: ${gradient}`, 'info');
        }
    }
    
    nextSlide() {
        const nextIndex = this.currentSlide + 1;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = this.currentSlide - 1;
        this.goToSlide(prevIndex);
    }
    
    // Методы автопрокрутки (отключены)
    startAutoPlay() {
        if (!this.autoPlayEnabled) return;
        
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    destroy() {
        // Останавливаем все интервалы и слушатели
        this.stopAutoPlay();
        
        // Удаляем обработчик resize
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
        
        // Удаляем добавленные стили
        const styleEl = document.getElementById('stories-slide-fix');
        if (styleEl) {
            styleEl.remove();
        }
        
        // Очищаем DOM
        if (this.elements.homeContainer) {
            this.elements.homeContainer.classList.add('hidden');
        }
        if (this.elements.desktopHomeContainer) {
            this.elements.desktopHomeContainer.classList.add('hidden');
        }
        
        // Сбрасываем флаг инициализации
        this.isInitialized = false;
        
        super.destroy();
    }
    
    openStory(index) {
        const slide = this.data.slides[index];
        this.log(`Opening story: ${slide.title}`);
        
        if (slide.action) {
            switch(slide.action) {
                case 'news':
                    this.showNews();
                    break;
                case 'tips':
                    this.showTips();
                    break;
                case 'stats':
                    this.app.router.navigate('/statistics');
                    break;
                case 'team':
                    this.showTeam();
                    break;
            }
        }
    }
    
    openSearch() {
        this.log('Opening search');
        alert('Функция поиска будет добавлена в следующей версии');
    }
    
    showNews() {
        alert('Новости системы будут добавлены в следующей версии');
    }
    
    showTips() {
        alert('Советы и лайфхаки будут добавлены в следующей версии');
    }
    
    showTeam() {
        alert('Информация о команде будет добавлена в следующей версии');
    }
    
    getPublicMethods() {
        return {
            goToSlide: (index) => this.goToSlide(index),
            openStory: (index) => this.openStory(index),
            expandPanel: () => this.expandPanel(),
            collapsePanel: () => this.collapsePanel(),
            initHomePage: () => this.initHomePage(),
            renderDesktopHome: () => this.renderDesktopHome(),
            stopAutoPlay: () => this.stopAutoPlay()
        };
    }
}
