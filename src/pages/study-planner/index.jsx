import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import DailyView from './components/DailyView';
import WeeklyView from './components/WeeklyView';
import PlannerStats from './components/PlannerStats';
import TaskLibrary from './components/TaskLibrary';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const StudyPlanner = () => {
  const [currentView, setCurrentView] = useState('daily');
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

  const handleAddTask = (newTask) => {
    setAvailableTasks(prev => [...prev, newTask]);
  };

  const handleTaskMove = (taskId, newDate, newTimeSlot) => {
    setScheduledTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, scheduledDate: newDate, timeSlot: newTimeSlot }
        : task
    ));
  };

  const handleTaskEdit = (taskId, updatedTask) => {
    setScheduledTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updatedTask } : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setScheduledTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleTaskUpdate = (taskId, updates) => {
    setScheduledTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleWeekChange = (newWeek) => {
    setSelectedDate(newWeek);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="pt-16">
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
                  onTaskDelete={handleTaskDelete}
                  onTimeSlotClick={handleCreateTaskInTimeSlot}
                  onTaskUpdate={handleTaskUpdate}
                />
              ) : (
                <WeeklyView 
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  scheduledTasks={scheduledTasks}
                  onTasksUpdate={setScheduledTasks}
                  onTaskMove={handleTaskMove}
                  onTaskEdit={handleTaskEdit}
                  onTaskDelete={handleTaskDelete}
                  selectedWeek={selectedDate}
                  onWeekChange={handleWeekChange}
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
                  onTaskCreate={handleAddTask}
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
        </div>
      </main>
    </div>
  );
};

export default StudyPlanner;
