
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import Search from './pages/Search';
import ProductDetail from './pages/ProductDetail';
import FeaturedProductDetail from './pages/FeaturedProductDetail';
import Artisans from './pages/Artisans';
import ArtisanDetail from './pages/ArtisanDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import CategoryDetailWithProducts from './pages/CategoryDetailWithProducts';
import { Toaster } from './components/ui/toaster';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:mainCategory" element={<CategoryDetail />} />
        <Route path="/categories/:mainCategory/:subCategory" element={<CategoryDetailWithProducts />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/featured/:productId" element={<FeaturedProductDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/artisans/:id" element={<ArtisanDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
