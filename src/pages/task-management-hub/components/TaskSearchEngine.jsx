import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskSearchEngine = ({ 
  searchQuery, 
  onSearchChange, 
  filterCriteria, 
  onFilterChange,
  taskCount = 0
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const subjects = {
    'all': 'Todas as Matérias',
    'matematica': 'Matemática',
    'portugues': 'Português',
    'direito': 'Direito',
    'informatica': 'Informática',
    'atualidades': 'Atualidades'
  };

  const priorities = {
    'all': 'Todas as Prioridades',
    'urgente': 'Urgente',
    'alta': 'Alta',
    'media': 'Média',
    'baixa': 'Baixa'
  };

  const statuses = {
    'all': 'Todos os Status',
    'todo': 'Pendente',
    'in_progress': 'Em Progresso',
    'completed': 'Concluída',
    'paused': 'Pausada'
  };

  const durations = {
    'all': 'Qualquer Duração',
    'short': 'Curta (< 1h)',
    'medium': 'Média (1-2h)',
    'long': 'Longa (> 2h)'
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filterCriteria,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      subject: 'all',
      priority: 'all',
      status: 'all',
      duration: 'all'
    });
    onSearchChange('');
  };

  const hasActiveFilters = () => {
    return searchQuery || 
           filterCriteria?.subject !== 'all' || 
           filterCriteria?.priority !== 'all' || 
           filterCriteria?.status !== 'all' || 
           filterCriteria?.duration !== 'all';
  };

  return (
    <div className="bg-white rounded-lg shadow-subtle border border-border p-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="relative flex-1 w-full">
          <Icon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
          />
          <input
            type="text"
            placeholder="Buscar tarefas por título, tópico ou descrição..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-foreground"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            iconName="Filter"
            iconPosition="left"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={showAdvancedFilters ? 'bg-primary text-white' : ''}
          >
            Filtros
          </Button>

          {hasActiveFilters() && (
            <Button
              variant="ghost"
              iconName="X"
              iconPosition="left"
              onClick={clearFilters}
              className="text-text-secondary"
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <select
          value={filterCriteria?.subject}
          onChange={(e) => handleFilterChange('subject', e?.target?.value)}
          className="px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {Object.entries(subjects)?.map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <select
          value={filterCriteria?.priority}
          onChange={(e) => handleFilterChange('priority', e?.target?.value)}
          className="px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {Object.entries(priorities)?.map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <select
          value={filterCriteria?.status}
          onChange={(e) => handleFilterChange('status', e?.target?.value)}
          className="px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {Object.entries(statuses)?.map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <select
          value={filterCriteria?.duration}
          onChange={(e) => handleFilterChange('duration', e?.target?.value)}
          className="px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {Object.entries(durations)?.map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-medium text-foreground mb-4">Filtros Avançados</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Data de Criação
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="De"
                />
                <input
                  type="date"
                  className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Até"
                />
              </div>
            </div>

            {/* Due Date Range */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Prazo de Entrega
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="De"
                />
                <input
                  type="date"
                  className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Até"
                />
              </div>
            </div>

            {/* Progress Range */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Progresso (%)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Mín"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Máx"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Tags
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="exercicios, revisao..."
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Nível de Dificuldade
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                <option value="">Qualquer</option>
                <option value="1">1 - Muito Fácil</option>
                <option value="2">2 - Fácil</option>
                <option value="3">3 - Médio</option>
                <option value="4">4 - Difícil</option>
                <option value="5">5 - Muito Difícil</option>
              </select>
            </div>

            {/* Overdue Filter */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Status de Prazo
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                <option value="">Todos</option>
                <option value="overdue">Atrasadas</option>
                <option value="due_today">Vencem Hoje</option>
                <option value="due_week">Vencem Esta Semana</option>
                <option value="no_due">Sem Prazo</option>
              </select>
            </div>
          </div>

          {/* Apply/Reset Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={() => {
                // Apply advanced filters logic here
                setShowAdvancedFilters(false);
              }}
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-sm text-text-secondary">
          {taskCount} tarefa(s) encontrada(s)
          {hasActiveFilters() && (
            <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              Filtros ativos
            </span>
          )}
        </div>

        {/* Search Suggestions */}
        {searchQuery && taskCount === 0 && (
          <div className="text-sm text-text-secondary">
            <Icon name="Search" size={14} className="inline mr-1" />
            Nenhum resultado para "{searchQuery}"
          </div>
        )}
      </div>

      {/* Quick Search Suggestions */}
      {!searchQuery && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-sm text-text-secondary mb-2">Sugestões de busca:</div>
          <div className="flex flex-wrap gap-2">
            {[
              'matemática exercícios',
              'português gramática', 
              'direito constitucional',
              'algoritmos programação',
              'atualidades política'
            ]?.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSearchChange(suggestion)}
                className="px-3 py-1 bg-muted text-text-secondary text-xs rounded-full hover:bg-muted/80 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSearchEngine;