import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const quickActionItems = [
    {
      id: 1,
      title: 'Caderno de Erros',
      description: 'Revisar questões incorretas',
      icon: 'BookMarked',
      color: 'text-error',
      bgColor: 'bg-error bg-opacity-10',
      count: 23,
      action: () => console.log('Abrir caderno de erros')
    },
    {
      id: 2,
      title: 'Últimas Sessões',
      description: 'Ver histórico de estudos',
      icon: 'History',
      color: 'text-primary',
      bgColor: 'bg-primary bg-opacity-10',
      count: 8,
      action: () => console.log('Ver sessões recentes')
    },
    {
      id: 3,
      title: 'Simulados',
      description: 'Fazer teste cronometrado',
      icon: 'FileText',
      color: 'text-accent',
      bgColor: 'bg-accent bg-opacity-10',
      count: 5,
      action: () => console.log('Iniciar simulado')
    },
    {
      id: 4,
      title: 'Estatísticas',
      description: 'Análise de desempenho',
      icon: 'BarChart3',
      color: 'text-success',
      bgColor: 'bg-success bg-opacity-10',
      count: null,
      action: () => window.location.href = '/analytics-dashboard'
    }
  ];

  const recentSessions = [
    {
      id: 1,
      subject: 'Matemática',
      duration: 45,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      topics: 3
    },
    {
      id: 2,
      subject: 'Português',
      duration: 30,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      topics: 2
    },
    {
      id: 3,
      subject: 'Direito Constitucional',
      duration: 60,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      topics: 4
    }
  ];

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInHours = Math.floor((now - timestamp) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
      return `${diffInMinutes}min atrás`;
    }
    return `${diffInHours}h atrás`;
  };

  return (
    <div className="bg-white rounded-lg border border-border shadow-subtle p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <Icon name="Zap" size={24} className="mr-2 text-accent" />
          Ações Rápidas
        </h2>
        <div className="text-sm text-text-secondary">
          Acesso direto às ferramentas
        </div>
      </div>
      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {quickActionItems?.map((item) => (
          <button
            key={item?.id}
            onClick={item?.action}
            className={`p-4 rounded-lg border border-border hover:border-primary hover:border-opacity-50 transition-all duration-150 text-left group ${item?.bgColor}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-white shadow-subtle ${item?.color}`}>
                <Icon name={item?.icon} size={20} />
              </div>
              {item?.count && (
                <span className="text-xs font-semibold text-foreground bg-white px-2 py-1 rounded-full shadow-subtle">
                  {item?.count}
                </span>
              )}
            </div>
            <h3 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors duration-150">
              {item?.title}
            </h3>
            <p className="text-sm text-text-secondary">
              {item?.description}
            </p>
          </button>
        ))}
      </div>
      {/* Recent Sessions */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">Sessões Recentes</h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="ExternalLink"
            onClick={() => console.log('Ver todas as sessões')}
          >
            Ver Todas
          </Button>
        </div>

        <div className="space-y-3">
          {recentSessions?.map((session) => (
            <div
              key={session?.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-secondary hover:bg-opacity-10 transition-colors duration-150"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Icon name="BookOpen" size={16} className="text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{session?.subject}</div>
                  <div className="text-sm text-text-secondary">
                    {session?.topics} tópicos • {session?.duration}min
                  </div>
                </div>
              </div>
              <div className="text-xs text-text-secondary">
                {formatTimeAgo(session?.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Data Sync Status */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm text-text-secondary">
              Dados sincronizados
            </span>
          </div>
          <div className="text-xs text-text-secondary">
            Última sync: {new Date()?.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;