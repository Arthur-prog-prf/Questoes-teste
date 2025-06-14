function parseTxtData(txt) {
    const lines = txt.split('\n');
    const questions = [];
    let currentQuestion = null;

    lines.forEach(line => {
        line = line.trim();

        if (line.startsWith('Pergunta:')) {
            if (currentQuestion) {
                questions.push(currentQuestion);
            }
            currentQuestion = {
                pergunta: line.replace('Pergunta:', '').trim(),
                opcoes: [],
                correta: null,
                fundamentacao: ''
            };
        } else if (/^[A-D]\)/.test(line)) {
            if (currentQuestion) {
                currentQuestion.opcoes.push(line.substring(3).trim());
            }
        } else if (line.startsWith('Correta:')) {
            if (currentQuestion) {
                const index = parseInt(line.replace('Correta:', '').trim(), 10);
                currentQuestion.correta = index;
            }
        } else if (line.startsWith('Fundamentacao:')) {
            if (currentQuestion) {
                currentQuestion.fundamentacao = line.replace('Fundamentacao:', '').trim();
            }
        }
    });

    // Adiciona a última pergunta
    if (currentQuestion) {
        questions.push(currentQuestion);
    }

    return questions;
}

function loadQuiz(subjectFile) {
    fetch(`materia/${subjectFile}`)
        .then(response => response.text())
        .then(data => {
            questionsData = parseTxtData(data);
            totalQuestions = questionsData.length;
            currentQuestion = 0;

            totalQuestionsSpan.textContent = totalQuestions;
            currentQuestionSpan.textContent = currentQuestion + 1;

            displayQuestion();
            quizArea.classList.remove('hidden');
        })
        .catch(error => {
            console.error('Erro ao carregar o quiz:', error);
            alert('Erro ao carregar o quiz. Verifique o arquivo da matéria.');
        });
}
