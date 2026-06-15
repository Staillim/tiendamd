import { Router } from 'express';
import { getDb } from '../services/firebase.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const snapshot = await getDb().collection('publicaciones')
      .where('estado', '==', 'publicado')
      .get();

    let posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fecha: doc.data().fecha?.toDate?.()?.toISOString() || null,
    }));

    posts.sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const snapshot = await getDb().collection('publicaciones')
      .where('slug', '==', req.params.slug)
      .where('estado', '==', 'publicado')
      .limit(1)
      .get();

    if (snapshot.empty) return res.status(404).json({ error: 'Publicación no encontrada' });

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

export default router;
