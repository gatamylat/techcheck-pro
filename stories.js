/**
 * @module Stories
 * @description Stories карусель и управление главной страницей
 * @version 2.0.0
 * @dependencies ['_state', '_router']
 */

import BaseModule from './BaseModule.js';

export default class Stories extends BaseModule {
    constructor(app) {
        super(app);
        this.name = 'stories';
        this.version = '2.0.0';
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
        this.totalSlides = 0;
        this.autoPlayInterval = null;
        
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
    }
    
    async init() {
        await super.init();
        this.initDOMElements();
        this.initHomePage();
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
        
        this.setCache(this.data);
    }
    
    initHomePage() {
        // Перерисовываем элементы на случай если DOM изменился
        this.initDOMElements();
        
        // Проверяем ширину экрана
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Мобильная версия со Stories
            this.renderStoriesSlides();
            this.renderIndicators();
            this.renderHomeModules();
            this.initCarouselEvents();
            this.initPanelDragging();
            this.initSearchButton();
            this.startAutoPlay();
            this.log('Mobile home page initialized with Stories', 'success');
        } else {
            // Десктопная версия
            this.renderDesktopHome();
            this.log('Desktop home page initialized', 'success');
        }
        
        // Слушаем изменение размера окна
        this.handleResize();
    }
    
    renderStoriesSlides() {
        if (!this.elements.storiesCarousel) return;
        
        this.elements.storiesCarousel.innerHTML = this.data.slides.map((slide, index) => `
            <div class="story-slide story-gradient-${slide.gradient}" 
                 onclick="app.getModule('stories').openStory(${index})">
                <h1 class="story-title">${slide.title}</h1>
                <p class="story-subtitle">${slide.subtitle}</p>
            </div>
        `).join('');
        this.totalSlides = this.data.slides.length;
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
    /**
     * Рендер десктопной версии главной страницы
     */
    renderDesktopHome() {
        if (!this.elements.desktopHomeContainer) {
            this.log('Desktop home container not found', 'warning');
            return;
        }
        
        const modules = this.app.moduleMeta || {};
        
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
                    this.initHomePage();
                }
            }, 250);
        };
        
        window.addEventListener('resize', this.resizeHandler);
    }
    
    initCarouselEvents() {
        if (!this.elements.storiesHero) return;
        
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
        this.elements.homeHeader.addEventListener('click', () => {
            this.collapsePanel();
        });
        
        // Предотвращаем выделение текста при перетаскивании
        panel.addEventListener('selectstart', (e) => {
            if (this.isDragging) e.preventDefault();
        });
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
        this.isExpanded = true;
        this.currentTop = this.expandedTop;
        this.elements.mainContentPanel.classList.add('is-expanded');
        this.elements.storiesHero.classList.add('is-hidden');
        this.elements.homeHeader.classList.add('is-visible');
        this.elements.mainContentPanel.style.top = this.currentTop + 'px';
        this.stopAutoPlay();
    }
    
    collapsePanel() {
        this.isExpanded = false;
        this.currentTop = this.collapsedTop;
        this.elements.mainContentPanel.classList.remove('is-expanded');
        this.elements.storiesHero.classList.remove('is-hidden');
        this.elements.homeHeader.classList.remove('is-visible');
        this.elements.mainContentPanel.style.top = this.currentTop + 'px';
        this.startAutoPlay();
    }
    
    initSearchButton() {
        if (!this.elements.searchFab) return;
        
        this.elements.searchFab.addEventListener('click', () => {
            this.openSearch();
        });
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        const slideWidth = this.elements.storiesCarousel.offsetWidth;
this.elements.storiesCarousel.style.transform = `translateX(-${index * slideWidth}px)`;

        
        const indicators = this.elements.carouselIndicators.querySelectorAll('.carousel-indicator');
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === index);
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(this.currentSlide);
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(this.currentSlide);
    }
    
    startAutoPlay() {
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
        // Создаем модальное окно поиска
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
    
    // Показать главную страницу
    showHomePage() {
        // Показываем контейнер главной
        this.elements.homeContainer.classList.remove('hidden');
        // Скрываем остальное
        this.elements.mainHeader.classList.add('hidden');
        this.elements.mainContent.classList.add('hidden');
        this.elements.mainFooter.classList.add('hidden');
        
        // Инициализируем интерфейс
        this.initHomePage();
    }
    
    // Скрыть главную страницу
    hideHomePage() {
        // Скрываем контейнер главной
        this.elements.homeContainer.classList.add('hidden');
        // Показываем остальное
        this.elements.mainHeader.classList.remove('hidden');
        this.elements.mainContent.classList.remove('hidden');
        this.elements.mainFooter.classList.remove('hidden');
        
        // Останавливаем автопрокрутку
        this.stopAutoPlay();
    }
    
    getPublicMethods() {
            return {
                goToSlide: (index) => this.goToSlide(index),
                openStory: (index) => this.openStory(index),
                showHomePage: () => this.showHomePage(),
                hideHomePage: () => this.hideHomePage(),
                expandPanel: () => this.expandPanel(),
                collapsePanel: () => this.collapsePanel(),
                initHomePage: () => this.initHomePage(),
                renderDesktopHome: () => this.renderDesktopHome()  // <-- Добавьте эту строку!
            };
        }
}
