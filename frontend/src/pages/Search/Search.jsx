import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import ProductCard from '../../components/ui/ProductCard';
import CategoryCard from '../../components/ui/CategoryCard';
import SEO from '../../components/ui/SEO';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { HiOutlineSearch } from 'react-icons/hi';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ productos: [], categorias: [] });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(query);

  useEffect(() => {
    if (query.length >= 2) {
      setLoading(true);
      api.get(`/search?q=${encodeURIComponent(query)}`)
        .then(({ data }) => setResults(data))
        .catch(() => setResults({ productos: [], categorias: [] }))
        .finally(() => setLoading(false));
    } else {
      setResults({ productos: [], categorias: [] });
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setSearchParams({ q: searchValue.trim() });
    }
  };

  return (
    <>
      <SEO title={query ? `Resultados para "${query}"` : 'Buscar'} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Buscar' }]} />

        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-xl">
            <div className="relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar productos, marcas, categorías..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </form>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : query.length < 2 ? (
          <div className="text-center py-16 text-gray-500">
            <HiOutlineSearch className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Escribe al menos 2 caracteres para buscar</p>
          </div>
        ) : results.productos.length === 0 && results.categorias.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No se encontraron resultados para "{query}"</p>
          </div>
        ) : (
          <div className="space-y-8">
            {results.categorias.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Categorías</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {results.categorias.map((cat, i) => (
                    <CategoryCard key={cat.id} category={cat} index={i} />
                  ))}
                </div>
              </section>
            )}

            {results.productos.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Productos ({results.productos.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {results.productos.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </>
  );
}
