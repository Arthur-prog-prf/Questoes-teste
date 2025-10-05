import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StudyTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [currentSubject, setCurrentSubject] = useState('');
  const [sessionStartTime, setSessionStartTime] = useState(null);

  const subjects = [
    'Matemática',
    'Português',
    'Direito Constitucional',
    'Direito Administrativo',
    'Informática',
    'Atualidades'
  ];

  useEffect(() => {
    let interval = null;
    if (isActive && currentSubject) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time, currentSubject]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs?.toString()?.padStart(2, '0')}:${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
    }
    return `${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    if (!currentSubject) {
      alert('Por favor, selecione uma matéria antes de iniciar o timer.');
      return;
    }
    
    if (!isActive && time === 0) {
      setSessionStartTime(new Date());
    }
    setIsActive(!isActive);
  };

  const handleStop = () => {
    setIsActive(false);
    if (time > 0) {
      // Log session to database (mock implementation)
      console.log(`Session logged: ${currentSubject} - ${formatTime(time)}`);
    }
    setTime(0);
    setSessionStartTime(null);
  };

  const handleSubjectChange = (subject) => {
    if (isActive) {
      const confirmChange = window.confirm('Alterar a matéria irá pausar o timer. Deseja continuar?');
      if (!confirmChange) return;
      setIsActive(false);
    }
    setCurrentSubject(subject);
  };

  const canStart = currentSubject && !isActive;
  const timerDisplay = time > 0 || isActive ? formatTime(time) : '00:00';

  return (
    <div className="bg-white rounded-lg border border-border shadow-subtle p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <Icon name="Clock" size={24} className="mr-2 text-primary" />
          Timer de Estudo
        </h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-success animate-pulse' : 'bg-muted'}`} />
          <span className="text-sm text-text-secondary">
            {isActive ? 'Ativo' : 'Pausado'}
          </span>
        </div>
      </div>
      
      {/* Timer Display */}
      <div className="text-center mb-8">
        <div className="text-6xl font-mono font-bold text-primary mb-2">
          {timerDisplay}
        </div>
        <div className="text-lg text-text-secondary">
          {currentSubject ? (
            <>Estudando: <span className="font-medium text-foreground">{currentSubject}</span></>
          ) : (
            <span className="font-medium text-warning">Selecione uma matéria para começar</span>
          )}
        </div>
      </div>
      
      {/* Subject Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-secondary mb-3">
          Selecione a Matéria
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {subjects?.map((subject) => (
            <button
              key={subject}
              onClick={() => handleSubjectChange(subject)}
              disabled={isActive}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                currentSubject === subject
                  ? 'bg-primary text-primary-foreground'
                  : isActive
                  ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                  : 'bg-muted text-text-secondary hover:bg-secondary hover:text-secondary-foreground'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
        {!currentSubject && (
          <p className="text-sm text-warning mt-2">
            * Escolha uma matéria antes de iniciar o timer
          </p>
        )}
      </div>
      
      {/* Control Buttons */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant={isActive ? "outline" : "default"}
          size="lg"
          onClick={handleStartPause}
          iconName={isActive ? "Pause" : "Play"}
          iconPosition="left"
          className="min-w-32"
          disabled={!currentSubject && time === 0}
        >
          {isActive ? 'Pausar' : time > 0 ? 'Continuar' : 'Iniciar'}
        </Button>
        
        {time > 0 && (
          <Button
            variant="destructive"
            size="lg"
            onClick={handleStop}
            iconName="Square"
            iconPosition="left"
          >
            Finalizar
          </Button>
        )}
      </div>
      
      {/* Session Info */}
      {sessionStartTime && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>Sessão iniciada às:</span>
            <span>{sessionStartTime?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyTimer;
