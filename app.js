import { Card } from "./card.js";

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


let id = 1;
let cards = [];
let side = "(Front)";

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

  let flipCardBtn = document.createElement('button');
  flipCardBtn.classList.add("flipCardBtn");
  flipCardBtn.innerHTML = `<i class="fa fa-repeat" aria-hidden="true"></i>`
  newCard.appendChild(flipCardBtn);

  cardsContainer.appendChild(newCard);


  flipCardBtn.addEventListener('click', () => {
    displayCard.classList.toggle('hideCardSide');
    displayCardBack.classList.toggle('hideCardSide');
  })

  cardInfo.value = "";
  cardDesc.value = "";

}
