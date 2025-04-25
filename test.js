const category = sessionStorage.getItem("selectedCategory");
const allQuestions = JSON.parse(localStorage.getItem("questions"));
const selectedQuestions = shuffleArray(allQuestions[category]).slice(0, 10);

let currentQuestion = 0;
let score = 0;
let timer;
let userAnswers = [];

function shuffleArray(array) {
  return array.sort(() => 0.5 - Math.random());
}

function startTimer() {
  let time = 30;
  document.getElementById("timer").innerText = time;
  timer = setInterval(() => {
    time--;
    document.getElementById("timer").innerText = time;
    if (time === 0) {
      nextQuestion(); // Automatically go to next if time runs out
    }
  }, 1000);
}

function enableNextButton() {
  document.getElementById("nextBtn").disabled = false;
}

function disableNextButton() {
  document.getElementById("nextBtn").disabled = true;
}

function resetRadioButtons() {
  const options = document.getElementsByName("option");
  options.forEach(option => {
    option.checked = false;
  });
}

function showQuestion() {
  clearInterval(timer);
  if (currentQuestion >= selectedQuestions.length) {
    showResult();
    return;
  }

  const q = selectedQuestions[currentQuestion];
  const optionsHtml = q.options.map((opt, index) => `
    <div>
      <input type="radio" name="option" id="opt${index}" value="${opt}" onchange="enableNextButton()">
      <label for="opt${index}">${opt}</label>
    </div>
  `).join("");

  document.getElementById("questionArea").innerHTML = `
    <h3>Question ${currentQuestion + 1}</h3>
    <p>${q.question}</p>
    ${optionsHtml}
    <p id="explanation" style="display:none;color:green;font-style:italic"></p>
  `;

  document.getElementById("nextBtn").innerText = currentQuestion === 9 ? "Submit" : "Next";
  disableNextButton();
  resetRadioButtons();
  startTimer();
}

function nextQuestion() {
  clearInterval(timer);
  disableNextButton();  // Disable button during delay

  const options = document.getElementsByName("option");
  let selected = null;
  for (const opt of options) {
    if (opt.checked) {
      selected = opt.value;
      break;
    }
  }

  const correctAnswer = selectedQuestions[currentQuestion].answer;
  const isCorrect = selected && selected.toLowerCase() === correctAnswer.toLowerCase();

  if (!selected) {
    userAnswers.push({
      question: selectedQuestions[currentQuestion].question,
      selected: "No answer",
      correct: correctAnswer,
      explanation: selectedQuestions[currentQuestion].explanation,
      isCorrect: false
    });
  } else {
    if (isCorrect) score++;
    userAnswers.push({
      question: selectedQuestions[currentQuestion].question,
      selected: selected,
      correct: correctAnswer,
      explanation: selectedQuestions[currentQuestion].explanation,
      isCorrect: isCorrect
    });
  }

  currentQuestion++;
  setTimeout(() => {
    if (currentQuestion < selectedQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 200); // 2 seconds pause before moving to next
}

function showResult() {
  let resultHTML = `
    <h2>Test Completed!</h2>
    <p>Your Score: ${score} / 10</p>
    <hr>
  `;

  userAnswers.forEach((item, index) => {
    resultHTML += `
      <div style="margin-bottom: 15px;">
        <h4>Question ${index + 1}</h4>
        <p>${item.question}</p>
        <p><strong>Your Answer:</strong> ${item.selected}</p>
        <p><strong>Correct Answer:</strong> ${item.correct}</p>
        <p style="color:green;font-style:italic">${item.explanation}</p>
      </div>
      <hr>
    `;
  });

  resultHTML += `<button class="home-button" onclick="location.href='home.html'">Return to Home</button>`;

  document.getElementById("testContainer").innerHTML = resultHTML;
}

// Start the quiz
showQuestion();
