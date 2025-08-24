import { useAuth } from '@/contexts/AuthContext';

export const useUserRole = () => {
  const { user, isAuthenticated } = useAuth();
  
  return {
    role: user?.role || null,
    isAuthenticated,
    user,
  };
};