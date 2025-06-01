// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Modification ici
import { Toaster } from '@/components/ui/toaster';
import { CurrencyProvider } from '@/contexts/CurrencyContext'; // Conservé
// Les imports de LanguageProvider, RTLProvider, QueryClient ont été supprimés s'ils étaient là
import { AdminBanner } from '@/components/layout/AdminBanner';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { SessionTimeout } from '@/components/shared/SessionTimeout';

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
import SalesList from './pages/admin/sales/SalesList';
import SupportList from './pages/admin/support/SupportList';
import CategoriesList from './pages/admin/categories/CategoriesList';
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
import ArtisanLogin from './pages/artisan/Login';
import ArtisanDashboard from './pages/artisan/Dashboard';
import ArtisanProductsList from './pages/artisan/products/ProductsList';
import ArtisanProductNew from './pages/artisan/products/NewProduct';
import ArtisanProductEdit from './pages/artisan/products/EditProduct';
import ArtisanOrders from './pages/artisan/orders/OrdersList';
import ArtisanStatistics from './pages/artisan/stats/Statistics';
import ArtisanSupport from './pages/artisan/support/ArtisanSupport';
import ArtisanMessages from './pages/artisan/messages/ArtisanMessages';
import ArtisanSettings from './pages/artisan/settings/Settings';

// const queryClient = new QueryClient(); // Supprimé

function App() {
  useEffect(() => {
    // S'assurer que le thème clair est appliqué au démarrage si c'est le comportement désiré
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);

  return (
    // QueryClientProvider, LanguageProvider, RTLProvider, et Router sont supprimés ici
    <CurrencyProvider> {/* CurrencyProvider reste ici */}
      <div className="min-h-screen bg-background font-sans antialiased">
        <AdminBanner />
        
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<Home />} />
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
          
          {/* Artisan routes */}
          <Route path="/artisan/login" element={<ArtisanLogin />} />
          <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
          <Route path="/artisan/products" element={<ArtisanProductsList />} />
          <Route path="/artisan/products/new" element={<ArtisanProductNew />} />
          <Route path="/artisan/products/:id/edit" element={<ArtisanProductEdit />} />
          <Route path="/artisan/orders" element={<ArtisanOrders />} />
          <Route path="/artisan/stats" element={<ArtisanStatistics />} />
          <Route path="/artisan/support" element={<ArtisanSupport />} />
          <Route path="/artisan/messages" element={<ArtisanMessages />} />
          <Route path="/artisan/help" element={<ArtisanSupport />} />
          <Route path="/artisan/settings" element={<ArtisanSettings />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductsList />} />
          <Route path="/admin/products/new" element={<NewProduct />} />
          <Route path="/admin/products/:id/edit" element={<EditProduct />} />
          <Route path="/admin/artisans" element={<ArtisansList />} />
          <Route path="/admin/artisans/new" element={<AdminArtisanNew />} />
          <Route path="/admin/artisans/:id/edit" element={<EditArtisan />} />
          <Route path="/admin/sales" element={<SalesList />} />
          <Route path="/admin/support" element={<SupportList />} />
          <Route path="/admin/categories" element={<CategoriesList />} />
          <Route path="/admin/blog" element={<BlogsList />} />
          <Route path="/admin/blog/new" element={<NewBlog />} />
          <Route path="/admin/blog/edit/:id" element={<EditBlog />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <ChatWidget />
        <SessionTimeout redirectPath="/auth" />
        <Toaster />
      </div>
    </CurrencyProvider>
  );
}

export default App;
