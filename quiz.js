document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.querySelector("#quiz");
  const questionCountEl = quizContainer.querySelector(".question-count");
  const questionEl = quizContainer.querySelector(".question");
  const answersEl = quizContainer.querySelector(".answers");
  const timerEl = quizContainer.querySelector(".timer");
  const resultsContainer = document.querySelector(".results");
  const resultsTableBody = document.querySelector("#resultsTable");

  const apiUrl = "https://jsonplaceholder.typicode.com/posts";
  const numQuestions = 10;
  let questions = [];
  let currentQuestionIndex = 0;
  let userAnswers = [];
  let countdownInterval;
  let timeLeft = 30;

  async function fetchQuestions() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.slice(0, numQuestions);
  }

  function parseD(text) {
    const words = text.split(" ");
    return [
      "A: " + words[0],
      "B: " + words[1],
      "C: " + words[2],
      "D: " + words[3],
    ];
  }

  function displayQuestion() {
    const question = questions[currentQuestionIndex];
    questionEl.textContent = `${currentQuestionIndex + 1}. ${question.title}`;
    questionCountEl.textContent = `Soru ${
      currentQuestionIndex + 1
    } / ${numQuestions}`;
    const choices = parseD(question.body);

    answersEl.innerHTML = "";
    choices.forEach((choice) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.textContent = choice;
      button.disabled = true;
      button.addEventListener("click", () => handleAnswer(choice));
      li.appendChild(button);
      answersEl.appendChild(li);
    });

    startCountdown();
  }

  function startCountdown() {
    clearInterval(countdownInterval);
    timeLeft = 30;
    timerEl.textContent = `Kalan Süre: ${timeLeft} saniye`;

    countdownInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = `Kalan Süre: ${timeLeft} saniye`;

      if (timeLeft === 20) {
        const buttons = answersEl.querySelectorAll("button");
        buttons.forEach((button) => (button.disabled = false));
        buttons.forEach((button) => button.classList.add("active"));
      }

      if (timeLeft === 0) {
        clearInterval(countdownInterval);
        nextQuestion();
      }
    }, 1000);
  }

  function handleAnswer(answer) {
    userAnswers.push({
      question: questions[currentQuestionIndex].title,
      answer,
    });
    clearInterval(countdownInterval);
    nextQuestion();
  }

  function nextQuestion() {
    if (currentQuestionIndex < numQuestions - 1) {
      currentQuestionIndex++;
      displayQuestion();
    } else {
      showResults();
    }
  }

  function showResults() {
    quizContainer.style.display = "none";
    resultsContainer.style.display = "block";
    userAnswers.forEach((answer) => {
      const row = document.createElement("tr");
      const questionCell = document.createElement("td");
      questionCell.textContent = answer.question;
      const answerCell = document.createElement("td");
      answerCell.textContent = answer.answer;
      row.appendChild(questionCell);
      row.appendChild(answerCell);
      resultsTableBody.appendChild(row);
    });
  }

  fetchQuestions().then((data) => {
    questions = data;
    displayQuestion();
  });
});
