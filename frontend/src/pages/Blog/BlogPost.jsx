import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePost } from '../../hooks/usePosts';
import SEO from '../../components/ui/SEO';
import ImageRenderer from '../../components/ui/ImageRenderer';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { HiOutlineCalendar, HiOutlineArrowLeft } from 'react-icons/hi';

export default function BlogPost() {
  const { slug } = useParams();
  const { post, loading, error } = usePost(slug);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">Publicación no encontrada</div>;
  if (!post) return null;

  return (
    <>
      <SEO title={post.titulo} description={post.extracto || post.contenido?.slice(0, 160)} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ to: '/blog', label: 'Blog' }, { label: post.titulo }]} />

        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <HiOutlineArrowLeft className="w-4 h-4" /> Volver al blog
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {post.imagen && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-gray-100 dark:bg-gray-800">
                <ImageRenderer
                  imagen={post.imagen}
                  alt={post.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <HiOutlineCalendar className="w-4 h-4" />
            {post.fecha ? new Date(post.fecha).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }) : 'Sin fecha'}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {post.titulo}
          </h1>

          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {post.contenido}
          </div>
        </motion.article>
      </div>
    </>
  );
}
