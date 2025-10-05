import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import AppIcon from 'components/AppIcon';
import { useAuth } from 'contexts/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Estado para o novo campo
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { signUp } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // --- Validação da confirmação de senha ---
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Preencha todos os campos');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email inválido');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta antes de fazer o login.');
        setEmail('');
        setPassword('');
        setConfirmPassword(''); // Limpar o campo de confirmação
        setFullName('');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <AppIcon name="UserPlus" size={48} className="mx-auto text-primary" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Crie sua conta
          </h2>
          <p className="text-gray-600 mt-2">Comece a organizar seus estudos agora mesmo.</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-6">
          <Input
            label="Nome Completo"
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setError('');
            }}
            placeholder="Seu nome completo"
            required
            icon="User"
          />
          
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
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
              setError('');
            }}
            placeholder="Crie uma senha forte (mín. 6 caracteres)"
            required
            icon="Lock"
          />

          {/* --- NOVO CAMPO ADICIONADO AQUI --- */}
          <Input
            label="Confirme sua Senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError('');
            }}
            placeholder="Repita a senha"
            required
            icon="Lock"
          />
          
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}
          
          {successMessage && (
            <p className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">
              {successMessage}
            </p>
          )}
          
          <Button 
            type="submit" 
            fullWidth 
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link 
            to="/login" 
            className="font-semibold text-primary hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
