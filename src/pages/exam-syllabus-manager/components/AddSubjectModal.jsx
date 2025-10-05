import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { subjectService } from '../../../services/subjectService';

const AddSubjectModal = ({ isOpen, onClose, onAddSubject, existingSubjects = [] }) => {
  const [subjectName, setSubjectName] = useState('');
  const [selectedExistingSubject, setSelectedExistingSubject] = useState('');
  const [topics, setTopics] = useState(['']);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract existing subject names and topics
  const existingSubjectNames = existingSubjects?.map(subject => subject?.name) || [];
  const existingTopics = existingSubjects?.flatMap(subject => 
    subject?.topics?.map(topic => topic?.name) || []
  ) || [];

  const handleAddTopic = () => {
    setTopics([...topics, '']);
  };

  const handleRemoveTopic = (index) => {
    if (topics?.length > 1) {
      setTopics(topics?.filter((_, i) => i !== index));
    }
  };

  const handleTopicChange = (index, value) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const handleSelectExistingSubject = (subjectName) => {
    setSelectedExistingSubject(subjectName);
    setSubjectName(subjectName);
    
    // Auto-populate topics for this subject
    const existingSubject = existingSubjects?.find(s => s?.name === subjectName);
    if (existingSubject?.topics) {
      setTopics(existingSubject?.topics?.map(topic => topic?.name));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const newErrors = {};

    if (!subjectName?.trim()) {
      newErrors.subjectName = 'Nome da matéria é obrigatório';
    }

    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const validTopics = topics?.filter(topic => topic?.trim());
      
      // Call the subject service to create the subject
      const result = await subjectService?.createSubject({
        name: subjectName?.trim(),
        topics: validTopics
      });

      if (result?.error) {
        // Show user-friendly error message
        setErrors({ submit: result?.error });
        return;
      }

      // Success - call parent handler
      if (typeof onAddSubject === 'function') {
        onAddSubject(result?.data);
      }

      // Reset form and close modal
      setSubjectName('');
      setSelectedExistingSubject('');
      setTopics(['']);
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ 
        submit: 'Something went wrong while creating the subject. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSubjectName('');
    setSelectedExistingSubject('');
    setTopics(['']);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Adicionar Nova Matéria
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-150"
            disabled={isSubmitting}
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Display submission error */}
          {errors?.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <Icon name="AlertCircle" size={16} className="text-red-600 mr-2" />
                <div>
                  <p className="text-sm text-red-800">{errors?.submit}</p>
                  <button 
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(errors?.submit)}
                    className="text-xs text-red-600 hover:text-red-800 underline mt-1"
                  >
                    Copy error message
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Existing Subjects Section */}
          {existingSubjectNames?.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Matérias Existentes (opcional)
              </label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {existingSubjectNames?.map((name, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectExistingSubject(name)}
                    disabled={isSubmitting}
                    className={`p-3 text-left border rounded-lg transition-all duration-150 ${
                      selectedExistingSubject === name
                        ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50 hover:bg-muted/50'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-sm font-medium">{name}</span>
                  </button>
                ))}
              </div>
              <div className="text-xs text-text-secondary bg-blue-50 p-3 rounded-lg">
                <Icon name="Info" size={14} className="inline text-blue-600 mr-2" />
                Clique em uma matéria existente para pré-carregar seus tópicos, ou digite uma nova matéria abaixo.
              </div>
            </div>
          )}

          <div>
            <Input
              label="Nome da Matéria *"
              type="text"
              placeholder="Ex: Direito Constitucional"
              value={subjectName}
              onChange={(e) => {
                setSubjectName(e?.target?.value);
                setSelectedExistingSubject('');
                // Clear submit error when user starts typing
                if (errors?.submit) {
                  setErrors(prev => ({ ...prev, submit: null }));
                }
              }}
              error={errors?.subjectName}
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-foreground">
                Tópicos (opcional)
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTopic}
                iconName="Plus"
                iconPosition="left"
                iconSize={14}
                disabled={isSubmitting}
              >
                Adicionar Tópico
              </Button>
            </div>
            
            {/* Existing Topics Suggestions */}
            {existingTopics?.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-text-secondary mb-2">Tópicos existentes:</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(existingTopics))?.slice(0, 10)?.map((topic, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        const emptyIndex = topics?.findIndex(t => !t?.trim());
                        if (emptyIndex !== -1) {
                          handleTopicChange(emptyIndex, topic);
                        } else {
                          setTopics([...topics, topic]);
                        }
                      }}
                      disabled={isSubmitting}
                      className="px-2 py-1 text-xs bg-muted hover:bg-primary/10 hover:text-primary rounded-full border border-border transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      + {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {topics?.map((topic, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder={`Tópico ${index + 1}`}
                      value={topic}
                      onChange={(e) => handleTopicChange(index, e?.target?.value)}
                      list={`topics-list-${index}`}
                      disabled={isSubmitting}
                    />
                    <datalist id={`topics-list-${index}`}>
                      {existingTopics?.filter(t => 
                        t?.toLowerCase()?.includes(topic?.toLowerCase()) && t !== topic
                      )?.slice(0, 5)?.map((suggestion, idx) => (
                        <option key={idx} value={suggestion} />
                      ))}
                    </datalist>
                  </div>
                  {topics?.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveTopic(index)}
                      iconName="Trash2"
                      iconSize={14}
                      disabled={isSubmitting}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName={isSubmitting ? "Loader2" : "Plus"}
              iconPosition="left"
              iconSize={16}
              disabled={isSubmitting || !subjectName?.trim()}
              className={isSubmitting ? "animate-spin" : ""}
            >
              {isSubmitting ? 'Criando...' : 'Adicionar Matéria'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectModal;
