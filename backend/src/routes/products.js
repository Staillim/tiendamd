import { Router } from 'express';
import { getDb, getTimestamp } from '../services/firebase.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const { destacado, categoria, limit: lim } = _req.query;
    const snapshot = await getDb().collection('productos')
      .where('estado', '==', 'activo')
      .get();

    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fecha: doc.data().fecha?.toDate?.()?.toISOString() || null,
    }));

    if (destacado === 'true') products = products.filter(p => p.destacado === true);
    if (categoria) products = products.filter(p => p.categoria === categoria);

    products.sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));

    if (lim) products = products.slice(0, parseInt(lim));

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/slug/:slug', async (req, res) => {
  try {
    const snapshot = await getDb().collection('productos')
      .where('slug', '==', req.params.slug)
      .where('estado', '==', 'activo')
      .limit(1)
      .get();

    if (snapshot.empty) return res.status(404).json({ error: 'Producto no encontrado' });

    const doc = snapshot.docs[0];
    res.json({
      id: doc.id,
      ...doc.data(),
      fecha: doc.data().fecha?.toDate?.()?.toISOString() || null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/related/:categorySlug', async (req, res) => {
  try {
    const snapshot = await getDb().collection('productos')
      .where('categoria', '==', req.params.categorySlug)
      .where('estado', '==', 'activo')
      .get();

    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fecha: doc.data().fecha?.toDate?.()?.toISOString() || null,
    }));

    products.sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));
    products = products.slice(0, 8);

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
