import React from 'react';
import Icon from '../../../components/AppIcon';

const AchievementCard = ({ achievement, isUnlocked, progress = 0 }) => {
  const getStatusIcon = () => {
    if (isUnlocked) return 'CheckCircle';
    if (progress > 0) return 'Clock';
    return 'Lock';
  };

  const getStatusColor = () => {
    if (isUnlocked) return 'text-success';
    if (progress > 0) return 'text-warning';
    return 'text-text-secondary';
  };

  return (
    <div className={`
      relative bg-card rounded-xl border border-border p-6 transition-all duration-300
      ${isUnlocked ? 'shadow-moderate hover:shadow-elevated' : 'opacity-75'}
      ${!isUnlocked ? 'grayscale' : ''}
    `}>
      {/* Achievement Medal */}
      <div className="flex justify-center mb-4">
        <div className={`
          w-16 h-16 rounded-full flex items-center justify-center
          ${isUnlocked ? 'bg-primary' : 'bg-muted'}
          ${isUnlocked ? 'shadow-moderate' : ''}
        `}>
          <Icon 
            name={achievement?.icon} 
            size={32} 
            color={isUnlocked ? 'white' : 'var(--color-text-secondary)'} 
          />
        </div>
      </div>
      {/* Achievement Info */}
      <div className="text-center mb-4">
        <h3 className={`font-semibold text-lg mb-2 ${isUnlocked ? 'text-foreground' : 'text-text-secondary'}`}>
          {achievement?.title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {achievement?.description}
        </p>
      </div>
      {/* Progress or Status */}
      <div className="space-y-3">
        {!isUnlocked && progress > 0 && (
          <div>
            <div className="flex justify-between text-xs text-text-secondary mb-1">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-warning h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="flex items-center justify-center space-x-2">
          <Icon name={getStatusIcon()} size={16} className={getStatusColor()} />
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {isUnlocked ? 'Conquistado' : progress > 0 ? 'Em Progresso' : 'Bloqueado'}
          </span>
        </div>

        {/* Completion Date */}
        {isUnlocked && achievement?.completedAt && (
          <div className="text-center">
            <span className="text-xs text-text-secondary">
              Conquistado em {achievement?.completedAt}
            </span>
          </div>
        )}

        {/* Unlock Criteria */}
        {!isUnlocked && achievement?.criteria && (
          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-text-secondary text-center">
              <strong>Para desbloquear:</strong> {achievement?.criteria}
            </p>
          </div>
        )}
      </div>
      {/* Difficulty Badge */}
      <div className="absolute top-3 right-3">
        <div className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${achievement?.difficulty === 'easy' ? 'bg-success text-success-foreground' : ''}
          ${achievement?.difficulty === 'medium' ? 'bg-warning text-warning-foreground' : ''}
          ${achievement?.difficulty === 'hard' ? 'bg-error text-error-foreground' : ''}
        `}>
          {achievement?.difficulty === 'easy' ? 'Fácil' : 
           achievement?.difficulty === 'medium' ? 'Médio' : 'Difícil'}
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;