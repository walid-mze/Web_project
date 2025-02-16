const generateBtn = document.querySelector("button"); // Bouton GENERATE API URL

generateBtn.addEventListener("click", (event) => {

    const numQuestions = document.querySelector("#numQuestions").value;
    const categoryValue = document.querySelector("#category").value;
    const difficultyValue = document.querySelector("#difficulty").value;
    const typeValue = document.querySelector("#type").value;
    const encodingValue = document.querySelector("#encoding").value;
    console.log(numQuestions, categoryValue, difficultyValue, typeValue, encodingValue);
    
    // Mise à jour du message de bienvenue avec le nom de la catégorie sélectionnée
    const categorySelect = document.querySelector("#category");
    const selectedCategoryName = categorySelect.options[categorySelect.selectedIndex].text;
    document.querySelector(".start div").innerText = `Welcome to ${selectedCategoryName} QUIZ`;
    
    // Générer l'URL de l'API
    let url = `https://opentdb.com/api.php?amount=${numQuestions}`;
    if (categoryValue !== "any") {
        url += `&category=${categoryValue}`;
    }
    if (difficultyValue !== "any") {
        url += `&difficulty=${difficultyValue}`;
    }
    if (typeValue !== "any") {
        url += `&type=${typeValue}`;
    }
    if (encodingValue !== "default") {
        url += `&encode=${encodingValue}`;
    }
    
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            quizData = data.results.map(item => {
                let options = [...item.incorrect_answers, item.correct_answer];
                options.sort(() => Math.random() - 0.5);
                return {
                    ...item,
                    options: options,
                    correctAnswer: item.correct_answer
                };
            });
            console.log(quizData);
            quiz();
        })
        .catch((error) => {
            console.log(error);
        });    
    document.querySelector(".container2").style.display = "none";
    document.querySelector(".container").style.display = "block";
    
});

// Reste de votre code...
let quizData;
let currentQuestion = 0;
let score = 0;
let currentSelectedAnswer = null;
let timerInterval;

const next = document.querySelector(".next");
const start_btn = document.querySelector(".start-btn");
const start = document.querySelector(".start");
const timerEl = document.querySelector(".time");
let timeLeft = 60;
let finish = false;

function quiz(){
    // Lancement du quiz dès qu'on clique sur Start
    start_btn.addEventListener("click", () => {
        start.style.display = "none";
        document.querySelector(".upper-bar").style.display = "flex";
        next.style.display = "block";
        afficherQuestion();
        startTimer();
    });

    // Passage à la question suivante lors du clic sur "Next"
    next.addEventListener("click", function(event) {
        event.preventDefault();
        clearInterval(timerInterval);
        nextQuestion();
    });

    // Fonction appelée pour valider la réponse et afficher la question suivante
    function nextQuestion(){
        if (currentSelectedAnswer && currentSelectedAnswer.textContent === quizData[currentQuestion].correctAnswer) {
            score++;
        }
        currentQuestion++;
        currentSelectedAnswer = null;
        if (currentQuestion < quizData.length) {
            afficherQuestion();
            startTimer();
        } else {
            afficherQuestion();
        }
    }

    function afficherQuestion() {
        if (currentQuestion < quizData.length) {
            clearInterval(timerInterval);
            const answerElems = document.querySelectorAll(".options .ans");
            // Réinitialiser le style sur toutes les options et les cacher par défaut
            answerElems.forEach((ans) => {
                ans.style.backgroundColor = "rgb(238, 238, 238)";
                ans.style.display = "none";
            });

            const quizItem = quizData[currentQuestion];
            const questionElem = document.querySelector(".qst");
            questionElem.innerText = quizItem.question;

            // Déterminer le nombre d'options à afficher selon le type de question
            const numOptions = quizItem.type === "boolean" ? 2 : answerElems.length;

            for (let i = 0; i < numOptions; i++) {
                answerElems[i].innerText = quizItem.options[i];
                answerElems[i].style.display = "flex";
            }

            const qst_number = document.querySelector(".qst-num");
            qst_number.innerText = "Question " + (currentQuestion + 1) + " of " + quizData.length;
        } else {
            // Fin du quiz, afficher le score
            const last_page = document.querySelector(".last-page");
            last_page.style.display = "block";
            const score_page = document.querySelector(".score_page");
            score_page.style.display = "block";
            score_page.innerText = "Your score: " + score + "/" + quizData.length;
            const upper_bar = document.querySelector(".upper-bar");
            upper_bar.style.display = "none";
            const form = document.querySelector(".form");
            form.style.display = "none";
        }
    }

    // Permet à l'utilisateur de sélectionner une option unique et de modifier son choix
    function checkAnswer(){
        document.querySelectorAll(".ans").forEach((ans) => {
            ans.addEventListener("click", function() {
                if (currentSelectedAnswer) {
                    currentSelectedAnswer.style.backgroundColor = "rgb(238, 238, 238)";
                }
                currentSelectedAnswer = ans;
                ans.style.backgroundColor = "rgb(104, 205, 221)";
            });
        });
    }
    checkAnswer();

    function startTimer() {
        timeLeft = 10;
        timerEl.textContent = "Time left : " + timeLeft + " s";
        timerInterval = setInterval(() => {
            timeLeft--;
            timerEl.textContent = "Time left : " + timeLeft + " s";
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                finish = true;
                nextQuestion();
            }
        }, 1000);
    }
}