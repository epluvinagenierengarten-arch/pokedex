const searchBarPart = document.querySelector("#barreDeRecherche") // (dans ton HTML l'id est barreDeRecherche, pas searchInput)
const searchInput = document.querySelector('#site-search')

const pokeModal = document.querySelector("#pokeModal")

const pokemonSection = document.querySelector("#sectionPokemons")
const endMessage =  document.querySelector("#sectionStartMessage")
const dittoMessage = document.querySelector("#searchErrorMessage")

const dropDownFilter = document.querySelector("#dropDownFilter")
const filterSelections = document.querySelectorAll(".filterSelection")
const filterModal = document.querySelector("#filterModal")

const goToSearchButton = document.querySelector("#goToSearchButton")
const goToListButton = document.querySelector("#goToListButton")
const goToFavButton = document.querySelector("#goToFavButton")

let currentType = "";
let currentPage = "";
let searchId = 0 

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

function refresh() {
    if (currentPage == "fav") getFavs(searchInput.value, currentType)
    else if (currentPage == "list") getJSON("*", currentType)
    else getJSON(searchInput.value, currentType)
}

searchInput.addEventListener("input", refresh)

// Fonction d'appel et d'affichage de l'API
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

    // On tri selon le nom entré
    let newApi = api.results
    if (inputSearch != "*") newApi = api.results.filter((item) => item.name.includes(inputSearch.toLowerCase()))
    showImages(newApi, inputType)
}

// Cette fonction va chercher les images dans les sous-liens de l'API
async function showImages(api, inputType) {
    const myId = ++searchId
    pokemonSection.innerHTML = ""
    dittoMessage.classList.remove("hidden")

    try {
        const results = await Promise.all(
            api.map(el => fetch(el.url).then(r => r.json()))
        )
        if (myId !== searchId) return

        results
            .filter(d => inputType == "" || d.types.some(t => t.type.name == inputType))
            .forEach(d => {
                dittoMessage.classList.add("hidden")
                showCard(d)
            })
    } catch (error) {
        console.error("Error:", error)
    }
}

function showCard(data) {
    // Là on créé petit à petit cet élement :
    // <div class="pokemon-card">
    //      <img src={image}/>
    //      <h1 src={name}/>
    //      <button>♡</button>
    // </div>
    let img = document.createElement("img")
    let title = document.createElement("h1")
    let div = document.createElement("div")
    let favButton = document.createElement("button") 

    img.src = data.sprites.front_default;
    title.innerHTML = data.name;

    favButton.textContent = isFav(data.name) ? "★" : "☆"
    favButton.classList.add("fav-button")

    favButton.addEventListener("click", (event) => {
        event.stopPropagation()
        toggleFav(data.name) //etoile vide ou pas
        favButton.textContent = isFav(data.name) ? "★" : "☆"

        if (currentPage == "fav") refresh()
    })

    div.classList.add("pokemon-card")
    div.appendChild(img)
    div.appendChild(title)
    div.appendChild(favButton)
    div.addEventListener("click", () => openDetails(data))

    pokemonSection.appendChild(div)
}

dropDownFilter.addEventListener("click", ()=>{ // Ouvrir menu types
    filterModal.classList.remove("closed")
})

filterSelections.forEach(selection => { // Selection des types
    selection.addEventListener("click", ()=>{
        dropDownFilter.children[0].src = selection.src; // On change l'image du bouton type
        currentType = (selection.alt != "all") ? selection.alt : "" // *all types
        refresh()
        filterModal.classList.add("closed") // On ferme le modal
    })
});

window.addEventListener('click', event=>{ // Fermer la fenetre si on clique pas sur le modal
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
        </div>
        <div id="pokeInfos">
            <p><strong>Height :</strong> ${data.height / 10} m</p>
            <p><strong>Weight :</strong> ${data.weight / 10} kg</p>
            <p><strong>Type(s) :</strong> ${types}</p>
        </div>
        <ul class="stats-list">${stats}</ul>
    `;

    pokeModal.classList.remove("closed")
}

window.addEventListener("click", e=>{ // Fermer le modal quand on clique autre part que sur le modal ou un pokemon
    if (!pokeModal.contains(e.target) && !(e.target.classList.contains("pokemon-card") || e.target.parentNode.classList.contains("pokemon-card"))) {
        pokeModal.classList.add("closed")
    }
})

// -- GESTION D'ONGLETS --
function changePage(page) {
    currentPage = page
    localStorage.setItem("currentPage", page) // C'est un str on a pas besoin de le json
    updatePage()
}


goToSearchButton.addEventListener("click", e=>{changePage("search") })
goToListButton.addEventListener("click", e=>{changePage("list") })
goToFavButton.addEventListener("click", e=>{changePage("fav") })

function updatePage() {
    currentType = "";
    dropDownFilter.children[0].src = "../soucres/git all_icon.png"

    switch(currentPage) {
        case "search" : { // Remets la barre de recherche et setup de base
            // On souligne le bon
            goToSearchButton.classList.add("selected")
            goToListButton.classList.remove("selected")
            goToFavButton.classList.remove("selected")

            searchBarPart.classList.remove("hidden")
            getJSON("", currentType)
            return;
        }
        case "list" : { // Retire la barre de recherche et affiche tout
            // On souligne le bon
            goToSearchButton.classList.remove("selected")
            goToListButton.classList.add("selected")
            goToFavButton.classList.remove("selected")

            searchBarPart.classList.add("hidden")
            getJSON("*", currentType)
            return;
        }
        case "fav" : { // Remets la barre de recherche et setup les favs
            // On souligne le bon
            goToSearchButton.classList.remove("selected")
            goToListButton.classList.remove("selected")
            goToFavButton.classList.add("selected")

            searchBarPart.classList.remove("hidden")
            getFavs("", currentType);
            return;
        }
        default : return;
    }
}

//les favorisssssssss
// On stocke uniquement les noms dans le localStorage ;)
function loadFavs() {
    return JSON.parse(localStorage.getItem("favs")) || []
}

function isFav(name) {
    return loadFavs().includes(name)
}

function toggleFav(name){
    let favs = loadFavs()
    if (favs.includes(name)){
        favs = favs.filter(n => n != name)
    } else {
        favs.push(name)
    }

    localStorage.setItem("favs", JSON.stringify(favs))
}

function getFavs(inputSearch = "", inputType = ""){
    endMessage.classList.add("hidden")

    const favs = loadFavs()
        .filter(name => name.includes(inputSearch.toLowerCase()))
        .map(name => ({ 
            name: name,
            url: `https://pokeapi.co/api/v2/pokemon/${name}`
        }))

    showImages(favs, inputType) // même affichage que pour la recherche yipee
}

if (localStorage.getItem("currentPage") != null) {
    currentPage = localStorage.getItem("currentPage")
    updatePage()
}