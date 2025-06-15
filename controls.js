// controls.js
// Controles extras: fonte, tema, PDF

let fontSize = 16; // Valor inicial padrão

decreaseFontBtn.addEventListener('click', () => {
    if (fontSize > 12) {
        fontSize -= 2;
        document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
    }
});

increaseFontBtn.addEventListener('click', () => {
    if (fontSize < 24) {
        fontSize += 2;
        document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
    }
});

exportPdfBtn.addEventListener('click', exportToPdf);

function exportToPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    doc.text("Lista de Exercícios", 105, y, { align: 'center' });
    y += 10;
    doc.setFontSize(12);

    currentQuiz.forEach((q, i) => {
        const qText = doc.splitTextToSize(`Questão ${q.number} - ${q.text}`, 180);
        doc.text(qText, 15, y); y += qText.length * 7;

        q.options.forEach(opt => {
            const oText = doc.splitTextToSize(`${opt.letter.toUpperCase()}) ${opt.text}`, 170);
            doc.text(oText, 20, y); y += oText.length * 7;
        });

        const correct = q.options.find(o => o.correct)?.letter.toUpperCase();
        doc.text(`Resposta correta: ${correct}`, 15, y); y += 7;

        const fund = doc.splitTextToSize(q.explanation, 180);
        doc.text(fund, 15, y); y += fund.length * 7 + 10;

        if (y > 270 && i < currentQuiz.length - 1) {
            doc.addPage(); y = 20;
        }
    });

    doc.save("lista-de-exercicios.pdf");
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggleBtn.textContent = document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Escuro';
});
