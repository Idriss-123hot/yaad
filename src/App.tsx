
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import Search from './pages/Search';
import ProductDetail from './pages/ProductDetail';
import FeaturedProductDetail from './pages/FeaturedProductDetail';
import Artisans from './pages/Artisans';
import ArtisanDetail from './pages/ArtisanDetail';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import CategoryDetailWithProducts from './pages/CategoryDetailWithProducts';
import { Toaster } from './components/ui/toaster';
import BecomeArtisan from './pages/BecomeArtisan';

// Routes Admin
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ArtisansList from './pages/admin/artisans/ArtisansList';
import NewArtisan from './pages/admin/artisans/NewArtisan';

// Routes Artisan
import ArtisanLogin from './pages/artisan/Login';
import ArtisanDashboard from './pages/artisan/Dashboard';

import './App.css';

/**
 * Composant principal de l'application
 * 
 * Définit toutes les routes de l'application et leurs composants associés.
 * Inclut également le composant Toaster pour afficher des notifications.
 */
function App() {
  return (
    <>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:mainCategory" element={<CategoryDetail />} />
        <Route path="/categories/:mainCategory/:subCategory" element={<CategoryDetailWithProducts />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/featured/:productId" element={<FeaturedProductDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/artisans/:id" element={<ArtisanDetail />} />
        <Route path="/become-artisan" element={<BecomeArtisan />} />
        
        {/* Routes Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/artisans" element={<ArtisansList />} />
        <Route path="/admin/artisans/new" element={<NewArtisan />} />
        
        {/* Routes Artisan */}
        <Route path="/artisan/login" element={<ArtisanLogin />} />
        <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
