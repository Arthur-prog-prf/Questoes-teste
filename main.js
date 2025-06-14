// main.js
// Este é o arquivo que conecta tudo. Aqui ficam os listeners de clique.

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

    // Novo event listener para o botão "Ir"
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
    
    // Adiciona suporte para pressionar Enter no input
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            goBtn.click();
        }
    });
});
