import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import DailyView from './components/DailyView';
import WeeklyView from './components/WeeklyView';
import PlannerStats from './components/PlannerStats';
import TaskLibrary from './components/TaskLibrary';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { subjectService } from '../../services/subjectService';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../contexts/AuthContext';

const StudyPlanner = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Supabase integration - replace mock data
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const views = [
    { key: 'daily', label: 'Visão Diária', icon: 'Calendar' },
    { key: 'weekly', label: 'Visão Semanal', icon: 'CalendarDays' }
  ];

  // Load data on component mount and when user changes
  useEffect(() => {
    if (user) {
      loadInitialData();
    } else {
      // Clear data when user logs out
      setScheduledTasks([]);
      setAvailableTasks([]);
      setAvailableSubjects([]);
      setLoading(false);
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load subjects and tasks in parallel
      const [subjectsResult, tasksResult, unscheduledTasksResult] = await Promise.all([
        subjectService?.getSubjects(),
        user ? taskService?.getUserTasks(user?.id) : { data: [], error: null },
        user ? taskService?.getUnscheduledTasks(user?.id) : { data: [], error: null }
      ]);

      // Handle subjects
      if (subjectsResult?.error) {
        console.warn('Failed to load subjects:', subjectsResult?.error);
        setAvailableSubjects([]);
      } else {
        setAvailableSubjects(subjectsResult?.data || []);
      }

      // Handle scheduled tasks
      if (tasksResult?.error) {
        console.warn('Failed to load tasks:', tasksResult?.error);
        setScheduledTasks([]);
      } else {
        // Filter scheduled tasks (have scheduled_date)
        const scheduled = (tasksResult?.data || [])?.filter(task => task?.scheduled_date);
        setScheduledTasks(scheduled);
      }

      // Handle unscheduled tasks
      if (unscheduledTasksResult?.error) {
        console.warn('Failed to load unscheduled tasks:', unscheduledTasksResult?.error);
        setAvailableTasks([]);
      } else {
        setAvailableTasks(unscheduledTasksResult?.data || []);
      }

    } catch (err) {
      setError('Failed to load planner data. Please refresh the page.');
      console.error('Error loading planner data:', err);
    } finally {
      setLoading(false);
    }
  };

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
    if (newTask) {
      // Add to unscheduled tasks if it doesn't have a scheduled date
      if (!newTask?.scheduled_date) {
        setAvailableTasks(prev => [newTask, ...prev]);
      } else {
        // Add to scheduled tasks if it has a scheduled date
        setScheduledTasks(prev => [newTask, ...prev]);
      }
    }
  };

  const handleTaskMove = async (taskId, newDate, newTimeSlot) => {
    if (!user) return;

    try {
      const scheduleData = {
        date: newDate?.toISOString()?.split('T')?.[0],
        startTime: newTimeSlot,
        endTime: newTimeSlot // This should be calculated based on duration
      };

      const result = await taskService?.scheduleTask(taskId, scheduleData, user?.id);
      if (result?.data) {
        // Update local state
        setScheduledTasks(prev => prev?.map(task => 
          task?.id === taskId ? result?.data : task
        ));
        
        // Remove from unscheduled if it was there
        setAvailableTasks(prev => prev?.filter(task => task?.id !== taskId));
      }
    } catch (error) {
      console.error('Failed to move task:', error);
    }
  };

  const handleTaskEdit = (taskId, updatedTask) => {
    // Update in the appropriate state
    setScheduledTasks(prev => prev?.map(task => 
      task?.id === taskId ? { ...task, ...updatedTask } : task
    ));
    setAvailableTasks(prev => prev?.map(task => 
      task?.id === taskId ? { ...task, ...updatedTask } : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    // Remove from both scheduled and unscheduled tasks
    setScheduledTasks(prev => prev?.filter(task => task?.id !== taskId));
    setAvailableTasks(prev => prev?.filter(task => task?.id !== taskId));
  };

  const handleTaskUpdate = (taskId, updates) => {
    setScheduledTasks(prev => prev?.map(task => 
      task?.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleWeekChange = (newWeek) => {
    setSelectedDate(newWeek);
  };

  const handleTaskSchedule = (task, dateTime) => {
    // Remove from unscheduled
    setAvailableTasks(prev => prev?.filter(t => t?.id !== task?.id));
    
    // Add to scheduled with updated information
    const scheduledTask = {
      ...task,
      scheduled_date: dateTime?.toISOString()?.split('T')?.[0],
      scheduled_start_time: task?.startTime,
      scheduled_end_time: task?.endTime,
      task_status: 'todo'
    };
    
    setScheduledTasks(prev => [...prev, scheduledTask]);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <Header />
        <main className="pt-16">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
                <p className="text-text-secondary">Carregando planejador...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-surface">
        <Header />
        <main className="pt-16">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <Icon name="AlertCircle" size={48} className="text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar planejador</h3>
              <p className="text-red-700 mb-6 max-w-md mx-auto">{error}</p>
              <Button 
                variant="outline"
                onClick={loadInitialData}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                const taskDate = new Date(task?.scheduled_date);
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
                    task?.scheduled_date === selectedDate?.toISOString()?.split('T')?.[0]
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
                  onTaskSchedule={handleTaskSchedule}
                  onTaskEdit={handleTaskEdit}
                  onTaskDelete={handleTaskDelete}
                  availableSubjects={availableSubjects}
                />
              </div>
            </div>
          </div>

          {/* Empty State for First Time Users */}
          {scheduledTasks?.length === 0 && availableTasks?.length === 0 && availableSubjects?.length === 0 && (
            <div className="mt-8 bg-white rounded-lg border border-border p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Calendar" size={32} color="var(--color-primary)" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Bem-vindo ao Planejador
                </h3>
                <p className="text-text-secondary mb-6">
                  Para começar, você precisa primeiro cadastrar matérias na aba "Edital" e depois criar tarefas para uma rotina de estudos mais organizada.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
                    onClick={loadInitialData}
                  >
                    Recarregar
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
