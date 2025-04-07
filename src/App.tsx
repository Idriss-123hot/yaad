
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Artisans from './pages/Artisans';
import ArtisanDetail from './pages/ArtisanDetail';
import Categories from './pages/Categories';
import SearchResults from './pages/SearchResults';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import ProductsList from './pages/admin/products/ProductsList';
import NewProduct from './pages/admin/products/NewProduct';
import EditProduct from './pages/admin/products/EditProduct';
import ArtisansList from './pages/admin/artisans/ArtisansList';
import AdminArtisanNew from './pages/admin/artisans/NewArtisan';
import EditArtisan from './pages/admin/artisans/EditArtisan';
import CategoriesList from './pages/admin/categories/CategoriesList';

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/artisans" element={<Artisans />} />
      <Route path="/artisans/:id" element={<ArtisanDetail />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<ProductsList />} />
      <Route path="/admin/products/new" element={<NewProduct />} />
      <Route path="/admin/products/:id" element={<EditProduct />} />
      <Route path="/admin/artisans" element={<ArtisansList />} />
      <Route path="/admin/artisans/new" element={<AdminArtisanNew />} />
      <Route path="/admin/artisans/:id" element={<EditArtisan />} />
      <Route path="/admin/categories" element={<CategoriesList />} />
    </Routes>
  );
}

export default App;
