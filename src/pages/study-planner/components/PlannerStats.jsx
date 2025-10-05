import React from 'react';
import Icon from '../../../components/AppIcon';

const PlannerStats = ({ weeklySchedule, selectedWeek, scheduledTasks }) => {
  const subjects = {
    'matematica': { color: 'bg-blue-100 text-blue-800 border-blue-200', name: 'Matemática' },
    'portugues': { color: 'bg-green-100 text-green-800 border-green-200', name: 'Português' },
    'direito': { color: 'bg-purple-100 text-purple-800 border-purple-200', name: 'Direito' },
    'informatica': { color: 'bg-orange-100 text-orange-800 border-orange-200', name: 'Informática' },
    'atualidades': { color: 'bg-red-100 text-red-800 border-red-200', name: 'Atualidades' }
  };

  const calculateWeeklyStats = () => {
    let totalPlanned = 0;
    let totalCompleted = 0;
    let subjectHours = {};
    let dailyHours = [];

    // Initialize subject hours
    Object.keys(subjects)?.forEach(subject => {
      subjectHours[subject] = { planned: 0, completed: 0 };
    });

    // Use weeklySchedule (filtered tasks) or scheduledTasks as fallback
    const tasksToProcess = weeklySchedule || scheduledTasks || [];

    // Group tasks by day for daily statistics
    const tasksByDay = {};
    
    // Initialize 7 days
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      tasksByDay[dayIndex] = [];
    }

    // Process each task and group by day
    if (Array.isArray(tasksToProcess)) {
      tasksToProcess?.forEach(task => {
        if (!task) return;
        
        const duration = task?.duration || 1;
        totalPlanned += duration;

        if (subjectHours?.[task?.subject]) {
          subjectHours[task.subject].planned += duration;
        }

        if (task?.completed) {
          totalCompleted += duration;
          if (subjectHours?.[task?.subject]) {
            subjectHours[task.subject].completed += duration;
          }
        }

        // Group by day of week for daily stats
        if (task?.scheduledDate) {
          const taskDate = new Date(task.scheduledDate);
          const weekStart = new Date(selectedWeek);
          weekStart?.setDate(weekStart?.getDate() - weekStart?.getDay());
          
          const daysDiff = Math.floor((taskDate - weekStart) / (1000 * 60 * 60 * 24));
          if (daysDiff >= 0 && daysDiff < 7) {
            tasksByDay?.[daysDiff]?.push(task);
          }
        }
      });
    }

    // Calculate daily hours
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const dayTasks = tasksByDay?.[dayIndex] || [];
      let dayPlanned = 0;
      let dayCompleted = 0;

      dayTasks?.forEach(task => {
        const duration = task?.duration || 1;
        dayPlanned += duration;
        if (task?.completed) {
          dayCompleted += duration;
        }
      });

      dailyHours?.push({ planned: dayPlanned, completed: dayCompleted });
    }

    return {
      totalPlanned,
      totalCompleted,
      subjectHours,
      dailyHours,
      completionRate: totalPlanned > 0 ? (totalCompleted / totalPlanned) * 100 : 0
    };
  };

  const stats = calculateWeeklyStats();

  const getWeekDates = () => {
    const startDate = new Date(selectedWeek);
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    return weekDays?.map((day, index) => {
      const date = new Date(startDate);
      date?.setDate(startDate?.getDate() - startDate?.getDay() + index);
      return {
        day,
        date: date?.getDate(),
        planned: stats?.dailyHours?.[index]?.planned || 0,
        completed: stats?.dailyHours?.[index]?.completed || 0
      };
    });
  };

  const weekDates = getWeekDates();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-subtle border border-border p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Horas Planejadas</p>
              <p className="text-2xl font-semibold text-foreground">{stats?.totalPlanned}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-subtle border border-border p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Horas Concluídas</p>
              <p className="text-2xl font-semibold text-foreground">{stats?.totalCompleted}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-subtle border border-border p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} color="var(--color-accent)" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Taxa de Conclusão</p>
              <p className="text-2xl font-semibold text-foreground">
                {Math.round(stats?.completionRate)}%
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Daily Progress Chart */}
      <div className="bg-white rounded-lg shadow-subtle border border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Progresso Diário</h3>
        <div className="space-y-3">
          {weekDates?.map((dayData, index) => {
            const completionRate = dayData?.planned > 0 ? (dayData?.completed / dayData?.planned) * 100 : 0;
            
            return (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 text-center">
                  <div className="text-xs font-medium text-text-secondary">{dayData?.day}</div>
                  <div className="text-xs text-text-secondary">{dayData?.date}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text-secondary">
                      {dayData?.completed}h / {dayData?.planned}h
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {Math.round(completionRate)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-success h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Subject Distribution */}
      <div className="bg-white rounded-lg shadow-subtle border border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Distribuição por Matéria</h3>
        <div className="space-y-3">
          {Object.entries(subjects)?.map(([subjectKey, subject]) => {
            const subjectData = stats?.subjectHours?.[subjectKey] || { planned: 0, completed: 0 };
            const completionRate = subjectData?.planned > 0 ? (subjectData?.completed / subjectData?.planned) * 100 : 0;
            
            if (subjectData?.planned === 0) return null;
            
            return (
              <div key={subjectKey} className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded border ${subject?.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{subject?.name}</span>
                    <span className="text-sm text-text-secondary">
                      {subjectData?.completed}h / {subjectData?.planned}h
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-foreground w-12 text-right">
                  {Math.round(completionRate)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Quick Insights */}
      <div className="bg-white rounded-lg shadow-subtle border border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Insights Rápidos</h3>
        <div className="space-y-3">
          {stats?.completionRate >= 80 && (
            <div className="flex items-start space-x-3 p-3 bg-success/10 rounded-lg">
              <Icon name="TrendingUp" size={16} color="var(--color-success)" />
              <div>
                <p className="text-sm font-medium text-success">Excelente progresso!</p>
                <p className="text-xs text-success/80">
                  Você está mantendo uma alta taxa de conclusão das tarefas planejadas.
                </p>
              </div>
            </div>
          )}
          
          {stats?.completionRate < 50 && stats?.totalPlanned > 0 && (
            <div className="flex items-start space-x-3 p-3 bg-warning/10 rounded-lg">
              <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
              <div>
                <p className="text-sm font-medium text-warning">Atenção ao planejamento</p>
                <p className="text-xs text-warning/80">
                  Considere revisar suas metas diárias para torná-las mais realistas.
                </p>
              </div>
            </div>
          )}
          
          {stats?.totalPlanned === 0 && (
            <div className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
              <Icon name="Calendar" size={16} color="var(--color-text-secondary)" />
              <div>
                <p className="text-sm font-medium text-text-secondary">Semana sem planejamento</p>
                <p className="text-xs text-text-secondary">
                  Adicione algumas tarefas ao seu cronograma para começar a estudar.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlannerStats;