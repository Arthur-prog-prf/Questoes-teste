// DOM Elements
const materiasSelect = document.getElementById('materias');
const startBtn = document.getElementById('start-btn');
const quizArea = document.getElementById('quiz-area');
const questionsArea = document.getElementById('questions-area');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const decreaseFontBtn = document.getElementById('decrease-font');
const increaseFontBtn = document.getElementById('increase-font');
const resetFontBtn = document.getElementById('reset-font');
const exportPdfBtn = document.getElementById('export-pdf');
const printBtn = document.getElementById('print');
const themeToggleBtn = document.getElementById('theme-toggle');

let currentQuiz = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let fontSize = 16;

// Load materias.json and populate select
async function loadMaterias() {
  const res = await fetch('materias/materias.json');
  const materias = await res.json();

  materias.forEach(m => {
    const opt = document.createElement('option');
    opt.text = m.nome;
    opt.value = m.arquivo;
    materiasSelect.appendChild(opt);
  });
}

// Load selected quiz
async function loadQuiz(file) {
  const res = await fetch(`materias/${file}`);
  const text = await res.text();
  parseQuizFile(text);
}

// Parse the .txt file
function parseQuizFile(text) {
  const lines = text.split('\n');
  currentQuiz = [];
  userAnswers = [];
  let currentQuestion = null;
  let inGabarito = false;
  let inFundamentacao = false;
  const gabarito = {};
  const fundamentacao = {};

  for (const line of lines) {
    if (line.trim() === '') continue;

    if (line.toLowerCase().includes('gabarito:')) {
      inGabarito = true;
      inFundamentacao = false;
      continue;
    }

    if (line.toLowerCase().includes('fundamentação:')) {
      inGabarito = false;
      inFundamentacao = true;
      continue;
    }

    if (inGabarito) {
      const match = line.match(/(\d+)\s*-\s*([a-d])/i);
      if (match) gabarito[match[1]] = match[2].toLowerCase();
    } else if (inFundamentacao) {
      const match = line.match(/(\d+)\s*-\s*([a-d]\))\s*:?\s*(.*)/i);
      if (match) {
        const key = `${match[1]}-${match[2].charAt(0).toLowerCase()}`;
        fundamentacao[key] = match[3].trim();
      }
    } else {
      const qMatch = line.match(/Questão\s+(\d+)\s*-\s*(.+)/i);
      if (qMatch) {
        if (currentQuestion) currentQuiz.push(currentQuestion);
        currentQuestion = { number: qMatch[1], text: qMatch[2].trim(), options: [] };
        userAnswers.push(null);
      } else if (/^[a-d]\)\s/i.test(line) && currentQuestion) {
        currentQuestion.options.push({
          letter: line[0].toLowerCase(),
          text: line.substring(2).trim(),
          correct: false
        });
      }
    }
  }

  if (currentQuestion) currentQuiz.push(currentQuestion);

  currentQuiz.forEach(q => {
    const correct = gabarito[q.number];
    q.options.forEach(opt => opt.correct = opt.letter === correct);
    const fundKey = `${q.number}-${correct}`;
    q.explanation = fundamentacao[fundKey] || 'Fundamentação não disponível.';
  });

  startQuiz();
}

// Start the quiz
function startQuiz() {
  currentQuestionIndex = 0;
  totalQuestionsSpan.textContent = currentQuiz.length;
  quizArea.classList.remove('hidden');
  renderQuestions();
}

function renderQuestions() {
  questionsArea.innerHTML = '';
  updateProgress();

  const q = currentQuiz[currentQuestionIndex];
  const userIndex = userAnswers[currentQuestionIndex];

  const wrapper = document.createElement('div');
  wrapper.className = 'bg-white p-6 rounded shadow';

  const qText = document.createElement('div');
  qText.className = 'text-lg font-bold mb-4';
  qText.textContent = `Questão ${q.number} - ${q.text}`;
  wrapper.appendChild(qText);

  q.options.forEach((opt, i) => {
    const optBtn = document.createElement('button');
    optBtn.className = 'w-full text-left px-3 py-2 border rounded mb-2 ' +
      (userIndex === i
        ? opt.correct ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
        : 'bg-gray-50 hover:bg-gray-100');

    optBtn.innerHTML = `<strong>${opt.letter.toUpperCase()})</strong> ${opt.text}`;
    optBtn.onclick = () => {
      userAnswers[currentQuestionIndex] = i;
      renderQuestions();
    };
    wrapper.appendChild(optBtn);
  });

  if (userIndex !== null) {
    const feedback = document.createElement('div');
    const isCorrect = q.options[userIndex].correct;
    feedback.className = 'mt-2 font-bold ' + (isCorrect ? 'text-green-700' : 'text-red-700');
    feedback.textContent = isCorrect ? '✔️ Resposta Correta!' : '❌ Resposta Incorreta!';
    wrapper.appendChild(feedback);

    const showBtn = document.createElement('button');
    showBtn.className = 'mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700';
    showBtn.textContent = 'Ver Fundamentação';
    const fundDiv = document.createElement('div');
    fundDiv.className = 'mt-2 p-4 bg-blue-100 text-blue-900 rounded shadow hidden';
    fundDiv.textContent = q.explanation;

    showBtn.onclick = () => {
      fundDiv.classList.toggle('hidden');
    };

    wrapper.appendChild(showBtn);
    wrapper.appendChild(fundDiv);
  }

  questionsArea.appendChild(wrapper);
  updateNav();
}

function updateProgress() {
  currentQuestionSpan.textContent = currentQuestionIndex + 1;
}

function updateNav() {
  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = currentQuestionIndex >= currentQuiz.length - 1;
}

prevBtn.onclick = () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestions();
  }
};

nextBtn.onclick = () => {
  if (currentQuestionIndex < currentQuiz.length - 1) {
    currentQuestionIndex++;
    renderQuestions();
  }
};

startBtn.onclick = () => {
  const file = materiasSelect.value;
  if (file) loadQuiz(file);
  else alert('Por favor, selecione uma matéria');
};

exportPdfBtn.onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;

  currentQuiz.forEach((q, i) => {
    doc.setFontSize(12);
    doc.text(`Questão ${q.number} - ${q.text}`, 10, y); y += 6;
    q.options.forEach(opt => {
      doc.text(`${opt.letter.toUpperCase()}) ${opt.text}`, 15, y); y += 6;
    });
    const correta = q.options.find(o => o.correct);
    doc.text(`Resposta correta: ${correta.letter.toUpperCase()}`, 10, y); y += 6;
    const explicacao = doc.splitTextToSize(`Fundamentação: ${q.explanation}`, 180);
    doc.text(explicacao, 10, y); y += explicacao.length * 6 + 4;
    if (y > 260) { doc.addPage(); y = 20; }
  });

  doc.save("simulado.pdf");
};

printBtn.onclick = () => window.print();

themeToggleBtn.onclick = () => {
  document.body.classList.toggle('bg-gray-100');
  document.body.classList.toggle('bg-gray-900');
  document.body.classList.toggle('text-white');
  themeToggleBtn.textContent = document.body.classList.contains('bg-gray-900') ? 'Modo Claro' : 'Modo Escuro';
};

increaseFontBtn.onclick = () => {
  if (fontSize < 24) {
    fontSize += 2;
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
    document.body.style.fontSize = `${fontSize}px`;
  }
};

decreaseFontBtn.onclick = () => {
  if (fontSize > 12) {
    fontSize -= 2;
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
    document.body.style.fontSize = `${fontSize}px`;
  }
};

resetFontBtn.onclick = () => {
  fontSize = 16;
  document.documentElement.style.setProperty('--font-size', `16px`);
  document.body.style.fontSize = `16px`;
};

// Inicializar
loadMaterias();
