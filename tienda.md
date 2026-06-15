# MarketPlay - Plataforma Marketplace Universal

## Descripción General

MarketPlay es una plataforma marketplace moderna desarrollada con React, Node.js y Firebase que permite vender cualquier tipo de producto sin necesidad de que los compradores se registren.

El objetivo es disponer de una única plataforma adaptable a múltiples nichos:

* Moda femenina
* Moda masculina
* Tecnología
* Videojuegos
* Hogar
* Belleza
* Accesorios
* Mascotas
* Deportes
* Productos digitales

Cada categoría tendrá una identidad visual propia configurable desde el panel administrativo.

---

# Tecnologías

## Frontend

* React
* React Router
* Tailwind CSS
* Framer Motion
* Axios

## Backend

* Node.js
* Express

## Base de Datos

* Firebase Firestore

## Autenticación

* Firebase Authentication
* Solo administradores

---

# Objetivos del Proyecto

* Marketplace universal
* Sin registro de clientes
* Ventas por WhatsApp
* Administración sencilla
* Configuración visual desde panel
* SEO amigable
* Responsive
* PWA instalable
* Escalable

---

# Estructura del Proyecto

/frontend

/backend

/docs

---

# Funcionalidades Principales

## Catálogo de Productos

* Listado de productos
* Productos destacados
* Productos recientes
* Productos más vistos
* Ofertas
* Filtros
* Buscador inteligente

## Categorías

Cada categoría tendrá:

* Nombre
* Slug
* Icono
* Banner
* Color principal
* Color secundario
* Configuración visual

Ejemplo:

Tecnología

* Azul eléctrico
* Negro

Moda Mujer

* Rosa
* Blanco
* Dorado

Gaming

* Morado
* Azul neón

---

# Sistema de Productos

Campos:

* ID
* Nombre
* Slug
* Descripción
* Precio
* Precio Anterior
* Categoría
* Subcategoría
* Marca
* Stock
* Etiquetas
* Estado
* Imágenes
* Video
* Visitas
* Destacado
* Fecha

---

# Sistema de Imágenes

El sistema soportará dos métodos.

## Método 1 - Base64

Las imágenes pueden almacenarse directamente en Firestore.

Ventajas:

* No requiere hosting externo
* Gestión simple

Ideal para:

* Logos
* Banners
* Catálogos pequeños

---

## Método 2 - Google Drive

Las imágenes pueden alojarse en Google Drive.

Proceso:

1. Subir imagen a Drive.
2. Obtener enlace público.
3. Guardar URL en Firestore.
4. Mostrar imagen desde Drive.

Ventajas:

* Menor consumo de Firestore
* Imágenes ilimitadas
* Más rápido para catálogos grandes

---

# Modelo de Imagen

{
tipo: "base64",
valor: "data:image/webp;base64,..."
}

o

{
tipo: "drive",
valor: "https://drive.google.com/..."
}

---

# Página Principal

## Hero

Banner principal dinámico.

Elementos:

* Imagen
* Título
* Subtítulo
* Botón principal

---

## Categorías Destacadas

Carrusel horizontal.

---

## Productos Destacados

Grid dinámico.

---

## Productos Recientes

Grid dinámico.

---

## Ofertas

Sección configurable.

---

# Página de Categoría

URL:

/categoria/:slug

Funciones:

* Filtros
* Ordenamiento
* Paginación
* Buscador

---

# Página de Producto

URL:

/producto/:slug

Contenido:

* Galería
* Video
* Precio
* Descripción
* Especificaciones
* Productos relacionados

---

# Sistema WhatsApp

Todas las ventas terminan por WhatsApp.

Botón:

Comprar Ahora

Mensaje generado:

Hola, estoy interesado en el siguiente producto.

Nombre:
Precio:
Enlace:

¿Está disponible?

---

# Blog

URL:

/blog

Permite publicar:

* Noticias
* Tutoriales
* Guías
* Promociones

Objetivo:

Mejorar posicionamiento SEO.

---

# Buscador Global

Búsqueda instantánea.

Busca por:

* Nombre
* Marca
* Categoría
* Etiquetas

---

# Panel Administrativo

Ruta privada.

Ejemplo:

/admin-marketplay-2026

---

# Login Administrador

Acceso exclusivo para administradores.

Los clientes nunca verán el login.

---

# Dashboard

Métricas:

* Productos
* Categorías
* Publicaciones
* Visitas
* Productos más vistos

---

# Gestión de Productos

Crear

Editar

Eliminar

Duplicar

Destacar

Ocultar

Programar

---

# Gestión de Categorías

Crear

Editar

Eliminar

Personalizar diseño

---

# Gestión de Publicaciones

Crear

Editar

Eliminar

Programar

---

# Configuración General

Editable desde panel.

## Información

* Nombre
* Logo
* Favicon

## Contacto

* WhatsApp
* Correo
* Dirección

## Redes

* Facebook
* Instagram
* TikTok
* YouTube

---

# Sistema de Temas

Configuración visual global.

Opciones:

* Claro
* Oscuro
* Automático

---

# Sistema SEO

Cada producto tendrá:

* Meta Title
* Meta Description
* Keywords
* URL amigable

Ejemplo:

/producto/iphone-15-pro-max

---

# Firestore

Colección: configuracion

Colección: usuarios

Colección: productos

Colección: categorias

Colección: publicaciones

Colección: visitas

Colección: configuraciones

---

# Seguridad

Reglas:

* Solo administradores crean contenido.
* Clientes solo leen contenido.
* Panel oculto.
* Validación de sesión.
* Protección de rutas privadas.

---

# Futuras Funcionalidades

* Comparador de productos
* Favoritos
* Sistema de cupones
* Chat en vivo
* Múltiples administradores
* Integración IA
* Importación masiva
* Exportación Excel
* API pública

---

# Objetivo Final

Crear una plataforma marketplace premium, adaptable a cualquier nicho, administrada desde un panel intuitivo y enfocada en maximizar conversiones mediante contacto directo por WhatsApp sin necesidad de registro de usuarios.
