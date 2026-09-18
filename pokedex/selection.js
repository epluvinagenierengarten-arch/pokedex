const searchInput = document.querySelector('#site-search')
const result = document.querySelector('#site-search')

const pokemonSection = document.querySelector("#sectionPokemons")
const endMessage =  document.querySelector("#sectionStartMessage")
const dittoMessage = document.querySelector("#searchErrorMessage")

const dropDownFilter = document.querySelector("#dropDownFilter")
const filterSelections = document.querySelectorAll(".filterSelection")
const filterModal = document.querySelector("#filterModal")

let currentType = "";

class Pokemon{
    id
    Nom
    Taille
    Poids
    Type
    Visuel
    favoris
}

// https://pokeapi.co/api/v2/pokemon?limit=151

searchInput.addEventListener("input", ()=>{
    getJSON(searchInput.value, currentType)
})

async function getJSON(inputSearch = "", inputType = "") {
    if (inputSearch == "" && inputType == "") {
        pokemonSection.innerHTML = ""
        endMessage.classList.remove("hidden")
        return;
    } else {
        endMessage.classList.add("hidden")
    }

    let api = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then((response)=>response.json())
        .then((responseJson)=>{return responseJson});

    let newApi = api.results.filter((item) => item.name.includes(inputSearch.toLowerCase()))
    showImages(newApi, inputType)
}

async function showImages(api, inputType){
    pokemonSection.innerHTML = ""
    dittoMessage.classList.remove("hidden")
    api.forEach(element => {
        fetch(element.url)
            .then(r => r.json())
            .then(d => {
                if (d.types.some((item) => item.type.name == inputType) || inputType == "") {
                    dittoMessage.classList.add("hidden")
                    showImage(element.name, d.sprites.front_default)
                }
            }
            )
            .catch(error => console.error("Error:", error))
    });
}

function showImage(name, image) {
    let img = document.createElement("img")
    let title = document.createElement("h1")
    let div = document.createElement("div")

    img.src = image;
    title.innerHTML = name;

    div.classList.add("pokemon-card")
    div.appendChild(img)
    div.appendChild(title)

    pokemonSection.appendChild(div)
}

dropDownFilter.addEventListener("click", ()=>{
    filterModal.classList.remove("closed")
})

filterSelections.forEach(selection => {
    selection.addEventListener("click", ()=>{
        dropDownFilter.children[0].src = selection.src;
        filterModal.classList.add("closed")
        if (selection.alt != "all") {
            getJSON(searchInput.value, selection.alt)
            currentType = selection.alt;
        } else {
            getJSON(searchInput.value, "")
            currentType = "";
        }
    })
});

window.addEventListener('click', event=>{
    console.log(event.target, filterModal.contains(event.target))
    if (!filterModal.contains(event.target) && !dropDownFilter.contains(event.target)) {
        filterModal.classList.add("closed")
    }
})