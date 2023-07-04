// TODO: be able to import a set of questions??

const currentSetLabel = document.querySelector(".currentSetLabel");
const studyContainer = document.querySelector(".studyContainer");
const cardType = document.querySelector(".cardType");
const nextCardBtn = document.querySelector(".nextCardBtn");
const studyMenu = document.querySelector(".studyMenu");
const setsContainer = document.querySelector(".setsContainer");
const studyProgress = document.querySelector(".studyProgress");

let setId;
let numCards = 0;
let current = 1;

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

    let resultContainer = document.getElementById(`MCQ ${index}`)

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
            nextCardBtn.classList.remove('hide');
          }
          else {
            resultContainer.innerHTML = "Try Again!";
          };
        }
      });
      // change this??
      if (!flag) alert("please select an option");
    });

    studyElements.push(newElement);
  }
}



class fillInTheBlankCard extends card {
  constructor(card) {
    super(card);
  }
}

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
    currentSetLabel.innerHTML = "Select a set to study...(You can only study a set if it has at least 5 cards)";
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
}

// create the order of cards in the studyCards array
function createStudyArray(cards) {
  let quizCards = [];
  let indices = new Map();
  shuffleArray(cards);

  cards.forEach((card, index) => {
    indices.set(card.cardId, index);
    studyCards.push(new studyCard(card));
    // Math.random() > 0.5
    //   ? quizCards.push(new multipleChoiceCard(card))
    //   : quizCards.push(new fillInTheBlankCard(card));
    // Math.random() > 0.5
    //   ? quizCards.push(new multipleChoiceCard(card))
    //   : quizCards.push(new fillInTheBlankCard(card));

    // TODO: temporary; revert back to original when done
    quizCards.push(new multipleChoiceCard(card));
    quizCards.push(new multipleChoiceCard(card));
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
    index++;
  });
  numCards = studyCards.length;
  studyProgress.innerHTML = `${current}/${numCards}`
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
  if (counter >= studyElements.length) {
    counter = 0;
  }
  current++;
  studyProgress.innerHTML = `${current}/${numCards}`
  slideCards(counter);
});

function slideCards(counter) {
  cardWidth = studyCardElement.getBoundingClientRect().width;
  studyCardElement.removeEventListener("click", flipCard);

  studyElements.forEach((card) => {
    card.style.transform = `translateX(-${(counter * cardWidth) / 0.8}px)`;
  });

  studyCardElement = studyElements[counter];

  // only add handling for flipping if card is a study card
  if (studyCardElement.classList.contains("studyCard")) {
    nextCardBtn.classList.remove('hide');
    cardFront = document.getElementById(`cardFront: ${counter}`);
    cardBack = document.getElementById(`cardBack: ${counter}`);
    // flip the card
    studyCardElement.addEventListener("click", flipCard);
    cardType.innerHTML = "Learn";
  } else if (studyCardElement.classList.contains("multipleChoiceCard")) {
    nextCardBtn.classList.add('hide');
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
