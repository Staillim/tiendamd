import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminFetchPosts, adminDeletePost } from '../../services/firestore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    setLoading(true);
    adminFetchPosts()
      .then(setPosts)
      .catch(() => toast.error('Error al cargar publicaciones'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta publicación?')) return;
    try {
      await adminDeletePost(id);
      toast.success('Publicación eliminada');
      fetchPosts();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Blog</h2>
          <p className="mt-1 text-sm text-gray-500">{posts.length} publicaciones</p>
        </div>
        <Link to="/admin-marketplay-2026/publicaciones/nuevo" className="btn-primary">
          <HiOutlinePlus className="w-5 h-5" /> Nueva Publicación
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No hay publicaciones</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Título</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{p.titulo}</p>
                      <p className="text-xs text-gray-500">{p.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        p.estado === 'publicado' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                        p.estado === 'borrador' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      }`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {p.fecha ? new Date(p.fecha).toLocaleDateString('es-ES') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin-marketplay-2026/publicaciones/editar/${p.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
