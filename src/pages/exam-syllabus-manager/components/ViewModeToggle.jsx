import React from 'react';
import Button from '../../../components/ui/Button';


const ViewModeToggle = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      <Button
        variant={viewMode === 'accordion' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('accordion')}
        iconName="List"
        iconPosition="left"
        iconSize={16}
        className="rounded-md"
      >
        Acordeão
      </Button>
      <Button
        variant={viewMode === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('table')}
        iconName="Table"
        iconPosition="left"
        iconSize={16}
        className="rounded-md"
      >
        Tabela
      </Button>
    </div>
  );
};

export default ViewModeToggle;