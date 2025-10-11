import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { taskService } from '../../../services/taskService';
import { useAuth } from '../../../contexts/AuthContext';

const TaskCreationModal = ({ isOpen, onClose, initialData, availableSubjects, onTaskCreated }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    duration: 1,
    priority: 'media',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        taskDate: initialData.date?.toISOString().split('T')[0],
        customStartTime: initialData.timeSlot,
        customEndTime: `${String(initialData.selectedHour + 1).padStart(2, '0')}:00`,
        duration: initialData.duration || 1,
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.subject) {
      setError('Por favor, selecione uma matéria.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const result = await taskService.createTask(formData, user.id);
    
    if (result.error) {
      setError(result.error);
    } else {
      onTaskCreated(result.data);
      onClose();
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Adicionar Tarefa Rápida</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><Icon name="X" /></Button>
        </div>
        <div className="p-4 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-medium mb-1">Matéria *</label>
            <select name="subject" value={formData.subject} onChange={handleChange} className="w-full p-2 border rounded-md">
              <option value="">Selecione...</option>
              {availableSubjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tópico (opcional)</label>
            <input type="text" name="topic" value={formData.topic} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded-md h-20"></textarea>
          </div>
          <div className="text-sm text-gray-500">
            Agendado para: {new Date(initialData.date).toLocaleDateString('pt-BR')} às {initialData.timeSlot}
          </div>
        </div>
        <div className="flex justify-end p-4 border-t space-x-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} loading={isSubmitting}>
            {isSubmitting ? 'Criando...' : 'Criar Tarefa'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCreationModal;
