const chatBox = document.getElementById("chat");

const url = window.location.origin.replace("http", "ws") + "?server=" + serverGuid;
const headers = {
    "Authorization": `Bearer ${localStorage.getItem('token')}`
}

console.log(url);
function startWebSocket() {
    let webSocket = new WebSocket(url, [localStorage.getItem('token')]);

    webSocket.onopen = (event) => {
        console.log("connection opened");
    }

    webSocket.onmessage = (event) => handleMessage(event);

    webSocket.onclose = (event) => {
        console.log("connection closed");
    }

    chatBox.addEventListener("keydown", (event) => {
        if (event.key === 'Enter') {
            const message = event.target.value;
            const msgObj = new Message(message, username, Math.round(new Date().getTime() / 1000));
            const packet = new Packet("msg", JSON.stringify(msgObj), 200);

            createMessage(msgObj);
            webSocket.send(JSON.stringify(packet));
            event.target.value = "";
        }
    });
}

function handleMessage(event) {
    console.log(event.data);

    const data = JSON.parse(event.data);
    const packet = new Packet(data["type"], data["message"], data["status_code"]);

    switch (packet.type) {
        case "msg":
            const messageJson = JSON.parse(packet.message);
            const message = new Message(messageJson["message"], messageJson["sender"], messageJson["timestamp"]);
            createMessage(message);
    }
}