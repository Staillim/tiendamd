import { Router } from 'express';
import { getDb } from '../services/firebase.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const snapshot = await getDb().collection('categorias').orderBy('nombre', 'asc').get();
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const snapshot = await getDb().collection('categorias')
      .where('slug', '==', req.params.slug)
      .limit(1)
      .get();

    if (snapshot.empty) return res.status(404).json({ error: 'Categoría no encontrada' });

    const doc = snapshot.docs[0];

    const productsSnapshot = await getDb().collection('productos')
      .where('categoria', '==', req.params.slug)
      .where('estado', '==', 'activo')
      .orderBy('fecha', 'desc')
      .get();

    const products = productsSnapshot.docs.map(p => ({
      id: p.id,
      ...p.data(),
      fecha: p.data().fecha?.toDate?.()?.toISOString() || null,
    }));

    res.json({
      id: doc.id,
      ...doc.data(),
      products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
