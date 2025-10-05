import React from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedCount, onBulkStatusChange, onBulkDelete }) => {
  const statusOptions = [
    { value: 'not-studied', label: 'Não Estudado' },
    { value: 'studying', label: 'Estudando' },
    { value: 'review', label: 'Revisão' },
    { value: 'mastered', label: 'Dominado' }
  ];

  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-foreground">
            {selectedCount} {selectedCount === 1 ? 'item selecionado' : 'itens selecionados'}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Alterar status para:</span>
            <div className="w-40">
              <Select
                placeholder="Selecionar status"
                options={statusOptions}
                onChange={onBulkStatusChange}
              />
            </div>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          iconName="Trash2"
          iconPosition="left"
          iconSize={14}
        >
          Excluir Selecionados
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;