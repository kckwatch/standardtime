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
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          await createUserProfile(authUser);
          return;
        }
      }

      if (profile) {
        setUser({
          id: profile.id,
          email: authUser.email || '',
          displayName: profile.display_name || '',
          isAdmin: profile.is_admin || authUser.email === 'standardtimepiece@gmail.com',
          emailConfirmed: true
        });
      } else {
        // Create profile if it doesn't exist
        await createUserProfile(authUser);
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      // Set basic user info even if profile loading fails
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        displayName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
        isAdmin: authUser.email === 'standardtimepiece@gmail.com',
        emailConfirmed: true
      });
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (authUser: User, isAdmin: boolean = false) => {
    try {
      console.log('Creating new profile for user:', authUser.email);
      
      const newProfile = {
        id: authUser.id,
        email: authUser.email || '',
        display_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
        is_admin: isAdmin || authUser.email === 'standardtimepiece@gmail.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert([newProfile], { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }

      setUser({
        id: authUser.id,
        email: authUser.email || '',
        displayName: newProfile.display_name,
        isAdmin: newProfile.is_admin,
        emailConfirmed: true
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      // Set basic user info even if profile creation fails
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        displayName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
        isAdmin: isAdmin || authUser.email === 'standardtimepiece@gmail.com',
        emailConfirmed: true
      });
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

      // Special handling for admin email - disable email confirmation
      const isAdminEmail = email === 'standardtimepiece@gmail.com';
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            is_admin: isAdminEmail,
          },
          emailRedirectTo: undefined, // Disable email confirmation for admin
        },
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      console.log('Signup successful:', data);

      // For admin email, try to create profile immediately
      if (isAdminEmail && data.user) {
        try {
          await createUserProfile(data.user, true); // true for admin
          return {}; // No verification needed for admin
        } catch (profileError) {
          console.error('Admin profile creation failed:', profileError);
          // Continue with normal flow
        }
      }
      
      // If user needs email verification
      if (data.user && !data.user.email_confirmed_at && !isAdminEmail) {
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

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful:', data.user?.email);
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
      // Force logout even on error
      setUser(null);
      setSession(null);
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