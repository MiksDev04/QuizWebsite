// ================= functionalities of user interface=======================

// import questions from dieffrent quizzes
import { general_knowledge } from "./general_knowledge.js";
import { math_quiz } from "./math_quiz.js";
import { science_quiz } from "./science_quiz.js";
import { english_quiz } from "./english_quiz.js";
import { history_quiz } from "./history_quiz.js";
import { technology_quiz } from "./technology_quiz.js";

// define elements for overall user interaction
const subjectContainer = document.querySelector(".subjects");
const subjects = document.querySelectorAll(".subjects a");
const menu = document.querySelector("#menu");
const questionsContainer = document.querySelector(".questions");
const questionHolder = document.querySelector(".question-no");
const questionChoices = document.querySelectorAll(".questions ul li");
const nextButton = document.getElementById("next");
const subjectForQuiz = document.getElementById("subject-for-quiz");
const questionP = document.querySelector(".questions p");
const quizStart = document.querySelector(".quiz-start");
let questionNo = 0;
let random;
let score = 0;
let isMenuShow = false;

function menuShow() {
    if (isMenuShow === false) {
        subjectContainer.style.height = "400px";
        setTimeout(() => {
            subjects.forEach((subject) => {
                subject.style.position = "static";
                subject.style.display = "block";
            });
        }, 200);
        isMenuShow = true;
    } else {
        subjectContainer.style.height = "44px";
        setTimeout(() => {
            subjects.forEach((subject) => {
                subject.style.position = "absolute";
                subject.style.display = "none";
            });
        }, 200);
        isMenuShow = false;
    }
}
menu.addEventListener("click", menuShow);

window.addEventListener("resize", () => {
    if (window.innerWidth >= 648) {
        subjects.forEach((subject) => {
            subject.style.position = "static";
            subject.style.display = "block";
            subjectContainer.style.height = "auto";
        });
    } else {
        subjects.forEach((subject) => {
            subject.style.position = "absolute";
            subject.style.display = "none";
            subjectContainer.style.height = "45px";
        });
    }
});

//  default subject for quiz
document.querySelector(".quiz-start h3").textContent =
    document.querySelector(".selected-subject").textContent;

// subject selection color
subjects.forEach((subject) => {
    subject.addEventListener("click", (event) => {
        subjects.forEach((link) => link.classList.remove("selected-subject"));
        event.target.classList.add("selected-subject");
        document.querySelector(".quiz-start h3").textContent =
            document.querySelector(".selected-subject").textContent;
        document.querySelector(".score").textContent = ``;
    });
});

// fade when choose a subject
subjects.forEach((subject) => {
    subject.addEventListener("click", () => {
        if (window.innerWidth < 648) {
            subjectContainer.style.height = "45px";
            setTimeout(() => {
                subjects.forEach((subject) => {
                    subject.style.position = "absolute";
                    subject.style.display = "none";
                });
            }, 200);
            isMenuShow = false;
        }
    });
});

// =====================Quiz answering process============================

let questions;

// generate a copy of questions
function generateQuestions(element) {
    return element;
}
// answering questions
function quizTime() {
    let subjectGenerated = "General Knowledge";
    score = 0;
    switch(document.querySelector(".selected-subject").textContent) {
        case "General Knowledge":
            subjectGenerated = general_knowledge;
            break;
        case "Math":
            subjectGenerated = math_quiz;
            break;
        case "Science":
            subjectGenerated = science_quiz;
            break;
        case "English":
            subjectGenerated = english_quiz;
            break;
        case "History":
            subjectGenerated = history_quiz;
            break;
        case "Technology":
            subjectGenerated = technology_quiz;
            break;
    }

    subjectContainer.style.display = 'none';
    questions = subjectGenerated.map(generateQuestions);
    document.querySelector(".score").textContent = ``;
    questionsContainer.style.display = "grid";
    quizStart.style.display = "none";
    randomQuestion();
}

// subject selected for quiz
function randomQuestion() {
    questionNo++;
    if (questionNo <= 10) {
        // cannot click next button until the user answer the question.
        nextButton.removeEventListener("click", randomQuestion);

        // generate random questions
        random = Math.floor(Math.random() * questions.length);
        questionHolder.textContent = `${questionNo}. ` + questions[random].question;
        questionChoices[0].textContent = "a. " + questions[random].a;
        questionChoices[1].textContent = "b. " + questions[random].b;
        questionChoices[2].textContent = "c. " + questions[random].c;
        questionChoices[3].textContent = "d. " + questions[random].d;
        questionP.textContent = `${questionNo}. ` + `out of 10 question`;
        questionChoices.forEach((choices) => {
            choices.classList.remove("correct-user-answer", "wrong-user-answer");
            choices.addEventListener("click", answeringProcess);
        });
    } else {
        document.querySelector(".score").textContent = `score: ${score}/10`;
        questionsContainer.style.display = "none";
        quizStart.style.display = "flex";
        subjectContainer.style.display = 'grid';
        questionNo = 0;
    }

    console.log(questions);
}

// remove the question if it is already showed up
function removeQuestion(random) {
    // remove the question
    questions.splice(random++, 1);
}

// answering from choices
function answeringProcess(event) {
    questionChoices.forEach((choices) => {
        choices.removeEventListener("click", answeringProcess);
    });

    let userAnswer = event.target.textContent;
    console.log(userAnswer);
    if (questions[random].answer === userAnswer.slice(3)) {
        event.target.classList.add("correct-user-answer");
        score++;
    } else {
        event.target.classList.add("wrong-user-answer");
        correctAnswer();
    }
    nextButton.addEventListener("click", randomQuestion);
    removeQuestion(random);
}

//find correct answer
function correctAnswer() {
    switch (questions[random].answer) {
        case questions[random].a:
            questionChoices[0].classList.add("correct-user-answer");
            break;
        case questions[random].b:
            questionChoices[1].classList.add("correct-user-answer");
            break;
        case questions[random].c:
            questionChoices[2].classList.add("correct-user-answer");
            break;
        case questions[random].d:
            questionChoices[3].classList.add("correct-user-answer");
            break;
    }
}

document.querySelector('.close-container').addEventListener('click', function (){
    questionsContainer.style.display = "none";
    quizStart.style.display = "flex";
    subjectContainer.style.display = 'grid';
    questionNo = 0;
})

// nextButton.addEventListener('click', quizTime);
nextButton.addEventListener("click", randomQuestion);
subjectForQuiz.addEventListener("click", quizTime);
