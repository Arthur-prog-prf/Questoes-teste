import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentAchievements = ({ recentAchievements }) => {
  if (!recentAchievements || recentAchievements?.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Conquistas Recentes</h3>
        <div className="text-center py-8">
          <Icon name="Trophy" size={48} color="var(--color-text-secondary)" className="mx-auto mb-4" />
          <p className="text-text-secondary">Nenhuma conquista recente</p>
          <p className="text-sm text-text-secondary mt-2">Continue estudando para desbloquear conquistas!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Conquistas Recentes</h3>
        <Icon name="Sparkles" size={20} color="var(--color-accent)" />
      </div>
      <div className="space-y-4">
        {recentAchievements?.map((achievement, index) => (
          <div key={achievement?.id} className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
            {/* Achievement Icon */}
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name={achievement?.icon} size={24} color="white" />
            </div>
            
            {/* Achievement Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">{achievement?.title}</h4>
              <p className="text-sm text-text-secondary">{achievement?.description}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-text-secondary">{achievement?.completedAt}</span>
                <span className="text-xs text-text-secondary">•</span>
                <span className={`
                  text-xs px-2 py-0.5 rounded-full
                  ${achievement?.difficulty === 'easy' ? 'bg-success text-success-foreground' : ''}
                  ${achievement?.difficulty === 'medium' ? 'bg-warning text-warning-foreground' : ''}
                  ${achievement?.difficulty === 'hard' ? 'bg-error text-error-foreground' : ''}
                `}>
                  {achievement?.difficulty === 'easy' ? 'Fácil' : 
                   achievement?.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                </span>
              </div>
            </div>

            {/* New Badge */}
            {index === 0 && (
              <div className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
                Novo!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAchievements;