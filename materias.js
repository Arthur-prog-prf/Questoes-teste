function loadMaterias() {
    try {
        subjectSelect.innerHTML = '';
        materiasData.forEach(materia => {
            const option = document.createElement('option');
            option.value = materia.arquivo;
            option.textContent = materia.nome;
            subjectSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar lista de matérias:', error);
        alert('Erro ao carregar lista de matérias.');
    }
}

document.addEventListener('DOMContentLoaded', loadMaterias);
