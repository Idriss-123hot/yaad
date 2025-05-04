
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import FixedNavMenu from '@/components/layout/FixedNavMenu';
import { useCategory } from '@/hooks/useCategories';

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { category, loading } = useCategory(id);

  // Redirect to search page with category filter
  useEffect(() => {
    if (!loading && category) {
      navigate(`/search?category=${category.slug}`, { replace: true });
    }
  }, [category, loading, navigate]);

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-terracotta-600"></div>
        </main>
        <Footer />
        <FixedNavMenu />
      </div>
    );
  }

  // This will only show briefly before redirect happens
  return null;
};

export default CategoryDetail;
