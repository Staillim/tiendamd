import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
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
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const { data } = await api.get('/settings');
      if (data && Object.keys(data).length > 0) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch {
      // use defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

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
    <SettingsContext.Provider value={{ settings, loading, updateSettings, refetch: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings debe usarse dentro de SettingsProvider');
  return context;
}
