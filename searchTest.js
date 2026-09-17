const showSection = document.querySelector("#showSection")
const input = document.querySelector("input")

// https://pokeapi.co/api/v2/pokemon?limit=151    

getJSON()

input.addEventListener("input", ()=>{
    getJSON(input.value)
})

async function getJSON(inputSearch = "") {
    let api = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then((response)=>response.json())
        .then((responseJson)=>{return responseJson});
    
    let newApi = api.results.filter((item) => item.name.includes(inputSearch))
    console.log(newApi)
    showImages(newApi)
}

async function showImages(api){
    showSection.innerHTML = ""
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

    showSection.appendChild(div)
}