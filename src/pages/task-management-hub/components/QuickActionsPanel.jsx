import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = ({ tasks = [], onTaskCreate, onBulkOperation }) => {
  const [activeAction, setActiveAction] = useState(null);

  const quickActions = [
    {
      id: 'batch-create',
      title: 'Criação em Lote',
      description: 'Criar múltiplas tarefas rapidamente usando templates',
      icon: 'Copy',
      color: 'bg-blue-500',
      actions: [
        { label: 'Rotina Diária de Matemática', template: 'math-daily' },
        { label: 'Semana de Revisão', template: 'review-week' },
        { label: 'Preparação para Prova', template: 'exam-prep' }
      ]
    },
    {
      id: 'smart-schedule',
      title: 'Agendamento Inteligente',
      description: 'Agendar tarefas automaticamente baseado em padrões de estudo',
      icon: 'Brain',
      color: 'bg-purple-500',
      actions: [
        { label: 'Distribuir Esta Semana', action: 'distribute-week' },
        { label: 'Otimizar Horários', action: 'optimize-schedule' },
        { label: 'Preencher Lacunas', action: 'fill-gaps' }
      ]
    },
    {
      id: 'batch-edit',
      title: 'Edição em Massa',
      description: 'Modificar múltiplas tarefas simultaneamente',
      icon: 'Edit3',
      color: 'bg-green-500',
      actions: [
        { label: 'Alterar Prioridades', action: 'change-priority' },
        { label: 'Reagendar Tarefas', action: 'reschedule-tasks' },
        { label: 'Atualizar Prazos', action: 'update-deadlines' }
      ]
    },
    {
      id: 'templates',
      title: 'Templates Rápidos',
      description: 'Criar tarefas usando templates predefinidos',
      icon: 'FileTemplate',
      color: 'bg-orange-500',
      actions: [
        { label: 'Revisão Express (30min)', template: 'quick-review' },
        { label: 'Sessão Foco (2h)', template: 'focus-session' },
        { label: 'Exercícios Práticos (1h)', template: 'practice-exercises' }
      ]
    }
  ];

  const studyTemplates = {
    'math-daily': {
      name: 'Rotina Diária de Matemática',
      tasks: [
        { title: 'Revisão de Fórmulas', subject: 'matematica', duration: 0.5, priority: 'media' },
        { title: 'Exercícios de Fixação', subject: 'matematica', duration: 1.0, priority: 'alta' },
        { title: 'Resolução de Problemas', subject: 'matematica', duration: 1.5, priority: 'alta' }
      ]
    },
    'review-week': {
      name: 'Semana de Revisão Completa',
      tasks: [
        { title: 'Revisão Matemática - Parte 1', subject: 'matematica', duration: 2.0, priority: 'alta' },
        { title: 'Revisão Português - Gramática', subject: 'portugues', duration: 1.5, priority: 'alta' },
        { title: 'Revisão Direito - Constitucional', subject: 'direito', duration: 2.5, priority: 'alta' },
        { title: 'Revisão Informática - Algoritmos', subject: 'informatica', duration: 2.0, priority: 'media' },
        { title: 'Atualidades da Semana', subject: 'atualidades', duration: 1.0, priority: 'media' }
      ]
    },
    'exam-prep': {
      name: 'Preparação Intensiva para Prova',
      tasks: [
        { title: 'Simulado Completo', subject: 'matematica', duration: 3.0, priority: 'urgente' },
        { title: 'Revisão de Erros', subject: 'matematica', duration: 1.0, priority: 'alta' },
        { title: 'Pontos Críticos', subject: 'matematica', duration: 1.5, priority: 'urgente' }
      ]
    },
    'quick-review': {
      name: 'Revisão Express',
      tasks: [
        { title: 'Revisão Rápida - Conceitos Chave', subject: 'matematica', duration: 0.5, priority: 'media' }
      ]
    },
    'focus-session': {
      name: 'Sessão de Foco Intensivo',
      tasks: [
        { title: 'Estudo Concentrado - Tópico Principal', subject: 'matematica', duration: 2.0, priority: 'alta' }
      ]
    },
    'practice-exercises': {
      name: 'Bateria de Exercícios',
      tasks: [
        { title: 'Lista de Exercícios Práticos', subject: 'matematica', duration: 1.0, priority: 'media' }
      ]
    }
  };

  const handleQuickAction = (action, actionType) => {
    if (actionType === 'template') {
      const template = studyTemplates?.[action];
      if (template) {
        template?.tasks?.forEach((taskTemplate, index) => {
          setTimeout(() => {
            onTaskCreate({
              title: taskTemplate?.title,
              subject: taskTemplate?.subject,
              topic: template?.name,
              description: `Criada automaticamente pelo template: ${template?.name}`,
              priority: taskTemplate?.priority,
              estimatedDuration: taskTemplate?.duration,
              dueDate: new Date(Date.now() + (index + 1) * 86400000)?.toISOString()?.split('T')?.[0] // Spread over next days
            });
          }, index * 100); // Small delay to prevent UI conflicts
        });
        
        setActiveAction(null);
        alert(`${template?.tasks?.length} tarefas criadas com sucesso usando o template "${template?.name}"!`);
      }
    } else {
      // Handle other action types
      switch (action) {
        case 'distribute-week': alert('Funcionalidade de distribuição semanal será implementada em breve!');
          break;
        case 'optimize-schedule': alert('Otimização de horários será implementada em breve!');
          break;
        case 'fill-gaps': alert('Preenchimento de lacunas será implementado em breve!');
          break;
        case 'change-priority': alert('Alteração em massa de prioridades será implementada em breve!');
          break;
        case 'reschedule-tasks': alert('Reagendamento em massa será implementado em breve!');
          break;
        case 'update-deadlines': alert('Atualização de prazos em massa será implementada em breve!');
          break;
        default:
          break;
      }
      setActiveAction(null);
    }
  };

  const getTaskStats = () => {
    const total = tasks?.length || 0;
    const completed = tasks?.filter(t => t?.status === 'completed')?.length || 0;
    const pending = tasks?.filter(t => t?.status === 'todo')?.length || 0;
    const inProgress = tasks?.filter(t => t?.status === 'in_progress')?.length || 0;
    
    return { total, completed, pending, inProgress };
  };

  const stats = getTaskStats();

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="bg-white rounded-lg shadow-subtle border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Visão Geral das Tarefas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats?.total}</div>
            <div className="text-sm text-blue-600">Total</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats?.completed}</div>
            <div className="text-sm text-green-600">Concluídas</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats?.inProgress}</div>
            <div className="text-sm text-yellow-600">Em Progresso</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{stats?.pending}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </div>
        </div>
      </div>
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions?.map((actionGroup) => (
          <div key={actionGroup?.id} className="bg-white rounded-lg shadow-subtle border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${actionGroup?.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon name={actionGroup?.icon} size={24} color="white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{actionGroup?.title}</h3>
                  <p className="text-text-secondary text-sm mt-1">{actionGroup?.description}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-2">
              {actionGroup?.actions?.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(
                    action?.template || action?.action,
                    action?.template ? 'template' : 'action'
                  )}
                  className="w-full flex items-center justify-between p-3 text-left border border-border rounded-lg hover:bg-muted transition-colors duration-200"
                >
                  <span className="text-sm font-medium text-foreground">{action?.label}</span>
                  <Icon name="ChevronRight" size={16} className="text-text-secondary" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Productivity Shortcuts */}
      <div className="bg-white rounded-lg shadow-subtle border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Zap" size={20} className="mr-2 text-accent" />
          Atalhos de Produtividade
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button
            variant="outline"
            iconName="Clock"
            iconPosition="left"
            fullWidth
            onClick={() => {
              onTaskCreate({
                title: 'Sessão Pomodoro - 25min',
                subject: 'matematica',
                topic: 'Técnica Pomodoro',
                description: 'Sessão de estudo focado com técnica Pomodoro',
                priority: 'media',
                estimatedDuration: 0.5,
                dueDate: new Date()?.toISOString()?.split('T')?.[0]
              });
            }}
          >
            Pomodoro 25min
          </Button>
          
          <Button
            variant="outline"
            iconName="Target"
            iconPosition="left"
            fullWidth
            onClick={() => {
              onTaskCreate({
                title: 'Meta Diária Rápida',
                subject: 'portugues',
                topic: 'Meta de Estudo',
                description: 'Revisão rápida dos tópicos do dia',
                priority: 'media',
                estimatedDuration: 1.0,
                dueDate: new Date()?.toISOString()?.split('T')?.[0]
              });
            }}
          >
            Meta Diária
          </Button>
          
          <Button
            variant="outline"
            iconName="BookOpen"
            iconPosition="left"
            fullWidth
            onClick={() => {
              onTaskCreate({
                title: 'Leitura Dirigida - 1h',
                subject: 'direito',
                topic: 'Leitura Focada',
                description: 'Leitura concentrada de material teórico',
                priority: 'media',
                estimatedDuration: 1.0,
                dueDate: new Date()?.toISOString()?.split('T')?.[0]
              });
            }}
          >
            Leitura 1h
          </Button>
          
          <Button
            variant="outline"
            iconName="PenTool"
            iconPosition="left"
            fullWidth
            onClick={() => {
              onTaskCreate({
                title: 'Exercícios Práticos - 30min',
                subject: 'informatica',
                topic: 'Prática Dirigida',
                description: 'Resolução de exercícios práticos específicos',
                priority: 'alta',
                estimatedDuration: 0.5,
                dueDate: new Date()?.toISOString()?.split('T')?.[0]
              });
            }}
          >
            Exercícios 30min
          </Button>
        </div>
      </div>
      {/* Bulk Operations Helper */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20 p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Lightbulb" size={20} color="white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">Dica de Produtividade</h3>
            <p className="text-text-secondary text-sm mb-4">
              Use as ações rápidas para criar rotinas de estudo consistentes. Os templates ajudam a manter 
              um padrão de qualidade e economizam tempo na criação de tarefas recorrentes.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/80 rounded-full text-xs text-foreground border">
                ⚡ Templates Inteligentes
              </span>
              <span className="px-3 py-1 bg-white/80 rounded-full text-xs text-foreground border">
                🎯 Criação em Lote
              </span>
              <span className="px-3 py-1 bg-white/80 rounded-full text-xs text-foreground border">
                📊 Otimização Automática
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;