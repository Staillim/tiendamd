import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/ui/ProtectedRoute';

import Home from './pages/Home/Home';
import Category from './pages/Category/Category';
import Product from './pages/Product/Product';
import Blog from './pages/Blog/Blog';
import BlogPost from './pages/Blog/BlogPost';
import Search from './pages/Search/Search';

import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import CategoryList from './pages/admin/CategoryList';
import CategoryForm from './pages/admin/CategoryForm';
import PostList from './pages/admin/PostList';
import PostForm from './pages/admin/PostForm';
import AdminSettings from './pages/admin/Settings';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <SettingsProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/categoria/:slug" element={<Category />} />
                <Route path="/producto/:slug" element={<Product />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/buscar" element={<Search />} />
              </Route>

              <Route path="/admin-marketplay-2026/login" element={<AdminLogin />} />
              <Route
                path="/admin-marketplay-2026"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="productos" element={<ProductList />} />
                <Route path="productos/nuevo" element={<ProductForm />} />
                <Route path="productos/editar/:id" element={<ProductForm />} />
                <Route path="categorias" element={<CategoryList />} />
                <Route path="categorias/nuevo" element={<CategoryForm />} />
                <Route path="categorias/editar/:id" element={<CategoryForm />} />
                <Route path="publicaciones" element={<PostList />} />
                <Route path="publicaciones/nuevo" element={<PostForm />} />
                <Route path="publicaciones/editar/:id" element={<PostForm />} />
                <Route path="configuracion" element={<AdminSettings />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" toastOptions={{
            style: {
              borderRadius: '12px',
              background: '#1f2937',
              color: '#f9fafb',
              fontSize: '14px',
            },
          }} />
        </SettingsProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
