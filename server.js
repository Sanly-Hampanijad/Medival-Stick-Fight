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


const obstacles = [
    {x: 400, y: 610, w: 810, h: 60},
    {x: 100, y: 300, w: 100, h: 100},
]


for (i in obstacles){
    
    rect = Bodies.rectangle(obstacles[i].x, obstacles[i].y, obstacles[i].w, obstacles[i].h, { isStatic: true, restitution: 0 });
    Matter.World.add(world, [rect]);
}

var runner = Runner.create();

// Matter.World.add(world, [obstacles]);
setInterval(() => {

    Matter.Engine.update(engine, 1000 / 60);

    const positions = {};
    for(const id in players) {
        const data = players[id];
        positions[id] = {x: data.position.x, y: data.position.y};
    }
    
    io.emit("posUpdate", {positions: positions, obstacles: obstacles});

}, 1000 / 250)

// socket io
io.on('connection', (socket) => {
    console.log('a user has connected', socket.id);
    var player = new Player();
    player.position.x = 5;
    players[socket.id] = player;
    Matter.World.add(world, [player]);
    socket.on("keyDown", (KeyCode) => {
        console.log(KeyCode);
        switch (KeyCode){
            case "KeyA":
                console.log("Pressing A");
                Matter.Body.applyForce(player, player.position, {x: -0.5, y: 0})
                break;
            case "KeyD":
                Matter.Body.applyForce(player, player.position, {x: 0.5, y: 0})
                console.log("Presssing D");
                break;
            case "Space":
                Matter.Body.applyForce(player, player.position, {x: 0, y: -0.5})
                break;
        }
    })
});

server.listen(3000, () => {
    console.log("server is running");
})