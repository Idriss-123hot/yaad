
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const navigate = useNavigate();

  // Redirect to Search page which handles search results
  React.useEffect(() => {
    navigate('/search');
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirection vers la page de recherche...</p>
    </div>
  );
};

export default SearchResults;
