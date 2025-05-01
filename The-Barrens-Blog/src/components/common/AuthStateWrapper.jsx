import { useAuth } from '../../hooks/useAuth';
import GlobalLoader from './GlobalLoader';

export default function AuthStateWrapper({ children }) {
  const { authLoading } = useAuth();
  
  if (authLoading) {
    return <GlobalLoader />;
  }
  
  return <>{children}</>;
}