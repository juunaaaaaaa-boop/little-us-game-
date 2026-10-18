
const questions = [
  {
    question: "Kalau ada yang tiba-tiba ngajak ngobrol, kamu biasanya...",
    hint: "nggak ada jawaban yang salah ♡",
    answers: [
      "langsung nyambung kalau seru",
      "agak malu, tapi tetap dibalas",
      "nunggu topiknya menarik",
      "senyum sendiri sebelum membalas"
    ]
  },
  {
    question: "Menurutmu, hal kecil yang paling bikin senang itu...",
    hint: "pilih yang paling kamu rasakan",
    answers: [
      "diingat hal-hal kecilnya",
      "dikirimi lagu yang cocok",
      "ditanya kabarnya dengan tulus",
      "diajak ngobrol sampai lupa waktu"
    ]
  },
  {
    question: "Kalau seseorang mengirim lagu khusus buatmu...",
    hint: "kira-kira reaksimu bagaimana?",
    answers: [
      "langsung dengarkan sampai habis",
      "penasaran kenapa memilih lagu itu",
      "masukkan ke playlist pribadi",
      "mungkin lagu itu jadi lebih spesial"
    ]
  },
  {
    question: "Kamu lebih suka obrolan yang...",
    hint: "pilih suasana favoritmu",
    answers: [
      "random dan penuh candaan",
      "tenang, tapi terasa nyaman",
      "bisa membahas apa saja",
      "sederhana, tapi bikin ingin lanjut"
    ]
  },
  {
    question: "Kalau ada seseorang yang mulai perhatian...",
    hint: "nggak perlu buru-buru menyimpulkan apa pun",
    answers: [
      "anggap sebagai kebaikan biasa",
      "mulai penasaran sama orangnya",
      "lihat dulu apakah konsisten",
      "diam-diam jadi menunggu pesannya"
    ]
  },
  {
    question: "Kalau bisa menyimpan satu momen kecil...",
    hint: "pilih momen yang ingin kamu ingat",
    answers: [
      "percakapan yang bikin tertawa",
      "pesan sederhana di waktu yang tepat",
      "lagu yang mengingatkan pada seseorang",
      "waktu ketika semuanya terasa nyaman"
    ]
  }
];

const screens = {
  home: document.getElementById("homeScreen"),
  quiz: document.getElementById("quizScreen"),
  result: document.getElementById("resultScreen"),
  letter: document.getElementById("letterScreen")
};

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const letterBtn = document.getElementById("letterBtn");
const replayBtn = document.getElementById("replayBtn");
const quitBtn = document.getElementById("quitBtn");
const homeLink = document.getElementById("homeLink");

const questionNumber = document.getElementById("questionNumber");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");
const questionText = document.getElementById("questionText");
const questionHint = document.getElementById("questionHint");
const answerList = document.getElementById("answerList");
const answerFeedback = document.getElementById("answerFeedback");

let currentQuestion = 0;
let selectedAnswer = null;
let score = 0;
let answers = [];

function showScreen(name) {
  Object.entries(screens).forEach(([key, screen]) => {
    const isActive = key === name;
    screen.hidden = !isActive;
    screen.classList.toggle("active", isActive);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startGame() {
  currentQuestion = 0;
  selectedAnswer = null;
  score = 0;
  answers = [];
  renderQuestion();
  showScreen("quiz");
}

function renderQuestion() {
  const question = questions[currentQuestion];
  const number = currentQuestion + 1;
  const percent = Math.round((number / questions.length) * 100);

  selectedAnswer = null;
  questionNumber.textContent =
    `PERTANYAAN ${String(number).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;

  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;

  questionText.textContent = question.question;
  questionHint.textContent = question.hint;
  answerFeedback.textContent = "";
  nextBtn.disabled = true;

  nextBtn.innerHTML = currentQuestion === questions.length - 1
    ? 'lihat hasil <span>♡</span>'
    : 'lanjut <span>→</span>';

  answerList.replaceChildren();

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.setAttribute("aria-pressed", "false");

    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = String.fromCharCode(65 + index);

    const label = document.createElement("span");
    label.textContent = answer;

    button.append(letter, label);

    button.addEventListener("click", () => {
      selectedAnswer = index;

      answerList.querySelectorAll(".answer-option").forEach(option => {
        option.classList.remove("selected");
        option.setAttribute("aria-pressed", "false");
      });

      button.classList.add("selected");
      button.setAttribute("aria-pressed", "true");
      nextBtn.disabled = false;

      const feedbacks = [
        "pilihan yang menarik ♡",
        "noted, ini jawabanmu!",
        "setiap orang punya caranya sendiri.",
        "oke, kita lanjut pelan-pelan."
      ];

      answerFeedback.textContent =
        feedbacks[(index + currentQuestion) % feedbacks.length];
    });

    answerList.appendChild(button);
  });
}

function showResult() {
  document.getElementById("scoreValue").textContent =
    `${score} / ${questions.length}`;

  let title;
  let description;

  if (score >= 14) {
    title = "a little romantic, huh?";
    description =
      "jawabanmu punya banyak sisi manis. mungkin kamu memang suka hal-hal kecil yang punya arti.";
  } else if (score >= 8) {
    title = "soft-hearted energy.";
    description =
      "kamu punya caramu sendiri menikmati kedekatan. kadang, hal sederhana sudah cukup berarti.";
  } else {
    title = "keeping it simple.";
    description =
      "nggak perlu buru-buru memberi arti pada semuanya. kenali orang dan perasaanmu dengan santai.";
  }

  document.getElementById("resultTitle").textContent = title;
  document.getElementById("resultDescription").textContent = description;

  showScreen("result");
}

nextBtn.addEventListener("click", () => {
  if (selectedAnswer === null) return;

  answers[currentQuestion] = selectedAnswer;

  // Skor permainan berdasarkan pilihan, bukan tes kecocokan sungguhan.
  score += selectedAnswer + 1;

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResult();
  }
});

startBtn.addEventListener("click", startGame);
replayBtn.addEventListener("click", startGame);
letterBtn.addEventListener("click", () => showScreen("letter"));
quitBtn.addEventListener("click", () => showScreen("home"));
homeLink.addEventListener("click", event => {
  event.preventDefault();
  showScreen("home");
});

const letterForm = document.getElementById("letterForm");
const letterOutput = document.getElementById("letterOutput");
const recipientInput = document.getElementById("recipient");
const senderInput = document.getElementById("sender");
const messageInput = document.getElementById("message");

const letterGreeting = document.getElementById("letterGreeting");
const letterBody = document.getElementById("letterBody");
const letterSignature = document.getElementById("letterSignature");

const copyBtn = document.getElementById("copyBtn");
const copyStatus = document.getElementById("copyStatus");
const editLetterBtn = document.getElementById("editLetterBtn");
const backResultBtn = document.getElementById("backResultBtn");

let letterText = "";

letterForm.addEventListener("submit", event => {
  event.preventDefault();

  const recipient = recipientInput.value.trim() || "kamu";
  const sender = senderInput.value.trim() || "seseorang";
  const message = messageInput.value.trim();

  if (!message) {
    messageInput.setCustomValidity("isi suratmu dulu, ya ♡");
    messageInput.reportValidity();
    messageInput.addEventListener("input", () => {
      messageInput.setCustomValidity("");
    }, { once: true });
    return;
  }

  letterGreeting.textContent = `hai, ${recipient} ♡`;
  letterBody.textContent = message;
  letterSignature.textContent = `dari,\n${sender} ♡`;

  letterText =
    `hai, ${recipient} ♡\n\n${message}\n\n` +
    `dari,\n${sender} ♡`;

  letterForm.hidden = true;
  letterOutput.hidden = false;
  copyStatus.textContent = "";

  letterOutput.scrollIntoView({ behavior: "smooth", block: "start" });
});

editLetterBtn.addEventListener("click", () => {
  letterOutput.hidden = true;
  letterForm.hidden = false;
  copyStatus.textContent = "";
});

backResultBtn.addEventListener("click", () => {
  showScreen("result");
});

copyBtn.addEventListener("click", async () => {
  if (!letterText) return;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(letterText);
    } else {
      const temporary = document.createElement("textarea");
      temporary.value = letterText;
      temporary.setAttribute("readonly", "");
      temporary.style.position = "fixed";
      temporary.style.opacity = "0";
      document.body.appendChild(temporary);
      temporary.select();

      const copied = document.execCommand("copy");
      temporary.remove();

      if (!copied) throw new Error("Copy tidak tersedia");
    }

    copyStatus.textContent = "surat berhasil disalin ♡";
  } catch (error) {
    copyStatus.textContent =
      "gagal menyalin otomatis. kamu bisa memilih dan menyalin teks surat secara manual.";
  }
});
    
