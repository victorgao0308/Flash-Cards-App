const currentSetLabel = document.querySelector(".currentSetLabel");

let studySetId;


// store the cards
let cards = [];

// store the study cards
let studyCards = [];

// get set id to study
function getStudySetId() {
    studySetId = localStorage.getItem("Study Set ID") ? JSON.parse(localStorage.getItem("Study Set ID")) : null;
}


window.addEventListener('load', () => {
    getStudySetId();
    loadCards();
})

// load cards into cards array
function loadCards() {
    if (!studySetId) {
        currentSetLabel.innerHTML = "Select a set to study..."
        return;
    }
    let currentSet =  JSON.parse(localStorage.getItem("SET: " + studySetId));
    currentSetLabel.innerHTML = currentSet.name;
    let currentCards = currentSet.cards;
    currentCards.forEach(card => {
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
        Math.random() > 0.5 ? quizCards.push(new multipleChoiceCard(card)) : quizCards.push(new fillInTheBlankCard(card));
        Math.random() > 0.5 ? quizCards.push(new multipleChoiceCard(card)) : quizCards.push(new fillInTheBlankCard(card));
    });

    shuffleArray(quizCards);

    quizCards.forEach(quizCard => {
        let index = indices.get(quizCard.card.cardId);
        let insertIndex = Math.floor(Math.random() * (studyCards.length - index)) + index + 1;
        
        studyCards.splice(insertIndex, 0, quizCard);
        for (let [key, value] of indices) {
            if (value >= insertIndex) {
                indices.set(key, value + 1);
            }
        }
    })

    console.log(studyCards);
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
        this.card = card
    }
}
// classes
class studyCard extends card{
    constructor(card) {
        super(card);
    }
}

class multipleChoiceCard extends card{
    constructor(card) {
        super(card);
    }
}

class fillInTheBlankCard extends card{
    constructor(card) {
        super(card);
    }
}



// for study cards

// const studyCardElement = document.querySelector(".studyCard");
// const cardFront = document.querySelector(".cardFront");
// const cardBack = document.querySelector(".cardBack");
// const cardType = document.querySelector(".cardType")

// cardType.innerHTML = "Learn";

// studyCardElement.addEventListener('click', () => {
//     cardFront.classList.toggle('flipped');
//     cardBack.classList.toggle('flipped');
// })