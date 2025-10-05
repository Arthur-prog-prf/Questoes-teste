import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ViewModeToggle from './components/ViewModeToggle';
import SearchAndFilters from './components/SearchAndFilters';
import AccordionView from './components/AccordionView';
import TableView from './components/TableView';
import BulkActions from './components/BulkActions';
import AddSubjectModal from './components/AddSubjectModal';
import ErrorNotebook from './components/ErrorNotebook';

const ExamSyllabusManager = () => {
  const [viewMode, setViewMode] = useState('accordion'); // 'accordion' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isErrorNotebookOpen, setIsErrorNotebookOpen] = useState(false);

  // Mock data - In real app, this would come from Supabase
  const [subjects, setSubjects] = useState([]);

  const handleAddSubject = (newSubject) => {
    const subject = {
      id: `subject-${Date.now()}`,
      name: newSubject?.name,
      topics: newSubject?.topics?.map((topic, index) => ({
        id: `topic-${Date.now()}-${index}`,
        name: topic?.name,
        status: topic?.status || 'not-started',
        progress: topic?.progress || 0,
        notes: topic?.notes || '',
        errors: []
      })),
      progress: 0,
      createdAt: new Date()?.toISOString()
    };
    
    setSubjects(prev => [...prev, subject]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Gerenciamento do Edital
              </h1>
              <p className="text-text-secondary">
                Organize e acompanhe o progresso dos tópicos do seu edital de estudos
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsErrorNotebookOpen(true)}
                iconName="AlertCircle"
                iconPosition="left"
              >
                Caderno de Erros
              </Button>
              
              <Button
                variant="default"
                onClick={() => setIsAddModalOpen(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Nova Matéria
              </Button>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <SearchAndFilters
              searchTerm={searchQuery}
              onSearchChange={setSearchQuery}
              subjectFilter={statusFilter}
              onSubjectFilterChange={setStatusFilter}
              subjects={subjects}
              onClearFilters={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
            />
            
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>

          {/* Bulk Actions */}
          {selectedSubjects?.length > 0 && (
            <div className="mb-6">
              <BulkActions
                selectedCount={selectedSubjects?.length}
                onClearSelection={() => setSelectedSubjects([])}
                onBulkStatusChange={(status) => {
                  // Handle bulk status change
                  console.log('Bulk status change to:', status);
                }}
                onBulkDelete={() => {
                  // Handle bulk delete
                  console.log('Bulk delete subjects:', selectedSubjects);
                }}
              />
            </div>
          )}

          {/* Content */}
          {subjects?.length === 0 ? (
            <div className="bg-white rounded-lg border border-border p-12 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="BookOpen" size={32} color="var(--color-primary)" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhuma matéria cadastrada
              </h3>
              <p className="text-text-secondary max-w-md mx-auto mb-6">
                Comece criando sua primeira matéria e organize todos os tópicos do seu edital de concurso.
              </p>
              <Button
                variant="default"
                onClick={() => setIsAddModalOpen(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Cadastrar Primeira Matéria
              </Button>
            </div>
          ) : (
            <>
              {viewMode === 'accordion' ? (
                <AccordionView
                  subjects={subjects}
                  searchQuery={searchQuery}
                  statusFilter={statusFilter}
                  selectedItems={selectedSubjects}
                  onItemSelect={setSelectedSubjects}
                  onSubjectUpdate={(updatedSubject) => {
                    setSubjects(prev => prev?.map(s => 
                      s?.id === updatedSubject?.id ? updatedSubject : s
                    ));
                  }}
                  onStatusChange={(subjectId, topicId, status) => {
                    setSubjects(prev => prev?.map(subject => 
                      subject?.id === subjectId ? {
                        ...subject,
                        topics: subject?.topics?.map(topic =>
                          topic?.id === topicId ? { ...topic, status } : topic
                        )
                      } : subject
                    ));
                  }}
                  onNotesChange={(subjectId, topicId, notes) => {
                    setSubjects(prev => prev?.map(subject => 
                      subject?.id === subjectId ? {
                        ...subject,
                        topics: subject?.topics?.map(topic =>
                          topic?.id === topicId ? { ...topic, notes } : topic
                        )
                      } : subject
                    ));
                  }}
                />
              ) : (
                <TableView
                  subjects={subjects}
                  searchQuery={searchQuery}
                  statusFilter={statusFilter}
                  selectedItems={selectedSubjects}
                  onItemSelect={setSelectedSubjects}
                  onSubjectUpdate={(updatedSubject) => {
                    setSubjects(prev => prev?.map(s => 
                      s?.id === updatedSubject?.id ? updatedSubject : s
                    ));
                  }}
                  onStatusChange={(subjectId, topicId, status) => {
                    setSubjects(prev => prev?.map(subject => 
                      subject?.id === subjectId ? {
                        ...subject,
                        topics: subject?.topics?.map(topic =>
                          topic?.id === topicId ? { ...topic, status } : topic
                        )
                      } : subject
                    ));
                  }}
                  onNotesChange={(subjectId, topicId, notes) => {
                    setSubjects(prev => prev?.map(subject => 
                      subject?.id === subjectId ? {
                        ...subject,
                        topics: subject?.topics?.map(topic =>
                          topic?.id === topicId ? { ...topic, notes } : topic
                        )
                      } : subject
                    ));
                  }}
                />
              )}
            </>
          )}

          {/* Add Subject Modal */}
          {isAddModalOpen && (
            <AddSubjectModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onAddSubject={handleAddSubject}
            />
          )}

          {/* Error Notebook */}
          {isErrorNotebookOpen && (
            <ErrorNotebook
              isOpen={isErrorNotebookOpen}
              onClose={() => setIsErrorNotebookOpen(false)}
              topicId={null}
              notes=""
              onNotesChange={() => {}}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default ExamSyllabusManager;
