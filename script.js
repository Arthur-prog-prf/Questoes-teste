const materiasSelect = document.getElementById('materias');
const startBtn = document.getElementById('start-btn');
const quizArea = document.getElementById('quiz-area');
const questionsArea = document.getElementById('questions-area');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const exportPdfBtn = document.getElementById('export-pdf');
const printBtn = document.getElementById('print');

let currentQuiz = [];
let currentQuestionIndex = 0;
let userAnswers = [];

async function loadMaterias() {
  const res = await fetch('materias/materias.json');
  const materias = await res.json();

  const defaultOpt = document.createElement('option');
  defaultOpt.text = '-- Selecione --';
  defaultOpt.value = '';
  materiasSelect.appendChild(defaultOpt);

  materias.forEach(m => {
    const opt = document.createElement('option');
    opt.text = m.nome;
    opt.value = m.arquivo;
    materiasSelect.appendChild(opt);
  });
}

async function loadQuiz(file) {
  const res = await fetch(`materias/${file}`);
  const text = await res.text();
  parseQuizFile(text);
}

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
        fundamentacao[key] = match[3];
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
    q.options.forEach(opt => {
      opt.correct = opt.letter === correct;
    });
    q.explanation = fundamentacao[`${q.number}-${correct}`] || 'Fundamentação não disponível.';
  });

  startQuiz();
}

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
  wrapper.className = 'space-y-4';

  const qText = document.createElement('div');
  qText.className = 'text-lg font-medium';
  qText.textContent = `Questão ${q.number} - ${q.text}`;
  wrapper.appendChild(qText);

  const options = document.createElement('div');
  options.className = 'space-y-2';
  q.options.forEach((opt, i) => {
    const optDiv = document.createElement('div');
    optDiv.className = 'p-2 border rounded cursor-pointer hover:bg-gray-100 ' +
      (userIndex === i ? (opt.correct ? 'bg-green-100' : 'bg-red-100') : '');
    optDiv.textContent = `${opt.letter.toUpperCase()}) ${opt.text}`;
    optDiv.onclick = () => {
      userAnswers[currentQuestionIndex] = i;
      renderQuestions();
    };
    options.appendChild(optDiv);
  });

  wrapper.appendChild(options);

  if (userIndex !== null) {
    const feedback = document.createElement('div');
    feedback.className = userIndex !== null && q.options[userIndex].correct
      ? 'text-green-700 font-bold mt-2'
      : 'text-red-700 font-bold mt-2';
    feedback.textContent = q.options[userIndex].correct ? '✓ Resposta correta!' : '✗ Resposta incorreta!';
    wrapper.appendChild(feedback);

    const fundButton = document.createElement('button');
    fundButton.className = 'mt-2 text-sm underline text-blue-700';
    fundButton.textContent = 'Ver Fundamentação';
    const fundText = document.createElement('div');
    fundText.className = 'mt-2 text-sm text-gray-700 hidden';
    fundText.textContent = q.explanation;

    fundButton.onclick = () => {
      fundText.classList.toggle('hidden');
    };

    wrapper.appendChild(fundButton);
    wrapper.appendChild(fundText);
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
  else alert('Por favor, selecione um simulado');
};

exportPdfBtn.onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;

  currentQuiz.forEach((q, i) => {
    doc.setFontSize(12);
    const qText = `Questão ${q.number} - ${q.text}`;
    doc.text(qText, 10, y); y += 7;
    q.options.forEach(opt => {
      doc.text(`${opt.letter.toUpperCase()}) ${opt.text}`, 15, y);
      y += 6;
    });
    doc.text(`Resposta correta: ${q.options.find(o => o.correct).letter.toUpperCase()}`, 10, y);
    y += 7;
    doc.text(doc.splitTextToSize(q.explanation, 180), 10, y);
    y += 14;
    if (y > 270) { doc.addPage(); y = 20; }
  });

  doc.save("simulado.pdf");
};

printBtn.onclick = () => window.print();

// Carrega lista de matérias
loadMaterias();
