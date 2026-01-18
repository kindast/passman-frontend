# PassMan Frontend

Web‑клиент для менеджера паролей **PassMan**.

Фронтенд предоставляет удобный интерфейс для регистрации, авторизации и управления сохранёнными учётными данными, работая поверх REST API бекенда [PassMan](https://github.com/kindast/PassMan.Backend).

## Стек

- React + TypeScript (Vite)
- Tailwind CSS для стилизации
- Axios для HTTP‑запросов к API
- Zustand для управления состоянием аутентификации
- Docker + Nginx для продакшн‑сборки и проксирования запросов к API

## Возможности

- Регистрация и вход по email/паролю
- Авторизация через access‑токен в памяти и refresh‑токен в HttpOnly cookie
- Список сохранённых записей (логин/пароль)
- Создание, редактирование и удаление записей
- Поиск, сортировка по хранилищу и копирование паролей в буфер обмена

## Локальный запуск (без Docker)

### Предварительные требования

- Node.js 20+
- npm или pnpm
- Запущенный PassMan.Backend (см. соответствующий [репозиторий](https://github.com/kindast/PassMan.Backend))

### Шаги

1. Клонировать репозиторий:

```bash
git clone https://github.com/kindast/passman-frontend.git
cd passman-frontend
```

Установить зависимости:

```bash
npm install
```

или

```bash
pnpm install
```

Настроить переменную окружения API:

Создать .env или .env.local:
`VITE_API_URL=http://localhost:8080/api`

Запустить dev‑сервер:

```bash
npm run dev
```

Открыть приложение в браузере (обычно http://localhost:5173)

Запуск через Docker

Проект содержит Dockerfile и docker-compose.yaml для сборки и запуска фронтенда за Nginx, API и базы данных.

Быстрый старт

```bash
git clone https://github.com/kindast/passman-frontend.git
cd passman-frontend
```

### Запуск

```bash
docker compose up -d
```

По умолчанию:
фронтенд доступен на http://localhost
API проксируется по пути /api (ожидается запущенный PassMan.Backend)
При необходимости можно изменить URL API через аргумент сборки/переменную VITE_API_URL в docker-compose.yaml.

Структура проекта

`src/` — основной код приложения
`components/` — UI‑компоненты
`screens/` — страницы (логин, дашборд и т.д.)
`services/` — работа с API (axios‑клиент, passwordService, authService)
`store/` — Zustand‑сторы (authStore)
`public/` — статические ресурсы (иконки, index.html)

Переменные окружения
Основные переменные:
VITE_API_URL — базовый URL API (например, http://localhost:8080/api)
