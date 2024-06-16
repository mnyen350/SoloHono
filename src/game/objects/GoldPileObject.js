import GameObject from "./GameObject";
import ObjectType from "./ObjectType";

export default class GoldPileObject extends GameObject {
    _goldAmount;
    get goldAmount() { return this._goldAmount; }

    get isMovable() { return true; }

    constructor(game, amount) {
        super(game, game.assets.images.goldpile, ObjectType.goldpile);
        this._goldAmount = amount;
    }

    stepOn(obj) {
        if (obj.objectType != ObjectType.player) return;
        obj.pickupGold(this.goldAmount);
        this.game.deleteObject(this);
    }
}