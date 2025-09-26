# TechCheck Pro 🚀

<div align="center">
  
  ![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
  ![Status](https://img.shields.io/badge/status-beta-yellow.svg)
  ![License](https://img.shields.io/badge/license-MIT-green.svg)
  
  **Система проверки технической документации**
  
  [Демо](https://yourusername.github.io/techcheck-pro/) | [Документация](./project-docs/) | [Скачать](https://github.com/yourusername/techcheck-pro/archive/main.zip)

</div>

---

## 📋 О проекте

TechCheck Pro - это веб-приложение для проверки технической документации по стандартам ГОСТ и внутренним регламентам компании Массивбург. Система работает полностью в браузере, не требует установки и серверной части.

### ✨ Возможности

- 📚 **База знаний** - Все ГОСТы и стандарты в одном месте
- ✅ **Интерактивные чек-листы** - Пошаговая проверка документов
- 💾 **Офлайн режим** - Работает без интернета (PWA)
- 📱 **Адаптивный дизайн** - Удобно на любом устройстве
- 🔍 **Умный поиск** - Быстрый доступ к нужной информации
- 📊 **Статистика** - Аналитика типовых ошибок

## 🚀 Быстрый старт

### Онлайн версия
Просто откройте: https://yourusername.github.io/techcheck-pro/

### Локальная установка
```bash
# Клонировать репозиторий
git clone https://github.com/yourusername/techcheck-pro.git

# Перейти в папку
cd techcheck-pro

# Открыть в браузере
open index.html
# или запустить локальный сервер
python -m http.server 8000
# затем открыть http://localhost:8000
```

## 📦 Модули системы

| Модуль | Статус | Описание |
|--------|--------|----------|
| 📚 База знаний | ✅ Ready | ГОСТ стандарты, нормы проектирования |
| ✓ Чек-листы | ✅ Ready | Интерактивная проверка документации |
| 📋 Документы | ✅ Ready | Состав документации КБ |
| 📖 Wiki | 🔶 Beta | База знаний команды |
| 💬 Stories | 🔶 Beta | Кейсы и обсуждения |
| 📊 Статистика | ⏳ Soon | Аналитика проверок |
| 🤖 AI Проверка | ⏳ Soon | Автоматическая проверка с LLM |

## 🛠 Технологии

- **Frontend:** Vanilla JavaScript (ES6 модули)
- **Стили:** Pure CSS3 (без фреймворков)
- **Хранение:** LocalStorage
- **PWA:** Service Worker для офлайн режима
- **Хостинг:** GitHub Pages

## 📁 Структура проекта

```
techcheck-pro/
├── index.html          # Точка входа
├── manifest.json       # PWA манифест
├── sw.js              # Service Worker
│
├── CSS/               # Стили (5 файлов)
│   ├── base.css      # Переменные и базовые стили
│   ├── layout.css    # Структура приложения
│   ├── components.css # UI компоненты
│   ├── responsive.css # Адаптивность
│   └── effects.css   # Анимации
│
├── Модули/
│   ├── _app.js       # Ядро системы
│   ├── BaseModule.js # Базовый класс
│   └── *.js         # Функциональные модули
│
└── project-docs/     # Документация
```

## 💻 Разработка

### Debug режим
Добавьте `?debug=true` к URL для включения отладочной панели:
```
http://localhost:8000/?debug=true
```

### Добавление нового модуля

1. Создайте файл `new-module.js`
2. Наследуйте от `BaseModule`
3. Зарегистрируйте в `_app.js`
4. Модуль автоматически появится в навигации

Подробнее в [документации](./project-docs/module-map.md)

### Работа со стилями

⚠️ **Важно:** Не создавайте новые CSS файлы!

Используйте существующие классы из [STYLES-GUIDE.md](./project-docs/STYLES-GUIDE.md)

## 📝 Документация

- [Архитектура проекта](./project-docs/techcheck-architecture-v3.md)
- [Карта модулей](./project-docs/module-map.md)
- [Регламент CSS](./project-docs/CSS-РЕГЛАМЕНТ.md)
- [Гайд по стилям](./project-docs/STYLES-GUIDE.md)

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте ветку (`git checkout -b feature/amazing`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в ветку (`git push origin feature/amazing`)
5. Откройте Pull Request

## 📄 Лицензия

MIT License - используйте как хотите

## 👥 Команда

- **Разработка:** TechCheck Team
- **Дизайн:** Массивбург
- **Тестирование:** QA отдел

## 📞 Контакты

- **Email:** techcheck@massivburg.ru
- **Telegram:** @techcheck_support
- **Issues:** [GitHub Issues](https://github.com/yourusername/techcheck-pro/issues)

---

<div align="center">
  Сделано с ❤️
  <br>
  2025
</div>
