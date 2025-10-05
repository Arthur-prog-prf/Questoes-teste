import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';


const AnalyticsDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  // Mock data - In real app, this would come from Supabase
  const [analyticsData, setAnalyticsData] = useState({
    studyTime: {
      total: 0,
      average: 0,
      trend: 'up'
    },
    performance: {
      score: 0,
      accuracy: 0,
      improvement: 0
    },
    subjects: []
  });

  useEffect(() => {
    // Initialize with empty/default data
    const mockData = {
      studyTime: {
        total: 0,
        average: 0,
        trend: 'neutral'
      },
      performance: {
        score: 0,
        accuracy: 0,
        improvement: 0
      },
      subjects: []
    };
    
    setAnalyticsData(mockData);
  }, [selectedPeriod, selectedSubject]);

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create and download a simple CSV with headers only (no data)
    const csvContent = 'Data,Materia,Tempo_Estudo,Desempenho,Observacoes\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  const periodOptions = [
    { value: '7', label: 'Últimos 7 dias' },
    { value: '30', label: 'Últimos 30 dias' },
    { value: '90', label: 'Últimos 3 meses' },
    { value: '365', label: 'Último ano' }
  ];

  const subjectOptions = [
    { value: 'all', label: 'Todas as matérias' },
    { value: 'matematica', label: 'Matemática' },
    { value: 'portugues', label: 'Português' },
    { value: 'direito', label: 'Direito' },
    { value: 'informatica', label: 'Informática' }
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard Analytics
              </h1>
              <p className="text-text-secondary">
                Análise detalhada do seu desempenho e evolução nos estudos
              </p>
            </div>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              iconName="Download"
              iconPosition="left"
              variant="outline"
            >
              {isExporting ? 'Exportando...' : 'Exportar Dados'}
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Período de análise
                </label>
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                  options={periodOptions}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Matéria
                </label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                  options={subjectOptions}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  variant="default" 
                  className="w-full"
                  iconName="Search"
                  iconPosition="left"
                >
                  Atualizar Análise
                </Button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-lg border border-border">
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhum dado encontrado
              </h3>
              <p className="text-text-secondary max-w-md mb-6">
                Comece a estudar e registrar suas atividades para ver estatísticas detalhadas 
                sobre seu progresso e desempenho.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="default"
                  iconName="BookOpen"
                  iconPosition="left"
                  onClick={() => window.location.href = '/study-planner'}
                >
                  Iniciar Estudo
                </Button>
                <Button 
                  variant="outline"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => window.location.href = '/exam-syllabus-manager'}
                >
                  Cadastrar Matérias
                </Button>
              </div>
            </div>
          </div>

          {/* Info Cards - Empty State */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-text-secondary">
                  Tempo Total de Estudo
                </h3>
                <span className="text-xs px-2 py-1 bg-muted rounded text-text-secondary">
                  {periodOptions?.find(p => p?.value === selectedPeriod)?.label}
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-foreground">0</span>
                <span className="text-sm text-text-secondary ml-1">horas</span>
              </div>
              <p className="text-sm text-text-secondary mt-2">
                Comece a estudar para ver suas estatísticas
              </p>
            </div>

            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-text-secondary">
                  Desempenho Médio
                </h3>
                <span className="text-xs px-2 py-1 bg-muted rounded text-text-secondary">
                  Últimas avaliações
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-foreground">--</span>
                <span className="text-sm text-text-secondary ml-1">pontos</span>
              </div>
              <p className="text-sm text-text-secondary mt-2">
                Dados aparecerão após primeiros estudos
              </p>
            </div>

            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-text-secondary">
                  Taxa de Acerto
                </h3>
                <span className="text-xs px-2 py-1 bg-muted rounded text-text-secondary">
                  Exercícios resolvidos
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-foreground">--</span>
                <span className="text-sm text-text-secondary ml-1">%</span>
              </div>
              <p className="text-sm text-text-secondary mt-2">
                Complete exercícios para ver sua evolução
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;