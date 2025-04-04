
import React from 'react'
import { Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Artisans />} />
        <Route path="/search" element={<Search />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/artisan/:id" element={<Artisans />} />
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
        
        {/* Route 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
