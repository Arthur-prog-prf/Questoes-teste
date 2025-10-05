import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlanningTipsWidget = ({ studyStats = {}, recentTasks = [] }) => {
  const [activeTab, setActiveTab] = useState('tips');

  // Generate personalized tips based on user data
  const generatePersonalizedTips = () => {
    const tips = [];
    
    // Based on completion rate
    const completionRate = studyStats?.completedTasks && studyStats?.totalTasks 
      ? (studyStats?.completedTasks / studyStats?.totalTasks) * 100 
      : 0;

    if (completionRate < 50) {
      tips?.push({
        category: 'productivity',
        title: 'Melhore sua Taxa de Conclusão',
        content: 'Considere dividir tarefas grandes em sub-tarefas menores de 25-45 minutos cada.',
        icon: 'Target',
        priority: 'high'
      });
    } else if (completionRate > 80) {
      tips?.push({
        category: 'optimization',
        title: 'Excelente Produtividade!',
        content: 'Você está indo muito bem! Considere aumentar gradualmente a dificuldade das tarefas.',
        icon: 'TrendingUp',
        priority: 'low'
      });
    }

    // Based on study hours
    const totalHours = studyStats?.totalHours || 0;
    if (totalHours > 40) {
      tips?.push({
        category: 'balance',
        title: 'Cuidado com o Esgotamento',
        content: 'Você está estudando muitas horas. Lembre-se de fazer pausas regulares e descansar.',
        icon: 'Clock',
        priority: 'high'
      });
    } else if (totalHours < 10) {
      tips?.push({
        category: 'consistency',
        title: 'Aumente sua Consistência',
        content: 'Tente estabelecer uma rotina diária de estudos, mesmo que seja apenas 1 hora por dia.',
        icon: 'Calendar',
        priority: 'medium'
      });
    }

    // Based on weak subjects
    if (studyStats?.weakSubjects?.length > 0) {
      tips?.push({
        category: 'improvement',
        title: 'Foque nas Matérias Deficitárias',
        content: `Dedique 20% mais tempo para: ${studyStats?.weakSubjects?.join(', ')}.`,
        icon: 'BookOpen',
        priority: 'medium'
      });
    }

    // General productivity tips
    const generalTips = [
      {
        category: 'technique',
        title: 'Técnica Pomodoro',
        content: '25 minutos de foco + 5 minutos de pausa = máxima produtividade',
        icon: 'Timer',
        priority: 'low'
      },
      {
        category: 'environment',
        title: 'Ambiente de Estudo',
        content: 'Mantenha seu espaço de estudo limpo, organizado e livre de distrações.',
        icon: 'Home',
        priority: 'low'
      },
      {
        category: 'planning',
        title: 'Planeje a Semana',
        content: 'Reserve 15 minutos no domingo para planejar toda a semana de estudos.',
        icon: 'CalendarDays',
        priority: 'low'
      },
      {
        category: 'review',
        title: 'Revisão Espaçada',
        content: 'Revise os tópicos estudados após 1 dia, 1 semana e 1 mês para fixação.',
        icon: 'RotateCcw',
        priority: 'low'
      },
      {
        category: 'health',
        title: 'Cuide da Sua Saúde',
        content: '8h de sono, exercícios regulares e boa alimentação melhoram o aprendizado.',
        icon: 'Heart',
        priority: 'medium'
      }
    ];

    return [...tips, ...generalTips]?.slice(0, 6);
  };

  const getStudyInsights = () => {
    return [
      {
        title: 'Pico de Produtividade',
        value: '9h - 11h',
        description: 'Baseado no seu histórico de conclusões',
        icon: 'Sun'
      },
      {
        title: 'Matéria Favorita',
        value: 'Matemática',
        description: 'Maior taxa de conclusão',
        icon: 'Award'
      },
      {
        title: 'Sessão Ideal',
        value: '45 min',
        description: 'Duração média das suas sessões mais produtivas',
        icon: 'Clock'
      },
      {
        title: 'Streak Atual',
        value: '7 dias',
        description: 'Dias consecutivos estudando',
        icon: 'Flame'
      }
    ];
  };

  const getMotivationalQuotes = () => {
    return [
      {
        quote: "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
        author: "Robert Collier",
        category: "perseverança"
      },
      {
        quote: "A educação é a arma mais poderosa que você pode usar para mudar o mundo.",
        author: "Nelson Mandela",
        category: "educação"
      },
      {
        quote: "Não é o quanto você estuda, mas como você estuda que faz a diferença.",
        author: "Anônimo",
        category: "qualidade"
      },
      {
        quote: "O conhecimento é poder, mas o conhecimento organizado é poder supremo.",
        author: "Napoleon Hill",
        category: "organização"
      }
    ];
  };

  const tips = generatePersonalizedTips();
  const insights = getStudyInsights();
  const quotes = getMotivationalQuotes();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const tabOptions = [
    { key: 'tips', label: 'Dicas', icon: 'Lightbulb' },
    { key: 'insights', label: 'Insights', icon: 'BarChart3' },
    { key: 'motivation', label: 'Motivação', icon: 'Heart' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-subtle border border-border overflow-hidden">
      {/* Header with Tabs */}
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Centro de Aprendizado</h3>
        
        <div className="flex items-center bg-muted rounded-lg p-1">
          {tabOptions?.map((tab) => (
            <button
              key={tab?.key}
              onClick={() => setActiveTab(tab?.key)}
              className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab?.key
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-text-secondary hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={14} />
              <span className="hidden sm:inline">{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        {activeTab === 'tips' && (
          <div className="space-y-4">
            {tips?.map((tip, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                tip?.priority === 'high' ? 'bg-red-50 border-red-400' :
                tip?.priority === 'medium'? 'bg-yellow-50 border-yellow-400' : 'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-start space-x-3">
                  <Icon 
                    name={tip?.icon} 
                    size={20} 
                    className={`flex-shrink-0 mt-0.5 ${
                      tip?.priority === 'high' ? 'text-red-600' :
                      tip?.priority === 'medium'? 'text-yellow-600' : 'text-blue-600'
                    }`}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-sm mb-1">
                      {tip?.title}
                    </h4>
                    <p className="text-text-secondary text-xs leading-relaxed">
                      {tip?.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                iconName="ExternalLink"
                iconPosition="left"
                fullWidth
                size="sm"
                onClick={() => alert('Redirecionamento para guias completos será implementado!')}
              >
                Ver Guia Completo
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            {insights?.map((insight, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name={insight?.icon} size={16} className="text-primary" />
                  <div>
                    <div className="font-medium text-foreground text-sm">{insight?.title}</div>
                    <div className="text-xs text-text-secondary">{insight?.description}</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-primary">{insight?.value}</div>
              </div>
            ))}

            {/* Recent Performance Chart Placeholder */}
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
              <h4 className="font-semibold text-foreground mb-3 text-sm flex items-center">
                <Icon name="TrendingUp" size={16} className="mr-2" />
                Performance Semanal
              </h4>
              <div className="flex justify-between items-end h-20">
                {[65, 78, 82, 70, 88, 95, 87]?.map((value, index) => (
                  <div key={index} className="flex flex-col items-center space-y-1">
                    <div 
                      className="bg-primary rounded-t w-4 transition-all duration-500"
                      style={{ height: `${value}%` }}
                    />
                    <span className="text-xs text-text-secondary">
                      {['S', 'T', 'Q', 'Q', 'S', 'S', 'D']?.[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'motivation' && (
          <div className="space-y-6">
            {/* Quote of the Day */}
            <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
              <Icon name="Quote" size={24} className="mx-auto text-primary mb-4" />
              <blockquote className="text-foreground font-medium text-sm leading-relaxed mb-3">
                "{quotes?.[currentQuoteIndex]?.quote}"
              </blockquote>
              <cite className="text-text-secondary text-xs">
                — {quotes?.[currentQuoteIndex]?.author}
              </cite>
              
              <div className="flex justify-center space-x-2 mt-4">
                <button
                  onClick={() => setCurrentQuoteIndex(
                    (currentQuoteIndex - 1 + quotes?.length) % quotes?.length
                  )}
                  className="p-2 hover:bg-white/50 rounded-md transition-colors"
                >
                  <Icon name="ChevronLeft" size={16} />
                </button>
                <button
                  onClick={() => setCurrentQuoteIndex(
                    (currentQuoteIndex + 1) % quotes?.length
                  )}
                  className="p-2 hover:bg-white/50 rounded-md transition-colors"
                >
                  <Icon name="ChevronRight" size={16} />
                </button>
              </div>
            </div>

            {/* Achievement Highlights */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm">
                Suas Conquistas Recentes
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Icon name="Trophy" size={16} className="text-yellow-600" />
                  <div className="flex-1">
                    <div className="font-medium text-green-900 text-sm">Meta Semanal Atingida!</div>
                    <div className="text-green-700 text-xs">20 horas de estudo completadas</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Icon name="Target" size={16} className="text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium text-blue-900 text-sm">Streak de Estudos</div>
                    <div className="text-blue-700 text-xs">7 dias consecutivos!</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Icon name="BookOpen" size={16} className="text-purple-600" />
                  <div className="flex-1">
                    <div className="font-medium text-purple-900 text-sm">Tópicos Dominados</div>
                    <div className="text-purple-700 text-xs">5 tópicos de matemática</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Reminder */}
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <h4 className="font-semibold text-foreground mb-2 text-sm flex items-center">
                <Icon name="Calendar" size={16} className="mr-2 text-accent" />
                Lembrete do Dia
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed">
                Cada pequeno passo te aproxima dos seus objetivos. Continue focado e 
                celebre cada conquista, por menor que seja!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanningTipsWidget;