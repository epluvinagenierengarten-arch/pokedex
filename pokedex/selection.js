const searchBar = document.querySelector("#barreDeRecherche")
const searchInput = document.querySelector('#site-search')

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
if (localStorage.getItem("currentPage") != null) {
    currentPage = localStorage.getItem("currentPage") // C'est un str on a pas besoin de le json
}

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

searchInput.addEventListener("input", ()=>{ // Quand on recoit tape dans la barre de recherche
    if (currentPage == "fav") getFavs(searchInput.value, currentType)
    else getJSON(searchInput.value, currentType)
})

// Fonction d'appel et d'affichage de l'API
async function getJSON(inputSearch = "", inputType = "") {
    if (inputSearch == "" && inputType == "") { // Si la barre est vide
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
async function showImages(api, inputType){
    pokemonSection.innerHTML = ""
    dittoMessage.classList.remove("hidden")

    api.forEach(element => { // Pour chaque pokemon dans la liste triée
        fetch(element.url) // On va chercher l'API de son lien
            .then(r => r.json())
            .then(d => {
                if (d.types.some((item) => item.type.name == inputType) || inputType == "") { // On garde que les Pokemons qui correspondent au type choisi (si y'a un type)
                    dittoMessage.classList.add("hidden") // On retire le message d'erreur
                    showImage(element.name, d.sprites.front_default) // On affiche l'image
                }
            }
            )
            .catch(error => console.error("Error:", error))
    });
}

function showImage(name, image) {
    // Là on créé petit à petit cet élement :
    // <div class="pokemon-card">
    //      <img src={image}/>
    //      <h1 src={name}/>
    // </div>
    let img = document.createElement("img")
    let title = document.createElement("h1")
    let div = document.createElement("div")

    img.src = image;
    title.innerHTML = name;

    div.classList.add("pokemon-card")
    div.appendChild(img)
    div.appendChild(title)

    // On balance cet élement dans la section Pokémon
    pokemonSection.appendChild(div)
}

dropDownFilter.addEventListener("click", ()=>{ // Ouvrir menu types
    filterModal.classList.remove("closed")
})

filterSelections.forEach(selection => { // Selection des types
    selection.addEventListener("click", ()=>{
        dropDownFilter.children[0].src = selection.src; // On change l'image du bouton type
        if (selection.alt != "all") { // *all types
            if (currentPage == "fav") getFavs(searchInput.value, selection.alt)
            else getJSON(searchInput.value, selection.alt)
            currentType = selection.alt;
        } else {
            if (currentPage == "fav") getFavs(searchInput)
            else getJSON(searchInput.value)
            currentType = "";
        }
        filterModal.classList.add("closed") // On ferme le modal
    })
});

window.addEventListener('click', event=>{ // Fermer la fenetre si on clique pas sur le modal
    if (!filterModal.contains(event.target) && !dropDownFilter.contains(event.target)) {
        filterModal.classList.add("closed")
    }
})

// Gestion d'onglets
goToSearchButton.addEventListener("click", e=>{
    // On souligne le bon
    goToSearchButton.style.textDecoration = "underline"
    goToListButton.style.textDecoration = "none"
    goToFavButton.style.textDecoration = "none"

    currentPage = "search"
    localStorage.setItem("currentPage", "search") // C'est un str on a pas besoin de le json
    updatePage()
})

goToListButton.addEventListener("click", e=>{
    // On souligne le bon
    goToSearchButton.style.textDecoration = "none"
    goToListButton.style.textDecoration = "underline"
    goToFavButton.style.textDecoration = "none"

    currentPage = "list"
    localStorage.setItem("currentPage", "list") // C'est un str on a pas besoin de le json
    updatePage()
})

goToFavButton.addEventListener("click", e=>{
    // On souligne le bon
    goToSearchButton.style.textDecoration = "none"
    goToListButton.style.textDecoration = "none"
    goToFavButton.style.textDecoration = "underline"

    currentPage = "fav"
    localStorage.setItem("currentPage", "fav") // C'est un str on a pas besoin de le json
    updatePage()
})

function updatePage() {
    switch(currentPage) {
        case "search" : {
            searchBar.classList.remove("hidden")
            dropDownFilter.classList.remove("hidden")
            getJSON("")
            return;
        }
        case "list" : {
            searchBar.classList.add("hidden")
            dropDownFilter.classList.add("hidden")
            getJSON("*")
            return;
        }
        case "fav" : {
            searchBar.classList.remove("hidden")
            dropDownFilter.classList.remove("hidden")
            getFavs();
            return;
        }
        default : return;
    }
}

// Favs
function getFavs(inputSearch, inputType) {
    // ET LA ON CHERCHE ET ON AFFICHE LES FAVS ICI
}