import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ErrorNotebook = ({ topicId, notes, onNotesChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes || '');

  const handleSave = () => {
    onNotesChange(topicId, localNotes);
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setLocalNotes(notes || '');
    setIsExpanded(false);
  };

  return (
    <div className="mt-3 border-t border-border pt-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left text-sm font-medium text-text-secondary hover:text-foreground transition-colors duration-150"
      >
        <div className="flex items-center space-x-2">
          <Icon name="BookOpen" size={16} />
          <span>Caderno de Erros</span>
          {notes && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
              Com anotações
            </span>
          )}
        </div>
        <Icon 
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
          size={16} 
        />
      </button>
      {isExpanded && (
        <div className="mt-3 space-y-3">
          <textarea
            value={localNotes}
            onChange={(e) => setLocalNotes(e?.target?.value)}
            placeholder="Anote seus erros, dúvidas e pontos importantes sobre este tópico..."
            className="w-full min-h-[120px] p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={5}
          />
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              iconName="Save"
              iconPosition="left"
              iconSize={14}
            >
              Salvar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorNotebook;