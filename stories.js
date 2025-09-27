/**
 * @module Stories
 * @description Stories карусель - РАДИКАЛЬНОЕ РЕШЕНИЕ
 * @version 4.0.0 - INLINE STYLES FIX
 */

import BaseModule from './BaseModule.js';

export default class Stories extends BaseModule {
    constructor(app) {
        super(app);
        this.name = 'stories';
        this.version = '4.0.0';
        this.dependencies = ['_state', '_router'];
        
        this.meta = {
            title: 'Stories',
            icon: '💬',
            description: 'Главная страница со Stories',
            navLabel: 'Stories',
            status: 'ready'
        };
        
        // Состояние карусели
        this.currentSlide = 0;
        this.totalSlides = 5;
        
        // Состояние панели
        this.isExpanded = false;
        this.isDragging = false;
        this.startY = 0;
        this.currentTop = 380;
        
        // DOM элементы
        this.elements = {};
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
        this.data = {
            slides: [
                {
                    id: 1,
                    title: 'TechCheck Pro',
                    subtitle: 'Система проверки документации',
                    background: 'linear-gradient(135deg, #FF006E 0%, #8338EC 20%, #3A86FF 40%, #06FFB4 60%, #FFBE0B 80%, #FB5607 100%)'
                },
                {
                    id: 2,
                    title: 'Новости',
                    subtitle: 'Обновления системы',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                },
                {
                    id: 3,
                    title: 'Совет дня',
                    subtitle: 'Полезные лайфхаки',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                },
                {
                    id: 4,
                    title: '127',
                    subtitle: 'Проверок за неделю',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                },
                {
                    id: 5,
                    title: 'Команда',
                    subtitle: 'Лучшие проверяющие',
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                }
            ]
        };
        
        this.totalSlides = this.data.slides.length;
    }
    
    initHomePage() {
        this.initDOMElements();
        
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Показываем мобильную версию
            if (this.elements.desktopHomeContainer) {
                this.elements.desktopHomeContainer.classList.add('hidden');
            }
            if (this.elements.homeContainer) {
                this.elements.homeContainer.classList.remove('hidden');
            }
            
            // Рендерим компоненты
            this.renderStoriesSlides();
            this.renderIndicators();
            this.renderHomeModules();
            
            // Инициализируем события с задержкой
            setTimeout(() => {
                this.initCarouselEvents();
                this.initPanelDragging();
                this.initSearchButton();
                
                // Устанавливаем первый слайд
                this.goToSlide(0);
            }, 100);
            
            this.log('Mobile home initialized', 'success');
        } else {
            // Показываем десктопную версию
            if (this.elements.homeContainer) {
                this.elements.homeContainer.classList.add('hidden');
            }
            if (this.elements.desktopHomeContainer) {
                this.elements.desktopHomeContainer.classList.remove('hidden');
            }
            
            this.renderDesktopHome();
            this.log('Desktop home initialized', 'success');
        }
    }
    
    renderStoriesSlides() {
        if (!this.elements.storiesCarousel) return;
        
        // РАДИКАЛЬНОЕ РЕШЕНИЕ: inline стили для каждого слайда
        const slidesHTML = this.data.slides.map((slide, index) => `
            <div class="story-slide" 
                 data-slide="${index}"
                 style="
                    min-width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    position: relative;
                    padding: 20px;
                    cursor: pointer;
                    background: ${slide.background};
                    background-size: 400% 400%;
                 "
                 onclick="app.getModule('stories').openStory(${index})">
                <h1 class="story-title" style="
                    font-size: 3.5rem;
                    font-weight: 900;
                    letter-spacing: -0.02em;
                    margin-bottom: 0.5rem;
                    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                    text-align: center;
                    color: white;
                ">${slide.title}</h1>
                <p class="story-subtitle" style="
                    font-size: 1.125rem;
                    opacity: 0.95;
                    font-weight: 300;
                    text-align: center;
                    color: white;
                ">${slide.subtitle}</p>
            </div>
        `).join('');
        
        this.elements.storiesCarousel.innerHTML = slidesHTML;
        this.elements.storiesCarousel.style.cssText = `
            display: flex;
            height: 100%;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateX(0);
        `;
        
        this.log(`Rendered ${this.totalSlides} slides with inline styles`, 'success');
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
            { id: 'wiki', icon: '📖', title: 'Wiki', desc: 'База команды' }
        ];
        
        this.elements.homeModules.innerHTML = `
            <div class="home-modules">
                <div class="grid grid-2">
                    ${modules.map(module => `
                        <div class="module-card" onclick="window.location.hash = '/${module.id}'">
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
            
            <section class="future-section">
                <h2>Скоро</h2>
                <div class="future-modules">
                    <div class="future-card">
                        <span class="future-badge">Q2 2025</span>
                        <div class="future-icon">📊</div>
                        <div class="future-title">Статистика</div>
                        <div class="future-desc">Аналитика проверок</div>
                    </div>
                    <div class="future-card">
                        <span class="future-badge">Q3 2025</span>
                        <div class="future-icon">🤖</div>
                        <div class="future-title">AI Проверка</div>
                        <div class="future-desc">Автоматический анализ</div>
                    </div>
                </div>
            </section>
        `;
    }
    
    renderDesktopHome() {
        if (!this.elements.desktopHomeContainer) return;
        
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
    
    initCarouselEvents() {
        if (!this.elements.storiesHero) return;
        
        let startX = 0;
        let startY = 0;
        
        // Touch события
        this.elements.storiesHero.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        this.elements.storiesHero.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = Math.abs(startY - endY);
            
            // Только горизонтальные свайпы
            if (Math.abs(diffX) > diffY && Math.abs(diffX) > 30) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }, { passive: true });
        
        this.log('Carousel events initialized', 'info');
    }
    
    goToSlide(index) {
        // Проверка границ
        if (index < 0) index = this.totalSlides - 1;
        if (index >= this.totalSlides) index = 0;
        
        this.currentSlide = index;
        
        // Проверяем элементы
        if (!this.elements.storiesCarousel) {
            this.elements.storiesCarousel = document.getElementById('storiesCarousel');
            if (!this.elements.storiesCarousel) {
                this.log('Carousel not found!', 'error');
                return;
            }
        }
        
        // Применяем трансформацию
        const translateX = -index * 100;
        this.elements.storiesCarousel.style.transform = `translateX(${translateX}%)`;
        
        // Обновляем индикаторы
        const indicators = document.querySelectorAll('.carousel-indicator');
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === index);
        });
        
        this.log(`Slide ${index + 1}/${this.totalSlides}`, 'info');
        
        // Проверяем что слайд видимый
        const currentSlide = this.elements.storiesCarousel.querySelector(`[data-slide="${index}"]`);
        if (currentSlide) {
            const bg = currentSlide.style.background;
            this.log(`Current slide background: ${bg.substring(0, 50)}...`, 'info');
        }
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
        
        let startY = 0;
        let startTop = 380;
        
        panel.addEventListener('touchstart', (e) => {
            if (e.target.closest('.module-card, button')) return;
            
            this.isDragging = true;
            startY = e.touches[0].clientY;
            startTop = this.currentTop;
            panel.classList.add('is-dragging');
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            
            e.preventDefault();
            const deltaY = e.touches[0].clientY - startY;
            let newTop = startTop + deltaY;
            
            newTop = Math.max(40, Math.min(380, newTop));
            panel.style.top = newTop + 'px';
            this.currentTop = newTop;
        }, { passive: false });
        
        document.addEventListener('touchend', () => {
            if (!this.isDragging) return;
            
            this.isDragging = false;
            panel.classList.remove('is-dragging');
            
            if (this.currentTop < 230) {
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
    
    openStory(index) {
        const slide = this.data.slides[index];
        this.log(`Opening story: ${slide.title}`);
        alert(`Story: ${slide.title}\n${slide.subtitle}`);
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
