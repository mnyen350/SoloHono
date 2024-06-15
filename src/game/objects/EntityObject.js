import Damage from "../Damage";
import GameObject from "./GameObject";
//import ObjectType from "./ObjectType";

export default class EntityObject extends GameObject {

    _health;
    _maxHealth;
    _attackRange;

    get isMovable() { return false; }

    get health() { return this._health; }
    set health(value) { this._health = Math.max(0, Math.min(value, this.maxHealth)); }
    get maxHealth() { return this._maxHealth; }

    get attackPower() {
        const [min, max] = this._attackRange;
        return this.game.random.nextInt(min, max + 1);
    }

    get isDead() { return this.health <= 0; }

    constructor(game, asset, objectType) {
        super(game, asset, objectType);
        this._attackRange = [1, 1];
    }

    attack(obj) {
        if (obj.health == undefined)
            throw new Error(`Cannot attack an object without health`);
        obj.receiveDamage(this.attackPower);
    }

    receiveDamage(damage) {
        this.health -= damage;
        this.game.damages.push(new Damage(this.game, damage, this.x, this.y));
    }
}