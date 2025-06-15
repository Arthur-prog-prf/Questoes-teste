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
    const maxQuestions = currentQuiz.length;
    
    // Define atributos dinâmicos
    goToInput.min = 1;
    goToInput.max = maxQuestions;
    goToInput.placeholder = `Ir para questão (1-${maxQuestions})`;
    
    // Limpa qualquer valor anterior
    goToInput.value = '';

    goToInput.addEventListener('change', (e) => {
        handleQuestionNavigation(e.target.value);
    });
    
    goToInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleQuestionNavigation(e.target.value);
        }
    });

    goToInput.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            if (value < 1) {
                e.target.value = 1;
            } else if (value > maxQuestions) {
                e.target.value = maxQuestions;
            }
        }
    });
}

function handleQuestionNavigation(inputValue) {
    const questionNum = parseInt(inputValue);
    if (!isNaN(questionNum)) {
        const maxQuestions = currentQuiz.length;
        const clampedValue = Math.min(Math.max(questionNum, 1), maxQuestions);
        currentQuestionIndex = clampedValue - 1;
        renderQuestions();
        document.getElementById('go-to-question').value = '';
    }
}

function renderQuestions() {
    questionsArea.innerHTML = '';
    updateProgress();

    const question = currentQuiz[currentQuestionIndex];
    const isAnswered = userAnswers[currentQuestionIndex] !== null;
    const userOptionIndex = userAnswers[currentQuestionIndex];
    const userOption = userOptionIndex !== null ? question.options[userOptionIndex] : null;

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
}

function updateProgress() {
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    totalQuestionsSpan.textContent = currentQuiz.length;
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
