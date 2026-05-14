import path from 'path';
import dotenv from 'dotenv';

// Load env BEFORE any other imports
dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);
console.log('POSTGRES_HOST loaded:', process.env.POSTGRES_HOST);

import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { z } from 'zod';

import feedRoutes from './routes/feed';
import authRoutes from './routes/auth';

const port = process.env.PORT || 8000;

const app: Express = express();

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3001',
  'https://frontend-production-80c5.up.railway.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/feed', feedRoutes);

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);

  if (error instanceof z.ZodError) {
    return res.status(422).json({
      message: 'Validation failed.',
      errors: error.errors
    });
  }

  const status = error.statusCode || 500;
  const message = error.message || 'An internal server error occurred.';

  return res.status(status).json({
    message
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});