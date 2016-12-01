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

var quiz = document.getElementById("quiz");
var formContainer = document.getElementById("formContainer");
var form = document.form1;
var warning = document.getElementById("warning");

var prevButton = document.getElementById("prevButton");
var nextButton = document.getElementById("nextButton");
var scoreButton = document.getElementById("scoreButton");

var storedAnswers = [];
var index = 0;

quiz.style.display = "none";
topBarRight.style.display = "none";

loginBtn.addEventListener("click", checkForm);
accountBtn.addEventListener("click", checkForm);
logout.addEventListener("click", logOut);

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

function createAccount(username, password) {
  userWarning.innerHTML = "";
  passWarning.innerHTML = "";
  localStorage.setItem("userName", username);
  localStorage.setItem("passWord", password);
  localStorage.setItem("visit", 0);
  passWarning.innerHTML = "Account created, please enter your username and password";
  input1.value = "";
  input2.value = "";
}

function logIn(username, password) {
  passWarning.innerHTML = "";
  var storedUserName = localStorage.getItem("userName");
  var storedPassWord = localStorage.getItem("passWord");
  var visit = parseInt(localStorage.getItem("visit"));
  visit++;   //welcome message depends on value of visit

  localStorage.setItem("visit", visit);

  if (storedUserName === username  && storedPassWord === password) {
    login.setAttribute("style", "display:none");
    topBarRight.setAttribute("style", "display:visible");
    //hides login panel and shows username and logout option
    user.innerHTML = storedUserName;
    quiz.setAttribute("style", "display:visible");
    //now welcome message and first question are shown
    if (visit === 1) {
      welcome.innerHTML = "Welcome to this quiz, " + storedUserName + "!";
    }
    else if (visit > 1) {
      welcome.innerHTML = "Welcome back to this quiz, " + storedUserName + "!";
    }
  }
  else {
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
  //shows login panel and hides username and logout option
  topBarRight.setAttribute("style", "display:none");
  quiz.setAttribute("style", "display:none");
}

function storeAnswer(e) {
    var element = e.target;
    var answer = {
      id: element.id,
      value: element.value
    };
    storedAnswers[index] = answer;
}



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
    var actual_JSON = JSON.parse(response);
    console.log(actual_JSON);
    //quiz questions have been loaded
    var quizLength = actual_JSON.length;

    function showQuestion() {
      var quizLength = actual_JSON.length;

      // display of buttons:

      if(index === 0) {
        //there is no previous question when first question is shown
        prevButton.style.display = "none";
      }
      if (index > 0) {
        prevButton.style.display = "inline";
      }
      if(index === quizLength) {
        //only if last question is shown user can see the score
        scoreButton.style.display = "inline";
        nextButton.style.display = "none";
        //prevButton still visible so user can go back and change answers
        var h2 = document.createElement("h2");
        h2.innerHTML = "That's it! Would you like to see your score?";
        form.appendChild(h2);
        return;
      }
      else {
        nextButton.style.display = "inline";
        scoreButton.style.display = "none";
      }

      // display of question at given index:

      var choices = actual_JSON[index].choices;
      var storedAnswer = storedAnswers[index];
      var id;
      var quizItem = actual_JSON[index];
      var q = document.createElement("h3");
      var text = document.createTextNode(quizItem.question);

      q.appendChild(text);
      form.appendChild(q);
      //if question has been answered already
      if (storedAnswer) {
        id = storedAnswer.id;
      }

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
        //chosen answer is stored in a separate array: storedAnswers
        input.addEventListener("click", storeAnswer);

        var label = document.createElement("label");
        var choice = document.createTextNode(choices[i]);
        label.appendChild(choice);

        p.appendChild(input);
        p.appendChild(label);
        form.appendChild(p);
      }
    }



    showQuestion();

    // http://jsfiddle.net/hvG7k/
    function previousQuestion() {
      //shows previous question, with chosen answer checked
      welcome.innerHTML = "";
      form.innerHTML = "";
      $("#form1").fadeOut(0, function() {
        index--;
        var show = showQuestion();
        $(this).attr('innerHTML', 'show').fadeIn(300);
      });
    }

    function nextQuestion() {
      //shows next question only if answer has been chosen
      if (storedAnswers[index] === null) {
        warning.innerHTML = "Please choose an answer!";
        return;
      }
      else  {
        warning.innerHTML = "";
        welcome.innerHTML = "";
        form.innerHTML = "";
        $("#form1").fadeOut(0, function() {
          index++;
          var show = showQuestion();
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

      if (totalScore === actual_JSON.length) {
        h2.innerHTML = "Great! Your score is " + totalScore + "!";
      }
      else if (totalScore <= 1) {
        h2.innerHTML = "You could use a litte practice! Your score is " + totalScore + ".";
      }
      else {
        h2.innerHTML = "Well that's not too bad! Your score is " + totalScore + ".";
      }
    }

    prevButton.addEventListener("click", previousQuestion);
    nextButton.addEventListener("click", nextQuestion);
    scoreButton.addEventListener("click", showScore);
  });
}

init();
