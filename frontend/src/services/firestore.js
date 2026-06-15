import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const app = initializeApp(firebaseConfig);
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
