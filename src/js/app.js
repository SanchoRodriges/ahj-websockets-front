// TODO: write code here

class Chat {
  constructor() {
    this.myName = "";
    this.users = [];
    this.chat = [];
    this.ws();
  }

  ws() {
    const ws = new WebSocket("ws://localhost:7070");

    ws.addEventListener("open", (e) => {
      console.log("open");
    });

    ws.addEventListener("close", (e) => {
      console.log("close");
    });

    ws.addEventListener("error", (e) => {
      console.log("ws error");
    });

    ws.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);

      if (data.name === "newClient") {
        this.myId = data.id;
        this.login(ws);
        console.log("this.login");
      }

      if (data.name === "errorUsername") {
        const error = document.querySelector(".error");
        error.textContent = "Имя занято, попробуйте другое";
      }

      if (data.name === "successUsername") {
        const error = document.querySelector(".error");
        error.textContent = "";
        this.successLogin(data, ws);
      }

      if (data.name === "getUsers") {
        this.users = data.users;
        this.initUsers();
        console.log("this.login");
      }

      if (data.name === "getChat") {
        this.chat = data.chat;
        this.initChat();
        console.log("this.initChat");
      }

      if (data.name === "setUser") {
        this.users = data.users;
        this.initUsers();
        console.log("this.initUsers");
      }

      if (data.name === "addMessage") {
        this.addMessage(data.chat);
        console.log("this.addMessage");
      }

      if (data.name === "clients") {
        console.log(data);
      }
    });

    const messageForm = document.querySelector(".messages-form");

    const messageInput = messageForm.querySelector(".message-form-input");

    messageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = messageInput.value;
      if (!message) return;

      const now = Date.now();

      ws.send(
        JSON.stringify({
          name: "addMessage",
          username: this.myName,
          time: now,
          message: message,
        })
      );

      messageInput.value = "";
    });
  }

  addMessage(message) {
    const messages = document.querySelector(".messages-list");
    const className =
      message.username === this.myName ? "message right" : "message";
    const username = message.username === this.myName ? "Вы" : message.username;

    let html = `
        <div class="${className}">
          <div class="header">
            <div class="name">${username}</div>
            <div class="time">${this.showTime(message.time)}</div>
          </div>
          <div class="content">
            ${message.message}
          </div>
        </div>
      `;
    messages.insertAdjacentHTML("beforeend", html);
  }

  initChat() {
    const messages = document.querySelector(".messages-list");
    let html = "";
    this.chat.forEach((message) => {
      const className =
        message.username === this.myName ? "message right" : "message";
      const username =
        message.username === this.myName ? "Вы" : message.username;

      html += `
        <div class="${className}">
          <div class="header">
            <div class="name">${username}</div>
            <div class="time">${this.showTime(message.time)}</div>
          </div>
          <div class="content">
          ${message.message}
          </div>
        </div>
      `;
    });
    messages.insertAdjacentHTML("beforeend", html);
  }

  initUsers() {
    const usersWrapper = document.querySelector(".users");
    let html = "";
    this.users.forEach((user) => {
      const username = user.username === this.myName ? "Вы" : user.username;

      html += `
        <div class='user'>${username}</div>
      `;
    });
    usersWrapper.innerHTML = html;
  }

  login(ws) {
    const welcome = document.querySelector(".welcome");

    const form = welcome.querySelector(".name-form");
    const username = welcome.querySelector(".name-form-input");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = username.value;

      ws.send(
        JSON.stringify({
          name: "checkName",
          id: this.myId,
          username: name,
        })
      );
    });
  }

  successLogin(user, ws) {
    const welcome = document.querySelector(".welcome");
    const error = welcome.querySelector(".error");

    this.myName = user.username;
    this.myId = user.id;

    ws.send(
      JSON.stringify({
        name: "getChat",
      })
    );

    ws.send(
      JSON.stringify({
        name: "getUsers",
      })
    );

    error.textContent = "";
    welcome.classList.remove("active");
  }

  showTime(timestamp) {
    let time = new Date(timestamp);
    let year = time.getFullYear();
    let month =
      time.getMonth() < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1;
    let date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    let hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    let minutes =
      time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    return date + "." + month + "." + year + " " + hours + ":" + minutes;
  }
}

const chat = new Chat();
