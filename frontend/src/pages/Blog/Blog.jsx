import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePosts } from '../../hooks/usePosts';
import ImageRenderer from '../../components/ui/ImageRenderer';
import SEO from '../../components/ui/SEO';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { HiOutlineCalendar } from 'react-icons/hi';

export default function Blog() {
  const { posts, loading } = usePosts();

  return (
    <>
      <SEO title="Blog" description="Noticias, tutoriales y guías" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Blog' }]} />

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Blog</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Noticias, tutoriales y guías</p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No hay publicaciones aún</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link to={`/blog/${post.slug}`} className="card block overflow-hidden group">
                  {post.imagen && (
                    <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <ImageRenderer
                        imagen={post.imagen}
                        alt={post.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <HiOutlineCalendar className="w-3.5 h-3.5" />
                      {post.fecha ? new Date(post.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }) : 'Sin fecha'}
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.titulo}
                    </h2>
                    {post.extracto && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{post.extracto}</p>
                    )}
                    <span className="mt-4 inline-block text-sm font-medium text-blue-600 dark:text-blue-400">
                      Leer más
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
