import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authService } from '@/services';
import { STORAGE_KEYS } from '@/constants';
import type { User, LoginRequest, LoginResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  const logout = useCallback(async (): Promise<void> => {
    try {
      if (token) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  }, [token]);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          
          // Verify token is still valid
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(currentUser));
          } catch {
            // Token is invalid, clear auth data
            await logout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [logout]);

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        const { token: newToken, user: userData } = response.data;
        
        setToken(newToken);
        setUser(userData);
        
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      }
      
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (token) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(currentUser));
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      await logout();
    }
  };

  const contextValue: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
