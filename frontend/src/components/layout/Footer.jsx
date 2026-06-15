import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';
import { BsWhatsapp, BsFacebook, BsInstagram, BsTiktok, BsYoutube } from 'react-icons/bs';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{settings.nombre}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md">
              {settings.descripcion}
            </p>
            <div className="flex items-center gap-4 mt-4">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <BsFacebook className="w-5 h-5" />
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                  <BsInstagram className="w-5 h-5" />
                </a>
              )}
              {settings.tiktok && (
                <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <BsTiktok className="w-5 h-5" />
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                  <BsYoutube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Enlaces</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Inicio</Link>
              <Link to="/blog" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Blog</Link>
              <Link to="/buscar" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Buscar</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Contacto</h4>
            <div className="space-y-2">
              {settings.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors">
                  <BsWhatsapp className="w-4 h-4" /> WhatsApp
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                  <HiOutlineMail className="w-4 h-4" /> {settings.email}
                </a>
              )}
              {settings.direccion && (
                <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <HiOutlineLocationMarker className="w-4 h-4" /> {settings.direccion}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} {settings.nombre}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
