import React, { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const MasteryRadarChart = () => {
  const [viewMode, setViewMode] = useState('current');

  const masteryData = [
    { subject: 'Matemática', current: 78, target: 85, previous: 65 },
    { subject: 'Português', current: 82, target: 90, previous: 70 },
    { subject: 'Direito', current: 72, target: 80, previous: 60 },
    { subject: 'Informática', current: 85, target: 90, previous: 75 },
    { subject: 'Atualidades', current: 68, target: 75, previous: 55 },
    { subject: 'Raciocínio', current: 75, target: 85, previous: 68 }
  ];

  const viewModes = [
    { value: 'current', label: 'Atual', color: 'var(--color-primary)' },
    { value: 'comparison', label: 'Comparação', color: 'var(--color-success)' }
  ];

  const getAverageMastery = () => {
    const total = masteryData?.reduce((sum, item) => sum + item?.current, 0);
    return Math.round(total / masteryData?.length);
  };

  const getWeakestSubject = () => {
    return masteryData?.reduce((min, item) => 
      item?.current < min?.current ? item : min
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = masteryData?.find(item => item?.subject === label);
      return (
        <div className="bg-white p-3 rounded-lg shadow-elevated border border-border">
          <p className="font-medium text-foreground mb-2">{label}</p>
          <p className="text-primary">{`Atual: ${data?.current}%`}</p>
          {viewMode === 'comparison' && (
            <>
              <p className="text-success">{`Meta: ${data?.target}%`}</p>
              <p className="text-text-secondary">{`Anterior: ${data?.previous}%`}</p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const weakestSubject = getWeakestSubject();

  return (
    <div className="bg-white rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Radar" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Domínio por Matéria</h3>
            <p className="text-sm text-text-secondary">Percentual de conhecimento</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {viewModes?.map((mode) => (
            <button
              key={mode?.value}
              onClick={() => setViewMode(mode?.value)}
              className={`px-3 py-1.5 text-sm rounded-md transition-all duration-150 ${
                viewMode === mode?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:bg-muted hover:text-foreground'
              }`}
            >
              {mode?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Target" size={16} color="var(--color-primary)" />
            <span className="text-sm font-medium text-text-secondary">Média Geral</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{getAverageMastery()}%</p>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
            <span className="text-sm font-medium text-text-secondary">Ponto Fraco</span>
          </div>
          <p className="text-lg font-bold text-foreground">{weakestSubject?.subject}</p>
          <p className="text-sm text-warning">{weakestSubject?.current}%</p>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={masteryData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid stroke="var(--color-border)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Radar
              name="Atual"
              dataKey="current"
              stroke="var(--color-primary)"
              fill="var(--color-primary)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            
            {viewMode === 'comparison' && (
              <>
                <Radar
                  name="Meta"
                  dataKey="target"
                  stroke="var(--color-success)"
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Radar
                  name="Anterior"
                  dataKey="previous"
                  stroke="var(--color-text-secondary)"
                  fill="transparent"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              </>
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {viewMode === 'comparison' && (
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-text-secondary">Atual</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-success"></div>
            <span className="text-text-secondary">Meta</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-text-secondary"></div>
            <span className="text-text-secondary">Anterior</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasteryRadarChart;