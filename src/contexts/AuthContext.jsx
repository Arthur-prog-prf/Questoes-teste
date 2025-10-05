import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  const profileOperations = {
    async load(userId) {
      if (!userId) return
      setProfileLoading(true)
      try {
        const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()
        if (!error) setUserProfile(data)
      } catch (error) {
        console.error('Profile load error:', error)
      } finally {
        setProfileLoading(false)
      }
    },
    clear() {
      setUserProfile(null)
      setProfileLoading(false)
    }
  }

  const authStateHandlers = {
    onChange: (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false) // AQUI é onde o 'loading' se torna 'false'
      
      if (session?.user) {
        profileOperations?.load(session?.user?.id)
      } else {
        profileOperations?.clear()
      }
    }
  }

  // ===================== USEEFFECT CORRIGIDO =====================
  useEffect(() => {
    // 1. Verifica a sessão existente quando o app carrega
    supabase.auth.getSession().then(({ data: { session } }) => {
      authStateHandlers.onChange(null, session);
    });

    // 2. Ouve por futuras mudanças de autenticação (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        authStateHandlers.onChange(event, session);
        if (event === 'PASSWORD_RECOVERY') {
          // Lógica para o evento de recuperação de senha pode ser adicionada aqui se necessário
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);
  // ==============================================================

  // Auth methods
  const signIn = async ({ email, password }) => {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({ email, password })
      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  const signUp = async ({ email, password, options }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options
      });
      return { data, error };
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  }
  
  const signOut = async () => {
    try {
      const { error } = await supabase?.auth?.signOut()
      if (!error) {
        setUser(null)
        profileOperations?.clear()
      }
      return { error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  const resetPasswordForEmail = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      return { data, error };
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { data, error };
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } };
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return { error: { message: 'No user logged in' } }
    
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single()
      if (!error) setUserProfile(data)
      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPasswordForEmail,
    updatePassword,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
