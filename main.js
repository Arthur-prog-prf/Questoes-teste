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

    // ===== Ir para questão (botão vira input) =====

    const gotoToggle = document.getElementById('goto-toggle');
    const gotoInput = document.getElementById('goto-input');

    gotoToggle.addEventListener('click', () => {
        gotoToggle.style.display = 'none';
        gotoInput.classList.add('visible');
        gotoInput.focus();
    });

    gotoInput.addEventListener('blur', () => {
        gotoInput.classList.remove('visible');
        gotoToggle.style.display = 'inline-block';
    });

    gotoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const value = parseInt(gotoInput.value, 10);
            if (!isNaN(value) && value >= 1 && value <= currentQuiz.length) {
                currentQuestionIndex = value - 1;
                renderQuestions();
            } else {
                alert(`Digite um número entre 1 e ${currentQuiz.length}`);
            }

            // Oculta o input e volta o botão
            gotoInput.blur();
        }
    });
});
