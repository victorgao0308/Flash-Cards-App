let curId;
let curName;

function importSet(id, name) {
    curId = id;
    curName = name;
    const curSet = document.querySelector('.curSet');
    const setId = document.querySelector('.setId');
    curSet.innerHTML = curName;
    setId.innerHTML = curId;

    
}

console.log('?????')


