const currentSetLabel = document.querySelector(".currentSetLabel");
const studyContainer = document.querySelector(".studyContainer");
const cardType = document.querySelector(".cardType");
const nextCardBtn = document.querySelector(".nextCardBtn");

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

// get set id to study
function getStudySetId() {
  studySetId = localStorage.getItem("Study Set ID")
    ? JSON.parse(localStorage.getItem("Study Set ID"))
    : null;
}

window.addEventListener("load", () => {
  getStudySetId();
  loadCards();
});

// load cards into cards array
function loadCards() {
  if (!studySetId) {
    currentSetLabel.innerHTML = "Select a set to study...";
    return;
  }
  let currentSet = JSON.parse(localStorage.getItem("SET: " + studySetId));
  currentSetLabel.innerHTML = currentSet.name;
  let currentCards = currentSet.cards;
  currentCards.forEach((card) => {
    cards.push(card);
  });
  if (cards.length < 5) {
    alert("You need at least 5 cards in a set to study it!");
    location.href = "mySets.html";
    return;
  }
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

  console.log(cards);
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
}

// randomize the elements of an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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
    newElement.innerHTML = `<h2>Multiple choice for: ${this.card.front}</h2><div class="optionsContainer"><input type="radio" id = "card: ${index} option: 1" name = "selection" value = "card: ${index} option: 1"><label for="card: ${index} option: 1">${options[0]}</label><div></div><input type="radio" id = "card: ${index} option: 2" name = "selection" value = ""card: ${index} option: 2""><label for="card: ${index} option: 2">${options[1]}</label><div></div><input type="radio" id = "card: ${index} option: 3" name = "selection" value = "card: ${index} option: 3"><label for="card: ${index} option: 3">${options[2]}</label><div></div><input type="radio" id = "card: ${index} option: 4" name = "selection" value = "card: ${index} option: 4"><label for="card: ${index} option: 4">${options[3]}</label></div><button class = "submitMCQBtn" id = "submit: ${index}">Submit</button>`;

    newElement.style.left = `${index * 100 + 10}%`;
    studyContainer.appendChild(newElement);

    let submitBtn = document.getElementById(`submit: ${index.toString()}`);
    console.log(submitBtn);

    submitBtn.addEventListener('click', () => {
        console.log('submit' + index)
    })
    
    studyElements.push(newElement);
  }
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

class fillInTheBlankCard extends card {
  constructor(card) {
    super(card);
  }
}

let counter = 0;
// move to next card while studying
nextCardBtn.addEventListener("click", () => {
  counter++;
  if (counter >= studyElements.length) {
    counter = 0;
  }
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
    cardFront = document.getElementById(`cardFront: ${counter}`);
    cardBack = document.getElementById(`cardBack: ${counter}`);
    // flip the card
    studyCardElement.addEventListener("click", flipCard);
    cardType.innerHTML = "Learn";
  } else if (studyCardElement.classList.contains("multipleChoiceCard")) {
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
