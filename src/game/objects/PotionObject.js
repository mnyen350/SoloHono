import Game from "../Game";
import GameObject from "./GameObject";
import ObjectType from "./ObjectType";
import PotionType from "./PotionType";

export default class PotionObject extends GameObject {
    _potionType;

    get isMovable() { return true; }
    get potionType() { return this._potionType; }

    static getRandomPotionType() {
        const random = Game.Instance.random;
        const n = random.nextInt(0, 100);
        if (n < 40)
            return PotionType.attack;
        return PotionType.hp;
    }

    constructor(game, type) {
        if (type == undefined)
            type = PotionObject.getRandomPotionType();

        let asset;
        if (type == PotionType.attack)
            asset = game.assets.images.potionattack;
        else if (type == PotionType.hp)
            asset = game.assets.images.potionhealth;
        else
            throw new Error(`Unknown asset for potion ${type}`);

        super(game, asset, ObjectType.potion);
        this._potionType = type;
    }

    stepOn(obj) {
        if (obj.objectType != ObjectType.player) return;
        if (this.potionType == PotionType.attack) {
            const min = this.game.random.nextInt(1, 3);
            const attack = obj.attackRange;
            attack[0] += min;
            attack[1] += min + this.game.random.nextInt(1, 3);
        } else if (this.potionType == PotionType.hp) {
            obj.health += this.game.random.nextInt(1, 10);
        }

        this.game.deleteObject(this);
    }
}