
// materias.js
// Este arquivo cuida de carregar a lista de matérias no select.

async function loadMaterias() {
    try {
        const response = await fetch('materias/materias.json');
        if (!response.ok) throw new Error('Erro ao carregar materias.json');
        const materias = await response.json();

        const defaultOption = document.createElement('option');
        defaultOption.textContent = '-- Selecione --';
        defaultOption.value = '';
        materiasSelect.appendChild(defaultOption);

        materias.forEach(materia => {
            const option = document.createElement('option');
            option.value = materia.arquivo;
            option.textContent = materia.nome;
            materiasSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar lista de matérias:', error);
        alert('Erro ao carregar lista de matérias.');
    }
}
