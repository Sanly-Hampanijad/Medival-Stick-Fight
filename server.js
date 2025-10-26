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
var bullets = {}; 


var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var engine = Engine.create();
var world = engine.world;


const platformData = [
    { x: 100, y: 670, w: 9999, h: 60, label: "ground" },
];

const platforms = platformData.map(data => {
    return Bodies.rectangle(data.x, data.y, data.w, data.h, { 
        isStatic: true, 
        label: data.label, 
        render: {
            visible: true
        }
    });
});

Composite.add(world, platforms);
var runner = Runner.create();

/**
 * 
 * @param {object} pos1 -
 * @param {object} pos2 
 * @param {number} [distance] 
 */
function in_range(pos1, pos2, distance){
    let touching_distance = distance || 125; 
    if (Math.sqrt((pos2.x - pos1.x)**2 + (pos2.y - pos1.y)**2) <= touching_distance) {
        return true;
    }
    return false;
}


//main game logic loop, similar to update in unity
setInterval(() => {

    Matter.Engine.update(engine, 1000 / 60);

    const player_info = {};
    for(const id in players) {
        const data = players[id];

    
        player_info[id] = {
            x: data.position.x, 
            y: data.position.y, 
            dir: data.direction, 
            isAttacking: data.isAttacking,
            character: data.character
        };
        

        if (data.isAttacking && data.character === 'knight'){
            for (const target in players){
                if (target == id){
                    continue;
                } 
                const target_data = players[target];
    
                if (in_range(data.position, target_data.position)){ 
                    console.log(target_data.lives);
                    target_data.lives -= 1;
                    if (target_data.lives <= 0){
                        io.emit("gameOver", target);
                        delete players[target];
                    }
                }
            }
        }
    }

    const bullet_info = {};
    for (const id in bullets) {
        const bullet = bullets[id];

    
        let hit = false;
        for (const playerId in players) {

            if (playerId === bullet.ownerId) {
                continue;
            }

            const target = players[playerId];

            if (in_range(bullet.position, target.position, 50)) { 
                console.log('Bullet hit player ' + playerId);
                target.lives -= 1; 
                if (target.lives <= 0) {
                    Matter.World.remove(world, target);
                    delete players[playerId];
                }
                
                Matter.World.remove(world, bullet);
                delete bullets[id];
                hit = true;
                break;
            }
        }

        if (hit) continue;


        if (bullet.position.x > 2000 || bullet.position.x < -200) {
            Matter.World.remove(world, bullet);
            delete bullets[id];
            continue;
        }

        bullet_info[id] = {
            x: bullet.position.x,
            y: bullet.position.y,
            dir: bullet.direction
        };
    }
    

    io.emit("worldUpdate", {
        positions: player_info, 
        platforms: platformData,
        bullets: bullet_info
    });

}, 1000 / 120)


io.on('connection', (socket) => {
    console.log('a user has connected', socket.id);


    socket.on('playerJoin', (data) => {
        console.log(socket.id, 'chose', data.character);
        
        var player = new Player();
        player.position.x = 5;
        player.character = data.character;
        player.lastAttackTime = 0; 
        
        players[socket.id] = player;
        Matter.World.add(world, [player]);
    });

    socket.on("keyDown", (KeyCode) => {

        const player = players[socket.id];
        if (!player) {
            return; 
        }

        let moveSpeed = 5;
        let y_velocity = Matter.Body.getVelocity(player).y;
        
        switch (KeyCode){
            case "KeyA":
                if (player.direction == 1){
                    player.direction *= -1;
                }
                Matter.Body.setVelocity(player, { x: -moveSpeed, y: y_velocity });
                break;
            case "KeyD":
                if (player.direction == -1){
                    player.direction *= -1;
                }
                Matter.Body.setVelocity(player, { x: moveSpeed, y: y_velocity });
                break;
            case "Space":

                Matter.Body.applyForce(player, player.position, {x: 0, y: -0.5}); 
                break;
        }
    });

    socket.on("mouseClick", (buttonCode) => {
        const player = players[socket.id];
        if (buttonCode == 0){
            player.isAttacking = !player.isAttacking;
        }
    
    })
    socket.on('disconnect', () => {
        delete players[socket.id];
    })
    }
);

server.listen(3000, () => {
    console.log("server is running on port 3000");
});










// // server.js (Complete and Corrected)

// const Player = require("./game_objects/Player.js");
// const Obstacle = require("./game_objects/Obstacle.js");
// const express = require('express');
// const Matter = require("matter-js");
// const { createServer } = require('node:http');
// const { Server } = require('socket.io');

// const app = express();
// const server = createServer(app);
// const io = new Server(server);

// app.use(express.static('public'));

// var players = {};
// var bullets = {};

// var Engine = Matter.Engine,
//     Render = Matter.Render,
//     Runner = Matter.Runner,
//     Bodies = Matter.Bodies,
//     Composite = Matter.Composite;

// var engine = Engine.create();
// var world = engine.world;

// const platformData = [
//     { x: 100, y: 670, w: 9999, h: 60, label: "ground" },
// ];

// const platforms = platformData.map(data => {
//     return Bodies.rectangle(data.x, data.y, data.w, data.h, { 
//         isStatic: true, 
//         label: data.label, 
//         render: {
//             visible: true
//         }
//     });
// });

// Composite.add(world, platforms);
// var runner = Runner.create();

// function in_range(pos1, pos2){
//     touching_distance = 125;
//     if (Math.sqrt((pos2.x - pos1.x)**2 + (pos2.y - pos1.y)**2) <= touching_distance) {
//         return true;
//     }
//     return false;
// }

// setInterval(() => {
//     Matter.Engine.update(engine, 1000 / 60);

//     const player_info = {};
//     for(const id in players) {
//         const data = players[id];

//         player_info[id] = {
//             x: data.position.x, 
//             y: data.position.y, 
//             dir: data.direction, 
//             isAttacking: data.isAttacking,
//             character: data.character 
//         };

//         if (data.isAttacking){
//             for (const target in players){
//                 if (target == id){
//                     continue;
//                 } 
//                 const target_data = players[target];
//                 if (in_range(data.position, target_data.position)){
//                     console.log(target_data.lives);
//                     target_data.lives -= 1;
//                     if (target_data.lives <= 0){

//                         Matter.World.remove(world, target_data); 
//                         delete players[target];
//                     }
//                 }
//             }
//         }
//     }
    
//     io.emit("worldUpdate", {positions: player_info, platforms: platformData});

// }, 1000 / 60)

// // socket io
// io.on('connection', (socket) => {
//     console.log('a user has connected', socket.id);


//     socket.on('playerJoin', (data) => {
//         console.log(socket.id, 'chose', data.character);
        
//         var player = new Player();
//         player.position.x = 5; 
        
//         player.character = data.character; 
        
//         players[socket.id] = player;
//         Matter.World.add(world, [player]);
//     });

//     socket.on("keyDown", (KeyCode) => {

//         const player = players[socket.id];
        
//         if (!player) {
//             return; 
//         }

//         let moveSpeed = 5;
//         let y_velocity = Matter.Body.getVelocity(player).y;
        
//         switch (KeyCode){
//             case "KeyA":
//                 if (player.direction == 1){
//                     player.direction *= -1;
//                 }
//                 Matter.Body.setVelocity(player, { x: -moveSpeed, y: y_velocity });
//                 break;
//             case "KeyD":
//                 if (player.direction == -1){
//                     player.direction *= -1;
//                 }
//                 Matter.Body.setVelocity(player, { x: moveSpeed, y: y_velocity });
//                 break;
//             case "Space":

//                 Matter.Body.applyForce(player, player.position, {x: 0, y: -0.5}); 
//                 break;
//         }
//     });

//     socket.on("mouseClick", (buttonCode) => {

//         const player = players[socket.id];
//         if (!player) {
//             return;
//         }

//         if (buttonCode == 0){
//             player.isAttacking = !player.isAttacking;
//         }
    
//     });

//     socket.on('disconnect', () => {
//         console.log('user disconnected', socket.id);
//         const player = players[socket.id];
        
//         if (player) {
//             Matter.World.remove(world, player);
//             delete players[socket.id];
//         }
//     });

// });

// server.listen(3000, () => {
//     console.log("server is running on port 3000"); 
// });



































// // const Player = require("./game_objects/Player.js");
// // const Obstacle = require("./game_objects/Obstacle.js");
// // const express = require('express');
// // const Matter = require("matter-js");
// // const { createServer } = require('node:http');
// // const { Server } = require('socket.io');

// // const app = express();
// // const server = createServer(app);
// // const io = new Server(server);

// // app.use(express.static('public'));

// // var players = {};

// // // game stuff
// // var Engine = Matter.Engine,
// //     Render = Matter.Render,
// //     Runner = Matter.Runner,
// //     Bodies = Matter.Bodies,
// //     Composite = Matter.Composite;

// // var engine = Engine.create();
// // var world = engine.world;

// // // var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
// // // const obstacles = [
// // //     new Obstacle(400, 610, 810, 60),
// // // ]

// // const platformData = [
// //     { x: 100, y: 670, w: 9999, h: 60, label: "ground" },
// // ];


// // const platforms = platformData.map(data => {
// //     return Bodies.rectangle(data.x, data.y, data.w, data.h, { 
// //         isStatic: true, 
// //         label: data.label, 
// //         render: {
// //             visible: true
// //         }
// //     });
// // });


// // Composite.add(world, platforms);


// // // Matter.World.add(world, [ground]);

// // var runner = Runner.create();

// // function in_range(pos1, pos2){
// //     touching_distance = 125;
// //     if (Math.sqrt((pos2.x - pos1.x)**2 + (pos2.y - pos1.y)**2) <= touching_distance) {
// //         return true;
// //     }
// //     return false;
// // }

// // // Matter.World.add(world, [obstacles]);
// // setInterval(() => {

// //     Matter.Engine.update(engine, 1000 / 60);

// //     const player_info = {};
// //     for(const id in players) {
// //         const data = players[id];
// //         player_info[id] = {x: data.position.x, y: data.position.y, dir: data.direction, isAttacking: data.isAttacking, character: data.character};
// //         if (data.isAttacking){
// //             for (const target in players){
// //                 if (target == id){
// //                     continue;
// //                 } 
// //                 const target_data = players[target];
// //                 if (in_range(data.position, target_data.position)){
                
// //                     console.log(target_data.lives);
// //                     target_data.lives -= 1;
// //                     if (target_data.lives <= 0){
                        
// //                         delete players[target];
// //                     }
// //                 }
// //             }
// //         }
// //     }
    
// //     io.emit("worldUpdate", {positions: player_info, platforms: platformData});

// // }, 1000 / 60)

// // // socket io
// // io.on('connection', (socket) => {
// //     console.log('a user has connected', socket.id);
// //     //var player = new Player();
// //     //player.position.x = 5;
// //     //players[socket.id] = player;
// //     //Matter.World.add(world, [player]);

// //     socket.on('playerJoin', (data) => {
// //         console.log(socket.id, 'chose', data.character);
        
// //         var player = new Player();
// //         player.position.x = 5; 

// //         player.character = data.character; 
        
// //         players[socket.id] = player;
// //         Matter.World.add(world, [player]);
// //     });

// //     socket.on("keyDown", (KeyCode) => {
// //         let moveSpeed = 5;

// //     // Get the player object associated with this specific socket 

// //         y_velocity = Matter.Body.getVelocity(player).y;
// //         switch (KeyCode){
// //             case "KeyA":
// //                 if (player.direction == 1){
// //                     player.direction *= -1;
// //                 }
// //                 Matter.Body.setVelocity(player, { x: -moveSpeed, y: y_velocity });
// //                 break;
// //             case "KeyD":
// //                 if (player.direction == -1){
// //                     player.direction *= -1;
// //                 }
// //                 Matter.Body.setVelocity(player, { x: moveSpeed, y: y_velocity });
// //                 break;
// //             case "Space":
// //                 Matter.Body.applyForce(player, player.position, {x: 0, y: -0.5}); 
// //                 break;
// //         }
// //     });
// //     socket.on("mouseClick", (buttonCode) => {
// //         if (buttonCode == 0){
// //             player.isAttacking = !player.isAttacking;
// //         }
    
// //     })
// //     }
// // );

// // server.listen(3000, () => {
// //     console.log("server is running");
// // })