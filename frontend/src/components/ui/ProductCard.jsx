import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BsWhatsapp } from 'react-icons/bs';
import ImageRenderer from './ImageRenderer';
import { openWhatsApp } from '../../utils/whatsapp';
import { useSettings } from '../../context/SettingsContext';

export default function ProductCard({ product, index = 0 }) {
  const { settings } = useSettings();
  const mainImage = product.imagenes?.[0];
  const hasDiscount = product.precioAnterior && product.precioAnterior > product.precio;
  const discount = hasDiscount
    ? Math.round(((product.precioAnterior - product.precio) / product.precioAnterior) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="card group overflow-hidden"
    >
      <Link to={`/producto/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <ImageRenderer
          imagen={mainImage}
          alt={product.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 badge bg-red-500 text-white">
            -{discount}%
          </span>
        )}
        {product.destacado && (
          <span className="absolute top-3 right-3 badge bg-blue-600 text-white">
            Destacado
          </span>
        )}
      </Link>

      <div className="p-4">
        <Link to={`/producto/${product.slug}`}>
          <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.nombre}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${product.precio?.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ${product.precioAnterior?.toLocaleString()}
            </span>
          )}
        </div>

        {product.marca && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{product.marca}</p>
        )}

        {settings.whatsapp && (
          <button
            onClick={(e) => {
              e.preventDefault();
              openWhatsApp(settings.whatsapp, product);
            }}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
          >
            <BsWhatsapp className="w-4 h-4" />
            Comprar
          </button>
        )}
      </div>
    </motion.div>
  );
}
