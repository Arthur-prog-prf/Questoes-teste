let currentFontSize = 16;

if (decreaseFontBtn) {
    decreaseFontBtn.addEventListener('click', () => {
        if (currentFontSize > 10) {
            currentFontSize -= 2;
            document.body.style.fontSize = currentFontSize + 'px';
        }
    });
}

if (increaseFontBtn) {
    increaseFontBtn.addEventListener('click', () => {
        if (currentFontSize < 30) {
            currentFontSize += 2;
            document.body.style.fontSize = currentFontSize + 'px';
        }
    });
}

if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', () => {
        window.print();
    });
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
}
