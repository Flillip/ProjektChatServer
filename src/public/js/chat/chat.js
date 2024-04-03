class Packet {
    constructor(type, message) {
        this.type = type;
        this.message = message;
    }
}

class Message {
    constructor(message, sender, timestamp) {
        this.message = message;
        this.sender = sender;
        this.timestamp = timestamp;
        this.server = serverGuid;
    }
}

const servers = document.getElementById('joined-servers');
const main = document.getElementById('main');
const joinServerForm = document.getElementById('join-server-form');

joinServerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const type = event.submitter.name;
    const serverName = document.getElementById('server').value;
    console.log(type)
    if (type === 'create')
        await createServer(serverName);
    else if (type === 'join')
        await joinServer(serverName);

    getServers();
});

async function createServer(name) {
    const token = localStorage.getItem('token');
    const res = await fetch("/api/create-server", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": name
        })
    });

    if (res.status !== ResponseCode.Created) {
        alert("Failed to create server!");
        return;
    }

    alert("Server created!");
}

async function joinServer(name) {
    const token = localStorage.getItem('token');
    const res = await fetch("/api/join-server", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "serverGuid": name
        })
    });

    if (res.status !== ResponseCode.Success) {
        alert("Failed to join server!");
        return;
    }

    alert("Server joined!");
}

async function leaveServer() {
    const windowLocation = window.location;
    const windowPath = windowLocation.pathname.split("/");
    const lastWindowPath = windowPath[windowPath.length - 1];

    if (lastWindowPath === 'chat') {
        alert("cannot leave global chat!");
        return;
    }

    const token = localStorage.getItem('token');
    const res = await fetch("/api/leave-server", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "serverGuid": lastWindowPath
        })
    });

    if (res.status !== ResponseCode.Success) {
        alert("Failed to leave server!");
        return;
    }

    window.location.href = "/chat";
}

async function getUsername() {
    const token = localStorage.getItem('token');
    const res = await fetch("/api/get-username", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (res.status !== ResponseCode.Success) {
        alert("Failed to leave server!");
        return;
    }

    return await res.text();
}

function createMessage(message) {
    const div = document.createElement("div");
    div.className = "message";
    
    const p = document.createElement("p");
    p.innerText = `[${formatDate(message.timestamp)}]<${message.sender}> ${message.message}`;
    p.className = "message-text";
    
    div.appendChild(p);
    
    return div;
}

function createMessage(message) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message";
    
    const p = document.createElement("p");
    p.innerText = `[${formatDate(message.timestamp)}]<${message.sender}> ${message.message}`;
    p.className = "message-text";
    
    msgDiv.appendChild(p);
    main.appendChild(msgDiv);
}

function formatDate(date) {
    date = new Date(date * 1000);
    const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

    return `${hours}:${minutes}`;
}

function addServer(name, guid) {
    const anchor = document.createElement("a");
    const button = document.createElement("button");
    anchor.href = `/chat/${guid}`;
    button.innerText = name;

    anchor.appendChild(button);
    servers.appendChild(anchor);
}

async function getServers() {
    console.log("getting new servers");

    let childType = 'a';
    let childNodes = servers.childNodes;
    for (let i = childNodes.length - 1; i >= 0; i--) {
        let child = childNodes[i];
        if (child.nodeName.toLowerCase() === childType) {
            servers.removeChild(child);
        }
    }


    const token = localStorage.getItem('token');
    const res = await fetch("/api/get-user-servers", {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const data = await res.json();
    
    for (const server of data) {
        addServer(server.name, server.guid);
    }
}


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function checkTokenValid() {
    const token = localStorage.getItem('token');
    if (token === null) {
        window.location.href = "/?err=you%20need%20to%20log%20in%20first";
    }

    const parsedToken = parseJwt(token);
    if (parsedToken.exp < Date.now() / 1000) {
        localStorage.removeItem('token');
        window.location.href = "/?err=you%20need%20to%20log%20in%20again";
    }
}

checkTokenValid();

let username = "";
const userGuid = parseJwt(localStorage.getItem('token'))["id"];
const serverGuid = window.location.pathname.replace('/chat', '').replace('/', '') || 'global';
console.log("user guid: " + userGuid);
console.log("server guid: " + serverGuid);

(async () => {
    username = await getUsername();
    getServers();
    startWebSocket();
})();

