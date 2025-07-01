
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - in real app, this would call Supabase auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@example.com' && password === 'admin123') {
      // Create a mock session that persists
      const mockUser: User = {
        id: '1',
        email: 'admin@example.com',
        app_metadata: {},
        user_metadata: { name: 'Admin User' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        role: 'authenticated',
        updated_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        phone_confirmed_at: null,
        confirmation_sent_at: null,
        recovery_sent_at: null,
        email_change_sent_at: null,
        new_email: null,
        new_phone: null,
        invited_at: null,
        action_link: null,
        phone: null,
        factors: null,
        identities: null,
        is_anonymous: false,
        last_sign_in_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString()
      };
      
      const mockSession: Session = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: mockUser
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('mock-session', JSON.stringify(mockSession));
      
      setUser(mockUser);
      setSession(mockSession);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('mock-session');
    setUser(null);
    setSession(null);
  };

  // Check for stored session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem('mock-session');
    if (storedSession && !user) {
      try {
        const parsedSession = JSON.parse(storedSession);
        // Check if session is still valid (not expired)
        if (parsedSession.expires_at > Math.floor(Date.now() / 1000)) {
          setUser(parsedSession.user);
          setSession(parsedSession);
        } else {
          localStorage.removeItem('mock-session');
        }
      } catch (error) {
        console.error('Error parsing stored session:', error);
        localStorage.removeItem('mock-session');
      }
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
