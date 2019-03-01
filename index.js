/*eslint-disable no-unused-params, no-shadow-global*/
var express = require("express");
var app = require("express")(); // create new express app instance
var server = require("http").createServer(app); // create http server instance
var io = require("socket.io").listen(server); // create socket.io server listening to the http server

var fs = require("fs");

const port = 9000; // define the port the application will use here

server.listen(port, function() {
   console.log(`Listening on port ${port}`); 
});

app.get("/", function(_, res) {
    res.sendFile(__dirname + "/src/index.html");
});

io.on("connection", function(socket) {
    console.log(`New socket connection with ID ${socket.id}`);
    socket.emit("connMessage");
    socket.on("startGame", function(name) {
        var q = 0;
        console.log("Starting game...");
        var game = loadGame(name);
        console.log(game);
        // sleep(1000);
        socket.emit("loadedGame");
        socket.emit("question", game.questions[q]);
        q += 1;
    });
});

function loadGame(name) {
    return JSON.parse(fs.readFileSync(__dirname + `/games/${name}.json`));
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}