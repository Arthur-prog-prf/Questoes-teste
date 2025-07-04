let currentQuiz = [];
let userAnswers = [];
let currentQuestionIndex = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    quizArea.classList.remove('hidden');
    document.querySelector('.navigation').classList.remove('hidden');
    totalQuestionsSpan.textContent = currentQuiz.length;
    renderQuestions();
    setupQuestionNavigation();
}

function setupQuestionNavigation() {
    const goToInput = document.getElementById('go-to-question');
    goToInput.max = currentQuiz.length;
    goToInput.min = 1;

    const validateAndNavigate = (value) => {
        const questionNum = parseInt(value);
        const maxQuestions = currentQuiz.length;

        if (!isNaN(questionNum) && questionNum >= 1 && questionNum <= maxQuestions) {
            currentQuestionIndex = questionNum - 1;
            renderQuestions();
            goToInput.classList.remove('error');
            goToInput.value = '';
            goToInput.placeholder = 'Ir para questão';
        } else {
            // Adiciona a classe de erro e altera o placeholder
            goToInput.classList.add('error');
            goToInput.value = '';
            goToInput.placeholder = `Inválido (1 a ${maxQuestions})`;

            // Remove a classe de erro e restaura o placeholder após 2 segundos
            setTimeout(() => {
                goToInput.classList.remove('error');
                goToInput.placeholder = 'Ir para questão';
            }, 2000); // 2000 milissegundos = 2 segundos
        }
    };

    goToInput.addEventListener('change', (e) => {
        validateAndNavigate(e.target.value);
    });

    goToInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            validateAndNavigate(e.target.value);
        }
    });
}

function renderQuestions() {
    questionsArea.innerHTML = '';
    updateProgress();

    const question = currentQuiz[currentQuestionIndex];
    const isAnswered = userAnswers[currentQuestionIndex] !== null;
    const userOptionIndex = userAnswers[currentQuestionIndex];
    const userOption = question.options[userOptionIndex];

    const questionElement = document.createElement('div');
    questionElement.className = 'question-container';

    questionElement.innerHTML = `
        <div class="question">Questão ${question.number} - ${question.text}</div>
        <div class="options">
            ${question.options.map((option, index) => `
                <div class="option
                    ${isAnswered && userOptionIndex === index ? 'selected' : ''}
                    ${isAnswered && option.correct ? 'correct' : ''}
                    ${isAnswered && userOptionIndex === index && !option.correct ? 'incorrect' : ''}"
                    data-option-index="${index}">
                    <span class="option-letter">${option.letter.toUpperCase()})</span> ${option.text}
                </div>
            `).join('')}
        </div>
        ${isAnswered ? `
            <div class="feedback ${userOption.correct ? 'correct-feedback' : 'incorrect-feedback'}">
                ${userOption.correct ? '✓ Resposta Correta!' : '✗ Resposta Incorreta!'}
            </div>
            <button class="fundamentacao-btn">ℹ️ Ver Fundamentação</button>
            <div class="fundamentacao">
                ${question.explanation}
            </div>
        ` : ''}
    `;

    questionsArea.appendChild(questionElement);

    if (!isAnswered) {
        const options = questionElement.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                const index = parseInt(option.dataset.optionIndex);
                userAnswers[currentQuestionIndex] = index;
                renderQuestions();
            });
        });
    } else {
        const fundBtn = questionElement.querySelector('.fundamentacao-btn');
        const fundBox = questionElement.querySelector('.fundamentacao');

        fundBtn.addEventListener('click', () => {
            fundBox.classList.toggle('show');
        });
    }

    updateNavigationButtons();
    setupSwipeDetection();
}

function updateNavigationButtons() {
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = currentQuestionIndex >= currentQuiz.length - 1;
    document.getElementById('go-to-question').max = currentQuiz.length;
    document.getElementById('go-to-question').min = 1;
}

function updateProgress() {
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
}

let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
    const swipeDistance = touchEndX - touchStartX;
    const swipeThreshold = 120;

    if (swipeDistance > swipeThreshold && currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestions();
    }

    if (swipeDistance < -swipeThreshold && currentQuestionIndex < currentQuiz.length - 1) {
        currentQuestionIndex++;
        renderQuestions();
    }
}

function setupSwipeDetection() {
    questionsArea.removeEventListener('touchstart', swipeStartHandler);
    questionsArea.removeEventListener('touchend', swipeEndHandler);

    questionsArea.addEventListener('touchstart', swipeStartHandler);
    questionsArea.addEventListener('touchend', swipeEndHandler);
}

function swipeStartHandler(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function swipeEndHandler(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
}
