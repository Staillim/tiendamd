import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useCategory } from '../../hooks/useCategories';
import ProductCard from '../../components/ui/ProductCard';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import SEO from '../../components/ui/SEO';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { HiOutlineFilter, HiOutlineX } from 'react-icons/hi';

export default function Category() {
  const { slug } = useParams();
  const { category, loading, error } = useCategory(slug);
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">Categoría no encontrada</div>;
  if (!category) return null;

  let sortedProducts = [...(category.products || [])];
  if (sortBy === 'price-asc') sortedProducts.sort((a, b) => a.precio - b.precio);
  if (sortBy === 'price-desc') sortedProducts.sort((a, b) => b.precio - a.precio);
  if (sortBy === 'name') sortedProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));

  return (
    <>
      <SEO
        title={category.nombre}
        description={`Explora nuestra colección de ${category.nombre}`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: category.nombre }]} />

        <div
          className="relative rounded-2xl overflow-hidden mb-8 p-8 lg:p-12"
          style={{ backgroundColor: (category.colorPrincipal || '#3b82f6') + '15' }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {category.nombre}
          </h1>
          {category.descripcion && (
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">{category.descripcion}</p>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">{sortedProducts.length} productos</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
            >
              <HiOutlineFilter className="w-4 h-4" /> Filtros
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
            >
              <option value="recent">Más recientes</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="name">Nombre</option>
            </select>
          </div>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No hay productos en esta categoría</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sortedProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
