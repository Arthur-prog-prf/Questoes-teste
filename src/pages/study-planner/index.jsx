import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import DailyView from './components/DailyView';
import WeeklyView from './components/WeeklyView';
import PlannerStats from './components/PlannerStats';
import TaskLibrary from './components/TaskLibrary';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const StudyPlanner = () => {
  const [currentView, setCurrentView] = useState('daily');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock data - In real app, this would come from Supabase
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);

  const views = [
    { key: 'daily', label: 'Visão Diária', icon: 'Calendar' },
    { key: 'weekly', label: 'Visão Semanal', icon: 'CalendarDays' }
  ];

  // Enhanced task creation handler for time slot clicks with comprehensive modal
  const handleCreateTaskInTimeSlot = (timeSlot, date, dayIndex) => {
    const selectedHour = parseInt(timeSlot?.split(':')?.[0]);
    setIsTaskCreationModalOpen(true);
    setTaskCreationData({
      timeSlot,
      selectedHour,
      date,
      dayIndex,
      duration: 1
    });
    // Set default times based on clicked slot
    setNewTaskForm(prev => ({
      ...prev,
      subject: '', // Ensure subject is reset for new tasks
      topic: '', // Ensure topic is reset for new tasks
      customStartTime: timeSlot, // Default to clicked time slot
      customEndTime: `${String(selectedHour + 1)?.padStart(2, '0')}:00` // Default to next hour
    }));
  };

  const [isTaskCreationModalOpen, setIsTaskCreationModalOpen] = useState(false);
  const [taskCreationData, setTaskCreationData] = useState(null);
  const [newTaskForm, setNewTaskForm] = useState({
    subject: '',
    topic: '',
    duration: 1,
    priority: 'media',
    description: '',
    taskDate: '',
    customStartTime: '',
    customEndTime: ''
  });

  // Mock existing subjects data - in real app, this would come from exam-syllabus-manager
  const existingSubjects = [
    {
      name: 'Direito Constitucional',
      topics: [
        { name: 'Princípios Fundamentais da Constituição' },
        { name: 'Direitos e Garantias Fundamentais' },
        { name: 'Organização do Estado' },
        { name: 'Organização dos Poderes' }
      ]
    },
    {
      name: 'Direito Administrativo',
      topics: [
        { name: 'Princípios da Administração Pública' },
        { name: 'Atos Administrativos' },
        { name: 'Licitações e Contratos' }
      ]
    },
    {
      name: 'Matemática',
      topics: [
        { name: 'Regra de Três' },
        { name: 'Porcentagem' },
        { name: 'Juros Simples e Compostos' }
      ]
    },
    {
      name: 'Português',
      topics: [
        { name: 'Concordância Verbal' },
        { name: 'Concordância Nominal' }
      ]
    }
  ];

  // Get topics for selected subject
  const getTopicsForSelectedSubject = (subjectName) => {
    const subject = existingSubjects?.find(s => s?.name === subjectName);
    return subject?.topics?.map(topic => topic?.name) || [];
  };

  // Validate time selection constraints
  const validateTimeSelection = (startTime, endTime, selectedHour) => {
    if (!startTime || !endTime) return { isValid: false, error: 'Horários obrigatórios' };
    
    const [startHour, startMinute] = startTime?.split(':')?.map(Number);
    const [endHour, endMinute] = endTime?.split(':')?.map(Number);
    
    // Check if start time is within the selected hour (0-59 minutes)
    if (startHour !== selectedHour) {
      return { 
        isValid: false, 
        error: `Horário inicial deve estar entre ${String(selectedHour)?.padStart(2, '0')}:00 e ${String(selectedHour)?.padStart(2, '0')}:59` 
      };
    }
    
    // Check if end time is after start time
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    if (endTotalMinutes <= startTotalMinutes) {
      return { 
        isValid: false, 
        error: 'Horário final deve ser maior que o horário inicial' 
      };
    }
    
    return { isValid: true, error: null };
  };

  // Calculate duration in hours from start and end times
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 1;
    
    const [startHour, startMinute] = startTime?.split(':')?.map(Number);
    const [endHour, endMinute] = endTime?.split(':')?.map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    return (endTotalMinutes - startTotalMinutes) / 60;
  };

  const handleCreateTaskDirectly = (taskData) => {
    if (!taskData?.subject?.trim()) {
      alert('Por favor, selecione uma matéria.');
      return;
    }

    if (taskCreationData) {
      // Validate custom time selection if from time slot click
      if (taskCreationData?.timeSlot && taskData?.customStartTime && taskData?.customEndTime) {
        const validation = validateTimeSelection(
          taskData?.customStartTime, 
          taskData?.customEndTime, 
          taskCreationData?.selectedHour
        );
        
        if (!validation?.isValid) {
          alert(validation?.error);
          return;
        }
      }

      const duration = taskCreationData?.timeSlot 
        ? calculateDuration(taskData?.customStartTime, taskData?.customEndTime)
        : (taskData?.duration || 1);
      
      const newScheduledTask = {
        id: `scheduled-${Date.now()}`,
        subject: taskData?.subject?.trim(), // Store exact subject name from form
        topic: taskData?.topic?.trim() || 'Tópico Geral',
        duration: duration,
        priority: taskData?.priority || 'media',
        description: taskData?.description?.trim() || '',
        startTime: taskCreationData?.timeSlot ? taskData?.customStartTime : taskCreationData?.timeSlot,
        endTime: taskCreationData?.timeSlot ? taskData?.customEndTime : `${parseInt(taskCreationData?.timeSlot?.split(':')?.[0]) + duration}:00`,
        scheduledDate: taskCreationData?.date?.toISOString()?.split('T')?.[0],
        completed: false,
        createdAt: new Date()?.toISOString(),
        taskDate: taskCreationData?.date?.toISOString()?.split('T')?.[0]
      };
      
      setScheduledTasks(prev => [...prev, newScheduledTask]);
      setIsTaskCreationModalOpen(false);
      setTaskCreationData(null);
      // Reset form completely
      setNewTaskForm({
        subject: '',
        topic: '',
        duration: 1,
        priority: 'media',
        description: '',
        taskDate: '',
        customStartTime: '',
        customEndTime: ''
      });
    }
  };

  // Enhanced task update handler for synchronization between views
  const handleTaskUpdate = (updatedTask) => {
    setScheduledTasks(prev => prev?.map(task => 
      task?.id === updatedTask?.id 
        ? { ...task, ...updatedTask } 
        : task
    ));
  };

  // Enhanced task move handler with full synchronization
  const handleTaskMove = (task, dayIndex, timeSlot) => {
    const updatedTask = {
      ...task,
      startTime: timeSlot,
      endTime: `${parseInt(timeSlot?.split(':')?.[0]) + (task?.duration || 1)}:00`,
      scheduledDate: selectedDate?.toISOString()?.split('T')?.[0]
    };
    
    setScheduledTasks(prev => prev?.map(t => 
      t?.id === task?.id ? updatedTask : t
    ));
  };

  // Enhanced task edit handler with proper synchronization
  const handleTaskEdit = (task) => {
    // You can implement a proper edit modal here
    // For now, we'll log the task for editing
    console.log('Editing task:', task);
    
    // TODO: Implement proper edit modal that updates both daily and weekly views
    // When task is edited, make sure to call handleTaskUpdate to synchronize views
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Planejador de Estudos
              </h1>
              <p className="text-text-secondary">
                Organize sua rotina de estudos de forma inteligente e eficiente
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-white rounded-lg border border-border p-1">
              {views?.map((view) => (
                <button
                  key={view?.key}
                  onClick={() => setCurrentView(view?.key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentView === view?.key
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-secondary hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={view?.icon} size={16} />
                  <span className="hidden sm:inline">{view?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mb-8">
            <PlannerStats 
              scheduledTasks={scheduledTasks}
              selectedDate={selectedDate}
              currentView={currentView}
              weeklySchedule={scheduledTasks?.filter(task => {
                const taskDate = new Date(task.scheduledDate);
                const weekStart = new Date(selectedDate);
                weekStart?.setDate(weekStart?.getDate() - weekStart?.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd?.setDate(weekEnd?.getDate() + 6);
                return taskDate >= weekStart && taskDate <= weekEnd;
              })}
              selectedWeek={selectedDate}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Calendar Views */}
            <div className="xl:col-span-3">
              {currentView === 'daily' ? (
                <DailyView 
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  scheduledTasks={scheduledTasks?.filter(task => 
                    task?.scheduledDate === selectedDate?.toISOString()?.split('T')?.[0]
                  )}
                  onTasksUpdate={setScheduledTasks}
                  onTaskMove={handleTaskMove}
                  onTaskEdit={handleTaskEdit}
                  onTaskDelete={(taskId) => {
                    setScheduledTasks(prev => prev?.filter(task => task?.id !== taskId));
                  }}
                  onTimeSlotClick={handleCreateTaskInTimeSlot}
                  onTaskUpdate={handleTaskUpdate}
                />
              ) : (
                <WeeklyView 
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  scheduledTasks={scheduledTasks}
                  onTasksUpdate={setScheduledTasks}
                  weeklySchedule={scheduledTasks?.filter(task => {
                    const taskDate = new Date(task.scheduledDate);
                    const weekStart = new Date(selectedDate);
                    weekStart?.setDate(weekStart?.getDate() - weekStart?.getDay());
                    const weekEnd = new Date(weekStart);
                    weekEnd?.setDate(weekEnd?.getDate() + 6);
                    return taskDate >= weekStart && taskDate <= weekEnd;
                  })}
                  selectedWeek={selectedDate}
                  onWeekChange={setSelectedDate}
                  onTaskMove={(taskId, newTimeSlot) => {
                    const task = scheduledTasks?.find(t => t?.id === taskId);
                    if (task) {
                      const updatedTask = {
                        ...task,
                        startTime: newTimeSlot?.startTime,
                        endTime: newTimeSlot?.endTime,
                        scheduledDate: newTimeSlot?.targetDate?.toISOString()?.split('T')?.[0]
                      };
                      handleTaskUpdate(updatedTask);
                    }
                  }}
                  onTaskEdit={handleTaskEdit}
                  onTaskDelete={(taskId) => {
                    setScheduledTasks(prev => prev?.filter(task => task?.id !== taskId));
                  }}
                  onTimeSlotClick={handleCreateTaskInTimeSlot}
                  onTaskUpdate={handleTaskUpdate}
                />
              )}
            </div>

            {/* Task Library Sidebar */}
            <div className="xl:col-span-1">
              <div className="sticky top-8">
                <TaskLibrary 
                  unscheduledTasks={availableTasks}
                  existingSubjects={existingSubjects}
                  onTaskSchedule={(task, selectedDate) => {
                    const newScheduledTask = {
                      ...task,
                      scheduledDate: selectedDate?.toISOString()?.split('T')?.[0],
                      startTime: task?.startTime || '09:00',
                      endTime: task?.endTime || `${9 + (task?.duration || 1)}:00`,
                      id: `scheduled-${Date.now()}`
                    };
                    setScheduledTasks(prev => [...prev, newScheduledTask]);
                    setAvailableTasks(prev => prev?.filter(t => t?.id !== task?.id));
                  }}
                  onTaskCreate={(newTask) => {
                    setAvailableTasks(prev => [...prev, newTask]);
                  }}
                  onTaskEdit={handleTaskEdit}
                  onTaskDelete={(taskId) => {
                    setAvailableTasks(prev => prev?.filter(task => task?.id !== taskId));
                  }}
                />
              </div>
            </div>
          </div>

          {/* Empty State for First Time Users */}
          {scheduledTasks?.length === 0 && availableTasks?.length === 0 && (
            <div className="mt-8 bg-white rounded-lg border border-border p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Calendar" size={32} color="var(--color-primary)" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Bem-vindo ao Planejador
                </h3>
                <p className="text-text-secondary mb-6">
                  Comece criando tarefas na biblioteca e agendando-as no seu calendário para uma rotina de estudos mais organizada.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
          )}

          {/* Enhanced Task Creation Modal with Custom Time Selection */}
          {isTaskCreationModalOpen && taskCreationData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">+ Adicionar Tarefa</h3>
                  <button
                    onClick={() => {
                      setIsTaskCreationModalOpen(false);
                      setTaskCreationData(null);
                    }}
                    className="p-2 hover:bg-muted rounded-md transition-colors"
                  >
                    <Icon name="X" size={20} />
                  </button>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Date and custom time selection for time slot clicks */}
                  {taskCreationData?.timeSlot && (
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm mb-3">
                        <Icon name="Calendar" size={16} className="text-primary" />
                        <span className="font-medium text-foreground">
                          {taskCreationData?.date?.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      
                      {/* Custom Time Selection */}
                      <div className="space-y-3">
                        <div className="text-xs font-medium text-text-secondary mb-2">
                          Escolha o horário da tarefa:
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-1">
                              Início
                            </label>
                            <input
                              type="time"
                              value={newTaskForm?.customStartTime}
                              onChange={(e) => {
                                const startTime = e?.target?.value;
                                setNewTaskForm(prev => ({ ...prev, customStartTime: startTime }));
                                
                                // Auto-adjust end time if it becomes invalid
                                if (startTime && prev?.customEndTime) {
                                  const [startHour, startMinute] = startTime?.split(':')?.map(Number);
                                  const [endHour, endMinute] = prev?.customEndTime?.split(':')?.map(Number);
                                  const startTotalMinutes = startHour * 60 + startMinute;
                                  const endTotalMinutes = endHour * 60 + endMinute;
                                  
                                  if (endTotalMinutes <= startTotalMinutes) {
                                    // Set end time 30 minutes after start time
                                    const newEndMinutes = startTotalMinutes + 30;
                                    const newEndHour = Math.floor(newEndMinutes / 60);
                                    const newEndMinute = newEndMinutes % 60;
                                    const newEndTime = `${String(newEndHour)?.padStart(2, '0')}:${String(newEndMinute)?.padStart(2, '0')}`;
                                    setNewTaskForm(prev => ({ ...prev, customEndTime: newEndTime }));
                                  }
                                }
                              }}
                              className="w-full p-2 text-sm border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                              min={`${String(taskCreationData?.selectedHour)?.padStart(2, '0')}:00`}
                              max={`${String(taskCreationData?.selectedHour)?.padStart(2, '0')}:59`}
                            />                      
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-1">
                              Término
                            </label>
                            <input
                              type="time"
                              value={newTaskForm?.customEndTime}
                              onChange={(e) => setNewTaskForm(prev => ({ ...prev, customEndTime: e?.target?.value }))}
                              className="w-full p-2 text-sm border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                              min={newTaskForm?.customStartTime || `${String(taskCreationData?.selectedHour + 1)?.padStart(2, '0')}:00`}
                            />                            
                          </div>
                        </div>
                        
                        {/* Duration Display */}
                        {newTaskForm?.customStartTime && newTaskForm?.customEndTime && (
                          <div className="flex items-center justify-center p-2 bg-success/10 border border-success/20 rounded">
                            <Icon name="Clock" size={14} className="text-success mr-1" />
                            <span className="text-xs font-medium text-success">
                              Duração: {(calculateDuration(newTaskForm?.customStartTime, newTaskForm?.customEndTime) * 60)?.toFixed(0)} minutos
                              ({calculateDuration(newTaskForm?.customStartTime, newTaskForm?.customEndTime)?.toFixed(1)}h)
                            </span>
                          </div>
                        )}
                        
                        {/* Validation Error Display */}
                        {newTaskForm?.customStartTime && newTaskForm?.customEndTime && (
                          (() => {
                            const validation = validateTimeSelection(
                              newTaskForm?.customStartTime, 
                              newTaskForm?.customEndTime, 
                              taskCreationData?.selectedHour
                            );
                            if (!validation?.isValid) {
                              return (
                                <div className="flex items-center p-2 bg-error/10 border border-error/20 rounded">
                                  <Icon name="AlertTriangle" size={14} className="text-error mr-1" />
                                  <span className="text-xs text-error">{validation?.error}</span>
                                </div>
                              );
                            }
                            return null;
                          })()
                        )}
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
                      }}
                      className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    >
                      <option value="">Selecione uma matéria</option>
                      {existingSubjects?.map((subject, index) => (
                        <option key={index} value={subject?.name}>
                          {subject?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tópico
                    </label>
                    <select
                      value={newTaskForm?.topic}
                      onChange={(e) => setNewTaskForm(prev => ({ ...prev, topic: e?.target?.value }))}
                      className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      disabled={!newTaskForm?.subject}
                    >
                      <option value="">Selecione um tópico</option>
                      {newTaskForm?.subject && getTopicsForSelectedSubject(newTaskForm?.subject)?.map((topic, index) => (
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
                      placeholder="Descreva o que será estudado..."
                    />
                  </div>

                  {/* Only show date and duration fields if NOT clicking from a time slot */}
                  {!taskCreationData?.timeSlot && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Data da Tarefa
                        </label>
                        <input
                          type="date"
                          value={newTaskForm?.taskDate || taskCreationData?.date?.toISOString()?.split('T')?.[0]}
                          onChange={(e) => setNewTaskForm(prev => ({ ...prev, taskDate: e?.target?.value }))}
                          className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                          min={new Date()?.toISOString()?.split('T')?.[0]}
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
                          >
                            <option value="baixa">Baixa</option>
                            <option value="media">Média</option>
                            <option value="alta">Alta</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* If clicking from time slot, show only priority field */}
                  {taskCreationData?.timeSlot && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Prioridade
                      </label>
                      <select 
                        value={newTaskForm?.priority}
                        onChange={(e) => setNewTaskForm(prev => ({ ...prev, priority: e?.target?.value }))}
                        className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-end space-x-3 p-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsTaskCreationModalOpen(false);
                      setTaskCreationData(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleCreateTaskDirectly(newTaskForm)}
                    disabled={
                      !newTaskForm?.subject?.trim() ||
                      (taskCreationData?.timeSlot && 
                        (!newTaskForm?.customStartTime || !newTaskForm?.customEndTime ||
                          !validateTimeSelection(
                            newTaskForm?.customStartTime, 
                            newTaskForm?.customEndTime, 
                            taskCreationData?.selectedHour
                          )?.isValid
                        )
                      )
                    }
                    iconName="Plus"
                    iconPosition="left"
                  >
                    + Adicionar Tarefa
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudyPlanner;