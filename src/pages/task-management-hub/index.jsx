import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import QuickActionsPanel from './components/QuickActionsPanel';
import TaskSearchEngine from './components/TaskSearchEngine';
import TaskLibrarySection from './components/TaskLibrarySection';
import TaskHistoryViewer from './components/TaskHistoryViewer';
import StudyOptimizationTools from './components/StudyOptimizationTools';
import TaskBulkOperations from './components/TaskBulkOperations';
import PlanningTipsWidget from './components/PlanningTipsWidget';

const TaskManagementHub = () => {
  const [activeView, setActiveView] = useState('overview'); // 'overview', 'library', 'history', 'optimization'
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({});

  const handleTaskCreate = (taskData) => {
    // Task creation logic
    console.log('Creating task:', taskData);
  };

  const handleBulkOperation = (operation, tasks) => {
    // Bulk operation logic
    console.log('Bulk operation:', operation, tasks);
  };

  const handleTaskSelection = (tasks) => {
    setSelectedTasks(tasks);
  };

  const handleTaskDelete = (taskId) => {
    // Task deletion logic
    console.log('Deleting task:', taskId);
  };

  const views = [
    { key: 'overview', label: 'Visão Geral', icon: 'LayoutDashboard' },
    { key: 'library', label: 'Biblioteca', icon: 'Library' },
    { key: 'history', label: 'Histórico', icon: 'History' },
    { key: 'optimization', label: 'Otimização', icon: 'Zap' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Central de Gerenciamento de Tarefas
              </h1>
              <p className="text-text-secondary">
                Gerencie, organize e otimize todas as suas tarefas de estudo em um só lugar
              </p>
            </div>
            
            {/* View Selector */}
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              {views?.map((view) => (
                <button
                  key={view?.key}
                  onClick={() => setActiveView(view?.key)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeView === view?.key
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-text-secondary hover:text-foreground'
                  }`}
                >
                  <Icon name={view?.icon} size={16} />
                  <span className="hidden sm:inline">{view?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="mb-8">
            <QuickActionsPanel 
              onTaskCreate={handleTaskCreate}
              onBulkOperation={handleBulkOperation}
            />
          </div>

          {/* Search Engine */}
          <div className="mb-8">
            <TaskSearchEngine 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterCriteria={filterCriteria}
              onFilterChange={setFilterCriteria}
            />
          </div>

          {/* Bulk Operations */}
          {selectedTasks?.length > 0 && (
            <div className="mb-6">
              <TaskBulkOperations
                selectedTasks={selectedTasks}
                onClearSelection={() => setSelectedTasks([])}
                onBulkOperation={handleBulkOperation}
              />
            </div>
          )}

          {/* Main Content Based on Active View */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {activeView === 'overview' && (
                <div className="space-y-8">
                  <TaskLibrarySection 
                    selectedTasks={selectedTasks}
                    onTaskSelect={setSelectedTasks}
                    onTaskSelection={handleTaskSelection}
                    onTaskCreate={handleTaskCreate}
                    onTaskDelete={handleTaskDelete}
                  />
                  <StudyOptimizationTools />
                </div>
              )}
              
              {activeView === 'library' && (
                <TaskLibrarySection 
                  selectedTasks={selectedTasks}
                  onTaskSelect={setSelectedTasks}
                  onTaskSelection={handleTaskSelection}
                  onTaskCreate={handleTaskCreate}
                  onTaskDelete={handleTaskDelete}
                  fullView={true}
                />
              )}
              
              {activeView === 'history' && (
                <TaskHistoryViewer />
              )}
              
              {activeView === 'optimization' && (
                <StudyOptimizationTools fullView={true} />
              )}
            </div>

            {/* Tips Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <PlanningTipsWidget activeView={activeView} />
              </div>
            </div>
          </div>

          {/* Empty State for First Time Users */}
          <div className="mt-8 bg-white rounded-lg border border-border p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Settings" size={32} color="var(--color-primary)" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Central de Controle dos seus Estudos
              </h3>
              <p className="text-text-secondary mb-6">
                Use esta central para gerenciar todas as suas tarefas de estudo, 
                otimizar seu cronograma e acompanhar seu progresso de forma centralizada.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => window.location.href = '/study-planner'}
                >
                  Ir para Planejador
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
        </div>
      </main>
    </div>
  );
};

export default TaskManagementHub;
