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
    description: '',
    customStartTime: '00:00',
    customEndTime: '01:00',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    if (initialData) {
      const startTime = initialData.timeSlot;
      const endTime = `${String(initialData.selectedHour + 1).padStart(2, '0')}:00`;

      setFormData(prev => ({
        ...prev,
        subject: '',
        topic: '',
        description: '',
        taskDate: initialData.date?.toISOString().split('T')[0],
        customStartTime: startTime,
        customEndTime: endTime,
      }));
    }
  }, [initialData]);

  // Calcula a duração sempre que os horários mudam
  useEffect(() => {
    const startMinutes = parseTimeToMinutes(formData.customStartTime);
    const endMinutes = parseTimeToMinutes(formData.customEndTime);
    if (endMinutes > startMinutes) {
      const calculatedDuration = (endMinutes - startMinutes) / 60;
      setDuration(calculatedDuration);
      setError(''); // Limpa o erro de tempo se for corrigido
    } else {
      setError('O horário de término deve ser após o horário de início.');
    }
  }, [formData.customStartTime, formData.customEndTime]);


  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.subject) {
      setError('Por favor, selecione uma matéria.');
      return;
    }
    if (duration <= 0) {
      setError('A duração da tarefa deve ser positiva.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const taskPayload = {
        ...formData,
        duration: duration,
    };

    const result = await taskService.createTask(taskPayload, user.id);
    
    if (result.error) {
      setError(result.error);
    } else {
      onTaskCreated(result.data);
      onClose();
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;
  
  const isTimeInvalid = duration <= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Adicionar Tarefa</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><Icon name="X" /></Button>
        </div>
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && <p className="text-red-500 text-sm p-3 bg-red-50 rounded-md">{error}</p>}
          <div>
            <label className="block text-sm font-medium mb-1">Matéria *</label>
            <select name="subject" value={formData.subject} onChange={handleChange} className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary">
              <option value="">Selecione...</option>
              {availableSubjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tópico (opcional)</label>
            <input type="text" name="topic" value={formData.topic} onChange={handleChange} className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Início *</label>
                <input 
                    type="time" 
                    name="customStartTime" 
                    value={formData.customStartTime} 
                    onChange={handleChange}
                    min={initialData.minStartTime}
                    max={initialData.maxStartTime}
                    className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Fim *</label>
                <input 
                    type="time" 
                    name="customEndTime" 
                    value={formData.customEndTime} 
                    onChange={handleChange}
                    min={formData.customStartTime}
                    className="w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-primary"
                />
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-sm text-blue-800">
                Duração da Tarefa: <span className="font-bold">{duration.toFixed(2)} horas</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border border-border rounded-md h-20 focus:ring-2 focus:ring-primary"></textarea>
          </div>
          <div className="text-xs text-gray-500">
            Agendado para: {new Date(initialData.date).toLocaleDateString('pt-BR')}
          </div>
        </div>
        <div className="flex justify-end p-4 border-t space-x-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting || !formData.subject || isTimeInvalid}>
            {isSubmitting ? 'Criando...' : 'Criar Tarefa'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCreationModal;
