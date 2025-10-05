import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressOverview = ({ totalAchievements, unlockedAchievements, totalPoints, nextMilestone }) => {
  const completionPercentage = Math.round((unlockedAchievements / totalAchievements) * 100);
  const progressToNext = nextMilestone ? Math.round((totalPoints / nextMilestone?.requiredPoints) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Progress */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-3">
          <Icon name="Target" size={24} color="var(--color-primary)" />
          <span className="text-2xl font-bold text-primary">{completionPercentage}%</span>
        </div>
        <h3 className="font-medium text-foreground mb-1">Progresso Geral</h3>
        <p className="text-sm text-text-secondary">
          {unlockedAchievements} de {totalAchievements} conquistas
        </p>
        <div className="w-full bg-muted rounded-full h-2 mt-3">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      {/* Total Points */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-3">
          <Icon name="Star" size={24} color="var(--color-accent)" />
          <span className="text-2xl font-bold text-accent">{totalPoints}</span>
        </div>
        <h3 className="font-medium text-foreground mb-1">Pontos Totais</h3>
        <p className="text-sm text-text-secondary">
          Acumulados em conquistas
        </p>
      </div>
      {/* Next Milestone */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-3">
          <Icon name="Flag" size={24} color="var(--color-warning)" />
          <span className="text-2xl font-bold text-warning">{progressToNext}%</span>
        </div>
        <h3 className="font-medium text-foreground mb-1">Próxima Meta</h3>
        <p className="text-sm text-text-secondary">
          {nextMilestone ? nextMilestone?.name : 'Todas as metas atingidas!'}
        </p>
        {nextMilestone && (
          <div className="w-full bg-muted rounded-full h-2 mt-3">
            <div 
              className="bg-warning h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressToNext, 100)}%` }}
            />
          </div>
        )}
      </div>
      {/* Study Level */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-3">
          <Icon name="TrendingUp" size={24} color="var(--color-success)" />
          <span className="text-2xl font-bold text-success">
            {Math.floor(totalPoints / 100) + 1}
          </span>
        </div>
        <h3 className="font-medium text-foreground mb-1">Nível de Estudo</h3>
        <p className="text-sm text-text-secondary">
          {totalPoints % 100} pontos para o próximo nível
        </p>
        <div className="w-full bg-muted rounded-full h-2 mt-3">
          <div 
            className="bg-success h-2 rounded-full transition-all duration-300"
            style={{ width: `${(totalPoints % 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;