import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any; needsMFA?: boolean }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }

      // Check AAL level to determine if MFA is needed
      const { data: { session } } = await supabase.auth.getSession();
      const aal = (session as any)?.aal;
      
      console.log('Sign in successful, AAL level:', aal);
      
      // aal1 means user needs to verify MFA
      if (aal === 'aal1') {
        return { error: null, needsMFA: true };
      }
      
      toast.success('Zalogowano pomyślnie!');
      return { error: null, needsMFA: false };
    } catch (err: any) {
      console.error('Sign in error:', err);
      toast.error(err.message || 'Błąd logowania');
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Wylogowano pomyślnie');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Błąd wylogowania');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, signIn, signOut, loading }}>
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
