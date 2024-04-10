let questions = [];

document.addEventListener("DOMContentLoaded", () => {
  //fetch the questions from the server
  let loader_ele = document.querySelector(".loader_container");
  loader_ele.classList.add("activeLoader");
  fetch("http://127.0.0.1:3000/get-questions")
    .then((response) => response.json())
    .then((data) => {
      loader_ele.classList.remove("activeLoader");
      questions = data;
      if (questions.length === 0) {
        throw new Error("No questions found");
      }
      info_box.classList.add("activeInfo");
    })
    .catch((error) => {
      console.error("Error fetching questions", error);
      let errorElement = document.querySelector(".error_box");
      errorElement.classList.add("activeError");
    });
});

let userResponses = [];
//selecting all required elements
const start_btn = document.querySelector(".buttons .start_btn");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

// if exitQuiz button clicked
exit_btn.onclick = () => {
  window.close();
  // info_box.classList.remove("activeInfo"); //hide info box
};

// if continueQuiz button clicked
start_btn.onclick = () => {
  info_box.classList.remove("activeInfo"); //hide info box
  quiz_box.classList.add("activeQuiz"); //show quiz box
  showQuetions(0); //calling showQestions function
  queCounter(1); //passing 1 parameter to queCounter
  startTimer(15); //calling startTimer function
  startTimerLine(0); //calling startTimerLine function
  testTaken = true;
};

let timeValue = 15;
let que_count = 0;
let que_numb = 1;
let counter;
let counterLine;
let widthValue = 0;
// export let examFinished = false;
// const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// if quitQuiz button clicked
quit_quiz.onclick = () => {
  // window.location.reload(); //reload the current window
  window.close();
};

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

function handleNextQuestion() {
  if (que_count < questions.length - 1) {
    //if question count is less than total question length
    que_count++; //increment the que_count value
    que_numb++; //increment the que_numb value
    showQuetions(que_count); //calling showQestions function
    queCounter(que_numb); //passing que_numb value to queCounter
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    startTimer(timeValue); //calling startTimer function
    startTimerLine(widthValue); //calling startTimerLine function
    timeText.textContent = "Time Left"; //change the timeText to Time Left
    // next_btn.classList.remove("show"); //hide the next button
    if (que_count == questions.length - 1) {
      next_btn.textContent = "Finish";
    }
  } else {
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    sendResult(); //calling showResult function
  }
  next_btn.classList.remove("show"); //hide the next button
}

// if Next Que button clicked
next_btn.onclick = handleNextQuestion;

// getting questions and options from array
function showQuetions(index) {
  const que_text = document.querySelector(".que_text");

  //creating a new span and div tag for question and option and passing the value using array index
  let que_tag =
    "<span>" + `${index + 1}` + ". " + questions[index].question + "</span>";

  let option_tag =
    '<div class="option"><span>' +
    questions[index].options[0] +
    "</span></div>" +
    '<div class="option"><span>' +
    questions[index].options[1] +
    "</span></div>" +
    '<div class="option"><span>' +
    questions[index].options[2] +
    "</span></div>" +
    '<div class="option"><span>' +
    questions[index].options[3] +
    "</span></div>";
  const answerContainer = document.querySelector(".option_list");

  answerContainer.innerHTML = "";
  questions[index].options.forEach((option) => {
    const button = document.createElement("li");
    //create a span and embed the option text
    const span = document.createElement("span");
    span.innerText = option;
    button.appendChild(span);
    button.classList.add("option");
    button.addEventListener("click", () => selectAnswer(button, option, index));
    answerContainer.appendChild(button);
  });
  que_text.innerHTML = que_tag; //adding new span tag inside que_tag
  // option_list.innerHTML = option_tag; //adding new div tag inside option_tag

  // const option = option_list.querySelectorAll(".option");

  // // set onclick attribute to all available options
  // for(i=0; i < option.length; i++){
  //     option[i].setAttribute("onclick", "optionSelected(this)");
  // }
}
// creating the new div tags which for icons
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

function selectAnswer(button, option, questionIndex) {
  // change the background color of selected option and remove the background color for the rest
  const options = document.querySelectorAll(".option");
  options.forEach((option) => {
    option.classList.remove("selected");
  });
  button.classList.add("selected");
  next_btn.classList.add("show"); //show the next button if user selected any option
  userResponses[questionIndex] = option;
  // showQuetions(que_count);
}

function sendResult() {
  info_box.classList.remove("activeInfo"); //hide info box
  quiz_box.classList.remove("activeQuiz"); //hide quiz box
  result_box.classList.add("activeResult"); //show result box
  const scoreText = result_box.querySelector(".score_text");
  let scoreTag =
    "<span> Test Submitted successfully!<br> This window will automatically close</span>";
  scoreText.innerHTML = scoreTag;
  examFinished = true;
  //call api to post the result
  fetch("http://127.0.0.1:3000/submit-answers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    //send questions along with the answe in the body
    body: JSON.stringify({ questions, userResponses }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Test submitted successfully", data);
    })
    .catch((error) => {
      console.error("Error submitting answers", error);
    })
    .finally(() => {
      setTimeout(() => {
        window.close();
      }, 10000);
    });
}

function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    timeCount.textContent = time; //changing the value of timeCount with time value
    time--; //decrement the time value
    if (time < 9) {
      //if timer is less than 9
      let addZero = timeCount.textContent;
      timeCount.textContent = "0" + addZero; //add a 0 before time value
    }
    if (time < 0) {
      //if timer is less than 0
      // call handleNextQuestion function
      handleNextQuestion();
    }
  }
}

function startTimerLine(time) {
  counterLine = setInterval(timer, 29);
  function timer() {
    time += 1; //upgrading time value with 1
    time_line.style.width = time + "px"; //increasing width of time_line with px by time value
    if (time > 549) {
      //if time value is greater than 549
      clearInterval(counterLine); //clear counterLine
    }
  }
}

function queCounter(index) {
  let totalQueCounTag =
    "<span><p>" +
    index +
    "</p> of <p>" +
    questions.length +
    "</p> Questions</span>";
  bottom_ques_counter.innerHTML = totalQueCounTag;
}
