import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { initializeFirebase } from './services/firebase.js';
import { authMiddleware } from './middleware/auth.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import postsRouter from './routes/posts.js';
import settingsRouter from './routes/settings.js';
import adminRouter from './routes/admin.js';
import searchRouter from './routes/search.js';

const app = express();
const PORT = process.env.PORT || 3001;

initializeFirebase();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));

app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/posts', postsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/admin', authMiddleware, adminRouter);
app.use('/api/search', searchRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`MarketPlay API corriendo en puerto ${PORT}`);
});
