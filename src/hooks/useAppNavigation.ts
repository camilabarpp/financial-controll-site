import { useNavigate } from 'react-router-dom';

export const useAppNavigation = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL || '';

  const navigateTo = (path: string) => {
    // Remove o baseUrl se estiver no início do path
    const cleanPath = path.startsWith(baseUrl) 
      ? path.substring(baseUrl.length) 
      : path;
    
    // Remove a barra inicial se existir
    const normalizedPath = cleanPath.startsWith('/') 
      ? cleanPath 
      : `/${cleanPath}`;

    navigate(normalizedPath);
  };

  return { navigateTo };
};