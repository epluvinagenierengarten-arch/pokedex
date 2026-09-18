const searchInput = document.querySelector('#site-search');
const pokemonSection = document.querySelector("#sectionPokemons");
const dialogue = document.querySelector("#dialogue");

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

// Ferme le dialogue au clic sur le bouton (délégation car le bouton est recréé)
dialogue.addEventListener("click", (e) => {
    if (e.target.id === "fermer") {
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

async function showImages(api){
    pokemonSection.innerHTML = ""
    api.forEach(element => {
        fetch(element.url)
            .then(r => r.json())
            .then(d =>
                showCard(d)
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

function openDetails(data) {
    const types = data.types.map(t => t.type.name).join(", ");
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