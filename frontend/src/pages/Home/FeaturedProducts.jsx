import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ui/ProductCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';

export default function FeaturedProducts() {
  const { products, loading } = useProducts({ destacado: true, limit: 8 });

  if (loading) return <LoadingSpinner />;
  if (!products?.length) return null;

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Productos Destacados</h2>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Lo más recomendado para ti</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
