import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskHistoryViewer = ({ history = [], tasks = [] }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // 'day', 'week', 'month', 'all'
  const [selectedAction, setSelectedAction] = useState('all'); // 'all', 'created', 'updated', 'completed', 'deleted'

  const actionTypes = {
    'created': { label: 'Criadas', icon: 'Plus', color: 'text-green-600', bgColor: 'bg-green-50' },
    'updated': { label: 'Atualizadas', icon: 'Edit2', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    'completed': { label: 'Concluídas', icon: 'CheckCircle', color: 'text-green-600', bgColor: 'bg-green-50' },
    'deleted': { label: 'Excluídas', icon: 'Trash2', color: 'text-red-600', bgColor: 'bg-red-50' },
    'rescheduled': { label: 'Reagendadas', icon: 'Calendar', color: 'text-orange-600', bgColor: 'bg-orange-50' }
  };

  const getFilteredHistory = () => {
    const now = new Date();
    let cutoffDate;

    switch (selectedPeriod) {
      case 'day':
        cutoffDate = new Date(now?.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        cutoffDate = new Date(now?.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoffDate = new Date(now?.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = new Date(0); // All time
    }

    return history?.filter(entry => {
      const entryDate = new Date(entry?.timestamp);
      const withinPeriod = entryDate >= cutoffDate;
      const matchesAction = selectedAction === 'all' || entry?.action === selectedAction;
      return withinPeriod && matchesAction;
    });
  };

  const getHistoryStats = () => {
    const filtered = getFilteredHistory();
    const stats = {};
    
    filtered?.forEach(entry => {
      const action = entry?.action;
      stats[action] = (stats?.[action] || 0) + 1;
    });

    return stats;
  };

  const getTaskTitle = (taskId) => {
    const task = tasks?.find(t => t?.id === taskId);
    return task?.title || 'Tarefa não encontrada';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.abs(now - date) / (1000 * 60 * 60);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffHours * 60);
      return `há ${diffMinutes} minuto(s)`;
    } else if (diffHours < 24) {
      return `há ${Math.floor(diffHours)} hora(s)`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `há ${diffDays} dia(s)`;
    }
  };

  const filteredHistory = getFilteredHistory();
  const historyStats = getHistoryStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-subtle border border-border p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center">
              <Icon name="Clock" size={24} className="mr-3 text-primary" />
              Histórico de Atividades
            </h2>
            <p className="text-text-secondary mt-1">
              Acompanhe todas as mudanças e progressos das suas tarefas
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="day">Últimas 24 horas</option>
              <option value="week">Última semana</option>
              <option value="month">Último mês</option>
              <option value="all">Todo período</option>
            </select>
            
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">Todas ações</option>
              {Object.entries(actionTypes)?.map(([key, action]) => (
                <option key={key} value={key}>{action?.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(actionTypes)?.map(([key, action]) => (
            <div key={key} className={`p-4 rounded-lg ${action?.bgColor} border`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{historyStats?.[key] || 0}</div>
                  <div className={`text-sm ${action?.color}`}>{action?.label}</div>
                </div>
                <Icon name={action?.icon} size={20} className={action?.color} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History Timeline */}
      <div className="bg-white rounded-lg shadow-subtle border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Timeline de Atividades ({filteredHistory?.length} entradas)
          </h3>
        </div>

        <div className="p-6">
          {filteredHistory?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Calendar" size={48} className="mx-auto text-text-secondary mb-4" />
              <h4 className="text-lg font-medium text-text-secondary mb-2">
                Nenhuma atividade encontrada
              </h4>
              <p className="text-text-secondary">
                Não há registros para o período e filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory?.map((entry, index) => {
                const actionType = actionTypes?.[entry?.action] || actionTypes?.['updated'];
                const isLast = index === filteredHistory?.length - 1;

                return (
                  <div key={entry?.id} className="flex items-start space-x-4">
                    {/* Timeline dot and line */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full ${actionType?.bgColor} border-2 border-white shadow flex items-center justify-center`}>
                        <Icon name={actionType?.icon} size={16} className={actionType?.color} />
                      </div>
                      {!isLast && (
                        <div className="w-px h-16 bg-border mt-2" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{entry?.description}</h4>
                            <p className="text-sm text-text-secondary mt-1">
                              Tarefa: {getTaskTitle(entry?.taskId)}
                            </p>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${actionType?.bgColor} ${actionType?.color}`}>
                              {actionType?.label}
                            </div>
                            <div className="text-xs text-text-secondary mt-1">
                              {formatTimestamp(entry?.timestamp)}
                            </div>
                          </div>
                        </div>

                        {/* Additional Details */}
                        {entry?.details && (
                          <div className="mt-3 p-3 bg-white rounded border border-border">
                            <div className="text-xs font-medium text-text-secondary mb-2">Detalhes:</div>
                            <div className="space-y-1">
                              {Object.entries(entry?.details)?.map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm">
                                  <span className="text-text-secondary capitalize">
                                    {key?.replace(/([A-Z])/g, ' $1')?.toLowerCase()}:
                                  </span>
                                  <span className="text-foreground font-medium">
                                    {typeof value === 'number' ? value?.toFixed(1) : value}
                                    {key?.includes('Rate') || key?.includes('Progress') ? '%' : ''}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* History Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Heatmap */}
        <div className="bg-white rounded-lg shadow-subtle border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Activity" size={18} className="mr-2 text-primary" />
            Padrão de Atividade
          </h3>
          
          <div className="space-y-3">
            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']?.map((day, index) => {
              const activity = Math.floor(Math.random() * 10) + 1; // Mock data
              return (
                <div key={day} className="flex items-center space-x-3">
                  <div className="w-16 text-sm text-text-secondary">{day}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${activity * 10}%` }}
                    />
                  </div>
                  <div className="w-8 text-sm text-text-secondary text-right">{activity}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Trends */}
        <div className="bg-white rounded-lg shadow-subtle border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="TrendingUp" size={18} className="mr-2 text-green-600" />
            Tendências Recentes
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium text-green-900">Taxa de Conclusão</div>
                <div className="text-sm text-green-700">↗ +15% esta semana</div>
              </div>
              <div className="text-2xl font-bold text-green-600">78%</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium text-blue-900">Produtividade Diária</div>
                <div className="text-sm text-blue-700">↗ +8% esta semana</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">4.2h</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <div className="font-medium text-purple-900">Tarefas Criadas</div>
                <div className="text-sm text-purple-700">→ Estável</div>
              </div>
              <div className="text-2xl font-bold text-purple-600">12</div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Exportar Histórico</h3>
            <p className="text-text-secondary">
              Baixe seus dados de atividade para análise externa ou backup
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              onClick={() => alert('Exportação CSV será implementada em breve!')}
            >
              Exportar CSV
            </Button>
            <Button
              variant="outline"
              iconName="FileText"
              iconPosition="left"
              onClick={() => alert('Relatório PDF será implementado em breve!')}
            >
              Gerar Relatório
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskHistoryViewer;