const Player = require("./game_objects/Player.js");
const Obstacle = require("./game_objects/Obstacle.js");
const express = require('express');
const Matter = require("matter-js");
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

var players = {};

// game stuff
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var engine = Engine.create();
var world = engine.world;

// var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
// const obstacles = [
//     new Obstacle(400, 610, 810, 60),
// ]

const platformData = [
    { x: 100, y: 670, w: 300, h: 60, label: "ground" },
    { x: 550, y: 670, w: 300, h: 60, label: "ground" },
    { x: 1150, y: 670, w: 500, h: 60, label: "ground" },

];


const platforms = platformData.map(data => {
    return Bodies.rectangle(data.x, data.y, data.w, data.h, { 
        isStatic: true, 
        label: data.label, 
        render: {
            visible: false
        }
    });
});


Composite.add(world, platforms);


// Matter.World.add(world, [ground]);

var runner = Runner.create();

// Matter.World.add(world, [obstacles]);
setInterval(() => {
    Matter.Engine.update(engine, 1000 / 60);

    const positions = {};
    for(const id in players) {
        const data = players[id];
        positions[id] = {x: data.position.x, y: data.position.y};
    }
    
    io.emit("posUpdate", {positions: positions, platforms: platformData});

}, 1000 / 60)

// socket io
io.on('connection', (socket) => {
    console.log('a user has connected', socket.id);
    var player = new Player();
    player.position.x = 5;
    players[socket.id] = player;
    Matter.World.add(world, [player]);
    socket.on("keyDown", (KeyCode) => {
    let moveSpeed = 5;

    // Get the player object associated with this specific socket
    const currentPlayer = players[socket.id]; 
    
    // Safety check
    if (!currentPlayer) {
        console.error("Player not found for socket:", socket.id);
        return; 
    }

    let currentYVelocity = currentPlayer.velocity ? currentPlayer.velocity.y : 0;

    switch (KeyCode){
        case "KeyA":
            Matter.Body.setVelocity(currentPlayer, { x: -moveSpeed, y: currentYVelocity });
            break;
        case "KeyD":
            Matter.Body.setVelocity(currentPlayer, { x: moveSpeed, y: currentYVelocity });

            break;
        case "Space":

            Matter.Body.applyForce(currentPlayer, currentPlayer.position, {x: 0, y: -0.5}); 
            break;
        }
    });
});

server.listen(3000, () => {
    console.log("server is running");
})