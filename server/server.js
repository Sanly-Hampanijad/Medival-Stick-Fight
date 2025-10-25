const express = require('express');
const { Socket } = require('node:dgram');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);
app.get('/', (req, res) => {
    res.sendFile(__dirname + "../index.html");
});

io.on('connection', (socket) => {
    console.log('a user has connected');
});

server.listen(3000, () => {
    console.log("server is running");
})