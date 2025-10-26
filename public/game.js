var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    World = Matter.World,
    Bodies = Matter.Bodies;


var engine = Engine.create();
var world = engine.world;
engine.gravity.y = 0; // Set to 1 if you want jumping

var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent'
    }
});


Render.run(render);

const socket = io();

// --- Menu Setup ---
const menu = document.getElementById('menu');
const knightButton = document.getElementById('knight-btn');
const witchButton = document.getElementById('witch-btn');


function joinGame(characterType) {
    socket.emit('playerJoin', { character: characterType });
    menu.style.display = 'none';
    render.canvas.style.display = 'block';
}

knightButton.addEventListener('click', () => joinGame('knight'));
witchButton.addEventListener('click', () => joinGame('witch'));


// --- Game Loop ---
socket.on('worldUpdate', (data) => {
    // 1. Remove all old bodies
    const bodies = Matter.Composite.allBodies(engine.world);
    bodies.forEach(body => {
        Matter.Composite.remove(engine.world, body);
    });

    // 2. Draw all platforms
    for (const p of data.platforms) {
        Matter.Composite.add(engine.world, [Bodies.rectangle(p.x, p.y, p.w, p.h, { 
            isStatic: true, 
            label: data.label, 
            render: {
                visible: false // You have these as invisible, which is fine!
            }
        })])
    }

    // 3. Draw all players (This is your existing complex animation loop)
    for(const p in data.positions) {
        var body = data.positions[p];
        var characterType = body.character;
        var current_animation;
        var current_time = Date.now();
        var animation_to_play;

        if (body.isAttacking){
            if (characterType == "witch") {
                animation_to_play = current_time % 1000; // 10 frames * 100ms = 1000
            } else {
                animation_to_play = current_time % 600; // 6 frames * 100ms = 600
            }

            if (body.dir == 1){ // Facing RIGHT
                if(characterType == "knight") {
                    current_animation = "assets/attack/tile00" + (Math.floor(animation_to_play / 100) + 1) + ".png";
                } else {
                   
                    current_animation = "assets/idle/witchAnimations/idle/witchAttack/Attackanimation" + (Math.floor(animation_to_play / 100) + 1) + ".png";
                }
            } else { // Facing LEFT
                if(characterType == "knight") {
                    current_animation = "assets/attack/image(" +  (Math.floor(animation_to_play / 100) + 1) + ").png";
                } else {
             
                    current_animation = "assets/idle/witchAnimations/idle/witchAttack/reverseWitchAttack/image(" + (Math.floor(animation_to_play / 100) + 1) + ").png";
                }
            }
            Matter.Composite.add(engine.world, [Bodies.rectangle(body.x, body.y, 100, 100, {isStatic: true, render: {
                sprite: {
                    texture: current_animation,
                    xScale: (body.dir === 1) ? 3 : -3, // Flip sprite using xScale
                    yScale: 3,
                }
            }})])
        }
        else { // NOT attacking
            if (characterType == "witch") {
                animation_to_play = current_time % 1300; // 13 frames * 100ms = 1300
            } else {
                animation_to_play = current_time % 700; // 7 frames * 100ms = 700
            }

            if (body.dir == 1){ // Facing RIGHT
                if(characterType == "knight") {
                    current_animation = "assets/idle/tile00" + Math.floor(animation_to_play / 100) + ".png";
                } else {
           
                    current_animation = "assets/idle/witchAnimations/idle/Idleanimation" + (Math.floor(animation_to_play / 100) + 1) + ".png";
                }
            } else{ // Facing LEFT
                if(characterType == "knight") {
                    current_animation = "assets/idle/image(" + (Math.floor(animation_to_play / 100) + 1) + ").png"
                    console.log(current_animation);
                } else {
                   
                    current_animation = "assets/idle/witchAnimations/idle/reverseIdleAnimation/image(" + (Math.floor(animation_to_play / 100) + 1) + ").png";
                }
            }
            Matter.Composite.add(engine.world, [Bodies.rectangle(body.x, body.y, 100, 100, {isStatic: true, render: {
                sprite: {
                    texture: current_animation,
                    xScale: (body.dir === 1) ? 3 : -3, // Flip sprite using xScale
                    yScale: 3,
                }
            }})])
        }
    };

    // 4. *** ANIMATED BULLET LOOP ***
    for (const id in data.bullets) {
        const bullet = data.bullets[id];

        // --- New animation logic ---
        const current_time = Date.now();
        const animation_to_play = current_time % 600; // 6 frames * 100ms = 600ms
        const frame_index = Math.floor(animation_to_play / 100); // Gives 0, 1, 2, 3, 4, 5
        
        // Correct path from your screenshot (tile000.png to tile005.png)
        let bullet_sprite = `assets/idle/witchAnimations/idle/witchAttack/tile00${frame_index}.png`;

        // Draw the bullet
        Matter.Composite.add(engine.world, [Bodies.rectangle(bullet.x, bullet.y, 20, 20, { // Must match server's bulletSize
            isStatic: true, 
            render: {
                sprite: {
                    texture: bullet_sprite,
                    xScale: (bullet.dir === 1) ? 1 : -1, // Flip bullet based on direction
                    yScale: 1
                }
            }
        })]);
    }
    // *** END OF BULLET CODE ***

});

socket.on("gameOver", (id) => {
    if (id == socket.id){
        window.location.href = "gameOver.html"
    }
})

// --- Input Handlers (No change) ---
window.addEventListener('keydown', (e) => {
    socket.emit('keyDown', e.code);
});

window.addEventListener('click', (e) => {
    socket.emit('mouseClick', e.button);
});



