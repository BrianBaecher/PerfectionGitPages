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

    grader = new Grader(this.answers);

    mpsScoreText = document.getElementById("mps-score");
    sopScoreText = document.getElementById("sop-score");
    oopScoreText = document.getElementById("oop-score");
    sppScoreText = document.getElementById("spp-score");

    document.querySelector(".question-container").style.display = "none";
    document.querySelector(".navigation").style.display = "none";
    document.querySelector(".progress-bar").style.display = "none";
    document.querySelector(".progress-text").style.display = "none";
    document.getElementById("results").style.display = "block";

    mpsScoreText.textContent = `Multi-Dimensional Perfectionism Scale: ${grader.MPS_score}`;
    sopScoreText.textContent = `Self-Oriented Perfectionism Scale: ${grader.SOP_score}`;
    oopScoreText.textContent = `Other-Oriented Perfectionism Scale: ${grader.OOP_score}`;
    sppScoreText.textContent = `Socially Prescribed Perfectionism Scale: ${grader.SPP_score}`;
  }
}

class Grader{
    /* 
    To score the MPS, first, the following items should be reversed:
    2, 3, 4, 8, 9, 10, 12, 19, 21, 24, 30, 34, 36, 37, 38, 43, 44, 45
    
    The self-oriented perfectionism subscale is scored by summing:
    1, 6, 8, 12,14,15,17 20, 23, 28, 32, 34, 36, 40, 42
    
    The other-oriented perfectionism subscale is scored by summing:
    2, 3, 4, 7, 10, 16, 19, 22, 24, 26, 27, 29, 38, 43, 45
    
    The socially prescribed perfectionism subscale is scored by summing:
    5, 9, 11, 13, 18, 21, 25, 30, 31, 33, 35, 37, 39, 41, 44
    */

   MPS_NUMS = new Set(2, 3, 4, 8, 9, 10, 12, 19, 21, 24, 30, 34, 36, 37, 38, 43, 44, 45);
   SOP_NUMS = new Set(1, 6, 8, 12,14,15,17, 20, 23, 28, 32, 34, 36, 40, 42)
   OOP_NUMS = new Set(2, 3, 4, 7, 10, 16, 19, 22, 24, 26, 27, 29, 38, 43, 45);
   SPP_NUMS = new Set(5, 9, 11, 13, 18, 21, 25, 30, 31, 33, 35, 37, 39, 41, 44);

   MPS_score;
   SOP_score;
   OOP_score;
   SPP_score;

   /**
    *
    */
   constructor(answers) {
    super();
    for(i = 0; i < answers.length; i++){
        orderNum = i + 1;
        if(this.MPS_NUMS.has(orderNum) ){
            this.MPS_score += this.reverseScore(answers[i])
        }else{
            this.MPS_score+=answers[i];
        }

        if(this.SOP_NUMS.has(orderNum)){
            this.SOP_score += answers[i];
        }

        if(this.OOP_NUMS.has(orderNum)){
            this.OOP_score += answers[i];
        }

        if(this.SPP_NUMS.has(orderNum)){
            this.SPP_score += answers[i];
        }
    }
   }

   reverseScore(score) {
        const ansScaleReversed = [7,6,5,4,3,2,1];
        return ansScaleReversed[score-1];
   }
}



document.addEventListener("DOMContentLoaded", () => {
  new Questionnaire();
});
