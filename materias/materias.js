
// materias.js
// Agora carrega as matérias direto da variável materiasData (não usa mais fetch)

function loadMaterias() {
    materiasSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.textContent = '-- Selecione --';
    defaultOption.value = '';
    materiasSelect.appendChild(defaultOption);

    materiasData.forEach(materia => {
        const option = document.createElement('option');
        option.value = materia.arquivo;
        option.textContent = materia.nome;
        materiasSelect.appendChild(option);
    });
}
