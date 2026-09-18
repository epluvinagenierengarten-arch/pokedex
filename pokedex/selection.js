const searchInput = document.querySelector('#site-search');
const result = document.querySelector('#site-search')
const pokemonSection = document.querySelector("#sectionPokemons")
const endMessage =  document.querySelector("#sectionStartMessage")
const dittoMessage = document.querySelector("#searchErrorMessage")

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
    dittoMessage.classList.add("hidden")
    if (searchInput.value != "") {
        getJSON(searchInput.value)
        endMessage.classList.add("hidden")
    } else {
        pokemonSection.innerHTML = ""
        endMessage.classList.remove("hidden")
    }
})

async function getJSON(inputSearch = "") {
    let api = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then((response)=>response.json())
        .then((responseJson)=>{return responseJson});

    let newApi = api.results.filter((item) => item.name.includes(inputSearch.toLowerCase()))
    showImages(newApi)
}

async function showImages(api){
    pokemonSection.innerHTML = ""
    api.forEach(element => {
        fetch(element.url)
            .then(r => r.json())
            .then(d =>
                showImage(element.name, d.sprites.front_default)
            )
            .catch(error => console.error("Error:", error))
    });
    if (api.length <= 0) {
        dittoMessage.classList.remove("hidden")
    }
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