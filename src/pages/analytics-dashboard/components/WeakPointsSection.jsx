import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const WeakPointsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const weakPoints = [
    {
      id: 1,
      subject: 'Matemática',
      topic: 'Análise Combinatória',
      score: 45,
      category: 'critical',
      lastStudied: '28/09/2024',
      sessions: 3,
      improvement: -5,
      priority: 'alta'
    },
    {
      id: 2,
      subject: 'Direito',
      topic: 'Direito Administrativo',
      score: 52,
      category: 'attention',
      lastStudied: '02/10/2024',
      sessions: 5,
      improvement: 8,
      priority: 'alta'
    },
    {
      id: 3,
      subject: 'Português',
      topic: 'Concordância Verbal',
      score: 58,
      category: 'attention',
      lastStudied: '04/10/2024',
      sessions: 4,
      improvement: 12,
      priority: 'média'
    },
    {
      id: 4,
      subject: 'Matemática',
      topic: 'Geometria Analítica',
      score: 48,
      category: 'critical',
      lastStudied: '01/10/2024',
      sessions: 2,
      improvement: -2,
      priority: 'alta'
    },
    {
      id: 5,
      subject: 'Informática',
      topic: 'Redes de Computadores',
      score: 62,
      category: 'improvement',
      lastStudied: '05/10/2024',
      sessions: 6,
      improvement: 15,
      priority: 'baixa'
    }
  ];

  const categories = [
    { value: 'all', label: 'Todos', count: weakPoints?.length },
    { value: 'critical', label: 'Críticos', count: weakPoints?.filter(p => p?.category === 'critical')?.length },
    { value: 'attention', label: 'Atenção', count: weakPoints?.filter(p => p?.category === 'attention')?.length },
    { value: 'improvement', label: 'Melhorando', count: weakPoints?.filter(p => p?.category === 'improvement')?.length }
  ];

  const filteredPoints = selectedCategory === 'all' 
    ? weakPoints 
    : weakPoints?.filter(point => point?.category === selectedCategory);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'critical': return 'text-error';
      case 'attention': return 'text-warning';
      case 'improvement': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  const getCategoryBg = (category) => {
    switch (category) {
      case 'critical': return 'bg-error/10';
      case 'attention': return 'bg-warning/10';
      case 'improvement': return 'bg-success/10';
      default: return 'bg-muted';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'alta': return 'AlertTriangle';
      case 'média': return 'AlertCircle';
      case 'baixa': return 'Info';
      default: return 'Info';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'var(--color-error)';
      case 'média': return 'var(--color-warning)';
      case 'baixa': return 'var(--color-text-secondary)';
      default: return 'var(--color-text-secondary)';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Pontos Fracos</h3>
            <p className="text-sm text-text-secondary">Tópicos que precisam de atenção</p>
          </div>
        </div>

        <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/5 rounded-md transition-colors duration-150">
          <Icon name="Download" size={16} />
          <span>Exportar</span>
        </button>
      </div>
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto">
        {categories?.map((category) => (
          <button
            key={category?.value}
            onClick={() => setSelectedCategory(category?.value)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 ${
              selectedCategory === category?.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-text-secondary hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            <span>{category?.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              selectedCategory === category?.value
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-background text-text-secondary'
            }`}>
              {category?.count}
            </span>
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filteredPoints?.map((point) => (
          <div key={point?.id} className="border border-border rounded-lg p-4 hover:shadow-subtle transition-shadow duration-150">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryBg(point?.category)} ${getCategoryColor(point?.category)}`}>
                    {point?.subject}
                  </div>
                  <Icon 
                    name={getPriorityIcon(point?.priority)} 
                    size={16} 
                    color={getPriorityColor(point?.priority)} 
                  />
                </div>
                
                <h4 className="font-medium text-foreground mb-1">{point?.topic}</h4>
                
                <div className="flex items-center space-x-4 text-sm text-text-secondary">
                  <span>Última revisão: {point?.lastStudied}</span>
                  <span>{point?.sessions} sessões</span>
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name={point?.improvement >= 0 ? "TrendingUp" : "TrendingDown"} 
                      size={14} 
                      color={point?.improvement >= 0 ? "var(--color-success)" : "var(--color-error)"} 
                    />
                    <span className={point?.improvement >= 0 ? 'text-success' : 'text-error'}>
                      {point?.improvement >= 0 ? '+' : ''}{point?.improvement}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">{point?.score}%</div>
                  <div className="text-xs text-text-secondary">Aproveitamento</div>
                </div>
                
                <button className="p-2 hover:bg-muted rounded-md transition-colors duration-150">
                  <Icon name="MoreVertical" size={16} color="var(--color-text-secondary)" />
                </button>
              </div>
            </div>

            <div className="mt-3 w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  point?.score < 50 ? 'bg-error' : point?.score < 70 ? 'bg-warning' : 'bg-success'
                }`}
                style={{ width: `${point?.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {filteredPoints?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={48} color="var(--color-success)" className="mx-auto mb-3" />
          <h4 className="text-lg font-medium text-foreground mb-1">Nenhum ponto fraco encontrado!</h4>
          <p className="text-text-secondary">Continue assim, você está indo muito bem!</p>
        </div>
      )}
    </div>
  );
};

export default WeakPointsSection;