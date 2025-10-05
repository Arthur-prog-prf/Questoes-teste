import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const TaskLibrarySection = ({ 
  tasks = [], 
  selectedTasks = [], 
  onTaskSelection, 
  onTaskCreate,
  onTaskDelete
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate', 'priority', 'subject', 'duration'
  const [showCreateModal, setShowCreateModal] = useState(false);

  const subjects = {
    'matematica': { name: 'Matemática', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'Calculator' },
    'portugues': { name: 'Português', color: 'bg-green-100 text-green-800 border-green-200', icon: 'BookOpen' },
    'direito': { name: 'Direito', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: 'Scale' },
    'informatica': { name: 'Informática', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: 'Monitor' },
    'atualidades': { name: 'Atualidades', color: 'bg-red-100 text-red-800 border-red-200', icon: 'Newspaper' }
  };

  const priorities = {
    'baixa': { label: 'Baixa', color: 'text-green-600', bgColor: 'bg-green-50', icon: 'ArrowDown' },
    'media': { label: 'Média', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: 'Minus' },
    'alta': { label: 'Alta', color: 'text-red-600', bgColor: 'bg-red-50', icon: 'ArrowUp' },
    'urgente': { label: 'Urgente', color: 'text-red-800', bgColor: 'bg-red-100', icon: 'AlertTriangle' }
  };

  const statuses = {
    'todo': { label: 'Pendente', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: 'Circle' },
    'in_progress': { label: 'Em Progresso', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: 'Clock' },
    'completed': { label: 'Concluída', color: 'text-green-600', bgColor: 'bg-green-50', icon: 'CheckCircle' },
    'paused': { label: 'Pausada', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: 'Pause' }
  };

  const sortedTasks = [...tasks]?.sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a?.dueDate || '9999-12-31') - new Date(b?.dueDate || '9999-12-31');
      case 'priority':
        const priorityOrder = { 'urgente': 4, 'alta': 3, 'media': 2, 'baixa': 1 };
        return (priorityOrder?.[b?.priority] || 0) - (priorityOrder?.[a?.priority] || 0);
      case 'subject':
        return a?.subject?.localeCompare(b?.subject);
      case 'duration':
        return (b?.estimatedDuration || 0) - (a?.estimatedDuration || 0);
      default:
        return 0;
    }
  });

  const handleSelectAll = () => {
    if (selectedTasks?.length === tasks?.length) {
      // Deselect all
      tasks?.forEach(task => onTaskSelection(task?.id, false));
    } else {
      // Select all
      tasks?.forEach(task => onTaskSelection(task?.id, true));
    }
  };

  const TaskCard = ({ task }) => {
    const subject = subjects?.[task?.subject] || subjects?.['matematica'];
    const priority = priorities?.[task?.priority] || priorities?.['media'];
    const status = statuses?.[task?.status] || statuses?.['todo'];
    const isSelected = selectedTasks?.includes(task?.id);
    const isOverdue = task?.dueDate && new Date(task?.dueDate) < new Date() && task?.status !== 'completed';

    return (
      <div className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary border-primary' : 'border-border'
      } ${isOverdue ? 'border-red-200 bg-red-50/30' : 'bg-white'}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Checkbox
              checked={isSelected}
              onChange={(checked) => onTaskSelection(task?.id, checked)}
            />
            <div className={`px-2 py-1 rounded-md border text-xs font-medium ${subject?.color}`}>
              <Icon name={subject?.icon} size={12} className="inline mr-1" />
              {subject?.name}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isOverdue && (
              <Icon name="AlertTriangle" size={16} className="text-red-500" />
            )}
            <div className={`px-2 py-1 rounded-md text-xs font-medium ${priority?.bgColor} ${priority?.color}`}>
              <Icon name={priority?.icon} size={10} className="inline mr-1" />
              {priority?.label}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{task?.title}</h3>
          <p className="text-sm text-text-secondary mb-2">{task?.topic}</p>
          {task?.description && (
            <p className="text-xs text-text-secondary line-clamp-2">{task?.description}</p>
          )}
        </div>

        {/* Progress Bar */}
        {task?.completionRate > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary">Progresso</span>
              <span className="text-xs font-medium">{task?.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${task?.completionRate}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer with Action Buttons */}
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} />
              <span>{task?.estimatedDuration}h</span>
            </div>
            {task?.dueDate && (
              <div className={`flex items-center space-x-1 ${
                isOverdue ? 'text-red-600 font-medium' : ''
              }`}>
                <Icon name="Calendar" size={12} />
                <span>{new Date(task?.dueDate)?.toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${status?.bgColor} ${status?.color}`}>
              <Icon name={status?.icon} size={12} />
              <span>{status?.label}</span>
            </div>
            
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e?.stopPropagation();
                if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
                  onTaskDelete?.(task?.id);
                }
              }}
              className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors duration-150"
              title="Excluir tarefa"
            >
              <Icon name="Trash2" size={12} />
            </button>
          </div>
        </div>

        {/* Tags */}
        {task?.tags && task?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {task?.tags?.slice(0, 3)?.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-muted text-text-secondary text-xs rounded">
                #{tag}
              </span>
            ))}
            {task?.tags?.length > 3 && (
              <span className="text-xs text-text-secondary">+{task?.tags?.length - 3}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  const TaskRow = ({ task }) => {
    const subject = subjects?.[task?.subject] || subjects?.['matematica'];
    const priority = priorities?.[task?.priority] || priorities?.['media'];
    const status = statuses?.[task?.status] || statuses?.['todo'];
    const isSelected = selectedTasks?.includes(task?.id);
    const isOverdue = task?.dueDate && new Date(task?.dueDate) < new Date() && task?.status !== 'completed';

    return (
      <tr className={`hover:bg-muted/50 transition-colors ${
        isSelected ? 'bg-primary/5' : ''
      } ${isOverdue ? 'bg-red-50' : ''}`}>
        <td className="px-4 py-3">
          <Checkbox
            checked={isSelected}
            onChange={(checked) => onTaskSelection(task?.id, checked)}
          />
        </td>
        <td className="px-4 py-3">
          <div>
            <div className="font-medium text-foreground line-clamp-1">{task?.title}</div>
            <div className="text-sm text-text-secondary">{task?.topic}</div>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className={`inline-flex px-2 py-1 rounded-md border text-xs font-medium ${subject?.color}`}>
            <Icon name={subject?.icon} size={12} className="mr-1" />
            {subject?.name}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${priority?.bgColor} ${priority?.color}`}>
            <Icon name={priority?.icon} size={10} className="mr-1" />
            {priority?.label}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${status?.bgColor} ${status?.color}`}>
            <Icon name={status?.icon} size={12} className="mr-1" />
            {status?.label}
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-text-secondary">
          {task?.estimatedDuration}h
        </td>
        <td className="px-4 py-3 text-sm text-text-secondary">
          {task?.dueDate ? (
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {new Date(task?.dueDate)?.toLocaleDateString('pt-BR')}
            </span>
          ) : '-'}
        </td>
        <td className="px-4 py-3">
          {task?.completionRate > 0 && (
            <div className="w-16">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs">{task?.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-primary h-1 rounded-full"
                  style={{ width: `${task?.completionRate}%` }}
                />
              </div>
            </div>
          )}
        </td>
        <td className="px-4 py-3">
          <button
            onClick={(e) => {
              e?.stopPropagation();
              if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
                onTaskDelete?.(task?.id);
              }
            }}
            className="p-2 hover:bg-red-100 rounded text-red-600 transition-colors duration-150"
            title="Excluir tarefa"
          >
            <Icon name="Trash2" size={14} />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-subtle border border-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Biblioteca de Tarefas</h2>
          <p className="text-text-secondary mt-1">
            {tasks?.length} tarefa(s) • {selectedTasks?.length} selecionada(s)
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
              }`}
              title="Visualização em grade"
            >
              <Icon name="Grid3X3" size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
              }`}
              title="Visualização em lista"
            >
              <Icon name="List" size={16} />
            </button>
          </div>

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="dueDate">Ordenar por Data</option>
            <option value="priority">Ordenar por Prioridade</option>
            <option value="subject">Ordenar por Matéria</option>
            <option value="duration">Ordenar por Duração</option>
          </select>

          {/* Select All */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            {selectedTasks?.length === tasks?.length && tasks?.length > 0 ? 'Desmarcar Todas' : 'Selecionar Todas'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {tasks?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="BookOpen" size={48} className="mx-auto text-text-secondary mb-4" />
            <h3 className="text-lg font-medium text-text-secondary mb-2">
              Nenhuma tarefa encontrada
            </h3>
            <p className="text-text-secondary mb-6">
              Crie sua primeira tarefa para começar a organizar seus estudos
            </p>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => setShowCreateModal(true)}
            >
              Criar Primeira Tarefa
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedTasks?.map((task) => (
              <TaskCard key={task?.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={selectedTasks?.length === tasks?.length && tasks?.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Tarefa</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Matéria</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Prioridade</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Duração</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Prazo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Progresso</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedTasks?.map((task) => (
                  <TaskRow key={task?.id} task={task} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskLibrarySection;