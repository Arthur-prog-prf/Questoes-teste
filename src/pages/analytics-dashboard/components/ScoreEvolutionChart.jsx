import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const ScoreEvolutionChart = () => {
  const [selectedSubject, setSelectedSubject] = useState('all');

  const scoreData = [
    { date: '15/09', math: 65, portuguese: 72, law: 58, general: 68 },
    { date: '20/09', math: 68, portuguese: 75, law: 62, general: 71 },
    { date: '25/09', math: 72, portuguese: 78, law: 65, general: 74 },
    { date: '30/09', math: 75, portuguese: 80, law: 68, general: 77 },
    { date: '05/10', math: 78, portuguese: 82, law: 72, general: 80 }
  ];

  const subjects = [
    { value: 'all', label: 'Todas as Matérias', color: 'var(--color-primary)' },
    { value: 'math', label: 'Matemática', color: '#EF4444' },
    { value: 'portuguese', label: 'Português', color: '#10B981' },
    { value: 'law', label: 'Direito', color: '#F59E0B' }
  ];

  const getLatestScore = () => {
    const latest = scoreData?.[scoreData?.length - 1];
    if (selectedSubject === 'all') {
      return latest?.general;
    }
    return latest?.[selectedSubject];
  };

  const getScoreImprovement = () => {
    const first = scoreData?.[0];
    const latest = scoreData?.[scoreData?.length - 1];
    
    let firstScore, latestScore;
    if (selectedSubject === 'all') {
      firstScore = first?.general;
      latestScore = latest?.general;
    } else {
      firstScore = first?.[selectedSubject];
      latestScore = latest?.[selectedSubject];
    }
    
    return latestScore - firstScore;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-elevated border border-border">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} style={{ color: entry?.color }}>
              {`${entry?.name}: ${entry?.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderLines = () => {
    if (selectedSubject === 'all') {
      return subjects?.slice(1)?.map((subject) => (
        <Line
          key={subject?.value}
          type="monotone"
          dataKey={subject?.value}
          stroke={subject?.color}
          strokeWidth={2}
          dot={{ r: 4 }}
          name={subject?.label}
        />
      ));
    } else {
      const subject = subjects?.find(s => s?.value === selectedSubject);
      return (
        <Line
          type="monotone"
          dataKey={selectedSubject}
          stroke={subject?.color}
          strokeWidth={3}
          dot={{ r: 5 }}
          name={subject?.label}
        />
      );
    }
  };

  const improvement = getScoreImprovement();

  return (
    <div className="bg-white rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} color="var(--color-success)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Evolução das Notas</h3>
            <p className="text-sm text-text-secondary">Progresso ao longo do tempo</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e?.target?.value)}
            className="px-3 py-1.5 text-sm border border-border rounded-md bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {subjects?.map((subject) => (
              <option key={subject?.value} value={subject?.value}>
                {subject?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Target" size={16} color="var(--color-primary)" />
            <span className="text-sm font-medium text-text-secondary">Nota Atual</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{getLatestScore()}%</p>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Icon 
              name={improvement >= 0 ? "ArrowUp" : "ArrowDown"} 
              size={16} 
              color={improvement >= 0 ? "var(--color-success)" : "var(--color-error)"} 
            />
            <span className="text-sm font-medium text-text-secondary">Melhoria</span>
          </div>
          <p className={`text-2xl font-bold ${improvement >= 0 ? 'text-success' : 'text-error'}`}>
            {improvement >= 0 ? '+' : ''}{improvement}%
          </p>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={scoreData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              domain={[0, 100]}
              label={{ value: 'Nota (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            {renderLines()}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScoreEvolutionChart;