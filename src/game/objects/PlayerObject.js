import EndGameScene from "../scenes/EndGameScene";
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
        this._maxHealth = 5;
        this._health = this._maxHealth;
        this._attackRange = [2, 5];

    }

    pickupGold(amount) {
        this._gold += amount;
        this.game.assets.sounds.money.play();
    }

    receiveDamage(damage) {
        super.receiveDamage(damage);

        if (this.isDead) {
            this.game.menuScene = new EndGameScene(this.game, true);
        }
    }

    attack(obj) {
        super.attack(obj);
        if (obj.enemyType != undefined && obj.isDead) {
            const [min, max] = obj.goldRange;
            const n = this.game.random.nextInt(min, max + 1);
            this.pickupGold(n);
        }
    }
}