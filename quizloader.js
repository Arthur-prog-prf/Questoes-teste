// quizLoader.js
// Responsável por carregar o quiz da matéria escolhida

let currentQuiz = [];
let currentQuestionIndex = 0;

startBtn.addEventListener('click', () => {
    const selectedMateria = materiasSelect.value;
    if (!selectedMateria) {
        alert('Por favor, selecione uma matéria.');
        return;
    }

    const quizFile = materias[selectedMateria];
    loadQuiz(quizFile);
});

function loadQuiz(quizFile) {
    fetch(quizFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o quiz');
            }
            return response.text();
        })
        .then(text => parseQuizFile(text))
        .catch(error => {
            console.error(error);
            alert('Erro ao carregar o quiz. Verifique o console para detalhes.');
        });
}

function parseQuizFile(fileContent) {
    currentQuiz = [];
    currentQuestionIndex = 0;

    const questions = fileContent.split('---');
    questions.forEach((questionText, index) => {
        const lines = questionText.trim().split('\n');
        if (lines.length >= 3) {
            const number = index + 1;
            const text = lines[0].replace(/^\d+\.\s*/, '');
            const options = [];
            let explanation = '';
            let correctOption = '';

            lines.slice(1).forEach(line => {
                if (line.startsWith('*')) {
                    correctOption = line.substring(1, 2).toLowerCase();
                    options.push({
                        letter: correctOption,
                        text: line.substring(2).trim(),
                        correct: true
                    });
                } else if (line.startsWith('#')) {
                    explanation = line.substring(1).trim();
                } else {
                    const letter = line.substring(0, 1).toLowerCase();
                    options.push({
                        letter: letter,
                        text: line.substring(1).trim(),
                        correct: false
                    });
                }
            });

            currentQuiz.push({
                number,
                text,
                options,
                explanation
            });
        }
    });

    // ✅ Corrigido: Chamando a função correta
    showQuiz();
}
