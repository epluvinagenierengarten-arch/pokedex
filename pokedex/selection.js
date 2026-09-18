const searchInput = document.querySelector('#site-search')
const result = document.querySelector('#site-search')

const pokeModal = document.querySelector("#pokeModal")

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
                    showCard(d)
                }
            }
            )
            .catch(error => console.error("Error:", error))
    });
}

function showCard(data) {
    let img = document.createElement("img")
    let title = document.createElement("h1")
    let div = document.createElement("div")

    img.src = data.sprites.front_default;
    title.innerHTML = data.name;

    div.classList.add("pokemon-card")
    div.appendChild(img)
    div.appendChild(title)

    // Au clic sur la carte -> ouvre le détail
    div.addEventListener("click", () => openDetails(data))

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

function openDetails(data) {
    const types = data.types.map(t => t.type.name).join(", ");
    const stats = data.stats
        .map(s => `<li>${s.stat.name} : ${s.base_stat}</li>`)
        .join("");

    pokeModal.innerHTML = `
        <div id="pokeId">
            <img src="${data.sprites.front_default}" alt="${data.name}">
            <h2>${data.name}</h2>
        <div/>
        <div id="pokeInfos">
            <p><strong>Height :</strong> ${data.height / 10} m</p>
            <p><strong>Weight :</strong> ${data.weight / 10} kg</p>
            <p><strong>Type(s) :</strong> ${types}</p>
        <div/>
        <ul class="stats-list">${stats}</ul>
    `;

    pokeModal.classList.remove("hidden")
}

window.addEventListener("click", e=>{ // Fermer le modal quand on clique autre part que sur le modal ou un pokemon
    if (!pokeModal.contains(e.target) && !(e.target.classList.contains("pokemon-card") || e.target.parentNode.classList.contains("pokemon-card"))) {
        pokeModal.classList.add("hidden")
    }
})