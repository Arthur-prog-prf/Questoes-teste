document.addEventListener('DOMContentLoaded', function () {
    let currentFontSize = 16;

    const decreaseFontBtn = document.getElementById('decreaseFontBtn');
    const increaseFontBtn = document.getElementById('increaseFontBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const themeToggleBtn = document.getElementById('theme-toggle');

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
});
