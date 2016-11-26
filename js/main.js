$(document).foundation()

var index = 0;
var formContainer = document.getElementById("formContainer");
var form = document.form1;

var prevButton = document.getElementById("prevButton");
var nextButton = document.getElementById("nextButton");
var scoreButton = document.getElementById("scoreButton");

var storedAnswers = [];

var allQuestions = [
  {
    question: "Who is Prime Minister of the United Kingdom?",
    choices: ["David Cameron", "Gordon Brown", "Winston Churchill", "Tony Blair"],
    correctAnswer:0
  },
  {
    question: "Who is Prime Minister of the Netherlands?",
    choices: ["Diederik Samson", "Marc Rutte", "Geert Wilders", "Alexander Pechtold"],
    correctAnswer:1
  },
  {
    question: "In which city does the Dutch government reside?",
    choices: ["Rotterdam", "Amsterdam", "The Hague", "Utrecht"],
    correctAnswer:2
  }
];

var quizLength = allQuestions.length;

function showQuestion() {
  if(index == 0) {
    prevButton.style.display = "none";
  }
  if (index > 0) {
    prevButton.style.display = "inline";
  }
  if(index == quizLength) {
    scoreButton.style.display = "inline";
    nextButton.style.display = "none";
    form.innerHTML = "";
    return;
  }
  else {
    nextButton.style.display = "inline";
    scoreButton.style.display = "none";
  //  $("#nextButton").css("display", "inline");
  //  $("#score").css("display", "none");
  }

  var choices = allQuestions[index].choices;
  var storedAnswer = storedAnswers[index];
  var id;
  var quizItem = allQuestions[index];
  var q = document.createElement("h3");
  var text = document.createTextNode(quizItem.question);

  q.appendChild(text);
  form.appendChild(q);

  if (storedAnswer) {
    id = storedAnswer.id;
  }

  for (var i = 0; i < choices.length; i++) {
    var p = document.createElement("p");
  //  p.setAttribute("class", "");

    var input = document.createElement("input");
    input.setAttribute("id", i);
    input.setAttribute("type", "radio");
    input.setAttribute("name", "question");

    if (i == quizItem.correctAnswer) {
      input.setAttribute("value", "1");
    } else {
      input.setAttribute("value", "0");
    }

    if (i == id) {
      input.setAttribute("checked", "checked");
    }

    input.onclick = function(e) {
      var element = e.target;
      var answer = {
        id: element.id,
        value: element.value
      };
      storedAnswers.push(answer);
    }

    var label = document.createElement("label");
    var choice = document.createTextNode(choices[i]);
    label.appendChild(choice);

    p.appendChild(input);
    p.appendChild(label);
    form.appendChild(p);
  }
}
// http://jsfiddle.net/hvG7k/
function previousQuestion() {
  form.innerHTML = "";
  $("#form1").fadeOut(0, function() {
    index--;
    var show = showQuestion(index);
    $(this).attr('innerHTML', 'show').fadeIn(700);
  });
}

function nextQuestion() {
  if (storedAnswers[index] == null) {
    alert("Please choose an answer!");
    return;
  }
  else  {
    form.innerHTML = "";
    $("#form1").fadeOut(0, function() {
      index++;
      var show = showQuestion(index);
      $(this).attr('innerHTML', 'show').fadeIn(700);
    });
  }
}

function showScore() {
  prevButton.style.display = "none";
  scoreButton.style.display = "none";
  var totalScore = 0;
  for (var i = 0; i < storedAnswers.length; i++) {
    var score = parseInt(storedAnswers[i].value);
    totalScore += score;
  }

  var result = document.getElementById("result");
  var h2 = document.createElement("h2");
  result.appendChild(h2);

  if (totalScore == allQuestions.length) {
    h2.innerHTML = "Great! Your score is " + totalScore + "!";
  }
  else if (totalScore <= 1) {
    h2.innerHTML = "Not into politics are you? Your score is " + totalScore + "!";
  }
  else {
    h2.innerHTML = "Well that's not too bad! Your score is " + totalScore + "!";
  }
}

prevButton.addEventListener("click", previousQuestion);
nextButton.addEventListener("click", nextQuestion);
scoreButton.addEventListener("click", showScore);

showQuestion();
/*
var json = JSON.stringify(allQuestions);
document.write(json);
*/
