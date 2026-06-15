import SEO from '../../components/ui/SEO';
import Hero from './Hero';
import FeaturedCategories from './FeaturedCategories';
import FeaturedProducts from './FeaturedProducts';
import RecentProducts from './RecentProducts';
import Offers from './Offers';
import { useSettings } from '../../context/SettingsContext';

export default function Home() {
  const { settings } = useSettings();

  return (
    <>
      <SEO title={settings.nombre} description={settings.descripcion} />
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <Offers />
      <RecentProducts />
    </>
  );
}
