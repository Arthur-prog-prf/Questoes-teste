import React from "react";
import Routes from "Routes";
import { AuthProvider } from "contexts/AuthContext";

function App() {
  return (
    // 🔐 O AuthProvider "abraça" todo o aplicativo
    // Isso permite que qualquer componente dentro dele acesse os dados de autenticação
    <AuthProvider>
      {/* 🚀 As Rotas contêm toda a lógica de navegação e proteção */}
      <Routes />
    </AuthProvider>
  );
}

export default App;
