import GameObject from "./GameObject";
import ObjectType from "./ObjectType";

export default class DoorObject extends GameObject {
    get isMovable() { return true; }

    constructor(game) {
        super(game, game.assets.images.door, ObjectType.door);
    }
}