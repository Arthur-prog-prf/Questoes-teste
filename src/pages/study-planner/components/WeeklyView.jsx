import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WeeklyView = ({ 
  scheduledTasks,
  onTaskMove, 
  onTaskEdit, 
  onTaskDelete, 
  selectedWeek, 
  onWeekChange,
  onTimeSlotClick,
  onTaskUpdate
}) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [customTimeModal, setCustomTimeModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [customTimeForm, setCustomTimeForm] = useState({
    startTime: '',
    endTime: ''
  });

  const weekDays = [
    'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
  ];

  // Generate time slots from 00:00 to 23:00 in 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 60) {
        const timeStr = `${hour?.toString()?.padStart(2, '0')}:${minute?.toString()?.padStart(2, '0')}`;
        slots?.push(timeStr);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Fixed subject mapping to match DailyView and ensure consistency
  const subjects = {
    'Direito Constitucional': { color: 'bg-blue-100 text-blue-800 border-blue-200' },
    'Direito Administrativo': { color: 'bg-green-100 text-green-800 border-green-200' },
    'Matemática': { color: 'bg-purple-100 text-purple-800 border-purple-200' },
    'Português': { color: 'bg-orange-100 text-orange-800 border-orange-200' },
    'Atualidades': { color: 'bg-red-100 text-red-800 border-red-200' },
    'Informática': { color: 'bg-cyan-100 text-cyan-800 border-cyan-200' }
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

  // Enhanced drag handlers with full synchronization
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, dayIndex, timeSlot) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot({ day: dayIndex, time: timeSlot });
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e, dayIndex, timeSlot) => {
    e?.preventDefault();
    if (draggedTask) {
      const targetDate = getDateForDay(dayIndex);
      
      // Calculate new end time based on duration
      const startTimeMinutes = parseTimeToMinutes(timeSlot);
      const durationMinutes = (draggedTask?.duration || 1) * 60;
      const endTimeMinutes = startTimeMinutes + durationMinutes;
      const endHour = Math.floor(endTimeMinutes / 60);
      const endMinute = endTimeMinutes % 60;
      const newEndTime = `${String(endHour)?.padStart(2, '0')}:${String(endMinute)?.padStart(2, '0')}`;
      
      // Enhanced task update with full synchronization
      const updatedTask = {
        ...draggedTask,
        startTime: timeSlot,
        endTime: newEndTime,
        scheduledDate: targetDate?.toISOString()?.split('T')?.[0]
      };
      
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      } else if (onTaskMove) {
        onTaskMove(draggedTask?.id, { startTime: timeSlot, endTime: newEndTime, targetDate });
      }
      
      setDraggedTask(null);
      setDragOverSlot(null);
    }
  };

  const getWeekDates = () => {
    const startDate = new Date(selectedWeek);
    // Ensure we start on Monday
    const dayOfWeek = startDate?.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate?.setDate(startDate?.getDate() - daysToSubtract);
    
    return weekDays?.map((_, index) => {
      const date = new Date(startDate);
      date?.setDate(startDate?.getDate() + index);
      return date?.getDate();
    });
  };

  const weekDates = getWeekDates();

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedWeek);
    newDate?.setDate(newDate?.getDate() + (direction * 7));
    onWeekChange(newDate);
  };

  // Helper to get date for specific day in the week
  const getDateForDay = (dayIndex) => {
    const startDate = new Date(selectedWeek);
    const dayOfWeek = startDate?.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate?.setDate(startDate?.getDate() - daysToSubtract);
    const targetDate = new Date(startDate);
    targetDate?.setDate(startDate?.getDate() + dayIndex);
    return targetDate;
  };

  // Get tasks for specific day and time slot with proportional distribution
  const getTasksForSlot = (dayIndex, timeSlot) => {
    const targetDate = getDateForDay(dayIndex);
    const dateStr = targetDate?.toISOString()?.split('T')?.[0];
    
    const tasksForSlot = [];
    
    scheduledTasks?.forEach(task => {
      if (task?.scheduledDate !== dateStr) return;
      
      const distribution = getTaskTimeSlotDistribution(task);
      const slotData = distribution?.[timeSlot];
      
      if (slotData) {
        tasksForSlot?.push({
          ...task,
          slotData,
          originalTask: task
        });
      }
    });
    
    return tasksForSlot;
  };

  // Parse time string to minutes for comparison
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr?.split(':')?.map(Number);
    return hours * 60 + minutes;
  };

  // Handle custom time selection
  const handleTimeSlotClick = (timeSlot, dayIndex, e) => {
    e?.preventDefault();
    const targetDate = getDateForDay(dayIndex);
    
    // Check if there's already a task in this slot
    const existingTasks = getTasksForSlot(dayIndex, timeSlot);
    if (existingTasks?.length > 0) {
      // If task exists, edit it
      onTaskEdit(existingTasks?.[0]);
      return;
    }
    
    // Extract the hour from the selected time slot to set constraints
    const selectedHour = timeSlot?.split(':')?.[0];
    const minStartTime = `${selectedHour}:00`;
    const maxStartTime = `${selectedHour}:59`;
    
    setSelectedTimeSlot({ 
      timeSlot, 
      dayIndex, 
      targetDate, 
      selectedHour,
      minStartTime,
      maxStartTime
    });
    setCustomTimeModal(true);
    setCustomTimeForm({
      startTime: timeSlot, // Start with the selected time slot
      endTime: calculateEndTime(timeSlot, 1) // Default 1 hour duration
    });
  };

  // Calculate end time based on start time and duration
  const calculateEndTime = (startTime, durationHours) => {
    const [hours, minutes] = startTime?.split(':')?.map(Number);
    const endMinutes = (hours * 60) + minutes + (durationHours * 60);
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return `${endHours?.toString()?.padStart(2, '0')}:${endMins?.toString()?.padStart(2, '0')}`;
  };

  // Handle custom time creation with validation
  const handleCustomTimeCreate = () => {
    if (selectedTimeSlot && customTimeForm?.startTime && customTimeForm?.endTime) {
      // Validate start time is within the selected hour range
      const startTimeMinutes = parseTime(customTimeForm?.startTime);
      const minStartTimeMinutes = parseTime(selectedTimeSlot?.minStartTime);
      const maxStartTimeMinutes = parseTime(selectedTimeSlot?.maxStartTime);
      
      if (startTimeMinutes < minStartTimeMinutes || startTimeMinutes > maxStartTimeMinutes) {
        alert(`O horário de início deve estar entre ${selectedTimeSlot?.minStartTime} e ${selectedTimeSlot?.maxStartTime}.`);
        return;
      }
      
      // Calculate duration based on time difference
      const endTimeMinutes = parseTime(customTimeForm?.endTime);
      const duration = (endTimeMinutes - startTimeMinutes) / 60;
      
      if (duration <= 0) {
        alert('O horário de fim deve ser posterior ao horário de início.');
        return;
      }
      
      // Create a custom time slot identifier with proper format
      const customTimeData = {
        timeSlot: customTimeForm?.startTime,
        startTime: customTimeForm?.startTime,
        endTime: customTimeForm?.endTime,
        duration: duration,
        date: selectedTimeSlot?.targetDate,
        dayIndex: selectedTimeSlot?.dayIndex
      };
      
      onTimeSlotClick(customTimeData?.timeSlot, selectedTimeSlot?.targetDate, selectedTimeSlot?.dayIndex);
      setCustomTimeModal(false);
      setSelectedTimeSlot(null);
      setCustomTimeForm({ startTime: '', endTime: '' });
    }
  };

  // Get total planned hours for the week
  const getTotalPlannedHours = () => {
    return scheduledTasks?.reduce((total, task) => {
      const taskDate = new Date(task?.scheduledDate);
      const weekStart = new Date(selectedWeek);
      const dayOfWeek = weekStart?.getDay();
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      weekStart?.setDate(weekStart?.getDate() - daysToSubtract);
      const weekEnd = new Date(weekStart);
      weekEnd?.setDate(weekEnd?.getDate() + 6);
      
      if (taskDate >= weekStart && taskDate <= weekEnd) {
        return total + (task?.duration || 1);
      }
      return total;
    }, 0) || 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-subtle border border-border">
      {/* Week Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-border gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 hover:bg-muted rounded-md transition-colors duration-150"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            Semana de {selectedWeek?.toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 hover:bg-muted rounded-md transition-colors duration-150"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Clock" size={16} />
          <span>{getTotalPlannedHours()}h planejadas</span>
        </div>
      </div>
      {/* Weekly Calendar Grid - Table Layout */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header with days */}
          <div className="grid grid-cols-8 border-b border-border">
            {/* Time column header */}
            <div className="p-3 bg-muted font-medium text-sm text-text-secondary border-r border-border">
              Horário
            </div>
            
            {/* Day headers */}
            {weekDays?.map((day, dayIndex) => (
              <div key={dayIndex} className="p-3 bg-muted text-center border-r border-border last:border-r-0">
                <div className="font-medium text-sm text-foreground">{day}</div>
                <div className="text-xs text-text-secondary mt-1">{weekDates?.[dayIndex]}</div>
              </div>
            ))}
          </div>

          {/* Time slots rows */}
          <div className="max-h-[600px] overflow-y-auto">
            {timeSlots?.map((timeSlot, timeIndex) => (
              <div key={timeSlot} className="grid grid-cols-8 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                {/* Time label */}
                <div className="p-3 bg-surface font-medium text-sm text-text-secondary border-r border-border sticky left-0 z-10">
                  {timeSlot}
                </div>
                
                {/* Day cells */}
                {weekDays?.map((_, dayIndex) => {
                  const tasks = getTasksForSlot(dayIndex, timeSlot);
                  const isDropTarget = dragOverSlot?.day === dayIndex && dragOverSlot?.time === timeSlot;
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`min-h-[50px] p-1 border-r border-border last:border-r-0 relative transition-all duration-200 cursor-pointer ${
                        isDropTarget 
                          ? 'bg-primary/10 border-primary' :'hover:bg-muted/50'
                      }`}
                      onDragOver={(e) => handleDragOver(e, dayIndex, timeSlot)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, dayIndex, timeSlot)}
                      onClick={(e) => handleTimeSlotClick(timeSlot, dayIndex, e)}
                      title="Clique para criar tarefa neste horário"
                    >
                      {tasks?.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-text-secondary/60">
                          <Icon name="Plus" size={16} />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {tasks?.map((taskSlot, taskIndex) => {
                            const task = taskSlot?.originalTask || taskSlot;
                            const slotData = taskSlot?.slotData || { fillPercentage: 100, isStartSlot: true };
                            
                            // Fixed subject lookup - no more fallback to 'Matemática'
                            const subject = subjects?.[task?.subject] || {
                              color: 'bg-gray-100 text-gray-800 border-gray-200'
                            };
                            
                            // Enhanced proportional height calculation
                            const baseHeight = 45; // Base height for the cell
                            const proportionalHeight = Math.max(18, (slotData?.fillPercentage / 100) * baseHeight);
                            
                            return (
                              <div
                                key={taskIndex}
                                draggable
                                onDragStart={(e) => handleDragStart(e, task)}
                                className={`relative rounded-lg text-xs cursor-move hover:shadow-md transition-all duration-150 ${subject?.color} border-2`}
                                onClick={(e) => e?.stopPropagation()}
                                style={{
                                  height: `${proportionalHeight}px`,
                                  minHeight: '18px'
                                }}
                              >
                                {/* Enhanced proportional fill background with better gradients */}
                                <div 
                                  className="absolute inset-0 rounded-lg overflow-hidden"
                                  style={{
                                    background: slotData?.fillPercentage < 100 
                                      ? `linear-gradient(90deg, 
                                          ${subject?.color?.includes('blue') ? 'rgba(59, 130, 246, 0.5)' :
                                            subject?.color?.includes('green') ? 'rgba(34, 197, 94, 0.5)' :
                                            subject?.color?.includes('purple') ? 'rgba(147, 51, 234, 0.5)' :
                                            subject?.color?.includes('orange') ? 'rgba(249, 115, 22, 0.5)' :
                                            subject?.color?.includes('cyan') ? 'rgba(6, 182, 212, 0.5)' :
                                            'rgba(239, 68, 68, 0.5)'} 0%, 
                                          ${subject?.color?.includes('blue') ? 'rgba(59, 130, 246, 0.2)' :
                                            subject?.color?.includes('green') ? 'rgba(34, 197, 94, 0.2)' :
                                            subject?.color?.includes('purple') ? 'rgba(147, 51, 234, 0.2)' :
                                            subject?.color?.includes('orange') ? 'rgba(249, 115, 22, 0.2)' :
                                            subject?.color?.includes('cyan') ? 'rgba(6, 182, 212, 0.2)' :
                                            'rgba(239, 68, 68, 0.2)'} ${slotData?.fillPercentage}%, 
                                          rgba(0,0,0,0.05) ${slotData?.fillPercentage}%, 
                                          rgba(0,0,0,0.05) 100%)`
                                      : `linear-gradient(90deg, 
                                          ${subject?.color?.includes('blue') ? 'rgba(59, 130, 246, 0.4)' :
                                            subject?.color?.includes('green') ? 'rgba(34, 197, 94, 0.4)' :
                                            subject?.color?.includes('purple') ? 'rgba(147, 51, 234, 0.4)' :
                                            subject?.color?.includes('orange') ? 'rgba(249, 115, 22, 0.4)' :
                                            subject?.color?.includes('cyan') ? 'rgba(6, 182, 212, 0.4)' :
                                            'rgba(239, 68, 68, 0.4)'}, 
                                          ${subject?.color?.includes('blue') ? 'rgba(59, 130, 246, 0.1)' :
                                            subject?.color?.includes('green') ? 'rgba(34, 197, 94, 0.1)' :
                                            subject?.color?.includes('purple') ? 'rgba(147, 51, 234, 0.1)' :
                                            subject?.color?.includes('orange') ? 'rgba(249, 115, 22, 0.1)' :
                                            subject?.color?.includes('cyan') ? 'rgba(6, 182, 212, 0.1)' :
                                            'rgba(239, 68, 68, 0.1)'})`
                                  }}
                                />
                                
                                <div className="relative p-1.5 h-full flex flex-col justify-between z-10">
                                  {slotData?.isStartSlot ? (
                                    /* Full task info in start slot */
                                    <>
                                      <div className="font-semibold truncate text-xs">{task?.subject}</div>
                                      {proportionalHeight > 28 && (
                                        <div className="opacity-80 truncate text-xs">{task?.topic}</div>
                                      )}
                                      <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs font-medium">
                                          {task?.startTime && task?.endTime 
                                            ? `${task?.startTime}-${task?.endTime}` 
                                            : `${task?.duration || 1}h`
                                          }
                                        </span>
                                        {proportionalHeight > 35 && (
                                          <div className="flex space-x-1">
                                            <button
                                              onClick={(e) => {
                                                e?.stopPropagation();
                                                onTaskEdit(task);
                                              }}
                                              className="p-1 hover:bg-white/70 rounded"
                                            >
                                              <Icon name="Edit2" size={10} />
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e?.stopPropagation();
                                                if (window.confirm('Excluir esta tarefa?')) {
                                                  onTaskDelete(task?.id);
                                                }
                                              }}
                                              className="p-1 hover:bg-white/70 rounded text-error"
                                            >
                                              <Icon name="Trash2" size={10} />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    /* Enhanced continuation indicator for non-start slots */
                                    <div className="flex items-center justify-between h-full">
                                      <div className="text-xs opacity-70 flex-1 min-w-0">
                                        <div className="font-medium truncate">{task?.subject}</div>
                                        {proportionalHeight > 25 && (
                                          <div className="text-xs opacity-60 mt-0.5">
                                            {slotData?.fillPercentage?.toFixed(0)}%
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center ml-1">
                                        <Icon name="ArrowDown" size={8} className="opacity-50" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Enhanced fill percentage badge */}
                                <div className="absolute top-0 right-0 z-20">
                                  <div className={`px-1 py-0.5 rounded-bl-lg text-xs font-bold leading-none shadow-sm ${
                                    slotData?.fillPercentage === 100 
                                      ? 'bg-green-500 text-white' :'bg-yellow-400 text-yellow-900'
                                  }`}
                                  style={{ fontSize: '9px' }}>
                                    {slotData?.fillPercentage === 100 ? '●' : `${slotData?.fillPercentage?.toFixed(0)}%`}
                                  </div>
                                </div>

                                {/* Visual connection indicator for multi-slot tasks */}
                                {!slotData?.isEndSlot && proportionalHeight > 20 && (
                                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-0.5 z-10">
                                    <div className="w-0.5 h-1 bg-current opacity-40 rounded-full" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Enhanced Legend with proportional filling explanation */}
      <div className="flex flex-wrap items-center gap-3 p-4 border-t border-border">
        <span className="text-sm font-medium text-text-secondary">Matérias:</span>
        <div className="flex flex-wrap gap-3">
          {Object.entries(subjects)?.map(([subject, style]) => (
            <div key={subject} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full border ${style?.color}`} />
              <span className="text-sm text-text-secondary">{subject}</span>
            </div>
          ))}
        </div>
        <div className="ml-auto flex items-center space-x-4 text-xs text-text-secondary">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>100% ocupado</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            <span>Parcialmente ocupado</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Info" size={14} />
            <span>Preenchimento proporcional em múltiplos horários</span>
          </div>
        </div>
      </div>
      {/* Custom Time Selection Modal */}
      {customTimeModal && selectedTimeSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Definir Horário Personalizado</h3>
              <button
                onClick={() => {
                  setCustomTimeModal(false);
                  setSelectedTimeSlot(null);
                }}
                className="p-2 hover:bg-muted rounded-md transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="Calendar" size={16} className="text-primary" />
                  <span className="font-medium text-foreground">
                    {selectedTimeSlot?.targetDate?.toLocaleDateString('pt-BR')}
                  </span>
                  <span className="text-text-secondary">•</span>
                  <span className="text-text-secondary">
                    {weekDays?.[selectedTimeSlot?.dayIndex]}
                  </span>
                </div>
              </div>              

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Horário de Início
                  </label>
                  <input
                    type="time"
                    value={customTimeForm?.startTime}
                    min={selectedTimeSlot?.minStartTime}
                    max={selectedTimeSlot?.maxStartTime}
                    onChange={(e) => {
                      const newStartTime = e?.target?.value;
                      setCustomTimeForm(prev => ({ 
                        ...prev, 
                        startTime: newStartTime,
                        // Auto-adjust end time if it becomes invalid
                        endTime: parseTime(prev?.endTime) <= parseTime(newStartTime) 
                          ? calculateEndTime(newStartTime, 1) 
                          : prev?.endTime
                      }));
                    }}
                    className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  />                  
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Horário de Término
                  </label>
                  <input
                    type="time"
                    value={customTimeForm?.endTime}
                    min={customTimeForm?.startTime || selectedTimeSlot?.minStartTime}
                    onChange={(e) => setCustomTimeForm(prev => ({ ...prev, endTime: e?.target?.value }))}
                    className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  />                  
                </div>
              </div>

              {customTimeForm?.startTime && customTimeForm?.endTime && (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-green-800">
                    <Icon name="Clock" size={14} />
                    <span>
                      Duração: {((parseTime(customTimeForm?.endTime) - parseTime(customTimeForm?.startTime)) / 60)?.toFixed(1)}h
                    </span>
                  </div>
                  <div className="text-xs text-green-600">
                    {customTimeForm?.startTime} - {customTimeForm?.endTime}
                  </div>
                </div>
              )}

              {/* Validation messages */}
              {customTimeForm?.startTime && selectedTimeSlot?.minStartTime && selectedTimeSlot?.maxStartTime && (
                parseTime(customTimeForm?.startTime) < parseTime(selectedTimeSlot?.minStartTime) || 
                parseTime(customTimeForm?.startTime) > parseTime(selectedTimeSlot?.maxStartTime)
              ) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-red-600 mt-0.5" />
                    <div className="text-sm text-red-800">
                      O horário de início deve estar entre {selectedTimeSlot?.minStartTime} e {selectedTimeSlot?.maxStartTime}.
                    </div>
                  </div>
                </div>
              )}

              {customTimeForm?.startTime && customTimeForm?.endTime && 
                parseTime(customTimeForm?.endTime) <= parseTime(customTimeForm?.startTime) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-red-600 mt-0.5" />
                    <div className="text-sm text-red-800">
                      O horário de fim deve ser posterior ao horário de início.
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => {
                  setCustomTimeModal(false);
                  setSelectedTimeSlot(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                onClick={handleCustomTimeCreate}
                disabled={
                  !customTimeForm?.startTime || 
                  !customTimeForm?.endTime ||
                  parseTime(customTimeForm?.endTime) <= parseTime(customTimeForm?.startTime) ||
                  parseTime(customTimeForm?.startTime) < parseTime(selectedTimeSlot?.minStartTime) ||
                  parseTime(customTimeForm?.startTime) > parseTime(selectedTimeSlot?.maxStartTime)
                }
                iconName="Check"
                iconPosition="left"
              >
                Confirmar Horário
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyView;