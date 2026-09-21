const goToSearchButton = document.querySelector("#goToSearchButton")
const goToListButton = document.querySelector("#goToListButton")
const goToFavButton = document.querySelector("#goToFavButton")

goToSearchButton.addEventListener("click", ()=>{
    goTo("search")
})

goToListButton.addEventListener("click", ()=>{
    goTo("list")
})

goToFavButton.addEventListener("click", ()=>{
    goTo("fav")
})

function goTo(page) {
    localStorage.setItem("currentPage", page)
    document.location.href = "./pokedex/"
}