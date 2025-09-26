# ⚠️ ОБЯЗАТЕЛЬНЫЙ РЕГЛАМЕНТ CSS для TechCheck Pro

## 📁 Структура CSS (5 файлов, ВСЕ УЖЕ СОЗДАНЫ)
```
base.css       → Переменные, типография, базовые элементы  
layout.css     → Структура, сетки, контейнеры
components.css → UI компоненты (карточки, кнопки)
responsive.css → Медиа-запросы (НЕ пиши @media в других файлах!)
effects.css    → Анимации и визуальные эффекты
```

## 🚫 ЗАПРЕЩЕНО
- ❌ Создавать новые CSS файлы
- ❌ Писать `style="..."` в HTML
- ❌ Дублировать существующие классы
- ❌ Писать @media запросы вне responsive.css
- ❌ Использовать цвета напрямую (#0056D2), только через переменные
- ❌ Создавать классы типа `.my-module-card` если есть `.card`

## ✅ ОБЯЗАТЕЛЬНО при создании интерфейса

### Шаг 1: Проверь готовые компоненты
```html
<!-- КНОПКИ -->
<button class="btn btn-primary">Главная</button>
<button class="btn btn-secondary">Вторичная</button>
<button class="btn btn-success">Успех</button>

<!-- КАРТОЧКИ -->
<div class="card">Базовая карточка</div>
<div class="module-card">Карточка модуля</div>
<div class="document-card">Карточка документа</div>
<div class="checklist-card">Карточка чек-листа</div>
<div class="article-card">Карточка статьи</div>
<div class="category-card">Карточка категории</div>
<div class="stat-card">Карточка статистики</div>
<div class="story-card">Карточка истории</div>

<!-- СЕТКИ -->
<div class="grid grid-2">2 колонки</div>
<div class="grid grid-3">3 колонки</div>
<div class="grid grid-4">4 колонки</div>
<div class="grid grid-auto">Авто колонки</div>
<div class="main-grid">Сетка главной</div>
<div class="documents-grid">Сетка документов</div>

<!-- ФОРМЫ -->
<input class="search-input" placeholder="Поиск">
<button class="search-btn">🔍</button>

<!-- СТРУКТУРА СТРАНИЦЫ -->
<div class="page-header">
    <h1>Заголовок</h1>
    <p>Описание</p>
</div>
<div class="page-actions">
    <button class="btn btn-primary">Действие</button>
</div>
<div class="breadcrumbs">
    <span>Главная</span>
    <span>→</span>
    <span>Раздел</span>
</div>
```

### Шаг 2: Используй утилиты для настройки
```html
<!-- ТЕКСТ -->
class="text-center"      /* выравнивание по центру */
class="text-secondary"   /* серый текст */
class="gradient-text"    /* градиентный текст */

<!-- ОТСТУПЫ -->
class="m-0" до "m-4"     /* margin: 0 до 2rem */
class="mt-2"             /* margin-top: 1rem */
class="mb-2"             /* margin-bottom: 1rem */
class="p-0" до "p-4"     /* padding: 0 до 2rem */

<!-- FLEX -->
class="flex"             /* display: flex */
class="flex-center"      /* центрирование */
class="flex-between"     /* space-between */
class="gap-1" до "gap-4" /* gap: 0.5rem до 2rem */

<!-- ОТОБРАЖЕНИЕ -->
class="hidden"           /* скрыть */
class="hide-mobile"      /* скрыть на мобильных */
```

### Шаг 3: Только если НЕТ готового - создавай новый класс

**Где добавлять:**
- Новый UI компонент → `components.css`
- Структура страницы → `layout.css`
- Анимация → `effects.css`
- Адаптивность → `responsive.css`

**Как называть:**
```css
.module-container {}     /* контейнер модуля */
.module-element {}       /* элемент внутри */
.module--modifier {}     /* модификатор */
```

## 📝 ШАБЛОН для нового модуля

```javascript
renderContent() {
    return `
        <!-- Используй готовые классы! -->
        <div class="page-header">
            <h1>${this.meta.icon} ${this.meta.title}</h1>
            <p class="text-secondary">${this.meta.description}</p>
        </div>
        
        <div class="page-actions mb-3">
            <button class="btn btn-primary">Главное действие</button>
        </div>
        
        <div class="grid grid-auto">
            <div class="card">
                <h3>Заголовок</h3>
                <p>Содержимое</p>
            </div>
        </div>
    `;
}
```

## 🎨 CSS ПЕРЕМЕННЫЕ (используй ТОЛЬКО их для цветов)

```css
/* ЦВЕТА */
var(--primary-color)     /* #0056D2 синий */
var(--success-color)     /* #00C853 зеленый */
var(--warning-color)     /* #FF9800 оранжевый */
var(--error-color)       /* #F44336 красный */

/* ФОНЫ */
var(--bg-primary)        /* белый */
var(--bg-secondary)      /* светло-серый */
var(--bg-tertiary)       /* серый */

/* ТЕКСТ */
var(--text-primary)      /* черный */
var(--text-secondary)    /* серый */

/* РАЗМЕРЫ */
var(--radius)            /* 12px */
var(--shadow-md)         /* тень */
```

## ⚡ БЫСТРАЯ ПРОВЕРКА

Перед отправкой кода проверь:
- [ ] Использовал готовые классы из списка выше?
- [ ] НЕ писал style="..." в HTML?
- [ ] НЕ дублировал существующие стили?
- [ ] Использовал CSS переменные для цветов?
- [ ] НЕ создавал новые CSS файлы?

## 🔴 КРИТИЧЕСКИ ВАЖНО

**При ответе ВСЕГДА указывай:**
```
Использованные готовые классы:
- card (из components.css)
- btn-primary (из base.css)
- grid-auto (из layout.css)

Новые классы (если создал):
- .new-component в components.css (строка 450)
```

---
**ЭТОТ РЕГЛАМЕНТ ОБЯЗАТЕЛЕН. Нарушение = переделка работы**
