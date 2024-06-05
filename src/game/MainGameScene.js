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
        if (key == 'ArrowLeft') { // left
            this._playerLocation[0]--;
            return true;
        } else if (key == 'ArrowRight') { // right
            this._playerLocation[0]++;
            return true;
        } else if (key == 'ArrowDown') { // down 
            this._playerLocation[1]++;
            return true;
        } else if (key == 'ArrowUp') { // up
            this._playerLocation[1]--;
            return true;
        }
        return false;
    }

    drawAssetAt(asset, x, y) {
        this.graphics.drawImage(asset, x * GameGraphics.TileSize, y * GameGraphics.TileSize, asset.width, asset.height);
    }

    draw() {
        const tileCharacterMap = {
            '|': this.assets.wall,
            '-': this.assets.wall,
            '.': this.assets.floor,
            '#': this.assets.path,
            '+': this.assets.path,
            ' ': this.assets.blackspace
        };

        const start = new Date().getTime();

        for (let y = 0; y < this._levelDesign.length; y++) {
            let line = this._levelDesign[y];
            for (let x = 0; x < line.length; x++) {
                let ch = line[x];
                let asset = tileCharacterMap[ch];

                if (!asset) // this should never happen
                    asset = this.assets.floor;

                this.drawAssetAt(asset, x, y);
            }
        }

        const [px, py] = this._playerLocation;
        this.drawAssetAt(this.assets.player, px, py);

        console.log('drawing time: ', new Date().getTime() - start);
    }
}