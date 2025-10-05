import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';

import SummaryMetrics from './components/SummaryMetrics';
import StudyTimeChart from './components/StudyTimeChart';
import ScoreEvolutionChart from './components/ScoreEvolutionChart';
import MasteryRadarChart from './components/MasteryRadarChart';
import WeakPointsSection from './components/WeakPointsSection';
import ExportModal from './components/ExportModal';

const AnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7'); // Default to 7 days
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const periods = [
    { value: '7', label: 'Últimos 7 dias' },
    { value: '30', label: 'Últimos 30 dias' },
    { value: '90', label: 'Últimos 3 meses' },
    { value: '365', label: 'Último ano' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Análise de Desempenho
              </h1>
              <p className="text-text-secondary">
                Acompanhe seu progresso e identifique oportunidades de melhoria
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Period Selector */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e?.target?.value)}
                className="px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {periods?.map((period) => (
                  <option key={period?.value} value={period?.value}>
                    {period?.label}
                  </option>
                ))}
              </select>
              
              {/* Export Button */}
              <Button
                variant="outline"
                onClick={() => setIsExportModalOpen(true)}
                iconName="Download"
                iconPosition="left"
              >
                Exportar Dados
              </Button>
            </div>
          </div>

          {/* Summary Metrics */}
          <div className="mb-8">
            <SummaryMetrics selectedPeriod={selectedPeriod} />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <StudyTimeChart selectedPeriod={selectedPeriod} />
            <ScoreEvolutionChart selectedPeriod={selectedPeriod} />
            <MasteryRadarChart selectedPeriod={selectedPeriod} />
            <WeakPointsSection selectedPeriod={selectedPeriod} />
          </div>

          {/* Export Modal */}
          {isExportModalOpen && (
            <ExportModal
              isOpen={isExportModalOpen}
              onClose={() => setIsExportModalOpen(false)}
              selectedPeriod={selectedPeriod}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
