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
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="sm:col-span-2">
      <Input
        type="search"
        placeholder="Buscar tópicos..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e?.target?.value)}
        className="w-full"
      />
    </div>
    <Select
      placeholder="Filtrar por status"
      options={statusOptions}
      value={statusFilter}
      onChange={onStatusFilterChange}
    />
    <div className="flex items-end space-x-2">
      <Select
        placeholder="Filtrar por matéria"
        options={subjectOptions}
        value={subjectFilter}
        onChange={onSubjectFilterChange}
      />
      <Button
        variant="outline"
        size="icon"
        onClick={onClearFilters}
        iconName="X"
      />
    </div>
  </div>
</div>
  );
};

export default SearchAndFilters;
