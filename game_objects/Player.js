const Matter = require("matter-js");

class Player extends Matter.Bodies.rectangle {
    health = 100;
    jump_force = 100;
    direction = 1;
    constructor() {
        super(0, 0, 100, 100);
    }

}

module.exports = Player;