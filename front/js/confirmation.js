function getId() {
  // Récupération de "orderId" dans l'URL
  let productUrl = location.href;
  let url = new URL(productUrl);
  let orderIdUrl = url.searchParams.get("orderId");
  return orderIdUrl;
}

// Affichage de "orderId" en HTML
let orderId = document.querySelector("#orderId");
orderId.innerHTML = getId();
