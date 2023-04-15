const socket = io();

let user;
const chatbox = document.getElementById("chatbox");

Swal.fire({
  title: "BIENVENIDO, por favor Identificate",
  input: "text",
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  socket.emit("authenticated", user);
});

chatbox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatbox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatbox.value });
      chatbox.value = "";
    }
  }
});

socket.on("messages", (data) => {
  const messagesContainer = document.getElementById("messages")
  if (data) {
    let html = `${data
      .map((m) => `<p><strong>${m.user}</strong> : ${m.message}<br/></p>`)
      .join(" ")}`;
    messagesContainer.innerHTML = html;
  } else return messagesContainer.innerHTML = `<h2>Sin mensajes</h2>`;
});

socket.on("newUserConnected", (data) => {
  if (!user) return;
  Swal.fire({
    title: `el ${data} ha iniciado sesion`,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    icon: "success",
  });
});
