import EntityObject from "./EntityObject";
import EnemyType from "./EnemyType";
import ObjectType from "./ObjectType";

export default class EnemyObject extends EntityObject {

    _enemyType;
    _goldRange;

    get isMovable() { return false; }
    get enemyType() { return this._enemyType; }
    get goldRange() { return this._goldRange; }

    constructor(game, enemyType) {

        const typeMap = {
            [EnemyType.crab]: {
                health: 12,
                attackRange: [1, 2],
                goldRange: [1, 3],
                asset: game.assets.images.enemyCrab
            },
            [EnemyType.crab2]: {
                health: 15,
                attackRange: [2, 4],
                goldRange: [3, 10],
                asset: game.assets.images.enemyCrab2
            }
        };

        const info = typeMap[enemyType];
        if (!info)
            throw new Error(`Invalid enemyType ${enemyType}`);

        super(game, info.asset, ObjectType.enemy);

        this._enemyType = enemyType;
        this._maxHealth = info.health;
        this._health = this._maxHealth;
        this._attackRange = info.attackRange;
        this._goldRange = info.goldRange;
    }

    nextTurn() {
        // are we near the player?
        if (this.game.isAdjacentObjects(this, this.game.player)) {

            this.attack(this.game.player);
            console.log('enemy is attacking player!');

        } else { // not near the player, so randomly move

            // find adjacent xys
            let xy = [];
            for (let y = -1; y <= 1; y++) {
                for (let x = -1; x <= 1; x++)
                    if (x != 0 && y != 0)
                        xy.push([this.x + x, this.y + y]);
            }

            // filter for only movable xy
            xy = xy.filter(([x, y]) => this.game.isMovable(x, y, true));
            if (xy.length == 0) {
                //console.log('xy len = 0');
                return;
            }

            const rIdx = this.game.random.nextInt(0, xy.length);
            const [x, y] = xy[rIdx];
            this.game.tryMoveObject(this, x, y);

            //console.log('try move enemy', [ok, x, y]);
        }
    }

    receiveDamage(damage) {
        super.receiveDamage(damage);

        if (this.isDead) {
            this.game.deleteObject(this);
        }
    }
}