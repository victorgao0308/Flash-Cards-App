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
    console.log(cards);
}



// classes
class studyCard {
    constructor(card) {
        this.card = card;
    }
}

class multipleChoiceCard {
    constructor(card) {
        this.card = card;
    }
}

class fillInTheBlankCard {
    constructor(card) {
        this.card = card;
    }
}