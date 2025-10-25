const Matter = require("matter-js");

class Player extends Matter.Bodies.rectangle {
    health = 100;
    jump_force = 10;
    direction = 1;
    isAttacking = true;
    constructor() {
        super(0, 0, 100, 100);
    }

}

module.exports = Player;