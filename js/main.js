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
var results = document.getElementById("results");

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

var myScoreDisplay = document.getElementById("myScoreDisplay"),
    allScoreDisplay = document.getElementById("allScoreDisplay"),
    myScores = document.getElementById("myScores"),
    everyoneScores = document.getElementById("everyoneScores"),
    mineHidden = true,
    allHidden = true;

var progressBar = document.getElementById("progressBar");
var progressMeter = document.getElementById("progressMeter");
var progressMeterText = document.getElementById("progressMeterText");

topBarRight.classList.add("hide");
quizContainer.classList.add("hide");
quizButtons.classList.add("hide");
myScoreDisplay.classList.remove("hide");

progressBar.classList.add("hide");
progressBar.setAttribute("aria-valuemax", quizLength);

loginBtn.addEventListener("click", checkForm);
accountBtn.addEventListener("click", checkForm);
deleteBtn.addEventListener("click", checkForm);

myScores.addEventListener("click", showUserScores);
everyoneScores.addEventListener("click", showAllUsersScores);

logout.addEventListener("click", logOut);
startButton.addEventListener("click", startQuiz);
resumeButton.addEventListener("click", startQuiz);

prevButton.addEventListener("click", previousQuestion);
nextButton.addEventListener("click", nextQuestion);
scoreButton.addEventListener("click", showScore);



// thanks to https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
// this function loads the quiz questions from external JSON file
function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'http://localhost/quiz-web-app/js/quizQuestions.json', true);
//  xobj.open('GET', 'https://drive.google.com/drive/folders/0B3DFzn0jeZDkR1Y0VE1hZjN4T2s/quizQuestionsRemote.json', true);
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
  passWarning.innerHTML = "";
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
  results.innerHTML = "";

  myScoreDisplay.classList.remove("hide");
  allScoreDisplay.classList.remove("hide");
  var playerString = localStorage.getItem("playerArray");
  playerArray = JSON.parse(playerString);
  console.log(playerArray);

  if (playerArray.length === 0) {
    passWarning.innerHTML = "Please create an account first";
    return;
  }

  for (var i = 0; i < playerArray.length; i++) {
    var player = playerArray[i];
    if (player.userName === username && player.passWord === password) {
      console.log(player);
      actualPlayer = player;
      var storedAnswers = actualPlayer.storedAnswers;
      index = actualPlayer.answerAt;

      login.classList.add("hide");
      welcome.classList.add("hide");
      //hides login panel and shows username and logout option
      topBarRight.classList.remove("hide");
      user.innerHTML = player.userName;
      //shows welcome message and startbutton
      quizContainer.classList.remove("hide");
      // three parts of quizContainer:
      quizNotify.classList.remove("hide");
      formContainer.classList.add("hide");
      quizButtons.classList.add("hide");

      if (actualPlayer.visits === 0) {
          message.innerHTML = "Welcome to this quiz, " + actualPlayer.userName + "! <br />Would you like to start?";
          startButton.classList.remove("hide");
          resumeButton.classList.add("hide");
      }
      else if (actualPlayer.visits > 0) {
        if (actualPlayer.finished === false) {
          message.innerHTML = "Welcome back " + actualPlayer.userName + "! <br />You want to finish the quiz?";
          startButton.classList.add("hide");
          resumeButton.classList.remove("hide");
        }
        else {
          message.innerHTML = "Welcome back " + actualPlayer.userName + "!<br />Would you like to retake the quiz?";
          startButton.classList.remove("hide");
          resumeButton.classList.add("hide");
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
  login.classList.remove("hide");
  welcome.classList.remove("hide");
  topBarRight.classList.add("hide");
  quizContainer.classList.add("hide");
  progressBar.classList.add("hide");
  myScoreDisplay.classList.add("hide");
  allScoreDisplay.classList.add("hide");

  if (actualPlayer.finished) {
    actualPlayer.storedAnswers.length = 0;
    actualPlayer.answerAt = 0;
  }
  else {
    actualPlayer.answerAt = index;
  }

  actualPlayer.visits += 1;
  localStorage.setItem("playerArray", JSON.stringify(playerArray));
  userWarning.innerHTML = "";
  passWarning.innerHTML = "";
}

function startQuiz() {
  index = actualPlayer.answerAt;
  quizNotify.classList.add("hide");
  quizButtons.classList.remove("hide");
  progressBar.classList.remove("hide");

  if (actualPlayer.finished) {
    actualPlayer.storedAnswers.length = 0;  //empty the array
    actualPlayer.finished = false;
    index = 0;
  }

  var stringQuestions = localStorage.getItem("allQuestions");
  allQuestions = JSON.parse(stringQuestions);
  quizLength = allQuestions.length;
  showProgress(index);
  showQuestion();
}

function showQuestion() {
  showQuizButtons();
  if (index === quizLength) {
    return;
  }
  // display of question at given index:
  formContainer.classList.remove("hide");
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
    var div = document.createElement("div");
		div.classList.add("radio");

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
    label.setAttribute("class", "radio-label");
		label.setAttribute("for", i);
    var choice = document.createTextNode(choices[i]);
    label.appendChild(choice);

    div.appendChild(input);
  	div.appendChild(label);
    form.appendChild(div);
  }
}

function showProgress(index) {
	 ///update progress bar
  var increment = Math.ceil((index) / (quizLength) * 100);
	if (index === 0) {
		increment = 25;
		progressMeter.style.background = "#ffffff";
	}
	else {
		progressMeter.style.background = "#689F38";
	}
  progressMeter.style.width = (increment) + '%';
  progressMeterText.innerHTML = (index) + ' out of ' + quizLength;
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
    prevButton.classList.add("hide");
  }
  if (index > 0) {
    prevButton.classList.remove("hide");
  }
  if(index === quizLength) {
    //only if last question is shown user can see the score
    scoreButton.classList.remove("hide");
    nextButton.classList.add("hide");
    //prevButton still visible so user can go back and change answers
    var h2 = document.createElement("h2");
    h2.innerHTML = "That's it! Would you like to see your score?";
    form.appendChild(h2);
  }
  else {
    nextButton.classList.remove("hide");
    scoreButton.classList.add("hide");
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
  showProgress(index);
}

function showScore() {
  form.innerHTML = "";
  prevButton.classList.add("hide");
  scoreButton.classList.add("hide");
  progressBar.classList.add("hide");

  quizNotify.classList.remove("hide");
  startButton.classList.remove("hide");
  resumeButton.classList.add("hide");

  var totalScore = 0;
  var storedAnswers = actualPlayer.storedAnswers;
  actualPlayer.finished = true;

  var output = "";
	var questionResult = "NA";

  for (var i = 0; i < storedAnswers.length; i++) {
    var score = parseInt(storedAnswers[i].value);
		if (score === 1) {
			questionResult = '<i class="fi-check green"></i>';

		}
		else {
			questionResult = '<i class="fi-x red"></i>';
		}
		output = output + '<p>Question ' + (i + 1) + ': ' + questionResult + '</p> ';
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

  results.innerHTML = output;
  actualPlayer.score = totalScore;
  actualPlayer.storedScores.push(totalScore);
  updateScore(totalScore);
  updateAllScores();
}


//shows player's total score
function showUserScores(e) {
  e.preventDefault();
  var showUserScores = document.getElementById("showUserScores");
//  var showAllUsersScores = document.getElementById("showAllUsersScores");


 while (showUserScores.firstChild) {
    showUserScores.removeChild(showUserScores.firstChild);
  }

  if (mineHidden) {
		myScores.innerHTML = "Hide my scores";
		mineHidden = false;
	}
	else {
		myScores.innerHTML = "Show my scores";
		mineHidden = true;
	}

  var userScores = actualPlayer.storedScores;
	var h4 = document.createElement("h4");
	h4.innerHTML = "Your scores";
	var string = "";
	for (var i = 0; i < userScores.length; i++) {
		string += userScores[i] + "<br/>";
	}

  var p = document.createElement("p");
  p.setAttribute("id", "scores");

  if (userScores.length === 0) {
    string = "You don't have any scores yet";
  }
  p.classList.add("emphasis");
  p.innerHTML = string;
  showUserScores.appendChild(h4);
	showUserScores.appendChild(p);
}

function updateScore(score) {
	var showUserScores = document.getElementById("showUserScores");
	var scores = document.getElementById("scores");

	if (myScoreDisplay.classList.contains("slideInMyScore")) {
		scores.innerHTML = "";
		var string = "";
		for (var i = 0; i < actualPlayer.storedScores.length; i++) {
			string += actualPlayer.storedScores[i] + "<br/>";
		}

 		scores.innerHTML = string;
	}
}

function updateAllScores() {
  if (allScoreDisplay.classList.contains("slideInAllScores")) {
    var me = document.getElementById("me");
    var string = "";
    var newTotalScore = 0;

    for (var i = 0; i < actualPlayer.storedScores.length; i++) {
      newTotalScore += actualPlayer.storedScores[i];
    }
    //newTotalScore += newScore;
    string = "Your total score is: <span>"  + newTotalScore + "</span>";
    me.innerHTML = string;
  }
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
//  var showUserScores = document.getElementById("showUserScores");
  showAllUsersScores.setAttribute("class", "ranking");

  var sortedRanking = rank();

  while (showAllUsersScores.firstChild) {
    showAllUsersScores.removeChild(showAllUsersScores.firstChild);
  }

  if (allHidden) {
		everyoneScores.innerHTML = "Hide all scores";
		allHidden = false;
	}
	else {
		everyoneScores.innerHTML = "Show all scores";
		allHidden = true;
	}

  var h4 = document.createElement("h4");
  h4.innerHTML = "Ranking list";
  showAllUsersScores.appendChild(h4);

  for (var i = 0; i < sortedRanking.length; i++) {
    var scores = sortedRanking[i].storedScores;
    var username = sortedRanking[i].userName;
    var p = document.createElement("p");
    var string = "";
    var total = sortedRanking[i].total;

    if (username === actualPlayer.userName) {
      string = "Your total score is: <span>"  + total + "</span>";
      if (scores.length === 0) {
        string = "You got no scores yet";
      }
      p.setAttribute("class", "emphasis");
      p.setAttribute("id", "me");
    }
    else {
      string = username + "'s total score is: <span>"  + total + "</span>";
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

init();
