termesRecherche = monChampSearch.value;
const search = document.querySelector('#barreDeRecherche');
const result = document.querySelector('#site-search')


class Pokemon{
    id
    Nom
    Taille
    Poids
    Type
    Visuel
    favoris
}

// apparition de l'image dans "apparition" et du nom du pokemon

function chargerImage() {
  try {
    const reponse = fetch("end point de l'API");  //en attente du lien
    const data =  reponse.json();  // 

    const img = document.getElementById("api-pokemon-image");
    const nom = document.getElementById("api-pokemon-name");
    img.src = data.imageUrl; // si ne renvoie poas de binaire, sinon faut changer xD
    // viens du mdn donc ptet pas adapter
    nom.textContent = data.nom; //same que MDN, checker si c'est ok (lol)

  } catch (erreur) {
    console.error("Erreur lors du chargement de l'image :-(", erreur);
  }
}

chargerImage();