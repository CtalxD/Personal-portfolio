import { useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';

export const usePortfolioSync = () => {
  const { loadFromLocalStorage } = useAdmin();

  useEffect(() => {
    const handleDataUpdate = () => {
      loadFromLocalStorage();
    };
    
    window.addEventListener('portfolioDataUpdated', handleDataUpdate);
    return () => window.removeEventListener('portfolioDataUpdated', handleDataUpdate);
  }, [loadFromLocalStorage]);
};