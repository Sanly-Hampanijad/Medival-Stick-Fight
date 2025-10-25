// setup_world.js

// We can now access Matter.js from the global 'window'
var Engine = window.Matter.Engine,
    Bodies = window.Matter.Bodies,
    Composite = window.Matter.Composite;


let playerPositions = {}


// All your game code now lives inside this ONE exported function
export const sketch = (p) => {

    // --- All your global variables go here ---
    var engine;
    var world;
    var boxA, boxB;
    var ground, ground1, ground2, ground3, ground4, ground6, ground7;
    var clouds = [];
    let groundImg;

    // --- p5.js Preload ---
    p.preload = () => {
        // Use 'p.loadImage'
        groundImg = p.loadImage('assets/platform.png'); 
    };

    // --- p5.js Setup ---
    p.setup = () => {
        // Use 'p.createCanvas', 'p.noSmooth', etc.
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.noSmooth();

        // // engine = Engine.create();
        // world = engine.world;

        // boxA = Bodies.rectangle(600, 300, 100, 100, { label: "box" });
        // boxB = Bodies.rectangle(450, 50, 80, 80, { label: "box" });

        // (I fixed your duplicate ground4/ground5 bug)
        ground = Bodies.rectangle(100, 670, 300, 60, { isStatic: true, label: "ground" });
        ground1 = Bodies.rectangle(550, 670, 300, 60, { isStatic: true, label: "ground" });
        ground2 = Bodies.rectangle(1150, 670, 500, 60, { isStatic: true, label: "ground" });
        ground3 = Bodies.rectangle(350, 390, 300, 60, { isStatic: true, label: "ground" });
        ground4 = Bodies.rectangle(950, 400, 300, 60, { isStatic: true, label: "ground" });
        ground6 = Bodies.rectangle(650, 520, 100, 60, { isStatic: true, label: "ground" });
        ground7 = Bodies.rectangle(650, 250, 350, 60, { isStatic: true, label: "ground" });

        // Composite.add(world, [boxA, boxB, ground, ground1, ground2, ground3, ground4, ground6, ground7]);

        for (let i = 0; i < 10; i++) {
            clouds.push({
                x: p.random(0, p.width), 
                y: p.random(50, 200), 
                speed: p.random(0.5, 1) 
            });
        }

        const socket = window.io();

        // Listen for the 'posUpdate' event from the server
        socket.on("posUpdate", (data) => {
            // When we get new data, save the player positions
            if (data.positions) {
                playerPositions = data.positions;
            }
        });

        window.addEventListener("keydown", (event) => {
            socket.emit("keyDown", event.code);
        });


    };

    // --- p5.js Draw ---
    p.draw = () => {
        // THIS IS THE LINE YOU WANTED.
        // It will now work.
        p.background('#82C8E5'); 

        // Engine.update(engine);
        
        // Call your helper functions (defined below)
        drawClouds();
        drawPhysicsObjects();
    };

    // --- Helper Functions ---
    // These live inside the sketch, so they can use 'p'
    
    function drawClouds() {
        p.fill(255); 
        p.noStroke();
        
        for (let cloud of clouds) {
            p.ellipse(cloud.x, cloud.y, 100, 60);
            p.ellipse(cloud.x + 30, cloud.y + 10, 80, 50);
            
            cloud.x += cloud.speed;
            
            if (cloud.x > p.width + 100) {
                cloud.x = -100;
            }
        }
    }

    function drawPhysicsObjects() {
        // --- 1. Draw the static platforms (from the client's own objects) ---
        var staticBodies = [ground, ground1, ground2, ground3, ground4, ground6, ground7];

        for (var body of staticBodies) {
            var pos = body.position; // Get position from the local body
            
            p.push();
            p.translate(pos.x, pos.y);

            let w = body.bounds.max.x - body.bounds.min.x;
            let h = body.bounds.max.y - body.bounds.min.y;

            p.noStroke();
            let tileW = groundImg.width;
            let tileH = groundImg.height;
            let yOffset = -22;
            let startX = -w / 2;
            let startY = -h / 2;

            for (let x = 0; x < w; x += tileW) {
                for (let y = 0; y < h; y += tileH) {
                    p.image(groundImg, startX + x, startY + y + yOffset, tileW, tileH);
                }
            }
            p.pop();
        }

        // --- 2. Draw the dynamic players (from the server data) ---
        for (const id in playerPositions) {
            const pos = playerPositions[id]; // Get position from the server data

            p.push();
            p.translate(pos.x, pos.y);
            
            // Draw a simple box for the player
            p.fill('#E699A8');
            p.stroke(250);
            p.strokeWeight(2);
            p.rectMode(p.CENTER);
            // We use 100x100 because that's what your server's Player.js creates
            p.rect(0, 0, 100, 100); 
            
            p.pop();
        }
    }
};