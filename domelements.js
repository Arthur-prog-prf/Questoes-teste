// Exporta todas as referências DOM como um módulo
export const domElements = {
    // Elementos do seletor
    materiasSelect: document.getElementById('materias'),
    startBtn: document.getElementById('start-btn'),
    
    // Elementos do quiz
    quizArea: document.getElementById('quiz-area'),
    questionsArea: document.getElementById('questions-area'),
    
    // Navegação
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    goToQuestionInput: document.getElementById('go-to-question'),
    
    // Progresso
    currentQuestionSpan: document.getElementById('current-question'),
    totalQuestionsSpan: document.getElementById('total-questions'),
    
    // Controles
    decreaseFontBtn: document.getElementById('decrease-font'),
    increaseFontBtn: document.getElementById('increase-font'),
    exportPdfBtn: document.getElementById('export-pdf'),
    themeToggleBtn: document.getElementById('theme-toggle')
};
