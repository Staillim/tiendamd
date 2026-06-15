import { useState } from 'react';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { getImageSrc } from '../../utils/imageHelpers';

export default function ImageRenderer({ imagen, alt = '', className = '' }) {
  const [error, setError] = useState(false);
  const src = getImageSrc(imagen);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 ${className}`}>
        <HiOutlinePhotograph className="w-12 h-12" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}
