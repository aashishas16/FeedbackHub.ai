import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { storage } from '../utils/storage';
import { authUtils } from '../utils/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize sample data
    storage.initializeSampleData();
    
    // Check for stored token
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = authUtils.verifyToken(token);
      if (decoded) {
        const userData = storage.getUserById(decoded.userId);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const userData = storage.getUserByEmail(email);
    if (!userData) return false;

    const isValid = await authUtils.comparePassword(password, userData.password);
    if (!isValid) return false;

    const token = authUtils.generateToken(userData.id);
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
    return true;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Check if user already exists
    const existingUser = storage.getUserByEmail(email);
    if (existingUser) return false;

    const hashedPassword = await authUtils.hashPassword(password);
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    storage.addUser(newUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};