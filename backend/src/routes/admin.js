import { Router } from 'express';
import { getDb, getTimestamp } from '../services/firebase.js';

const router = Router();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// --- DASHBOARD ---
router.get('/dashboard', async (_req, res) => {
  try {
    const db = getDb();
    const [productosSnap, categoriasSnap, publicacionesSnap] = await Promise.all([
      db.collection('productos').get(),
      db.collection('categorias').get(),
      db.collection('publicaciones').get(),
    ]);

    const productos = productosSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const totalVisitas = productos.reduce((sum, p) => sum + (p.visitas || 0), 0);
    const masVistos = productos
      .sort((a, b) => (b.visitas || 0) - (a.visitas || 0))
      .slice(0, 5);

    res.json({
      totalProductos: productosSnap.size,
      totalCategorias: categoriasSnap.size,
      totalPublicaciones: publicacionesSnap.size,
      totalVisitas,
      masVistos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- PRODUCTS CRUD ---
router.get('/productos', async (_req, res) => {
  try {
    const snapshot = await getDb().collection('productos').orderBy('fecha', 'desc').get();
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fecha: doc.data().fecha?.toDate?.()?.toISOString() || null,
    }));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/productos', async (req, res) => {
  try {
    const { nombre, ...rest } = req.body;
    const slug = slugify(nombre) + '-' + Date.now().toString(36);
    const producto = {
      ...rest,
      nombre,
      slug,
      visitas: 0,
      estado: req.body.estado || 'activo',
      fecha: getTimestamp(),
    };
    const docRef = await getDb().collection('productos').add(producto);
    res.status(201).json({ id: docRef.id, ...producto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (data.nombre && !data.slug) {
      data.slug = slugify(data.nombre) + '-' + Date.now().toString(36);
    }
    delete data.id;
    await getDb().collection('productos').doc(id).update(data);
    res.json({ id, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/productos/:id', async (req, res) => {
  try {
    await getDb().collection('productos').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/productos/:id/duplicar', async (req, res) => {
  try {
    const doc = await getDb().collection('productos').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Producto no encontrado' });

    const data = doc.data();
    const nuevo = {
      ...data,
      nombre: `${data.nombre} (copia)`,
      slug: slugify(data.nombre) + '-copia-' + Date.now().toString(36),
      visitas: 0,
      fecha: getTimestamp(),
    };
    const newDoc = await getDb().collection('productos').add(nuevo);
    res.status(201).json({ id: newDoc.id, ...nuevo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CATEGORIES CRUD ---
router.get('/categorias', async (_req, res) => {
  try {
    const snapshot = await getDb().collection('categorias').orderBy('nombre', 'asc').get();
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/categorias', async (req, res) => {
  try {
    const { nombre } = req.body;
    const categoria = {
      ...req.body,
      slug: slugify(nombre),
      fecha: getTimestamp(),
    };
    const docRef = await getDb().collection('categorias').add(categoria);
    res.status(201).json({ id: docRef.id, ...categoria });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (data.nombre) data.slug = slugify(data.nombre);
    delete data.id;
    await getDb().collection('categorias').doc(id).update(data);
    res.json({ id, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/categorias/:id', async (req, res) => {
  try {
    await getDb().collection('categorias').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- POSTS CRUD ---
router.get('/publicaciones', async (_req, res) => {
  try {
    const snapshot = await getDb().collection('publicaciones').orderBy('fecha', 'desc').get();
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fecha: doc.data().fecha?.toDate?.()?.toISOString() || null,
    }));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/publicaciones', async (req, res) => {
  try {
    const { titulo } = req.body;
    const post = {
      ...req.body,
      slug: slugify(titulo) + '-' + Date.now().toString(36),
      estado: req.body.estado || 'borrador',
      fecha: getTimestamp(),
    };
    const docRef = await getDb().collection('publicaciones').add(post);
    res.status(201).json({ id: docRef.id, ...post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/publicaciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    delete data.id;
    await getDb().collection('publicaciones').doc(id).update(data);
    res.json({ id, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/publicaciones/:id', async (req, res) => {
  try {
    await getDb().collection('publicaciones').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- SETTINGS ---
router.get('/configuracion', async (_req, res) => {
  try {
    const doc = await getDb().collection('configuracion').doc('general').get();
    if (!doc.exists) return res.json({});
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/configuracion', async (req, res) => {
  try {
    await getDb().collection('configuracion').doc('general').set(req.body, { merge: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
