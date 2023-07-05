// TODO: be able to import a set of questions??

const currentSetLabel = document.querySelector(".currentSetLabel");
const studyContainer = document.querySelector(".studyContainer");
const cardType = document.querySelector(".cardType");
const nextCardBtn = document.querySelector(".nextCardBtn");
const studyMenu = document.querySelector(".studyMenu");
const setsContainer = document.querySelector(".setsContainer");
const studyProgress = document.querySelector(".studyProgress");
const endCard = document.querySelector(".endCard");
const endStudyBtn = document.querySelector(".endStudy");

let setId;
let numCards = 0;
let current = 1;

let studyCardElement;
let cardFront;
let cardBack;

let studySetId;

// store the cards
let cards = [];

// store the study cards
let studyCards = [];

// store the card elements
let studyElements = [];

// card width
let cardWidth;

// keep track of the study session time
let studyStartTime;
let studyEndTime;
let studySessionTime;

// overall study session percentage
let studySessionCorrect = 0;
let studySessionAttempted = 0;
let studySessionPercentage = 0;

// classes
class card {
  constructor(card) {
    this.card = card;
  }
}
// classes
class studyCard extends card {
  constructor(card) {
    super(card);
  }

  createElement(index) {
    let newElement = document.createElement("div");
    newElement.classList.add("studyCard");
    newElement.innerHTML = `<div class="cardFront" id = "cardFront: ${index}">${this.card.front}</div><div class="cardBack" id = "cardBack: ${index}">${this.card.back}</div>`;
    newElement.style.left = `${index * 100 + 10}%`;
    studyContainer.appendChild(newElement);
    studyElements.push(newElement);

    // set up functionality for being able to flip study cards
    if (index == 0) {
      studyCardElement = document.querySelector(".studyCard");
      cardFront = document.querySelector(".cardFront");
      cardBack = document.querySelector(".cardBack");
      studyCardElement.addEventListener("click", flipCard);
    }
  }
}

class multipleChoiceCard extends card {
  constructor(card) {
    super(card);
  }
  createElement(index) {
    let newElement = document.createElement("div");
    newElement.classList.add("multipleChoiceCard");

    let options = getMultipleChoiceOptions(this);
    newElement.innerHTML = `<h2>${this.card.front}</h2><div class="optionsContainer"><input type="radio" id = "card: ${index} option: 1" name = "selection ${index}" value = "card: ${index} option: 1"><label for="card: ${index} option: 1">${options[0]}</label><div></div><input type="radio" id = "card: ${index} option: 2" name = "selection ${index}" value = ""card: ${index} option: 2""><label for="card: ${index} option: 2">${options[1]}</label><div></div><input type="radio" id = "card: ${index} option: 3" name = "selection ${index}" value = "card: ${index} option: 3"><label for="card: ${index} option: 3">${options[2]}</label><div></div><input type="radio" id = "card: ${index} option: 4" name = "selection ${index}" value = "card: ${index} option: 4"><label for="card: ${index} option: 4">${options[3]}</label></div><button class = "submitMCQBtn" id = "submit: ${index}">Submit</button><h2 class = "MCQResult" id = "MCQ ${index}"></h2>`;

    newElement.style.left = `${index * 100 + 10}%`;
    studyContainer.appendChild(newElement);

    let resultContainer = document.getElementById(`MCQ ${index}`);

    let submitBtn = document.getElementById(`submit: ${index.toString()}`);

    submitBtn.addEventListener("click", () => {
      let selections = document.getElementsByName(`selection ${index}`);
      let flag = false;

      selections.forEach((selection) => {
        if (selection.checked) {
          flag = true;
          let userChoice = selection.labels[0].innerHTML;
          if (userChoice == this.card.back) {
            resultContainer.innerHTML = "Correct!";
            this.card.MCQCorrect++;
            studySessionCorrect++;

            selections.forEach((s) => {
              s.disabled = true;
            });
            submitBtn.classList.add("hide");
            nextCardBtn.classList.remove("hide");
          } else {
            resultContainer.innerHTML = "Try Again!";
            setTimeout(() => {
              resultContainer.innerHTML = "";
            }, 1000);
            selection.disabled = true;
            selection.checked = false;
          }
        }
      });

      if (!flag) {
        resultContainer.innerHTML = "Please Select an Option!";
        setTimeout(() => {
          resultContainer.innerHTML = "";
        }, 1000);
      } else {
        this.card.MCQAttempted++;
        studySessionAttempted++;
        this.card.MCQPercentage =
          Math.round(
            (this.card.MCQCorrect / this.card.MCQAttempted) * 100 * 100
          ) / 100;
      }
    });

    studyElements.push(newElement);
  }
}

class fillInTheBlankCard extends card {
  constructor(card) {
    super(card);
  }

  createElement(index) {
    let newElement = document.createElement("div");
    newElement.classList.add("fillInTheBlankCard");
    newElement.innerHTML=`<h2>Question goes here</h2><button class="fillInTheBlankSubmitBtn" id = "fillInTheBlankBtn: ${index}">Submit</button><textarea class = "fillInTheBlankInput" placeholder="Enter answer here" id = "textarea: ${index}">`;

    newElement.style.left = `${index * 100 + 10}%`;
    studyContainer.appendChild(newElement);


    let submitBtn = document.getElementById(`fillInTheBlankBtn: ${index}`);
    let textArea = document.getElementById(`textarea: ${index}`);

    submitBtn.addEventListener('click', () => {
      console.log(textArea.value);
    })

    studyElements.push(newElement);

  }
}

window.addEventListener("load", () => {
  getStudySetId();
  loadCards();
});

// get set id to study
function getStudySetId() {
  studySetId = localStorage.getItem("Study Set ID")
    ? JSON.parse(localStorage.getItem("Study Set ID"))
    : null;
}

// load cards into cards array
function loadCards() {
  if (!studySetId) {
    currentSetLabel.innerHTML =
      "Select a set to study...(You can only study a set if it has at least 5 cards)";
    loadSets();
    return;
  }

  studyMenu.classList.remove("hide");
  let currentSet = JSON.parse(localStorage.getItem("SET: " + studySetId));
  currentSetLabel.innerHTML = currentSet.name;
  let currentCards = currentSet.cards;
  currentCards.forEach((card) => {
    cards.push(card);
  });


  createStudyArray(cards);
  startStudySession();
}

// create the order of cards in the studyCards array
function createStudyArray(cards) {
  let quizCards = [];
  let indices = new Map();
  shuffleArray(cards);

  cards.forEach((card, index) => {
    indices.set(card.cardId, index);
    studyCards.push(new studyCard(card));

    // TODO: change the formula for this
    Math.random() > 0.5
      ? quizCards.push(new multipleChoiceCard(card))
      : quizCards.push(new fillInTheBlankCard(card));
    Math.random() > 0.5
      ? quizCards.push(new multipleChoiceCard(card))
      : quizCards.push(new fillInTheBlankCard(card));
  });

  shuffleArray(quizCards);

  quizCards.forEach((quizCard) => {
    let index = indices.get(quizCard.card.cardId);
    let insertIndex =
      Math.floor(Math.random() * (studyCards.length - index)) + index + 1;

    studyCards.splice(insertIndex, 0, quizCard);
    for (let [key, value] of indices) {
      if (value >= insertIndex) {
        indices.set(key, value + 1);
      }
    }
  });

  // create the study elements
  let index = 0;
  studyCards.forEach((element) => {
    if (element instanceof studyCard) {
      element.createElement(index);
    } else if (element instanceof multipleChoiceCard) {
      element.createElement(index);
    }
    else {
      element.createElement(index);
    }
    index++;
  });
  numCards = studyCards.length;
  studyProgress.innerHTML = `${current}/${numCards}`;
}

// randomize the elements of an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// pick random cards to act as the possible choices
function getMultipleChoiceOptions(card) {
  let options = [card.card.back];
  while (options.length < 4) {
    let randomInt = Math.floor(Math.random() * cards.length);
    let newCard = cards[randomInt].back;
    if (options.indexOf(newCard) == -1) {
      options.push(newCard);
    }
  }
  return shuffleArray(options);
}

let counter = 0;

// move to next card while studying
nextCardBtn.addEventListener("click", () => {
  counter++;
  current++;
  if (counter >= studyElements.length) studyProgress.innerHTML = `Done`;
  else studyProgress.innerHTML = `${current}/${numCards}`;

  slideCards(counter);
});

function slideCards(counter) {
  cardWidth = studyCardElement.getBoundingClientRect().width;
  studyCardElement.removeEventListener("click", flipCard);

  studyElements.forEach((card) => {
    card.style.transform = `translateX(-${(counter * cardWidth) / 0.8}px)`;
  });

  // end of study session
  if (counter >= studyElements.length) {
    endStudySession();
    setTimeout(() => {
      cardType.innerHTML = "Study Session Complete";
      endCard.classList.remove("hide");
      endStudyBtn.classList.remove("hide");
      nextCardBtn.classList.add("hide");
    }, 1000);
    return;
  }

  studyCardElement = studyElements[counter];

  // only add handling for flipping if card is a study card
  if (studyCardElement.classList.contains("studyCard")) {
    nextCardBtn.classList.remove("hide");
    cardFront = document.getElementById(`cardFront: ${counter}`);
    cardBack = document.getElementById(`cardBack: ${counter}`);
    // flip the card
    studyCardElement.addEventListener("click", flipCard);
    cardType.innerHTML = "Learn";
  } else if (studyCardElement.classList.contains("multipleChoiceCard")) {
    nextCardBtn.classList.add("hide");
    cardType.innerHTML = "Quiz";
  }
}

// handle flipping of card
function flipCard() {
  cardFront.classList.toggle("flipped");
  cardBack.classList.toggle("flipped");
}

// adjust review cards' scroll distance if window gets resized
window.addEventListener("resize", () => {
  if (cardWidth && studyCardElement) {
    cardWidth = studyCardElement.getBoundingClientRect().width;
    studyElements.forEach((card) => {
      card.style.transform = `translateX(-${(counter * cardWidth) / 0.8}px)`;
    });
  }
});

// get sets
function loadSets() {
  setId = 1;
  let keys = Object.keys(localStorage);

  for (let i = 1; i <= keys.length; i++) {
    let key = "SET: " + i;
    let storageSet = localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
    if (!storageSet) {
      continue;
    }

    if (storageSet.cards.length >= 5) {
      let set = document.createElement("div");
      set.classList.add("set");

      set.innerHTML = `<h2>${storageSet.name}</h2>`;
      setsContainer.appendChild(set);

      set.addEventListener("click", () => {
        localStorage.setItem("Study Set ID", JSON.stringify(storageSet.setId));
        setsContainer.classList.add("hide");
        getStudySetId();
        loadCards();
      });

      setId = storageSet.setId + 1;
    }
  }
}

endStudyBtn.addEventListener("click", () => {
  localStorage.removeItem("Study Set ID");
  location.href = "studySet.html";
});

// skip to end of study session
window.addEventListener("keydown", (e) => {
  if (e.key === "s") {
    counter = studyElements.length;
    slideCards(counter);
  }
});

function startStudySession() {
  studyStartTime = Date.now() / 1000;
}

function endStudySession() {
  studyEndTime = Date.now() / 1000;
  studySessionTime = studyEndTime - studyStartTime;
  let time;

  if (studySessionTime < 60) {
    time = Math.round(studySessionTime * 100) / 100 + "s";
  } else if (studySessionTime < 3600) {
    let minutes = Math.floor(studySessionTime / 60);
    let seconds = studySessionTime % 60;
    time = `${minutes}m ${Math.round(seconds * 100) / 100}s`;
  } else {
    let hours = Math.floor(studySessionTime / 3600);
    let minutes = Math.floor(studySessionTime / 60) - hours * 60;
    let seconds = studySessionTime % 60;
    time = `${hours}h ${minutes}m ${Math.round(seconds * 100) / 100}s`;
  }

  studySessionPercentage =
    (Math.round((studySessionCorrect / studySessionAttempted) * 100) / 100) *
    100;

  const sessionTime = document.querySelector(".sessionTime");
  const overallPercentage = document.querySelector(".overallPercentage");
  sessionTime.innerHTML = `Session Time: ${time}`;

  if (isNaN(studySessionPercentage))
    overallPercentage.innerHTML = `Session Accuracy: N/A`;
  else
    overallPercentage.innerHTML = `Session Accuracy: ${studySessionPercentage}%`;



  // update the card statistics
  let oldSet = JSON.parse(localStorage.getItem(`SET: ${studySetId}`));
  oldSet.cards = cards;
  oldSet.timeStudied +=  Math.round(studySessionTime * 100) / 100;
  oldSet.timeStudied = Math.round(oldSet.timeStudied * 100) / 100;
  localStorage.setItem(`SET: ${studySetId}`, JSON.stringify(oldSet));
}
