import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TodayReviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      subject: 'Matemática',
      topic: 'Regra de Três Simples',
      reviewType: 'Primeira Revisão',
      difficulty: 'medium',
      scheduledTime: '09:00',
      status: 'pending',
      daysUntilNext: 3
    },
    {
      id: 2,
      subject: 'Português',
      topic: 'Concordância Verbal',
      reviewType: 'Segunda Revisão',
      difficulty: 'hard',
      scheduledTime: '10:30',
      status: 'completed',
      daysUntilNext: 7
    },
    {
      id: 3,
      subject: 'Direito Constitucional',
      topic: 'Princípios Fundamentais',
      reviewType: 'Terceira Revisão',
      difficulty: 'easy',
      scheduledTime: '14:00',
      status: 'pending',
      daysUntilNext: 15
    },
    {
      id: 4,
      subject: 'Informática',
      topic: 'Redes de Computadores',
      reviewType: 'Primeira Revisão',
      difficulty: 'medium',
      scheduledTime: '16:00',
      status: 'pending',
      daysUntilNext: 3
    },
    {
      id: 5,
      subject: 'Direito Administrativo',
      topic: 'Atos Administrativos',
      reviewType: 'Quarta Revisão',
      difficulty: 'easy',
      scheduledTime: '17:30',
      status: 'skipped',
      daysUntilNext: 30
    }
  ]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-success bg-success bg-opacity-10';
      case 'medium': return 'text-warning bg-warning bg-opacity-10';
      case 'hard': return 'text-error bg-error bg-opacity-10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return { icon: 'CheckCircle', color: 'text-success' };
      case 'skipped': return { icon: 'XCircle', color: 'text-error' };
      default: return { icon: 'Clock', color: 'text-text-secondary' };
    }
  };

  const handleStatusChange = (reviewId, newStatus) => {
    setReviews(reviews?.map(review => 
      review?.id === reviewId 
        ? { ...review, status: newStatus }
        : review
    ));
  };

  const pendingReviews = reviews?.filter(r => r?.status === 'pending');
  const completedReviews = reviews?.filter(r => r?.status === 'completed');

  return (
    <div className="bg-white rounded-lg border border-border shadow-subtle p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <Icon name="RefreshCw" size={24} className="mr-2 text-primary" />
          Revisões de Hoje
        </h2>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-text-secondary">
            {pendingReviews?.length} pendentes
          </span>
          <span className="text-success">
            {completedReviews?.length} concluídas
          </span>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">Progresso das Revisões</span>
          <span className="text-sm font-semibold text-foreground">
            {completedReviews?.length} / {reviews?.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedReviews?.length / reviews?.length) * 100}%` }}
          />
        </div>
      </div>
      {/* Reviews List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {reviews?.map((review) => {
          const statusInfo = getStatusIcon(review?.status);
          
          return (
            <div 
              key={review?.id}
              className={`p-4 rounded-lg border transition-all duration-150 ${
                review?.status === 'completed' 
                  ? 'bg-success bg-opacity-5 border-success border-opacity-20' 
                  : review?.status === 'skipped' ?'bg-error bg-opacity-5 border-error border-opacity-20' :'bg-muted border-border hover:border-primary hover:border-opacity-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name={statusInfo?.icon} size={16} className={statusInfo?.color} />
                    <span className="font-medium text-foreground">{review?.topic}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(review?.difficulty)}`}>
                      {review?.difficulty === 'easy' ? 'Fácil' : review?.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-text-secondary mb-2">
                    <span className="font-medium">{review?.subject}</span> • {review?.reviewType}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-text-secondary">
                    <span className="flex items-center">
                      <Icon name="Clock" size={12} className="mr-1" />
                      {review?.scheduledTime}
                    </span>
                    <span className="flex items-center">
                      <Icon name="Calendar" size={12} className="mr-1" />
                      Próxima em {review?.daysUntilNext} dias
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {review?.status === 'pending' && (
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(review?.id, 'skipped')}
                      iconName="X"
                      className="text-error hover:bg-error hover:text-error-foreground"
                    >
                      Pular
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleStatusChange(review?.id, 'completed')}
                      iconName="Check"
                    >
                      Concluir
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Sistema de Repetição Espaçada ativo
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
              onClick={() => console.log('Configurar SRS')}
            >
              Configurar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="ExternalLink"
              onClick={() => window.location.href = '/exam-syllabus-manager'}
            >
              Ver Edital
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayReviews;