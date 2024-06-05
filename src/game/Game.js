import AssetManager from "./AssetManager";
import GameGraphics from "./GameGraphics";
import MainGameScene from "./MainGameScene";

export default class Game {
    _graphics;
    _assets;
    _mainScene;
    _menuScene;
    _needDraw;

    get graphics() { return this._graphics; }
    get assets() { return this._assets; }
    get activeScene() { return (this._menuScene) ? (this._menuScene) : (this._mainScene); }

    constructor(width, height) {
        this._graphics = new GameGraphics(width, height);
        this._assets = new AssetManager();
        this._mainScene = new MainGameScene(this.graphics, this.assets);
        this._needDraw = true;
    }

    async start() {
        try {
            await this.graphics.load();
            await this.assets.load(this._graphics);
            await this._mainScene.loadLevel(1);
            this.addEvents();
        } catch (ex) {
            console.log('Failed to start game');
            console.error(ex);
        }
    }

    addEvents() {
        let handleKeyDownEvent = (e) => {
            if (this.activeScene.handleKeyDownEvent(e)) {
                this._needDraw = true;
            }
        };

        let requestAnimationFrame = (timeStamp) => {
            if (this._needDraw) {
                this.draw();
                this._needDraw = false;
            }

            // continue
            window.requestAnimationFrame(requestAnimationFrame);
        }

        window.addEventListener("keydown", handleKeyDownEvent);
        window.requestAnimationFrame(requestAnimationFrame);
    }

    async draw() {
        const start = new Date().getTime();
        this.activeScene.draw();
        //console.log('drawing time: ', new Date().getTime() - start);
    }
}