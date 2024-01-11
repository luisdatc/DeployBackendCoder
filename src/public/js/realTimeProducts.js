const socket = io();

const form = document.getElementById("formId");
const mostrarProductos = document.getElementById("showProducts");
const productTable = document
  .getElementById("productTable")
  .querySelector("tbody");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const dataForm = new FormData(e.target);
  const prod = Object.fromEntries(dataForm);

  socket.emit("nuevoProductoRealTime", prod);
  e.target.reset();
});

mostrarProductos.addEventListener("click", () => {
  socket.emit("solicitarProductos");
});

socket.on("productosMostrados", (productos) => {
  productTable.innerHTML = "";

  productos.forEach((producto) => {
    const newRow = productTable.insertRow();
    newRow.innerHTML = `
      <td>${producto._id}</td>
      <td>${producto.title}</td>
      <td>${producto.description}</td>
      <td>${producto.price}</td>
      <td>${producto.stock}</td>
      <td>${producto.code}</td>
    `;
  });
});
