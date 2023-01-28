// Récupération du panier
let panierStorage = localStorage.getItem("panier");

// Condition en cas de panier vide
if (!panierStorage) {
  alert("Votre panier est vide ! Veuillez sélectionner un article.");
  location.href = "index.html";
}

// Requête vers l'API pour récupérer les images associé aux produits :
fetch("http://localhost:3000/api/products/")
  .then(function (result) {
    return result.json();
  })
  .then(function (value) {
    let saveProducts = JSON.parse(panierStorage); // Contenu du panier
    let productInfo = []; // Contiendra l'url des images des produits stockés dans le localStorage.

    // Parcour le nombre de produit dans le panier
    for (let i = 0; i < saveProducts.length; i++) {
      productInfo[i] = getProductInfo(saveProducts[i].productId, value);
      displayProduct(saveProducts[i], productInfo[i]);
    }

    total(saveProducts, value);
  });

// 1: id du produit localStoage
// 2: Value de l'API,
function getProductInfo(id, value) {
  let infos = {
    imageUrl: "",
    name: "",
    price: "",
  };

  for (let i = 0; i < value.length; i++) {
    if (value[i]._id == id) {
      infos.imageUrl = value[i].imageUrl;
      infos.name = value[i].name;
      infos.price = value[i].price;
    }
  }

  return infos;
}

// Retourne uniquement le prix selon l'ID
function getPrice(id, value) {
  for (let i = 0; i < value.length; i++) {
    if (value[i]._id == id) {
      return value[i].price;
    }
  }
}

function displayProduct(productStorage, infoProduct) {
  let retrieveId = productStorage.productId;
  let retrieveQuantity = productStorage.productQuantity;
  let retrieveColors = productStorage.productColors;

  // Création des éléments à intégrer (DOM)
  let section = document.querySelector("#cart__items");
  let article = document.createElement("article");
  let divImg = document.createElement("div");
  let img = document.createElement("img");
  let divCart = document.createElement("div");
  let divDescription = document.createElement("div");
  let title = document.createElement("h2");
  let colors = document.createElement("p");
  let price = document.createElement("p");
  let divSettings = document.createElement("div");
  let divSettingsQuantity = document.createElement("div");
  let quantity = document.createElement("p");
  let input = document.createElement("input");
  let divSettingsDelete = document.createElement("div");
  let deleteItem = document.createElement("p");

  // Intégration des éléments précédemment créés (DOM)
  section.appendChild(article);
  article.appendChild(divImg);
  divImg.appendChild(img);
  article.appendChild(divCart);
  divCart.appendChild(divDescription);
  divDescription.appendChild(title);
  divDescription.appendChild(colors);
  divDescription.appendChild(price);
  divCart.appendChild(divSettings);
  divSettings.appendChild(divSettingsQuantity);
  divSettingsQuantity.appendChild(quantity);
  divSettingsQuantity.appendChild(input);
  divSettings.appendChild(divSettingsDelete);
  divSettingsDelete.appendChild(deleteItem);

  // Ajout des classes aux éléments précédemment créés
  article.classList.add("cart__item");
  divImg.classList.add("cart__item__img");
  divCart.classList.add("cart__item__content");
  divDescription.classList.add("cart__item__content__description");
  divSettings.classList.add("cart__item__content__settings");
  divSettingsQuantity.classList.add("cart__item__content__settings__quantity");
  input.classList.add("itemQuantity");
  divSettingsDelete.classList.add("cart__item__content__settings__delete");
  deleteItem.classList.add("deleteItem");

  // Ajout des attributs aux éléments précédemment créés
  article.setAttribute("data-id", retrieveId);
  article.setAttribute("data-color", retrieveColors);
  input.setAttribute("type", "number");
  input.setAttribute("name", "itemQuantity");
  input.setAttribute("min", "1");
  input.setAttribute("max", "100");
  input.setAttribute("value", retrieveQuantity);

  // Intégration des éléments (DOM)
  img.src = infoProduct.imageUrl;
  img.alt = productStorage.altTxt;
  title.innerHTML = infoProduct.name;
  colors.innerHTML = retrieveColors;
  price.innerHTML = `${infoProduct.price} €`;
  quantity.innerHTML = `Quantité de ${retrieveColors} :`;
  deleteItem.innerHTML = "Supprimer";

  // Changement de quantité
  input.addEventListener("change", function (e) {
    e.preventDefault();
    const newQuantity = parseInt(this.value);
    modifQuantity(newQuantity, productStorage);
  });

  // Suppression de carte
  deleteItem.addEventListener("click", function (e) {
    e.preventDefault();
    deleteCart(productStorage);
  });
}

// ----- MODIFIER QUANTITÉ ----- //
function modifQuantity(newQuantity, productStorage) {
  let productPanier = JSON.parse(localStorage.getItem("panier"));

  // Récupération du panier
  for (let retrievePanier of productPanier) {
    let retrieveId = retrievePanier.productId;
    let retrieveColors = retrievePanier.productColors;

    // Condition en cas d'ID et couleur identiques au panier
    if (
      retrieveId == productStorage.productId &&
      retrieveColors == productStorage.productColors &&
      newQuantity >= 1 &&
      newQuantity <= 100
    ) {
      const index = productPanier.indexOf(retrievePanier);
      productPanier[index].productQuantity = parseInt(newQuantity);
    }
  }

  // Envoie des données
  panierStorage = JSON.stringify(productPanier);
  localStorage.setItem("panier", panierStorage);
  location.reload();
}

// ----- SUPPRIMER ÉLÉMENT ----- //
function deleteCart(productStorage) {
  let productPanier = JSON.parse(localStorage.getItem("panier"));

  for (let retrievePanier of productPanier) {
    let retrieveId = retrievePanier.productId;
    let retrieveColors = retrievePanier.productColors;

    // Condition en cas d'ID et de couleur identiques au panier
    if (
      retrieveId == productStorage.productId &&
      retrieveColors == productStorage.productColors
    ) {
      const index = productPanier.indexOf(retrievePanier);
      productPanier.splice(index, 1);
    }
  }

  if (productPanier.lenght == 0) {
    localStorage.removeItem("panier");
  } else {
    localStorage.setItem("panier", JSON.stringify(productPanier));
  }

  location.reload();
}

// ----- TOTAL DU PANIER ----- //
function total(saveProducts, value) {
  var tmp_quantity = [],
    tmp_price = [];
  var panier = {
    totalPrice: 0,
    totalQuantity: 0,
  };

  // Parcours sur le nombre d'item du panier
  for (let i = 0; i < saveProducts.length; i++) {
    tmp_price[i] =
      getPrice(saveProducts[i].productId, value) *
      saveProducts[i].productQuantity;
    panier.totalQuantity += saveProducts[i].productQuantity;
  }
  for (let i = 0; i < tmp_price.length; i++) {
    panier.totalPrice += tmp_price[i];
  }

  // Affiche le total du panier
  document.getElementById("totalQuantity").innerHTML = panier.totalQuantity;
  document.getElementById("totalPrice").innerHTML = panier.totalPrice;
}

// ========== FORMULAIRE ========== //

// Sélection des éléments (DOM)
let firstName = document.querySelector("#firstName");
let firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
let lastName = document.querySelector("#lastName");
let lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
let address = document.querySelector("#address");
let addressErrorMsg = document.querySelector("#addressErrorMsg");
let city = document.querySelector("#city");
let cityErrorMsg = document.querySelector("#cityErrorMsg");
let email = document.querySelector("#email");
let emailErrorMsg = document.querySelector("#emailErrorMsg");

// Validations des modifications
firstName.addEventListener("change", function () {
  validFirstName(this);
});
lastName.addEventListener("change", function () {
  validLastName(this);
});
address.addEventListener("change", function () {
  validAddress(this);
});
city.addEventListener("change", function () {
  validCity(this);
});
email.addEventListener("change", function () {
  validEmail(this);
});

// PRÉNOM : Vérification des caractères avec RegExp (correspondance du texte)
let validFirstName = function (firstNameFunction) {
  let RegExpForFirstName = new RegExp("^[a-zA-Zà-ÿ -]{2,15}$", "g");

  // Test prénom + affichage du message (réponse)
  if (RegExpForFirstName.test(firstNameFunction.value)) {
    firstNameErrorMsg.innerHTML = "Prénom valide.";
    firstNameErrorMsg.style.color = "lime";
    firstNameErrorMsg.classList.remove("text-danger");
    firstNameErrorMsg.classList.add("text-success");
    return true;
  } else {
    firstNameErrorMsg.innerHTML =
      "Prénom invalide, seules 2 à 15 lettres, comprises de A à Z sont acceptées.";
    firstNameErrorMsg.style.color = "#B60707";
    firstNameErrorMsg.classList.remove("text-success");
    firstNameErrorMsg.classList.add("text-danger");
    return false;
  }
};

// NOM : Vérification des caractère avec RegExp (correspondance du texte)
let validLastName = function (lastNameFunction) {
  let RegExpForLastName = new RegExp("^[a-zA-Zà-ÿ -]{2,15}$", "g");

  // Test nom + affichage du message (réponse)
  if (RegExpForLastName.test(lastNameFunction.value)) {
    lastNameErrorMsg.innerHTML = "Nom valide.";
    lastNameErrorMsg.style.color = "lime";
    lastNameErrorMsg.classList.remove("text-danger");
    lastNameErrorMsg.classList.add("text-success");
    return true;
  } else {
    lastNameErrorMsg.innerHTML =
      "Nom invalide, seules 2 à 15 lettres, comprises de A à Z sont acceptées.";
    lastNameErrorMsg.style.color = "#B60707";
    lastNameErrorMsg.classList.remove("text-success");
    lastNameErrorMsg.classList.add("text-danger");
    return false;
  }
};

// ADRESSE : Vérification des caractères avec RegExp (correspondance du texte)
let validAddress = function (addressFunction) {
  let RegExpForAddress = new RegExp("^[0-9a-zA-Zà-ÿ -]+$", "g");

  // Test adresse + affichage du message (réponse)
  if (RegExpForAddress.test(addressFunction.value)) {
    addressErrorMsg.innerHTML = "Adresse valide.";
    addressErrorMsg.style.color = "lime";
    addressErrorMsg.classList.remove("text-danger");
    addressErrorMsg.classList.add("text-success");
    return true;
  } else {
    addressErrorMsg.innerHTML =
      "Adresse invalide, les chiffres et les lettres de A à Z sont acceptées.";
    addressErrorMsg.style.color = "#B60707";
    addressErrorMsg.classList.remove("text-success");
    addressErrorMsg.classList.add("text-danger");
    return false;
  }
};

// VILLE : Vérification des caractères avec RegExp (correspondance du texte)
let validCity = function (cityFunction) {
  let RegExpForCity = new RegExp("^[a-zA-Zà-ÿ -]+$", "g");

  // Test ville + affichage du message (réponse)
  if (RegExpForCity.test(cityFunction.value)) {
    cityErrorMsg.innerHTML = "Ville valide.";
    cityErrorMsg.style.color = "lime";
    cityErrorMsg.classList.remove("text-danger");
    cityErrorMsg.classList.add("text-success");
    return true;
  } else {
    cityErrorMsg.innerHTML =
      "Ville invalide, seules les lettres de A à Z sont acceptées.";
    cityErrorMsg.style.color = "#B60707";
    cityErrorMsg.classList.remove("text-success");
    cityErrorMsg.classList.add("text-danger");
    return false;
  }
};

// EMAIL : Vérification des caractères avec RegExp (correspondance du texte)
let validEmail = function (emailFunction) {
  let RegExpForEmail = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
    "g"
  );

  //Réponse au test d'email et affichage du message
  if (RegExpForEmail.test(emailFunction.value)) {
    emailErrorMsg.innerHTML = "Adresse email valide.";
    emailErrorMsg.style.color = "lime";
    emailErrorMsg.classList.remove("text-danger");
    emailErrorMsg.classList.add("text-sucess");
    return true;
  } else {
    emailErrorMsg.innerHTML =
      "Adresse email invalide, le seul format valide est : mail.exemple@kanap.com";
    emailErrorMsg.style.color = "#B60707";
    emailErrorMsg.classList.remove("text-sucess");
    emailErrorMsg.classList.add("text-danger");
    return false;
  }
};

// Création d'événement "click"
let order = document.querySelector("#order");
order.addEventListener("click", function send(e) {
  // Récupération des éléments du formulaire (création de l'objet contact)
  let contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,
  };

  if (
    validFirstName(firstName) &&
    validLastName(lastName) &&
    validAddress(address) &&
    validCity(city) &&
    validEmail(email)
  ) {
    // Récupération des "products ID"
    let productPanier = JSON.parse(panierStorage);
    let products = [];
    productPanier.forEach(function (order) {
      products.push(order.productId);
    });

    // Récupération des éléments à envoyer
    let pageOrder = { contact, products };

    // Envoi à l'API
    e.preventDefault();

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pageOrder),
    })
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (value) {
        location.href = `./confirmation.html?orderId=${value.orderId}`;
        localStorage.removeItem("panier");
      })

      // Retour d'erreur dans la console
      .catch(function (error) {
        console.log("Erreur !", error);
      });
  } else {
    alert("Veuillez compléter le formulaire.");
  }
});
