import { useState, useEffect } from 'react';
import api from '../services/api';

function ensureArray(data) {
  return Array.isArray(data) ? data : [];
}

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/posts')
      .then(({ data }) => setPosts(ensureArray(data)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { posts, loading, error };
}

export function usePost(slug) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/posts/${slug}`)
      .then(({ data }) => setPost(data && typeof data === 'object' ? data : null))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { post, loading, error };
}
