import { useState, useEffect } from 'react';
import api from '../services/api';

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.destacado) params.append('destacado', 'true');
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.limit) params.append('limit', filters.limit);

    setLoading(true);
    api.get(`/products?${params.toString()}`)
      .then(({ data }) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters.destacado, filters.categoria, filters.limit]);

  return { products, loading, error };
}

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/products/slug/${slug}`)
      .then(({ data }) => setProduct(data))
      .catch((err) => setError(err.response?.status === 404 ? 'Producto no encontrado' : err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}
