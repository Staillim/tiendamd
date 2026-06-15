import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = () => {
    setLoading(true);
    api.get('/admin/categorias')
      .then(({ data }) => setCategories(data))
      .catch(() => toast.error('Error al cargar categorías'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await api.delete(`/admin/categorias/${id}`);
      toast.success('Categoría eliminada');
      fetchCategories();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Categorías</h2>
          <p className="mt-1 text-sm text-gray-500">{categories.length} categorías</p>
        </div>
        <Link to="/admin-marketplay-2026/categorias/nuevo" className="btn-primary">
          <HiOutlinePlus className="w-5 h-5" /> Nueva Categoría
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No hay categorías</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: cat.colorPrincipal || '#3b82f6' }}
                >
                  {cat.nombre?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{cat.nombre}</h3>
                  <p className="text-xs text-gray-500">{cat.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-6 rounded-full border-2 border-gray-200" style={{ backgroundColor: cat.colorPrincipal }} title="Color principal" />
                <div className="w-6 h-6 rounded-full border-2 border-gray-200" style={{ backgroundColor: cat.colorSecundario }} title="Color secundario" />
              </div>
              <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                <Link
                  to={`/admin-marketplay-2026/categorias/editar/${cat.id}`}
                  className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <HiOutlinePencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
