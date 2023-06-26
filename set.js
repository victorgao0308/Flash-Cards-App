const addSetBtn = document.querySelector(".addSetBtn");
const addSetMenu = document.querySelector(".addSetMenu");
const createSetBtn = document.querySelector(".createSetBtn");
const setsContainer = document.querySelector(".setsContainer");
const setName = document.querySelector(".addSetInput");

addSetBtn.addEventListener("click", () => {
  addSetMenu.classList.toggle("hideAddSetMenu");
});

let setId = 1;
let sets = [];

// create a new set
createSetBtn.addEventListener("click", () => {
  let name = setName.value;

  let set = new Set(setId, name);
  sets.push(set);
  let newSet = document.createElement("div");
  newSet.classList.add("set");
  newSet.innerHTML = `<h2>${name}</h2>`;
  setsContainer.appendChild(newSet);

  newSet.addEventListener("click", () => {
    window.location.href = `currentSet.html`;
  });

  setName.value = "";
  setId++;
});

class Set {
  constructor(id, name) {
    this.cards = [];
    this.id = id;
    this.name = name;
  }
}
