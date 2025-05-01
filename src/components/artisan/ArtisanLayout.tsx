
import React, { ReactNode } from 'react';
import ArtisanSidebar from './ArtisanSidebar';
import { ArtisanHeader } from './ArtisanHeader';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Loader2 } from 'lucide-react';

interface ArtisanLayoutProps {
  children: ReactNode;
}

export function ArtisanLayout({ children }: ArtisanLayoutProps) {
  const { isAuthorized, isLoading } = useProtectedRoute('artisan');

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-terracotta-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    // The useProtectedRoute hook will automatically redirect
    // This is just a fallback
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <ArtisanSidebar />
      <div className="flex flex-col flex-1">
        <ArtisanHeader onMenuButtonClick={() => {}} />
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

export default ArtisanLayout;
