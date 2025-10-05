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

  // ... (código existente, sem alterações)

  useEffect(() => {
    // ... (código existente, sem alterações)

    // A lógica de onAuthStateChange também detectará a recuperação de senha
    const handlePasswordRecovery = async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Quando o usuário clica no link, o Supabase emite este evento.
        // A sessão já contém o token necessário para a atualização.
        // O usuário é tratado como "autenticado" temporariamente para poder mudar a senha.
      }
    };
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        authStateHandlers.onChange(event, session);
        handlePasswordRecovery(event, session);
      }
    );

    return () => subscription?.unsubscribe()
  }, [])

  // --- Funções de autenticação existentes ---
  const signIn = async ({ email, password }) => { /* ... código existente ... */ };
  const signUp = async ({ email, password, options }) => { /* ... código existente ... */ };
  const signOut = async () => { /* ... código existente ... */ };
  const resetPasswordForEmail = async (email) => { /* ... código existente ... */ };

  // ===================== INÍCIO DA NOVA FUNÇÃO =====================
  
  // Função para o usuário definir uma nova senha.
  // Ela usa a sessão temporária criada pelo link de redefinição.
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

  // ====================== FIM DA NOVA FUNÇÃO =======================

  const updateProfile = async (updates) => { /* ... código existente ... */ };

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
    updatePassword, // Adicionando a nova função ao contexto
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
