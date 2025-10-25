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
        Composite.add(engine.world, [Bodies.rectangle(body.x, body.y, 80, 99, {isStatic: true})]);
    }
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
        height: window.innerHeight
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

