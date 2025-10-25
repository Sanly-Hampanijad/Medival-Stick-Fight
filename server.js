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





var runner = Runner.create();

var obstacles = {body: Bodies.rectangle(400, 610, 810, 60, { isStatic: true })};
Matter.World.add(world, [obstacles]);
setInterval(() => {
    Matter.Engine.update(engine, 1000 / 60);

    const positions = {};
    for(const id in players) {
        const data = players[id];
        positions[id] = {x: data.position.x, y: data.position.y};
    }
    io.emit("clearCanvas");
    io.emit("renderObstables", obstacles);
    io.emit("posUpdate", positions);

}, 1000 / 60)

// socket io
io.on('connection', (socket) => {
    console.log('a user has connected', socket.id);
    var player = new Player();
    player.position.x = 5;
    players[socket.id] = player;
    Matter.World.add(world, [player]);
});

server.listen(3000, () => {
    console.log("server is running");
})