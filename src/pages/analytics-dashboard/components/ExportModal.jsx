import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportModal = ({ isOpen, onClose }) => {
  const [exportOptions, setExportOptions] = useState({
    studyTime: true,
    scores: true,
    mastery: true,
    weakPoints: true,
    summary: true
  });
  
  const [dateRange, setDateRange] = useState('30days');
  const [format, setFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const exportSections = [
    { key: 'studyTime', label: 'Tempo de Estudo', description: 'Gráficos de distribuição semanal' },
    { key: 'scores', label: 'Evolução das Notas', description: 'Progresso ao longo do tempo' },
    { key: 'mastery', label: 'Domínio por Matéria', description: 'Radar de conhecimento' },
    { key: 'weakPoints', label: 'Pontos Fracos', description: 'Tópicos que precisam atenção' },
    { key: 'summary', label: 'Métricas Resumo', description: 'Estatísticas gerais' }
  ];

  const dateRanges = [
    { value: '7days', label: 'Últimos 7 dias' },
    { value: '30days', label: 'Últimos 30 dias' },
    { value: '90days', label: 'Últimos 90 dias' },
    { value: 'all', label: 'Todo o período' }
  ];

  const formats = [
    { value: 'pdf', label: 'PDF', icon: 'FileText' },
    { value: 'excel', label: 'Excel', icon: 'FileSpreadsheet' },
    { value: 'csv', label: 'CSV', icon: 'Database' }
  ];

  const handleOptionChange = (key, checked) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Exporting with options:', {
      sections: exportOptions,
      dateRange,
      format
    });
    
    setIsExporting(false);
    onClose();
  };

  const selectedCount = Object.values(exportOptions)?.filter(Boolean)?.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-elevated max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Exportar Relatório</h2>
            <p className="text-sm text-text-secondary mt-1">
              Gere um relatório personalizado dos seus dados
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-colors duration-150"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Seções para Exportar */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">
              Seções para Exportar ({selectedCount})
            </h3>
            <div className="space-y-3">
              {exportSections?.map((section) => (
                <div key={section?.key} className="flex items-start space-x-3">
                  <Checkbox
                    checked={exportOptions?.[section?.key]}
                    onChange={(e) => handleOptionChange(section?.key, e?.target?.checked)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground cursor-pointer">
                      {section?.label}
                    </label>
                    <p className="text-xs text-text-secondary">{section?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Período */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Período</h3>
            <div className="grid grid-cols-2 gap-2">
              {dateRanges?.map((range) => (
                <button
                  key={range?.value}
                  onClick={() => setDateRange(range?.value)}
                  className={`p-3 text-sm rounded-lg border transition-all duration-150 ${
                    dateRange === range?.value
                      ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50 text-text-secondary'
                  }`}
                >
                  {range?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Formato */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Formato</h3>
            <div className="grid grid-cols-3 gap-2">
              {formats?.map((formatOption) => (
                <button
                  key={formatOption?.value}
                  onClick={() => setFormat(formatOption?.value)}
                  className={`p-3 rounded-lg border transition-all duration-150 ${
                    format === formatOption?.value
                      ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50 text-text-secondary'
                  }`}
                >
                  <Icon name={formatOption?.icon} size={20} className="mx-auto mb-1" />
                  <div className="text-xs">{formatOption?.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="text-sm text-text-secondary">
            {selectedCount} seção{selectedCount !== 1 ? 'ões' : ''} selecionada{selectedCount !== 1 ? 's' : ''}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isExporting}>
              Cancelar
            </Button>
            <Button 
              onClick={handleExport} 
              loading={isExporting}
              disabled={selectedCount === 0}
              iconName="Download"
              iconPosition="left"
            >
              {isExporting ? 'Exportando...' : 'Exportar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;