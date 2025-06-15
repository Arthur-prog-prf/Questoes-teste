import { domElements } from './domElements.js';

document.addEventListener('DOMContentLoaded', () => {
    loadMaterias();

    domElements.startBtn.addEventListener('click', () => {
        const file = domElements.materiasSelect.value;
        if (file) {
            loadQuiz(file);
        } else {
            alert('Por favor, selecione uma matéria.');
        }
    });

    domElements.prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestions();
        }
    });

    domElements.nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < currentQuiz.length - 1) {
            currentQuestionIndex++;
            renderQuestions();
        }
    });
});
