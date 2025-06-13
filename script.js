let quiz = [];
let respostas = [];
let indexAtual = 0;
let favoritas = JSON.parse(localStorage.getItem("favoritas") || "[]");
let verTudo = false;
let verFavoritas = false;

const inputFile = document.getElementById("file-input");
const quizContainer = document.getElementById("quiz-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const navigation = document.getElementById("navigation");
const progress = document.getElementById("progress");
const resultArea = document.getElementById("result-area");
const exportBtn = document.getElementById("export-pdf");

// Upload e leitura de arquivo .txt
inputFile.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const text = event.target.result;
    quiz = parseQuizFile(text);
    respostas = Array(quiz.length).fill(null);
    indexAtual = 0;
    verTudo = false;
    verFavoritas = false;
    renderQuiz();
  };
  reader.readAsText(file);
});

// Parser de quiz formatado em .txt
function parseQuizFile(texto) {
  const linhas = texto.split("\n");
  const questoes = [];
  const gabarito = {};
  const fundamentacao = {};
  let atual = null;
  let inGabarito = false;
  let inFundamentacao = false;

  for (const linha of linhas) {
    const l = linha.trim();
    if (l === "") continue;

    if (l.toLowerCase().includes("gabarito:")) {
      inGabarito = true;
      inFundamentacao = false;
      continue;
    }

    if (l.toLowerCase().includes("fundamentação:")) {
      inGabarito = false;
      inFundamentacao = true;
      continue;
    }

    if (inGabarito) {
      const match = l.match(/(\d+)\s*-\s*([a-d])/i);
      if (match) gabarito[match[1]] = match[2].toLowerCase();
    } else if (inFundamentacao) {
      const match = l.match(/(\d+)\s*-\s*([a-d]\))\s*:?\s*(.*)/i);
      if (match) {
        const key = `${match[1]}-${match[2].charAt(0).toLowerCase()}`;
        fundamentacao[key] = match[3].trim();
      }
    } else {
      const questaoMatch = l.match(/Questão\s+(\d+)\s*-\s*(.+)/i);
      if (questaoMatch) {
        if (atual) questoes.push(atual);
        atual = {
          number: questaoMatch[1],
          text: questaoMatch[2].trim(),
          options: []
        };
        continue;
      }

      if (/^[a-d]\)\s/i.test(l) && atual) {
        atual.options.push({
          letter: l[0].toLowerCase(),
          text: l.slice(2).trim(),
          correct: false
        });
      }
    }
  }

  if (atual) questoes.push(atual);

  questoes.forEach(q => {
    const letra = gabarito[q.number];
    q.options.forEach(opt => opt.correct = opt.letter === letra);
    const key = `${q.number}-${letra}`;
    q.explanation = fundamentacao[key] || "Fundamentação não disponível.";
  });

  return questoes;
}

// Renderiza uma questão ou todas
function renderQuiz() {
  quizContainer.innerHTML = "";

  if (verTudo) {
    renderTodas();
    return;
  }

  if (verFavoritas) {
    renderFavoritas();
    return;
  }

  const q = quiz[indexAtual];
  const resposta = respostas[indexAtual];

  const bloco = document.createElement("div");
  bloco.className = "bg-white p-4 rounded shadow";

  const header = document.createElement("div");
  header.className = "flex justify-between items-start";

  const enunciado = document.createElement("h2");
  enunciado.className = "font-semibold mb-2";
  enunciado.textContent = `Questão ${q.number} - ${q.text}`;
  header.appendChild(enunciado);

  const estrela = document.createElement("button");
  estrela.innerHTML = favoritas.includes(q.number) ? "⭐" : "☆";
  estrela.title = "Marcar como favorita";
  estrela.className = "text-xl";
  estrela.onclick = () => {
    favoritas = favoritas.includes(q.number)
      ? favoritas.filter(n => n !== q.number)
      : [...favoritas, q.number];
    localStorage.setItem("favoritas", JSON.stringify(favoritas));
    renderQuiz();
  };
  header.appendChild(estrela);

  bloco.appendChild(header);

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = `block w-full text-left px-3 py-2 rounded mb-2 border
      ${resposta === i ? (opt.correct ? 'bg-green-100 border-green-600' : 'bg-red-100 border-red-600') : 'bg-gray-50'}`;
    btn.innerHTML = `<strong>${opt.letter.toUpperCase()})</strong> ${opt.text}`;
    btn.onclick = () => {
      respostas[indexAtual] = i;
      renderQuiz();
    };
    bloco.appendChild(btn);
  });

  if (resposta !== null) {
    const feedback = document.createElement("div");
    const acertou = q.options[resposta].correct;
    feedback.className = `mt-4 font-bold ${acertou ? "text-green-700" : "text-red-700"}`;
    feedback.textContent = acertou ? "✔️ Resposta Correta!" : "❌ Resposta Incorreta!";
    bloco.appendChild(feedback);

    const expl = document.createElement("div");
    expl.className = "mt-2 text-sm text-gray-700 whitespace-pre-wrap";
    expl.textContent = `📌 Fundamentação: ${q.explanation}`;
    bloco.appendChild(expl);
  }

  quizContainer.appendChild(bloco);

  navigation.classList.remove("hidden");
  progress.textContent = `Questão ${indexAtual + 1} de ${quiz.length}`;
  prevBtn.disabled = indexAtual === 0;
  nextBtn.disabled = indexAtual === quiz.length - 1;

  resultArea.classList.add("hidden");
}

prevBtn.onclick = () => {
  if (indexAtual > 0) {
    indexAtual--;
    renderQuiz();
  }
};

nextBtn.onclick = () => {
  if (indexAtual < quiz.length - 1) {
    indexAtual++;
    renderQuiz();
  }
};

// Mostra estatísticas
function mostrarResultadoFinal() {
  const total = quiz.length;
  const corretas = respostas.filter((r, i) => r !== null && quiz[i].options[r].correct).length;

  const stats = document.getElementById("result-stats");
  stats.innerHTML = `
    <p><strong>Total de questões:</strong> ${total}</p>
    <p><strong>Acertos:</strong> ${corretas}</p>
    <p><strong>Erros:</strong> ${total - corretas}</p>
    <button class="mt-4 px-3 py-2 bg-blue-600 text-white rounded" onclick="verTudo=true; renderQuiz()">Ver Todas com Fundamentação</button>
    ${favoritas.length ? `<button class="mt-4 ml-2 px-3 py-2 bg-yellow-500 text-white rounded" onclick="verFavoritas=true; renderQuiz()">Ver Somente Favoritas ⭐</button>` : ""}
    <button class="mt-4 ml-2 px-3 py-2 bg-gray-600 text-white rounded" onclick="verTudo=false; verFavoritas=false; renderQuiz()">Voltar ao Quiz</button>
  `;

  resultArea.classList.remove("hidden");
}

// Exporta PDF
document.getElementById("export-pdf").onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(16);
  doc.text("Resultado do Simulado", 105, y, { align: "center" });
  y += 10;

  quiz.forEach((q, i) => {
    const r = respostas[i];
    const user = q.options[r];
    const correta = q.options.find(o => o.correct);

    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(`${q.number}. ${q.text}`, 180), 15, y); y += 7;
    if (user)
      doc.text(`Sua resposta: ${user.letter.toUpperCase()}) ${user.text}`, 15, y);
    else
      doc.text(`Sua resposta: (Não respondida)`, 15, y);
    y += 6;
    doc.text(`Correta: ${correta.letter.toUpperCase()}) ${correta.text}`, 15, y); y += 6;
    doc.text(doc.splitTextToSize(`Fundamentação: ${q.explanation}`, 180), 15, y); y += 10;

    if (y > 260) { doc.addPage(); y = 20; }
  });

  doc.save("resultado.pdf");
};

// Renderiza todas as questões
function renderTodas() {
  quiz.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded shadow mb-4";
    div.innerHTML = `
      <h3 class="font-semibold mb-2">${q.number}. ${q.text}</h3>
      <p><strong>Sua resposta:</strong> ${
        respostas[i] !== null
          ? `${q.options[respostas[i]].letter.toUpperCase()}) ${q.options[respostas[i]].text}`
          : "Não respondida"
      }</p>
      <p><strong>Correta:</strong> ${q.options.find(o => o.correct).letter.toUpperCase()}) ${q.options.find(o => o.correct).text}</p>
      <details class="mt-2">
        <summary class="cursor-pointer text-blue-600 underline">Ver Fundamentação</summary>
        <p class="mt-1">${q.explanation}</p>
      </details>
    `;
    quizContainer.appendChild(div);
  });
}

// Renderiza apenas favoritas
function renderFavoritas() {
  const filtradas = quiz.filter(q => favoritas.includes(q.number));
  filtradas.forEach(q => {
    const index = quiz.findIndex(x => x.number === q.number);
    const resposta = respostas[index];
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded shadow mb-4";
    div.innerHTML = `
      <h3 class="font-semibold mb-2">${q.number}. ${q.text}</h3>
      <p><strong>Sua resposta:</strong> ${
        resposta !== null
          ? `${q.options[resposta].letter.toUpperCase()}) ${q.options[resposta].text}`
          : "Não respondida"
      }</p>
      <p><strong>Correta:</strong> ${q.options.find(o => o.correct).letter.toUpperCase()}) ${q.options.find(o => o.correct).text}</p>
      <details class="mt-2">
        <summary class="cursor-pointer text-blue-600 underline">Ver Fundamentação</summary>
        <p class="mt-1">${q.explanation}</p>
      </details>
    `;
    quizContainer.appendChild(div);
  });
}
