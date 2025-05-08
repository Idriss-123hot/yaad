
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth.tsx'
import { CartProvider } from './hooks/useCart.tsx'
import { WishlistProvider } from './hooks/useWishlist.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LanguageProvider } from './contexts/LanguageContext.tsx'
import { RTLProvider } from './components/layout/RTLProvider.tsx'

// Create a client
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <RTLProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <App />
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </RTLProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>,
)
