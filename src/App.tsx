import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Artisans from './pages/Artisans'
import ArtisanDetails from './pages/ArtisanDetails'
import Categories from './pages/Categories'
import AdminDashboard from './pages/admin/Dashboard'
import ArtisanDashboard from './pages/artisan/Dashboard'
import Auth from './pages/Auth'
import ResetPassword from './pages/ResetPassword';
import AdminLogin from './pages/admin/Login'
import ArtisanLogin from './pages/artisan/Login'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/artisan/:id" element={<ArtisanDetails />} />
        <Route path="/categories" element={<Categories />} />

        {/* Routes d'authentification et profil */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Routes administrateur */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Routes artisan */}
        <Route path="/artisan/login" element={<ArtisanLogin />} />
        <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
