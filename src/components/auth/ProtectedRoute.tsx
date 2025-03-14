import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../utils/cookies';
import Cookies from 'js-cookie';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('token');
      if (!token) {
        clearAuth(); // Update Zustand state
        navigate('/Login'); // Redirect to login
      }
    };

    const interval = setInterval(checkAuth, 1000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [clearAuth, navigate]);

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
