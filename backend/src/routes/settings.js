import { Router } from 'express';
import { getDb } from '../services/firebase.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const doc = await getDb().collection('configuracion').doc('general').get();
    if (!doc.exists) {
      return res.json(getDefaultSettings());
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function getDefaultSettings() {
  return {
    nombre: 'MarketPlay',
    descripcion: 'Marketplace Premium',
    logo: null,
    favicon: null,
    whatsapp: '',
    email: '',
    direccion: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    tema: 'claro',
    heroTitulo: 'Bienvenido a MarketPlay',
    heroSubtitulo: 'Descubre productos increíbles',
    heroImagen: null,
  };
}

export default router;
