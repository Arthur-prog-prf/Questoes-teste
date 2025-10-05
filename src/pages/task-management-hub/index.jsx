import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';

const TaskManagementHub = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('library');

  const tabOptions = [
    { key: 'library', label: 'Biblioteca de Tarefas', icon: 'BookOpen' },
    { key: 'actions', label: 'Ações Rápidas', icon: 'Zap' },
    { key: 'optimization', label: 'Otimização de Estudos', icon: 'TrendingUp' },
    { key: 'history', label: 'Histórico', icon: 'Clock' }
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}>
        <div className="p-6">
          {/* Header */}
          <div className="bg-white border-b border-border shadow-subtle">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="Settings" size={24} color="white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                      Central de Gerenciamento de Tarefas
                    </h1>
                    <p className="text-text-secondary mt-1">
                      Workspace avançado para organização, otimização e análise de estudos
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Tarefa Rápida
                  </Button>
                  <Button
                    variant="default"
                    iconName="PlusCircle"
                    iconPosition="left"
                  >
                    Tarefa Avançada
                  </Button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center space-x-1 pb-4">
                {tabOptions?.map((tab) => (
                  <button
                    key={tab?.key}
                    onClick={() => setActiveTab(tab?.key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab?.key
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-text-secondary hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span className="hidden sm:inline">{tab?.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg border border-border shadow-subtle">
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Icon name="Settings" size={32} color="var(--color-primary)" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Central de Tarefas Vazia
                </h3>
                <p className="text-text-secondary max-w-md mb-6">
                  Comece criando suas primeiras tarefas para organizar seus estudos de forma avançada 
                  com recursos de otimização e análise.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Criar Primeira Tarefa
                  </Button>
                  <Button 
                    variant="outline"
                    iconName="BookOpen"
                    iconPosition="left"
                    onClick={() => window.location.href = '/exam-syllabus-manager'}
                  >
                    Ver Matérias
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats - Empty State */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-text-secondary">
                    Total de Tarefas
                  </h3>
                  <Icon name="List" size={16} color="var(--color-text-secondary)" />
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-foreground">0</span>
                </div>
                <p className="text-sm text-text-secondary mt-2">
                  Nenhuma tarefa criada ainda
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
                </div>
                <p className="text-sm text-text-secondary mt-2">
                  Conclua tarefas para ver seu progresso
                </p>
              </div>

              <div className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-text-secondary">
                    Horas Estudadas
                  </h3>
                  <Icon name="Clock" size={16} color="var(--color-text-secondary)" />
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-foreground">0</span>
                  <span className="text-sm text-text-secondary ml-1">h</span>
                </div>
                <p className="text-sm text-text-secondary mt-2">
                  Inicie seus estudos para acompanhar o tempo
                </p>
              </div>

              <div className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-text-secondary">
                    Precisão Média
                  </h3>
                  <Icon name="Target" size={16} color="var(--color-text-secondary)" />
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-foreground">--</span>
                  <span className="text-sm text-text-secondary ml-1">%</span>
                </div>
                <p className="text-sm text-text-secondary mt-2">
                  Complete exercícios para ver sua precisão
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskManagementHub;