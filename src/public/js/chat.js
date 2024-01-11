const socket = io();

const botonChat = document.getElementById("botonChat");
const parrafosMensajes = document.getElementById("parrafosMensajes");
const valInput = document.getElementById("chatBox");
let email;

Swal.fire({
  title: "Identificacion de usuario",
  text: "Por favor ingrese su email",
  input: "text",
  inputValidator: (valor) => {
    return !valor && "Ingrese su nombre de usuario valido";
  },
  allowOutsideClick: false,
}).then((resultado) => {
  email = resultado.value;
  console.log(email);
  socket.emit("display-inicial");
});

botonChat.addEventListener("click", () => {
  if (valInput.value.trim().length > 0) {
    socket.emit("add-message", { email: email, mensaje: valInput.value });
    valInput.value = "";
    socket.on();
  }
});

socket.on("show-messages", (arrayMensajes) => {
  parrafosMensajes.innerHTML = "";
  // Invertimos el orden del array
  const reversedMensajes = arrayMensajes.reverse();

  reversedMensajes.forEach((mensaje) => {
    parrafosMensajes.innerHTML += `
        <div class="card mt-3">
            <div class="card-header">
                <span class="badge badge-primary text-dark">${mensaje.postTime}</span> <i class="fas fa-user-circle"></i> ${mensaje.email}
            </div>
            <div class="card-body">
                <p class="card-text">${mensaje.message}</p>
            </div>
        </div>`;
  });
});
