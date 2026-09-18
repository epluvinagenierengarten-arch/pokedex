const searchInput = document.querySelector('#site-search');
const pokemonSection = document.querySelector("#sectionPokemons");

const pokeModal = document.querySelector("#pokeModal")

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