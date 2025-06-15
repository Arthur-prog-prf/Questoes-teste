const materiasSelect = document.getElementById('materias');
const startBtn = document.getElementById('start-btn');
const quizArea = document.getElementById('quiz-area');
const questionsArea = document.getElementById('questions-area');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const decreaseFontBtn = document.getElementById('decrease-font');
const increaseFontBtn = document.getElementById('increase-font');
const exportPdfBtn = document.getElementById('export-pdf');
const themeToggleBtn = document.getElementById('theme-toggle');
const goToQuestionInput = document.getElementById('go-to-question');

// Cria elemento de mensagem de erro dinamicamente
const goToQuestionError = document.createElement('div');
goToQuestionError.className = 'error-message';
goToQuestionInput.parentNode.insertBefore(goToQuestionError, goToQuestionInput.nextSibling);
