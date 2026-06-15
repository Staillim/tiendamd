import { useState, useEffect } from 'react';
import api from '../services/api';

function ensureArray(data) {
  return Array.isArray(data) ? data : [];
}

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => setCategories(ensureArray(data)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}

export function useCategory(slug) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/categories/${slug}`)
      .then(({ data }) => setCategory(data && typeof data === 'object' ? data : null))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { category, loading, error };
}
