import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminFetchProducts, adminDeleteProduct, adminDuplicateProduct } from '../../services/firestore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ImageRenderer from '../../components/ui/ImageRenderer';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineDuplicate, HiOutlineSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    adminFetchProducts()
      .then(setProducts)
      .catch(() => toast.error('Error al cargar productos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await adminDeleteProduct(id);
      toast.success('Producto eliminado');
      fetchProducts();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await adminDuplicateProduct(id);
      toast.success('Producto duplicado');
      fetchProducts();
    } catch {
      toast.error('Error al duplicar');
    }
  };

  const filtered = products.filter(p =>
    p.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    p.marca?.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Productos</h2>
          <p className="mt-1 text-sm text-gray-500">{products.length} productos</p>
        </div>
        <Link to="/admin-marketplay-2026/productos/nuevo" className="btn-primary">
          <HiOutlinePlus className="w-5 h-5" /> Nuevo Producto
        </Link>
      </div>

      <div className="relative max-w-md">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar productos..."
          className="input pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No hay productos</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Categoría</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <ImageRenderer
                          imagen={p.imagenes?.[0]}
                          alt={p.nombre}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{p.nombre}</p>
                          <p className="text-xs text-gray-500">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      ${p.precio?.toLocaleString()}
                      {p.precioAnterior && (
                        <span className="ml-2 text-xs text-gray-400 line-through">${p.precioAnterior?.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{p.categoria}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        p.estado === 'activo' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                        p.estado === 'borrador' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin-marketplay-2026/productos/editar/${p.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(p.id)}
                          className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <HiOutlineDuplicate className="w-4 h-4" />
                        </button>
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
