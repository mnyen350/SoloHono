import EntityObject from "./EntityObject";
import ObjectType from "./ObjectType";

export default class PlayerObject extends EntityObject {
    _gold;

    get gold() { return this._gold; }

    constructor(game) {
        const asset = game.assets.images.player;
        super(game, asset, ObjectType.player);

        this._gold = 0;

        // TO-DO: assign based on race? maybe not enough time to implement races..
        this._maxHealth = 10;
        this._health = this._maxHealth;
        this._attackPower = 5;

    }

    receiveDamage(damage) {
        this.game.assets.sounds.attack.play();
        super.receiveDamage(damage);
    }

    attack(obj) {
        super.attack(obj);

        if (obj.enemyType != undefined && obj.isDead) {
            this._gold += 1;
        }
    }
}