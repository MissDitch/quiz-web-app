var allQuestions = [
  {
    question: "Who is Prime Minister of the United Kingdom?",
    choices: ["David Cameron", "Gordon Brown", "Winston Churchill", "Tony Blair"],
    correctAnswer:0
  },
  {
    question: "Waar komt de zon op?",
    choices: ["noord", "west", "zuid", "oost"],
    correctAnswer:3
  }
];

var quizLength = allQuestions.length;
var count = 0;
var score = 0;
var button = document.getElementById("btn");
var choices = allQuestions[count].choices;
var quizItem = allQuestions[count];
var form = document.form1;

/*
while (count <= quizLength ) {
}
if (count > quizLength) {
  showScore();
}
*/
function nextQuestion() {
  removeQuestion();

  var q = document.createElement("h3");
  var text = document.createTextNode(quizItem.question);
  q.appendChild(text);
  form.appendChild(q);

    for (var i = 0; i < choices.length; i++) {
      var p = document.createElement("p");

      var input = document.createElement("input");

      input.setAttribute("type", "radio");
      input.setAttribute("name", "question");
      if (i == 0) {
        input.setAttribute("checked", "checked");
      }
      if (i == quizItem.correctAnswer) {
        input.setAttribute("value", "10");
      }
      else {
        input.setAttribute("value", "0");
      }

      var label = document.createElement("label");
      var choice = document.createTextNode(choices[i]);
      label.appendChild(choice);

      p.appendChild(input);
      p.appendChild(label);

      form.appendChild(p);
    }

}

function removeQuestion() {
  while (form.hasChildNodes()) {
    form.removeChild(form.lastChild);
  }
}

function getAnswer() {
  var value = 0;
  var radios = document.form1.elements["question"];
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      value = parseInt(radios[i].value);

    }
  }
  count++;
  score += value;
}

function showScore() {
  var finalScore = document.getElementById("score");
  finalScore.innerHTML = "Uw score is " + score;
}

button.addEventListener("click", getAnswer);
//button.addEventListener("click", removeQuestion);
button.addEventListener("click", nextQuestion);

nextQuestion();
