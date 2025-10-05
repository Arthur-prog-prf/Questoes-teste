import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import AppIcon from './AppIcon';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation(); // 🎯 Captura a página atual

  // Enquanto verifica a autenticação, mostra um spinner
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <AppIcon 
          name="Loader2" 
          size={48} 
          className="animate-spin text-primary" 
        />
        <span className="ml-3 text-gray-600">Carregando...</span>
      </div>
    );
  }

  // Se não houver usuário após a verificação, redireciona para o login
  if (!user) {
    // 🔄 Redireciona para login MAS guarda de onde veio
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Se houver usuário, permite o acesso à página solicitada
  return children;
};

export default ProtectedRoute;
