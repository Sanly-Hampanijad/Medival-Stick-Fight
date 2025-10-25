const express = require('express');
const { Socket } = require('node:dgram');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { Path } = require('path')
const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(express.static('public'));

players = {}

io.on('connection', (socket) => {
    console.log('a user has connected ', socket.id);
    players[socket.id] = Player();
    
});

server.listen(3000, () => {
    console.log("server is running");
})