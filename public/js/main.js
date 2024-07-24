const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.emit("joinRoom", { username, room });

socket.on("roomMessages", (message) => {
  outputRoomMessages(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  socket.emit("chatMessage", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputRoomMessages(messages) {
  if (!messages || messages.length === 0) {
    return;
  }
  for (const msg of messages) {
    const time = new Date(msg.createdAt)
      .toLocaleTimeString("br-BR")
      .slice(0, 5);
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${msg.username} <span>${time}</span></p>
  <p class="text">
    ${msg.text}
  </p>`;
    document.querySelector(".chat-messages").appendChild(div);
  }
  return;
}

function outputMessage(message) {
  const time = new Date(message.createdAt)
    .toLocaleTimeString("br-BR")
    .slice(0, 5);
  console.log(time);
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${time}</span></p>
<p class="text">
  ${message.text}
</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
