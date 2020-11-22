const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { send } = require("process");

const port = 80;

app.use(express.static(path.join(__dirname, "")));

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

let output = "";

app.post("/api/save", (req, res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        try {
            body = JSON.parse(body);
            fs.writeFileSync("build/" + body.name, body.data + "\nindex()");
        } catch (error) {
            // 
        }
    });
});

let globalWs;

app.post("/api/run", (req, res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        var spawn = require('child_process').spawn,
            ls = spawn('node', ["build/" + body.replace(/"/g, "")]);

            ls.stdout.on('data', function (data) {
                sendWs(globalWs, {type: "output", data: data.toString() + "\n"});
            });
    
            ls.stderr.on('data', function (data) {
                sendWs(globalWs, {type: "output", data: data.toString()});
            });
    
            ls.on('exit', function (code) {
                sendWs(globalWs, {type: "output", data: "Command Ended"});
            });
    })
});

app.get("/api/output", (req, res) => {
    res.send(output);
});

app.get("/api/getCode", (req, res) => {
    res.send(fs.readFileSync("index.py"));
})

let server = app.listen(port, () => {
    console.log(`${port} is being listened to.`)
});

let WSS = require("ws").Server;

let wss = new WSS({
    server: server
});

wss.on("connection", (ws) => {
    globalWs = ws;
});

function sendWs(ws, data){
    ws.send(JSON.stringify(data));
}

