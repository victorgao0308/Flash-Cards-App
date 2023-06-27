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

let setId = 1;
let sets = [];

let id = 1;
let cards = [];
let side = "(Front)";

// keep track of which set the user is in
let setUserIsIn;

// classes
class Card {
  constructor(id, front, back) {
    this.id = id;
    this.front = front;
    this.back = back;
  }
}

class Set {
  constructor(id, name) {
    this.cards = [];
    this.id = id;
    this.name = name;
  }
}

// toggle add card menu
addCard.addEventListener("click", () => {
  addCardMenu.classList.toggle("hideAddCardMenu");
  flipBtn.addEventListener("click", () => {
    cardFront.classList.toggle("hideCard");
    cardBack.classList.toggle("hideCard");
    if (side === "(Front)") {
      side = "(Back)";
    } else {
      side = "(Front)";
    }
    cardSide.innerHTML = side;
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
});

// add a new card to a set
function addNewCard() {
  const cardValue = cardInfo.value;
  const cardBackValue = cardDesc.value;
  let card = new Card(id, cardValue, cardBackValue);
  cards.push(card);
  id += 1;
  let newCard = document.createElement("div");
  newCard.classList.add("card");
  let displayCard = document.createElement("span");
  displayCard.classList.add("displayCard");
  displayCard.innerHTML = cardValue;
  newCard.appendChild(displayCard);
  let displayCardBack = document.createElement("span");
  displayCardBack.classList.add("displayCardBack", "hideCardSide");
  displayCardBack.innerHTML = cardBackValue;
  newCard.appendChild(displayCardBack);
  let flipCardBtn = document.createElement("button");
  flipCardBtn.classList.add("flipCardBtn");
  flipCardBtn.innerHTML = `<i class="fa fa-repeat" aria-hidden="true"></i>`;
  newCard.appendChild(flipCardBtn);
  cardsContainer.appendChild(newCard);
  flipCardBtn.addEventListener("click", () => {
    displayCard.classList.toggle("hideCardSide");
    displayCardBack.classList.toggle("hideCardSide");
  });

  cardInfo.value = "";
  cardDesc.value = "";
  addCardToLocalStorage(card, setUserIsIn);
}

addSetBtn.addEventListener("click", () => {
  addSetMenu.classList.toggle("hideAddSetMenu");
});

// handle creation of a new set
createSetBtn.addEventListener("click", () => {
  let name = setName.value;
  let set = new Set(setId, name);
  sets.push(set);
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
  const setHeader = document.querySelector(".setHeader");
  const currentSet = document.querySelector(".currentSet");
  const mySets = document.querySelector(".mySets");
  const currentSetNav = document.querySelector(".currentSetNav");
  addSetBtn.classList.add("hide");
  setsContainer.classList.add("hide");
  cardsDiv.classList.remove("hide");
  mySets.classList.remove("activeLink");
  currentSetNav.classList.remove("hide");
  currentSet.innerHTML = set.name;
  setHeader.innerHTML = `<h2>${set.name}</h2>
  <p>${set.id}</p>`;
  setUserIsIn = set;
  getCardsFromLocalStorage(set);
  loadCards(set);
}

// add set to local storage
function addSetToLocalStorage(set) {
  localStorage.setItem("SET: " + set.id, JSON.stringify(set));
}

// retrieve sets from local storage
function getLocalStorage(item) {
  return localStorage.getItem(item)
    ? JSON.parse(localStorage.getItem(item))
    : [];
}

window.addEventListener("load", loadSets);

// load sets
function loadSets() {
  let keys = Object.keys(localStorage);

  for (let i = 1; i <= keys.length; i++) {
    let key = "SET: " + i;
    let storageSet = localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : [];
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

  let getSet = JSON.parse(localStorage.getItem("SET: " + set.id));
  getSet.cards = cards;
  localStorage.setItem("SET: " + set.id, JSON.stringify(getSet));
}

// get cards from local storage
function getCardsFromLocalStorage(set) {
  let getSet = JSON.parse(localStorage.getItem("SET: " + set.id));
  let cards = getSet.cards;
  return cards;
}

// load and display cards
function loadCards(set) {
  let cards = getCardsFromLocalStorage(set);

  cards.forEach((card) => {
    let newCard = document.createElement("div");
    newCard.classList.add("card");
    let displayCard = document.createElement("span");
    displayCard.classList.add("displayCard");
    displayCard.innerHTML = card.front;
    newCard.appendChild(displayCard);
    let displayCardBack = document.createElement("span");
    displayCardBack.classList.add("displayCardBack", "hideCardSide");
    displayCardBack.innerHTML = card.back;
    newCard.appendChild(displayCardBack);
    let flipCardBtn = document.createElement("button");
    flipCardBtn.classList.add("flipCardBtn");
    flipCardBtn.innerHTML = `<i class="fa fa-repeat" aria-hidden="true"></i>`;
    newCard.appendChild(flipCardBtn);
    cardsContainer.appendChild(newCard);
    flipCardBtn.addEventListener("click", () => {
      displayCard.classList.toggle("hideCardSide");
      displayCardBack.classList.toggle("hideCardSide");
    });

    id++;
  });
}
