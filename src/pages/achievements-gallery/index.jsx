import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AchievementCard from './components/AchievementCard';
import StudyStreakCounter from './components/StudyStreakCounter';
import CategoryFilter from './components/CategoryFilter';
import RecentAchievements from './components/RecentAchievements';
import ProgressOverview from './components/ProgressOverview';
import ShareModal from './components/ShareModal';

const AchievementsGallery = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [shareModal, setShareModal] = useState({ isOpen: false, achievement: null });
  const [celebrationAnimation, setCelebrationAnimation] = useState(null);

  // Mock achievements data
  const achievements = [
    {
      id: 1,
      title: "Primeiro Passo",
      description: "Complete sua primeira sessão de estudos",
      icon: "BookOpen",
      category: "milestones",
      difficulty: "easy",
      points: 10,
      isUnlocked: true,
      completedAt: "02/10/2025",
      criteria: "Complete 1 sessão de estudos"
    },
    {
      id: 2,
      title: "Sequência de 7 Dias",
      description: "Estude por 7 dias consecutivos",
      icon: "Flame",
      category: "streaks",
      difficulty: "medium",
      points: 50,
      isUnlocked: true,
      completedAt: "01/10/2025",
      criteria: "Estude por 7 dias seguidos"
    },
    {
      id: 3,
      title: "Mestre em Matemática",
      description: "Domine 20 tópicos de Matemática",
      icon: "Calculator",
      category: "mastery",
      difficulty: "hard",
      points: 100,
      isUnlocked: false,
      progress: 75,
      criteria: "Domine 20 tópicos de Matemática"
    },
    {
      id: 4,
      title: "Madrugador",
      description: "Estude antes das 6h da manhã por 5 dias",
      icon: "Sunrise",
      category: "special",
      difficulty: "medium",
      points: 75,
      isUnlocked: false,
      progress: 40,
      criteria: "Estude antes das 6h por 5 dias"
    },
    {
      id: 5,
      title: "Sequência de 30 Dias",
      description: "Estude por 30 dias consecutivos",
      icon: "Trophy",
      category: "streaks",
      difficulty: "hard",
      points: 200,
      isUnlocked: false,
      progress: 60,
      criteria: "Estude por 30 dias seguidos"
    },
    {
      id: 6,
      title: "100 Horas de Estudo",
      description: "Acumule 100 horas de estudo",
      icon: "Clock",
      category: "milestones",
      difficulty: "medium",
      points: 150,
      isUnlocked: true,
      completedAt: "28/09/2025",
      criteria: "Acumule 100 horas de estudo"
    },
    {
      id: 7,
      title: "Especialista em Direito",
      description: "Domine 15 tópicos de Direito Constitucional",
      icon: "Scale",
      category: "mastery",
      difficulty: "hard",
      points: 120,
      isUnlocked: false,
      progress: 33,
      criteria: "Domine 15 tópicos de Direito"
    },
    {
      id: 8,
      title: "Noturno Dedicado",
      description: "Estude após 22h por 10 dias",
      icon: "Moon",
      category: "special",
      difficulty: "medium",
      points: 80,
      isUnlocked: false,
      progress: 0,
      criteria: "Estude após 22h por 10 dias"
    }
  ];

  const categories = [
    { id: 'all', name: 'Todas', icon: 'Grid3X3', count: achievements?.length },
    { id: 'milestones', name: 'Marcos', icon: 'Flag', count: achievements?.filter(a => a?.category === 'milestones')?.length },
    { id: 'streaks', name: 'Sequências', icon: 'Flame', count: achievements?.filter(a => a?.category === 'streaks')?.length },
    { id: 'mastery', name: 'Domínio', icon: 'GraduationCap', count: achievements?.filter(a => a?.category === 'mastery')?.length },
    { id: 'special', name: 'Especiais', icon: 'Star', count: achievements?.filter(a => a?.category === 'special')?.length }
  ];

  const recentAchievements = achievements?.filter(a => a?.isUnlocked)?.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))?.slice(0, 3);

  const filteredAchievements = activeCategory === 'all' 
    ? achievements 
    : achievements?.filter(a => a?.category === activeCategory);

  const unlockedCount = achievements?.filter(a => a?.isUnlocked)?.length;
  const totalPoints = achievements?.filter(a => a?.isUnlocked)?.reduce((sum, a) => sum + a?.points, 0);

  const nextMilestone = {
    name: "Estudante Dedicado",
    requiredPoints: 500,
    description: "Alcance 500 pontos em conquistas"
  };

  const handleShareAchievement = (achievement) => {
    setShareModal({ isOpen: true, achievement });
  };

  const handleCloseShareModal = () => {
    setShareModal({ isOpen: false, achievement: null });
  };

  // Simulate achievement unlock animation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (celebrationAnimation) {
        setCelebrationAnimation(null);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [celebrationAnimation]);

  return (
    <>
      <Helmet>
        <title>Galeria de Conquistas - Painel de Aprovação</title>
        <meta name="description" content="Acompanhe suas conquistas e progresso nos estudos para concursos públicos" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
        
        <main className={`
          transition-all duration-300 pt-16
          ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}
        `}>
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Galeria de Conquistas
                </h1>
                <p className="text-text-secondary">
                  Acompanhe seu progresso e celebre suas conquistas nos estudos
                </p>
              </div>
              <Button
                variant="outline"
                iconName="Share2"
                iconPosition="left"
                onClick={() => handleShareAchievement(recentAchievements?.[0])}
                className="hidden sm:flex"
              >
                Compartilhar
              </Button>
            </div>

            {/* Progress Overview */}
            <ProgressOverview
              totalAchievements={achievements?.length}
              unlockedAchievements={unlockedCount}
              totalPoints={totalPoints}
              nextMilestone={nextMilestone}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Study Streak Counter */}
              <div className="lg:col-span-2">
                <StudyStreakCounter
                  currentStreak={18}
                  bestStreak={25}
                  streakGoal={30}
                />
              </div>

              {/* Recent Achievements */}
              <div>
                <RecentAchievements recentAchievements={recentAchievements} />
              </div>
            </div>

            {/* Category Filter */}
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAchievements?.map((achievement) => (
                <div key={achievement?.id} className="relative">
                  <AchievementCard
                    achievement={achievement}
                    isUnlocked={achievement?.isUnlocked}
                    progress={achievement?.progress}
                  />
                  
                  {/* Share Button */}
                  {achievement?.isUnlocked && (
                    <button
                      onClick={() => handleShareAchievement(achievement)}
                      className="absolute top-3 left-3 p-2 bg-white bg-opacity-90 rounded-full shadow-subtle hover:shadow-moderate transition-all duration-150"
                      title="Compartilhar conquista"
                    >
                      <Icon name="Share2" size={14} color="var(--color-text-secondary)" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredAchievements?.length === 0 && (
              <div className="text-center py-12">
                <Icon name="Trophy" size={64} color="var(--color-text-secondary)" className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhuma conquista encontrada
                </h3>
                <p className="text-text-secondary">
                  Tente filtrar por uma categoria diferente
                </p>
              </div>
            )}

            {/* Celebration Animation */}
            {celebrationAnimation && (
              <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
                <div className="animate-bounce">
                  <div className="text-6xl">🎉</div>
                  <div className="text-center mt-4 bg-white rounded-lg p-4 shadow-elevated">
                    <h3 className="font-bold text-primary">Nova Conquista!</h3>
                    <p className="text-sm text-text-secondary">{celebrationAnimation?.title}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Share Modal */}
        <ShareModal
          isOpen={shareModal?.isOpen}
          onClose={handleCloseShareModal}
          achievement={shareModal?.achievement}
        />
      </div>
    </>
  );
};

export default AchievementsGallery;