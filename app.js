const addCard = document.querySelector(".addCard");
const addCardMenu = document.querySelector(".addCardMenu");
const cardFront = document.querySelector(".tempCard");
const cardBack = document.querySelector(".tempCardBack");
const cardsContainer = document.querySelector(".cardsContainer");
const addBtn = document.querySelector(".addBtn");
const flipBtn = document.querySelector(".flipBtn");
const cardSide = document.querySelector(".cardSide");
const cardInfo = document.querySelector(".cardInfo");
const cardDesc = document.querySelector(".cardDesc");

const addSetBtn = document.querySelector(".addSetBtn");
const addSetMenu = document.querySelector(".addSetMenu");
const createSetBtn = document.querySelector(".createSetBtn");
const setsContainer = document.querySelector(".setsContainer");
const setName = document.querySelector(".addSetInput");
const cardsDiv = document.querySelector(".cardsDiv");
const clearSetsBtn = document.querySelector(".clearSetsBtn");

const editCardMenu = document.querySelector(".editCardMenu");
const editCardFront = document.querySelector(".editCardFront");
const editCardBack = document.querySelector(".editCardBack");
const editCardInfo = document.querySelector(".editCardInfo");
const editCardDesc = document.querySelector(".editCardDesc");

const editCards = document.querySelector(".editCards");
const editSide = document.querySelector(".editSide");
const editBtnContainer = document.querySelector(".editBtnContainer");

const closeAddCardMenu = document.querySelector(".closeAddCardMenu");

const editFlipBtn = document.querySelector(".editFlipBtn");
const editDoneBtn = document.querySelector(".editDoneBtn");
const closeEditCardMenu = document.querySelector(".closeEditCardMenu");

const setHeader = document.querySelector(".setHeader");

const reviewCardsMenu = document.querySelector(".reviewCardsMenu");
const reviewCardsBtn = document.querySelector(".reviewCardsBtn");
const closeReviewMenuBtn = document.querySelector(".closeReviewMenuBtn");
const reviewCardContainer = document.querySelector(".reviewCardContainer");
const setBtnContainer = document.querySelector(".setBtnContainer");


const studyCardsBtn = document.querySelector(".studyCardsBtn");
const studyLink = document.querySelector(".studyLink");


let setId = 1;
let cardId = 1;
let side = "(Front)";
let editSideVar = "(Front)";

let cards = [];

let showEditBtn = false;

// keep track of which set the user is in
let setUserIsIn;

// keep track of the current cards to review
let reviewCards = [];

let cardWidth = 0;

// classes
class Card {
  constructor(cardId, front, back) {
    var that = this;
    this.cardId = cardId;
    this.front = front;
    this.back = back;

    this.MCQAttempted = 0;
    this.MCQCorrect = 0;
    this.MCQPercentage = 0;

    // create the card div and add it to the cards container
    this.cardElement = document.createElement("div");
    this.cardElement.classList.add("card");
    this.cardElement.innerHTML = `<div class="displayCard" id = "cardFront ${cardId}">${front}</div><div class="displayCardBack hideCardSide" id = "cardBack ${cardId}">${back}</div><button class="editCardBtn hide" id = "cardEditBtn ${cardId}"><i class="fa-solid fa-pen-to-square"></i></button>`;
    cardsContainer.appendChild(this.cardElement);

    // grab the elements
    this.editBtn = document.getElementById("cardEditBtn " + cardId);
    this.cardFront = document.getElementById("cardFront " + cardId);
    this.cardBack = document.getElementById("cardBack " + cardId);

    // add the edit button if it is toggled when adding a new card
    if (showEditBtn) {
      this.editBtn.classList.remove("hide");
    }

    // allow user to click the card to flip it
    this.cardElement.addEventListener("click", () => {
      this.cardFront.classList.toggle("hideCardSide");
      this.cardBack.classList.toggle("hideCardSide");
    });

    // edit card
    this.editBtn.addEventListener("click", () => {
      if (!editCardMenu.classList.contains("hide")) {
        return;
      }

      editCardMenu.classList.remove("hide");

      // default to editing the front of a card
      if (editSideVar === "(Back)") {
        editSideVar = "(Front)";
        editCardFront.classList.toggle("hide");
        editCardBack.classList.toggle("hide");
      }
      editSide.innerHTML = editSideVar;

      // prevent flipping the card when clicking the edit button
      this.cardFront.classList.toggle("hideCardSide");
      this.cardBack.classList.toggle("hideCardSide");

      // fill in edit menu with card contents
      editCardInfo.value = this.front;
      editCardDesc.value = this.back;

      editDoneBtn.addEventListener("click", helper);

      function helper() {
        that.editCard();
      }

      // close edit menu
      closeEditCardMenu.addEventListener("click", () => {
        editCardMenu.classList.add("hide");
        editDoneBtn.removeEventListener("click", helper);
      });
    });
  }

  // edit card
  editCard() {
    this.newFront = editCardInfo.value;
    this.newBack = editCardDesc.value;

    this.front = this.newFront;
    this.back = this.newBack;
    this.cardFront.innerHTML = this.newFront;
    this.cardBack.innerHTML = this.newBack;

    editCardLocalStorage(this, setUserIsIn);
    editCardMenu.classList.add("hide");
  }
}

class Set {
  constructor(setId, name) {
    this.cards = [];
    this.setId = setId;
    this.name = name;
    this.numCards = 0;
    this.timeStudied = 0;
  }
}

// special class for review cards
class reviewCard {
  constructor(card, index) {
    this.card = card;
    this.index = index;
    this.reviewCardElement = document.createElement("div");

    this.reviewCardElement.classList.add("reviewCard");
    this.reviewCardElement.innerHTML = `<div class="cardBack" id = "cardBack: ${this.card.cardId}">${this.card.back}</div><div class="cardFront" id = "cardFront: ${this.card.cardId}">${this.card.front}</div>`;
    this.reviewCardElement.style.left = `${this.index * 100 + 10}%`;
    reviewCards.push(this.reviewCardElement);
    reviewCardContainer.appendChild(this.reviewCardElement);
  }
}

// show add card menu
addCard.addEventListener("click", () => {
  if (!addCardMenu.classList.contains("hideAddCardMenu")) {
    return;
  }

  addCardMenu.classList.remove("hideAddCardMenu");

  flipBtn.addEventListener("click", flipBtnFunction);

  function flipBtnFunction() {
    cardFront.classList.toggle("hideCard");
    cardBack.classList.toggle("hideCard");
    if (side === "(Front)") {
      side = "(Back)";
    } else {
      side = "(Front)";
    }
    cardSide.innerHTML = side;
  }

  // close the add card menu
  closeAddCardMenu.addEventListener("click", () => {
    addCardMenu.classList.add("hideAddCardMenu");
    flipBtn.removeEventListener("click", flipBtnFunction);
  });
});

addBtn.addEventListener("click", () => {
  addNewCard();

  if (side === "(Back)") {
    side = "(Front)";
    cardSide.innerHTML = side;
    cardFront.classList.toggle("hideCard");
    cardBack.classList.toggle("hideCard");
  }

  // reset the add card menu
  cardInfo.value = "";
  cardDesc.value = "";
});

// add a new card to a set
function addNewCard() {
  const cardValue = cardInfo.value;
  const cardBackValue = cardDesc.value;
  let card = new Card(cardId, cardValue, cardBackValue);
  setUserIsIn.cards.push(card);
  setUserIsIn.numCards++;
  cardId += 1;

  // add card to local storage
  addCardToLocalStorage(card, setUserIsIn);

  // update card count
  setHeader.innerHTML = `<h2>${setUserIsIn.name}</h2>
  <p>Number of Cards: ${setUserIsIn.numCards}</p>`;
}

// flip card while editing
editFlipBtn.addEventListener("click", () => {
  editCardFront.classList.toggle("hide");
  editCardBack.classList.toggle("hide");

  if (editSideVar === "(Front)") {
    editSideVar = "(Back)";
  } else {
    editSideVar = "(Front)";
  }

  editSide.innerHTML = editSideVar;
});

// toggle create set menu
addSetBtn.addEventListener("click", () => {
  addSetMenu.classList.toggle("hideAddSetMenu");
});

// handle creation of a new set
createSetBtn.addEventListener("click", () => {
  let name = setName.value;
  let set = new Set(setId, name);
  let newSet = document.createElement("div");
  newSet.classList.add("set");
  newSet.innerHTML = `<h2>${name}</h2>`;
  setsContainer.appendChild(newSet);

  newSet.addEventListener("click", () => {
    let curSet = set;
    displaySet(curSet);
  });

  setName.value = "";
  setId++;
  addSetMenu.classList.add("hideAddSetMenu");
  addSetToLocalStorage(set);
});

// display the contents of the set that the user clicked on
function displaySet(set) {
  const addSetBtn = document.querySelector(".addSetBtn");
  const currentSet = document.querySelector(".currentSet");
  const mySets = document.querySelector(".mySets");
  const currentSetNav = document.querySelector(".currentSetNav");
  addSetBtn.classList.add("hide");
  setsContainer.classList.add("hide");
  cardsDiv.classList.remove("hide");
  mySets.classList.remove("activeLink");
  currentSetNav.classList.remove("hide");
  clearSetsBtn.classList.add("hide");

  currentSet.innerHTML = set.name;

  setUserIsIn = set;
  getCardsFromLocalStorage(set);
  loadCards(set);

  setHeader.innerHTML = `<h2>${set.name}</h2>
  <p>Number of cards: ${set.numCards}</p>`;
}

// add set to local storage
function addSetToLocalStorage(set) {
  localStorage.setItem("SET: " + set.setId, JSON.stringify(set));
}

window.addEventListener("load", loadSets);

// load sets
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

    let set = document.createElement("div");
    set.classList.add("set");

    set.innerHTML = `<h2>${storageSet.name}</h2>`;
    setsContainer.appendChild(set);

    set.addEventListener("click", () => {
      let curSet = storageSet;
      displaySet(curSet);
    });

    setId++;
  }
}

// clear sets
clearSetsBtn.addEventListener("click", () => {
  localStorage.clear();
  setsContainer.innerHTML = "";
  setId = 1;
});

// add card to local storage
function addCardToLocalStorage(card, set) {
  let cards = getCardsFromLocalStorage(set);
  cards.push(card);
  let getSet = JSON.parse(localStorage.getItem("SET: " + set.setId));
  getSet.cards = cards;
  localStorage.setItem("SET: " + set.setId, JSON.stringify(getSet));
}

// get cards from a specific set from local storage
function getCardsFromLocalStorage(set) {
  let getSet = JSON.parse(localStorage.getItem("SET: " + set.setId));
  let cards = getSet.cards;
  return cards;
}

// load and display cards
function loadCards(set) {
  cardId = 1;
  let cards = getCardsFromLocalStorage(set);
  setUserIsIn.numCards = cards.length;
  cards.forEach((card) => {
    let createCard = new Card(card.cardId, card.front, card.back);
    cardId = card.cardId + 1;
  });
}

// toggle edit button on all cards
editCards.addEventListener("click", () => {
  showEditBtn = !showEditBtn;
  const editBtns = document.querySelectorAll(".editCardBtn");

  let flag = "hideAll";
  if (editBtns.length > 0) {
    let btn = document.querySelector(".editCardBtn");
    if (btn.classList.contains("hide")) flag = "showAll";
  }
  editBtns.forEach((btn) => {
    if (flag === "showAll") {
      if (btn.classList.contains("hide")) {
        btn.classList.remove("hide");
      }
    } else {
      if (!btn.classList.contains("hide")) {
        btn.classList.add("hide");
      }
    }
  });
});

// edit card in local storage
function editCardLocalStorage(card, set) {
  let cards = getCardsFromLocalStorage(set);

  let cardId = card.cardId - 1;
  let setId = set.setId;

  cards[cardId] = card;
  set.cards = cards;
  localStorage.setItem("SET: " + setId, JSON.stringify(set));
}

// enable review menu
reviewCardsBtn.addEventListener("click", () => {
  reviewCardsMenu.classList.remove("hide");

  // hide everything else
  setHeader.classList.add("hide");
  setBtnContainer.classList.add("hide");
  cardsContainer.classList.add("hide");

  loadCardsForReview(setUserIsIn);
});

// close review menu
closeReviewMenuBtn.addEventListener("click", () => {
  reviewCardsMenu.classList.add("hide");

  setHeader.classList.remove("hide");
  setBtnContainer.classList.remove("hide");
  cardsContainer.classList.remove("hide");
});

let counter = 0;
let currentReviewCard;
let reviewCardFront;
let reviewCardBack;

// load cards into the review menu
function loadCardsForReview(set) {
  // clear any existing elements
  reviewCardContainer.innerHTML = "";
  let cards = set.cards;

  // reset counter and review cards array
  counter = 0;
  reviewCards = [];

  cards.forEach((card, index) => {
    let tempCard = new reviewCard(card, index);
  });

  currentReviewCard = document.querySelector(".reviewCard");
  reviewCardFront = document.querySelector(".cardFront");
  reviewCardBack = document.querySelector(".cardBack");

  if (currentReviewCard)
    cardWidth = currentReviewCard.getBoundingClientRect().width;

  // flip the card
  currentReviewCard.addEventListener("click", flip);
}

// next review card
const reviewNextBtn = document.querySelector(".reviewNextBtn");
reviewNextBtn.addEventListener("click", () => {
  counter++;
  if (counter >= reviewCards.length) counter = 0;
  slideReviewCards();
});

// prev review card
const reviewPrevBtn = document.querySelector(".reviewPrevBtn");
reviewPrevBtn.addEventListener("click", () => {
  counter--;
  if (counter < 0) counter = reviewCards.length - 1;
  slideReviewCards();
});

function slideReviewCards() {
  cardWidth = currentReviewCard.getBoundingClientRect().width;
  currentReviewCard.removeEventListener("click", flip);
  reviewCards.forEach((card) => {
    card.style.transform = `translateX(-${(counter * cardWidth) / 0.8}px)`;
  });

  currentReviewCard = reviewCards[counter];
  reviewCardFront = document.getElementById(`cardFront: ${counter + 1}`);
  reviewCardBack = document.getElementById(`cardBack: ${counter + 1}`);

  // flip the card
  currentReviewCard.addEventListener("click", flip);
}

function flip() {
  reviewCardFront.classList.toggle("flipped");
  reviewCardBack.classList.toggle("flipped");
}


// adjust review cards' scroll distance if window gets resized
window.addEventListener("resize", () => {
  if (cardWidth && reviewCards) {
    cardWidth = currentReviewCard.getBoundingClientRect().width;
    reviewCards.forEach((card) => {
      card.style.transform = `translateX(-${(counter * cardWidth) / 0.8}px)`;
    });
  }
});

// study a set
studyCardsBtn.addEventListener('click', () => {
  var currentSetId = setUserIsIn.setId;
  localStorage.setItem("Study Set ID", JSON.stringify(currentSetId));
  location.href = "studySet.html";
})

window.addEventListener('load', () => {
  localStorage.removeItem("Study Set ID");
})


