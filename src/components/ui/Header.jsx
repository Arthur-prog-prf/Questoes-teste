import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from 'contexts/AuthContext'; // 1. Importar o useAuth

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 2. Obter o usuário e a função de signOut do contexto
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navigationItems = [
    { label: 'Hoje', path: '/today-dashboard', icon: 'Calendar' },
    { label: 'Edital', path: '/exam-syllabus-manager', icon: 'BookOpen' },
    { label: 'Planejamento', path: '/study-planner', icon: 'CalendarDays' },
    { label: 'Central de Tarefas', path: '/task-management-hub', icon: 'Settings' },
    { label: 'Estatísticas', path: '/analytics-dashboard', icon: 'BarChart3' },
    { label: 'Conquistas', path: '/achievements-gallery', icon: 'Trophy' }
  ];

  const isActivePath = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    // Usar navigate para uma navegação mais fluida, sem recarregar a página
    navigate(path);
    setIsMenuOpen(false);
  };

  // 3. Criar a função de logout
  const handleLogout = async () => {
    await signOut();
    navigate('/login'); // Redirecionar para a página de login após o logout
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-subtle">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="GraduationCap" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              Painel de Aprovação
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 hover:bg-muted ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-foreground'
              }`}
            >
              <Icon name={item?.icon} size={18} />
              <span>{item?.label}</span>
            </button>
          ))}
          
          {/* 4. Adicionar o botão de Sair se o usuário estiver logado */}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 text-red-500 hover:bg-red-50"
            >
              <Icon name="LogOut" size={18} />
              <span>Sair</span>
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors duration-150"
          aria-label="Toggle menu"
        >
          <Icon name={isMenuOpen ? 'X' : 'Menu'} size={24} />
        </button>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-border shadow-moderate">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-3 w-full px-3 py-3 rounded-md text-sm font-medium transition-all duration-150 ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span>{item?.label}</span>
              </button>
            ))}
            {/* Botão de Sair no menu mobile */}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-3 py-3 rounded-md text-sm font-medium text-red-500 hover:bg-red-50"
              >
                <Icon name="LogOut" size={20} />
                <span>Sair</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
