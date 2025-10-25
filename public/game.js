


var Engine = Matter.Engine,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var engine;
var world;


var boxA;
var boxB;
var ground;
var ground1;
var ground2;
var ground3;
var ground4;
var ground5;
var ground6;
var ground7;

var clouds = [];


function setup() {

    createCanvas(windowWidth, windowHeight);
    

    engine = Engine.create();
    world = engine.world;


    boxA = Bodies.rectangle(400, 200, 80, 80, { label: "box" });
    boxB = Bodies.rectangle(450, 50, 80, 80, { label: "box" });

    ground = Bodies.rectangle(100, 700, 300, 100, {
        isStatic: true,
        label: "ground"
    })

    ground1 = Bodies.rectangle(550, 700,300, 100, {
        isStatic: true,
        label: "ground"
    })

    ground2 = Bodies.rectangle(1150, 700, 500, 100, {
        isStatic: true,
        label: "ground"
    })

    ground3 = Bodies.rectangle(350, 350, 300, 20, {
        isStatic: true,
        label: "ground"
    })

    ground4 = Bodies.rectangle(950, 350, 300, 20, {
        isStatic: true,
        label: "ground"
    })

    ground5 = Bodies.rectangle(950, 350, 300, 20, {
        isStatic: true,
        label: "ground"
    })

    ground6 = Bodies.rectangle(650, 490, 100, 20, {
        isStatic: true,
        label: "ground"
    })

    ground7 = Bodies.rectangle(650, 150, 350, 20, {
        isStatic: true,
        label: "ground"
    })




    


    Composite.add(world, [boxA, boxB, ground, ground1, ground2, ground3, ground4, ground5, ground6, ground7]);

    for (let i = 0; i < 10; i++) {
        clouds.push({
            x: random(0, width), 
            y: random(50, 200), 
            speed: random(0.5, 1) 
        });
    }
}

function draw() {


    background('#82C8E5');
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