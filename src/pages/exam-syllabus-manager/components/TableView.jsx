import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

import ErrorNotebook from './ErrorNotebook';

const TableView = ({ 
  subjects, 
  onStatusChange, 
  onNotesChange, 
  selectedItems, 
  onItemSelect 
}) => {
  const [sortField, setSortField] = useState('subject');
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedNotes, setExpandedNotes] = useState(new Set());

  const statusOptions = [
    { value: 'not-studied', label: 'Não Estudado' },
    { value: 'studying', label: 'Estudando' },
    { value: 'review', label: 'Revisão' },
    { value: 'mastered', label: 'Dominado' }
  ];

  // Flatten subjects and topics for table display
  const flattenedData = subjects?.reduce((acc, subject) => {
    subject?.topics?.forEach(topic => {
      acc?.push({
        ...topic,
        subjectName: subject?.name,
        subjectId: subject?.id
      });
    });
    return acc;
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...flattenedData]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'lastStudied') {
      aValue = aValue ? new Date(aValue) : new Date(0);
      bValue = bValue ? new Date(bValue) : new Date(0);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

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

  const toggleNoteExpansion = (topicId) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded?.has(topicId)) {
      newExpanded?.delete(topicId);
    } else {
      newExpanded?.add(topicId);
    }
    setExpandedNotes(newExpanded);
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-muted transition-colors duration-150"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <Icon 
            name="ChevronUp" 
            size={12} 
            className={`${sortField === field && sortDirection === 'asc' ? 'text-primary' : 'text-gray-300'}`}
          />
          <Icon 
            name="ChevronDown" 
            size={12} 
            className={`${sortField === field && sortDirection === 'desc' ? 'text-primary' : 'text-gray-300'} -mt-1`}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-lg border border-border shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left">
                <Checkbox
                  checked={selectedItems?.size > 0}
                  indeterminate={selectedItems?.size > 0 && selectedItems?.size < flattenedData?.length}
                  onChange={(e) => {
                    if (e?.target?.checked) {
                      flattenedData?.forEach(topic => {
                        onItemSelect(`topic-${topic?.id}`, true);
                      });
                    } else {
                      selectedItems?.forEach(item => {
                        onItemSelect(item, false);
                      });
                    }
                  }}
                />
              </th>
              <SortableHeader field="subjectName">Matéria</SortableHeader>
              <SortableHeader field="name">Tópico</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <SortableHeader field="lastStudied">Última Revisão</SortableHeader>
              <SortableHeader field="masteryPercentage">Domínio</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {sortedData?.map((topic) => (
              <React.Fragment key={topic?.id}>
                <tr className="hover:bg-muted transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                      checked={selectedItems?.has(`topic-${topic?.id}`)}
                      onChange={(e) => onItemSelect(`topic-${topic?.id}`, e?.target?.checked)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {topic?.subjectName}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground max-w-xs">
                    <div className="truncate" title={topic?.name}>
                      {topic?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-32">
                      <Select
                        options={statusOptions}
                        value={topic?.status}
                        onChange={(value) => onStatusChange(topic?.id, value)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {formatLastStudied(topic?.lastStudied)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-muted rounded-full h-2 mr-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${topic?.masteryPercentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {topic?.masteryPercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleNoteExpansion(topic?.id)}
                      className="text-primary hover:text-primary/80 transition-colors duration-150 flex items-center space-x-1"
                    >
                      <Icon name="BookOpen" size={16} />
                      <span>Notas</span>
                    </button>
                  </td>
                </tr>
                {expandedNotes?.has(topic?.id) && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 bg-muted">
                      <ErrorNotebook
                        topicId={topic?.id}
                        notes={topic?.notes}
                        onNotesChange={onNotesChange}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {sortedData?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum tópico encontrado
          </h3>
          <p className="text-text-secondary">
            Tente ajustar os filtros ou termos de busca
          </p>
        </div>
      )}
    </div>
  );
};

export default TableView;