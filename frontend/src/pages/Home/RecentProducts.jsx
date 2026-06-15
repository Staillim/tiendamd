import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ui/ProductCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function RecentProducts() {
  const { products, loading } = useProducts({ limit: 8 });

  if (loading) return <LoadingSpinner />;
  if (!products?.length) return null;

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Novedades</h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Los productos más recientes</p>
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
