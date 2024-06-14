import GameObject from "./GameObject";
//import ObjectType from "./ObjectType";

export default class EntityObject extends GameObject {

    _health;
    _maxHealth;
    _attackPower;

    get isMovable() { return false; }

    get health() { return this._health; }
    set health(value) { this._health = Math.max(0, Math.min(value, this.maxHealth)); }
    get maxHealth() { return this._maxHealth; }

    get attackPower() { return this._attackPower; }

    get isDead() { return this.health <= 0; }

    constructor(game, asset, objectType) {
        super(game, asset, objectType);
    }

    attack(obj) {
        if (obj.health == undefined)
            throw new Error(`Cannot attack an object without health`);
        obj.receiveDamage(this.attackPower);
    }

    receiveDamage(damage) {
        this.health -= damage;
    }
}