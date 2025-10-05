import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskBulkOperations = ({ 
  selectedTasks = [], 
  onBulkOperation, 
  onClearSelection 
}) => {
  const [showOperationModal, setShowOperationModal] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);

  const bulkOperations = [
    {
      id: 'complete',
      label: 'Marcar como Concluídas',
      icon: 'CheckCircle',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Marcar todas as tarefas selecionadas como concluídas'
    },
    {
      id: 'reschedule',
      label: 'Reagendar Tarefas',
      icon: 'Calendar',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Alterar datas de agendamento das tarefas selecionadas'
    },
    {
      id: 'priority',
      label: 'Alterar Prioridade',
      icon: 'AlertTriangle',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Definir nova prioridade para as tarefas selecionadas'
    },
    {
      id: 'assign_subject',
      label: 'Alterar Matéria',
      icon: 'BookOpen',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Mover tarefas para uma matéria diferente'
    },
    {
      id: 'duplicate',
      label: 'Duplicar Tarefas',
      icon: 'Copy',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      description: 'Criar cópias das tarefas selecionadas'
    },
    {
      id: 'export',
      label: 'Exportar Seleção',
      icon: 'Download',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Baixar dados das tarefas selecionadas'
    },
    {
      id: 'delete',
      label: 'Excluir Tarefas',
      icon: 'Trash2',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Remover permanentemente as tarefas selecionadas'
    }
  ];

  const handleOperationSelect = (operation) => {
    setSelectedOperation(operation);
    setShowOperationModal(true);
  };

  const confirmOperation = () => {
    if (selectedOperation && selectedTasks?.length > 0) {
      onBulkOperation(selectedOperation?.id, selectedTasks);
      setShowOperationModal(false);
      setSelectedOperation(null);
    }
  };

  const QuickOperations = () => (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        iconName="CheckCircle"
        iconPosition="left"
        onClick={() => onBulkOperation('complete', selectedTasks)}
        className="text-green-600 hover:bg-green-50"
      >
        Concluir
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        iconName="Calendar"
        iconPosition="left"
        onClick={() => handleOperationSelect(bulkOperations?.find(op => op?.id === 'reschedule'))}
        className="text-blue-600 hover:bg-blue-50"
      >
        Reagendar
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        iconName="Trash2"
        iconPosition="left"
        onClick={() => handleOperationSelect(bulkOperations?.find(op => op?.id === 'delete'))}
        className="text-red-600 hover:bg-red-50"
      >
        Excluir
      </Button>
    </div>
  );

  return (
    <>
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="CheckSquare" size={20} color="white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {selectedTasks?.length} tarefa(s) selecionada(s)
              </h3>
              <p className="text-sm text-text-secondary">
                Escolha uma ação para aplicar a todas as tarefas selecionadas
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <QuickOperations />
            
            <div className="h-6 w-px bg-border" />
            
            <Button
              variant="outline"
              iconName="MoreHorizontal"
              onClick={() => setShowOperationModal(true)}
            >
              Mais Ações
            </Button>
            
            <Button
              variant="ghost"
              iconName="X"
              onClick={onClearSelection}
              className="text-text-secondary hover:text-foreground"
            >
              Limpar
            </Button>
          </div>
        </div>
      </div>
      {/* Bulk Operations Modal */}
      {showOperationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-border w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-semibold text-foreground">
                Operações em Lote
              </h3>
              <button
                onClick={() => {
                  setShowOperationModal(false);
                  setSelectedOperation(null);
                }}
                className="p-2 hover:bg-muted rounded-md transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="p-6">
              {!selectedOperation ? (
                <>
                  <p className="text-text-secondary mb-6">
                    Selecione a operação que deseja aplicar às {selectedTasks?.length} tarefas selecionadas:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {bulkOperations?.map((operation) => (
                      <button
                        key={operation?.id}
                        onClick={() => handleOperationSelect(operation)}
                        className={`flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200 text-left ${operation?.bgColor}`}
                      >
                        <Icon name={operation?.icon} size={20} className={operation?.color} />
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{operation?.label}</div>
                          <div className="text-sm text-text-secondary mt-1">
                            {operation?.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div>
                  <div className={`flex items-center space-x-3 p-4 rounded-lg ${selectedOperation?.bgColor} mb-6`}>
                    <Icon name={selectedOperation?.icon} size={24} className={selectedOperation?.color} />
                    <div>
                      <h4 className="font-semibold text-foreground">{selectedOperation?.label}</h4>
                      <p className="text-sm text-text-secondary">{selectedOperation?.description}</p>
                    </div>
                  </div>

                  {/* Operation-specific forms */}
                  {selectedOperation?.id === 'reschedule' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Nova Data de Agendamento
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                          min={new Date()?.toISOString()?.split('T')?.[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Horário de Início
                        </label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                  )}

                  {selectedOperation?.id === 'priority' && (
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Nova Prioridade
                      </label>
                      <select className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary">
                        <option value="urgente">Urgente</option>
                        <option value="alta">Alta</option>
                        <option value="media">Média</option>
                        <option value="baixa">Baixa</option>
                      </select>
                    </div>
                  )}

                  {selectedOperation?.id === 'assign_subject' && (
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Nova Matéria
                      </label>
                      <select className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary">
                        <option value="matematica">Matemática</option>
                        <option value="portugues">Português</option>
                        <option value="direito">Direito</option>
                        <option value="informatica">Informática</option>
                        <option value="atualidades">Atualidades</option>
                      </select>
                    </div>
                  )}

                  {selectedOperation?.id === 'delete' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Icon name="AlertTriangle" size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-900 mb-1">Atenção: Ação Irreversível</h4>
                          <p className="text-sm text-red-700">
                            Esta ação excluirá permanentemente {selectedTasks?.length} tarefa(s). 
                            Todos os dados associados serão perdidos e não poderão ser recuperados.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedOperation && (
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setSelectedOperation(null)}
                >
                  Voltar
                </Button>
                <Button
                  variant={selectedOperation?.id === 'delete' ? 'destructive' : 'default'}
                  onClick={confirmOperation}
                >
                  {selectedOperation?.id === 'delete' ? 'Confirmar Exclusão' : 'Aplicar'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TaskBulkOperations;