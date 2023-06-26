const addSetBtn = document.querySelector(".addSetBtn");
const addSetMenu = document.querySelector(".addSetMenu");
const createSetBtn = document.querySelector(".createSetBtn");
const setsContainer = document.querySelector(".setsContainer");
const setName = document.querySelector(".addSetInput")

addSetBtn.addEventListener("click", () => {
  addSetMenu.classList.toggle("hideAddSetMenu");
});

let setId = 1;
let sets = [];


createSetBtn.addEventListener("click", () => {
    let name = setName.value; 
    sets.push(new Set(setId, name));
    setId++;
    let newSet = document.createElement('div');
    newSet.classList.add("set");
    newSet.innerHTML = `<h2>${name}</h2>`
    setsContainer.appendChild(newSet);
    console.log(sets);
})

class Set {
    constructor(id, name) {
        this.cards = []
        this.id = id;
        this.name = name;
    }
}