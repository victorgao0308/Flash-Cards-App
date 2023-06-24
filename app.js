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


addCard.addEventListener("click", () => {
  addCardMenu.classList.toggle("hideAddCardMenu");

  let side = "(Front)";


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
  console.log('click')
  const cardValue = cardInfo.value;
  const cardBackValue = cardDesc.value;
  let card = new Card(id, cardValue, cardBackValue);
  cards.push(card);
  
  let newCard = document.createElement('div');
  newCard.classList.add("card");
  cardsContainer.appendChild(newCard);
});







