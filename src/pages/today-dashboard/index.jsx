import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const TodayDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date?.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <main className="pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-foreground">
                Painel de Hoje
              </h1>
              <div className="text-right">
                <div className="text-lg font-semibold text-foreground">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-text-secondary">
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>
            <p className="text-text-secondary">
              Gerencie suas atividades de estudo e acompanhe seu progresso diário
            </p>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-lg border border-border shadow-subtle">
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Icon name="Calendar" size={32} color="var(--color-primary)" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Bem-vindo ao seu painel de estudos
              </h3>
              <p className="text-text-secondary max-w-md mb-6">
                Comece organizando suas matérias e criando seu primeiro cronograma de estudos 
                para acompanhar seu progresso diário.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="default"
                  iconName="BookOpen"
                  iconPosition="left"
                  onClick={() => window.location.href = '/exam-syllabus-manager'}
                >
                  Cadastrar Matérias
                </Button>
                <Button 
                  variant="outline"
                  iconName="Calendar"
                  iconPosition="left"
                  onClick={() => window.location.href = '/study-planner'}
                >
                  Criar Cronograma
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats - Empty State */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-text-secondary">
                  Tempo de Estudo Hoje
                </h3>
                <Icon name="Clock" size={16} color="var(--color-text-secondary)" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-foreground">0</span>
                <span className="text-sm text-text-secondary ml-1">min</span>
              </div>
              <p className="text-sm text-text-secondary mt-2">
                Inicie sua primeira sessão de estudos
              </p>
            </div>

            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-text-secondary">
                  Tarefas Concluídas
                </h3>
                <Icon name="CheckCircle" size={16} color="var(--color-text-secondary)" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-foreground">0</span>
                <span className="text-sm text-text-secondary ml-1">de 0</span>
              </div>
              <p className="text-sm text-text-secondary mt-2">
                Crie tarefas para acompanhar seu progresso
              </p>
            </div>

            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-text-secondary">
                  Sequência de Estudos
                </h3>
                <Icon name="Flame" size={16} color="var(--color-text-secondary)" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-foreground">0</span>
                <span className="text-sm text-text-secondary ml-1">dias</span>
              </div>
              <p className="text-sm text-text-secondary mt-2">
                Mantenha uma rotina diária para criar sua sequência
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-between text-sm text-text-secondary">
              <div>
                Sistema de Repetição Espaçada ativo • Dados sincronizados em tempo real
              </div>
              <div>
                © {new Date()?.getFullYear()} Painel de Aprovação
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TodayDashboard;
