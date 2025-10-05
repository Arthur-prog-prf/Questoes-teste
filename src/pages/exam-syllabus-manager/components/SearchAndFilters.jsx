import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const SearchAndFilters = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange, 
  subjectFilter, 
  onSubjectFilterChange,
  subjects,
  onClearFilters 
}) => {
  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'not-studied', label: 'Não Estudado' },
    { value: 'studying', label: 'Estudando' },
    { value: 'review', label: 'Revisão' },
    { value: 'mastered', label: 'Dominado' }
  ];

  const subjectOptions = [
    { value: '', label: 'Todas as Matérias' },
    ...subjects?.map(subject => ({
      value: subject?.id,
      label: subject?.name
    }))
  ];

  return (
    <div className="bg-white rounded-lg border border-border p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Input
            type="search"
            placeholder="Buscar tópicos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>
        <div>
          <Select
            placeholder="Filtrar por status"
            options={statusOptions}
            value={statusFilter}
            onChange={onStatusFilterChange}
          />
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Select
              placeholder="Filtrar por matéria"
              options={subjectOptions}
              value={subjectFilter}
              onChange={onSubjectFilterChange}
            />
          </div>
          <Button
            variant="outline"
            size="default"
            onClick={onClearFilters}
            iconName="X"
            iconSize={16}
          >
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;