import { BsWhatsapp } from 'react-icons/bs';
import { openWhatsApp } from '../../utils/whatsapp';
import { useSettings } from '../../context/SettingsContext';

export default function WhatsAppButton({ product, className = '' }) {
  const { settings } = useSettings();

  if (!settings.whatsapp) return null;

  return (
    <button
      onClick={() => openWhatsApp(settings.whatsapp, product)}
      className={`btn-whatsapp ${className}`}
    >
      <BsWhatsapp className="w-5 h-5" />
      Comprar Ahora
    </button>
  );
}
