import React from 'react';
import Icon from '../../../components/AppIcon';

const StudyStreakCounter = ({ currentStreak, bestStreak, streakGoal = 30 }) => {
  const getFlameCount = () => {
    if (currentStreak >= 30) return 3;
    if (currentStreak >= 14) return 2;
    if (currentStreak >= 7) return 1;
    return 0;
  };

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Comece sua sequência hoje!";
    if (currentStreak === 1) return "Ótimo começo! Continue assim!";
    if (currentStreak < 7) return "Você está no caminho certo!";
    if (currentStreak < 14) return "Sequência impressionante!";
    if (currentStreak < 30) return "Você está em chamas! 🔥";
    return "Sequência lendária! Você é imparável!";
  };

  const progressPercentage = Math.min((currentStreak / streakGoal) * 100, 100);

  return (
    <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-6 text-white shadow-elevated">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Sequência de Estudos</h2>
        <div className="flex space-x-1">
          {[...Array(3)]?.map((_, index) => (
            <Icon
              key={index}
              name="Flame"
              size={20}
              color={index < getFlameCount() ? '#F59E0B' : 'rgba(255,255,255,0.3)'}
            />
          ))}
        </div>
      </div>
      {/* Current Streak Display */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold mb-2">{currentStreak}</div>
        <div className="text-lg opacity-90">
          {currentStreak === 1 ? 'dia consecutivo' : 'dias consecutivos'}
        </div>
        <div className="text-sm opacity-75 mt-2">
          {getStreakMessage()}
        </div>
      </div>
      {/* Progress to Goal */}
      <div className="mb-4">
        <div className="flex justify-between text-sm opacity-90 mb-2">
          <span>Meta: {streakGoal} dias</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{bestStreak}</div>
          <div className="text-sm opacity-75">Melhor Sequência</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{streakGoal - currentStreak > 0 ? streakGoal - currentStreak : 0}</div>
          <div className="text-sm opacity-75">Dias para Meta</div>
        </div>
      </div>
      {/* Milestone Indicators */}
      <div className="flex justify-between mt-4 pt-4 border-t border-white border-opacity-20">
        {[7, 14, 30]?.map((milestone) => (
          <div key={milestone} className="text-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
              ${currentStreak >= milestone ? 'bg-white text-primary' : 'bg-white bg-opacity-20'}
            `}>
              {milestone}
            </div>
            <div className="text-xs mt-1 opacity-75">
              {milestone === 7 ? 'Semana' : milestone === 14 ? '2 Semanas' : 'Mês'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyStreakCounter;