import { useCategories } from '../../hooks/useCategories';
import CategoryCard from '../../components/ui/CategoryCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function FeaturedCategories() {
  const { categories, loading } = useCategories();

  if (loading) return <LoadingSpinner />;
  if (!categories?.length) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Categorías</h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Explora por categoría</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
