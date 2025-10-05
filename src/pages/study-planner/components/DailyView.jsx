import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';

const DailyView = ({ 
  selectedDate, 
  scheduledTasks = [], // Changed from dailySchedule to scheduledTasks
  onTaskMove, 
  onTaskEdit, 
  onTaskDelete, 
  onDateChange,
  onTimeSlotClick, // New prop for handling time slot clicks
  onTaskUpdate // New prop for handling task updates with full synchronization
}) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);

  // Complete 24-hour time slots
  const timeSlots = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  // Fixed subject mapping to match WeeklyView and task storage format
  const subjects = {
    'Direito Constitucional': { color: 'bg-blue-100 text-blue-800 border-blue-200', name: 'Direito Constitucional' },
    'Direito Administrativo': { color: 'bg-green-100 text-green-800 border-green-200', name: 'Direito Administrativo' },
    'Matemática': { color: 'bg-purple-100 text-purple-800 border-purple-200', name: 'Matemática' },
    'Português': { color: 'bg-orange-100 text-orange-800 border-orange-200', name: 'Português' },
    'Atualidades': { color: 'bg-red-100 text-red-800 border-red-200', name: 'Atualidades' },
    'Informática': { color: 'bg-cyan-100 text-cyan-800 border-cyan-200', name: 'Informática' }
  };

  // Enhanced function to calculate which time slots a task spans and their fill percentages
  const getTaskTimeSlotDistribution = (task) => {
    if (!task?.startTime || !task?.endTime) return {};

    const startTime = parseTimeToMinutes(task?.startTime);
    const endTime = parseTimeToMinutes(task?.endTime);
    const distribution = {};

    // Iterate through each hour that the task spans
    const startHour = Math.floor(startTime / 60);
    const endHour = Math.floor((endTime - 1) / 60); // -1 to handle exact hour endings correctly

    for (let hour = startHour; hour <= endHour; hour++) {
      const hourStart = hour * 60;
      const hourEnd = (hour + 1) * 60;
      
      // Calculate how much of this hour is occupied by the task
      const taskStartInHour = Math.max(startTime, hourStart);
      const taskEndInHour = Math.min(endTime, hourEnd);
      const occupiedMinutes = taskEndInHour - taskStartInHour;
      
      // Calculate fill percentage (0-100)
      const fillPercentage = (occupiedMinutes / 60) * 100;
      
      if (fillPercentage > 0) {
        const timeSlot = `${hour?.toString()?.padStart(2, '0')}:00`;
        distribution[timeSlot] = {
          fillPercentage: Math.min(100, Math.max(0, fillPercentage)),
          isStartSlot: hour === startHour,
          isEndSlot: hour === endHour,
          occupiedMinutes,
          taskStartInSlot: taskStartInHour - hourStart,
          taskEndInSlot: taskEndInHour - hourStart
        };
      }
    }

    return distribution;
  };

  // Helper to parse time string to total minutes
  const parseTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr?.split(':')?.map(Number);
    return hours * 60 + (minutes || 0);
  };

  // Transform scheduled tasks into daily schedule structure with proportional distribution
  const dailySchedule = React.useMemo(() => {
    const schedule = {};
    timeSlots?.forEach(timeSlot => {
      schedule[timeSlot] = [];
    });
    
    // Process each task and distribute it across affected time slots
    scheduledTasks?.forEach(task => {
      const distribution = getTaskTimeSlotDistribution(task);
      
      Object.entries(distribution)?.forEach(([timeSlot, slotData]) => {
        if (schedule?.[timeSlot]) {
          schedule?.[timeSlot]?.push({
            ...task,
            slotData,
            originalTask: task
          });
        }
      });
    });
    
    return schedule;
  }, [scheduledTasks, timeSlots]);

  // Enhanced drag handlers to prevent duplication and ensure synchronization
  const handleDragStart = (e, task, timeSlot) => {
    const taskWithOrigin = { 
      ...task, 
      originalTime: timeSlot,
      originalDay: selectedDate?.getDay() === 0 ? 6 : selectedDate?.getDay() - 1,
      isDragging: true
    };
    setDraggedTask(taskWithOrigin);
    e.dataTransfer.effectAllowed = 'move';
    e?.dataTransfer?.setData('text/plain', JSON.stringify(taskWithOrigin));
  };

  const handleDragOver = (e, timeSlot) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot(timeSlot);
  };

  const handleDragLeave = (e) => {
    // Only clear if we're leaving the entire drop zone, not just moving between child elements
    if (!e?.currentTarget?.contains(e?.relatedTarget)) {
      setDragOverSlot(null);
    }
  };

  const handleDrop = (e, timeSlot) => {
    e?.preventDefault();
    
    if (draggedTask && draggedTask?.originalTime !== timeSlot) {
      const dayOfWeek = selectedDate?.getDay();
      const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      
      // Calculate new end time based on duration
      const startTimeMinutes = parseTimeToMinutes(timeSlot);
      const durationMinutes = (draggedTask?.duration || 1) * 60;
      const endTimeMinutes = startTimeMinutes + durationMinutes;
      const endHour = Math.floor(endTimeMinutes / 60);
      const endMinute = endTimeMinutes % 60;
      const newEndTime = `${String(endHour)?.padStart(2, '0')}:${String(endMinute)?.padStart(2, '0')}`;
      
      // Enhanced task move with full synchronization
      const updatedTask = {
        ...draggedTask,
        startTime: timeSlot,
        endTime: newEndTime,
        scheduledDate: selectedDate?.toISOString()?.split('T')?.[0]
      };
      
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      } else if (onTaskMove) {
        onTaskMove(updatedTask, dayIndex, timeSlot);
      }
    }
    
    setDraggedTask(null);
    setDragOverSlot(null);
  };

  // Enhanced time slot rendering with proportional filling and improved visuals
  const renderTimeSlotContent = (timeSlot, tasks, isNightTime) => {
    if (tasks?.length === 0) {
      return (
        <div 
          className="h-full flex items-center justify-center text-text-secondary/50 cursor-pointer hover:bg-primary/5 rounded transition-colors duration-150 group"
          onClick={() => {
            if (onTimeSlotClick) {
              onTimeSlotClick(timeSlot, selectedDate, selectedDate?.getDay());
            }
          }}
          title="Clique para adicionar uma tarefa"
        >
          <div className="flex items-center opacity-60 group-hover:opacity-100 transition-opacity">
            <Icon name="Plus" size={16} />
            <span className="ml-2 text-xs hidden sm:inline"> Adicionar tarefa</span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2 h-full">
        {tasks?.map((taskSlot, taskIndex) => {
          const task = taskSlot?.originalTask || taskSlot;
          const slotData = taskSlot?.slotData || { fillPercentage: 100, isStartSlot: true };
          
          // Fixed subject lookup - no more fallback to 'Matemática'
          const subject = subjects?.[task?.subject] || {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            name: task?.subject || 'Matéria Desconhecida'
          };
          
          // Enhanced height calculation for better proportional display
          const baseHeight = 60;
          const fillHeight = Math.max(25, (slotData?.fillPercentage / 100) * baseHeight);
          
          return (
            <div
              key={taskIndex}
              draggable
              onDragStart={(e) => handleDragStart(e, task, timeSlot)}
              className={`relative rounded-lg border-2 cursor-move hover:shadow-lg transition-all duration-150 ${subject?.color} ${
                task?.completed ? 'opacity-75 line-through' : ''
              } ${draggedTask?.id === task?.id ? 'opacity-50 scale-95' : 'hover:scale-[1.02]'}`}
              style={{
                height: `${fillHeight}px`,
                minHeight: '25px'
              }}
            >
              {/* Enhanced proportional fill indicator with gradient */}
              <div 
                className="absolute inset-0 rounded-lg overflow-hidden"
                style={{
                  background: slotData?.fillPercentage < 100 
                    ? `linear-gradient(135deg, 
                        ${subject?.color?.includes('blue') ? 'rgba(59, 130, 246, 0.4)' :
                          subject?.color?.includes('green') ? 'rgba(34, 197, 94, 0.4)' :
                          subject?.color?.includes('purple') ? 'rgba(147, 51, 234, 0.4)' :
                          subject?.color?.includes('orange') ? 'rgba(249, 115, 22, 0.4)' :
                          subject?.color?.includes('cyan') ? 'rgba(6, 182, 212, 0.4)' :
                          'rgba(239, 68, 68, 0.4)'} 0%, 
                        ${subject?.color?.includes('blue') ? 'rgba(59, 130, 246, 0.2)' :
                          subject?.color?.includes('green') ? 'rgba(34, 197, 94, 0.2)' :
                          subject?.color?.includes('purple') ? 'rgba(147, 51, 234, 0.2)' :
                          subject?.color?.includes('orange') ? 'rgba(249, 115, 22, 0.2)' :
                          subject?.color?.includes('cyan') ? 'rgba(6, 182, 212, 0.2)' :
                          'rgba(239, 68, 68, 0.2)'} ${slotData?.fillPercentage}%, 
                        rgba(0,0,0,0.05) ${slotData?.fillPercentage}%, 
                        rgba(0,0,0,0.05) 100%)`
                    : `linear-gradient(135deg, 
                        ${subject?.color?.includes('blue') ? 'rgba(59, 130, 246, 0.3)' :
                          subject?.color?.includes('green') ? 'rgba(34, 197, 94, 0.3)' :
                          subject?.color?.includes('purple') ? 'rgba(147, 51, 234, 0.3)' :
                          subject?.color?.includes('orange') ? 'rgba(249, 115, 22, 0.3)' :
                          subject?.color?.includes('cyan') ? 'rgba(6, 182, 212, 0.3)' :
                          'rgba(239, 68, 68, 0.3)'}, 
                        ${subject?.color?.includes('blue') ? 'rgba(59, 130, 246, 0.1)' :
                          subject?.color?.includes('green') ? 'rgba(34, 197, 94, 0.1)' :
                          subject?.color?.includes('purple') ? 'rgba(147, 51, 234, 0.1)' :
                          subject?.color?.includes('orange') ? 'rgba(249, 115, 22, 0.1)' :
                          subject?.color?.includes('cyan') ? 'rgba(6, 182, 212, 0.1)' :
                          'rgba(239, 68, 68, 0.1)'})`
                }}
              />
              
              <div className="relative p-3 h-full flex flex-col justify-between z-10">
                <div className="flex-1 min-w-0">
                  {/* Only show full task details in the start slot */}
                  {slotData?.isStartSlot ? (
                    <>
                      <div className="text-sm font-semibold text-current truncate">{subject?.name}</div>
                      {fillHeight > 35 && (
                        <div className="text-xs opacity-90 mt-1 line-clamp-2">{task?.topic}</div>
                      )}
                      {fillHeight > 50 && (
                        <div className="text-xs opacity-75 mt-2 flex items-center space-x-2 flex-wrap">
                          <span className="font-medium">{task?.startTime}-{task?.endTime}</span>
                          <span>•</span>
                          <span>{((parseTimeToMinutes(task?.endTime) - parseTimeToMinutes(task?.startTime)) / 60)?.toFixed(1)}h</span>
                          {task?.priority === 'alta' && (
                            <>
                              <span>•</span>
                              <Icon name="AlertTriangle" size={10} className="text-red-600" />
                            </>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    /* Enhanced continuation indicator for non-start slots */
                    <div className="flex items-center justify-between h-full">
                      <div className="text-xs opacity-80 flex-1 min-w-0">
                        <div className="font-medium truncate">{subject?.name}</div>
                        <div className="text-xs opacity-60 mt-1">
                          {slotData?.fillPercentage?.toFixed(0)}% ocupado
                        </div>
                      </div>
                      <div className="flex flex-col items-center ml-2">
                        <Icon name="ArrowDown" size={12} className="opacity-50" />
                        <div className="w-1 h-4 bg-current opacity-30 rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Task controls only show in start slot with improved styling */}
                {slotData?.isStartSlot && fillHeight > 40 && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/20">
                    <div className="flex items-center space-x-2">
                      {task?.completed && (
                        <Icon name="CheckCircle" size={16} className="text-green-600" />
                      )}
                      {task?.priority === 'alta' && (
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          onTaskEdit(task);
                        }}
                        className="p-1.5 hover:bg-white/70 rounded-md transition-colors"
                        title="Editar tarefa"
                      >
                        <Icon name="Edit2" size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          if (window.confirm('Excluir esta tarefa?')) {
                            onTaskDelete(task?.id);
                          }
                        }}
                        className="p-1.5 hover:bg-white/70 rounded-md transition-colors text-red-600"
                        title="Excluir tarefa"
                      >
                        <Icon name="Trash2" size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Enhanced fill percentage indicator */}
              <div className="absolute top-1 right-1 z-20">
                <div className={`px-1.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${
                  slotData?.fillPercentage === 100 
                    ? 'bg-green-500 text-white' :'bg-yellow-400 text-yellow-900'
                }`}>
                  {slotData?.fillPercentage === 100 ? '●' : `${slotData?.fillPercentage?.toFixed(0)}%`}
                </div>
              </div>

              {/* Visual connection indicator for multi-slot tasks */}
              {!slotData?.isEndSlot && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 z-10">
                  <div className="w-0.5 h-2 bg-current opacity-40 rounded-full" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    newDate?.setDate(newDate?.getDate() + direction);
    onDateChange(newDate);
  };

  const getTotalPlannedHours = () => {
    // Fix: Work with scheduledTasks array directly instead of Object.values
    if (!Array.isArray(scheduledTasks)) {
      return 0;
    }
    
    return scheduledTasks?.reduce((total, task) => {
      return total + (task?.duration || 1);
    }, 0);
  };

  const getCompletedHours = () => {
    // Fix: Work with scheduledTasks array directly instead of Object.values
    if (!Array.isArray(scheduledTasks)) {
      return 0;
    }
    
    return scheduledTasks?.reduce((total, task) => {
      return total + (task?.completed ? (task?.duration || 1) : 0);
    }, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-subtle border border-border">
      {/* Enhanced Date Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-border gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateDate(-1)}
            className="p-2 hover:bg-muted rounded-md transition-colors duration-150"
            title="Dia anterior"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              {selectedDate?.toLocaleDateString('pt-BR', { 
                weekday: 'long',
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>
            <p className="text-sm text-text-secondary">
              {getCompletedHours()}h de {getTotalPlannedHours()}h concluídas
              {getTotalPlannedHours() > 0 && (
                <span className="ml-2">• {Math.round((getCompletedHours() / getTotalPlannedHours()) * 100)}% completo</span>
              )}
            </p>
          </div>
          <button
            onClick={() => navigateDate(1)}
            className="p-2 hover:bg-muted rounded-md transition-colors duration-150"
            title="Próximo dia"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span className="text-sm text-text-secondary">Concluído</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full" />
            <span className="text-sm text-text-secondary">Pendente</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-sm text-text-secondary">Disponível</span>
          </div>
        </div>
      </div>

      {/* Enhanced Timeline with proper 24-hour visualization */}
      <div className="max-h-[700px] overflow-y-auto">
        {/* Mobile View */}
        <div className="block lg:hidden">
          {timeSlots?.map((timeSlot) => {
            const tasks = dailySchedule?.[timeSlot] || [];
            const isDropTarget = dragOverSlot === timeSlot;
            let hour = parseInt(timeSlot?.split(':')?.[0]);
            const isNightTime = hour >= 0 && hour <= 5;
            const isMorning = hour >= 6 && hour <= 11;
            const isAfternoon = hour >= 12 && hour <= 17;
            const isEvening = hour >= 18 && hour <= 23;
            
            // Calculate minimum height based on tasks duration
            const totalDuration = tasks?.reduce((sum, task) => sum + (task?.duration || 1), 0);
            const minHeight = Math.max(80, totalDuration * 60); // 60px per hour minimum
            
            return (
              <div
                key={timeSlot}
                className={`border-b border-border transition-all duration-200 ${
                  isDropTarget 
                    ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-muted/30'
                } ${isNightTime ? 'bg-slate-50' : ''}`}
                style={{ minHeight: `${minHeight}px` }}
                onDragOver={(e) => handleDragOver(e, timeSlot)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, timeSlot)}
              >
                <div className="flex items-start p-3 h-full">
                  <div className="w-20 flex-shrink-0 text-sm font-medium text-text-secondary flex flex-col items-center">
                    <span className={`${isNightTime ? 'text-slate-400' : ''} text-base`}>{timeSlot}</span>
                    <span className="text-xs opacity-70 mt-1">
                      {isNightTime && '🌙'} 
                      {isMorning && '🌅'} 
                      {isAfternoon && '☀️'} 
                      {isEvening && '🌆'}
                    </span>
                  </div>
                  <div className="flex-1 px-2">
                    {renderTimeSlotContent(timeSlot, tasks, isNightTime)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-0">
            {/* Time Labels */}
            <div className="col-span-2 bg-muted/50">
              {timeSlots?.map((time) => {
                let hour = parseInt(time?.split(':')?.[0]);
                const isNightTime = hour >= 0 && hour <= 5;
                
                return (
                  <div 
                    key={time} 
                    className={`h-20 flex items-center justify-center border-b border-border text-sm font-medium text-text-secondary ${
                      isNightTime ? 'bg-slate-100' : ''
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-base ${isNightTime ? 'text-slate-400' : ''}`}>{time}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {isNightTime && '🌙'} 
                        {hour >= 6 && hour <= 11 && '🌅'} 
                        {hour >= 12 && hour <= 17 && '☀️'} 
                        {hour >= 18 && hour <= 23 && '🌆'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Schedule Area */}
            <div className="col-span-10">
              {timeSlots?.map((timeSlot) => {
                const tasks = dailySchedule?.[timeSlot] || [];
                const isDropTarget = dragOverSlot === timeSlot;
                let hour = parseInt(timeSlot?.split(':')?.[0]);
                const isNightTime = hour >= 0 && hour <= 5;
                
                return (
                  <div
                    key={timeSlot}
                    className={`h-20 border-b border-border transition-all duration-200 ${
                      isDropTarget 
                        ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-muted/30'
                    } ${isNightTime ? 'bg-slate-50' : ''}`}
                    onDragOver={(e) => handleDragOver(e, timeSlot)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, timeSlot)}
                  >
                    <div className="h-full px-4 py-2">
                      {renderTimeSlotContent(timeSlot, tasks, isNightTime)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">Progresso do Dia</span>
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <span>{Math.round((getCompletedHours() / getTotalPlannedHours()) * 100) || 0}%</span>
            <span>•</span>
            <span>{getCompletedHours()}h / {getTotalPlannedHours()}h</span>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-success to-success/80 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(getCompletedHours() / getTotalPlannedHours()) * 100 || 0}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default DailyView;