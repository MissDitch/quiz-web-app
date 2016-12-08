$(document).foundation()

if (Modernizr.localstorage) {
  // window.localStorage is available!
} else {
  alert("no native support for HTML5 storage: (maybe try dojox.storage or a third-party solution ");
}

var topBarLeft = document.getElementById("topBarLeft"),
    topBarRight = document.getElementById("topBarRight"),
    user = document.getElementById("user"),
    total = document.getElementById("total"),
    logout = document.getElementById("logout");

var welcome = document.getElementById("welcome");

var login = document.getElementById("login"),
    loginForm = document.loginForm,
    input1 = document.getElementById("userName"),
    userWarning = document.getElementById("userWarning"),
    input2 = document.getElementById("passWord"),
    passWarning = document.getElementById("passWarning");

var loginBtn = document.getElementById("loginBtn"),
    accountBtn = document.getElementById("accountBtn"),
    deleteBtn = document.getElementById("deleteBtn");

var actualPlayer = null,
    playerString = localStorage.getItem("playerArray"),
    playerArray = JSON.parse(playerString);

var message = document.getElementById("message");

var startButton = document.getElementById("startButton"),
    quizContainer = document.getElementById("quizContainer"),
    quizNotify  = document.getElementById("quizNotify"),
    allQuestions = [],
    quizLength = 0,
    choices = [] ,
    index = 0,
    formContainer = document.getElementById("formContainer"),
    form = document.form1,
    warning = document.getElementById("warning");

var quizButtons = document.getElementById("quizButtons"),
    prevButton = document.getElementById("prevButton"),
    nextButton = document.getElementById("nextButton"),
    scoreButton = document.getElementById("scoreButton");

var scoreDisplay = document.getElementById("scoreDisplay"),
    myScores = document.getElementById("myScores"),
    everyoneScores = document.getElementById("everyoneScores");

topBarRight.setAttribute("style", "display:none");
quizContainer.setAttribute("style", "display:none");
quizButtons.setAttribute("style", "display:none");
scoreDisplay.setAttribute("style", "display:visible");

loginBtn.addEventListener("click", checkForm);
accountBtn.addEventListener("click", checkForm);
deleteBtn.addEventListener("click", checkForm);

logout.addEventListener("click", logOut);
startButton.addEventListener("click", startQuiz);
resumeButton.addEventListener("click", startQuiz);

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
    switch (e.target) {
      case accountBtn:
        createAccount(userName, passWord);
        break;
      case deleteBtn:
        deleteAccount(userName, passWord);
        break;
      default:
        logIn(userName, passWord);
    }
    /*
    if (e.target === loginBtn) {
      //if user clicked the login button
      logIn(userName, passWord);
    }
    if (e.target === accountBtn) {
      //if user clicked the 'create account' button
      createAccount(userName, passWord);
    }  */
  }
}

function Player(username, password) {
  this.userName = username;
  this.passWord = password;
  this.storedScores = [];
  this.total = 0;
  this.getNameAndScore = function() {
    return this.userName + " had scored " + this.total + " points!";
  }
  this.visits = 0;
  this.finished = true;
  // answerAt attribute stores the index of the question that is displayed if the player logs out before finishing the quiz
  this.answerAt = 0;
  /* if player logs out before finishing quiz, answers player has already given are stored here.
  When player logs in again, she doesnt have to give those answers again  */
  this.storedAnswers = [];
  this.totalScore = this.getNameAndScore();
}

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

function deleteAccount(username, password) {
    for (var i = 0; i < playerArray.length; i++) {
    var player = playerArray[i];
    if (player.userName === username && player.passWord === password) {
      var deleted = playerArray.splice(i, 1);
      accountNotify.innerHTML = player.userName + "'s account is deleted";
    }
  }
  localStorage.setItem("playerArray", JSON.stringify(playerArray));
  input1.value = "";
  input2.value = "";
}

function logIn(username, password) {
  createAccount.innerHTML = "";
  accountNotify.innerHTML = "";
  scoreDisplay.setAttribute("style", "display:visible");
  var playerString = localStorage.getItem("playerArray");
  playerArray = JSON.parse(playerString);
  console.log(playerArray);

  for (var i = 0; i < playerArray.length; i++) {
    var player = playerArray[i];
    if (player.userName === username && player.passWord === password) {
      console.log(player);
      actualPlayer = player;
      var storedAnswers = actualPlayer.storedAnswers;
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
  welcome.setAttribute("style", "display:visible");
  passWarning.setAttribute("style", "display:none");
  topBarRight.setAttribute("style", "display:none");
  quizContainer.setAttribute("style", "display:none");
  scoreDisplay.setAttribute("style", "display:none");


  if (actualPlayer.finished) {
    actualPlayer.storedAnswers.length = 0;
    actualPlayer.answerAt = 0;
  }
  else {
    actualPlayer.answerAt = index;
  }

  actualPlayer.visits += 1;
  localStorage.setItem("playerArray", JSON.stringify(playerArray));
}

function startQuiz() {
  index = actualPlayer.answerAt;
  quizNotify.setAttribute("style", "display:none");
  quizButtons.setAttribute("style", "display:visible");

  if (actualPlayer.finished) {
    actualPlayer.storedAnswers.length = 0;  //empty the array
    actualPlayer.finished = false;
    index = 0;
  }

  var stringQuestions = localStorage.getItem("allQuestions");
  allQuestions = JSON.parse(stringQuestions);
  quizLength = allQuestions.length;

  showQuestion();
}

function showQuestion() {
  showQuizButtons();
  if (index === quizLength) {
    return;
  }
  // display of question at given index:
  formContainer.setAttribute("style", "display:visible");
  form.innerHTML = "";
  var quizItem = allQuestions[index];
  var q = document.createElement("h3");
  var text = document.createTextNode(quizItem.question);

  var storedAnswers = actualPlayer.storedAnswers;
  var storedAnswer = storedAnswers[index];
  q.appendChild(text);
  form.appendChild(q);

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
    //if question has been answered already
    if (storedAnswer) {
      var id = storedAnswer.id;
      if (i == id) {
        // if question is already answered, id has a value
        input.setAttribute("checked", "checked");
      }
    }

    //if radiobutton is clicked, the chosen answer is stored in array storedAnswers
    input.addEventListener("click", storeAnswer);

    var label = document.createElement("label");
    var choice = document.createTextNode(choices[i]);
    label.appendChild(choice);

    p.appendChild(input);
    p.appendChild(label);
    form.appendChild(p);
  }
}

function storeAnswer(e) {
    var element = e.target;
    var answer = {
      id: element.id,
      value: element.value
    };
    actualPlayer.storedAnswers[index] = answer;
}

function showQuizButtons() {
  if(index === 0) {
    //there is no previous question when first question is shown
    prevButton.setAttribute("style", "display:none");
  }
  if (index > 0) {
    prevButton.setAttribute("style", "display:visible");
  }
  if(index === quizLength) {
    //only if last question is shown user can see the score
    scoreButton.setAttribute("style", "display:visible");
    nextButton.setAttribute("style", "display:none");
    //prevButton still visible so user can go back and change answers
    var h2 = document.createElement("h2");
    h2.innerHTML = "That's it! Would you like to see your score?";
    form.appendChild(h2);
  }
  else {
    nextButton.setAttribute("style", "display:visible");
    scoreButton.setAttribute("style", "display:none");
  }
}

// http://jsfiddle.net/hvG7k/
function previousQuestion() {
  //shows previous question, with chosen answer checked
  index--;
  form.innerHTML = "";
  $("#form1").fadeOut(0, function() {
    var show = showQuestion();
    $(this).attr('innerHTML', 'show').fadeIn(300);
  });
}

function nextQuestion() {
  //shows next question only if current question has been answered
  if (actualPlayer.storedAnswers[index] == null) {
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

function showScore() {
  form.innerHTML = "";
  prevButton.setAttribute("style", "display:none");
  scoreButton.setAttribute("style", "display:none");

  quizNotify.setAttribute("style", "display:visible");
  startButton.setAttribute("style", "display:visible");
  resumeButton.setAttribute("style", "display:none");

  var totalScore = 0;
  var storedAnswers = actualPlayer.storedAnswers;
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

//shows player's total score
function showUserScores(e) {
  e.preventDefault();
  var showUserScores = document.getElementById("showUserScores");
  var showAllUsersScores = document.getElementById("showAllUsersScores");
  showAllUsersScores.setAttribute("style", "display:visible");
  showUserScores.setAttribute("style", "display:visible");

  while (showAllUsersScores.firstChild) {
    showAllUsersScores.removeChild(showAllUsersScores.firstChild);
  }
//  showAllUsersScores.setAttribute("style", "display:none");
  while (showUserScores.firstChild) {
    showUserScores.removeChild(showUserScores.firstChild);
  }

  var userScores = actualPlayer.storedScores;
  var string = "You got these scores: " + userScores;
  var p = document.createElement("p");

  if (userScores.length === 0) {
    string = "You don't have any scores yet";
  }
  p.setAttribute("class", "emphasis");
  p.innerHTML = string;
  showUserScores.appendChild(p);
}

//fills sortedRanking array with all quizplayers, sorted on their total scores.
function rank() {
  sortedRanking = [];
  for (var i = 0; i < playerArray.length; i++) {
    var total = 0;
    var scores = playerArray[i].storedScores;
    for (var j = 0; j < scores.length; j++) {
      total += scores[j];
      playerArray[i].total = total;
    }
    sortedRanking.push(playerArray[i]);
  }

  sortedRanking.sort(function(a,b){
    return parseFloat(b.total) - parseFloat(a.total);
  });
  return sortedRanking;
}

//shows all the players' total scores in descending order
function showAllUsersScores(e) {
  e.preventDefault();
  var showAllUsersScores = document.getElementById("showAllUsersScores");
  var showUserScores = document.getElementById("showUserScores");
  showAllUsersScores.setAttribute("style", "display:visible");
  showUserScores.setAttribute("style", "display:visible");

  var sortedRanking = rank();

  while (showAllUsersScores.firstChild) {
    showAllUsersScores.removeChild(showAllUsersScores.firstChild);
  }

  while (showUserScores.firstChild) {
    showUserScores.removeChild(showUserScores.firstChild);
  }

  showUserScores.setAttribute("style", "display:none");
  showAllUsersScores.setAttribute("class", "ranking");

  var h2 = document.createElement("h2");
  h2.innerHTML = "Ranking list";
  showAllUsersScores.appendChild(h2);

  for (var i = 0; i < sortedRanking.length; i++) {
    var scores = sortedRanking[i].storedScores;
    var username = sortedRanking[i].userName;
    var p = document.createElement("p");
    var string = "";
    var total = sortedRanking[i].total;

    if (username === actualPlayer.userName) {
      string = "You got " + scores + "; total score is: <span>"  + total + "</span>";
      if (scores.length === 0) {
        string = "You got no scores yet";
      }
      p.setAttribute("class", "emphasis");
      p.setAttribute("id", "me");
    }
    else {
      string = username + " got " + scores + "; total score is: <span>"  + total + "</span>";
      if (scores.length === 0) {
        total = 0;
        string = username + " got no scores yet <span>"  + total + "</span>";
      }
      p.setAttribute("class", "scores");
    }

    p.innerHTML = string;
    showAllUsersScores.appendChild(p);
  }
}

myScores.addEventListener("click", showUserScores);
everyoneScores.addEventListener("click", showAllUsersScores);

prevButton.addEventListener("click", previousQuestion);
nextButton.addEventListener("click", nextQuestion);
scoreButton.addEventListener("click", showScore);

init();
