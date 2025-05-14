import { createContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import getIcon from './utils/iconUtils';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      return true;
    }
    return false;
  });
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
		let redirectPath = new URLSearchParams(window.location.search).get('redirect');
		const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
				'/callback') || currentPath.includes('/error');
		if (user) {
			// User is authenticated
			if (redirectPath) {
				navigate(redirectPath);
			} else if (!isAuthPage) {
				if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
					navigate(currentPath);
				} else {
					navigate('/dashboard');
				}
			} else {
				navigate('/dashboard');
			}
			// Store user information in Redux
			dispatch(setUser(JSON.parse(JSON.stringify(user))));
		} else {
			// User is not authenticated
			if (!isAuthPage) {
				navigate(
					currentPath.includes('/signup')
					 ? `/signup?redirect=${currentPath}`
					 : currentPath.includes('/login')
					 ? `/login?redirect=${currentPath}`
					 : '/login');
			} else if (redirectPath) {
				if (
					![
						'error',
						'signup',
						'login',
						'callback'
					].some((path) => currentPath.includes(path)))
					navigate(`/login?redirect=${redirectPath}`);
				else {
					navigate(currentPath);
				}
			} else if (isAuthPage) {
				navigate(currentPath);
			} else {
				navigate('/login');
			}
			dispatch(clearUser());
		}
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        navigate('/error?message=' + encodeURIComponent(error.message || 'Authentication failed'));
      }
    });
    
    setIsInitialized(true);
  }, [dispatch, navigate]);
  
  // Apply dark mode theme class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    isAuthenticated,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen">
        <div className="fixed bottom-4 right-4 z-10">
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-full bg-surface-200 dark:bg-surface-700 shadow-soft hover:scale-105 transition-all"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-blue-700" />
            )}
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/error" element={<ErrorPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
        />
      </div>
    </AuthContext.Provider>
  );
}

// Define icons
const SunIcon = getIcon('Sun');
const MoonIcon = getIcon('Moon');

export default App;