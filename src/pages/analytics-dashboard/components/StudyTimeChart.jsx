import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const StudyTimeChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  const studyData = [
    { day: 'Seg', hours: 4.5, sessions: 3, date: '30/09' },
    { day: 'Ter', hours: 3.2, sessions: 2, date: '01/10' },
    { day: 'Qua', hours: 5.8, sessions: 4, date: '02/10' },
    { day: 'Qui', hours: 2.1, sessions: 1, date: '03/10' },
    { day: 'Sex', hours: 6.3, sessions: 5, date: '04/10' },
    { day: 'Sáb', hours: 7.2, sessions: 4, date: '05/10' },
    { day: 'Dom', hours: 3.9, sessions: 2, date: '06/10' }
  ];

  const periodOptions = [
    { value: '7days', label: '7 Dias' },
    { value: '30days', label: '30 Dias' },
    { value: '90days', label: '90 Dias' }
  ];

  const totalHours = studyData?.reduce((sum, day) => sum + day?.hours, 0);
  const avgHours = totalHours / studyData?.length;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-elevated border border-border">
          <p className="font-medium text-foreground">{`${label} (${data?.date})`}</p>
          <p className="text-primary">{`Horas: ${data?.hours}h`}</p>
          <p className="text-text-secondary text-sm">{`${data?.sessions} sessões`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Tempo de Estudo</h3>
            <p className="text-sm text-text-secondary">Distribuição semanal</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {periodOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setSelectedPeriod(option?.value)}
              className={`px-3 py-1.5 text-sm rounded-md transition-all duration-150 ${
                selectedPeriod === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:bg-muted hover:text-foreground'
              }`}
            >
              {option?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Clock" size={16} color="var(--color-primary)" />
            <span className="text-sm font-medium text-text-secondary">Total</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalHours?.toFixed(1)}h</p>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="TrendingUp" size={16} color="var(--color-success)" />
            <span className="text-sm font-medium text-text-secondary">Média Diária</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{avgHours?.toFixed(1)}h</p>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={studyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="day" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              label={{ value: 'Horas', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="hours" 
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StudyTimeChart;