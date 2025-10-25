// Module aliases
const { Engine, Render, Runner, World, Bodies, Composite, Constraint, Events } = Matter;

// Create engine
const engine = Engine.create();
const world = engine.world;

// Create renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: false, // Set to true for a classic physics-debug look
        background: '#fafafa'
    }
});


// Add a static ground
const ground = Bodies.rectangle(400, 580, 810, 60, { 
    isStatic: true,
    render: { fillStyle: '#333' } 
});

World.add(world, [ground]);




// Run the renderer and engine
Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);