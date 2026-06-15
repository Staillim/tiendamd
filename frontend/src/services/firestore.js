import { getFirestore, collection, getDocs, query, where, orderBy, limit, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import app from './firebase';

const db = getFirestore(app);

function formatDoc(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    fecha: data.fecha?.toDate?.()?.toISOString() || data.fecha || null,
  };
}

function sortByDateDesc(a, b) {
  return new Date(b.fecha || 0) - new Date(a.fecha || 0);
}

export async function fetchProducts({ destacado, categoria, maxResults } = {}) {
  const constraints = [where('estado', '==', 'activo')];
  const q = query(collection(db, 'productos'), ...constraints);
  const snapshot = await getDocs(q);

  let products = snapshot.docs.map(formatDoc);
  products.sort(sortByDateDesc);

  if (destacado) products = products.filter(p => p.destacado === true);
  if (categoria) products = products.filter(p => p.categoria === categoria);
  if (maxResults) products = products.slice(0, maxResults);

  return products;
}

export async function fetchProductBySlug(slug) {
  const q = query(
    collection(db, 'productos'),
    where('slug', '==', slug),
    where('estado', '==', 'activo'),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return formatDoc(snapshot.docs[0]);
}

export async function fetchRelatedProducts(categorySlug, excludeId, maxResults = 8) {
  const q = query(
    collection(db, 'productos'),
    where('categoria', '==', categorySlug),
    where('estado', '==', 'activo')
  );
  const snapshot = await getDocs(q);
  let products = snapshot.docs.map(formatDoc);
  products = products.filter(p => p.id !== excludeId);
  products.sort(sortByDateDesc);
  return products.slice(0, maxResults);
}

export async function fetchCategories() {
  const snapshot = await getDocs(collection(db, 'categorias'));
  return snapshot.docs.map(formatDoc);
}

export async function fetchCategoryBySlug(slug) {
  const q = query(collection(db, 'categorias'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const category = formatDoc(snapshot.docs[0]);

  const productsSnap = await getDocs(
    query(collection(db, 'productos'), where('categoria', '==', slug), where('estado', '==', 'activo'))
  );
  category.products = productsSnap.docs.map(formatDoc).sort(sortByDateDesc);

  return category;
}

export async function fetchPosts() {
  const q = query(collection(db, 'publicaciones'), where('estado', '==', 'publicado'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(formatDoc).sort(sortByDateDesc);
}

export async function fetchPostBySlug(slug) {
  const q = query(
    collection(db, 'publicaciones'),
    where('slug', '==', slug),
    where('estado', '==', 'publicado'),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return formatDoc(snapshot.docs[0]);
}

export async function fetchSettings() {
  const docRef = doc(db, 'configuracion', 'general');
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}

export async function searchProducts(queryText) {
  const term = queryText.toLowerCase();
  const snapshot = await getDocs(
    query(collection(db, 'productos'), where('estado', '==', 'activo'))
  );
  const all = snapshot.docs.map(formatDoc);
  return all.filter(p =>
    p.nombre?.toLowerCase().includes(term) ||
    p.marca?.toLowerCase().includes(term) ||
    p.categoria?.toLowerCase().includes(term) ||
    p.etiquetas?.some?.(t => t.toLowerCase().includes(term))
  ).slice(0, 20);
}

export async function searchCategories(queryText) {
  const term = queryText.toLowerCase();
  const snapshot = await getDocs(collection(db, 'categorias'));
  return snapshot.docs.map(formatDoc).filter(c =>
    c.nombre?.toLowerCase().includes(term)
  ).slice(0, 5);
}

export default db;

// --- ADMIN OPERATIONS (require auth) ---

export async function adminFetchProducts() {
  const snapshot = await getDocs(collection(db, 'productos'));
  return snapshot.docs.map(formatDoc).sort(sortByDateDesc);
}

export async function adminSaveProduct(data, editId) {
  const payload = { ...data, fecha: serverTimestamp() };
  if (editId) {
    await updateDoc(doc(db, 'productos', editId), payload);
    return editId;
  }
  const ref = await addDoc(collection(db, 'productos'), payload);
  return ref.id;
}

export async function adminDeleteProduct(id) {
  await deleteDoc(doc(db, 'productos', id));
}

export async function adminDuplicateProduct(id) {
  const snap = await getDoc(doc(db, 'productos', id));
  if (!snap.exists()) throw new Error('No encontrado');
  const data = snap.data();
  const nuevo = { ...data, nombre: `${data.nombre} (copia)`, visitas: 0, fecha: serverTimestamp() };
  await addDoc(collection(db, 'productos'), nuevo);
}

export async function adminFetchCategories() {
  const snapshot = await getDocs(collection(db, 'categorias'));
  return snapshot.docs.map(formatDoc);
}

export async function adminSaveCategory(data, editId) {
  const payload = { ...data, fecha: serverTimestamp() };
  if (editId) {
    await updateDoc(doc(db, 'categorias', editId), payload);
    return editId;
  }
  const ref = await addDoc(collection(db, 'categorias'), payload);
  return ref.id;
}

export async function adminDeleteCategory(id) {
  await deleteDoc(doc(db, 'categorias', id));
}

export async function adminFetchPosts() {
  const snapshot = await getDocs(collection(db, 'publicaciones'));
  return snapshot.docs.map(formatDoc).sort(sortByDateDesc);
}

export async function adminSavePost(data, editId) {
  const payload = { ...data, fecha: serverTimestamp() };
  if (editId) {
    await updateDoc(doc(db, 'publicaciones', editId), payload);
    return editId;
  }
  const ref = await addDoc(collection(db, 'publicaciones'), payload);
  return ref.id;
}

export async function adminDeletePost(id) {
  await deleteDoc(doc(db, 'publicaciones', id));
}

export async function adminFetchDashboard() {
  const [prodSnap, catSnap, pubSnap] = await Promise.all([
    getDocs(collection(db, 'productos')),
    getDocs(collection(db, 'categorias')),
    getDocs(collection(db, 'publicaciones')),
  ]);
  const productos = prodSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const totalVisitas = productos.reduce((sum, p) => sum + (p.visitas || 0), 0);
  const masVistos = productos.sort((a, b) => (b.visitas || 0) - (a.visitas || 0)).slice(0, 5);
  return {
    totalProductos: prodSnap.size,
    totalCategorias: catSnap.size,
    totalPublicaciones: pubSnap.size,
    totalVisitas,
    masVistos,
  };
}

export async function adminSaveSettings(data) {
  await updateDoc(doc(db, 'configuracion', 'general'), data);
}
