# Local run

> without prometheus

1. Create .env
2. Local environment `npm run env`
3. Run migration `npm run migrate up`
4. Api `npm run api:start`
5. Notification consumer `npm run notification:start`

> **SQS_CUSTOM_ENDPOINT** is optional for this method

> **SQS_NOTIFICATION_QUEUE_URL**=http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/notification

# Docker run

> all services, api and consumer

1. Create .env
2. All `npm run start:docker`

> **SQS_CUSTOM_ENDPOINT**=http://localstack:4566

> **SQS_NOTIFICATION_QUEUE_URL**=http://sqs.us-east-1.localstack.localstack.cloud:4566/000000000000/notification

# Swagger

**Endpoint** - `/api/docs`

# Tests
Command - `npm run test:unit`

# Task description

### Завдання

Створіть два мікросервіси:

1. **Products**
   1. Повинен мати три ендпоінти
      1. Створення товару
      2. Видалення товару
      3. Отримання списку товарів з пагінацією
   2. Кожна операція з товаром (create/delete) повинна відправляти відповідне повідомлення в Notifications сервіс через обраний брокер повідомлень
   3. Додайте `counter` метрики для кількості створених і видалених товарів.
2. **Notifications**
   1. Повинен слухати і логувати повідомлення, отримані від **Products** сервісу

### Вимоги

- Весь код проєкту має бути написаний за допомогою TypeScript
- Використовуйте NestJS в якості backend фреймворка
- Використовуйте PostgreSQL в якості БД
  - Запити повинні бути написані на чистому SQL без використання ORM
  - Створення схеми БД реалізуйте за допомогою міграцій. Використовати можна будь-який знайомий вам інструмент ([**Kysely**](https://kysely.dev/docs/migrations), [**Drizzle**](https://orm.drizzle.team/docs/migrations), [**node-pg-migrate**](https://github.com/salsita/node-pg-migrate) etc.)
- Для збирання метрик використовуйте [Prometheus](https://github.com/siimon/prom-client)
- Використовуйте брокер повідомлень для комунікації між сервісами (можна використати AWS SQS або інший брокер з яким ви знайомі більше)
- Додайте тести для створення, отримання списку і видалення продуктів (unit або integration на вибір)
- Додайте документацію за допомогою Swagger
