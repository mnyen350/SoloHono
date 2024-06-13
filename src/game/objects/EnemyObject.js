import GameObject from "./GameObject";
import EnemyType from "./EnemyType";
import ObjectType from "./ObjectType";

export default class EnemyObject extends GameObject {

    _enemyType;

    get isMovable() { return false; }
    get enemyType() { return this._enemyType; }

    constructor(game, enemyType) {

        const typeMap = {
            [EnemyType.test]: game.assets.images.enemy
        };

        const asset = typeMap[enemyType];
        if (!asset)
            throw new Error(`Invalid enemyType ${enemyType}`);

        super(game, asset, ObjectType.enemy);
        this._enemyType = enemyType;
    }

    nextTurn() {
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