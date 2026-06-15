import { Link } from 'react-router-dom';
import { HiOutlineChevronRight } from 'react-icons/hi';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
      <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
        Inicio
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <HiOutlineChevronRight className="w-4 h-4" />
          {item.to ? (
            <Link to={item.to} className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
