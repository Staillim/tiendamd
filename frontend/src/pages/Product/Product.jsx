import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProduct, useProducts } from '../../hooks/useProducts';
import ImageRenderer from '../../components/ui/ImageRenderer';
import WhatsAppButton from '../../components/ui/WhatsAppButton';
import ProductCard from '../../components/ui/ProductCard';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import SEO from '../../components/ui/SEO';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { BsWhatsapp } from 'react-icons/bs';
import { openWhatsApp } from '../../utils/whatsapp';
import { useSettings } from '../../context/SettingsContext';

export default function Product() {
  const { slug } = useParams();
  const { product, loading, error } = useProduct(slug);
  const { settings } = useSettings();
  const { products: related } = useProducts({
    categoria: product?.categoria,
    limit: 5,
  });

  const [currentImage, setCurrentImage] = useState(0);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">Producto no encontrado</div>;
  if (!product) return null;

  const images = product.imagenes || [];
  const relatedFiltered = related.filter(p => p.id !== product.id).slice(0, 4);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <SEO
        title={product.nombre}
        description={product.descripcion?.slice(0, 160)}
        keywords={product.etiquetas?.join(', ')}
        image={images[0]}
        url={window.location.href}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { to: `/categoria/${product.categoria}`, label: product.categoria },
            { label: product.nombre },
          ]}
        />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {images.length > 0 ? (
              <>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <ImageRenderer
                    imagen={images[currentImage]}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 shadow-lg"
                      >
                        <HiOutlineChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 shadow-lg"
                      >
                        <HiOutlineChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                          i === currentImage
                            ? 'border-blue-600 ring-2 ring-blue-600/30'
                            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <ImageRenderer imagen={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}

            {product.video && (
              <div className="rounded-2xl overflow-hidden">
                <video src={product.video} controls className="w-full" poster={images[0]?.valor}>
                  Tu navegador no soporta video.
                </video>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {product.marca && (
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                {product.marca}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {product.nombre}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${product.precio?.toLocaleString()}
              </span>
              {product.precioAnterior && product.precioAnterior > product.precio && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ${product.precioAnterior?.toLocaleString()}
                  </span>
                  <span className="badge bg-red-500 text-white">
                    -{Math.round(((product.precioAnterior - product.precio) / product.precioAnterior) * 100)}%
                  </span>
                </>
              )}
            </div>

            <WhatsAppButton product={product} className="w-full" />

            {product.descripcion && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Descripción</h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{product.descripcion}</p>
              </div>
            )}

            {product.etiquetas?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.etiquetas.map((tag) => (
                  <span key={tag} className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700 dark:text-gray-300">SKU:</span> {product.id?.slice(0, 8)}
              </p>
              {product.stock !== undefined && (
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Stock:</span>{' '}
                  {product.stock > 0 ? (
                    <span className="text-emerald-600">{product.stock} disponibles</span>
                  ) : (
                    <span className="text-red-600">Agotado</span>
                  )}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {relatedFiltered.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedFiltered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
