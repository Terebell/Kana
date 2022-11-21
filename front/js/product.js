// ID de l'élément à ajouter à l'URL de la page produit
function getId() {
  let productUrl = location.href;
  let url = new URL(productUrl);
  let idUrl = url.searchParams.get("id");
  return idUrl;
}

// Récupération des données (API)
fetch(`http://localhost:3000/api/products/${getId()}`)
  .then(function (result) {
    if (result.ok) {
      return result.json();
    }
  })
  .then(function (card) {
    displayProduct(card);
    headTitle.innerHTML = card.name;
  })
  // Affichage d'erreur dans la console
  .catch(function (error) {
    console.log("Erreur !");
  });

// Éléments à travailler sur la page produit
let headTitle = document.querySelector("title");
let ItemImg = document.querySelector(".item__img");
let title = document.querySelector("#title");
let price = document.querySelector("#price");
let description = document.querySelector("#description");
let colors = document.querySelector("#colors");
let quantity = document.querySelector("#quantity");

// Création d'élément à intégrer (HTML)
const productImg = document.createElement("img");

// Intégration de l'élément précédemment créé (DOM)
ItemImg.appendChild(productImg);

function displayProduct(card) {
  // Intégration du tableau (DOM)
  productImg.src = card.imageUrl;
  productImg.alt = card.altText;
  title.innerHTML = card.name;
  description.innerHTML = card.description;
  price.innerHTML = card.price;

  // Ajouter les options de couleurs (boucle)
  for (let options of card.colors) {
    let select = document.createElement("option");
    colors.appendChild(select);
    select.value = options;
    select.innerHTML = options;
  }
}
