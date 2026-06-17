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
