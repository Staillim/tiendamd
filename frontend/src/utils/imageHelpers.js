export function getImageSrc(imagen) {
  if (!imagen) return null;
  if (typeof imagen === 'string') {
    if (imagen.startsWith('http') || imagen.startsWith('data:')) return imagen;
    return null;
  }
  if (imagen.tipo === 'base64') return imagen.valor;
  if (imagen.tipo === 'drive') return getDriveThumbnail(imagen.valor);
  return null;
}

function getDriveThumbnail(url) {
  if (!url) return null;

  const patterns = [
    /\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }
  }

  return url;
}

export function getImagesArray(product) {
  if (!product?.imagenes) return [];
  return product.imagenes.map(img => getImageSrc(img)).filter(Boolean);
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
