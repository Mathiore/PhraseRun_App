
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface User {
  username: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    username: '',
    isAuthenticated: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('wordlyUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Simple hardcoded authentication for demo purposes
    if (username === 'admin' && password === 'admin') {
      const user = { username: 'admin', isAuthenticated: true };
      setUser(user);
      localStorage.setItem('wordlyUser', JSON.stringify(user));
      toast({ 
        title: "Login successful",
        description: "Welcome to Learn One Word a Day!" 
      });
      return true;
    } else {
      toast({ 
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setUser({ username: '', isAuthenticated: false });
    localStorage.removeItem('wordlyUser');
    toast({ description: "You have been logged out" });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
