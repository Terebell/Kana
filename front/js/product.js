// ID de l'élément à ajouter ) l'URL de la page produit
function getId() {
  let productUrl = location.href;
  let url = new URL(productUrl);
  let idUrl = url.searchParams.get("id");
  return idUrl;
}

// Récupération des données (API)
fetch(`http://localhost:3000/api/products/${getId()}`)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (card) {
    displayProduct(card);
    headTitle.innerHTML = card.name;
  })
  // Affichage d'erreur dans la console
  .catch(function (error) {
    console.log(`Erreur ! ${error}`);
  });

// Éléments à travailler sur la page produit
let headTitle = document.querySelector("title");
let itemImg = document.querySelector(".item__img");
let title = document.querySelector("#title");
let price = document.querySelector("#price");
let description = document.querySelector("#description");
let colors = document.querySelector("#colors");
let quantity = document.querySelector("#quantity");

// Création d'élément à intégrer (HTML)
const productImg = document.createElement("img");

// Intégration de l'élément précédemment créé (DOM)
itemImg.appendChild(productImg);

function displayProduct(card) {
  // Intégration du tableau (DOM)
  productImg.src = card.imageUrl;
  productImg.alt = card.altTxt;
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

// ---------- Envoi au panier ---------- //

function validPanier() {
  if (
    confirm(
      `Article(s) ajouté(s) au panier : ${quantity.value}. Validez pour retourner à la sélection d\'articles.`
    )
  ) {
    location.href = "index.html";
  }
}

function bouton() {
  // Récupération des informations
  let panierStorage = localStorage.getItem("panier");
  let colors = document.querySelector("#colors");
  let quantity = document.querySelector("#quantity");

  // Condition de sélection de couleur
  if (colors.value == "") {
    alert("Veuillez séléctionner une couleur d'article.");
    return;
  }

  // Condition de sélection de quantité
  if (quantity.value < 1 || quantity.value > 100) {
    alert(
      "Veuillez sélectionner une quantité d'articles comprise entre 1 et 100."
    );
    return;
  }

  // Tableau à envoyer au panier
  let productPanier = [];

  // Condition en cas de panier rempli
  if (panierStorage) {
    productPanier = JSON.parse(panierStorage);
    let existProduct = false;

    // Récupération des différents éléments du panier
    for (let productStorage of productPanier) {
      (retrieveId = productStorage.productId),
        (retrieveQuantity = parseInt(productStorage.productQuantity)),
        (retrieveColors = productStorage.productColors);

      // Condition en cas d'ID et de couleur identiques au panier
      if (retrieveId == getId() && retrieveColors == colors.value) {
        const index = productPanier.indexOf(productStorage);
        productPanier[index].productQuantity += parseInt(quantity.value);
        existProduct = true;
      }
    }

    // Condition en cas de panier plein sans éléments similaires
    if (!existProduct) {
      productPanier.push({
        productId: getId(),
        productQuantity: parseInt(quantity.value),
        productColors: colors.value,
      });
    }

    // Condition en cas de panier vide
  } else {
    productPanier.push({
      productId: getId(),
      productQuantity: parseInt(quantity.value),
      productColors: colors.value,
    });
  }

  // Envoi au panier
  panierStorage = JSON.stringify(productPanier);
  localStorage.setItem("panier", panierStorage);
  validPanier();
}

// Ajout d'événement au clic du bouton de validation
document.querySelector("#addToCart").addEventListener("click", function () {
  bouton();
});
