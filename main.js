const socket = io("https://satellite-backend-ii42.onrender.com");
let username = "";

function register() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    fetch("https://satellite-backend-ii42.onrender.com/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: user,
                password: pass
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) console.log("Registration successful! Now login.");
            else console.log("Username already exists.");
        });
}

function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    fetch("https://satellite-backend-ii42.onrender.com/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: user,
                password: pass
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                username = user;
                document.getElementById("auth").style.display = "none";
                document.getElementById("chat").style.display = "block";
            } else {
                console.log("Login failed");
            }
        });
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value.trim();
    if (message) {
        socket.emit("message", `${username}: ${message}`);
        input.value = "";
    }
}

const converter = new showdown.Converter();

socket.on("message", (msg) => {
    const messagesDiv = document.getElementById("messages");
    const messageElement = document.createElement("div");

    // Convert Markdown to HTML before displaying
    messageElement.innerHTML = converter.makeHtml(msg);

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const active = document.activeElement;

        if (active.id === "username" || active.id === "password") {
            // Check which button is visible / in use
            const chat = document.getElementById("chat");
            if (chat.style.display === "none") {
                login(); // or register(), based on your app's flow
            }
        } else if (active.id === "messageInput") {
            sendMessage();
        }
    }
});