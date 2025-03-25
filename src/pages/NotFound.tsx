
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FixedNavMenu } from '@/components/layout/FixedNavMenu';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-cream-50">
        <div className="text-center p-6">
          <h1 className="text-6xl font-bold text-terracotta-600 mb-4">404</h1>
          <p className="text-2xl text-gray-700 mb-8">Oops! Page introuvable</p>
          <p className="text-gray-600 mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-terracotta-600 text-white px-6 py-3 rounded-md hover:bg-terracotta-700 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </main>
      <Footer />
      <FixedNavMenu />
    </div>
  );
};

export default NotFound;
