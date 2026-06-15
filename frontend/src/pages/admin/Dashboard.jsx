import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { HiOutlineTag, HiOutlineCollection, HiOutlineDocumentText, HiOutlineEye } from 'react-icons/hi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return null;

  const cards = [
    { label: 'Productos', value: stats.totalProductos, icon: HiOutlineTag, color: 'blue', to: '/admin-marketplay-2026/productos' },
    { label: 'Categorías', value: stats.totalCategorias, icon: HiOutlineCollection, color: 'purple', to: '/admin-marketplay-2026/categorias' },
    { label: 'Publicaciones', value: stats.totalPublicaciones, icon: HiOutlineDocumentText, color: 'emerald', to: '/admin-marketplay-2026/publicaciones' },
    { label: 'Visitas Totales', value: stats.totalVisitas, icon: HiOutlineEye, color: 'orange' },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">Resumen de la plataforma</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, to }) => {
          const content = (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          );
          return to ? <Link key={label} to={to}>{content}</Link> : <div key={label}>{content}</div>;
        })}
      </div>

      {stats.masVistos?.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Productos Más Vistos</h3>
          <div className="space-y-3">
            {stats.masVistos.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 w-6">{i + 1}</span>
                  <span className="text-sm text-gray-900 dark:text-white">{p.nombre}</span>
                </div>
                <span className="text-sm text-gray-500">{p.visitas || 0} visitas</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
