
var Engine = Matter.Engine,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var engine;
var world;


var boxA;
var boxB;
var ground;

var clouds = [];


function setup() {

    createCanvas(windowWidth, windowHeight);
    

    engine = Engine.create();
    world = engine.world;


    boxA = Bodies.rectangle(400, 200, 80, 80, { label: "box" });
    boxB = Bodies.rectangle(450, 50, 80, 80, { label: "box" });
    ground = Bodies.rectangle(width / 2, height - 30, width, 60, { 
        isStatic: true, 
        label: "ground" 
    });


    Composite.add(world, [boxA, boxB, ground]);

    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: random(0, width), 
            y: random(50, 200), 
            speed: random(0.5, 2) 
        });
    }
}

function draw() {


    background('#87CEEB');
    drawClouds();
    Engine.update(engine);
    drawPhysicsObjects();
}


function drawClouds() {
    fill(255); 
    noStroke();
    
    for (let cloud of clouds) {

        ellipse(cloud.x, cloud.y, 100, 60);
        ellipse(cloud.x + 30, cloud.y + 10, 80, 50);
        

        cloud.x += cloud.speed;
        

        if (cloud.x > width + 100) {
            cloud.x = -100;
        }
    }
}

function drawPhysicsObjects() {

    var bodies = Composite.allBodies(world);

    for (var body of bodies) {
        var pos = body.position;
        var angle = body.angle;
        push();
        

        translate(pos.x, pos.y);
        rotate(angle);
        

        rectMode(CENTER); 
        stroke(255);      
        strokeWeight(2);


        if (body.label === 'box') {
            fill('#E699A8'); 
        } else if (body.label === 'ground') {
            fill('#5C4033'); 
        }


        let w = body.bounds.max.x - body.bounds.min.x;
        let h = body.bounds.max.y - body.bounds.min.y;
        rect(0, 0, w, h);

        pop();
    }
}