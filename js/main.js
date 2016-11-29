$(document).foundation()

if (Modernizr.localstorage) {
  // window.localStorage is available!
} else {
  alert("no native support for HTML5 storage: (maybe try dojox.storage or a third-party solution ");
}

var topBarRight = document.getElementById("topBarRight");
var login = document.getElementById("login");
var input1 = document.getElementById("userName");
var input2 = document.getElementById("passWord");
//input1.value = "";
//input2.value = "";

var logout = document.getElementById("logout");
var user = document.getElementById("user");

var loginForm = document.loginForm;
var loginBtn = document.getElementById("loginBtn");
var accountBtn = document.getElementById("accountBtn");
var userWarning = document.getElementById("userWarning");
var passWarning = document.getElementById("passWarning");

var quiz = document.getElementById("quiz");
quiz.style.display = "none";
topBarRight.style.display = "none";

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


function checkForm(e) {
  e.preventDefault();
  userWarning.innerHTML = "";
  var userName = input1.value;
  var passWord = input2.value;

  if (userName == "" || passWord == "") {
    if (userName == "") {
      userWarning.innerHTML = "Please enter your username";
      loginForm.userName.focus();
    }
    else {
      passWarning.innerHTML = "Please enter your password";
      loginForm.passWord.focus();
    }
  }
  else {
    if (e.target == loginBtn) {
      logIn(userName, passWord);
    }
    if (e.target == accountBtn) {
      createAccount(userName, passWord);
    }
  }
}

function createAccount(username, password) {
  userWarning.innerHTML = "";
  passWarning.innerHTML = "";
  localStorage.setItem("userName", username);
  localStorage.setItem("passWord", password);
  localStorage.setItem("visit", 0);
  passWarning.innerHTML = "Account created, please enter your username and password";
//  alert ("account created");
  input1.value = "";
  input2.value = "";
}


function logIn(username, password) {
  passWarning.innerHTML = "";
  var storedUserName = localStorage.getItem("userName");
  var storedPassWord = localStorage.getItem("passWord");
  var visit = parseInt(localStorage.getItem("visit"));
  visit++;
  localStorage.setItem("visit", visit);
  var welcome = document.getElementById("welcome");

  if (storedUserName == username  && storedPassWord == password) {
    login.setAttribute("style", "display:none");
    topBarRight.setAttribute("style", "display:visible");
    user.innerHTML = storedUserName;
    quiz.setAttribute("style", "display:visible");
    if (visit == 1) {
      welcome.innerHTML = "Welcome to this quiz, " + storedUserName + "!";
    }
    else if (visit > 1) {
      welcome.innerHTML = "Welcome back to this quiz, " + storedUserName + "!";
    }
  }
  else {
  //  alert("username or password are not correct, please try again");
    passWarning.innerHTML = "Username or password are not correct, <br>please try again";
    input1.value = "";
    input2.value = "";
    loginForm.userName.focus();
  }
  input1.value = "";
  input2.value = "";
}

function logOut(e) {
  e.preventDefault();
  login.setAttribute("style", "display:visible");
  topBarRight.setAttribute("style", "display:none");
  quiz.setAttribute("style", "display:none");

}




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
    var h2 = document.createElement("h2");
    h2.innerHTML = "That's it! Would you like to see your score?";
    form.appendChild(h2);
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
  welcome.innerHTML = "";

  form.innerHTML = "";
  $("#form1").fadeOut(0, function() {
    index--;
    var show = showQuestion(index);
    $(this).attr('innerHTML', 'show').fadeIn(300);
  });
}

function nextQuestion() {
  if (storedAnswers[index] == null) {
    alert("Please choose an answer!");
    return;
  }
  else  {
    welcome.innerHTML = "";

    form.innerHTML = "";
    $("#form1").fadeOut(0, function() {
      index++;
      var show = showQuestion(index);
      $(this).attr('innerHTML', 'show').fadeIn(300);
    });
  }
}

function showScore() {
  form.innerHTML = "";
  prevButton.style.display = "none";
  scoreButton.style.display = "none";
  var totalScore = 0;
  for (var i = 0; i < storedAnswers.length; i++) {
    var score = parseInt(storedAnswers[i].value);
    totalScore += score;
  }

  var h2 = document.createElement("h2");
  form.appendChild(h2);

  if (totalScore == allQuestions.length) {
    h2.innerHTML = "Great! Your score is " + totalScore + "!";
  }
  else if (totalScore <= 1) {
    h2.innerHTML = "You could use a litte practice! Your score is " + totalScore + ".";
  }
  else {
    h2.innerHTML = "Well that's not too bad! Your score is " + totalScore + ".";
  }
}


loginBtn.addEventListener("click", checkForm);
//loginBtn.addEventListener("click", checkForm);
accountBtn.addEventListener("click", checkForm);

logout.addEventListener("click", logOut);

prevButton.addEventListener("click", previousQuestion);
nextButton.addEventListener("click", nextQuestion);
scoreButton.addEventListener("click", showScore);

//localStorage.setItem("userName", "");
//localStorage.setItem("passWord", "");

showQuestion();
/*
var json = JSON.stringify(allQuestions);
document.write(json);
*/
