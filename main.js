document.addEventListener('DOMContentLoaded', () => {
    loadMaterias();  // Carrega as matérias no select ao iniciar a página

    startBtn.addEventListener('click', () => {
        const selectedSubject = subjectSelect.value;
        if (selectedSubject) {
            loadQuiz(selectedSubject);
        } else {
            alert('Por favor, selecione uma matéria antes de iniciar o simulado.');
        }
    });
});
