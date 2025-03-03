import { useState, useEffect, createContext, useContext } from 'react';

interface UserProfile {
  twitterConnected?: boolean;
  twitterAccessToken?: string;
  twitterUsername?: string;
  walletAddress?: string;
  [key: string]: any;
}

interface AuthContextType {
  userProfile: UserProfile | null;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user data from localStorage on init
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUserProfile(userData);
          setIsAuthenticated(!!userData);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  }, []);

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...data };
      
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updated));
      }
      
      // Update authentication status if needed
      if (!isAuthenticated) {
        setIsAuthenticated(true);
      }
      
      return updated;
    });
  };

  const logout = () => {
    setUserProfile(null);
    setIsAuthenticated(false);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      userProfile, 
      updateUserProfile, 
      isAuthenticated, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;
