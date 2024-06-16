import GameObject from "./GameObject";
import ObjectType from "./ObjectType";
import EndGameScene from "../scenes/EndGameScene";

export default class DoorObject extends GameObject {
    get isMovable() { return true; }

    constructor(game) {
        super(game, game.assets.images.door, ObjectType.door);
    }

    async stepOn(obj) {
        if (obj.objectType != ObjectType.player) return;

        if (this.game.level == 3) {
            console.log('game completed.');
            this.game.menuScene = new EndGameScene(this.game, false);
        } else {
            await this.game.loadLevel(this.game.level + 1);
        }
    }
}