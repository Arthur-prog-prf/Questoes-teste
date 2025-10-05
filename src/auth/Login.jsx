import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AppIcon from '../../components/AppIcon';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // 🔒 VALIDAÇÃO 1: Verifica se os campos estão preenchidos
    if (!email.trim() || !password) {
      setError('Preencha todos os campos');
      return;
    }
    
    // 🔒 VALIDAÇÃO 2: Verifica se o email é válido
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email inválido');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // 🔐 Tenta fazer login
      const { error } = await signIn({ email, password });

      if (error) {
        setError(error.message);
      } else {
        setPassword(''); // 🧹 Limpa a senha por segurança
        navigate('/today-dashboard');
      }
    } catch (err) {
      // 🛡️ Captura erros inesperados
      setError('Erro inesperado. Tente novamente.');
    } finally {
      // ⏰ Sempre para o loading, mesmo se der erro ou sucesso
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <AppIcon name="GraduationCap" size={48} className="mx-auto text-primary" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Acesse sua conta
          </h2>
          <p className="text-gray-600 mt-2">Bem-vindo de volta! Continue seus estudos.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(''); // 🎯 Limpa erro quando usuário digitar
            }}
            placeholder="seu@email.com"
            required
            icon="Mail"
          />
          
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(''); // 🎯 Limpa erro quando usuário digitar
            }}
            placeholder="Sua senha"
            required
            icon="Lock"
          />
          
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}
          
          <Button 
            type="submit" 
            fullWidth 
            loading={loading}
            disabled={loading} // 🔐 Impede múltiplos cliques
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link 
            to="/register" 
            className="font-semibold text-primary hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
