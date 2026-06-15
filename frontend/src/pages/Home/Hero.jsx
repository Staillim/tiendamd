import { motion } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';
import ImageRenderer from '../../components/ui/ImageRenderer';

export default function Hero() {
  const { settings } = useSettings();

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {settings.heroTitulo || 'Bienvenido a MarketPlay'}
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-lg">
              {settings.heroSubtitulo || 'Descubre productos increíbles al mejor precio.'}
            </p>
          </motion.div>

          {settings.heroImagen && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hidden lg:block"
            >
              <ImageRenderer
                imagen={settings.heroImagen}
                alt="Hero"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
          )}
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-100/50 dark:bg-blue-900/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-100/50 dark:bg-indigo-900/20 blur-3xl" />
      </div>
    </section>
  );
}
