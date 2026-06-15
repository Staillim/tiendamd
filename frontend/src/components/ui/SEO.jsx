import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../context/SettingsContext';
import { getImageSrc } from '../../utils/imageHelpers';

export default function SEO({ title, description, keywords, image, url }) {
  const { settings } = useSettings();
  const siteName = settings.nombre || 'MarketPlay';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const desc = description || settings.descripcion || 'Marketplace Premium';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={getImageSrc(image)} />}
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={url || window.location.href} />
    </Helmet>
  );
}
