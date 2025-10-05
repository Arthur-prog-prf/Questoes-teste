import React from 'react';
import Icon from '../../../components/AppIcon';

const DailyProgress = () => {
  const todayStats = {
    studiedTime: 185, // minutes
    targetTime: 240, // minutes
    streak: 12,
    completedTopics: 4,
    targetTopics: 6,
    weeklyAverage: 198
  };

  const formatMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const progressPercentage = Math.min((todayStats?.studiedTime / todayStats?.targetTime) * 100, 100);
  const topicsPercentage = (todayStats?.completedTopics / todayStats?.targetTopics) * 100;

  const getStreakIcon = (streak) => {
    if (streak >= 30) return { icon: 'Crown', color: 'text-warning' };
    if (streak >= 14) return { icon: 'Flame', color: 'text-error' };
    if (streak >= 7) return { icon: 'Zap', color: 'text-accent' };
    return { icon: 'Target', color: 'text-primary' };
  };

  const streakInfo = getStreakIcon(todayStats?.streak);

  return (
    <div className="bg-white rounded-lg border border-border shadow-subtle p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <Icon name="TrendingUp" size={24} className="mr-2 text-success" />
          Progresso de Hoje
        </h2>
        <div className="text-sm text-text-secondary">
          {new Date()?.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}
        </div>
      </div>
      {/* Time Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">Tempo de Estudo</span>
          <span className="text-sm font-semibold text-foreground">
            {formatMinutes(todayStats?.studiedTime)} / {formatMinutes(todayStats?.targetTime)}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-500 relative"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage >= 100 && (
              <div className="absolute inset-0 bg-success rounded-full animate-pulse" />
            )}
          </div>
        </div>
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>0h</span>
          <span className="font-medium text-primary">{Math.round(progressPercentage)}%</span>
          <span>{formatMinutes(todayStats?.targetTime)}</span>
        </div>
      </div>
      {/* Topics Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">Tópicos Concluídos</span>
          <span className="text-sm font-semibold text-foreground">
            {todayStats?.completedTopics} / {todayStats?.targetTopics}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-accent h-3 rounded-full transition-all duration-500"
            style={{ width: `${topicsPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>0</span>
          <span className="font-medium text-accent">{Math.round(topicsPercentage)}%</span>
          <span>{todayStats?.targetTopics}</span>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Streak */}
        <div className="bg-muted rounded-lg p-4 text-center">
          <Icon name={streakInfo?.icon} size={24} className={`mx-auto mb-2 ${streakInfo?.color}`} />
          <div className="text-2xl font-bold text-foreground">{todayStats?.streak}</div>
          <div className="text-xs text-text-secondary">dias seguidos</div>
        </div>

        {/* Weekly Average */}
        <div className="bg-muted rounded-lg p-4 text-center">
          <Icon name="BarChart3" size={24} className="mx-auto mb-2 text-secondary" />
          <div className="text-2xl font-bold text-foreground">{formatMinutes(todayStats?.weeklyAverage)}</div>
          <div className="text-xs text-text-secondary">média semanal</div>
        </div>
      </div>
      {/* Achievement Notification */}
      {progressPercentage >= 100 && (
        <div className="mt-4 p-3 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-lg">
          <div className="flex items-center">
            <Icon name="Trophy" size={20} className="text-success mr-2" />
            <span className="text-sm font-medium text-success">
              Meta diária alcançada! Parabéns! 🎉
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyProgress;