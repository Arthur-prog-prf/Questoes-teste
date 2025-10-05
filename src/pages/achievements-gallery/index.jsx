import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProgressOverview from './components/ProgressOverview';
import AchievementCard from './components/AchievementCard';
import CategoryFilter from './components/CategoryFilter';
import StudyStreakCounter from './components/StudyStreakCounter';
import RecentAchievements from './components/RecentAchievements';
import ShareModal from './components/ShareModal';

const AchievementsGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState(null);

  const categories = [
    { value: 'all', label: 'Todas', icon: 'Star' },
    { value: 'study-time', label: 'Tempo de Estudo', icon: 'Clock' },
    { value: 'consistency', label: 'Consistência', icon: 'Calendar' },
    { value: 'performance', label: 'Desempenho', icon: 'TrendingUp' },
    { value: 'milestones', label: 'Marcos', icon: 'Trophy' }
  ];

  // Mock achievements data
  const [achievements, setAchievements] = useState([]);

  // Add mock data for required props
  const progressData = {
    totalAchievements: 25,
    unlockedAchievements: 12,
    totalPoints: 1250,
    nextMilestone: { name: 'Study Master', pointsNeeded: 250 }
  };

  const streakData = {
    currentStreak: 7,
    bestStreak: 15
  };

  const recentAchievements = [
    { id: 1, title: 'First Study Session', date: '2024-01-01', icon: 'Star' },
    { id: 2, title: '7 Day Streak', date: '2024-01-07', icon: 'Calendar' }
  ];

  const handleShareAchievement = (achievement) => {
    setShareData(achievement);
    setIsShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Galeria de Conquistas
              </h1>
              <p className="text-text-secondary">
                Celebrate seus progressos e acompanhe suas conquistas nos estudos
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setIsShareModalOpen(true)}
              iconName="Share"
              iconPosition="left"
            >
              Compartilhar
            </Button>
          </div>

          {/* Progress Overview */}
          <div className="mb-8">
            <ProgressOverview 
              totalAchievements={progressData.totalAchievements}
              unlockedAchievements={progressData.unlockedAchievements}
              totalPoints={progressData.totalPoints}
              nextMilestone={progressData.nextMilestone}
            />
          </div>

          {/* Study Streak Counter */}
          <div className="mb-8">
            <StudyStreakCounter 
              currentStreak={streakData.currentStreak}
              bestStreak={streakData.bestStreak}
            />
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              activeCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Achievements Grid */}
            <div className="lg:col-span-3">
              {achievements?.length === 0 ? (
                <div className="bg-white rounded-lg border border-border p-12 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="Trophy" size={32} color="var(--color-primary)" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Suas conquistas aparecerão aqui
                  </h3>
                  <p className="text-text-secondary max-w-md mx-auto mb-6">
                    Continue estudando para desbloquear suas primeiras conquistas. 
                    Cada sessão de estudo te aproxima de novos marcos!
                  </p>
                  <Button
                    variant="default"
                    onClick={() => window.location.href = '/today-dashboard'}
                    iconName="Play"
                    iconPosition="left"
                  >
                    Iniciar Estudos
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {achievements
                    ?.filter(achievement => 
                      selectedCategory === 'all' || achievement?.category === selectedCategory
                    )
                    ?.map((achievement) => (
                      <AchievementCard
                        key={achievement?.id}
                        achievement={achievement}
                        isUnlocked={achievement?.unlocked || false}
                        onShare={() => handleShareAchievement(achievement)}
                      />
                    ))
                  }
                </div>
              )}
            </div>

            {/* Recent Achievements Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <RecentAchievements recentAchievements={recentAchievements} />
              </div>
            </div>
          </div>

          {/* Share Modal */}
          {isShareModalOpen && (
            <ShareModal
              isOpen={isShareModalOpen}
              onClose={() => {
                setIsShareModalOpen(false);
                setShareData(null);
              }}
              shareData={shareData}
              achievement={shareData}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AchievementsGallery;
