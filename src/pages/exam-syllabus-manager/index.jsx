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
import { subjectService } from '../../services/subjectService';
import { useAuth } from '../../contexts/AuthContext';

const ExamSyllabusManager = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('accordion'); // 'accordion' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState(''); // <-- 1. ADICIONAR ESTE NOVO ESTADO
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isErrorNotebookOpen, setIsErrorNotebookOpen] = useState(false);
  
  // Supabase integration - replace mock data
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load subjects on component mount
  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await subjectService?.getSubjects();
      
      if (result?.error) {
        setError(result?.error);
        setSubjects([]); // Clear subjects on error
      } else {
        setSubjects(result?.data || []);
      }
    } catch (err) {
      setError('Failed to load subjects. Please refresh the page.');
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (newSubjectData) => {
    try {
      // The subject is already created in the modal, just add it to state
      if (newSubjectData) {
        setSubjects(prev => [newSubjectData, ...prev]);
        setIsAddModalOpen(false);
      }
    } catch (err) => {
      console.error('Error adding subject:', err);
      // The error handling is done in the modal
    }
  };

  const handleSubjectUpdate = (updatedSubject) => {
    setSubjects(prev => prev?.map(subject => 
      subject?.id === updatedSubject?.id ? updatedSubject : subject
    ));
  };

  const handleSubjectDelete = async (subjectId) => {
    try {
      const result = await subjectService?.deleteSubject(subjectId);
      if (result?.success) {
        setSubjects(prev => prev?.filter(subject => subject?.id !== subjectId));
      } else {
        alert(result?.error || 'Failed to delete subject');
      }
    } catch (err) {
      alert('Failed to delete subject. Please try again.');
    }
  };

  const handleStatusChange = async (subjectId, topicId, status) => {
    // This would typically update topic status in the database
    // For now, just update local state
    setSubjects(prev => prev?.map(subject => 
      subject?.id === subjectId ? {
        ...subject,
        topics: subject?.topics?.map(topic =>
          topic?.id === topicId ? { ...topic, status } : topic
        )
      } : subject
    ));
  };

  const handleNotesChange = async (subjectId, topicId, notes) => {
    // This would typically update topic notes in the database
    // For now, just update local state
    setSubjects(prev => prev?.map(subject => 
      subject?.id === subjectId ? {
        ...subject,
        topics: subject?.topics?.map(topic =>
          topic?.id === topicId ? { ...topic, notes } : topic
        )
      } : subject
    ));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
                <p className="text-text-secondary">Carregando matérias...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <Icon name="AlertCircle" size={48} className="text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar matérias</h3>
              <p className="text-red-700 mb-6 max-w-md mx-auto">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline"
                  onClick={loadSubjects}
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  Tentar Novamente
                </Button>
                <Button
                  variant="default"
                  onClick={() => setIsAddModalOpen(true)}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Adicionar Matéria
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            {/* --- 2. CORRIGIR AS PROPS AQUI --- */}
            <SearchAndFilters
              searchTerm={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              subjectFilter={subjectFilter}
              onSubjectFilterChange={setSubjectFilter}
              subjects={subjects}
              onClearFilters={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setSubjectFilter(''); // Limpar o novo estado também
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
                  onSubjectUpdate={handleSubjectUpdate}
                  onStatusChange={handleStatusChange}
                  onNotesChange={handleNotesChange}
                />
              ) : (
                <TableView
                  subjects={subjects}
                  searchQuery={searchQuery}
                  statusFilter={statusFilter}
                  selectedItems={selectedSubjects}
                  onItemSelect={setSelectedSubjects}
                  onSubjectUpdate={handleSubjectUpdate}
                  onStatusChange={handleStatusChange}
                  onNotesChange={handleNotesChange}
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
              existingSubjects={subjects}
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
