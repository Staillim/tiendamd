import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImageRenderer from './ImageRenderer';

export default function CategoryCard({ category, index = 0 }) {
  const bgColor = category.colorPrincipal || '#3b82f6';
  const textColor = category.colorSecundario || '#ffffff';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/categoria/${category.slug}`}
        className="card group overflow-hidden block"
        style={{ borderColor: bgColor + '40' }}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {category.banner ? (
            <ImageRenderer
              imagen={category.banner}
              alt={category.nombre}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center transition-all duration-500 group-hover:scale-105"
              style={{ backgroundColor: bgColor + '20' }}
            >
              <span className="text-4xl font-bold" style={{ color: bgColor }}>{category.nombre?.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-lg">{category.nombre}</h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
