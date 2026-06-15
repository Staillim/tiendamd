import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchSettings } from '../services/firestore';

const SettingsContext = createContext(null);

const defaultSettings = {
  nombre: 'MarketPlay',
  descripcion: 'Marketplace Premium',
  whatsapp: '',
  email: '',
  direccion: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  youtube: '',
  tema: 'claro',
  heroTitulo: 'Bienvenido a MarketPlay',
  heroSubtitulo: 'Descubre productos increíbles',
  logo: null,
  favicon: null,
  heroImagen: null,
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      const data = await fetchSettings();
      if (data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch {
      // use defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (settings.tema === 'oscuro') {
      document.documentElement.classList.add('dark');
    } else if (settings.tema === 'claro') {
      document.documentElement.classList.remove('dark');
    } else if (settings.tema === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, [settings.tema]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings, refetch: loadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings debe usarse dentro de SettingsProvider');
  return context;
}
