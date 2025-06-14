// main.js
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

    // Evento para o botão "Ir" (desktop)
    goBtn.addEventListener('click', () => {
        const questionNumber = parseInt(questionInput.value);
        if (questionNumber && questionNumber >= 1 && questionNumber <= currentQuiz.length) {
            currentQuestionIndex = questionNumber - 1;
            renderQuestions();
            questionInput.value = '';
        } else {
            alert(`Por favor, insira um número entre 1 e ${currentQuiz.length}`);
        }
    });

    // Evento para o botão mobile "Ir para questão"
    goToQuestionBtn.addEventListener('click', () => {
        const questionNumber = prompt(`Ir para questão (1-${currentQuiz.length}):`);
        if (questionNumber) {
            const num = parseInt(questionNumber);
            if (num >= 1 && num <= currentQuiz.length) {
                currentQuestionIndex = num - 1;
                renderQuestions();
            } else {
                alert(`Por favor, digite um número entre 1 e ${currentQuiz.length}`);
            }
        }
    });

    // Suporte para pressionar Enter no input (desktop)
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            goBtn.click();
        }
    });
});
