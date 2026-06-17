import { fetchQuestions } from "./api.js";

let gameState = {
  username: "",
  maxQuestions: 5,
  categoryID: "9",
  questionsArray: [],
  currentIndex: 0,
};

function createScoreKeeper() {
  let currentScore = 0;
  return {
    addPoint: function () {
      currentScore += 1;
    },
    readPoints: function () {
      return currentScore;
    },
  };
}

let sessionScoreTracker = createScoreKeeper();

document.addEventListener("DOMContentLoaded", () => {
  const setupForm = document.getElementById("setupForm");
  const quizBox = document.getElementById("quizBox");
  const leaderboardTable = document.getElementById("leaderboardTable");

  if (setupForm) {
    setupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("username").value;
      const amountInput = document.getElementById("amount").value;
      const catInput = document.getElementById("category").value;
      localStorage.setItem("active_user", nameInput);
      localStorage.setItem("game_amount", amountInput);
      localStorage.setItem("game_category", catInput);
      const feedback = document.getElementById("formFeedback");
      feedback.textContent =
        "Configuration saved successfully! Redirecting to Arena...";
      setTimeout(() => {
        window.location.href = "arena.html";
      }, 1200);
    });

    document.getElementById("username").addEventListener("input", (e) => {
      const label = document.getElementById("nameLabel");
      if (e.target.value.length < 3) {
        label.style.color = "#c0392b";
      } else {
        label.style.color = "initial";
      }
    });
  }

  if (quizBox || document.getElementById("gameSection")) {
    gameState.username =
      localStorage.getItem("active_user") || "Anonymous Guest";
    gameState.maxQuestions = localStorage.getItem("game_amount") || 5;
    gameState.categoryID = localStorage.getItem("game_category") || "9";
    const welcomeDiv = document.getElementById("playerWelcome");
    if (welcomeDiv)
      welcomeDiv.textContent = `Active Competitor: ${gameState.username}`;
    loadTriviaData();
  }

  if (leaderboardTable) {
    renderLeaderboardRecords();
    document.getElementById("clearScoresBtn").addEventListener("click", () => {
      localStorage.removeItem("scoreboard_data");
      renderLeaderboardRecords();
    });
  }
});

async function loadTriviaData() {
  const loading = document.getElementById("loadingIndicator");
  const errorBox = document.getElementById("errorMessage");
  const quizBox = document.getElementById("quizBox");
  loading.classList.remove("hidden");
  errorBox.classList.add("hidden");
  try {
    const questions = await fetchQuestions(
      gameState.maxQuestions,
      gameState.categoryID,
    );
    gameState.questionsArray = questions;
    loading.classList.add("hidden");
    quizBox.classList.remove("hidden");
    displayQuestionCard();
  } catch (err) {
    loading.classList.add("hidden");
    errorBox.textContent = `Application System Warning: ${err.message}`;
    errorBox.classList.remove("hidden");
  }
}

function displayQuestionCard() {
  const currentQuestion = gameState.questionsArray[gameState.currentIndex];
  document.getElementById("currentNum").textContent =
    `${gameState.currentIndex + 1} / ${gameState.questionsArray.length}`;
  document.getElementById("scoreDisplay").textContent =
    `Score: ${sessionScoreTracker.readPoints()}`;
  const questionTextEl = document.getElementById("questionText");
  questionTextEl.innerHTML = currentQuestion.question;
  const optionsGrid = document.getElementById("answerButtons");
  optionsGrid.innerHTML = "";
  let optionsList = [...currentQuestion.incorrect_answers];
  const insertionPoint = Math.floor(Math.random() * (optionsList.length + 1));
  optionsList.splice(insertionPoint, 0, currentQuestion.correct_answer);
  optionsList.forEach((textOption) => {
    const optionButton = document.createElement("button");
    optionButton.className = "answer-btn";
    optionButton.innerHTML = textOption;
    optionButton.addEventListener("click", () =>
      handleSelectedAnswer(textOption, currentQuestion.correct_answer),
    );
    optionsGrid.appendChild(optionButton);
  });
}
