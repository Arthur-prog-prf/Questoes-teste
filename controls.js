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
    let y = 20; // Posição Y inicial no PDF

    // Definindo as margens esquerda e direita de forma explícita
    const leftMargin = 25; // Mantendo 25mm para um bom espaço lateral
    const rightMargin = 25; // Mantendo 25mm para um bom espaço lateral

    const indentationForOptions = 10; // Espaço adicional para indentação das opções

    const lineHeight = 7; // Altura aproximada de uma linha para o font-size 12
    const sectionGap = 8; // Espaçamento entre as seções (maiores)
    const smallGap = 4; // Espaçamento menor (dentro de blocos como fundamentação)

    // Ajustamos o pageBreakThreshold para garantir uma margem inferior consistente
    const bottomMargin = 20; // Margem inferior em mm
    const pageBreakThreshold = doc.internal.pageSize.height - bottomMargin;


    // --- Função auxiliar para verificar e adicionar nova página ---
    // Esta função verifica se há espaço suficiente para a próxima linha e adiciona uma nova página se necessário
    function checkPageBreak(currentY) {
        if (currentY + lineHeight > pageBreakThreshold) {
            doc.addPage();
            return leftMargin; // Retorna o Y inicial para a nova página (respeitando a margem superior)
        }
        return currentY;
    }

    // --- Título do Documento ---
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("Lista de Exercícios", doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += sectionGap * 2;
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');

    // Calculando a largura disponível para o conteúdo com base nas margens
    const contentWidth = doc.internal.pageSize.width - leftMargin - rightMargin;
    const indentedContentWidth = contentWidth - indentationForOptions;


    // --- Seção de Questões ---
    currentQuiz.forEach((q, i) => {
        // Espaço antes de cada nova questão
        if (i > 0) { // Não adiciona espaço antes da primeira questão
            y += sectionGap;
            y = checkPageBreak(y); // Verifica se o espaço adicionado não força quebra prematura
        }

        // Desenha o título da questão
        doc.setFont(undefined, 'bold');
        const qTextContent = `Questão ${q.number} - ${q.text}`;
        const qTextLines = doc.splitTextToSize(qTextContent, contentWidth);
        qTextLines.forEach(line => {
            y = checkPageBreak(y); // Verifica quebra de página antes de cada linha da questão
            doc.text(line, leftMargin, y);
            y += lineHeight;
        });
        doc.setFont(undefined, 'normal');

        // Desenha as opções
        q.options.forEach(opt => {
            const oTextContent = `${opt.letter.toUpperCase()}) ${opt.text}`;
            const oTextLines = doc.splitTextToSize(oTextContent, indentedContentWidth);
            oTextLines.forEach(line => {
                y = checkPageBreak(y); // Verifica quebra de página antes de cada linha da opção
                doc.text(line, leftMargin + indentationForOptions, y);
                y += lineHeight;
            });
        });
    });

    // --- Quebra de Página para o Gabarito ---
    // Garante que o gabarito comece em uma nova página
    doc.addPage();
    y = leftMargin; // Reinicia Y na nova página

    // --- Seção de Gabarito ---
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("Gabarito:", leftMargin, y);
    y += sectionGap;
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');

    let gabaritoContent = [];
    currentQuiz.forEach(q => {
        const correct = q.options.find(o => o.correct)?.letter.toUpperCase();
        gabaritoContent.push(`${q.number} - ${correct}`);
    });

    const gabaritoColumns = 4; // Número de colunas para o gabarito
    const colWidth = contentWidth / gabaritoColumns;

    for (let i = 0; i < gabaritoContent.length; i++) {
        const colIndex = i % gabaritoColumns;
        const rowIndex = Math.floor(i / gabaritoColumns);

        // A posição Y é calculada com base na linha atual do gabarito.
        // Se for o início de uma nova linha de gabarito e não couber, adicione página.
        if (colIndex === 0) { // Só verifica a quebra de página no início de uma nova linha de gabarito
             y = checkPageBreak(y);
        }
        const xPos = leftMargin + (colIndex * colWidth);
        const yPos = y + (rowIndex * lineHeight); // Ajusta o Y para o elemento atual dentro da linha de gabarito.
                                                 // No entanto, a verificação de quebra de página já lida com o 'y' global.

        doc.text(gabaritoContent[i], xPos, y); // desenha na linha atual
        if (colIndex === gabaritoColumns - 1 || i === gabaritoContent.length - 1) {
            y += lineHeight; // Avança para a próxima linha somente ao final da coluna ou do gabarito
        }
    }
    y = y + sectionGap; // Adiciona espaço após o bloco do gabarito, pode ser um valor fixo ou calculado


    // --- Quebra de Página para a Fundamentação ---
    // Garante que a fundamentação comece em uma nova página
    doc.addPage();
    y = leftMargin; // Reinicia Y na nova página

    // --- Seção de Fundamentação ---
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("Fundamentação:", leftMargin, y);
    y += sectionGap;
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');

    currentQuiz.forEach((q, i) => {
        // Espaço antes de cada nova fundamentação
        if (i > 0) { // Não adiciona espaço antes da primeira fundamentação
            y += sectionGap;
            y = checkPageBreak(y);
        }

        const correct = q.options.find(o => o.correct)?.letter.toUpperCase();
        const fundTitle = `${q.number} - ${correct})`; // Ex: "1 - B)"

        // Desenha o título da fundamentação
        doc.setFont(undefined, 'bold');
        const fundTitleLines = doc.splitTextToSize(fundTitle, contentWidth);
        fundTitleLines.forEach(line => {
            y = checkPageBreak(y); // Verifica quebra de página antes de cada linha do título
            doc.text(line, leftMargin, y);
            y += lineHeight;
        });
        y += smallGap; // Pequeno espaço entre o título e o texto da fundamentação
        doc.setFont(undefined, 'normal');

        // Desenha o texto da fundamentação
        const fundTextLines = doc.splitTextToSize(q.explanation, contentWidth);
        fundTextLines.forEach(line => {
            y = checkPageBreak(y); // Verifica quebra de página antes de cada linha da fundamentação
            doc.text(line, leftMargin, y);
            y += lineHeight;
        });
    });

    doc.save("lista-de-exercicios.pdf");
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggleBtn.textContent = document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Escuro';
});
