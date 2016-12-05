$(document).foundation()

if (Modernizr.localstorage) {
  // window.localStorage is available!
} else {
  alert("no native support for HTML5 storage: (maybe try dojox.storage or a third-party solution ");
}

var topBarLeft = document.getElementById("topBarLeft");
var topBarRight = document.getElementById("topBarRight");
var user = document.getElementById("user");
var logout = document.getElementById("logout");

var welcome = document.getElementById("welcome");

var login = document.getElementById("login");
var loginForm = document.loginForm;
var input1 = document.getElementById("userName");
var userWarning = document.getElementById("userWarning");
var input2 = document.getElementById("passWord");
var passWarning = document.getElementById("passWarning");

var loginBtn = document.getElementById("loginBtn");
var accountBtn = document.getElementById("accountBtn");

var actualPlayer;
var playerString = localStorage.getItem("playerArray");
var playerArray = JSON.parse(playerString);

var message = document.getElementById("message");

var startButton = document.getElementById("startButton");
var quizContainer = document.getElementById("quizContainer");
var quizNotify  = document.getElementById("quizNotify");
var allQuestions;
var quizLength;
var choices;
var storedAnswers;
var index;
var formContainer = document.getElementById("formContainer");
var form = document.form1;
var warning = document.getElementById("warning");

var quizButtons = document.getElementById("quizButtons");
var prevButton = document.getElementById("prevButton");
var nextButton = document.getElementById("nextButton");
var scoreButton = document.getElementById("scoreButton");


quizContainer.setAttribute("style", "display:none");
topBarRight.setAttribute("style", "display:none");

//start.setAttribute("style", "display:none");
quizButtons.setAttribute("style", "display:none");
loginBtn.addEventListener("click", checkForm);
accountBtn.addEventListener("click", checkForm);
logout.addEventListener("click", logOut);
startButton.addEventListener("click", startQuiz);
resumeButton.addEventListener("click", resumeQuiz);

// thanks to https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
// this function loads the quiz questions from external JSON file
function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'http://localhost/quiz-web-app/js/quizQuestions.json', true);
  //xobj.open('GET', 'file:///C:/Users/Marian standaard/Projecten/quiz-web-app/js/quizQuestions.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState === 4 && xobj.status === 200) {
      /* Required use of an anonymous callback as .open will NOT return a value
      but simply returns undefined in asynchronous mode  */
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function init() {
  loadJSON(function(response) {
    // Parse JSON string into object
    allQuestions = JSON.parse(response);
    localStorage.setItem("allQuestions", response);
  });
}


//checks if username and password are entered
function checkForm(e) {
  e.preventDefault();
  userWarning.innerHTML = "";
  var userName = input1.value;
  var passWord = input2.value;

  if (userName === "" || passWord === "") {
    if (userName === "") {
      userWarning.innerHTML = "Please enter your username";
      loginForm.userName.focus();
    }
    else {
      passWarning.innerHTML = "Please enter your password";
      loginForm.passWord.focus();
    }
  }
  else {
    if (e.target === loginBtn) {
      //if user clicked the login button
      logIn(userName, passWord);
    }
    if (e.target === accountBtn) {
      //if user clicked the create account button
      createAccount(userName, passWord);
    }
  }
}

function Player(username, password) {
  this.userName = username;
  this.passWord = password;
  this.getUserName = function() {
    return this.userName;
  }
  this.getPassWord = function() {
    return this.passWord;
  }
  this.storedScores = [];
  this.visits = 0;
  this.finished = true;
  this.answerAt = 0;
  this.storedAnswers = [];
}

Player.prototype.greet = function() {
  console.log("Hi, I'm " + this.userName);
}
//Player.prototype.finished = false;


function createAccount(username, password) {
  userWarning.innerHTML = "";
  passWarning.innerHTML = "";

  player = new Player(username, password);
  playerArray.push(player);
  localStorage.setItem("playerArray", JSON.stringify(playerArray));
  accountNotify.innerHTML = "Account created, please enter your username and password";
  input1.value = "";
  input2.value = "";
}

function logIn(username, password) {
//  passWarning.setAttribute("style", "display:none");
//  accountNotify.setAttribute("style", "display:none");
  createAccount.innerHTML = "";
  var playerString = localStorage.getItem("playerArray");
  playerArray = JSON.parse(playerString);
  console.log(playerArray);

  for (var i = 0; i < playerArray.length; i++) {
    var player = playerArray[i];
  //  console.log(player.getUserName());
    if (player.userName === username && player.passWord === password) {
      console.log(player);
      actualPlayer = player;
      storedAnswers = actualPlayer.storedAnswers;
      index = actualPlayer.answerAt;

      login.setAttribute("style", "display:none");
      welcome.setAttribute("style", "display:none");
      //hides login panel and shows username and logout option
      topBarRight.setAttribute("style", "display:visible");
      user.innerHTML = player.userName;
      //shows welcome message and startbutton
      quizContainer.setAttribute("style", "display:visible");
      // three parts of quizContainer:
      quizNotify.setAttribute("style", "display:visible");
      formContainer.setAttribute("style", "display:none");
      quizButtons.setAttribute("style", "display:none");

      if (actualPlayer.visits === 0) {
          message.innerHTML = "Welcome to this quiz, " + actualPlayer.userName + "! <br />Would you like to start?";
          startButton.setAttribute("style", "display:visible");
          resumeButton.setAttribute("style", "display:none");
      }
      else if (actualPlayer.visits > 0) {
        if (actualPlayer.finished === false) {
          message.innerHTML = "Welcome back " + actualPlayer.userName + "! <br />You want to finish the quiz?";
          startButton.setAttribute("style", "display:none");
          resumeButton.setAttribute("style", "display:visible");
        }
        else {
          message.innerHTML = "Welcome back " + actualPlayer.userName + "!<br />Would you like to retake the quiz?";
          startButton.setAttribute("style", "display:visible");
          resumeButton.setAttribute("style", "display:none");
        }
      }
    }
    else if (player.userName != username || player.passWord != password){
      passWarning.innerHTML = "Username or password are not correct, <br>please try again";
      input1.value = "";
      input2.value = "";
      loginForm.userName.focus();
    }
    input1.value = "";
    input2.value = "";
  }
}


function logOut(e) {
  e.preventDefault();
  login.setAttribute("style", "display:visible");
  passWarning.setAttribute("style", "display:none");
  //shows login panel and hides username and logout option
  topBarRight.setAttribute("style", "display:none");
  quizContainer.setAttribute("style", "display:none");
  if (actualPlayer.finished){
    actualPlayer.answerAt = 0;
    actualPlayer.storedAnswers.length = 0;
  }
  else {
    actualPlayer.answerAt = index;
    actualPlayer.storedAnswers = storedAnswers;
  }

  actualPlayer.visits += 1;
  localStorage.setItem("playerArray", JSON.stringify(playerArray));
}

function startQuiz() {
  index = actualPlayer.answerAt;
  quizNotify.setAttribute("style", "display:none");
  formContainer.setAttribute("style", "display:visible");
  quizButtons.setAttribute("style", "display:visible");

  actualPlayer.finished = false;
  if (storedAnswers.length > 0) {
    //storedAnswers.splice(0, storedAnswers.length); //empty the array
    storedAnswers.length = 0;  //empty the array
  }
  var stringQuestions = localStorage.getItem("allQuestions");
  // Parse JSON string into object
  allQuestions = JSON.parse(stringQuestions);
  quizLength = allQuestions.length;

  showQuestion();
}

function resumeQuiz() {
  index = actualPlayer.answerAt;
  quizNotify.setAttribute("style", "display:none");
  formContainer.setAttribute("style", "display:visible");
  quizButtons.setAttribute("style", "display:visible");

  var stringQuestions = localStorage.getItem("allQuestions");
  // Parse JSON string into object
  allQuestions = JSON.parse(stringQuestions);
  quizLength = allQuestions.length;
  storedAnswers = actualPlayer.storedAnswers

  showQuestion();
}

function showQuestion() {
  if(index === 0) {
    //there is no previous question when first question is shown
    prevButton.setAttribute("style", "display:none");
  }
  if (index > 0) {
    prevButton.style.display = "inline";
  }
  if(index === quizLength) {
    //only if last question is shown user can see the score
    scoreButton.setAttribute("style", "display:visible");
    //scoreButton.style.display = "inline";
    nextButton.setAttribute("style", "display:none");
    //prevButton still visible so user can go back and change answers
    var h2 = document.createElement("h2");
    h2.innerHTML = "That's it! Would you like to see your score?";
    form.appendChild(h2);
    return;
  }
  else {
    nextButton.setAttribute("style", "display:visible");
    //nextButton.style.display = "inline";
    scoreButton.setAttribute("style", "display:none");
  }

  // display of question at given index:
  var quizItem = allQuestions[index];
  var q = document.createElement("h3");
  var text = document.createTextNode(quizItem.question);

  q.appendChild(text);
  form.appendChild(q);
  var storedAnswer = storedAnswers[index];
  var id;
  //if question has been answered already
  if (storedAnswer) {
    id = storedAnswer.id;
  }

  // display of choices, belonging to the questions at given index:
  choices = allQuestions[index].choices;

  for (var i = 0; i < choices.length; i++) {
    var p = document.createElement("p");

    var input = document.createElement("input");
    input.setAttribute("id", i);
    input.setAttribute("type", "radio");
    input.setAttribute("name", "question");

    if (i === quizItem.correctAnswer) {
      input.setAttribute("value", "1");
    } else {
      input.setAttribute("value", "0");
    }

    if (i == id) {
      // if question is already answered, id has a value
      input.setAttribute("checked", "checked");
    }
    //if radiobutton is clicked, the chosen answer is stored in a separate array: storedAnswers
    input.addEventListener("click", storeAnswer);

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
  //shows previous question, with chosen answer checked
  index--;
  form.innerHTML = "";
  $("#form1").fadeOut(0, function() {
    //index--;
    var show = showQuestion();
    $(this).attr('innerHTML', 'show').fadeIn(300);
  });
}

function nextQuestion() {

  //shows next question only if answer has been chosen
  if (storedAnswers[index] == null) {
    warning.innerHTML = "Please choose an answer!";
    return;
  }
  index++;
    warning.innerHTML = "";
    form.innerHTML = "";
    $("#form1").fadeOut(0, function() {
      var show = showQuestion();
      $(this).attr('innerHTML', 'show').fadeIn(300);
    });

}

function storeAnswer(e) {
    var element = e.target;
    var answer = {
      id: element.id,
      value: element.value
    };
    storedAnswers[index] = answer;
}


function showScore() {
  form.innerHTML = "";
  prevButton.setAttribute("style", "display:none");
  scoreButton.setAttribute("style", "display:none");

  quizNotify.setAttribute("style", "display:visible");
  startButton.setAttribute("style", "display:visible");
  resumeButton.setAttribute("style", "display:none");

  var totalScore = 0;
  actualPlayer.finished = true;

  for (var i = 0; i < storedAnswers.length; i++) {
    var score = parseInt(storedAnswers[i].value);
    totalScore += score;
  }


  if (totalScore === allQuestions.length) {
    message.innerHTML = "Great! Your score is " + totalScore + "!<br />You can do the quiz again, although you don't really need to!";
  }
  else if (totalScore <= 1) {
    message.innerHTML = "You could use a litte practice! Your score is " + totalScore + ".<br />Would you like to do the quiz again?";
  }
  else {
    message.innerHTML = "Well that's not too bad! Your score is " + totalScore + ".<br />Would you like to do the quiz again?";
  }
  actualPlayer.score = totalScore;
  actualPlayer.storedScores.push(totalScore);
}

prevButton.addEventListener("click", previousQuestion);
nextButton.addEventListener("click", nextQuestion);
scoreButton.addEventListener("click", showScore);

init();
