const Matter = require("matter-js");
speed = 5;
class Bullet extends Matter.Bodies.rectangle{
    constructor(x, y, direction, ownerId){
        super(x, y, 50, 50);
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.ownerId = ownerId;
    }
}

module.exports = Bullet