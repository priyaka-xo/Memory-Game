// Create array of 12 unique cards
const cardsArray = [
  { 
    name: 'c3p0',
    img: 'images/c3p0-icon.svg',
    id: 1,
  },
  {
    name: 'lando',
    img: 'images/calrissian-lando-icon.svg',
    id: 2,
  },
  {
    name: 'chewbacca',
    img: 'images/chewbacca-icon.svg',
    id: 3,
  },
  {
    name: 'darthvader',
    img: 'images/darth-vader-icon.svg',
    id: 4,
  },
  {
    name: 'emperor',
    img: 'images/emperor-palpatine-icon.svg',
    id: 5,
  },
  {
    name: 'hansolo',
    img: 'images/han-solo-icon.svg',
    id: 6,
  },
  {
    name: 'luke',
    img: 'images/luke-skywalker-icon.svg',
    id: 7,
  },
  {
    name: 'obiwan',
    img: 'images/obiwan-kenobi-icon.svg',
    id: 8,
  },
  {
    name: 'leia',
    img: 'images/princess-leia-icon.svg',
    id: 9,
  },
  {
    name: 'r2d2',
    img: 'images/r2d2-icon.svg',
    id: 10,
  },
  {
    name: 'stormtrooper',
    img: 'images/stormtrooper-icon.svg',
    id: 11,
  },
  {
    name: 'yoda',
    img: 'images/yoda-icon.svg',
    id: 12,
  }
]

// create memory game deck of cards with 24 cards total
const gamecardsArray = cardsArray.concat(cardsArray);

// Function to shuffle game cards
// https://bost.ocks.org/mike/shuffle/
Array.prototype.shuffleDeck = function () {
  var m = this.length, t, j;
  // While there remain elements to shuffle…
  while (m) {
  // Pick a remaining element…
    j = Math.floor(Math.random() * m--);
  // And swap it with the current element.
    t = this[m];
    this[m] = this[j];
    this[j] = t;
  }
  return this;
}


const gameboard = document.getElementById('gameboard');
const modal = document.getElementsByClassName('modal'); 
const btnModal = document.getElementsByClassName('modal-button'); // game buttons
const btnModalBody = document.getElementsByClassName('modal-body-button'); // modal buttons
const btnExitModal = document.getElementsByClassName('exit-modal'); // (x) button 
const clock = document.getElementById('clock'); // game stats - time remaining
const minutes = document.getElementById('minutes');
const flipped = document.getElementById('flipped'); // game stats - # of cards flipped
const initialGametime = 240; // initial gametime set to 4 minutes
const maxCardsFlipped = 108; // max num of cards flipped/revealed in game
let cardID = [];  // array to hold the selected card IDs
let cardName = [];
let countClicks; // counter for number of cards clicked
let cardMatched; // counter for number of cards matched
let totalMatched; // counter for total cards matched
let totalFlips; // total cards flipped to match all cards
let gametime; // time to play game
let countdown;  // holds setInterval()
let secondsLeft; // holds number of milliseconds remaining in timer
let totalSeconds; // total time in milliseconds to match all cards
let clickPercentage; // getStarRating()   - determine number of stars
let timePercentage;  // getStarRatiing() - determine number of stars
let totalPercentage // getStarRating() - determine number of stars

// load handler to setup new game once window is fully loaded
 window.addEventListener('load', newGame, false);
 window.addEventListener('load', startup, false);

function startup() {
  // When user clicks #information-button, call displayInformation()
  btnModal[0].addEventListener('click', displayInformation, false);
  // When user clicks #scores-button, call displayScores()
  btnModal[4].addEventListener('click', displayScores, false);

}

// Generate new gameboard
function newGame() {
  // remove previous gameboard
  while (gameboard.firstChild) {
    gameboard.removeChild(gameboard.firstChild);
  }
  // prevent multiple firing of same event
  btnModal[1].removeEventListener('click', startGame, false);
  document.removeEventListener('click', playGame, false);

  // shuffle cards
  let gameDeck = gamecardsArray.shuffleDeck();
   //create cards and attach to DOM
  gameDeck.forEach (item => {
  //  create container for each card
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');    
  //  create each card as div element  
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = item.name;
    card.dataset.id = item.id;
  // create front of card    
    const cardFaceUp = document.createElement('div');
    cardFaceUp.classList.add('card-face-up');
    cardFaceUp.style.backgroundImage = `url(${item.img}`;
  // create back of card    
    const cardFaceDown = document.createElement('div');
    cardFaceDown.classList.add('card-face-down');
    cardFaceDown.style.backgroundImage="url('images/starwars-card.svg')";
  // add created div to parent node
    gameboard.appendChild(cardContainer);
    cardContainer.appendChild(card);
    card.appendChild(cardFaceDown);
    card.appendChild(cardFaceUp);
  });

  // refresh variables
  totalSeconds = 0;
  totalFlips = 0;
  countClicks = 0;
  cardMatched = 0; 
  totalMatched = 0;
  cardID = [];
  cardName = [];
  document.title = "Star Wars Memory Game";
  clock.innerHTML = displayTime(initialGametime);
  minutes.innerHTML = ' minutes';
  flipped.innerHTML = totalFlips;
  clickPercentage = 100;
  timePercentage = 100;
  getStarRating();
  document.querySelector('.star-inner').style.width = `100%`;

  // toggle buttons that are enabled/disabled
  btnModal[2].parentElement.classList.add('is-disabled'); // disable #pause-button
  btnModal[3].parentElement.classList.add('is-disabled'); // disable #restart-button
  btnModal[0].parentElement.classList.remove('is-disabled');  // enable #info-button
  btnModal[1].parentElement.classList.remove('is-disabled');  //  enable #start-button
  btnModal[4].parentElement.classList.remove('is-disabled');  // enable #scores-button 
   
  // when user clicks on #start-button, call startGame()
  btnModal[1].addEventListener('click', startGame, false);
}

// prepare to play game when user clicks start button
function startGame() {
  btnModal[0].parentElement.classList.add('is-disabled');  // disable #info-button
  btnModal[1].parentElement.classList.add('is-disabled');  //  disable #start-button
  btnModal[4].parentElement.classList.add('is-disabled');  // disable #scores-button
  
  // If user clicks #pause-button, call pauseGame()
  btnModal[2].addEventListener('click', pauseGame, false);
  // If user clicks #restart-button, call restartGame()
  btnModal[3].addEventListener('click', restartGame, false);

  // add mouseover event for cards
  document.addEventListener('mouseover', function(event) {
  // if element is other than div#card-face-down, no action  
    if (!event.target.matches('.card-face-down')) {
      return;
    } else {
  // change border style on mouseover, blue     
    event.target.style.border = "rgb(51, 133, 255) 2px solid";
  } 
  }, false);

  // add mouseout event for cards
  document.addEventListener('mouseout', function(event) {
  // if element is other than div.card-face-down, no action  
    if (!event.target.matches('.card-face-down')) {
      return;
    } else {
      //  add back black border on mouseout     
      event.target.style.border = "rgb(0, 0, 0) 1px solid";
    }
  }, false);
  
  // when user clicks on card, start playGame()
  document.addEventListener('click', playGame, false);
}

// play game when user clicks on first card
function playGame(event) {
  let clicked = event.target;

  // toggle buttons that are enabled/disabled
  btnModal[2].parentElement.classList.remove('is-disabled'); // enable #pause-button
  btnModal[3].parentElement.classList.remove('is-disabled'); // enable #restart-button  
  
  // if total flips exceeds max allowed, then call flipsExceeded()
  if (countClicks > (maxCardsFlipped - 1)) {
    stopTimer()
    flipsExceeded();
  }     

  //  if element clicked is other than #card-face-down, take no action    
  if (!clicked.matches('.card-face-down')) {
    return;
  } else {    
    //  if less than two cards are currently selected (clicked)
    if (cardID.length < 2 && cardName.length < 2) {

      // procedure when first card is selected (clicked)               
      if (cardID.length === 0  && cardName.length === 0) {
        countClicks += 1;  // increase the click counter
        startTimer(initialGametime); 
        flipped.innerHTML = countClicks; // update and display game stats
        clickPercentage = (maxCardsFlipped - countClicks) / maxCardsFlipped * 100; // update clickPercentage for star rating
        getStarRating(); // update and display game stats 
        clicked.parentNode.classList.add('selected');
        cardID.push(clicked.parentNode.dataset.id); 
        cardName.push(clicked.parentNode.dataset.name);
      } 
        //  procedure when second card is selected (clicked)          
        else if (cardID.length === 1 && cardName.length === 1) {
          countClicks += 1;  // increase the click counter
          flipped.innerHTML = countClicks;  // update and display game stats
          clickPercentage = (maxCardsFlipped - countClicks) / maxCardsFlipped * 100; // update clickPercentage for star rating
          getStarRating(); // update and display game stats
          clicked.parentNode.classList.add('selected');
          cardID.push(clicked.parentNode.dataset.id);
          cardName.push(clicked.parentNode.dataset.name);

          //  Check if the two cards selected match          
          if (cardID[0] === cardID[1]  && cardName[0] === cardName[1]) {
            let selected = document.querySelectorAll('.selected');
            selected.forEach(card => { card.classList.add('matched'); });
            selected.forEach(card => { card.classList.remove('selected'); });
            cardMatched += 2; // increase number of cards matched
            cardID = [];  // refresh cardsIds array
            cardName = [];

            //  if all cards have been matched
            if (cardMatched === gamecardsArray.length) {
              stopTimer();
              totalSeconds = initialGametime - secondsLeft;
              totalFlips = countClicks;
              totalMatched = cardMatched;
              setTimeout(gameOver, 1200);  
            }        
          } else {
            setTimeout(flipBack, 600);  // If the two cards selected do not match, flip them face down 
          }         
        }
    }     
  } 
  
}

//flip cards face-down if no match
function flipBack() {
  let selected = document.querySelectorAll('.selected');
  selected.forEach(card => { card.classList.add('nomatch'); }); 
  selected.forEach(card => { card.classList.remove('selected'); }); 
  let unmatched = document.querySelectorAll('.nomatch');
  unmatched.forEach(card => { card.classList.remove('nomatch'); }); 
  cardID = [];  // refresh cardsIds array
  cardName = [];
}

// update star rating
function getStarRating() {
  //  clickPercentage = (maxCardsFlipped - countClicks) / maxCardsFlipped * 100
  //  timePercentage = (secondsLeft / initialGametime) * 100
  totalPercentage = (timePercentage + clickPercentage) / 2;
  document.querySelector('.star-inner').style.width = `${totalPercentage}%`;
}

// establish countdown timer
function timer(seconds) {
  const startTime = Date.now();
  const endTime = startTime + seconds * 1000;
  displayTime(seconds); // display initital time on countdown clock
  countdown = setInterval(() => {
    secondsLeft = Math.round((endTime - Date.now()) / 1000);
    timePercentage = ((secondsLeft / initialGametime) * 100); // update timePercentage
    getStarRating(); // update and display game stats
    // if all time elapsed (secondsLeft reaches 0), stop timer, call timeOver()
    if (secondsLeft < 0) {
      stopTimer();
      timeOver();
      return;
    }  
    let countdownClock = displayTime(secondsLeft);
      document.title = countdownClock; // update game stats
      clock.innerHTML = countdownClock;  // update game stats
  }, 1000);
}

// display seconds in minutes/seconds format
function displayTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainderSeconds = seconds % 60;
  let timerDisplay = `${minutes}:${remainderSeconds < 10 ? '0' : "" }${remainderSeconds}`;
  return(timerDisplay);
}

// start timer on first click
function startTimer(seconds) {
  if (countClicks === 1) {
    timer(seconds);
  }
}

// stop timer if game over or paused
function stopTimer() {
  clearInterval(countdown);
} 

// restart timer if game paused
function restartTimer(seconds) {
  gametime = seconds;
  timer(gametime);
} 


function gameOver() {
  modal[3].style.display = 'block'; // display #game-over modal   
  document.getElementById('flip-counter').innerHTML = totalFlips;
  const totalTimeElapsed = displayTime(totalSeconds);
  document.getElementById('time-counter').innerHTML = totalTimeElapsed;
  document.querySelector('.final-star-inner').style.width = `${totalPercentage}%`;
  document.getElementById('final-number-rating').innerHTML = `${totalPercentage.toFixed(2)}%`;

  // if #view-scores link is clicked, close #game-over modal and open #scores modal
  document.getElementById('view-scores').addEventListener('click', { handleEvent: function () {
    displayScores();
    modal[3].style.display = 'none';    
  }
  }, false);

  // if new game button is clicked
  btnModalBody[4].addEventListener('click', { handleEvent: function () {
    newGame();  // start new game 
    modal[3].style.display = 'none'; // close #game-over modal
  }
  }, false);

  // if exit modal (x) button is clicked
  btnExitModal[1].addEventListener('click', {handleEvent: function () {
    newGame();
    modal[3].style.display = 'none'; // close #game-over modal
  }
  }, false);
}

// if secondsLeft exceeded initialGameTime
function timeOver() {
  modal[2].style.display = 'block'; // display #time-over modal

  // if play again button is clicked
  btnModalBody[3].addEventListener('click', { handleEvent: function () {
    newGame(); // start new game
    modal[2].style.display = 'none'; // close #time-over modal
  }  
  }, false);

  // is #exit-modal (x) is clicked
  btnExitModal[0].addEventListener('click', { handleEvent: function() {
    newGame();
    modal[2].style.display = 'none'; // close #time-over modal
  } 
  }, false);
}

// if total number of cards flipped/revealed exceeds maximum
function flipsExceeded() {
  modal[6].style.display = 'block'; // display #flips-over modal

  // if play again button is clicked
  btnModalBody[5].addEventListener('click', { handleEvent: function () {
    newGame();
    modal[6].style.display = 'none'; // close #flips-over modal
  }  
  }, false);

  // is #exit-modal (x) is clicked
  btnExitModal[4].addEventListener('click', { handleEvent: function() {
    newGame();
    modal[6].style.display = 'none'; // close #time-over modal
  } 
  }, false);
}

function restartGame() {
  stopTimer();
  modal[0].style.display = 'block'; // display #restart-game modal

  // if btn #restart-gameboard clicked
  btnModalBody[0].addEventListener('click', { handleEvent: function () {
    newGame();  
    modal[0].style.display = 'none'; // close #restart-game modal 
  }
  }, false);

  // if btn#resume-current-game clicked
  btnModalBody[1].addEventListener('click', { handleEvent: function () {
    modal[0].style.display = 'none'; // close #restart-game modal
    restartTimer(secondsLeft);  // call restartTimer();
  }
  }, false);
}

function pauseGame() {
  stopTimer();
  modal[1].style.display = 'block'; // display #pause-game modal

  // if #return-to-game button clicked
  btnModalBody[2].addEventListener('click', { handleEvent: function () {
    modal[1].style.display = 'none'; // close #pause-game modal
    restartTimer(secondsLeft);
  }
  }, false);
}

function displayInformation() {
  modal[5].style.display = 'block'; // display #information modal
  btnExitModal[3].addEventListener('click', { handleEvent: function () {
    modal[5].style.display = 'none'; // close #information modal
  }
  }, false);
}

function displayScores() {
  makeTimeTable();
  makeFlipsTable();
  modal[4].style.display = 'block'; // display #scores modal
  // if #exit-modal button (x) is clicked close #scores modal
  btnExitModal[2].addEventListener('click', { handleEvent: function () {
    modal[4].style.display = 'none'; // close #scores modal;
    newGame(); 
  }
  }, false);
}

// TO-DO! learn firebase and update code to make tables with accurate data for total flips and total time 
// All following code pertains to the tables in the #scores-modal which is still under construction
let topTotalArray = [
  { 
    name: 'C3P0',
    topTime: 300,
    topTimeCount: 1,
    topFlips: 108,
    topFlipsCount: 1,
    id: 1
  },
  { 
    name: 'Chewbacca',
    topTime: 300,
    topTimeCount: 1,
    topFlips: 108,
    topFlipsCount: 1,
    id: 2
  },
  { 
    name: 'Darth Vader',
    topTime: 300,
    topTimeCount: 1,
    topFlips: 108,
    topFlipsCount: 1,
    id: 3
  },
  { 
    name: 'Emperor Palpatine',
    topTime: 300,
    topTimeCount: 1,
    topFlips: 108,
    topFlipsCount: 1,
    id: 4
  },
  { 
    name: 'Han Solo',
    topTime: 300,
    topTimeCount: 1,
    topFlips: 108,
    topFlipsCount: 1,
    id: 5
  },
  { 
    name: 'Lando Calrissian',
    topTime: 300,
    topTimeCount: 1,
    topFlips: 108,
    topFlipsCount: 1,
    id: 6
  },
  { 
    name: 'Princess Leia',
    topTime: 300,
    topTimeCount: 1,
    topFlips: 108,
    topFlipsCount: 1,
    id: 7
  },
  { 
    name: 'Luke Skywalker',
    topTime: 300,
    topTimeCount: 1,
    topFlips: 108,
    topFlipsCount: 1,
    id: 8
  },
  { 
    name: 'Obi-Wan Kenobi',
    topTime: 300,
    topTimeCount: 1,
    topFlips: 108,
    topFlipsCount: 1,
    id: 9
  },
  { 
    name: 'R2D2',
    topTime: 300,
    topTimeCount: 1,
    topFlips: 108,
    topFlipsCount: 1,
    id: 10
  }, 
  { 
    name: 'Stormtrooper',
    topTime: 300,
    topTimeCount: 1,
    topFlips: 108,
    topFlipsCount: 1,
    id: 11
  },
  { 
    name: 'Yoda',
    topTime: 300,
    topTimeCount: 1,
    topFlips: 108,
    topFlipsCount: 1,
    id: 12
  }
]


const topTimeTable = document.getElementById('top-time-table');
const topFlipsTable = document.getElementById('top-flips-table'); 



function makeTimeTable() {
  if (topTimeTable.childElementCount > 3) {
    topTimeTable.removeChild(topTimeTable.lastElementChild);
  }
  const tableBodyTime = document.createElement('tbody');
  tableBodyTime.setAttribute('class', 'table-body');
  // create table
  topTotalArray.forEach (object => { 
    const row = document.createElement('tr'); 
    row.classList.add('player-row');
    row.setAttribute('contenteditable', 'true');
    const cellName = document.createElement('th');
    cellName.classList.add('topTimes-player-name')
    cellName.setAttribute('scope', 'row');
    cellName.dataset.playerid = object.playerid;
    const cellTime = document.createElement('td');
    cellTime.classList.add('topTime-player-time');
    // object.topTime = topPlayerTopTime();
    cellTime.dataset.topTime = object.topTime;
    cellTime.dataset.topTimeCount = object.topTimeCount;
    const cellNameText = document.createTextNode(object.name);
    const displayTopTotalTime = displayTime(object.topTime);
    const cellTimeText = document.createTextNode(displayTopTotalTime);

    topTimeTable.appendChild(tableBodyTime);
    tableBodyTime.appendChild(row);
    row.appendChild(cellName);
    row.appendChild(cellTime);
    cellName.appendChild(cellNameText);
    cellTime.appendChild(cellTimeText);
  });
  updateTopTotalTimeArray();
  calculateMeanTopTime();
  currentPlayerTopTime(totalSeconds, totalFlips);  
}


function makeFlipsTable() {
  if (topFlipsTable.childElementCount > 3) {
    topFlipsTable.removeChild(topFlipsTable.lastElementChild);
  }
  const tableBodyFlips = document.createElement('tbody');
  tableBodyFlips.setAttribute('class', 'table-body');
  // create table
  topTotalArray.forEach(object => {
    const row = document.createElement('tr');
    row.classList.add('top-player-row');
    row.setAttribute('contenteditable', 'true');
    const cellName = document.createElement('th');
    cellName.classList.add('topFlips-player-name')
    cellName.setAttribute('scope', 'row');
    cellName.dataset.playerid = object.id;
    const cellFlips = document.createElement('td');
    cellFlips.classList.add('topFlips-player-flips');
    // object.topFlips = topPlayerTopFlips();
    cellFlips.dataset.topFlips = object.topFlips;
    cellFlips.dataset.topFlipsCount = object.topFlipsCount;
    const cellNameText = document.createTextNode(object.name);
    const cellFlipsText = document.createTextNode(object.topFlips);

    topFlipsTable.appendChild(tableBodyFlips);
    tableBodyFlips.appendChild(row);
    row.appendChild(cellName);
    row.appendChild(cellFlips);
    cellName.appendChild(cellNameText);
    cellFlips.appendChild(cellFlipsText);
  });
  updateTopTotalFlipsArray();
  calculateMeanTopFlips();
  currentPlayerTopFlips(totalSeconds, totalFlips);
}

function currentPlayerTopTime(tseconds, tflips) {
  if (tseconds === 0 || tflips === 0 || tseconds > (initialGametime) || tflips > maxCardsFlipped) {
    return;
  } else {
      const displayCurrentPlayerTopTime = displayTime(tseconds);
      document.getElementById("current-player-top-seconds").innerHTML = displayCurrentPlayerTopTime;
    }
}

function currentPlayerTopFlips(tseconds, tflips) {
  if (tseconds === 0 || tflips === 0 || tseconds > (initialGametime) || tflips > maxCardsFlipped) {
    return;
  } else {
      document.getElementById("current-player-top-flips").innerHTML = tflips;
    }
}

function calculateMeanTopTime() {
  const topTimeArray = topTotalArray.map(function(object) {
    return object.topTime;
  });
  const topTimeCountArray = topTotalArray.map(function(object) {
    return object.topTimeCount;
  });

  let meanTopTime = Math.round(weightedMean(topTimeArray, topTimeCountArray));
  let displayMeanTopTime = displayTime(meanTopTime);
  document.getElementById("mean-top-time").innerHTML = displayMeanTopTime;
}

function calculateMeanTopFlips() {
  const topFlipsArray = topTotalArray.map(function(object) {
    return object.topFlips;
  });
  const topFlipsCountArray = topTotalArray.map(function(object) {
    return object.topFlipsCount;
  });

  let meanTopFlips = Math.round(weightedMean(topFlipsArray, topFlipsCountArray));
  document.getElementById("mean-top-flips").innerHTML = meanTopFlips;
}

// weightedMean() courtesy of Steffen Kühne //
//  https://gist.github.com/stekhn/a12ed417e91f90ecec14bcfa4c2ae16a.js //
function weightedMean(arrValues, arrWeights) {
  var result = arrValues.map(function (value, i) {

    var weight = arrWeights[i];
    var sum = value * weight;

    return [sum, weight];
  }).reduce(function (p, c) {
    return [p[0] + c[0], p[1] + c[1]];
  }, [0, 0]);

  return result[0] / result [1];
}


function updateTopTotalTimeArray() {
  let indexMatch;

  if (totalSeconds === 0 || totalFlips === 0 || totalSeconds > initialGametime || totalFlips > maxCardsFlipped) {
    return;
  } else if (topTotalArray.some(checkMatchTopTime)) {
    topTotalArray[indexMatch].topTimeCount++;    
  } else if (topTotalArray.some(checkInTopTimes)) {
    topTotalArray[topTotalArray.length - 1].topTime = totalSeconds;
    topTotalArray[topTotalArray.length - 1].topTimeCount = 1;
   topTotalArray.sort(compareValues('topTime'));
  }
  
 function checkMatchTopTime(player, index) {
    if (totalSeconds === player.topTime) {
      indexMatch = index;
      return true;
    }
  }  

  function checkInTopTimes(player) {
    if (totalSeconds < player.topTime) {
      return true;
    } 
  }
} 
  

  function updateTopTotalFlipsArray() {
    let indexMatch;

    if (totalSeconds === 0 || totalFlips === 0 || totalSeconds > initialGametime || totalFlips > maxCardsFlipped) {
      return;
    } else if (topTotalArray.some(checkMatchTopFlips)) {
      topTotalArray[indexMatch].topFlipsCount++;
    } else if (topTotalArray.some(checkInTopFlips)) {
        topTotalArray[topTotalArray.length - 1].topFlips = totalFlips;
        topTotalArray[topTotalArray.length - 1].topFlipsCount = 1;
        topTotalArray.sort(compareValues('topFlips'));
    }
  
    function checkMatchTopFlips(player, index) {
      if (totalFlips === player.topFlips) {
        indexMatch = index;
        return true;
      }
    }

    function checkInTopFlips(player) {
      if (totalFlips < player.topFlips) {
        return true;
      }
    }
  }


function compareValues(key, order='asc') {
  return function(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }
    const varA = a[key];
    const varB = b[key];

    let comparison = 0;

    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (comparison);
  };
}




