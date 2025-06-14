function loadQuiz(subjectFile) {
    fetch(`materia/${subjectFile}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar o arquivo ${subjectFile}.json`);
            }
            return response.json();
        })
        .then(data => {
            questionsData = data.perguntas;
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
