// quizUI.js

function showQuestion(index) {
    const question = currentQuiz[index];
    questionsArea.innerHTML = '';

    const container = document.createElement('div');
    container.classList.add('question-container');

    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.textContent = `Questão ${question.number} - ${question.text}`;
    container.appendChild(questionElement);

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options');

    question.options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = `${option.letter.toUpperCase()}) ${option.text}`;

        optionElement.addEventListener('click', () => {
            document.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
            optionElement.classList.add('selected');
            question.selected = option.letter;
        });

        optionsContainer.appendChild(optionElement);
    });

    container.appendChild(optionsContainer);

    questionsArea.appendChild(container);

    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === currentQuiz.length - 1 ? 'Finalizar' : 'Próxima';

    currentQuestionSpan.textContent = index + 1;
    totalQuestionsSpan.textContent = currentQuiz.length;

    // ✅ Atualizar o número da questão no header fixo
    const headerQuestion = document.getElementById('questao-atual');
    headerQuestion.textContent = `Questão ${index + 1} de ${currentQuiz.length}`;
}

function showQuiz() {
    quizArea.classList.remove('hidden');
    // ✅ Mostrar Header e Footer Fixos ao iniciar o Quiz
    document.getElementById('fixed-header').classList.remove('hidden');
    document.getElementById('fixed-footer').classList.remove('hidden');

    // ✅ Atualizar nome da matéria no Header
    const materiaSelecionada = materiasSelect.options[materiasSelect.selectedIndex].text;
    document.getElementById('materia-atual').textContent = materiaSelecionada;

    showQuestion(currentQuestionIndex);
}

prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentQuestionIndex < currentQuiz.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        alert('Exercício finalizado!');
    }
});

// ✅ Eventos do Footer fixo (navegação pelos botões do rodapé)
document.getElementById('footer-prev-btn').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
});

document.getElementById('footer-next-btn').addEventListener('click', () => {
    if (currentQuestionIndex < currentQuiz.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        alert('Exercício finalizado!');
    }
});

// ✅ Evento para "Ir para Questão" (Exemplo simples com prompt - futuramente pode ser modal)
document.getElementById('footer-jump-btn').addEventListener('click', () => {
    const input = prompt(`Digite o número da questão (1 a ${currentQuiz.length}):`);
    const num = parseInt(input);
    if (!isNaN(num) && num >= 1 && num <= currentQuiz.length) {
        currentQuestionIndex = num - 1;
        showQuestion(currentQuestionIndex);
    } else {
        alert('Número inválido.');
    }
});
