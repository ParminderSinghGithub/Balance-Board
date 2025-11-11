# Backend Server

Express.js backend server for the Finance Tracker application.

## Structure

```
server/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.ts
│   │   └── feed.ts
│   ├── routes/              # API routes
│   │   ├── auth.ts
│   │   └── feed.ts
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   └── feed.service.ts
│   ├── middleware/          # Custom middleware
│   │   └── is-auth.ts
│   ├── db_conn/            # Database connection
│   │   └── db.ts
│   └── app.ts              # Main application file
├── package.json
├── tsconfig.json
└── Dockerfile
```

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user

### Feed (`/feed`)
- `GET /feed/expense-categories` - Get expense categories
- `POST /feed/transaction` - Create transaction (auth required)
- `GET /feed/timeseries` - Get time series data (auth required)
- `GET /feed/income-expenses` - Get income/expense breakdown (auth required)
- `GET /feed/casflow` - Get cashflow data (auth required)
- `GET /feed/financial-overview` - Get financial metrics (auth required)
- `GET /feed/financial-details` - Get detailed financial data (auth required)
- `GET /feed/list-expenses` - Get expense table (auth required)

## Running the Server

### Using Docker
```bash
docker-compose up backend
```

### Locally
```bash
cd server
npm install
npm run dev    # Development mode
npm run build  # Build for production
npm start      # Production mode
```

## Environment Variables

Required environment variables (see `.env.example`):
- `POSTGRES_HOST` - Database host
- `POSTGRES_USER` - Database user
- `POSTGRES_PASSWORD` - Database password
- `POSTGRES_DB` - Database name
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 8000)

## Authentication

The API uses JWT tokens for authentication. Protected routes require an `Authorization` header:
```
Authorization: Bearer <token>
```
