document.addEventListener('DOMContentLoaded', () => {
    loadMaterias();

    startBtn.addEventListener('click', () => {
        const selectedSubject = subjectSelect.value;
        if (selectedSubject) {
            loadQuiz(selectedSubject);
        } else {
            alert('Por favor, selecione uma matéria antes de iniciar o simulado.');
        }
    });
});
