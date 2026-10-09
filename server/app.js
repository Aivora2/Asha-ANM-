import express from 'express';
import cors from 'cors';
import { authRouter } from './routes.js';
import { supervisorRouter } from './supervisorRoutes.js';

export const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '5mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'EK-ASHA Supervisor Auth Service', timestamp: new Date().toISOString() });
});

// Mount authentication router
app.use('/api/auth', authRouter);

// Mount supervisor management router
app.use('/api/supervisor', supervisorRouter);
