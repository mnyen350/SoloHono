import GameObject from "./GameObject";

export default class EnemyObject extends GameObject {
    static get TYPE_TEST() { return 1; }

    static tryCreate(game, type) {
        const typeMap = {
            [EnemyObject.TYPE_TEST]: game.assets.images.enemy
        };

        const found = typeMap[type];
        if (!found)
            return null;

        const obj = new EnemyObject(game, found);
        return obj;
    }

    constructor(game, asset) {
        super(game, asset);
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