
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  // Cette fonction n'est plus nécessaire car nous utilisons directement Index.tsx
  // Elle est conservée au cas où la redirection serait nécessaire dans le futur
  React.useEffect(() => {
    console.log('Home page loaded - No redirection needed anymore');
    // Plus de redirection automatique vers /artisans
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Cette page est conservée pour référence mais n'est plus utilisée. La page d'accueil est maintenant dans Index.tsx</p>
    </div>
  );
}
