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
const closeEditCardMenu = document.querySelector(".closeEditCardMenu");

let setId = 1;
let cardId = 1;
let side = "(Front)";
let editSideVar = "(Front)";

let cards = [];

let showEditBtn = false;

// keep track of which set the user is in
let setUserIsIn;

// classes
class Card {
  constructor(cardId, front, back) {
    this.cardId = cardId;
    this.front = front;
    this.back = back;
  }

  // edit card
  editCard(newFront, newBack) {
    this.front = newFront;
    this.back = newBack;
  }
}

class Set {
  constructor(setId, name) {
    this.cards = [];
    this.setId = setId;
    this.name = name;
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
});

// add a new card to a set
function addNewCard() {
  const cardValue = cardInfo.value;
  const cardBackValue = cardDesc.value;
  let card = new Card(cardId, cardValue, cardBackValue);
  cards.push(card);
  cardId += 1;

  let newCard = document.createElement("div");
  newCard.classList.add("card");
  newCard.innerHTML = `<div class="displayCard" id = "cardFront ${card.cardId}">${cardValue}</div><div class="displayCardBack hideCardSide" id = "cardBack ${card.cardId}">${cardBackValue}</div><button class="editCardBtn hide" id = "cardEditBtn ${card.cardId}"><i class="fa-solid fa-pen-to-square"></i></button>`;

  cardsContainer.appendChild(newCard);

  let editBtn = document.getElementById("cardEditBtn " + card.cardId);
  let cardFront = document.getElementById("cardFront " + card.cardId);
  let cardBack = document.getElementById("cardBack " + card.cardId);

  if (showEditBtn) {
    editBtn.classList.remove("hide");
  }

  newCard.addEventListener("click", () => {
    cardFront.classList.toggle("hideCardSide");
    cardBack.classList.toggle("hideCardSide");
  });

  cardInfo.value = "";
  cardDesc.value = "";
  addCardToLocalStorage(card, setUserIsIn);

  editBtn.addEventListener("click", editCardFunction);

  function editCardFunction() {
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
    cardFront.classList.toggle("hideCardSide");
    cardBack.classList.toggle("hideCardSide");

    let editBtnContainer = document.createElement("div");
    editBtnContainer.classList.add("editBtnContainer");
    editBtnContainer.innerHTML = `<button class="editFlipBtn" id = "editFlip ${card.cardId}">Flip Over</button>
    <button class="editDoneBtn" id = "editDone ${card.cardId}">Done</button>`;

    editCardMenu.appendChild(editBtnContainer);

    const editFlipBtn = document.getElementById("editFlip " + card.cardId);
    const editDoneBtn = document.getElementById("editDone " + card.cardId);

    editCardInfo.innerHTML = card.front;
    editCardDesc.innerHTML = card.back;
    console.log(card.front, card.back);

    editFlipBtn.addEventListener("click", editFlipBtnFunction);

    function editFlipBtnFunction() {
      editCardFront.classList.toggle("hide");
      editCardBack.classList.toggle("hide");

      if (editSideVar === "(Front)") {
        editSideVar = "(Back)";
      } else {
        editSideVar = "(Front)";
      }

      editSide.innerHTML = editSideVar;
    }

    // TODO: update value in local storage
    editDoneBtn.addEventListener("click", editDoneBtnFunction);

    function editDoneBtnFunction() {
      let newFront = editCardInfo.value;
      let newBack = editCardDesc.value;
      card.editCard(newFront, newBack);
      cardFront.innerHTML = newFront;
      cardBack.innerHTML = newBack;
      editCardLocalStorage(card, setUserIsIn);
    }

    closeEditCardMenu.addEventListener("click", () => {
      editCardMenu.classList.add("hide");
      editFlipBtn.removeEventListener("click", editFlipBtnFunction);
      editDoneBtn.removeEventListener("click", editDoneBtnFunction);
    });
  }
}

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
  const setHeader = document.querySelector(".setHeader");
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
  setHeader.innerHTML = `<h2>${set.name}</h2>
  <p>${set.setId}</p>`;
  setUserIsIn = set;
  getCardsFromLocalStorage(set);
  loadCards(set);
}

// add set to local storage
function addSetToLocalStorage(set) {
  localStorage.setItem("SET: " + set.setId, JSON.stringify(set));
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
  setId = 1;
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
  let getSet = JSON.parse(localStorage.getItem("SET: " + set.setId));
  getSet.cards = cards;
  localStorage.setItem("SET: " + set.setId, JSON.stringify(getSet));
}

// get cards from local storage
function getCardsFromLocalStorage(set) {
  let getSet = JSON.parse(localStorage.getItem("SET: " + set.setId));
  let cards = getSet.cards;
  return cards;
}

// load and display cards
function loadCards(set) {
  cardId = 1;
  let cards = getCardsFromLocalStorage(set);
  // TODO: redo this
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
  console.log(card, set);
}
