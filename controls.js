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
    const leftMargin = 20;
    const rightMargin = 20;
    const indentationForOptions = 10; // Espaço adicional para indentação das opções

    const lineHeight = 7; // Altura aproximada de uma linha para o font-size 12
    const sectionGap = 8; // Espaçamento entre as seções
    const smallGap = 4; // Espaçamento menor
    const pageBreakThreshold = doc.internal.pageSize.height - 20; // Limite Y para quebra de página

    // Calculando a largura disponível para o conteúdo com base nas margens
    const contentWidth = doc.internal.pageSize.width - leftMargin - rightMargin;
    const indentedContentWidth = contentWidth - indentationForOptions; // Largura para texto identado (opções)

    // --- Função auxiliar para desenhar texto justificado ---
    // Esta função tentará simular a justificação de texto linha por linha
    function drawJustifiedText(textLines, x, yStart, maxWidth, font, fontSize) {
        doc.setFont(font || undefined, 'normal'); // Reseta a fonte para normal por padrão na justificação
        doc.setFontSize(fontSize || 12); // Define o tamanho da fonte

        let currentY = yStart;
        textLines.forEach(line => {
            const words = line.split(' ');
            if (words.length <= 1) { // Não justifica se houver 0 ou 1 palavra
                doc.text(line, x, currentY);
            } else {
                let textWidth = doc.getTextWidth(line);
                let spacing = (maxWidth - textWidth) / (words.length - 1);
                let currentX = x;

                words.forEach((word, index) => {
                    doc.text(word, currentX, currentY);
                    currentX += doc.getTextWidth(word) + spacing;
                });
            }
            currentY += lineHeight;
        });
        return currentY - yStart; // Retorna a altura total consumida
    }


    // --- Título do Documento ---
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("Lista de Exercícios", doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += sectionGap * 2;
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');

    // --- Seção de Questões ---
    currentQuiz.forEach((q, i) => {
        // Calcula a altura da questão atual para verificar quebra de página
        let estimatedQuestionHeight = 0;
        const qTextContent = `Questão ${q.number} - ${q.text}`;
        const qTextLines = doc.splitTextToSize(qTextContent, contentWidth); // Usa contentWidth
        estimatedQuestionHeight += qTextLines.length * lineHeight; // Texto da questão
        q.options.forEach(opt => {
            const oTextContent = `${opt.letter.toUpperCase()}) ${opt.text}`;
            const oTextLines = doc.splitTextToSize(oTextContent, indentedContentWidth); // Usa indentedContentWidth
            estimatedQuestionHeight += oTextLines.length * lineHeight; // Opções
        });
        estimatedQuestionHeight += sectionGap; // Espaço após a questão

        // Se a questão não couber na página atual, adicione uma nova página
        // E não adicione uma nova página antes da primeira questão
        if (y + estimatedQuestionHeight > pageBreakThreshold && i > 0) {
            doc.addPage();
            y = leftMargin; // Reinicia Y na nova página, usando a mesma margem superior
        }

        // Desenha a questão
        doc.setFont(undefined, 'bold');
        // Usamos a função auxiliar para desenhar o texto justificado
        drawJustifiedText(qTextLines, leftMargin, y, contentWidth, undefined, 12); // Passamos o tamanho da fonte
        y += qTextLines.length * lineHeight;
        doc.setFont(undefined, 'normal');

        q.options.forEach(opt => {
            const oTextContent = `${opt.letter.toUpperCase()}) ${opt.text}`;
            const oTextLines = doc.splitTextToSize(oTextContent, indentedContentWidth);
            // Usamos a função auxiliar para desenhar o texto justificado
            drawJustifiedText(oTextLines, leftMargin + indentationForOptions, y, indentedContentWidth, undefined, 12);
            y += oTextLines.length * lineHeight;
        });
        y += sectionGap; // Espaço após cada questão
    });

    // --- Quebra de Página para o Gabarito ---
    doc.addPage();
    y = leftMargin; // Reinicia Y na nova página, usando a mesma margem superior

    // --- Seção de Gabarito ---
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("Gabarito:", leftMargin, y); // Usando leftMargin
    y += sectionGap;
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');

    let gabaritoContent = [];
    currentQuiz.forEach(q => {
        const correct = q.options.find(o => o.correct)?.letter.toUpperCase();
        gabaritoContent.push(`${q.number} - ${correct}`);
    });

    const gabaritoColumns = 4; // Número de colunas para o gabarito
    // A largura da coluna do gabarito também deve considerar a nova margem
    const colWidth = contentWidth / gabaritoColumns;

    for (let i = 0; i < gabaritoContent.length; i++) {
        const colIndex = i % gabaritoColumns;
        const rowIndex = Math.floor(i / gabaritoColumns);

        const xPos = leftMargin + (colIndex * colWidth); // Usando leftMargin
        const yPos = y + (rowIndex * lineHeight);

        // Verifica quebra de página para o gabarito
        if (yPos > pageBreakThreshold && colIndex === 0) { // Quebra apenas no início de uma nova linha de gabarito
            doc.addPage();
            y = leftMargin; // Reinicia Y na nova página
            yPos = y; // Atualiza yPos para a nova página
        }
        doc.text(gabaritoContent[i], xPos, yPos);
    }
    y += Math.ceil(gabaritoContent.length / gabaritoColumns) * lineHeight + sectionGap * 2;


    // --- Quebra de Página para a Fundamentação ---
    doc.addPage();
    y = leftMargin; // Reinicia Y na nova página, usando a mesma margem superior

    // --- Seção de Fundamentação ---
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("Fundamentação:", leftMargin, y); // Usando leftMargin
    y += sectionGap;
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');

    currentQuiz.forEach((q, i) => {
        const correct = q.options.find(o => o.correct)?.letter.toUpperCase();
        const fundTitle = `${q.number} - ${correct})`; // Ex: "1 - B)"

        // Calcula a altura da fundamentação atual para verificar quebra de página
        let estimatedFundHeight = 0;
        const fundTitleLines = doc.splitTextToSize(fundTitle, contentWidth);
        estimatedFundHeight += fundTitleLines.length * lineHeight; // Título da fundamentação
        const fundTextLines = doc.splitTextToSize(q.explanation, contentWidth); // Usa contentWidth
        estimatedFundHeight += fundTextLines.length * lineHeight; // Texto da fundamentação
        estimatedFundHeight += sectionGap; // Espaço após cada fundamentação

        // Se a fundamentação não couber na página atual, adicione uma nova página
        if (y + estimatedFundHeight > pageBreakThreshold && i > 0) {
            doc.addPage();
            y = leftMargin; // Reinicia Y na nova página
        }

        // Desenha o título da fundamentação (ex: "1 - B)")
        doc.setFont(undefined, 'bold');
        // Usamos a função auxiliar para desenhar o texto justificado
        drawJustifiedText(fundTitleLines, leftMargin, y, contentWidth, undefined, 12);
        y += fundTitleLines.length * lineHeight + smallGap;
        doc.setFont(undefined, 'normal');

        // Desenha o texto da fundamentação
        // Usamos a função auxiliar para desenhar o texto justificado
        drawJustifiedText(fundTextLines, leftMargin, y, contentWidth, undefined, 12);
        y += fundTextLines.length * lineHeight + sectionGap; // Espaço após cada fundamentação
    });

    doc.save("lista-de-exercicios.pdf");
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggleBtn.textContent = document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Escuro';
});
