import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ImageUploader from '../../components/ui/ImageUploader';
import { HiOutlineSave, HiOutlineArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { POST_STATES } from '../../utils/constants';

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    titulo: '',
    extracto: '',
    contenido: '',
    imagen: { tipo: 'drive', valor: '' },
    estado: 'borrador',
  });

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api.get('/admin/publicaciones')
        .then(({ data }) => {
          const p = data.find(x => x.id === id);
          if (p) {
            setForm({
              titulo: p.titulo || '',
              extracto: p.extracto || '',
              contenido: p.contenido || '',
              imagen: p.imagen || { tipo: 'drive', valor: '' },
              estado: p.estado || 'borrador',
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

  const handleImageChange = (tipo, valor) => {
    setForm(prev => ({ ...prev, imagen: { tipo, valor } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return toast.error('Título es requerido');
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/admin/publicaciones/${id}`, form);
        toast.success('Publicación actualizada');
      } else {
        await api.post('/admin/publicaciones', form);
        toast.success('Publicación creada');
      }
      navigate('/admin-marketplay-2026/publicaciones');
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
          {isEdit ? 'Editar Publicación' : 'Nueva Publicación'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          <div className="grid gap-5">
            <div>
              <label className="label">Título *</label>
              <input name="titulo" value={form.titulo} onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="label">Extracto</label>
              <textarea name="extracto" value={form.extracto} onChange={handleChange} rows={2} className="input" placeholder="Breve descripción para el listado" />
            </div>
            <div>
              <label className="label">Contenido</label>
              <textarea name="contenido" value={form.contenido} onChange={handleChange} rows={12} className="input font-mono text-sm" placeholder="Escribe el contenido aquí..." />
            </div>
            <div>
              <label className="label">Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange} className="input">
                {POST_STATES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white">Imagen Destacada</h3>
          <ImageUploader
            label="Imagen de portada"
            value={form.imagen}
            onChange={handleImageChange}
          />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            <HiOutlineSave className="w-5 h-5" /> {saving ? 'Guardando...' : 'Guardar Publicación'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
