const questionElement = document.getElementById('question')
const answerButton = document.getElementById('answer-buttons')
const nextButton = document.getElementById('next-btn')

let currentQuestionIndex = 0
let score = 0

async function fetchQuestions(){
  const response = await fetch('https://opentdb.com/api.php?amount=4&category=9&difficulty=easy&type=multiple')
  const data = await response.json()
  return data.results
}

function formatQuestions(apiQuestions) {
  return apiQuestions.map(q => ({
    question: q.question,
    answers: [...q.incorrect_answers, q.correct_answer].map(answer => ({
      text: answer,
      correct: answer === q.correct_answer
    }))
  }));
}

async function startQuizz() {
  resetState()
  questions = formatQuestions(await fetchQuestions())
  currentQuestionIndex = 0
  score = 0
  nextButton.innerHTML = 'Próximo'
  showQuestion()
}

function showQuestion() {
  let currentQuestion = questions[currentQuestionIndex]
  let questionNo = currentQuestionIndex + 1
  questionElement.innerHTML = questionNo + '. ' + currentQuestion.question

  // Remove all previous buttons to ensure no duplicates
  resetState()

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerHTML = answer.text
    button.classList.add('btn')
    answerButton.appendChild(button)

    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', e => {
      const selectedBtn = e.target
      const isCorrect = selectedBtn.dataset.correct === 'true'
      selectedBtn.style.pointerEvents = 'none'
      
      if (isCorrect) {
        selectedBtn.classList.add('correct')
        score++
      } else {
        selectedBtn.classList.add('incorrect')
      }

      Array.from(answerButton.children).forEach(button => {
        button.style.pointerEvents = 'none'
        if (button.dataset.correct === 'true') {
          button.classList.add('correct')
        }
      })

      nextButton.style.display = 'block'
    })
  })
}

function resetState() {
  // Hide the "Next" button
  nextButton.style.display = 'none'
  
  // Remove all answer buttons
  while (answerButton.firstChild) {
    answerButton.removeChild(answerButton.firstChild)
  }
}

function showScore() {
  resetState()
  questionElement.style.textAlign = "center"
  questionElement.innerHTML = `Sua pontuação é ${score} de 4. <br> Clique no botão abaixo para jogar novamente.`
  nextButton.innerHTML = 'Jogar novamente'
  nextButton.style.display = 'block'
}

function handleNextButton() {
  currentQuestionIndex++
  if (currentQuestionIndex < questions.length) {
    showQuestion()
  } else {
    showScore()
  }
}

nextButton.addEventListener('click', () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton()
  } else {
    startQuizz()
  }
})

startQuizz()
