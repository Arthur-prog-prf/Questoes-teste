import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import AppIcon from 'components/AppIcon';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPasswordForEmail } = useAuth();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const { error } = await resetPasswordForEmail(email);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Se o e-mail estiver correto, você receberá um link para redefinir sua senha.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <AppIcon name="KeyRound" size={48} className="mx-auto text-primary" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Redefinir Senha</h2>
          <p className="text-gray-600 mt-2">Digite seu e-mail para receber o link de redefinição.</p>
        </div>
        
        <form onSubmit={handlePasswordReset} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            icon="Mail"
          />
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && <p className="text-green-600 text-sm text-center">{message}</p>}
          
          <Button type="submit" fullWidth loading={loading} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Link'}
          </Button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Lembrou a senha?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
