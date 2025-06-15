document.addEventListener('DOMContentLoaded', () => {
    loadMaterias();

    startBtn.addEventListener('click', () => {
        const file = materiasSelect.value;
        if (file) {
            loadQuiz(file);
        } else {
            alert('Por favor, selecione uma matéria.');
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestions();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < currentQuiz.length - 1) {
            currentQuestionIndex++;
            renderQuestions();
        }
    });
});
