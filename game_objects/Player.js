const Matter = require("matter-js");

class Player extends Matter.Bodies.rectangle {
    health = 100;
    jump_force = 5;

    constructor(){
        super(0, 0, 100, 100)
    }

    move_player(xForce, yForce){
        Matter.Body.applyForce(this, this.position, {x: xForce, y: yForce});
    }
}

module.exports = Player;