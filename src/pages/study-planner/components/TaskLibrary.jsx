import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { taskService } from '../../../services/taskService';
import { useAuth } from '../../../contexts/AuthContext';

const TaskLibrary = ({ 
  unscheduledTasks = [], 
  onTaskSchedule = () => {}, 
  onTaskCreate = () => {}, 
  onTaskEdit = () => {}, 
  onTaskDelete = () => {},
  availableSubjects = []
}) => {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedTaskForSchedule, setSelectedTaskForSchedule] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(new Date()?.toISOString()?.split('T')?.[0]);
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [scheduleDuration, setScheduleDuration] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [newTaskForm, setNewTaskForm] = useState({
    subject: '',
    topic: '',
    duration: 1,
    priority: 'media',
    description: '',
    taskDate: ''
  });

  // Use passed availableSubjects prop instead of hardcoded mock data
  const subjectsToUse = availableSubjects?.length > 0 
    ? availableSubjects?.map(subject => ({ 
        key: subject?.name?.toLowerCase()?.replace(/\s+/g, ''), 
        name: subject?.name 
      }))
    : [];

  // Get topics for selected subject
  const getTopicsForSubject = (subjectName) => {
    const subject = availableSubjects?.find(s => s?.name === subjectName);
    return subject?.topics?.map(topic => topic?.name) || [];
  };

  const subjects = {
    'matematica': { color: 'bg-blue-100 text-blue-800 border-blue-200', name: 'Matemática' },
    'portugues': { color: 'bg-green-100 text-green-800 border-green-200', name: 'Português' },
    'direito': { color: 'bg-purple-100 text-purple-800 border-purple-200', name: 'Direito' },
    'informatica': { color: 'bg-orange-100 text-orange-800 border-orange-200', name: 'Informática' },
    'atualidades': { color: 'bg-red-100 text-red-800 border-red-200', name: 'Atualidades' }
  };

  const priorities = {
    'alta': { color: 'text-red-600', icon: 'AlertTriangle', label: 'Alta' },
    'media': { color: 'text-yellow-600', icon: 'Clock', label: 'Média' },
    'baixa': { color: 'text-green-600', icon: 'CheckCircle', label: 'Baixa' }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e?.dataTransfer?.setData('text/plain', JSON.stringify(task));
  };

  const handleTaskCreate = () => {
    // Reset form and errors
    setNewTaskForm({
      subject: '',
      topic: '',
      duration: 1,
      priority: 'media',
      description: '',
      taskDate: ''
    });
    setErrors({});
    setIsCreateModalOpen(true);
  };

  const getTotalUnscheduledHours = () => {
    if (!Array.isArray(unscheduledTasks)) return 0;
    return unscheduledTasks?.reduce((total, task) => total + (task?.estimated_duration || task?.duration || 1), 0);
  };

  const handleCreateTask = async (taskData) => {
    if (!user) {
      setErrors({ submit: 'You must be logged in to create tasks.' });
      return;
    }

    if (!taskData?.subject?.trim()) {
      setErrors({ subject: 'Please select a subject.' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await taskService?.createTask(taskData, user?.id);
      
      if (result?.error) {
        setErrors({ submit: result?.error });
        return;
      }

      // Success - call parent handler and close modal
      if (typeof onTaskCreate === 'function') {
        onTaskCreate(result?.data);
      }
      
      setNewTaskForm({
        subject: '',
        topic: '',
        duration: 1,
        priority: 'media',
        description: '',
        taskDate: ''
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      setErrors({ submit: 'Failed to create task. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced schedule task with date, time and duration selection
  const handleTaskScheduleWithDateTime = (task) => {
    setSelectedTaskForSchedule(task);
    setIsScheduleModalOpen(true);
  };

  const confirmTaskSchedule = () => {
    if (selectedTaskForSchedule && scheduleDate && scheduleTime) {
      const selectedDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
      const taskWithSchedule = {
        ...selectedTaskForSchedule,
        duration: scheduleDuration,
        startTime: scheduleTime,
        endTime: `${parseInt(scheduleTime?.split(':')?.[0]) + scheduleDuration}:00`
      };
      
      if (typeof onTaskSchedule === 'function') {
        onTaskSchedule(taskWithSchedule, selectedDateTime);
      }
      setIsScheduleModalOpen(false);
      setSelectedTaskForSchedule(null);
    }
  };

  const handleTaskEdit = (task) => {
    if (typeof onTaskEdit === 'function') {
      onTaskEdit(task);
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!user) {
      alert('You must be logged in to delete tasks.');
      return;
    }

    try {
      const result = await taskService?.deleteTask(taskId, user?.id);
      if (result?.success) {
        if (typeof onTaskDelete === 'function') {
          onTaskDelete(taskId);
        }
      } else {
        alert(result?.error || 'Failed to delete task');
      }
    } catch (error) {
      alert('Failed to delete task. Please try again.');
    }
  };

  // Show message if no subjects available
  if (availableSubjects?.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-subtle border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="BookOpen" size={20} color="var(--color-primary)" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Biblioteca de Tarefas</h3>
              <p className="text-sm text-text-secondary">
                {unscheduledTasks?.length || 0} tarefas • {getTotalUnscheduledHours()}h não agendadas
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <Icon name="AlertCircle" size={48} color="var(--color-text-secondary)" />
          <h4 className="text-lg font-medium text-text-secondary mt-4">
            Nenhuma matéria cadastrada
          </h4>
          <p className="text-sm text-text-secondary mt-2 max-w-sm">
            Para criar tarefas, você precisa primeiro cadastrar matérias na aba "Edital".
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/exam-syllabus-manager'}
            className="mt-4"
            iconName="BookOpen"
            iconPosition="left"
          >
            Cadastrar Matérias
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-subtle border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="BookOpen" size={20} color="var(--color-primary)" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Biblioteca de Tarefas</h3>
            <p className="text-sm text-text-secondary">
              {unscheduledTasks?.length || 0} tarefas • {getTotalUnscheduledHours()}h não agendadas
            </p>
          </div>
        </div>
        
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={handleTaskCreate}
        >
          Nova Tarefa
        </Button>
      </div>

      {/* Task List */}
      <div className="max-h-[400px] overflow-y-auto">
        {!unscheduledTasks || unscheduledTasks?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Icon name="BookOpen" size={48} color="var(--color-text-secondary)" />
            <h4 className="text-lg font-medium text-text-secondary mt-4">
              Nenhuma tarefa não agendada
            </h4>
            <p className="text-sm text-text-secondary mt-2 max-w-sm">
              Todas as suas tarefas estão agendadas ou você pode criar uma nova tarefa para começar.
            </p>
            <Button
              variant="outline"
              iconName="Plus"
              iconPosition="left"
              onClick={handleTaskCreate}
              className="mt-4"
            >
              Criar Primeira Tarefa
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {unscheduledTasks?.map((task) => {
              // Map task subject to color scheme
              const subjectKey = task?.subject?.name?.toLowerCase()?.replace(/\s+/g, '') || 
                                task?.subject?.toLowerCase()?.replace(/\s+/g, '');
              const subject = subjects?.[subjectKey] || subjects?.['matematica'];
              const priority = priorities?.[task?.priority] || priorities?.['media'];
              
              return (
                <div
                  key={task?.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  className={`p-4 rounded-lg border cursor-move hover:shadow-sm transition-all duration-150 ${subject?.color}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-sm">
                          {task?.subject?.name || task?.subject}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <Icon name={priority?.icon} size={14} className={priority?.color} />
                          <span className={`text-xs ${priority?.color}`}>{priority?.label}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm opacity-90 mb-2">
                        {task?.title || task?.topic || 'Nova tarefa'}
                      </p>
                      
                      {task?.description && (
                        <p className="text-xs opacity-75 mb-2 line-clamp-2">
                          {task?.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs opacity-75">
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={12} />
                          <span>{task?.estimated_duration || task?.duration}h</span>
                        </div>
                        {task?.taskDate && (
                          <div className="flex items-center space-x-1">
                            <Icon name="Calendar" size={12} />
                            <span>{new Date(task.taskDate)?.toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-4">
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleTaskEdit(task);
                        }}
                        className="p-2 hover:bg-white/50 rounded-md transition-colors duration-150"
                        title="Editar tarefa"
                      >
                        <Icon name="Edit2" size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
                            handleTaskDelete(task?.id);
                          }
                        }}
                        className="p-2 hover:bg-white/50 rounded-md transition-colors duration-150 text-error"
                        title="Excluir tarefa"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                      <div className="w-px h-6 bg-border mx-1" />
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          handleTaskScheduleWithDateTime(task);
                        }}
                        className="p-2 hover:bg-white/50 rounded-md transition-colors duration-150 bg-primary/10 text-primary"
                        title="Agendar tarefa"
                      >
                        <Icon name="Calendar" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Drag Instructions */}
      {unscheduledTasks?.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="MousePointer" size={16} />
            <span>Arraste as tarefas para os horários ou use o botão de agendar para escolher uma data específica</span>
          </div>
        </div>
      )}

      {/* Enhanced Schedule Task Modal */}
      {isScheduleModalOpen && selectedTaskForSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg border border-border w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Agendar Tarefa</h3>
              <button
                onClick={() => {
                  setIsScheduleModalOpen(false);
                  setSelectedTaskForSchedule(null);
                }}
                className="p-2 hover:bg-muted rounded-md transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground">
                  {selectedTaskForSchedule?.title || selectedTaskForSchedule?.topic}
                </h4>
                <p className="text-sm text-text-secondary mt-1">
                  {selectedTaskForSchedule?.subject?.name || selectedTaskForSchedule?.subject}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e?.target?.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    min={new Date()?.toISOString()?.split('T')?.[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Horário *
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e?.target?.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Duração (horas) *
                </label>
                <input
                  type="number"
                  min="0.5"
                  max="8"
                  step="0.5"
                  value={scheduleDuration}
                  onChange={(e) => setScheduleDuration(parseFloat(e?.target?.value) || 1)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div className="text-sm text-text-secondary bg-blue-50 p-3 rounded-lg">
                <Icon name="Info" size={16} className="inline text-blue-600 mr-2" />
                A tarefa será agendada para <strong>{scheduleDate}</strong> às <strong>{scheduleTime}</strong> por <strong>{scheduleDuration}h</strong>.
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => {
                  setIsScheduleModalOpen(false);
                  setSelectedTaskForSchedule(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                onClick={confirmTaskSchedule}
                iconName="Calendar"
                iconPosition="left"
              >
                Agendar Tarefa
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Create Task Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Nova Tarefa</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-muted rounded-md transition-colors"
                disabled={isSubmitting}
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Display submission error */}
              {errors?.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Icon name="AlertCircle" size={16} className="text-red-600 mr-2" />
                    <div>
                      <p className="text-sm text-red-800">{errors?.submit}</p>
                      <button 
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(errors?.submit)}
                        className="text-xs text-red-600 hover:text-red-800 underline mt-1"
                      >
                        Copy error message
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Matéria *
                </label>
                <select 
                  value={newTaskForm?.subject}
                  onChange={(e) => {
                    const selectedSubject = e?.target?.value;
                    setNewTaskForm(prev => ({ 
                      ...prev, 
                      subject: selectedSubject,
                      topic: '' // Reset topic when subject changes
                    }));
                    // Clear errors when user makes a selection
                    if (errors?.subject) {
                      setErrors(prev => ({ ...prev, subject: null }));
                    }
                  }}
                  className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Selecione uma matéria</option>
                  {subjectsToUse?.map((subject, index) => (
                    <option key={index} value={subject?.name}>
                      {subject?.name}
                    </option>
                  ))}
                </select>
                {errors?.subject && (
                  <p className="text-sm text-red-600 mt-1">{errors?.subject}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tópico (opcional)
                </label>
                <select
                  value={newTaskForm?.topic}
                  onChange={(e) => setNewTaskForm(prev => ({ ...prev, topic: e?.target?.value }))}
                  className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  disabled={!newTaskForm?.subject || isSubmitting}
                >
                  <option value="">Selecione um tópico</option>
                  {newTaskForm?.subject && getTopicsForSubject(newTaskForm?.subject)?.map((topic, index) => (
                    <option key={index} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
                {!newTaskForm?.subject && (
                  <p className="text-xs text-text-secondary mt-1">
                    Selecione uma matéria primeiro para ver os tópicos disponíveis
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Descrição
                </label>
                <textarea
                  value={newTaskForm?.description}
                  onChange={(e) => setNewTaskForm(prev => ({ ...prev, description: e?.target?.value }))}
                  className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary h-20 resize-none"
                  placeholder="Descreva o que será estudado nesta tarefa..."
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Duração (horas)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="8"
                    step="0.5"
                    value={newTaskForm?.duration}
                    onChange={(e) => setNewTaskForm(prev => ({ ...prev, duration: parseFloat(e?.target?.value) || 1 }))}
                    className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Prioridade
                  </label>
                  <select 
                    value={newTaskForm?.priority}
                    onChange={(e) => setNewTaskForm(prev => ({ ...prev, priority: e?.target?.value }))}
                    className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    disabled={isSubmitting}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Data da Tarefa
                </label>
                <input
                  type="date"
                  value={newTaskForm?.taskDate}
                  onChange={(e) => setNewTaskForm(prev => ({ ...prev, taskDate: e?.target?.value }))}
                  className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  min={new Date()?.toISOString()?.split('T')?.[0]}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                onClick={() => handleCreateTask(newTaskForm)}
                disabled={!newTaskForm?.subject?.trim() || isSubmitting}
                iconName={isSubmitting ? "Loader2" : "Plus"}
                iconPosition="left"
                className={isSubmitting ? "animate-spin" : ""}
              >
                {isSubmitting ? 'Criando...' : 'Criar Tarefa'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskLibrary;
