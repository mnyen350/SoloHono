import Scene from "./Scene";
import GameGraphics from "./GameGraphics";

export default class MainGameScene extends Scene {
    _levelDesign;
    _playerLocation;

    constructor(graphics, assets) {
        super(graphics, assets);
        this._playerLocation = [1, 1];
    }

    async loadLevel(level) {
        const resp = await fetch(`/levels/${level}.txt`);

        let content = await resp.text();
        content = content.replace(/\r/g, ''); // replace all \r

        this._levelDesign = content.split('\n');
    }

    handleKeyDownEvent(e) {
        const key = e.key;
        if (key === 'ArrowLeft') { // left
            this._playerLocation[0]--;
            return true;
        } else if (key === 'ArrowRight') { // right
            this._playerLocation[0]++;
            return true;
        } else if (key === 'ArrowDown') { // down 
            this._playerLocation[1]++;
            this.assets.sounds.test.play();
            return true;
        } else if (key === 'ArrowUp') { // up
            this._playerLocation[1]--;
            return true;
        }
        return false;
    }

    _drawAssetAt(asset, x, y) {
        this.graphics.drawImage(asset, x * GameGraphics.TileSize, y * GameGraphics.TileSize, asset.width, asset.height);
    }

    _drawFromLevelDesign(x, y) {
        const tileCharacterMap = {
            '|': this.assets.images.wall,
            '-': this.assets.images.wall,
            '.': this.assets.images.floor,
            '#': this.assets.images.path,
            '+': this.assets.images.path,
            ' ': this.assets.images.blackspace
        };

        let ch = this._levelDesign[y][x];
        let asset = tileCharacterMap[ch];

        if (!asset) // this should never happen
            asset = this.assets.images.floor;

        this._drawAssetAt(asset, x, y);
    }

    draw() {
        for (let y = 0; y < this._levelDesign.length; y++)
            for (let x = 0; x < this._levelDesign[0].length; x++)
                this._drawFromLevelDesign(x, y);

        const [px, py] = this._playerLocation;
        this._drawAssetAt(this.assets.images.player, px, py);
    }
}