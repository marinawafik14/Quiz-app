//select selector
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets")
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-buttton");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
//set options
let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;




function getQuestions(){
    let myRequest= new XMLHttpRequest();
myRequest.onreadystatechange = function(){
    if (this.readyState === 4 && this.status === 200) {
        let questionsObject=JSON.parse(this.responseText);
      let questionsCount=questionsObject.length;
     // console.log(questionsCount);
   
//create Bullets and set questions
createBullets(questionsCount);

//add question date
addQuestionData(questionsObject[currentIndex],questionsCount);

//start count down
countdown(4,questionsCount);

// click on submit
submitButton.onclick= () => {
//get right answer

let therightAnswer = questionsObject[currentIndex].right_answer;
//console.log(therightAnswer) ;
// increase index
currentIndex++;

//check the answer
checkAnswer(therightAnswer , questionsCount);

//remove previous question

quizArea.innerHTML = "";
answersArea.innerHTML = "";

//add question date
addQuestionData(questionsObject[currentIndex],questionsCount);

//handle Bullets  class
handleBullets();

//start count down
clearInterval(countdownInterval);
countdown(4,questionsCount);


//show results
showResults(questionsCount);




};

    }
};

    myRequest.open("GET", "html-questions.json",true);
    myRequest.send();
}

getQuestions();

function createBullets(num){
countSpan.innerHTML=num;
// create spans
for (let i = 0; i < num; i++) {
   let theBullet=document.createElement("span");

   //check if its first span
if (i=== 0) {
    theBullet.className="on";
}

   // append bullets to main bullet Container
   bulletsSpanContainer.appendChild(theBullet);
}

}

function addQuestionData(obj, count) {
    if (currentIndex < count) {
      // Create H2 Question Title
      let questionTitle = document.createElement("h2");
  
      // Create Question Text
      let questionText = document.createTextNode(obj["title"]);
  
      // Append Text To H2
      questionTitle.appendChild(questionText);
  
      // Append The H2 To The Quiz Area
      quizArea.appendChild(questionTitle);

//create the answers
for (let i = 1; i <=4 ; i++) {
    //create main Div
    let mainDiv=document.createElement("div");
    //add class to main div
    mainDiv.className="answer"
    //create radio input
    let radioInput=document.createElement("input");
    //add type + name + id + date answer
    radioInput.type="radio";
radioInput.name="question";
radioInput.id=`answer_${i}`;
radioInput.dataset.answer= obj[`answer_${i}`];

//make first option selected
if (i === 1) {
    radioInput.checked=true;
}

 //create label
 let theLabel1 = document.createElement("label"); 
//add for atribute
theLabel1.htmlFor = `answer_${i}`;
//add label text
let labelText=document.createTextNode(obj[`answer_${i}`]);
//add the text to label
theLabel1.appendChild(labelText);
//add input + label to main div
mainDiv.appendChild(radioInput);
mainDiv.appendChild(theLabel1);
//append All Divs to answer area
answersArea.appendChild(mainDiv);

}

    }
}

function checkAnswer(rAnswer,count){
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
        
    }
    

    if (rAnswer === theChoosenAnswer) {
        rightAnswer++;
        console.log(`good answer`)
    }

}
function handleBullets(){
    let bulletsSpan = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpan = Array.from(bulletsSpan);
    arrayOfSpan.forEach((span , index) => {
        if (currentIndex === index) {
            span.className="on";
            
        }
    });
}
function showResults(count){
    let theResults;
    if (currentIndex=== count) {
      //  console.log("finished")
quizArea.remove();
answersArea.remove();
submitButton.remove();
bullets.remove();
if (rightAnswer > count / 2 && rightAnswer < count) {
    theResults = `<span class="good">Good</span>, ${rightAnswer} from ${count}`

}else if(rightAnswer === count){
    theResults = `<span class="perfect">perfect</span>, All answers is good`
}else{
    theResults = `<span class="bad">bad</span>, ${rightAnswer} from ${count}`
}


resultsContainer.innerHTML = theResults;
resultsContainer.style.padding = "10px";
resultsContainer.style.marginTop = "10px";
resultsContainer.style.backgroundColor = "white";


    }
};
function countdown(duration , count){
if (currentIndex < count) {
    let minutes , seconds;
    countdownInterval = setInterval(function(){
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);

minutes = minutes < 10 ? `0${minutes}`: minutes ;
seconds = seconds < 10 ? `0${seconds}`: seconds ;

countdownElement.innerHTML =` ${minutes}:${seconds}`
if (--duration < 0) {
    clearInterval(countdownInterval);
    submitButton.click();
}
},1000)
}
};