// controls.js
document.addEventListener('DOMContentLoaded', function () {
    let currentFontSize = 16;

    decreaseFontBtn.addEventListener('click', () => {
        if (currentFontSize > 10) {
            currentFontSize -= 2;
            document.body.style.fontSize = currentFontSize + 'px';
        }
    });

    increaseFontBtn.addEventListener('click', () => {
        if (currentFontSize < 30) {
            currentFontSize += 2;
            document.body.style.fontSize = currentFontSize + 'px';
        }
    });

    exportPdfBtn.addEventListener('click', () => {
        window.print();
    });

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});
