
// quizLoader.js
// Este arquivo carrega o arquivo de questões da matéria escolhida
// e faz o parsing para o formato que o quiz entende.

async function loadQuiz(file) {
    try {
        const response = await fetch(`materias/${file}`);
        if (!response.ok) throw new Error('Arquivo não encontrado');
        const text = await response.text();
        parseQuizFile(text);
    } catch (error) {
        console.error('Erro ao carregar quiz:', error);
        alert('Erro ao carregar o quiz. Verifique o console para detalhes.');
    }
}

function parseQuizFile(text) {
    const lines = text.split('\n');
    currentQuiz = [];
    userAnswers = [];

    const gabarito = {};
    const fundamentacao = {};
    let currentQuestion = null;
    let mode = 'questoes';
    let lastFundKey = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        if (/^Gabarito:/i.test(line)) {
            mode = 'gabarito';
            continue;
        }

        if (/^Fundamentação:/i.test(line)) {
            mode = 'fundamentacao';
            continue;
        }

        if (mode === 'questoes') {
            const qMatch = line.match(/^Questão\s+(\d+)\s*-\s*(.+)/i);
            const optMatch = line.match(/^([a-d])\)\s+(.+)/i);
            if (qMatch) {
                if (currentQuestion) currentQuiz.push(currentQuestion);
                currentQuestion = {
                    number: qMatch[1],
                    text: qMatch[2].trim(),
                    options: []
                };
                userAnswers.push(null);
            } else if (optMatch && currentQuestion) {
                currentQuestion.options.push({
                    letter: optMatch[1].toLowerCase(),
                    text: optMatch[2].trim(),
                    correct: false
                });
            }
        }

        if (mode === 'gabarito') {
            const match = line.match(/^(\d+)\s*-\s*([a-d])/i);
            if (match) {
                gabarito[match[1]] = match[2].toLowerCase();
            }
        }

        if (mode === 'fundamentacao') {
            const keyMatch = line.match(/^(\d+)\s*-\s*([a-d])\)/i);
            if (keyMatch) {
                lastFundKey = `${keyMatch[1]}-${keyMatch[2].toLowerCase()}`;
                fundamentacao[lastFundKey] = '';
            } else if (lastFundKey) {
                fundamentacao[lastFundKey] += (fundamentacao[lastFundKey] ? '\n' : '') + line;
            }
        }
    }

    if (currentQuestion) currentQuiz.push(currentQuestion);

    currentQuiz.forEach(question => {
        const correctLetter = gabarito[question.number];
        question.options.forEach(opt => {
            opt.correct = opt.letter === correctLetter;
        });
        const fundKey = `${question.number}-${correctLetter}`;
        question.explanation = fundamentacao[fundKey] || 'Fundamentação não disponível.';
    });

    startQuiz();
}
