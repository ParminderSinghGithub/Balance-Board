# Database Module

This module handles database migrations and seeding for the Finance Tracker application.

## Structure

```
database/
├── src/
│   ├── index.ts          # Entry point for migrations
│   └── runner.ts         # Migration runner with seed logic
├── migrations/           # SQL migration files
│   ├── 001_create_base_tables.sql
│   ├── 002_add_users_table.sql
│   ├── 003_create_financial_metrics_function.sql
│   └── 004_create_income_expense_function.sql
├── seeds/               # SQL seed files
│   ├── 001_categories_and_types.sql
│   └── 002_test_transactions.sql
├── package.json
├── tsconfig.json
└── Dockerfile
```

## Running Migrations

### Using Docker
```bash
docker-compose up db_migrations
```

### Locally
```bash
cd database
npm install
npm run migrate:up    # Apply migrations
npm run migrate:down  # Rollback migrations
```

## Environment Variables

Required environment variables:
- `POSTGRES_USER` - Database user
- `POSTGRES_PASSWORD` - Database password
- `POSTGRES_HOST` - Database host (warehouse in Docker)
- `POSTGRES_DB` - Database name (tracker)

## Database Schema

### Tables
- `expense_categories` - Expense category definitions
- `expense_types` - Expense type definitions linked to categories
- `transactions` - Transaction records
- `users` - User accounts

### Functions
- `get_financial_metrics(user_id)` - Returns financial metrics and savings rate
- `get_income_expense(user_id)` - Returns monthly income/expense breakdown
