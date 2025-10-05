import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingTasks = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Resolver 20 questões de Matemática',
      subject: 'Matemática',
      timeBlock: '09:00 - 10:00',
      priority: 'high',
      type: 'practice',
      completed: false,
      estimatedTime: 60
    },
    {
      id: 2,
      title: 'Revisar anotações de Português',
      subject: 'Português',
      timeBlock: '10:30 - 11:00',
      priority: 'medium',
      type: 'review',
      completed: true,
      estimatedTime: 30
    },
    {
      id: 3,
      title: 'Estudar Direito Constitucional - Cap. 3',
      subject: 'Direito Constitucional',
      timeBlock: '14:00 - 15:30',
      priority: 'high',
      type: 'study',
      completed: false,
      estimatedTime: 90
    },
    {
      id: 4,
      title: 'Fazer simulado de Informática',
      subject: 'Informática',
      timeBlock: '16:00 - 17:00',
      priority: 'medium',
      type: 'test',
      completed: false,
      estimatedTime: 60
    },
    {
      id: 5,
      title: 'Revisar erros do caderno',
      subject: 'Geral',
      timeBlock: '19:00 - 19:30',
      priority: 'low',
      type: 'review',
      completed: false,
      estimatedTime: 30
    }
  ]);

  const [draggedTask, setDraggedTask] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-error bg-error bg-opacity-5';
      case 'medium': return 'border-l-warning bg-warning bg-opacity-5';
      case 'low': return 'border-l-success bg-success bg-opacity-5';
      default: return 'border-l-muted bg-muted';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'study': return 'BookOpen';
      case 'practice': return 'PenTool';
      case 'review': return 'RefreshCw';
      case 'test': return 'FileText';
      default: return 'Circle';
    }
  };

  const handleTaskToggle = (taskId) => {
    setTasks(tasks?.map(task => 
      task?.id === taskId 
        ? { ...task, completed: !task?.completed }
        : task
    ));
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetTask) => {
    e?.preventDefault();
    if (!draggedTask || draggedTask?.id === targetTask?.id) return;

    const draggedIndex = tasks?.findIndex(t => t?.id === draggedTask?.id);
    const targetIndex = tasks?.findIndex(t => t?.id === targetTask?.id);

    const newTasks = [...tasks];
    newTasks?.splice(draggedIndex, 1);
    newTasks?.splice(targetIndex, 0, draggedTask);

    setTasks(newTasks);
    setDraggedTask(null);
  };

  const completedTasks = tasks?.filter(t => t?.completed)?.length;
  const totalTime = tasks?.reduce((sum, task) => sum + task?.estimatedTime, 0);

  return (
    <div className="bg-white rounded-lg border border-border shadow-subtle p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <Icon name="CalendarDays" size={24} className="mr-2 text-primary" />
          Tarefas de Hoje
        </h2>
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          onClick={() => window.location.href = '/study-planner'}
        >
          Nova Tarefa
        </Button>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-foreground">{completedTasks}/{tasks?.length}</div>
          <div className="text-xs text-text-secondary">Concluídas</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-foreground">{Math.floor(totalTime / 60)}h{totalTime % 60}m</div>
          <div className="text-xs text-text-secondary">Tempo Total</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-foreground">{Math.round((completedTasks / tasks?.length) * 100)}%</div>
          <div className="text-xs text-text-secondary">Progresso</div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedTasks / tasks?.length) * 100}%` }}
          />
        </div>
      </div>
      {/* Tasks List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {tasks?.map((task) => (
          <div
            key={task?.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, task)}
            className={`p-4 rounded-lg border-l-4 transition-all duration-150 cursor-move hover:shadow-subtle ${
              getPriorityColor(task?.priority)
            } ${task?.completed ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <button
                  onClick={() => handleTaskToggle(task?.id)}
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150 ${
                    task?.completed
                      ? 'bg-success border-success text-success-foreground'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  {task?.completed && <Icon name="Check" size={12} />}
                </button>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name={getTypeIcon(task?.type)} size={16} className="text-text-secondary" />
                    <h3 className={`font-medium ${task?.completed ? 'line-through text-text-secondary' : 'text-foreground'}`}>
                      {task?.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-text-secondary">
                    <span className="font-medium">{task?.subject}</span>
                    <span className="flex items-center">
                      <Icon name="Clock" size={12} className="mr-1" />
                      {task?.timeBlock}
                    </span>
                    <span className="flex items-center">
                      <Icon name="Timer" size={12} className="mr-1" />
                      {task?.estimatedTime}min
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <div className={`w-2 h-2 rounded-full ${
                  task?.priority === 'high' ? 'bg-error' :
                  task?.priority === 'medium' ? 'bg-warning' : 'bg-success'
                }`} />
                <Icon name="GripVertical" size={16} className="text-text-secondary cursor-move" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Arraste para reordenar tarefas
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Calendar"
              onClick={() => window.location.href = '/study-planner'}
            >
              Ver Planejamento
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="BookMarked"
              onClick={() => console.log('Abrir caderno de erros')}
            >
              Caderno de Erros
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingTasks;