import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Component for protecting routes that require authentication
 * Redirects to login page if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();
  
  // If user is not authenticated, redirect to login with the current path as redirect parameter
  if (!isAuthenticated) {
    // Save the current location they were trying to go to
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace={true}
      />
    );
  }

  return children;
};

export default ProtectedRoute;