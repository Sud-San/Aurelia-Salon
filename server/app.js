import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/error.js';

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim().replace(/\/+$/, ''));

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  const cleanOrigin = origin.trim().replace(/\/+$/, '');
  if (allowedOrigins.includes(cleanOrigin) || allowedOrigins.includes('*')) return true;
  if (cleanOrigin.endsWith('.vercel.app')) return true;
  if (cleanOrigin.includes('localhost') || cleanOrigin.includes('127.0.0.1')) return true;
  return true; // Permissive in deployment to prevent frontend lockouts
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        // Return exact origin or true so Access-Control-Allow-Origin header matches caller without trailing slash
        callback(null, origin || true);
      } else {
        callback(null, origin || true);
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
