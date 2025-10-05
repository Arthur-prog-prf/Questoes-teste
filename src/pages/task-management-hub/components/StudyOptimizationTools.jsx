import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StudyOptimizationTools = ({ tasks = [], studyStats = {} }) => {
  const [selectedMetric, setSelectedMetric] = useState('distribution');
  const [optimizationResults, setOptimizationResults] = useState(null);

  // Calculate subject distribution
  const getSubjectDistribution = () => {
    const distribution = {};
    const subjectNames = {
      'matematica': 'Matemática',
      'portugues': 'Português',
      'direito': 'Direito',
      'informatica': 'Informática',
      'atualidades': 'Atualidades'
    };

    tasks?.forEach(task => {
      const subject = task?.subject;
      if (!distribution?.[subject]) {
        distribution[subject] = {
          name: subjectNames?.[subject] || subject,
          totalTasks: 0,
          completedTasks: 0,
          totalHours: 0,
          completedHours: 0,
          avgPriority: 0,
          priorities: { alta: 0, media: 0, baixa: 0 }
        };
      }
      
      distribution[subject].totalTasks++;
      distribution[subject].totalHours += task?.estimatedDuration || 0;
      
      if (task?.status === 'completed') {
        distribution[subject].completedTasks++;
        distribution[subject].completedHours += task?.actualDuration || task?.estimatedDuration || 0;
      }
      
      distribution[subject].priorities[task?.priority] = (distribution?.[subject]?.priorities?.[task?.priority] || 0) + 1;
    });

    return Object.entries(distribution)?.map(([key, value]) => ({
      subject: key,
      ...value,
      completionRate: value?.totalTasks > 0 ? (value?.completedTasks / value?.totalTasks) * 100 : 0,
      efficiencyRate: value?.totalHours > 0 ? (value?.completedHours / value?.totalHours) * 100 : 0
    }));
  };

  // Calculate time distribution analysis
  const getTimeAnalysis = () => {
    const today = new Date();
    const weekAgo = new Date(today?.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentTasks = tasks?.filter(task => {
      const taskDate = new Date(task?.createdAt);
      return taskDate >= weekAgo;
    });

    const timeSlots = {
      morning: { label: 'Manhã (6h-12h)', tasks: 0, hours: 0 },
      afternoon: { label: 'Tarde (12h-18h)', tasks: 0, hours: 0 },
      evening: { label: 'Noite (18h-24h)', tasks: 0, hours: 0 }
    };

    // Mock time analysis - in real app this would use actual scheduled times
    recentTasks?.forEach(task => {
      const hour = Math.floor(Math.random() * 24);
      if (hour >= 6 && hour < 12) {
        timeSlots.morning.tasks++;
        timeSlots.morning.hours += task?.estimatedDuration || 0;
      } else if (hour >= 12 && hour < 18) {
        timeSlots.afternoon.tasks++;
        timeSlots.afternoon.hours += task?.estimatedDuration || 0;
      } else {
        timeSlots.evening.tasks++;
        timeSlots.evening.hours += task?.estimatedDuration || 0;
      }
    });

    return timeSlots;
  };

  // Calculate difficulty vs completion rate
  const getDifficultyAnalysis = () => {
    const difficultyGroups = {
      easy: { label: 'Fácil (1-2)', tasks: [], avgCompletion: 0 },
      medium: { label: 'Médio (3)', tasks: [], avgCompletion: 0 },
      hard: { label: 'Difícil (4-5)', tasks: [], avgCompletion: 0 }
    };

    tasks?.forEach(task => {
      const difficulty = task?.difficulty || 3;
      let group = 'medium';
      
      if (difficulty <= 2) group = 'easy';
      else if (difficulty >= 4) group = 'hard';
      
      difficultyGroups?.[group]?.tasks?.push(task);
    });

    Object.keys(difficultyGroups)?.forEach(key => {
      let group = difficultyGroups?.[key];
      if (group?.tasks?.length > 0) {
        const avgCompletion = group?.tasks?.reduce((sum, task) => 
          sum + (task?.completionRate || 0), 0
        ) / group?.tasks?.length;
        group.avgCompletion = avgCompletion;
      }
    });

    return difficultyGroups;
  };

  // Generate optimization recommendations
  const generateRecommendations = () => {
    const distribution = getSubjectDistribution();
    const timeAnalysis = getTimeAnalysis();
    const difficultyAnalysis = getDifficultyAnalysis();
    
    const recommendations = [];

    // Subject balance recommendations
    const totalTasks = tasks?.length || 1;
    distribution?.forEach(subject => {
      const percentage = (subject?.totalTasks / totalTasks) * 100;
      if (percentage > 40) {
        recommendations?.push({
          type: 'balance',
          severity: 'warning',
          title: `Sobrecarga em ${subject?.name}`,
          description: `${percentage?.toFixed(1)}% das suas tarefas são de ${subject?.name}. Considere diversificar.`,
          action: 'Redistribuir algumas tarefas para outras matérias'
        });
      }
      
      if (subject?.completionRate < 50) {
        recommendations?.push({
          type: 'performance',
          severity: 'error',
          title: `Baixa conclusão em ${subject?.name}`,
          description: `Taxa de conclusão de apenas ${subject?.completionRate?.toFixed(1)}%.`,
          action: 'Revisar dificuldade das tarefas ou alocar mais tempo'
        });
      }
    });

    // Time optimization recommendations
    const mostActiveSlot = Object.entries(timeAnalysis)?.reduce((max, [key, value]) => 
      value?.tasks > (timeAnalysis?.[max] || { tasks: 0 })?.tasks ? key : max
    );
    
    recommendations?.push({
      type: 'timing',
      severity: 'info',
      title: 'Padrão de Estudo Identificado',
      description: `Você é mais produtivo durante a ${timeAnalysis?.[mostActiveSlot]?.label?.toLowerCase()}.`,
      action: 'Agende tarefas mais importantes neste horário'
    });

    // Difficulty recommendations
    if (difficultyAnalysis?.hard?.avgCompletion < difficultyAnalysis?.easy?.avgCompletion - 30) {
      recommendations?.push({
        type: 'difficulty',
        severity: 'warning',
        title: 'Dificuldade Impactando Performance',
        description: 'Tarefas difíceis têm taxa de conclusão muito menor.',
        action: 'Divida tarefas complexas em sub-tarefas menores'
      });
    }

    return recommendations;
  };

  const handleOptimization = (type) => {
    const recommendations = generateRecommendations();
    setOptimizationResults({
      type,
      timestamp: new Date(),
      recommendations,
      metrics: {
        distribution: getSubjectDistribution(),
        timeAnalysis: getTimeAnalysis(),
        difficultyAnalysis: getDifficultyAnalysis()
      }
    });
  };

  const distribution = getSubjectDistribution();
  const timeAnalysis = getTimeAnalysis();

  return (
    <div className="space-y-6">
      {/* Optimization Tools Header */}
      <div className="bg-white rounded-lg shadow-subtle border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center">
              <Icon name="TrendingUp" size={24} className="mr-3 text-primary" />
              Ferramentas de Otimização de Estudos
            </h2>
            <p className="text-text-secondary mt-1">
              Análise inteligente para maximizar sua eficiência de aprendizado
            </p>
          </div>
          
          <Button
            variant="default"
            iconName="BarChart3"
            iconPosition="left"
            onClick={() => handleOptimization('full')}
          >
            Análise Completa
          </Button>
        </div>

        {/* Metric Selector */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'distribution', label: 'Distribuição por Matéria', icon: 'PieChart' },
            { key: 'time', label: 'Análise de Tempo', icon: 'Clock' },
            { key: 'difficulty', label: 'Dificuldade vs Performance', icon: 'Target' },
            { key: 'efficiency', label: 'Eficiência de Estudos', icon: 'Zap' }
          ]?.map((metric) => (
            <button
              key={metric?.key}
              onClick={() => setSelectedMetric(metric?.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedMetric === metric?.key
                  ? 'bg-primary text-white' :'bg-muted text-text-secondary hover:bg-muted/80'
              }`}
            >
              <Icon name={metric?.icon} size={16} />
              <span>{metric?.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart/Analysis */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-subtle border border-border p-6">
          {selectedMetric === 'distribution' && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Distribuição por Matéria</h3>
              <div className="space-y-4">
                {distribution?.map((subject, index) => (
                  <div key={subject?.subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{subject?.name}</span>
                      <span className="text-sm text-text-secondary">
                        {subject?.totalTasks} tarefas • {subject?.totalHours?.toFixed(1)}h
                      </span>
                    </div>
                    
                    <div className="relative">
                      <div className="flex h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="bg-green-500 transition-all duration-500"
                          style={{ width: `${subject?.completionRate}%` }}
                        />
                        <div 
                          className="bg-yellow-500 transition-all duration-500"
                          style={{ width: `${Math.max(0, subject?.efficiencyRate - subject?.completionRate)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-text-secondary mt-1">
                        <span>Conclusão: {subject?.completionRate?.toFixed(1)}%</span>
                        <span>Eficiência: {subject?.efficiencyRate?.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedMetric === 'time' && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Padrões de Tempo de Estudo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(timeAnalysis)?.map(([key, slot]) => (
                  <div key={key} className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{slot?.tasks}</div>
                    <div className="text-sm text-text-secondary">{slot?.label}</div>
                    <div className="text-xs text-text-secondary mt-1">
                      {slot?.hours?.toFixed(1)}h total
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Recomendação de Horário</h4>
                <p className="text-sm text-blue-700">
                  Baseado no seu padrão, você é mais produtivo durante a manhã. 
                  Considere agendar tarefas de alta prioridade neste período.
                </p>
              </div>
            </div>
          )}

          {selectedMetric === 'difficulty' && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Análise de Dificuldade</h3>
              <div className="space-y-4">
                {Object.entries(getDifficultyAnalysis())?.map(([key, group]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">{group?.label}</div>
                      <div className="text-sm text-text-secondary">
                        {group?.tasks?.length} tarefas
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {group?.avgCompletion?.toFixed(1)}%
                      </div>
                      <div className="text-xs text-text-secondary">taxa conclusão</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedMetric === 'efficiency' && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Métricas de Eficiência</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{studyStats?.averageAccuracy || 85.5}%</div>
                  <div className="text-sm text-green-600">Precisão Média</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{studyStats?.totalHours?.toFixed(1) || '12.5'}h</div>
                  <div className="text-sm text-blue-600">Tempo Total</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {((studyStats?.completedTasks || 0) / (studyStats?.totalTasks || 1) * 100)?.toFixed(1)}%
                  </div>
                  <div className="text-sm text-purple-600">Taxa Conclusão</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.ceil((studyStats?.totalHours || 12.5) / 7)}h
                  </div>
                  <div className="text-sm text-orange-600">Média Diária</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations Sidebar */}
        <div className="space-y-6">
          {/* Weak Points Detection */}
          <div className="bg-white rounded-lg shadow-subtle border border-border p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="AlertTriangle" size={18} className="mr-2 text-red-500" />
              Pontos Fracos Identificados
            </h3>
            
            <div className="space-y-3">
              {studyStats?.weakSubjects?.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium text-red-900 capitalize">{subject}</div>
                    <div className="text-sm text-red-700">Precisa de atenção</div>
                  </div>
                  <Icon name="TrendingDown" size={16} className="text-red-500" />
                </div>
              )) || (
                <div className="text-center text-text-secondary py-4">
                  <Icon name="CheckCircle" size={24} className="mx-auto mb-2 text-green-500" />
                  <div className="text-sm">Nenhum ponto fraco identificado!</div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Optimization Actions */}
          <div className="bg-white rounded-lg shadow-subtle border border-border p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Ações Rápidas</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                iconName="Shuffle"
                iconPosition="left"
                fullWidth
                size="sm"
                onClick={() => handleOptimization('rebalance')}
              >
                Rebalancear Matérias
              </Button>
              <Button
                variant="outline"
                iconName="Clock"
                iconPosition="left"
                fullWidth
                size="sm"
                onClick={() => handleOptimization('schedule')}
              >
                Otimizar Horários
              </Button>
              <Button
                variant="outline"
                iconName="Target"
                iconPosition="left"
                fullWidth
                size="sm"
                onClick={() => handleOptimization('difficulty')}
              >
                Ajustar Dificuldade
              </Button>
            </div>
          </div>

          {/* Performance Trend */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 p-4">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Icon name="TrendingUp" size={18} className="mr-2 text-green-600" />
              Tendência de Performance
            </h3>
            <div className="text-2xl font-bold text-green-600 mb-1">+12.5%</div>
            <div className="text-sm text-green-700 mb-3">Melhoria esta semana</div>
            <div className="text-xs text-text-secondary">
              Continue assim! Sua consistência está pagando dividendos.
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Results Modal */}
      {optimizationResults && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-semibold text-foreground">Resultados da Análise</h3>
              <button
                onClick={() => setOptimizationResults(null)}
                className="p-2 hover:bg-muted rounded-md"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Recomendações</h4>
                  <div className="space-y-3">
                    {optimizationResults?.recommendations?.map((rec, index) => (
                      <div key={index} className={`p-4 rounded-lg border-l-4 ${
                        rec?.severity === 'error' ? 'bg-red-50 border-red-500' :
                        rec?.severity === 'warning'? 'bg-yellow-50 border-yellow-500' : 'bg-blue-50 border-blue-500'
                      }`}>
                        <div className="font-medium text-foreground">{rec?.title}</div>
                        <div className="text-sm text-text-secondary mt-1">{rec?.description}</div>
                        <div className="text-xs mt-2 font-medium">💡 {rec?.action}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Resumo das Métricas</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-sm text-text-secondary">Total de Tarefas</div>
                      <div className="text-2xl font-bold text-primary">{tasks?.length}</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-sm text-text-secondary">Taxa de Conclusão Média</div>
                      <div className="text-2xl font-bold text-green-600">
                        {(optimizationResults?.metrics?.distribution?.reduce((sum, s) => sum + s?.completionRate, 0) / 
                          (optimizationResults?.metrics?.distribution?.length || 1))?.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyOptimizationTools;