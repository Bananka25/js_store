const productsList = document.querySelector("#product-list");
const productForm = document.querySelector("#product-form");
const name = document.querySelector("#name");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const image = document.querySelector("#image");
const cartList = document.querySelector("#cart-list");

const cartProductArray = [];

function addProductToArray(id) {
  fetch(`http://localhost:3000/products/${id}`)
    .then((response) => response.json())
    .then((product) => {
      cartProductArray.push({
        name: product.name,
        price: product.price,
      });
      renderCartProduct(cartProductArray);
    });
}

function renderCartProduct(array) {
  if (array.length === 0) {
    cartList.innerHTML = "here should be products";
  } else {
    cartList.innerHTML = "";
  }
  array.forEach((product) => {
    const cartItem = document.createElement("li");

    cartItem.className = "cart-product-list";

    cartItem.innerHTML = `
      <strong>${product.name}</strong> - $${product.price}
      <button class="deleteBuy">delete</button>
    `;
    const deleteBuyButton = cartItem.querySelector(".deleteBuy");
    deleteBuyButton.addEventListener("click", () => {
      const productIndex = array.indexOf(product);
      array.splice(productIndex, 1);
      renderCartProduct(cartProductArray);
    });
    cartList.appendChild(cartItem);
  })
}

function getProducts() {
  fetch("http://localhost:3000/products")
    .then((response) => response.json())
    .then((products) => {
      productsList.innerHTML = "";

      products.forEach((product) => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
        <img src="${product.image}" alt="${product.name}" width="100%"/>
        <strong>${product.name}</strong> - $${product.price}
        <p>${product.description}</p>
        <button class="delete-button" data-id="${product.id}">Delete</button>
        <button class="edit-button" data-id="${product.id}">Edit</button>
        <button class="buy-button" data-id="${product.id}">Buy</button>
        `;

        const deleteButton = listItem.querySelector(".delete-button");
        deleteButton.addEventListener("click", () => {
          deleteProduct(product.id);
        });

        const editButton = listItem.querySelector(".edit-button");
        editButton.addEventListener("click", () => {
          editProduct(product.id);
        });

        const buyButton = listItem.querySelector(".buy-button");
        buyButton.addEventListener("click", () => {
          addProductToArray(product.id);
        })

        productsList.appendChild(listItem);
      });
    });
}

function editProduct(id) {
  console.log(id);
}

function deleteProduct(id) {
  console.log(id);
}

function addProduct() {
  const productName = name.value;
  const productPrice = parseFloat(price.value);
  const productDescription = description.value;
  const productImage = image.value;

  const newProduct = {
    name: productName,
    price: productPrice,
    description: productDescription,
    image: productImage,
  };

  fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProduct),
  }).then(() => {
    getProducts();
    productForm.reset();
  });
}

function deleteProduct(id) {
  fetch(`http://localhost:3000/products/${id}`, {
    method: "DELETE",
  }).then(() => {
    getProducts();
  });
}

productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addProduct();
});
getProducts();
