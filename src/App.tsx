import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Artisans from './pages/Artisans';
import ArtisanDetail from './pages/ArtisanDetail';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import CategoryDetailWithProducts from './pages/CategoryDetailWithProducts';
import SearchResults from './pages/SearchResults';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProductsList from './pages/admin/products/ProductsList';
import NewProduct from './pages/admin/products/NewProduct';
import EditProduct from './pages/admin/products/EditProduct';
import ArtisansList from './pages/admin/artisans/ArtisansList';
import AdminArtisanNew from './pages/admin/artisans/NewArtisan';
import EditArtisan from './pages/admin/artisans/EditArtisan';
import ArtisanModifications from './pages/admin/artisans/ArtisanModifications';
import CategoriesList from './pages/admin/categories/CategoriesList';
import Index from './pages/Index';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BlogsList from './pages/admin/blog/BlogsList';
import NewBlog from './pages/admin/blog/NewBlog';
import EditBlog from './pages/admin/blog/EditBlog';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import BecomeArtisan from './pages/BecomeArtisan';
import ResetPassword from './pages/ResetPassword';
import Search from './pages/Search';

function App() {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/home" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/artisans" element={<Artisans />} />
      <Route path="/artisans/:id" element={<ArtisanDetail />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/categories/:id" element={<CategoryDetail />} />
      <Route path="/categories/:id/products" element={<CategoryDetailWithProducts />} />
      <Route path="/search" element={<Search />} />
      <Route path="/search-results" element={<SearchResults />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/become-artisan" element={<BecomeArtisan />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<ProductsList />} />
      <Route path="/admin/products/new" element={<NewProduct />} />
      <Route path="/admin/products/:id" element={<EditProduct />} />
      <Route path="/admin/artisans" element={<ArtisansList />} />
      <Route path="/admin/artisans/new" element={<AdminArtisanNew />} />
      <Route path="/admin/artisans/:id" element={<EditArtisan />} />
      <Route path="/admin/artisans/modifications" element={<ArtisanModifications />} />
      <Route path="/admin/categories" element={<CategoriesList />} />
      <Route path="/admin/blog" element={<BlogsList />} />
      <Route path="/admin/blog/new" element={<NewBlog />} />
      <Route path="/admin/blog/edit/:id" element={<EditBlog />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
