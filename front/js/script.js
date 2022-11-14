// ID de la section à travailler
const items = document.querySelector("#items");

// Récupération des données (API)
fetch("http://localhost:3000/api/products")
  .then(function (result) {
    if (result.ok) {
      return result.json();
    }
  })
  .then(function (table) {
    for (let card of table) {
      displayProduct(card);
    }
  })
  // Affichage d'erreur dans la console
  .catch(function (error) {
    console.log("Erreur !");
  });

// Création des cartes des différents canapés
function displayProduct(card) {
  // Éléments à intégrer
  const linkProduct = document.createElement("a");
  const article = document.createElement("article");
  const productImage = document.createElement("img");
  const productName = document.createElement("h3");
  const productDescription = document.createElement("p");

  // Classes manquantes ajoutées au HTML
  productName.classList.add("productName");
  productDescription.classList.add("productDescription");

  // Intégration des éléments précédemment créés (DOM)
  items.appendChild(linkProduct);
  linkProduct.appendChild(article);
  article.appendChild(productImage);
  article.appendChild(productName);
  article.appendChild(productDescription);

  // Intégration du tableau (DOM)
  linkProduct.href = `./product.html?id=${card._id}`;
  productImage.src = card.imageUrl;
  productImage.alt = card.altTxt;
  productName.innerHTML = card.name;
  productDescription.innerHTML = card.description;
}
