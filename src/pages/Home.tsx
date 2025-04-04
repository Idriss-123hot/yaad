
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  // Redirect to Artisans page for now
  useEffect(() => {
    navigate('/artisans');
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirection...</p>
    </div>
  );
}
