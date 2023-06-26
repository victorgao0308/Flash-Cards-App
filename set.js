const addSetBtn = document.querySelector(".addSetBtn");
const addSetMenu = document.querySelector(".addSetMenu");
const createSetBtn = document.querySelector(".createSetBtn");
const setsContainer = document.querySelector(".setsContainer");
const setName = document.querySelector(".addSetInput");
const cardsDiv = document.querySelector(".cardsDiv");

const clearSetsBtn = document.querySelector(".clearSetsBtn");

addSetBtn.addEventListener("click", () => {
  addSetMenu.classList.toggle("hideAddSetMenu");
});

let setId = 1;
let sets = [];

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

class Set {
  constructor(id, name) {
    this.cards = [];
    this.id = id;
    this.name = name;
  }
}

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
}

// add set to local storage
function addSetToLocalStorage(set) {
  let sets = getLocalStorage("sets");
  sets.push(set);
  localStorage.setItem("sets", JSON.stringify(sets));
}

// retrieve from local storage
function getLocalStorage(item) {
  return localStorage.getItem(item)
    ? JSON.parse(localStorage.getItem(item))
    : [];
}

window.addEventListener("load", loadSets);

// load sets
function loadSets() {
  let sets = getLocalStorage("sets");
  sets.forEach((set) => {
    let newSet = document.createElement("div");
    newSet.classList.add("set");
    newSet.innerHTML = `<h2>${set.name}</h2>`;
    setsContainer.appendChild(newSet);

    newSet.addEventListener("click", () => {
      let curSet = set;
      console.log(set.cards);
      displaySet(curSet);
    });
    setId++;
  });
}


// clear sets
clearSetsBtn.addEventListener('click', () => {
  localStorage.clear();
  setsContainer.innerHTML = "";
})
