const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  console.log(message);
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

function outputMessage(messages) {
  if (!messages) {
    return;
  }

  if (Array.isArray(messages)) {
    for (const msg of messages) {
      const div = document.createElement("div");
      div.classList.add("message");
      div.innerHTML = `<p class="meta">${msg.username} <span>${msg.createdAt}</span></p>
  <p class="text">
    ${msg.text}
  </p>`;
      document.querySelector(".chat-messages").appendChild(div);
    }
    return;
  }
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${messages.username} <span>${messages.createdAt}</span></p>
      <p class="text">
        ${messages.text}
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
