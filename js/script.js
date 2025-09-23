import { questionTextInOrder } from "./Question.js";

class Questionnaire {
  constructor() {
    this.currentQuestionIndex = 0;
    this.answers = new Array(questionTextInOrder.length).fill(null);
    this.init();
  }

  init() {
    this.updateQuestion();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Rating buttons
    document.getElementById("ratingButtons").addEventListener("click", (e) => {
      if (e.target.classList.contains("rating-btn")) {
        this.selectRating(parseInt(e.target.dataset.value));
      }
    });

    // Navigation buttons
    document
      .getElementById("prevBtn")
      .addEventListener("click", () => this.previousQuestion());
    document
      .getElementById("nextBtn")
      .addEventListener("click", () => this.nextQuestion());
    document
      .getElementById("finishBtn")
      .addEventListener("click", () => this.finishQuestionnaire());
  }

  selectRating(value) {
    // Remove previous selection
    document.querySelectorAll(".rating-btn").forEach((btn) => {
      btn.classList.remove("selected");
    });

    // Add selection to clicked button
    document.querySelector(`[data-value="${value}"]`).classList.add("selected");

    // Store the answer
    this.answers[this.currentQuestionIndex] = value;

    // Update navigation buttons
    this.updateNavigationButtons();
  }

  updateQuestion() {
    const questionText = document.getElementById("questionText");
    const questionNumber = document.getElementById("questionNumber");
    const progressText = document.getElementById("progressText");
    const progress = document.getElementById("progress");

    // Update question content
    questionText.textContent = questionTextInOrder[this.currentQuestionIndex];
    questionNumber.textContent = `${this.currentQuestionIndex + 1}.`;
    progressText.textContent = `Question ${this.currentQuestionIndex + 1} of ${
      questionTextInOrder.length
    }`;

    // Update progress bar
    const progressPercent =
      ((this.currentQuestionIndex + 1) / questionTextInOrder.length) * 100;
    progress.style.width = `${progressPercent}%`;

    // Clear previous rating selection
    document.querySelectorAll(".rating-btn").forEach((btn) => {
      btn.classList.remove("selected");
    });

    // Show previous answer if it exists
    if (this.answers[this.currentQuestionIndex] !== null) {
      const selectedValue = this.answers[this.currentQuestionIndex];
      document
        .querySelector(`[data-value="${selectedValue}"]`)
        .classList.add("selected");
    }

    // Update navigation buttons
    this.updateNavigationButtons();
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const finishBtn = document.getElementById("finishBtn");

    // Previous button
    prevBtn.disabled = this.currentQuestionIndex === 0;

    // Next/Finish button logic
    const hasAnswer = this.answers[this.currentQuestionIndex] !== null;
    const isLastQuestion =
      this.currentQuestionIndex === questionTextInOrder.length - 1;

    if (isLastQuestion) {
      nextBtn.style.display = "none";
      finishBtn.style.display = hasAnswer ? "inline-block" : "none";
    } else {
      nextBtn.style.display = "inline-block";
      nextBtn.disabled = !hasAnswer;
      finishBtn.style.display = "none";
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.updateQuestion();
    }
  }

  nextQuestion() {
    if (
      this.currentQuestionIndex < questionTextInOrder.length - 1 &&
      this.answers[this.currentQuestionIndex] !== null
    ) {
      this.currentQuestionIndex++;
      this.updateQuestion();
    }
  }

  finishQuestionnaire() {
    // Check if all questions are answered
    const unansweredQuestions = this.answers.some((answer) => answer === null);

    if (unansweredQuestions) {
      alert("Please answer all questions before finishing.");
      return;
    }

    // Hide questionnaire and show results
    document.querySelector(".question-container").style.display = "none";
    document.querySelector(".navigation").style.display = "none";
    document.querySelector(".progress-bar").style.display = "none";
    document.querySelector(".progress-text").style.display = "none";
    document.getElementById("results").style.display = "block";

    // Log results to console (you can process these however you need)
    console.log("Questionnaire Results:", this.answers);
    console.log(
      "Total Score:",
      this.answers.reduce((sum, score) => sum + score, 0)
    );

    // You can add code here to save results to a database, local storage, etc.
    this.saveResults();
  }

  saveResults() {
    // Save to localStorage for now
    const results = {
      timestamp: new Date().toISOString(),
      answers: this.answers,
      totalScore: this.answers.reduce((sum, score) => sum + score, 0),
    };

    localStorage.setItem("perfectionismResults", JSON.stringify(results));
  }
}

// Initialize the questionnaire when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new Questionnaire();
});
