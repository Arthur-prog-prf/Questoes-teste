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

    // Novo código para o botão "Ir para questão"
    const gotoBtn = document.getElementById('goto-btn');
    const gotoInput = document.getElementById('goto-input');

    gotoBtn.addEventListener('click', () => {
        const target = parseInt(gotoInput.value, 10);
        if (!isNaN(target) && target >= 1 && target <= currentQuiz.length) {
            currentQuestionIndex = target - 1;
            renderQuestions();
        } else {
            alert(`Digite um número entre 1 e ${currentQuiz.length}`);
        }
    });

    // Permitir ENTER dentro do input
    gotoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            gotoBtn.click();
        }
    });
});
