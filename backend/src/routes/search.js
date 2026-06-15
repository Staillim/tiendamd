import { Router } from 'express';
import { getDb } from '../services/firebase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json({ productos: [], categorias: [] });

    const searchTerm = q.toLowerCase();

    const [productosSnap, categoriasSnap] = await Promise.all([
      getDb().collection('productos').where('estado', '==', 'activo').get(),
      getDb().collection('categorias').get(),
    ]);

    const productos = productosSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(p =>
        p.nombre?.toLowerCase().includes(searchTerm) ||
        p.marca?.toLowerCase().includes(searchTerm) ||
        p.categoria?.toLowerCase().includes(searchTerm) ||
        p.etiquetas?.some?.(t => t.toLowerCase().includes(searchTerm))
      )
      .slice(0, 20);

    const categorias = categoriasSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(c => c.nombre?.toLowerCase().includes(searchTerm))
      .slice(0, 5);

    res.json({ productos, categorias });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
