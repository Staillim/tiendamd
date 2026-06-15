import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ImageUploader from '../../components/ui/ImageUploader';
import { HiOutlineSave, HiOutlineArrowLeft, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { PRODUCT_STATES } from '../../utils/constants';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    precioAnterior: '',
    categoria: '',
    subcategoria: '',
    marca: '',
    stock: '',
    etiquetas: '',
    estado: 'activo',
    destacado: false,
    imagenes: [],
    video: '',
  });

  useEffect(() => {
    api.get('/admin/categorias').then(({ data }) => setCategories(data)).catch(() => {});
    if (isEdit) {
      setLoading(true);
      api.get(`/admin/productos`)
        .then(({ data }) => {
          const p = data.find(x => x.id === id);
          if (p) {
            setForm({
              nombre: p.nombre || '',
              descripcion: p.descripcion || '',
              precio: p.precio || '',
              precioAnterior: p.precioAnterior || '',
              categoria: p.categoria || '',
              subcategoria: p.subcategoria || '',
              marca: p.marca || '',
              stock: p.stock || '',
              etiquetas: Array.isArray(p.etiquetas) ? p.etiquetas.join(', ') : p.etiquetas || '',
              estado: p.estado || 'activo',
              destacado: p.destacado || false,
              imagenes: p.imagenes || [],
              video: p.video || '',
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addImage = () => {
    setForm(prev => ({
      ...prev,
      imagenes: [...prev.imagenes, { tipo: 'drive', valor: '' }],
    }));
  };

  const updateImage = (index, tipo, valor) => {
    setForm(prev => {
      const imagenes = [...prev.imagenes];
      imagenes[index] = { tipo, valor };
      return { ...prev, imagenes };
    });
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        precio: Number(form.precio) || 0,
        precioAnterior: Number(form.precioAnterior) || 0,
        stock: Number(form.stock) || 0,
        etiquetas: form.etiquetas ? form.etiquetas.split(',').map(t => t.trim()).filter(Boolean) : [],
      };

      if (isEdit) {
        await api.put(`/admin/productos/${id}`, data);
        toast.success('Producto actualizado');
      } else {
        await api.post('/admin/productos', data);
        toast.success('Producto creado');
      }
      navigate('/admin-marketplay-2026/productos');
    } catch (err) {
      toast.error('Error al guardar producto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white">Información Básica</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="label">Nombre *</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required className="input" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Descripción</label>
              <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={4} className="input" />
            </div>
            <div>
              <label className="label">Precio *</label>
              <input name="precio" type="number" value={form.precio} onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="label">Precio Anterior</label>
              <input name="precioAnterior" type="number" value={form.precioAnterior} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Categoría</label>
              <select name="categoria" value={form.categoria} onChange={handleChange} className="input">
                <option value="">Sin categoría</option>
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Subcategoría</label>
              <input name="subcategoria" value={form.subcategoria} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Marca</label>
              <input name="marca" value={form.marca} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Stock</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange} className="input">
                {PRODUCT_STATES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Etiquetas (separadas por coma)</label>
              <input name="etiquetas" value={form.etiquetas} onChange={handleChange} className="input" placeholder="oferta, nuevo, popular" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} id="destacado" className="w-4 h-4 rounded text-blue-600" />
              <label htmlFor="destacado" className="text-sm text-gray-700 dark:text-gray-300">Producto Destacado</label>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Imágenes</h3>
            <button type="button" onClick={addImage} className="btn-secondary text-sm py-2">
              <HiOutlinePlus className="w-4 h-4" /> Agregar Imagen
            </button>
          </div>

          {form.imagenes.length === 0 && (
            <p className="text-sm text-gray-500">Sin imágenes. Agrega al menos una.</p>
          )}

          <div className="space-y-4">
            {form.imagenes.map((img, i) => (
              <div key={i} className="relative p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-white dark:bg-gray-900 text-red-400 hover:text-red-600 shadow-sm"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
                <ImageUploader
                  label={`Imagen ${i + 1}`}
                  value={img}
                  onChange={(tipo, valor) => updateImage(i, tipo, valor)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white">Video (opcional)</h3>
          <input name="video" value={form.video} onChange={handleChange} placeholder="URL del video" className="input" />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            <HiOutlineSave className="w-5 h-5" /> {saving ? 'Guardando...' : 'Guardar Producto'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  );
}

