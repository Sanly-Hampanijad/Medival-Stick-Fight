const Player = require("./game_objects/Player.js");
const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

var players = {}

// game stuff
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var engine = Engine.create();

var render = Render.create({
    element: document.body,
    engine: engine
});

var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

Composite.add(engine.world, [boxA, boxB, ground]);

var runner = Runner.create();

setInterval(() => {
    Matter.Engine.update(engine, 1000 / 60);

    

}, 1000 / 60)

// socket io
io.on('connection', (socket) => {
    console.log('a user has connected ', socket.id);
    players[socket.id] = new Player();
});

server.listen(3000, () => {
    console.log("server is running");
})