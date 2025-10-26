var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    World = Matter.World,
    Bodies = Matter.Bodies;


var engine = Engine.create();
var world = engine.world;
engine.gravity.y = 0;





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


let localPlatforms = {};

socket.on('worldUpdate', (data) => {
    // remove bodies
    const bodies = Matter.Composite.allBodies(engine.world);
    bodies.forEach(body => {
        Matter.Composite.remove(engine.world, body);
    });

    for (const p of data.platforms) {
        Matter.Composite.add(engine.world, [Bodies.rectangle(p.x, p.y, p.w, p.h, { 
        isStatic: true, 
        label: data.label, 
        render: {
            visible: false
        }})])
    }


    for(const p in data.positions) {
        var body = data.positions[p];
        console.log(body.isAttacking);
        var current_animation;
        var current_time = Date.now();
        var animation_to_play = current_time % 700;
        
        if (body.isAttacking){
            var animation_to_play = current_time % 600;
            if (body.dir == 1){
                current_animation = "assets/attack/tile00" + (Math.floor(animation_to_play / 100) + 1) + ".png";
            }
            else {
                current_animation = "assets/attack/image(" +  (Math.floor(animation_to_play / 100) + 1) + ").png";
            }
            Matter.Composite.add(engine.world, [Bodies.rectangle(body.x, body.y, 100, 100, {isStatic: true, render: {
                sprite: {
                    texture: current_animation,
                    xScale: 3,
                    yScale: 3,
                }

            }})])
        }
        else{
            if (body.dir == 1){
                current_animation = "assets/idle/tile00" + Math.floor(animation_to_play / 100) + ".png"
            }
            else{
                current_animation = "assets/idle/image(" + (Math.floor(animation_to_play / 100) + 1) + ").png" 
            }
            Matter.Composite.add(engine.world, [Bodies.rectangle(body.x, body.y, 100, 100, {isStatic: true, render: {
                sprite: {
                    texture: current_animation,
                    xScale: 3,
                    yScale: 3,
                }

                }})])
        }
        
    };


});

socket.on("gameOver", (id) => {
    if (id == socket.id){
        window.location.href = "gameOver.html"
    }
})

window.addEventListener('keydown', (e) => {
    socket.emit('keyDown', e.code);
});

window.addEventListener('click', (e) => {
    socket.emit('mouseClick', e.button);
});



