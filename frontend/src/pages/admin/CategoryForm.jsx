import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminSaveCategory, adminFetchCategories } from '../../services/firestore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ImageUploader from '../../components/ui/ImageUploader';
import { HiOutlineSave, HiOutlineArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    colorPrincipal: '#3b82f6',
    colorSecundario: '#ffffff',
    icono: '',
    banner: { tipo: 'drive', valor: '' },
  });

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      adminFetchCategories()
        .then((data) => {
          const c = data.find(x => x.id === id);
          if (c) {
            setForm({
              nombre: c.nombre || '',
              descripcion: c.descripcion || '',
              colorPrincipal: c.colorPrincipal || '#3b82f6',
              colorSecundario: c.colorSecundario || '#ffffff',
              icono: c.icono || '',
              banner: c.banner || { tipo: 'drive', valor: '' },
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBannerChange = (tipo, valor) => {
    setForm(prev => ({ ...prev, banner: { tipo, valor } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return toast.error('Nombre es requerido');
    setSaving(true);
    try {
      await adminSaveCategory(form, isEdit ? id : null);
      toast.success(isEdit ? 'Categoría actualizada' : 'Categoría creada');
      navigate('/admin-marketplay-2026/categorias');
    } catch {
      toast.error('Error al guardar');
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEdit ? 'Editar Categoría' : 'Nueva Categoría'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white">Información</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="label">Nombre *</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required className="input" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Descripción</label>
              <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} className="input" />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white">Diseño</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="label">Color Principal</label>
              <div className="flex gap-3">
                <input type="color" name="colorPrincipal" value={form.colorPrincipal} onChange={handleChange} className="w-12 h-12 rounded-lg cursor-pointer border-0" />
                <input name="colorPrincipal" value={form.colorPrincipal} onChange={handleChange} className="input flex-1" />
              </div>
            </div>
            <div>
              <label className="label">Color Secundario</label>
              <div className="flex gap-3">
                <input type="color" name="colorSecundario" value={form.colorSecundario} onChange={handleChange} className="w-12 h-12 rounded-lg cursor-pointer border-0" />
                <input name="colorSecundario" value={form.colorSecundario} onChange={handleChange} className="input flex-1" />
              </div>
            </div>
            <div>
              <label className="label">Icono (emoji o clase)</label>
              <input name="icono" value={form.icono} onChange={handleChange} className="input" placeholder="🏪" />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white">Banner</h3>
          <ImageUploader label="Banner de la categoría" value={form.banner} onChange={handleBannerChange} />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            <HiOutlineSave className="w-5 h-5" /> {saving ? 'Guardando...' : 'Guardar Categoría'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
