import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import ViewModeToggle from './components/ViewModeToggle';
import SearchAndFilters from './components/SearchAndFilters';
import AccordionView from './components/AccordionView';
import TableView from './components/TableView';
import BulkActions from './components/BulkActions';
import AddSubjectModal from './components/AddSubjectModal';
import ProgressIndicator from './components/ProgressIndicator';

const ExamSyllabusManager = () => {
  const [viewMode, setViewMode] = useState('accordion');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Reset all progress and error data
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: 'Direito Constitucional',
      topics: [
        {
          id: 101,
          name: 'Princípios Fundamentais da Constituição',
          status: 'not-studied',
          lastStudied: null,
          masteryPercentage: 0,
          notes: ''
        },
        {
          id: 102,
          name: 'Direitos e Garantias Fundamentais',
          status: 'not-studied',
          lastStudied: null,
          masteryPercentage: 0,
          notes: ''
        },
        {
          id: 103,
          name: 'Organização do Estado',
          status: 'not-studied',
          lastStudied: null,
          masteryPercentage: 0,
          notes: ''
        },
        {
          id: 104,
          name: 'Organização dos Poderes',
          status: 'not-studied',
          lastStudied: null,
          masteryPercentage: 0,
          notes: ''
        }
      ]
    },
    {
      id: 2,
      name: 'Direito Administrativo',
      topics: [
        {
          id: 201,
          name: 'Princípios da Administração Pública',
          status: 'not-studied',
          lastStudied: null,
          masteryPercentage: 0,
          notes: ''
        },
        {
          id: 202,
          name: 'Atos Administrativos',
          status: 'not-studied',
          lastStudied: null,
          masteryPercentage: 0,
          notes: ''
        },
        {
          id: 203,
          name: 'Licitações e Contratos',
          status: 'not-studied',
          lastStudied: null,
          masteryPercentage: 0,
          notes: ''
        }
      ]
    },
    {
      id: 3,
      name: 'Matemática',
      topics: [
        {
          id: 301,
          name: 'Regra de Três',
          status: 'not-studied',
          lastStudied: null,
          masteryPercentage: 0,
          notes: ''
        },
        {
          id: 302,
          name: 'Porcentagem',
          status: 'not-studied',
          lastStudied: null,
          masteryPercentage: 0,
          notes: ''
        },
        {
          id: 303,
          name: 'Juros Simples e Compostos',
          status: 'not-studied',
          lastStudied: null,
          masteryPercentage: 0,
          notes: ''
        }
      ]
    },
    {
      id: 4,
      name: 'Português',
      topics: [
        {
          id: 401,
          name: 'Concordância Verbal',
          status: 'not-studied',
          lastStudied: null,
          masteryPercentage: 0,
          notes: ''
        },
        {
          id: 402,
          name: 'Concordância Nominal',
          status: 'not-studied',
          lastStudied: null,
          masteryPercentage: 0,
          notes: ''
        }
      ]
    }
  ]);

  // Filter subjects based on search and filters
  const filteredSubjects = subjects?.map(subject => {
    const filteredTopics = subject?.topics?.filter(topic => {
      const matchesSearch = topic?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           subject?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesStatus = !statusFilter || topic?.status === statusFilter;
      const matchesSubject = !subjectFilter || subject?.id?.toString() === subjectFilter;
      
      return matchesSearch && matchesStatus && matchesSubject;
    });

    return {
      ...subject,
      topics: filteredTopics
    };
  })?.filter(subject => subject?.topics?.length > 0);

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const allTopics = subjects?.flatMap(subject => subject?.topics);
    if (allTopics?.length === 0) return 0;
    
    const totalMastery = allTopics?.reduce((sum, topic) => sum + topic?.masteryPercentage, 0);
    return Math.round(totalMastery / allTopics?.length);
  };

  const handleStatusChange = (topicId, newStatus) => {
    setSubjects(prevSubjects => 
      prevSubjects?.map(subject => ({
        ...subject,
        topics: subject?.topics?.map(topic => 
          topic?.id === topicId 
            ? { 
                ...topic, 
                status: newStatus,
                lastStudied: newStatus !== 'not-studied' ? new Date()?.toISOString()?.split('T')?.[0] : null,
                masteryPercentage: newStatus === 'mastered' ? Math.max(topic?.masteryPercentage, 85) : topic?.masteryPercentage
              }
            : topic
        )
      }))
    );
  };

  const handleNotesChange = (topicId, notes) => {
    setSubjects(prevSubjects => 
      prevSubjects?.map(subject => ({
        ...subject,
        topics: subject?.topics?.map(topic => 
          topic?.id === topicId ? { ...topic, notes } : topic
        )
      }))
    );
  };

  const handleItemSelect = (itemId, isSelected) => {
    const newSelected = new Set(selectedItems);
    if (isSelected) {
      newSelected?.add(itemId);
    } else {
      newSelected?.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkStatusChange = (newStatus) => {
    const topicIds = Array.from(selectedItems)?.filter(item => item?.startsWith('topic-'))?.map(item => parseInt(item?.replace('topic-', '')));

    topicIds?.forEach(topicId => {
      handleStatusChange(topicId, newStatus);
    });

    setSelectedItems(new Set());
  };

  const handleBulkDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir os itens selecionados?')) {
      const topicIds = Array.from(selectedItems)?.filter(item => item?.startsWith('topic-'))?.map(item => parseInt(item?.replace('topic-', '')));

      setSubjects(prevSubjects => 
        prevSubjects?.map(subject => ({
          ...subject,
          topics: subject?.topics?.filter(topic => !topicIds?.includes(topic?.id))
        }))?.filter(subject => subject?.topics?.length > 0)
      );

      setSelectedItems(new Set());
    }
  };

  const handleAddSubject = (subjectData) => {
    const newSubject = {
      id: Math.max(...subjects?.map(s => s?.id)) + 1,
      name: subjectData?.name,
      topics: subjectData?.topics?.map((topicName, index) => ({
        id: Date.now() + index,
        name: topicName,
        status: 'not-studied',
        lastStudied: null,
        masteryPercentage: 0,
        notes: ''
      }))
    };

    setSubjects(prev => [...prev, newSubject]);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setSubjectFilter('');
  };

  const overallProgress = calculateOverallProgress();
  const totalTopics = subjects?.reduce((sum, subject) => sum + subject?.topics?.length, 0);
  const masteredTopics = subjects?.reduce((sum, subject) => 
    sum + subject?.topics?.filter(topic => topic?.status === 'mastered')?.length, 0
  );

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'} pt-16`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Gerenciador de Edital
                </h1>
                <p className="text-text-secondary">
                  Organize e acompanhe seu progresso em todos os tópicos do edital
                </p>
              </div>
              <Button
                variant="default"
                onClick={() => setIsAddModalOpen(true)}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Nova Matéria
              </Button>
            </div>

            {/* Overall Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-text-secondary">
                    Progresso Geral
                  </h3>
                  <span className="text-2xl font-bold text-primary">
                    {overallProgress}%
                  </span>
                </div>
                <ProgressIndicator 
                  percentage={overallProgress} 
                  label="" 
                  size="lg"
                />
              </div>
              
              <div className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">
                      Tópicos Dominados
                    </p>
                    <p className="text-2xl font-bold text-success">
                      {masteredTopics}
                    </p>
                  </div>
                  <div className="text-text-secondary">
                    <span className="text-sm">de {totalTopics}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">
                      Matérias Ativas
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {subjects?.length}
                    </p>
                  </div>
                  <div className="text-text-secondary">
                    <span className="text-sm">cadastradas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <ViewModeToggle 
              viewMode={viewMode} 
              onViewModeChange={setViewMode} 
            />
            <div className="text-sm text-text-secondary">
              {filteredSubjects?.reduce((sum, subject) => sum + subject?.topics?.length, 0)} tópicos encontrados
            </div>
          </div>

          {/* Search and Filters */}
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            subjectFilter={subjectFilter}
            onSubjectFilterChange={setSubjectFilter}
            subjects={subjects}
            onClearFilters={handleClearFilters}
          />

          {/* Bulk Actions */}
          <BulkActions
            selectedCount={selectedItems?.size}
            onBulkStatusChange={handleBulkStatusChange}
            onBulkDelete={handleBulkDelete}
          />

          {/* Content Views */}
          {viewMode === 'accordion' ? (
            <AccordionView
              subjects={filteredSubjects}
              onStatusChange={handleStatusChange}
              onNotesChange={handleNotesChange}
              selectedItems={selectedItems}
              onItemSelect={handleItemSelect}
            />
          ) : (
            <TableView
              subjects={filteredSubjects}
              onStatusChange={handleStatusChange}
              onNotesChange={handleNotesChange}
              selectedItems={selectedItems}
              onItemSelect={handleItemSelect}
            />
          )}

          {/* Empty State */}
          {filteredSubjects?.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-border">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhuma matéria encontrada
                </h3>
                <p className="text-text-secondary mb-6">
                  {subjects?.length === 0 
                    ? 'Comece adicionando sua primeira matéria do edital'
                    : 'Tente ajustar os filtros ou termos de busca'
                  }
                </p>
                {subjects?.length === 0 && (
                  <Button
                    variant="default"
                    onClick={() => setIsAddModalOpen(true)}
                    iconName="Plus"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Adicionar Primeira Matéria
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Add Subject Modal */}
      <AddSubjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSubject={handleAddSubject}
        existingSubjects={subjects}
      />
    </div>
  );
};

export default ExamSyllabusManager;