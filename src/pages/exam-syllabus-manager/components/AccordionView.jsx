import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import StatusBadge from './StatusBadge';
import ProgressIndicator from './ProgressIndicator';
import ErrorNotebook from './ErrorNotebook';

const AccordionView = ({ 
  subjects, 
  onStatusChange, 
  onNotesChange, 
  selectedItems, 
  onItemSelect 
}) => {
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());

  const toggleSubject = (subjectId) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded?.has(subjectId)) {
      newExpanded?.delete(subjectId);
    } else {
      newExpanded?.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };

  const statusOptions = [
    { value: 'not-studied', label: 'Não Estudado' },
    { value: 'studying', label: 'Estudando' },
    { value: 'review', label: 'Revisão' },
    { value: 'mastered', label: 'Dominado' }
  ];

  const calculateSubjectProgress = (topics) => {
    if (!topics?.length) return 0;
    const masteredCount = topics?.filter(topic => topic?.status === 'mastered')?.length;
    return Math.round((masteredCount / topics?.length) * 100);
  };

  const formatLastStudied = (date) => {
    if (!date) return 'Nunca';
    const now = new Date();
    const studiedDate = new Date(date);
    const diffTime = Math.abs(now - studiedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays} dias atrás`;
    return studiedDate?.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      {subjects?.map((subject) => {
        const isExpanded = expandedSubjects?.has(subject?.id);
        const progress = calculateSubjectProgress(subject?.topics);
        
        return (
          <div key={subject?.id} className="bg-white rounded-lg border border-border shadow-subtle">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted transition-colors duration-150"
              onClick={() => toggleSubject(subject?.id)}
            >
              <div className="flex items-center space-x-4 flex-1">
                <Checkbox
                  checked={selectedItems?.has(`subject-${subject?.id}`)}
                  onChange={(e) => {
                    e?.stopPropagation();
                    onItemSelect(`subject-${subject?.id}`, e?.target?.checked);
                  }}
                  onClick={(e) => e?.stopPropagation()}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {subject?.name}
                    </h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-text-secondary">
                        {subject?.topics?.length} tópicos
                      </span>
                      <Icon 
                        name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
                        size={20} 
                      />
                    </div>
                  </div>
                  <div className="max-w-xs">
                    <ProgressIndicator 
                      percentage={progress} 
                      label="Progresso" 
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            {isExpanded && (
              <div className="border-t border-border">
                <div className="p-4 space-y-4">
                  {subject?.topics?.map((topic) => (
                    <div 
                      key={topic?.id} 
                      className="bg-muted rounded-lg p-4 border border-border"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3 flex-1">
                          <Checkbox
                            checked={selectedItems?.has(`topic-${topic?.id}`)}
                            onChange={(e) => onItemSelect(`topic-${topic?.id}`, e?.target?.checked)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground mb-2">
                              {topic?.name}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-text-secondary mb-1">
                                  Status
                                </label>
                                <Select
                                  options={statusOptions}
                                  value={topic?.status}
                                  onChange={(value) => onStatusChange(topic?.id, value)}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-text-secondary mb-1">
                                  Última Revisão
                                </label>
                                <div className="text-sm text-foreground py-2">
                                  {formatLastStudied(topic?.lastStudied)}
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-text-secondary mb-1">
                                  Domínio
                                </label>
                                <div className="text-sm font-semibold text-primary py-2">
                                  {topic?.masteryPercentage}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={topic?.status} size="sm" />
                      </div>

                      <ErrorNotebook
                        topicId={topic?.id}
                        notes={topic?.notes}
                        onNotesChange={onNotesChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AccordionView;