/**
 * @module Stories
 * @description ПРОСТЕЙШАЯ версия Stories - только база
 * @version 5.0.0 - SIMPLE
 */

import BaseModule from './BaseModule.js';

export default class Stories extends BaseModule {
    constructor(app) {
        super(app);
        this.name = 'stories';
        this.version = '5.0.0-simple';
        this.dependencies = ['_state', '_router'];
        
        this.meta = {
            title: 'Stories',
            icon: '💬',
            description: 'Главная страница',
            navLabel: 'Stories',
            status: 'ready'
        };
        
        // Простое состояние
        this.currentSlide = 0;
        this.totalSlides = 5;
    }
    
    async init() {
        await super.init();
    }
    
    async loadData() {
        // Простые данные - только цвета и текст
        this.data = {
            slides: [
                { text: 'Слайд 1', color: '#FF006E' },
                { text: 'Слайд 2', color: '#667eea' },
                { text: 'Слайд 3', color: '#f093fb' },
                { text: 'Слайд 4', color: '#4facfe' },
                { text: 'Слайд 5', color: '#43e97b' }
            ]
        };
    }
    
    initHomePage() {
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Показываем мобильную версию
            this.showMobileHome();
        } else {
            // Показываем десктоп версию
            this.showDesktopHome();
        }
    }
    
    showMobileHome() {
        // Скрываем всё лишнее
        document.getElementById('main-header').classList.add('hidden');
        document.getElementById('content').classList.add('hidden');
        document.getElementById('main-footer').classList.add('hidden');
        document.getElementById('desktop-home-container').classList.add('hidden');
        
        // Показываем мобильный контейнер
        const homeContainer = document.getElementById('home-container');
        homeContainer.classList.remove('hidden');
        
        // ПРОСТЕЙШИЕ СЛАЙДЫ - ПРОСТО ЦВЕТНЫЕ БЛОКИ С ТЕКСТОМ
        const storiesCarousel = document.getElementById('storiesCarousel');
        if (storiesCarousel) {
            // ВАЖНО: Устанавливаем высоту родителя
            const storiesHero = document.getElementById('storiesHero');
            if (storiesHero) {
                storiesHero.style.cssText = 'height: 420px; overflow: hidden; position: relative;';
            }
            
            // Создаем HTML строкой (более надежно)
            let slidesHTML = '';
            this.data.slides.forEach((slide, index) => {
                slidesHTML += `
                    <div style="
                        min-width: 100%;
                        height: 420px;
                        background-color: ${slide.color};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 3rem;
                        font-weight: bold;
                        flex-shrink: 0;
                        position: relative;
                    ">${slide.text}</div>
                `;
            });
            
            // Вставляем все слайды разом
            storiesCarousel.innerHTML = slidesHTML;
            
            // Стиль для карусели
            storiesCarousel.style.cssText = `
                display: flex;
                height: 420px;
                transition: transform 0.3s ease;
                transform: translateX(0);
                position: relative;
            `;
            
            // Проверяем что слайды создались
            const createdSlides = storiesCarousel.children;
            console.log(`✅ Created ${createdSlides.length} slides`);
            for(let i = 0; i < createdSlides.length; i++) {
                console.log(`Slide ${i + 1}: bg=${createdSlides[i].style.backgroundColor}`);
            }
        }
        
        // ПРОСТЕЙШИЕ индикаторы
        const indicators = document.getElementById('carouselIndicators');
        if (indicators) {
            indicators.innerHTML = '';
            
            this.data.slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.style.cssText = `
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: white;
                    opacity: ${index === 0 ? '1' : '0.5'};
                    border: none;
                    margin: 0 4px;
                    cursor: pointer;
                `;
                dot.onclick = () => this.goToSlide(index);
                indicators.appendChild(dot);
            });
        }
        
        // ПРОСТЕЙШАЯ панель с модулями
        const homeModules = document.getElementById('homeModules');
        if (homeModules) {
            homeModules.innerHTML = `
                <div style="padding: 20px;">
                    <h2>Модули</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <button onclick="window.location.hash='/knowledge-base'" style="padding: 20px; background: white; border: 1px solid #ccc; border-radius: 8px;">
                            📚 База знаний
                        </button>
                        <button onclick="window.location.hash='/checklist'" style="padding: 20px; background: white; border: 1px solid #ccc; border-radius: 8px;">
                            ✓ Чек-листы
                        </button>
                        <button onclick="window.location.hash='/documents'" style="padding: 20px; background: white; border: 1px solid #ccc; border-radius: 8px;">
                            📋 Документы
                        </button>
                        <button onclick="window.location.hash='/wiki'" style="padding: 20px; background: white; border: 1px solid #ccc; border-radius: 8px;">
                            📖 Wiki
                        </button>
                    </div>
                </div>
            `;
        }
        
        // ПРОСТЕЙШИЕ события свайпа
        this.initSimpleSwipe();
        
        console.log('✅ Mobile home initialized (SIMPLE VERSION)');
    }
    
    showDesktopHome() {
        // Скрываем мобильную версию
        document.getElementById('home-container').classList.add('hidden');
        
        // Показываем десктоп
        const desktopContainer = document.getElementById('desktop-home-container');
        desktopContainer.classList.remove('hidden');
        
        // ПРОСТЕЙШАЯ десктоп версия
        desktopContainer.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <h1>TechCheck Pro (Desktop)</h1>
                <p>Система проверки документации</p>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px;">
                    <div onclick="window.location.hash='/documents'" style="padding: 30px; background: #f0f0f0; border-radius: 8px; cursor: pointer;">
                        <h2>📋 Документы</h2>
                    </div>
                    <div onclick="window.location.hash='/knowledge-base'" style="padding: 30px; background: #f0f0f0; border-radius: 8px; cursor: pointer;">
                        <h2>📚 База знаний</h2>
                    </div>
                    <div onclick="window.location.hash='/checklist'" style="padding: 30px; background: #f0f0f0; border-radius: 8px; cursor: pointer;">
                        <h2>✓ Чек-листы</h2>
                    </div>
                </div>
            </div>
        `;
        
        console.log('✅ Desktop home initialized (SIMPLE VERSION)');
    }
    
    initSimpleSwipe() {
        const hero = document.getElementById('storiesHero');
        if (!hero) return;
        
        let startX = 0;
        
        hero.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        hero.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
        
        console.log('✅ Swipe events initialized');
    }
    
    goToSlide(index) {
        // Проверка границ
        if (index < 0) index = this.totalSlides - 1;
        if (index >= this.totalSlides) index = 0;
        
        this.currentSlide = index;
        
        // Простое перемещение
        const carousel = document.getElementById('storiesCarousel');
        if (carousel) {
            const translateX = -index * 100;
            carousel.style.transform = `translateX(${translateX}%)`;
            console.log(`📍 Moved to slide ${index + 1}`);
        }
        
        // Обновляем точки
        const dots = document.querySelectorAll('#carouselIndicators button');
        dots.forEach((dot, i) => {
            dot.style.opacity = i === index ? '1' : '0.5';
        });
    }
    
    nextSlide() {
        console.log('➡️ Next slide');
        this.goToSlide(this.currentSlide + 1);
    }
    
    prevSlide() {
        console.log('⬅️ Previous slide');
        this.goToSlide(this.currentSlide - 1);
    }
    
    getPublicMethods() {
        return {
            goToSlide: (index) => this.goToSlide(index),
            nextSlide: () => this.nextSlide(),
            prevSlide: () => this.prevSlide(),
            initHomePage: () => this.initHomePage()
        };
    }
}
