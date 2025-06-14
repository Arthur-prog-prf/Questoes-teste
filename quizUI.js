function displayQuestion() {
    questionsArea.innerHTML = '';

    const questionObj = questionsData[currentQuestion];
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question-container');

    const questionTitle = document.createElement('div');
    questionTitle.classList.add('question');
    questionTitle.textContent = questionObj.pergunta;
    questionDiv.appendChild(questionTitle);

    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('options');

    questionObj.opcoes.forEach((opcao, index) => {
        const optionButton = document.createElement('div');
        optionButton.classList.add('option');
        optionButton.textContent = opcao;
        optionButton.addEventListener('click', () => selectOption(index, optionButton, questionObj));
        optionsDiv.appendChild(optionButton);
    });

    questionDiv.appendChild(optionsDiv);
    questionsArea.appendChild(questionDiv);

    currentQuestionSpan.textContent = currentQuestion + 1;
}

function selectOption(selectedIndex, button, questionObj) {
    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(option => option.classList.remove('selected'));

    button.classList.add('selected');

    const feedbackDiv = document.createElement('div');

    if (selectedIndex === questionObj.correta) {
        button.classList.add('correct');
        feedbackDiv.textContent = 'Resposta correta!';
        feedbackDiv.classList.add('correct-feedback');
    } else {
        button.classList.add('incorrect');
        feedbackDiv.textContent = `Resposta incorreta! A resposta correta era: ${questionObj.opcoes[questionObj.correta]}`;
        feedbackDiv.classList.add('incorrect-feedback');
    }

    questionsArea.appendChild(feedbackDiv);

    if (questionObj.fundamentacao) {
        const fundamentacaoButton = document.createElement('button');
        fundamentacaoButton.textContent = 'Ver Fundamentação';
        fundamentacaoButton.classList.add('fundamentacao-btn');
        fundamentacaoButton.addEventListener('click', () => toggleFundamentacao(fundamentacaoDiv));

        const fundamentacaoDiv = document.createElement('div');
        fundamentacaoDiv.classList.add('fundamentacao');
        fundamentacaoDiv.innerHTML = questionObj.fundamentacao;

        questionsArea.appendChild(fundamentacaoButton);
        questionsArea.appendChild(fundamentacaoDiv);
    }
}

function toggleFundamentacao(div) {
    div.classList.toggle('show');
}

prevBtn.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        displayQuestion();
    }
});
