const socket = io();

socket.on("posUpdate", data => {
    // remove bodies
    const bodies = Matter.Composite.allBodies(engine.world);
    bodies.forEach(body => {
        Matter.Composite.remove(engine.world, body);
    });
    
    for(const p of data.obstacles) {
        Composite.add(engine.world, [Bodies.rectangle(p.x, p.y, p.w, p.h, {isStatic: true})]);
    }

    for(const p in data.positions) {
        var body = data.positions[p];
        var current_animation;
        var current_time = Date.now();
        var animation_to_play = current_time % 700;
        if (body.dir == -1){
            current_animation = "assets/tile00" + Math.floor(animation_to_play / 100) + ".png"
        }
        else{
            current_animation = "assets/image(" + (Math.floor(animation_to_play / 100) + 1) + ").png" 
        }
        Composite.add(engine.world, [Bodies.rectangle(body.x, body.y, 100, 100, {isStatic: true, render: {
            sprite: {
                texture: current_animation,
                    // texture: body.dir < 0 ? "assets/Idle1_left.png" : "assets/Idle1_right",
                    xScale: 3,
                    yScale: 3,
                }

            }})])
    };
})

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
    }
});

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80, {isStatic: true});

// run the renderer
Render.run(render);

// add all of the bodies to the world
Composite.add(engine.world, [boxA]);

addEventListener("keydown", (event) => {
    socket.emit("keyDown", event.code)
});

