import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ui/ProductCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function Offers() {
  const { products, loading } = useProducts({ limit: 20 });

  if (loading) return <LoadingSpinner />;

  const offers = products.filter(p => p.precioAnterior && p.precioAnterior > p.precio).slice(0, 8);
  if (!offers?.length) return null;

  return (
    <section className="py-16 bg-red-50/50 dark:bg-red-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Ofertas Especiales</h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Aprovecha los mejores descuentos</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {offers.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
