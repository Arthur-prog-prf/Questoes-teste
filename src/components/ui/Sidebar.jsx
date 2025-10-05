import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [studyTimer, setStudyTimer] = useState({ time: '00:00', subject: 'Matemática' });
  const [dailyProgress, setDailyProgress] = useState(65);

  const navigationItems = [
    { 
      label: 'Hoje', 
      path: '/today-dashboard', 
      icon: 'Calendar',
      tooltip: 'Painel diário de estudos'
    },
    { 
      label: 'Edital', 
      path: '/exam-syllabus-manager', 
      icon: 'BookOpen',
      tooltip: 'Gerenciar conteúdo do edital'
    },
    { 
      label: 'Planejamento', 
      path: '/study-planner', 
      icon: 'CalendarDays',
      tooltip: 'Planejar cronograma de estudos'
    },
    { 
      label: 'Estatísticas', 
      path: '/analytics-dashboard', 
      icon: 'BarChart3',
      tooltip: 'Análise de desempenho'
    },
    { 
      label: 'Conquistas', 
      path: '/achievements-gallery', 
      icon: 'Trophy',
      tooltip: 'Galeria de conquistas'
    }
  ];

  const quickActions = {
    '/today-dashboard': { label: 'Nova Sessão', icon: 'Play' },
    '/exam-syllabus-manager': { label: 'Adicionar Tópico', icon: 'Plus' },
    '/study-planner': { label: 'Tarefa Rápida', icon: 'PlusCircle' },
    '/analytics-dashboard': { label: 'Exportar Dados', icon: 'Download' },
    '/achievements-gallery': { label: 'Ver Progresso', icon: 'TrendingUp' }
  };

  const isActivePath = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    window.location.href = path;
    setIsMobileOpen(false);
  };

  const handleQuickAction = () => {
    const action = quickActions?.[location?.pathname];
    if (action) {
      console.log(`Executing: ${action?.label}`);
    }
  };

  // Simulate timer updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const minutes = now?.getMinutes()?.toString()?.padStart(2, '0');
      const seconds = now?.getSeconds()?.toString()?.padStart(2, '0');
      setStudyTimer(prev => ({ ...prev, time: `${minutes}:${seconds}` }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle mobile menu close on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location?.pathname]);

  const currentQuickAction = quickActions?.[location?.pathname];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white border-r border-border shadow-subtle z-50
        transition-transform duration-300 ease-smooth
        ${isCollapsed ? 'w-16' : 'w-60'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="GraduationCap" size={20} color="white" />
                </div>
                <span className="text-lg font-semibold text-foreground">
                  Painel
                </span>
              </div>
            )}
            
            {/* Quick Action Dropdown */}
            {currentQuickAction && !isCollapsed && (
              <button
                onClick={handleQuickAction}
                className="p-2 rounded-md hover:bg-muted transition-colors duration-150"
                title={currentQuickAction?.label}
              >
                <Icon name={currentQuickAction?.icon} size={16} />
              </button>
            )}
          </div>

          {/* Progress Strip */}
          {!isCollapsed && (
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                <span>Progresso Diário</span>
                <span>{dailyProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-300"
                  style={{ width: `${dailyProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  group flex items-center w-full px-3 py-3 rounded-lg text-sm font-medium
                  transition-all duration-150 hover:bg-muted relative
                  ${isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-subtle'
                    : 'text-text-secondary hover:text-foreground'
                  }
                  ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'}
                `}
                title={isCollapsed ? item?.tooltip : ''}
              >
                <Icon name={item?.icon} size={20} />
                {!isCollapsed && <span>{item?.label}</span>}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="
                    absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    pointer-events-none whitespace-nowrap z-50
                  ">
                    {item?.tooltip}
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Study Timer Widget */}
          <div className={`p-4 border-t border-border ${isCollapsed ? 'px-2' : ''}`}>
            {!isCollapsed ? (
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-text-secondary">
                    Sessão Atual
                  </span>
                  <Icon name="Clock" size={14} color="var(--color-text-secondary)" />
                </div>
                <div className="font-mono text-lg font-semibold text-primary">
                  {studyTimer?.time}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  {studyTimer?.subject}
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={16} color="var(--color-primary)" />
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden p-2 bg-white rounded-md shadow-moderate border border-border"
      >
        <Icon name="Menu" size={20} />
      </button>
      {/* Desktop Toggle Button */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="hidden lg:block fixed top-4 left-4 z-40 p-2 bg-white rounded-md shadow-moderate border border-border"
          style={{ left: isCollapsed ? '4rem' : '15rem' }}
        >
          <Icon name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={16} />
        </button>
      )}
    </>
  );
};

export default Sidebar;