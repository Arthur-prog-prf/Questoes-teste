// quizUI.js
// Responsável por exibir as perguntas e gerenciar a navegação

let currentQuestionIndex = 0;
let currentQuiz = [];
let userAnswers = [];

function startQuiz() {
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.length).fill(null);
    quizArea.classList.remove('hidden');
    totalQuestionsSpan.textContent = currentQuiz.length;
    renderQuestions();
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
    
    // Atualiza o placeholder do input desktop
    if (questionInput) {
        questionInput.placeholder = `1-${currentQuiz.length}`;
        questionInput.max = currentQuiz.length;
    }
}

function updateProgress() {
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
}

/* ================================
   Suporte a Swipe (arrastar lateralmente)
================================== */
let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
    const swipeDistance = touchEndX - touchStartX;
    const swipeThreshold = 100;

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

/* ================================
   Funções auxiliares para navegação mobile
================================== */
function goToQuestionMobile() {
    const questionNumber = prompt(`Ir para questão (1-${currentQuiz.length}):`);
    if (questionNumber) {
        const num = parseInt(questionNumber);
        if (!isNaN(num) && num >= 1 && num <= currentQuiz.length) {
            currentQuestionIndex = num - 1;
            renderQuestions();
        } else {
            alert(`Por favor, digite um número entre 1 e ${currentQuiz.length}`);
        }
    }
}

// Inicializa o evento do botão mobile
if (goToQuestionBtn) {
    goToQuestionBtn.addEventListener('click', goToQuestionMobile);
}
