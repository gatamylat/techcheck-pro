# 🎨 Руководство по стилям TechCheck Pro

## 📁 Структура CSS файлов

```
base.css       → Переменные, сброс, типография, базовые элементы
layout.css     → Структура приложения, сетки, контейнеры
components.css → Готовые UI компоненты (карточки, формы, кнопки)
responsive.css → Все медиа-запросы и адаптивность
effects.css    → Анимации, переходы, визуальные эффекты
```

## 🎯 Принципы работы со стилями

### 1. Сначала ищи готовое
Перед созданием нового класса проверь существующие компоненты ниже.

### 2. Используй утилиты
Для простых задач используй готовые утилиты вместо создания новых классов.

### 3. Расширяй, не дублируй
Если нужна модификация - добавь модификатор к существующему классу.

## 🧩 Готовые компоненты

### Кнопки
```html
<!-- Основные варианты -->
<button class="btn btn-primary">Главная кнопка</button>
<button class="btn btn-secondary">Вторичная</button>
<button class="btn btn-success">Успех</button>
<button class="btn btn-icon">🔍</button>

<!-- С иконкой -->
<button class="btn btn-primary">
    <span>🚀</span> Начать
</button>
```

### Карточки
```html
<!-- Базовая карточка -->
<div class="card">
    <h3>Заголовок</h3>
    <p>Содержимое</p>
</div>

<!-- Карточка модуля (главная страница) -->
<div class="module-card">
    <span class="module-status status-ready">Готово</span>
    <div class="module-header">
        <div class="module-icon">📚</div>
        <div class="module-info">
            <h3>Название</h3>
            <p>Описание</p>
        </div>
    </div>
</div>

<!-- Карточка документа -->
<div class="document-card">
    <div class="doc-number">01</div>
    <div class="doc-content">
        <h3>Название</h3>
        <p>Описание</p>
    </div>
    <div class="doc-arrow">→</div>
</div>

<!-- Карточка категории -->
<div class="category-card" style="border-left-color: #3b82f6;">
    <div class="category-icon" style="background: #3b82f620;">
        📚
    </div>
    <h3>Название</h3>
    <span class="category-count">5 статей</span>
</div>

<!-- Карточка статьи -->
<div class="article-card">
    <div class="article-header">
        <span class="article-category">Категория</span>
    </div>
    <h4>Заголовок</h4>
    <div class="article-tags">
        <span class="tag">#тег1</span>
        <span class="tag">#тег2</span>
    </div>
</div>

<!-- Карточка чек-листа -->
<div class="checklist-card">
    <div class="checklist-icon">✓</div>
    <h3>Название</h3>
    <p>Описание</p>
    <div class="progress-bar">
        <div class="progress-fill" style="width: 60%"></div>
    </div>
    <span class="progress-text">60% выполнено</span>
</div>
```

### Сетки
```html
<!-- Автоматические сетки -->
<div class="grid grid-auto">...</div>      <!-- min 250px колонки -->
<div class="grid grid-auto-lg">...</div>   <!-- min 300px колонки -->

<!-- Фиксированные сетки -->
<div class="grid grid-2">...</div>         <!-- 2 колонки -->
<div class="grid grid-3">...</div>         <!-- 3 колонки -->
<div class="grid grid-4">...</div>         <!-- 4 колонки -->

<!-- Специальные сетки для модулей -->
<div class="main-grid">...</div>           <!-- Главная страница -->
<div name="categories-grid">...</div>      <!-- Категории -->
<div class="articles-grid">...</div>       <!-- Статьи -->
<div class="checklists-grid">...</div>     <!-- Чек-листы -->
<div class="documents-grid">...</div>      <!-- Документы -->
```

### Формы
```html
<!-- Поиск -->
<div class="search-container">
    <input type="text" class="search-input" placeholder="Поиск...">
    <button class="search-btn">🔍</button>
</div>

<!-- Обычные поля -->
<label>Название</label>
<input type="text" class="form-input">

<label>Описание</label>
<textarea class="form-textarea"></textarea>
```

### Элементы чек-листа
```html
<!-- Пункт проверки -->
<label class="check-item">
    <input type="checkbox">
    <span class="check-text">Текст проверки</span>
    <span class="critical-badge">Критично</span>
</label>

<!-- Прогресс-бар -->
<div class="progress-bar">
    <div class="progress-fill" style="width: 75%"></div>
</div>
<span class="progress-text">75% выполнено</span>
```

### Навигация
```html
<!-- Хлебные крошки -->
<div class="breadcrumbs">
    <span>Главная</span>
    <span>→</span>
    <span>База знаний</span>
    <span>→</span>
    <span>Статья</span>
</div>

<!-- Табы -->
<div class="tabs-container">
    <div class="tabs-header">
        <button class="tab active">Вкладка 1</button>
        <button class="tab">Вкладка 2</button>
        <button class="tab">Вкладка 3</button>
    </div>
    <div class="tabs-content">
        <!-- Содержимое -->
    </div>
</div>
```

### Статусы и бейджи
```html
<!-- Статусы модулей -->
<span class="module-status status-ready">Готово</span>
<span class="module-status status-beta">Beta</span>
<span class="module-status status-soon">Скоро</span>

<!-- Бейджи -->
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-error">Error</span>

<!-- Теги -->
<span class="tag">#тег</span>
```

## 🛠 Утилиты

### Текст
```html
<!-- Выравнивание -->
<p class="text-center">По центру</p>
<p class="text-left">Слева</p>
<p class="text-right">Справа</p>

<!-- Цвета -->
<p class="text-primary">Основной текст</p>
<p class="text-secondary">Вторичный текст</p>
<p class="text-light">Светлый текст</p>

<!-- Градиентный текст -->
<h1 class="gradient-text">Красивый заголовок</h1>
```

### Отступы
```html
<!-- Margin (внешние отступы) -->
<div class="m-0">Без отступов</div>
<div class="m-1">0.5rem</div>
<div class="m-2">1rem</div>
<div class="m-3">1.5rem</div>
<div class="m-4">2rem</div>

<!-- Margin по направлениям -->
<div class="mt-2">Сверху 1rem</div>
<div class="mb-2">Снизу 1rem</div>

<!-- Padding (внутренние отступы) -->
<div class="p-0">Без отступов</div>
<div class="p-1">0.5rem</div>
<div class="p-2">1rem</div>
<div class="p-3">1.5rem</div>
<div class="p-4">2rem</div>
```

### Flex утилиты
```html
<!-- Центрирование -->
<div class="flex-center">Центрировано</div>

<!-- Пространство между -->
<div class="flex-between">
    <span>Слева</span>
    <span>Справа</span>
</div>

<!-- Колонка -->
<div class="flex-column">
    <div>Элемент 1</div>
    <div>Элемент 2</div>
</div>

<!-- Отступы между элементами -->
<div class="flex gap-1">...</div>  <!-- 0.5rem -->
<div class="flex gap-2">...</div>  <!-- 1rem -->
<div class="flex gap-3">...</div>  <!-- 1.5rem -->
<div class="flex gap-4">...</div>  <!-- 2rem -->
```

### Отображение
```html
<div class="hidden">Скрыто</div>
<div class="block">Блок</div>
<div class="inline-block">Инлайн-блок</div>
<div class="flex">Флекс</div>
<div class="grid">Грид</div>

<!-- Мобильные утилиты -->
<div class="hide-mobile">Скрыто на мобильных</div>
<div class="show-mobile">Видно только на мобильных</div>
```

## 🎨 CSS переменные

### Цвета
```css
var(--primary-color)     /* #0056D2 - основной синий */
var(--primary-hover)      /* #003d96 - синий при наведении */
var(--primary-light)      /* #e6f2ff - светло-синий фон */

var(--accent-teal)        /* #00BFA5 - бирюзовый акцент */
var(--success-color)      /* #00C853 - зеленый успех */
var(--warning-color)      /* #FF9800 - оранжевый предупреждение */
var(--error-color)        /* #F44336 - красный ошибка */
var(--info-color)         /* #2196F3 - голубой информация */
```

### Фоны
```css
var(--bg-primary)         /* #ffffff - основной фон */
var(--bg-secondary)       /* #f8f9fa - вторичный фон */
var(--bg-tertiary)        /* #f0f2f5 - третичный фон */
```

### Текст
```css
var(--text-primary)       /* #1a1a1a - основной текст */
var(--text-secondary)     /* #5c6370 - вторичный текст */
var(--text-light)         /* #8c92a0 - светлый текст */
```

### Размеры
```css
var(--radius)             /* 12px - стандартный радиус */
var(--radius-sm)          /* 8px - маленький */
var(--radius-lg)          /* 16px - большой */
var(--radius-xl)          /* 24px - очень большой */
var(--radius-full)        /* 9999px - круглый */
```

### Тени
```css
var(--shadow-sm)          /* Маленькая тень */
var(--shadow-md)          /* Средняя тень */
var(--shadow-lg)          /* Большая тень */
var(--shadow-xl)          /* Очень большая тень */
```

## 📱 Адаптивность

### Брейкпоинты
```css
/* Мобильные: max 767px */
/* Планшеты: 768px - 1024px */
/* Десктоп: 1024px+ */
/* Большие экраны: 1440px+ */
```

### Адаптивные сетки
На мобильных все сетки автоматически становятся одноколоночными.

## ✨ Эффекты

### Готовые анимации
```html
<!-- Добавьте класс для анимации -->
<div class="fadeInUp">Появление снизу</div>
<div class="slideInLeft">Появление слева</div>
<div class="slideInRight">Появление справа</div>
<div class="scaleIn">Масштабирование</div>
<div class="pulse">Пульсация</div>
```

### Эффекты при наведении
Большинство интерактивных элементов уже имеют эффекты:
- Карточки поднимаются вверх
- Кнопки масштабируются
- Ссылки меняют цвет

## 🚀 Пример создания новой страницы

```javascript
// В вашем модуле
renderContent() {
    return `
        <div class="container">
            <!-- Заголовок страницы -->
            <div class="page-header">
                <h1>Заголовок страницы</h1>
                <p class="text-secondary">Описание страницы</p>
            </div>
            
            <!-- Действия -->
            <div class="page-actions">
                <button class="btn btn-primary">Главное действие</button>
                <button class="btn btn-secondary">Второе действие</button>
            </div>
            
            <!-- Контент в сетке -->
            <div class="grid grid-auto-lg">
                <div class="card">
                    <h3>Карточка 1</h3>
                    <p>Содержимое</p>
                </div>
                <div class="card">
                    <h3>Карточка 2</h3>
                    <p>Содержимое</p>
                </div>
            </div>
        </div>
    `;
}
```

## ❓ Когда создавать новые стили?

### Создавайте новый класс только если:
1. Не нашли подходящий готовый компонент
2. Нужна уникальная функциональность
3. Компонент будет переиспользоваться

### Где добавлять новые стили:
- **base.css** → Новые переменные или базовые элементы
- **components.css** → Новые переиспользуемые компоненты
- **layout.css** → Структурные изменения
- **responsive.css** → Адаптивные правила
- **effects.css** → Новые анимации

### Именование классов:
```css
.module-name {}        /* Основной класс модуля */
.module-name-element {} /* Элемент модуля */
.module-name--modifier {} /* Модификатор */
```

## 📝 Чек-лист при создании интерфейса

- [ ] Проверил готовые компоненты в этом руководстве
- [ ] Использовал CSS переменные для цветов и размеров
- [ ] Добавил классы утилит где возможно
- [ ] Проверил адаптивность на мобильных
- [ ] Не дублировал существующие стили
- [ ] Документировал новые компоненты если создал

## 🔄 Обновление руководства

При добавлении нового переиспользуемого компонента:
1. Добавьте его в соответствующий CSS файл
2. Добавьте пример использования в это руководство
3. Укажите в каком модуле используется

---

*Последнее обновление: Сентябрь 2025*
