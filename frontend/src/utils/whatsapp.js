export function generateWhatsAppMessage(product) {
  const url = `${window.location.origin}/producto/${product.slug}`;
  return `Hola, estoy interesado en el siguiente producto.%0A%0A*Nombre:* ${product.nombre}%0A*Precio:* $${product.precio}%0A*Enlace:* ${url}%0A%0A¿Está disponible?`;
}

export function openWhatsApp(phone, product) {
  const message = generateWhatsAppMessage(product);
  const cleanPhone = phone.replace(/\D/g, '');
  window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
}
