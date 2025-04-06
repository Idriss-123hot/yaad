
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Artisans from './pages/Artisans'
import Categories from './pages/Categories'
import AdminDashboard from './pages/admin/Dashboard'
import ArtisanDashboard from './pages/artisan/Dashboard'
import Auth from './pages/Auth'
import ResetPassword from './pages/ResetPassword'
import AdminLogin from './pages/admin/Login'
import ArtisanLogin from './pages/artisan/Login'
import { Toaster } from '@/components/ui/toaster'
import NotFound from './pages/NotFound'
import Favorites from './pages/Favorites'
import Search from './pages/Search'
import Index from './pages/Index'
import CategoryDetail from './pages/CategoryDetail'
import CategoryDetailWithProducts from './pages/CategoryDetailWithProducts'
import ArtisanDetail from './pages/ArtisanDetail'
import ProductDetail from './pages/ProductDetail'
import ProductPage from './pages/ProductPage'
import FeaturedProductDetail from './pages/FeaturedProductDetail'
import Contact from './pages/Contact'
import About from './pages/About'
import Blog from './pages/Blog'
import AdminProductsList from './pages/admin/products/ProductsList'
import AdminProductNew from './pages/admin/products/NewProduct'
import AdminProductEdit from './pages/admin/products/EditProduct'
import AdminArtisansList from './pages/admin/artisans/ArtisansList'
import AdminArtisanNew from './pages/admin/artisans/NewArtisan'
import ArtisanProductsList from './pages/artisan/products/ProductsList'
import ArtisanProductNew from './pages/artisan/products/NewProduct'
import ArtisanProductEdit from './pages/artisan/products/EditProduct'

function App() {
  return (
    <>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<Search />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/artisan/:id" element={<ArtisanDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:slug" element={<CategoryDetail />} />
        <Route path="/categories/:mainCategory/:subCategory" element={<CategoryDetailWithProducts />} />
        
        {/* Routes des produits */}
        <Route path="/products/:productId" element={<ProductPage />} />
        <Route path="/featured/:productId" element={<FeaturedProductDetail />} />

        {/* Routes de contenu statique */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        
        {/* Routes d'authentification et profil */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Routes administrateur */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProductsList />} />
        <Route path="/admin/products/new" element={<AdminProductNew />} />
        <Route path="/admin/products/:id/edit" element={<AdminProductEdit />} />
        <Route path="/admin/artisans" element={<AdminArtisansList />} />
        <Route path="/admin/artisans/new" element={<AdminArtisanNew />} />

        {/* Routes artisan */}
        <Route path="/artisan/login" element={<ArtisanLogin />} />
        <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
        <Route path="/artisan/products" element={<ArtisanProductsList />} />
        <Route path="/artisan/products/new" element={<ArtisanProductNew />} />
        <Route path="/artisan/products/:id/edit" element={<ArtisanProductEdit />} />
        
        {/* Route 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
