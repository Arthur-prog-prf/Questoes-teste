import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryMetrics = () => {
  const metrics = [
    {
      id: 1,
      title: 'Total de Horas',
      value: '127.5',
      unit: 'h',
      change: '+12.3',
      changeType: 'increase',
      icon: 'Clock',
      color: 'primary',
      description: 'Este mês'
    },
    {
      id: 2,
      title: 'Sessões Médias',
      value: '2.8',
      unit: 'h',
      change: '+0.4',
      changeType: 'increase',
      icon: 'Play',
      color: 'success',
      description: 'Por dia'
    },
    {
      id: 3,
      title: 'Sequência Atual',
      value: '12',
      unit: 'dias',
      change: '+3',
      changeType: 'increase',
      icon: 'Flame',
      color: 'accent',
      description: 'Recorde: 18 dias'
    },
    {
      id: 4,
      title: 'Progresso Geral',
      value: '74',
      unit: '%',
      change: '+8',
      changeType: 'increase',
      icon: 'TrendingUp',
      color: 'success',
      description: 'Meta: 85%'
    }
  ];

  const getIconColor = (color) => {
    switch (color) {
      case 'primary': return 'var(--color-primary)';
      case 'success': return 'var(--color-success)';
      case 'accent': return 'var(--color-accent)';
      case 'warning': return 'var(--color-warning)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getBgColor = (color) => {
    switch (color) {
      case 'primary': return 'bg-primary/10';
      case 'success': return 'bg-success/10';
      case 'accent': return 'bg-accent/10';
      case 'warning': return 'bg-warning/10';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics?.map((metric) => (
        <div key={metric?.id} className="bg-white rounded-lg border border-border p-6 shadow-subtle hover:shadow-moderate transition-shadow duration-150">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${getBgColor(metric?.color)} rounded-lg flex items-center justify-center`}>
              <Icon name={metric?.icon} size={24} color={getIconColor(metric?.color)} />
            </div>
            
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              metric?.changeType === 'increase' ?'bg-success/10 text-success' :'bg-error/10 text-error'
            }`}>
              <Icon 
                name={metric?.changeType === 'increase' ? 'ArrowUp' : 'ArrowDown'} 
                size={12} 
              />
              <span>{metric?.change}</span>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-bold text-foreground">{metric?.value}</span>
              <span className="text-lg text-text-secondary">{metric?.unit}</span>
            </div>
          </div>

          <div className="mb-1">
            <h3 className="text-sm font-medium text-foreground">{metric?.title}</h3>
          </div>

          <p className="text-xs text-text-secondary">{metric?.description}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryMetrics;