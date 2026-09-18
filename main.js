<<<<<<< HEAD
const searchInput = document.querySelector('#site-search');
=======
const search = document.querySelector('#barreDeRecherche');
>>>>>>> css
const result = document.querySelector('#site-search')
const pokemonSection = document.querySelector("#sectionPokemons")

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

<<<<<<< HEAD
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
}

function showImage(name, image) {
    let img = document.createElement("img")
    let title = document.createElement("h1")
    let div = document.createElement("div")

    img.src = image;
    title.innerHTML = name;

    div.style.margin = "10px"
    div.appendChild(img)
    div.appendChild(title)

    pokemonSection.appendChild(div)
=======
chargerImage();


// ------ DARKMODE ------
const toggle = document.getElementById('theme-toggle');
const icon = toggle.querySelector('.icon');

const savedTheme = localStorage.getItem('theme')
window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

applyTheme(savedTheme);

toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    icon.textContent = theme === 'dark' ? '✹' : '⏾';
>>>>>>> css
}