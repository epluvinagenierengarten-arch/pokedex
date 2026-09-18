const searchInput = document.querySelector('#site-search');
const dialogue = document.querySelector('#dialogue');
console.log(dialogue);
const pokemonSection = document.querySelector("#sectionPokemons");

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

getJSON()

searchInput.addEventListener("input", ()=>{
    getJSON(searchInput.value)
})

//bouton pour "fermer" la carte

dialogue.addEventListener("click", (event) => {
    if (event.target.id === "fermer") {
        dialogue.close();
    }
});

async function getJSON(inputSearch = "") {
    let api = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then((response)=>response.json())
        .then((responseJson)=>{return responseJson});

    let newApi = api.results.filter((item) => item.name.includes(inputSearch))
            showImages(newApi)
}

function showImage(name, data) {
    let img = document.createElement("img")
    let title = document.createElement("h1")
    let div = document.createElement("div")

    img.src = data.sprites.front_default;
    title.innerHTML = name;

    div.classList.add("pokemon-card")
    div.appendChild(img)
    div.appendChild(title)
    div.addEventListener("click", () => openDetails(data))
    pokemonSection.appendChild(div)
}

async function showImages(api){
    pokemonSection.innerHTML = ""
    api.forEach(element => {
        fetch(element.url)
            .then(r => r.json())
            .then(d =>
                showImage(element.name, d)
            )
            .catch(error => console.error("Error:", error))
    });
}


// function showCard(data) {
//     let img = document.createElement("img")
//     let title = document.createElement("h1")
//     let div = document.createElement("div")

//     img.src = data.sprites.front_default;
//     title.innerHTML = data.name;

//     div.classList.add("pokemon-card")
//     div.appendChild(img)
//     div.appendChild(title)


//     pokemonSection.appendChild(div)
// } //same en soit que showImage mais avec + de data

function openDetails(data){
    const types = data.types.map(t => t.type.name).join(",")
    const stats = data.stats

    .map(s => `<li>${s.stat.name} : ${s.base_stat}</li>`)
    .join("");


    dialogue.innerHTML = `
        <button type="button" id="fermer">Fermer la boîte de dialogue</button>
        <div class="dialog-content">
            <img src="${data.sprites.front_default}" alt="${data.name}">
            <h2>${data.name}</h2>
            <p><strong>Taille :</strong> ${data.height / 10} m</p>
            <p><strong>Poids :</strong> ${data.weight / 10} kg</p>
            <p><strong>Type(s) :</strong> ${types}</p>
            <ul class="stats-list">${stats}</ul>
        </div>
    `;
    

    dialogue.showModal();

}
