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
