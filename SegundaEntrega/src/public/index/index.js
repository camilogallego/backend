const socket = io();
const formBtn = document.getElementById("btn");
const form = document.getElementById("addProduct");

const newProduct = (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const prod = {
    title: data.get("title"),
    description: data.get("description"),
    price: data.get("price"),
    category: data.get("category"),
    code: data.get("code"),
    stock: data.get("stock"),
  };
  socket.emit("addProd", prod);
  form.reset();
};

const delProd = async (id,code,name) => {
  socket.emit("delProduct", id,code,name);
};

socket.on("products", (products) => {
  const productsContainer = document.getElementById("containerProducts");
  if (products.length !== 0) {
     let html = `
    <div class="container">
    <h2 style="text-align: center">Lista de Productos</h2>
        <table>
        <thead>
        <tr>
          <th scope="col">Codigo</th>
          <th scope="col">Producto</th>
          <th scope="col">Descripcion</th>
          <th scope="col">Categoria</th>
          <th scope="col">Precio</th>
          <th scope="col">Stock</th>
          <th></th>
        </tr>
      </thead>
      <tbody >
      ${products
        .map(
          (p) => `
          <tr>
            <th scope="row">${p.code}</th>
            <td>${p.title}</td>
            <td>${p.description}</td>
            <td>${p.category}</td>
            <td>${p.price}</td>
            <td>${p.stock}</td>
            <td>
            <button id=${p._id} name="${p.title}" value="${p.code}" class='deletebtn'>Eliminar</button>
            </td>
          </tr>
          `
        )
        .join(" ")}
      </tbody>
    </table>
    </div>`;
    productsContainer.innerHTML = html;
  }else return productsContainer.innerHTML = `<h2>Sin Productos</h2>`;;
});

document.addEventListener("click", (e) => {
  if (e.target.textContent === "Eliminar") {
    delProd(e.target.id,e.target.value,e.target.name);
  }
});
formBtn.addEventListener("click", newProduct);

socket.on("addedProduct", (data) => {
  if (!data) return;
  Swal.fire({
    title: `producto ${data} añadido correctamente`,
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    icon: "success",
  });
});

socket.on("removedProduct", (data) => {
  if (!data) return;
  Swal.fire({
    title: `producto ${data.name} elimidado correctamente codigo:${data.code} `,
    toast: false,
    showConfirmButton: false,
    timer: 2000,
    icon: "success",
    iconColor: "#d33",
  });
});