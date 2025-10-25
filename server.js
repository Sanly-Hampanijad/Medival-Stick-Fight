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
    { x: 350, y: 390, w: 300, h: 60, label: "ground" },
    { x: 950, y: 400, w: 300, h: 60, label: "ground" },
    { x: 650, y: 520, w: 100, h: 60, label: "ground" },
    { x: 650, y: 250, w: 350, h: 60, label: "ground" }
];


const platforms = platformData.map(data => {
    return Bodies.rectangle(data.x, data.y, data.w, data.h, { 
        isStatic: true, 
        label: data.label 
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
    // This value now represents the player's speed
    // 5 is a good starting speed.
    let moveSpeed = 5; 

    switch (KeyCode){
        case "KeyA":
            // SETS the player's horizontal speed to -5 (left)
            // It keeps the current vertical speed (player.velocity.y)
            Matter.Body.setVelocity(player, { x: -moveSpeed, y: player.velocity.y });
            break;
        case "KeyD":
            // SETS the player's horizontal speed to 5 (right)
            Matter.Body.setVelocity(player, { x: moveSpeed, y: player.velocity.y });
            break;
        case "Space":
            // We can still use applyForce for a jump "kick"
            // You might need to make this jump force much larger (e.g., -5 or -10)
            // if you are still using 'extends' in Player.js
            Matter.Body.applyForce(player, player.position, {x: 0, y: -0.5}); 
            break;
        }
    });
});

server.listen(3000, () => {
    console.log("server is running");
})