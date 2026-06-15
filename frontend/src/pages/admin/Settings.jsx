import { useState } from 'react';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import ImageUploader from '../../components/ui/ImageUploader';
import { HiOutlineSave } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { THEME_OPTIONS } from '../../utils/constants';

export default function AdminSettings() {
  const { settings, updateSettings } = useSettings();
  const [form, setForm] = useState({ ...settings });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (field) => (tipo, valor) => {
    setForm(prev => ({ ...prev, [field]: { tipo, valor } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/configuracion', form);
      updateSettings(form);
      toast.success('Configuración guardada');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración General</h2>
        <p className="mt-1 text-sm text-gray-500">Personaliza tu plataforma</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white">Información General</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="label">Nombre del Sitio</label>
              <input name="nombre" value={form.nombre || ''} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Descripción</label>
              <input name="descripcion" value={form.descripcion || ''} onChange={handleChange} className="input" />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white">Hero Section</h3>
          <div className="grid gap-5">
            <div>
              <label className="label">Título Hero</label>
              <input name="heroTitulo" value={form.heroTitulo || ''} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Subtítulo Hero</label>
              <input name="heroSubtitulo" value={form.heroSubtitulo || ''} onChange={handleChange} className="input" />
            </div>
            <ImageUploader
              label="Imagen Hero"
              value={form.heroImagen}
              onChange={handleImageChange('heroImagen')}
            />
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white">Logos</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <ImageUploader
              label="Logo"
              value={form.logo}
              onChange={handleImageChange('logo')}
            />
            <ImageUploader
              label="Favicon"
              value={form.favicon}
              onChange={handleImageChange('favicon')}
            />
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white">Contacto</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="label">WhatsApp (número)</label>
              <input name="whatsapp" value={form.whatsapp || ''} onChange={handleChange} className="input" placeholder="+521234567890" />
            </div>
            <div>
              <label className="label">Email</label>
              <input name="email" type="email" value={form.email || ''} onChange={handleChange} className="input" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Dirección</label>
              <input name="direccion" value={form.direccion || ''} onChange={handleChange} className="input" />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white">Redes Sociales</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="label">Facebook</label>
              <input name="facebook" value={form.facebook || ''} onChange={handleChange} className="input" placeholder="URL" />
            </div>
            <div>
              <label className="label">Instagram</label>
              <input name="instagram" value={form.instagram || ''} onChange={handleChange} className="input" placeholder="URL" />
            </div>
            <div>
              <label className="label">TikTok</label>
              <input name="tiktok" value={form.tiktok || ''} onChange={handleChange} className="input" placeholder="URL" />
            </div>
            <div>
              <label className="label">YouTube</label>
              <input name="youtube" value={form.youtube || ''} onChange={handleChange} className="input" placeholder="URL" />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white">Tema</h3>
          <select name="tema" value={form.tema || 'claro'} onChange={handleChange} className="input max-w-xs">
            {THEME_OPTIONS.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            <HiOutlineSave className="w-5 h-5" /> {saving ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </form>
    </div>
  );
}
