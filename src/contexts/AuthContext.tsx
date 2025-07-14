import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';

interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  isAdmin?: boolean;
  emailConfirmed?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, confirmPassword: string, fullName: string) => Promise<{ needsVerification?: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: User) => {
    try {
      console.log('Loading profile for user:', authUser.email);
      
      // Check if user profile exists in profiles table
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, display_name, phone, address, city, country, is_admin')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
      }

      const profile = profiles;

      // Create profile if it doesn't exist (fallback in case trigger didn't work)
      if (!profile) {
        console.log('Creating new profile for user:', authUser.email);
        
        const newProfile = {
          id: authUser.id,
          email: authUser.email || '',
          display_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
          is_admin: authUser.email === 'standardtimepiece@gmail.com'
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (insertError) {
          console.error('Error creating profile:', insertError);
        }

        setUser({
          id: authUser.id,
          email: authUser.email || '',
          displayName: newProfile.display_name,
          isAdmin: newProfile.is_admin,
          emailConfirmed: authUser.email_confirmed_at ? true : false
        });
      } else {
        setUser({
          id: profile.id,
          email: authUser.email || '',
          displayName: profile.display_name || '',
          isAdmin: profile.is_admin || authUser.email === 'standardtimepiece@gmail.com',
          emailConfirmed: authUser.email_confirmed_at ? true : false
        });
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      // Set basic user info even if profile creation fails
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        displayName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
        isAdmin: authUser.email === 'standardtimepiece@gmail.com',
        emailConfirmed: authUser.email_confirmed_at ? true : false
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, confirmPassword: string, fullName: string) => {
    try {
      // Validate password confirmation
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate password strength
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      
      if (!hasLetter || !hasNumber) {
        throw new Error('Password must contain both letters and numbers');
      }

      console.log('Signing up user:', email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/signin`
        },
      });

      if (error) throw error;

      console.log('Signup result:', data);


      // Profile will be created automatically by the database trigger
      // No need to manually insert into profiles table here

      // If user needs to confirm email
      if (data.user && !data.session) {
        return { needsVerification: true };
      }

      return {};
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('Sign in successful:', data.user?.email);

      if (!data.user?.email_confirmed_at) {
        throw new Error('Please verify your email address before signing in. Check your inbox for a verification link.');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user state immediately
      setUser(null);
      setSession(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const resendVerification = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/signin`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Resend verification error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    resendVerification
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-burgundy-900"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};