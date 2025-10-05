import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import AppIcon from 'components/AppIcon';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updatePassword, user } = useAuth();
  const navigate = useNavigate();

  // Redireciona se não houver um usuário na sessão de recuperação
  useEffect(() => {
    if (!user) {
      // Pequeno delay para garantir que a sessão do Supabase foi lida
      const timer = setTimeout(() => {
        if (!user) {
            setError("Token de redefinição inválido ou expirado. Por favor, solicite um novo link.");
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);


  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
        setError('A nova senha deve ter no mínimo 6 caracteres.');
        return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    const { error } = await updatePassword(password);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Senha atualizada com sucesso! Você será redirecionado para o login.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <AppIcon name="KeyRound" size={48} className="mx-auto text-primary" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Crie sua Nova Senha</h2>
        </div>
        
        {user ? (
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <Input
              label="Nova Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a nova senha"
              required
              icon="Lock"
            />
            <Input
              label="Confirme a Nova Senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a nova senha"
              required
              icon="Lock"
            />
            
            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}
            {message && <p className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">{message}</p>}
            
            <Button type="submit" fullWidth loading={loading} disabled={loading || !!message}>
              {loading ? 'Salvando...' : 'Salvar Nova Senha'}
            </Button>
          </form>
        ) : (
             <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error || "Verificando token..."}</p>
        )}
      </div>
    </div>
  );
};

export default UpdatePassword;
